import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'readingProgress_v1'

export interface ProgressMap {
  [dateKey: string]: boolean
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>({})
  const [loading, setLoading] = useState(true)
  
  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setProgress(parsed)
      }
    } catch (error) {
      console.error('Error loading progress from localStorage:', error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
        // Emit storage event for multi-tab sync
        window.dispatchEvent(new StorageEvent('storage', {
          key: STORAGE_KEY,
          newValue: JSON.stringify(progress),
          storageArea: localStorage
        }))
      } catch (error) {
        console.error('Error saving progress to localStorage:', error)
      }
    }
  }, [progress, loading])
  
  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          setProgress(parsed)
        } catch (error) {
          console.error('Error parsing storage event:', error)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])
  
  // Check if a day is completed
  const isDone = useCallback((dateKey: string) => {
    return progress[dateKey] === true
  }, [progress])
  
  // Toggle completion status for a day
  const toggleDone = useCallback((dateKey: string) => {
    setProgress(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }))
  }, [])
  
  // Get completion count
  const completedCount = Object.values(progress).filter(Boolean).length
  
  // Get completion percentage
  const getCompletionPercentage = (totalDays: number) => {
    return totalDays > 0 ? (completedCount / totalDays) * 100 : 0
  }
  
  return {
    progress,
    loading,
    isDone,
    toggleDone,
    completedCount,
    getCompletionPercentage
  }
} 