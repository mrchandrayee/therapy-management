from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Role
from accounts.utils import RoleManager

User = get_user_model()


class Command(BaseCommand):
    help = 'Create a super admin user with all permissions'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, help='Username for the super admin')
        parser.add_argument('--email', type=str, help='Email for the super admin')
        parser.add_argument('--password', type=str, help='Password for the super admin')

    def handle(self, *args, **options):
        username = options.get('username') or 'admin'
        email = options.get('email') or 'admin@amitacare.com'
        password = options.get('password') or 'admin123'

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'User {username} already exists')
            )
            return

        # Create super admin user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name='Super',
            last_name='Admin',
            user_type='admin',
            is_staff=True,
            is_superuser=True,
            is_verified=True,
            is_approved=True
        )

        # Assign Super Admin role
        try:
            super_admin_role = Role.objects.get(name='Super Admin')
            RoleManager.assign_role_to_user(user, 'Super Admin')
            self.stdout.write(
                self.style.SUCCESS(f'Assigned Super Admin role to {username}')
            )
        except Role.DoesNotExist:
            self.stdout.write(
                self.style.WARNING('Super Admin role not found. Run setup_roles command first.')
            )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created super admin user: {username}\n'
                f'Email: {email}\n'
                f'Password: {password}\n'
                f'Please change the password after first login.'
            )
        )