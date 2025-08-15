# DPDP Act Compliance Utilities
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Q
from django.core.management.base import BaseCommand
from celery import shared_task

from accounts.models import User
from clients.models import ClientProfile
from sessions.models import TherapySession
from communications.models import EmailLog


class DPDPComplianceManager:
    """
    Manage DPDP Act compliance including data retention and client management
    """
    
    @staticmethod
    def get_inactive_clients(years=3):
        """
        Get clients who haven't had any activity for specified years
        """
        cutoff_date = timezone.now() - timedelta(days=years * 365)
        
        # Find clients with no recent sessions
        inactive_clients = ClientProfile.objects.filter(
            Q(last_session_date__lt=cutoff_date) | Q(last_session_date__isnull=True),
            user__last_activity__lt=cutoff_date,
            is_active=True
        ).select_related('user')
        
        return inactive_clients
    
    @staticmethod
    def disable_inactive_clients(years=3, dry_run=True):
        """
        Disable clients who haven't sought help for more than specified years
        """
        inactive_clients = DPDPComplianceManager.get_inactive_clients(years)
        
        disabled_count = 0
        disabled_clients = []
        
        for client in inactive_clients:
            if not dry_run:
                # Disable client
                client.is_active = False
                client.user.is_active = False
                client.save()
                client.user.save()
                
                # Log the action
                DPDPComplianceManager._log_client_disable(client, years)
            
            disabled_clients.append({
                'client_id': client.id,
                'client_name': client.user.get_full_name(),
                'last_session_date': client.last_session_date,
                'last_activity': client.user.last_activity,
            })
            disabled_count += 1
        
        return {
            'disabled_count': disabled_count,
            'disabled_clients': disabled_clients,
            'dry_run': dry_run
        }
    
    @staticmethod
    def _log_client_disable(client, years):
        """
        Log client disable action for audit purposes
        """
        from django.contrib.admin.models import LogEntry, CHANGE
        from django.contrib.contenttypes.models import ContentType
        
        LogEntry.objects.log_action(
            user_id=1,  # System user
            content_type_id=ContentType.objects.get_for_model(ClientProfile).pk,
            object_id=client.pk,
            object_repr=str(client),
            action_flag=CHANGE,
            change_message=f'Client disabled due to DPDP Act compliance - no activity for {years} years'
        )
    
    @staticmethod
    def get_data_retention_report():
        """
        Generate data retention compliance report
        """
        now = timezone.now()
        
        # Clients by activity period
        active_clients = ClientProfile.objects.filter(
            user__last_activity__gte=now - timedelta(days=365),
            is_active=True
        ).count()
        
        inactive_1_year = ClientProfile.objects.filter(
            user__last_activity__lt=now - timedelta(days=365),
            user__last_activity__gte=now - timedelta(days=2*365),
            is_active=True
        ).count()
        
        inactive_2_years = ClientProfile.objects.filter(
            user__last_activity__lt=now - timedelta(days=2*365),
            user__last_activity__gte=now - timedelta(days=3*365),
            is_active=True
        ).count()
        
        inactive_3_years = ClientProfile.objects.filter(
            user__last_activity__lt=now - timedelta(days=3*365),
            is_active=True
        ).count()
        
        disabled_clients = ClientProfile.objects.filter(is_active=False).count()
        
        # Data retention consent status
        clients_with_consent = ClientProfile.objects.filter(
            user__data_retention_consent=True
        ).count()
        
        clients_without_consent = ClientProfile.objects.filter(
            user__data_retention_consent=False
        ).count()
        
        return {
            'active_clients': active_clients,
            'inactive_1_year': inactive_1_year,
            'inactive_2_years': inactive_2_years,
            'inactive_3_years_plus': inactive_3_years,
            'disabled_clients': disabled_clients,
            'clients_with_consent': clients_with_consent,
            'clients_without_consent': clients_without_consent,
            'total_clients': ClientProfile.objects.count(),
        }
    
    @staticmethod
    def cleanup_old_data(days=2555):  # 7 years default
        """
        Clean up old data beyond retention period
        """
        cutoff_date = timezone.now() - timedelta(days=days)
        
        cleanup_report = {
            'email_logs_deleted': 0,
            'session_recordings_deleted': 0,
            'old_sessions_anonymized': 0,
        }
        
        # Delete old email logs
        old_email_logs = EmailLog.objects.filter(created_at__lt=cutoff_date)
        cleanup_report['email_logs_deleted'] = old_email_logs.count()
        old_email_logs.delete()
        
        # Delete old session recordings
        from sessions.models import SessionRecording
        old_recordings = SessionRecording.objects.filter(
            created_at__lt=cutoff_date
        )
        cleanup_report['session_recordings_deleted'] = old_recordings.count()
        old_recordings.delete()
        
        # Anonymize very old sessions (keep for statistical purposes)
        old_sessions = TherapySession.objects.filter(
            scheduled_date__lt=cutoff_date.date()
        )
        
        for session in old_sessions:
            if session.session_notes:
                session.session_notes = "[ANONYMIZED - DATA RETENTION POLICY]"
                session.save()
                cleanup_report['old_sessions_anonymized'] += 1
        
        return cleanup_report
    
    @staticmethod
    def get_user_data_export(user_id):
        """
        Export all user data for DPDP compliance (right to data portability)
        """
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None
        
        user_data = {
            'personal_info': {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': user.phone_number,
                'address': user.address,
                'pincode': user.pincode,
                'date_joined': user.date_joined,
                'last_login': user.last_login,
            },
            'sessions': [],
            'payments': [],
            'communications': [],
        }
        
        # Add client-specific data if user is a client
        if hasattr(user, 'client_profile'):
            client = user.client_profile
            user_data['client_info'] = {
                'gender': client.gender,
                'marital_status': client.marital_status,
                'occupation': client.occupation,
                'medical_history': client.medical_history,
                'current_medications': client.current_medications,
                'allergies': client.allergies,
            }
            
            # Sessions data
            sessions = TherapySession.objects.filter(client=client)
            for session in sessions:
                user_data['sessions'].append({
                    'date': session.scheduled_date,
                    'time': session.scheduled_time,
                    'therapist': session.therapist.user.get_full_name(),
                    'status': session.status,
                    'duration': session.duration_minutes,
                })
            
            # Payments data
            from payments.models import Payment
            payments = Payment.objects.filter(client=client)
            for payment in payments:
                user_data['payments'].append({
                    'date': payment.payment_date,
                    'amount': str(payment.final_amount),
                    'status': payment.status,
                    'invoice_number': payment.invoice_number,
                })
        
        # Communications data
        email_logs = EmailLog.objects.filter(recipient=user)
        for email in email_logs:
            user_data['communications'].append({
                'date': email.created_at,
                'subject': email.subject,
                'status': email.status,
            })
        
        return user_data
    
    @staticmethod
    def delete_user_data(user_id, confirmation_code):
        """
        Delete all user data for DPDP compliance (right to erasure)
        """
        # This should include proper verification and approval process
        # For now, just a basic implementation
        
        if confirmation_code != f"DELETE_USER_{user_id}":
            return {'success': False, 'error': 'Invalid confirmation code'}
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return {'success': False, 'error': 'User not found'}
        
        deletion_report = {
            'user_deleted': False,
            'sessions_anonymized': 0,
            'payments_anonymized': 0,
            'emails_deleted': 0,
        }
        
        # Anonymize sessions instead of deleting (for statistical purposes)
        if hasattr(user, 'client_profile'):
            sessions = TherapySession.objects.filter(client=user.client_profile)
            for session in sessions:
                session.session_notes = "[DELETED - USER REQUEST]"
                session.save()
                deletion_report['sessions_anonymized'] += 1
            
            # Anonymize payments
            from payments.models import Payment
            payments = Payment.objects.filter(client=user.client_profile)
            for payment in payments:
                payment.gateway_response = {}
                payment.save()
                deletion_report['payments_anonymized'] += 1
        
        # Delete email logs
        email_logs = EmailLog.objects.filter(recipient=user)
        deletion_report['emails_deleted'] = email_logs.count()
        email_logs.delete()
        
        # Finally delete user
        user.delete()
        deletion_report['user_deleted'] = True
        
        return {'success': True, 'report': deletion_report}


# Celery tasks for automated compliance
@shared_task
def daily_dpdp_compliance_check():
    """
    Daily task to check and maintain DPDP compliance
    """
    # Check for inactive clients
    result = DPDPComplianceManager.disable_inactive_clients(years=3, dry_run=False)
    
    # Generate compliance report
    report = DPDPComplianceManager.get_data_retention_report()
    
    # Send report to admins if needed
    if result['disabled_count'] > 0:
        # Send notification to admins about disabled clients
        pass
    
    return {
        'disabled_clients': result['disabled_count'],
        'compliance_report': report
    }


@shared_task
def weekly_data_cleanup():
    """
    Weekly task to clean up old data
    """
    cleanup_report = DPDPComplianceManager.cleanup_old_data()
    return cleanup_report