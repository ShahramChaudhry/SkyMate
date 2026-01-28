# 🚀 Deploy SkyMatch to Vercel

Complete guide to deploy your dating airline seat selection app to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works!)
- Your app ready to deploy

---

## Step 1: Push Code to GitHub

### 1.1 Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `skymatch` (or your choice)
3. Description: "Dating/social airline seat matching app"
4. **Keep it Private** (for now)
5. Click **"Create repository"**

### 1.2 Push Your Code

Run these commands in your terminal:

```bash
# If git not initialized yet
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - SkyMatch app"

# Add your GitHub repo (replace USERNAME with yours)
git remote add origin https://github.com/USERNAME/skymatch.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**✅ Your code is now on GitHub!**

---

## Step 2: Set Up Database (Vercel Postgres)

### 2.1 Go to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login (use GitHub account for easy integration)
3. Click **"Add New"** → **"Project"**
4. Click **"Import Git Repository"**
5. Select your `skymatch` repository
6. Click **"Import"**

### 2.2 Configure Project

**BEFORE clicking "Deploy"**, we need to set up the database:

1. Click **"Storage"** tab in your Vercel dashboard
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Database name: `skymatch-db`
5. Region: Choose closest to your users
6. Click **"Create"**

**✅ Database created!**

### 2.3 Connect Database to Project

1. In the database page, click **"Connect Project"**
2. Select your `skymatch` project
3. Environment: **"Production"**
4. Click **"Connect"**

This automatically adds `DATABASE_URL` to your environment variables!

---

## Step 3: Update Database Schema for Production

### 3.1 Update Prisma Schema

Your schema needs to use PostgreSQL for production. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

### 3.2 Commit the Change

```bash
# Update schema
# (edit prisma/schema.prisma as shown above)

# Commit
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push
```

---

## Step 4: Deploy to Vercel

### 4.1 Initial Deploy

1. Go back to your Vercel project
2. Click **"Deploy"**
3. Wait 2-3 minutes for build to complete

**⚠️ The app will deploy but database tables don't exist yet!**

### 4.2 Run Database Migrations

After deployment, you need to create the tables:

**Option A: Via Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma db push

# Seed database with mock data
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npm run db:seed
```

**Option B: Via Vercel Dashboard**

1. Go to your project in Vercel
2. Click **"Deployments"** → Latest deployment
3. Click **"..."** → **"Redeploy"**
4. Check **"Use existing Build Cache"**
5. In the deployment logs, click **"Terminal"**
6. Run:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

---

## Step 5: Test Your Deployment

1. Go to your Vercel deployment URL (e.g., `skymatch.vercel.app`)
2. Test the flow:
   - ✅ Click "I'm interested ✨"
   - ✅ Fill preferences
   - ✅ See seat map with matches
   - ✅ Select seat
   - ✅ Confirm booking

**🎉 If it works, you're live!**

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Your Domain

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Vercel project → **"Settings"** → **"Domains"**
3. Add your domain: `skymatch.com`
4. Follow DNS configuration instructions
5. Wait 10-60 minutes for DNS propagation

**Example domains:**
- `skymatch.com`
- `flyandmeet.com`
- `seatsocial.com`

---

## 🔧 Troubleshooting

### Issue: "PrismaClientInitializationError"

**Solution**: Database not connected or migrations not run

```bash
# Check if DATABASE_URL is set
vercel env ls

# Run migrations again
vercel link
vercel env pull
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma db push
```

### Issue: "No seats showing"

**Solution**: Database needs seeding

```bash
# Seed the database
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npm run db:seed
```

### Issue: "Build failed"

**Solution**: Check build logs in Vercel dashboard
- Common issue: Missing environment variables
- Fix: Add `DATABASE_URL` in Vercel → Settings → Environment Variables

### Issue: "Cookie errors"

**Solution**: Ensure `NEXT_PUBLIC_APP_URL` is set
- Go to Vercel → Settings → Environment Variables
- Add: `NEXT_PUBLIC_APP_URL` = `https://your-app.vercel.app`

---

## 📊 Monitoring & Analytics

### Enable Vercel Analytics

1. Go to your project in Vercel
2. Click **"Analytics"** tab
3. Click **"Enable"**
4. Free tier includes:
   - Page views
   - Performance metrics
   - Device/browser data

### Database Monitoring

1. Go to **"Storage"** → Your database
2. View:
   - Query performance
   - Connection count
   - Database size

---

## 🔐 Security Checklist

- ✅ Database has SSL enabled (automatic with Vercel Postgres)
- ✅ Environment variables are secure (not in code)
- ✅ `.env` files in `.gitignore`
- ✅ Cookies are `httpOnly` and `secure`
- ✅ No API keys in frontend code

---

## 💰 Vercel Pricing

### Free Tier (Hobby) Includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Analytics (basic)
- ✅ 1 PostgreSQL database (256MB storage)

**Perfect for MVP and testing!**

### Upgrade to Pro ($20/mo) When:
- Need more bandwidth
- Custom domains on team
- Advanced analytics
- Priority support

---

## 🚀 Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Database connected and seeded
- [ ] All pages work (opt-in, preferences, seat-map, confirmation, success)
- [ ] Purple match seats appear when expected
- [ ] Seat selection and confirmation work
- [ ] Success page shows after confirmation
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Shared link with friends for testing

---

## 🎉 You're Live!

Your app is now deployed at:
- **Production**: `https://your-app.vercel.app`
- **GitHub**: Auto-deploy on every push to `main`
- **Preview**: Auto-deploy for every branch/PR

### Share Your App:
```
Check out SkyMatch - where connections take flight! ✈️💕
https://your-app.vercel.app
```

---

## 🔄 Future Updates

To update your live app:

```bash
# Make changes to code
git add .
git commit -m "Add new feature"
git push

# Vercel automatically deploys! 🎉
```

**That's it!** Vercel handles:
- Building
- Deploying
- SSL certificates
- CDN distribution
- Preview deployments

---

## 📞 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Ready to launch? Let's go! 🚀**
