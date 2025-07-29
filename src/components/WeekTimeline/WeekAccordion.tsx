import { useMemo, useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { usePlan } from '@/hooks/usePlan'
import { useProgress } from '@/hooks/useProgress'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { DayRow } from './DayRow'

interface WeekAccordionProps {
  className?: string
  onDayClick?: (dateKey: string) => void
}

export function WeekAccordion({ className, onDayClick }: WeekAccordionProps) {
  const { weeks, todayDayNumber, todayKey } = usePlan()
  const { isDone } = useProgress()
  const timelineRef = useRef<HTMLDivElement>(null)
  const [hasInitialLoad, setHasInitialLoad] = useState(false)
  
  // Track which day is open in each week (one-open rule)
  const [openDayKeys, setOpenDayKeys] = useState<Record<string, string | null>>({})
  
  // Add completion data to weeks from usePlan
  const weeksWithCompletion = useMemo(() => {
    return weeks.map((week) => {
      const completedDays = week.days.filter(day => {
        const dateKey = day.date.toISOString().split('T')[0]
        return isDone(dateKey)
      }).length
      
      const completionPercentage = (completedDays / week.days.length) * 100
      
      return {
        ...week,
        completedDays,
        totalDays: week.days.length,
        completionPercentage
      }
    })
  }, [weeks, isDone])
  
  // Find current week based on today's day number
  const currentWeekId = useMemo(() => {
    const currentWeek = weeksWithCompletion.find(week => 
      week.days.some(day => day.day === todayDayNumber)
    )
    return currentWeek ? `week-${currentWeek.week}` : 'week-1'
  }, [weeksWithCompletion, todayDayNumber])
  
  // Initialize open day for current week
  useEffect(() => {
    if (todayKey && currentWeekId) {
      setOpenDayKeys(prev => ({
        ...prev,
        [currentWeekId]: prev[currentWeekId] || null
      }))
    }
  }, [todayKey, currentWeekId])
  
  // Mark initial load as complete after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasInitialLoad(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])
  
  // Only scroll to current week after initial load is complete (not on page load)
  useEffect(() => {
    if (hasInitialLoad && timelineRef.current) {
      const currentWeekElement = timelineRef.current.querySelector(`[data-week="${currentWeekId}"]`)
      if (currentWeekElement) {
        // Only scroll if the user has interacted with the timeline
        const isVisible = currentWeekElement.getBoundingClientRect().top >= 0 && 
                         currentWeekElement.getBoundingClientRect().bottom <= window.innerHeight
        if (!isVisible) {
          // Don't auto-scroll on initial load
        }
      }
    }
  }, [currentWeekId, hasInitialLoad])
  
  const handleDayToggle = (weekId: string, dayKey: string) => {
    setOpenDayKeys(prev => ({
      ...prev,
      [weekId]: prev[weekId] === dayKey ? null : dayKey
    }))
    
    // Sync with DailyCard
    if (onDayClick) {
      onDayClick(dayKey)
    }
  }
  
  return (
    <div ref={timelineRef} className={cn('w-full', className)}>
      <Accordion 
        type="multiple" 
        defaultValue={[currentWeekId]}
        className="space-y-2"
      >
        {weeksWithCompletion.map((week) => {
          const weekId = `week-${week.week}`
          
          return (
            <AccordionItem key={weekId} value={weekId} data-week={weekId}>
              <AccordionTrigger className="hover:no-underline px-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">Week {week.week}</span>
                    <span className="text-sm text-muted-foreground">
                      Days {week.days[0]?.day}-{week.days[week.days.length - 1]?.day}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium">
                      {week.completedDays}/{week.totalDays} completed
                    </span>
                    <Progress 
                      value={week.completionPercentage} 
                      className="w-20 h-2"
                    />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ul className="space-y-1">
                  {week.days.map((day) => {
                    const dateKey = day.date.toISOString().split('T')[0]
                    const isToday = day.day === todayDayNumber
                    const completed = isDone(dateKey)
                    const open = openDayKeys[weekId] === dateKey
                    
                    return (
                      <DayRow
                        key={dateKey}
                        dayKey={dateKey}
                        dayNumber={day.day}
                        reading={day.reading}
                        isToday={isToday}
                        completed={completed}
                        open={open}
                        onToggle={(key) => handleDayToggle(weekId, key)}
                      />
                    )
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
} 