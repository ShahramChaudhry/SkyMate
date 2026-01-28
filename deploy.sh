#!/bin/bash

# SkyMatch Deployment Helper Script
# This script helps you deploy to Vercel step-by-step

echo "🚀 SkyMatch Deployment Helper"
echo "=============================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Add all files
echo ""
echo "📝 Adding files to Git..."
git add .
echo "✅ Files staged"

# Commit
echo ""
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Deploy SkyMatch to Vercel"
fi

git commit -m "$commit_msg"
echo "✅ Files committed"

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo ""
    echo "🌐 Setting up GitHub remote..."
    echo ""
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/skymatch.git): " repo_url
    
    if [ ! -z "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo "✅ Remote added"
    else
        echo "⚠️  No remote added. Add manually: git remote add origin YOUR_REPO_URL"
    fi
else
    echo "✅ Git remote already configured"
fi

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed to GitHub!"
else
    echo "⚠️  Push failed. You may need to:"
    echo "   1. Create the repository on GitHub"
    echo "   2. Check your credentials"
    echo "   3. Run: git push -u origin main"
fi

echo ""
echo "=============================="
echo "✨ Next Steps:"
echo "=============================="
echo ""
echo "1. Go to https://vercel.com"
echo "2. Click 'Add New' → 'Project'"
echo "3. Import your GitHub repository"
echo "4. Click 'Deploy'"
echo ""
echo "5. After deployment:"
echo "   - Go to Storage → Create Database → PostgreSQL"
echo "   - Connect it to your project"
echo "   - Run: vercel env pull"
echo "   - Run: npx prisma db push"
echo "   - Run: npm run db:seed"
echo ""
echo "📚 Full guide: See VERCEL_DEPLOYMENT.md"
echo ""
echo "🎉 Your app will be live at: https://your-app.vercel.app"
echo ""
