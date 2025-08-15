from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Authentication
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # User Management
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user_detail'),
    path('permissions/', views.user_permissions, name='user_permissions'),
    
    # Role Management
    path('roles/', views.RoleListView.as_view(), name='role_list'),
    path('roles/<int:pk>/', views.RoleDetailView.as_view(), name='role_detail'),
    path('roles/assign/', views.assign_role_to_user, name='assign_role'),
    path('roles/remove/', views.remove_role_from_user, name='remove_role'),
    
    # Permissions
    path('permissions/list/', views.PermissionListView.as_view(), name='permission_list'),
]