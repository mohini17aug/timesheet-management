# Generated by Django 5.1.1 on 2024-10-11 13:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('timesheet', '0004_alter_timesheetentry_employee'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='timesheetentry',
            name='approved',
        ),
        migrations.AddField(
            model_name='timesheetentry',
            name='status',
            field=models.CharField(choices=[('Submitted', 'Submitted'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Submitted', max_length=10),
        ),
        migrations.AlterField(
            model_name='project',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
