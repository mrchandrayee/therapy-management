from django.core.management.base import BaseCommand
from accounts.models import Role, Permission, RolePermission


class Command(BaseCommand):
    help = 'Setup initial roles and permissions for the therapy management system'

    def handle(self, *args, **options):
        self.stdout.write('Setting up roles and permissions...')
        
        # Create permissions first
        permissions_data = [
            # User Management
            ('manage_users', 'Manage Users', 'user_management', 'Create, update, delete users'),
            ('view_users', 'View Users', 'user_management', 'View user profiles and lists'),
            ('manage_roles', 'Manage Roles', 'user_management', 'Create and assign roles'),
            
            # Therapist Management
            ('manage_therapists', 'Manage Therapists', 'therapist_management', 'Add, approve, disable therapists'),
            ('view_therapists', 'View Therapists', 'therapist_management', 'View therapist profiles'),
            ('approve_therapists', 'Approve Therapists', 'therapist_management', 'Approve therapist registrations'),
            
            # Client Management
            ('manage_clients', 'Manage Clients', 'client_management', 'Manage client accounts'),
            ('view_clients', 'View Clients', 'client_management', 'View client information'),
            ('manage_client_data', 'Manage Client Data', 'client_management', 'Handle client data and documents'),
            
            # Session Management
            ('manage_sessions', 'Manage Sessions', 'session_management', 'Create, modify, cancel sessions'),
            ('view_sessions', 'View Sessions', 'session_management', 'View session details'),
            ('conduct_sessions', 'Conduct Sessions', 'session_management', 'Join and conduct therapy sessions'),
            
            # Payment Management
            ('manage_payments', 'Manage Payments', 'payment_management', 'Handle payments and refunds'),
            ('view_payments', 'View Payments', 'payment_management', 'View payment records'),
            ('manage_coupons', 'Manage Coupons', 'payment_management', 'Create and manage discount coupons'),
            
            # Company Management
            ('manage_companies', 'Manage Companies', 'company_management', 'Manage corporate clients'),
            ('view_companies', 'View Companies', 'company_management', 'View company information'),
            
            # Reporting
            ('view_reports', 'View Reports', 'reporting', 'Access system reports'),
            ('generate_reports', 'Generate Reports', 'reporting', 'Create custom reports'),
            
            # System Administration
            ('system_admin', 'System Administration', 'system_admin', 'Full system access'),
            ('manage_settings', 'Manage Settings', 'system_admin', 'Modify system settings'),
        ]
        
        created_permissions = []
        for codename, name, category, description in permissions_data:
            permission, created = Permission.objects.get_or_create(
                codename=codename,
                defaults={
                    'name': name,
                    'category': category,
                    'description': description
                }
            )
            if created:
                created_permissions.append(permission)
                self.stdout.write(f'Created permission: {name}')
        
        # Create default roles
        roles_data = [
            ('Super Admin', 'Full system access with all permissions'),
            ('Admin', 'Administrative access to manage therapists, clients, and sessions'),
            ('Therapist Manager', 'Manage therapist accounts and approvals'),
            ('Client Manager', 'Manage client accounts and data'),
            ('Session Coordinator', 'Manage session scheduling and coordination'),
            ('Financial Manager', 'Handle payments, refunds, and financial reporting'),
            ('Company Manager', 'Manage corporate clients and agreements'),
            ('Therapist', 'Conduct sessions and manage own schedule'),
            ('Client', 'Book sessions and manage own profile'),
            ('Company Employee', 'Access company-sponsored therapy services'),
            ('Support Staff', 'Limited access for customer support'),
            ('Report Viewer', 'View-only access to reports'),
        ]
        
        created_roles = []
        for name, description in roles_data:
            role, created = Role.objects.get_or_create(
                name=name,
                defaults={'description': description}
            )
            if created:
                created_roles.append(role)
                self.stdout.write(f'Created role: {name}')
        
        # Assign permissions to roles
        role_permissions = {
            'Super Admin': [p.codename for p in Permission.objects.all()],
            'Admin': [
                'manage_users', 'view_users', 'manage_therapists', 'view_therapists',
                'approve_therapists', 'manage_clients', 'view_clients', 'manage_client_data',
                'manage_sessions', 'view_sessions', 'manage_payments', 'view_payments',
                'manage_coupons', 'manage_companies', 'view_companies', 'view_reports',
                'generate_reports'
            ],
            'Therapist Manager': [
                'manage_therapists', 'view_therapists', 'approve_therapists', 'view_users'
            ],
            'Client Manager': [
                'manage_clients', 'view_clients', 'manage_client_data', 'view_users'
            ],
            'Session Coordinator': [
                'manage_sessions', 'view_sessions', 'view_therapists', 'view_clients'
            ],
            'Financial Manager': [
                'manage_payments', 'view_payments', 'manage_coupons', 'view_reports',
                'generate_reports'
            ],
            'Company Manager': [
                'manage_companies', 'view_companies', 'manage_coupons', 'view_clients'
            ],
            'Therapist': [
                'view_clients', 'conduct_sessions', 'view_sessions'
            ],
            'Client': [],  # Clients have basic access through user type
            'Company Employee': [],  # Similar to clients but with company association
            'Support Staff': [
                'view_users', 'view_therapists', 'view_clients', 'view_sessions'
            ],
            'Report Viewer': [
                'view_reports'
            ],
        }
        
        for role_name, permission_codenames in role_permissions.items():
            try:
                role = Role.objects.get(name=role_name)
                for codename in permission_codenames:
                    try:
                        permission = Permission.objects.get(codename=codename)
                        RolePermission.objects.get_or_create(
                            role=role,
                            permission=permission
                        )
                    except Permission.DoesNotExist:
                        self.stdout.write(f'Permission {codename} not found')
                
                self.stdout.write(f'Assigned permissions to role: {role_name}')
            except Role.DoesNotExist:
                self.stdout.write(f'Role {role_name} not found')
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {len(created_permissions)} permissions and {len(created_roles)} roles'
            )
        )