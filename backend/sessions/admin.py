from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    TherapySession, SessionParticipant, SessionTemplate, SessionFeedback,
    SessionExtension, SessionRecording, SessionReminder
)
from .calendar_models import (
    TherapistCalendar, AvailabilitySlot, SessionJoinControl, CalendarEvent
)


class SessionParticipantInline(admin.TabularInline):
    model = SessionParticipant
    extra = 0
    fields = ['client', 'role', 'attended', 'join_time', 'leave_time']


class SessionExtensionInline(admin.TabularInline):
    model = SessionExtension
    extra = 0
    fields = ['extended_by_minutes', 'reason', 'requested_by', 'approved']
    readonly_fields = ['requested_by']


class SessionFeedbackInline(admin.TabularInline):
    model = SessionFeedback
    extra = 0
    fields = ['feedback_type', 'overall_rating', 'comments', 'technical_issues']


@admin.register(TherapySession)
class TherapySessionAdmin(admin.ModelAdmin):
    list_display = [
        'session_id_short', 'client_name', 'therapist_name', 'session_datetime',
        'duration_display', 'session_status', 'payment_status', 'extensions_count'
    ]
    list_filter = [
        'status', 'session_type', 'scheduled_date', 'created_at',
        'reminder_sent_24h', 'reminder_sent_1h'
    ]
    search_fields = [
        'session_id', 'client__user__first_name', 'client__user__last_name',
        'therapist__user__first_name', 'therapist__user__last_name',
        'title', 'description'
    ]
    ordering = ['-scheduled_date', '-scheduled_time']
    date_hierarchy = 'scheduled_date'
    
    fieldsets = (
        ('Session Information', {
            'fields': (
                'session_id', 'session_type', 'client', 'therapist',
                'title', 'description'
            )
        }),
        ('Scheduling', {
            'fields': (
                'scheduled_date', 'scheduled_time', 'duration_minutes', 'timezone'
            )
        }),
        ('Meeting Details', {
            'fields': (
                'meeting_link', 'meeting_id', 'meeting_password'
            )
        }),
        ('Status & Tracking', {
            'fields': (
                'status', 'actual_start_time', 'actual_end_time', 'actual_duration_minutes'
            )
        }),
        ('Cancellation', {
            'fields': (
                'cancellation_reason', 'cancellation_notes', 'cancelled_by', 'cancelled_at'
            ),
            'classes': ('collapse',)
        }),
        ('Reminders', {
            'fields': (
                'reminder_sent_24h', 'reminder_sent_1h', 'confirmation_sent'
            ),
            'classes': ('collapse',)
        }),
        ('Notes', {
            'fields': ('session_notes',),
            'classes': ('collapse',)
        })
    )
    
    readonly_fields = [
        'session_id', 'actual_start_time', 'actual_end_time', 
        'actual_duration_minutes', 'cancelled_by', 'cancelled_at'
    ]
    
    inlines = [SessionParticipantInline, SessionExtensionInline, SessionFeedbackInline]
    
    # Jazzmin specific settings
    jazzmin_section_order = (
        "Session Information",
        "Scheduling", 
        "Meeting Details",
        "Status & Tracking",
        "Session Participants",
        "Session Extensions",
        "Session Feedbacks",
        "Cancellation",
        "Reminders",
        "Notes"
    )
    
    def session_id_short(self, obj):
        return str(obj.session_id)[:8] + "..."
    session_id_short.short_description = 'Session ID'
    
    def client_name(self, obj):
        return obj.client.user.get_full_name()
    client_name.short_description = 'Client'
    client_name.admin_order_field = 'client__user__first_name'
    
    def therapist_name(self, obj):
        return obj.therapist.user.get_full_name()
    therapist_name.short_description = 'Therapist'
    therapist_name.admin_order_field = 'therapist__user__first_name'
    
    def session_datetime(self, obj):
        return f"{obj.scheduled_date} {obj.scheduled_time}"
    session_datetime.short_description = 'Date & Time'
    session_datetime.admin_order_field = 'scheduled_date'
    
    def duration_display(self, obj):
        total_extended = sum(ext.extended_by_minutes for ext in obj.extensions.all())
        if total_extended > 0:
            return f"{obj.duration_minutes + total_extended} min (+{total_extended})"
        return f"{obj.duration_minutes} min"
    duration_display.short_description = 'Duration'
    
    def session_status(self, obj):
        colors = {
            'scheduled': 'primary',
            'confirmed': 'info',
            'in_progress': 'warning',
            'completed': 'success',
            'cancelled': 'danger',
            'no_show': 'secondary',
            'rescheduled': 'info'
        }
        color = colors.get(obj.status, 'secondary')
        return format_html(
            '<span class="badge badge-{}">{}</span>',
            color,
            obj.get_status_display()
        )
    session_status.short_description = 'Status'
    
    def payment_status(self, obj):
        if obj.payment:
            if obj.payment.status == 'completed':
                return format_html('<span class="badge badge-success">Paid</span>')
            elif obj.payment.status == 'pending':
                return format_html('<span class="badge badge-warning">Pending</span>')
            else:
                return format_html('<span class="badge badge-danger">Failed</span>')
        return format_html('<span class="badge badge-secondary">No Payment</span>')
    payment_status.short_description = 'Payment'
    
    def extensions_count(self, obj):
        count = obj.extensions.count()
        if count > 0:
            total_minutes = sum(ext.extended_by_minutes for ext in obj.extensions.all())
            return f"{count} (+{total_minutes}min)"
        return "0"
    extensions_count.short_description = 'Extensions'
    
    actions = ['mark_completed', 'send_reminders', 'cancel_sessions']
    
    def mark_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} sessions marked as completed.')
    mark_completed.short_description = "Mark selected sessions as completed"
    
    def send_reminders(self, request, queryset):
        # This would trigger reminder sending logic
        count = queryset.count()
        self.message_user(request, f'Reminders sent for {count} sessions.')
    send_reminders.short_description = "Send reminders for selected sessions"
    
    def cancel_sessions(self, request, queryset):
        updated = queryset.update(status='cancelled', cancelled_by=request.user)
        self.message_user(request, f'{updated} sessions cancelled.')
    cancel_sessions.short_description = "Cancel selected sessions"


@admin.register(SessionTemplate)
class SessionTemplateAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'therapist_name', 'client_name', 'recurrence_display',
        'sessions_created', 'template_status', 'created_at'
    ]
    list_filter = [
        'session_type', 'recurrence_type', 'is_active', 'created_at'
    ]
    search_fields = [
        'title', 'therapist__user__first_name', 'therapist__user__last_name',
        'client__user__first_name', 'client__user__last_name'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        ('Template Information', {
            'fields': ('title', 'description', 'therapist', 'client', 'session_type')
        }),
        ('Recurrence Settings', {
            'fields': (
                'recurrence_type', 'recurrence_interval', 'preferred_day_of_week',
                'preferred_time', 'duration_minutes'
            )
        }),
        ('Validity', {
            'fields': (
                'start_date', 'end_date', 'max_sessions', 'sessions_created'
            )
        }),
        ('Status', {
            'fields': ('is_active',)
        })
    )
    
    readonly_fields = ['sessions_created']
    
    def therapist_name(self, obj):
        return obj.therapist.user.get_full_name()
    therapist_name.short_description = 'Therapist'
    
    def client_name(self, obj):
        return obj.client.user.get_full_name()
    client_name.short_description = 'Client'
    
    def recurrence_display(self, obj):
        if obj.recurrence_type == 'weekly':
            return f"Every {obj.recurrence_interval} week(s)"
        elif obj.recurrence_type == 'monthly':
            return f"Every {obj.recurrence_interval} month(s)"
        return obj.get_recurrence_type_display()
    recurrence_display.short_description = 'Recurrence'
    
    def template_status(self, obj):
        if obj.is_active and obj.can_create_more_sessions():
            return format_html('<span class="badge badge-success">Active</span>')
        elif obj.is_active:
            return format_html('<span class="badge badge-warning">Limit Reached</span>')
        else:
            return format_html('<span class="badge badge-secondary">Inactive</span>')
    template_status.short_description = 'Status'


@admin.register(AvailabilitySlot)
class AvailabilitySlotAdmin(admin.ModelAdmin):
    list_display = [
        'therapist_name', 'date', 'time_slot', 'slot_status',
        'booking_status', 'created_at'
    ]
    list_filter = [
        'status', 'is_recurring', 'recurrence_type', 'date', 'created_at'
    ]
    search_fields = [
        'therapist__user__first_name', 'therapist__user__last_name', 'notes'
    ]
    ordering = ['date', 'start_time']
    date_hierarchy = 'date'
    
    def therapist_name(self, obj):
        return obj.therapist.user.get_full_name()
    therapist_name.short_description = 'Therapist'
    
    def time_slot(self, obj):
        return f"{obj.start_time} - {obj.end_time}"
    time_slot.short_description = 'Time Slot'
    
    def slot_status(self, obj):
        colors = {
            'available': 'success',
            'booked': 'primary',
            'blocked': 'danger',
            'tentative': 'warning'
        }
        color = colors.get(obj.status, 'secondary')
        return format_html(
            '<span class="badge badge-{}">{}</span>',
            color,
            obj.get_status_display()
        )
    slot_status.short_description = 'Status'
    
    def booking_status(self, obj):
        if obj.session:
            return format_html(
                '<a href="{}" class="badge badge-info">View Session</a>',
                reverse('admin:sessions_therapysession_change', args=[obj.session.id])
            )
        return format_html('<span class="badge badge-light">Available</span>')
    booking_status.short_description = 'Booking'


@admin.register(SessionJoinControl)
class SessionJoinControlAdmin(admin.ModelAdmin):
    list_display = [
        'session_info', 'join_window', 'client_joined', 'therapist_joined',
        'admin_joined', 'meeting_status'
    ]
    list_filter = [
        'client_can_join', 'therapist_can_join', 'meeting_room_created'
    ]
    search_fields = [
        'session__session_id', 'meeting_room_id'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        ('Session Information', {
            'fields': ('session', 'early_join_minutes', 'late_join_minutes')
        }),
        ('Join Permissions', {
            'fields': (
                'client_can_join', 'therapist_can_join', 'admin_can_join'
            )
        }),
        ('Join Tracking', {
            'fields': (
                'client_joined_at', 'therapist_joined_at', 'admin_joined_at'
            )
        }),
        ('Meeting Details', {
            'fields': (
                'meeting_room_created', 'meeting_room_id', 'meeting_password'
            )
        })
    )
    
    readonly_fields = [
        'client_joined_at', 'therapist_joined_at', 'admin_joined_at'
    ]
    
    def session_info(self, obj):
        return f"{obj.session.client.user.get_full_name()} - {obj.session.scheduled_date}"
    session_info.short_description = 'Session'
    
    def join_window(self, obj):
        return f"{obj.early_join_minutes} min before - {obj.late_join_minutes} min after"
    join_window.short_description = 'Join Window'
    
    def client_joined(self, obj):
        if obj.client_joined_at:
            return format_html('<span class="badge badge-success">Joined</span>')
        return format_html('<span class="badge badge-secondary">Not Joined</span>')
    client_joined.short_description = 'Client'
    
    def therapist_joined(self, obj):
        if obj.therapist_joined_at:
            return format_html('<span class="badge badge-success">Joined</span>')
        return format_html('<span class="badge badge-secondary">Not Joined</span>')
    therapist_joined.short_description = 'Therapist'
    
    def admin_joined(self, obj):
        if obj.admin_joined_at:
            return format_html('<span class="badge badge-info">Joined</span>')
        return format_html('<span class="badge badge-light">Not Joined</span>')
    admin_joined.short_description = 'Admin'
    
    def meeting_status(self, obj):
        if obj.meeting_room_created:
            return format_html('<span class="badge badge-success">Created</span>')
        return format_html('<span class="badge badge-warning">Pending</span>')
    meeting_status.short_description = 'Meeting Room'


@admin.register(CalendarEvent)
class CalendarEventAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'therapist_name', 'event_type', 'date_range',
        'blocks_availability', 'created_at'
    ]
    list_filter = [
        'event_type', 'blocks_availability', 'is_all_day', 'start_date'
    ]
    search_fields = [
        'title', 'description', 'therapist__user__first_name', 'therapist__user__last_name'
    ]
    ordering = ['start_date']
    date_hierarchy = 'start_date'
    
    def therapist_name(self, obj):
        return obj.therapist.user.get_full_name()
    therapist_name.short_description = 'Therapist'
    
    def date_range(self, obj):
        if obj.start_date == obj.end_date:
            return obj.start_date
        return f"{obj.start_date} - {obj.end_date}"
    date_range.short_description = 'Date Range'
