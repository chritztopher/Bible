import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProgress } from '../hooks/useProgress'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock addEventListener and removeEventListener
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()
const mockDispatchEvent = vi.fn()

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener
})

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener
})

Object.defineProperty(window, 'dispatchEvent', {
  value: mockDispatchEvent
})

describe('useProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should initialize with empty progress', () => {
    const { result } = renderHook(() => useProgress())
    
    expect(result.current.progress).toEqual({})
    expect(result.current.completedCount).toBe(0)
    expect(result.current.getCompletionPercentage(98)).toBe(0)
  })

  it('should toggle day completion', () => {
    const { result } = renderHook(() => useProgress())
    
    act(() => {
      result.current.toggleDone('2025-07-13')
    })
    
    expect(result.current.isDone('2025-07-13')).toBe(true)
    expect(result.current.completedCount).toBe(1)
    expect(result.current.getCompletionPercentage(98)).toBeCloseTo(1.02, 2)
  })

  it('should calculate completion percentage correctly', () => {
    const { result } = renderHook(() => useProgress())
    
    act(() => {
      result.current.toggleDone('2025-07-13')
      result.current.toggleDone('2025-07-14')
      result.current.toggleDone('2025-07-15')
    })
    
    expect(result.current.completedCount).toBe(3)
    expect(result.current.getCompletionPercentage(98)).toBeCloseTo(3.06, 2)
  })

  it('should persist progress to localStorage', () => {
    const { result } = renderHook(() => useProgress())
    
    act(() => {
      result.current.toggleDone('2025-07-13')
    })
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'readingProgress_v1',
      JSON.stringify({ '2025-07-13': true })
    )
  })
}) 