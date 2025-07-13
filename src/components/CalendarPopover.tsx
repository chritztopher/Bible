import { useMemo, useState, useEffect, useRef } from 'react'
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns'
import { cn } from '@/lib/utils'
import { usePlan } from '@/hooks/usePlan'
import { useProgress } from '@/hooks/useProgress'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface CalendarPopoverProps {
  trigger: React.ReactNode
  onDateSelect?: (dateKey: string) => void
}

export function CalendarPopover({ trigger, onDateSelect }: CalendarPopoverProps) {
  const { isoKeys, todayKey } = usePlan()
  const { isDone } = useProgress()
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  
  // Prevent page scrolling when mouse is over popover content
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!popoverRef.current) return
      
      const isOverPopover = popoverRef.current.contains(e.target as Node)
      if (isOverPopover) {
        // Let the popover handle its own scrolling
        // Only prevent page scrolling when we're at the scroll boundaries
        const scrollableElement = popoverRef.current
        const { scrollTop, scrollHeight, clientHeight } = scrollableElement
        
        // If popover content is scrollable
        if (scrollHeight > clientHeight) {
          const isAtTop = scrollTop <= 0
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1
          
          // Prevent page scrolling only when we would scroll past the boundaries
          if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
            e.preventDefault()
          }
          // Otherwise, allow normal scrolling within the popover
        } else {
          // If popover content is not scrollable, prevent page scrolling
          e.preventDefault()
        }
      }
    }
    
    if (open) {
      document.addEventListener('wheel', handleWheel, { passive: false })
    }
    
    return () => {
      document.removeEventListener('wheel', handleWheel)
    }
  }, [open])
  
  // Get months that contain plan dates
  const months = useMemo(() => {
    const planStart = new Date(isoKeys[0])
    const planEnd = new Date(isoKeys[isoKeys.length - 1])
    
    const monthsList = []
    const start = startOfMonth(planStart)
    const end = endOfMonth(planEnd)
    
    let currentMonth = start
    while (currentMonth <= end) {
      monthsList.push(currentMonth)
      currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    }
    
    return monthsList
  }, [isoKeys])
  
  const getDateStatus = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    
    if (!isoKeys.includes(dateKey)) {
      return 'outside'
    }
    
    if (isDone(dateKey)) {
      return 'completed'
    }
    
    if (dateKey === todayKey) {
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
    if (isoKeys.includes(dateKey) && onDateSelect) {
      onDateSelect(dateKey)
      setOpen(false) // Close the popover when a date is selected
    }
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 max-h-96 overflow-y-auto bg-white/95 backdrop-blur-sm border border-baby-pink-200" align="end" ref={popoverRef}>
        <div className="space-y-4">
          <div className="text-sm font-medium text-navy-800">Select a date</div>
          {months.map((month) => {
            const monthStart = startOfMonth(month)
            const monthEnd = endOfMonth(month)
            const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
            
            // Pad to start on Sunday
            const startDay = monthStart.getDay()
            const paddedDays = Array(startDay).fill(null).concat(daysInMonth)
            
            return (
              <div key={month.getTime()} className="space-y-2">
                <div className="text-sm font-medium text-center text-navy-700 bg-gradient-to-r from-baby-pink-50 to-navy-50 rounded-md py-2">
                  {format(month, 'MMMM yyyy')}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-navy-600 font-medium p-2 text-xs">
                      {day}
                    </div>
                  ))}
                  {paddedDays.map((date, index) => {
                    if (!date) {
                      return <div key={index} className="w-10 h-10" />
                    }
                    
                    const status = getDateStatus(date)
                    const dateKey = format(date, 'yyyy-MM-dd')
                    const canClick = isoKeys.includes(dateKey)
                    
                    return (
                      <button
                        key={date.getTime()}
                        onClick={() => handleDateClick(date)}
                        disabled={!canClick}
                        className={cn(
                          'w-10 h-10 rounded-md text-sm font-medium transition-all duration-200',
                          'flex items-center justify-center relative',
                          getDateStyles(status)
                        )}
                      >
                        {format(date, 'd')}
                        {status === 'completed' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
          
          <div className="grid grid-cols-3 gap-2 text-xs bg-gradient-to-r from-baby-pink-50 to-navy-50 rounded-md p-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-navy-700">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-navy-700">Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-navy-400 rounded-full" />
              <span className="text-navy-700">Pending</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 