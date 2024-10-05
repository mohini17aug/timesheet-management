from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

class Admin(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    max_hours_per_week = models.IntegerField(default=40)
    weekly_off_days = models.CharField(max_length=100)  # Example: "Saturday, Sunday"

class Project(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Employee(models.Model):

    ROLE_CHOICES = [
        ('Employee', 'Employee'),
        ('Admin', 'Admin'),
        ('Manager', 'Manager'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    
    # Self-referential foreign key for manager relationship
    manager = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='subordinates')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='Employee')  # Add role field


    def __str__(self):
        return f'{self.first_name} {self.last_name}'

class TimesheetEntry(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='timesheets')  # Foreign Key to Employee
    project = models.ForeignKey(Project, on_delete=models.CASCADE) 
    date = models.DateField()
    hours = models.IntegerField()
    approved = models.BooleanField(default=False)

    class Meta:
        unique_together = ['employee', 'date', 'project']  # Ensures one entry per date

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)

    otp_code = models.CharField(max_length=6, null=True, blank=True)
    otp_expiry = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def set_otp(self, otp_code):
        self.otp_code = otp_code
        self.otp_expiry = timezone.now() + timedelta(minutes=10)  # OTP valid for 10 minutes
        self.save()

    def clear_otp(self):
        self.otp_code = None
        self.otp_expiry = None
        self.save()