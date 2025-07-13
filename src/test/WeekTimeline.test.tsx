import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WeekTimeline } from '../components/WeekTimeline'

// Mock the hooks
vi.mock('../hooks/usePlan', () => ({
  usePlan: () => ({
    isoKeys: ['2025-07-13', '2025-07-14', '2025-07-15'],
    todayKey: '2025-07-13',
    getDayLabel: (dateKey: string) => `Day ${['2025-07-13', '2025-07-14', '2025-07-15'].indexOf(dateKey) + 1}`,
    getFormattedDate: (dateKey: string) => 'Mon Jul 13',
    getReadingsForDay: (_dateKey: string) => ['Gen 1-3', 'Gen 4-7', 'Gen 8-11', 'Job 1-5']
  })
}))

vi.mock('../hooks/useProgress', () => ({
  useProgress: () => ({
    isDone: (key: string) => key === '2025-07-13'
  })
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>
  }
}))

describe('WeekTimeline', () => {
  it('renders week accordion with expandable day rows', () => {
    render(<WeekTimeline />)
    
    // Should show week header
    expect(screen.getByText(/Week 1/)).toBeInTheDocument()
    
    // Should show day rows
    expect(screen.getByText('Day 1')).toBeInTheDocument()
    expect(screen.getByText('Day 2')).toBeInTheDocument()
    expect(screen.getByText('Day 3')).toBeInTheDocument()
  })

  it('expands day row on click', async () => {
    render(<WeekTimeline />)
    
    // Find a day row button
    const dayButton = screen.getByText('Day 1').closest('button')
    expect(dayButton).toBeInTheDocument()
    
    // Click to expand
    fireEvent.click(dayButton!)
    
    // Should show expanded readings
    expect(screen.getByText('• Gen 1-3')).toBeInTheDocument()
    expect(screen.getByText('• Gen 4-7')).toBeInTheDocument()
  })

  it('calls onDayClick when day is expanded', () => {
    const mockOnDayClick = vi.fn()
    render(<WeekTimeline onDayClick={mockOnDayClick} />)
    
    // Find and click a day row
    const dayButton = screen.getByText('Day 1').closest('button')
    fireEvent.click(dayButton!)
    
    // Should call onDayClick with the date key
    expect(mockOnDayClick).toHaveBeenCalledWith('2025-07-13')
  })

  it('supports keyboard navigation', () => {
    render(<WeekTimeline />)
    
    const dayButton = screen.getByText('Day 1').closest('button')
    expect(dayButton).toHaveAttribute('aria-expanded', 'false')
    
    // Press Enter to expand
    fireEvent.keyDown(dayButton!, { key: 'Enter' })
    
    expect(dayButton).toHaveAttribute('aria-expanded', 'true')
  })
}) 