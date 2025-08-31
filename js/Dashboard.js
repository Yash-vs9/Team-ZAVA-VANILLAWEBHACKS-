/**
 * COMPLETE CYBERSECURITY DASHBOARD - FIXED & ENHANCED VERSION
 * 
 * Fixes:
 * - Progress bars now working properly
 * - Streak tracking fixed with persistence
 * - Best scores for all games working
 * - 1-year heatmap (365 days)
 * - Recent activity feed working
 * - Weekly performance chart functional
 * - 15 achievement badges added
 * - Better data synchronization
 * - Improved localStorage integration
 */

class CompleteCyberSecurityDashboard {
    constructor() {
        // Storage keys for data integration
        this.STORAGE_KEYS = {
            // Dashboard core data
            USER_DATA: 'cyberguard_user_data',
            ACTIVITY_DATA: 'cyberguard_activity_data',
            GAME_HISTORY: 'cyberguard_game_history',
            STREAK_DATA: 'cyberguard_streak_data',
            
            // Game integration keys
            NETWORK_BEST: 'bestNetworkScore',
            PHISHING_BEST: 'bestPhishingScore',
            PASSWORD_BEST: 'passwordBestScore', // Added missing password best
            LATEST_NETWORK: 'latestNetworkGame',
            LATEST_PHISHING: 'latestPhishingGame',
            LATEST_PASSWORD: 'latestPasswordGame',
            
            // Learning system keys
            LEARNING_COMMANDS: 'cyberguard_completed_commands',
            LEARNING_PROGRESS: 'cyberguard_learning_progress',
            
            // DDoS defense keys
            DDOS_STATS: 'ddos_defense_stats',
            DDOS_SESSIONS: 'ddos_sessions'
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
                gamesWon: 0,
                currentStreak: 0,
                longestStreak: 0,
                totalPlayTime: 0,
                commandsLearned: 0,
                lastActivityDate: null
            },
            progress: {
                phishingScore: 0,
                passwordScore: 0,
                networkScore: 0,
                ddosScore: 0,
                learningScore: 0
            },
            bestScores: {
                phishing: { score: 0, date: null, accuracy: 0 },
                password: { score: 0, date: null, attempts: 0 },
                network: { score: 0, date: null, time: 0 },
                ddos: { score: 0, date: null, effectiveness: 0 }
            },
            badges: [],
            gameHistory: [],
            weeklyPerformance: Array(7).fill(0),
            lastKnownValues: {
                networkBest: 0,
                phishingBest: 0,
                passwordBest: 0,
                latestNetwork: null,
                latestPhishing: null,
                latestPassword: null,
                completedCommands: 0
            }
        };

        // Enhanced badge definitions with 15+ achievements
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
                description: 'Score 4+ in phishing detection',
                icon: '🕵️',
                condition: (userData) => userData.bestScores.phishing.score >= 4
            },
            {
                id: 'password_guardian',
                name: 'Password Guardian',
                description: 'Score 4+ in password security',
                icon: '🔐',
                condition: (userData) => userData.bestScores.password.score >= 4
            },
            {
                id: 'network_defender',
                name: 'Network Defender',
                description: 'Block all 4 threats in network defense',
                icon: '🛡️',
                condition: (userData) => userData.bestScores.network.score >= 4
            },
            {
                id: 'ddos_master',
                name: 'DDoS Master',
                description: 'Achieve 80%+ effectiveness in DDoS defense',
                icon: '🚫',
                condition: (userData) => userData.bestScores.ddos.effectiveness >= 80
            },
            {
                id: 'terminal_expert',
                name: 'Terminal Expert',
                description: 'Master 15+ terminal commands',
                icon: '💻',
                condition: (userData) => userData.stats.commandsLearned >= 15
            },
            {
                id: 'streak_warrior',
                name: 'Streak Warrior',
                description: 'Maintain a 5-day training streak',
                icon: '🔥',
                condition: (userData) => userData.stats.currentStreak >= 5
            },
            {
                id: 'cyber_veteran',
                name: 'Cyber Veteran',
                description: 'Complete 25 training sessions',
                icon: '🏆',
                condition: (userData) => userData.stats.totalGames >= 25
            },
            {
                id: 'perfect_score',
                name: 'Perfect Score',
                description: 'Get perfect scores in all games',
                icon: '⭐',
                condition: (userData) => userData.bestScores.phishing.score >= 5 && 
                                      userData.bestScores.password.score >= 5 && 
                                      userData.bestScores.network.score >= 4
            },
            {
                id: 'marathon_runner',
                name: 'Marathon Runner',
                description: 'Maintain a 10-day training streak',
                icon: '🏃‍♂️',
                condition: (userData) => userData.stats.currentStreak >= 10
            },
            {
                id: 'security_ace',
                name: 'Security Ace',
                description: 'Win 50 training sessions',
                icon: '🎯',
                condition: (userData) => userData.stats.gamesWon >= 50
            },
            {
                id: 'command_ninja',
                name: 'Command Ninja',
                description: 'Master all 24 terminal commands',
                icon: '🥷',
                condition: (userData) => userData.stats.commandsLearned >= 24
            },
            {
                id: 'level_master',
                name: 'Level Master',
                description: 'Reach level 10',
                icon: '🎖️',
                condition: (userData) => userData.stats.level >= 10
            },
            {
                id: 'consistency_king',
                name: 'Consistency King',
                description: 'Train for 30 consecutive days',
                icon: '👑',
                condition: (userData) => userData.stats.longestStreak >= 30
            },
            {
                id: 'cyber_legend',
                name: 'Cyber Legend',
                description: 'Complete 100 training sessions',
                icon: '🌟',
                condition: (userData) => userData.stats.totalGames >= 100
            }
        ];

        this.init();
    }

    /**
     * INITIALIZATION
     */
    init() {
        console.log('🚀 Initializing Complete CyberSecurity Dashboard...');
        
        this.loadAllData();
        this.setupEventListeners();
        this.updateAllUI();
        this.generateHeatmap();
        this.startDataMonitoring();
        this.startSessionTracking();
        
        console.log('✅ Dashboard fully initialized!');
    }

    /**
     * ENHANCED DATA MANAGEMENT
     */
    loadAllData() {
        try {
            // Load dashboard data
            const storedData = localStorage.getItem(this.STORAGE_KEYS.USER_DATA);
            if (storedData) {
                this.userData = { 
                    ...this.defaultUserData, 
                    ...JSON.parse(storedData) 
                };
                // Ensure all nested objects exist
                this.userData.stats = { ...this.defaultUserData.stats, ...this.userData.stats };
                this.userData.progress = { ...this.defaultUserData.progress, ...this.userData.progress };
                this.userData.bestScores = { ...this.defaultUserData.bestScores, ...this.userData.bestScores };
                this.userData.lastKnownValues = { ...this.defaultUserData.lastKnownValues, ...this.userData.lastKnownValues };
                
                this.userData.profile.lastLogin = new Date().toISOString();
                this.userData.profile.sessionsCount++;
            } else {
                this.userData = { ...this.defaultUserData };
            }
            
            // Load activity data
            this.activityData = this.loadActivityData();
            
            // Load game history
            this.loadGameHistory();
            
            // Load streak data
            this.loadStreakData();
            
            // Initial sync with all systems
            this.syncWithAllSystems();
            
            console.log('📊 All data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.userData = { ...this.defaultUserData };
            this.activityData = {};
        }
    }

    // Load game history
    loadGameHistory() {
        try {
            const historyData = localStorage.getItem(this.STORAGE_KEYS.GAME_HISTORY);
            if (historyData) {
                this.userData.gameHistory = JSON.parse(historyData);
            }
        } catch (error) {
            console.error('❌ Error loading game history:', error);
            this.userData.gameHistory = [];
        }
    }

    // Load streak data
    loadStreakData() {
        try {
            const streakData = localStorage.getItem(this.STORAGE_KEYS.STREAK_DATA);
            if (streakData) {
                const data = JSON.parse(streakData);
                this.userData.stats.currentStreak = data.currentStreak || 0;
                this.userData.stats.longestStreak = data.longestStreak || 0;
                this.userData.stats.lastActivityDate = data.lastActivityDate || null;
            }
        } catch (error) {
            console.error('❌ Error loading streak data:', error);
        }
    }

    // Save streak data
    saveStreakData() {
        try {
            const streakData = {
                currentStreak: this.userData.stats.currentStreak,
                longestStreak: this.userData.stats.longestStreak,
                lastActivityDate: this.userData.stats.lastActivityDate
            };
            localStorage.setItem(this.STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));
        } catch (error) {
            console.error('❌ Error saving streak data:', error);
        }
    }

    // Enhanced system synchronization
    syncWithAllSystems() {
        this.syncGameData();
        this.syncLearningData();
        this.syncDDoSData();
        this.updateStreakStatus();
    }

    // Enhanced game data sync with password support
    syncGameData() {
        const networkBest = parseInt(localStorage.getItem(this.STORAGE_KEYS.NETWORK_BEST)) || 0;
        const phishingBest = parseInt(localStorage.getItem(this.STORAGE_KEYS.PHISHING_BEST)) || 0;
        const passwordBest = parseInt(localStorage.getItem(this.STORAGE_KEYS.PASSWORD_BEST)) || 0;
        const latestNetwork = localStorage.getItem(this.STORAGE_KEYS.LATEST_NETWORK);
        const latestPhishing = localStorage.getItem(this.STORAGE_KEYS.LATEST_PHISHING);
        const latestPassword = localStorage.getItem(this.STORAGE_KEYS.LATEST_PASSWORD);

        // Check for new best scores
        if (networkBest > this.userData.bestScores.network.score) {
            this.userData.bestScores.network.score = networkBest;
            this.userData.bestScores.network.date = new Date().toISOString();
            this.userData.progress.networkScore = Math.min(networkBest * 5, 20);
            this.showNotification('🏆', 'New Network Best!', `Score: ${networkBest}/4`);
            this.userData.lastKnownValues.networkBest = networkBest;
        }

        if (phishingBest > this.userData.bestScores.phishing.score) {
            this.userData.bestScores.phishing.score = phishingBest;
            this.userData.bestScores.phishing.date = new Date().toISOString();
            this.userData.bestScores.phishing.accuracy = (phishingBest / 5) * 100;
            this.userData.progress.phishingScore = Math.min(phishingBest * 2, 10);
            this.showNotification('🏆', 'New Phishing Best!', `Score: ${phishingBest}/5`);
            this.userData.lastKnownValues.phishingBest = phishingBest;
        }

        // ADD MISSING PASSWORD SYNC
        if (passwordBest > this.userData.bestScores.password.score) {
            this.userData.bestScores.password.score = passwordBest;
            this.userData.bestScores.password.date = new Date().toISOString();
            this.userData.progress.passwordScore = Math.min(passwordBest, 5);
            this.showNotification('🏆', 'New Password Best!', `Score: ${passwordBest}/5`);
            this.userData.lastKnownValues.passwordBest = passwordBest;
        }

        // Check for new game sessions
        if (latestNetwork && latestNetwork !== this.userData.lastKnownValues.latestNetwork) {
            this.recordGameSession('network', parseInt(latestNetwork));
            this.userData.lastKnownValues.latestNetwork = latestNetwork;
        }

        if (latestPhishing && latestPhishing !== this.userData.lastKnownValues.latestPhishing) {
            this.recordGameSession('phishing', parseInt(latestPhishing));
            this.userData.lastKnownValues.latestPhishing = latestPhishing;
        }

        if (latestPassword && latestPassword !== this.userData.lastKnownValues.latestPassword) {
            this.recordGameSession('password', parseInt(latestPassword));
            this.userData.lastKnownValues.latestPassword = latestPassword;
        }
    }

    // Enhanced learning data sync
    syncLearningData() {
        try {
            const completedCommands = localStorage.getItem(this.STORAGE_KEYS.LEARNING_COMMANDS);
            
            if (completedCommands) {
                const commands = JSON.parse(completedCommands);
                const completedCount = Array.isArray(commands) ? commands.length : 0;
                
                if (completedCount !== this.userData.lastKnownValues.completedCommands) {
                    const newCommands = completedCount - this.userData.lastKnownValues.completedCommands;
                    if (newCommands > 0) {
                        const learningXP = newCommands * 15;
                        this.userData.stats.xp += learningXP;
                        this.userData.stats.commandsLearned = completedCount;
                        this.userData.progress.learningScore = completedCount;
                        this.updateLevel();
                        this.showNotification('📚', 'Commands Mastered!', `+${learningXP} XP earned!`);
                    }
                    
                    this.userData.lastKnownValues.completedCommands = completedCount;
                }
            }
        } catch (error) {
            console.error('❌ Error syncing learning data:', error);
        }
    }

    // Enhanced DDoS data sync
    syncDDoSData() {
        try {
            const ddosStats = localStorage.getItem(this.STORAGE_KEYS.DDOS_STATS);
            
            if (ddosStats) {
                const stats = JSON.parse(ddosStats);
                
                if (stats.effectiveness > this.userData.bestScores.ddos.effectiveness) {
                    this.userData.bestScores.ddos.effectiveness = stats.effectiveness;
                    this.userData.bestScores.ddos.score = stats.score || 0;
                    this.userData.bestScores.ddos.date = new Date().toISOString();
                    this.userData.progress.ddosScore = Math.floor(stats.effectiveness / 10);
                    this.showNotification('🚫', 'DDoS Defense Master!', `${Math.round(stats.effectiveness)}% effectiveness!`);
                }
            }
        } catch (error) {
            console.error('❌ Error syncing DDoS data:', error);
        }
    }

    // Enhanced streak tracking
    updateStreakStatus() {
        const today = new Date().toDateString();
        const lastActivity = this.userData.stats.lastActivityDate;
        
        if (lastActivity) {
            const lastDate = new Date(lastActivity).toDateString();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();
            
            // If last activity was not today and not yesterday, reset streak
            if (lastDate !== today && lastDate !== yesterdayStr) {
                this.userData.stats.currentStreak = 0;
            }
        }
        
        this.saveStreakData();
    }

    // Enhanced game session recording
    recordGameSession(gameType, score) {
        const isSuccess = this.determineSuccess(gameType, score);
        const xpEarned = this.calculateXPReward(gameType, score, isSuccess);
        
        const gameRecord = {
            id: Date.now(),
            type: gameType,
            success: isSuccess,
            timestamp: new Date().toISOString(),
            xpEarned: xpEarned,
            score: score
        };

        // Update stats
        this.userData.stats.totalGames++;
        if (isSuccess) {
            this.userData.stats.gamesWon++;
        }
        
        // Update streak
        this.updateStreak(isSuccess);
        
        this.userData.stats.xp += xpEarned;
        this.updateLevel();
        this.updateDailyActivity();
        this.updateWeeklyPerformance(isSuccess);
        this.checkAndAwardBadges();

        // Add to history (keep last 50 games)
        this.userData.gameHistory.push(gameRecord);
        if (this.userData.gameHistory.length > 50) {
            this.userData.gameHistory = this.userData.gameHistory.slice(-50);
        }
        localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(this.userData));
        localStorage.setItem(this.STORAGE_KEYS.GAME_HISTORY, JSON.stringify(this.userData.gameHistory));
        this.saveUserData();
        this.saveGameHistory();
        
        if (isSuccess) {
            this.showNotification('🎉', 'Training Complete!', `+${xpEarned} XP earned!`);
        }

        // Refresh UI
        this.updateActivityFeed();

        console.log(`🎮 Game session recorded: ${gameType} - ${isSuccess ? 'Success' : 'Failure'} - ${xpEarned} XP`);
    }

    // Enhanced streak update
    updateStreak(isSuccess) {
        const today = new Date().toDateString();
        const lastActivity = this.userData.stats.lastActivityDate;
        
        if (!lastActivity || new Date(lastActivity).toDateString() !== today) {
            // First activity of the day
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastActivity && new Date(lastActivity).toDateString() === yesterday.toDateString()) {
                // Continued streak
                this.userData.stats.currentStreak++;
            } else if (!lastActivity) {
                // First ever activity
                this.userData.stats.currentStreak = 1;
            } else {
                // Streak broken, restart
                this.userData.stats.currentStreak = 1;
            }
        }
        
        // Update longest streak
        if (this.userData.stats.currentStreak > this.userData.stats.longestStreak) {
            this.userData.stats.longestStreak = this.userData.stats.currentStreak;
        }
        
        // Update last activity date
        this.userData.stats.lastActivityDate = new Date().toISOString();
        
        this.saveStreakData();
    }

    // Save game history
    saveGameHistory() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.GAME_HISTORY, JSON.stringify(this.userData.gameHistory));
        } catch (error) {
            console.error('❌ Error saving game history:', error);
        }
    }

    // Determine game success
    determineSuccess(gameType, score) {
        const thresholds = {
            'phishing': 3,
            'password': 3,
            'network': 3
        };
        return score >= (thresholds[gameType] || 3);
    }

    // Calculate XP reward
    calculateXPReward(gameType, score, isSuccess) {
        if (!isSuccess) return 10;
        
        const baseRewards = {
            'phishing': 25,
            'password': 30,
            'network': 35
        };
        
        const baseXP = baseRewards[gameType] || 20;
        const scoreBonus = score * 5;
        const streakBonus = Math.min(this.userData.stats.currentStreak * 3, 15);
        
        return baseXP + scoreBonus + streakBonus;
    }

    // Update user level
    updateLevel() {
        const newLevel = Math.floor(this.userData.stats.xp / 500) + 1;
        if (newLevel > this.userData.stats.level) {
            this.userData.stats.level = newLevel;
            this.showNotification('🎉', 'Level Up!', `Welcome to level ${newLevel}!`);
        }
    }

    // Update daily activity
    updateDailyActivity() {
        const today = new Date().toDateString();
        if (!this.activityData) this.activityData = {};
        
        if (!this.activityData[today]) {
            this.activityData[today] = 1;
        } else {
            this.activityData[today]++;
        }
        this.saveActivityData();
    }

    // Fixed weekly performance update
    updateWeeklyPerformance(isSuccess) {
        const today = new Date().getDay(); // 0-6 (Sunday-Saturday)
        const current = this.userData.weeklyPerformance[today] || 0;
        
        // Use a more reliable calculation
        if (current === 0) {
            this.userData.weeklyPerformance[today] = isSuccess ? 100 : 50;
        } else {
            // Weighted average: 70% old performance, 30% new result
            const newPerformance = isSuccess ? 100 : 0;
            this.userData.weeklyPerformance[today] = (current * 0.7) + (newPerformance * 0.3);
        }
        
        // Ensure values are within 0-100 range
        this.userData.weeklyPerformance[today] = Math.max(0, Math.min(100, this.userData.weeklyPerformance[today]));
    }

    // Check and award badges
    checkAndAwardBadges() {
        let newBadges = [];
        
        this.badgeDefinitions.forEach(badge => {
            if (!this.userData.badges.includes(badge.id) && badge.condition(this.userData)) {
                this.userData.badges.push(badge.id);
                newBadges.push(badge);
                this.userData.stats.xp += 100; // Badge bonus
            }
        });
        
        if (newBadges.length > 0) {
            const badge = newBadges[0];
            this.showNotification(badge.icon, 'Badge Earned!', badge.name);
        }
    }

    /**
     * DATA MONITORING - Enhanced
     */
    startDataMonitoring() {
        // Monitor localStorage changes every 2 seconds
        setInterval(() => {
            this.syncWithAllSystems();
            this.updateAllUI();
        }, 2000);

        console.log('📡 Data monitoring started');
    }

    /**
     * ENHANCED UI UPDATE METHODS
     */
    updateAllUI() {
        this.updateUserStats();
        this.updateLevelProgress();
        this.updateProgressBars();
        this.updateBestScores();
        this.updateBadges();
        this.updatePerformanceStats();
        this.updateActivityFeed();
        this.updateLearningProgress();
        this.updateWeeklyChart();
        this.updateDataInfo();
    }

    // Fixed user stats update
    updateUserStats() {
        this.updateElement('userLevel', this.userData.stats.level);
        this.updateElement('userXP', this.userData.stats.xp.toLocaleString());
        
        const accuracy = this.userData.stats.totalGames > 0 
            ? Math.round((this.userData.stats.gamesWon / this.userData.stats.totalGames) * 100) 
            : 0;
        this.updateElement('userAccuracy', accuracy + '%');
        this.updateElement('userStreak', this.userData.stats.currentStreak);
        this.updateElement('streakDisplay', this.userData.stats.currentStreak);
    }

    // Fixed level progress
    updateLevelProgress() {
        const currentLevel = this.userData.stats.level;
        const currentXP = this.userData.stats.xp;
        const levelXP = (currentLevel - 1) * 500;
        const nextLevelXP = currentLevel * 500;
        const progressXP = currentXP - levelXP;
        const neededXP = nextLevelXP - levelXP;
        const progressPercent = Math.max(0, Math.min(100, (progressXP / neededXP) * 100));
        
        this.updateElement('currentLevel', currentLevel);
        this.updateElement('nextLevel', currentLevel + 1);
        this.updateElement('currentXP', currentXP);
        this.updateElement('nextLevelXP', nextLevelXP);
        this.updateElement('xpToNext', Math.max(0, nextLevelXP - currentXP));
        
        const progressFill = document.getElementById('levelProgressFill');
        if (progressFill) {
            progressFill.style.width = progressPercent + '%';
        }
    }

    // Fixed progress bars
    updateProgressBars() {
        const progressData = [
            { id: 'phishing', current: this.userData.progress.phishingScore, max: 10 },
            { id: 'password', current: this.userData.progress.passwordScore, max: 5 },
            { id: 'network', current: this.userData.progress.networkScore, max: 20 },
            { id: 'ddos', current: this.userData.progress.ddosScore, max: 10 },
            { id: 'learning', current: this.userData.progress.learningScore, max: 30 }
        ];
        
        progressData.forEach(({ id, current, max }) => {
            const percent = Math.min(100, (current / max) * 100);
            this.updateElement(`${id}Score`, `${current}/${max}`);
            
            const progressEl = document.getElementById(`${id}Progress`);
            if (progressEl) {
                progressEl.style.width = percent + '%';
            }
        });
    }

    // Fixed best scores display
    updateBestScores() {
        const bestScores = this.userData.bestScores;
        
        this.updateElement('bestPhishingScore', `${bestScores.phishing.score}/5`);
        this.updateElement('bestPhishingDate', 
            bestScores.phishing.date ? this.formatDate(bestScores.phishing.date) : 'Never played');
        
        this.updateElement('bestPasswordScore', `${bestScores.password.score}/5`);
        this.updateElement('bestPasswordDate', 
            bestScores.password.date ? this.formatDate(bestScores.password.date) : 'Never played');
        
        this.updateElement('bestNetworkScore', `${bestScores.network.score}/4`);
        this.updateElement('bestNetworkDate', 
            bestScores.network.date ? this.formatDate(bestScores.network.date) : 'Never played');
            
        this.updateElement('bestDdosScore', `${Math.round(bestScores.ddos.effectiveness)}%`);
        this.updateElement('bestDdosDate', 
            bestScores.ddos.date ? this.formatDate(bestScores.ddos.date) : 'Never played');
    }

    // Fixed badges display
    updateBadges() {
        const container = document.getElementById('badgesContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.badgeDefinitions.forEach(badge => {
            const isEarned = this.userData.badges.includes(badge.id);
            const badgeEl = document.createElement('div');
            badgeEl.className = `badge ${isEarned ? 'earned' : 'locked'}`;
            badgeEl.title = `${badge.name}: ${badge.description}`;
            badgeEl.textContent = badge.icon;
            
            if (!isEarned) {
                badgeEl.style.opacity = '0.4';
                badgeEl.style.filter = 'grayscale(80%)';
            }
            
            container.appendChild(badgeEl);
        });
        
        // Update badge progress
        const earnedBadges = this.userData.badges.length;
        const totalBadges = this.badgeDefinitions.length;
        this.updateElement('badgeProgress', `${earnedBadges}/${totalBadges}`);
    }

    // Fixed performance stats
    updatePerformanceStats() {
        this.updateElement('totalGames', this.userData.stats.totalGames);
        this.updateElement('gamesWon', this.userData.stats.gamesWon);
        
        const winRate = this.userData.stats.totalGames > 0 
            ? Math.round((this.userData.stats.gamesWon / this.userData.stats.totalGames) * 100) 
            : 0;
        this.updateElement('winRate', winRate + '%');
        
        this.updateElement('longestStreak', this.userData.stats.longestStreak);
        this.updateElement('totalBadges', this.userData.badges.length);
        this.updateElement('commandsLearned', this.userData.stats.commandsLearned);
    }

    // Fixed activity feed
    updateActivityFeed() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;
        
        const recentGames = this.userData.gameHistory.slice(-50).reverse();
        
        if (recentGames.length === 0) {
            activityList.innerHTML = `
                <div class="activity-placeholder">
                    Complete your first training to see activity here!
                </div>
            `;
            return;
        }
        
        activityList.innerHTML = '';
        
        recentGames.forEach(game => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            const gameIcons = { 
                phishing: '🎣', 
                password: '🔐', 
                network: '🛡️',
                ddos: '🚫',
                learning: '💻'
            };
            const statusIcon = game.success ? '✅' : '❌';
            
            activityItem.innerHTML = `
                <div class="activity-icon">${gameIcons[game.type] || '🎮'}</div>
                <div class="activity-content">
                    <div class="activity-title">${this.capitalize(game.type)} Training ${statusIcon}</div>
                    <div class="activity-desc">
                        ${game.success ? `Score: ${game.score || 0} (+${game.xpEarned} XP)` : 'Keep practicing!'}
                    </div>
                </div>
                <div class="activity-time">${this.getTimeAgo(game.timestamp)}</div>
            `;
            
            activityList.appendChild(activityItem);
        });
    }

    // Fixed learning progress
    updateLearningProgress() {
        this.updateElement('terminalCommands', `${this.userData.stats.commandsLearned}/24`);
        
        const lessonsCompleted = Math.floor(this.userData.stats.commandsLearned / 4);
        this.updateElement('lessonsCompleted', `${Math.min(lessonsCompleted, 6)}/6`);
        
        const terminalProgress = document.getElementById('terminalProgress');
        if (terminalProgress) {
            const percent = (this.userData.stats.commandsLearned / 24) * 100;
            terminalProgress.style.width = percent + '%';
        }
        
        const lessonsProgress = document.getElementById('lessonsProgress');
        if (lessonsProgress) {
            const percent = (Math.min(lessonsCompleted, 6) / 6) * 100;
            lessonsProgress.style.width = percent + '%';
        }
    }

    // Fixed weekly chart
    updateWeeklyChart() {
        const chartContainer = document.getElementById('weeklyChart');
        if (!chartContainer) return;
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const performance = this.userData.weeklyPerformance;
        
        chartContainer.innerHTML = '';
        
        // Create chart bars
        const chartBars = document.createElement('div');
        chartBars.className = 'chart-container';
        chartBars.style.cssText = 'display: flex; align-items: end; height: 120px; gap: 8px; margin-bottom: 10px;';
        
        performance.forEach((accuracy, index) => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            const height = Math.max(accuracy, 5); // Minimum 5% height for visibility
            bar.style.cssText = `
                flex: 1;
                height: ${height}%;
                background: linear-gradient(to top, var(--color-primary-hover), var(--color-primary));
                border-radius: 4px 4px 0 0;
                min-height: 4px;
            `;
            bar.setAttribute('data-value', Math.round(accuracy) + '%');
            bar.setAttribute('data-day', days[index]);
            bar.title = `${days[index]}: ${Math.round(accuracy)}%`;
            chartBars.appendChild(bar);
        });
        
        // Create labels
        const labels = document.createElement('div');
        labels.className = 'chart-labels';
        labels.style.cssText = 'display: flex; justify-content: space-between; font-size: 11px; color: var(--color-text-secondary);';
        
        days.forEach(day => {
            const label = document.createElement('span');
            label.textContent = day;
            labels.appendChild(label);
        });
        
        chartContainer.appendChild(chartBars);
        chartContainer.appendChild(labels);
        
        // Update average accuracy
        const avgAccuracy = Math.round(performance.reduce((a, b) => a + b, 0) / performance.length);
        this.updateElement('avgAccuracy', avgAccuracy + '%');
    }

    // Update data info
    updateDataInfo() {
        const totalTime = Math.floor(this.userData.profile.totalSessionTime / 60);
        const dataSize = new Blob([JSON.stringify(this.userData)]).size;
        
        this.updateElement('joinDate', this.formatDate(this.userData.profile.joinDate));
        this.updateElement('totalTime', totalTime + ' minutes');
        this.updateElement('dataSize', this.formatBytes(dataSize));
        this.updateElement('totalSessions', this.userData.profile.sessionsCount);
    }

    /**
     * FIXED HEATMAP GENERATION - 1 YEAR (365 DAYS)
     */
    generateHeatmap() {
        const container = document.getElementById('heatmapContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 364); // 365 days total including today
        
        // Generate 365 days of heatmap
        for (let i = 0; i < 365; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dateString = currentDate.toDateString();
            
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            
            const activity = this.activityData[dateString] || 0;
            
            // Activity levels: 0 = no activity, 1-2 = low, 3-5 = medium, 6-10 = high, 11+ = very high
            if (activity > 0) {
                let level = 1;
                if (activity >= 11) level = 4;
                else if (activity >= 6) level = 3;
                else if (activity >= 3) level = 2;
                else level = 1;
                
                cell.classList.add(`level-${level}`);
            }
            
            cell.title = `${dateString}: ${activity} activities`;
            container.appendChild(cell);
        }
    }

    /**
     * EVENT LISTENERS
     */
    setupEventListeners() {
        // XP tooltip
        const xpStat = document.getElementById('xpStat');
        if (xpStat) {
            xpStat.addEventListener('mouseenter', (e) => this.showXPTooltip(e));
            xpStat.addEventListener('mouseleave', () => this.hideXPTooltip());
        }

        // Export data
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.showExportModal());
        }

        // Reset data
        const resetBtn = document.getElementById('resetDataBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetUserData());
        }

        // Modal controls
        const closeExportModal = document.getElementById('closeExportModal');
        if (closeExportModal) {
            closeExportModal.addEventListener('click', () => this.hideExportModal());
        }

        const exportJsonBtn = document.getElementById('exportJsonBtn');
        const exportCsvBtn = document.getElementById('exportCsvBtn');
        
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => this.exportData('json'));
        }
        
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => this.exportData('csv'));
        }
    }

    /**
     * SESSION TRACKING
     */
    startSessionTracking() {
        this.sessionStartTime = Date.now();
        
        // Update session time every minute
        setInterval(() => {
            this.userData.profile.totalSessionTime += 60;
            this.saveUserData();
        }, 60000);
        
        // Save session on page unload
        window.addEventListener('beforeunload', () => {
            const sessionTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
            this.userData.profile.totalSessionTime += sessionTime;
            this.saveUserData();
        });
    }

    /**
     * TOOLTIP SYSTEM
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
     * NOTIFICATION SYSTEM
     */
    showNotification(icon, title, message) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <div>
                    <div class="notification-title">${title}</div>
                    <div class="notification-desc">${message}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 4000);
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
                game.score || 'N/A'
            ];
            rows.push(row.join(','));
        });
        
        return rows.join('\n');
    }

    resetUserData() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            // Clear all dashboard data
            Object.values(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            
            this.userData = { ...this.defaultUserData };
            this.activityData = {};
            
            this.updateAllUI();
            this.generateHeatmap();
            
            this.showNotification('🔄', 'Data Reset', 'All progress cleared');
        }
    }

    /**
     * DATA PERSISTENCE
     */
    saveUserData() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(this.userData));
        } catch (error) {
            console.error('❌ Error saving user data:', error);
        }
    }

    loadActivityData() {
        try {
            const activityData = localStorage.getItem(this.STORAGE_KEYS.ACTIVITY_DATA);
            return activityData ? JSON.parse(activityData) : {};
        } catch (error) {
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

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cyberDashboard = new CompleteCyberSecurityDashboard();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompleteCyberSecurityDashboard;
}