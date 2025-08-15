from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class TherapyCategory(models.Model):
    """
    Categories of therapy services
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Therapy Categories"
        ordering = ['name']


class Competency(models.Model):
    """
    Therapist competencies/skills
    """
    name = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(TherapyCategory, on_delete=models.CASCADE, related_name='competencies')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.category.name})"

    class Meta:
        verbose_name_plural = "Competencies"
        ordering = ['category__name', 'name']


class TherapistProfile(models.Model):
    """
    Extended profile for therapists
    """
    EXPERIENCE_LEVELS = [
        ('beginner', '0-2 years'),
        ('intermediate', '3-5 years'),
        ('experienced', '6-10 years'),
        ('expert', '10+ years'),
    ]

    APPROVAL_STATUS = [
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('suspended', 'Suspended'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='therapist_profile')
    
    # Professional Information
    license_number = models.CharField(max_length=100, unique=True)
    specializations = models.ManyToManyField(TherapyCategory, related_name='therapists')
    competencies = models.ManyToManyField(Competency, through='TherapistCompetency')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVELS, default='beginner')
    years_of_experience = models.PositiveIntegerField(default=0)
    
    # Profile Information
    bio = models.TextField(help_text="Brief description shown to clients")
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    languages_spoken = models.CharField(max_length=200, help_text="Comma-separated languages")
    
    # Availability
    is_available = models.BooleanField(default=True)
    max_clients_per_day = models.PositiveIntegerField(default=8)
    session_duration_minutes = models.PositiveIntegerField(default=60)
    
    # Approval and Status
    approval_status = models.CharField(max_length=20, choices=APPROVAL_STATUS, default='pending')
    approved_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='approved_therapists'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Ratings and Reviews
    average_rating = models.DecimalField(
        max_digits=3, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(0.00), MaxValueValidator(5.00)]
    )
    total_reviews = models.PositiveIntegerField(default=0)
    total_sessions = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dr. {self.user.get_full_name()} - {self.license_number}"

    def get_specialization_names(self):
        return ", ".join([spec.name for spec in self.specializations.all()])

    def is_approved(self):
        return self.approval_status == 'approved'

    class Meta:
        ordering = ['-created_at']


class TherapistCompetency(models.Model):
    """
    Through model for therapist competencies with proficiency levels
    """
    PROFICIENCY_LEVELS = [
        ('basic', 'Basic'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]

    therapist = models.ForeignKey(TherapistProfile, on_delete=models.CASCADE)
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE)
    proficiency_level = models.CharField(max_length=20, choices=PROFICIENCY_LEVELS, default='basic')
    years_of_experience = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['therapist', 'competency']
        ordering = ['competency__category__name', 'competency__name']

    def __str__(self):
        return f"{self.therapist.user.get_full_name()} - {self.competency.name} ({self.proficiency_level})"


class TherapistDocument(models.Model):
    """
    Store therapist certificates and documents
    """
    DOCUMENT_TYPES = [
        ('license', 'Professional License'),
        ('certificate', 'Certificate'),
        ('degree', 'Educational Degree'),
        ('training', 'Training Certificate'),
        ('other', 'Other'),
    ]

    therapist = models.ForeignKey(TherapistProfile, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    document_file = models.FileField(upload_to='therapist_documents/')
    issue_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    issuing_authority = models.CharField(max_length=200, blank=True)
    
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='verified_documents'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.therapist.user.get_full_name()} - {self.title}"

    def is_expired(self):
        if self.expiry_date:
            from django.utils import timezone
            return self.expiry_date < timezone.now().date()
        return False

    class Meta:
        ordering = ['-uploaded_at']


class TherapistAvailability(models.Model):
    """
    Therapist availability schedule
    """
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

    therapist = models.ForeignKey(TherapistProfile, on_delete=models.CASCADE, related_name='availability')
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    
    # For specific date overrides
    specific_date = models.DateField(null=True, blank=True)
    is_holiday = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.specific_date:
            return f"{self.therapist.user.get_full_name()} - {self.specific_date} ({self.start_time}-{self.end_time})"
        return f"{self.therapist.user.get_full_name()} - {self.get_day_of_week_display()} ({self.start_time}-{self.end_time})"

    class Meta:
        unique_together = ['therapist', 'day_of_week', 'start_time', 'specific_date']
        ordering = ['day_of_week', 'start_time']


class SupervisorRelationship(models.Model):
    """
    Supervisor-Supervisee relationships
    """
    supervisor = models.ForeignKey(
        TherapistProfile, 
        on_delete=models.CASCADE, 
        related_name='supervisees'
    )
    supervisee = models.ForeignKey(
        TherapistProfile, 
        on_delete=models.CASCADE, 
        related_name='supervisors'
    )
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.supervisor.user.get_full_name()} supervises {self.supervisee.user.get_full_name()}"

    class Meta:
        unique_together = ['supervisor', 'supervisee']
        ordering = ['-created_at']


class TherapistReview(models.Model):
    """
    Client reviews for therapists
    """
    therapist = models.ForeignKey(TherapistProfile, on_delete=models.CASCADE, related_name='reviews')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='therapist_reviews')
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review_text = models.TextField(blank=True)
    is_anonymous = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        client_name = "Anonymous" if self.is_anonymous else self.client.get_full_name()
        return f"{client_name} - {self.therapist.user.get_full_name()} ({self.rating}/5)"

    class Meta:
        unique_together = ['therapist', 'client']
        ordering = ['-created_at']