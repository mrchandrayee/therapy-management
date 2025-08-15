from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    TherapistProfile, TherapyCategory, Competency, TherapistCompetency,
    TherapistDocument, TherapistAvailability, TherapistReview, SupervisorRelationship
)


@admin.register(TherapyCategory)
class TherapyCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'is_active', 'therapist_count', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']
    
    def therapist_count(self, obj):
        return obj.therapists.count()
    therapist_count.short_description = 'Therapists'


@admin.register(Competency)
class CompetencyAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'description', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'description']
    ordering = ['category__name', 'name']


class TherapistCompetencyInline(admin.TabularInline):
    model = TherapistCompetency
    extra = 1
    fields = ['competency', 'proficiency_level', 'years_of_experience', 'notes']


class TherapistDocumentInline(admin.TabularInline):
    model = TherapistDocument
    extra = 0
    fields = ['document_type', 'title', 'document_file', 'is_verified', 'expiry_date']
    readonly_fields = ['is_verified']


class TherapistAvailabilityInline(admin.TabularInline):
    model = TherapistAvailability
    extra = 0
    fields = ['day_of_week', 'start_time', 'end_time', 'is_available', 'specific_date']


@admin.register(TherapistProfile)
class TherapistProfileAdmin(admin.ModelAdmin):
    list_display = [
        'user_name', 'license_number', 'specialization_list', 'experience_level',
        'approval_status_badge', 'average_rating', 'total_sessions', 'is_available'
    ]
    list_filter = [
        'approval_status', 'experience_level', 'is_available', 
        'specializations', 'created_at'
    ]
    search_fields = [
        'user__first_name', 'user__last_name', 'user__email', 
        'license_number', 'bio'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'license_number', 'bio')
        }),
        ('Professional Details', {
            'fields': (
                'specializations', 'experience_level', 'years_of_experience',
                'consultation_fee', 'languages_spoken'
            )
        }),
        ('Availability Settings', {
            'fields': (
                'is_available', 'max_clients_per_day', 'session_duration_minutes'
            )
        }),
        ('Approval Status', {
            'fields': (
                'approval_status', 'approved_by', 'approved_at', 'rejection_reason'
            ),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('average_rating', 'total_reviews', 'total_sessions'),
            'classes': ('collapse',)
        })
    )
    
    readonly_fields = ['approved_by', 'approved_at', 'average_rating', 'total_reviews', 'total_sessions']
    filter_horizontal = ['specializations']
    inlines = [TherapistCompetencyInline, TherapistDocumentInline, TherapistAvailabilityInline]
    
    # Jazzmin specific settings
    jazzmin_section_order = (
        "Basic Information", 
        "Professional Details", 
        "Availability Settings",
        "Therapist Competencies",
        "Therapist Documents", 
        "Therapist Availabilities",
        "Approval Status", 
        "Statistics"
    )
    
    def user_name(self, obj):
        return obj.user.get_full_name()
    user_name.short_description = 'Name'
    user_name.admin_order_field = 'user__first_name'
    
    def specialization_list(self, obj):
        return ", ".join([spec.name for spec in obj.specializations.all()[:3]])
    specialization_list.short_description = 'Specializations'
    
    def approval_status_badge(self, obj):
        colors = {
            'approved': 'success',
            'pending': 'warning',
            'rejected': 'danger',
            'suspended': 'secondary'
        }
        color = colors.get(obj.approval_status, 'secondary')
        return format_html(
            '<span class="badge badge-{}">{}</span>',
            color,
            obj.get_approval_status_display()
        )
    approval_status_badge.short_description = 'Status'
    approval_status_badge.admin_order_field = 'approval_status'
    
    actions = ['approve_therapists', 'suspend_therapists']
    
    def approve_therapists(self, request, queryset):
        updated = queryset.update(approval_status='approved')
        self.message_user(request, f'{updated} therapists approved successfully.')
    approve_therapists.short_description = "Approve selected therapists"
    
    def suspend_therapists(self, request, queryset):
        updated = queryset.update(approval_status='suspended')
        self.message_user(request, f'{updated} therapists suspended.')
    suspend_therapists.short_description = "Suspend selected therapists"


@admin.register(TherapistDocument)
class TherapistDocumentAdmin(admin.ModelAdmin):
    list_display = [
        'therapist_name', 'document_type', 'title', 'verification_status',
        'expiry_status', 'uploaded_at'
    ]
    list_filter = [
        'document_type', 'is_verified', 'uploaded_at', 'expiry_date'
    ]
    search_fields = [
        'therapist__user__first_name', 'therapist__user__last_name',
        'title', 'issuing_authority'
    ]
    ordering = ['-uploaded_at']
    
    fieldsets = (
        ('Document Information', {
            'fields': ('therapist', 'document_type', 'title', 'description')
        }),
        ('File & Details', {
            'fields': (
                'document_file', 'issue_date', 'expiry_date', 'issuing_authority'
            )
        }),
        ('Verification', {
            'fields': ('is_verified', 'verified_by', 'verified_at'),
            'classes': ('collapse',)
        })
    )
    
    readonly_fields = ['verified_by', 'verified_at']
    
    def therapist_name(self, obj):
        return obj.therapist.user.get_full_name()
    therapist_name.short_description = 'Therapist'
    therapist_name.admin_order_field = 'therapist__user__first_name'
    
    def verification_status(self, obj):
        if obj.is_verified:
            return format_html('<span class="badge badge-success">Verified</span>')
        return format_html('<span class="badge badge-warning">Pending</span>')
    verification_status.short_description = 'Verification'
    
    def expiry_status(self, obj):
        if not obj.expiry_date:
            return format_html('<span class="badge badge-info">No Expiry</span>')
        elif obj.is_expired():
            return format_html('<span class="badge badge-danger">Expired</span>')
        else:
            return format_html('<span class="badge badge-success">Valid</span>')
    expiry_status.short_description = 'Expiry Status'
    
    actions = ['verify_documents', 'unverify_documents']
    
    def verify_documents(self, request, queryset):
        updated = queryset.update(is_verified=True, verified_by=request.user)
        self.message_user(request, f'{updated} documents verified.')
    verify_documents.short_description = "Verify selected documents"
    
    def unverify_documents(self, request, queryset):
        updated = queryset.update(is_verified=False)
        self.message_user(request, f'{updated} documents unverified.')
    unverify_documents.short_description = "Unverify selected documents"


@admin.register(TherapistAvailability)
class TherapistAvailabilityAdmin(admin.ModelAdmin):
    list_display = [
        'therapist_name', 'day_display', 'time_slot', 'availability_status',
        'specific_date', 'created_at'
    ]
    list_filter = [
        'day_of_week', 'is_available', 'is_holiday', 'created_at'
    ]
    search_fields = [
        'therapist__user__first_name', 'therapist__user__last_name', 'notes'
    ]
    ordering = ['therapist', 'day_of_week', 'start_time']
    
    def therapist_name(self, obj):
        return obj.therapist.user.get_full_name()
    therapist_name.short_description = 'Therapist'
    
    def day_display(self, obj):
        if obj.specific_date:
            return obj.specific_date.strftime('%Y-%m-%d')
        return obj.get_day_of_week_display()
    day_display.short_description = 'Day'
    
    def time_slot(self, obj):
        return f"{obj.start_time} - {obj.end_time}"
    time_slot.short_description = 'Time Slot'
    
    def availability_status(self, obj):
        if obj.is_holiday:
            return format_html('<span class="badge badge-secondary">Holiday</span>')
        elif obj.is_available:
            return format_html('<span class="badge badge-success">Available</span>')
        else:
            return format_html('<span class="badge badge-danger">Blocked</span>')
    availability_status.short_description = 'Status'


@admin.register(TherapistReview)
class TherapistReviewAdmin(admin.ModelAdmin):
    list_display = [
        'therapist_name', 'client_name', 'rating_stars', 'approval_status',
        'created_at'
    ]
    list_filter = ['rating', 'is_approved', 'is_anonymous', 'created_at']
    search_fields = [
        'therapist__user__first_name', 'therapist__user__last_name',
        'client__first_name', 'client__last_name', 'review_text'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        ('Review Information', {
            'fields': ('therapist', 'client', 'rating', 'review_text')
        }),
        ('Settings', {
            'fields': ('is_anonymous', 'is_approved')
        })
    )
    
    def therapist_name(self, obj):
        return obj.therapist.user.get_full_name()
    therapist_name.short_description = 'Therapist'
    
    def client_name(self, obj):
        if obj.is_anonymous:
            return "Anonymous"
        return obj.client.get_full_name()
    client_name.short_description = 'Client'
    
    def rating_stars(self, obj):
        stars = '⭐' * obj.rating + '☆' * (5 - obj.rating)
        return format_html(f'<span title="{obj.rating}/5">{stars}</span>')
    rating_stars.short_description = 'Rating'
    
    def approval_status(self, obj):
        if obj.is_approved:
            return format_html('<span class="badge badge-success">Approved</span>')
        return format_html('<span class="badge badge-warning">Pending</span>')
    approval_status.short_description = 'Status'
    
    actions = ['approve_reviews', 'disapprove_reviews']
    
    def approve_reviews(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} reviews approved.')
    approve_reviews.short_description = "Approve selected reviews"
    
    def disapprove_reviews(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} reviews disapproved.')
    disapprove_reviews.short_description = "Disapprove selected reviews"


@admin.register(SupervisorRelationship)
class SupervisorRelationshipAdmin(admin.ModelAdmin):
    list_display = [
        'supervisor_name', 'supervisee_name', 'start_date', 'end_date',
        'relationship_status', 'created_at'
    ]
    list_filter = ['is_active', 'start_date', 'end_date']
    search_fields = [
        'supervisor__user__first_name', 'supervisor__user__last_name',
        'supervisee__user__first_name', 'supervisee__user__last_name'
    ]
    ordering = ['-created_at']
    
    def supervisor_name(self, obj):
        return obj.supervisor.user.get_full_name()
    supervisor_name.short_description = 'Supervisor'
    
    def supervisee_name(self, obj):
        return obj.supervisee.user.get_full_name()
    supervisee_name.short_description = 'Supervisee'
    
    def relationship_status(self, obj):
        if obj.is_active:
            return format_html('<span class="badge badge-success">Active</span>')
        return format_html('<span class="badge badge-secondary">Inactive</span>')
    relationship_status.short_description = 'Status'
