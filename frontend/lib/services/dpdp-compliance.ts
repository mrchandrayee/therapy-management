interface DPDPComplianceRecord {
  clientId: string
  dataCategories: DataCategory[]
  processingPurposes: ProcessingPurpose[]
  consentStatus: ConsentStatus
  dataRetention: DataRetentionPolicy
  dataSubjectRights: DataSubjectRights
  lastUpdated: string
  complianceScore: number
}

interface DataCategory {
  category: string
  description: string
  sensitivity: 'low' | 'medium' | 'high' | 'critical'
  dataElements: string[]
  collectionMethod: string
  storageLocation: string
  encryptionStatus: boolean
}

interface ProcessingPurpose {
  purpose: string
  legalBasis: string
  description: string
  dataCategories: string[]
  retentionPeriod: string
  sharingPartners: string[]
}

interface ConsentStatus {
  consentGiven: boolean
  consentDate: string
  consentVersion: string
  withdrawalDate?: string
  renewalRequired: boolean
  renewalDue?: string
}

interface DataRetentionPolicy {
  retentionPeriod: string
  deletionSchedule: string
  archivalPolicy: string
  lastReviewDate: string
  nextReviewDate: string
}

interface DataSubjectRights {
  rightToAccess: boolean
  rightToCorrection: boolean
  rightToErasure: boolean
  rightToPortability: boolean
  rightToWithdrawConsent: boolean
  exercisedRights: ExercisedRight[]
}

interface ExercisedRight {
  rightType: string
  requestDate: string
  fulfillmentDate?: string
  status: 'pending' | 'fulfilled' | 'rejected'
  reason?: string
}

interface DPDPAuditLog {
  id: string
  clientId: string
  action: string
  dataCategory: string
  timestamp: string
  userId: string
  ipAddress: string
  details: Record<string, any>
  complianceImpact: 'none' | 'low' | 'medium' | 'high'
}

export class DPDPComplianceService {
  private static instance: DPDPComplianceService
  private complianceRecords: Map<string, DPDPComplianceRecord> = new Map()
  private auditLogs: DPDPAuditLog[] = []

  private constructor() {
    this.initializeDataCategories()
  }

  static getInstance(): DPDPComplianceService {
    if (!DPDPComplianceService.instance) {
      DPDPComplianceService.instance = new DPDPComplianceService()
    }
    return DPDPComplianceService.instance
  }

  private initializeDataCategories(): DataCategory[] {
    return [
      {
        category: 'Personal Identifiers',
        description: 'Basic personal identification information',
        sensitivity: 'medium',
        dataElements: ['Name', 'Email', 'Phone', 'Address', 'Date of Birth'],
        collectionMethod: 'Registration Form',
        storageLocation: 'Primary Database',
        encryptionStatus: true
      },
      {
        category: 'Health Information',
        description: 'Mental health and therapy-related data',
        sensitivity: 'critical',
        dataElements: ['Session Notes', 'Diagnoses', 'Treatment Plans', 'Progress Reports'],
        collectionMethod: 'Therapy Sessions',
        storageLocation: 'Secure Health Database',
        encryptionStatus: true
      },
      {
        category: 'Communication Records',
        description: 'Communication history and preferences',
        sensitivity: 'medium',
        dataElements: ['Email History', 'SMS Records', 'Call Logs', 'Chat Messages'],
        collectionMethod: 'System Generated',
        storageLocation: 'Communication Database',
        encryptionStatus: true
      },
      {
        category: 'Technical Data',
        description: 'System and usage data',
        sensitivity: 'low',
        dataElements: ['IP Address', 'Browser Info', 'Session Data', 'Usage Analytics'],
        collectionMethod: 'Automatic Collection',
        storageLocation: 'Analytics Database',
        encryptionStatus: false
      },
      {
        category: 'Financial Information',
        description: 'Payment and billing information',
        sensitivity: 'high',
        dataElements: ['Payment Methods', 'Transaction History', 'Billing Address'],
        collectionMethod: 'Payment Processing',
        storageLocation: 'Payment Gateway',
        encryptionStatus: true
      }
    ]
  }

  async createComplianceRecord(clientId: string): Promise<DPDPComplianceRecord> {
    const record: DPDPComplianceRecord = {
      clientId,
      dataCategories: this.initializeDataCategories(),
      processingPurposes: [
        {
          purpose: 'Mental Health Treatment',
          legalBasis: 'Consent (Section 7, DPDP Act 2023)',
          description: 'Processing personal data for providing mental health therapy services',
          dataCategories: ['Personal Identifiers', 'Health Information', 'Communication Records'],
          retentionPeriod: '7 years from last session',
          sharingPartners: ['Assigned Therapist', 'Healthcare Providers']
        },
        {
          purpose: 'Service Delivery',
          legalBasis: 'Legitimate Interest (Section 8, DPDP Act 2023)',
          description: 'Processing data for appointment scheduling and service delivery',
          dataCategories: ['Personal Identifiers', 'Communication Records', 'Technical Data'],
          retentionPeriod: '3 years from account closure',
          sharingPartners: ['Platform Administrators']
        },
        {
          purpose: 'Legal Compliance',
          legalBasis: 'Legal Obligation (Section 9, DPDP Act 2023)',
          description: 'Processing data to comply with healthcare regulations',
          dataCategories: ['Health Information', 'Personal Identifiers'],
          retentionPeriod: 'As required by law',
          sharingPartners: ['Regulatory Authorities']
        }
      ],
      consentStatus: {
        consentGiven: false,
        consentDate: '',
        consentVersion: '1.0',
        renewalRequired: false
      },
      dataRetention: {
        retentionPeriod: '7 years from last session',
        deletionSchedule: 'Annual review and deletion',
        archivalPolicy: 'Secure archival for legal compliance',
        lastReviewDate: new Date().toISOString(),
        nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      },
      dataSubjectRights: {
        rightToAccess: true,
        rightToCorrection: true,
        rightToErasure: true,
        rightToPortability: true,
        rightToWithdrawConsent: true,
        exercisedRights: []
      },
      lastUpdated: new Date().toISOString(),
      complianceScore: 0
    }

    this.complianceRecords.set(clientId, record)
    await this.logAuditEvent(clientId, 'COMPLIANCE_RECORD_CREATED', 'System', {})
    return record
  }

  async updateConsentStatus(
    clientId: string, 
    consentGiven: boolean, 
    consentVersion: string
  ): Promise<void> {
    const record = this.complianceRecords.get(clientId)
    if (!record) {
      throw new Error('Compliance record not found')
    }

    record.consentStatus = {
      consentGiven,
      consentDate: new Date().toISOString(),
      consentVersion,
      renewalRequired: false,
      renewalDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }

    record.lastUpdated = new Date().toISOString()
    record.complianceScore = this.calculateComplianceScore(record)

    await this.logAuditEvent(clientId, 'CONSENT_UPDATED', 'System', {
      consentGiven,
      consentVersion
    })
  }

  async exerciseDataSubjectRight(
    clientId: string,
    rightType: string,
    requestDetails: any
  ): Promise<string> {
    const record = this.complianceRecords.get(clientId)
    if (!record) {
      throw new Error('Compliance record not found')
    }

    const requestId = `DSR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const exercisedRight: ExercisedRight = {
      rightType,
      requestDate: new Date().toISOString(),
      status: 'pending'
    }

    record.dataSubjectRights.exercisedRights.push(exercisedRight)
    record.lastUpdated = new Date().toISOString()

    await this.logAuditEvent(clientId, 'DATA_SUBJECT_RIGHT_EXERCISED', 'Client', {
      rightType,
      requestId,
      requestDetails
    })

    // Process the request based on type
    switch (rightType) {
      case 'access':
        await this.processAccessRequest(clientId, requestId)
        break
      case 'correction':
        await this.processCorrectionRequest(clientId, requestId, requestDetails)
        break
      case 'erasure':
        await this.processErasureRequest(clientId, requestId)
        break
      case 'portability':
        await this.processPortabilityRequest(clientId, requestId)
        break
      case 'withdraw_consent':
        await this.processConsentWithdrawal(clientId, requestId)
        break
    }

    return requestId
  }

  private async processAccessRequest(clientId: string, requestId: string): Promise<void> {
    // Generate comprehensive data export
    const record = this.complianceRecords.get(clientId)
    if (!record) return

    // This would generate a complete data export
    const dataExport = {
      personalData: record.dataCategories,
      processingActivities: record.processingPurposes,
      consentHistory: record.consentStatus,
      exercisedRights: record.dataSubjectRights.exercisedRights
    }

    await this.logAuditEvent(clientId, 'ACCESS_REQUEST_PROCESSED', 'System', {
      requestId,
      dataExported: Object.keys(dataExport)
    })
  }

  private async processCorrectionRequest(
    clientId: string, 
    requestId: string, 
    corrections: any
  ): Promise<void> {
    // Process data corrections
    await this.logAuditEvent(clientId, 'CORRECTION_REQUEST_PROCESSED', 'System', {
      requestId,
      corrections
    })
  }

  private async processErasureRequest(clientId: string, requestId: string): Promise<void> {
    // Process right to be forgotten
    const record = this.complianceRecords.get(clientId)
    if (!record) return

    // Check if erasure is legally permissible
    const canErase = this.canEraseData(record)
    
    if (canErase) {
      // Schedule data deletion
      await this.scheduleDataDeletion(clientId)
    }

    await this.logAuditEvent(clientId, 'ERASURE_REQUEST_PROCESSED', 'System', {
      requestId,
      canErase,
      scheduledForDeletion: canErase
    })
  }

  private async processPortabilityRequest(clientId: string, requestId: string): Promise<void> {
    // Generate portable data format
    await this.logAuditEvent(clientId, 'PORTABILITY_REQUEST_PROCESSED', 'System', {
      requestId,
      format: 'JSON'
    })
  }

  private async processConsentWithdrawal(clientId: string, requestId: string): Promise<void> {
    const record = this.complianceRecords.get(clientId)
    if (!record) return

    record.consentStatus.withdrawalDate = new Date().toISOString()
    record.consentStatus.consentGiven = false

    await this.logAuditEvent(clientId, 'CONSENT_WITHDRAWN', 'Client', {
      requestId,
      withdrawalDate: record.consentStatus.withdrawalDate
    })
  }

  private canEraseData(record: DPDPComplianceRecord): boolean {
    // Check legal obligations and legitimate interests
    const hasLegalObligation = record.processingPurposes.some(
      p => p.legalBasis.includes('Legal Obligation')
    )
    
    const hasLegitimateInterest = record.processingPurposes.some(
      p => p.legalBasis.includes('Legitimate Interest')
    )

    // Cannot erase if there are legal obligations or ongoing legitimate interests
    return !hasLegalObligation && !hasLegitimateInterest
  }

  private async scheduleDataDeletion(clientId: string): Promise<void> {
    // Schedule data deletion after grace period
    const deletionDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    
    await this.logAuditEvent(clientId, 'DATA_DELETION_SCHEDULED', 'System', {
      scheduledDate: deletionDate.toISOString()
    })
  }

  private calculateComplianceScore(record: DPDPComplianceRecord): number {
    let score = 0
    const maxScore = 100

    // Consent status (30 points)
    if (record.consentStatus.consentGiven) score += 30

    // Data categories properly classified (20 points)
    const classifiedCategories = record.dataCategories.filter(
      c => c.sensitivity && c.encryptionStatus !== undefined
    )
    score += (classifiedCategories.length / record.dataCategories.length) * 20

    // Processing purposes documented (20 points)
    const documentedPurposes = record.processingPurposes.filter(
      p => p.legalBasis && p.retentionPeriod
    )
    score += (documentedPurposes.length / record.processingPurposes.length) * 20

    // Data retention policy (15 points)
    if (record.dataRetention.retentionPeriod && record.dataRetention.deletionSchedule) {
      score += 15
    }

    // Data subject rights enabled (15 points)
    const enabledRights = Object.values(record.dataSubjectRights).filter(
      (value, index) => index < 5 && value === true
    ).length
    score += (enabledRights / 5) * 15

    return Math.round(score)
  }

  async logAuditEvent(
    clientId: string,
    action: string,
    userId: string,
    details: Record<string, any>,
    complianceImpact: 'none' | 'low' | 'medium' | 'high' = 'low'
  ): Promise<void> {
    const auditLog: DPDPAuditLog = {
      id: `AUDIT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clientId,
      action,
      dataCategory: details.dataCategory || 'General',
      timestamp: new Date().toISOString(),
      userId,
      ipAddress: '127.0.0.1', // This would come from request context
      details,
      complianceImpact
    }

    this.auditLogs.push(auditLog)
  }

  async getComplianceReport(clientId: string): Promise<{
    complianceScore: number
    consentStatus: ConsentStatus
    dataCategories: DataCategory[]
    exercisedRights: ExercisedRight[]
    auditSummary: {
      totalEvents: number
      recentEvents: DPDPAuditLog[]
      complianceIssues: string[]
    }
  }> {
    const record = this.complianceRecords.get(clientId)
    if (!record) {
      throw new Error('Compliance record not found')
    }

    const clientAuditLogs = this.auditLogs.filter(log => log.clientId === clientId)
    const recentLogs = clientAuditLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    const complianceIssues: string[] = []
    
    if (!record.consentStatus.consentGiven) {
      complianceIssues.push('Consent not obtained')
    }
    
    if (record.complianceScore < 80) {
      complianceIssues.push('Compliance score below threshold')
    }

    const sensitiveDataWithoutEncryption = record.dataCategories.filter(
      c => (c.sensitivity === 'high' || c.sensitivity === 'critical') && !c.encryptionStatus
    )
    
    if (sensitiveDataWithoutEncryption.length > 0) {
      complianceIssues.push('Sensitive data not encrypted')
    }

    return {
      complianceScore: record.complianceScore,
      consentStatus: record.consentStatus,
      dataCategories: record.dataCategories,
      exercisedRights: record.dataSubjectRights.exercisedRights,
      auditSummary: {
        totalEvents: clientAuditLogs.length,
        recentEvents: recentLogs,
        complianceIssues
      }
    }
  }

  async generateDPDPComplianceReport(): Promise<{
    totalClients: number
    compliantClients: number
    complianceRate: number
    commonIssues: Array<{ issue: string; count: number }>
    auditSummary: {
      totalAuditEvents: number
      highRiskEvents: number
      recentEvents: DPDPAuditLog[]
    }
  }> {
    const allRecords = Array.from(this.complianceRecords.values())
    const compliantClients = allRecords.filter(r => r.complianceScore >= 80).length
    
    const issueMap = new Map<string, number>()
    
    for (const record of allRecords) {
      if (!record.consentStatus.consentGiven) {
        issueMap.set('Missing Consent', (issueMap.get('Missing Consent') || 0) + 1)
      }
      
      if (record.complianceScore < 80) {
        issueMap.set('Low Compliance Score', (issueMap.get('Low Compliance Score') || 0) + 1)
      }
    }

    const commonIssues = Array.from(issueMap.entries())
      .map(([issue, count]) => ({ issue, count }))
      .sort((a, b) => b.count - a.count)

    const highRiskEvents = this.auditLogs.filter(log => log.complianceImpact === 'high').length
    const recentEvents = this.auditLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20)

    return {
      totalClients: allRecords.length,
      compliantClients,
      complianceRate: allRecords.length > 0 ? (compliantClients / allRecords.length) * 100 : 0,
      commonIssues,
      auditSummary: {
        totalAuditEvents: this.auditLogs.length,
        highRiskEvents,
        recentEvents
      }
    }
  }
}