from django.urls import path
from . import views

app_name = 'companies'

urlpatterns = [
    # Company Management
    path('', views.CompanyListView.as_view(), name='company_list'),
    path('<int:pk>/', views.CompanyDetailView.as_view(), name='company_detail'),
    path('create/', views.CompanyCreateView.as_view(), name='company_create'),
    path('<int:pk>/update/', views.CompanyUpdateView.as_view(), name='company_update'),
    
    # Company Contacts
    path('<int:company_id>/contacts/', views.CompanyContactListView.as_view(), name='contact_list'),
    path('contacts/<int:pk>/', views.CompanyContactDetailView.as_view(), name='contact_detail'),
    
    # Coupons
    path('<int:company_id>/coupons/', views.CompanyCouponListView.as_view(), name='coupon_list'),
    path('coupons/generate/', views.generate_coupons, name='generate_coupons'),
    path('coupons/<int:pk>/', views.CompanyCouponDetailView.as_view(), name='coupon_detail'),
    path('coupons/validate/', views.validate_coupon, name='validate_coupon'),
    path('coupons/send/', views.send_coupon_email, name='send_coupon_email'),
    
    # Employees
    path('<int:company_id>/employees/', views.CompanyEmployeeListView.as_view(), name='employee_list'),
    path('employees/<int:pk>/', views.CompanyEmployeeDetailView.as_view(), name='employee_detail'),
    path('employees/register/', views.company_employee_register, name='employee_register'),
    
    # Reports
    path('<int:company_id>/reports/', views.CompanyReportListView.as_view(), name='report_list'),
    path('reports/generate/', views.generate_company_report, name='generate_report'),
    path('reports/<int:pk>/', views.CompanyReportDetailView.as_view(), name='report_detail'),
    
    # Agreements
    path('<int:company_id>/agreements/', views.CompanyAgreementListView.as_view(), name='agreement_list'),
    path('agreements/<int:pk>/', views.CompanyAgreementDetailView.as_view(), name='agreement_detail'),
    path('agreements/<int:pk>/approve/', views.approve_agreement, name='approve_agreement'),
    
    # Dashboard
    path('<int:company_id>/dashboard/', views.company_dashboard, name='company_dashboard'),
]