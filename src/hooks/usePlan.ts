import { useMemo } from 'react'
import { format, addDays } from 'date-fns'
import readingsData from '../data/readings.json'

export interface ReadingEntry {
  day: number
  reading: string
}

export interface PlanData {
  readings: ReadingEntry[]
  totalDays: number
}

export function usePlan() {
  const readings = readingsData as ReadingEntry[]
  
  const plan: PlanData = useMemo(() => ({
    readings,
    totalDays: readings.length
  }), [readings])
  
  // Calculate the start date for the plan - July 5, 2025 (avoiding timezone issues)
  const planStartDate = useMemo(() => new Date(2025, 6, 5), []) // Month is 0-indexed, so 6 = July
  
  // Helper function to parse dateKey strings correctly (avoid timezone issues)
  const parseDateKey = (dateKey: string) => {
    const [year, month, day] = dateKey.split('-').map(Number)
    return new Date(year, month - 1, day) // month - 1 because months are 0-indexed
  }
  
  // Get reading by day number (1-365)
  const getReadingByDay = (dayNumber: number) => {
    const reading = readings.find(r => r.day === dayNumber)
    return reading ? reading.reading : ''
  }
  
  // Get day number from date
  const getDayFromDate = (date: Date) => {
    // Handle timezone issues when date comes from dateKey string parsing
    // If the date looks like it might be from a dateKey string (midnight UTC), 
    // create a proper local date to avoid timezone issues
    let normalizedDate = date
    if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
      // Likely from dateKey string - create local date
      normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    }
    
    const normalizedStartDate = new Date(planStartDate.getFullYear(), planStartDate.getMonth(), planStartDate.getDate())
    
    const diffTime = normalizedDate.getTime() - normalizedStartDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, Math.min(readings.length, diffDays + 1))
  }
  
  // Get date from day number
  const getDateFromDay = (dayNumber: number) => {
    return addDays(planStartDate, dayNumber - 1)
  }
  
  // Current day number based on today's date
  const todayDayNumber = getDayFromDate(new Date())
  
  // Helper functions to maintain compatibility with existing components
  const getDayLabel = (dayNumber: number) => {
    const date = getDateFromDay(dayNumber)
    return format(date, 'EEEE')
  }
  
  const getFormattedDate = (dayNumber: number) => {
    const date = getDateFromDay(dayNumber)
    return format(date, 'MMMM d, yyyy')
  }
  
  // For backward compatibility with components expecting date keys
  const getReadingsForDay = (dateKey: string) => {
    const date = parseDateKey(dateKey) // Use helper instead of new Date(dateKey)
    const dayNumber = getDayFromDate(date)
    const reading = getReadingByDay(dayNumber)
    return reading ? [reading] : []
  }
  
  // Generate weeks structure for accordion (52 weeks + partial week 53)
  const weeks = useMemo(() => {
    const weekArray = []
    let currentDay = 1
    
    // Generate weeks with 7 days each
    let weekNumber = 1
    while (currentDay <= readings.length) {
      const weekDays = []
      for (let dayInWeek = 1; dayInWeek <= 7; dayInWeek++) {
        if (currentDay <= readings.length) {
          weekDays.push({
            day: currentDay,
            reading: getReadingByDay(currentDay),
            date: getDateFromDay(currentDay),
            dayLabel: getDayLabel(currentDay)
          })
          currentDay++
        }
      }
      if (weekDays.length > 0) {
        weekArray.push({
          week: weekNumber,
          days: weekDays
        })
        weekNumber++
      }
    }
    
    return weekArray
  }, [readings])
  
  return {
    plan,
    readings,
    weeks,
    totalDays: readings.length, // Use actual readings length instead of fixed 365
    todayDayNumber,
    planStartDate,
    getReadingByDay,
    getDayFromDate,
    getDateFromDay,
    getDayLabel,
    getFormattedDate,
    getReadingsForDay, // For backward compatibility
    
    // Legacy compatibility
    isoKeys: [], // Not used with new format
    todayKey: format(new Date(), 'yyyy-MM-dd') // Use current date directly
  }
} 