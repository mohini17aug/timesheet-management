from django.apps import AppConfig
from django.contrib.auth import get_user_model
import os

class TimesheetConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'timesheet'

    def ready(self):
        # Ensure the User model is ready
        User = get_user_model()

        # Only run this logic if the environment variables are set
        superuser_name = os.environ.get('SUPERUSER_NAME')
        superuser_email = os.environ.get('SUPERUSER_EMAIL')
        superuser_password = os.environ.get('SUPERUSER_PASSWORD')

        if superuser_name and superuser_email and superuser_password:
            # Check if the superuser already exists
            if not User.objects.filter(username=superuser_name).exists():
                User.objects.create_superuser(
                    username=superuser_name,
                    email=superuser_email,
                    password=superuser_password
                )
                print(f"Superuser {superuser_name} created successfully.")
            else:
                print(f"Superuser {superuser_name} already exists.")
