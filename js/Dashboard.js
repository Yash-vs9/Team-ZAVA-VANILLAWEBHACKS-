/**
 * CYBERSECURITY DASHBOARD - PERFECT VERSION
 * 
 * This dashboard uses localStorage to persist all user data across sessions.
 * It includes advanced features like XP tooltips, activity calendar, streak tracking,
 * performance analytics, and much more.
 * 
 * EXPLANATION OF FEATURES:
 * 1. DATA PERSISTENCE: All data is saved to localStorage automatically
 * 2. XP SYSTEM: Hover over XP to see level progress with visual bar
 * 3. STREAK SYSTEM: Daily streak tracking with calendar visualization
 * 4. ACTIVITY FEED: Real-time feed of user achievements and actions
 * 5. PERFORMANCE ANALYTICS: Visual charts showing progress over time
 * 6. BADGE SYSTEM: 8 different badges that unlock based on achievements
 * 7. DATA MANAGEMENT: Export/import functionality for user data
 */

class CyberSecurityDashboard {
    constructor() {
        // localStorage keys for different data types
        this.STORAGE_KEYS = {
            USER_DATA: 'cyberguard_user_data',
            STREAK_DATA: 'cyberguard_streak_data', 
            ACTIVITY_LOG: 'cyberguard_activity_log',
            SETTINGS: 'cyberguard_settings'
        };

        // Default user data structure
        this.defaultUserData = {
            profile: {
                username: 'Cyber Agent',
                joinDate: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                totalSessionTime: 0, // in seconds
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
            progress: {
                phishingScore: 0,     // max 10
                passwordScore: 0,     // max 5  
                networkScore: 0       // max 20
            },
            badges: [], // Array of earned badge IDs
            gameHistory: [] // Array of game completion records
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
     * Sets up the dashboard, loads data, and starts all systems
     */
    init() {
        console.log('🚀 Initializing CyberGuard Dashboard...');
        
        // Load all data from localStorage
        this.loadAllData(); 
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update all UI elements
        this.updateAllUI();
        
        // Generate calendar
        this.generateCalendar();
        
        // Start session tracking
        this.startSessionTracking();
        
        // Check and update daily streak
        this.checkDailyActivity();
        
        console.log('✅ Dashboard initialized successfully!');
    }

    /**
     * DATA MANAGEMENT METHODS
     * Handle loading, saving, and managing all user data
     */
    
    // Load all data from localStorage
    loadAllData() {
        try {
            // Load main user data
            const storedData = localStorage.getItem(this.STORAGE_KEYS.USER_DATA);
            if (storedData) {
                this.userData = { ...this.defaultUserData, ...JSON.parse(storedData) };
                // Update last login time
                this.userData.profile.lastLogin = new Date().toISOString();
                this.userData.profile.sessionsCount++;
            } else {
                this.userData = { ...this.defaultUserData };
            }
            
            console.log('📊 User data loaded:', this.userData);
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.userData = { ...this.defaultUserData };
        }
    }

    // Save user data to localStorage
    saveUserData() {
        try {
            localStorage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(this.userData));
            console.log('💾 User data saved successfully');
        } catch (error) {
            console.error('❌ Error saving data:', error);
        }
    }

    // Load streak data from localStorage
    loadStreakData() {
        try {
            const streakData = localStorage.getItem(this.STORAGE_KEYS.STREAK_DATA);
            return streakData ? JSON.parse(streakData) : { 
                lastActivityDate: null, 
                activityDates: [] // Array of date strings when user was active
            };
        } catch (error) {
            console.error('❌ Error loading streak data:', error);
            return { lastActivityDate: null, activityDates: [] };
        }
    }

    // Save streak data to localStorage
    saveStreakData(streakData) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));
            console.log('🔥 Streak data saved');
        } catch (error) {
            console.error('❌ Error saving streak data:', error);
        }
    }

    // Load activity log from localStorage
    loadActivityLog() {
        try {
            const activityLog = localStorage.getItem(this.STORAGE_KEYS.ACTIVITY_LOG);
            return activityLog ? JSON.parse(activityLog) : [];
        } catch (error) {
            console.error('❌ Error loading activity log:', error);
            return [];
        }
    }

    // Save activity log to localStorage
    saveActivityLog(activities) {
        try {
            // Keep only the last 100 activities to prevent storage bloat
            const trimmedActivities = activities.slice(-100);
            localStorage.setItem(this.STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(trimmedActivities));
            console.log('📝 Activity log saved');
        } catch (error) {
            console.error('❌ Error saving activity log:', error);
        }
    }

    /**
     * GAME COMPLETION SYSTEM  
     * Handle when user completes training games
     */
    
    // Simulate game completion (called by demo buttons)
    completeGame(gameType, isSuccess) {
        console.log(`🎮 Game completed: ${gameType}, Success: ${isSuccess}`);
        
        const gameRecord = {
            id: Date.now(),
            type: gameType,
            success: isSuccess,
            timestamp: new Date().toISOString(),
            xpEarned: isSuccess ? this.calculateXPReward(gameType) : 0
        };

        // Add to game history
        this.userData.gameHistory.push(gameRecord);
        
        // Update stats
        this.userData.stats.totalGames++;
        if (isSuccess) {
            this.userData.stats.correctAnswers++;
            this.userData.stats.xp += gameRecord.xpEarned;
            
            // Update specific progress
            this.updateGameProgress(gameType);
        }

        // Update level based on XP
        this.updateLevel();
        
        // Check for new badges
        this.checkAndAwardBadges();
        
        // Update daily activity and streak
        this.updateDailyActivity();
        
        // Add to activity log
        this.addActivity({
            type: 'game',
            icon: isSuccess ? '✅' : '❌',
            title: `${gameType.charAt(0).toUpperCase() + gameType.slice(1)} Training`,
            description: isSuccess ? `Completed successfully (+${gameRecord.xpEarned} XP)` : 'Failed - Keep practicing!',
            timestamp: new Date().toISOString()
        });

        // Save all data
        this.saveUserData();
        
        // Update UI
        this.updateAllUI();
        
        // Show notification for successful completion
        if (isSuccess) {
            this.showNotification('🎉', 'Training Complete!', `Great job! You earned ${gameRecord.xpEarned} XP`);
        }
    }

    // Calculate XP reward based on game type
    calculateXPReward(gameType) {
        const baseRewards = {
            'phishing': 25,
            'password': 30,
            'network': 35
        };
        
        // Add bonus XP for streak
        const streakBonus = Math.min(this.userData.stats.currentStreak * 2, 20);
        
        return baseRewards[gameType] + streakBonus;
    }

    // Update progress for specific game type
    updateGameProgress(gameType) {
        switch(gameType) {
            case 'phishing':
                if (this.userData.progress.phishingScore < 10) {
                    this.userData.progress.phishingScore++;
                }
                break;
            case 'password':
                if (this.userData.progress.passwordScore < 5) {
                    this.userData.progress.passwordScore++;
                }
                break;
            case 'network':
                if (this.userData.progress.networkScore < 20) {
                    this.userData.progress.networkScore++;
                }
                break;
        }
    }

    // Update user level based on XP
    updateLevel() {
        const newLevel = Math.floor(this.userData.stats.xp / 500) + 1;
        
        if (newLevel > this.userData.stats.level) {
            const oldLevel = this.userData.stats.level;
            this.userData.stats.level = newLevel;
            
            // Add level up activity
            this.addActivity({
                type: 'level',
                icon: '🎉',
                title: 'Level Up!',
                description: `Congratulations! You reached level ${newLevel}`,
                timestamp: new Date().toISOString()
            });
            
            // Show notification
            this.showNotification('🎉', 'Level Up!', `Welcome to level ${newLevel}!`);
            
            console.log(`📈 Level up: ${oldLevel} → ${newLevel}`);
        }
    }

    /**
     * BADGE SYSTEM
     * Check conditions and award badges to users
     */
    
    checkAndAwardBadges() {
        let newBadges = [];
        
        this.badgeDefinitions.forEach(badge => {
            // Check if badge is not already earned and condition is met
            if (!this.userData.badges.includes(badge.id) && badge.condition(this.userData)) {
                this.userData.badges.push(badge.id);
                newBadges.push(badge);
                
                // Add activity for new badge
                this.addActivity({
                    type: 'badge',
                    icon: badge.icon,
                    title: 'Badge Earned!',
                    description: `"${badge.name}" - ${badge.description}`,
                    timestamp: new Date().toISOString()
                });
                
                // Award bonus XP for badge
                this.userData.stats.xp += 100;
                
                console.log(`🏆 New badge earned: ${badge.name}`);
            }
        });
        
        // Show notification for new badges
        if (newBadges.length > 0) {
            const badge = newBadges[0]; // Show first badge if multiple
            this.showNotification(badge.icon, 'Badge Earned!', `"${badge.name}" unlocked!`);
        }
        
        return newBadges;
    }

    /**
     * STREAK SYSTEM
     * Handle daily activity tracking and streak calculation
     */
    
    // Check and update daily activity
    checkDailyActivity() {
        const today = new Date().toDateString();
        const streakData = this.loadStreakData();
        
        // If this is a new day and user hasn't been active today
        if (streakData.lastActivityDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            // Check if streak should continue or reset
            if (streakData.lastActivityDate === yesterday.toDateString()) {
                // Streak continues - will be updated when user completes a game
                console.log('🔥 Streak can continue today');
            } else if (streakData.lastActivityDate !== null) {
                // Streak is broken - reset to 0
                this.userData.stats.currentStreak = 0;
                console.log('💔 Streak broken - reset to 0');
            }
        }
    }

    // Update daily activity when user completes a game
    updateDailyActivity() {
        const today = new Date().toDateString();
        const streakData = this.loadStreakData();
        
        // If user hasn't been active today yet
        if (streakData.lastActivityDate !== today) {
            // Add today to activity dates
            if (!streakData.activityDates.includes(today)) {
                streakData.activityDates.push(today);
            }
            
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            // Update streak
            if (streakData.lastActivityDate === yesterday.toDateString()) {
                // Continue streak
                this.userData.stats.currentStreak++;
            } else {
                // Start new streak
                this.userData.stats.currentStreak = 1;
            }
            
            // Update longest streak
            if (this.userData.stats.currentStreak > this.userData.stats.longestStreak) {
                this.userData.stats.longestStreak = this.userData.stats.currentStreak;
            }
            
            streakData.lastActivityDate = today;
            this.saveStreakData(streakData);
            
            // Add streak activity if it's a milestone
            if (this.userData.stats.currentStreak % 5 === 0 && this.userData.stats.currentStreak > 0) {
                this.addActivity({
                    type: 'streak',
                    icon: '🔥',
                    title: 'Streak Milestone!',
                    description: `${this.userData.stats.currentStreak} day streak achieved!`,
                    timestamp: new Date().toISOString()
                });
            }
            
            console.log(`🔥 Streak updated: ${this.userData.stats.currentStreak} days`);
        }
    }

    /**
     * ACTIVITY LOG SYSTEM
     * Track and display user activities
     */
    
    // Add new activity to log
    addActivity(activity) {
        const activities = this.loadActivityLog();
        
        const newActivity = {
            id: Date.now(),
            ...activity
        };
        
        activities.push(newActivity);
        this.saveActivityLog(activities);
        
        console.log('📝 Activity added:', newActivity);
    }

    /**
     * CALENDAR SYSTEM
     * Generate and manage the activity calendar
     */
    
    generateCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const monthYearDisplay = document.getElementById('currentMonthYear');
        
        if (!calendarGrid || !monthYearDisplay) return;
        
        // Use current date if not set
        if (!this.currentCalendarDate) {
            this.currentCalendarDate = new Date();
        }
        
        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();
        
        // Update month/year display
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        monthYearDisplay.textContent = `${months[month]} ${year}`;
        
        // Clear calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            calendarGrid.appendChild(header);
        });
        
        // Get calendar info
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date().toDateString();
        
        // Load activity dates
        const streakData = this.loadStreakData();
        const activityDates = streakData.activityDates || [];
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const dayDate = new Date(year, month, day).toDateString();
            
            // Check if it's today
            if (dayDate === today) {
                dayElement.classList.add('today');
            }
            
            // Check if user was active on this day
            if (activityDates.includes(dayDate)) {
                dayElement.classList.add('has-activity');
                
                // Add streak indicator
                const streakBadge = document.createElement('div');
                streakBadge.className = 'streak-badge';
                dayElement.appendChild(streakBadge);
            }
            
            calendarGrid.appendChild(dayElement);
        }
        
        console.log('📅 Calendar generated for', months[month], year);
    }

    /**
     * UI UPDATE METHODS
     * Update all dashboard elements with current data
     */
    
    updateAllUI() {
        this.updateUserStats();
        this.updateProgressBars();
        this.updateBadges();
        this.updateActivityFeed();
        this.updatePerformanceGraph();
        this.updateDataInfo();
        
        console.log('🔄 UI updated');
    }

    // Update user statistics display
    updateUserStats() {
        document.getElementById('userLevel').textContent = this.userData.stats.level;
        document.getElementById('userXP').textContent = this.userData.stats.xp.toLocaleString();
        
        // Calculate and display accuracy
        const accuracy = this.userData.stats.totalGames > 0 
            ? Math.round((this.userData.stats.correctAnswers / this.userData.stats.totalGames) * 100)
            : 0;
        document.getElementById('userAccuracy').textContent = accuracy + '%';
        
        document.getElementById('userStreak').textContent = this.userData.stats.currentStreak;
        document.getElementById('streakDisplay').textContent = this.userData.stats.currentStreak;
        
        // Update performance stats
        document.getElementById('totalGames').textContent = this.userData.stats.totalGames;
        document.getElementById('correctAnswers').textContent = this.userData.stats.correctAnswers;
        document.getElementById('longestStreak').textContent = this.userData.stats.longestStreak;
        document.getElementById('totalBadges').textContent = this.userData.badges.length;
    }

    // Update progress bars
    updateProgressBars() {
        // Phishing progress
        const phishingPercent = (this.userData.progress.phishingScore / 10) * 100;
        document.getElementById('phishingProgress').style.width = phishingPercent + '%';
        document.getElementById('phishingScore').textContent = `${this.userData.progress.phishingScore}/10`;
        
        // Password progress  
        const passwordPercent = (this.userData.progress.passwordScore / 5) * 100;
        document.getElementById('passwordProgress').style.width = passwordPercent + '%';
        document.getElementById('passwordScore').textContent = `${this.userData.progress.passwordScore}/5`;
        
        // Network progress
        const networkPercent = (this.userData.progress.networkScore / 20) * 100;
        document.getElementById('networkProgress').style.width = networkPercent + '%';
        document.getElementById('networkScore').textContent = `${this.userData.progress.networkScore}/20`;
    }

    // Update badges display
    updateBadges() {
        const badgesContainer = document.getElementById('badgesContainer');
        if (!badgesContainer) return;
        
        badgesContainer.innerHTML = '';
        
        this.badgeDefinitions.forEach(badge => {
            const isEarned = this.userData.badges.includes(badge.id);
            
            const badgeElement = document.createElement('div');
            badgeElement.className = 'badge';
            badgeElement.title = badge.description;
            
            if (isEarned) {
                badgeElement.classList.add('earned');
            } else {
                badgeElement.style.opacity = '0.3';
                badgeElement.style.filter = 'grayscale(100%)';
            }
            
            badgeElement.innerHTML = `
                <div style="font-size: 1.5rem; margin-bottom: 4px;">${badge.icon}</div>
                <div style="font-size: 0.7rem; font-weight: 600; text-align: center; line-height: 1.2;">
                    ${badge.name}
                </div>
            `;
            
            badgesContainer.appendChild(badgeElement);
        });
    }

    // Update activity feed
    updateActivityFeed() {
        const activityFeed = document.getElementById('activityFeed');
        if (!activityFeed) return;
        
        const activities = this.loadActivityLog();
        const recentActivities = activities.slice(-10).reverse(); // Last 10, newest first
        
        if (recentActivities.length === 0) {
            activityFeed.innerHTML = `
                <div style="text-align: center; color: #666; padding: 40px 20px;">
                    <div style="font-size: 2rem; margin-bottom: 8px;">🎯</div>
                    <div>Complete your first training to see activity here!</div>
                </div>
            `;
            return;
        }
        
        activityFeed.innerHTML = '';
        
        recentActivities.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item animate-slide-in';
            
            const timeAgo = this.getTimeAgo(new Date(activity.timestamp));
            
            activityElement.innerHTML = `
                <div class="activity-icon ${activity.type}">
                    ${activity.icon}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 500; color: #fff;">${activity.title}</div>
                    <div style="font-size: 0.85rem; color: #bbb; margin-top: 2px;">${activity.description}</div>
                    <div style="font-size: 0.75rem; color: #666; margin-top: 4px;">${timeAgo}</div>
                </div>
            `;
            
            activityFeed.appendChild(activityElement);
        });
    }

    // Update performance graph
    updatePerformanceGraph() {
        const graphContainer = document.getElementById('performanceGraph');
        if (!graphContainer) return;
        
        graphContainer.innerHTML = '';
        
        // Get last 7 days of data
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push(date.toDateString());
        }
        
        // Calculate daily accuracy
        const dailyAccuracy = last7Days.map(dateStr => {
            const dayGames = this.userData.gameHistory.filter(game => {
                const gameDate = new Date(game.timestamp).toDateString();
                return gameDate === dateStr;
            });
            
            if (dayGames.length === 0) return 0;
            
            const successfulGames = dayGames.filter(game => game.success).length;
            return Math.round((successfulGames / dayGames.length) * 100);
        });
        
        // Create bars
        dailyAccuracy.forEach((accuracy, index) => {
            const bar = document.createElement('div');
            bar.className = 'graph-bar';
            bar.style.height = Math.max(10, accuracy) + '%';
            bar.setAttribute('data-value', accuracy + '%');
            bar.title = `Day ${index + 1}: ${accuracy}% accuracy`;
            
            graphContainer.appendChild(bar);
        });
    }

    // Update data management info
    updateDataInfo() {
        // Calculate data size
        const dataSize = new Blob([JSON.stringify(this.userData)]).size;
        document.getElementById('dataSize').textContent = `${(dataSize / 1024).toFixed(1)} KB`;
        
        // Format join date
        const joinDate = new Date(this.userData.profile.joinDate);
        document.getElementById('joinDate').textContent = joinDate.toLocaleDateString();
        
        // Calculate total time
        const totalMinutes = Math.floor(this.userData.profile.totalSessionTime / 60);
        document.getElementById('totalTime').textContent = `${totalMinutes} minutes`;
    }

    /**
     * EVENT LISTENERS
     * Set up all interactive elements
     */
    
    setupEventListeners() {
        // XP Hover Tooltip
        const xpHoverArea = document.getElementById('xpHoverArea');
        const xpTooltip = document.getElementById('xpTooltip');
        
        if (xpHoverArea && xpTooltip) {
            xpHoverArea.addEventListener('mouseenter', (e) => this.showXPTooltip(e));
            xpHoverArea.addEventListener('mouseleave', () => this.hideXPTooltip());
            xpHoverArea.addEventListener('mousemove', (e) => this.updateTooltipPosition(e));
        }
        
        // Calendar navigation
        document.getElementById('prevMonth')?.addEventListener('click', () => this.changeCalendarMonth(-1));
        document.getElementById('nextMonth')?.addEventListener('click', () => this.changeCalendarMonth(1));
        
        // Data management buttons
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportData());
        document.getElementById('resetBtn')?.addEventListener('click', () => this.resetAllData());
        
        console.log('👂 Event listeners set up');
    }

    // Show XP tooltip on hover
    showXPTooltip(event) {
        const tooltip = document.getElementById('xpTooltip');
        const currentLevel = this.userData.stats.level;
        const currentXP = this.userData.stats.xp;
        const xpForCurrentLevel = (currentLevel - 1) * 500;
        const xpForNextLevel = currentLevel * 500;
        const xpInCurrentLevel = currentXP - xpForCurrentLevel;
        const xpNeededForNext = xpForNextLevel - currentXP;
        const progressPercent = (xpInCurrentLevel / 500) * 100;
        
        // Update tooltip content
        document.getElementById('tooltipLevels').textContent = `Level ${currentLevel} → ${currentLevel + 1}`;
        document.getElementById('tooltipCurrentXP').textContent = currentXP.toLocaleString();
        document.getElementById('tooltipNeededXP').textContent = xpNeededForNext.toLocaleString();
        document.getElementById('tooltipProgressBar').style.width = progressPercent + '%';
        
        // Position and show tooltip
        this.updateTooltipPosition(event);
        tooltip.classList.add('show');
    }

    // Hide XP tooltip
    hideXPTooltip() {
        const tooltip = document.getElementById('xpTooltip');
        tooltip.classList.remove('show');
    }

    // Update tooltip position
    updateTooltipPosition(event) {
        const tooltip = document.getElementById('xpTooltip');
        tooltip.style.left = (event.pageX + 15) + 'px';
        tooltip.style.top = (event.pageY - 10) + 'px';
    }

    // Change calendar month
    changeCalendarMonth(direction) {
        if (!this.currentCalendarDate) {
            this.currentCalendarDate = new Date();
        }
        
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + direction);
        this.generateCalendar();
    }

    /**
     * NOTIFICATION SYSTEM
     * Show toast notifications for achievements
     */
    
    showNotification(icon, title, message) {
        const toast = document.getElementById('notificationToast');
        
        document.getElementById('notificationIcon').textContent = icon;
        document.getElementById('notificationTitle').textContent = title;
        document.getElementById('notificationMessage').textContent = message;
        
        toast.classList.add('show');
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
        
        console.log('📢 Notification shown:', title, message);
    }

    /**
     * DATA MANAGEMENT METHODS
     * Export and reset functionality
     */
    
    // Export all user data
    exportData() {
        const exportData = {
            userData: this.userData,
            streakData: this.loadStreakData(),
            activityLog: this.loadActivityLog(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cyberguard-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('📊', 'Data Exported', 'Your progress has been downloaded as JSON file');
        
        console.log('💾 Data exported successfully');
    }

    // Reset all user data
    resetAllData() {
        if (confirm('⚠️ This will delete ALL your progress permanently. Are you absolutely sure?')) {
            // Clear all localStorage data
            Object.values(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            
            // Reset to default data
            this.userData = { ...this.defaultUserData };
            this.saveUserData();
            
            // Update UI
            this.updateAllUI();
            this.generateCalendar();
            
            this.showNotification('🔄', 'Data Reset', 'All progress has been cleared');
            
            console.log('🗑️ All data reset');
        }
    }

    /**
     * SESSION TRACKING
     * Track time spent in application
     */
    
    startSessionTracking() {
        this.sessionStartTime = Date.now();
        
        // Update session time every 30 seconds
        this.sessionInterval = setInterval(() => {
            this.userData.profile.totalSessionTime += 30;
            
            // Save data every 2 minutes
            if (this.userData.profile.totalSessionTime % 120 === 0) {
                this.saveUserData();
            }
        }, 30000);
        
        // Save data when page is about to close
        window.addEventListener('beforeunload', () => {
            const sessionDuration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
            this.userData.profile.totalSessionTime += sessionDuration;
            this.saveUserData();
        });
        
        console.log('⏱️ Session tracking started');
    }

    /**
     * UTILITY METHODS
     * Helper functions
     */
    
    // Get human-readable time ago string
    getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffDays > 0) return `${diffDays}d ago`;
        if (diffHours > 0) return `${diffHours}h ago`;
        if (diffMins > 0) return `${diffMins}m ago`;
        return 'Just now';
    }
}

/**
 * GLOBAL FUNCTIONS
 * Functions that can be called from demo buttons
 */

// Global instance of dashboard
let dashboardInstance;

// Function to complete a game (called by demo buttons)
function completeGame(gameType, isSuccess) {
    if (dashboardInstance) {
        dashboardInstance.completeGame(gameType, isSuccess);
    }
}

/**
 * INITIALIZATION
 * Start the dashboard when page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 CyberGuard Dashboard Starting...');
    
    // Create dashboard instance
    dashboardInstance = new CyberSecurityDashboard();
    
    // Make it globally accessible for demo
    window.dashboard = dashboardInstance;
    
    console.log('✨ Dashboard ready! Use demo controls to test features.');
});