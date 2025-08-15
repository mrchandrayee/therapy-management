"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CalendarProps {
    mode?: "single" | "multiple" | "range"
    selected?: Date | Date[] | { from: Date; to?: Date }
    onSelect?: (date: Date | Date[] | { from: Date; to?: Date } | undefined) => void
    className?: string
    disabled?: (date: Date) => boolean
}

function Calendar({
    mode = "single",
    selected,
    onSelect,
    className,
    disabled,
    ...props
}: CalendarProps) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date())

    const today = new Date()
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const firstDayWeekday = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    // Generate calendar days
    const calendarDays = []

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayWeekday; i++) {
        calendarDays.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(new Date(year, month, day))
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev)
            if (direction === 'prev') {
                newMonth.setMonth(prev.getMonth() - 1)
            } else {
                newMonth.setMonth(prev.getMonth() + 1)
            }
            return newMonth
        })
    }

    const isSelected = (date: Date) => {
        if (!selected) return false

        if (mode === "single" && selected instanceof Date) {
            return date.toDateString() === selected.toDateString()
        }

        if (mode === "multiple" && Array.isArray(selected)) {
            return selected.some(d => d.toDateString() === date.toDateString())
        }

        return false
    }

    const isToday = (date: Date) => {
        return date.toDateString() === today.toDateString()
    }

    const handleDateClick = (date: Date) => {
        if (disabled && disabled(date)) return

        if (mode === "single") {
            onSelect?.(date)
        } else if (mode === "multiple") {
            const currentSelected = Array.isArray(selected) ? selected : []
            const isAlreadySelected = currentSelected.some(d => d.toDateString() === date.toDateString())

            if (isAlreadySelected) {
                onSelect?.(currentSelected.filter(d => d.toDateString() !== date.toDateString()))
            } else {
                onSelect?.([...currentSelected, date])
            }
        }
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    return (
        <div className={cn("p-3", className)} {...props}>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-center pt-1 relative items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        className="absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                        onClick={() => navigateMonth('prev')}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="text-sm font-medium">
                        {monthNames[month]} {year}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                        onClick={() => navigateMonth('next')}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Calendar Grid */}
                <div className="w-full border-collapse space-y-1">
                    {/* Day headers */}
                    <div className="flex">
                        {dayNames.map(day => (
                            <div key={day} className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date, index) => (
                            <div key={index} className="h-9 w-9 text-center text-sm p-0 relative">
                                {date && (
                                    <button
                                        className={cn(
                                            "h-9 w-9 p-0 font-normal rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                            isSelected(date) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                                            isToday(date) && !isSelected(date) && "bg-accent text-accent-foreground",
                                            disabled && disabled(date) && "text-muted-foreground opacity-50 cursor-not-allowed"
                                        )}
                                        onClick={() => handleDateClick(date)}
                                        disabled={disabled && disabled(date)}
                                    >
                                        {date.getDate()}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

Calendar.displayName = "Calendar"

export { Calendar }