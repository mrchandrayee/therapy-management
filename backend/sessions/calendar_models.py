# Calendar and Scheduling Models

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
from datetime import datetime, timedelta

User = get_user_model()


class TimeZone(models.Model):
    """
    Timezone management for international clients
    """
    name = models.CharField(max_length=100, unique=True)  # e.g., "Asia/Kolkata"
    display_name = models.CharField(max_length=100)  # e.g., "India Standard Time (IST)"
    utc_offset = models.CharField(max_length=10)  # e.g., "+05:30"
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.display_name} ({self.utc_offset})"

    class Meta:
        ordering = ['utc_offset', 'display_name']


class TherapistCalendar(models.Model):
    """
    Therapist calendar and availability management
    """
    therapist = models.OneToOneField(
        'therapists.TherapistProfile', 
        on_delete=models.CASCADE, 
        related_name='calendar'
    )
    
    # Default Settings
    default_session_duration = models.PositiveIntegerField(default=60, help_text="Minutes")
    buffer_time_between_sessions = models.PositiveIntegerField(default=15, help_text="Minutes")
    advance_booking_days = models.PositiveIntegerField(default=30, help_text="Days")
    
    # Availability Rules
    min_notice_hours = models.PositiveIntegerField(default=48, help_text="Minimum hours notice for booking")
    max_sessions_per_day = models.PositiveIntegerField(default=8)
    
    # Timezone
    timezone = models.ForeignKey(TimeZone, on_delete=models.SET_NULL, null=True)
    
    # Auto-scheduling
    auto_accept_bookings = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Calendar - {self.therapist.user.get_full_name()}"


class AvailabilitySlot(models.Model):
    """
    Therapist availability slots
    """
    SLOT_STATUS = [
        ('available', 'Available'),
        ('booked', 'Booked'),
        ('blocked', 'Blocked'),
        ('tentative', 'Tentative'),
    ]

    RECURRENCE_TYPES = [
        ('none', 'One-time'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]

    therapist = models.ForeignKey(
        'therapists.TherapistProfile', 
        on_delete=models.CASCADE, 
        related_name='availability_slots'
    )
    
    # Slot Details
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration_minutes = models.PositiveIntegerField(default=60)
    
    # Status
    status = models.CharField(max_length=20, choices=SLOT_STATUS, default='available')
    
    # Recurrence
    is_recurring = models.BooleanField(default=False)
    recurrence_type = models.CharField(max_length=20, choices=RECURRENCE_TYPES, default='none')
    recurrence_end_date = models.DateField(null=True, blank=True)
    
    # Booking Details
    session = models.OneToOneField(
        'sessions.TherapySession', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='availability_slot'
    )
    
    # Notes
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.therapist.user.get_full_name()} - {self.date} {self.start_time}-{self.end_time} ({self.status})"

    def is_available_for_booking(self):
        """Check if slot is available for booking"""
        if self.status != 'available':
            return False
        
        # Check minimum notice requirement
        from django.utils import timezone
        slot_datetime = datetime.combine(self.date, self.start_time)
        min_notice = timedelta(hours=self.therapist.calendar.min_notice_hours)
        
        return timezone.now() + min_notice <= slot_datetime

    def can_be_modified(self):
        """Check if slot can be modified (at least 2 days in advance)"""
        from django.utils import timezone
        slot_datetime = datetime.combine(self.date, self.start_time)
        min_modification_time = timedelta(days=2)
        
        return timezone.now() + min_modification_time <= slot_datetime

    class Meta:
        unique_together = ['therapist', 'date', 'start_time']
        ordering = ['date', 'start_time']


class SessionReminder(models.Model):
    """
    Automated session reminders
    """
    REMINDER_TYPES = [
        ('booking_confirmation', 'Booking Confirmation'),
        ('24_hour_reminder', '24 Hour Reminder'),
        ('1_hour_reminder', '1 Hour Reminder'),
        ('session_start', 'Session Start Notification'),
    ]

    RECIPIENT_TYPES = [
        ('client', 'Client'),
        ('therapist', 'Therapist'),
        ('admin', 'Admin'),
    ]

    DELIVERY_METHODS = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push Notification'),
        ('in_app', 'In-App Notification'),
    ]

    session = models.ForeignKey(
        'sessions.TherapySession', 
        on_delete=models.CASCADE, 
        related_name='automated_reminders'
    )
    
    # Reminder Details
    reminder_type = models.CharField(max_length=30, choices=REMINDER_TYPES)
    recipient_type = models.CharField(max_length=20, choices=RECIPIENT_TYPES)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Delivery
    delivery_method = models.CharField(max_length=20, choices=DELIVERY_METHODS)
    
    # Scheduling
    scheduled_for = models.DateTimeField()
    sent_at = models.DateTimeField(null=True, blank=True)
    
    # Status
    is_sent = models.BooleanField(default=False)
    delivery_status = models.CharField(max_length=50, blank=True)
    error_message = models.TextField(blank=True)
    
    # Content
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reminder_type} for {self.session} to {self.recipient.get_full_name()}"

    class Meta:
        unique_together = ['session', 'reminder_type', 'recipient_type']
        ordering = ['scheduled_for']


class SessionJoinControl(models.Model):
    """
    Control session join access (5-minute rule implementation)
    """
    session = models.OneToOneField(
        'sessions.TherapySession', 
        on_delete=models.CASCADE, 
        related_name='join_control'
    )
    
    # Join Window Settings
    early_join_minutes = models.PositiveIntegerField(default=5, help_text="Minutes before session start")
    late_join_minutes = models.PositiveIntegerField(default=30, help_text="Minutes after session start")
    
    # Join Tracking
    client_joined_at = models.DateTimeField(null=True, blank=True)
    therapist_joined_at = models.DateTimeField(null=True, blank=True)
    admin_joined_at = models.DateTimeField(null=True, blank=True)
    
    # Access Control
    client_can_join = models.BooleanField(default=False)
    therapist_can_join = models.BooleanField(default=False)
    admin_can_join = models.BooleanField(default=True)  # Admin can always join for emergency
    
    # Meeting Details
    meeting_room_created = models.BooleanField(default=False)
    meeting_room_id = models.CharField(max_length=100, blank=True)
    meeting_password = models.CharField(max_length=50, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Join Control - {self.session}"

    def update_join_permissions(self):
        """Update join permissions based on current time and session schedule"""
        from django.utils import timezone
        
        now = timezone.now()
        session_start = self.session.get_session_datetime()
        
        # Calculate join window
        early_join_time = session_start - timedelta(minutes=self.early_join_minutes)
        late_join_time = session_start + timedelta(minutes=self.late_join_minutes)
        
        # Update permissions
        can_join = early_join_time <= now <= late_join_time
        
        self.client_can_join = can_join
        self.therapist_can_join = can_join
        # Admin can always join
        
        self.save()
        
        return can_join

    def record_join(self, user_type, user):
        """Record when a user joins the session"""
        from django.utils import timezone
        
        join_time = timezone.now()
        
        if user_type == 'client':
            self.client_joined_at = join_time
        elif user_type == 'therapist':
            self.therapist_joined_at = join_time
        elif user_type == 'admin':
            self.admin_joined_at = join_time
        
        self.save()

    class Meta:
        ordering = ['-created_at']


class CalendarEvent(models.Model):
    """
    Calendar events for therapists (holidays, breaks, etc.)
    """
    EVENT_TYPES = [
        ('holiday', 'Holiday'),
        ('break', 'Break'),
        ('training', 'Training'),
        ('conference', 'Conference'),
        ('personal', 'Personal Time'),
        ('maintenance', 'System Maintenance'),
    ]

    therapist = models.ForeignKey(
        'therapists.TherapistProfile', 
        on_delete=models.CASCADE, 
        related_name='calendar_events'
    )
    
    # Event Details
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    
    # Timing
    start_date = models.DateField()
    end_date = models.DateField()
    is_all_day = models.BooleanField(default=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    
    # Impact
    blocks_availability = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.therapist.user.get_full_name()} - {self.title} ({self.start_date})"

    class Meta:
        ordering = ['start_date', 'start_time']