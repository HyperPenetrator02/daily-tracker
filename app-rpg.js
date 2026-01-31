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

class HabitManager {
    constructor() {
        this.habits = this.loadHabits();
        this.currentMonth = new Date();
        this.daysInMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0).getDate();
        this.initializeDefaultHabits();
    }

    initializeDefaultHabits() {
        if (this.habits.length === 0) {
            DEFAULT_HABITS.forEach(h => this.addHabit(h.name, h.icon, h.category, h.xp, 30, h.alarm, h.hardcore));
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
            name, icon, category,
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
        return !wasChecked;
    }

    isDayChecked(habitId, day) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return false;
        return habit.dailyLogs[this.getDateKey(day)] || false;
    }

    isTodayChecked(habitId) {
        return this.isDayChecked(habitId, new Date().getDate());
    }

    getDateKey(day) {
        return `${this.currentMonth.getFullYear()}-${this.currentMonth.getMonth() + 1}-${day}`;
    }

    getCompletedDays(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        return habit ? Object.values(habit.dailyLogs).filter(Boolean).length : 0;
    }

    getProgress(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return 0;
        return Math.min((this.getCompletedDays(habitId) / habit.goalValue) * 100, 100);
    }

    getTotalXP() {
        const habitXP = this.habits.reduce((total, habit) => {
            return total + (this.getCompletedDays(habit.id) * habit.xpReward);
        }, 0);
        const penalty = parseInt(localStorage.getItem('statmaxer_snooze_penalty') || '0');
        return Math.max(0, habitXP - penalty);
    }

    getPlayerLevel() {
        return Math.floor(Math.sqrt(this.getTotalXP() / 100)) + 1;
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
        return Math.pow(this.getPlayerLevel(), 2) * 100;
    }

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

    getXPMultiplier() {
        return this.getStreak() >= 3 ? 1.5 : 1.0;
    }

    getCategoryStats() {
        const stats = { strength: 0, intelligence: 0, discipline: 0 };
        this.habits.forEach(habit => {
            const categoryXP = this.getCompletedDays(habit.id) * habit.xpReward;
            stats[habit.category] += categoryXP;
        });
        return stats;
    }

    getTotalCompleted() {
        return this.habits.reduce((total, habit) => total + this.getCompletedDays(habit.id), 0);
    }

    resetAllData() {
        this.habits = [];
        this.saveHabits();
        localStorage.removeItem('statmaxer_player_name');
        localStorage.removeItem('statmaxer_snooze_penalty');
    }
}

class NotificationManager {
    constructor(habitManager) {
        this.habitManager = habitManager;
        this.notificationPermission = 'default';
        this.scheduledAlarms = new Map();
        this.isNative = false;
        this.LocalNotifications = null;
        this.activeAlarms = new Set();
        this.snoozeTimers = new Map();
        this.initializeCapacitor();
        this.setupMessageHandler();
        this.setupNotificationListeners();
    }

    async initializeCapacitor() {
        try {
            if (typeof window.Capacitor !== 'undefined') {
                this.isNative = window.Capacitor.isNativePlatform();
                if (this.isNative) {
                    const { LocalNotifications } = await import('@capacitor/local-notifications');
                    this.LocalNotifications = LocalNotifications;
                    this.setupNativeHandlers();
                }
            }
        } catch (error) {
            console.error('Capacitor init error:', error);
            this.isNative = false;
        }
    }

    async setupNativeHandlers() {
        if (!this.LocalNotifications) return;
        try {
            await this.LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
                const habitId = notification.notification.extra?.habitId;
                const action = notification.actionId;
                if (action === 'complete' && habitId) {
                    this.habitManager.toggleDay(habitId, new Date().getDate());
                    window.dispatchEvent(new CustomEvent('statmaxer_update'));
                    this.showToast('✅ Quest completed! XP earned!');
                } else if (action === 'snooze' && habitId) {
                    const habit = this.habitManager.habits.find(h => h.id === habitId);
                    if (habit && habit.hardcoreAlarm) {
                        this.applySnoozePenalty();
                        this.showToast('💀 HARDCORE MODE: Snooze denied! -5 XP penalty!');
                    } else {
                        this.applySnoozePenalty();
                        this.scheduleSnooze(habit, 10);
                        this.showToast('😴 Snoozed for 10 min. -5 XP penalty!');
                    }
                    window.dispatchEvent(new CustomEvent('statmaxer_update'));
                }
            });
        } catch (error) {
            console.error('Native handler setup error:', error);
        }
    }

    setupNotificationListeners() {
        if ('serviceWorker' in navigator && 'Notification' in window) {
            navigator.serviceWorker.ready.then(() => {
                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
                        this.handleNotificationAction(event.data.habitId, event.data.action);
                    }
                });
            });
        }
    }

    handleNotificationAction(habitId, action) {
        const habit = this.habitManager.habits.find(h => h.id === habitId);
        if (!habit) return;
        if (action === 'complete') {
            this.habitManager.toggleDay(habitId, new Date().getDate());
            window.dispatchEvent(new CustomEvent('statmaxer_update'));
            this.showToast('✅ Quest completed! XP earned!');
        } else if (action === 'snooze') {
            if (habit.hardcoreAlarm) {
                this.applySnoozePenalty();
                this.showToast('💀 HARDCORE MODE: Snooze denied! -5 XP penalty!');
            } else {
                this.applySnoozePenalty();
                this.scheduleSnooze(habit, 10);
                this.showToast('😴 Snoozed for 10 min. -5 XP penalty!');
            }
            window.dispatchEvent(new CustomEvent('statmaxer_update'));
        }
    }

    setupMessageHandler() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'SNOOZE_PENALTY') {
                    this.applySnoozePenalty();
                    window.dispatchEvent(new CustomEvent('statmaxer_update'));
                }
            });
        }
    }

    async requestPermission() {
        try {
            if (this.isNative && this.LocalNotifications) {
                const result = await this.LocalNotifications.requestPermissions();
                this.notificationPermission = result.display;
                return result.display === 'granted';
            } else if ('Notification' in window) {
                this.notificationPermission = await Notification.requestPermission();
                return this.notificationPermission === 'granted';
            }
        } catch (error) {
            console.error('Permission request error:', error);
        }
        return false;
    }

    async scheduleAlarms() {
        try {
            if (this.isNative && this.LocalNotifications) {
                const pending = await this.LocalNotifications.getPending();
                if (pending.notifications.length > 0) {
                    await this.LocalNotifications.cancel(pending);
                }
            } else {
                this.scheduledAlarms.forEach(timeout => clearTimeout(timeout));
                this.scheduledAlarms.clear();
            }
            this.snoozeTimers.forEach(timer => clearTimeout(timer));
            this.snoozeTimers.clear();
            const activeHabits = this.habitManager.habits.filter(h => h.alarmTime && h.isActive);
            for (const habit of activeHabits) {
                await this.scheduleAlarm(habit);
            }
        } catch (error) {
            console.error('Schedule alarms error:', error);
        }
    }

    async scheduleAlarm(habit, isSnooze = false, snoozeMinutes = 0) {
        try {
            const [hours, minutes] = habit.alarmTime.split(':').map(Number);
            const now = new Date();
            let alarmTime;
            if (isSnooze) {
                alarmTime = new Date(now.getTime() + snoozeMinutes * 60000);
            } else {
                alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
                if (alarmTime < now) alarmTime.setDate(alarmTime.getDate() + 1);
            }
            if (this.isNative && this.LocalNotifications) {
                const notificationId = Math.abs(habit.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
                const notificationConfig = {
                    title: `⚔️ Quest: ${habit.name}`,
                    body: `Time to complete: ${habit.name}${habit.hardcoreAlarm ? '\n💀 HARDCORE MODE - No snoozing!' : ''}`,
                    id: notificationId,
                    schedule: { at: alarmTime, allowWhileIdle: true },
                    sound: 'default',
                    smallIcon: 'ic_stat_icon_config_sample',
                    iconColor: '#3A86FF',
                    channelId: 'statmaxer-alarms',
                    importance: habit.hardcoreAlarm ? 5 : 4,
                    priority: habit.hardcoreAlarm ? 2 : 1,
                    ongoing: habit.hardcoreAlarm,
                    autoCancel: !habit.hardcoreAlarm,
                    extra: { habitId: habit.id, habitName: habit.name, hardcore: habit.hardcoreAlarm },
                    actionTypeId: 'QUEST_ALARM',
                    actions: habit.hardcoreAlarm ?
                        [{ id: 'complete', title: '✅ Complete Quest' }] :
                        [{ id: 'complete', title: '✅ Complete' }, { id: 'snooze', title: '😴 Snooze (-5 XP)' }]
                };
                if (!isSnooze) notificationConfig.schedule.every = 'day';
                await this.LocalNotifications.schedule({ notifications: [notificationConfig] });
            } else {
                const timeUntilAlarm = alarmTime - now;
                const timeout = setTimeout(() => this.triggerAlarm(habit), timeUntilAlarm);
                this.scheduledAlarms.set(habit.id, timeout);
            }
        } catch (error) {
            console.error('Schedule alarm error:', error);
        }
    }

    async scheduleSnooze(habit, minutes) {
        await this.scheduleAlarm(habit, true, minutes);
    }

    async triggerAlarm(habit) {
        try {
            if (this.notificationPermission !== 'granted') {
                await this.requestPermission();
            }
            this.activeAlarms.add(habit.id);
            const options = {
                body: `Time to complete: ${habit.name}${habit.hardcoreAlarm ? '\n💀 HARDCORE MODE!' : ''}`,
                icon: './icon-192.png',
                badge: './icon-192.png',
                vibrate: habit.hardcoreAlarm ? [500, 200, 500, 200, 500, 200, 500] : [200, 100, 200],
                requireInteraction: habit.hardcoreAlarm,
                tag: `habit-${habit.id}`,
                renotify: true,
                silent: false,
                data: { habitId: habit.id, habitName: habit.name, hardcore: habit.hardcoreAlarm }
            };
            if ('serviceWorker' in navigator) {
                options.actions = habit.hardcoreAlarm ?
                    [{ action: 'complete', title: '✅ Complete Quest' }] :
                    [{ action: 'complete', title: '✅ Complete' }, { action: 'snooze', title: '😴 Snooze (-5 XP)' }];
            }
            if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification(`⚔️ Quest: ${habit.name}`, options);
            } else {
                const notification = new Notification(`⚔️ Quest: ${habit.name}`, options);
                notification.onclick = () => {
                    window.focus();
                    this.handleNotificationAction(habit.id, 'complete');
                    notification.close();
                };
            }
            if (!this.isNative) {
                setTimeout(() => this.scheduleAlarm(habit), 1000);
            }
        } catch (error) {
            console.error('Trigger alarm error:', error);
        }
    }

    applySnoozePenalty() {
        const currentPenalty = parseInt(localStorage.getItem('statmaxer_snooze_penalty') || '0');
        localStorage.setItem('statmaxer_snooze_penalty', (currentPenalty + 5).toString());
    }

    getSnoozePenalty() {
        return parseInt(localStorage.getItem('statmaxer_snooze_penalty') || '0');
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:var(--bg-secondary);color:var(--text-primary);padding:1rem 2rem;border-radius:var(--radius-lg);border:1px solid var(--accent-primary);box-shadow:var(--glow-primary);z-index:10000;animation:slideUp 0.3s ease;font-family:'JetBrains Mono',monospace;font-size:0.9rem;max-width:90%;text-align:center;`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

class RadarChartManager {
    constructor(habitManager) {
        this.habitManager = habitManager;
        this.charts = {};
    }

    createRadarChart(canvasId, label, value, color) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
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
                        ticks: { stepSize: 20, color: '#A0A0A0', backdropColor: 'transparent' },
                        grid: { color: '#242424' },
                        pointLabels: { color: '#E0E0E0', font: { family: 'JetBrains Mono', size: 11 } }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    updateCharts() {
        const stats = this.habitManager.getCategoryStats();
        this.createRadarChart('strength-radar', 'Strength', stats.strength, '#FF006E');
        this.createRadarChart('intelligence-radar', 'Intelligence', stats.intelligence, '#3A86FF');
        this.createRadarChart('discipline-radar', 'Discipline', stats.discipline, '#06FFA5');
        document.getElementById('strength-value').textContent = Math.floor(stats.strength);
        document.getElementById('intelligence-value').textContent = Math.floor(stats.intelligence);
        document.getElementById('discipline-value').textContent = Math.floor(stats.discipline);
    }
}

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
        this.navItems = document.querySelectorAll('.nav-item');
        this.views = {
            quests: document.getElementById('quests-view'),
            matrix: document.getElementById('matrix-view'),
            character: document.getElementById('character-view'),
            settings: document.getElementById('settings-view'),
            upcoming: document.getElementById('upcoming-view')
        };
        this.playerNameEl = document.querySelector('.player-name');
        this.streakCountEl = document.getElementById('streak-count');
        this.totalXPEl = document.getElementById('total-xp');
        this.playerLevelEl = document.getElementById('player-level');
        this.levelBarFillEl = document.getElementById('level-bar-fill');
        this.levelPercentageEl = document.getElementById('level-percentage');
        this.questCardsContainer = document.getElementById('quest-cards-container');
        this.questsEmptyState = document.getElementById('quests-empty-state');
        this.currentMonthEl = document.getElementById('current-month');
        this.daysHeaderEl = document.getElementById('days-header');
        this.habitsContainerEl = document.getElementById('habits-container');
        this.matrixEmptyState = document.getElementById('matrix-empty-state');
        this.charLevelBadge = document.getElementById('char-level-badge');
        this.charPlayerName = document.getElementById('char-player-name');
        this.charXPValue = document.getElementById('char-xp-value');
        this.charXPBar = document.getElementById('char-xp-bar');
        this.charStreak = document.getElementById('char-streak');
        this.charCompleted = document.getElementById('char-completed');
        this.charTotalQuests = document.getElementById('char-total-quests');
        this.charMultiplier = document.getElementById('char-multiplier');
        this.charPenalty = document.getElementById('char-penalty');
        this.addHabitModal = document.getElementById('add-habit-modal');
        this.deleteModal = document.getElementById('delete-modal');
        this.habitForm = document.getElementById('habit-form');
        this.habitNameInput = document.getElementById('habit-name');
        this.habitCategoryInput = document.getElementById('habit-category');
        this.habitIconInput = document.getElementById('habit-icon');
        this.habitXPInput = document.getElementById('habit-xp');
        this.habitGoalInput = document.getElementById('habit-goal');
        this.habitAlarmInput = document.getElementById('habit-alarm');
        this.habitHardcoreInput = document.getElementById('habit-hardcore');
        this.iconPicker = document.getElementById('icon-picker');
        this.playerNameInput = document.getElementById('player-name-input');
    }

    attachEventListeners() {
        this.navItems.forEach(item => {
            item.addEventListener('click', () => this.switchView(item.dataset.view));
        });
        ['add-quest-btn', 'add-habit-btn', 'empty-quest-btn', 'empty-add-btn'].forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) btn.addEventListener('click', () => this.openAddHabitModal());
        });
        document.getElementById('modal-close').addEventListener('click', () => this.closeAddHabitModal());
        document.getElementById('cancel-habit').addEventListener('click', () => this.closeAddHabitModal());
        this.iconPicker.querySelectorAll('.icon-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.iconPicker.querySelectorAll('.icon-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.habitIconInput.value = btn.dataset.icon;
            });
        });
        this.habitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createHabit();
        });
        document.getElementById('cancel-delete').addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirm-delete').addEventListener('click', () => this.confirmDelete());
        this.playerNameInput.addEventListener('change', () => this.savePlayerName());
        document.getElementById('reset-data-btn').addEventListener('click', () => this.resetData());
        this.addHabitModal.addEventListener('click', (e) => {
            if (e.target === this.addHabitModal) this.closeAddHabitModal();
        });
        this.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) this.closeDeleteModal();
        });
        document.addEventListener('click', () => this.notificationManager.requestPermission(), { once: true });
        window.addEventListener('statmaxer_update', () => this.render());
    }

    switchView(view) {
        this.currentView = view;
        this.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.view === view);
        });
        Object.keys(this.views).forEach(key => {
            if (key === view) {
                this.views[key].classList.remove('hidden');
                if (key === 'character') {
                    setTimeout(() => this.radarChartManager.updateCharts(), 100);
                }
                if (window.innerWidth <= 768) {
                    const sidebar = document.getElementById('sidebar');
                    const overlay = document.getElementById('mobile-overlay');
                    if (sidebar) sidebar.classList.remove('mobile-open');
                    if (overlay) overlay.classList.remove('active');
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
        if (!name) return;
        this.habitManager.addHabit(
            name,
            this.habitIconInput.value,
            this.habitCategoryInput.value,
            this.habitXPInput.value,
            this.habitGoalInput.value,
            this.habitAlarmInput.value,
            this.habitHardcoreInput.checked
        );
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
        this.streakCountEl.textContent = this.habitManager.getStreak();
        this.totalXPEl.textContent = this.habitManager.getTotalXP();
        this.playerLevelEl.textContent = this.habitManager.getPlayerLevel();
        const levelProgress = this.habitManager.getLevelProgress();
        this.levelBarFillEl.style.width = `${levelProgress}%`;
        this.levelPercentageEl.textContent = `${levelProgress}%`;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.currentMonthEl.textContent = `${monthNames[this.habitManager.currentMonth.getMonth()]} ${this.habitManager.currentMonth.getFullYear()}`;
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
            const card = document.createElement('div');
            card.className = 'quest-card';
            const isCompleted = this.habitManager.isTodayChecked(habit.id);
            const categoryInfo = CATEGORIES[habit.category];
            card.innerHTML = `
                <div class="quest-card-header">
                    <div class="quest-icon-large">${habit.icon}</div>
                    <div class="quest-info">
                        <h3 class="quest-name">${habit.name}</h3>
                        <p class="quest-category">${categoryInfo.icon} ${categoryInfo.name}</p>
                    </div>
                    <div class="quest-xp-badge">+${habit.xpReward} XP</div>
                </div>
                <div class="quest-card-body">
                    <button class="quest-check-btn ${isCompleted ? 'completed' : ''}" data-habit-id="${habit.id}">
                        <span class="check-icon">${isCompleted ? '✓' : '○'}</span>
                        <span class="check-text">${isCompleted ? 'Completed' : 'Mark Complete'}</span>
                    </button>
                    ${habit.alarmTime ? `
                        <div class="quest-alarm-info">
                            <span class="alarm-icon">⏰</span>
                            <span class="alarm-time">${habit.alarmTime}</span>
                            ${habit.hardcoreAlarm ? '<span class="hardcore-badge">💀 HARDCORE</span>' : ''}
                        </div>
                    ` : ''}
                </div>
            `;
            const checkBtn = card.querySelector('.quest-check-btn');
            checkBtn.addEventListener('click', () => {
                const today = new Date().getDate();
                const newState = this.habitManager.toggleDay(habit.id, today);
                checkBtn.classList.toggle('completed', newState);
                checkBtn.querySelector('.check-icon').textContent = newState ? '✓' : '○';
                checkBtn.querySelector('.check-text').textContent = newState ? 'Completed' : 'Mark Complete';
                this.render();
            });
            this.questCardsContainer.appendChild(card);
        });
    }

    renderMatrix() {
        const habits = this.habitManager.habits;
        if (habits.length === 0) {
            this.matrixEmptyState.classList.remove('hidden');
            this.habitsContainerEl.innerHTML = '';
            this.daysHeaderEl.innerHTML = '';
            return;
        }
        this.matrixEmptyState.classList.add('hidden');
        this.daysHeaderEl.innerHTML = '';
        for (let day = 1; day <= this.habitManager.daysInMonth; day++) {
            const dayLabel = document.createElement('div');
            dayLabel.className = 'day-label';
            dayLabel.textContent = day;
            this.daysHeaderEl.appendChild(dayLabel);
        }
        this.habitsContainerEl.innerHTML = '';
        habits.forEach(habit => {
            const row = document.createElement('div');
            row.className = 'habit-row';
            const categoryInfo = CATEGORIES[habit.category];
            const completed = this.habitManager.getCompletedDays(habit.id);
            const progress = this.habitManager.getProgress(habit.id);
            row.innerHTML = `
                <div class="habit-info">
                    <div class="habit-icon">${habit.icon}</div>
                    <div class="habit-details">
                        <div class="habit-name">${habit.name}</div>
                        <div class="habit-goal">Goal: <span class="habit-goal-value">${habit.goalValue} days</span></div>
                    </div>
                </div>
                <div class="habit-days" id="habit-days-${habit.id}"></div>
                <div class="habit-stat">
                    <div class="stat-bar-container">
                        <div class="stat-bar-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="stat-text">
                        <span class="stat-percentage">${Math.round(progress)}%</span> (${completed}/${habit.goalValue})
                    </div>
                </div>
                <button class="habit-delete" data-habit-id="${habit.id}">×</button>
            `;
            const daysContainer = row.querySelector(`#habit-days-${habit.id}`);
            for (let day = 1; day <= this.habitManager.daysInMonth; day++) {
                const checkbox = document.createElement('div');
                checkbox.className = 'day-checkbox';
                const isChecked = this.habitManager.isDayChecked(habit.id, day);
                const isToday = day === new Date().getDate();
                if (isChecked) checkbox.classList.add('checked');
                if (isToday) checkbox.classList.add('today');
                checkbox.addEventListener('click', () => {
                    this.habitManager.toggleDay(habit.id, day);
                    this.render();
                });
                daysContainer.appendChild(checkbox);
            }
            const deleteBtn = row.querySelector('.habit-delete');
            deleteBtn.addEventListener('click', () => {
                this.openDeleteModal(habit.id, habit.name);
            });
            this.habitsContainerEl.appendChild(row);
        });
    }

    renderCharacter() {
        this.charLevelBadge.textContent = this.habitManager.getPlayerLevel();
        const totalXP = this.habitManager.getTotalXP();
        const nextLevelXP = this.habitManager.getXPForNextLevel();
        const levelProgress = this.habitManager.getLevelProgress();
        this.charXPValue.textContent = `${totalXP} / ${nextLevelXP}`;
        this.charXPBar.style.width = `${levelProgress}%`;
        this.charStreak.textContent = this.habitManager.getStreak();
        this.charCompleted.textContent = this.habitManager.getTotalCompleted();
        this.charTotalQuests.textContent = this.habitManager.habits.length;
        this.charMultiplier.textContent = `${this.habitManager.getXPMultiplier()}x`;
        this.charPenalty.textContent = `-${this.notificationManager.getSnoozePenalty()}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const habitManager = new HabitManager();
    const notificationManager = new NotificationManager(habitManager);
    const radarChartManager = new RadarChartManager(habitManager);
    const uiManager = new UIManager(habitManager, notificationManager, radarChartManager);
    notificationManager.requestPermission().then(() => notificationManager.scheduleAlarms());
    window.statMaxer = { habitManager, notificationManager, radarChartManager, uiManager };

    const initMobileMenu = () => {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const checkMobileView = () => {
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'block';
            } else {
                mobileMenuBtn.style.display = 'none';
                sidebar.classList.remove('mobile-open');
                mobileOverlay.classList.remove('active');
            }
        };
        const toggleMobileMenu = () => {
            sidebar.classList.toggle('mobile-open');
            mobileOverlay.classList.toggle('active');
        };
        const closeMobileMenu = () => {
            sidebar.classList.remove('mobile-open');
            mobileOverlay.classList.remove('active');
        };
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        mobileOverlay.addEventListener('click', closeMobileMenu);
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) closeMobileMenu();
            });
        });
        checkMobileView();
        window.addEventListener('resize', checkMobileView);
        const preventScroll = () => {
            document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
        };
        sidebar.addEventListener('transitionend', preventScroll);
    };
    initMobileMenu();
});
