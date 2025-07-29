# Bible Tracker

A React-based Bible reading tracker that helps you stay on track with your daily Bible reading plan while counting down to a special reunion date.

## Features

- **Daily Reading Plan**: Complete Leviticus through Revelation reading plan from July 29, 2025 to December 27, 2026
- **Countdown Timer**: Real-time countdown to your reunion date (October 19, 2025)
- **Progress Tracking**: Visual progress ring showing overall completion percentage
- **Calendar Navigation**: Click any date to jump to specific readings
- **Weekly Timeline**: Expandable view of each week's readings
- **Mobile-Friendly**: Touch-optimized swipe navigation and responsive design
- **Progress Persistence**: Your completed readings are saved locally

## Reading Plan Structure

- **518 total days** from July 29, 2025 to December 28, 2026
- **6 days of reading + 1 rest day** weekly pattern
- **2-3 chapters per reading day** for manageable daily portions
- **1,099 total chapters** covering Leviticus through Revelation
- **Rest days every 7th day** for reflection and catch-up

## Usage

1. **Daily Card**: Shows today's reading assignment
2. **Mark Complete**: Click to mark today's reading as finished
3. **Swipe Navigation**: Swipe left/right to navigate between dates (mobile)
4. **Calendar Popup**: Click the calendar icon to jump to any date
5. **Week Timeline**: View and expand individual weeks to see all readings

## Project Structure

```
src/
├── components/
│   ├── Countdown.tsx          # Reunion countdown timer
│   ├── DailyCard.tsx          # Main daily reading display
│   ├── CalendarPopover.tsx    # Date picker calendar
│   ├── ProgressRing.tsx       # Circular progress indicator
│   ├── WeekTimeline/          # Weekly reading components
│   └── ui/                    # Reusable UI components
├── data/
│   └── leviticus-to-revelation-plan.json  # Complete reading plan
├── hooks/
│   ├── usePlan.ts             # Reading plan data access
│   └── useProgress.ts         # Progress tracking logic
└── pages/
    └── Home.tsx               # Main application page
```

## Technical Details

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns library
- **Gestures**: @use-gesture/react for mobile swipe
- **Build Tool**: Vite
- **Testing**: Vitest

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

## Plan Details

The reading plan systematically covers all remaining books after Genesis and Exodus:

- **Old Testament**: Leviticus through Malachi (929 chapters)
- **New Testament**: Matthew through Revelation (260 chapters)  
- **Rest Days**: Built-in every 7th day for reflection
- **Completion**: December 27, 2026 with a celebration message

Perfect for preparing spiritually for your October 2025 reunion while completing a comprehensive Bible reading journey! 