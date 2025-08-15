# Client Entry and Company Validation Models

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
import uuid

User = get_user_model()


class ClientEntryValidation(models.Model):
    """
    Validate client entry information and requirements
    """
    VALIDATION_STATUS = [
        ('pending', 'Pending Validation'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('requires_documents', 'Requires Additional Documents'),
    ]

    client = models.OneToOneField(
        'clients.ClientProfile', 
        on_delete=models.CASCADE, 
        related_name='entry_validation'
    )
    
    # Required Information Status
    name_provided = models.BooleanField(default=False)
    mobile_provided = models.BooleanField(default=False)
    email_provided = models.BooleanField(default=False)
    pincode_provided = models.BooleanField(default=False)
    
    # Optional Information Status (may become mandatory)
    id_document_provided = models.BooleanField(default=False)
    address_provided = models.BooleanField(default=False)
    
    # Validation Results
    mobile_verified = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    id_document_verified = models.BooleanField(default=False)
    
    # Overall Status
    validation_status = models.CharField(max_length=30, choices=VALIDATION_STATUS, default='pending')
    validation_notes = models.TextField(blank=True)
    
    # Validation Details
    validated_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='validated_clients'
    )
    validated_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Validation - {self.client.user.get_full_name()} ({self.validation_status})"

    def is_entry_complete(self):
        """Check if all required entry information is provided"""
        return all([
            self.name_provided,
            self.mobile_provided,
            self.email_provided,
            self.pincode_provided
        ])

    def can_book_sessions(self):
        """Check if client can book sessions based on validation status"""
        return self.validation_status == 'approved' and self.is_entry_complete()

    class Meta:
        ordering = ['-created_at']


class CompanyEmployeeValidation(models.Model):
    """
    Validate company employees accessing corporate services
    """
    VALIDATION_STATUS = [
        ('pending', 'Pending Validation'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]

    client = models.OneToOneField(
        'clients.ClientProfile', 
        on_delete=models.CASCADE, 
        related_name='company_validation'
    )
    company = models.ForeignKey(
        'companies.Company', 
        on_delete=models.CASCADE, 
        related_name='employee_validations'
    )
    
    # Employee Details
    employee_id = models.CharField(max_length=50)
    employee_email = models.EmailField()
    department = models.CharField(max_length=100, blank=True)
    designation = models.CharField(max_length=100, blank=True)
    
    # Validation Method
    validation_method = models.CharField(max_length=50, default='email_domain')  # email_domain, employee_id, manual
    
    # Company ID Validation
    company_id_provided = models.CharField(max_length=100, blank=True)
    company_id_verified = models.BooleanField(default=False)
    
    # Email Domain Validation
    email_domain_matches = models.BooleanField(default=False)
    
    # Status
    validation_status = models.CharField(max_length=30, choices=VALIDATION_STATUS, default='pending')
    validation_notes = models.TextField(blank=True)
    
    # Validation Details
    validated_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='validated_employees'
    )
    validated_at = models.DateTimeField(null=True, blank=True)
    
    # Expiry (for time-limited validations)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Employee Validation - {self.client.user.get_full_name()} @ {self.company.name}"

    def is_valid(self):
        """Check if validation is still valid"""
        if self.validation_status != 'approved':
            return False
        
        if self.expires_at:
            from django.utils import timezone
            return timezone.now() < self.expires_at
        
        return True

    def can_access_corporate_benefits(self):
        """Check if employee can access corporate benefits"""
        return self.is_valid() and self.company.is_agreement_active()

    class Meta:
        unique_together = ['company', 'employee_id']
        ordering = ['-created_at']


class ClientDataRetention(models.Model):
    """
    Track client data retention for DPDP Act compliance
    """
    RETENTION_STATUS = [
        ('active', 'Active'),
        ('inactive_warning', 'Inactive - Warning Sent'),
        ('inactive_final', 'Inactive - Final Notice'),
        ('disabled', 'Disabled'),
        ('data_deleted', 'Data Deleted'),
    ]

    client = models.OneToOneField(
        'clients.ClientProfile', 
        on_delete=models.CASCADE, 
        related_name='data_retention'
    )
    
    # Activity Tracking
    last_session_date = models.DateTimeField(null=True, blank=True)
    last_login_date = models.DateTimeField(null=True, blank=True)
    last_activity_date = models.DateTimeField(null=True, blank=True)
    
    # Retention Status
    retention_status = models.CharField(max_length=30, choices=RETENTION_STATUS, default='active')
    inactive_since = models.DateTimeField(null=True, blank=True)
    
    # Notifications
    warning_sent_at = models.DateTimeField(null=True, blank=True)
    final_notice_sent_at = models.DateTimeField(null=True, blank=True)
    
    # Data Deletion
    scheduled_deletion_date = models.DateTimeField(null=True, blank=True)
    data_deleted_at = models.DateTimeField(null=True, blank=True)
    deletion_reason = models.TextField(blank=True)
    
    # Manual Override
    retention_extended = models.BooleanField(default=False)
    extension_reason = models.TextField(blank=True)
    extended_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='extended_retentions'
    )
    extended_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Data Retention - {self.client.user.get_full_name()} ({self.retention_status})"

    def days_since_last_activity(self):
        """Calculate days since last activity"""
        if not self.last_activity_date:
            return None
        
        from django.utils import timezone
        from datetime import timedelta
        
        return (timezone.now() - self.last_activity_date).days

    def should_be_disabled(self):
        """Check if client should be disabled per DPDP Act (3+ years inactive)"""
        days_inactive = self.days_since_last_activity()
        return days_inactive and days_inactive >= 1095  # 3 years

    def update_activity(self):
        """Update last activity timestamp"""
        from django.utils import timezone
        self.last_activity_date = timezone.now()
        if self.retention_status == 'disabled':
            self.retention_status = 'active'
        self.save()

    class Meta:
        ordering = ['-created_at']