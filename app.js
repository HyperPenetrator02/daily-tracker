// ========================================
// StatMaxer: Life Gamification Dashboard
// ========================================

// === Data Model ===
class HabitManager {
    constructor() {
        this.habits = this.loadHabits();
        this.currentMonth = new Date();
        this.daysInMonth = new Date(
            this.currentMonth.getFullYear(),
            this.currentMonth.getMonth() + 1,
            0
        ).getDate();
    }

    loadHabits() {
        const stored = localStorage.getItem('statmaxer_habits');
        return stored ? JSON.parse(stored) : [];
    }

    saveHabits() {
        localStorage.setItem('statmaxer_habits', JSON.stringify(this.habits));
    }

    addHabit(name, icon, goalValue) {
        const habit = {
            id: Date.now().toString(),
            name,
            icon,
            goalValue: parseInt(goalValue),
            dailyLogs: {}
        };
        this.habits.push(habit);
        this.saveHabits();
        return habit;
    }

    deleteHabit(id) {
        this.habits = this.habits.filter(h => h.id !== id);
        this.saveHabits();
    }

    toggleDay(habitId, day) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;

        const dateKey = this.getDateKey(day);
        habit.dailyLogs[dateKey] = !habit.dailyLogs[dateKey];
        this.saveHabits();
    }

    isDayChecked(habitId, day) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return false;

        const dateKey = this.getDateKey(day);
        return habit.dailyLogs[dateKey] || false;
    }

    getDateKey(day) {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        return `${year}-${month + 1}-${day}`;
    }

    getCompletedDays(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return 0;

        return Object.values(habit.dailyLogs).filter(Boolean).length;
    }

    getProgress(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return 0;

        const completed = this.getCompletedDays(habitId);
        return Math.min((completed / habit.goalValue) * 100, 100);
    }

    getTotalXP() {
        return this.habits.reduce((total, habit) => {
            const completed = this.getCompletedDays(habit.id);
            return total + Math.floor((completed / habit.goalValue) * 100);
        }, 0);
    }

    getPlayerLevel() {
        const totalXP = this.getTotalXP();
        return Math.floor(totalXP / 100) + 1;
    }

    getLevelProgress() {
        const totalXP = this.getTotalXP();
        return totalXP % 100;
    }

    getStreak() {
        // Calculate longest streak across all habits
        let maxStreak = 0;
        const today = new Date();
        
        this.habits.forEach(habit => {
            let currentStreak = 0;
            let checkDate = new Date(today);
            
            while (true) {
                const day = checkDate.getDate();
                const dateKey = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${day}`;
                
                if (habit.dailyLogs[dateKey]) {
                    currentStreak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
            
            maxStreak = Math.max(maxStreak, currentStreak);
        });
        
        return maxStreak;
    }

    resetAllData() {
        this.habits = [];
        this.saveHabits();
        localStorage.removeItem('statmaxer_player_name');
    }
}

// === UI Manager ===
class UIManager {
    constructor(habitManager) {
        this.habitManager = habitManager;
        this.currentView = 'daily';
        this.deleteHabitId = null;
        this.initializeElements();
        this.attachEventListeners();
        this.render();
    }

    initializeElements() {
        // Navigation
        this.navItems = document.querySelectorAll('.nav-item');
        this.views = {
            daily: document.getElementById('daily-view'),
            skills: document.getElementById('skills-view'),
            settings: document.getElementById('settings-view')
        };

        // Header
        this.playerNameEl = document.querySelector('.player-name');
        this.streakCountEl = document.getElementById('streak-count');
        this.totalXPEl = document.getElementById('total-xp');
        this.playerLevelEl = document.getElementById('player-level');
        this.levelBarFillEl = document.getElementById('level-bar-fill');
        this.levelPercentageEl = document.getElementById('level-percentage');

        // Tracking
        this.currentMonthEl = document.getElementById('current-month');
        this.daysHeaderEl = document.getElementById('days-header');
        this.habitsContainerEl = document.getElementById('habits-container');
        this.emptyStateEl = document.getElementById('empty-state');

        // Modals
        this.addHabitModal = document.getElementById('add-habit-modal');
        this.deleteModal = document.getElementById('delete-modal');
        this.habitForm = document.getElementById('habit-form');

        // Form inputs
        this.habitNameInput = document.getElementById('habit-name');
        this.habitIconInput = document.getElementById('habit-icon');
        this.habitGoalInput = document.getElementById('habit-goal');
        this.iconPicker = document.getElementById('icon-picker');

        // Settings
        this.playerNameInput = document.getElementById('player-name-input');
    }

    attachEventListeners() {
        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.dataset.view;
                this.switchView(view);
            });
        });

        // Add habit buttons
        document.getElementById('add-habit-btn').addEventListener('click', () => {
            this.openAddHabitModal();
        });
        document.getElementById('empty-add-btn').addEventListener('click', () => {
            this.openAddHabitModal();
        });

        // Modal controls
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeAddHabitModal();
        });
        document.getElementById('cancel-habit').addEventListener('click', () => {
            this.closeAddHabitModal();
        });

        // Icon picker
        this.iconPicker.querySelectorAll('.icon-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.iconPicker.querySelectorAll('.icon-option').forEach(b => {
                    b.classList.remove('selected');
                });
                btn.classList.add('selected');
                this.habitIconInput.value = btn.dataset.icon;
            });
        });

        // Form submission
        this.habitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createHabit();
        });

        // Delete modal
        document.getElementById('cancel-delete').addEventListener('click', () => {
            this.closeDeleteModal();
        });
        document.getElementById('confirm-delete').addEventListener('click', () => {
            this.confirmDelete();
        });

        // Settings
        this.playerNameInput.addEventListener('change', () => {
            this.savePlayerName();
        });
        document.getElementById('reset-data-btn').addEventListener('click', () => {
            this.resetData();
        });

        // Close modals on overlay click
        this.addHabitModal.addEventListener('click', (e) => {
            if (e.target === this.addHabitModal) {
                this.closeAddHabitModal();
            }
        });
        this.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) {
                this.closeDeleteModal();
            }
        });
    }

    switchView(view) {
        this.currentView = view;
        
        // Update navigation
        this.navItems.forEach(item => {
            if (item.dataset.view === view) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update views
        Object.keys(this.views).forEach(key => {
            if (key === view) {
                this.views[key].classList.remove('hidden');
            } else {
                this.views[key].classList.add('hidden');
            }
        });
    }

    openAddHabitModal() {
        this.addHabitModal.classList.remove('hidden');
        this.habitNameInput.focus();
    }

    closeAddHabitModal() {
        this.addHabitModal.classList.add('hidden');
        this.habitForm.reset();
        this.iconPicker.querySelector('.icon-option').classList.add('selected');
        this.habitIconInput.value = '🏋️';
    }

    createHabit() {
        const name = this.habitNameInput.value.trim();
        const icon = this.habitIconInput.value;
        const goal = this.habitGoalInput.value;

        if (!name) return;

        this.habitManager.addHabit(name, icon, goal);
        this.closeAddHabitModal();
        this.render();
    }

    openDeleteModal(habitId, habitName) {
        this.deleteHabitId = habitId;
        document.getElementById('delete-habit-name').textContent = habitName;
        this.deleteModal.classList.remove('hidden');
    }

    closeDeleteModal() {
        this.deleteModal.classList.add('hidden');
        this.deleteHabitId = null;
    }

    confirmDelete() {
        if (this.deleteHabitId) {
            this.habitManager.deleteHabit(this.deleteHabitId);
            this.closeDeleteModal();
            this.render();
        }
    }

    savePlayerName() {
        const name = this.playerNameInput.value.trim() || 'Player_One';
        localStorage.setItem('statmaxer_player_name', name);
        this.playerNameEl.textContent = name;
    }

    loadPlayerName() {
        const name = localStorage.getItem('statmaxer_player_name') || 'Player_One';
        this.playerNameEl.textContent = name;
        this.playerNameInput.value = name;
    }

    resetData() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            this.habitManager.resetAllData();
            this.render();
            this.playerNameInput.value = 'Player_One';
            this.loadPlayerName();
        }
    }

    render() {
        this.renderHeader();
        this.renderDaysHeader();
        this.renderHabits();
        this.loadPlayerName();
    }

    renderHeader() {
        // Update stats
        this.streakCountEl.textContent = this.habitManager.getStreak();
        this.totalXPEl.textContent = this.habitManager.getTotalXP();
        this.playerLevelEl.textContent = this.habitManager.getPlayerLevel();

        // Update level bar
        const levelProgress = this.habitManager.getLevelProgress();
        this.levelBarFillEl.style.width = `${levelProgress}%`;
        this.levelPercentageEl.textContent = `${levelProgress}%`;

        // Update current month
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[this.habitManager.currentMonth.getMonth()];
        const year = this.habitManager.currentMonth.getFullYear();
        this.currentMonthEl.textContent = `${monthName} ${year}`;
    }

    renderDaysHeader() {
        this.daysHeaderEl.innerHTML = '';
        const today = new Date().getDate();
        const currentMonth = new Date().getMonth();
        const displayMonth = this.habitManager.currentMonth.getMonth();

        for (let day = 1; day <= this.habitManager.daysInMonth; day++) {
            const dayLabel = document.createElement('div');
            dayLabel.className = 'day-label';
            dayLabel.textContent = day;
            
            if (day === today && currentMonth === displayMonth) {
                dayLabel.style.color = 'var(--warning)';
                dayLabel.style.fontWeight = '700';
            }
            
            this.daysHeaderEl.appendChild(dayLabel);
        }
    }

    renderHabits() {
        const habits = this.habitManager.habits;

        if (habits.length === 0) {
            this.emptyStateEl.classList.remove('hidden');
            this.habitsContainerEl.innerHTML = '';
            return;
        }

        this.emptyStateEl.classList.add('hidden');
        this.habitsContainerEl.innerHTML = '';

        habits.forEach(habit => {
            const habitRow = this.createHabitRow(habit);
            this.habitsContainerEl.appendChild(habitRow);
        });
    }

    createHabitRow(habit) {
        const row = document.createElement('div');
        row.className = 'habit-row';

        // Habit info
        const habitInfo = document.createElement('div');
        habitInfo.className = 'habit-info';
        habitInfo.innerHTML = `
            <div class="habit-icon">${habit.icon}</div>
            <div class="habit-details">
                <div class="habit-name">${habit.name}</div>
                <div class="habit-goal">
                    Goal: <span class="habit-goal-value">${habit.goalValue}</span> days
                </div>
            </div>
        `;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'habit-delete';
        deleteBtn.innerHTML = '×';
        deleteBtn.addEventListener('click', () => {
            this.openDeleteModal(habit.id, habit.name);
        });

        // Days checkboxes
        const habitDays = document.createElement('div');
        habitDays.className = 'habit-days';

        const today = new Date().getDate();
        const currentMonth = new Date().getMonth();
        const displayMonth = this.habitManager.currentMonth.getMonth();

        for (let day = 1; day <= this.habitManager.daysInMonth; day++) {
            const checkbox = document.createElement('div');
            checkbox.className = 'day-checkbox';
            
            if (this.habitManager.isDayChecked(habit.id, day)) {
                checkbox.classList.add('checked');
            }
            
            if (day === today && currentMonth === displayMonth) {
                checkbox.classList.add('today');
            }

            checkbox.addEventListener('click', () => {
                this.habitManager.toggleDay(habit.id, day);
                checkbox.classList.toggle('checked');
                this.updateStatBar(habit.id, statBar);
                this.renderHeader();
            });

            habitDays.appendChild(checkbox);
        }

        // Stat bar
        const statBar = this.createStatBar(habit);

        row.appendChild(habitInfo);
        row.appendChild(deleteBtn);
        row.appendChild(habitDays);
        row.appendChild(statBar);

        return row;
    }

    createStatBar(habit) {
        const statContainer = document.createElement('div');
        statContainer.className = 'habit-stat';

        const progress = this.habitManager.getProgress(habit.id);
        const completed = this.habitManager.getCompletedDays(habit.id);

        statContainer.innerHTML = `
            <div class="stat-bar-container">
                <div class="stat-bar-fill" style="width: ${progress}%"></div>
            </div>
            <div class="stat-text">
                <span class="stat-percentage">${Math.round(progress)}%</span>
                (${completed}/${habit.goalValue})
            </div>
        `;

        return statContainer;
    }

    updateStatBar(habitId, statBar) {
        const progress = this.habitManager.getProgress(habitId);
        const completed = this.habitManager.getCompletedDays(habitId);
        const habit = this.habitManager.habits.find(h => h.id === habitId);

        const fill = statBar.querySelector('.stat-bar-fill');
        const text = statBar.querySelector('.stat-text');

        fill.style.width = `${progress}%`;
        text.innerHTML = `
            <span class="stat-percentage">${Math.round(progress)}%</span>
            (${completed}/${habit.goalValue})
        `;
    }
}

// === Weekly Reset Logic ===
class ResetManager {
    constructor(habitManager, uiManager) {
        this.habitManager = habitManager;
        this.uiManager = uiManager;
        this.checkWeeklyReset();
    }

    checkWeeklyReset() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const lastReset = localStorage.getItem('statmaxer_last_reset');
        const todayStr = today.toDateString();

        // Check if it's Sunday (0) and we haven't reset today
        if (dayOfWeek === 0 && lastReset !== todayStr) {
            this.promptWeeklyReset();
        }
    }

    promptWeeklyReset() {
        const shouldReset = confirm(
            '🎮 New Week Started!\n\n' +
            'Would you like to reset your weekly progress?\n' +
            '(Your overall stats and level will be preserved)'
        );

        if (shouldReset) {
            this.performWeeklyReset();
        }

        localStorage.setItem('statmaxer_last_reset', new Date().toDateString());
    }

    performWeeklyReset() {
        // This is a placeholder for weekly reset logic
        // You can customize this based on your needs
        console.log('Weekly reset performed');
        this.uiManager.render();
    }
}

// === Initialize Application ===
document.addEventListener('DOMContentLoaded', () => {
    const habitManager = new HabitManager();
    const uiManager = new UIManager(habitManager);
    const resetManager = new ResetManager(habitManager, uiManager);

    // Make managers globally accessible for debugging
    window.statMaxer = {
        habitManager,
        uiManager,
        resetManager
    };

    console.log('%c⚡ StatMaxer Initialized', 'color: #3A86FF; font-size: 16px; font-weight: bold;');
    console.log('%cLevel up your life! 🎮', 'color: #06FFA5; font-size: 12px;');
});
