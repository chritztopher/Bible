import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface DayDisclosureProps {
  open: boolean
  readings: string[]
  dayKey: string
}

export function DayDisclosure({ open, readings, dayKey }: DayDisclosureProps) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const motionProps = reducedMotion ? {} : {
    initial: false,
    animate: open ? "open" : "collapsed",
    variants: {
      open: { height: "auto", opacity: 1 },
      collapsed: { height: 0, opacity: 0 }
    },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
  }

  return (
    <motion.ul
      {...motionProps}
      id={`panel-${dayKey}`}
      className="overflow-hidden pl-8 pr-4"
      style={reducedMotion ? { 
        height: open ? 'auto' : 0, 
        opacity: open ? 1 : 0 
      } : {}}
    >
      {readings.map((reading, index) => (
        <li key={`${dayKey}-${index}`} className="py-0.5 text-sm text-slate-600 dark:text-slate-300">
          • {reading}
        </li>
      ))}
    </motion.ul>
  )
} 