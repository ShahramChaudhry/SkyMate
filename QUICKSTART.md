# Quick Start Guide

Get SeatSense running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed ([Download](https://nodejs.org/))
- Terminal/Command Prompt
- Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Install Dependencies (1 minute)

```bash
cd airline
npm install
```

This will install all required packages including Next.js, Prisma, and Tailwind CSS.

### 2. Set Up Database (1 minute)

The project is pre-configured to use SQLite for easy local development (no database server needed!).

```bash
# Generate Prisma Client
npm run db:generate

# Create database and tables
npm run db:push

# Populate with mock flight data
npm run db:seed
```

You should see:
```
✅ Cleared existing data
✅ Created 180 seats
   - Available: 72
   - Occupied: 108
   - Near children: 18
   - Exit rows: 12
🎉 Seeding complete!
```

### 3. Start Development Server (30 seconds)

```bash
npm run dev
```

Open your browser to **http://localhost:3000**

You should see the SeatSense opt-in screen! 🎉

## Test the Flow

### Complete User Journey

1. **Opt-In Screen** (`http://localhost:3000`)
   - Click **"Opt in"** to start personalization flow
   - Or **"Skip"** to go straight to seat selection

2. **Preferences** (`http://localhost:3000/preferences`)
   - Drag the age slider (18-65 years)
   - Select **"Prefer quiet"** for social comfort
   - Choose **"No preference"** for gender seating
   - Click **"Continue"**

3. **Seat Map** (`http://localhost:3000/seat-map`)
   - Blue seats = Recommended for you
   - Gray seats = Available
   - Dark gray = Occupied
   - Click any blue (recommended) seat
   - See seat details and pricing
   - Click **"Continue with seat 12B"** (or your choice)

4. **Confirmation** (`http://localhost:3000/confirmation`)
   - Review your selection
   - See your preferences summary
   - Click **"Confirm seat"** to complete

## Understanding the Mock Data

The seed script creates a realistic flight:

- **Aircraft**: 30 rows × 6 seats (A-F) = 180 total seats
- **Occupancy**: ~60% full (realistic for most flights)
- **Special Rows**:
  - Rows 5, 12, 20: Near children (discounted)
  - Rows 10, 21: Exit rows (extra legroom, premium)
- **Mock Passengers**: Random ages (25-55) and social preferences

## Exploring the Code

### Key Files to Check Out

```
airline/
├── app/
│   ├── page.tsx                    ← Opt-in screen
│   ├── preferences/page.tsx        ← Preferences form
│   ├── seat-map/page.tsx          ← Seat selection
│   └── confirmation/page.tsx      ← Confirmation
│
├── components/
│   ├── preferences-form.tsx        ← Interactive form
│   └── seat-map.tsx               ← Interactive seat grid
│
├── lib/
│   ├── actions.ts                 ← Server Actions (API)
│   ├── seat-recommendation.ts     ← Recommendation algorithm ⭐
│   └── session.ts                 ← Session management
│
└── prisma/
    ├── schema.prisma              ← Database schema
    └── seed.ts                    ← Mock data generator
```

### Recommendation Algorithm

Check out `lib/seat-recommendation.ts` to see how seats are scored:

```typescript
// Scoring factors:
- Age matching: +50 points
- Social comfort: +40 points
- Avoid children: -60 points (unless user opts in)
- Window/aisle/exit: +10-20 points
- Personal space: +15 points
```

### Database

View your database with Prisma Studio:

```bash
npm run db:studio
```

This opens a visual database browser at `http://localhost:5555`

## Common Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build           # Build for production
npm run start           # Run production build

# Database
npm run db:generate     # Regenerate Prisma Client after schema changes
npm run db:push         # Apply schema changes to database
npm run db:studio       # Open visual database browser
npm run db:seed         # Reset and reseed database

# Code Quality
npm run lint            # Check for code issues
```

## Resetting the Database

To start fresh with new mock data:

```bash
npm run db:seed
```

This clears all bookings and reseeds with fresh flight data.

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### "Cannot find module '@/lib/prisma'"

```bash
# Regenerate Prisma Client
npm run db:generate

# Restart dev server
npm run dev
```

### Database Locked Error (SQLite)

```bash
# Close Prisma Studio if open
# Then restart dev server
npm run dev
```

### Module Not Found Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Restart
npm run dev
```

## Next Steps

### Customize the Flight

Edit `prisma/seed.ts` to change:
- Number of rows (default: 30)
- Seat layout (default: A-F)
- Occupancy rate (default: 60%)
- Premium seats (exit rows, near children)

Then run:
```bash
npm run db:seed
```

### Modify Preferences

Edit `components/preferences-form.tsx` to:
- Add new preference types
- Change age range limits
- Customize social options

### Adjust Recommendations

Edit `lib/seat-recommendation.ts` to:
- Change scoring weights
- Add new recommendation factors
- Modify neighbor detection logic

### Switch to PostgreSQL

For production-ready setup:

1. Install PostgreSQL locally or use a cloud provider
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Update `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/seatsense"
   ```
4. Recreate database:
   ```bash
   npm run db:push
   npm run db:seed
   ```

## Resources

- **Documentation**: See `README.md` for full overview
- **Deployment**: See `DEPLOYMENT.md` for production setup
- **Architecture**: See `ARCHITECTURE.md` for technical deep dive

## Getting Help

### Check These First

1. Make sure Node.js 18+ is installed: `node --version`
2. All dependencies installed: `npm install`
3. Database initialized: `npm run db:push && npm run db:seed`
4. Dev server running: `npm run dev`

### Still Stuck?

- Check Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Check Prisma docs: [prisma.io/docs](https://www.prisma.io/docs)
- Review the code - it's well-commented!

## Congratulations! 🎉

You now have a fully functional airline seat recommendation system running locally. Try different preferences and see how the recommendations change!

**Ready to deploy?** Check out `DEPLOYMENT.md` for deploying to Vercel, Railway, or other platforms.

---

**Happy coding!** ✈️
