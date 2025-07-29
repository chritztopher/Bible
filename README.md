# Bible Tracker

A beautiful, interactive Bible reading tracker built with React, TypeScript, and Tailwind CSS. Track your progress through a chronological Bible reading plan with countdown timer, daily readings, and completion tracking.

## Features

- **Countdown Timer**: Real-time countdown to the target date (October 19, 2025)
- **Daily Readings**: View today's assigned Bible chapters with easy navigation
- **Progress Tracking**: Mark readings as complete with localStorage persistence
- **Interactive Calendar**: Jump to any date within the reading plan
- **Week Timeline**: Expandable accordion view of weekly reading progress
- **Swipe Navigation**: Mobile-friendly swipe gestures to navigate between days
- **Progress Ring**: Visual representation of overall completion percentage
- **Responsive Design**: Optimized for both desktop and mobile devices

## Reading Plan

This app uses a **447-day chronological Bible reading plan** that:
- **Starts**: July 29, 2024 (picking up after Genesis and Exodus)
- **Ends**: October 19, 2025
- **Format**: 2-4 chapters per day for comfortable, sustainable reading
- **Approach**: Follows biblical chronology for better understanding of historical context
- **Coverage**: Complete Bible minus Genesis and Exodus (already completed)

The plan is stored in `src/data/plan-447.json` and contains daily readings with chapter ranges.

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom color palette
- **Date Handling**: date-fns for reliable date operations
- **Gestures**: @use-gesture/react for touch interactions
- **UI Components**: Radix UI primitives for accessibility
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite for fast development and building
- **Testing**: Vitest and React Testing Library

## Project Structure

```
src/
├── components/           # React components
│   ├── CalendarPopover.tsx   # Calendar date picker
│   ├── Countdown.tsx         # Real-time countdown timer
│   ├── DailyCard.tsx         # Main daily reading card
│   ├── ProgressRing.tsx      # Circular progress indicator
│   ├── WeekTimeline/         # Week view components
│   │   ├── DayDisclosure.tsx
│   │   ├── DayRow.tsx
│   │   └── WeekAccordion.tsx
│   └── ui/               # Reusable UI components
├── data/
│   └── plan-447.json    # 447-day Bible reading plan
├── hooks/
│   ├── usePlan.ts       # Bible plan data and utilities
│   └── useProgress.ts   # Progress tracking with localStorage
├── lib/
│   └── utils.ts         # Utility functions
├── pages/
│   └── Home.tsx         # Main application page
└── test/                # Test files
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with JavaScript enabled

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bible-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Usage

1. **Daily Reading**: The app opens to today's reading assignment
2. **Mark Complete**: Click the "Mark Complete" button after finishing your reading
3. **Navigation**: Use swipe gestures (mobile) or arrow navigation to browse other days
4. **Calendar**: Click the calendar icon to jump to any specific date
5. **Week View**: Expand the week timeline to see multiple days at once
6. **Progress**: Watch your completion percentage grow in the progress ring

## Data Persistence

Progress is automatically saved to your browser's localStorage, so your completion status persists between sessions. No account creation or external database required.

## Mobile Experience

The app is fully optimized for mobile devices with:
- Touch-friendly button sizes (44px minimum)
- Swipe gestures for navigation
- Responsive typography and spacing
- Optimized touch targets and interactions

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with modern JS support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE). 