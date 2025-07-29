import { useState, useEffect, useRef } from 'react'
import { useGesture } from '@use-gesture/react'
import { ChevronLeft, ChevronRight, Calendar, Check } from 'lucide-react'
import confetti from 'canvas-confetti'
import { cn } from '@/lib/utils'
import { usePlan } from '@/hooks/usePlan'
import { useProgress } from '@/hooks/useProgress'
import { Button } from '@/components/ui/button'

interface DailyCardProps {
  className?: string
  onCalendarClick?: () => void
  selectedDate?: string // Allow external control of displayed date
}

export function DailyCard({ className, onCalendarClick, selectedDate }: DailyCardProps) {
  const { todayKey, getDayLabel, getFormattedDate, getReadingsForDay, getDayFromDate, getDateFromDay, totalDays } = usePlan()
  const { isDone, toggleDone } = useProgress()
  const [currentDateKey, setCurrentDateKey] = useState(selectedDate || todayKey)
  const [isHovered, setIsHovered] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right')
  const cardRef = useRef<HTMLDivElement>(null)
  const isSwipingRef = useRef(false)
  const touchStartXRef = useRef<number>(0)
  const touchStartTimeRef = useRef<number>(0)
  
  // Helper function to parse dateKey strings correctly (avoid timezone issues)
  const parseDateKey = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-').map(Number)
    return new Date(year, month - 1, day) // month - 1 because months are 0-indexed
  }
  
  // Auto-sync to today's key when it changes (but only if no external date is selected)
  useEffect(() => {
    if (!selectedDate) {
      setCurrentDateKey(todayKey)
    }
  }, [todayKey, selectedDate])
  
  // Sync with external selectedDate prop
  useEffect(() => {
    if (selectedDate) {
      setCurrentDateKey(selectedDate)
    }
  }, [selectedDate])
  
  // Get current day number and calculate index for navigation
  const currentDayNumber = getDayFromDate(parseDateKey(currentDateKey)) // Use helper
  const currentIndex = currentDayNumber - 1 // Convert to 0-based index
  const readings = getReadingsForDay(currentDateKey)
  const isCompleted = isDone(currentDateKey)
  const dayLabel = getDayLabel(currentDayNumber)
  const formattedDate = getFormattedDate(currentDayNumber)
  
  const navigateToDay = (direction: 'prev' | 'next') => {
    if (isSwipingRef.current) return // Prevent multiple navigation calls during swipe
    
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1
    const newDayNumber = newIndex + 1 // Convert back to 1-based day number
    
    if (newDayNumber >= 1 && newDayNumber <= totalDays) {
      const newDateKey = getDateFromDay(newDayNumber).toISOString().split('T')[0]
      setAnimationDirection(direction === 'prev' ? 'right' : 'left')
      setAnimationKey(prev => prev + 1)
      setCurrentDateKey(newDateKey)
    }
  }
  
  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent swipe gesture from interfering
    const wasCompleted = isDone(currentDateKey)
    toggleDone(currentDateKey)
    
    // Show confetti on first completion
    if (!wasCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }
  
  // Native touch event handlers for mobile fallback
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
    touchStartTimeRef.current = Date.now()
    isSwipingRef.current = false
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    // Prevent scrolling during horizontal swipes
    if (Math.abs(e.touches[0].clientX - touchStartXRef.current) > 10) {
      e.preventDefault()
    }
  }
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndTime = Date.now()
    const deltaX = touchEndX - touchStartXRef.current
    const deltaTime = touchEndTime - touchStartTimeRef.current
    
    // Check if it's a swipe gesture
    const distance = Math.abs(deltaX)
    const velocity = distance / deltaTime
    
    if (distance > 50 && velocity > 0.3 && deltaTime < 300) {
      isSwipingRef.current = true
      if (deltaX > 0) {
        navigateToDay('prev') // Right swipe = previous day
      } else {
        navigateToDay('next') // Left swipe = next day
      }
    }
  }
  
  // Improved gesture handling with better mobile support
  const bind = useGesture(
    {
      onDragStart: () => {
        isSwipingRef.current = false
      },
      onDrag: ({ movement: [mx], direction: [dx], velocity: [vx], cancel, event }) => {
        if (isSwipingRef.current) return // Already handled this swipe
        
        // Prevent default touch behavior to avoid conflicts
        if (event.type.includes('touch')) {
          event.preventDefault()
        }
        
        if (Math.abs(mx) > 40 || Math.abs(vx) > 0.5) {
          isSwipingRef.current = true
          cancel()
          if (dx > 0) {
            navigateToDay('prev') // Right swipe = previous day
          } else {
            navigateToDay('next') // Left swipe = next day
          }
        }
      },
      onDragEnd: () => {
        // Reset swipe state after a short delay to allow for gesture completion
        setTimeout(() => {
          isSwipingRef.current = false
        }, 100)
      },
    },
    {
      drag: {
        axis: 'x',
        threshold: 10,
        pointer: { touch: true }, // Enable touch support
        preventScroll: true, // Prevent scrolling during gesture
      },
    }
  )
  
  return (
    <div
      ref={cardRef}
      className={cn('relative max-w-md mx-auto', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        key={`${currentDateKey}-${animationKey}`}
        className={cn(
          "bg-card border rounded-lg shadow-sm overflow-hidden transition-all duration-200",
          animationDirection === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right'
        )}
      >
        <div 
          {...bind()} 
          className="h-full w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'pan-y' }} // Allow vertical scrolling, prevent horizontal
        >
        {/* Header */}
        <div className="px-4 py-3 border-b bg-gradient-to-r from-baby-pink-50 to-navy-50 border-baby-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-navy-800">{dayLabel}</h2>
              <p className="text-sm text-navy-600">{formattedDate}</p>
            </div>
            {onCalendarClick && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onCalendarClick}
                className="hidden md:flex text-navy-600 hover:text-navy-800 hover:bg-baby-pink-100"
              >
                <Calendar className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Readings */}
        <div className="p-4 space-y-2 bg-white/80 backdrop-blur-sm">
          {readings.map((reading, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-sm"
            >
              <div className="w-1 h-1 bg-baby-pink-400 rounded-full flex-shrink-0" />
              <span className="text-navy-700">{reading}</span>
            </div>
          ))}
        </div>
        
        {/* Completion Toggle */}
        <div className="px-4 py-3 border-t border-baby-pink-200 bg-gradient-to-r from-white to-baby-pink-50">
          <Button
            variant={isCompleted ? 'default' : 'outline'}
            onClick={handleToggleComplete}
            className={cn(
              "w-full transition-all duration-200 touch-manipulation min-h-[48px]",
              isCompleted 
                ? "bg-emerald-500 hover:bg-emerald-600 text-white active:bg-emerald-700" 
                : "border-navy-200 text-navy-700 hover:bg-baby-pink-50 hover:border-baby-pink-300 active:bg-baby-pink-100"
            )}
          >
            <Check className={cn('mr-2 h-4 w-4', isCompleted ? 'text-white' : 'text-navy-600')} />
            {isCompleted ? 'Completed' : 'Mark Complete'}
          </Button>
        </div>
        </div>
      </div>
      
      {/* Navigation arrows - desktop only */}
      {isHovered && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={() => navigateToDay('prev')}
              className={cn(
                "absolute -left-12 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm border border-baby-pink-200 rounded-full shadow-md hover:bg-baby-pink-50 text-navy-600 hover:text-navy-800",
                "transition-all duration-200 animate-fade-in"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {currentIndex < totalDays - 1 && (
            <button
              onClick={() => navigateToDay('next')}
              className={cn(
                "absolute -right-12 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm border border-baby-pink-200 rounded-full shadow-md hover:bg-baby-pink-50 text-navy-600 hover:text-navy-800",
                "transition-all duration-200 animate-fade-in"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </>
      )}
    </div>
  )
} 