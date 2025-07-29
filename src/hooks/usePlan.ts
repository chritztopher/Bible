import { useMemo } from 'react'
import { format } from 'date-fns'
import planData from '../data/plan-447.json' // Updated to use the new 447-day plan

export interface PlanData {
  [key: string]: string[]
}

export function usePlan() {
  const plan = planData as PlanData
  
  const isoKeys = useMemo(() => {
    return Object.keys(plan).sort()
  }, [plan])
  
  const todayKey = format(new Date(), 'yyyy-MM-dd')
  
  const getDayLabel = (dateKey: string) => {
    const date = new Date(dateKey)
    return format(date, 'EEEE')
  }
  
  const getFormattedDate = (dateKey: string) => {
    const date = new Date(dateKey)
    return format(date, 'MMMM d, yyyy')
  }
  
  const getReadingsForDay = (dateKey: string) => {
    return plan[dateKey] || []
  }
  
  return {
    plan,
    isoKeys,
    todayKey,
    getDayLabel,
    getFormattedDate,
    getReadingsForDay
  }
} 