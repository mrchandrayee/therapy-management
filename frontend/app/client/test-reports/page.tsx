'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { FileUpload } from '@/components/ui/file-upload'
import { Plus, Eye, Download, Calendar, User, FileText } from 'lucide-react'

interface TestReport {
    id: string
    name: string
    type: 'uploaded' | 'requested'
    category: string
    uploadedAt: string
    requestedAt?: string
    status: 'pending' | 'completed' | 'reviewed'
    files: Array<{
        id: string
        name: string
        size: number
        type: string
        url?: string
        uploadedAt: Date
    }>
    notes?: string
    therapistNotes?: string
    requestDetails?: string
}

export default function ClientTestReportsPage() {
    const [reports, setReports] = useState<TestReport[]>([
        {
            id: 'RPT-001',
            name: 'Blood Test Results',
            type: 'uploaded',
            category: 'Medical',
            uploadedAt: '2024-02-10',
            status: 'reviewed',
            files: [
                {
                    id: 'file-1',
                    name: 'blood_test_feb_2024.pdf',
                    size: 245760,
                    type: 'application/pdf',
                    uploadedAt: new Date('2024-02-10')
                }
            ],
            notes: 'Recent blood work showing vitamin D deficiency',
            therapistNotes: 'Discussed vitamin D supplementation and dietary changes'
        },
        {
            id: 'RPT-002',
            name: 'Psychological Assessment',
            type: 'requested',
            category: 'Psychological',
            uploadedAt: '2024-02-08',
            requestedAt: '2024-02-05',
            status: 'pending',
            files: [],
            requestDetails: 'Requested comprehensive psychological assessment for anxiety and depression screening'
        }
    ])

    const [showUploadForm, setShowUploadForm] = useState(false)
    const [showRequestForm, setShowRequestForm] = useState(false)
    const [selectedReport, setSelectedReport] = useState<TestReport | null>(null)

    const [uploadForm, setUploadForm] = useState({
        name: '',
        category: '',
        notes: '',
        files: [] as any[]
    })

    const [requestForm, setRequestForm] = useState({
        name: '',
        category: '',
        details: '',
        urgency: 'normal'
    })

    const categories = [
        'Medical',
        'Psychological',
        'Neurological',
        'Psychiatric',
        'Laboratory',
        'Imaging',
        'Other'
    ]

    const handleUploadReport = () => {
        if (!uploadForm.name || !uploadForm.category || uploadForm.files.length === 0) {
            alert('Please fill all required fields and upload at least one file')
            return
        }

        const newReport: TestReport = {
            id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
            name: uploadForm.name,
            type: 'uploaded',
            category: uploadForm.category,
            uploadedAt: new Date().toISOString().split('T')[0],
            status: 'completed',
            files: uploadForm.files,
            notes: uploadForm.notes
        }

        setReports([newReport, ...reports])
        setUploadForm({ name: '', category: '', notes: '', files: [] })
        setShowUploadForm(false)
        alert('Test report uploaded successfully!')
    }

    const handleRequestTest = () => {
        if (!requestForm.name || !requestForm.category || !requestForm.details) {
            alert('Please fill all required fields')
            return
        }

        const newRequest: TestReport = {
            id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
            name: requestForm.name,
            type: 'requested',
            category: requestForm.category,
            uploadedAt: new Date().toISOString().split('T')[0],
            requestedAt: new Date().toISOString().split('T')[0],
            status: 'pending',
            files: [],
            requestDetails: requestForm.details
        }

        setReports([newRequest, ...reports])
        setRequestForm({ name: '', category: '', details: '', urgency: 'normal' })
        setShowRequestForm(false)
        alert('Test request submitted successfully!')
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'success'
            case 'reviewed': return 'primary'
            case 'pending': return 'warning'
            default: return 'secondary'
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <DashboardLayout userType="client">
            <div className="space-y-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Test Reports</h1>
                        <p className="text-gray-600 mt-2">Upload test reports or request new tests from your therapist</p>
                    </div>
                    <div className="flex space-x-2 mt-4 lg:mt-0">
                        <Button onClick={() => setShowRequestForm(true)} variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Request Test
                        </Button>
                        <Button onClick={() => setShowUploadForm(true)} className="gradient-primary">
                            <Plus className="w-4 h-4 mr-2" />
                            Upload Report
                        </Button>
                    </div>
                </div>

                {/* Upload Form */}
                {showUploadForm && (
                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle>Upload Test Report</CardTitle>
                            <CardDescription>Share your test results with your therapist</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="reportName">Report Name *</Label>
                                    <Input
                                        id="reportName"
                                        value={uploadForm.name}
                                        onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                                        placeholder="e.g., Blood Test Results"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="category">Category *</Label>
                                    <select
                                        id="category"
                                        value={uploadForm.category}
                                        onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="notes">Notes (Optional)</Label>
                                <Textarea
                                    id="notes"
                                    value={uploadForm.notes}
                                    onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                                    placeholder="Any additional notes about this report..."
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label>Upload Files *</Label>
                                <FileUpload
                                    onFilesChange={(files) => setUploadForm({ ...uploadForm, files })}
                                    acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']}
                                    maxFiles={5}
                                    maxSize={10}
                                />
                            </div>

                            <div className="flex space-x-2">
                                <Button onClick={handleUploadReport} className="gradient-primary">
                                    Upload Report
                                </Button>
                                <Button variant="outline" onClick={() => setShowUploadForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Request Form */}
                {showRequestForm && (
                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle>Request Test</CardTitle>
                            <CardDescription>Request a new test from your therapist</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="testName">Test Name *</Label>
                                    <Input
                                        id="testName"
                                        value={requestForm.name}
                                        onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                                        placeholder="e.g., Comprehensive Metabolic Panel"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="testCategory">Category *</Label>
                                    <select
                                        id="testCategory"
                                        value={requestForm.category}
                                        onChange={(e) => setRequestForm({ ...requestForm, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="urgency">Urgency</Label>
                                <select
                                    id="urgency"
                                    value={requestForm.urgency}
                                    onChange={(e) => setRequestForm({ ...requestForm, urgency: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="routine">Routine</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="details">Request Details *</Label>
                                <Textarea
                                    id="details"
                                    value={requestForm.details}
                                    onChange={(e) => setRequestForm({ ...requestForm, details: e.target.value })}
                                    placeholder="Please describe why you need this test and any specific requirements..."
                                    rows={4}
                                />
                            </div>

                            <div className="flex space-x-2">
                                <Button onClick={handleRequestTest} className="gradient-primary">
                                    Submit Request
                                </Button>
                                <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Reports List */}
                <div className="space-y-4">
                    {reports.map((report) => (
                        <Card key={report.id} variant="elevated">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">{report.name}</h3>
                                            <Badge variant={getStatusColor(report.status)}>
                                                {report.status}
                                            </Badge>
                                            <Badge variant="outline">
                                                {report.type}
                                            </Badge>
                                            <Badge variant="secondary">
                                                {report.category}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-600">
                                                    {report.type === 'uploaded' ? 'Uploaded' : 'Requested'}: {' '}
                                                    {new Date(report.uploadedAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {report.files.length > 0 && (
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-600">
                                                        {report.files.length} file(s)
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {report.notes && (
                                            <div className="mb-3">
                                                <p className="text-sm text-gray-600">
                                                    <strong>Notes:</strong> {report.notes}
                                                </p>
                                            </div>
                                        )}

                                        {report.requestDetails && (
                                            <div className="mb-3">
                                                <p className="text-sm text-gray-600">
                                                    <strong>Request Details:</strong> {report.requestDetails}
                                                </p>
                                            </div>
                                        )}

                                        {report.therapistNotes && (
                                            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                                                <p className="text-sm text-blue-800">
                                                    <strong>Therapist Notes:</strong> {report.therapistNotes}
                                                </p>
                                            </div>
                                        )}

                                        {report.files.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium text-gray-700">Attached Files:</h4>
                                                {report.files.map((file) => (
                                                    <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                        <div className="flex items-center space-x-2">
                                                            <FileText className="w-4 h-4 text-gray-500" />
                                                            <span className="text-sm font-medium">{file.name}</span>
                                                            <span className="text-xs text-gray-500">
                                                                ({formatFileSize(file.size)})
                                                            </span>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm">
                                                                <Download className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedReport(report)}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {reports.length === 0 && (
                    <Card variant="elevated">
                        <CardContent className="p-8 text-center">
                            <div className="text-4xl mb-4">📋</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Reports</h3>
                            <p className="text-gray-600 mb-4">Upload your first test report or request a new test.</p>
                            <div className="flex justify-center space-x-2">
                                <Button onClick={() => setShowRequestForm(true)} variant="outline">
                                    Request Test
                                </Button>
                                <Button onClick={() => setShowUploadForm(true)} className="gradient-primary">
                                    Upload Report
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Report Details Modal */}
                {selectedReport && (
                    <ReportDetailsModal
                        report={selectedReport}
                        onClose={() => setSelectedReport(null)}
                    />
                )}
            </div>
        </DashboardLayout>
    )
}

function ReportDetailsModal({
    report,
    onClose
}: {
    report: TestReport
    onClose: () => void
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <CardTitle>{report.name}</CardTitle>
                    <CardDescription>Report Details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Type</Label>
                            <p className="font-medium">{report.type}</p>
                        </div>
                        <div>
                            <Label>Category</Label>
                            <p className="font-medium">{report.category}</p>
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Badge variant={report.status === 'completed' ? 'success' : report.status === 'reviewed' ? 'primary' : 'warning'}>
                                {report.status}
                            </Badge>
                        </div>
                        <div>
                            <Label>Date</Label>
                            <p className="font-medium">{new Date(report.uploadedAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {report.notes && (
                        <div>
                            <Label>Notes</Label>
                            <p className="text-sm text-gray-600">{report.notes}</p>
                        </div>
                    )}

                    {report.requestDetails && (
                        <div>
                            <Label>Request Details</Label>
                            <p className="text-sm text-gray-600">{report.requestDetails}</p>
                        </div>
                    )}

                    {report.therapistNotes && (
                        <div>
                            <Label>Therapist Notes</Label>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">{report.therapistNotes}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}