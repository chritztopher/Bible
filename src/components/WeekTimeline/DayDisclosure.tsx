import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProgress } from '@/hooks/useProgress'

interface DayDisclosureProps {
  open: boolean
  readings: string[]
  dayKey: string
}

export function DayDisclosure({ open, readings, dayKey }: DayDisclosureProps) {
  const { isDone, toggleDone } = useProgress()
  const completed = isDone(dayKey)
  
  const handleToggleComplete = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    e.preventDefault()
    toggleDone(dayKey)
  }
  
  return (
    <div 
      className={cn(
        "overflow-hidden transition-all duration-200 ease-in-out",
        open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <div className="px-4 pb-4 bg-gradient-to-r from-white to-baby-pink-50">
        <div className="space-y-2">
          {readings.map((reading, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div className="w-1 h-1 bg-baby-pink-400 rounded-full flex-shrink-0" />
              <span className="text-navy-700">{reading}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-baby-pink-200">
          <button
            onClick={handleToggleComplete}
            onTouchEnd={handleToggleComplete}
            className={cn(
              'flex items-center space-x-2 text-sm px-3 py-2 rounded-md transition-all duration-200 touch-manipulation min-h-[44px] w-full justify-center',
              completed 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700' 
                : 'bg-navy-100 text-navy-700 hover:bg-baby-pink-100 active:bg-baby-pink-200 border border-navy-200'
            )}
            style={{ touchAction: 'manipulation' }}
          >
            <Check className="w-3 h-3" />
            <span>{completed ? 'Completed' : 'Mark Complete'}</span>
          </button>
        </div>
      </div>
    </div>
  )
} 