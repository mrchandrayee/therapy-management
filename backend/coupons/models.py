from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
import secrets
import string

User = get_user_model()


class CouponSystem(models.Model):
    """
    General coupon system for individuals, companies, and NGOs
    """
    COUPON_TYPES = [
        ('individual', 'Individual Coupon'),
        ('company', 'Company Coupon'),
        ('ngo', 'NGO Coupon'),
        ('promotional', 'Promotional Coupon'),
        ('referral', 'Referral Coupon'),
    ]

    DISCOUNT_TYPES = [
        ('percentage', 'Percentage Discount'),
        ('fixed_amount', 'Fixed Amount Discount'),
        ('free_sessions', 'Free Sessions'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('expired', 'Expired'),
        ('used_up', 'Used Up'),
    ]

    # Basic Information
    coupon_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    coupon_type = models.CharField(max_length=20, choices=COUPON_TYPES)
    
    # Discount Configuration
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES)
    discount_value = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0.00), MaxValueValidator(100.00)]
    )
    
    # Usage Limits
    max_total_usage = models.PositiveIntegerField(null=True, blank=True, help_text="Total times this coupon can be used")
    max_usage_per_user = models.PositiveIntegerField(default=1, help_text="Max usage per user")
    current_usage = models.PositiveIntegerField(default=0)
    
    # Validity
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    
    # Conditions
    minimum_session_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    applicable_therapists = models.ManyToManyField(
        'therapists.TherapistProfile', 
        blank=True, 
        related_name='applicable_coupons'
    )
    
    # Company/NGO Association
    company = models.ForeignKey(
        'companies.Company', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='coupon_systems'
    )
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_coupon_systems')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.coupon_type})"

    def is_valid(self):
        from django.utils import timezone
        now = timezone.now()
        return (
            self.status == 'active' and
            self.valid_from <= now <= self.valid_until and
            (self.max_total_usage is None or self.current_usage < self.max_total_usage)
        )

    def generate_coupon_codes(self, count=1):
        """Generate individual coupon codes for this system"""
        codes = []
        for _ in range(count):
            code = IndividualCoupon.objects.create(
                coupon_system=self,
                code=self._generate_unique_code()
            )
            codes.append(code)
        return codes

    def _generate_unique_code(self):
        """Generate a unique coupon code"""
        while True:
            code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(8))
            if not IndividualCoupon.objects.filter(code=code).exists():
                return code

    class Meta:
        ordering = ['-created_at']


class IndividualCoupon(models.Model):
    """
    Individual coupon codes generated from coupon systems
    """
    COUPON_STATUS = [
        ('generated', 'Generated'),
        ('sent', 'Sent'),
        ('used', 'Used'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]

    coupon_system = models.ForeignKey(CouponSystem, on_delete=models.CASCADE, related_name='individual_coupons')
    code = models.CharField(max_length=20, unique=True)
    
    # Recipient Information
    recipient_email = models.EmailField(blank=True)
    recipient_name = models.CharField(max_length=100, blank=True)
    recipient_phone = models.CharField(max_length=17, blank=True)
    
    # Company Employee Details (if applicable)
    employee_id = models.CharField(max_length=50, blank=True)
    department = models.CharField(max_length=100, blank=True)
    
    # Usage Tracking
    status = models.CharField(max_length=20, choices=COUPON_STATUS, default='generated')
    times_used = models.PositiveIntegerField(default=0)
    
    # Usage Details
    used_by = models.ForeignKey(
        'clients.ClientProfile', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='used_individual_coupons'
    )
    used_at = models.DateTimeField(null=True, blank=True)
    
    # Email Tracking
    email_sent_at = models.DateTimeField(null=True, blank=True)
    email_opened_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.coupon_system.name}"

    def is_valid(self):
        return (
            self.status in ['generated', 'sent'] and
            self.coupon_system.is_valid() and
            self.times_used < self.coupon_system.max_usage_per_user
        )

    def can_be_used_by(self, client):
        if not self.is_valid():
            return False
        
        # Check if this specific coupon can be used by this client
        if self.used_by and self.used_by != client:
            return False
            
        return True

    def mark_as_used(self, client):
        """Mark coupon as used by a client"""
        if self.can_be_used_by(client):
            from django.utils import timezone
            self.used_by = client
            self.used_at = timezone.now()
            self.times_used += 1
            if self.times_used >= self.coupon_system.max_usage_per_user:
                self.status = 'used'
            self.save()
            
            # Update coupon system usage
            self.coupon_system.current_usage += 1
            self.coupon_system.save()
            
            return True
        return False

    class Meta:
        ordering = ['-created_at']


class CouponEmailLog(models.Model):
    """
    Track coupon emails sent to recipients
    """
    EMAIL_STATUS = [
        ('queued', 'Queued'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('opened', 'Opened'),
        ('clicked', 'Clicked'),
        ('failed', 'Failed'),
        ('bounced', 'Bounced'),
    ]

    coupon = models.ForeignKey(IndividualCoupon, on_delete=models.CASCADE, related_name='email_logs')
    
    # Email Details
    recipient_email = models.EmailField()
    subject = models.CharField(max_length=200)
    email_content = models.TextField()
    
    # Tracking
    status = models.CharField(max_length=20, choices=EMAIL_STATUS, default='queued')
    email_provider_id = models.CharField(max_length=100, blank=True)
    
    # Timestamps
    queued_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)
    failed_at = models.DateTimeField(null=True, blank=True)
    
    # Error Details
    error_message = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Email to {self.recipient_email} - {self.coupon.code} ({self.status})"

    class Meta:
        ordering = ['-created_at']


class CouponUsageReport(models.Model):
    """
    Monthly/periodic reports on coupon usage
    """
    REPORT_TYPES = [
        ('monthly', 'Monthly Report'),
        ('quarterly', 'Quarterly Report'),
        ('annual', 'Annual Report'),
        ('custom', 'Custom Period Report'),
    ]

    # Report Details
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    period_start = models.DateField()
    period_end = models.DateField()
    
    # Filters
    coupon_system = models.ForeignKey(
        CouponSystem, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='usage_reports'
    )
    company = models.ForeignKey(
        'companies.Company', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='coupon_reports'
    )
    
    # Statistics
    total_coupons_generated = models.PositiveIntegerField(default=0)
    total_coupons_sent = models.PositiveIntegerField(default=0)
    total_coupons_used = models.PositiveIntegerField(default=0)
    total_discount_given = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_sessions_booked = models.PositiveIntegerField(default=0)
    
    # Report File
    report_file = models.FileField(upload_to='coupon_reports/', blank=True)
    
    # Generation Details
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='generated_coupon_reports')
    generated_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Coupon Report - {self.report_type} ({self.period_start} to {self.period_end})"

    class Meta:
        ordering = ['-created_at']