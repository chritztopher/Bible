import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface CountdownProps {
  target: string
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown({ target, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  
  useEffect(() => {
    const targetDate = new Date(target)
    
    const updateTimer = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }
    
    // Update immediately
    updateTimer()
    
    // Set up interval to update every second
    const interval = setInterval(updateTimer, 1000)
    
    return () => clearInterval(interval)
  }, [target])
  
  return (
    <div className={cn('text-center', className)}>
      <div className="flex items-center justify-center gap-4 text-5xl font-bold">
        <div className="flex flex-col items-center">
          <span className="tabular-nums">{timeLeft.days}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {timeLeft.days === 1 ? 'day' : 'days'}
          </span>
        </div>
        <span className="text-muted-foreground">:</span>
        <div className="flex flex-col items-center">
          <span className="tabular-nums">{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {timeLeft.hours === 1 ? 'hour' : 'hours'}
          </span>
        </div>
        <span className="text-muted-foreground">:</span>
        <div className="flex flex-col items-center">
          <span className="tabular-nums">{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {timeLeft.minutes === 1 ? 'min' : 'mins'}
          </span>
        </div>
        <span className="text-muted-foreground">:</span>
        <div className="flex flex-col items-center">
          <span className="tabular-nums">{timeLeft.seconds.toString().padStart(2, '0')}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {timeLeft.seconds === 1 ? 'sec' : 'secs'}
          </span>
        </div>
      </div>
    </div>
  )
} 