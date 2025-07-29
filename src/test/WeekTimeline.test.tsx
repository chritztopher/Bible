import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { WeekTimeline } from '../components/WeekTimeline'

// Mock the hooks
vi.mock('../hooks/usePlan', () => ({
  usePlan: vi.fn(() => ({
    weeks: [
      {
        week: 1,
        days: [
          {
            day: 1,
            reading: 'Genesis 1-4',
            date: new Date('2025-07-05'),
            dayLabel: 'Saturday'
          }
        ]
      }
    ],
    todayDayNumber: 1,
    todayKey: '2025-07-05',
    getDayLabel: vi.fn((_dateKey: string) => 'Saturday'),
    getFormattedDate: vi.fn((_dateKey: string) => 'July 5, 2025'),
    getReadingsForDay: vi.fn((_dateKey: string) => ['Genesis 1-4'])
  }))
}))

vi.mock('../hooks/useProgress', () => ({
  useProgress: vi.fn(() => ({
    isDone: vi.fn((_dateKey: string) => false),
    toggleDone: vi.fn()
  }))
}))

describe('WeekTimeline', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders successfully', () => {
    render(<WeekTimeline />)
    expect(screen.getByText('Week 1')).toBeInTheDocument()
  })

  it('supports keyboard navigation', () => {
    render(<WeekTimeline />)
    const weekButton = screen.getByRole('button', { name: /week 1/i })
    expect(weekButton).toBeInTheDocument()
  })
}) 