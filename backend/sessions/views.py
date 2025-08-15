from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views.generic import ListView, DetailView, CreateView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import models
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime, timedelta, time
from django.utils import timezone
import json
import uuid

from .models import (
    TherapySession, SessionParticipant, SessionTemplate, SessionFeedback,
    SessionExtension, SessionRecording, SessionReminder
)
from .calendar_models import (
    TherapistCalendar, AvailabilitySlot, SessionJoinControl, CalendarEvent
)
from therapists.models import TherapistProfile
from clients.models import ClientProfile

User = get_user_model()


class TherapistSessionListView(LoginRequiredMixin, APIView):
    """
    List therapist sessions with filtering and calendar view
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            therapist = request.user.therapist_profile
        except TherapistProfile.DoesNotExist:
            return Response({'error': 'Therapist profile not found'}, status=404)

        # Filter parameters
        date_from = request.GET.get('date_from')
        date_to = request.GET.get('date_to')
        status_filter = request.GET.get('status')
        session_type = request.GET.get('type')
        view_type = request.GET.get('view', 'list')  # list, calendar, today, week

        sessions = therapist.sessions.all()

        # Apply filters
        if date_from:
            sessions = sessions.filter(scheduled_date__gte=date_from)
        if date_to:
            sessions = sessions.filter(scheduled_date__lte=date_to)
        if status_filter:
            sessions = sessions.filter(status=status_filter)
        if session_type:
            sessions = sessions.filter(session_type=session_type)

        # Handle different view types
        if view_type == 'today':
            today = timezone.now().date()
            sessions = sessions.filter(scheduled_date=today)
        elif view_type == 'week':
            today = timezone.now().date()
            week_start = today - timedelta(days=today.weekday())
            week_end = week_start + timedelta(days=6)
            sessions = sessions.filter(scheduled_date__range=[week_start, week_end])

        sessions_data = []
        for session in sessions.order_by('-scheduled_date', '-scheduled_time'):
            # Get extension information
            extensions = session.extensions.all()
            total_extended = sum(ext.extended_by_minutes for ext in extensions)
            
            session_data = {
                'id': str(session.session_id),
                'client_id': session.client.id,
                'client_name': session.client.user.get_full_name(),
                'client_email': session.client.user.email,
                'date': session.scheduled_date.isoformat(),
                'time': session.scheduled_time.strftime('%H:%M'),
                'duration': session.duration_minutes,
                'type': session.session_type,
                'status': session.status,
                'meeting_link': session.meeting_link,
                'meeting_id': session.meeting_id,
                'can_join': session.can_join(),
                'notes': session.session_notes,
                'extensions_used': extensions.count(),
                'max_extensions': 3,
                'total_extended': total_extended,
                'session_price': 2500,  # This should come from pricing model
                'timezone': session.timezone,
                'reminders_sent': session.reminders.count(),
                'last_reminder_sent': session.reminders.order_by('-sent_at').first().sent_at if session.reminders.exists() else None,
            }

            # Add participants for group sessions
            if session.session_type in ['family', 'group']:
                participants = session.participants.all()
                session_data['participants'] = [
                    p.client.user.get_full_name() for p in participants
                ]

            sessions_data.append(session_data)

        return Response({
            'sessions': sessions_data,
            'total_count': len(sessions_data),
            'view_type': view_type
        })


class SessionCalendarView(LoginRequiredMixin, APIView):
    """
    Calendar view for therapist sessions and availability
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            therapist = request.user.therapist_profile
        except TherapistProfile.DoesNotExist:
            return Response({'error': 'Therapist profile not found'}, status=404)

        date_param = request.GET.get('date', timezone.now().date())
        if isinstance(date_param, str):
            date_param = datetime.strptime(date_param, '%Y-%m-%d').date()

        # Get sessions for the date
        sessions = therapist.sessions.filter(scheduled_date=date_param)
        
        # Get availability slots
        availability_slots = therapist.availability_slots.filter(
            date=date_param,
            status='available'
        )

        # Get blocked/holiday slots
        blocked_slots = therapist.availability_slots.filter(
            date=date_param,
            status='blocked'
        )

        calendar_data = {
            'date': date_param.isoformat(),
            'sessions': [{
                'id': str(session.session_id),
                'client_name': session.client.user.get_full_name(),
                'time': session.scheduled_time.strftime('%H:%M'),
                'duration': session.duration_minutes,
                'status': session.status,
                'meeting_link': session.meeting_link,
                'can_join': session.can_join(),
            } for session in sessions],
            'available_slots': [{
                'id': slot.id,
                'start_time': slot.start_time.strftime('%H:%M'),
                'end_time': slot.end_time.strftime('%H:%M'),
                'duration': slot.duration_minutes,
            } for slot in availability_slots],
            'blocked_slots': [{
                'id': slot.id,
                'start_time': slot.start_time.strftime('%H:%M'),
                'end_time': slot.end_time.strftime('%H:%M'),
                'notes': slot.notes,
            } for slot in blocked_slots]
        }

        return Response(calendar_data)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_session(request, session_id):
    """
    Join a therapy session with 5-minute rule implementation
    """
    try:
        therapist = request.user.therapist_profile
        session = get_object_or_404(therapist.sessions, session_id=session_id)
        
        # Check if session can be joined (5 minutes before rule)
        if not session.can_join():
            session_datetime = session.get_session_datetime()
            now = timezone.now()
            
            if now < session_datetime - timedelta(minutes=5):
                minutes_until_join = int((session_datetime - timedelta(minutes=5) - now).total_seconds() / 60)
                return Response({
                    'error': f'Session can be joined in {minutes_until_join} minutes (5 minutes before scheduled time)'
                }, status=400)
            else:
                return Response({
                    'error': 'Session join window has expired'
                }, status=400)
        
        # Update session status and create/update join control
        if session.status == 'scheduled':
            session.status = 'in_progress'
            session.actual_start_time = timezone.now()
            session.save()
        
        # Create or update join control record
        join_control, created = SessionJoinControl.objects.get_or_create(
            session=session,
            defaults={
                'therapist_can_join': True,
                'client_can_join': True,
                'meeting_room_created': True,
                'meeting_room_id': session.meeting_id or str(uuid.uuid4())
            }
        )
        
        join_control.record_join('therapist', request.user)
        
        return Response({
            'message': 'Session joined successfully',
            'meeting_link': session.meeting_link,
            'meeting_id': session.meeting_id,
            'session_id': str(session.session_id),
            'status': session.status
        })
        
    except TherapistProfile.DoesNotExist:
        return Response({'error': 'Therapist profile not found'}, status=404)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def extend_session(request, session_id):
    """
    Extend session by 10 minutes (max 3 times, 30 minutes total)
    """
    try:
        therapist = request.user.therapist_profile
        session = get_object_or_404(therapist.sessions, session_id=session_id)
        
        if session.status != 'in_progress':
            return Response({'error': 'Session is not in progress'}, status=400)
        
        # Check extension limits (max 3 extensions, 10 minutes each)
        current_extensions = session.extensions.count()
        if current_extensions >= 3:
            return Response({
                'error': 'Maximum extensions (3) already used. Total extended time: 30 minutes'
            }, status=400)
        
        # Create extension record
        extension = SessionExtension.objects.create(
            session=session,
            extended_by_minutes=10,
            requested_by=request.user,
            reason=request.data.get('reason', 'Therapist requested extension'),
            approved=True
        )
        
        # Send notification to client (this would be handled by notification service)
        # For now, we'll just return the response
        
        return Response({
            'message': 'Session extended by 10 minutes',
            'extension_id': extension.id,
            'extensions_used': current_extensions + 1,
            'total_extended_minutes': (current_extensions + 1) * 10,
            'remaining_extensions': 2 - current_extensions
        })
        
    except TherapistProfile.DoesNotExist:
        return Response({'error': 'Therapist profile not found'}, status=404)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def end_session(request, session_id):
    """
    End a therapy session
    """
    try:
        therapist = request.user.therapist_profile
        session = get_object_or_404(therapist.sessions, session_id=session_id)
        
        if session.status != 'in_progress':
            return Response({'error': 'Session is not in progress'}, status=400)
        
        # Update session status and end time
        session.status = 'completed'
        session.actual_end_time = timezone.now()
        
        # Calculate actual duration including extensions
        if session.actual_start_time:
            duration = session.actual_end_time - session.actual_start_time
            session.actual_duration_minutes = int(duration.total_seconds() / 60)
        
        session.save()
        
        # Update therapist's total sessions count
        therapist.total_sessions += 1
        therapist.save()
        
        return Response({
            'message': 'Session ended successfully',
            'session_id': str(session.session_id),
            'actual_duration': session.actual_duration_minutes,
            'status': session.status
        })
        
    except TherapistProfile.DoesNotExist:
        return Response({'error': 'Therapist profile not found'}, status=404)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_session_notes(request, session_id):
    """
    Add or update session notes
    """
    try:
        therapist = request.user.therapist_profile
        session = get_object_or_404(therapist.sessions, session_id=session_id)
        
        notes = request.data.get('notes', '')
        if not notes:
            return Response({'error': 'Notes cannot be empty'}, status=400)
        
        session.session_notes = notes
        session.save()
        
        return Response({
            'message': 'Session notes updated successfully',
            'session_id': str(session.session_id),
            'notes': session.session_notes
        })
        
    except TherapistProfile.DoesNotExist:
        return Response({'error': 'Therapist profile not found'}, status=404)


class AvailabilityManagementView(LoginRequiredMixin, APIView):
    """
    Manage therapist availability slots
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Get availability slots"""
        try:
            therapist = request.user.therapist_profile
            date_from = request.GET.get('date_from', timezone.now().date())
            date_to = request.GET.get('date_to', timezone.now().date() + timedelta(days=30))
            
            slots = therapist.availability_slots.filter(
                date__range=[date_from, date_to]
            ).order_by('date', 'start_time')
            
            slots_data = []
            for slot in slots:
                slots_data.append({
                    'id': slot.id,
                    'date': slot.date.isoformat(),
                    'start_time': slot.start_time.strftime('%H:%M'),
                    'end_time': slot.end_time.strftime('%H:%M'),
                    'duration': slot.duration_minutes,
                    'status': slot.status,
                    'is_recurring': slot.is_recurring,
                    'recurrence_type': slot.recurrence_type,
                    'notes': slot.notes,
                    'can_be_modified': slot.can_be_modified(),
                })
            
            return Response({
                'availability_slots': slots_data,
                'date_range': {
                    'from': date_from,
                    'to': date_to
                }
            })
            
        except TherapistProfile.DoesNotExist:
            return Response({'error': 'Therapist profile not found'}, status=404)

    def post(self, request):
        """Create availability slots"""
        try:
            therapist = request.user.therapist_profile
            slots_data = request.data.get('slots', [])
            
            created_slots = []
            errors = []
            
            for slot_data in slots_data:
                try:
                    # Validate 2-day advance notice for new slots
                    slot_date = datetime.strptime(slot_data['date'], '%Y-%m-%d').date()
                    if slot_date <= timezone.now().date() + timedelta(days=2):
                        errors.append(f"Cannot create slots with less than 2 days advance notice: {slot_date}")
                        continue
                    
                    slot = AvailabilitySlot.objects.create(
                        therapist=therapist,
                        date=slot_date,
                        start_time=datetime.strptime(slot_data['start_time'], '%H:%M').time(),
                        end_time=datetime.strptime(slot_data['end_time'], '%H:%M').time(),
                        duration_minutes=slot_data.get('duration_minutes', 60),
                        status='available',
                        is_recurring=slot_data.get('is_recurring', False),
                        recurrence_type=slot_data.get('recurrence_type', 'none'),
                        notes=slot_data.get('notes', '')
                    )
                    created_slots.append(slot)
                    
                except Exception as e:
                    errors.append(f"Error creating slot: {str(e)}")
            
            response_data = {
                'message': f'{len(created_slots)} slots created successfully',
                'created_slots': len(created_slots),
                'errors': errors
            }
            
            if errors:
                response_data['warning'] = f'{len(errors)} slots failed to create'
            
            return Response(response_data)
            
        except TherapistProfile.DoesNotExist:
            return Response({'error': 'Therapist profile not found'}, status=404)


@api_view(['PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def manage_availability_slot(request, slot_id):
    """
    Update or delete availability slot (requires 2 days advance notice)
    """
    try:
        therapist = request.user.therapist_profile
        slot = get_object_or_404(AvailabilitySlot, id=slot_id, therapist=therapist)
        
        # Check 2-day advance notice requirement
        if not slot.can_be_modified():
            return Response({
                'error': 'Cannot modify slots with less than 2 days advance notice'
            }, status=400)
        
        if request.method == 'PUT':
            # Update slot
            action = request.data.get('action', 'update')
            
            if action == 'block':
                slot.status = 'blocked'
                slot.notes = request.data.get('reason', 'Blocked by therapist')
            elif action == 'unblock':
                slot.status = 'available'
                slot.notes = ''
            else:
                # Regular update
                for field in ['start_time', 'end_time', 'duration_minutes', 'notes']:
                    if field in request.data:
                        if field in ['start_time', 'end_time']:
                            setattr(slot, field, datetime.strptime(request.data[field], '%H:%M').time())
                        else:
                            setattr(slot, field, request.data[field])
            
            slot.save()
            
            return Response({
                'message': f'Availability slot {action}ed successfully',
                'slot': {
                    'id': slot.id,
                    'date': slot.date.isoformat(),
                    'start_time': slot.start_time.strftime('%H:%M'),
                    'end_time': slot.end_time.strftime('%H:%M'),
                    'status': slot.status,
                    'notes': slot.notes
                }
            })
        
        elif request.method == 'DELETE':
            # Delete slot
            slot.delete()
            return Response({'message': 'Availability slot deleted successfully'})
        
    except TherapistProfile.DoesNotExist:
        return Response({'error': 'Therapist profile not found'}, status=404)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def session_statistics(request):
    """
    Get session statistics for therapist
    """
    try:
        therapist = request.user.therapist_profile
        
        # Date range for statistics
        date_from = request.GET.get('date_from')
        date_to = request.GET.get('date_to')
        
        sessions = therapist.sessions.all()
        
        if date_from:
            sessions = sessions.filter(scheduled_date__gte=date_from)
        if date_to:
            sessions = sessions.filter(scheduled_date__lte=date_to)
        
        # Calculate statistics
        total_sessions = sessions.count()
        completed_sessions = sessions.filter(status='completed').count()
        cancelled_sessions = sessions.filter(status='cancelled').count()
        no_show_sessions = sessions.filter(status='no_show').count()
        in_progress_sessions = sessions.filter(status='in_progress').count()
        
        # Calculate completion rate
        completion_rate = (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0
        
        # Get unique clients
        unique_clients = sessions.values('client').distinct().count()
        
        # Calculate average session duration
        completed_with_duration = sessions.filter(
            status='completed',
            actual_duration_minutes__isnull=False
        )
        avg_duration = completed_with_duration.aggregate(
            avg_duration=models.Avg('actual_duration_minutes')
        )['avg_duration'] or 0
        
        statistics = {
            'total_sessions': total_sessions,
            'completed_sessions': completed_sessions,
            'cancelled_sessions': cancelled_sessions,
            'no_show_sessions': no_show_sessions,
            'in_progress_sessions': in_progress_sessions,
            'completion_rate': round(completion_rate, 2),
            'unique_clients': unique_clients,
            'average_duration_minutes': round(avg_duration, 2),
            'average_rating': float(therapist.average_rating),
            'total_reviews': therapist.total_reviews,
        }
        
        return Response(statistics)
        
    except TherapistProfile.DoesNotExist:
        return Response({'error': 'Therapist profile not found'}, status=404)


# Case Sheet Management Views
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def case_sheets(request):
    """
    List or create case sheets
    """
    try:
        therapist = request.user.therapist_profile
        
        if request.method == 'GET':
            # List case sheets
            from clients.models import CaseSheet  # Assuming case sheets are in clients app
            
            case_sheets = CaseSheet.objects.filter(
                therapist=therapist
            ).order_by('-created_at')
            
            # Apply filters
            client_id = request.GET.get('client_id')
            status_filter = request.GET.get('status')
            
            if client_id:
                case_sheets = case_sheets.filter(client_id=client_id)
            if status_filter:
                case_sheets = case_sheets.filter(status=status_filter)
            
            case_sheets_data = []
            for case_sheet in case_sheets:
                case_sheets_data.append({
                    'id': case_sheet.id,
                    'client_name': case_sheet.client.user.get_full_name(),
                    'session_id': str(case_sheet.session.session_id) if case_sheet.session else None,
                    'session_date': case_sheet.session.scheduled_date.isoformat() if case_sheet.session else None,
                    'proforma_type': case_sheet.proforma_type,
                    'method': case_sheet.method,
                    'status': case_sheet.status,
                    'created_at': case_sheet.created_at.isoformat(),
                    'updated_at': case_sheet.updated_at.isoformat(),
                })
            
            return Response({
                'case_sheets': case_sheets_data,
                'total_count': len(case_sheets_data)
            })
        
        elif request.method == 'POST':
            # Create new case sheet
            # This would integrate with the case sheet creation logic
            return Response({
                'message': 'Case sheet creation endpoint - to be implemented with case sheet models'
            })
            
    except TherapistProfile.DoesNotExist:
        return Response({'error': 'Therapist profile not found'}, status=404)
