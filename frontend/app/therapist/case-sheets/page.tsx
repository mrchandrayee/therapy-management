'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { FileText, Bot, User, Save, Search, Plus, Edit } from 'lucide-react'

interface CaseSheet {
  id: string
  clientId: string
  clientName: string
  sessionId: string
  sessionDate: string
  proforma: 'mayer-gross' | 'custom-1' | 'custom-2'
  method: 'gemini' | 'typed'
  status: 'draft' | 'completed' | 'reviewed'
  data: {
    // Mayer Gross Proforma fields
    chiefComplaint?: string
    historyOfPresentingComplaint?: string
    pastHistory?: string
    familyHistory?: string
    personalHistory?: string
    mentalStateExamination?: {
      appearance?: string
      behavior?: string
      speech?: string
      mood?: string
      affect?: string
      thought?: string
      perception?: string
      cognition?: string
      insight?: string
      judgment?: string
    }
    physicalExamination?: string
    investigations?: string
    diagnosis?: string
    treatmentPlan?: string
    prognosis?: string
    // AI-generated content
    aiSummary?: string
    aiRecommendations?: string
  }
  createdAt: string
  updatedAt: string
}

export default function CaseSheetsPage() {
  const [caseSheets, setCaseSheets] = useState<CaseSheet[]>([
    {
      id: 'CS-001',
      clientId: 'CLT-001',
      clientName: 'John Doe',
      sessionId: 'SES-001',
      sessionDate: '2024-02-15',
      proforma: 'mayer-gross',
      method: 'typed',
      status: 'completed',
      data: {
        chiefComplaint: 'Patient reports feeling anxious and having difficulty sleeping for the past 3 weeks',
        historyOfPresentingComplaint: 'Anxiety started after job loss, accompanied by insomnia and loss of appetite',
        mentalStateExamination: {
          appearance: 'Well-groomed, appropriate dress',
          behavior: 'Cooperative, restless',
          mood: 'Anxious',
          affect: 'Congruent with mood'
        },
        diagnosis: 'Adjustment Disorder with Anxiety',
        treatmentPlan: 'CBT sessions, relaxation techniques, sleep hygiene education'
      },
      createdAt: '2024-02-15T14:30:00',
      updatedAt: '2024-02-15T15:45:00'
    }
  ])

  const [selectedCaseSheet, setSelectedCaseSheet] = useState<CaseSheet | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [useAI, setUseAI] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const [newCaseSheet, setNewCaseSheet] = useState({
    clientName: '',
    sessionId: '',
    sessionDate: '',
    proforma: 'mayer-gross' as 'mayer-gross' | 'custom-1' | 'custom-2',
    method: 'typed' as 'gemini' | 'typed'
  })

  const [caseSheetData, setCaseSheetData] = useState({
    chiefComplaint: '',
    historyOfPresentingComplaint: '',
    pastHistory: '',
    familyHistory: '',
    personalHistory: '',
    mentalStateExamination: {
      appearance: '',
      behavior: '',
      speech: '',
      mood: '',
      affect: '',
      thought: '',
      perception: '',
      cognition: '',
      insight: '',
      judgment: ''
    },
    physicalExamination: '',
    investigations: '',
    diagnosis: '',
    treatmentPlan: '',
    prognosis: '',
    aiSummary: ''
  })

  const proformaOptions = [
    { value: 'mayer-gross', label: 'Mayer Gross Proforma' },
    { value: 'custom-1', label: 'Custom Proforma 1' },
    { value: 'custom-2', label: 'Custom Proforma 2' }
  ]

  const generateAIContent = async (field: string) => {
    setIsGeneratingAI(true)
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const aiContent = {
        chiefComplaint: 'AI-generated: Patient presents with primary concerns of persistent worry and sleep disturbances affecting daily functioning.',
        historyOfPresentingComplaint: 'AI-generated: Symptoms began approximately 3 weeks ago following significant life stressor. Patient reports gradual onset with increasing severity.',
        diagnosis: 'AI-generated: Based on presented symptoms and clinical assessment, preliminary diagnosis suggests Generalized Anxiety Disorder (F41.1)',
        treatmentPlan: 'AI-generated: Recommended treatment approach includes cognitive-behavioral therapy, stress management techniques, and consideration for pharmacological intervention if symptoms persist.',
        aiSummary: 'AI-generated Summary: This case presents a classic pattern of adjustment disorder with anxiety features. The patient shows good insight and motivation for treatment. Recommended interventions include CBT-based anxiety management, sleep hygiene education, and regular monitoring. Prognosis is favorable with appropriate therapeutic intervention. Consider referral for psychiatric evaluation if symptoms persist beyond 8-12 weeks of therapy.'
      }[field] || `AI-generated content for ${field}`

      setCaseSheetData(prev => ({
        ...prev,
        [field]: aiContent
      }))
    } catch (error) {
      alert('Error generating AI content. Please try again.')
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const saveCaseSheet = () => {
    if (!newCaseSheet.clientName || !newCaseSheet.sessionId) {
      alert('Please fill in required fields')
      return
    }

    const caseSheet: CaseSheet = {
      id: `CS-${String(caseSheets.length + 1).padStart(3, '0')}`,
      clientId: `CLT-${String(caseSheets.length + 1).padStart(3, '0')}`,
      clientName: newCaseSheet.clientName,
      sessionId: newCaseSheet.sessionId,
      sessionDate: newCaseSheet.sessionDate || new Date().toISOString().split('T')[0],
      proforma: newCaseSheet.proforma,
      method: newCaseSheet.method,
      status: 'draft',
      data: caseSheetData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setCaseSheets([caseSheet, ...caseSheets])
    setShowCreateForm(false)
    resetForm()
    alert('Case sheet saved successfully!')
  }

  const resetForm = () => {
    setNewCaseSheet({
      clientName: '',
      sessionId: '',
      sessionDate: '',
      proforma: 'mayer-gross',
      method: 'typed'
    })
    setCaseSheetData({
      chiefComplaint: '',
      historyOfPresentingComplaint: '',
      pastHistory: '',
      familyHistory: '',
      personalHistory: '',
      mentalStateExamination: {
        appearance: '',
        behavior: '',
        speech: '',
        mood: '',
        affect: '',
        thought: '',
        perception: '',
        cognition: '',
        insight: '',
        judgment: ''
      },
      physicalExamination: '',
      investigations: '',
      diagnosis: '',
      treatmentPlan: '',
      prognosis: ''
    })
  }

  const filteredCaseSheets = caseSheets.filter(cs => {
    const matchesSearch = cs.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cs.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || cs.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'reviewed': return 'primary'
      case 'draft': return 'warning'
      default: return 'secondary'
    }
  }

  return (
    <DashboardLayout userType="therapist">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Case Sheets</h1>
            <p className="text-gray-600 mt-2">Create and manage client case sheets with AI assistance</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Case Sheet
          </Button>
        </div>

        {/* Filters */}
        <Card variant="elevated">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search case sheets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Create New Case Sheet</CardTitle>
              <CardDescription>Fill in client case sheet details</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="clinical">Clinical Data</TabsTrigger>
                  <TabsTrigger value="mse">Mental State Exam</TabsTrigger>
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Client Name *</Label>
                      <Input
                        id="clientName"
                        value={newCaseSheet.clientName}
                        onChange={(e) => setNewCaseSheet({ ...newCaseSheet, clientName: e.target.value })}
                        placeholder="Enter client name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sessionId">Session ID *</Label>
                      <Input
                        id="sessionId"
                        value={newCaseSheet.sessionId}
                        onChange={(e) => setNewCaseSheet({ ...newCaseSheet, sessionId: e.target.value })}
                        placeholder="e.g., SES-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sessionDate">Session Date</Label>
                      <Input
                        id="sessionDate"
                        type="date"
                        value={newCaseSheet.sessionDate}
                        onChange={(e) => setNewCaseSheet({ ...newCaseSheet, sessionDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="proforma">Proforma Type</Label>
                      <Select value={newCaseSheet.proforma} onValueChange={(value: any) => setNewCaseSheet({ ...newCaseSheet, proforma: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {proformaOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={useAI}
                      onCheckedChange={setUseAI}
                    />
                    <Label>Enable AI Assistance (Gemini)</Label>
                  </div>
                </TabsContent>

                <TabsContent value="clinical" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                        {useAI && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateAIContent('chiefComplaint')}
                            disabled={isGeneratingAI}
                          >
                            <Bot className="w-4 h-4 mr-2" />
                            {isGeneratingAI ? 'Generating...' : 'AI Generate'}
                          </Button>
                        )}
                      </div>
                      <Textarea
                        id="chiefComplaint"
                        value={caseSheetData.chiefComplaint}
                        onChange={(e) => setCaseSheetData({ ...caseSheetData, chiefComplaint: e.target.value })}
                        placeholder="Enter chief complaint..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="historyOfPresentingComplaint">History of Presenting Complaint</Label>
                        {useAI && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateAIContent('historyOfPresentingComplaint')}
                            disabled={isGeneratingAI}
                          >
                            <Bot className="w-4 h-4 mr-2" />
                            AI Generate
                          </Button>
                        )}
                      </div>
                      <Textarea
                        id="historyOfPresentingComplaint"
                        value={caseSheetData.historyOfPresentingComplaint}
                        onChange={(e) => setCaseSheetData({ ...caseSheetData, historyOfPresentingComplaint: e.target.value })}
                        placeholder="Enter history of presenting complaint..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pastHistory">Past History</Label>
                        <Textarea
                          id="pastHistory"
                          value={caseSheetData.pastHistory}
                          onChange={(e) => setCaseSheetData({ ...caseSheetData, pastHistory: e.target.value })}
                          placeholder="Enter past history..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="familyHistory">Family History</Label>
                        <Textarea
                          id="familyHistory"
                          value={caseSheetData.familyHistory}
                          onChange={(e) => setCaseSheetData({ ...caseSheetData, familyHistory: e.target.value })}
                          placeholder="Enter family history..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="personalHistory">Personal History</Label>
                      <Textarea
                        id="personalHistory"
                        value={caseSheetData.personalHistory}
                        onChange={(e) => setCaseSheetData({ ...caseSheetData, personalHistory: e.target.value })}
                        placeholder="Enter personal history..."
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mse" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appearance">Appearance</Label>
                      <Textarea
                        id="appearance"
                        value={caseSheetData.mentalStateExamination.appearance}
                        onChange={(e) => setCaseSheetData({
                          ...caseSheetData,
                          mentalStateExamination: {
                            ...caseSheetData.mentalStateExamination,
                            appearance: e.target.value
                          }
                        })}
                        placeholder="Describe appearance..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="behavior">Behavior</Label>
                      <Textarea
                        id="behavior"
                        value={caseSheetData.mentalStateExamination.behavior}
                        onChange={(e) => setCaseSheetData({
                          ...caseSheetData,
                          mentalStateExamination: {
                            ...caseSheetData.mentalStateExamination,
                            behavior: e.target.value
                          }
                        })}
                        placeholder="Describe behavior..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mood">Mood</Label>
                      <Input
                        id="mood"
                        value={caseSheetData.mentalStateExamination.mood}
                        onChange={(e) => setCaseSheetData({
                          ...caseSheetData,
                          mentalStateExamination: {
                            ...caseSheetData.mentalStateExamination,
                            mood: e.target.value
                          }
                        })}
                        placeholder="e.g., Anxious, Depressed"
                      />
                    </div>
                    <div>
                      <Label htmlFor="affect">Affect</Label>
                      <Input
                        id="affect"
                        value={caseSheetData.mentalStateExamination.affect}
                        onChange={(e) => setCaseSheetData({
                          ...caseSheetData,
                          mentalStateExamination: {
                            ...caseSheetData.mentalStateExamination,
                            affect: e.target.value
                          }
                        })}
                        placeholder="e.g., Congruent, Restricted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="thought">Thought</Label>
                      <Textarea
                        id="thought"
                        value={caseSheetData.mentalStateExamination.thought}
                        onChange={(e) => setCaseSheetData({
                          ...caseSheetData,
                          mentalStateExamination: {
                            ...caseSheetData.mentalStateExamination,
                            thought: e.target.value
                          }
                        })}
                        placeholder="Thought process and content..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="perception">Perception</Label>
                      <Textarea
                        id="perception"
                        value={caseSheetData.mentalStateExamination.perception}
                        onChange={(e) => setCaseSheetData({
                          ...caseSheetData,
                          mentalStateExamination: {
                            ...caseSheetData.mentalStateExamination,
                            perception: e.target.value
                          }
                        })}
                        placeholder="Perceptual abnormalities..."
                        rows={2}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="assessment" className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="diagnosis">Diagnosis</Label>
                      {useAI && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateAIContent('diagnosis')}
                          disabled={isGeneratingAI}
                        >
                          <Bot className="w-4 h-4 mr-2" />
                          {isGeneratingAI ? 'Generating...' : 'AI Generate'}
                        </Button>
                      )}
                    </div>
                    <Textarea
                      id="diagnosis"
                      value={caseSheetData.diagnosis}
                      onChange={(e) => setCaseSheetData({ ...caseSheetData, diagnosis: e.target.value })}
                      placeholder="Enter diagnosis..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                      {useAI && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateAIContent('treatmentPlan')}
                          disabled={isGeneratingAI}
                        >
                          <Bot className="w-4 h-4 mr-2" />
                          {isGeneratingAI ? 'Generating...' : 'AI Generate'}
                        </Button>
                      )}
                    </div>
                    <Textarea
                      id="treatmentPlan"
                      value={caseSheetData.treatmentPlan}
                      onChange={(e) => setCaseSheetData({ ...caseSheetData, treatmentPlan: e.target.value })}
                      placeholder="Enter treatment plan..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="prognosis">Prognosis</Label>
                    <Textarea
                      id="prognosis"
                      value={caseSheetData.prognosis}
                      onChange={(e) => setCaseSheetData({ ...caseSheetData, prognosis: e.target.value })}
                      placeholder="Enter prognosis..."
                      rows={2}
                    />
                  </div>

                  {/* AI Summary Section */}
                  {useAI && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label>AI Summary & Recommendations</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateAIContent('aiSummary')}
                          disabled={isGeneratingAI}
                        >
                          <Bot className="w-4 h-4 mr-2" />
                          Generate AI Summary
                        </Button>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">AI-Generated Summary</h4>
                        <p className="text-blue-800 text-sm">
                          {caseSheetData.aiSummary || 'Click "Generate AI Summary" to get AI-powered insights and recommendations based on the case sheet data.'}
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex space-x-2 pt-4 border-t">
                <Button onClick={saveCaseSheet} className="gradient-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Save Case Sheet
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Case Sheets List */}
        <div className="space-y-4">
          {filteredCaseSheets.map((caseSheet) => (
            <Card key={caseSheet.id} variant="elevated">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{caseSheet.clientName}</h3>
                      <Badge variant={getStatusColor(caseSheet.status)}>
                        {caseSheet.status}
                      </Badge>
                      <Badge variant="outline">
                        {caseSheet.proforma}
                      </Badge>
                      <Badge variant={caseSheet.method === 'gemini' ? 'primary' : 'secondary'}>
                        {caseSheet.method === 'gemini' ? (
                          <><Bot className="w-3 h-3 mr-1" />AI-Assisted</>
                        ) : (
                          <><User className="w-3 h-3 mr-1" />Manual</>
                        )}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Session ID:</span>
                        <p className="font-medium">{caseSheet.sessionId}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Session Date:</span>
                        <p className="font-medium">{new Date(caseSheet.sessionDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Updated:</span>
                        <p className="font-medium">{new Date(caseSheet.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {caseSheet.data.chiefComplaint && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">
                          <strong>Chief Complaint:</strong> {caseSheet.data.chiefComplaint.substring(0, 150)}
                          {caseSheet.data.chiefComplaint.length > 150 ? '...' : ''}
                        </p>
                      </div>
                    )}

                    {caseSheet.data.diagnosis && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600">
                          <strong>Diagnosis:</strong> {caseSheet.data.diagnosis}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCaseSheet(caseSheet)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCaseSheets.length === 0 && (
          <Card variant="elevated">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Case Sheets Found</h3>
              <p className="text-gray-600 mb-4">Create your first case sheet to get started.</p>
              <Button onClick={() => setShowCreateForm(true)} className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Case Sheet
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Case Sheet Details Modal */}
        {selectedCaseSheet && (
          <CaseSheetDetailsModal
            caseSheet={selectedCaseSheet}
            onClose={() => setSelectedCaseSheet(null)}
          />
        )}
      </div>
    </DashboardLayout>
  )
}

function CaseSheetDetailsModal({ 
  caseSheet, 
  onClose 
}: { 
  caseSheet: CaseSheet
  onClose: () => void 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{caseSheet.clientName} - Case Sheet</CardTitle>
          <CardDescription>Session {caseSheet.sessionId} • {new Date(caseSheet.sessionDate).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="clinical">
            <TabsList>
              <TabsTrigger value="clinical">Clinical Data</TabsTrigger>
              <TabsTrigger value="mse">Mental State Exam</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
            </TabsList>

            <TabsContent value="clinical" className="space-y-4">
              {caseSheet.data.chiefComplaint && (
                <div>
                  <Label>Chief Complaint</Label>
                  <p className="text-sm text-gray-700 mt-1">{caseSheet.data.chiefComplaint}</p>
                </div>
              )}
              
              {caseSheet.data.historyOfPresentingComplaint && (
                <div>
                  <Label>History of Presenting Complaint</Label>
                  <p className="text-sm text-gray-700 mt-1">{caseSheet.data.historyOfPresentingComplaint}</p>
                </div>
              )}
              
              {caseSheet.data.pastHistory && (
                <div>
                  <Label>Past History</Label>
                  <p className="text-sm text-gray-700 mt-1">{caseSheet.data.pastHistory}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mse" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(caseSheet.data.mentalStateExamination || {}).map(([key, value]) => (
                  value && (
                    <div key={key}>
                      <Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                      <p className="text-sm text-gray-700 mt-1">{value}</p>
                    </div>
                  )
                ))}
              </div>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-4">
              {caseSheet.data.diagnosis && (
                <div>
                  <Label>Diagnosis</Label>
                  <p className="text-sm text-gray-700 mt-1">{caseSheet.data.diagnosis}</p>
                </div>
              )}
              
              {caseSheet.data.treatmentPlan && (
                <div>
                  <Label>Treatment Plan</Label>
                  <p className="text-sm text-gray-700 mt-1">{caseSheet.data.treatmentPlan}</p>
                </div>
              )}
              
              {caseSheet.data.prognosis && (
                <div>
                  <Label>Prognosis</Label>
                  <p className="text-sm text-gray-700 mt-1">{caseSheet.data.prognosis}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button className="gradient-primary">Edit Case Sheet</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}