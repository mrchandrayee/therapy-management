from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.db.models import Q
from .models import User, Role, Permission, UserRole
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer,
    LoginSerializer, ChangePasswordSerializer, RoleSerializer,
    RoleCreateSerializer, RoleUpdateSerializer, PermissionSerializer
)
from .utils import require_permission, RoleManager, get_permission_checker


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create token for the user
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Create or get token
        token, created = Token.objects.get_or_create(user=user)
        
        # Update last activity
        from django.utils import timezone
        user.last_activity = timezone.now()
        user.save(update_fields=['last_activity'])
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'permissions': get_permission_checker(user).__dict__,
            'message': 'Login successful'
        })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        # Delete the user's token
        request.user.auth_token.delete()
        logout(request)
        return Response({'message': 'Logout successful'})
    except:
        return Response({'message': 'Logout successful'})


class UserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # Super admins can see all users
        if user.is_super_admin():
            queryset = User.objects.all()
        # Admins can see users based on their permissions
        elif user.has_permission('view_users'):
            queryset = User.objects.all()
        # Therapists can see their clients
        elif user.user_type == 'therapist':
            # This will be implemented when we create the therapist-client relationship
            queryset = User.objects.filter(id=user.id)
        else:
            # Users can only see themselves
            queryset = User.objects.filter(id=user.id)
        
        # Apply filters
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search)
            )
        
        user_type = self.request.query_params.get('user_type')
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        
        return queryset.order_by('-created_at')


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_super_admin() or user.has_permission('manage_users'):
            return User.objects.all()
        return User.objects.filter(id=user.id)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserSerializer


class ChangePasswordView(generics.GenericAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({'message': 'Password changed successfully'})


class RoleListView(generics.ListCreateAPIView):
    queryset = Role.objects.filter(is_active=True)
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RoleCreateSerializer
        return RoleSerializer

    def get_queryset(self):
        user = self.request.user
        if not (user.is_super_admin() or user.has_permission('manage_roles')):
            # Non-admin users can only view roles
            if self.request.method != 'GET':
                return Role.objects.none()
        
        return Role.objects.filter(is_active=True).order_by('name')

    def create(self, request, *args, **kwargs):
        user = request.user
        if not (user.is_super_admin() or user.has_permission('manage_roles')):
            return Response(
                {'error': 'Permission denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().create(request, *args, **kwargs)


class RoleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Role.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return RoleUpdateSerializer
        return RoleSerializer

    def get_queryset(self):
        user = self.request.user
        if not (user.is_super_admin() or user.has_permission('manage_roles')):
            return Role.objects.none()
        return Role.objects.all()


class PermissionListView(generics.ListAPIView):
    queryset = Permission.objects.filter(is_active=True)
    serializer_class = PermissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not (user.is_super_admin() or user.has_permission('manage_roles')):
            return Permission.objects.none()
        
        queryset = Permission.objects.filter(is_active=True)
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        return queryset.order_by('category', 'name')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def assign_role_to_user(request):
    """
    Assign a role to a user
    Expected payload: {'user_id': int, 'role_name': str}
    """
    user = request.user
    if not (user.is_super_admin() or user.has_permission('manage_roles')):
        return Response(
            {'error': 'Permission denied'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    user_id = request.data.get('user_id')
    role_name = request.data.get('role_name')
    
    if not user_id or not role_name:
        return Response(
            {'error': 'user_id and role_name are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        target_user = User.objects.get(id=user_id)
        user_role, created = RoleManager.assign_role_to_user(
            target_user, role_name, assigned_by=user
        )
        
        message = 'Role assigned successfully' if created else 'User already has this role'
        return Response({
            'message': message,
            'user_role': {
                'user': target_user.username,
                'role': role_name,
                'assigned_at': user_role.assigned_at
            }
        })
    
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except ValueError as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def remove_role_from_user(request):
    """
    Remove a role from a user
    Expected payload: {'user_id': int, 'role_name': str}
    """
    user = request.user
    if not (user.is_super_admin() or user.has_permission('manage_roles')):
        return Response(
            {'error': 'Permission denied'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    user_id = request.data.get('user_id')
    role_name = request.data.get('role_name')
    
    if not user_id or not role_name:
        return Response(
            {'error': 'user_id and role_name are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        target_user = User.objects.get(id=user_id)
        success = RoleManager.remove_role_from_user(target_user, role_name)
        
        if success:
            return Response({'message': 'Role removed successfully'})
        else:
            return Response(
                {'error': 'Role not found or user does not have this role'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_permissions(request):
    """
    Get current user's permissions and roles
    """
    user = request.user
    checker = get_permission_checker(user)
    
    return Response({
        'user': UserSerializer(user).data,
        'roles': [role.name for role in user.roles.filter(is_active=True)],
        'permissions': [p.codename for p in user.get_permissions()],
        'capabilities': {
            'can_manage_users': checker.can_manage_users(),
            'can_manage_therapists': checker.can_manage_therapists(),
            'can_manage_clients': checker.can_manage_clients(),
            'can_manage_sessions': checker.can_manage_sessions(),
            'can_manage_payments': checker.can_manage_payments(),
            'can_view_reports': checker.can_view_reports(),
            'can_manage_companies': checker.can_manage_companies(),
            'is_admin_level': checker.is_admin_level(),
            'is_therapist': checker.is_therapist(),
            'is_client': checker.is_client(),
        }
    })