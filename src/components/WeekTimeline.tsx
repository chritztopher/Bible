import { WeekAccordion } from './WeekTimeline/WeekAccordion'

interface WeekTimelineProps {
  className?: string
  onDayClick?: (dateKey: string) => void
}

export function WeekTimeline({ className, onDayClick }: WeekTimelineProps) {
  return (
    <WeekAccordion 
      className={className}
      onDayClick={onDayClick}
    />
  )
} 