# Deployment Guide

Complete guide for deploying SeatSense to production.

## Quick Start (Vercel + PostgreSQL)

### 1. Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Create .gitignore (already included)
# Commit all files
git add .
git commit -m "Initial SeatSense deployment"

# Push to GitHub
git remote add origin <your-github-repo>
git push -u origin main
```

### 2. Set Up Database

**Option A: Vercel Postgres** (Recommended)

1. Go to [vercel.com/storage](https://vercel.com/storage)
2. Create a new Postgres database
3. Copy the `DATABASE_URL` connection string

**Option B: Supabase** (Free tier available)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings > Database
4. Use the "Connection Pooling" URL for better performance

**Option C: Railway** (Simple PostgreSQL hosting)

1. Go to [railway.app](https://railway.app)
2. Create new project > Add PostgreSQL
3. Copy the `DATABASE_URL` from the Variables tab

### 3. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings
4. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXT_PUBLIC_APP_URL`: Your production URL (e.g., `https://seatsense.vercel.app`)

5. Click "Deploy"

### 4. Initialize Production Database

After first deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run database migrations
vercel env pull .env.local
npx prisma generate
npx prisma db push

# Seed with mock data
npx tsx prisma/seed.ts
```

Alternatively, use Vercel's terminal feature:
1. Go to your project in Vercel dashboard
2. Open "Deployments" > latest deployment
3. Click "..." > "Open terminal"
4. Run:
```bash
npm run db:push
npm run db:seed
```

### 5. Verify Deployment

Visit your production URL and test the flow:
- ✅ Opt-in page loads
- ✅ Preferences can be saved
- ✅ Seat map shows available seats
- ✅ Confirmation page works

## Alternative Deployment Options

### Deploy to Railway

Railway can host both the Next.js app and PostgreSQL in one place.

1. Go to [railway.app](https://railway.app)
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Next.js
5. Add PostgreSQL service:
   - Click "+ New" > "Database" > "PostgreSQL"
   - Railway automatically connects it
6. Add environment variable:
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}` (Railway template)
7. Deploy and run migrations via Railway CLI or terminal

### Deploy to Fly.io

Great for global edge deployment.

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Set environment variables
fly secrets set DATABASE_URL="your-postgres-url"

# Deploy
fly deploy

# Run migrations
fly ssh console
npm run db:push
npm run db:seed
```

### Deploy to AWS Amplify

Enterprise-grade hosting with AWS integration.

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New App" > "Host web app"
3. Connect your GitHub repository
4. Amplify auto-detects Next.js
5. Add environment variables in "Environment variables" section
6. Set up database:
   - Use AWS RDS PostgreSQL
   - Or external provider like Supabase
7. Deploy

## Database Migration Strategy

### For Schema Changes

When you update `prisma/schema.prisma`:

```bash
# Local development
npm run db:push

# Production (via Vercel CLI)
vercel env pull
npx prisma db push
```

### For Larger Projects

Use Prisma Migrate for production:

```bash
# Create migration
npx prisma migrate dev --name add_new_feature

# Apply to production
npx prisma migrate deploy
```

## Environment Variables Reference

### Required
- `DATABASE_URL`: PostgreSQL connection string

### Optional
- `NEXT_PUBLIC_APP_URL`: Your production URL (for SEO/OG tags)
- `NODE_ENV`: Auto-set by Vercel to "production"

## Performance Optimization

### 1. Database Connection Pooling

For serverless environments, use connection pooling:

```env
# Supabase pooled connection
DATABASE_URL="postgresql://user:pass@host:6543/postgres?pgbouncer=true"

# Or use Prisma Data Proxy
DATABASE_URL="prisma://your-data-proxy-url"
```

### 2. Enable Edge Runtime (Optional)

For faster global response times:

```typescript
// app/layout.tsx
export const runtime = 'edge'
```

⚠️ Note: Prisma doesn't fully support edge runtime yet. Use for static pages only.

### 3. Image Optimization

If you add images later:

```typescript
// next.config.js
images: {
  domains: ['your-cdn.com'],
  formats: ['image/avif', 'image/webp'],
}
```

## Monitoring & Debugging

### Vercel Analytics

Enable in Vercel dashboard > Analytics tab

### Error Tracking

Add Sentry for production error tracking:

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Database Monitoring

Use Prisma Pulse for real-time database insights:
- [prisma.io/pulse](https://www.prisma.io/pulse)

## Security Checklist

- ✅ Environment variables set in Vercel (not in code)
- ✅ `.env` files in `.gitignore`
- ✅ Database has SSL enabled
- ✅ CORS configured if using API routes
- ✅ Session cookies are `httpOnly` and `secure` in production
- ✅ No sensitive data logged to console

## Scaling Considerations

### Database Scaling
- **< 1K users**: Vercel Postgres free tier
- **1K-10K users**: Supabase Pro or RDS Small instance
- **10K+ users**: RDS with read replicas, connection pooling

### Application Scaling
- Vercel automatically scales Next.js
- Use Edge Functions for global low-latency
- Consider Redis for session storage at scale

### Cost Estimates

**Small Scale** (< 10K monthly users):
- Vercel: $0 (Hobby) or $20/mo (Pro)
- Database: $0-25/mo (Supabase/Railway)
- **Total: $0-45/mo**

**Medium Scale** (10K-100K monthly users):
- Vercel Pro: $20/mo
- Database: $25-100/mo
- **Total: $45-120/mo**

## Troubleshooting

### "PrismaClientInitializationError"
- Check `DATABASE_URL` is correctly set in Vercel
- Ensure database is accessible from Vercel (check firewall rules)
- Verify Prisma client is generated: `npm run db:generate`

### "Module not found: Can't resolve '@/...'"
- Check `tsconfig.json` has correct path aliases
- Restart Next.js dev server
- Clear `.next` folder: `rm -rf .next`

### Seed script fails
- Check database connection
- Verify schema is pushed: `npm run db:push`
- Check for unique constraint violations

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys on:
- Push to `main` branch (production)
- Push to other branches (preview deployments)

### Preview Deployments

Test changes before merging:
1. Create feature branch
2. Push to GitHub
3. Vercel creates preview URL
4. Share with team for review
5. Merge to main when ready

### Rollback

If something goes wrong:
1. Go to Vercel dashboard > Deployments
2. Find last working deployment
3. Click "..." > "Promote to Production"

## Post-Deployment

### 1. Set Up Custom Domain (Optional)

In Vercel dashboard:
1. Go to Settings > Domains
2. Add your domain (e.g., `seatsense.com`)
3. Update DNS records as instructed
4. SSL is automatic

### 2. Enable Analytics

Track usage and performance:
- Vercel Analytics (built-in)
- Google Analytics
- Plausible (privacy-friendly)

### 3. Set Up Monitoring

- Vercel: Check "Runtime Logs" for errors
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Database monitoring (Prisma Studio, pgAdmin)

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Prisma: [prisma.io/docs](https://www.prisma.io/docs)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)

---

**Ready to deploy?** Follow the Quick Start section above and you'll be live in < 10 minutes! 🚀
