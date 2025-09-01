/**
 * COMPLETE CYBERSECURITY DASHBOARD - NO XP/LEVEL VERSION
 * Removed XP and leveling system while maintaining all other features
 */
class CompleteCyberSecurityDashboard {
    constructor() {
        console.log('🚀 Initializing Enhanced CyberSecurity Dashboard...');
        
        // Storage keys for complete data integration
        this.STORAGE_KEYS = {
            // Dashboard core data
            USER_DATA: 'cyberguard_user_data',
            ACTIVITY_DATA: 'cyberguard_activity_data',
            GAME_HISTORY: 'cyberguard_game_history',
            STREAK_DATA: 'cyberguard_streak_data',
            
            // Game integration keys (existing localStorage keys from other files)
            NETWORK_BEST: 'bestNetworkScore',
            PHISHING_BEST: 'bestPhishingScore',
            PASSWORD_BEST: 'passwordBestScore',
            LATEST_NETWORK: 'latestNetworkGame',
            LATEST_PHISHING: 'latestPhishingGame',
            LATEST_PASSWORD: 'latestPasswordGame',
            
            // Learning system keys
            LEARNING_COMMANDS: 'cyberguard_completed_commands',
            LEARNING_PROGRESS: 'cyberguard_learning_progress',
            
            // DDoS defense keys
            DDOS_STATS: 'ddos_defense_stats',
            DDOS_SESSIONS: 'ddos_sessions',
            
            // CAPTCHA detection keys
            CAPTCHA_STATS: 'captcha_verification_stats',
            
            // Escape room keys
            ESCAPE_PROGRESS: 'escape_room_progress'
        };

        // Current year for heatmap navigation
        this.currentYear = new Date().getFullYear();
        
        // Default user data structure (removed XP and level fields)
        this.defaultUserData = {
            profile: {
                username: 'Cyber Agent',
                joinDate: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                totalSessionTime: 0,
                sessionsCount: 0
            },
            stats: {
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

        // Enhanced badge definitions (15+ achievements) - removed XP/level related badges
        this.badgeDefinitions = [
            { id: 'first_steps', name: 'First Steps', description: 'Complete your first training session', icon: '🌟', condition: (userData) => userData.stats.totalGames >= 1 },
            { id: 'phishing_detective', name: 'Phishing Detective', description: 'Score 4+ in phishing detection', icon: '🕵️', condition: (userData) => userData.bestScores.phishing.score >= 4 },
            { id: 'password_guardian', name: 'Password Guardian', description: 'Score 4+ in password security', icon: '🔐', condition: (userData) => userData.bestScores.password.score >= 4 },
            { id: 'network_defender', name: 'Network Defender', description: 'Block all 4 threats in network defense', icon: '🛡️', condition: (userData) => userData.bestScores.network.score >= 4 },
            { id: 'ddos_master', name: 'DDoS Master', description: 'Achieve 80%+ effectiveness in DDoS defense', icon: '🚫', condition: (userData) => userData.bestScores.ddos.effectiveness >= 80 },
            { id: 'terminal_expert', name: 'Terminal Expert', description: 'Master 15+ terminal commands', icon: '💻', condition: (userData) => userData.stats.commandsLearned >= 15 },
            { id: 'streak_warrior', name: 'Streak Warrior', description: 'Maintain a 5-day training streak', icon: '🔥', condition: (userData) => userData.stats.currentStreak >= 5 },
            { id: 'cyber_veteran', name: 'Cyber Veteran', description: 'Complete 25 training sessions', icon: '🏆', condition: (userData) => userData.stats.totalGames >= 25 },
            { id: 'perfect_score', name: 'Perfect Score', description: 'Get perfect scores in all games', icon: '⭐', condition: (userData) => userData.bestScores.phishing.score >= 5 && userData.bestScores.password.score >= 5 && userData.bestScores.network.score >= 4 },
            { id: 'marathon_runner', name: 'Marathon Runner', description: 'Maintain a 10-day training streak', icon: '🏃‍♂️', condition: (userData) => userData.stats.currentStreak >= 10 },
            { id: 'security_ace', name: 'Security Ace', description: 'Win 50 training sessions', icon: '🎯', condition: (userData) => userData.stats.gamesWon >= 50 },
            { id: 'command_ninja', name: 'Command Ninja', description: 'Master all 24 terminal commands', icon: '🥷', condition: (userData) => userData.stats.commandsLearned >= 24 },
            { id: 'consistency_king', name: 'Consistency King', description: 'Train for 30 consecutive days', icon: '👑', condition: (userData) => userData.stats.longestStreak >= 30 },
            { id: 'cyber_legend', name: 'Cyber Legend', description: 'Complete 100 training sessions', icon: '🌟', condition: (userData) => userData.stats.totalGames >= 100 }
        ];

        this.init();
    }

    /**
     * INITIALIZATION (Maintaining original structure)
     */
    init() {
        this.loadAllData();
        this.setupEventListeners();
        this.updateAllUI();
        this.generateGitHubHeatmap();
        this.startDataMonitoring();
        this.startSessionTracking();
        this.initializeMatrixBackground();
        console.log('✅ Dashboard fully initialized!');
    }

    /**
     * ENHANCED DATA MANAGEMENT WITH LOCALSTORAGE
     */
    loadAllData() {
        try {
            // Load dashboard data (maintaining original structure)
            const storedData = localStorage.getItem(this.STORAGE_KEYS.USER_DATA);
            if (storedData) {
                this.userData = { ...this.defaultUserData, ...JSON.parse(storedData) };
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

            // Load activity data for GitHub heatmap
            this.activityData = this.loadActivityData();
            
            // Load game history
            // this.loadGameHistory();
            
            // Load streak data
            this.loadStreakData();
            
            // Initial sync with all external systems
            this.syncWithAllSystems();
            
            console.log('📊 All data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.userData = { ...this.defaultUserData };
            this.activityData = {};
        }
    }

    loadActivityData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.ACTIVITY_DATA);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('❌ Error loading activity data:', error);
            return {};
        }
    }

    // Load game history (maintaining original structure)
    // loadGameHistory() {
    //     try {
    //         const historyData = localStorage.getItem(this.STORAGE_KEYS.GAME_HISTORY);
    //         if (historyData) {
    //             this.userData.gameHistory = JSON.parse(historyData);
    //         }
    //     } catch (error) {
    //         console.error('❌ Error loading game history:', error);
    //         this.userData.gameHistory = [];
    //     }
    // }

    // Load streak data (maintaining original structure)
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

    // Save streak data (maintaining original structure)
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

    /**
     * ENHANCED SYSTEM SYNCHRONIZATION (maintaining original structure)
     */
    syncWithAllSystems() {
        this.syncGameData();
        this.syncLearningData();
        this.syncDDoSData();
        this.syncCaptchaData();
        this.syncEscapeData();
        this.updateStreakStatus();
    }
    recordGameSession(gameType, score) {
        const isSuccess = this.determineSuccess(gameType, score);

        const gameRecord = {
            id: Date.now(),
            type: gameType,
            success: isSuccess,
            timestamp: new Date().toISOString(),

            score: score
        };

        // Update stats (maintaining original structure)
        this.userData.stats.totalGames++;
        if (isSuccess) {
            this.userData.stats.gamesWon++;
        }

        // Update streak
        this.updateStreak(isSuccess);
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

        
        // Refresh UI
        this.updateActivityFeed();

    }


    // Enhanced game data sync with password support (maintaining original structure)
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

        // Password sync
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

    // Enhanced learning data sync (maintaining original structure, removed XP logic)
    syncLearningData() {
        try {
            const completedCommands = localStorage.getItem(this.STORAGE_KEYS.LEARNING_COMMANDS);
            if (completedCommands) {
                const commands = JSON.parse(completedCommands);
                const completedCount = Array.isArray(commands) ? commands.length : 0;
                
                if (completedCount !== this.userData.lastKnownValues.completedCommands) {
                    const newCommands = completedCount - this.userData.lastKnownValues.completedCommands;
                    if (newCommands > 0) {
                        this.userData.stats.commandsLearned = completedCount;
                        this.userData.progress.learningScore = completedCount;
                        this.showNotification('📚', 'Commands Mastered!', `${newCommands} new command${newCommands > 1 ? 's' : ''} learned!`);
                    }
                    this.userData.lastKnownValues.completedCommands = completedCount;
                }
            }
        } catch (error) {
            console.error('❌ Error syncing learning data:', error);
        }
    }

    // Enhanced DDoS data sync (maintaining original structure)
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

    // NEW: CAPTCHA data sync
    syncCaptchaData() {
        try {
            const captchaStats = localStorage.getItem(this.STORAGE_KEYS.CAPTCHA_STATS);
            if (captchaStats) {
                const stats = JSON.parse(captchaStats);
                if (stats.accuracy > (this.userData.bestScores.captcha?.accuracy || 0)) {
                    if (!this.userData.bestScores.captcha) {
                        this.userData.bestScores.captcha = { accuracy: 0, score: 0, date: null };
                    }
                    this.userData.bestScores.captcha.accuracy = stats.accuracy;
                    this.userData.bestScores.captcha.score = stats.score || 0;
                    this.userData.bestScores.captcha.date = new Date().toISOString();
                    this.showNotification('🤖', 'Bot Hunter!', `${Math.round(stats.accuracy)}% accuracy!`);
                }
            }
        } catch (error) {
            console.error('❌ Error syncing CAPTCHA data:', error);
        }
    }

    // NEW: Escape room data sync
    // syncEscapeData() {
    //     try {
    //         const escapeProgress = localStorage.getItem(this.STORAGE_KEYS.ESCAPE_PROGRESS);
    //         if (escapeProgress) {
    //             const progress = JSON.parse(escapeProgress);
    //             if (progress.score > 0) {
    //                 this.recordGameSession('escape', progress.score, progress.completed);
    //             }
    //         }
    //     } catch (error) {
    //         console.error('❌ Error syncing escape data:', error);
    //     }
    // }

    /**
     * GITHUB-STYLE HEATMAP GENERATION (New Feature)
     */
    generateGitHubHeatmap() {
        console.log('📈 Generating GitHub-style heatmap...');
        
        const container = document.getElementById('heatmapGrid');
        const monthsContainer = document.getElementById('heatmapMonths');
        
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';
        if (monthsContainer) monthsContainer.innerHTML = '';

        // Calculate date range (52 weeks from current date)
        const today = new Date(this.currentYear, 11, 31); // End of selected year
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 364); // 52 weeks * 7 days

        // Generate month labels
        this.generateMonthLabels(monthsContainer, startDate);

        // Generate heatmap grid
        this.generateHeatmapGrid(container, startDate);

        // Update year display
        document.getElementById('heatmapYear').textContent = this.currentYear;
    }

    generateMonthLabels(container, startDate) {
        if (!container) return;
    
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
        let currentDate = new Date(startDate);
        let currentMonth = -1;
    
        // Generate labels for visible months
        for (let week = 0; week < 53; week++) { // 53 weeks in some years
            const weekDate = new Date(currentDate);
            weekDate.setDate(weekDate.getDate() + (week * 7));
    
            if (weekDate.getMonth() !== currentMonth) {
                currentMonth = weekDate.getMonth();
    
                const monthLabel = document.createElement('div');
                monthLabel.className = 'month-label';
                monthLabel.textContent = months[currentMonth];
                monthLabel.style.left = `${week * 13}px`; // 12px box + 1px gap
                container.appendChild(monthLabel);
            }
        }
    }

    generateHeatmapGrid(container, startDate) {
        const currentDate = new Date(startDate);
        
        // Adjust start date to begin on Sunday
        const dayOfWeek = currentDate.getDay();
        currentDate.setDate(currentDate.getDate() - dayOfWeek);
        
        // Generate 52 weeks × 7 days grid
        for (let week = 0; week < 52; week++) {
            const weekColumn = document.createElement('div');
            weekColumn.className = 'heatmap-week';
            
            for (let day = 0; day < 7; day++) {
                const cellDate = new Date(currentDate);
                cellDate.setDate(cellDate.getDate() + (week * 7) + day);
                
                const dateStr = cellDate.toDateString();
                const activityLevel = this.getActivityLevel(dateStr);
                
                const cell = document.createElement('div');
                cell.className = `heatmap-cell level-${activityLevel}`;
                cell.dataset.date = dateStr;
                cell.title = this.getActivityTooltip(dateStr);
                
                // Add click handler for details
                cell.addEventListener('click', () => {
                    this.showDayDetails(dateStr);
                });
                
                weekColumn.appendChild(cell);
            }
            
            container.appendChild(weekColumn);
        }
    }

    getActivityLevel(dateStr) {
        const activity = this.activityData[dateStr] || 0;
        
        if (activity === 0) return 0;
        if (activity <= 2) return 1;
        if (activity <= 4) return 2;
        if (activity <= 6) return 3;
        return 4; // 7+ activities
    }

    getActivityTooltip(dateStr) {
        const activity = this.activityData[dateStr] || 0;
        const date = new Date(dateStr).toLocaleDateString();
        
        return activity === 0 ? 
            `${date}: No activity` : 
            `${date}: ${activity} training session${activity > 1 ? 's' : ''}`;
    }

    showDayDetails(dateStr) {
        const activity = this.activityData[dateStr] || 0;
        const date = new Date(dateStr).toLocaleDateString();
        const dayGames = this.userData.gameHistory.filter(game => 
            new Date(game.timestamp).toDateString() === dateStr
        );
        
        let details = `📅 ${date}\n\nSessions: ${activity}\n`;
        
        if (dayGames.length > 0) {
            details += '\nGames played:\n';
            dayGames.forEach(game => {
                details += `• ${game.type}: ${game.score} ${game.success ? '✅' : '❌'}\n`;
            });
        }
        
        alert(details);
    }

    /**
     * ENHANCED STREAK TRACKING (maintaining original structure)
     */
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

    // Enhanced game session recording (removed XP logic)
    // recordGameSession(gameType, score) {
    //     const isSuccess = this.determineSuccess(gameType, score);

    //     const gameRecord = {
    //         id: Date.now(),
    //         type: gameType,
    //         success: isSuccess,
    //         timestamp: new Date().toISOString(),
    //         score: score
    //     };

    //     // Update stats (maintaining original structure)
    //     this.userData.stats.totalGames++;
    //     if (isSuccess) {
    //         this.userData.stats.gamesWon++;
    //     }
        
    //     // Update streak
    //     this.updateStreak(isSuccess);
    //     this.updateDailyActivity();
    //     this.updateWeeklyPerformance(isSuccess);
    //     this.checkAndAwardBadges();

    //     // Add to history (keep last 50 games)
    //     this.userData.gameHistory.push(gameRecord);
    //     if (this.userData.gameHistory.length > 50) {
    //         this.userData.gameHistory = this.userData.gameHistory.slice(-50);
    //     }

    //     localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(this.userData));
    //     localStorage.setItem(this.STORAGE_KEYS.GAME_HISTORY, JSON.stringify(this.userData.gameHistory));
    //     this.saveUserData();
    //     this.saveGameHistory();

    //     if (isSuccess) {
    //         this.showNotification('🎉', 'Training Complete!', `Score: ${score}`);
    //     }

    //     // Refresh UI
    //     this.updateActivityFeed();
    //     console.log(`🎮 Game session recorded: ${gameType} - ${isSuccess ? 'Success' : 'Failure'}`);
    // }

    // Enhanced streak update (maintaining original structure)
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

    // Save game history (maintaining original structure)
    saveGameHistory() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.GAME_HISTORY, JSON.stringify(this.userData.gameHistory));
        } catch (error) {
            console.error('❌ Error saving game history:', error);
        }
    }

    // Determine game success (maintaining original structure)
    determineSuccess(gameType, score) {
        const thresholds = {
            'phishing': 3,
            'password': 3,
            'network': 3
        };
        return score >= (thresholds[gameType] || 3);
    }

    // Update daily activity (maintaining original structure)
    updateDailyActivity() {
        const today = new Date().toDateString();
        
        if (!this.activityData[today]) {
            this.activityData[today] = 0;
        }
        
        this.activityData[today]++;
        this.saveActivityData();
    }

    // Save activity data for heatmap
    saveActivityData() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.ACTIVITY_DATA, JSON.stringify(this.activityData));
        } catch (error) {
            console.error('❌ Error saving activity data:', error);
        }
    }

    // Fixed weekly performance update (maintaining original structure)
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

    // Check and award badges (removed XP rewards)
    checkAndAwardBadges() {
        let newBadges = [];

        this.badgeDefinitions.forEach(badge => {
            if (!this.userData.badges.includes(badge.id) && badge.condition(this.userData)) {
                this.userData.badges.push(badge.id);
                newBadges.push(badge);
            }
        });

        if (newBadges.length > 0) {
            const badge = newBadges[0];
            this.showNotification(badge.icon, 'Badge Earned!', badge.name);
        }
    }

    /**
     * DATA MONITORING - Enhanced (maintaining original structure)
     */
    syncEscapeData() {
        try {
            const escapeProgress = localStorage.getItem(this.STORAGE_KEYS.ESCAPE_PROGRESS);
            if (escapeProgress) {
                const progress = JSON.parse(escapeProgress);
                if (progress.score > 0) {
                    this.recordGameSession('escape', progress.score, progress.completed);
                }
            }
        } catch (error) {
            console.error('❌ Error syncing escape data:', error);
        }
    }
    startDataMonitoring() {
        // Run once when the page loads
        this.syncWithAllSystems();
        this.updateAllUI();
    
        // Also listen for changes from other tabs (optional)
        window.addEventListener('storage', (event) => {
            if (event.key === 'ddos_defense_stats') {
                this.syncWithAllSystems();
                this.updateAllUI();
                console.log('🔄 Data synced due to storage update');
            }
        });
    
        console.log('📡 Data monitoring started');
    }

    /**
     * ENHANCED UI UPDATE METHODS (maintaining original structure, removed XP/level updates)
     */
    updateAllUI() {
        this.updateUserStats();
        this.updateProgressBars();
        this.updateBestScores();
        this.updateBadges();
        this.updatePerformanceStats();
        this.updateActivityFeed();
        this.updateLearningProgress();
        this.updateWeeklyChart();
        this.updateDataInfo();
    }

    // Fixed user stats update (removed XP and level displays)
    updateUserStats() {
        const accuracy = this.userData.stats.totalGames > 0 ? Math.round((this.userData.stats.gamesWon / this.userData.stats.totalGames) * 100) : 0;
        this.updateElement('userAccuracy', accuracy + '%');
        this.updateElement('userStreak', this.userData.stats.currentStreak);
        this.updateElement('streakDisplay', this.userData.stats.currentStreak);
    }

    // Fixed progress bars (maintaining original structure)
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

    // Fixed best scores display (maintaining original structure)
    updateBestScores() {
        const bestScores = this.userData.bestScores;

        this.updateElement('bestPhishingScore', `${bestScores.phishing.score}/5`);
        this.updateElement('bestPhishingDate', bestScores.phishing.date ? this.formatDate(bestScores.phishing.date) : 'Never played');

        this.updateElement('bestPasswordScore', `${bestScores.password.score}/5`);
        this.updateElement('bestPasswordDate', bestScores.password.date ? this.formatDate(bestScores.password.date) : 'Never played');

        this.updateElement('bestNetworkScore', `${bestScores.network.score}/4`);
        this.updateElement('bestNetworkDate', bestScores.network.date ? this.formatDate(bestScores.network.date) : 'Never played');

        this.updateElement('bestDdosScore', `${Math.round(bestScores.ddos.effectiveness)}%`);
        this.updateElement('bestDdosDate', bestScores.ddos.date ? this.formatDate(bestScores.ddos.date) : 'Never played');
    }

    // Fixed badges display (maintaining original structure)
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

    // Fixed performance stats (maintaining original structure)
    updatePerformanceStats() {
        this.updateElement('totalGames', this.userData.stats.totalGames);
        this.updateElement('gamesWon', this.userData.stats.gamesWon);
        const winRate = this.userData.stats.totalGames > 0 ? Math.round((this.userData.stats.gamesWon / this.userData.stats.totalGames) * 100) : 0;
        this.updateElement('winRate', winRate + '%');
        this.updateElement('longestStreak', this.userData.stats.longestStreak);
        this.updateElement('totalBadges', this.userData.badges.length);
        this.updateElement('commandsLearned', this.userData.stats.commandsLearned);
    }

    // Fixed activity feed (removed XP display)
    updateActivityFeed() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        const recentGames = this.userData.gameHistory.slice(-10).reverse();

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
            const activityEl = document.createElement('div');
            activityEl.className = 'activity-item';

            const icon = this.getGameIcon(game.type);
            const timeAgo = this.getTimeAgo(new Date(game.timestamp));
            const statusIcon = game.success ? '✅' : '❌';

            activityEl.innerHTML = `
                <div class="activity-icon">${icon}</div>
                <div class="activity-content">
                    <div class="activity-title">${this.capitalize(game.type)} Training ${statusIcon}</div>
                    
                </div>
                <div class="activity-time">${timeAgo}</div>
            `;

            activityList.appendChild(activityEl);
        });
    }

    // Update learning progress (maintaining original structure)
    updateLearningProgress() {
        const completed = this.userData.stats.commandsLearned;
        const total = 30;
        const percent = Math.min(100, (completed / total) * 100);
        
        this.updateElement('commandsCompleted', completed);
        
        const progressEl = document.getElementById('terminalProgress');
        if (progressEl) {
            progressEl.style.width = percent + '%';
        }
    }

    // Update weekly chart (maintaining original structure)
    updateWeeklyChart() {
        const container = document.getElementById('weeklyChart');
        if (!container) return;

        container.innerHTML = '';

        const maxHeight = 60;
        this.userData.weeklyPerformance.forEach((performance, index) => {
            const barHeight = Math.max(2, (performance / 100) * maxHeight);
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = barHeight + 'px';
            bar.setAttribute('data-value', Math.round(performance) + '%');
            
            container.appendChild(bar);
        });

        // Update weekly average
        const weeklyAvg = Math.round(this.userData.weeklyPerformance.reduce((a, b) => a + b, 0) / 7);
        this.updateElement('weeklyAverage', weeklyAvg + '%');
    }

    // Update data info (maintaining original structure)
    updateDataInfo() {
        this.updateElement('joinDate', new Date(this.userData.profile.joinDate).toLocaleDateString());
        this.updateElement('sessionCount', this.userData.profile.sessionsCount);
        
        const totalMinutes = Math.floor((Date.now() - new Date(this.userData.profile.joinDate).getTime()) / (1000 * 60));
        this.updateElement('totalTime', totalMinutes + ' minutes');
        
        const dataSize = this.calculateStorageSize();
        this.updateElement('dataSize', this.formatBytes(dataSize));
    }

    /**
     * EVENT LISTENERS AND UI INTERACTIONS
     */
    setupEventListeners() {
        // Heatmap navigation
        const heatmapPrev = document.getElementById('heatmapPrev');
        const heatmapNext = document.getElementById('heatmapNext');
        
        if (heatmapPrev) {
            heatmapPrev.addEventListener('click', () => {
                this.currentYear--;
                this.generateGitHubHeatmap();
            });
        }
        
        if (heatmapNext) {
            heatmapNext.addEventListener('click', () => {
                this.currentYear++;
                this.generateGitHubHeatmap();
            });
        }

        // Data management buttons
        const exportBtn = document.getElementById('exportData');
        const backupBtn = document.getElementById('backupData');
        const resetBtn = document.getElementById('resetData');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        
        if (backupBtn) {
            backupBtn.addEventListener('click', () => this.backupData());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetData());
        }
    }

    /**
     * SESSION TRACKING (maintaining original structure)
     */
    startSessionTracking() {
        this.sessionStartTime = Date.now();
        
        // Save session data on page unload
        window.addEventListener('beforeunload', () => {
            const sessionTime = Date.now() - this.sessionStartTime;
            this.userData.profile.totalSessionTime += sessionTime;
            this.saveUserData();
        });

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                const sessionTime = Date.now() - this.sessionStartTime;
                this.userData.profile.totalSessionTime += sessionTime;
                this.saveUserData();
            } else {
                this.sessionStartTime = Date.now();
            }
        });
    }

    // Save user data (maintaining original structure)
    saveUserData() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(this.userData));
        } catch (error) {
            console.error('❌ Error saving user data:', error);
        }
    }

    /**
     * MATRIX BACKGROUND (maintaining original visual)
     */
    initializeMatrixBackground() {
        const canvas = document.getElementById('matrix-background');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#00ff41';
            ctx.font = fontSize + 'px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        
        setInterval(draw, 33);
    }

    /**
     * DATA MANAGEMENT FUNCTIONS
     */
    exportData() {
        const exportData = {
            version: '2.0',
            exportDate: new Date().toISOString(),
            userData: this.userData,
            activityData: this.activityData
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `cyberguard-progress-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
        this.showNotification('✅', 'Export Complete', 'Progress data exported successfully!');
    }

    backupData() {
        this.exportData();
        this.showNotification('💾', 'Backup Created', 'Complete backup saved!');
    }

    resetData() {
        if (confirm('⚠️ WARNING: This will permanently delete ALL progress!\n\nThis action cannot be undone. Continue?')) {
            // Clear all localStorage data
            Object.values(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            
            // Reset internal data
            this.userData = { ...this.defaultUserData };
            this.activityData = {};
            
            // Update UI
            this.updateAllUI();
            this.generateGitHubHeatmap();
            
            this.showNotification('🔄', 'Reset Complete', 'All progress cleared. Starting fresh!');
        }
    }

    /**
     * UTILITY METHODS (maintaining original functionality)
     */
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    formatDate(dateString) {
        return dateString ? new Date(dateString).toLocaleDateString() : 'Never';
    }

    getGameIcon(gameType) {
        const icons = {
            phishing: '🎣',
            password: '🔐',
            network: '🛡️',
            ddos: '🚫',
            captcha: '🤖',
            escape: '🔓'
        };
        return icons[gameType] || '🎮';
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    calculateStorageSize() {
        let totalSize = 0;
        Object.values(this.STORAGE_KEYS).forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                totalSize += data.length * 2;
            }
        });
        return totalSize;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 KB';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    showNotification(icon, title, message) {
        console.log(`${icon} ${title}: ${message}`);
        
        // Show achievement notification if available
        const notification = document.getElementById('achievement-notification');
        if (notification) {
            const iconEl = document.getElementById('achievement-icon');
            const titleEl = document.getElementById('achievement-title');
            const descEl = document.getElementById('achievement-description');

            if (iconEl && titleEl && descEl) {
                iconEl.textContent = icon;
                titleEl.textContent = title;
                descEl.textContent = message;

                notification.classList.remove('hidden');

                setTimeout(() => {
                    notification.classList.add('hidden');
                }, 5000);
            }
        }
    }
}

// Global dashboard instance
let dashboard;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new CompleteCyberSecurityDashboard();
    
    // Make dashboard globally accessible for other scripts
    window.cyberDashboard = dashboard;
    
    console.log('🎯 Enhanced CyberSecurity Dashboard Ready! (No XP/Level System)');
});

// Handle page unload to save data
window.addEventListener('beforeunload', () => {
    if (dashboard) {
        dashboard.saveUserData();
    }
});

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  // Toggle on hamburger click
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("show");
  });

  // Close on nav link click
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("show");
    });
  });

