# 🚀 StatMaxer RPG OS - Deployment Guide

## Overview

StatMaxer RPG OS is deployed in two formats:
1. **Web App (PWA)** - Hosted on GitHub Pages
2. **Android APK** - Built via GitHub Actions

---

## 📱 Web Deployment (GitHub Pages)

### Current Deployment

**Live URL:** https://hyperpenetrator02.github.io/daily-tracker/

### Manual Deployment

```bash
# 1. Ensure all files are committed
git add .
git commit -m "Update StatMaxer RPG OS"

# 2. Push to main branch
git push origin main

# 3. GitHub Pages will auto-deploy from the root directory
```

### GitHub Pages Configuration

1. Go to repository **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **root**
4. Save

The site will be live at: `https://[username].github.io/[repo-name]/`

---

## 🤖 Android APK Deployment (Automated)

### GitHub Actions Workflow

Every push to `main` triggers automated APK build:

**Workflow File:** `.github/workflows/build-apk.yml`

### Build Process

1. **Checkout code**
2. **Setup Node.js** (v18)
3. **Install Capacitor** CLI and dependencies
4. **Initialize Capacitor** project
5. **Add Android platform**
6. **Setup Java** (v17)
7. **Build APK** using Gradle
8. **Upload artifact** to GitHub
9. **Create release** with APK attached

### Manual APK Build

```bash
# Install Capacitor globally
npm install -g @capacitor/cli @capacitor/core @capacitor/android

# Initialize Capacitor
npx cap init "StatMaxer RPG OS" "com.statmaxer.rpgos" --web-dir=.

# Add Android platform
npx cap add android

# Sync web assets
npx cap sync

# Open in Android Studio
npx cap open android

# In Android Studio:
# Build > Build Bundle(s) / APK(s) > Build APK(s)
```

### Signing APK (Production)

For production releases, sign the APK:

```bash
# Generate keystore (first time only)
keytool -genkey -v -keystore statmaxer.keystore -alias statmaxer -keyalg RSA -keysize 2048 -validity 10000

# Build signed APK in Android Studio:
# Build > Generate Signed Bundle / APK
# Select APK > Next
# Choose keystore file and enter credentials
# Select release build variant
# Finish
```

---

## 🔧 Configuration Files

### manifest.json (PWA)

```json
{
  "name": "StatMaxer RPG OS",
  "short_name": "StatMaxer",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#121212",
  "theme_color": "#3A86FF"
}
```

### capacitor.config.json (Android)

```json
{
  "appId": "com.statmaxer.rpgos",
  "appName": "StatMaxer RPG OS",
  "webDir": ".",
  "android": {
    "permissions": [
      "POST_NOTIFICATIONS",
      "SCHEDULE_EXACT_ALARM",
      "WAKE_LOCK",
      "VIBRATE"
    ]
  }
}
```

### service-worker.js (PWA)

Caches assets for offline use:
- HTML, CSS, JS files
- Fonts
- Icons

---

## 📦 Release Process

### Creating a New Release

1. **Update version** in `manifest.json` and `README.md`
2. **Commit changes**:
   ```bash
   git add .
   git commit -m "Release v1.1.0"
   git tag v1.1.0
   git push origin main --tags
   ```

3. **GitHub Actions** will automatically:
   - Build APK
   - Create GitHub Release
   - Attach APK to release

4. **Verify deployment**:
   - Web: Check GitHub Pages URL
   - Android: Download APK from Releases

---

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. Add `CNAME` file to repository root:
   ```
   statmaxer.yourdomain.com
   ```

2. Configure DNS:
   ```
   Type: CNAME
   Name: statmaxer
   Value: [username].github.io
   ```

3. Enable HTTPS in GitHub Pages settings

---

## 🔒 Environment Variables

No environment variables required - the app is 100% client-side!

---

## 📊 Analytics (Optional)

To add analytics while maintaining privacy:

1. Use **Plausible** (privacy-friendly)
2. Add script to `index.html`:
   ```html
   <script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
   ```

---

## 🐛 Troubleshooting

### GitHub Actions Build Fails

1. Check workflow logs in **Actions** tab
2. Verify Capacitor configuration
3. Ensure all dependencies are listed
4. Check Java/Node versions

### PWA Not Updating

1. Clear service worker cache
2. Force refresh (Ctrl+Shift+R)
3. Update `CACHE_NAME` in `service-worker.js`

### APK Installation Issues

1. Enable "Unknown Sources" on Android
2. Check app permissions
3. Verify APK is not corrupted
4. Try uninstalling previous version

---

## 📱 Testing

### Local Testing

```bash
# Web
# Simply open index.html in browser

# Android (requires Android Studio)
npx cap run android
```

### Production Testing

1. **Web**: Test on https://hyperpenetrator02.github.io/daily-tracker/
2. **Android**: Install APK from Releases
3. **PWA**: Add to home screen and test offline

---

## 🚀 Continuous Deployment

Current setup:
- **Web**: Auto-deploys on push to `main`
- **Android**: Auto-builds APK on push to `main`

To disable auto-deployment:
- Remove `.github/workflows/build-apk.yml`
- Disable GitHub Pages in settings

---

## 📞 Support

For deployment issues:
- **GitHub Issues**: [Report here](https://github.com/HyperPenetrator02/daily-tracker/issues)
- **Documentation**: [README.md](README.md)
- **Installation Guide**: [INSTALLATION.md](INSTALLATION.md)

---

**Happy Deploying! ⚡🎮**
