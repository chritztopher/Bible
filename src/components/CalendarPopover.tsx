import { useState, useMemo, useRef } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isSameMonth } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils' 
import { usePlan } from '@/hooks/usePlan'
import { useProgress } from '@/hooks/useProgress'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface CalendarPopoverProps {
  trigger: React.ReactNode
  onDateSelect?: (dateKey: string) => void
}

export function CalendarPopover({ trigger, onDateSelect }: CalendarPopoverProps) {
  const { planStartDate, totalDays, todayKey } = usePlan()
  const { isDone } = useProgress()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  
  // Helper function to parse dateKey strings correctly (avoid timezone issues)
  const parseDateKey = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-').map(Number)
    return new Date(year, month - 1, day) // month - 1 because months are 0-indexed
  }
  
  // Calculate plan end date
  const planEndDate = useMemo(() => {
    const endDate = new Date(planStartDate)
    endDate.setDate(endDate.getDate() + totalDays - 1)
    return endDate
  }, [planStartDate, totalDays])
  
  // Check if a date is within the plan range
  const isDateInPlan = (date: Date) => {
    return date >= planStartDate && date <= planEndDate
  }
  
  // Generate calendar data for the current month
  const monthData = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start, end })
    
    return days.map(date => ({
      date,
      dateKey: format(date, 'yyyy-MM-dd'),
      isInPlan: isDateInPlan(date),
      isCurrentMonth: isSameMonth(date, currentMonth)
    }))
  }, [currentMonth, planStartDate, planEndDate])
  
  const getDateStatus = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    
    if (!isDateInPlan(date)) {
      return 'outside'
    }
    
    if (isDone(dateKey)) {
      return 'completed'
    }
    
    // Parse todayKey properly for comparison
    const todayDate = parseDateKey(todayKey)
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const normalizedTodayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate())
    
    if (normalizedDate.getTime() === normalizedTodayDate.getTime()) {
      return 'today'
    }
    
    return 'pending'
  }
  
  const getDateStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30'
      case 'today':
        return 'bg-blue-500 text-white hover:bg-blue-600 ring-2 ring-blue-500 ring-offset-2'
      case 'pending':
        return 'bg-navy-100 text-navy-700 hover:bg-baby-pink-100 border border-navy-200'
      default:
        return 'bg-baby-pink-50 text-baby-pink-400 cursor-not-allowed border border-baby-pink-200'
    }
  }
  
  const handleDateClick = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    if (isDateInPlan(date) && onDateSelect) {
      onDateSelect(dateKey)
      setOpen(false) // Close the popover when a date is selected
    }
  }
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => addMonths(prev, direction === 'next' ? 1 : -1))
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 max-h-96 overflow-y-auto bg-white/95 backdrop-blur-sm border border-baby-pink-200" align="end" ref={popoverRef}>
        <div className="space-y-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 rounded hover:bg-baby-pink-100 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-semibold text-navy-800">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 rounded hover:bg-baby-pink-100 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-xs font-medium text-navy-600">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {monthData.map(({ date, dateKey, isInPlan, isCurrentMonth }) => {
              if (!isCurrentMonth) {
                return <div key={dateKey} className="p-2" /> // Empty cell for other months
              }
              
              const status = getDateStatus(date)
              const canClick = isInPlan
              
              return (
                <button
                  key={dateKey}
                  onClick={() => handleDateClick(date)}
                  disabled={!canClick}
                  className={cn(
                    'p-2 text-sm rounded-md transition-all duration-200 relative',
                    getDateStyles(status),
                    !canClick && 'cursor-not-allowed'
                  )}
                  aria-label={`${format(date, 'MMMM d, yyyy')} - ${status}`}
                >
                  {format(date, 'd')}
                  {status === 'completed' && (
                    <div className="absolute top-1 right-1 w-1 h-1 bg-emerald-500 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span>Today</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-emerald-500/20 rounded" />
              <span>Completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-navy-100 rounded" />
              <span>Pending</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-baby-pink-50 rounded" />
              <span>Outside plan</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 