import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlan } from '@/hooks/usePlan'
import { DayDisclosure } from './DayDisclosure'

interface DayRowProps {
  dayKey: string
  dayNumber: number
  reading: string
  isToday: boolean
  completed: boolean
  open: boolean
  onToggle: (key: string) => void
}

export function DayRow({ dayKey, dayNumber, reading, isToday, completed, open, onToggle }: DayRowProps) {
  const { getDayLabel, getFormattedDate } = usePlan()
  
  // Use the passed reading instead of fetching it
  const readings = reading ? [reading] : []
  const dayLabel = getDayLabel(dayNumber) // Use dayNumber directly
  const formattedDate = getFormattedDate(dayNumber) // Use dayNumber directly
  
  // Create preview text for collapsed state
  const previewText = readings.length > 2 
    ? `${readings.slice(0, 2).join(' • ')} • +${readings.length - 2} more`
    : readings.join(' • ')
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle(dayKey)
    }
  }
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggle(dayKey)
  }
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggle(dayKey)
  }
  
  const getDayStatusColor = () => {
    if (completed) return 'bg-emerald-500'
    if (isToday) return 'bg-blue-500'
    return 'bg-navy-400'
  }
  
  return (
    <li className={cn(
      'rounded-md overflow-hidden transition-colors',
      open && 'bg-gradient-to-r from-baby-pink-50 to-navy-50',
      isToday && !open && 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200'
    )}>
      <button
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        aria-expanded={open}
        aria-controls={`panel-${dayKey}`}
        className="group w-full flex items-start gap-3 py-3 px-4 text-left hover:bg-baby-pink-50 active:bg-baby-pink-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 touch-manipulation min-h-[48px]"
        style={{ touchAction: 'manipulation' }}
      >
        <span className={cn(
          'mt-2 w-2 h-2 rounded-full flex-shrink-0',
          getDayStatusColor()
        )} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={cn(
                'font-medium text-sm text-navy-800',
                isToday && 'font-semibold'
              )}>
                Day {dayNumber} - {dayLabel}
              </span>
              <span className="text-xs text-navy-600">
                {formattedDate}
              </span>
            </div>
            <ChevronDown className={cn(
              'w-4 h-4 text-navy-400 group-hover:text-navy-600 transition-all duration-200',
              open ? 'rotate-180' : 'rotate-0'
            )} />
          </div>
          {!open && (
            <p className="text-xs text-navy-500 truncate mt-1">
              {previewText}
            </p>
          )}
        </div>
      </button>
      
      <DayDisclosure 
        open={open} 
        readings={readings} 
        dayKey={dayKey}
      />
    </li>
  )
} 