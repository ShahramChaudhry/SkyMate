# 🔒 Safe Push to GitHub - Step by Step

Follow these steps to safely push your SkyMatch app to GitHub.

---

## ✅ Pre-Push Safety Checklist

Run these commands to verify nothing sensitive will be exposed:

```bash
cd /Users/shahram/airline

# 1. Verify .env is ignored
git check-ignore .env
# Should output: .env ✅

# 2. Verify dev.db is ignored
git check-ignore prisma/dev.db
# Should output: prisma/dev.db ✅

# 3. Check what will be committed
git status
# Should NOT see .env or dev.db listed ✅
```

---

## 🚀 Step-by-Step Push Instructions

### Step 1: Create GitHub Repository

1. **Go to GitHub**: [github.com/new](https://github.com/new)

2. **Fill in details**:
   - Repository name: `skymatch` (or your choice)
   - Description: `Dating/social airline seat matching app - where connections take flight ✈️💕`
   - Visibility: **Private** (recommended for now)
   - ❌ Do NOT initialize with README (you already have files)
   
3. **Click**: "Create repository"

4. **Copy the repository URL** shown on the next page:
   ```
   https://github.com/YOUR_USERNAME/skymatch.git
   ```

---

### Step 2: Initialize Git (If Not Done)

```bash
cd /Users/shahram/airline

# Check if git is initialized
git status

# If "not a git repository" error, initialize it:
git init
```

---

### Step 3: Stage Your Files

```bash
# Add all files (safe ones only - .gitignore protects sensitive files)
git add .

# Verify what's staged
git status
```

**You should see:**
- ✅ All `.ts`, `.tsx`, `.css`, `.json` files
- ✅ Configuration files
- ✅ Documentation files
- ❌ Should NOT see `.env`
- ❌ Should NOT see `dev.db`

---

### Step 4: Commit Your Code

```bash
git commit -m "Initial commit - SkyMatch dating airline seat selection app"
```

---

### Step 5: Connect to GitHub

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/skymatch.git

# Rename branch to main (if needed)
git branch -M main
```

---

### Step 6: Push to GitHub

```bash
# Push your code
git push -u origin main
```

**If prompted for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your actual password)

---

### Step 7: Verify on GitHub

1. Go to your repository on GitHub
2. Check the files listed
3. **Verify these are NOT there:**
   - ❌ `.env` file
   - ❌ `dev.db` file
   - ❌ `node_modules/` folder
   - ❌ `.next/` folder

4. **Verify these ARE there:**
   - ✅ `app/` folder with all pages
   - ✅ `components/` folder
   - ✅ `lib/` folder
   - ✅ `prisma/schema.prisma`
   - ✅ `package.json`
   - ✅ `README.md`
   - ✅ `.gitignore`

---

## 🔐 GitHub Personal Access Token (If Needed)

If GitHub asks for password and rejects it, you need a Personal Access Token:

### Create Token:

1. Go to: [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: `SkyMatch Deployment`
4. Expiration: 90 days (or your choice)
5. Scopes: Check **`repo`** (full control of private repositories)
6. Click **"Generate token"**
7. **Copy the token** (you won't see it again!)
8. Use this token as your password when pushing

### Or Use SSH Instead:

```bash
# Switch to SSH URL
git remote set-url origin git@github.com:YOUR_USERNAME/skymatch.git

# Set up SSH key (if you haven't)
# Follow: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

---

## ✅ Post-Push Verification

After pushing, run this final check:

```bash
# Clone your repo to a temporary location to verify
cd /tmp
git clone https://github.com/YOUR_USERNAME/skymatch.git test-clone
cd test-clone

# Check for sensitive files
ls -la | grep -E "\.env"
# Should output nothing ✅

ls prisma/ | grep -E "\.db"
# Should output nothing ✅

# Clean up
cd ..
rm -rf test-clone
```

---

## 🎯 Common Issues & Solutions

### Issue: "Permission denied"
**Solution**: 
- Use Personal Access Token instead of password
- Or set up SSH keys

### Issue: "Remote origin already exists"
**Solution**:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/skymatch.git
```

### Issue: "Nothing to commit"
**Solution**:
```bash
# Check if files are staged
git status

# If files aren't staged:
git add .
git commit -m "Initial commit"
```

### Issue: "Accidentally committed .env"
**Solution**:
```bash
# Remove from git (keeps local file)
git rm --cached .env

# Commit the removal
git commit -m "Remove sensitive .env file"

# Push
git push

# IMPORTANT: Rotate/change any exposed secrets!
```

---

## 🎉 Success!

Once pushed, your repository is ready for Vercel deployment!

**Next Steps:**
1. ✅ Code is safely on GitHub
2. ✅ No secrets exposed
3. ➡️ Ready to deploy to Vercel
4. ➡️ See `VERCEL_DEPLOYMENT.md` for next steps

---

**Repository URL**: `https://github.com/YOUR_USERNAME/skymatch`

**Share it**: (once you make it public)
```
Check out my dating airline seat app! 
✈️💕 Where connections take flight
https://github.com/YOUR_USERNAME/skymatch
```

---

