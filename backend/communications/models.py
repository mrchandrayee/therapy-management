from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class EmailTemplate(models.Model):
    """
    Email templates for various communications
    """
    TEMPLATE_TYPES = [
        ('session_confirmation', 'Session Confirmation'),
        ('session_reminder_24h', '24 Hour Reminder'),
        ('session_reminder_1h', '1 Hour Reminder'),
        ('session_cancellation', 'Session Cancellation'),
        ('coupon_delivery', 'Coupon Delivery'),
        ('payment_confirmation', 'Payment Confirmation'),
        ('therapist_approval', 'Therapist Approval'),
        ('welcome_client', 'Welcome Client'),
        ('welcome_therapist', 'Welcome Therapist'),
        ('password_reset', 'Password Reset'),
        ('grievance_response', 'Grievance Response'),
    ]

    name = models.CharField(max_length=100)
    template_type = models.CharField(max_length=30, choices=TEMPLATE_TYPES, unique=True)
    subject = models.CharField(max_length=200)
    html_content = models.TextField()
    text_content = models.TextField(blank=True)
    
    # Template variables documentation
    available_variables = models.JSONField(
        default=list, 
        help_text="List of available template variables"
    )
    
    is_active = models.BooleanField(default=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.template_type})"

    class Meta:
        ordering = ['template_type']


class EmailLog(models.Model):
    """
    Track all emails sent from the system
    """
    EMAIL_STATUS = [
        ('queued', 'Queued'),
        ('sending', 'Sending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('opened', 'Opened'),
        ('clicked', 'Clicked'),
        ('failed', 'Failed'),
        ('bounced', 'Bounced'),
        ('complained', 'Spam Complaint'),
    ]

    email_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    # Recipients
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sent_emails')
    recipient = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='received_emails')
    recipient_email = models.EmailField()
    
    # Email Content
    subject = models.CharField(max_length=200)
    html_content = models.TextField()
    text_content = models.TextField(blank=True)
    
    # Template Used
    template = models.ForeignKey(EmailTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Context Data
    context_data = models.JSONField(default=dict, blank=True)
    
    # Related Objects
    session = models.ForeignKey(
        'sessions.TherapySession', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='email_logs'
    )
    payment = models.ForeignKey(
        'payments.Payment', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='email_logs'
    )
    coupon = models.ForeignKey(
        'coupons.IndividualCoupon', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='email_logs'
    )
    
    # Delivery Status
    status = models.CharField(max_length=20, choices=EMAIL_STATUS, default='queued')
    
    # External Provider Details
    provider_message_id = models.CharField(max_length=200, blank=True)
    provider_response = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    queued_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)
    failed_at = models.DateTimeField(null=True, blank=True)
    
    # Error Details
    error_message = models.TextField(blank=True)
    retry_count = models.PositiveIntegerField(default=0)
    max_retries = models.PositiveIntegerField(default=3)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Email to {self.recipient_email} - {self.subject} ({self.status})"

    def can_retry(self):
        return self.status == 'failed' and self.retry_count < self.max_retries

    class Meta:
        ordering = ['-created_at']