from django.core.management.base import BaseCommand
from api.models import User

class Command(BaseCommand):
    help = 'Deletes all users and creates a new admin user'

    def handle(self, *args, **kwargs):
        # Remove all users
        User.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Successfully deleted all users.'))

        # Create new admin user
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin_password',
            role='Admin'
        )
        self.stdout.write(self.style.SUCCESS('Successfully created new admin user: admin / admin_password'))
