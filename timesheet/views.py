from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Employee,  TimesheetEntry, Project
from rest_framework.views import APIView
from .serializers import EmployeeSerializer, TimesheetEntrySerializer, EmployeeTimesheetSerializer,TimesheetEntryCreateSerializer, ProjectSerializer, PasswordResetOTPSerializer, PasswordResetConfirmOTPSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from datetime import datetime

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='get-id-by-name')
    def get_id_by_name(self, request):
        project_name = request.query_params.get('name')
        if not project_name:
            return Response({'error': 'Project name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            project = Project.objects.get(name=project_name)
            return Response({'id': project.id}, status=status.HTTP_200_OK)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
   

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        email = request.query_params.get('email', None)
        role = request.query_params.get('role', None)
        if email:
            try:
                employee = Employee.objects.get(email=email)
                serializer = self.get_serializer(employee)
                return Response(serializer.data)
            except Employee.DoesNotExist:
                return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)
        
        elif role:
            try:
                employees = Employee.objects.filter(role=role)
                serializer = EmployeeSerializer(employees, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Employee.DoesNotExist:
                return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)
        
        
        
        else:
            return super().list(request, *args, **kwargs)

     # Custom action to retrieve employees associated with a specific manager
    @action(detail=True, methods=['get'])
    def subordinates(self, request, pk=None):
        try:
            manager = self.get_object()  # Get the manager object (based on pk)
            employees = Employee.objects.filter(manager=manager)  # Get employees under this manager
            serializer = EmployeeSerializer(employees, many=True)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response({"error": "Manager not found"}, status=404)

class TimesheetEntryViewSet(viewsets.ModelViewSet):
    queryset = TimesheetEntry.objects.all()
    def get_serializer_class(self):
        if self.action == 'create':  # For POST (create), use TimesheetEntryCreateSerializer
            return TimesheetEntryCreateSerializer
        return TimesheetEntrySerializer  # For GET (retrieve), use TimesheetEntrySerializer

    permission_classes = [IsAuthenticated]

     # Custom action for manager to see all subordinates' timesheets
    @action(detail=True, methods=['get'])
    def subordinates_timesheets(self, request, pk=None):
        try:
            # Get the manager by ID
            manager = Employee.objects.get(pk=pk)

            # Ensure the user is a manager
            if manager.role != 'Manager':
                return Response({"error": "This user is not a manager"}, status=400)

            # Get all employees reporting to this manager
            subordinates = Employee.objects.filter(manager=manager)

            # Serialize the data including timesheets for each subordinate
            serializer = EmployeeTimesheetSerializer(subordinates, many=True)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response({"error": "Manager not found"}, status=404)
        except Exception as e:
            # Catch any other exceptions and log them
            return Response({"error": str(e)}, status=500)

     # Custom action for employees to see their own timesheets with an optional date range filter
    @action(detail=False, methods=['get'])
    def my_timesheets(self, request):
        # Get the currently logged-in employee
        employee = request.user.employee

        # Get optional start_date and end_date from query parameters
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')

        # Parse the date strings into date objects if they are present
        if start_date_str:
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
            except ValueError:
                start_date = None
                print(f"Invalid start_date format: {start_date_str}")
        else:
            start_date = None

        if end_date_str:
            try:
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
            except ValueError:
                end_date = None
                print(f"Invalid end_date format: {end_date_str}")
        else:
            end_date = None

        # Print the parsed dates
        print(f"Parsed start_date: {start_date}")
        print(f"Parsed end_date: {end_date}")

        # Filter timesheets by the employee and date range
        timesheets = TimesheetEntry.objects.filter(employee=employee)
        if start_date and end_date:
            print("Applying date range filter")
            timesheets = timesheets.filter(date__range=[start_date, end_date])
        elif start_date:
            print("Applying start_date filter")
            timesheets = timesheets.filter(date__gte=start_date)
        elif end_date:
            print("Applying end_date filter")
            timesheets = timesheets.filter(date__lte=end_date)

        # Serialize the filtered timesheets
        serializer = TimesheetEntrySerializer(timesheets, many=True)
        return Response({
            'employee': employee.id,
            'timesheet': serializer.data
        })



# class PasswordResetRequestView(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer = PasswordResetSerializer(data=request.data, context={'request': request})
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Password reset email has been sent."}, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class PasswordResetConfirmView(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer = PasswordResetConfirmSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Password has been reset."}, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetOTPSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "OTP has been sent."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmOTPSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password has been reset."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)