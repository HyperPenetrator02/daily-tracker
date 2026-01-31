# 🔔 StatMaxer Alarm System Documentation

## Overview
StatMaxer features a **robust, hardcore alarm system** designed to help you build discipline through gamified notifications and penalties.

## Features

### ✅ Core Alarm Functionality
- **Daily Repeating Alarms**: Set alarms that automatically repeat every day
- **Native Android Support**: Full integration with Capacitor LocalNotifications for APK builds
- **Web Fallback**: Browser-based notifications for web version
- **Persistent Scheduling**: Alarms survive app restarts and device reboots (native mode)

### 💀 Hardcore Mode
When enabled for a habit:
- **No Snooze Allowed**: Attempting to snooze applies -5 XP penalty WITHOUT snoozing
- **Persistent Notifications**: Cannot be dismissed until completed (Android)
- **Maximum Priority**: Highest importance level for system notifications
- **Enhanced Vibration**: Longer, more intense vibration pattern (500ms pulses)
- **Ongoing Notification**: Stays in notification tray until addressed

### 😴 Snooze System
For regular (non-hardcore) alarms:
- **10-Minute Snooze**: Delays alarm by 10 minutes
- **XP Penalty**: -5 XP deducted per snooze
- **Tracked Penalties**: Total snooze penalties displayed in Character view
- **Toast Feedback**: Visual confirmation of snooze action

### 📱 Notification Actions
Each alarm notification includes action buttons:

**Regular Mode:**
- ✅ **Complete**: Marks habit as done for today, awards XP
- 😴 **Snooze (-5 XP)**: Delays alarm 10 minutes, deducts 5 XP

**Hardcore Mode:**
- ✅ **Complete Quest**: Only option available (no snooze)

## How It Works

### Setting Up Alarms

1. **Create/Edit a Habit**:
   - Click "New Quest" or "Add Habit"
   - Fill in habit details
   - Set "Alarm Time" (optional)
   - Enable "Hardcore Alarm" for strict enforcement
   - Click "Create Habit"

2. **Permission Request**:
   - First interaction requests notification permission
   - Must be granted for alarms to function
   - Native app: System notification settings
   - Web: Browser notification permission

3. **Automatic Scheduling**:
   - Alarms schedule automatically when habit is created
   - Re-schedule daily at the specified time
   - Persist across app restarts (native mode)

### Alarm Behavior

#### When Alarm Triggers:
1. **Notification appears** with habit name and mode indicator
2. **Vibration pattern** plays (intense for hardcore)
3. **Action buttons** displayed based on mode
4. **Sound** plays (system default)

#### User Actions:
- **Tap "Complete"**: 
  - Marks habit complete for today
  - Awards XP based on habit value
  - Updates streak counter
  - Shows success toast
  
- **Tap "Snooze"** (regular mode only):
  - Deducts 5 XP immediately
  - Reschedules alarm for 10 minutes later
  - Shows snooze confirmation toast
  
- **Tap "Snooze"** (hardcore mode):
  - Deducts 5 XP as penalty
  - Does NOT snooze (alarm stays active)
  - Shows denial notification
  - Enforces discipline!

### Technical Implementation

#### Native (Android APK):
```javascript
- Plugin: @capacitor/local-notifications
- Channel: statmaxer-alarms
- Importance: 4 (high) or 5 (max for hardcore)
- Priority: 1 (high) or 2 (max for hardcore)
- Schedule: Daily repeating at specified time
- Actions: Complete / Snooze (or Complete only for hardcore)
```

#### Web (Browser):
```javascript
- API: Notification API + Service Worker
- Fallback: setTimeout-based scheduling
- Actions: Handled via Service Worker
- Persistence: Re-scheduled on page load
```

### Snooze Penalty Tracking

Penalties are stored in `localStorage`:
```javascript
Key: 'statmaxer_snooze_penalty'
Value: Total XP deducted from snoozing
Display: Character view → "Snooze Penalties" stat
```

## Best Practices

### For Maximum Effectiveness:
1. **Use Hardcore Mode** for critical habits (wake up time, no snoozing)
2. **Set Realistic Times** that you can actually commit to
3. **Review Penalties** regularly in Character view
4. **Grant Permissions** immediately for reliable alarms
5. **Keep App Installed** (native) or browser tab open (web)

### Recommended Hardcore Habits:
- 🌅 Wake up time
- ⏰ No snoozing
- 🧘 Morning meditation
- 💤 Bedtime routine

### Recommended Regular Habits:
- 💧 Water intake
- 📚 Reading
- 💻 Study sessions
- ✨ Skincare

## Troubleshooting

### Alarms Not Firing:

**Native (APK):**
- Check notification permissions in system settings
- Ensure battery optimization is disabled for StatMaxer
- Verify "Allow while idle" is enabled
- Check Do Not Disturb settings

**Web:**
- Grant browser notification permission
- Keep at least one tab open
- Check browser notification settings
- Ensure service worker is registered

### Snooze Not Working:
- Verify habit is NOT in hardcore mode
- Check console for error messages
- Ensure notification actions are supported
- Try re-creating the habit

### Penalties Not Tracking:
- Check browser localStorage is enabled
- Verify service worker is active
- Check Character view for penalty display
- Clear cache and reload if needed

## XP System Integration

### XP Calculation:
```
Total XP = Σ(Completed Habits × XP Value) - Snooze Penalties
```

### Level Calculation:
```
Level = ⌊√(Total XP / 100)⌋ + 1
```

### Snooze Impact:
- Each snooze: -5 XP
- Visible in Character stats
- Affects overall level progress
- Encourages discipline

## Future Enhancements

Planned features for v2.0:
- 🔊 Custom alarm sounds
- 📈 Snooze statistics and trends
- 🎯 Snooze limits per habit
- ⏰ Multiple alarms per habit
- 🌙 Smart snooze (adaptive timing)
- 📊 Alarm effectiveness analytics

## Support

For issues or questions:
- Check console logs (F12 → Console)
- Review notification permissions
- Test with a simple habit first
- Report bugs via GitHub Issues

---

**Remember**: The alarm system is designed to build discipline, not comfort. Embrace the challenge! 💪⚡
