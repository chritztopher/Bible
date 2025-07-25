import { useState, useRef, useEffect } from 'react'
import { Calendar } from 'lucide-react'
import { usePlan } from '@/hooks/usePlan'
import { useProgress } from '@/hooks/useProgress'
import { Countdown } from '@/components/Countdown'
import { ProgressRing } from '@/components/ProgressRing'
import { DailyCard } from '@/components/DailyCard'
import { WeekTimeline } from '@/components/WeekTimeline'
import { CalendarPopover } from '@/components/CalendarPopover'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { totalDays } = usePlan()
  const { getCompletionPercentage, completedCount } = useProgress()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  
  const completionPercentage = getCompletionPercentage(totalDays)
  
  // Ensure page loads at the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  // Handle calendar date selection
  const handleDateSelect = (dateKey: string) => {
    setSelectedDate(dateKey)
    // Find the week containing this date and scroll to it
    if (timelineRef.current) {
      const weekElement = timelineRef.current.querySelector(`[data-week*="${dateKey}"]`)
      if (weekElement) {
        weekElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    
    // Scroll to the top to show the daily card with the selected date
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Handle timeline day click (sync with DailyCard)
  const handleTimelineDayClick = (dateKey: string) => {
    setSelectedDate(dateKey)
  }
  
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-6 space-y-8 bg-gradient-to-br from-baby-pink-50 via-white to-navy-50">
      {/* Jump to Date Button - Top Right Corner */}
      <div className="fixed top-4 right-4 z-10">
        <CalendarPopover 
          trigger={
            <Button variant="outline" size="sm" className="border-navy-200 text-navy-700 hover:bg-baby-pink-50 hover:border-baby-pink-300">
              <Calendar className="mr-2 h-4 w-4" />
              Jump to Date
            </Button>
          }
          onDateSelect={handleDateSelect}
        />
      </div>

      {/* Header section with countdown and progress */}
      <div className="relative flex flex-col items-center space-y-8">
        {/* Countdown and Progress Ring */}
        <div className="relative flex flex-col items-center">
          <ProgressRing percent={completionPercentage} />
          <div className="mt-4">
            <Countdown 
              target="2025-10-19T00:00:00-04:00"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy-800"
            />
            <p className="text-sm text-center mt-2 text-navy-600">
              Time until Tatum Ann and Christopher see each other
            </p>
          </div>
        </div>
        
        {/* Daily Card */}
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
          <DailyCard 
            className="w-full"
            onCalendarClick={() => {}}
            selectedDate={selectedDate || undefined}
          />
        </div>
      </div>
      
      {/* Progress Summary */}
      <div className="text-center space-y-1 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-baby-pink-200">
        <div className="text-2xl font-bold text-navy-800">
          {completedCount} of {totalDays} days completed
        </div>
        <div className="text-sm text-navy-600">
          {Math.round(completionPercentage)}% progress through the reading plan
        </div>
      </div>
      
      {/* Week Timeline */}
      <div ref={timelineRef} className="w-full max-w-3xl">
        <WeekTimeline 
          className="mt-10"
          onDayClick={handleTimelineDayClick}
        />
      </div>
      
      {/* Accessibility status region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {completedCount} of {totalDays} days completed. {Math.round(completionPercentage)}% progress.
      </div>
      
      {/* Spacer for bottom of page */}
      <div className="h-24" />
    </main>
  )
} 