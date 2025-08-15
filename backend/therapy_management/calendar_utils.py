# Calendar and Scheduling Utilities
from datetime import datetime, timedelta, date
from django.utils import timezone
from django.db.models import Q, Count
from sessions.models import TherapySession
from therapists.models import TherapistProfile, TherapistAvailability
from clients.models import ClientProfile


class CalendarManager:
    """
    Utility class for calendar and scheduling operations
    """
    
    @staticmethod
    def get_daily_sessions(target_date=None):
        """
        Get all sessions for a specific date
        """
        if target_date is None:
            target_date = timezone.now().date()
        
        sessions = TherapySession.objects.filter(
            scheduled_date=target_date
        ).select_related(
            'client__user', 'therapist__user'
        ).order_by('scheduled_time')
        
        return sessions
    
    @staticmethod
    def get_sessions_by_therapist(target_date=None):
        """
        Get sessions grouped by therapist for a specific date
        """
        if target_date is None:
            target_date = timezone.now().date()
        
        sessions = TherapySession.objects.filter(
            scheduled_date=target_date
        ).select_related(
            'client__user', 'therapist__user'
        ).order_by('therapist__user__first_name', 'scheduled_time')
        
        # Group by therapist
        therapist_sessions = {}
        for session in sessions:
            therapist_name = session.therapist.user.get_full_name()
            if therapist_name not in therapist_sessions:
                therapist_sessions[therapist_name] = []
            therapist_sessions[therapist_name].append(session)
        
        return therapist_sessions
    
    @staticmethod
    def get_sessions_by_client(target_date=None):
        """
        Get sessions grouped by client for a specific date
        """
        if target_date is None:
            target_date = timezone.now().date()
        
        sessions = TherapySession.objects.filter(
            scheduled_date=target_date
        ).select_related(
            'client__user', 'therapist__user'
        ).order_by('client__user__first_name', 'scheduled_time')
        
        # Group by client
        client_sessions = {}
        for session in sessions:
            client_name = session.client.user.get_full_name()
            if client_name not in client_sessions:
                client_sessions[client_name] = []
            client_sessions[client_name].append(session)
        
        return client_sessions
    
    @staticmethod
    def get_no_show_sessions(target_date=None):
        """
        Get sessions where therapist or client didn't show up
        """
        if target_date is None:
            target_date = timezone.now().date()
        
        no_show_sessions = TherapySession.objects.filter(
            scheduled_date=target_date,
            status='no_show'
        ).select_related('client__user', 'therapist__user')
        
        return no_show_sessions
    
    @staticmethod
    def flag_no_show_sessions():
        """
        Automatically flag sessions as no-show if they haven't started
        15 minutes after scheduled time
        """
        now = timezone.now()
        cutoff_time = now - timedelta(minutes=15)
        
        # Find sessions that should have started but haven't
        sessions_to_flag = TherapySession.objects.filter(
            scheduled_date=now.date(),
            scheduled_time__lt=cutoff_time.time(),
            status='scheduled',
            actual_start_time__isnull=True
        )
        
        flagged_count = sessions_to_flag.update(status='no_show')
        return flagged_count
    
    @staticmethod
    def get_weekly_calendar(start_date=None):
        """
        Get calendar view for a week
        """
        if start_date is None:
            start_date = timezone.now().date()
        
        # Get start of week (Monday)
        days_since_monday = start_date.weekday()
        week_start = start_date - timedelta(days=days_since_monday)
        week_end = week_start + timedelta(days=6)
        
        sessions = TherapySession.objects.filter(
            scheduled_date__range=[week_start, week_end]
        ).select_related(
            'client__user', 'therapist__user'
        ).order_by('scheduled_date', 'scheduled_time')
        
        # Group by date
        weekly_sessions = {}
        current_date = week_start
        while current_date <= week_end:
            weekly_sessions[current_date] = []
            current_date += timedelta(days=1)
        
        for session in sessions:
            weekly_sessions[session.scheduled_date].append(session)
        
        return weekly_sessions
    
    @staticmethod
    def get_monthly_calendar(year=None, month=None):
        """
        Get calendar view for a month
        """
        if year is None or month is None:
            now = timezone.now()
            year = now.year
            month = now.month
        
        # Get first and last day of month
        first_day = date(year, month, 1)
        if month == 12:
            last_day = date(year + 1, 1, 1) - timedelta(days=1)
        else:
            last_day = date(year, month + 1, 1) - timedelta(days=1)
        
        sessions = TherapySession.objects.filter(
            scheduled_date__range=[first_day, last_day]
        ).select_related(
            'client__user', 'therapist__user'
        ).order_by('scheduled_date', 'scheduled_time')
        
        # Group by date
        monthly_sessions = {}
        current_date = first_day
        while current_date <= last_day:
            monthly_sessions[current_date] = []
            current_date += timedelta(days=1)
        
        for session in sessions:
            monthly_sessions[session.scheduled_date].append(session)
        
        return monthly_sessions
    
    @staticmethod
    def get_therapist_availability(therapist_id, target_date=None):
        """
        Get therapist availability for a specific date
        """
        if target_date is None:
            target_date = timezone.now().date()
        
        try:
            therapist = TherapistProfile.objects.get(id=therapist_id)
        except TherapistProfile.DoesNotExist:
            return None
        
        # Check for specific date availability first
        specific_availability = TherapistAvailability.objects.filter(
            therapist=therapist,
            specific_date=target_date
        ).first()
        
        if specific_availability:
            return specific_availability
        
        # Check regular weekly availability
        day_of_week = target_date.weekday()
        weekly_availability = TherapistAvailability.objects.filter(
            therapist=therapist,
            day_of_week=day_of_week,
            specific_date__isnull=True,
            is_available=True
        ).first()
        
        return weekly_availability
    
    @staticmethod
    def get_available_time_slots(therapist_id, target_date, session_duration=60):
        """
        Get available time slots for a therapist on a specific date
        """
        availability = CalendarManager.get_therapist_availability(therapist_id, target_date)
        if not availability:
            return []
        
        # Get existing bookings for the date
        existing_sessions = TherapySession.objects.filter(
            therapist_id=therapist_id,
            scheduled_date=target_date,
            status__in=['scheduled', 'confirmed', 'in_progress']
        ).values_list('scheduled_time', 'duration_minutes')
        
        # Generate time slots
        available_slots = []
        current_time = availability.start_time
        end_time = availability.end_time
        
        while current_time < end_time:
            # Check if this slot conflicts with existing sessions
            slot_end_time = (datetime.combine(target_date, current_time) + 
                           timedelta(minutes=session_duration)).time()
            
            is_available = True
            for session_time, session_duration in existing_sessions:
                session_end_time = (datetime.combine(target_date, session_time) + 
                                  timedelta(minutes=session_duration)).time()
                
                # Check for overlap
                if (current_time < session_end_time and slot_end_time > session_time):
                    is_available = False
                    break
            
            if is_available and slot_end_time <= end_time:
                available_slots.append(current_time)
            
            # Move to next slot (30-minute intervals)
            current_time = (datetime.combine(target_date, current_time) + 
                          timedelta(minutes=30)).time()
        
        return available_slots