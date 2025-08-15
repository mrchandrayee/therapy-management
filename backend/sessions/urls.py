from django.urls import path
from . import views

app_name = 'sessions'

urlpatterns = [
    # Therapist Session Management
    path('therapist/', views.TherapistSessionListView.as_view(), name='therapist_sessions'),
    path('therapist/calendar/', views.SessionCalendarView.as_view(), name='therapist_calendar'),
    path('therapist/statistics/', views.session_statistics, name='therapist_statistics'),
    
    # Session Actions
    path('<uuid:session_id>/join/', views.join_session, name='join_session'),
    path('<uuid:session_id>/extend/', views.extend_session, name='extend_session'),
    path('<uuid:session_id>/end/', views.end_session, name='end_session'),
    path('<uuid:session_id>/notes/', views.add_session_notes, name='add_session_notes'),
    
    # Availability Management
    path('availability/', views.AvailabilityManagementView.as_view(), name='availability_management'),
    path('availability/<int:slot_id>/', views.manage_availability_slot, name='manage_availability_slot'),
    
    # Case Sheets
    path('case-sheets/', views.case_sheets, name='case_sheets'),
    
    # Legacy endpoints (to be updated)
    path('book/', views.book_session, name='book_session'),
    path('<uuid:session_id>/cancel/', views.cancel_session, name='cancel_session'),
    path('<uuid:session_id>/reschedule/', views.reschedule_session, name='reschedule_session'),
    path('calendar/', views.session_calendar, name='session_calendar'),
    path('available-slots/', views.available_slots, name='available_slots'),
]