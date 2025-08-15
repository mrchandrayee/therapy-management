# Email Automation System
from datetime import datetime, timedelta
from django.utils import timezone
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.db.models import Q
from celery import shared_task

from sessions.models import TherapySession, SessionReminder
from communications.models import EmailTemplate, EmailLog
from coupons.models import IndividualCoupon, CouponEmailLog
from accounts.models import User


class EmailAutomationManager:
    """
    Manage automated email sending for various events
    """
    
    @staticmethod
    def send_session_confirmation(session):
        """
        Send session confirmation email to client, therapist, and admin
        """
        template = EmailTemplate.objects.filter(
            template_type='session_confirmation',
            is_active=True
        ).first()
        
        if not template:
            return False
        
        context = {
            'session': session,
            'client_name': session.client.user.get_full_name(),
            'therapist_name': session.therapist.user.get_full_name(),
            'session_date': session.scheduled_date,
            'session_time': session.scheduled_time,
            'meeting_link': session.meeting_link,
            'session_duration': session.duration_minutes,
        }
        
        recipients = [
            ('client', session.client.user),
            ('therapist', session.therapist.user),
        ]
        
        # Add admin recipients
        admin_users = User.objects.filter(
            user_type='admin',
            is_active=True
        )
        for admin in admin_users:
            recipients.append(('admin', admin))
        
        success_count = 0
        for recipient_type, user in recipients:
            try:
                subject = template.subject.format(**context)
                html_content = template.html_content.format(**context)
                text_content = template.text_content.format(**context) if template.text_content else ""
                
                # Send email
                msg = EmailMultiAlternatives(
                    subject=subject,
                    body=text_content,
                    from_email=settings.EMAIL_HOST_USER,
                    to=[user.email]
                )
                if html_content:
                    msg.attach_alternative(html_content, "text/html")
                
                msg.send()
                
                # Log email
                EmailLog.objects.create(
                    recipient=user,
                    recipient_email=user.email,
                    subject=subject,
                    html_content=html_content,
                    text_content=text_content,
                    template=template,
                    session=session,
                    status='sent',
                    sent_at=timezone.now(),
                    context_data=context
                )
                
                success_count += 1
                
            except Exception as e:
                # Log failed email
                EmailLog.objects.create(
                    recipient=user,
                    recipient_email=user.email,
                    subject=template.subject,
                    html_content=template.html_content,
                    text_content=template.text_content,
                    template=template,
                    session=session,
                    status='failed',
                    error_message=str(e),
                    context_data=context
                )
        
        # Mark confirmation as sent
        session.confirmation_sent = True
        session.save()
        
        return success_count > 0
    
    @staticmethod
    def send_session_reminders():
        """
        Send session reminders (24 hours and 1 hour before)
        """
        now = timezone.now()
        
        # 24-hour reminders
        reminder_24h_time = now + timedelta(hours=24)
        sessions_24h = TherapySession.objects.filter(
            scheduled_date=reminder_24h_time.date(),
            scheduled_time__hour=reminder_24h_time.hour,
            status__in=['scheduled', 'confirmed'],
            reminder_sent_24h=False
        )
        
        for session in sessions_24h:
            EmailAutomationManager._send_reminder(session, '24_hour')
            session.reminder_sent_24h = True
            session.save()
        
        # 1-hour reminders
        reminder_1h_time = now + timedelta(hours=1)
        sessions_1h = TherapySession.objects.filter(
            scheduled_date=reminder_1h_time.date(),
            scheduled_time__hour=reminder_1h_time.hour,
            status__in=['scheduled', 'confirmed'],
            reminder_sent_1h=False
        )
        
        for session in sessions_1h:
            EmailAutomationManager._send_reminder(session, '1_hour')
            session.reminder_sent_1h = True
            session.save()
    
    @staticmethod
    def _send_reminder(session, reminder_type):
        """
        Send a specific type of reminder
        """
        template_type = f'session_reminder_{reminder_type}'
        template = EmailTemplate.objects.filter(
            template_type=template_type,
            is_active=True
        ).first()
        
        if not template:
            return False
        
        context = {
            'session': session,
            'client_name': session.client.user.get_full_name(),
            'therapist_name': session.therapist.user.get_full_name(),
            'session_date': session.scheduled_date,
            'session_time': session.scheduled_time,
            'meeting_link': session.meeting_link,
            'reminder_type': reminder_type,
        }
        
        recipients = [
            ('client', session.client.user),
            ('therapist', session.therapist.user),
        ]
        
        # Add admin recipients for emergency intervention
        admin_users = User.objects.filter(
            user_type='admin',
            is_active=True
        )
        for admin in admin_users:
            recipients.append(('admin', admin))
        
        for recipient_type, user in recipients:
            try:
                subject = template.subject.format(**context)
                html_content = template.html_content.format(**context)
                text_content = template.text_content.format(**context) if template.text_content else ""
                
                # Send email
                msg = EmailMultiAlternatives(
                    subject=subject,
                    body=text_content,
                    from_email=settings.EMAIL_HOST_USER,
                    to=[user.email]
                )
                if html_content:
                    msg.attach_alternative(html_content, "text/html")
                
                msg.send()
                
                # Create reminder record
                SessionReminder.objects.create(
                    session=session,
                    reminder_type=reminder_type,
                    recipient_type=recipient_type,
                    recipient=user,
                    subject=subject,
                    message=text_content,
                    scheduled_for=timezone.now(),
                    sent_at=timezone.now(),
                    email_sent=True,
                    email_delivered=True
                )
                
            except Exception as e:
                # Log failed reminder
                SessionReminder.objects.create(
                    session=session,
                    reminder_type=reminder_type,
                    recipient_type=recipient_type,
                    recipient=user,
                    subject=template.subject,
                    message=str(e),
                    scheduled_for=timezone.now(),
                    email_sent=False
                )
    
    @staticmethod
    def send_coupon_email(coupon):
        """
        Send coupon email to recipient
        """
        template = EmailTemplate.objects.filter(
            template_type='coupon_delivery',
            is_active=True
        ).first()
        
        if not template:
            return False
        
        context = {
            'coupon': coupon,
            'recipient_name': coupon.recipient_name,
            'coupon_code': coupon.code,
            'company_name': coupon.coupon_system.company.name if coupon.coupon_system.company else 'AmitaCare',
            'discount_value': coupon.coupon_system.discount_value,
            'discount_type': coupon.coupon_system.discount_type,
            'valid_until': coupon.coupon_system.valid_until,
        }
        
        try:
            subject = template.subject.format(**context)
            html_content = template.html_content.format(**context)
            text_content = template.text_content.format(**context) if template.text_content else ""
            
            # Send email
            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.EMAIL_HOST_USER,
                to=[coupon.recipient_email]
            )
            if html_content:
                msg.attach_alternative(html_content, "text/html")
            
            msg.send()
            
            # Update coupon status
            coupon.status = 'sent'
            coupon.email_sent_at = timezone.now()
            coupon.save()
            
            # Log email
            CouponEmailLog.objects.create(
                coupon=coupon,
                recipient_email=coupon.recipient_email,
                subject=subject,
                email_content=html_content,
                status='sent',
                sent_at=timezone.now()
            )
            
            return True
            
        except Exception as e:
            # Log failed email
            CouponEmailLog.objects.create(
                coupon=coupon,
                recipient_email=coupon.recipient_email,
                subject=template.subject,
                email_content=template.html_content,
                status='failed',
                error_message=str(e)
            )
            return False
    
    @staticmethod
    def send_payment_confirmation(payment):
        """
        Send payment confirmation email
        """
        template = EmailTemplate.objects.filter(
            template_type='payment_confirmation',
            is_active=True
        ).first()
        
        if not template:
            return False
        
        context = {
            'payment': payment,
            'client_name': payment.client.user.get_full_name(),
            'amount': payment.final_amount,
            'payment_id': payment.payment_id,
            'invoice_number': payment.invoice_number,
            'payment_date': payment.payment_date,
        }
        
        try:
            subject = template.subject.format(**context)
            html_content = template.html_content.format(**context)
            text_content = template.text_content.format(**context) if template.text_content else ""
            
            # Send email
            msg = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.EMAIL_HOST_USER,
                to=[payment.client.user.email]
            )
            if html_content:
                msg.attach_alternative(html_content, "text/html")
            
            msg.send()
            
            # Log email
            EmailLog.objects.create(
                recipient=payment.client.user,
                recipient_email=payment.client.user.email,
                subject=subject,
                html_content=html_content,
                text_content=text_content,
                template=template,
                payment=payment,
                status='sent',
                sent_at=timezone.now(),
                context_data=context
            )
            
            return True
            
        except Exception as e:
            # Log failed email
            EmailLog.objects.create(
                recipient=payment.client.user,
                recipient_email=payment.client.user.email,
                subject=template.subject,
                html_content=template.html_content,
                text_content=template.text_content,
                template=template,
                payment=payment,
                status='failed',
                error_message=str(e),
                context_data=context
            )
            return False


# Celery tasks for automated email sending
@shared_task
def send_daily_reminders():
    """
    Daily task to send session reminders
    """
    EmailAutomationManager.send_session_reminders()


@shared_task
def send_session_confirmation_task(session_id):
    """
    Task to send session confirmation emails
    """
    try:
        session = TherapySession.objects.get(id=session_id)
        EmailAutomationManager.send_session_confirmation(session)
    except TherapySession.DoesNotExist:
        pass


@shared_task
def send_coupon_email_task(coupon_id):
    """
    Task to send coupon emails
    """
    try:
        coupon = IndividualCoupon.objects.get(id=coupon_id)
        EmailAutomationManager.send_coupon_email(coupon)
    except IndividualCoupon.DoesNotExist:
        pass


@shared_task
def send_payment_confirmation_task(payment_id):
    """
    Task to send payment confirmation emails
    """
    try:
        from payments.models import Payment
        payment = Payment.objects.get(id=payment_id)
        EmailAutomationManager.send_payment_confirmation(payment)
    except Payment.DoesNotExist:
        pass