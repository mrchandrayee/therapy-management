'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, AlertTriangle, CheckCircle, X, Eye, Download } from 'lucide-react'
import { testReportSchema, type TestReport } from '@/lib/validation/client-validation'

interface UploadedReport {
  id: string
  fileName: string
  reportType: string
  uploadDate: string
  status: 'processing' | 'verified' | 'rejected'
  description?: string
  confidentialityLevel: string
  fileSize: number
  therapistAccess: boolean
}

export function TestReportUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    reportType: '',
    reportDate: '',
    description: '',
    confidentialityLevel: 'standard',
    consentForSharing: false
  })

  const [uploadedReports] = useState<UploadedReport[]>([
    {
      id: 'RPT-001',
      fileName: 'psychological_assessment_2024.pdf',
      reportType: 'psychological',
      uploadDate: '2024-02-10',
      status: 'verified',
      description: 'Comprehensive psychological assessment',
      confidentialityLevel: 'high',
      fileSize: 2048576,
      therapistAccess: true
    },
    {
      id: 'RPT-002',
      fileName: 'medical_report_jan2024.pdf',
      reportType: 'medical',
      uploadDate: '2024-02-08',
      status: 'processing',
      description: 'General medical examination report',
      confidentialityLevel: 'standard',
      fileSize: 1024768,
      therapistAccess: false
    }
  ])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Please upload only PDF, JPEG, or PNG files')
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB')
        return
      }

      setSelectedFile(file)
      setUploadError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload')
      return
    }

    try {
      // Validate form data
      const validatedData = testReportSchema.parse({
        ...formData,
        uploadedBy: 'client', // This would come from auth context
        reportDate: formData.reportDate
      })

      setIsUploading(true)
      setUploadError(null)

      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Here you would upload to your backend
      console.log('Uploading:', { file: selectedFile, data: validatedData })

      setUploadSuccess(true)
      setSelectedFile(null)
      setFormData({
        reportType: '',
        reportDate: '',
        description: '',
        confidentialityLevel: 'standard',
        consentForSharing: false
      })

      // Reset form
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) fileInput.value = ''

    } catch (error) {
      if (error instanceof Error) {
        setUploadError(error.message)
      } else {
        setUploadError('Upload failed. Please try again.')
      }
    } finally {
      setIsUploading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <AlertTriangle className="h-4 w-4" />
      case 'rejected': return <X className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
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
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Test Report
          </CardTitle>
          <CardDescription>
            Upload psychological, psychiatric, or medical reports to share with your therapist
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {uploadSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Report uploaded successfully! It will be reviewed and made available to your therapist.
              </AlertDescription>
            </Alert>
          )}

          {uploadError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {uploadError}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select 
                value={formData.reportType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, reportType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="psychological">Psychological Assessment</SelectItem>
                  <SelectItem value="psychiatric">Psychiatric Evaluation</SelectItem>
                  <SelectItem value="medical">Medical Report</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-date">Report Date</Label>
              <Input
                id="report-date"
                type="date"
                value={formData.reportDate}
                onChange={(e) => setFormData(prev => ({ ...prev, reportDate: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the report..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/200 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confidentiality">Confidentiality Level</Label>
            <Select 
              value={formData.confidentialityLevel} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, confidentialityLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="high">High Confidentiality</SelectItem>
                <SelectItem value="restricted">Restricted Access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Select File</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, JPEG, PNG (Max 10MB)
            </p>
          </div>

          {selectedFile && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatFileSize(selectedFile.size)})
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={formData.consentForSharing}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, consentForSharing: checked as boolean }))
              }
            />
            <Label htmlFor="consent" className="text-sm">
              I consent to sharing this report with my assigned therapist and relevant healthcare providers
            </Label>
          </div>

          <Button 
            onClick={handleUpload} 
            disabled={isUploading || !selectedFile || !formData.consentForSharing}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : 'Upload Report'}
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Your Uploaded Reports</CardTitle>
          <CardDescription>
            View and manage your uploaded test reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedReports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reports uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{report.fileName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Uploaded: {new Date(report.uploadDate).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Size: {formatFileSize(report.fileSize)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(report.status)}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1 capitalize">{report.status}</span>
                      </Badge>
                      <Badge variant="outline">
                        {report.confidentialityLevel}
                      </Badge>
                      {report.therapistAccess && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Therapist Access
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    {report.status === 'processing' && (
                      <Button size="sm" variant="outline" className="text-red-600">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}