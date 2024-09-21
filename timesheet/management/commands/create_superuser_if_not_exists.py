from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = 'Create a superuser if it does not exist'

    def handle(self, *args, **kwargs):
        User = get_user_model()

        superuser_name = os.environ.get('SUPERUSER_NAME')
        superuser_email = os.environ.get('SUPERUSER_EMAIL')
        superuser_password = os.environ.get('SUPERUSER_PASSWORD')

        if superuser_name and superuser_email and superuser_password:
            if not User.objects.filter(username=superuser_name).exists():
                User.objects.create_superuser(
                    username=superuser_name,
                    email=superuser_email,
                    password=superuser_password
                )
                self.stdout.write(self.style.SUCCESS(f'Superuser "{superuser_name}" created successfully.'))
            else:
                self.stdout.write(self.style.WARNING(f'Superuser "{superuser_name}" already exists.'))
