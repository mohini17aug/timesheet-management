from django.apps import AppConfig
from django.contrib.auth import get_user_model

class TimesheetConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'timesheet'

    def ready(self):
        User = get_user_model()
        if os.environ.get('SUPERUSER_NAME') and os.environ.get('SUPERUSER_EMAIL') and os.environ.get('SUPERUSER_PASSWORD'):
            if not User.objects.filter(username=os.environ['SUPERUSER_NAME']).exists():
                User.objects.create_superuser(
                    username=os.environ['SUPERUSER_NAME'],
                    email=os.environ['SUPERUSER_EMAIL'],
                    password=os.environ['SUPERUSER_PASSWORD']
                )
        