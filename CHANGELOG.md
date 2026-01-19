# Changelog

All notable changes to StatMaxer RPG OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-01-19

### 🎉 Initial Release

#### Added
- **Three Core Views**
  - Quest Log with daily habit cards
  - Stat Matrix with 31-column tracking grid
  - Character Tab with profile and radar charts

- **Gamification System**
  - XP calculation: `XP_total = Σ(CompletedTasks × XP_value)`
  - Level formula: `Level = ⌊√(XP_total / 100)⌋ + 1`
  - Streak tracking with consecutive day counting
  - 1.5x XP multiplier for streaks ≥ 3 days

- **Hardcore Alarm System**
  - Soft alarms (standard notifications)
  - Hardcore alarms (persistent vibration + high-priority)
  - Snooze penalty (-5 XP)
  - 15-minute grace period

- **UI/UX Features**
  - Dark mode theme (#121212)
  - Neon accents (#3A86FF, #00FFC2)
  - JetBrains Mono typography
  - Responsive mobile-first design
  - Sidebar navigation
  - Modal dialogs
  - Neon glow animations
  - Shimmer effects on progress bars

- **Habit Management**
  - Create custom habits
  - 16+ emoji icons
  - Category system (Strength/Intelligence/Discipline)
  - XP rewards (1-100)
  - Monthly goals (1-31 days)
  - Alarm scheduling
  - Hardcore mode toggle

- **Default Habits** (Pre-loaded)
  - Wake up 6AM
  - No Snoozing
  - 3L Water
  - Gym
  - Stretching
  - Read 10 Pages
  - Meditation
  - Study 1 Hour
  - Skincare
  - Track Expenses

- **Data Management**
  - LocalStorage persistence
  - Player name customization
  - Reset all data option

- **PWA Features**
  - Service worker for offline support
  - Manifest for "Add to Home Screen"
  - Icon files (192x192, 512x512)
  - Offline caching

- **Android Support**
  - Capacitor configuration
  - Required permissions setup
  - GitHub Actions workflow for automated APK builds

- **Radar Charts**
  - Chart.js integration
  - Strength attribute visualization
  - Intelligence attribute visualization
  - Discipline attribute visualization

- **Documentation**
  - README.md with full feature list
  - INSTALLATION.md for Android setup
  - PRIVACY_POLICY.md (100% offline)
  - DEPLOYMENT.md for deployment guide
  - PROJECT_SUMMARY.md for overview
  - QUICK_REFERENCE.md for daily use

#### Technical Details
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: Chart.js 4.4.1
- **PWA**: Service Worker + Manifest
- **Android**: Capacitor 5.x
- **Build**: GitHub Actions
- **Deployment**: GitHub Pages

#### Privacy & Security
- 100% offline operation
- No server communication
- No analytics or tracking
- No advertisements
- No account required
- All data stored locally
- Open source code

---

## [Unreleased]

### Planned Features
- [ ] Data export/import functionality
- [ ] Cloud backup (optional)
- [ ] Multi-language support
- [ ] Custom theme editor
- [ ] Achievement system
- [ ] Social features (optional)
- [ ] Weekly/monthly reports
- [ ] Habit templates
- [ ] Custom categories
- [ ] Dark/light mode toggle

### Known Issues
- None reported

---

## Version History

- **1.0.0** (2026-01-19) - Initial release

---

## Upgrade Guide

### From Nothing to 1.0.0
This is the initial release. Simply:
1. Visit https://hyperpenetrator02.github.io/daily-tracker/
2. Or download APK from Releases
3. Start using immediately!

---

## Breaking Changes

None (initial release)

---

## Deprecations

None (initial release)

---

## Security Updates

None required (100% offline, no backend)

---

## Contributors

- **HyperPenetrator02** - Project creator and maintainer

---

## Support

For issues, questions, or feature requests:
- GitHub Issues: https://github.com/HyperPenetrator02/daily-tracker/issues
- Documentation: [README.md](README.md)

---

**Keep leveling up! ⚡🎮**
