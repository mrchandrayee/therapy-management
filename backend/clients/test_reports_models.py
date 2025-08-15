# Test Reports and Document Management Models

from django.db import models
from django.contrib.auth import get_user_model
import uuid
import os

User = get_user_model()


class TestReportCategory(models.Model):
    """
    Categories for different types of test reports
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Test Report Categories"
        ordering = ['name']


class TestReport(models.Model):
    """
    Client test reports and medical documents
    """
    REPORT_TYPES = [
        ('psychological_assessment', 'Psychological Assessment'),
        ('medical_report', 'Medical Report'),
        ('lab_test', 'Laboratory Test'),
        ('imaging', 'Medical Imaging'),
        ('psychiatric_evaluation', 'Psychiatric Evaluation'),
        ('therapy_notes', 'Previous Therapy Notes'),
        ('prescription', 'Prescription'),
        ('other', 'Other'),
    ]

    REPORT_STATUS = [
        ('uploaded', 'Uploaded'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('requires_clarification', 'Requires Clarification'),
        ('archived', 'Archived'),
    ]

    ACCESS_LEVELS = [
        ('client_only', 'Client Only'),
        ('client_therapist', 'Client & Therapist'),
        ('client_therapist_admin', 'Client, Therapist & Admin'),
        ('admin_only', 'Admin Only'),
    ]

    # Basic Information
    report_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    client = models.ForeignKey(
        'clients.ClientProfile', 
        on_delete=models.CASCADE, 
        related_name='test_reports'
    )
    
    # Report Details
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    report_type = models.CharField(max_length=30, choices=REPORT_TYPES)
    category = models.ForeignKey(TestReportCategory, on_delete=models.SET_NULL, null=True, blank=True)
    
    # File Information
    file = models.FileField(upload_to='test_reports/')
    original_filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField(help_text="File size in bytes")
    file_type = models.CharField(max_length=50)
    
    # Medical Information
    test_date = models.DateField(null=True, blank=True)
    issuing_authority = models.CharField(max_length=200, blank=True, help_text="Hospital/Lab/Doctor name")
    doctor_name = models.CharField(max_length=100, blank=True)
    
    # Status and Access
    status = models.CharField(max_length=30, choices=REPORT_STATUS, default='uploaded')
    access_level = models.CharField(max_length=30, choices=ACCESS_LEVELS, default='client_therapist_admin')
    
    # Sharing
    shared_with_therapist = models.BooleanField(default=True)
    shared_with_admin = models.BooleanField(default=True)
    therapist_can_download = models.BooleanField(default=True)
    admin_can_download = models.BooleanField(default=True)
    
    # Review Information
    reviewed_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='reviewed_reports'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    review_notes = models.TextField(blank=True)
    
    # Metadata
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_reports')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.user.get_full_name()} - {self.title}"

    def get_file_extension(self):
        """Get file extension"""
        return os.path.splitext(self.original_filename)[1].lower()

    def is_image(self):
        """Check if file is an image"""
        image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']
        return self.get_file_extension() in image_extensions

    def is_pdf(self):
        """Check if file is a PDF"""
        return self.get_file_extension() == '.pdf'

    def can_be_viewed_by(self, user):
        """Check if user can view this report"""
        if user == self.client.user:
            return True
        
        if hasattr(user, 'therapist_profile') and self.shared_with_therapist:
            # Check if this therapist is treating this client
            return self.client.therapist_relationships.filter(
                therapist=user.therapist_profile, 
                is_active=True
            ).exists()
        
        if user.has_role('Admin') and self.shared_with_admin:
            return True
        
        return False

    def can_be_downloaded_by(self, user):
        """Check if user can download this report"""
        if not self.can_be_viewed_by(user):
            return False
        
        if user == self.client.user:
            return True
        
        if hasattr(user, 'therapist_profile'):
            return self.therapist_can_download
        
        if user.has_role('Admin'):
            return self.admin_can_download
        
        return False

    class Meta:
        ordering = ['-uploaded_at']


class ReportAccessLog(models.Model):
    """
    Track who accesses test reports for audit purposes
    """
    ACCESS_TYPES = [
        ('view', 'Viewed'),
        ('download', 'Downloaded'),
        ('share', 'Shared'),
        ('print', 'Printed'),
    ]

    report = models.ForeignKey(TestReport, on_delete=models.CASCADE, related_name='access_logs')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Access Details
    access_type = models.CharField(max_length=20, choices=ACCESS_TYPES)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    
    # Session Information
    session = models.ForeignKey(
        'sessions.TherapySession', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        help_text="If accessed during a therapy session"
    )
    
    accessed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name()} {self.access_type} {self.report.title}"

    class Meta:
        ordering = ['-accessed_at']


class ReportRequest(models.Model):
    """
    Requests for specific test reports from clients
    """
    REQUEST_STATUS = [
        ('requested', 'Requested'),
        ('acknowledged', 'Acknowledged'),
        ('fulfilled', 'Fulfilled'),
        ('cancelled', 'Cancelled'),
        ('not_available', 'Not Available'),
    ]

    client = models.ForeignKey(
        'clients.ClientProfile', 
        on_delete=models.CASCADE, 
        related_name='report_requests'
    )
    therapist = models.ForeignKey(
        'therapists.TherapistProfile', 
        on_delete=models.CASCADE, 
        related_name='client_report_requests'
    )
    
    # Request Details
    requested_report_type = models.CharField(max_length=30, choices=TestReport.REPORT_TYPES)
    specific_tests = models.TextField(help_text="Specific tests or reports requested")
    reason = models.TextField(help_text="Why this report is needed for therapy")
    urgency = models.CharField(
        max_length=20, 
        choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High'), ('urgent', 'Urgent')],
        default='medium'
    )
    
    # Status
    status = models.CharField(max_length=20, choices=REQUEST_STATUS, default='requested')
    
    # Response
    response_notes = models.TextField(blank=True)
    fulfilled_report = models.ForeignKey(
        TestReport, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='fulfilling_requests'
    )
    
    # Timestamps
    requested_at = models.DateTimeField(auto_now_add=True)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    fulfilled_at = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Report Request - {self.client.user.get_full_name()} ({self.requested_report_type})"

    def is_overdue(self):
        """Check if request is overdue"""
        if self.due_date and self.status not in ['fulfilled', 'cancelled']:
            from django.utils import timezone
            return timezone.now() > self.due_date
        return False

    class Meta:
        ordering = ['-requested_at']


class ReportTemplate(models.Model):
    """
    Templates for generating standardized reports
    """
    TEMPLATE_TYPES = [
        ('assessment_summary', 'Assessment Summary'),
        ('progress_report', 'Progress Report'),
        ('treatment_plan', 'Treatment Plan'),
        ('discharge_summary', 'Discharge Summary'),
    ]

    name = models.CharField(max_length=100)
    template_type = models.CharField(max_length=30, choices=TEMPLATE_TYPES)
    description = models.TextField(blank=True)
    
    # Template Content
    template_content = models.TextField(help_text="Template with placeholders")
    required_fields = models.JSONField(default=list, help_text="List of required fields")
    optional_fields = models.JSONField(default=list, help_text="List of optional fields")
    
    # Usage
    is_active = models.BooleanField(default=True)
    usage_count = models.PositiveIntegerField(default=0)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.template_type})"

    class Meta:
        ordering = ['template_type', 'name']


class GeneratedReport(models.Model):
    """
    Reports generated using templates
    """
    template = models.ForeignKey(ReportTemplate, on_delete=models.CASCADE, related_name='generated_reports')
    client = models.ForeignKey(
        'clients.ClientProfile', 
        on_delete=models.CASCADE, 
        related_name='generated_reports'
    )
    therapist = models.ForeignKey(
        'therapists.TherapistProfile', 
        on_delete=models.CASCADE, 
        related_name='generated_reports'
    )
    
    # Report Content
    title = models.CharField(max_length=200)
    content = models.TextField()
    field_data = models.JSONField(default=dict, help_text="Data used to fill template")
    
    # File
    report_file = models.FileField(upload_to='generated_reports/', blank=True)
    
    # Status
    is_finalized = models.BooleanField(default=False)
    finalized_at = models.DateTimeField(null=True, blank=True)
    
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='generated_reports')
    generated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Generated Report - {self.title} for {self.client.user.get_full_name()}"

    class Meta:
        ordering = ['-generated_at']