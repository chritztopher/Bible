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
  const { isoKeys, todayKey, getDayLabel, getFormattedDate, getReadingsForDay } = usePlan()
  const { isDone } = useProgress()
  const timelineRef = useRef<HTMLDivElement>(null)
  
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
  
  // Scroll to current week on mount
  useEffect(() => {
    if (timelineRef.current) {
      const currentWeekElement = timelineRef.current.querySelector(`[data-week="${currentWeekId}"]`)
      if (currentWeekElement) {
        currentWeekElement.scrollIntoView({ behavior: 'instant', block: 'start' })
      }
    }
  }, [currentWeekId])
  
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
          <AccordionItem 
            key={week.id} 
            value={week.id}
            data-week={week.id}
            className="border rounded-lg"
          >
            <AccordionTrigger 
              className={cn(
                'px-4 py-3 hover:no-underline sticky top-16 z-10 bg-white/80 backdrop-blur dark:bg-slate-900/80 rounded-t-lg',
                'lg:relative lg:top-0 lg:bg-transparent lg:backdrop-blur-none'
              )}
            >
              <div className="flex items-center justify-between w-full mr-4">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">
                    Week {week.number} (Days {week.startDay}-{week.endDay})
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {week.completedDays}/{week.totalDays} done
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={week.completionPercentage} 
                    className="w-24 h-1.5"
                  />
                  <span className="text-xs text-muted-foreground min-w-[3ch]">
                    {Math.round(week.completionPercentage)}%
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ul className="space-y-1">
                {week.keys.map((dateKey, index) => {
                  const dayIndex = isoKeys.indexOf(dateKey)
                  const isToday = dateKey === todayKey
                  const completed = isDone(dateKey)
                  const open = openDayKeys[week.id] === dateKey
                  
                  return (
                    <DayRow
                      key={dateKey}
                      dayKey={dateKey}
                      index={dayIndex}
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