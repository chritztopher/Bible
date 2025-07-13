import { motion } from 'framer-motion'
import { useProgress } from '@/hooks/useProgress'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'

interface DayDisclosureProps {
  open: boolean
  readings: string[]
  dayKey: string
}

export function DayDisclosure({ open, readings, dayKey }: DayDisclosureProps) {
  const { isDone, toggleDone } = useProgress()
  const completed = isDone(dayKey)
  
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
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
                onClick={() => toggleDone(dayKey)}
                className={cn(
                  'flex items-center space-x-2 text-sm px-3 py-1.5 rounded-md transition-all duration-200',
                  completed 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : 'bg-navy-100 text-navy-700 hover:bg-baby-pink-100 border border-navy-200'
                )}
              >
                <Check className="w-3 h-3" />
                <span>{completed ? 'Completed' : 'Mark Complete'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 