interface ReminderConfig {
  sessionId: string
  clientId: string
  sessionDateTime: string
  clientTimezone: string
  reminderTypes: ReminderType[]
  contactMethods: ContactMethod[]
}

type ReminderType = 
  | 'booking-confirmation'
  | '24-hours-before'
  | '2-hours-before'
  | '15-minutes-before'
  | 'session-starting'
  | 'session-missed'
  | 'follow-up'

type ContactMethod = 'email' | 'sms' | 'push' | 'whatsapp'

interface ReminderTemplate {
  type: ReminderType
  title: string
  emailSubject: string
  emailBody: string
  smsBody: string
  pushTitle: string
  pushBody: string
  triggerMinutesBefore: number
}

interface ReminderJob {
  id: string
  sessionId: string
  clientId: string
  reminderType: ReminderType
  scheduledFor: string
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  contactMethod: ContactMethod
  attempts: number
  lastAttempt?: string
  error?: string
}

export class ReminderSystemService {
  private static instance: ReminderSystemService
  private reminderJobs: Map<string, ReminderJob> = new Map()
  private reminderTemplates: ReminderTemplate[] = []
  private jobQueue: ReminderJob[] = []

  private constructor() {
    this.initializeReminderTemplates()
    this.startReminderProcessor()
  }

  static getInstance(): ReminderSystemService {
    if (!ReminderSystemService.instance) {
      ReminderSystemService.instance = new ReminderSystemService()
    }
    return ReminderSystemService.instance
  }

  private initializeReminderTemplates() {
    this.reminderTemplates = [
      {
        type: 'booking-confirmation',
        title: 'Session Confirmed',
        emailSubject: 'Your therapy session has been confirmed',
        emailBody: `Dear {{clientName}},

Your therapy session has been confirmed for {{sessionDate}} at {{sessionTime}} ({{timezone}}).

Therapist: {{therapistName}}
Session Type: {{sessionType}}
Duration: {{duration}} minutes

{{#if meetingLink}}
Join Link: {{meetingLink}}
{{/if}}

If you need to reschedule or cancel, please do so at least 24 hours in advance.

Best regards,
Your Therapy Team`,
        smsBody: 'Session confirmed for {{sessionDate}} at {{sessionTime}} with {{therapistName}}. {{#if meetingLink}}Join: {{meetingLink}}{{/if}}',
        pushTitle: 'Session Confirmed',
        pushBody: '{{sessionDate}} at {{sessionTime}} with {{therapistName}}',
        triggerMinutesBefore: 0
      },
      {
        type: '24-hours-before',
        title: '24 Hour Reminder',
        emailSubject: 'Reminder: Your therapy session is tomorrow',
        emailBody: `Dear {{clientName}},

This is a reminder that you have a therapy session scheduled for tomorrow:

Date & Time: {{sessionDate}} at {{sessionTime}} ({{timezone}})
Therapist: {{therapistName}}
Session Type: {{sessionType}}

{{#if meetingLink}}
Join Link: {{meetingLink}}
{{/if}}

Please ensure you're in a quiet, private space for your session.

Best regards,
Your Therapy Team`,
        smsBody: 'Reminder: Therapy session tomorrow {{sessionDate}} at {{sessionTime}} with {{therapistName}}',
        pushTitle: 'Session Tomorrow',
        pushBody: '{{sessionTime}} with {{therapistName}}',
        triggerMinutesBefore: 1440 // 24 hours
      },
      {
        type: '2-hours-before',
        title: '2 Hour Reminder',
        emailSubject: 'Your therapy session starts in 2 hours',
        emailBody: `Dear {{clientName}},

Your therapy session starts in 2 hours:

Time: {{sessionTime}} ({{timezone}})
Therapist: {{therapistName}}

{{#if meetingLink}}
Join Link: {{meetingLink}}
{{/if}}

Please prepare any topics you'd like to discuss and ensure you have a stable internet connection.

Best regards,
Your Therapy Team`,
        smsBody: 'Your session with {{therapistName}} starts in 2 hours at {{sessionTime}}',
        pushTitle: 'Session in 2 Hours',
        pushBody: '{{sessionTime}} with {{therapistName}}',
        triggerMinutesBefore: 120
      },
      {
        type: '15-minutes-before',
        title: '15 Minute Reminder',
        emailSubject: 'Your therapy session starts in 15 minutes',
        emailBody: `Dear {{clientName}},

Your therapy session starts in 15 minutes.

{{#if meetingLink}}
Join now: {{meetingLink}}
{{/if}}

Please join the session on time.

Best regards,
Your Therapy Team`,
        smsBody: 'Session starting in 15 minutes. {{#if meetingLink}}Join: {{meetingLink}}{{/if}}',
        pushTitle: 'Session Starting Soon',
        pushBody: 'Join in 15 minutes',
        triggerMinutesBefore: 15
      },
      {
        type: 'session-starting',
        title: 'Session Starting Now',
        emailSubject: 'Your therapy session is starting now',
        emailBody: `Dear {{clientName}},

Your therapy session is starting now.

{{#if meetingLink}}
Join immediately: {{meetingLink}}
{{/if}}

Best regards,
Your Therapy Team`,
        smsBody: 'Your session is starting now! {{#if meetingLink}}Join: {{meetingLink}}{{/if}}',
        pushTitle: 'Session Starting',
        pushBody: 'Join your session now',
        triggerMinutesBefore: 0
      },
      {
        type: 'session-missed',
        title: 'Missed Session',
        emailSubject: 'You missed your therapy session',
        emailBody: `Dear {{clientName}},

We noticed you missed your therapy session scheduled for {{sessionTime}} today.

If this was due to an emergency or technical issue, please contact us to reschedule.

Therapist: {{therapistName}}

Best regards,
Your Therapy Team`,
        smsBody: 'You missed your session with {{therapistName}} at {{sessionTime}}. Please contact us to reschedule.',
        pushTitle: 'Session Missed',
        pushBody: 'Contact us to reschedule',
        triggerMinutesBefore: -30 // 30 minutes after session start
      },
      {
        type: 'follow-up',
        title: 'Session Follow-up',
        emailSubject: 'How was your therapy session?',
        emailBody: `Dear {{clientName}},

Thank you for attending your therapy session with {{therapistName}} yesterday.

We hope you found it helpful. If you have any feedback or would like to schedule your next session, please let us know.

Best regards,
Your Therapy Team`,
        smsBody: 'Thank you for your session with {{therapistName}}. Please share feedback or schedule your next session.',
        pushTitle: 'Session Feedback',
        pushBody: 'How was your session?',
        triggerMinutesBefore: -1440 // 24 hours after session
      }
    ]
  }

  async scheduleReminders(config: ReminderConfig): Promise<string[]> {
    const jobIds: string[] = []
    const sessionDateTime = new Date(config.sessionDateTime)

    for (const reminderType of config.reminderTypes) {
      const template = this.reminderTemplates.find(t => t.type === reminderType)
      if (!template) continue

      for (const contactMethod of config.contactMethods) {
        const scheduledFor = new Date(
          sessionDateTime.getTime() - (template.triggerMinutesBefore * 60 * 1000)
        )

        // Don't schedule reminders in the past
        if (scheduledFor <= new Date() && template.triggerMinutesBefore >= 0) continue

        const jobId = `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        const job: ReminderJob = {
          id: jobId,
          sessionId: config.sessionId,
          clientId: config.clientId,
          reminderType,
          scheduledFor: scheduledFor.toISOString(),
          status: 'pending',
          contactMethod,
          attempts: 0
        }

        this.reminderJobs.set(jobId, job)
        this.jobQueue.push(job)
        jobIds.push(jobId)
      }
    }

    // Sort job queue by scheduled time
    this.jobQueue.sort((a, b) => 
      new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
    )

    return jobIds
  }

  async cancelReminders(sessionId: string): Promise<number> {
    let cancelledCount = 0
    
    for (const [jobId, job] of this.reminderJobs.entries()) {
      if (job.sessionId === sessionId && job.status === 'pending') {
        job.status = 'cancelled'
        cancelledCount++
      }
    }

    // Remove cancelled jobs from queue
    this.jobQueue = this.jobQueue.filter(job => 
      !(job.sessionId === sessionId && job.status === 'cancelled')
    )

    return cancelledCount
  }

  async getReminderStatus(sessionId: string): Promise<ReminderJob[]> {
    return Array.from(this.reminderJobs.values())
      .filter(job => job.sessionId === sessionId)
  }

  private startReminderProcessor() {
    setInterval(() => {
      this.processReminderQueue()
    }, 60000) // Check every minute
  }

  private async processReminderQueue() {
    const now = new Date()
    const dueJobs = this.jobQueue.filter(job => 
      job.status === 'pending' && new Date(job.scheduledFor) <= now
    )

    for (const job of dueJobs) {
      await this.sendReminder(job)
    }

    // Remove processed jobs from queue
    this.jobQueue = this.jobQueue.filter(job => job.status === 'pending')
  }

  private async sendReminder(job: ReminderJob): Promise<void> {
    try {
      job.attempts++
      job.lastAttempt = new Date().toISOString()

      const template = this.reminderTemplates.find(t => t.type === job.reminderType)
      if (!template) {
        job.status = 'failed'
        job.error = 'Template not found'
        return
      }

      // Here you would integrate with actual notification services
      // For now, we'll simulate the sending
      const success = await this.simulateSendNotification(job, template)

      if (success) {
        job.status = 'sent'
      } else {
        if (job.attempts >= 3) {
          job.status = 'failed'
          job.error = 'Max attempts reached'
        } else {
          // Retry in 5 minutes
          const retryTime = new Date(Date.now() + 5 * 60 * 1000)
          job.scheduledFor = retryTime.toISOString()
        }
      }
    } catch (error) {
      job.status = 'failed'
      job.error = error instanceof Error ? error.message : 'Unknown error'
    }
  }

  private async simulateSendNotification(
    job: ReminderJob, 
    template: ReminderTemplate
  ): Promise<boolean> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate 95% success rate
    return Math.random() > 0.05
  }

  // Enhanced timezone-aware scheduling
  async scheduleReminderWithTimezone(
    sessionId: string,
    clientId: string,
    sessionDateTime: string,
    clientTimezone: string,
    reminderTypes: ReminderType[],
    contactMethods: ContactMethod[]
  ): Promise<string[]> {
    // Convert session time to client's timezone
    const sessionInClientTz = new Date(sessionDateTime).toLocaleString('en-US', {
      timeZone: clientTimezone
    })

    return this.scheduleReminders({
      sessionId,
      clientId,
      sessionDateTime: new Date(sessionInClientTz).toISOString(),
      clientTimezone,
      reminderTypes,
      contactMethods
    })
  }

  // Get reminder statistics
  async getReminderStats(clientId?: string): Promise<{
    total: number
    sent: number
    failed: number
    pending: number
    cancelled: number
  }> {
    let jobs = Array.from(this.reminderJobs.values())
    
    if (clientId) {
      jobs = jobs.filter(job => job.clientId === clientId)
    }

    return {
      total: jobs.length,
      sent: jobs.filter(j => j.status === 'sent').length,
      failed: jobs.filter(j => j.status === 'failed').length,
      pending: jobs.filter(j => j.status === 'pending').length,
      cancelled: jobs.filter(j => j.status === 'cancelled').length
    }
  }
}