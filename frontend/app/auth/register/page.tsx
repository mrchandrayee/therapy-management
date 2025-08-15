'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription, AlertIcons } from '@/components/ui/alert'
import { StepProgress } from '@/components/ui/progress'

export default function RegisterPage() {
    const [step, setStep] = useState(1)
    const [userType, setUserType] = useState('client')
    const [formData, setFormData] = useState({
        // Basic Info
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',

        // Client specific
        dateOfBirth: '',
        gender: '',
        address: '',
        pincode: '',
        emergencyContactName: '',
        emergencyContactPhone: '',

        // Therapist specific
        licenseNumber: '',
        specializations: [] as string[],
        experience: '',
        bio: '',
        consultationFee: '',

        // Company employee
        companyId: '',
        employeeId: '',

        // Consent
        termsAccepted: false,
        privacyAccepted: false,
        consentForTreatment: false
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const type = searchParams.get('type')
        if (type && ['client', 'therapist', 'company_employee'].includes(type)) {
            setUserType(type)
        }
    }, [searchParams])

    const specializations = [
        'Anxiety & Stress Management',
        'Depression & Mood Disorders',
        'Relationship Counseling',
        'Family Therapy',
        'Trauma & PTSD',
        'Addiction Recovery',
        'Grief & Loss',
        'Child Psychology',
        'Adolescent Counseling',
        'Career Counseling'
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (step < 3) {
            setStep(step + 1)
            return
        }

        setIsLoading(true)
        setError('')

        try {
            // Validation
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match')
                setIsLoading(false)
                return
            }

            // API call would go here
            console.log('Registration data:', { ...formData, userType })

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Redirect to dashboard or login
            router.push('/auth/login?message=Registration successful')

        } catch (err) {
            setError('Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string | boolean | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600">Let's start with your basic details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="First Name"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    placeholder="Enter your first name"
                />
                <Input
                    label="Last Name"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    placeholder="Enter your last name"
                />
            </div>

            <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="Enter your email address"
                helperText="We'll use this for account verification and communication"
            />

            <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                placeholder="+91 98765 43210"
                helperText="Include country code for international numbers"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    placeholder="Create a strong password"
                    helperText="At least 8 characters with uppercase, lowercase, and numbers"
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    placeholder="Confirm your password"
                />
            </div>
        </div>
    )

    const renderStep2 = () => {
        if (userType === 'therapist') {
            return (
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Information</h2>
                        <p className="text-gray-600">Tell us about your professional background</p>
                    </div>

                    <Input
                        label="License Number"
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        required
                        placeholder="Enter your professional license number"
                        helperText="Your license will be verified during the approval process"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {specializations.map((spec) => (
                                <label key={spec} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.specializations.includes(spec)}
                                        onChange={(e) => {
                                            const current = formData.specializations
                                            if (e.target.checked) {
                                                handleInputChange('specializations', [...current, spec])
                                            } else {
                                                handleInputChange('specializations', current.filter(s => s !== spec))
                                            }
                                        }}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">{spec}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Input
                        label="Years of Experience"
                        type="number"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        required
                        placeholder="5"
                        helperText="Total years of professional practice"
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Professional Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            rows={4}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell us about your approach, experience, and what makes you unique as a therapist..."
                        />
                        <p className="text-sm text-muted-foreground">This will be shown to potential clients</p>
                    </div>

                    <Input
                        label="Consultation Fee"
                        type="number"
                        value={formData.consultationFee}
                        onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                        required
                        placeholder="1500"
                        helperText="Fee per session in Indian Rupees (₹)"
                        leftIcon={<span className="text-gray-500">₹</span>}
                    />
                </div>
            )
        }

        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-center mb-6">Additional Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                        <input
                            type="text"
                            value={formData.emergencyContactName}
                            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                        <input
                            type="tel"
                            value={formData.emergencyContactPhone}
                            onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
            </div>
        )
    }

    const renderStep3 = () => (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">Terms & Consent</h2>

            <div className="space-y-4">
                <label className="flex items-start">
                    <input
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                        className="mt-1 mr-3"
                        required
                    />
                    <span className="text-sm text-gray-700">
                        I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and understand the platform policies.
                    </span>
                </label>

                <label className="flex items-start">
                    <input
                        type="checkbox"
                        checked={formData.privacyAccepted}
                        onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
                        className="mt-1 mr-3"
                        required
                    />
                    <span className="text-sm text-gray-700">
                        I agree to the <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> and consent to data processing as described.
                    </span>
                </label>

                {userType === 'client' && (
                    <label className="flex items-start">
                        <input
                            type="checkbox"
                            checked={formData.consentForTreatment}
                            onChange={(e) => handleInputChange('consentForTreatment', e.target.checked)}
                            className="mt-1 mr-3"
                            required
                        />
                        <span className="text-sm text-gray-700">
                            I consent to receive mental health treatment and understand that therapy sessions will be conducted online.
                        </span>
                    </label>
                )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-6">
                <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> By registering, you acknowledge that this platform provides mental health support services.
                    In case of emergency, please contact your local emergency services or crisis helpline immediately.
                </p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">AC</span>
                        </div>
                        <span className="text-2xl font-bold text-gradient-primary">AmitaCare</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Join AmitaCare
                    </h1>
                    <p className="text-gray-600">
                        Register as a {userType === 'client' ? 'Client' : userType === 'therapist' ? 'Therapist' : 'Company Employee'}
                    </p>
                </div>

                {/* Progress Indicator */}
                <StepProgress
                    steps={[
                        { label: 'Basic Info', completed: step > 1, current: step === 1 },
                        { label: userType === 'therapist' ? 'Professional' : 'Additional', completed: step > 2, current: step === 2 },
                        { label: 'Terms & Consent', completed: step > 3, current: step === 3 }
                    ]}
                />

                <Card variant="elevated" padding="lg">
                    {error && (
                        <Alert variant="destructive" className="mb-6" closable onClose={() => setError('')}>
                            <AlertIcons.error />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}

                        <div className="flex justify-between pt-6 border-t">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(step - 1)}
                                >
                                    Previous
                                </Button>
                            )}

                            <Button
                                type="submit"
                                loading={isLoading}
                                className={`gradient-primary ${step === 1 ? 'ml-auto' : ''}`}
                            >
                                {step === 3 ? 'Complete Registration' : 'Next'}
                            </Button>
                        </div>
                    </form>
                </Card>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-primary hover:underline font-medium">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )