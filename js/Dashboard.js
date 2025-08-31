/**
 * CyberGuard Dashboard - Complete JavaScript Implementation
 * Uses specified localStorage keys for score management
 */

class CyberGuardDashboard {
    constructor() {
        // localStorage keys as specified
        this.storageKeys = {
            phishingScore: 'latestPhishingScore',
            networkScore: 'latestNetworkScore',
            ddosScore: 'latest-ddos-score',
            phishingBestScore: 'bestPhishingScore',
            networkBestScore: 'bestNetworkScore',
            ddosBestScore: 'ddos-score',
            commandsLearned:'commands-learned',
            userData: 'cyberguard_user_data',
            activityData: 'cyberguard_activity_data'
        };

        // Initialize user data structure
        this.initializeUserData();
        
        // Badge definitions
        this.badges = [
            { id: 'first_steps', name: 'First Steps', icon: '🌟', condition: () => this.userData.stats.totalGames >= 1 },
            { id: 'phishing_master', name: 'Phishing Master', icon: '🎣', condition: () => this.getScore('phishingScore') >= 10 },
            { id: 'network_defender', name: 'Network Defender', icon: '🛡️', condition: () => this.getScore('networkScore') >= 20 },
            { id: 'ddos_expert', name: 'DDoS Expert', icon: '⚡', condition: () => this.getScore('ddosScore') >= 15 },
            { id: 'streak_warrior', name: 'Streak Warrior', icon: '🔥', condition: () => this.userData.stats.currentStreak >= 7 },
            { id: 'accuracy_ace', name: 'Accuracy Ace', icon: '🎯', condition: () => this.getUserAccuracy() >= 90 },
            { id: 'cyber_veteran', name: 'Cyber Veteran', icon: '🏆', condition: () => this.userData.stats.totalGames >= 50 },
            { id: 'level_master', name: 'Level Master', icon: '⭐', condition: () => this.userData.stats.level >= 10 }
        ];

        this.init();
    }

    // Initialize user data
    initializeUserData() {
        const defaultData = {
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
                longestStreak: 0
            },
            badges: [],
            gameHistory: [],
            weeklyPerformance: Array(7).fill(0),
            learningProgress: {
                terminalCommands: 0,
                lessonsCompleted: 0
            }
        };

        const stored = localStorage.getItem(this.storageKeys.userData);
        this.userData = stored ? { ...defaultData, ...JSON.parse(stored) } : defaultData;
        
        // Load activity data
        const activityStored = localStorage.getItem(this.storageKeys.activityData);
        this.activityData = activityStored ? JSON.parse(activityStored) : {};
    }
    fetchActivityData() {
        try {
            const data = localStorage.getItem('cyberguard_activity_data');
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error fetching activity data:', e);
            return {};
        }
    }
    generateHeatmap(activityData) {
        const container = document.getElementById('heatmapContainer');
        if (!container) return;
    
        container.innerHTML = '';
    
        const today = new Date();
        const days = 180;
    
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dayStr = date.toDateString();
    
            const count = activityData[dayStr] || 0;
    
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
    
            if (count > 0) {
                let level = 1;
                if (count >= 8) level = 4;
                else if (count >= 5) level = 3;
                else if (count >= 2) level = 2;
                cell.classList.add(`level-${level}`);
            } else {
                cell.classList.add('level-0');
            }
    
            cell.title = `${dayStr}: ${count} activities`;
            container.appendChild(cell);
        }
    }
    
    // Initialize dashboard
    init() {
        console.log('🚀 Initializing CyberGuard Dashboard...');
      
        this.activityData = this.fetchActivityData();
    
        this.setUserLoggedIn();
    
        this.generateHeatmap(this.activityData);
    
        this.updateUserData();
    
        this.setupEventListeners();
    
        this.updateAllUI();
    
        this.startSessionTracking();
    
        console.log('Dashboard initialized successfully!');
    }
    
    setUserLoggedIn() {
        const today = new Date().toDateString();
        localStorage.setItem('user_logged_in', 'true');
        localStorage.setItem('last_login_date', today);
    
        // Increment activity count for today
        this.activityData[today] = (this.activityData[today] || 0) + 1;
        
        // Save updated activity data to storage
        this.saveActivityData();
    }
    
    fetchActivityData() {
        try {
          const data = localStorage.getItem('cyberguard_activity_data');
          return data ? JSON.parse(data) : {};
        } catch (error) {
          console.error('Error fetching activity data:', error);
          return {};
        }
      }
      
    // Get score from localStorage
    getScore(key) {
        const value = localStorage.getItem(key);
        return value ? Number(value) : 0;
    }

    // Set score in localStorage
    setScore(key, value) {
        localStorage.setItem(key, value.toString());
        this.updateAllUI();
    }

    // Get best score from localStorage
    getBestScore(key) {
        const value = localStorage.getItem(key);
        return value ? Number(value) : 0;
    }

    // Update best score if new score is higher
    updateBestScore(key, newScore) {
        const currentBest = this.getBestScore(key);
        if (newScore > currentBest) {
            localStorage.setItem(key, newScore.toString());
            this.showNotification('🏆', 'New Best Score!', `New record in ${key.replace('BestScore', '')}!`);
        }
    }

    // Calculate user accuracy
    getUserAccuracy() {
        if (this.userData.stats.totalGames === 0) return 0;
        return Math.round((this.userData.stats.correctAnswers / this.userData.stats.totalGames) * 100);
    }

    // Update user data
    updateUserData() {
        this.userData.profile.lastLogin = new Date().toISOString();
        this.userData.profile.sessionsCount++;
        this.saveUserData();
    }

    // Save user data to localStorage
    saveUserData() {
        localStorage.setItem(this.storageKeys.userData, JSON.stringify(this.userData));
    }

    // Save activity data
    saveActivityData() {
        localStorage.setItem(this.storageKeys.activityData, JSON.stringify(this.activityData));
    }

    // Setup event listeners
    setupEventListeners() {
        // Demo controls
        document.querySelectorAll('.demo-btn[data-game]').forEach(btn => {
            btn.addEventListener('click', () => {
                const game = btn.dataset.game;
                const result = btn.dataset.result;
                this.simulateGameResult(game, result === 'win');
            });
        });

        // Hide demo controls
        const hideBtn = document.getElementById('hideDemoControls');
        if (hideBtn) {
            hideBtn.addEventListener('click', () => {
                document.querySelector('.demo-controls').style.display = 'none';
            });
        }

        // Export data
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.showExportModal());
        }

        // Reset data
        const resetBtn = document.getElementById('resetDataBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetData());
        }

        // Modal controls
        const closeModal = document.getElementById('closeExportModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.hideExportModal());
        }

        const exportJsonBtn = document.getElementById('exportJsonBtn');
        const exportCsvBtn = document.getElementById('exportCsvBtn');
        
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => this.exportData('json'));
        }
        
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => this.exportData('csv'));
        }

        // XP tooltip
        const xpStat = document.getElementById('xpStat');
        if (xpStat) {
            xpStat.addEventListener('mouseenter', (e) => this.showXPTooltip(e));
            xpStat.addEventListener('mouseleave', () => this.hideXPTooltip());
        }
    }

    // Simulate game result for demo
    simulateGameResult(gameType, isWin) {
        console.log(`🎮 Simulating ${gameType} game: ${isWin ? 'WIN' : 'LOSE'}`);
        
        let score = 0;
        let xpGained = 0;

        if (isWin) {
            switch (gameType) {
                case 'phishing':
                    score = Math.floor(Math.random() * 3) + 8; // 8-10
                    xpGained = 50 + score * 5;
                    this.setScore(this.storageKeys.phishingScore, Math.min(10, this.getScore(this.storageKeys.phishingScore) + 1));
                    this.updateBestScore(this.storageKeys.phishingBestScore, score);
                    break;
                case 'password':
                    score = Math.floor(Math.random() * 2) + 4; // 4-5
                    xpGained = 40 + score * 8;
                    // Password uses network score for now (can be changed)
                    this.setScore(this.storageKeys.networkScore, Math.min(20, this.getScore(this.storageKeys.networkScore) + 1));
                    break;
                case 'network':
                    score = Math.floor(Math.random() * 5) + 15; // 15-19
                    xpGained = 60 + score * 3;
                    this.setScore(this.storageKeys.networkScore, Math.min(20, this.getScore(this.storageKeys.networkScore) + 1));
                    this.updateBestScore(this.storageKeys.networkBestScore, score);
                    break;
            }
            this.userData.stats.correctAnswers++;
        } else {
            xpGained = 10; // Small consolation XP
        }

        // Update stats
        this.userData.stats.totalGames++;
        this.userData.stats.xp += xpGained;
        
        // Update level
        this.updateLevel();
        
        // Update streak
        this.updateStreak(isWin);
        
        // Update daily activity
        this.updateDailyActivity();
        
        // Update weekly performance
        this.updateWeeklyPerformance(isWin);
        
        // Check badges
        this.checkBadges();
        
        // Add to history
        this.addToHistory(gameType, isWin, score, xpGained);
        
        // Save data
        this.saveUserData();
        this.saveActivityData();
        
        // Update UI
        this.updateAllUI();
        this.generateHeatmap();
        
        // Show notification
        if (isWin) {
            this.showNotification('🎉', 'Training Complete!', `Great job! You earned ${xpGained} XP`);
        }
    }

    // Update level based on XP
    updateLevel() {
        const newLevel = Math.floor(this.userData.stats.xp / 500) + 1;
        if (newLevel > this.userData.stats.level) {
            this.userData.stats.level = newLevel;
            this.showNotification('🎉', 'Level Up!', `Welcome to level ${newLevel}!`);
        }
    }

    // Update streak
    updateStreak(isWin) {
        if (isWin) {
            this.userData.stats.currentStreak++;
            if (this.userData.stats.currentStreak > this.userData.stats.longestStreak) {
                this.userData.stats.longestStreak = this.userData.stats.currentStreak;
            }
        } else {
            this.userData.stats.currentStreak = 0;
        }
    }

    // Update daily activity
    updateDailyActivity() {
        const today = new Date().toDateString();
        this.activityData[today] = (this.activityData[today] || 0) + 1;
    }

    // Update weekly performance
    updateWeeklyPerformance(isWin) {
        const dayIndex = new Date().getDay();
        const currentPerf = this.userData.weeklyPerformance[dayIndex];
        const newPerf = isWin ? 100 : 0;
        
        // Weighted average
        this.userData.weeklyPerformance[dayIndex] = currentPerf === 0 ? newPerf : (currentPerf * 0.7 + newPerf * 0.3);
    }

    // Check and award badges
    checkBadges() {
        let newBadges = 0;
        this.badges.forEach(badge => {
            if (!this.userData.badges.includes(badge.id) && badge.condition()) {
                this.userData.badges.push(badge.id);
                this.userData.stats.xp += 100; // Badge bonus
                newBadges++;
                
                setTimeout(() => {
                    this.showNotification(badge.icon, 'Badge Earned!', `"${badge.name}" unlocked!`);
                }, newBadges * 1000);
            }
        });
    }

    // Add game to history
    addToHistory(gameType, isWin, score, xpGained) {
        this.userData.gameHistory.unshift({
            timestamp: new Date().toISOString(),
            type: gameType,
            success: isWin,
            score: score,
            xpGained: xpGained
        });
        
        // Keep only last 50 games
        if (this.userData.gameHistory.length > 50) {
            this.userData.gameHistory = this.userData.gameHistory.slice(0, 50);
        }
    }

    // Update all UI elements
    updateAllUI() {
        this.updateUserStats();
        this.updateProgressBars();
        this.updateBestScores();
        this.updateBadges();
        this.updatePerformanceStats();
        this.updateActivityFeed();
        this.updateLearningProgress();
        this.updateDataInfo();
        this.updateWeeklyChart();
        this.updateLevelProgress();
    }

    // Update user stats in header
    updateUserStats() {
        this.updateElement('userLevel', this.userData.stats.level);
        this.updateElement('userXP', this.userData.stats.xp.toLocaleString());
        this.updateElement('userAccuracy', this.getUserAccuracy() + '%');
        this.updateElement('userStreak', this.userData.stats.currentStreak);
        this.updateElement('streakDisplay', this.userData.stats.currentStreak);
    }

    // Update level progress bar
    updateLevelProgress() {
        const level = this.userData.stats.level;
        const xp = this.userData.stats.xp;
        const levelXP = (level - 1) * 500;
        const nextLevelXP = level * 500;
        const progress = ((xp - levelXP) / 500) * 100;
        
        this.updateElement('currentLevel', level);
        this.updateElement('nextLevel', level + 1);
        this.updateElement('currentXP', xp);
        this.updateElement('nextLevelXP', nextLevelXP);
        this.updateElement('xpToNext', nextLevelXP - xp);
        
        const progressFill = document.getElementById('levelProgressFill');
        if (progressFill) {
            progressFill.style.width = Math.min(100, progress) + '%';
        }
    }

    // Update progress bars
    updateProgressBars() {
        const phishingScore = this.getScore(this.storageKeys.phishingScore);
        const networkScore = this.getScore(this.storageKeys.networkScore);
        const ddosScore = this.getScore(this.storageKeys.ddosScore);
        
        // Update phishing progress
        this.updateElement('phishingScore', `${phishingScore}/10`);
        this.updateProgressBar('phishingProgress', phishingScore, 10);
        
        // Update password progress (using network score for now)
        this.updateElement('passwordScore', `${Math.min(networkScore, 5)}/5`);
        this.updateProgressBar('passwordProgress', Math.min(networkScore, 5), 5);
        
        // Update network progress
        this.updateElement('networkScore', `${networkScore}/20`);
        this.updateProgressBar('networkProgress', networkScore, 20);
        
        // Update learning progress
        this.updateProgressBar('learningProgress', phishingScore + networkScore, 30);
    }

    // Update best scores
    updateBestScores() {
        const phishingBest = this.getBestScore(this.storageKeys.phishingBestScore);
        const networkBest = this.getBestScore(this.storageKeys.networkBestScore);
        const ddosBest = this.getBestScore(this.storageKeys.ddosBestScore);
        const commandsLearned = this.getBestScore(this.storageKeys.commandsLearned);

        
        this.updateElement('bestPhishingScore', phishingBest > 0 ? `${phishingBest}/5` : '0/5');
        this.updateElement('bestPhishingDate', phishingBest > 0 ? 'Recently' : 'Never played');
        
        this.updateElement('ddos-score', ddosBest );
        this.updateElement('bestPasswordDate', networkBest > 0 ? 'Recently' : 'Never played');
        
        this.updateElement('bestNetworkScore', networkBest+"/4");
        this.updateElement('bestNetworkDate', networkBest > 0 ? 'Recently' : 'Never played');

        this.updateElement('commands-learned', commandsLearned);
        this.updateElement('commands-learned-date', commandsLearned > 0 ? 'Recently' : 'Never played');
        

    }

    // Update badges display
    updateBadges() {
        const container = document.getElementById('badgesContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.badges.forEach(badge => {
            const badgeEl = document.createElement('div');
            badgeEl.className = 'badge';
            badgeEl.title = badge.name;
            
            if (this.userData.badges.includes(badge.id)) {
                badgeEl.classList.add('earned');
                badgeEl.style.opacity = '1';
                badgeEl.style.filter = 'none';
            } else {
                badgeEl.style.opacity = '0.3';
                badgeEl.style.filter = 'grayscale(100%)';
            }
            
            badgeEl.textContent = badge.icon;
            container.appendChild(badgeEl);
        });
        
        // Update badge progress
        const earnedCount = this.userData.badges.length;
        const totalCount = this.badges.length;
        this.updateElement('badgeProgress', `${earnedCount}/${totalCount}`);
        this.updateProgressBar('badgeProgressFill', earnedCount, totalCount);
    }

    // Update performance stats
    updatePerformanceStats() {
        this.updateElement('totalGames', this.userData.stats.totalGames);
        this.updateElement('correctAnswers', this.userData.stats.correctAnswers);
        this.updateElement('longestStreak', this.userData.stats.longestStreak);
        this.updateElement('totalBadges', this.userData.badges.length);
    }

    // Update activity feed
    updateActivityFeed() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;
        
        if (this.userData.gameHistory.length === 0) {
            activityList.innerHTML = '<div class="activity-placeholder">Complete your first training to see activity here!</div>';
            return;
        }
        
        activityList.innerHTML = '';
        
        this.userData.gameHistory.slice(0, 10).forEach(game => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            
            const gameIcons = { phishing: '🎣', password: '🔐', network: '🛡️' };
            const statusIcon = game.success ? '✅' : '❌';
            
            item.innerHTML = `
                <div class="activity-icon">${statusIcon}</div>
                <div class="activity-content">
                    <div class="activity-title">${gameIcons[game.type]} ${this.capitalize(game.type)} Training</div>
                    <div class="activity-desc">${game.success ? `Completed (+${game.xpGained} XP)` : 'Try again!'}</div>
                </div>
                <div class="activity-time">${this.getTimeAgo(game.timestamp)}</div>
            `;
            
            activityList.appendChild(item);
        });
    }

    // Update learning progress
    updateLearningProgress() {
        const terminal = this.userData.learningProgress.terminalCommands;
        const lessons = this.userData.learningProgress.lessonsCompleted;
        
        this.updateElement('terminalProgress', `${terminal}/30`);
        this.updateElement('lessonsProgress', `${lessons}/6`);
        
        this.updateProgressBar('terminalProgressFill', terminal, 30);
        this.updateProgressBar('lessonsProgressFill', lessons, 6);
    }

    // Update data info
    updateDataInfo() {
        this.updateElement('joinDate', this.formatDate(this.userData.profile.joinDate));
        this.updateElement('totalTime', Math.floor(this.userData.profile.totalSessionTime / 60) + ' minutes');
        this.updateElement('totalSessions', this.userData.profile.sessionsCount);
        
        const dataSize = JSON.stringify(this.userData).length + JSON.stringify(this.activityData).length;
        this.updateElement('dataSize', this.formatBytes(dataSize));
    }

    // Update weekly chart
    updateWeeklyChart() {
        const container = document.getElementById('weeklyChart');
        if (!container) return;
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        container.innerHTML = '';
        
        this.userData.weeklyPerformance.forEach((perf, index) => {
            const barContainer = document.createElement('div');
            barContainer.style.display = 'flex';
            barContainer.style.flexDirection = 'column';
            barContainer.style.alignItems = 'center';
            barContainer.style.flex = '1';
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = Math.max(perf, 2) + '%';
            bar.style.background = `hsl(${perf > 50 ? '120' : '0'}, 70%, 50%)`;
            bar.style.borderRadius = '4px 4px 0 0';
            bar.style.minHeight = '4px';
            bar.title = `${days[index]}: ${Math.round(perf)}%`;
            
            const label = document.createElement('div');
            label.textContent = days[index];
            label.style.fontSize = '0.8rem';
            label.style.color = '#888';
            label.style.marginTop = '0.5rem';
            
            barContainer.appendChild(bar);
            barContainer.appendChild(label);
            container.appendChild(barContainer);
        });
        
        const avgAccuracy = this.userData.weeklyPerformance.reduce((a, b) => a + b, 0) / 7;
        this.updateElement('avgAccuracy', Math.round(avgAccuracy) + '%');
    }

    // Generate activity heatmap
    generateHeatmap() {
        const container = document.getElementById('heatmapContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        const today = new Date();
        const days = 180;
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toDateString();
            
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            
            const activity = this.activityData[dateString] || 0;
            
            if (activity > 0) {
                const level = Math.min(Math.floor(activity / 2) + 1, 4);
                cell.classList.add(`level-${level}`);
            } else {
                cell.classList.add('level-0');
            }
            
            cell.title = `${dateString}: ${activity} activities`;
            container.appendChild(cell);
        }
    }

    // Start session tracking
    startSessionTracking() {
        this.sessionStart = Date.now();
        
        setInterval(() => {
            this.userData.profile.totalSessionTime += 60; // Add 1 minute
            this.saveUserData();
        }, 60000);
        
        window.addEventListener('beforeunload', () => {
            const sessionTime = Math.floor((Date.now() - this.sessionStart) / 1000);
            this.userData.profile.totalSessionTime += sessionTime;
            this.saveUserData();
        });
    }

    // Show/hide XP tooltip
    showXPTooltip(event) {
        const tooltip = document.getElementById('xpTooltip');
        if (!tooltip) return;
        
        const level = this.userData.stats.level;
        const xp = this.userData.stats.xp;
        const levelXP = (level - 1) * 500;
        const nextLevelXP = level * 500;
        const progressXP = xp - levelXP;
        const neededXP = 500;
        const progress = (progressXP / neededXP) * 100;
        
        this.updateElement('tooltipLevel', level);
        this.updateElement('tooltipXP', progressXP);
        this.updateElement('tooltipMaxXP', neededXP);
        this.updateElement('tooltipRemaining', `${nextLevelXP - xp} XP to next level`);
        
        const fill = document.getElementById('tooltipFill');
        if (fill) {
            fill.style.width = Math.min(100, progress) + '%';
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

    // Show notification
    showNotification(icon, title, description) {
        const notification = document.getElementById('achievementNotification');
        if (!notification) return;
        
        this.updateElement('notificationIcon', icon);
        this.updateElement('notificationTitle', title);
        this.updateElement('notificationDesc', description);
        
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }

    // Export modal
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

    // Export data
    exportData(format) {
        const textarea = document.getElementById('exportData');
        if (!textarea) return;
        
        const data = {
            userData: this.userData,
            activityData: this.activityData,
            scores: {
                phishing: this.getScore(this.storageKeys.phishingScore),
                network: this.getScore(this.storageKeys.networkScore),
                ddos: this.getScore(this.storageKeys.ddosScore),
                phishingBest: this.getBestScore(this.storageKeys.phishingBestScore),
                networkBest: this.getBestScore(this.storageKeys.networkBestScore),
                ddosBest: this.getBestScore(this.storageKeys.ddosBestScore)
            },
            exportDate: new Date().toISOString()
        };
        
        if (format === 'json') {
            textarea.value = JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
            textarea.value = this.convertToCSV();
        }
        
        textarea.select();
    }

    // Convert to CSV
    convertToCSV() {
        const headers = ['Date', 'Game', 'Result', 'Score', 'XP'];
        const rows = [headers.join(',')];
        
        this.userData.gameHistory.forEach(game => {
            rows.push([
                new Date(game.timestamp).toISOString().split('T')[0],
                game.type,
                game.success ? 'Win' : 'Loss',
                game.score || 0,
                game.xpGained || 0
            ].join(','));
        });
        
        return rows.join('\n');
    }

    // Reset all data
    resetData() {
        if (!confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            return;
        }
        
        // Clear localStorage
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Reset data
        this.initializeUserData();
        
        // Update UI
        this.updateAllUI();
        this.generateHeatmap();
        
        this.showNotification('🔄', 'Data Reset', 'All progress has been reset');
    }

    // Utility functions
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    updateProgressBar(id, current, max) {
        const element = document.getElementById(id);
        if (element) {
            const percentage = Math.min(100, (current / max) * 100);
            element.style.width = percentage + '%';
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
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMinutes = Math.floor((now - time) / 60000);
        
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
        return `${Math.floor(diffMinutes / 1440)}d ago`;
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cyberDashboard = new CyberGuardDashboard();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CyberGuardDashboard;
}
