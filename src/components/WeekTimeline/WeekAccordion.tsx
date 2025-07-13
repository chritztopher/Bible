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
  const { isoKeys, todayKey } = usePlan()
  const { isDone } = useProgress()
  const timelineRef = useRef<HTMLDivElement>(null)
  const [hasInitialLoad, setHasInitialLoad] = useState(false)
  
  // Track which day is open in each week (one-open rule)
  const [openDayKeys, setOpenDayKeys] = useState<Record<string, string | null>>({})
  
  // Group days into weeks (7 days each)
  const weeks = useMemo(() => {
    const weekGroups = []
    for (let i = 0; i < isoKeys.length; i += 7) {
      const weekKeys = isoKeys.slice(i, i + 7)
      const weekNumber = Math.floor(i / 7) + 1
      const startDay = i + 1
      const endDay = Math.min(i + 7, isoKeys.length)
      
      // Calculate completion for this week
      const completedDays = weekKeys.filter(key => isDone(key)).length
      const totalDays = weekKeys.length
      const completionPercentage = (completedDays / totalDays) * 100
      
      weekGroups.push({
        id: `week-${weekNumber}`,
        number: weekNumber,
        keys: weekKeys,
        startDay,
        endDay,
        completedDays,
        totalDays,
        completionPercentage
      })
    }
    return weekGroups
  }, [isoKeys, isDone])
  
  // Find current week
  const currentWeekId = useMemo(() => {
    const todayIndex = isoKeys.indexOf(todayKey)
    if (todayIndex >= 0) {
      const weekNumber = Math.floor(todayIndex / 7) + 1
      return `week-${weekNumber}`
    }
    return 'week-1'
  }, [isoKeys, todayKey])
  
  // Initialize open day for current week to today
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
        defaultValue={window.innerWidth >= 1024 ? weeks.map(w => w.id) : [currentWeekId]}
        className="space-y-2"
      >
        {weeks.map((week) => (
          <AccordionItem key={week.id} value={week.id} data-week={week.id}>
            <AccordionTrigger className="hover:no-underline px-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">Week {week.number}</span>
                  <span className="text-sm text-muted-foreground">
                    Days {week.startDay}-{week.endDay}
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
                {week.keys.map((dateKey) => {
                  const isToday = dateKey === todayKey
                  const completed = isDone(dateKey)
                  const open = openDayKeys[week.id] === dateKey
                  
                  return (
                    <DayRow
                      key={dateKey}
                      dayKey={dateKey}
                      isToday={isToday}
                      completed={completed}
                      open={open}
                      onToggle={(key) => handleDayToggle(week.id, key)}
                    />
                  )
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
} 