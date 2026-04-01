import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

if not User.objects.filter(email='admin@jobboard.com').exists():
    User.objects.create_superuser(
        email='admin@jobboard.com',
        password='admin123',
        role='SUPERADMIN'
    )
    print('Superuser created!')
    print('Email: admin@jobboard.com')
    print('Password: admin123')
else:
    print('Superuser already exists')
