from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    # Payment Processing
    path('', views.PaymentListView.as_view(), name='payment_list'),
    path('<uuid:payment_id>/', views.PaymentDetailView.as_view(), name='payment_detail'),
    path('create/', views.create_payment, name='create_payment'),
    path('process/', views.process_payment, name='process_payment'),
    path('verify/', views.verify_payment, name='verify_payment'),
    
    # Razorpay Integration
    path('razorpay/create-order/', views.create_razorpay_order, name='create_razorpay_order'),
    path('razorpay/verify/', views.verify_razorpay_payment, name='verify_razorpay_payment'),
    path('razorpay/webhook/', views.razorpay_webhook, name='razorpay_webhook'),
    
    # Refunds
    path('refunds/', views.RefundListView.as_view(), name='refund_list'),
    path('refunds/<uuid:refund_id>/', views.RefundDetailView.as_view(), name='refund_detail'),
    path('refunds/request/', views.request_refund, name='request_refund'),
    path('refunds/<uuid:refund_id>/approve/', views.approve_refund, name='approve_refund'),
    path('refunds/<uuid:refund_id>/process/', views.process_refund, name='process_refund'),
    
    # Therapist Payouts
    path('payouts/', views.TherapistPayoutListView.as_view(), name='payout_list'),
    path('payouts/<uuid:payout_id>/', views.TherapistPayoutDetailView.as_view(), name='payout_detail'),
    path('payouts/generate/', views.generate_payouts, name='generate_payouts'),
    path('payouts/<uuid:payout_id>/approve/', views.approve_payout, name='approve_payout'),
    path('payouts/<uuid:payout_id>/process/', views.process_payout, name='process_payout'),
    
    # Payment Methods
    path('methods/', views.PaymentMethodListView.as_view(), name='payment_method_list'),
    path('methods/<int:pk>/', views.PaymentMethodDetailView.as_view(), name='payment_method_detail'),
    path('methods/add/', views.add_payment_method, name='add_payment_method'),
    
    # Discounts
    path('discounts/', views.DiscountListView.as_view(), name='discount_list'),
    path('discounts/<int:pk>/', views.DiscountDetailView.as_view(), name='discount_detail'),
    path('discounts/validate/', views.validate_discount, name='validate_discount'),
    path('discounts/apply/', views.apply_discount, name='apply_discount'),
    
    # Reports
    path('reports/financial/', views.financial_report, name='financial_report'),
    path('reports/therapist-earnings/', views.therapist_earnings_report, name='therapist_earnings_report'),
    path('reports/company-billing/', views.company_billing_report, name='company_billing_report'),
    
    # Invoices
    path('invoices/<str:invoice_number>/', views.invoice_detail, name='invoice_detail'),
    path('invoices/<str:invoice_number>/download/', views.download_invoice, name='download_invoice'),
]