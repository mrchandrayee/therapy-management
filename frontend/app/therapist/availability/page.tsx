'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Block, 
  CheckCircle,
  AlertTriangle,
  Save,
  X
} from 'lucide-react'

interface AvailabilitySlot {
  id?: string
  date: string
  start_time: string
  end_time: string
  duration_minutes: number
  status: 'available' | 'blocked' | 'booked'
  is_recurring: boolean
  recurrence_type: 'none' | 'weekly' | 'monthly'
  notes: string
  can_be_modified: boolean
}

interface WeeklyTemplate {
  day_of_week: number
  start_time: string
  end_time: string
  is_active: boolean
}

export default function TherapistAvailabilityPage() {
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([])
  const [weeklyTemplate, setWeeklyTemplate] = useState<WeeklyTemplate[]>([
    { day_of_week: 1, start_time: '09:00', end_time: '17:00', is_active: true },
    { day_of_week: 2, start_time: '09:00', end_time: '17:00', is_active: true },
    { day_of_week: 3, start_time: '09:00', end_time: '17:00', is_active: true },
    { day_of_week: 4, start_time: '09:00', end_time: '17:00', is_active: true },
    { day_of_week: 5, start_time: '09:00', end_time: '17:00', is_active: true },
    { day_of_week: 6, start_time: '10:00', end_time: '14:00', is_active: false },
    { day_of_week: 0, start_time: '10:00', end_time: '14:00', is_active: false },
  ])
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null)
  const [activeTab, setActiveTab] = useState('calendar')
  
  const [newSlot, setNewSlot] = useState<Partial<AvailabilitySlot>>({
    date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:00',
    duration_minutes: 60,
    status: 'available',
    is_recurring: false,
    recurrence_type: 'none',
    notes: ''
  })

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // Mock data - replace with API calls
  useEffect(() => {
    // Load availability slots
    const mockSlots: AvailabilitySlot[] = [
      {
        id: '1',
        date: '2024-02-15',
        start_time: '09:00',
        end_time: '10:00',
        duration_minutes: 60,
        status: 'available',
        is_recurring: false,
        recurrence_type: 'none',
        notes: '',
        can_be_modified: true
      },
      {
        id: '2',
        date: '2024-02-15',
        start_time: '14:00',
        end_time: '15:00',
        duration_minutes: 60,
        status: 'booked',
        is_recurring: false,
        recurrence_type: 'none',
        notes: 'Session with John Doe',
        can_be_modified: false
      },
      {
        id: '3',
        date: '2024-02-16',
        start_time: '10:00',
        end_time: '11:00',
        duration_minutes: 60,
        status: 'blocked',
        is_recurring: false,
        recurrence_type: 'none',
        notes: 'Personal appointment',
        can_be_modified: true
      }
    ]
    setAvailabilitySlots(mockSlots)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success'
      case 'booked': return 'primary'
      case 'blocked': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />
      case 'booked': return <Calendar className="w-4 h-4" />
      case 'blocked': return <Block className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const canModifySlot = (slot: AvailabilitySlot) => {
    const slotDate = new Date(slot.date)
    const today = new Date()
    const daysDiff = Math.ceil((slotDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysDiff >= 2 && slot.status !== 'booked'
  }

  const createAvailabilitySlot = () => {
    if (!newSlot.date || !newSlot.start_time || !newSlot.end_time) {
      alert('Please fill in all required fields')
      return
    }

    // Check 2-day advance notice
    const slotDate = new Date(newSlot.date!)
    const today = new Date()
    const daysDiff = Math.ceil((slotDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff < 2) {
      alert('Cannot create slots with less than 2 days advance notice')
      return
    }

    const slot: AvailabilitySlot = {
      id: `slot-${Date.now()}`,
      date: newSlot.date!,
      start_time: newSlot.start_time!,
      end_time: newSlot.end_time!,
      duration_minutes: newSlot.duration_minutes || 60,
      status: 'available',
      is_recurring: newSlot.is_recurring || false,
      recurrence_type: newSlot.recurrence_type || 'none',
      notes: newSlot.notes || '',
      can_be_modified: true
    }

    setAvailabilitySlots([...availabilitySlots, slot])
    setShowCreateForm(false)
    resetNewSlot()
    alert('Availability slot created successfully!')
  }

  const updateAvailabilitySlot = (slotId: string, updates: Partial<AvailabilitySlot>) => {
    const slot = availabilitySlots.find(s => s.id === slotId)
    if (!slot) return

    if (!canModifySlot(slot)) {
      alert('Cannot modify slots with less than 2 days advance notice or booked slots')
      return
    }

    setAvailabilitySlots(availabilitySlots.map(s => 
      s.id === slotId ? { ...s, ...updates } : s
    ))
    setEditingSlot(null)
    alert('Availability slot updated successfully!')
  }

  const blockSlot = (slotId: string, reason: string) => {
    updateAvailabilitySlot(slotId, { 
      status: 'blocked', 
      notes: reason 
    })
  }

  const unblockSlot = (slotId: string) => {
    updateAvailabilitySlot(slotId, { 
      status: 'available', 
      notes: '' 
    })
  }

  const deleteSlot = (slotId: string) => {
    const slot = availabilitySlots.find(s => s.id === slotId)
    if (!slot) return

    if (!canModifySlot(slot)) {
      alert('Cannot delete slots with less than 2 days advance notice or booked slots')
      return
    }

    if (confirm('Are you sure you want to delete this availability slot?')) {
      setAvailabilitySlots(availabilitySlots.filter(s => s.id !== slotId))
      alert('Availability slot deleted successfully!')
    }
  }

  const resetNewSlot = () => {
    setNewSlot({
      date: new Date().toISOString().split('T')[0],
      start_time: '09:00',
      end_time: '10:00',
      duration_minutes: 60,
      status: 'available',
      is_recurring: false,
      recurrence_type: 'none',
      notes: ''
    })
  }

  const generateSlotsFromTemplate = () => {
    const startDate = new Date(selectedDate)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 30) // Generate for next 30 days

    const newSlots: AvailabilitySlot[] = []
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay()
      const template = weeklyTemplate.find(t => t.day_of_week === dayOfWeek)
      
      if (template && template.is_active) {
        // Check if slot already exists for this date and time
        const existingSlot = availabilitySlots.find(s => 
          s.date === d.toISOString().split('T')[0] &&
          s.start_time === template.start_time
        )
        
        if (!existingSlot) {
          newSlots.push({
            id: `template-${d.getTime()}-${template.start_time}`,
            date: d.toISOString().split('T')[0],
            start_time: template.start_time,
            end_time: template.end_time,
            duration_minutes: 60,
            status: 'available',
            is_recurring: true,
            recurrence_type: 'weekly',
            notes: 'Generated from weekly template',
            can_be_modified: true
          })
        }
      }
    }

    if (newSlots.length > 0) {
      setAvailabilitySlots([...availabilitySlots, ...newSlots])
      alert(`Generated ${newSlots.length} availability slots from weekly template`)
    } else {
      alert('No new slots generated - slots may already exist for the selected period')
    }
  }

  const filteredSlots = availabilitySlots.filter(slot => {
    if (activeTab === 'calendar') {
      return slot.date === selectedDate
    }
    return true
  })

  return (
    <DashboardLayout userType="therapist">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Availability Management</h1>
            <p className="text-gray-600 mt-2">Manage your available time slots and schedule</p>
          </div>
          <div className="flex space-x-2 mt-4 lg:mt-0">
            <Button variant="outline" onClick={generateSlotsFromTemplate}>
              <Calendar className="w-4 h-4 mr-2" />
              Generate from Template
            </Button>
            <Button onClick={() => setShowCreateForm(true)} className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Availability
            </Button>
          </div>
        </div>

        {/* Important Notice */}
        <Alert variant="info">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            <strong>Important:</strong> Availability slots can only be modified or deleted with at least 2 days advance notice. 
            Booked slots cannot be modified directly - please contact clients to reschedule if needed.
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <Card variant="elevated">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="template">Weekly Template</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="calendar" className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <Label htmlFor="calendar-date">Select Date:</Label>
                <Input
                  id="calendar-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-48"
                />
                <Badge variant="outline">
                  {new Date(selectedDate).toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Badge>
              </div>

              <div className="grid gap-4">
                {filteredSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No availability for this date</h3>
                    <p className="text-gray-600 mb-4">Create availability slots to allow clients to book sessions.</p>
                    <Button onClick={() => setShowCreateForm(true)} className="gradient-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Availability
                    </Button>
                  </div>
                ) : (
                  filteredSlots
                    .sort((a, b) => a.start_time.localeCompare(b.start_time))
                    .map((slot) => (
                      <Card key={slot.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(slot.status)}
                                <Badge variant={getStatusColor(slot.status)}>
                                  {slot.status}
                                </Badge>
                              </div>
                              
                              <div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">
                                    {slot.start_time} - {slot.end_time}
                                  </span>
                                  <span className="text-gray-500">
                                    ({slot.duration_minutes} min)
                                  </span>
                                </div>
                                
                                {slot.notes && (
                                  <p className="text-sm text-gray-600 mt-1">{slot.notes}</p>
                                )}
                                
                                {slot.is_recurring && (
                                  <Badge variant="outline" className="mt-1">
                                    Recurring ({slot.recurrence_type})
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {slot.status === 'available' && canModifySlot(slot) && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const reason = prompt('Reason for blocking this slot:')
                                      if (reason) blockSlot(slot.id!, reason)
                                    }}
                                  >
                                    <Block className="w-4 h-4 mr-1" />
                                    Block
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingSlot(slot)}
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                  </Button>
                                </>
                              )}
                              
                              {slot.status === 'blocked' && canModifySlot(slot) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => unblockSlot(slot.id!)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Unblock
                                </Button>
                              )}
                              
                              {canModifySlot(slot) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteSlot(slot.id!)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                              
                              {!canModifySlot(slot) && (
                                <Badge variant="secondary">
                                  {slot.status === 'booked' ? 'Booked' : 'Cannot modify'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              <div className="space-y-4">
                {availabilitySlots
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.start_time.localeCompare(b.start_time))
                  .map((slot) => (
                    <Card key={slot.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="font-medium">
                                  {new Date(slot.date).toLocaleDateString()}
                                </span>
                                <Badge variant={getStatusColor(slot.status)}>
                                  {slot.status}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span>{slot.start_time} - {slot.end_time}</span>
                              </div>
                              {slot.notes && (
                                <p className="text-sm text-gray-600 mt-1">{slot.notes}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {canModifySlot(slot) ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingSlot(slot)}
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteSlot(slot.id!)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <Badge variant="secondary">
                                {slot.status === 'booked' ? 'Booked' : 'Cannot modify'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="template" className="space-y-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Weekly Template</h3>
                <p className="text-gray-600 mb-4">
                  Set your default availability for each day of the week. Use this template to quickly generate availability slots.
                </p>
              </div>

              <div className="space-y-4">
                {weeklyTemplate.map((template, index) => (
                  <Card key={template.day_of_week} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-24">
                            <span className="font-medium">{dayNames[template.day_of_week]}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={template.is_active}
                              onCheckedChange={(checked) => {
                                const updated = [...weeklyTemplate]
                                updated[index].is_active = checked
                                setWeeklyTemplate(updated)
                              }}
                            />
                            <span className="text-sm text-gray-600">
                              {template.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        
                        {template.is_active && (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="time"
                              value={template.start_time}
                              onChange={(e) => {
                                const updated = [...weeklyTemplate]
                                updated[index].start_time = e.target.value
                                setWeeklyTemplate(updated)
                              }}
                              className="w-32"
                            />
                            <span>to</span>
                            <Input
                              type="time"
                              value={template.end_time}
                              onChange={(e) => {
                                const updated = [...weeklyTemplate]
                                updated[index].end_time = e.target.value
                                setWeeklyTemplate(updated)
                              }}
                              className="w-32"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={generateSlotsFromTemplate} className="gradient-primary">
                  <Calendar className="w-4 h-4 mr-2" />
                  Generate Slots from Template
                </Button>
                <Button variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </TabsContent>
          </CardContent>
        </Card>

        {/* Create/Edit Form Modal */}
        {(showCreateForm || editingSlot) && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>
                {editingSlot ? 'Edit Availability Slot' : 'Create Availability Slot'}
              </CardTitle>
              <CardDescription>
                {editingSlot ? 'Modify your availability slot' : 'Add a new time slot for client bookings'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slot-date">Date *</Label>
                  <Input
                    id="slot-date"
                    type="date"
                    value={editingSlot ? editingSlot.date : newSlot.date}
                    onChange={(e) => {
                      if (editingSlot) {
                        setEditingSlot({ ...editingSlot, date: e.target.value })
                      } else {
                        setNewSlot({ ...newSlot, date: e.target.value })
                      }
                    }}
                    min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 2 days advance notice required</p>
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select
                    value={String(editingSlot ? editingSlot.duration_minutes : newSlot.duration_minutes)}
                    onValueChange={(value) => {
                      const duration = parseInt(value)
                      if (editingSlot) {
                        setEditingSlot({ ...editingSlot, duration_minutes: duration })
                      } else {
                        setNewSlot({ ...newSlot, duration_minutes: duration })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="start-time">Start Time *</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={editingSlot ? editingSlot.start_time : newSlot.start_time}
                    onChange={(e) => {
                      if (editingSlot) {
                        setEditingSlot({ ...editingSlot, start_time: e.target.value })
                      } else {
                        setNewSlot({ ...newSlot, start_time: e.target.value })
                      }
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="end-time">End Time *</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={editingSlot ? editingSlot.end_time : newSlot.end_time}
                    onChange={(e) => {
                      if (editingSlot) {
                        setEditingSlot({ ...editingSlot, end_time: e.target.value })
                      } else {
                        setNewSlot({ ...newSlot, end_time: e.target.value })
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={editingSlot ? editingSlot.notes : newSlot.notes}
                  onChange={(e) => {
                    if (editingSlot) {
                      setEditingSlot({ ...editingSlot, notes: e.target.value })
                    } else {
                      setNewSlot({ ...newSlot, notes: e.target.value })
                    }
                  }}
                  placeholder="Add any notes about this availability slot..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  checked={editingSlot ? editingSlot.is_recurring : newSlot.is_recurring}
                  onCheckedChange={(checked) => {
                    if (editingSlot) {
                      setEditingSlot({ ...editingSlot, is_recurring: checked })
                    } else {
                      setNewSlot({ ...newSlot, is_recurring: checked })
                    }
                  }}
                />
                <Label>Make this a recurring slot</Label>
              </div>
              
              {(editingSlot?.is_recurring || newSlot.is_recurring) && (
                <div className="mt-4">
                  <Label htmlFor="recurrence">Recurrence Type</Label>
                  <Select
                    value={editingSlot ? editingSlot.recurrence_type : newSlot.recurrence_type}
                    onValueChange={(value: any) => {
                      if (editingSlot) {
                        setEditingSlot({ ...editingSlot, recurrence_type: value })
                      } else {
                        setNewSlot({ ...newSlot, recurrence_type: value })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex space-x-2 mt-6">
                <Button
                  onClick={editingSlot ? 
                    () => updateAvailabilitySlot(editingSlot.id!, editingSlot) : 
                    createAvailabilitySlot
                  }
                  className="gradient-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingSlot ? 'Update Slot' : 'Create Slot'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false)
                    setEditingSlot(null)
                    resetNewSlot()
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}