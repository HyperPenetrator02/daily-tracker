# StatMaxer RPG OS - Installation Guide

## 🎮 Welcome to StatMaxer RPG OS!

**Level Up Your Life** with this gamified habit tracker featuring:
- ⚔️ Daily Quest Log
- 📊 31-Day Stat Matrix
- 👤 Character Profile with Radar Charts
- 💀 Hardcore Alarm System
- ✨ XP & Leveling Mechanics

---

## 📱 Android Installation Guide

### Method 1: Install from GitHub Releases (Recommended)

1. **Download the APK**
   - Go to [Releases](https://github.com/HyperPenetrator02/daily-tracker/releases)
   - Download the latest `statmaxer-rpg-os.apk` file

2. **Enable Unknown Sources**
   - Open **Settings** on your Android device
   - Navigate to **Security** or **Privacy**
   - Enable **Install Unknown Apps** or **Unknown Sources**
   - Select your browser/file manager and allow installations

3. **Install the APK**
   - Open your **Downloads** folder
   - Tap on `statmaxer-rpg-os.apk`
   - Tap **Install**
   - Wait for installation to complete
   - Tap **Open** to launch StatMaxer!

4. **Grant Permissions**
   - When prompted, allow:
     - ✅ **Notifications** - For habit reminders
     - ✅ **Vibrate** - For hardcore alarms
     - ✅ **Wake Lock** - To ensure alarms trigger

### Method 2: Build from Source

```bash
# Clone the repository
git clone https://github.com/HyperPenetrator02/daily-tracker.git
cd daily-tracker

# Install Capacitor
npm install -g @capacitor/cli @capacitor/core @capacitor/android

# Initialize Capacitor
npx cap init "StatMaxer RPG OS" "com.statmaxer.rpgos" --web-dir=.

# Add Android platform
npx cap add android

# Open in Android Studio
npx cap open android

# Build APK in Android Studio:
# Build > Build Bundle(s) / APK(s) > Build APK(s)
```

---

## 🌐 Web Version (Progressive Web App)

You can also use StatMaxer as a PWA:

1. Visit: `https://hyperpenetrator02.github.io/daily-tracker/`
2. On mobile, tap the browser menu (⋮)
3. Select **"Add to Home Screen"**
4. Tap **Add**
5. Launch from your home screen like a native app!

---

## 🎯 Quick Start Guide

### Creating Your First Quest

1. Tap **⚔️ Quest Log** in the sidebar
2. Tap **+ New Quest**
3. Fill in the details:
   - **Name**: e.g., "Wake up 6AM"
   - **Category**: Choose Strength, Intelligence, or Discipline
   - **Icon**: Pick an emoji
   - **XP Reward**: Set XP value (1-100)
   - **Monthly Goal**: Target days (1-31)
   - **Alarm Time**: Optional reminder
   - **Hardcore Alarm**: Enable for persistent alerts

4. Tap **Create Habit**

### Completing Quests

- **Quest Log View**: Tap the **Complete Quest** button on any card
- **Stat Matrix View**: Click checkboxes for specific days

### Tracking Progress

- **📊 Stat Matrix**: See your 31-day completion grid
- **👤 Character**: View your level, XP, and attribute radar charts

---

## 💀 Hardcore Alarm System

### What is Hardcore Mode?

When enabled, hardcore alarms:
- ⚡ Trigger persistent vibrations
- 🔔 Show high-priority notifications
- ⚠️ Penalize snoozing with **-5 XP**

### Setting Up Hardcore Alarms

1. Create or edit a habit
2. Set an **Alarm Time**
3. Check **💀 Hardcore Alarm**
4. Save the habit

**Warning:** Snoozing a hardcore alarm deducts 5 XP from your total!

---

## 📊 XP & Leveling System

### XP Formula

```
Total XP = Σ(Completed Tasks × XP Value)
```

### Level Formula

```
Level = ⌊√(Total XP / 100)⌋ + 1
```

### Streak Multiplier

- **Streak ≥ 3 days**: Earn **1.5x XP** on all completions!
- Maintain your streak to maximize XP gains

---

## 🎨 Three Core Views

### 1. ⚔️ Quest Log (Daily Habit Cards)
- Large, visual habit cards
- One-tap completion
- Alarm indicators
- XP badges
- Category tags

### 2. 📊 Stat Matrix (31-Column Grid)
- Monthly calendar view
- Checkbox grid for each habit
- Progress bars
- Completion percentages

### 3. 👤 Character Tab (Profile & Stats)
- Player avatar with level badge
- Global XP bar
- Stat cards (Streak, Completed, Total Quests, Multiplier)
- **Radar Charts** for:
  - 💪 Strength (Physical habits)
  - 🧠 Intelligence (Mental habits)
  - 🎯 Discipline (Consistency habits)

---

## 🔒 Privacy & Data

### 100% Offline & Private

- ✅ All data stored locally on your device
- ✅ No server communication
- ✅ No analytics or tracking
- ✅ No advertisements
- ✅ No account required
- ✅ Open source code

### Data Location

Your data is stored in browser `localStorage`:
- Habits configuration
- Daily completion logs
- Player profile (name, level, XP)
- Notification preferences

### Data Management

- **Export Data**: Coming soon
- **Reset All Data**: Settings → Reset All Data
- **Uninstall**: Removes all local data

---

## 🛠️ Troubleshooting

### Notifications Not Working

1. Check app permissions in Android Settings
2. Ensure **Notifications** are enabled
3. Disable battery optimization for StatMaxer
4. Restart the app

### Alarms Not Triggering

1. Grant **Wake Lock** permission
2. Disable **Battery Saver** mode
3. Add StatMaxer to **Protected Apps** (Xiaomi/Huawei)
4. Check that alarm times are set correctly

### Data Not Saving

1. Ensure sufficient storage space
2. Check browser/app permissions
3. Try clearing app cache (Settings → Apps → StatMaxer → Clear Cache)
4. Reinstall the app (data will be lost)

### APK Installation Blocked

1. Enable **Unknown Sources** in Settings
2. If using Chrome, allow installations from Chrome
3. Try downloading with a different browser
4. Disable Play Protect temporarily

---

## 🚀 Advanced Features

### Default Habits

StatMaxer includes 10 pre-configured habits:
- 🌅 Wake up 6AM
- ⏰ No Snoozing
- 💧 3L Water
- 🏋️ Gym
- 🧘 Stretching
- 📚 Read 10 Pages
- 🧘 Meditation
- 💻 Study 1 Hour
- ✨ Skincare
- 💰 Track Expenses

You can edit or delete these as needed.

### Customization

- **Player Name**: Settings → Player Profile
- **Habit Icons**: 16+ emoji options
- **XP Values**: 1-100 XP per habit
- **Categories**: Strength, Intelligence, Discipline

---

## 📞 Support & Feedback

- **GitHub Issues**: [Report bugs or request features](https://github.com/HyperPenetrator02/daily-tracker/issues)
- **Privacy Policy**: [Read our privacy policy](PRIVACY_POLICY.md)
- **Source Code**: [View on GitHub](https://github.com/HyperPenetrator02/daily-tracker)

---

## 📜 License

StatMaxer RPG OS is open source and free to use.

---

**Start your journey today and level up your life! ⚡🎮**
