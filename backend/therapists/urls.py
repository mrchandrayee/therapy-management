from django.urls import path
from . import views

app_name = 'therapists'

urlpatterns = [
    # Dashboard and Profile
    path('dashboard/', views.TherapistDashboardView.as_view(), name='therapist_dashboard'),
    path('profile/', views.TherapistProfileView.as_view(), name='therapist_profile'),
    path('register/', views.TherapistRegistrationView.as_view(), name='therapist_register'),
    
    # Therapist Management (Admin)
    path('', views.TherapistListView.as_view(), name='therapist_list'),
    path('<int:pk>/', views.TherapistDetailView.as_view(), name='therapist_detail'),
    path('<int:pk>/approve/', views.approve_therapist, name='approve_therapist'),
    path('<int:pk>/reject/', views.reject_therapist, name='reject_therapist'),
    
    # Categories and Competencies
    path('categories/', views.TherapyCategoryListView.as_view(), name='category_list'),
    path('competencies/', views.CompetencyListView.as_view(), name='competency_list'),
    
    # Documents and Credentials
    path('documents/', views.TherapistDocumentListView.as_view(), name='document_list'),
    path('documents/upload/', views.TherapistDocumentUploadView.as_view(), name='document_upload'),
    path('documents/<int:pk>/', views.TherapistDocumentDetailView.as_view(), name='document_detail'),
    
    # Availability Management
    path('availability/', views.TherapistAvailabilityView.as_view(), name='availability'),
    path('availability/update/', views.update_availability, name='update_availability'),
    
    # Session Management
    path('sessions/', views.therapist_sessions, name='therapist_sessions'),
    path('sessions/<uuid:session_id>/join/', views.join_session, name='join_session'),
    path('sessions/<uuid:session_id>/extend/', views.extend_session, name='extend_session'),
    path('sessions/<uuid:session_id>/end/', views.end_session, name='end_session'),
    
    # Reviews
    path('<int:pk>/reviews/', views.TherapistReviewListView.as_view(), name='therapist_reviews'),
    path('reviews/create/', views.create_review, name='create_review'),
    
    # Search and Filter
    path('search/', views.therapist_search, name='therapist_search'),
    path('by-category/<int:category_id>/', views.therapists_by_category, name='therapists_by_category'),
]