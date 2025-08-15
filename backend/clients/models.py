from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator

User = get_user_model()


class ClientProfile(models.Model):
    """
    Extended profile for clients
    """
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('prefer_not_to_say', 'Prefer not to say'),
    ]

    MARITAL_STATUS_CHOICES = [
        ('single', 'Single'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed'),
        ('separated', 'Separated'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    
    # Personal Information
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True)
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES, blank=True)
    occupation = models.CharField(max_length=100, blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=17, blank=True)
    emergency_contact_relationship = models.CharField(max_length=50, blank=True)
    
    # Medical Information
    medical_history = models.TextField(blank=True, help_text="Previous medical conditions")
    current_medications = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    previous_therapy_experience = models.BooleanField(default=False)
    
    # Preferences
    preferred_language = models.CharField(max_length=50, default='English')
    preferred_therapist_gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True)
    preferred_session_time = models.CharField(max_length=50, blank=True)
    
    # Consent and Legal
    terms_accepted = models.BooleanField(default=False)
    privacy_policy_accepted = models.BooleanField(default=False)
    consent_for_treatment = models.BooleanField(default=False)
    consent_date = models.DateTimeField(null=True, blank=True)
    
    # Company Association (for corporate clients)
    company = models.ForeignKey(
        'companies.Company', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='employees'
    )
    employee_id = models.CharField(max_length=50, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    last_session_date = models.DateTimeField(null=True, blank=True)
    total_sessions = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - Client"

    def get_full_address(self):
        return f"{self.user.address}, {self.user.pincode}" if self.user.address else ""

    class Meta:
        ordering = ['-created_at']


class ClientDocument(models.Model):
    """
    Store client documents and reports
    """
    DOCUMENT_TYPES = [
        ('id_proof', 'ID Proof'),
        ('medical_report', 'Medical Report'),
        ('test_report', 'Test Report'),
        ('prescription', 'Prescription'),
        ('insurance', 'Insurance Document'),
        ('other', 'Other'),
    ]

    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    document_file = models.FileField(upload_to='client_documents/')
    
    # Access Control
    is_shared_with_therapist = models.BooleanField(default=False)
    shared_with_admin = models.BooleanField(default=True)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.user.get_full_name()} - {self.title}"

    class Meta:
        ordering = ['-uploaded_at']


class ClientTherapistRelationship(models.Model):
    """
    Track client-therapist relationships
    """
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='therapist_relationships')
    therapist = models.ForeignKey(
        'therapists.TherapistProfile', 
        on_delete=models.CASCADE, 
        related_name='client_relationships'
    )
    
    # Relationship Details
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Session Summary
    total_sessions = models.PositiveIntegerField(default=0)
    last_session_date = models.DateTimeField(null=True, blank=True)
    
    # Notes
    therapist_notes = models.TextField(blank=True, help_text="Private notes for therapist")
    admin_notes = models.TextField(blank=True, help_text="Administrative notes")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.user.get_full_name()} - {self.therapist.user.get_full_name()}"

    class Meta:
        unique_together = ['client', 'therapist']
        ordering = ['-created_at']


class ClientConcern(models.Model):
    """
    Client's therapy concerns and goals
    """
    CONCERN_CATEGORIES = [
        ('anxiety', 'Anxiety'),
        ('depression', 'Depression'),
        ('stress', 'Stress Management'),
        ('relationship', 'Relationship Issues'),
        ('family', 'Family Issues'),
        ('work', 'Work-related Issues'),
        ('trauma', 'Trauma'),
        ('addiction', 'Addiction'),
        ('grief', 'Grief and Loss'),
        ('self_esteem', 'Self-esteem'),
        ('anger', 'Anger Management'),
        ('sleep', 'Sleep Issues'),
        ('eating', 'Eating Disorders'),
        ('other', 'Other'),
    ]

    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='concerns')
    category = models.CharField(max_length=20, choices=CONCERN_CATEGORIES)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    
    # Progress Tracking
    is_resolved = models.BooleanField(default=False)
    resolution_notes = models.TextField(blank=True)
    resolved_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.user.get_full_name()} - {self.get_category_display()}"

    class Meta:
        ordering = ['-priority', '-created_at']


class ClientNote(models.Model):
    """
    Session notes and progress tracking
    """
    NOTE_TYPES = [
        ('session', 'Session Note'),
        ('progress', 'Progress Note'),
        ('assessment', 'Assessment'),
        ('treatment_plan', 'Treatment Plan'),
        ('discharge', 'Discharge Summary'),
    ]

    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='notes')
    therapist = models.ForeignKey(
        'therapists.TherapistProfile', 
        on_delete=models.CASCADE, 
        related_name='client_notes'
    )
    session = models.ForeignKey(
        'sessions.TherapySession', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='notes'
    )
    
    note_type = models.CharField(max_length=20, choices=NOTE_TYPES, default='session')
    title = models.CharField(max_length=200)
    content = models.TextField()
    
    # AI-generated content flag
    is_ai_generated = models.BooleanField(default=False)
    ai_confidence_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Access Control
    is_confidential = models.BooleanField(default=True)
    shared_with_supervisor = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.user.get_full_name()} - {self.title}"

    class Meta:
        ordering = ['-created_at']


class ClientEmergencyContact(models.Model):
    """
    Emergency contacts for clients
    """
    RELATIONSHIP_CHOICES = [
        ('parent', 'Parent'),
        ('spouse', 'Spouse'),
        ('sibling', 'Sibling'),
        ('child', 'Child'),
        ('friend', 'Friend'),
        ('colleague', 'Colleague'),
        ('doctor', 'Doctor'),
        ('other', 'Other'),
    ]

    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='emergency_contacts')
    name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    phone_number = models.CharField(max_length=17)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    is_primary = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.user.get_full_name()} - {self.name} ({self.relationship})"

    class Meta:
        ordering = ['-is_primary', 'name']


class ClientPreference(models.Model):
    """
    Client preferences and settings
    """
    client = models.OneToOneField(ClientProfile, on_delete=models.CASCADE, related_name='preferences')
    
    # Communication Preferences
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=True)
    reminder_frequency = models.PositiveIntegerField(default=24, help_text="Hours before session")
    
    # Session Preferences
    preferred_session_duration = models.PositiveIntegerField(default=60, help_text="Minutes")
    preferred_time_slots = models.JSONField(default=list, help_text="Preferred time slots")
    
    # Privacy Preferences
    allow_session_recording = models.BooleanField(default=False)
    share_progress_with_family = models.BooleanField(default=False)
    
    # Accessibility
    requires_interpreter = models.BooleanField(default=False)
    interpreter_language = models.CharField(max_length=50, blank=True)
    accessibility_needs = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.user.get_full_name()} - Preferences"