# StatMaxer: Life Gamification Dashboard

A cyberpunk-minimalist habit tracking dashboard that gamifies your daily routines with XP progression, visual stat bars, and a monthly tracking matrix.

## 🎮 Features

- **Habit Tracking**: Create custom habits with icons and monthly goals
- **Daily Checkboxes**: Track completion for each day of the month with a horizontal scrolling carousel
- **Real-time Progress**: Dynamic stat bars that fill as you complete tasks
- **XP System**: Earn XP based on completion percentage `(TotalCompleted / GoalValue) * 100`
- **Player Level**: Aggregated level bar showing overall progress across all habits
- **Streak Counter**: Track your longest consecutive completion streak
- **localStorage Persistence**: All data saved locally in your browser
- **Cyberpunk Theme**: Dark mode with neon blue accents and smooth animations
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Quick Start

1. Open `index.html` in your web browser
2. Click "Create First Habit" or the "+ Add Habit" button
3. Fill in the habit details:
   - **Name**: e.g., "Gym Workout"
   - **Icon**: Choose from 12 preset emojis
   - **Monthly Goal**: Target days (1-31)
4. Click checkboxes to mark days as complete
5. Watch your progress bars and XP grow!

### Navigation

- **📊 Daily Stats**: Main tracking view with all habits
- **🌳 Skill Trees**: Coming soon feature
- **⚙️ Settings**: Customize player name and manage data

## 🎨 Design

### Color Palette
- **Background**: `#121212` (Dark)
- **Accent**: `#3A86FF` (Neon Blue)
- **Text**: `#E0E0E0` (Light Gray)
- **Success**: `#06FFA5` (Neon Green)
- **Warning**: `#FFD60A` (Yellow)
- **Danger**: `#FF006E` (Pink)

### Typography
- **Font**: JetBrains Mono (Monospaced for hacker/gamer aesthetic)

### Effects
- Neon glow on interactive elements
- Smooth transitions and animations
- Glassmorphism cards
- Shimmer effect on progress bars

## 📊 How It Works

### Data Model
Each habit contains:
```javascript
{
  id: string,           // Unique identifier
  name: string,         // Habit name
  icon: string,         // Emoji icon
  goalValue: number,    // Monthly target days
  dailyLogs: {          // Completion tracking
    "2026-1-18": true,
    "2026-1-19": false,
    // ...
  }
}
```

### XP Calculation
- **Habit XP**: `(CompletedDays / GoalValue) * 100`
- **Total XP**: Sum of all habit XP values
- **Player Level**: `Math.floor(TotalXP / 100) + 1`
- **Level Progress**: `TotalXP % 100`

### Weekly Reset
- Checks every Sunday if you want to reset weekly progress
- Overall stats and level are preserved
- Customizable reset logic in `app.js`

## 🛠️ Technical Details

### File Structure
```
Daily Tracker/
├── index.html      # Main HTML structure
├── styles.css      # Cyberpunk theme & styling
├── app.js          # Application logic
└── README.md       # This file
```

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Edge, Safari)
- Requires JavaScript enabled
- Uses localStorage API
- CSS Grid and Flexbox layouts

### Data Storage
All data is stored in `localStorage`:
- `statmaxer_habits`: Array of habit objects
- `statmaxer_player_name`: Custom player name
- `statmaxer_last_reset`: Last weekly reset date

## 🎯 Usage Tips

1. **Set Realistic Goals**: Start with achievable targets (e.g., 20 days instead of 31)
2. **Use Visual Icons**: Choose icons that resonate with each habit
3. **Check Daily**: Make it a routine to update your dashboard each day
4. **Track Streaks**: Use the streak counter as motivation
5. **Customize Name**: Set your player name in Settings for personalization

## 🔧 Customization

### Adding More Icons
Edit `index.html` line 177-188 to add more icon options:
```html
<button type="button" class="icon-option" data-icon="🎯">🎯</button>
```

### Changing Colors
Edit CSS variables in `styles.css` line 10-20:
```css
--accent-primary: #3A86FF;  /* Change to your preferred color */
```

### Modifying XP Formula
Edit `getProgress()` method in `app.js` line 63-68:
```javascript
getProgress(habitId) {
  const habit = this.habits.find(h => h.id === habitId);
  if (!habit) return 0;
  
  const completed = this.getCompletedDays(habitId);
  return Math.min((completed / habit.goalValue) * 100, 100);
}
```

## 🐛 Troubleshooting

**Data not saving?**
- Ensure JavaScript is enabled
- Check browser console for errors
- Verify localStorage is not disabled

**Checkboxes not responding?**
- Refresh the page
- Clear browser cache
- Check console for JavaScript errors

**Reset all data:**
- Go to Settings → Reset All Data
- Or clear localStorage manually in browser DevTools

## 📝 License

Free to use and modify for personal projects.

## 🎮 Level Up Your Life!

Start tracking your habits today and watch yourself level up! 🚀✨
