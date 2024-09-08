from rest_framework import serializers
from .models import Employee, TimesheetEntry, Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description']

class EmployeeSerializer(serializers.ModelSerializer):
    # Include manager ID for employee
    manager = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), required=False)

    class Meta:
        model = Employee
        fields = ['id', 'first_name', 'last_name', 'email', 'manager']

class TimesheetEntryNestedSerializer(serializers.Serializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())  # Project ID
    date = serializers.DateField()
    hours = serializers.IntegerField()

class TimesheetEntrySerializer(serializers.Serializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    timesheet = TimesheetEntryNestedSerializer(many=True)
    approved = serializers.BooleanField(default=False)

    def create(self, validated_data):
        timesheet_data = validated_data.pop('timesheet')
        employee = validated_data.get('employee')
        approved = validated_data.get('approved')

        entries = []
        for entry in timesheet_data:
            project = entry['project'] 
            # Check if a timesheet entry for this employee and date already exists
            timesheet_entry = TimesheetEntry.objects.filter(employee=employee, project=project, date=entry['date']).first()

            if timesheet_entry:
                # If entry exists, update the hours and approval status
                timesheet_entry.hours = entry['hours']
                timesheet_entry.project=entry['project']
                timesheet_entry.approved = approved
                timesheet_entry.save()
            else:
                # Create a new timesheet entry if it does not exist
                timesheet_entry = TimesheetEntry.objects.create(
                    employee=employee,
                    project=entry['project'],
                    date=entry['date'],
                    hours=entry['hours'],
                    approved=approved
                )
            entries.append(timesheet_entry)

        return {"employee": employee, "timesheet": timesheet_data, "approved": approved}