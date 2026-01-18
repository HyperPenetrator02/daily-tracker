# Deploy StatMaxer to GitHub Pages

## Quick Deployment Steps

### 1. Initialize Git Repository
```bash
cd "d:\Projects\Daily Tracker"
git init
git add .
git commit -m "Initial commit: StatMaxer Life Gamification Dashboard"
```

### 2. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `statmaxer` (or any name you prefer)
3. Description: "Life Gamification Dashboard - Track habits with XP and level up!"
4. Make it **Public** (so GitHub Pages works for free)
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

### 3. Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/statmaxer.git
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under "Source", select **main** branch
5. Click **Save**
6. Wait 1-2 minutes for deployment

### 5. Share the URL
Your app will be live at:
```
https://YOUR_USERNAME.github.io/statmaxer/
```

Send this URL to your friend! 🎉

---

## Alternative: Deploy to Netlify (Even Easier!)

### Using Netlify Drop
1. Go to https://app.netlify.com/drop
2. Drag and drop the entire `Daily Tracker` folder
3. Get instant URL like: `https://random-name-123.netlify.app`
4. Share the URL with your friend!

### Using Netlify CLI
```bash
# Install Netlify CLI (one-time)
npm install -g netlify-cli

# Deploy
cd "d:\Projects\Daily Tracker"
netlify deploy --prod
```

---

## Notes
- Both options are **100% free**
- Your friend's data stays on **their device** (localStorage)
- Each person has their own separate habit tracking
- No backend or database needed
