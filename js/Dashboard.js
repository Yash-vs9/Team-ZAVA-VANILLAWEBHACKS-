/**
 * ENHANCED CYBERSECURITY DASHBOARD 
 * 
 * This dashboard connects all games, tracks comprehensive user data,
 * includes heatmap visualization, best scores tracking, and full data management.
 * All data is persisted in localStorage for offline functionality.
 */

class EnhancedCyberSecurityDashboard {
    constructor() {
        // Storage keys for different data types
        this.STORAGE_KEYS = {
            USER_DATA: 'cyberguard_user_data',
            ACTIVITY_DATA: 'cyberguard_activity_data',
            GAME_SESSIONS: 'cyberguard_game_sessions',
            LEARNING_DATA: 'cyberguard_learning_data',
            SETTINGS: 'cyberguard_settings'
        };

        // Default user data structure
        this.defaultUserData = {
            profile: {
                username: 'Cyber Agent',
                joinDate: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                totalSessionTime: 0,
                sessionsCount: 0
            },
            stats: {
                level: 1,
                xp: 0,
                totalGames: 0,
                correctAnswers: 0,
                currentStreak: 0,
                longestStreak: 0,
                totalPlayTime: 0
            },
            progress: {
                phishingScore: 0,
                passwordScore: 0,
                networkScore: localStorage.getItem("networkScore") || 0
            },
            bestScores: {
                phishing: { score: localStorage.getItem("networkBestScore"), date: null, accuracy: 0 },
                password: { score: 0, date: null, attempts: 0 },
                network: { score: localStorage.getItem("networkBestScore"), date: null, time: 0 }
            },
            badges: [],
            gameHistory: [],
            weeklyPerformance: Array(7).fill(0)
        };

        // Badge definitions with unlock conditions
        this.badgeDefinitions = [
            {
                id: 'first_steps',
                name: 'First Steps',
                description: 'Complete your first training session',
                icon: '🌟',
                condition: (userData) => userData.stats.totalGames >= 1
            },
            {
                id: 'phishing_detective',
                name: 'Phishing Detective',
                description: 'Master phishing detection (10/10)',
                icon: '🕵️',
                condition: (userData) => userData.progress.phishingScore >= 10
            },
            {
                id: 'password_guardian',
                name: 'Password Guardian',
                description: 'Master password security (5/5)',
                icon: '🔐',
                condition: (userData) => userData.progress.passwordScore >= 5
            },
            {
                id: 'network_defender',
                name: 'Network Defender',
                description: 'Master network defense (20/20)',
                icon: '🛡️',
                condition: (userData) => userData.progress.networkScore >= 20
            },
            {
                id: 'streak_warrior',
                name: 'Streak Warrior',
                description: 'Maintain a 7-day training streak',
                icon: '🔥',
                condition: (userData) => userData.stats.currentStreak >= 7
            },
            {
                id: 'accuracy_ace',
                name: 'Accuracy Ace',
                description: 'Achieve 90%+ accuracy rate',
                icon: '🎯',
                condition: (userData) => {
                    if (userData.stats.totalGames < 10) return false;
                    return (userData.stats.correctAnswers / userData.stats.totalGames) >= 0.9;
                }
            },
            {
                id: 'cyber_veteran',
                name: 'Cyber Veteran',
                description: 'Complete 50 training sessions',
                icon: '🏆',
                condition: (userData) => userData.stats.totalGames >= 50
            },
            {
                id: 'level_master',
                name: 'Level Master',
                description: 'Reach experience level 10',
                icon: '⭐',
                condition: (userData) => userData.stats.level >= 10
            }
        ];

        // Initialize the dashboard
        this.init();
    }

    /**
     * INITIALIZATION
     */
    init() {
        console.log('🚀 Initializing Enhanced CyberGuard Dashboard...');
        
        this.loadAllData();
        this.setupEventListeners();
        this.updateAllUI();
        this.generateHeatmap();
        this.setupGameResultListener();
        this.startSessionTracking();
        
        console.log('✅ Enhanced Dashboard initialized successfully!');
    }

    /**
     * DATA MANAGEMENT
     */
    loadAllData() {
        try {
            const storedData = localStorage.getItem(this.STORAGE_KEYS.USER_DATA);
            if (storedData) {
                this.userData = { ...this.defaultUserData, ...JSON.parse(storedData) };
                this.userData.profile.lastLogin = new Date().toISOString();
                this.userData.profile.sessionsCount++;
            } else {
                this.userData = { ...this.defaultUserData };
            }
            
            // Load activity data for heatmap
            this.activityData = this.loadActivityData();
            
            console.log('📊 User data loaded:', this.userData);
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.userData = { ...this.defaultUserData };
            this.activityData = {};
        }
    }

    saveUserData() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(this.userData));
            console.log('💾 User data saved successfully');
        } catch (error) {
            console.error('❌ Error saving data:', error);
        }
    }

    loadActivityData() {
        try {
            const activityData = localStorage.getItem(this.STORAGE_KEYS.ACTIVITY_DATA);
            return activityData ? JSON.parse(activityData) : {};
        } catch (error) {
            console.error('❌ Error loading activity data:', error);
            return {};
        }
    }

    saveActivityData() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.ACTIVITY_DATA, JSON.stringify(this.activityData));
        } catch (error) {
            console.error('❌ Error saving activity data:', error);
        }
    }

    /**
     * EVENT LISTENERS
     */
    setupEventListeners() {
        // XP tooltip
        const xpStat = document.getElementById('xpStat');
        const xpTooltip = document.getElementById('xpTooltip');
        
        if (xpStat && xpTooltip) {
            xpStat.addEventListener('mouseenter', (e) => {
                this.showXPTooltip(e);
            });
            
            xpStat.addEventListener('mouseleave', () => {
                this.hideXPTooltip();
            });
        }

        // Export data button
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.showExportModal());
        }

        // Reset data button
        const resetBtn = document.getElementById('resetDataBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetUserData());
        }

        // Modal close buttons
        const closeExportModal = document.getElementById('closeExportModal');
        if (closeExportModal) {
            closeExportModal.addEventListener('click', () => this.hideExportModal());
        }

        // Export format buttons
        const exportJsonBtn = document.getElementById('exportJsonBtn');
        const exportCsvBtn = document.getElementById('exportCsvBtn');
        
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => this.exportData('json'));
        }
        
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => this.exportData('csv'));
        }

        // Demo controls for testing
        this.setupDemoControls();

        // Hide demo controls button
        const hideDemoBtn = document.getElementById('hideDemoControls');
        if (hideDemoBtn) {
            hideDemoBtn.addEventListener('click', () => {
                document.querySelector('.demo-controls').style.display = 'none';
            });
        }
    }

    setupDemoControls() {
        const demoBtns = document.querySelectorAll('.demo-btn[data-game]');
        demoBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const gameType = btn.dataset.game;
                const result = btn.dataset.result;
                
                // Simulate game completion with random score
                let gameData = {};
                
                if (gameType === 'phishing') {
                    gameData = {
                        score: result === 'win' ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 3) + 1,
                        totalQuestions: 5,
                        accuracy: result === 'win' ? 80 + Math.random() * 20 : 20 + Math.random() * 60
                    };
                } else if (gameType === 'password') {
                    gameData = {
                        score: result === 'win' ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 3) + 1,
                        totalAttempts: 5,
                        strengthLevel: result === 'win' ? 'Strong' : 'Weak'
                    };
                } else if (gameType === 'network') {
                    gameData = {
                        threatsBlocked: result === 'win' ? Math.floor(Math.random() * 3) + 8 : Math.floor(Math.random() * 5) + 2,
                        totalThreats: 10,
                        timeSpent: 30 + Math.random() * 60
                    };
                }
                
                this.recordGameResult(gameType, result === 'win', gameData);
            });
        });
    }

    /**
     * GAME RESULT HANDLING
     */
    setupGameResultListener() {
        // Listen for game completion events from other pages
        window.addEventListener('storage', (e) => {
            if (e.key === 'cyberguard_game_result') {
                const gameResult = JSON.parse(e.newValue);
                this.recordGameResult(gameResult.type, gameResult.success, gameResult.data);
                localStorage.removeItem('cyberguard_game_result');
            }
        });
        
        // Check for game results on page load
        const gameResult = localStorage.getItem('cyberguard_game_result');
        if (gameResult) {
            const result = JSON.parse(gameResult);
            this.recordGameResult(result.type, result.success, result.data);
            localStorage.removeItem('cyberguard_game_result');
        }
    }

    recordGameResult(gameType, isSuccess, gameData) {
        console.log(`🎮 Recording game result: ${gameType}, Success: ${isSuccess}`, gameData);
        
        const xpEarned = isSuccess ? this.calculateXPReward(gameType, gameData) : 5;
        
        const gameRecord = {
            id: Date.now(),
            type: gameType,
            success: isSuccess,
            timestamp: new Date().toISOString(),
            xpEarned: xpEarned,
            data: gameData
        };

        // Update stats
        this.userData.stats.totalGames++;
        if (isSuccess) {
            this.userData.stats.correctAnswers++;
            this.userData.stats.xp += xpEarned;
            this.updateGameProgress(gameType, gameData);
            this.updateBestScore(gameType, gameData);
        }

        // Update level
        this.updateLevel();
        
        // Update daily activity
        this.updateDailyActivity();
        
        // Update weekly performance
        this.updateWeeklyPerformance(isSuccess);
        
        // Check badges
        this.checkAndAwardBadges();
        
        // Add to history
        this.userData.gameHistory.push(gameRecord);
        
        // Keep only last 100 games
        if (this.userData.gameHistory.length > 100) {
            this.userData.gameHistory = this.userData.gameHistory.slice(-100);
        }

        // Save data
        this.saveUserData();
        this.saveActivityData();
        
        // Update UI
        this.updateAllUI();
        this.generateHeatmap();
        
        // Show notification
        if (isSuccess) {
            this.showNotification('🎉', 'Training Complete!', `Great job! You earned ${xpEarned} XP`);
        }
    }

    calculateXPReward(gameType, gameData) {
        const baseRewards = {
            'phishing': 25,
            'password': 30,
            'network': 35
        };
        
        let baseXP = baseRewards[gameType] || 20;
        
        // Performance bonus
        if (gameType === 'phishing' && gameData.accuracy) {
            baseXP += Math.floor(gameData.accuracy / 10);
        }
        
        if (gameType === 'network' && gameData.threatsBlocked) {
            baseXP += gameData.threatsBlocked;
        }
        
        // Streak bonus
        const streakBonus = Math.min(this.userData.stats.currentStreak * 2, 20);
        
        return baseXP + streakBonus;
    }

    updateGameProgress(gameType, gameData) {
        const progressMaps = {
            'phishing': { max: 10, current: this.userData.progress.phishingScore },
            'password': { max: 5, current: this.userData.progress.passwordScore },
            'network': { max: 20, current: this.userData.progress.networkScore }
        };
        
        const progress = progressMaps[gameType];
        if (progress && progress.current < progress.max) {
            this.userData.progress[gameType + 'Score']++;
        }
    }

    updateBestScore(gameType, gameData) {
        const currentBest = this.userData.bestScores[gameType];
        let isNewBest = false;
        
        if (gameType === 'phishing') {
            if (gameData.score > currentBest.score || 
                (gameData.score === currentBest.score && gameData.accuracy > currentBest.accuracy)) {
                currentBest.score = gameData.score;
                currentBest.accuracy = gameData.accuracy;
                isNewBest = true;
            }
        } else if (gameType === 'password') {
            if (gameData.score > currentBest.score) {
                currentBest.score = gameData.score;
                currentBest.attempts = gameData.totalAttempts;
                isNewBest = true;
            }
        } else if (gameType === 'network') {
            if (gameData.threatsBlocked > currentBest.score) {
                currentBest.score = gameData.threatsBlocked;
                currentBest.time = gameData.timeSpent;
                isNewBest = true;
            }
        }
        
        if (isNewBest) {
            currentBest.date = new Date().toISOString();
            this.showNotification('🏆', 'New Best Score!', `Amazing performance in ${gameType}!`);
        }
    }

    updateLevel() {
        const newLevel = Math.floor(this.userData.stats.xp / 500) + 1;
        if (newLevel > this.userData.stats.level) {
            const oldLevel = this.userData.stats.level;
            this.userData.stats.level = newLevel;
            
            this.showNotification('🎉', 'Level Up!', `Welcome to level ${newLevel}!`);
            console.log(`📈 Level up: ${oldLevel} → ${newLevel}`);
        }
    }

    updateDailyActivity() {
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Initialize or increment today's activity
        if (!this.activityData[today]) {
            this.activityData[today] = 1;
            
            // Check streak
            if (this.activityData[yesterday.toDateString()]) {
                this.userData.stats.currentStreak++;
            } else {
                this.userData.stats.currentStreak = 1;
            }
            
            // Update longest streak
            if (this.userData.stats.currentStreak > this.userData.stats.longestStreak) {
                this.userData.stats.longestStreak = this.userData.stats.currentStreak;
            }
        } else {
            this.activityData[today]++;
        }
    }

    updateWeeklyPerformance(isSuccess) {
        const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
        const todayPerformance = this.userData.weeklyPerformance[today];
        
        // Update today's performance (running average)
        if (todayPerformance === 0) {
            this.userData.weeklyPerformance[today] = isSuccess ? 100 : 0;
        } else {
            const weight = 0.3; // How much new result affects average
            this.userData.weeklyPerformance[today] = 
                todayPerformance * (1 - weight) + (isSuccess ? 100 : 0) * weight;
        }
    }

    checkAndAwardBadges() {
        let newBadges = [];
        
        this.badgeDefinitions.forEach(badge => {
            if (!this.userData.badges.includes(badge.id) && badge.condition(this.userData)) {
                this.userData.badges.push(badge.id);
                newBadges.push(badge);
                
                // Award bonus XP for badge
                this.userData.stats.xp += 100;
                
                console.log(`🏆 New badge earned: ${badge.name}`);
            }
        });
        
        if (newBadges.length > 0) {
            const badge = newBadges[0];
            this.showNotification(badge.icon, 'Badge Earned!', `"${badge.name}" unlocked!`);
        }
    }

    /**
     * UI UPDATES
     */
    updateAllUI() {
        this.updateUserStats();
        this.updateProgressBars();
        this.updateBestScores();
        this.updateBadges();
        this.updateActivityFeed();
        this.updateWeeklyChart();
        this.updateDataInfo();
        this.updateLevelProgress();
        
        console.log('🔄 UI updated');
    }

    updateUserStats() {
        // Main stats
        this.updateElement('userLevel', this.userData.stats.level);
        this.updateElement('userXP', this.userData.stats.xp.toLocaleString());
        
        const accuracy = this.userData.stats.totalGames > 0 
            ? Math.round((this.userData.stats.correctAnswers / this.userData.stats.totalGames) * 100) 
            : 0;
        this.updateElement('userAccuracy', accuracy + '%');
        this.updateElement('userStreak', this.userData.stats.currentStreak);
        this.updateElement('streakDisplay', this.userData.stats.currentStreak);
        
        // Performance stats
        this.updateElement('totalGames', this.userData.stats.totalGames);
        this.updateElement('correctAnswers', this.userData.stats.correctAnswers);
        this.updateElement('longestStreak', this.userData.stats.longestStreak);
        this.updateElement('totalBadges', this.userData.badges.length);
    }

    updateLevelProgress() {
        const currentLevel = this.userData.stats.level;
        const currentXP = this.userData.stats.xp;
        const levelXP = (currentLevel - 1) * 500;
        const nextLevelXP = currentLevel * 500;
        const progressXP = currentXP - levelXP;
        const neededXP = nextLevelXP - levelXP;
        const progressPercent = (progressXP / neededXP) * 100;
        
        this.updateElement('currentLevel', currentLevel);
        this.updateElement('nextLevel', currentLevel + 1);
        this.updateElement('currentXP', currentXP);
        this.updateElement('nextLevelXP', nextLevelXP);
        this.updateElement('xpToNext', nextLevelXP - currentXP);
        
        const progressFill = document.getElementById('levelProgressFill');
        if (progressFill) {
            progressFill.style.width = progressPercent + '%';
        }
    }

    updateProgressBars() {
        // Training progress bars
        const progressData = [
            { id: 'phishing', current: this.userData.progress.phishingScore, max: 10 },
            { id: 'password', current: this.userData.progress.passwordScore, max: 5 },
            { id: 'network', current: this.userData.progress.networkScore, max: 20 }
        ];
        
        progressData.forEach(({ id, current, max }) => {
            const percent = (current / max) * 100;
            this.updateElement(`${id}Score`, `${current}/${max}`);
            
            const progressEl = document.getElementById(`${id}Progress`);
            if (progressEl) {
                progressEl.style.width = percent + '%';
            }
        });
    }

    updateBestScores() {
        const bestScores = this.userData.bestScores;
        
        // Phishing best score
        this.updateElement('bestPhishingScore', 
            bestScores.phishing.score > 0 ? `${bestScores.phishing.score}/5` : '0/5');
        this.updateElement('bestPhishingDate', 
            bestScores.phishing.date ? this.formatDate(bestScores.phishing.date) : 'Never played');
        
        // Password best score
        this.updateElement('bestPasswordScore', 
            bestScores.password.score > 0 ? `${bestScores.password.score}/5` : '0/5');
        this.updateElement('bestPasswordDate', 
            bestScores.password.date ? this.formatDate(bestScores.password.date) : 'Never played');
        
        // Network best score
        this.updateElement('bestNetworkScore', bestScores.network.score);
        this.updateElement('bestNetworkDate', 
            bestScores.network.date ? this.formatDate(bestScores.network.date) : 'Never played');
    }

    updateBadges() {
        const container = document.getElementById('badgesContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.badgeDefinitions.forEach(badge => {
            const isEarned = this.userData.badges.includes(badge.id);
            const badgeEl = document.createElement('div');
            badgeEl.className = 'badge';
            badgeEl.title = badge.description;
            
            if (isEarned) {
                badgeEl.classList.add('earned');
            } else {
                badgeEl.style.opacity = '0.3';
                badgeEl.style.filter = 'grayscale(100%)';
            }
            
            badgeEl.textContent = badge.icon;
            container.appendChild(badgeEl);
        });
        
        // Update badge progress
        const earnedBadges = this.userData.badges.length;
        const totalBadges = this.badgeDefinitions.length;
        this.updateElement('badgeProgress', `${earnedBadges}/${totalBadges}`);
        
        const badgeProgressFill = document.getElementById('badgeProgressFill');
        if (badgeProgressFill) {
            badgeProgressFill.style.width = ((earnedBadges / totalBadges) * 100) + '%';
        }
    }

    updateActivityFeed() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;
        
        const recentGames = this.userData.gameHistory.slice(-10).reverse();
        
        if (recentGames.length === 0) {
            activityList.innerHTML = '<div class="activity-placeholder">Complete your first training to see activity here!</div>';
            return;
        }
        
        activityList.innerHTML = '';
        
        recentGames.forEach(game => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            const gameIcons = { phishing: '🎣', password: '🔐', network: '🛡️' };
            const icon = game.success ? '✅' : '❌';
            
            activityItem.innerHTML = `
                <div class="activity-icon">${icon}</div>
                <div class="activity-content">
                    <div class="activity-title">${gameIcons[game.type]} ${this.capitalize(game.type)} Training</div>
                    <div class="activity-desc">${game.success ? `Completed successfully (+${game.xpEarned} XP)` : 'Failed - Keep practicing!'}</div>
                </div>
                <div class="activity-time">${this.getTimeAgo(game.timestamp)}</div>
            `;
            
            activityList.appendChild(activityItem);
        });
    }

    updateWeeklyChart() {
        const chartContainer = document.getElementById('weeklyChart');
        if (!chartContainer) return;
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const performance = this.userData.weeklyPerformance;
        
        chartContainer.innerHTML = '';
        
        // Create bars
        performance.forEach((accuracy, index) => {
            const barContainer = document.createElement('div');
            barContainer.style.display = 'flex';
            barContainer.style.flexDirection = 'column';
            barContainer.style.alignItems = 'center';
            barContainer.style.flex = '1';
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = Math.max(accuracy, 5) + '%';
            bar.setAttribute('data-value', Math.round(accuracy) + '%');
            
            const label = document.createElement('div');
            label.textContent = days[index];
            label.style.fontSize = '0.8rem';
            label.style.color = '#888';
            label.style.marginTop = '0.5rem';
            
            barContainer.appendChild(bar);
            barContainer.appendChild(label);
            chartContainer.appendChild(barContainer);
        });
        
        // Update average accuracy
        const avgAccuracy = Math.round(performance.reduce((a, b) => a + b, 0) / performance.length);
        this.updateElement('avgAccuracy', avgAccuracy + '%');
    }

    updateDataInfo() {
        const joinDate = new Date(this.userData.profile.joinDate);
        const totalTime = Math.floor(this.userData.profile.totalSessionTime / 60);
        const dataSize = new Blob([JSON.stringify(this.userData)]).size;
        
        this.updateElement('joinDate', this.formatDate(this.userData.profile.joinDate));
        this.updateElement('totalTime', totalTime + ' minutes');
        this.updateElement('dataSize', this.formatBytes(dataSize));
        this.updateElement('totalSessions', this.userData.profile.sessionsCount);
    }

    /**
     * HEATMAP GENERATION
     */
    generateHeatmap() {
        const container = document.getElementById('heatmapContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 179); // 180 days ago
        
        for (let i = 0; i < 180; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dateString = currentDate.toDateString();
            
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            
            const activity = this.activityData[dateString] || 0;
            
            if (activity > 0) {
                const level = Math.min(Math.floor(activity / 2) + 1, 4);
                cell.classList.add(`level-${level}`);
            }
            
            cell.title = `${dateString}: ${activity} activities`;
            container.appendChild(cell);
        }
    }

    /**
     * SESSION TRACKING
     */
    startSessionTracking() {
        this.sessionStartTime = Date.now();
        
        // Update session time every minute
        setInterval(() => {
            const sessionTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
            this.userData.profile.totalSessionTime += 60; // Add 1 minute
            this.saveUserData();
        }, 60000);
        
        // Save session time before page unload
        window.addEventListener('beforeunload', () => {
            const sessionTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
            this.userData.profile.totalSessionTime += sessionTime;
            this.saveUserData();
        });
    }

    /**
     * XP TOOLTIP
     */
    showXPTooltip(event) {
        const tooltip = document.getElementById('xpTooltip');
        if (!tooltip) return;
        
        const currentLevel = this.userData.stats.level;
        const currentXP = this.userData.stats.xp;
        const levelXP = (currentLevel - 1) * 500;
        const nextLevelXP = currentLevel * 500;
        const progressXP = currentXP - levelXP;
        const neededXP = nextLevelXP - levelXP;
        const progressPercent = (progressXP / neededXP) * 100;
        
        this.updateElement('tooltipLevel', currentLevel);
        this.updateElement('tooltipXP', progressXP);
        this.updateElement('tooltipMaxXP', neededXP);
        this.updateElement('tooltipRemaining', `${nextLevelXP - currentXP} XP to next level`);
        
        const tooltipFill = document.getElementById('tooltipFill');
        if (tooltipFill) {
            tooltipFill.style.width = progressPercent + '%';
        }
        
        tooltip.style.left = event.pageX + 10 + 'px';
        tooltip.style.top = event.pageY - 50 + 'px';
        tooltip.classList.remove('hidden');
    }

    hideXPTooltip() {
        const tooltip = document.getElementById('xpTooltip');
        if (tooltip) {
            tooltip.classList.add('hidden');
        }
    }

    /**
     * NOTIFICATIONS
     */
    showNotification(icon, title, description) {
        const notification = document.getElementById('achievementNotification');
        if (!notification) return;
        
        this.updateElement('notificationIcon', icon);
        this.updateElement('notificationTitle', title);
        this.updateElement('notificationDesc', description);
        
        notification.classList.remove('hidden');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }

    /**
     * DATA EXPORT/IMPORT
     */
    showExportModal() {
        const modal = document.getElementById('exportModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideExportModal() {
        const modal = document.getElementById('exportModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    exportData(format) {
        const exportTextarea = document.getElementById('exportData');
        if (!exportTextarea) return;
        
        if (format === 'json') {
            exportTextarea.value = JSON.stringify({
                userData: this.userData,
                activityData: this.activityData,
                exportDate: new Date().toISOString()
            }, null, 2);
        } else if (format === 'csv') {
            const csvData = this.convertToCSV();
            exportTextarea.value = csvData;
        }
        
        // Auto select the text for easy copying
        exportTextarea.select();
    }

    convertToCSV() {
        const headers = ['Date', 'Game Type', 'Success', 'XP Earned', 'Score'];
        const rows = [headers.join(',')];
        
        this.userData.gameHistory.forEach(game => {
            const row = [
                new Date(game.timestamp).toISOString().split('T')[0],
                game.type,
                game.success,
                game.xpEarned,
                game.data?.score || 'N/A'
            ];
            rows.push(row.join(','));
        });
        
        return rows.join('\n');
    }

    resetUserData() {
        if (confirm('Are you sure you want to reset all your progress? This action cannot be undone.')) {
            // Clear all data
            Object.keys(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(this.STORAGE_KEYS[key]);
            });
            
            // Reset in-memory data
            this.userData = { ...this.defaultUserData };
            this.activityData = {};
            
            // Update UI
            this.updateAllUI();
            this.generateHeatmap();
            
            this.showNotification('🔄', 'Data Reset', 'All progress has been reset successfully');
        }
    }

    /**
     * UTILITY FUNCTIONS
     */
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const gameTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - gameTime) / 60000);
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
}

// Initialize the enhanced dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cyberDashboard = new EnhancedCyberSecurityDashboard();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedCyberSecurityDashboard;
}