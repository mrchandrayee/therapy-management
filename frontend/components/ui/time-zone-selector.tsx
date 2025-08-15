'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TimeZone {
  value: string
  label: string
  offset: string
}

const timeZones: TimeZone[] = [
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)', offset: '+05:30' },
  { value: 'America/New_York', label: 'Eastern Time (ET)', offset: '-05:00' },
  { value: 'America/Chicago', label: 'Central Time (CT)', offset: '-06:00' },
  { value: 'America/Denver', label: 'Mountain Time (MT)', offset: '-07:00' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: '-08:00' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: '+00:00' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)', offset: '+01:00' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)', offset: '+04:00' },
  { value: 'Asia/Singapore', label: 'Singapore Standard Time (SGT)', offset: '+08:00' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', offset: '+10:00' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: '+09:00' },
]

interface TimeZoneSelectorProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function TimeZoneSelector({ value, onValueChange, placeholder = "Select timezone" }: TimeZoneSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {timeZones.map((tz) => (
          <SelectItem key={tz.value} value={tz.value}>
            <div className="flex justify-between items-center w-full">
              <span>{tz.label}</span>
              <span className="text-sm text-gray-500 ml-2">{tz.offset}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function convertTimeToTimezone(time: string, fromTz: string, toTz: string): string {
  const date = new Date(`2024-01-01 ${time}`)
  
  // Create date in source timezone
  const sourceDate = new Date(date.toLocaleString("en-US", { timeZone: fromTz }))
  
  // Convert to target timezone
  const targetDate = new Date(date.toLocaleString("en-US", { timeZone: toTz }))
  
  return targetDate.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

export function getTimezoneOffset(timezone: string): string {
  const tz = timeZones.find(t => t.value === timezone)
  return tz?.offset || '+05:30'
}