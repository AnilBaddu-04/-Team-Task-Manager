from django.db import migrations
from django.contrib.auth.hashers import make_password

def create_admin(apps, schema_editor):
    User = apps.get_model('api', 'User')
    User.objects.all().delete()
    User.objects.create(
        username='admin',
        email='admin@example.com',
        password=make_password('admin_password'),
        role='Admin',
        is_superuser=True,
        is_staff=True
    )

def reverse_admin(apps, schema_editor):
    User = apps.get_model('api', 'User')
    User.objects.filter(username='admin').delete()

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_admin, reverse_admin),
    ]
