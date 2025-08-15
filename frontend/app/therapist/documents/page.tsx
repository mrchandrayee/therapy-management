'use client'

import { useState, useRef } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  X
} from 'lucide-react'

interface TherapistDocument {
  id: string
  document_type: 'license' | 'certificate' | 'degree' | 'training' | 'other'
  title: string
  description: string
  document_file: string
  issue_date?: string
  expiry_date?: string
  issuing_authority: string
  is_verified: boolean
  verified_by?: string
  verified_at?: string
  uploaded_at: string
  updated_at: string
  file_size?: number
  file_type?: string
}

export default function TherapistDocumentsPage() {
  const [documents, setDocuments] = useState<TherapistDocument[]>([
    {
      id: '1',
      document_type: 'license',
      title: 'Clinical Psychology License',
      description: 'State board certified clinical psychology license',
      document_file: '/documents/license-001.pdf',
      issue_date: '2020-06-15',
      expiry_date: '2025-06-15',
      issuing_authority: 'State Board of Psychology',
      is_verified: true,
      verified_by: 'Admin User',
      verified_at: '2024-01-15T10:30:00',
      uploaded_at: '2024-01-10T14:20:00',
      updated_at: '2024-01-15T10:30:00',
      file_size: 2.5,
      file_type: 'PDF'
    },
    {
      id: '2',
      document_type: 'certificate',
      title: 'CBT Certification',
      description: 'Cognitive Behavioral Therapy certification from ABCT',
      document_file: '/documents/cbt-cert.pdf',
      issue_date: '2021-03-20',
      issuing_authority: 'Association for Behavioral and Cognitive Therapies',
      is_verified: false,
      uploaded_at: '2024-02-01T09:15:00',
      updated_at: '2024-02-01T09:15:00',
      file_size: 1.8,
      file_type: 'PDF'
    },
    {
      id: '3',
      document_type: 'degree',
      title: 'Master of Psychology',
      description: 'Masters degree in Clinical Psychology',
      document_file: '/documents/masters-degree.pdf',
      issue_date: '2019-05-30',
      issuing_authority: 'University of Delhi',
      is_verified: true,
      verified_by: 'Admin User',
      verified_at: '2024-01-12T16:45:00',
      uploaded_at: '2024-01-10T11:30:00',
      updated_at: '2024-01-12T16:45:00',
      file_size: 3.2,
      file_type: 'PDF'
    }
  ])

  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadData, setUploadData] = useState({
    document_type: 'certificate' as const,
    title: '',
    description: '',
    issue_date: '',
    expiry_date: '',
    issuing_authority: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const documentTypes = [
    { value: 'license', label: 'Professional License' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'degree', label: 'Educational Degree' },
    { value: 'training', label: 'Training Certificate' },
    { value: 'other', label: 'Other' }
  ]

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'license': return '📜'
      case 'certificate': return '🏆'
      case 'degree': return '🎓'
      case 'training': return '📚'
      default: return '📄'
    }
  }

  const getVerificationStatus = (document: TherapistDocument) => {
    if (document.is_verified) {
      return (
        <Badge variant="success" className="flex items-center space-x-1">
          <CheckCircle className="w-3 h-3" />
          <span>Verified</span>
        </Badge>
      )
    } else {
      return (
        <Badge variant="warning" className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Pending Verification</span>
        </Badge>
      )
    }
  }

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    return expiry < today
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size cannot exceed 10MB')
        return
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, JPG, and PNG files are allowed')
        return
      }

      setSelectedFile(file)
    }
  }

  const uploadDocument = async () => {
    if (!selectedFile || !uploadData.title || !uploadData.issuing_authority) {
      alert('Please fill in all required fields and select a file')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newDocument: TherapistDocument = {
        id: `doc-${Date.now()}`,
        document_type: uploadData.document_type,
        title: uploadData.title,
        description: uploadData.description,
        document_file: `/documents/${selectedFile.name}`,
        issue_date: uploadData.issue_date || undefined,
        expiry_date: uploadData.expiry_date || undefined,
        issuing_authority: uploadData.issuing_authority,
        is_verified: false,
        uploaded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        file_size: selectedFile.size / (1024 * 1024), // Convert to MB
        file_type: selectedFile.type.split('/')[1].toUpperCase()
      }

      setDocuments([newDocument, ...documents])
      setUploadProgress(100)
      
      setTimeout(() => {
        setShowUploadForm(false)
        resetUploadForm()
        setIsUploading(false)
        setUploadProgress(0)
        alert('Document uploaded successfully! It will be reviewed by admin for verification.')
      }, 500)

    } catch (error) {
      setIsUploading(false)
      setUploadProgress(0)
      alert('Upload failed. Please try again.')
    }
  }

  const resetUploadForm = () => {
    setUploadData({
      document_type: 'certificate',
      title: '',
      description: '',
      issue_date: '',
      expiry_date: '',
      issuing_authority: ''
    })
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const deleteDocument = (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== documentId))
      alert('Document deleted successfully')
    }
  }

  const downloadDocument = (document: TherapistDocument) => {
    // In a real app, this would trigger a download
    alert(`Downloading ${document.title}...`)
  }

  const viewDocument = (document: TherapistDocument) => {
    // In a real app, this would open the document in a new tab
    window.open(document.document_file, '_blank')
  }

  const verifiedDocuments = documents.filter(doc => doc.is_verified)
  const pendingDocuments = documents.filter(doc => !doc.is_verified)
  const expiringDocuments = documents.filter(doc => isExpiringSoon(doc.expiry_date))
  const expiredDocuments = documents.filter(doc => isExpired(doc.expiry_date))

  return (
    <DashboardLayout userType="therapist">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents & Credentials</h1>
            <p className="text-gray-600 mt-2">Manage your professional documents and certifications</p>
          </div>
          <Button onClick={() => setShowUploadForm(true)} className="gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-green-600">{verifiedDocuments.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingDocuments.length}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-red-600">{expiringDocuments.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {expiredDocuments.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              <strong>Urgent:</strong> You have {expiredDocuments.length} expired document(s). 
              Please renew them immediately to maintain your active status.
            </AlertDescription>
          </Alert>
        )}

        {expiringDocuments.length > 0 && (
          <Alert variant="warning">
            <Clock className="w-4 h-4" />
            <AlertDescription>
              <strong>Notice:</strong> You have {expiringDocuments.length} document(s) expiring within 30 days. 
              Please renew them soon to avoid service interruption.
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Upload New Document</CardTitle>
              <CardDescription>Add a new credential or certificate to your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="doc-type">Document Type *</Label>
                  <Select
                    value={uploadData.document_type}
                    onValueChange={(value: any) => setUploadData({ ...uploadData, document_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Document Title *</Label>
                  <Input
                    id="title"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    placeholder="e.g., Clinical Psychology License"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    placeholder="Brief description of the document..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="issuing-authority">Issuing Authority *</Label>
                  <Input
                    id="issuing-authority"
                    value={uploadData.issuing_authority}
                    onChange={(e) => setUploadData({ ...uploadData, issuing_authority: e.target.value })}
                    placeholder="e.g., State Board of Psychology"
                  />
                </div>

                <div>
                  <Label htmlFor="issue-date">Issue Date</Label>
                  <Input
                    id="issue-date"
                    type="date"
                    value={uploadData.issue_date}
                    onChange={(e) => setUploadData({ ...uploadData, issue_date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="expiry-date">Expiry Date (if applicable)</Label>
                  <Input
                    id="expiry-date"
                    type="date"
                    value={uploadData.expiry_date}
                    onChange={(e) => setUploadData({ ...uploadData, expiry_date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="file-upload">Document File *</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, JPG, PNG. Max size: 10MB
                  </p>
                </div>
              </div>

              {selectedFile && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">{selectedFile.name}</span>
                    <span className="text-xs text-blue-600">
                      ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Uploading...</span>
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-2 mt-6">
                <Button
                  onClick={uploadDocument}
                  disabled={isUploading}
                  className="gradient-primary"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload Document'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUploadForm(false)
                    resetUploadForm()
                  }}
                  disabled={isUploading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents List */}
        <div className="space-y-4">
          {documents.length === 0 ? (
            <Card variant="elevated">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">📄</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Uploaded</h3>
                <p className="text-gray-600 mb-4">Upload your professional credentials to get started.</p>
                <Button onClick={() => setShowUploadForm(true)} className="gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload First Document
                </Button>
              </CardContent>
            </Card>
          ) : (
            documents.map((document) => (
              <Card key={document.id} variant="elevated">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="text-2xl">
                          {getDocumentTypeIcon(document.document_type)}
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{document.title}</h3>
                          <p className="text-sm text-gray-600">{document.issuing_authority}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getVerificationStatus(document)}
                          <Badge variant="outline" className="capitalize">
                            {document.document_type}
                          </Badge>
                          {isExpired(document.expiry_date) && (
                            <Badge variant="destructive">Expired</Badge>
                          )}
                          {isExpiringSoon(document.expiry_date) && !isExpired(document.expiry_date) && (
                            <Badge variant="warning">Expiring Soon</Badge>
                          )}
                        </div>
                      </div>

                      {document.description && (
                        <p className="text-gray-600 mb-3">{document.description}</p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        {document.issue_date && (
                          <div>
                            <span className="text-gray-500">Issue Date:</span>
                            <p className="font-medium">{new Date(document.issue_date).toLocaleDateString()}</p>
                          </div>
                        )}
                        {document.expiry_date && (
                          <div>
                            <span className="text-gray-500">Expiry Date:</span>
                            <p className={`font-medium ${isExpired(document.expiry_date) ? 'text-red-600' : isExpiringSoon(document.expiry_date) ? 'text-yellow-600' : ''}`}>
                              {new Date(document.expiry_date).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">File Size:</span>
                          <p className="font-medium">{document.file_size?.toFixed(2)} MB</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Uploaded:</span>
                          <p className="font-medium">{new Date(document.uploaded_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {document.is_verified && document.verified_at && (
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Verified</strong> by {document.verified_by} on{' '}
                            {new Date(document.verified_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewDocument(document)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(document)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteDocument(document.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}