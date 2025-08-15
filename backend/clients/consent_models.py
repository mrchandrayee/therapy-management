# Consent Management Models for DPDP Act Compliance

from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class ConsentDocument(models.Model):
    """
    Consent documents that clients must agree to
    """
    DOCUMENT_TYPES = [
        ('terms_of_service', 'Terms of Service'),
        ('privacy_policy', 'Privacy Policy'),
        ('treatment_consent', 'Treatment Consent'),
        ('data_processing', 'Data Processing Consent'),
        ('recording_consent', 'Session Recording Consent'),
        ('research_consent', 'Research Participation Consent'),
    ]

    document_type = models.CharField(max_length=30, choices=DOCUMENT_TYPES, unique=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    version = models.CharField(max_length=20, default='1.0')
    
    # Compliance
    is_mandatory = models.BooleanField(default=True)
    requires_session_consent = models.BooleanField(default=False, help_text="Must be checked before every session")
    
    # Validity
    effective_from = models.DateTimeField()
    effective_until = models.DateTimeField(null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} v{self.version}"

    class Meta:
        ordering = ['-created_at']


class ClientConsent(models.Model):
    """
    Track client consent for various documents
    """
    client = models.ForeignKey(
        'clients.ClientProfile', 
        on_delete=models.CASCADE, 
        related_name='consents'
    )
    document = models.ForeignKey(ConsentDocument, on_delete=models.CASCADE)
    
    # Consent Details
    consent_given = models.BooleanField(default=False)
    consent_timestamp = models.DateTimeField()
    
    # Document Interaction
    document_opened = models.BooleanField(default=False)
    document_opened_at = models.DateTimeField(null=True, blank=True)
    time_spent_reading = models.PositiveIntegerField(default=0, help_text="Seconds spent reading")
    
    # Technical Details
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    
    # Session-specific consent (for documents that require per-session consent)
    session = models.ForeignKey(
        'sessions.TherapySession', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='consents'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.client.user.get_full_name()} - {self.document.title} ({'✓' if self.consent_given else '✗'})"

    class Meta:
        unique_together = ['client', 'document', 'session']
        ordering = ['-created_at']


class ConsentWithdrawal(models.Model):
    """
    Track consent withdrawals for DPDP compliance
    """
    WITHDRAWAL_REASONS = [
        ('no_longer_needed', 'No Longer Needed'),
        ('privacy_concerns', 'Privacy Concerns'),
        ('data_misuse', 'Data Misuse Concerns'),
        ('service_termination', 'Service Termination'),
        ('other', 'Other'),
    ]

    client_consent = models.OneToOneField(
        ClientConsent, 
        on_delete=models.CASCADE, 
        related_name='withdrawal'
    )
    
    reason = models.CharField(max_length=30, choices=WITHDRAWAL_REASONS)
    reason_description = models.TextField(blank=True)
    
    # Withdrawal Details
    withdrawn_at = models.DateTimeField()
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    
    # Data Handling
    data_deletion_requested = models.BooleanField(default=False)
    data_deleted_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Withdrawal - {self.client_consent}"

    class Meta:
        ordering = ['-created_at']