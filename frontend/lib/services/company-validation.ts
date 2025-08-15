interface CompanyValidationResult {
  isValid: boolean
  companyName?: string
  benefits?: {
    sessionsIncluded: number
    discountPercentage: number
    specialServices: string[]
  }
  error?: string
}

interface CompanyEmployee {
  employeeId: string
  companyCode: string
  email: string
  department?: string
  isActive: boolean
}

export class CompanyValidationService {
  private static instance: CompanyValidationService
  private companyDatabase: Map<string, any> = new Map()

  private constructor() {
    // Initialize with sample company data
    this.initializeSampleData()
  }

  static getInstance(): CompanyValidationService {
    if (!CompanyValidationService.instance) {
      CompanyValidationService.instance = new CompanyValidationService()
    }
    return CompanyValidationService.instance
  }

  private initializeSampleData() {
    // Sample companies for validation
    this.companyDatabase.set('TECH001', {
      name: 'TechCorp Solutions',
      isActive: true,
      benefits: {
        sessionsIncluded: 12,
        discountPercentage: 50,
        specialServices: ['family-therapy', 'stress-management', 'career-counseling']
      },
      employees: new Set(['EMP001', 'EMP002', 'EMP003'])
    })

    this.companyDatabase.set('HEALTH002', {
      name: 'HealthFirst Medical',
      isActive: true,
      benefits: {
        sessionsIncluded: 8,
        discountPercentage: 30,
        specialServices: ['individual-therapy', 'group-therapy']
      },
      employees: new Set(['DOC001', 'NURSE001', 'ADMIN001'])
    })

    this.companyDatabase.set('EDU003', {
      name: 'Global Education Institute',
      isActive: true,
      benefits: {
        sessionsIncluded: 6,
        discountPercentage: 40,
        specialServices: ['student-counseling', 'academic-stress', 'career-guidance']
      },
      employees: new Set(['PROF001', 'STAFF001', 'ADMIN002'])
    })
  }

  async validateCompanyEmployee(
    companyCode: string, 
    employeeId: string, 
    email: string
  ): Promise<CompanyValidationResult> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const company = this.companyDatabase.get(companyCode.toUpperCase())
      
      if (!company) {
        return {
          isValid: false,
          error: 'Company code not found. Please verify with your HR department.'
        }
      }

      if (!company.isActive) {
        return {
          isValid: false,
          error: 'Company account is currently inactive. Please contact support.'
        }
      }

      if (!company.employees.has(employeeId.toUpperCase())) {
        return {
          isValid: false,
          error: 'Employee ID not found in company records. Please verify with HR.'
        }
      }

      // Additional email domain validation (optional)
      const companyDomains = this.getCompanyEmailDomains(companyCode)
      if (companyDomains.length > 0) {
        const emailDomain = email.split('@')[1]?.toLowerCase()
        if (!companyDomains.includes(emailDomain)) {
          return {
            isValid: false,
            error: 'Email domain does not match company records.'
          }
        }
      }

      return {
        isValid: true,
        companyName: company.name,
        benefits: company.benefits
      }
    } catch (error) {
      return {
        isValid: false,
        error: 'Validation service temporarily unavailable. Please try again later.'
      }
    }
  }

  private getCompanyEmailDomains(companyCode: string): string[] {
    const domainMap: Record<string, string[]> = {
      'TECH001': ['techcorp.com', 'techcorp.in'],
      'HEALTH002': ['healthfirst.com', 'hf-medical.org'],
      'EDU003': ['globaledu.edu', 'gei.ac.in']
    }
    return domainMap[companyCode.toUpperCase()] || []
  }

  async getCompanyBenefits(companyCode: string): Promise<any> {
    const company = this.companyDatabase.get(companyCode.toUpperCase())
    return company?.benefits || null
  }

  async addCompanyEmployee(
    companyCode: string, 
    employeeData: CompanyEmployee
  ): Promise<boolean> {
    try {
      const company = this.companyDatabase.get(companyCode.toUpperCase())
      if (company) {
        company.employees.add(employeeData.employeeId.toUpperCase())
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  async removeCompanyEmployee(
    companyCode: string, 
    employeeId: string
  ): Promise<boolean> {
    try {
      const company = this.companyDatabase.get(companyCode.toUpperCase())
      if (company) {
        return company.employees.delete(employeeId.toUpperCase())
      }
      return false
    } catch (error) {
      return false
    }
  }

  // DPDP Act Compliance - Employee data handling
  async getEmployeeDataProcessingConsent(
    companyCode: string, 
    employeeId: string
  ): Promise<{
    consentGiven: boolean
    consentDate?: string
    dataRetentionPeriod: number
    processingPurposes: string[]
  }> {
    // This would typically fetch from a compliance database
    return {
      consentGiven: true,
      consentDate: new Date().toISOString(),
      dataRetentionPeriod: 7, // years
      processingPurposes: [
        'Employee wellness program',
        'Mental health support',
        'Insurance claim processing',
        'Compliance reporting'
      ]
    }
  }
}