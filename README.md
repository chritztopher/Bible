# Bible Reading Tracker

A beautiful, responsive React application for tracking a 98-day Bible reading plan from July 13, 2025 to October 18, 2025.

## Features

- **Countdown Timer**: Real-time countdown to the target date (October 19, 2025)
- **Progress Ring**: SVG progress indicator showing completion percentage with 98 segments
- **Daily Card**: Current day's readings with completion tracking and swipe navigation
- **Week Timeline**: Accordion-based timeline showing weekly progress
- **Calendar Popover**: Monthly calendar view for date selection (desktop only)
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Persistence**: LocalStorage saves progress with multi-tab synchronization
- **Animations**: Smooth transitions and confetti celebrations

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3 with JIT compilation
- **UI Components**: Radix UI primitives with shadcn/ui
- **Animation**: Framer Motion for smooth transitions
- **Gestures**: @use-gesture/react for swipe navigation
- **Date Handling**: date-fns for date manipulation
- **State Management**: React hooks + Context API
- **Storage**: localStorage for persistence
- **Testing**: Vitest + React Testing Library

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Countdown.tsx       # Real-time countdown timer
│   ├── ProgressRing.tsx    # SVG progress ring with segments
│   ├── DailyCard.tsx       # Daily reading card with swipe
│   ├── WeekTimeline.tsx    # Weekly accordion timeline
│   └── CalendarPopover.tsx # Monthly calendar popup
├── hooks/
│   ├── usePlan.ts         # Bible reading plan data
│   └── useProgress.ts     # Completion tracking
├── data/
│   └── plan-98.json       # 98-day reading schedule
├── lib/
│   └── utils.ts           # Utility functions
├── pages/
│   └── Home.tsx           # Main page layout
└── test/
    └── setup.ts           # Test configuration
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

## Key Features Explained

### Reading Plan
The application uses a 98-day reading schedule stored in `plan-98.json`. Each day contains 4 reading assignments covering the entire Bible.

### Progress Tracking
- Progress is stored in localStorage with the key `readingProgress_v1`
- Multi-tab synchronization using storage events
- Completion percentage calculation
- Individual day completion tracking

### Responsive Design
- Mobile-first approach
- Sticky week headers on mobile
- Desktop calendar popover
- Swipe gestures on mobile, hover arrows on desktop

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- Reduced motion support
- Focus management

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## License

MIT License 