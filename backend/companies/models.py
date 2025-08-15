from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Company(models.Model):
    """
    Corporate clients and organizations
    """
    COMPANY_TYPES = [
        ('private', 'Private Company'),
        ('public', 'Public Company'),
        ('ngo', 'NGO'),
        ('government', 'Government Organization'),
        ('startup', 'Startup'),
        ('other', 'Other'),
    ]

    AGREEMENT_STATUS = [
        ('draft', 'Draft'),
        ('pending', 'Pending Approval'),
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('terminated', 'Terminated'),
    ]

    # Basic Information
    name = models.CharField(max_length=200, unique=True)
    company_type = models.CharField(max_length=20, choices=COMPANY_TYPES, default='private')
    registration_number = models.CharField(max_length=100, unique=True)
    tax_id = models.CharField(max_length=50, blank=True)
    
    # Contact Information
    contact_person_name = models.CharField(max_length=100)
    contact_person_designation = models.CharField(max_length=100)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=17)
    
    # Address
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    country = models.CharField(max_length=100, default='India')
    
    # Location for geotagging
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Agreement Details
    agreement_status = models.CharField(max_length=20, choices=AGREEMENT_STATUS, default='draft')
    agreement_start_date = models.DateField(null=True, blank=True)
    agreement_end_date = models.DateField(null=True, blank=True)
    agreement_document = models.FileField(upload_to='company_agreements/', blank=True)
    
    # Discount and Pricing
    discount_percentage = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0.00,
        validators=[MinValueValidator(0.00), MaxValueValidator(100.00)]
    )
    max_sessions_per_employee = models.PositiveIntegerField(default=12)
    max_employees_covered = models.PositiveIntegerField(null=True, blank=True)
    
    # Financial
    total_amount_committed = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    amount_utilized = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # Status
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_companies')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def get_remaining_amount(self):
        return self.total_amount_committed - self.amount_utilized

    def get_utilization_percentage(self):
        if self.total_amount_committed > 0:
            return (self.amount_utilized / self.total_amount_committed) * 100
        return 0

    def is_agreement_active(self):
        if self.agreement_status != 'active':
            return False
        
        if self.agreement_end_date:
            from django.utils import timezone
            return self.agreement_end_date >= timezone.now().date()
        
        return True

    class Meta:
        verbose_name_plural = "Companies"
        ordering = ['name']


class CompanyContact(models.Model):
    """
    Additional contacts for companies
    """
    CONTACT_TYPES = [
        ('primary', 'Primary Contact'),
        ('hr', 'HR Contact'),
        ('finance', 'Finance Contact'),
        ('admin', 'Admin Contact'),
        ('technical', 'Technical Contact'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='contacts')
    contact_type = models.CharField(max_length=20, choices=CONTACT_TYPES)
    name = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=17)
    is_primary = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company.name} - {self.name} ({self.contact_type})"

    class Meta:
        ordering = ['-is_primary', 'name']


class CompanyCoupon(models.Model):
    """
    Coupons generated for company employees
    """
    COUPON_STATUS = [
        ('generated', 'Generated'),
        ('sent', 'Sent to Employee'),
        ('used', 'Used'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='coupons')
    coupon_code = models.CharField(max_length=50, unique=True)
    
    # Employee Information
    employee_name = models.CharField(max_length=100)
    employee_email = models.EmailField()
    employee_id = models.CharField(max_length=50, blank=True)
    
    # Coupon Details
    discount_percentage = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        validators=[MinValueValidator(0.00), MaxValueValidator(100.00)]
    )
    max_sessions = models.PositiveIntegerField(default=1)
    sessions_used = models.PositiveIntegerField(default=0)
    
    # Validity
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    
    # Status
    status = models.CharField(max_length=20, choices=COUPON_STATUS, default='generated')
    sent_at = models.DateTimeField(null=True, blank=True)
    used_at = models.DateTimeField(null=True, blank=True)
    
    # Usage tracking
    used_by = models.ForeignKey(
        'clients.ClientProfile', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='used_coupons'
    )
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_coupons')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company.name} - {self.coupon_code} ({self.employee_name})"

    def is_valid(self):
        from django.utils import timezone
        now = timezone.now()
        return (
            self.status in ['generated', 'sent'] and
            self.valid_from <= now <= self.valid_until and
            self.sessions_used < self.max_sessions
        )

    def get_remaining_sessions(self):
        return self.max_sessions - self.sessions_used

    class Meta:
        ordering = ['-created_at']


class CompanyReport(models.Model):
    """
    Monthly reports for companies
    """
    REPORT_TYPES = [
        ('monthly', 'Monthly Report'),
        ('quarterly', 'Quarterly Report'),
        ('annual', 'Annual Report'),
        ('custom', 'Custom Report'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='reports')
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES, default='monthly')
    
    # Report Period
    period_start = models.DateField()
    period_end = models.DateField()
    
    # Statistics
    total_employees_registered = models.PositiveIntegerField(default=0)
    total_sessions_conducted = models.PositiveIntegerField(default=0)
    total_amount_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_discount_given = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # Therapist mapping
    therapists_involved = models.ManyToManyField(
        'therapists.TherapistProfile', 
        related_name='company_reports'
    )
    
    # Report file
    report_file = models.FileField(upload_to='company_reports/', blank=True)
    
    # Status
    is_generated = models.BooleanField(default=False)
    generated_at = models.DateTimeField(null=True, blank=True)
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='generated_reports')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company.name} - {self.report_type} ({self.period_start} to {self.period_end})"

    class Meta:
        unique_together = ['company', 'report_type', 'period_start', 'period_end']
        ordering = ['-period_end']


class CompanyEmployee(models.Model):
    """
    Track company employees who are clients
    """
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='company_employees')
    client = models.ForeignKey(
        'clients.ClientProfile', 
        on_delete=models.CASCADE, 
        related_name='company_associations'
    )
    employee_id = models.CharField(max_length=50)
    department = models.CharField(max_length=100, blank=True)
    designation = models.CharField(max_length=100, blank=True)
    
    # Entitlements
    sessions_entitled = models.PositiveIntegerField(default=12)
    sessions_used = models.PositiveIntegerField(default=0)
    discount_percentage = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0.00
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    joined_date = models.DateField()
    left_date = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company.name} - {self.client.user.get_full_name()} ({self.employee_id})"

    def get_remaining_sessions(self):
        return self.sessions_entitled - self.sessions_used

    def can_book_session(self):
        return self.is_active and self.get_remaining_sessions() > 0

    class Meta:
        unique_together = ['company', 'client']
        ordering = ['-created_at']


class CompanyAgreement(models.Model):
    """
    Detailed company agreements and terms
    """
    AGREEMENT_TYPES = [
        ('standard', 'Standard Agreement'),
        ('custom', 'Custom Agreement'),
        ('pilot', 'Pilot Program'),
        ('renewal', 'Renewal Agreement'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='agreements')
    agreement_type = models.CharField(max_length=20, choices=AGREEMENT_TYPES, default='standard')
    
    # Agreement Details
    title = models.CharField(max_length=200)
    description = models.TextField()
    terms_and_conditions = models.TextField()
    
    # Financial Terms
    total_contract_value = models.DecimalField(max_digits=12, decimal_places=2)
    payment_terms = models.TextField()
    discount_structure = models.JSONField(default=dict)
    
    # Service Terms
    services_included = models.JSONField(default=list)
    service_level_agreement = models.TextField()
    
    # Validity
    effective_date = models.DateField()
    expiry_date = models.DateField()
    auto_renewal = models.BooleanField(default=False)
    renewal_notice_period = models.PositiveIntegerField(default=30, help_text="Days")
    
    # Approval
    is_approved = models.BooleanField(default=False)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='approved_agreements')
    approved_at = models.DateTimeField(null=True, blank=True)
    
    # Documents
    signed_agreement = models.FileField(upload_to='signed_agreements/', blank=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_agreements')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company.name} - {self.title}"

    def is_active(self):
        from django.utils import timezone
        today = timezone.now().date()
        return (
            self.is_approved and
            self.effective_date <= today <= self.expiry_date
        )

    class Meta:
        ordering = ['-created_at']