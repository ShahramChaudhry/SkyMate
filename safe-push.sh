#!/bin/bash

# SkyMatch - Safe Push to GitHub
# This script ensures no sensitive data is committed

set -e  # Exit on error

echo "🔒 SkyMatch - Safe Push to GitHub"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Safety Check 1: Verify .env is ignored
echo "🔍 Safety Check 1: Verifying .env is ignored..."
if git check-ignore .env > /dev/null 2>&1; then
    echo -e "${GREEN}✅ .env is properly ignored${NC}"
else
    echo -e "${RED}❌ WARNING: .env is NOT ignored!${NC}"
    echo "Add .env to .gitignore before continuing"
    exit 1
fi

# Safety Check 2: Verify dev.db is ignored
echo ""
echo "🔍 Safety Check 2: Verifying database is ignored..."
if [ -f "prisma/dev.db" ]; then
    if git check-ignore prisma/dev.db > /dev/null 2>&1; then
        echo -e "${GREEN}✅ dev.db is properly ignored${NC}"
    else
        echo -e "${RED}❌ WARNING: dev.db is NOT ignored!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ No dev.db found (or already ignored)${NC}"
fi

# Safety Check 3: Verify node_modules is ignored
echo ""
echo "🔍 Safety Check 3: Verifying node_modules is ignored..."
if git check-ignore node_modules > /dev/null 2>&1; then
    echo -e "${GREEN}✅ node_modules is properly ignored${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules might not be ignored${NC}"
fi

# Show what will be committed
echo ""
echo "📋 Files that will be committed:"
echo "================================"
git status --short
echo ""

# Ask for confirmation
read -p "Do these files look safe to commit? (y/n): " confirm
if [[ $confirm != [yY] ]]; then
    echo "Aborting. Review your files and try again."
    exit 1
fi

# Initialize git if needed
if [ ! -d .git ]; then
    echo ""
    echo "📦 Initializing Git repository..."
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
fi

# Add files
echo ""
echo "📝 Staging files..."
git add .
echo -e "${GREEN}✅ Files staged${NC}"

# Commit
echo ""
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Initial commit - SkyMatch dating airline seat selection app"
fi

git commit -m "$commit_msg"
echo -e "${GREEN}✅ Files committed${NC}"

# Check if remote exists
echo ""
if ! git remote | grep -q "origin"; then
    echo "🌐 No GitHub remote found. Let's add one!"
    echo ""
    echo "First, create a repository on GitHub:"
    echo "1. Go to: https://github.com/new"
    echo "2. Repository name: skymatch"
    echo "3. Visibility: Private (recommended)"
    echo "4. Click 'Create repository'"
    echo ""
    read -p "Enter your GitHub repository URL: " repo_url
    
    if [ ! -z "$repo_url" ]; then
        git remote add origin "$repo_url"
        echo -e "${GREEN}✅ Remote added${NC}"
    else
        echo -e "${RED}No remote added. Run manually:${NC}"
        echo "git remote add origin YOUR_REPO_URL"
        exit 1
    fi
else
    echo -e "${GREEN}✅ GitHub remote already configured${NC}"
fi

# Rename branch to main
echo ""
echo "🔄 Setting branch to 'main'..."
git branch -M main

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
echo ""
read -p "Ready to push? (y/n): " push_confirm
if [[ $push_confirm == [yY] ]]; then
    if git push -u origin main; then
        echo ""
        echo "=================================="
        echo -e "${GREEN}🎉 SUCCESS!${NC}"
        echo "=================================="
        echo ""
        echo "Your code is safely on GitHub!"
        echo ""
        echo "✅ All safety checks passed"
        echo "✅ No sensitive files committed"
        echo "✅ Code pushed successfully"
        echo ""
        echo "Next Steps:"
        echo "1. Go to your GitHub repository"
        echo "2. Verify .env and dev.db are NOT there"
        echo "3. Deploy to Vercel (see VERCEL_DEPLOYMENT.md)"
        echo ""
    else
        echo ""
        echo -e "${RED}❌ Push failed${NC}"
        echo ""
        echo "Possible issues:"
        echo "1. Authentication failed - Need Personal Access Token?"
        echo "2. Repository doesn't exist on GitHub"
        echo "3. No permission to push"
        echo ""
        echo "Try:"
        echo "- Create token: https://github.com/settings/tokens"
        echo "- Or: git push -u origin main (manually)"
    fi
else
    echo "Push cancelled. You can push later with:"
    echo "git push -u origin main"
fi
