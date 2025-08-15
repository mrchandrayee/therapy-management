from django.urls import path
from . import views

app_name = 'clients'

urlpatterns = [
    # Client Management
    path('', views.ClientListView.as_view(), name='client_list'),
    path('<int:pk>/', views.ClientDetailView.as_view(), name='client_detail'),
    path('profile/', views.ClientProfileView.as_view(), name='client_profile'),
    path('register/', views.ClientRegistrationView.as_view(), name='client_register'),
    
    # Documents
    path('documents/', views.ClientDocumentListView.as_view(), name='document_list'),
    path('documents/upload/', views.ClientDocumentUploadView.as_view(), name='document_upload'),
    path('documents/<int:pk>/', views.ClientDocumentDetailView.as_view(), name='document_detail'),
    
    # Concerns and Goals
    path('concerns/', views.ClientConcernListView.as_view(), name='concern_list'),
    path('concerns/create/', views.ClientConcernCreateView.as_view(), name='concern_create'),
    path('concerns/<int:pk>/', views.ClientConcernDetailView.as_view(), name='concern_detail'),
    
    # Notes and Progress
    path('notes/', views.ClientNoteListView.as_view(), name='note_list'),
    path('notes/<int:pk>/', views.ClientNoteDetailView.as_view(), name='note_detail'),
    
    # Emergency Contacts
    path('emergency-contacts/', views.ClientEmergencyContactView.as_view(), name='emergency_contacts'),
    
    # Preferences
    path('preferences/', views.ClientPreferenceView.as_view(), name='preferences'),
    
    # Therapist Relationships
    path('therapists/', views.client_therapists, name='client_therapists'),
    path('therapist-relationship/<int:therapist_id>/', views.therapist_relationship_detail, name='therapist_relationship'),
]