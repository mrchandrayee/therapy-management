interface ConsentRecord {
  id: string
  clientId: string
  consentType: ConsentType
  granted: boolean
  grantedAt: string
  expiresAt?: string
  withdrawnAt?: string
  version: string
  ipAddress: string
  userAgent: string
  digitalSignature?: string
}

type ConsentType = 
  | 'treatment'
  | 'data-processing'
  | 'marketing'
  | 'research'
  | 'recording'
  | 'sharing-with-family'
  | 'sharing-with-company'
  | 'international-transfer'

interface ConsentTemplate {
  type: ConsentType
  title: string
  description: string
  required: boolean
  version: string
  expiryMonths?: number
}

export class ConsentManagementService {
  private static instance: ConsentManagementService
  private consentRecords: Map<string, ConsentRecord[]> = new Map()
  private consentTemplates: ConsentTemplate[] = []

  private constructor() {
    this.initializeConsentTemplates()
  }

  static getInstance(): ConsentManagementService {
    if (!ConsentManagementService.instance) {
      ConsentManagementService.instance = new ConsentManagementService()
    }
    return ConsentManagementService.instance
  }

  private initializeConsentTemplates() {
    this.consentTemplates = [
      {
        type: 'treatment',
        title: 'Consent to Treatment',
        description: 'I consent to receive mental health treatment and therapy services.',
        required: true,
        version: '1.0'
      },
      {
        type: 'data-processing',
        title: 'Data Processing Consent (DPDP Act)',
        description: 'I consent to the processing of my personal data for therapy services as per the Digital Personal Data Protection Act, 2023.',
        required: true,
        version: '1.0'
      },
      {
        type: 'recording',
        title: 'Session Recording Consent',
        description: 'I consent to the recording of therapy sessions for quality assurance and training purposes.',
        required: false,
        version: '1.0',
        expiryMonths: 12
      },
      {
        type: 'sharing-with-family',
        title: 'Family Information Sharing',
        description: 'I consent to sharing relevant therapy information with designated family members.',
        required: false,
        version: '1.0',
        expiryMonths: 6
      },
      {
        type: 'sharing-with-company',
        title: 'Company Information Sharing',
        description: 'I consent to sharing anonymized therapy progress with my employer for wellness program purposes.',
        required: false,
        version: '1.0',
        expiryMonths: 12
      },
      {
        type: 'marketing',
        title: 'Marketing Communications',
        description: 'I consent to receive marketing communications about new services and wellness programs.',
        required: false,
        version: '1.0',
        expiryMonths: 24
      },
      {
        type: 'research',
        title: 'Research Participation',
        description: 'I consent to the use of my anonymized data for mental health research purposes.',
        required: false,
        version: '1.0',
        expiryMonths: 60
      },
      {
        type: 'international-transfer',
        title: 'International Data Transfer',
        description: 'I consent to the transfer of my data to international servers for service delivery.',
        required: false,
        version: '1.0',
        expiryMonths: 12
      }
    ]
  }

  async recordConsent(
    clientId: string,
    consentType: ConsentType,
    granted: boolean,
    metadata: {
      ipAddress: string
      userAgent: string
      digitalSignature?: string
    }
  ): Promise<string> {
    const template = this.consentTemplates.find(t => t.type === consentType)
    if (!template) {
      throw new Error(`Unknown consent type: ${consentType}`)
    }

    const consentId = `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    const expiresAt = template.expiryMonths 
      ? new Date(Date.now() + template.expiryMonths * 30 * 24 * 60 * 60 * 1000).toISOString()
      : undefined

    const record: ConsentRecord = {
      id: consentId,
      clientId,
      consentType,
      granted,
      grantedAt: now,
      expiresAt,
      version: template.version,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      digitalSignature: metadata.digitalSignature
    }

    if (!this.consentRecords.has(clientId)) {
      this.consentRecords.set(clientId, [])
    }

    this.consentRecords.get(clientId)!.push(record)
    return consentId
  }

  async withdrawConsent(
    clientId: string,
    consentType: ConsentType,
    metadata: {
      ipAddress: string
      userAgent: string
    }
  ): Promise<boolean> {
    const records = this.consentRecords.get(clientId) || []
    const activeRecord = records
      .filter(r => r.consentType === consentType && r.granted && !r.withdrawnAt)
      .sort((a, b) => new Date(b.grantedAt).getTime() - new Date(a.grantedAt).getTime())[0]

    if (activeRecord) {
      activeRecord.withdrawnAt = new Date().toISOString()
      
      // Record withdrawal as a new record
      await this.recordConsent(clientId, consentType, false, metadata)
      return true
    }

    return false
  }

  async getConsentStatus(clientId: string): Promise<Record<ConsentType, boolean>> {
    const records = this.consentRecords.get(clientId) || []
    const status: Record<ConsentType, boolean> = {} as any

    for (const template of this.consentTemplates) {
      const relevantRecords = records
        .filter(r => r.consentType === template.type)
        .sort((a, b) => new Date(b.grantedAt).getTime() - new Date(a.grantedAt).getTime())

      const latestRecord = relevantRecords[0]
      
      if (!latestRecord) {
        status[template.type] = false
        continue
      }

      // Check if consent is withdrawn
      if (latestRecord.withdrawnAt) {
        status[template.type] = false
        continue
      }

      // Check if consent is expired
      if (latestRecord.expiresAt && new Date(latestRecord.expiresAt) < new Date()) {
        status[template.type] = false
        continue
      }

      status[template.type] = latestRecord.granted
    }

    return status
  }

  async getRequiredConsents(): Promise<ConsentTemplate[]> {
    return this.consentTemplates.filter(t => t.required)
  }

  async getAllConsentTemplates(): Promise<ConsentTemplate[]> {
    return [...this.consentTemplates]
  }

  async getConsentHistory(clientId: string): Promise<ConsentRecord[]> {
    return this.consentRecords.get(clientId) || []
  }

  async validateDPDPCompliance(clientId: string): Promise<{
    compliant: boolean
    missingConsents: ConsentType[]
    expiringConsents: Array<{ type: ConsentType; expiresAt: string }>
  }> {
    const status = await this.getConsentStatus(clientId)
    const requiredConsents = await this.getRequiredConsents()
    
    const missingConsents: ConsentType[] = []
    const expiringConsents: Array<{ type: ConsentType; expiresAt: string }> = []

    // Check required consents
    for (const template of requiredConsents) {
      if (!status[template.type]) {
        missingConsents.push(template.type)
      }
    }

    // Check expiring consents (within 30 days)
    const records = this.consentRecords.get(clientId) || []
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    for (const record of records) {
      if (record.granted && !record.withdrawnAt && record.expiresAt) {
        const expiryDate = new Date(record.expiresAt)
        if (expiryDate <= thirtyDaysFromNow && expiryDate > new Date()) {
          expiringConsents.push({
            type: record.consentType,
            expiresAt: record.expiresAt
          })
        }
      }
    }

    return {
      compliant: missingConsents.length === 0,
      missingConsents,
      expiringConsents
    }
  }

  // DPDP Act specific methods
  async generateDataProcessingRecord(clientId: string): Promise<{
    dataSubject: string
    processingPurposes: string[]
    dataCategories: string[]
    retentionPeriod: string
    consentStatus: boolean
    lastUpdated: string
  }> {
    const status = await this.getConsentStatus(clientId)
    
    return {
      dataSubject: clientId,
      processingPurposes: [
        'Mental health treatment',
        'Appointment scheduling',
        'Progress tracking',
        'Communication with healthcare providers'
      ],
      dataCategories: [
        'Personal identifiers',
        'Health information',
        'Communication records',
        'Session notes'
      ],
      retentionPeriod: '7 years from last session',
      consentStatus: status['data-processing'],
      lastUpdated: new Date().toISOString()
    }
  }
}