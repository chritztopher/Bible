import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const { isoKeys, todayKey, getDayLabel, getFormattedDate, getReadingsForDay } = usePlan()
  const { isDone, toggleDone } = useProgress()
  const [currentDateKey, setCurrentDateKey] = useState(selectedDate || todayKey)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isSwipingRef = useRef(false)
  
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
  
  const currentIndex = isoKeys.indexOf(currentDateKey)
  const readings = getReadingsForDay(currentDateKey)
  const isCompleted = isDone(currentDateKey)
  const dayLabel = getDayLabel(currentDateKey)
  const formattedDate = getFormattedDate(currentDateKey)
  
  const navigateToDay = (direction: 'prev' | 'next') => {
    if (isSwipingRef.current) return // Prevent multiple navigation calls during swipe
    
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1
    if (newIndex >= 0 && newIndex < isoKeys.length) {
      setCurrentDateKey(isoKeys[newIndex])
    }
  }
  
  const handleToggleComplete = () => {
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
  
  // Swipe gesture handling
  const bind = useGesture(
    {
      onDragStart: () => {
        isSwipingRef.current = false
      },
      onDrag: ({ movement: [mx], direction: [dx], velocity: [vx], cancel }) => {
        if (isSwipingRef.current) return // Already handled this swipe
        
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
             <AnimatePresence mode="wait">
         <motion.div
           key={currentDateKey}
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -50 }}
           transition={{ duration: 0.2 }}
           className="bg-card border rounded-lg shadow-sm overflow-hidden"
         >
           <div {...bind()} className="h-full w-full">
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
                "w-full transition-all duration-200",
                isCompleted 
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                  : "border-navy-200 text-navy-700 hover:bg-baby-pink-50 hover:border-baby-pink-300"
              )}
            >
              <Check className={cn('mr-2 h-4 w-4', isCompleted ? 'text-white' : 'text-navy-600')} />
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </Button>
                     </div>
           </div>
         </motion.div>
       </AnimatePresence>
      
      {/* Navigation arrows - desktop only */}
      <AnimatePresence>
        {isHovered && (
          <>
            {currentIndex > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onClick={() => navigateToDay('prev')}
                className="absolute -left-12 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm border border-baby-pink-200 rounded-full shadow-md hover:bg-baby-pink-50 text-navy-600 hover:text-navy-800"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
            )}
            {currentIndex < isoKeys.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => navigateToDay('next')}
                className="absolute -right-12 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm border border-baby-pink-200 rounded-full shadow-md hover:bg-baby-pink-50 text-navy-600 hover:text-navy-800"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
} 