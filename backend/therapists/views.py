from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views.generic import ListView, DetailView, CreateView, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import datetime, timedelta, time
from django.utils import timezone
import json

# Swagger imports
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import (
    TherapistProfile, TherapyCategory, Competency, TherapistCompetency,
    TherapistDocument, TherapistAvailability, TherapistReview
)
from .serializers import (
    TherapistProfileSerializer, TherapyCategorySerializer, CompetencySerializer,
    TherapistDocumentSerializer, TherapistAvailabilitySerializer
)

User = get_user_model()


class TherapistDashboardView(LoginRequiredMixin, APIView):
    """
    Therapist dashboard with profile, calendar, and session overview
    """
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Get Therapist Dashboard",
        operation_description="""
        Retrieve comprehensive dashboard data for the authenticated therapist including:
        - Profile information and statistics
        - Today's session schedule
        - Weekly performance metrics
        - Recent activity feed
        """,
        tags=['therapists'],
        responses={
            200: openapi.Response(
                description="Dashboard data retrieved successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'profile': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'name': openapi.Schema(type=openapi.TYPE_STRING),
                                'license_number': openapi.Schema(type=openapi.TYPE_STRING),
                                'approval_status': openapi.Schema(type=openapi.TYPE_STRING),
                                'specializations': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Schema(type=openapi.TYPE_STRING)),
                                'average_rating': openapi.Schema(type=openapi.TYPE_NUMBER),
                                'total_reviews': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'total_sessions': openapi.Schema(type=openapi.TYPE_INTEGER),
                            }
                        ),
                        'today_schedule': openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    'id': openapi.Schema(type=openapi.TYPE_STRING),
                                    'client_name': openapi.Schema(type=openapi.TYPE_STRING),
                                    'time': openapi.Schema(type=openapi.TYPE_STRING),
                                    'duration': openapi.Schema(type=openapi.TYPE_INTEGER),
                                    'type': openapi.Schema(type=openapi.TYPE_STRING),
                                    'status': openapi.Schema(type=openapi.TYPE_STRING),
                                    'meeting_link': openapi.Schema(type=openapi.TYPE_STRING),
                                    'can_join': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                                }
                            )
                        ),
                        'weekly_stats': openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'sessions_completed': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'sessions_scheduled': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'average_rating': openapi.Schema(type=openapi.TYPE_NUMBER),
                                'clients_seen': openapi.Schema(type=openapi.TYPE_INTEGER),
                                'no_shows': openapi.Schema(type=openapi.TYPE_INTEGER),
                            }
                        )
                    }
                )
            ),
            404: openapi.Response(description="Therapist profile not found")
        }
    )
    def get(self, request):
        try:
            therapist = request.user.therapist_profile
        except TherapistProfile.DoesNotExist:
            return Response({'error': 'Therapist profile not found'}, status=404)

        # Get today's sessions
        today = timezone.now().date()
        today_sessions = therapist.sessions.filter(
            scheduled_date=today,
            status__in=['scheduled', 'confirmed', 'in_progress']
        ).order_by('scheduled_time')

        # Get weekly stats
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)
        
        weekly_sessions = therapist.sessions.filter(
            scheduled_date__range=[week_start, week_end]
        )

        dashboard_data = {
            'profile': {
                'name': therapist.user.get_full_name(),
                'license_number': therapist.license_number,
                'approval_status': therapist.approval_status,
                'specializations': [spec.name for spec in therapist.specializations.all()],
                'average_rating': float(therapist.average_rating),
                'total_reviews': therapist.total_reviews,
                'total_sessions': therapist.total_sessions,
            },
            'today_schedule': [{
                'id': session.session_id,
                'client_name': session.client.user.get_full_name(),
                'time': session.scheduled_time.strftime('%H:%M'),
                'duration': session.duration_minutes,
                'type': session.session_type,
                'status': session.status,
                'meeting_link': session.meeting_link,
                'can_join': session.can_join(),
            } for session in today_sessions],
            'weekly_stats': {
                'sessions_completed': weekly_sessions.filter(status='completed').count(),
                'sessions_scheduled': weekly_sessions.filter(status__in=['scheduled', 'confirmed']).count(),
                'average_rating': float(therapist.average_rating),
                'clients_seen': weekly_sessions.values('client').distinct().count(),
                'no_shows': weekly_sessions.filter(status='no_show').count(),
            }
        }

        return Response(dashboard_data)


class TherapistProfileView(LoginRequiredMixin, APIView):
    """
    View and update therapist profile
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            therapist = request.user.therapist_profile
            serializer = TherapistProfileSerializer(therapist)
            return Response(serializer.data)
        except TherapistProfile.DoesNotExist:
            return Response({'error': 'Therapist profile not found'}, status=404)

    def put(self, request):
        try:
            therapist = request.user.therapist_profile
            serializer = TherapistProfileSerializer(therapist, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except TherapistProfile.DoesNotExist:
            return Response({'error': 'Therapist profile not found'}, status=404)


class TherapistAvailabilityView(LoginRequiredMixin, APIView):
    """
    Manage therapist availability slots
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            therapist = request.user.therapist_profile
            date_from = request.GET.get('date_from', timezone.now().date())
            date_to = request.GET.get('date_to', timezone.now().date() + timedelta(days=30))
            
            availability = therapist.availability.filter(
                day_of_week__isnull=True,  # Specific date slots
                specific_date__range=[date_from, date_to]
            ).union(
                therapist.availability.filter(
                    day_of_week__isnull=False,  # Regular weekly slots
                    specific_date__isnull=True
                )
            )
            
            serializer = TherapistAvailabilitySerializer(availability, many=True)
            return Response(serializer.data)
        except TherapistProfile.DoesNotExist:
            return Response({'error': 'Therapist profile not found'}, status=404)

    def post(self, request):
        """Create or update availability slots"""
        try:
            therapist = request.user.therapist_profile
            slots_data = request.data.get('slots', [])
            
            created_slots = []
            for slot_data in slots_data:
                slot_data['therapist'] = therapist.id
                serializer = TherapistAvailabilitySerializer(data=slot_data)
                if serializer.is_valid():
                    slot = serializer.save()
                    created_slots.append(slot)
                else:
                    return Response(serializer.errors, status=400)
            
            return Response({
                'message': f'{len(created_slots)} availability slots created',
                'slots': TherapistAvailabilitySerializer(created_slots, many=True).data
            })
        except TherapistProfile.DoesNotExist:
            return Response({'error': 'Therapist profile not found'}, status=404)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_availability(request):
    """
    Update or block availability slots (requires 2 days advance notice)
    """
    try:
        therapist = request.user.therapist_profile
        slot_id = request.data.get('slot_id')
        action = request.data.get('action')  # 'block', 'unblock', 'update'
        
        slot = get_object_or_404(TherapistAvailability, id=slot_id, therapist=therapist)
        
        # Check 2-day advance notice requirement
        if slot.specific_date:
            slot_date = slot.specific_date
        else:
            # For recurring slots, check next occurrence
            today = timezone.now().date()
            days_ahead = slot.day_of_week - today.weekday()
            if days_ahead <= 0:
                days_ahead += 7
            slot_date = today + timedelta(days=days_ahead)
        
        if slot_date <= timezone.now().date() + timedelta(days=2):
            return Response({
                'error': 'Cannot modify slots with less than 2 days advance notice'
            }, status=400)
        
        if action == 'block':
            slot.is_available = False
            slot.is_holiday = True
        elif action == 'unblock':
            slot.is_available = True
            slot.is_holiday = False
        elif action == 'update':
            # Update slot details
            for field in ['start_time', 'end_time', 'specific_date']:
                if field in request.data:
                    setattr(slot, field, request.data[field])
        
        slot.save()
        
        return Response({
            'message': f'Availability slot {action}ed successfully',
            'slot': TherapistAvailabilitySerializer(slot).data
        })
        
    except TherapistProfile.DoesNotExist:
        return Response({'error': 'Therapist profile not found'}, status=404)


class TherapistDocumentUploadView(LoginRequiredMixin, APIView):
    """
    Upload new credentials and documents
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            therapist = request.user.therapist_profile
            data = request.data.copy()
            data['therapist'] = therapist.id
            
            serializer = TherapistDocumentSerializer(data=data)
            if serializer.is_valid():
                document = serializer.save()
                return Response({
                    'message': 'Document uploaded successfully',
                    'document': TherapistDocumentSerializer(document).data
                })
            return Response(serializer.errors, status=400)
        except TherapistProfile.DoesNotExist:
            return Response({'error': 'Therapist profile not found'}, status=404)


class TherapistDocumentListView(LoginRequiredMixin, APIView):
    """
    List therapist documents
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            therapist = request.user.therapist_profile
            documents = therapist.documents.all().order_by('-uploaded_at')
            serializer = TherapistDocumentSerializer(documents, many=True)
            return Response(serializer.data)
        except TherapistProfile.DoesNotExist:
            return Response({'error': 'Therapist profile not found'}, status=404)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def therapist_sessions(request):
    """
    Get therapist sessions with filtering
    """
    try:
        therapist = request.user.therapist_profile
        
        # Filter parameters
        date_from = request.GET.get('date_from')
        date_to = request.GET.get('date_to')
        status_filter = request.GET.get('status')
        session_type = request.GET.get('type')
        
        sessions = therapist.sessions.all()
        
        if date_from:
            sessions = sessions.filter(scheduled_date__gte=date_from)
        if date_to:
            sessions = sessions.filter(scheduled_date__lte=date_to)
        if status_filter:
            sessions = sessions.filter(status=status_filter)
        if session_type:
            sessions = sessions.filter(session_type=session_type)
        
        sessions_data = []
        for session in sessions.order_by('-scheduled_date', '-scheduled_time'):
            sessions_data.append({
                'id': str(session.session_id),
                'client_name': session.client.user.get_full_name(),
                'client_email': session.client.user.email,
                'date': session.scheduled_date.isoformat(),
                'time': session.scheduled_time.strftime('%H:%M'),
                'duration': session.duration_minutes,
                'type': session.session_type,
                'status': session.status,
                'meeting_link': session.meeting_link,
                'can_join': session.can_join(),
                'notes': session.session_notes,
            })
        
        return Response(sessions_data)
        
    except TherapistProfile.DoesNotExist:
        return Response({'error': 'Therapist profile not found'}, status=404)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_session(request, session_id):
    """
    Join a therapy session (5-minute rule implementation)
    """
    try:
        therapist = request.user.therapist_profile
        session = get_object_or_404(therapist.sessions, session_id=session_id)
        
        if not session.can_join():
            return Response({
                'error': 'Session cannot be joined yet. Please wait until 5 minutes before the scheduled time.'
            }, status=400)
        
        # Update session status
        if session.status == 'scheduled':
            session.status = 'in_progress'
            session.actual_start_time = timezone.now()
            session.save()
        
        return Response({
            'message': 'Session joined successfully',
            'meeting_link': session.meeting_link,
            'session_id': str(session.session_id)
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
        
        # Check extension limits
        current_extensions = session.extensions.count()
        if current_extensions >= 3:
            return Response({'error': 'Maximum extensions (3) already used'}, status=400)
        
        # Create extension record
        from sessions.models import SessionExtension
        extension = SessionExtension.objects.create(
            session=session,
            extended_by_minutes=10,
            requested_by=request.user,
            reason=request.data.get('reason', 'Therapist requested extension')
        )
        
        return Response({
            'message': 'Session extended by 10 minutes',
            'extensions_used': current_extensions + 1,
            'total_extended_minutes': (current_extensions + 1) * 10
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
        
        session.status = 'completed'
        session.actual_end_time = timezone.now()
        
        # Calculate actual duration
        if session.actual_start_time:
            duration = session.actual_end_time - session.actual_start_time
            session.actual_duration_minutes = int(duration.total_seconds() / 60)
        
        session.save()
        
        return Response({
            'message': 'Session ended successfully',
            'actual_duration': session.actual_duration_minutes
        })
        
    except TherapistProfile.DoesNotExist:
        return Response({'error': 'Therapist profile not found'}, status=404)


# Admin approval views
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def approve_therapist(request, pk):
    """
    Admin approval for therapist (admin only)
    """
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=403)
    
    therapist = get_object_or_404(TherapistProfile, pk=pk)
    therapist.approval_status = 'approved'
    therapist.approved_by = request.user
    therapist.approved_at = timezone.now()
    therapist.save()
    
    return Response({'message': 'Therapist approved successfully'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def reject_therapist(request, pk):
    """
    Admin rejection for therapist (admin only)
    """
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=403)
    
    therapist = get_object_or_404(TherapistProfile, pk=pk)
    therapist.approval_status = 'rejected'
    therapist.rejection_reason = request.data.get('reason', '')
    therapist.save()
    
    return Response({'message': 'Therapist rejected'})


# Category and Competency views
class TherapyCategoryListView(generics.ListAPIView):
    queryset = TherapyCategory.objects.filter(is_active=True)
    serializer_class = TherapyCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class CompetencyListView(generics.ListAPIView):
    queryset = Competency.objects.filter(is_active=True)
    serializer_class = CompetencySerializer
    permission_classes = [permissions.IsAuthenticated]


# Search and filter views
@api_view(['GET'])
def therapist_search(request):
    """
    Search therapists by name, specialization, or competency
    """
    query = request.GET.get('q', '')
    category_id = request.GET.get('category')
    
    therapists = TherapistProfile.objects.filter(
        approval_status='approved',
        is_available=True
    )
    
    if query:
        therapists = therapists.filter(
            user__first_name__icontains=query
        ) | therapists.filter(
            user__last_name__icontains=query
        ) | therapists.filter(
            specializations__name__icontains=query
        )
    
    if category_id:
        therapists = therapists.filter(specializations__id=category_id)
    
    therapists_data = []
    for therapist in therapists.distinct():
        therapists_data.append({
            'id': therapist.id,
            'name': therapist.user.get_full_name(),
            'license_number': therapist.license_number,
            'specializations': [spec.name for spec in therapist.specializations.all()],
            'bio': therapist.bio,
            'average_rating': float(therapist.average_rating),
            'total_reviews': therapist.total_reviews,
            'consultation_fee': float(therapist.consultation_fee),
            'languages_spoken': therapist.languages_spoken,
        })
    
    return Response(therapists_data)


@api_view(['GET'])
def therapists_by_category(request, category_id):
    """
    Get therapists by category
    """
    category = get_object_or_404(TherapyCategory, id=category_id)
    therapists = TherapistProfile.objects.filter(
        specializations=category,
        approval_status='approved',
        is_available=True
    )
    
    therapists_data = []
    for therapist in therapists:
        therapists_data.append({
            'id': therapist.id,
            'name': therapist.user.get_full_name(),
            'bio': therapist.bio,
            'average_rating': float(therapist.average_rating),
            'consultation_fee': float(therapist.consultation_fee),
        })
    
    return Response({
        'category': category.name,
        'therapists': therapists_data
    })


# Review views
class TherapistReviewListView(generics.ListAPIView):
    serializer_class = TherapistReview
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        therapist_id = self.kwargs['pk']
        return TherapistReview.objects.filter(
            therapist_id=therapist_id,
            is_approved=True
        ).order_by('-created_at')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_review(request):
    """
    Create a review for a therapist
    """
    therapist_id = request.data.get('therapist_id')
    rating = request.data.get('rating')
    review_text = request.data.get('review_text', '')
    is_anonymous = request.data.get('is_anonymous', False)
    
    if not therapist_id or not rating:
        return Response({'error': 'Therapist ID and rating are required'}, status=400)
    
    therapist = get_object_or_404(TherapistProfile, id=therapist_id)
    
    # Check if user already reviewed this therapist
    existing_review = TherapistReview.objects.filter(
        therapist=therapist,
        client=request.user
    ).first()
    
    if existing_review:
        return Response({'error': 'You have already reviewed this therapist'}, status=400)
    
    review = TherapistReview.objects.create(
        therapist=therapist,
        client=request.user,
        rating=rating,
        review_text=review_text,
        is_anonymous=is_anonymous
    )
    
    # Update therapist's average rating
    reviews = TherapistReview.objects.filter(therapist=therapist, is_approved=True)
    avg_rating = sum(r.rating for r in reviews) / len(reviews)
    therapist.average_rating = avg_rating
    therapist.total_reviews = len(reviews)
    therapist.save()
    
    return Response({'message': 'Review created successfully'})


# List views for admin
class TherapistListView(generics.ListAPIView):
    queryset = TherapistProfile.objects.all().order_by('-created_at')
    serializer_class = TherapistProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class TherapistDetailView(generics.RetrieveAPIView):
    queryset = TherapistProfile.objects.all()
    serializer_class = TherapistProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class TherapistDocumentDetailView(generics.RetrieveAPIView):
    serializer_class = TherapistDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return TherapistDocument.objects.filter(
            therapist__user=self.request.user
        )


class TherapistRegistrationView(generics.CreateAPIView):
    """
    Therapist registration (requires admin approval)
    """
    serializer_class = TherapistProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            approval_status='pending'
        )
