import { useMemo } from 'react'
import { format } from 'date-fns'
import planData from '../data/plan-98.json'

export interface PlanData {
  [key: string]: string[]
}

export function usePlan() {
  const plan = planData as PlanData
  
  // Get sorted ISO keys once (memoized)
  const isoKeys = useMemo(() => {
    return Object.keys(plan).sort()
  }, [plan])
  
  const totalDays = isoKeys.length
  
  // Get today's date key
  const todayKey = useMemo(() => {
    const now = new Date()
    return format(now, 'yyyy-MM-dd')
  }, [])
  
  // Get today's readings
  const todayReadings = plan[todayKey] || []
  
  // Get day index (0-based)
  const dayIndex = useMemo(() => {
    const index = isoKeys.indexOf(todayKey)
    return index >= 0 ? index : 0
  }, [isoKeys, todayKey])
  
  // Helper function to get readings for any day
  const getReadingsForDay = (dateKey: string) => {
    return plan[dateKey] || []
  }
  
  // Helper function to get day label
  const getDayLabel = (dateKey: string) => {
    const index = isoKeys.indexOf(dateKey)
    return index >= 0 ? `Day ${index + 1}` : 'Day ?'
  }
  
  // Helper function to get formatted date
  const getFormattedDate = (dateKey: string) => {
    const date = new Date(dateKey + 'T00:00:00')
    return format(date, 'EEE MMM d')
  }
  
  return {
    plan,
    isoKeys,
    totalDays,
    todayKey,
    todayReadings,
    dayIndex,
    getReadingsForDay,
    getDayLabel,
    getFormattedDate
  }
} 