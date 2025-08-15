from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid

User = get_user_model()


class Payment(models.Model):
    """
    Payment records for therapy sessions
    """
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
        ('partially_refunded', 'Partially Refunded'),
    ]

    PAYMENT_METHODS = [
        ('razorpay', 'Razorpay'),
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
        ('cash', 'Cash'),
        ('company_billing', 'Company Billing'),
        ('coupon', 'Coupon/Discount'),
    ]

    PAYMENT_TYPES = [
        ('single_session', 'Single Session'),
        ('package_6', '6 Session Package'),
        ('package_12', '12 Session Package'),
        ('subscription', 'Subscription'),
        ('company_billing', 'Company Billing'),
    ]

    # Basic Information
    payment_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    client = models.ForeignKey(
        'clients.ClientProfile', 
        on_delete=models.CASCADE, 
        related_name='payments'
    )
    therapist = models.ForeignKey(
        'therapists.TherapistProfile', 
        on_delete=models.CASCADE, 
        related_name='payments'
    )
    
    # Payment Details
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES, default='single_session')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='razorpay')
    
    # Amounts
    base_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    final_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Currency
    currency = models.CharField(max_length=3, default='INR')
    
    # Status
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    
    # External Payment Gateway Details
    gateway_payment_id = models.CharField(max_length=100, blank=True)
    gateway_order_id = models.CharField(max_length=100, blank=True)
    gateway_signature = models.CharField(max_length=200, blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    
    # Company/Coupon Details
    company = models.ForeignKey(
        'companies.Company', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='payments'
    )
    coupon = models.ForeignKey(
        'companies.CompanyCoupon', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='payments'
    )
    
    # Package Details (for multi-session packages)
    total_sessions = models.PositiveIntegerField(default=1)
    sessions_used = models.PositiveIntegerField(default=0)
    
    # Timestamps
    payment_date = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    
    # Invoice
    invoice_number = models.CharField(max_length=50, unique=True, blank=True)
    invoice_file = models.FileField(upload_to='invoices/', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.payment_id} - {self.client.user.get_full_name()} - ₹{self.final_amount}"

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            # Generate invoice number
            from datetime import datetime
            self.invoice_number = f"INV-{datetime.now().strftime('%Y%m%d')}-{str(self.payment_id)[:8].upper()}"
        super().save(*args, **kwargs)

    def get_remaining_sessions(self):
        return self.total_sessions - self.sessions_used

    def can_use_session(self):
        return self.status == 'completed' and self.get_remaining_sessions() > 0

    def is_refundable(self):
        return self.status in ['completed'] and self.sessions_used < self.total_sessions

    class Meta:
        ordering = ['-created_at']


class PaymentTransaction(models.Model):
    """
    Individual payment transactions (for tracking payment flow)
    """
    TRANSACTION_TYPES = [
        ('payment', 'Payment'),
        ('refund', 'Refund'),
        ('chargeback', 'Chargeback'),
        ('fee', 'Processing Fee'),
    ]

    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES, default='payment')
    
    # Transaction Details
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
    
    # Gateway Details
    gateway_transaction_id = models.CharField(max_length=100, blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    
    # Status
    is_successful = models.BooleanField(default=False)
    failure_reason = models.TextField(blank=True)
    
    # Timestamps
    processed_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.transaction_id} - ₹{self.amount}"

    class Meta:
        ordering = ['-created_at']


class Refund(models.Model):
    """
    Refund requests and processing
    """
    REFUND_STATUS = [
        ('requested', 'Requested'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    REFUND_REASONS = [
        ('session_cancelled', 'Session Cancelled'),
        ('therapist_unavailable', 'Therapist Unavailable'),
        ('technical_issues', 'Technical Issues'),
        ('client_request', 'Client Request'),
        ('service_issue', 'Service Quality Issue'),
        ('other', 'Other'),
    ]

    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='refunds')
    refund_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    # Refund Details
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2)
    refund_reason = models.CharField(max_length=30, choices=REFUND_REASONS)
    reason_description = models.TextField(blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=REFUND_STATUS, default='requested')
    
    # Processing
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requested_refunds')
    approved_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='approved_refunds'
    )
    processed_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='processed_refunds'
    )
    
    # Gateway Details
    gateway_refund_id = models.CharField(max_length=100, blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    requested_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Refund {self.refund_id} - ₹{self.refund_amount} ({self.status})"

    class Meta:
        ordering = ['-requested_at']


class TherapistPayout(models.Model):
    """
    Payouts to therapists
    """
    PAYOUT_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]

    therapist = models.ForeignKey(
        'therapists.TherapistProfile', 
        on_delete=models.CASCADE, 
        related_name='payouts'
    )
    payout_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    # Payout Period
    period_start = models.DateField()
    period_end = models.DateField()
    
    # Amount Calculation
    total_sessions = models.PositiveIntegerField(default=0)
    gross_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax_deduction = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Status
    status = models.CharField(max_length=20, choices=PAYOUT_STATUS, default='pending')
    
    # Bank Details
    bank_account_number = models.CharField(max_length=20, blank=True)
    bank_ifsc_code = models.CharField(max_length=11, blank=True)
    bank_account_holder = models.CharField(max_length=100, blank=True)
    
    # Processing
    approved_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='approved_payouts'
    )
    processed_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='processed_payouts'
    )
    
    # Gateway Details
    gateway_payout_id = models.CharField(max_length=100, blank=True)
    gateway_response = models.JSONField(default=dict, blank=True)
    
    # Timestamps
    approved_at = models.DateTimeField(null=True, blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payout {self.payout_id} - {self.therapist.user.get_full_name()} - ₹{self.net_amount}"

    class Meta:
        ordering = ['-created_at']


class PaymentMethod(models.Model):
    """
    Saved payment methods for clients
    """
    CARD_TYPES = [
        ('visa', 'Visa'),
        ('mastercard', 'Mastercard'),
        ('amex', 'American Express'),
        ('rupay', 'RuPay'),
        ('other', 'Other'),
    ]

    client = models.ForeignKey(
        'clients.ClientProfile', 
        on_delete=models.CASCADE, 
        related_name='payment_methods'
    )
    
    # Card Details (tokenized)
    card_token = models.CharField(max_length=100, unique=True)
    card_type = models.CharField(max_length=20, choices=CARD_TYPES)
    last_four_digits = models.CharField(max_length=4)
    expiry_month = models.PositiveIntegerField()
    expiry_year = models.PositiveIntegerField()
    
    # Bank Details (for UPI/Net Banking)
    bank_name = models.CharField(max_length=100, blank=True)
    upi_id = models.CharField(max_length=100, blank=True)
    
    # Status
    is_default = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Gateway Details
    gateway_customer_id = models.CharField(max_length=100, blank=True)
    gateway_method_id = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.user.get_full_name()} - **** {self.last_four_digits}"

    class Meta:
        ordering = ['-is_default', '-created_at']


class Discount(models.Model):
    """
    Discount codes and promotions
    """
    DISCOUNT_TYPES = [
        ('percentage', 'Percentage'),
        ('fixed_amount', 'Fixed Amount'),
        ('free_session', 'Free Session'),
    ]

    DISCOUNT_SCOPE = [
        ('all', 'All Sessions'),
        ('first_session', 'First Session Only'),
        ('package', 'Package Deals'),
        ('therapist_specific', 'Specific Therapist'),
    ]

    # Basic Information
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    # Discount Details
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    scope = models.CharField(max_length=20, choices=DISCOUNT_SCOPE, default='all')
    
    # Validity
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    
    # Usage Limits
    max_uses = models.PositiveIntegerField(null=True, blank=True)
    max_uses_per_client = models.PositiveIntegerField(default=1)
    current_uses = models.PositiveIntegerField(default=0)
    
    # Conditions
    minimum_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    applicable_therapists = models.ManyToManyField(
        'therapists.TherapistProfile', 
        blank=True, 
        related_name='applicable_discounts'
    )
    
    # Status
    is_active = models.BooleanField(default=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_discounts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

    def is_valid(self):
        from django.utils import timezone
        now = timezone.now()
        return (
            self.is_active and
            self.valid_from <= now <= self.valid_until and
            (self.max_uses is None or self.current_uses < self.max_uses)
        )

    def can_be_used_by_client(self, client):
        if not self.is_valid():
            return False
        
        # Check usage limit per client
        client_usage = DiscountUsage.objects.filter(
            discount=self, 
            payment__client=client
        ).count()
        
        return client_usage < self.max_uses_per_client

    class Meta:
        ordering = ['-created_at']


class DiscountUsage(models.Model):
    """
    Track discount code usage
    """
    discount = models.ForeignKey(Discount, on_delete=models.CASCADE, related_name='usage_records')
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='discount_usage')
    
    # Usage Details
    discount_amount_applied = models.DecimalField(max_digits=10, decimal_places=2)
    
    used_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.discount.code} used by {self.payment.client.user.get_full_name()}"

    class Meta:
        unique_together = ['discount', 'payment']
        ordering = ['-used_at']