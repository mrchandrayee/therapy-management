from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Role, Permission, UserRole, RolePermission
from .utils import RoleManager


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename', 'description', 'category', 'is_active']


class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(
        source='role_permissions.permission', 
        many=True, 
        read_only=True
    )
    permission_count = serializers.SerializerMethodField()

    class Meta:
        model = Role
        fields = ['id', 'name', 'description', 'is_active', 'permissions', 'permission_count', 'created_at']

    def get_permission_count(self, obj):
        return obj.role_permissions.filter(permission__is_active=True).count()


class UserRoleSerializer(serializers.ModelSerializer):
    role_name = serializers.CharField(source='role.name', read_only=True)
    role_description = serializers.CharField(source='role.description', read_only=True)
    assigned_by_username = serializers.CharField(source='assigned_by.username', read_only=True)

    class Meta:
        model = UserRole
        fields = [
            'id', 'role_name', 'role_description', 'assigned_at', 
            'assigned_by_username', 'is_active', 'expires_at'
        ]


class UserSerializer(serializers.ModelSerializer):
    user_roles = UserRoleSerializer(source='userrole_set', many=True, read_only=True)
    permissions = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'user_type', 'phone_number', 'address', 'pincode', 'latitude', 'longitude',
            'profile_picture', 'date_of_birth', 'is_verified', 'is_approved',
            'last_activity', 'user_roles', 'permissions', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_permissions(self, obj):
        permissions = obj.get_permissions()
        return PermissionSerializer(permissions, many=True).data


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    roles = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="List of role names to assign to the user"
    )

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm', 'first_name', 'last_name',
            'user_type', 'phone_number', 'address', 'pincode', 'roles'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        roles = validated_data.pop('roles', [])
        validated_data.pop('password_confirm')
        
        user = User.objects.create_user(**validated_data)
        
        # Assign roles
        for role_name in roles:
            try:
                RoleManager.assign_role_to_user(
                    user, 
                    role_name, 
                    assigned_by=self.context.get('request').user if self.context.get('request') else None
                )
            except ValueError:
                # Role doesn't exist, skip
                continue
        
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    roles = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="List of role names to assign to the user"
    )

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'phone_number', 'address', 'pincode',
            'is_verified', 'is_approved', 'roles'
        ]

    def update(self, instance, validated_data):
        roles = validated_data.pop('roles', None)
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update roles if provided
        if roles is not None:
            # Remove existing roles
            UserRole.objects.filter(user=instance).delete()
            
            # Add new roles
            for role_name in roles:
                try:
                    RoleManager.assign_role_to_user(
                        instance, 
                        role_name,
                        assigned_by=self.context.get('request').user if self.context.get('request') else None
                    )
                except ValueError:
                    continue
        
        return instance


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')

        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    new_password_confirm = serializers.CharField()

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value


class RoleCreateSerializer(serializers.ModelSerializer):
    permissions = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="List of permission codenames to assign to the role"
    )

    class Meta:
        model = Role
        fields = ['name', 'description', 'permissions']

    def create(self, validated_data):
        permissions = validated_data.pop('permissions', [])
        role = Role.objects.create(**validated_data)
        
        # Assign permissions
        for permission_codename in permissions:
            try:
                permission = Permission.objects.get(codename=permission_codename)
                RolePermission.objects.create(
                    role=role,
                    permission=permission,
                    granted_by=self.context.get('request').user if self.context.get('request') else None
                )
            except Permission.DoesNotExist:
                continue
        
        return role


class RoleUpdateSerializer(serializers.ModelSerializer):
    permissions = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        help_text="List of permission codenames to assign to the role"
    )

    class Meta:
        model = Role
        fields = ['name', 'description', 'is_active', 'permissions']

    def update(self, instance, validated_data):
        permissions = validated_data.pop('permissions', None)
        
        # Update role fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update permissions if provided
        if permissions is not None:
            # Remove existing permissions
            RolePermission.objects.filter(role=instance).delete()
            
            # Add new permissions
            for permission_codename in permissions:
                try:
                    permission = Permission.objects.get(codename=permission_codename)
                    RolePermission.objects.create(
                        role=instance,
                        permission=permission,
                        granted_by=self.context.get('request').user if self.context.get('request') else None
                    )
                except Permission.DoesNotExist:
                    continue
        
        return instance