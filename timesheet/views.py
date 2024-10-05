from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Employee,  TimesheetEntry, Project
from rest_framework.views import APIView
from .serializers import EmployeeSerializer, TimesheetEntrySerializer, EmployeeTimesheetSerializer,TimesheetEntryCreateSerializer, ProjectSerializer, PasswordResetOTPSerializer, PasswordResetConfirmOTPSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

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