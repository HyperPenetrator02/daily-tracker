// ========================================
// StatMaxer RPG OS - Complete Application
// ========================================

// === Constants ===
const CATEGORIES = {
    strength: { name: 'Strength', icon: '💪', color: '#FF006E' },
    intelligence: { name: 'Intelligence', icon: '🧠', color: '#3A86FF' },
    discipline: { name: 'Discipline', icon: '🎯', color: '#06FFA5' }
};

const DEFAULT_HABITS = [
    { name: 'Wake up 6AM', icon: '🌅', category: 'discipline', xp: 15, alarm: '06:00', hardcore: true },
    { name: 'No Snoozing', icon: '⏰', category: 'discipline', xp: 10, alarm: '06:00', hardcore: true },
    { name: '3L Water', icon: '💧', category: 'strength', xp: 10, alarm: '', hardcore: false },
    { name: 'Gym', icon: '🏋️', category: 'strength', xp: 20, alarm: '07:00', hardcore: false },
    { name: 'Stretching', icon: '🧘', category: 'strength', xp: 10, alarm: '', hardcore: false },
    { name: 'Read 10 Pages', icon: '📚', category: 'intelligence', xp: 15, alarm: '21:00', hardcore: false },
    { name: 'Meditation', icon: '🧘', category: 'discipline', xp: 15, alarm: '06:30', hardcore: false },
    { name: 'Study 1 Hour', icon: '💻', category: 'intelligence', xp: 20, alarm: '', hardcore: false },
    { name: 'Skincare', icon: '✨', category: 'discipline', xp: 10, alarm: '22:00', hardcore: false },
    { name: 'Track Expenses', icon: '💰', category: 'intelligence', xp: 10, alarm: '', hardcore: false }
];

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
        this.initializeDefaultHabits();
    }

    initializeDefaultHabits() {
        if (this.habits.length === 0) {
            DEFAULT_HABITS.forEach(habit => {
                this.addHabit(
                    habit.name,
                    habit.icon,
                    habit.category,
                    habit.xp,
                    30,
                    habit.alarm,
                    habit.hardcore
                );
            });
        }
    }

    loadHabits() {
        const stored = localStorage.getItem('statmaxer_habits');
        return stored ? JSON.parse(stored) : [];
    }

    saveHabits() {
        localStorage.setItem('statmaxer_habits', JSON.stringify(this.habits));
    }

    addHabit(name, icon, category, xpReward, goalValue, alarmTime, hardcoreAlarm) {
        const habit = {
            id: Date.now().toString(),
            name,
            icon,
            category,
            xpReward: parseInt(xpReward),
            goalValue: parseInt(goalValue),
            alarmTime: alarmTime || '',
            hardcoreAlarm: hardcoreAlarm || false,
            dailyLogs: {},
            isActive: true
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
        const wasChecked = habit.dailyLogs[dateKey] || false;
        habit.dailyLogs[dateKey] = !wasChecked;
        this.saveHabits();

        return !wasChecked; // Return new state
    }

    isDayChecked(habitId, day) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return false;

        const dateKey = this.getDateKey(day);
        return habit.dailyLogs[dateKey] || false;
    }

    isTodayChecked(habitId) {
        const today = new Date().getDate();
        return this.isDayChecked(habitId, today);
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

    // XP Algorithm: XP_total = Σ(CompletedTasks × XP_value)
    getTotalXP() {
        return this.habits.reduce((total, habit) => {
            const completed = this.getCompletedDays(habit.id);
            return total + (completed * habit.xpReward);
        }, 0);
    }

    // Level Logic: Level = ⌊√(XP_total / 100)⌋ + 1
    getPlayerLevel() {
        const totalXP = this.getTotalXP();
        return Math.floor(Math.sqrt(totalXP / 100)) + 1;
    }

    getLevelProgress() {
        const totalXP = this.getTotalXP();
        const currentLevel = this.getPlayerLevel();
        const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
        const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
        const xpInCurrentLevel = totalXP - xpForCurrentLevel;
        const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;

        return Math.floor((xpInCurrentLevel / xpNeededForLevel) * 100);
    }

    getXPForNextLevel() {
        const currentLevel = this.getPlayerLevel();
        return Math.pow(currentLevel, 2) * 100;
    }

    // Streak Engine: Count consecutive true values
    getStreak() {
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

    // XP Multiplier: 1.5x if streak >= 3
    getXPMultiplier() {
        const streak = this.getStreak();
        return streak >= 3 ? 1.5 : 1.0;
    }

    // Category Stats for Radar Charts
    getCategoryStats() {
        const stats = {
            strength: 0,
            intelligence: 0,
            discipline: 0
        };

        this.habits.forEach(habit => {
            const completed = this.getCompletedDays(habit.id);
            const categoryXP = completed * habit.xpReward;
            stats[habit.category] += categoryXP;
        });

        return stats;
    }

    getTotalCompleted() {
        return this.habits.reduce((total, habit) => {
            return total + this.getCompletedDays(habit.id);
        }, 0);
    }

    resetAllData() {
        this.habits = [];
        this.saveHabits();
        localStorage.removeItem('statmaxer_player_name');
        localStorage.removeItem('statmaxer_snooze_penalty');
    }
}

// === Notification Manager ===
class NotificationManager {
    constructor(habitManager) {
        this.habitManager = habitManager;
        this.notificationPermission = 'default';
        this.scheduledAlarms = new Map();
    }

    async requestPermission() {
        if ('Notification' in window) {
            this.notificationPermission = await Notification.requestPermission();
            return this.notificationPermission === 'granted';
        }
        return false;
    }

    scheduleAlarms() {
        // Clear existing alarms
        this.scheduledAlarms.forEach(timeout => clearTimeout(timeout));
        this.scheduledAlarms.clear();

        this.habitManager.habits.forEach(habit => {
            if (habit.alarmTime && habit.isActive) {
                this.scheduleAlarm(habit);
            }
        });
    }

    scheduleAlarm(habit) {
        const [hours, minutes] = habit.alarmTime.split(':').map(Number);
        const now = new Date();
        const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

        if (alarmTime < now) {
            alarmTime.setDate(alarmTime.getDate() + 1);
        }

        const timeUntilAlarm = alarmTime - now;

        const timeout = setTimeout(() => {
            this.triggerAlarm(habit);
        }, timeUntilAlarm);

        this.scheduledAlarms.set(habit.id, timeout);
    }

    async triggerAlarm(habit) {
        if (this.notificationPermission !== 'granted') {
            await this.requestPermission();
        }

        const options = {
            body: `Time to complete: ${habit.name}`,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            vibrate: habit.hardcoreAlarm ? [200, 100, 200, 100, 200] : [200, 100, 200],
            requireInteraction: habit.hardcoreAlarm,
            tag: `habit-${habit.id}`,
            actions: [
                { action: 'complete', title: 'Complete' },
                { action: 'snooze', title: 'Snooze (-5 XP)' }
            ]
        };

        if (habit.hardcoreAlarm) {
            options.body += '\n💀 HARDCORE MODE - No snoozing!';
        }

        const notification = new Notification(`⚔️ Quest: ${habit.name}`, options);

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        // Reschedule for next day
        this.scheduleAlarm(habit);
    }

    applySnoozePenalty() {
        const currentPenalty = parseInt(localStorage.getItem('statmaxer_snooze_penalty') || '0');
        localStorage.setItem('statmaxer_snooze_penalty', (currentPenalty + 5).toString());
    }

    getSnoozePenalty() {
        return parseInt(localStorage.getItem('statmaxer_snooze_penalty') || '0');
    }
}

// === Radar Chart Manager ===
class RadarChartManager {
    constructor(habitManager) {
        this.habitManager = habitManager;
        this.charts = {};
    }

    createRadarChart(canvasId, label, value, color) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Destroy existing chart
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Consistency', 'Progress', 'XP Earned', 'Completion', 'Dedication'],
                datasets: [{
                    label: label,
                    data: [
                        Math.min(value / 10, 100),
                        Math.min(value / 8, 100),
                        Math.min(value / 5, 100),
                        Math.min(value / 12, 100),
                        Math.min(value / 7, 100)
                    ],
                    backgroundColor: `${color}33`,
                    borderColor: color,
                    borderWidth: 2,
                    pointBackgroundColor: color,
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: color
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            color: '#A0A0A0',
                            backdropColor: 'transparent'
                        },
                        grid: {
                            color: '#242424'
                        },
                        pointLabels: {
                            color: '#E0E0E0',
                            font: {
                                family: 'JetBrains Mono',
                                size: 11
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    updateCharts() {
        const stats = this.habitManager.getCategoryStats();

        this.createRadarChart('strength-radar', 'Strength', stats.strength, '#FF006E');
        this.createRadarChart('intelligence-radar', 'Intelligence', stats.intelligence, '#3A86FF');
        this.createRadarChart('discipline-radar', 'Discipline', stats.discipline, '#06FFA5');

        // Update values
        document.getElementById('strength-value').textContent = Math.floor(stats.strength);
        document.getElementById('intelligence-value').textContent = Math.floor(stats.intelligence);
        document.getElementById('discipline-value').textContent = Math.floor(stats.discipline);
    }
}

// === UI Manager ===
class UIManager {
    constructor(habitManager, notificationManager, radarChartManager) {
        this.habitManager = habitManager;
        this.notificationManager = notificationManager;
        this.radarChartManager = radarChartManager;
        this.currentView = 'quests';
        this.deleteHabitId = null;
        this.initializeElements();
        this.attachEventListeners();
        this.render();
    }

    initializeElements() {
        // Navigation
        this.navItems = document.querySelectorAll('.nav-item');
        this.views = {
            quests: document.getElementById('quests-view'),
            matrix: document.getElementById('matrix-view'),
            character: document.getElementById('character-view'),
            settings: document.getElementById('settings-view')
        };

        // Header
        this.playerNameEl = document.querySelector('.player-name');
        this.streakCountEl = document.getElementById('streak-count');
        this.totalXPEl = document.getElementById('total-xp');
        this.playerLevelEl = document.getElementById('player-level');
        this.levelBarFillEl = document.getElementById('level-bar-fill');
        this.levelPercentageEl = document.getElementById('level-percentage');

        // Quest Log
        this.questCardsContainer = document.getElementById('quest-cards-container');
        this.questsEmptyState = document.getElementById('quests-empty-state');

        // Matrix
        this.currentMonthEl = document.getElementById('current-month');
        this.daysHeaderEl = document.getElementById('days-header');
        this.habitsContainerEl = document.getElementById('habits-container');
        this.matrixEmptyState = document.getElementById('matrix-empty-state');

        // Character
        this.charLevelBadge = document.getElementById('char-level-badge');
        this.charPlayerName = document.getElementById('char-player-name');
        this.charXPValue = document.getElementById('char-xp-value');
        this.charXPBar = document.getElementById('char-xp-bar');
        this.charStreak = document.getElementById('char-streak');
        this.charCompleted = document.getElementById('char-completed');
        this.charTotalQuests = document.getElementById('char-total-quests');
        this.charMultiplier = document.getElementById('char-multiplier');

        // Modals
        this.addHabitModal = document.getElementById('add-habit-modal');
        this.deleteModal = document.getElementById('delete-modal');
        this.habitForm = document.getElementById('habit-form');

        // Form inputs
        this.habitNameInput = document.getElementById('habit-name');
        this.habitCategoryInput = document.getElementById('habit-category');
        this.habitIconInput = document.getElementById('habit-icon');
        this.habitXPInput = document.getElementById('habit-xp');
        this.habitGoalInput = document.getElementById('habit-goal');
        this.habitAlarmInput = document.getElementById('habit-alarm');
        this.habitHardcoreInput = document.getElementById('habit-hardcore');
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
        const addButtons = ['add-quest-btn', 'add-habit-btn', 'empty-quest-btn', 'empty-add-btn'];
        addButtons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => this.openAddHabitModal());
            }
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

        // Request notification permission on first interaction
        document.addEventListener('click', () => {
            this.notificationManager.requestPermission();
        }, { once: true });
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
                if (key === 'character') {
                    // Update radar charts when switching to character view
                    setTimeout(() => this.radarChartManager.updateCharts(), 100);
                }
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
        const category = this.habitCategoryInput.value;
        const icon = this.habitIconInput.value;
        const xp = this.habitXPInput.value;
        const goal = this.habitGoalInput.value;
        const alarm = this.habitAlarmInput.value;
        const hardcore = this.habitHardcoreInput.checked;

        if (!name) return;

        this.habitManager.addHabit(name, icon, category, xp, goal, alarm, hardcore);
        this.notificationManager.scheduleAlarms();
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
        this.charPlayerName.textContent = name;
    }

    loadPlayerName() {
        const name = localStorage.getItem('statmaxer_player_name') || 'Player_One';
        this.playerNameEl.textContent = name;
        this.playerNameInput.value = name;
        this.charPlayerName.textContent = name;
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
        this.renderQuestLog();
        this.renderMatrix();
        this.renderCharacter();
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

    renderQuestLog() {
        const habits = this.habitManager.habits;

        if (habits.length === 0) {
            this.questsEmptyState.classList.remove('hidden');
            this.questCardsContainer.innerHTML = '';
            return;
        }

        this.questsEmptyState.classList.add('hidden');
        this.questCardsContainer.innerHTML = '';

        habits.forEach(habit => {
            const questCard = this.createQuestCard(habit);
            this.questCardsContainer.appendChild(questCard);
        });
    }

    createQuestCard(habit) {
        const card = document.createElement('div');
        card.className = 'quest-card';

        const isCompleted = this.habitManager.isTodayChecked(habit.id);
        const categoryInfo = CATEGORIES[habit.category];

        card.innerHTML = `
            <div class="quest-card-header">
                <div class="quest-icon-large">${habit.icon}</div>
                <div class="quest-info">
                    <div class="quest-name">${habit.name}</div>
                    <div class="quest-category">
                        ${categoryInfo.icon} ${categoryInfo.name}
                    </div>
                </div>
                <div class="quest-xp-badge">+${habit.xpReward} XP</div>
            </div>
            <div class="quest-actions">
                <button class="quest-check-btn ${isCompleted ? 'completed' : ''}" data-habit-id="${habit.id}">
                    <span>${isCompleted ? '✓ Completed' : 'Complete Quest'}</span>
                </button>
            </div>
            ${habit.alarmTime ? `
                <div class="quest-alarm-toggle">
                    <span>⏰ Alarm: <span class="quest-alarm-time">${habit.alarmTime}</span></span>
                    ${habit.hardcoreAlarm ? '<span class="hardcore-badge">💀 HARDCORE</span>' : ''}
                </div>
            ` : ''}
        `;

        // Add event listener to check button
        const checkBtn = card.querySelector('.quest-check-btn');
        checkBtn.addEventListener('click', () => {
            const today = new Date().getDate();
            const newState = this.habitManager.toggleDay(habit.id, today);
            checkBtn.classList.toggle('completed', newState);
            checkBtn.querySelector('span').textContent = newState ? '✓ Completed' : 'Complete Quest';
            this.renderHeader();
            this.renderCharacter();
        });

        return card;
    }

    renderMatrix() {
        this.renderDaysHeader();
        this.renderHabits();
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
            this.matrixEmptyState.classList.remove('hidden');
            this.habitsContainerEl.innerHTML = '';
            return;
        }

        this.matrixEmptyState.classList.add('hidden');
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
        const categoryInfo = CATEGORIES[habit.category];
        habitInfo.innerHTML = `
            <div class="habit-icon">${habit.icon}</div>
            <div class="habit-details">
                <div class="habit-name">${habit.name}</div>
                <div class="habit-goal">
                    ${categoryInfo.icon} ${categoryInfo.name} | Goal: <span class="habit-goal-value">${habit.goalValue}</span> days
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
                this.renderCharacter();
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

    renderCharacter() {
        // Update level badge
        this.charLevelBadge.textContent = this.habitManager.getPlayerLevel();

        // Update XP bar
        const totalXP = this.habitManager.getTotalXP();
        const nextLevelXP = this.habitManager.getXPForNextLevel();
        const levelProgress = this.habitManager.getLevelProgress();

        this.charXPValue.textContent = `${totalXP} / ${nextLevelXP}`;
        this.charXPBar.style.width = `${levelProgress}%`;

        // Update stats
        this.charStreak.textContent = this.habitManager.getStreak();
        this.charCompleted.textContent = this.habitManager.getTotalCompleted();
        this.charTotalQuests.textContent = this.habitManager.habits.length;
        this.charMultiplier.textContent = `${this.habitManager.getXPMultiplier()}x`;
    }
}

// === Initialize Application ===
document.addEventListener('DOMContentLoaded', () => {
    const habitManager = new HabitManager();
    const notificationManager = new NotificationManager(habitManager);
    const radarChartManager = new RadarChartManager(habitManager);
    const uiManager = new UIManager(habitManager, notificationManager, radarChartManager);

    // Schedule alarms
    notificationManager.scheduleAlarms();

    // Make managers globally accessible for debugging
    window.statMaxer = {
        habitManager,
        notificationManager,
        radarChartManager,
        uiManager
    };

    console.log('%c⚡ StatMaxer RPG OS Initialized', 'color: #3A86FF; font-size: 16px; font-weight: bold;');
    console.log('%cLevel up your life! 🎮', 'color: #06FFA5; font-size: 12px;');
});
