from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from .models import Role, Permission, UserRole
from functools import wraps

User = get_user_model()


class RoleManager:
    """
    Utility class for managing roles dynamically without hardcoding
    """
    
    @staticmethod
    def create_role(name, description="", permissions=None, created_by=None):
        """
        Create a new role with optional permissions
        """
        role, created = Role.objects.get_or_create(
            name=name,
            defaults={'description': description}
        )
        
        if permissions and created:
            for permission_codename in permissions:
                try:
                    permission = Permission.objects.get(codename=permission_codename)
                    role.role_permissions.create(
                        permission=permission,
                        granted_by=created_by
                    )
                except Permission.DoesNotExist:
                    continue
        
        return role, created
    
    @staticmethod
    def assign_role_to_user(user, role_name, assigned_by=None, expires_at=None):
        """
        Assign a role to a user
        """
        try:
            role = Role.objects.get(name=role_name, is_active=True)
            user_role, created = UserRole.objects.get_or_create(
                user=user,
                role=role,
                defaults={
                    'assigned_by': assigned_by,
                    'expires_at': expires_at
                }
            )
            return user_role, created
        except Role.DoesNotExist:
            raise ValueError(f"Role '{role_name}' does not exist")
    
    @staticmethod
    def remove_role_from_user(user, role_name):
        """
        Remove a role from a user
        """
        try:
            role = Role.objects.get(name=role_name)
            UserRole.objects.filter(user=user, role=role).delete()
            return True
        except Role.DoesNotExist:
            return False
    
    @staticmethod
    def get_user_roles(user):
        """
        Get all active roles for a user
        """
        return user.roles.filter(is_active=True)
    
    @staticmethod
    def get_role_permissions(role_name):
        """
        Get all permissions for a role
        """
        try:
            role = Role.objects.get(name=role_name, is_active=True)
            return Permission.objects.filter(
                permission_roles__role=role,
                is_active=True
            )
        except Role.DoesNotExist:
            return Permission.objects.none()


def require_permission(permission_codename):
    """
    Decorator to check if user has specific permission
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                raise PermissionDenied("Authentication required")
            
            if not request.user.has_permission(permission_codename) and not request.user.is_superuser:
                raise PermissionDenied(f"Permission '{permission_codename}' required")
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def require_role(role_name):
    """
    Decorator to check if user has specific role
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                raise PermissionDenied("Authentication required")
            
            if not request.user.has_role(role_name) and not request.user.is_superuser:
                raise PermissionDenied(f"Role '{role_name}' required")
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


class PermissionChecker:
    """
    Utility class for checking permissions in templates and views
    """
    
    def __init__(self, user):
        self.user = user
    
    def can_manage_users(self):
        return self.user.has_permission('manage_users')
    
    def can_manage_therapists(self):
        return self.user.has_permission('manage_therapists')
    
    def can_manage_clients(self):
        return self.user.has_permission('manage_clients')
    
    def can_manage_sessions(self):
        return self.user.has_permission('manage_sessions')
    
    def can_manage_payments(self):
        return self.user.has_permission('manage_payments')
    
    def can_view_reports(self):
        return self.user.has_permission('view_reports')
    
    def can_manage_companies(self):
        return self.user.has_permission('manage_companies')
    
    def is_admin_level(self):
        """Check if user has admin-level access"""
        admin_roles = ['Super Admin', 'Admin']
        return any(self.user.has_role(role) for role in admin_roles)
    
    def is_therapist(self):
        return self.user.user_type == 'therapist' or self.user.has_role('Therapist')
    
    def is_client(self):
        return self.user.user_type == 'client' or self.user.has_role('Client')


def get_permission_checker(user):
    """
    Factory function to get permission checker for a user
    """
    return PermissionChecker(user)


def setup_default_user_role(user):
    """
    Assign default role based on user type
    """
    role_mapping = {
        'admin': 'Admin',
        'therapist': 'Therapist',
        'client': 'Client',
        'company_employee': 'Company Employee',
        'staff': 'Support Staff',
    }
    
    default_role = role_mapping.get(user.user_type)
    if default_role:
        try:
            RoleManager.assign_role_to_user(user, default_role)
        except ValueError:
            # Role doesn't exist, skip assignment
            pass