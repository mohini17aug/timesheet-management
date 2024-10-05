from rest_framework import serializers
from .models import Employee, TimesheetEntry, Project, CustomUser
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.utils.http import urlsafe_base64_decode
from django.conf import settings  # Import settings to use DEFAULT_FROM_EMAIL
import random
from django.utils import timezone

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description']

class EmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)  # Password for user account
    # Include manager ID for employee
    manager = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all(), required=False)

    class Meta:
        model = Employee
        fields = ['id', 'first_name', 'last_name', 'email', 'manager', 'password', 'role']
    
    def create(self, validated_data):
        # Extract password from the validated data
        password = validated_data.pop('password')
        
        # Create the User object for login
        user = CustomUser(
            username=validated_data['email'],  # Use email as the username
            email=validated_data['email']
        )
        user.set_password(password)
        user.save()

        # Create the Employee linked to the user
        employee = Employee.objects.create(user=user, **validated_data)
        return employee

class TimesheetEntryNestedSerializer(serializers.Serializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())  # Project ID
    date = serializers.DateField()
    hours = serializers.IntegerField()

    class Meta:
       model = TimesheetEntry
       fields = ['project', 'date', 'hours']

class TimesheetEntrySerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())

    class Meta:
        model = TimesheetEntry
        fields = ['id', 'employee', 'project', 'date', 'hours', 'approved']

class EmployeeTimesheetSerializer(serializers.ModelSerializer):
    timesheet = TimesheetEntryNestedSerializer(many=True, source='timesheets')  # Gets related timesheet entries
    approved = serializers.SerializerMethodField()  # Method field to get approval status
    #employee = serializers.IntegerField(source='id')  # Add the employee ID field

    class Meta:
        model = Employee
        fields = ['id', 'first_name' ,   'last_name', 	'email'  , 'timesheet', 'approved']
    
    def get_timesheet(self, obj):
        # Use the filtered timesheets from the context
        timesheets = self.context.get('timesheets', TimesheetEntry.objects.none())
        return TimesheetEntryNestedSerializer(timesheets, many=True).data

    def get_approved(self, obj):
        # Assume timesheets are approved if all entries are approved
        return all(entry.approved for entry in obj.timesheets.all())


class TimesheetEntryCreateSerializer(serializers.Serializer):
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

class PasswordResetOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = CustomUser.objects.get(email=value)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('No user is associated with this email address.')
        return value

    def send_otp_email(self, user):
        otp_code = str(random.randint(100000, 999999))  # Generate a 6-digit OTP
        user.set_otp(otp_code)

        message = f'Your OTP for password reset is {otp_code}. It is valid for 10 minutes.'
        send_mail(
            'Password Reset OTP',
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

    def save(self):
        email = self.validated_data['email']
        user = CustomUser.objects.get(email=email)
        self.send_otp_email(user)


class PasswordResetConfirmOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = CustomUser.objects.get(email=data['email'])
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('Invalid user.')

        if user.otp_code != data['otp_code']:
            raise serializers.ValidationError('Invalid OTP.')

        if timezone.now() > user.otp_expiry:
            raise serializers.ValidationError('OTP has expired.')

        return data

    def save(self):
        email = self.validated_data['email']
        user = CustomUser.objects.get(email=email)
        user.set_password(self.validated_data['new_password'])
        user.clear_otp()
        user.save()
