from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator


class Role(models.Model):
    """
    Flexible role system - no hardcoded roles
    Admins can create, modify, and assign roles dynamically
    """
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Permission(models.Model):
    """
    Granular permissions for different actions
    """
    PERMISSION_CATEGORIES = [
        ('user_management', 'User Management'),
        ('therapist_management', 'Therapist Management'),
        ('client_management', 'Client Management'),
        ('session_management', 'Session Management'),
        ('payment_management', 'Payment Management'),
        ('company_management', 'Company Management'),
        ('reporting', 'Reporting'),
        ('system_admin', 'System Administration'),
    ]

    name = models.CharField(max_length=100, unique=True)
    codename = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=PERMISSION_CATEGORIES)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.category})"

    class Meta:
        ordering = ['category', 'name']


class RolePermission(models.Model):
    """
    Many-to-many relationship between roles and permissions
    """
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='role_permissions')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='permission_roles')
    granted_at = models.DateTimeField(auto_now_add=True)
    granted_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        unique_together = ['role', 'permission']


class User(AbstractUser):
    """
    Extended User model with flexible role assignment
    """
    USER_TYPES = [
        ('admin', 'Admin'),
        ('therapist', 'Therapist'),
        ('client', 'Client'),
        ('company_employee', 'Company Employee'),
        ('staff', 'Staff Member'),
    ]

    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',$',
        message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
    )

    # Basic Information
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='client')
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    address = models.TextField(blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    
    # Location for geotagging
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Profile
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    
    # Role-based access
    roles = models.ManyToManyField(Role, through='UserRole', blank=True)
    
    # Account status
    is_verified = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)  # For therapists
    last_activity = models.DateTimeField(null=True, blank=True)
    
    # DPDP Act compliance
    data_retention_consent = models.BooleanField(default=False)
    data_retention_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

    def has_role(self, role_name):
        """Check if user has a specific role"""
        return self.roles.filter(name=role_name, is_active=True).exists()

    def has_permission(self, permission_codename):
        """Check if user has a specific permission through their roles"""
        return Permission.objects.filter(
            codename=permission_codename,
            is_active=True,
            permission_roles__role__in=self.roles.filter(is_active=True)
        ).exists()

    def get_permissions(self):
        """Get all permissions for this user"""
        return Permission.objects.filter(
            is_active=True,
            permission_roles__role__in=self.roles.filter(is_active=True)
        ).distinct()

    def is_super_admin(self):
        """Check if user is a super admin"""
        return self.has_role('Super Admin') or self.is_superuser

    def can_manage_roles(self):
        """Check if user can manage roles"""
        return self.has_permission('manage_roles') or self.is_superuser


class UserRole(models.Model):
    """
    Through model for User-Role relationship with additional metadata
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    assigned_at = models.DateTimeField(auto_now_add=True)
    assigned_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='assigned_roles'
    )
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'role']

    def __str__(self):
        return f"{self.user.username} - {self.role.name}"


class UserSession(models.Model):
    """
    Track user sessions for security and analytics
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_sessions')
    session_key = models.CharField(max_length=40, unique=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username} - {self.created_at}"

    class Meta:
        ordering = ['-created_at']