# 🎉 Welcome to SeatSense!

Your production-ready airline seat recommendation system is ready to run.

## ⚡ Quick Start (3 commands)

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npm run db:generate && npm run db:push && npm run db:seed

# 3. Start development server
npm run dev
```

Then open **http://localhost:3000** in your browser! 🚀

## 📖 What You'll See

### 1. Opt-In Screen (http://localhost:3000)
Beautiful landing page with two options:
- **"Opt in"** → Go to preferences form
- **"Skip and choose seat manually"** → Direct to seat map

### 2. Preferences Form (http://localhost:3000/preferences)
Set your comfort preferences:
- **Age range slider**: 18-65 years
- **Social comfort**: Quiet / Open to conversation / No preference
- **Gender seating**: Same / Different / Any / No preference

### 3. Seat Map (http://localhost:3000/seat-map)
Interactive aircraft seat selection:
- **Blue seats**: Recommended for you based on preferences
- **Gray seats**: Available
- **Dark gray seats**: Occupied
- **Click any seat** to select it

### 4. Confirmation (http://localhost:3000/confirmation)
Review and confirm:
- See your selected seat (e.g., "Seat 21B")
- Review your preferences
- Confirm or go back to choose different seat

## 🎮 Try These Scenarios

### Scenario 1: Young Professional (Quiet Seeker)
1. Opt in
2. Set age: 25-35
3. Choose: "Prefer quiet"
4. Choose: "No preference" (gender)
5. Continue to seat map
6. **Notice**: Blue recommendations are near other quiet passengers aged 25-35

### Scenario 2: Family Traveler
1. Opt in
2. Set age: 18-45 (includes children)
3. Choose: "Open to conversation"
4. Continue to seat map
5. **Notice**: Blue recommendations include discounted seats near children (rows 5, 12, 20)

### Scenario 3: Senior Traveler
1. Opt in
2. Set age: 55-65
3. Choose: "Prefer quiet"
4. Continue to seat map
5. **Notice**: Blue recommendations avoid families, prefer mature passengers

### Scenario 4: Skip Preferences
1. Click "Skip and choose seat manually"
2. Go directly to seat map
3. **Notice**: No blue recommendations (all gray = equal choice)

## 🗂️ Project Structure

```
airline/
├── app/                    # Pages (Next.js App Router)
│   ├── page.tsx           # Opt-in screen
│   ├── preferences/       # Preferences form
│   ├── seat-map/         # Seat selection
│   └── confirmation/     # Confirmation
│
├── components/            # React components
├── lib/                  # Business logic
│   ├── actions.ts        # Server Actions (API)
│   ├── seat-recommendation.ts  # Algorithm ⭐
│   └── session.ts        # Session management
│
├── prisma/               # Database
│   ├── schema.prisma     # Schema
│   └── seed.ts          # Mock data
│
└── [docs]/              # Documentation
    ├── README.md        # Full guide
    ├── QUICKSTART.md    # Setup guide
    └── ...
```

## 🔍 Explore the Code

### Key File: Recommendation Algorithm

Open `lib/seat-recommendation.ts` to see how seats are scored:

```typescript
// Scoring factors:
- Age matching: +50 points
- Social comfort: +40 points
- Avoid children: -60 points (unless opted in)
- Window seat: +15 points
- Aisle seat: +10 points
- Exit row: +20 points
- Personal space: +15 points
```

### Key File: Server Actions

Open `lib/actions.ts` to see the API layer:

```typescript
// Available actions:
- getOrCreateBooking()     // Create session
- savePreferences()        // Save user preferences
- getSeatRecommendations() // Get recommended seats
- assignSeat()            // Assign seat to booking
- getBookingStatus()      // Get current booking
```

### Key File: Database Schema

Open `prisma/schema.prisma` to see the data model:

```prisma
Booking (id, sessionId, expiresAt)
  ├─ Preferences (ageMin, ageMax, socialComfort, inclusivity)
  └─ SeatAssignment → Seat (row, column, features)
```

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)
npm run build           # Build for production
npm run start           # Run production build
npm run lint            # Check code quality

# Database
npm run db:generate     # Regenerate Prisma Client (after schema changes)
npm run db:push         # Apply schema to database
npm run db:seed         # Reset database with fresh mock data
npm run db:studio       # Open visual database browser (http://localhost:5555)

# Reset Everything
npm run db:seed         # Clears all bookings, reseeds flight data
```

## 🎨 Customization Ideas

### Change Aircraft Layout

Edit `prisma/seed.ts`:
```typescript
const ROWS = 30           // Change to 20 for smaller aircraft
const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F']  // Remove for 4-seat rows
```

Then: `npm run db:seed`

### Adjust Recommendation Weights

Edit `lib/seat-recommendation.ts`:
```typescript
// Change scoring weights
if (ageMatchRatio >= 0.5) {
  score += 50  // Increase for stronger age preference
}
```

### Add New Preference

1. Update `prisma/schema.prisma` (add field to Preferences)
2. Run `npm run db:push`
3. Update `components/preferences-form.tsx` (add UI)
4. Update `lib/seat-recommendation.ts` (add scoring logic)

## 📱 Mobile Testing

The app is mobile-first! Test on different devices:

```bash
# Get your local IP
ipconfig getifaddr en0  # Mac
ip addr show            # Linux

# Access from phone
# http://YOUR_IP:3000
```

## 🚀 Deploy to Production

Ready to deploy? Follow these steps:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Deploy to Vercel** (free):
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repo
   - Add database (Vercel Postgres or Supabase)
   - Deploy! ✨

   **See DEPLOYMENT.md for detailed instructions**

## 📚 Documentation

- **QUICKSTART.md**: 5-minute setup guide (you are here!)
- **README.md**: Complete feature documentation
- **DEPLOYMENT.md**: Production deployment guide
- **ARCHITECTURE.md**: Technical deep dive
- **PROJECT_OVERVIEW.md**: High-level overview

## 🎓 Learning Resources

### Want to Learn More?

- **Next.js 14**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma ORM**: [prisma.io/docs](https://www.prisma.io/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **TypeScript**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs)

### Concepts Demonstrated

✅ Next.js App Router
✅ Server vs Client Components
✅ Server Actions (no REST API needed!)
✅ Prisma ORM
✅ Cookie-based sessions
✅ TypeScript strict mode
✅ Tailwind CSS
✅ Privacy-first design
✅ Algorithm design (recommendation system)

## ❓ Troubleshooting

### Port 3000 in use?
```bash
PORT=3001 npm run dev
```

### Database locked?
Close Prisma Studio and restart:
```bash
npm run dev
```

### Module not found?
```bash
npm run db:generate  # Regenerate Prisma Client
npm run dev
```

### Need fresh data?
```bash
npm run db:seed  # Reset database
```

## 🎉 You're All Set!

Open **http://localhost:3000** and start exploring!

The app is fully functional with:
- ✅ 180 mock seats (30 rows × 6 columns)
- ✅ ~60% occupancy (realistic)
- ✅ Smart recommendations
- ✅ Interactive seat selection
- ✅ Session management
- ✅ Beautiful UI

**Questions?** Check the documentation files or explore the well-commented code!

---

**Happy coding!** ✈️ Built with ❤️ using Next.js, TypeScript, and Prisma.
