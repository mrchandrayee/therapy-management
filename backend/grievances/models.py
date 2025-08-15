from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class GrievanceCategory(models.Model):
    """
    Categories for different types of grievances
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Grievance Categories"
        ordering = ['name']


class Grievance(models.Model):
    """
    Grievance system for clients and therapists
    """
    GRIEVANCE_STATUS = [
        ('submitted', 'Submitted'),
        ('acknowledged', 'Acknowledged'),
        ('under_review', 'Under Review'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
        ('escalated', 'Escalated'),
    ]

    PRIORITY_LEVELS = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    GRIEVANCE_TYPES = [
        ('service_quality', 'Service Quality'),
        ('technical_issue', 'Technical Issue'),
        ('billing_issue', 'Billing Issue'),
        ('therapist_conduct', 'Therapist Conduct'),
        ('privacy_concern', 'Privacy Concern'),
        ('accessibility', 'Accessibility'),
        ('other', 'Other'),
    ]

    # Basic Information
    grievance_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Categorization
    category = models.ForeignKey(GrievanceCategory, on_delete=models.SET_NULL, null=True)
    grievance_type = models.CharField(max_length=30, choices=GRIEVANCE_TYPES)
    priority = models.CharField(max_length=10, choices=PRIORITY_LEVELS, default='medium')
    
    # Parties Involved
    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submitted_grievances')
    against_user = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='grievances_against'
    )
    
    # Related Objects
    session = models.ForeignKey(
        'sessions.TherapySession', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='grievances'
    )
    payment = models.ForeignKey(
        'payments.Payment', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='grievances'
    )
    
    # Status and Assignment
    status = models.CharField(max_length=20, choices=GRIEVANCE_STATUS, default='submitted')
    assigned_to = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='assigned_grievances'
    )
    
    # Resolution
    resolution = models.TextField(blank=True)
    resolved_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='resolved_grievances'
    )
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    # Timestamps
    submitted_at = models.DateTimeField(auto_now_add=True)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    
    # Satisfaction
    satisfaction_rating = models.PositiveIntegerField(null=True, blank=True)
    satisfaction_feedback = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Grievance #{str(self.grievance_id)[:8]} - {self.title}"

    def is_overdue(self):
        if self.due_date and self.status not in ['resolved', 'closed']:
            from django.utils import timezone
            return timezone.now() > self.due_date
        return False

    class Meta:
        ordering = ['-created_at']


class GrievanceComment(models.Model):
    """
    Comments and updates on grievances
    """
    grievance = models.ForeignKey(Grievance, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    
    # Visibility
    is_internal = models.BooleanField(default=False, help_text="Internal comments not visible to submitter")
    is_resolution = models.BooleanField(default=False, help_text="Mark as resolution comment")
    
    # Attachments
    attachment = models.FileField(upload_to='grievance_attachments/', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment on {self.grievance.grievance_id} by {self.author.get_full_name()}"

    class Meta:
        ordering = ['created_at']


class GrievanceAttachment(models.Model):
    """
    File attachments for grievances
    """
    grievance = models.ForeignKey(Grievance, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='grievance_files/')
    filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()
    content_type = models.CharField(max_length=100)
    
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.filename} - {self.grievance.grievance_id}"

    class Meta:
        ordering = ['-uploaded_at']