import { z } from 'zod'

// Client Entry Validation Schema
export const clientRegistrationSchema = z.object({
    // Personal Information
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    dateOfBirth: z.string().refine((date) => {
        const birthDate = new Date(date)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        return age >= 13 && age <= 120
    }, 'Age must be between 13 and 120 years'),

    // Address Information
    address: z.object({
        street: z.string().min(5, 'Street address is required'),
        city: z.string().min(2, 'City is required'),
        state: z.string().min(2, 'State is required'),
        postalCode: z.string().min(5, 'Valid postal code is required'),
        country: z.string().min(2, 'Country is required')
    }),

    // Emergency Contact
    emergencyContact: z.object({
        name: z.string().min(2, 'Emergency contact name is required'),
        relationship: z.string().min(2, 'Relationship is required'),
        phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid emergency contact phone')
    }),

    // Company Validation (if applicable)
    companyCode: z.string().optional(),
    employeeId: z.string().optional(),

    // Consent and Legal
    consentToTreatment: z.boolean().refine(val => val === true, 'Consent to treatment is required'),
    privacyPolicyAccepted: z.boolean().refine(val => val === true, 'Privacy policy acceptance is required'),
    dataProcessingConsent: z.boolean().refine(val => val === true, 'Data processing consent is required'),

    // Timezone
    timezone: z.string().min(1, 'Timezone selection is required')
})

// Company Employee Validation
export const companyEmployeeSchema = z.object({
    companyCode: z.string().min(3, 'Company code must be at least 3 characters'),
    employeeId: z.string().min(1, 'Employee ID is required'),
    department: z.string().optional(),
    designation: z.string().optional(),
    managerEmail: z.string().email().optional()
})

// Session Booking Validation
export const sessionBookingSchema = z.object({
    therapistId: z.string().min(1, 'Therapist selection is required'),
    sessionType: z.enum(['individual', 'family', 'group']),
    preferredDate: z.string().refine((date) => {
        const selectedDate = new Date(date)
        const today = new Date()
        return selectedDate >= today
    }, 'Session date must be in the future'),
    preferredTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    duration: z.number().min(30).max(180),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
    timezone: z.string().min(1, 'Timezone is required')
})

// Test Report Upload Validation
export const testReportSchema = z.object({
    reportType: z.enum(['psychological', 'psychiatric', 'medical', 'other']),
    reportDate: z.string().refine((date) => {
        const reportDate = new Date(date)
        const today = new Date()
        return reportDate <= today
    }, 'Report date cannot be in the future'),
    uploadedBy: z.string().min(1, 'Uploader information is required'),
    description: z.string().max(200, 'Description cannot exceed 200 characters').optional(),
    confidentialityLevel: z.enum(['standard', 'high', 'restricted']),
    consentForSharing: z.boolean().refine(val => val === true, 'Consent for sharing is required')
})

export type ClientRegistration = z.infer<typeof clientRegistrationSchema>
export type CompanyEmployee = z.infer<typeof companyEmployeeSchema>
export type SessionBooking = z.infer<typeof sessionBookingSchema>
export type TestReport = z.infer<typeof testReportSchema>