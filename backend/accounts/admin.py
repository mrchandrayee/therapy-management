from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Role, Permission, UserRole, RolePermission, UserSession


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'user_type', 'is_verified', 'is_approved', 'created_at']
    list_filter = ['user_type', 'is_verified', 'is_approved', 'is_active', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone_number']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('user_type', 'phone_number', 'address', 'pincode', 'latitude', 'longitude')
        }),
        ('Profile', {
            'fields': ('profile_picture', 'date_of_birth')
        }),
        ('Status', {
            'fields': ('is_verified', 'is_approved', 'last_activity')
        }),
        ('Data Protection', {
            'fields': ('data_retention_consent', 'data_retention_date')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('user_type', 'phone_number', 'email')
        }),
    )


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'codename', 'category', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'codename', 'description']
    ordering = ['category', 'name']


class RolePermissionInline(admin.TabularInline):
    model = RolePermission
    extra = 0


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'assigned_at', 'assigned_by', 'is_active', 'expires_at']
    list_filter = ['role', 'is_active', 'assigned_at']
    search_fields = ['user__username', 'role__name']
    ordering = ['-assigned_at']


@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ['role', 'permission', 'granted_at', 'granted_by']
    list_filter = ['role', 'permission__category', 'granted_at']
    search_fields = ['role__name', 'permission__name']
    ordering = ['-granted_at']


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'ip_address', 'created_at', 'last_activity', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['user__username', 'ip_address']
    ordering = ['-created_at']
    readonly_fields = ['session_key', 'user_agent']