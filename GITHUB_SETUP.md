# GitHub Setup Guide

This guide walks you through uploading your refactored KemetianTours website to GitHub.

## 🚀 Initial Setup

### 1. Create Repository on GitHub

1. Go to [GitHub](https://github.com)
2. Click **"+"** → **"New repository"**
3. Enter repository name: `kemetian-tours-website` or `website`
4. Add description: "Premium Egyptian travel experiences website"
5. Choose **Public** (for portfolio) or **Private** (for security)
6. **Skip** "Initialize with README" (we have one)
7. Click **"Create repository"**

### 2. Initialize Local Git

```bash
# Navigate to your project directory
cd /path/to/kemetian-tours

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial project setup with refactored codebase"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/kemetian-tours-website.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## 📋 Pre-Upload Checklist

Before pushing to GitHub:

```bash
# ✅ Verify linting
npm run lint

# ✅ Run tests
npm run test

# ✅ Build for production
npm run build

# ✅ Check bundle size
npm run analyze

# ✅ Verify all files are present
git status
```

## 📦 What Gets Uploaded

### ✅ Include These Files

```
.gitignore                    # Git ignore rules
.eslintrc.json               # ESLint config
.prettierrc                  # Prettier config
.github/workflows/           # CI/CD workflows
src/                         # Source code
tests/                       # Test files
docs/                        # Documentation
package.json                 # Dependencies
README.md                    # Project documentation
CONTRIBUTING.md             # Contributing guidelines
tailwind.config.js          # Tailwind configuration
webpack.config.js           # Build configuration
LICENSE                     # MIT License (optional)
```

### ❌ These Get Ignored (via .gitignore)

```
node_modules/               # Installed packages
dist/                       # Build output
.env                        # Environment secrets
.cache/                     # Build cache
coverage/                   # Test coverage
.DS_Store                   # macOS files
```

## 🔑 GitHub Settings

### 1. Add Collaborators

**Settings** → **Collaborators** → **Add people**

### 2. Branch Protection Rules

**Settings** → **Branches** → **Add rule**

```
- Branch pattern: main
- ✅ Require pull request reviews (1)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Require code review from code owners
```

### 3. Enable Discussions

**Settings** → **Features** → Check **Discussions**

### 4. Add Topics

**About** → **Topics**:
- `egyptian-tourism`
- `travel-website`
- `responsive-design`
- `web-development`

## 🔄 Set Up CI/CD

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm run test -- --coverage

      - name: Build project
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: always()
```

## 📝 Create LICENSE File

Create `LICENSE` file with MIT License:

```
MIT License

Copyright (c) 2024 KemetianTours

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

**Automatic deployments**: Vercel deploys on every push to main.

### Option 2: GitHub Pages

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install and build
        run: |
          npm ci
          npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Option 3: Railway

1. Push to GitHub
2. Go to [Railway](https://railway.app)
3. Connect GitHub account
4. Select repository
5. Deploy with one click

## 📚 README Badges

Add to your README.md:

```markdown
# KemetianTours Website

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build Status](https://github.com/YOUR_USERNAME/kemetian-tours-website/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/kemetian-tours-website/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/kemetian-tours-website)
```

## 🔐 Secrets & Environment Variables

Add to **Settings** → **Secrets and variables** → **Actions**:

```
DEPLOY_KEY       # For deployment
API_KEY          # If using external APIs
ANALYTICS_ID     # For analytics tracking
```

Usage in workflows:

```yaml
- name: Deploy
  env:
    DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
  run: npm run deploy
```

## 📊 Monitor GitHub Metrics

### Enable Code Analysis

**Settings** → **Code security and analysis**:
- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Secret scanning
- ✅ Code scanning (CodeQL)

### View Statistics

- **Insights**: Repository activity and stats
- **Network**: Branch structure and commits
- **Traffic**: Visitor analytics
- **Community**: Issues, PRs, discussions

## 🎯 First Time Pushes

```bash
# Setup git config (one time)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Create and push feature branch
git checkout -b feature/add-hero-section
git add .
git commit -m "feat(hero): add hero section with parallax effect"
git push origin feature/add-hero-section

# Create Pull Request on GitHub
# → Review changes
# → Request approvals
# → Merge to main
```

## 📱 GitHub Mobile

Download GitHub mobile app to:
- Review code on the go
- Manage issues and PRs
- Receive notifications
- Monitor CI/CD status

## 🤝 Collaboration Tips

1. **Use issues** for tracking work
2. **Use milestones** for release planning
3. **Use projects** for kanban board
4. **Use discussions** for questions
5. **Use pull requests** for code review
6. **Write clear commit messages**
7. **Keep commits small and focused**

## 📖 Resources

- [GitHub Docs](https://docs.github.com)
- [Git Basics](https://git-scm.com/book/en/v2)
- [GitHub CLI Reference](https://cli.github.com/manual)
- [Actions Documentation](https://docs.github.com/en/actions)

## ✅ After Upload

- [ ] Verify all files on GitHub
- [ ] Check CI/CD pipeline passes
- [ ] Test deployment
- [ ] Update project links
- [ ] Share with team
- [ ] Set up issue templates
- [ ] Enable discussions
- [ ] Create first milestone
- [ ] Celebrate! 🎉

---

**Your website is now production-ready and on GitHub!** 🚀
