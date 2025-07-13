import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressRingProps {
  percent: number
  className?: string
}

export function ProgressRing({ percent, className }: ProgressRingProps) {
  // Ring dimensions
  const size = 120
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  
  // Calculate segments for 98 days
  const totalSegments = 98
  const segmentAngle = 360 / totalSegments
  const gapAngle = segmentAngle * 0.1 // 10% gap between segments
  const actualSegmentAngle = segmentAngle - gapAngle
  
  // Calculate how many segments should be filled
  const filledSegments = Math.floor((percent / 100) * totalSegments)
  
  // Convert angle to radians and calculate arc paths
  const createSegmentPath = (startAngle: number, endAngle: number) => {
    const start = (startAngle * Math.PI) / 180
    const end = (endAngle * Math.PI) / 180
    
    const x1 = size / 2 + radius * Math.cos(start)
    const y1 = size / 2 + radius * Math.sin(start)
    const x2 = size / 2 + radius * Math.cos(end)
    const y2 = size / 2 + radius * Math.sin(end)
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
  }
  
  return (
    <div className={cn('relative', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background segments */}
        {Array.from({ length: totalSegments }, (_, i) => {
          const startAngle = i * segmentAngle
          const endAngle = startAngle + actualSegmentAngle
          
          return (
            <path
              key={`bg-${i}`}
              d={createSegmentPath(startAngle, endAngle)}
              fill="none"
              stroke="rgb(148 163 184)" // slate-400
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="opacity-30"
            />
          )
        })}
        
        {/* Individual completed segments */}
        {Array.from({ length: filledSegments }, (_, i) => {
          const startAngle = i * segmentAngle
          const endAngle = startAngle + actualSegmentAngle
          
          return (
            <motion.path
              key={`filled-${i}`}
              d={createSegmentPath(startAngle, endAngle)}
              fill="none"
              stroke="rgb(34 197 94)" // emerald-500
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 1, pathLength: 1 }}
              transition={{ 
                duration: 0.3,
                delay: i * 0.02
              }}
            />
          )
        })}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-bold">{Math.round(percent)}%</div>
        <div className="text-xs text-muted-foreground">complete</div>
      </div>
    </div>
  )
} 