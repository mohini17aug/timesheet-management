from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Employee,  TimesheetEntry, Project
from .serializers import EmployeeSerializer, TimesheetEntrySerializer, ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

class TimesheetEntryViewSet(viewsets.ModelViewSet):
    queryset = TimesheetEntry.objects.all()
    serializer_class = TimesheetEntrySerializer
    permission_classes = [IsAuthenticated]
