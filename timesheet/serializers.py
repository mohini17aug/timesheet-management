from rest_framework import serializers
from .models import Employee, TimesheetEntry, Project, CustomUser
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.utils.http import urlsafe_base64_decode

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
        fields = ['id', 'first_name', 'last_name', 'email', 'manager', 'password']
    
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

class TimesheetEntrySerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())

    class Meta:
        model = TimesheetEntry
        fields = ['id', 'employee', 'project', 'date', 'hours', 'approved']

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

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = CustomUser.objects.get(email=value)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('No user is associated with this email address')
        return value

    def send_reset_email(self, user):
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = self.context['request'].build_absolute_uri(
            reverse('password_reset_confirm', kwargs={'uidb64': uid, 'token': token})
        )
        message = f'Click the link to reset your password: {reset_link}'
        send_mail(
            'Password Reset',
            message,
            'your-email@gmail.com',  # Sender's email
            [user.email],
            fail_silently=False,
        )

    def save(self):
        email = self.validated_data['email']
        user = CustomUser.objects.get(email=email)
        self.send_reset_email(user)

class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    uidb64 = serializers.CharField()
    token = serializers.CharField()

    def validate(self, data):
        try:
            uid = urlsafe_base64_decode(data['uidb64']).decode()
            user = CustomUser.objects.get(pk=uid)
        except (CustomUser.DoesNotExist, ValueError, TypeError, OverflowError):
            raise serializers.ValidationError('Invalid user')

        if not default_token_generator.check_token(user, data['token']):
            raise serializers.ValidationError('Invalid token')
        
        return data

    def save(self):
        uid = urlsafe_base64_decode(self.validated_data['uidb64']).decode()
        user = CustomUser.objects.get(pk=uid)
        user.set_password(self.validated_data['new_password'])
        user.save()