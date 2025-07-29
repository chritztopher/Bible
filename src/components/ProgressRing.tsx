import { useMemo } from 'react'

interface ProgressRingProps {
  percent: number
  className?: string
}

export function ProgressRing({ percent, className = '' }: ProgressRingProps) {
  const radius = 140
  const strokeWidth = 8
  const normalizedRadius = radius - strokeWidth * 2

  // Number of segments (mimicking the original segmented design)
  const totalSegments = 60
  const filledSegments = Math.floor((percent / 100) * totalSegments)
  const segmentAngle = 360 / totalSegments
  const gapAngle = 2 // degrees between segments
  const actualSegmentAngle = segmentAngle - gapAngle

  const createSegmentPath = (startAngle: number, endAngle: number) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180)
    const endAngleRad = (endAngle - 90) * (Math.PI / 180)
    
    const x1 = radius + normalizedRadius * Math.cos(startAngleRad)
    const y1 = radius + normalizedRadius * Math.sin(startAngleRad)
    const x2 = radius + normalizedRadius * Math.cos(endAngleRad)
    const y2 = radius + normalizedRadius * Math.sin(endAngleRad)
    
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
    
    return `M ${x1} ${y1} A ${normalizedRadius} ${normalizedRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
  }

  const segmentPaths = useMemo(() => {
    return Array.from({ length: filledSegments }, (_, i) => {
      const startAngle = i * segmentAngle
      const endAngle = startAngle + actualSegmentAngle
      return {
        path: createSegmentPath(startAngle, endAngle),
        delay: i * 0.02
      }
    })
  }, [filledSegments, segmentAngle, actualSegmentAngle])

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        height={radius * 2}
        width={radius * 2}
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
              stroke="rgb(229 231 235)" // gray-200
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          )
        })}

        {/* Individual completed segments with CSS animation */}
        {segmentPaths.map((segment, i) => (
          <path
            key={`filled-${i}`}
            d={segment.path}
            fill="none"
            stroke="rgb(34 197 94)" // emerald-500
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="progress-segment-animate"
            style={{
              animationDelay: `${segment.delay}s`
            }}
          />
        ))}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-navy-800">
            {Math.round(percent)}%
          </div>
          <div className="text-sm text-navy-600">
            Complete
          </div>
        </div>
      </div>
    </div>
  )
} 