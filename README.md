# ⚡ StatMaxer RPG OS - Level Up Your Life

<div align="center">

![StatMaxer Banner](https://img.shields.io/badge/StatMaxer-RPG_OS-3A86FF?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTUuMDkgOC4yNkwyMiA5LjI3TDE3IDEzLjE0TDE4LjE4IDIyTDEyIDE4LjI3TDUuODIgMjJMNyAxMy4xNEwyIDkuMjdMOC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjM0E4NkZGIi8+Cjwvc3ZnPgo=)
![Version](https://img.shields.io/badge/version-1.0.0-06FFA5?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-FF006E?style=for-the-badge)
![Privacy](https://img.shields.io/badge/privacy-100%25_Offline-00FFC2?style=for-the-badge)

**A cyberpunk-themed RPG habit tracker that gamifies your life with XP, levels, hardcore alarms, and attribute progression.**

[🎮 Live Demo](https://hyperpenetrator02.github.io/daily-tracker/) • [📱 Download APK](https://github.com/HyperPenetrator02/daily-tracker/releases) • [📖 Installation Guide](INSTALLATION.md) • [🔒 Privacy Policy](PRIVACY_POLICY.md)

</div>

---

## 🎯 Master Prompt Features

StatMaxer RPG OS is a **mobile-first Progressive Web App** with Android APK support, featuring:

### ⚔️ Three Core Views

1. **Quest Log** - Daily habit cards with large icons, XP badges, and one-tap completion
2. **Stat Matrix** - 31-column horizontal-scrolling grid (replica of automated dashboard)
3. **Character Tab** - Profile page with global XP bar, player level, and radar charts

### 💀 Hardcore Alarm System

- **Soft Alarms**: Standard push notifications at scheduled times
- **Hardcore Alarms**: Persistent vibration + high-priority alerts
- **Snooze Penalty**: Clicking snooze deducts **5 XP** from your total
- **15-Minute Grace**: Hardcore alarms trigger if habit incomplete 15 mins after scheduled time

### 📊 Advanced Gamification

- **XP Formula**: `XP_total = Σ(CompletedTasks × XP_value)`
- **Level Formula**: `Level = ⌊√(XP_total / 100)⌋ + 1`
- **Streak Engine**: Count consecutive completions
- **Streak Multiplier**: **1.5x XP** when streak ≥ 3 days
- **Attribute System**: Strength, Intelligence, Discipline with radar charts

### 🎨 UI/UX Excellence

- **Theme**: Dark mode with neon accents (#3A86FF, #00FFC2)
- **Typography**: JetBrains Mono (monospaced)
- **Animations**: Neon glow transitions, level-up effects, shimmer bars
- **Responsive**: Mobile-first design with sidebar navigation

---

## 🚀 Quick Start

### Web Version (Instant)

1. Visit: **https://hyperpenetrator02.github.io/daily-tracker/**
2. On mobile: Tap menu → **"Add to Home Screen"**
3. Launch like a native app!

### Android APK

1. Download from [Releases](https://github.com/HyperPenetrator02/daily-tracker/releases)
2. Enable "Unknown Sources" in Settings
3. Install APK
4. Grant permissions (Notifications, Vibrate, Wake Lock)

**Full instructions:** [INSTALLATION.md](INSTALLATION.md)

---

## 📱 Screenshots

<div align="center">

| Quest Log | Stat Matrix | Character Profile |
|-----------|-------------|-------------------|
| ![Quest Log](https://via.placeholder.com/300x600/121212/3A86FF?text=Quest+Log) | ![Stat Matrix](https://via.placeholder.com/300x600/121212/3A86FF?text=Stat+Matrix) | ![Character](https://via.placeholder.com/300x600/121212/3A86FF?text=Character) |

</div>

---

## 🎮 How to Use

### Creating a Quest

1. Tap **⚔️ Quest Log** → **+ New Quest**
2. Fill in details:
   - **Name**: e.g., "Wake up 6AM"
   - **Category**: Strength / Intelligence / Discipline
   - **Icon**: Choose from 16+ emojis
   - **XP Reward**: 1-100 XP per completion
   - **Monthly Goal**: Target days (1-31)
   - **Alarm Time**: Optional reminder
   - **💀 Hardcore Alarm**: Enable for persistent alerts

3. Tap **Create Habit**

### Completing Quests

- **Quest Log**: Tap **Complete Quest** button
- **Stat Matrix**: Click checkboxes for specific days

### Tracking Progress

- **📊 Stat Matrix**: See your 31-day completion grid
- **👤 Character**: View level, XP, and attribute radar charts

---

## 🏗️ Technical Architecture

### Backend (LocalStorage)

```javascript
// Habits Collection
{
  id: string,
  name: string,
  icon: string,
  category: 'strength' | 'intelligence' | 'discipline',
  xpReward: number,
  goalValue: number,
  alarmTime: string,
  hardcoreAlarm: boolean,
  dailyLogs: { [date: string]: boolean }
}

// Logs Collection
{
  habitId: string,
  date: string,
  status: boolean
}
```

### XP & Leveling Logic

```javascript
// XP Algorithm
XP_total = Σ(CompletedTasks × XP_value)

// Level Logic
Level = ⌊√(XP_total / 100)⌋ + 1

// Streak Multiplier
if (Streak >= 3) {
  XP_multiplier = 1.5
}
```

### Notification System

- **LocalNotificationService** integration
- **Soft Alarm**: Standard push notification
- **Hardcore Alarm**: Persistent vibration + high-priority alert
- **Snooze Penalty**: -5 XP deduction

---

## 📊 Default Habits (Pre-configured)

StatMaxer includes 10 habits matching the reference image:

| Habit | Icon | Category | XP | Alarm | Hardcore |
|-------|------|----------|-----|-------|----------|
| Wake up 6AM | 🌅 | Discipline | 15 | 06:00 | ✅ |
| No Snoozing | ⏰ | Discipline | 10 | 06:00 | ✅ |
| 3L Water | 💧 | Strength | 10 | - | - |
| Gym | 🏋️ | Strength | 20 | 07:00 | - |
| Stretching | 🧘 | Strength | 10 | - | - |
| Read 10 Pages | 📚 | Intelligence | 15 | 21:00 | - |
| Meditation | 🧘 | Discipline | 15 | 06:30 | - |
| Study 1 Hour | 💻 | Intelligence | 20 | - | - |
| Skincare | ✨ | Discipline | 10 | 22:00 | - |
| Track Expenses | 💰 | Intelligence | 10 | - | - |

---

## 🔧 File Structure

```
Daily Tracker/
├── index.html              # Main HTML structure
├── styles.css              # Cyberpunk theme & styling
├── app-rpg.js              # RPG OS application logic
├── service-worker.js       # PWA offline support
├── manifest.json           # PWA manifest
├── README.md               # This file
├── INSTALLATION.md         # Installation guide
├── PRIVACY_POLICY.md       # Privacy policy
├── DEPLOYMENT.md           # Deployment instructions
└── .github/
    └── workflows/
        └── build-apk.yml   # Automated APK builds
```

---

## 🎨 Customization

### Change Colors

Edit `styles.css`:
```css
:root {
    --accent-primary: #3A86FF;  /* Neon Blue */
    --success: #06FFA5;         /* Neon Green */
    --danger: #FF006E;          /* Pink */
}
```

### Add More Icons

Edit `index.html` icon picker:
```html
<button type="button" class="icon-option" data-icon="🎯">🎯</button>
```

### Modify XP Formula

Edit `app-rpg.js`:
```javascript
getTotalXP() {
    return this.habits.reduce((total, habit) => {
        const completed = this.getCompletedDays(habit.id);
        return total + (completed * habit.xpReward);
    }, 0);
}
```

---

## 🔒 Privacy & Security

### 100% Offline & Private

- ✅ **No server communication** - All data stays on your device
- ✅ **No analytics** - Zero tracking or telemetry
- ✅ **No ads** - Completely ad-free
- ✅ **No account required** - Use immediately
- ✅ **Open source** - Fully transparent code

### Data Storage

All data stored in browser `localStorage`:
- Habits configuration
- Daily completion logs
- Player profile (name, level, XP)
- Notification preferences

**Full policy:** [PRIVACY_POLICY.md](PRIVACY_POLICY.md)

---

## 🚢 Deployment

### GitHub Pages (Web)

```bash
# Already deployed at:
https://hyperpenetrator02.github.io/daily-tracker/
```

### Android APK (Automated)

Every push to `main` triggers automated APK build via GitHub Actions:

1. Builds Android APK
2. Uploads artifact
3. Creates GitHub Release
4. Attaches APK to release

**See:** [.github/workflows/build-apk.yml](.github/workflows/build-apk.yml)

---

## 🛠️ Development

### Local Setup

```bash
# Clone repository
git clone https://github.com/HyperPenetrator02/daily-tracker.git
cd daily-tracker

# Open in browser
# No build step required - pure HTML/CSS/JS!
```

### Build Android APK

```bash
# Install Capacitor
npm install -g @capacitor/cli @capacitor/core @capacitor/android

# Initialize
npx cap init "StatMaxer RPG OS" "com.statmaxer.rpgos" --web-dir=.

# Add Android
npx cap add android

# Open in Android Studio
npx cap open android

# Build APK
# Build > Build Bundle(s) / APK(s) > Build APK(s)
```

---

## 🐛 Troubleshooting

### Notifications Not Working

1. Grant **Notifications** permission
2. Disable battery optimization
3. Add to **Protected Apps** (Xiaomi/Huawei)

### Alarms Not Triggering

1. Grant **Wake Lock** permission
2. Disable **Battery Saver**
3. Check alarm times are correct

### Data Not Saving

1. Ensure JavaScript enabled
2. Check localStorage not disabled
3. Clear app cache

**Full guide:** [INSTALLATION.md](INSTALLATION.md)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/HyperPenetrator02/daily-tracker/issues)
- **Privacy**: [Privacy Policy](PRIVACY_POLICY.md)
- **Source**: [GitHub Repository](https://github.com/HyperPenetrator02/daily-tracker)

---

## 📜 License

MIT License - Free to use and modify.

---

## 🎮 Start Your Journey

**Download StatMaxer RPG OS today and level up your life!**

<div align="center">

[![Download APK](https://img.shields.io/badge/Download-Android_APK-3A86FF?style=for-the-badge&logo=android)](https://github.com/HyperPenetrator02/daily-tracker/releases)
[![Try Web App](https://img.shields.io/badge/Try-Web_App-06FFA5?style=for-the-badge&logo=google-chrome)](https://hyperpenetrator02.github.io/daily-tracker/)
[![View Source](https://img.shields.io/badge/View-Source_Code-FF006E?style=for-the-badge&logo=github)](https://github.com/HyperPenetrator02/daily-tracker)

**⚡ Level Up Your Life! 🎮**

</div>
