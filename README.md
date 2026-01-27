# SeatSense - Privacy-First Airline Seat Recommendation

![SeatSense](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Prisma](https://img.shields.io/badge/Prisma-5.8-green)

SeatSense is a modern, privacy-first airline seat selection feature that provides personalized seat recommendations based on passenger comfort preferences. Built with Next.js 14, TypeScript, and Prisma ORM.

## ✨ Features

- **Privacy-First**: No permanent storage of personal data; session-based only
- **Smart Recommendations**: AI-powered seat matching based on:
  - Age range preferences
  - Social comfort (quiet/open to conversation)
  - Inclusivity preferences
  - Proximity to children/families
- **Beautiful UI**: Mobile-first, airline-grade interface built with Tailwind CSS
- **Accessibility**: Full keyboard navigation and ARIA labels
- **Flexible**: Optional opt-in with ability to skip to manual selection

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Session**: Cookie-based (no authentication required)
- **Deployment**: Vercel-ready

### Project Structure

```
airline/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Opt-in screen
│   ├── preferences/         # Preferences form
│   ├── seat-map/           # Interactive seat selection
│   ├── confirmation/       # Booking confirmation
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── preferences-form.tsx
│   ├── seat-map.tsx
│   ├── back-button.tsx
│   └── icons.tsx
├── lib/                     # Core logic
│   ├── actions.ts          # Server Actions
│   ├── prisma.ts           # Prisma client
│   ├── seat-recommendation.ts  # Recommendation algorithm
│   └── session.ts          # Session management
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Mock data seeder
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or use SQLite for development)
- npm or yarn

### Installation

1. **Clone and install dependencies**:
```bash
cd airline
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```env
# For PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/seatsense?schema=public"

# Or for SQLite (development)
DATABASE_URL="file:./dev.db"
```

3. **Initialize database**:
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with mock data
npm run db:seed
```

4. **Run development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

The application uses four main models:

- **Booking**: Temporary session for a passenger's seat selection
- **Preferences**: User's comfort preferences (age, social, inclusivity)
- **Seat**: Flight seat inventory with mock passenger data
- **SeatAssignment**: Links a booking to a selected seat

All data is designed to expire after 24 hours for privacy.

## 🧠 Recommendation Algorithm

The seat recommendation algorithm (`lib/seat-recommendation.ts`) scores seats based on:

1. **Age Matching** (50 points): Prefers seats near passengers in similar age range
2. **Social Comfort** (40 points): Matches quiet/open preferences
3. **Child Avoidance** (-60 points): Penalizes seats near children unless user opts in
4. **Seat Position** (10-20 points): Bonuses for window, aisle, exit row
5. **Personal Space** (15 points): Prefers seats with empty neighbors

### Example Score Calculation

```typescript
// Seat 12B with neighbors aged 25-35, quiet passengers
// User preference: age 18-45, quiet, no children
Score = 50 (age match) + 40 (quiet) + 15 (window) + 15 (space) = 120 points
```

## 🔒 Privacy & Security

- **No User Accounts**: Session-based only
- **Temporary Storage**: All data expires after 24 hours
- **Cookie-Only Sessions**: HttpOnly, secure cookies
- **No Tracking**: Preferences never shared with other passengers
- **GDPR Compliant**: Full data control and deletion

## 🎨 UI/UX Highlights

- **Mobile-First**: Optimized for smartphone booking
- **Clear Visual Hierarchy**: Easy-to-scan seat map
- **Color-Coded Seats**:
  - Gray: Available
  - Blue: Recommended
  - Dark Gray: Occupied
  - Dark Blue: Selected
- **Responsive Design**: Works on all screen sizes
- **Touch-Friendly**: Large tap targets for mobile

## 🧪 Testing the Application

### Manual Testing Flow

1. **Opt-In Screen** (`/`)
   - Click "Opt in" to start preference flow
   - Or "Skip" to go directly to seat map

2. **Preferences** (`/preferences`)
   - Adjust age range slider (18-65)
   - Select social comfort preference
   - Select gender seating preference
   - Click "Continue"

3. **Seat Map** (`/seat-map`)
   - See highlighted recommended seats (blue)
   - Click any available seat to select
   - See seat details and pricing
   - Click "Continue with seat X" to confirm

4. **Confirmation** (`/confirmation`)
   - Review selected seat
   - View preferences summary
   - Confirm or change seat

### Mock Data

The seed script creates a 30-row, 6-column aircraft with:
- ~60% seat occupancy
- Mock passengers with random ages and preferences
- Rows 5, 12, 20 near children (discounted)
- Exit rows at 10 and 21

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables** in Vercel dashboard:
```env
DATABASE_URL=your-production-database-url
```

4. **Set up Database**:
   - Use Vercel Postgres, Supabase, or Railway
   - Run migrations:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Deploy**:
   - Vercel will automatically deploy on push to main
   - Visit your production URL

### Alternative Deployment Options

- **Railway**: Easy PostgreSQL + Node.js hosting
- **Fly.io**: Global edge deployment
- **AWS Amplify**: Enterprise-grade hosting
- **DigitalOcean App Platform**: Simple PaaS

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema changes
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed mock data

# Code Quality
npm run lint            # Run ESLint
```

## 📝 Key Design Decisions

### 1. Server Actions over API Routes
- **Why**: Simplifies data flow, reduces boilerplate
- **Benefit**: Type-safe mutations with automatic revalidation

### 2. Session-Based State
- **Why**: No user accounts needed for seat selection
- **Benefit**: Privacy-first, GDPR compliant

### 3. Prisma ORM
- **Why**: Type-safe database access, great DX
- **Benefit**: Automatic migrations, introspection, studio

### 4. Component Colocation
- **Why**: Keeps related code together
- **Benefit**: Easier maintenance and refactoring

### 5. Mobile-First Design
- **Why**: Most airline bookings happen on mobile
- **Benefit**: Optimized experience for primary use case

## 🤝 Contributing

This is a production-ready template. To extend:

1. **Add Real Flights**: Integrate with flight booking API
2. **Payment Integration**: Add Stripe for seat upgrades
3. **Admin Dashboard**: Manage flights and seat layouts
4. **Analytics**: Track conversion rates and preferences
5. **A/B Testing**: Optimize recommendation algorithm

## 📄 License

MIT License - feel free to use for commercial or personal projects.

## 🙏 Acknowledgments

- Design inspired by modern airline booking flows
- Built with Next.js 14 App Router best practices
- Recommendation algorithm based on collaborative filtering principles

---

**Built with ❤️ for a better flight booking experience**
