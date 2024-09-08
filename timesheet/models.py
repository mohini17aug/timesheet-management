from django.db import models

class Admin(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    max_hours_per_week = models.IntegerField(default=40)
    weekly_off_days = models.CharField(max_length=100)  # Example: "Saturday, Sunday"

class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    
    # Self-referential foreign key for manager relationship
    manager = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='subordinates')

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

class TimesheetEntry(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)  # Foreign Key to Employee
    project = models.ForeignKey(Project, on_delete=models.CASCADE) 
    date = models.DateField()
    hours = models.IntegerField()
    approved = models.BooleanField(default=False)

    class Meta:
        unique_together = ['employee', 'date', 'project']  # Ensures one entry per date
