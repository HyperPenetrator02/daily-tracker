# StatMaxer RPG OS

**Level Up Your Life** - A gamified habit tracker with RPG mechanics, hardcore alarms, and character progression.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-brightgreen.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

## 🎮 Features

### Core RPG Mechanics
- **XP System**: Earn experience points by completing daily quests
- **Level Progression**: Level up based on total XP earned
- **Streak Multipliers**: Get 1.5x XP bonus for 3+ day streaks
- **Character Stats**: Track your progress across 6 RPG categories

### Three Core Views
1. **Quest Log** - Daily habit cards with completion tracking
2. **Stat Matrix** - 31-day grid view for all habits
3. **Character** - Your player profile with stats and radar charts

### Hardcore Alarms
- Set custom alarm times for each habit
- **Hardcore Mode**: Persistent notifications with extra vibration
- Snooze penalty system (-5 XP per snooze)
- Background notifications that work even when app is closed

### Progressive Web App
- Install on mobile devices
- Works offline
- Native app-like experience
- 100% privacy-focused (no data collection)

---

## 🚀 Quick Start

### Web Version (Instant)
Visit: **https://hyperpenetrator02.github.io/daily-tracker/**

### Install as PWA
1. Open the web version on your mobile device
2. Tap the menu (⋮) → "Add to Home Screen"
3. Launch from your home screen like a native app

### Android APK
Download the latest APK from [GitHub Releases](https://github.com/HyperPenetrator02/daily-tracker/releases)

---

## 📱 Installation

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- For APK: Android 7.0 or higher

### Browser Installation
1. Visit the web app URL
2. Grant notification permissions for alarms
3. Start tracking your habits!

### APK Installation
1. Download the APK from releases
2. Enable "Install from Unknown Sources"
3. Install the APK
4. Grant notification permissions
5. Start leveling up!

---

## 🎯 How It Works

### Creating Habits
1. Click "+ New Quest"
2. Choose an icon and category
3. Set XP reward and goal
4. Optional: Set alarm time
5. Optional: Enable hardcore mode

### Tracking Progress
- **Quest Log**: Tap "Complete Quest" to mark today as done
- **Stat Matrix**: Click any day to toggle completion
- **Character**: View your overall stats and level

### Earning XP
- Base XP: Set per habit (default 10 XP)
- Streak Bonus: 1.5x multiplier for 3+ day streaks
- Level Formula: `Level = ⌊√(Total XP / 100)⌋ + 1`

---

## 🔧 Development

### Tech Stack
- **Frontend**: Pure HTML, CSS, JavaScript
- **Charts**: Chart.js for radar visualizations
- **PWA**: Service Worker for offline support
- **Mobile**: Capacitor for Android APK

### Local Development
```bash
# Clone the repository
git clone https://github.com/HyperPenetrator02/daily-tracker.git
cd daily-tracker

# Install dependencies
npm install

# Run local server
npm run dev

# Open browser to http://localhost:8080
```

### Building APK
```bash
# Sync Capacitor
npm run sync

# Open Android Studio
npm run android

# Build APK in Android Studio
```

---

## 📊 Categories

Track habits across 6 RPG-style categories:

- 💪 **Strength** - Physical fitness and health
- 🧠 **Intelligence** - Learning and mental growth
- ⚡ **Agility** - Quick tasks and responsiveness
- 🎯 **Discipline** - Consistency and routine
- ❤️ **Vitality** - Self-care and wellness
- 🌟 **Charisma** - Social and creative pursuits

---

## 🔒 Privacy

- **100% Offline**: All data stored locally on your device
- **No Tracking**: Zero analytics or data collection
- **No Ads**: Completely ad-free experience
- **Open Source**: Full transparency

---

## 📄 License

MIT License - feel free to use, modify, and distribute.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/HyperPenetrator02/daily-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HyperPenetrator02/daily-tracker/discussions)

---

**Built with ❤️ for productivity enthusiasts**

Level up your life, one quest at a time! ⚔️
