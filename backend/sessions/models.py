from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

User = get_user_model()


class TherapySession(models.Model):
    """
    Individual therapy sessions
    """
    SESSION_TYPES = [
        ('individual', 'Individual Session'),
        ('group', 'Group Session'),
        ('family', 'Family Session'),
        ('supervision', 'Supervision Session'),
        ('training', 'Training Session'),
    ]

    SESSION_STATUS = [
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
        ('rescheduled', 'Rescheduled'),
    ]

    CANCELLATION_REASONS = [
        ('client_request', 'Client Request'),
        ('therapist_unavailable', 'Therapist Unavailable'),
        ('emergency', 'Emergency'),
        ('technical_issues', 'Technical Issues'),
        ('other', 'Other'),
    ]

    # Basic Information
    session_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    session_type = models.CharField(max_length=20, choices=SESSION_TYPES, default='individual')
    
    # Participants
    client = models.ForeignKey(
        'clients.ClientProfile', 
        on_delete=models.CASCADE, 
        related_name='sessions'
    )
    therapist = models.ForeignKey(
        'therapists.TherapistProfile', 
        on_delete=models.CASCADE, 
        related_name='sessions'
    )
    
    # Group session participants
    group_participants = models.ManyToManyField(
        'clients.ClientProfile', 
        through='SessionParticipant',
        related_name='group_sessions'
    )
    
    # Scheduling
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    duration_minutes = models.PositiveIntegerField(default=60)
    timezone = models.CharField(max_length=50, default='Asia/Kolkata')
    
    # Session Details
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    session_notes = models.TextField(blank=True)
    
    # Status and Tracking
    status = models.CharField(max_length=20, choices=SESSION_STATUS, default='scheduled')
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)
    actual_duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    
    # Cancellation
    cancellation_reason = models.CharField(max_length=30, choices=CANCELLATION_REASONS, blank=True)
    cancellation_notes = models.TextField(blank=True)
    cancelled_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    
    # Meeting Details
    meeting_link = models.URLField(blank=True)
    meeting_id = models.CharField(max_length=100, blank=True)
    meeting_password = models.CharField(max_length=50, blank=True)
    
    # Payment
    payment = models.OneToOneField(
        'payments.Payment', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='session'
    )
    
    # Reminders
    reminder_sent_24h = models.BooleanField(default=False)
    reminder_sent_1h = models.BooleanField(default=False)
    confirmation_sent = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.user.get_full_name()} - {self.therapist.user.get_full_name()} ({self.scheduled_date})"

    def get_session_datetime(self):
        from datetime import datetime, time
        return datetime.combine(self.scheduled_date, self.scheduled_time)

    def can_be_cancelled(self):
        """Check if session can be cancelled (30 hours before)"""
        from django.utils import timezone
        from datetime import timedelta
        
        session_datetime = self.get_session_datetime()
        cutoff_time = session_datetime - timedelta(hours=30)
        
        return timezone.now() < cutoff_time and self.status in ['scheduled', 'confirmed']

    def can_join(self):
        """Check if session can be joined (5 minutes before)"""
        from django.utils import timezone
        from datetime import timedelta
        
        session_datetime = self.get_session_datetime()
        join_time = session_datetime - timedelta(minutes=5)
        
        return timezone.now() >= join_time and self.status in ['scheduled', 'confirmed']

    def is_completed(self):
        return self.status == 'completed'

    class Meta:
        ordering = ['-scheduled_date', '-scheduled_time']


class SessionParticipant(models.Model):
    """
    Participants in group sessions
    """
    PARTICIPANT_ROLES = [
        ('primary', 'Primary Client'),
        ('family_member', 'Family Member'),
        ('group_member', 'Group Member'),
        ('observer', 'Observer'),
    ]

    session = models.ForeignKey(TherapySession, on_delete=models.CASCADE, related_name='participants')
    client = models.ForeignKey('clients.ClientProfile', on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=PARTICIPANT_ROLES, default='group_member')
    
    # Attendance
    attended = models.BooleanField(default=False)
    join_time = models.DateTimeField(null=True, blank=True)
    leave_time = models.DateTimeField(null=True, blank=True)
    
    # Notes
    participant_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.session} - {self.client.user.get_full_name()} ({self.role})"

    class Meta:
        unique_together = ['session', 'client']


class SessionTemplate(models.Model):
    """
    Templates for recurring sessions
    """
    RECURRENCE_TYPES = [
        ('weekly', 'Weekly'),
        ('biweekly', 'Bi-weekly'),
        ('monthly', 'Monthly'),
        ('custom', 'Custom'),
    ]

    therapist = models.ForeignKey(
        'therapists.TherapistProfile', 
        on_delete=models.CASCADE, 
        related_name='session_templates'
    )
    client = models.ForeignKey(
        'clients.ClientProfile', 
        on_delete=models.CASCADE, 
        related_name='session_templates'
    )
    
    # Template Details
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    session_type = models.CharField(max_length=20, choices=TherapySession.SESSION_TYPES, default='individual')
    duration_minutes = models.PositiveIntegerField(default=60)
    
    # Recurrence
    recurrence_type = models.CharField(max_length=20, choices=RECURRENCE_TYPES)
    recurrence_interval = models.PositiveIntegerField(default=1)  # Every X weeks/months
    
    # Schedule
    preferred_day_of_week = models.PositiveIntegerField(null=True, blank=True)  # 0=Monday, 6=Sunday
    preferred_time = models.TimeField()
    
    # Validity
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    max_sessions = models.PositiveIntegerField(null=True, blank=True)
    sessions_created = models.PositiveIntegerField(default=0)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.client.user.get_full_name()}"

    def can_create_more_sessions(self):
        if not self.is_active:
            return False
        if self.max_sessions and self.sessions_created >= self.max_sessions:
            return False
        if self.end_date:
            from django.utils import timezone
            return self.end_date >= timezone.now().date()
        return True

    class Meta:
        ordering = ['-created_at']


class SessionFeedback(models.Model):
    """
    Feedback from clients and therapists after sessions
    """
    FEEDBACK_TYPES = [
        ('client', 'Client Feedback'),
        ('therapist', 'Therapist Feedback'),
    ]

    session = models.ForeignKey(TherapySession, on_delete=models.CASCADE, related_name='feedback')
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPES)
    
    # Ratings
    overall_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    session_quality = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True, blank=True
    )
    technical_quality = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True, blank=True
    )
    
    # Comments
    comments = models.TextField(blank=True)
    suggestions = models.TextField(blank=True)
    
    # Issues
    technical_issues = models.BooleanField(default=False)
    issue_description = models.TextField(blank=True)
    
    # Follow-up
    requires_follow_up = models.BooleanField(default=False)
    follow_up_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.session} - {self.feedback_type} ({self.overall_rating}/5)"

    class Meta:
        unique_together = ['session', 'feedback_type']
        ordering = ['-created_at']


class SessionExtension(models.Model):
    """
    Track session extensions
    """
    session = models.ForeignKey(TherapySession, on_delete=models.CASCADE, related_name='extensions')
    extended_by_minutes = models.PositiveIntegerField()
    reason = models.TextField(blank=True)
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE)
    approved = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.session} - Extended by {self.extended_by_minutes} minutes"

    class Meta:
        ordering = ['-created_at']


class SessionRecording(models.Model):
    """
    Session recordings (if consent is given)
    """
    session = models.OneToOneField(TherapySession, on_delete=models.CASCADE, related_name='recording')
    
    # Recording Details
    recording_file = models.FileField(upload_to='session_recordings/', blank=True)
    recording_url = models.URLField(blank=True)
    duration_seconds = models.PositiveIntegerField(null=True, blank=True)
    file_size_mb = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Consent
    client_consent = models.BooleanField(default=False)
    therapist_consent = models.BooleanField(default=False)
    consent_timestamp = models.DateTimeField(null=True, blank=True)
    
    # Access Control
    is_encrypted = models.BooleanField(default=True)
    access_key = models.CharField(max_length=100, blank=True)
    
    # Retention
    retention_period_days = models.PositiveIntegerField(default=90)
    auto_delete_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Recording - {self.session}"

    def is_accessible(self):
        """Check if recording is still within retention period"""
        if self.auto_delete_date:
            from django.utils import timezone
            return timezone.now() < self.auto_delete_date
        return True

    class Meta:
        ordering = ['-created_at']


class SessionReminder(models.Model):
    """
    Track session reminders sent
    """
    REMINDER_TYPES = [
        ('booking_confirmation', 'Booking Confirmation'),
        ('24_hour', '24 Hour Reminder'),
        ('1_hour', '1 Hour Reminder'),
        ('session_start', 'Session Start'),
        ('follow_up', 'Follow-up'),
    ]

    RECIPIENT_TYPES = [
        ('client', 'Client'),
        ('therapist', 'Therapist'),
        ('admin', 'Admin'),
    ]

    session = models.ForeignKey(TherapySession, on_delete=models.CASCADE, related_name='reminders')
    reminder_type = models.CharField(max_length=30, choices=REMINDER_TYPES)
    recipient_type = models.CharField(max_length=20, choices=RECIPIENT_TYPES)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Delivery Details
    email_sent = models.BooleanField(default=False)
    sms_sent = models.BooleanField(default=False)
    email_delivered = models.BooleanField(default=False)
    sms_delivered = models.BooleanField(default=False)
    
    # Content
    subject = models.CharField(max_length=200)
    message = models.TextField()
    
    # Timing
    scheduled_for = models.DateTimeField()
    sent_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.session} - {self.reminder_type} to {self.recipient.get_full_name()}"

    class Meta:
        ordering = ['-created_at']