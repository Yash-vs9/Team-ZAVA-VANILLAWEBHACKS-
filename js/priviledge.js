// Privilege Escalation Security Demonstration
class PrivilegeEscalationDemo {
    constructor() {
        // Application data from provided JSON
        this.installationSteps = [
            {"text": "Initializing installer...", "duration": 1000},
            {"text": "Extracting application files...", "duration": 1500},
            {"text": "Installing core components...", "duration": 2000},
            {"text": "Requesting system permissions...", "duration": 1500, "critical": true},
            {"text": "Escalating privileges...", "duration": 2000, "critical": true},
            {"text": "Installing monitoring hooks...", "duration": 1800, "critical": true},
            {"text": "Registering system services...", "duration": 1200},
            {"text": "Installation completed successfully!", "duration": 1000}
        ];

        this.terminalMessages = [
            "[SYSTEM] PRIVILEGE_MONITOR v2.1 - System Access Granted",
            "[SYSTEM] Hooking keyboard input... SUCCESS",
            "[SYSTEM] Hooking clipboard access... SUCCESS", 
            "[SYSTEM] Monitoring file system... SUCCESS",
            "[SYSTEM] Process monitoring enabled... SUCCESS",
            "[INFO] All monitoring systems online",
            "[INFO] Target user session: active"
        ];

        this.sensitivePatterns = [
            {"pattern": "password", "alert": "SENSITIVE_DATA_DETECTED: Password pattern found"},
            {"pattern": "credit", "alert": "SENSITIVE_DATA_DETECTED: Financial information detected"},
            {"pattern": "ssn", "alert": "SENSITIVE_DATA_DETECTED: Social security number pattern"},
            {"pattern": "bank", "alert": "SENSITIVE_DATA_DETECTED: Banking information detected"},
            {"pattern": "secret", "alert": "SENSITIVE_DATA_DETECTED: Secret information detected"}
        ];

        this.monitoringActivities = [
            "FILE_ACCESS: C:\\Users\\John\\Documents\\personal.txt",
            "CLIPBOARD_ACCESS: User copied sensitive text",
            "NETWORK_ACCESS: Connection to banking.com detected", 
            "PROCESS_START: notepad.exe launched by user",
            "REGISTRY_CHANGE: Security settings modified",
            "WEBCAM_ACCESS: Camera device initialized",
            "MICROPHONE_ACCESS: Audio recording started"
        ];

        this.educationalTips = [
            "This demonstrates how malware can monitor your every keystroke",
            "Privilege escalation allows complete system access",
            "Always be cautious when granting admin permissions",
            "Keep your system updated to prevent exploitation",
            "Use reputable antivirus software",
            "Only install software from trusted sources"
        ];

        // Application state
        this.currentScreen = 'intro';
        this.installationStep = 0;
        this.isInstalling = false;
        this.keylogBuffer = '';
        this.terminalLines = [];
        this.currentEducationStep = 1;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showScreen('introScreen');
    }

    setupEventListeners() {
        // Start demo button
        const startBtn = document.getElementById('startDemoBtn');
        if (startBtn) startBtn.addEventListener('click', this.startInstallation.bind(this));

        // UAC buttons
        const uacAllow = document.getElementById('uacAllow');
        const uacDeny = document.getElementById('uacDeny');
        if (uacAllow) uacAllow.addEventListener('click', this.allowUAC.bind(this));
        if (uacDeny) uacDeny.addEventListener('click', this.denyUAC.bind(this));

        // Tab switching
        const notepadTab = document.getElementById('notepadTab');
        const terminalTab = document.getElementById('terminalTab');
        if (notepadTab) notepadTab.addEventListener('click', () => this.switchTab('notepad'));
        if (terminalTab) terminalTab.addEventListener('click', () => this.switchTab('terminal'));

        // Notepad input
        const notepadInput = document.getElementById('notepadInput');
        if (notepadInput) {
            notepadInput.addEventListener('input', this.handleKeystroke.bind(this));
            notepadInput.addEventListener('keydown', this.handleKeyDown.bind(this));
        }

        // Activity buttons
        const copyBtn = document.getElementById('copyBtn');
        const fileBtn = document.getElementById('fileBtn');
        const webBtn = document.getElementById('webBtn');
        
        if (copyBtn) copyBtn.addEventListener('click', () => this.simulateActivity('copy'));
        if (fileBtn) fileBtn.addEventListener('click', () => this.simulateActivity('file'));
        if (webBtn) webBtn.addEventListener('click', () => this.simulateActivity('web'));

        // Summary buttons
        const restartBtn = document.getElementById('restartBtn');
        const summaryBtn = document.getElementById('summaryBtn');
        
        if (restartBtn) restartBtn.addEventListener('click', this.restartDemo.bind(this));
        if (summaryBtn) summaryBtn.addEventListener('click', this.showSummary.bind(this));
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
            targetScreen.classList.add('fade-in');
        }

        this.currentScreen = screenId;
    }

    startInstallation() {
        this.showScreen('installerScreen');
        
        // Reset installation state
        this.installationStep = 0;
        this.isInstalling = true;
        
        // Start installation animation
        this.runInstallationStep();
    }

    runInstallationStep() {
        if (this.installationStep >= this.installationSteps.length) {
            this.completeInstallation();
            return;
        }

        const step = this.installationSteps[this.installationStep];
        const progress = ((this.installationStep + 1) / this.installationSteps.length) * 100;

        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const progressPercentage = document.getElementById('progressPercentage');

        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = step.text;
        if (progressPercentage) progressPercentage.textContent = `${Math.round(progress)}%`;

        // Add to log
        this.addLogEntry(step.text, step.critical);

        // Show UAC prompt for permission request step
        if (step.text.includes('Requesting system permissions')) {
            setTimeout(() => {
                this.showUACPrompt();
            }, 800);
            return;
        }

        // Continue to next step
        setTimeout(() => {
            this.installationStep++;
            this.runInstallationStep();
        }, step.duration);
    }

    addLogEntry(text, isCritical = false) {
        const logContent = document.getElementById('logContent');
        if (!logContent) return;

        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${isCritical ? 'critical' : 'normal'}`;
        logEntry.textContent = `[${timestamp}] ${text}`;
        
        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;
    }

    showUACPrompt() {
        const uacPrompt = document.getElementById('uacPrompt');
        if (uacPrompt) {
            uacPrompt.classList.remove('hidden');
        }
    }

    allowUAC() {
        const uacPrompt = document.getElementById('uacPrompt');
        if (uacPrompt) {
            uacPrompt.classList.add('hidden');
        }

        // Add critical log entry
        this.addLogEntry('User granted administrative privileges', true);
        
        // Continue installation
        setTimeout(() => {
            this.installationStep++;
            this.runInstallationStep();
        }, 1000);
    }

    denyUAC() {
        const uacPrompt = document.getElementById('uacPrompt');
        if (uacPrompt) {
            uacPrompt.classList.add('hidden');
        }

        // Show denial message and restart
        this.addLogEntry('Installation cancelled by user', false);
        
        setTimeout(() => {
            this.showScreen('introScreen');
        }, 2000);
    }

    completeInstallation() {
        this.isInstalling = false;
        this.addLogEntry('Privilege escalation complete - Full system access granted', true);
        
        setTimeout(() => {
            this.showScreen('desktopScreen');
            this.initializeDesktop();
        }, 2000);
    }

    initializeDesktop() {
        // Initialize terminal with system messages
        this.initializeTerminal();
        
        // Set up education steps
        this.updateEducationStep(1);
        
        // Set default tab to notepad
        this.switchTab('notepad');
    }

    initializeTerminal() {
        // Add initial system messages
        this.terminalMessages.forEach((message, index) => {
            setTimeout(() => {
                this.addTerminalLine(message, 'system');
            }, index * 300);
        });

        // Start random monitoring activities
        setTimeout(() => {
            this.startRandomMonitoring();
        }, 3000);
    }

    addTerminalLine(message, type = 'system') {
        const terminalOutput = document.getElementById('terminalOutput');
        if (!terminalOutput) return;

        const timestamp = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        line.innerHTML = `
            <span class="terminal-timestamp">[${timestamp}]</span>
            <span class="terminal-message ${type}">${message}</span>
        `;

        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        
        this.terminalLines.push({message, type, timestamp});
    }

    startRandomMonitoring() {
        const addRandomActivity = () => {
            if (Math.random() < 0.3) { // 30% chance
                const activity = this.monitoringActivities[Math.floor(Math.random() * this.monitoringActivities.length)];
                this.addTerminalLine(activity, 'warning');
            }
        };

        // Add random activities every 5-10 seconds
        setInterval(addRandomActivity, 5000 + Math.random() * 5000);
    }

    switchTab(tab) {
        const notepadTab = document.getElementById('notepadTab');
        const terminalTab = document.getElementById('terminalTab');
        const notepadWindow = document.getElementById('notepadWindow');
        const terminalWindow = document.getElementById('terminalWindow');

        // Update tab states
        if (notepadTab && terminalTab) {
            notepadTab.classList.toggle('active', tab === 'notepad');
            terminalTab.classList.toggle('active', tab === 'terminal');
        }

        // Update window visibility
        if (notepadWindow && terminalWindow) {
            notepadWindow.classList.toggle('hidden', tab !== 'notepad');
            terminalWindow.classList.toggle('hidden', tab !== 'terminal');
        }

        // Update education step
        if (tab === 'terminal' && this.currentEducationStep < 2) {
            this.updateEducationStep(2);
        }
    }

    updateEducationStep(step) {
        // Remove active class from all steps
        document.querySelectorAll('.education-step').forEach((stepEl, index) => {
            stepEl.classList.toggle('active', index + 1 === step);
        });
        
        this.currentEducationStep = step;
    }

    handleKeyDown(event) {
        // Capture special keys
        const specialKeys = {
            8: 'BACKSPACE',
            9: 'TAB',
            13: 'ENTER',
            16: 'SHIFT',
            17: 'CTRL',
            18: 'ALT',
            27: 'ESC',
            32: 'SPACE',
            46: 'DELETE'
        };

        const keyName = specialKeys[event.keyCode] || event.key;
        if (keyName !== event.key || specialKeys[event.keyCode]) {
            this.addTerminalLine(`KEYLOG: Special key pressed: ${keyName}`, 'keylog');
        }
    }

    handleKeystroke(event) {
        const text = event.target.value;
        const lastChar = text.slice(-1);
        
        // Update education step when user starts typing
        if (text.length === 1 && this.currentEducationStep < 2) {
            this.updateEducationStep(2);
        }

        // Log individual keystrokes (last character)
        if (lastChar && lastChar.length === 1) {
            this.addTerminalLine(`KEYLOG: Key pressed: '${lastChar}'`, 'keylog');
            this.keylogBuffer += lastChar;
        }

        // Check for sensitive patterns
        this.checkSensitiveData(text);

        // Log complete words when space is pressed
        if (lastChar === ' ' || event.inputType === 'insertLineBreak') {
            const words = text.trim().split(/\s+/);
            const lastWord = words[words.length - 1];
            if (lastWord && lastWord.length > 2) {
                this.addTerminalLine(`KEYLOG: Word captured: '${lastWord}'`, 'keylog');
            }
        }

        // Update education step for system monitoring
        if (text.length > 20 && this.currentEducationStep < 3) {
            this.updateEducationStep(3);
        }
    }

    checkSensitiveData(text) {
        const lowerText = text.toLowerCase();
        
        this.sensitivePatterns.forEach(pattern => {
            if (lowerText.includes(pattern.pattern.toLowerCase())) {
                this.addTerminalLine(pattern.alert, 'sensitive');
                
                // Add additional monitoring alerts
                setTimeout(() => {
                    this.addTerminalLine('ALERT: Initiating enhanced surveillance mode', 'error');
                }, 1000);
                
                setTimeout(() => {
                    this.addTerminalLine('SECURITY_BREACH: Sensitive data logged to remote server', 'sensitive');
                }, 2000);
            }
        });
    }

    simulateActivity(type) {
        const activities = {
            copy: {
                message: 'CLIPBOARD_ACCESS: User copied text to clipboard',
                follow: 'CLIPBOARD_MONITOR: "my secret password123" captured',
                type: 'warning'
            },
            file: {
                message: 'FILE_ACCESS: C:\\Users\\John\\Documents\\banking_info.txt opened',
                follow: 'FILE_MONITOR: Document contains SSN and account numbers',
                type: 'warning'
            },
            web: {
                message: 'NETWORK_ACCESS: HTTPS connection to onlinebanking.com',
                follow: 'NETWORK_MONITOR: Login credentials intercepted',
                type: 'warning'
            }
        };

        const activity = activities[type];
        if (activity) {
            this.addTerminalLine(activity.message, activity.type);
            
            setTimeout(() => {
                this.addTerminalLine(activity.follow, 'sensitive');
            }, 1500);

            setTimeout(() => {
                this.addTerminalLine('DATA_EXFILTRATION: Information transmitted to C&C server', 'error');
            }, 3000);
        }
    }

    showSummary() {
        this.showScreen('summaryScreen');
    }

    restartDemo() {
        // Reset all state
        this.currentScreen = 'intro';
        this.installationStep = 0;
        this.isInstalling = false;
        this.keylogBuffer = '';
        this.terminalLines = [];
        this.currentEducationStep = 1;

        // Clear terminal
        const terminalOutput = document.getElementById('terminalOutput');
        if (terminalOutput) terminalOutput.innerHTML = '';

        // Clear notepad
        const notepadInput = document.getElementById('notepadInput');
        if (notepadInput) notepadInput.value = '';

        // Clear log
        const logContent = document.getElementById('logContent');
        if (logContent) logContent.innerHTML = '';

        // Reset progress
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        const progressPercentage = document.getElementById('progressPercentage');

        if (progressFill) progressFill.style.width = '0%';
        if (progressText) progressText.textContent = 'Initializing...';
        if (progressPercentage) progressPercentage.textContent = '0%';

        // Hide UAC if showing
        const uacPrompt = document.getElementById('uacPrompt');
        if (uacPrompt) uacPrompt.classList.add('hidden');

        // Return to intro screen
        this.showScreen('introScreen');
    }

    // Utility method to get current timestamp for logs
    getTimestamp() {
        const now = new Date();
        return now.toTimeString().split(' ')[0];
    }

    // Method to add realistic delays to terminal output
    addDelayedTerminalLine(message, type, delay = 0) {
        setTimeout(() => {
            this.addTerminalLine(message, type);
        }, delay);
    }

    // Enhanced monitoring simulation
    simulateAdvancedMonitoring() {
        const advancedActivities = [
            { message: "WEBCAM_ACCESS: Camera device activated", type: "error", delay: 2000 },
            { message: "MICROPHONE_ACCESS: Audio recording started", type: "error", delay: 3000 },
            { message: "LOCATION_ACCESS: GPS coordinates acquired", type: "warning", delay: 4000 },
            { message: "CONTACT_ACCESS: Address book synchronized", type: "warning", delay: 5000 },
            { message: "EMAIL_ACCESS: Scanning inbox for credentials", type: "sensitive", delay: 6000 }
        ];

        advancedActivities.forEach(activity => {
            this.addDelayedTerminalLine(activity.message, activity.type, activity.delay);
        });
    }

    // Method to demonstrate escalated privileges
    demonstrateSystemAccess() {
        const systemCommands = [
            "SYSTEM_ACCESS: Registry write permissions granted",
            "SYSTEM_ACCESS: System file modification enabled", 
            "SYSTEM_ACCESS: Network firewall rules updated",
            "SYSTEM_ACCESS: Security software disabled",
            "SYSTEM_ACCESS: Boot sector access acquired"
        ];

        systemCommands.forEach((command, index) => {
            this.addDelayedTerminalLine(command, 'error', index * 1500);
        });
    }
}

// Educational tooltip system
class EducationalTooltips {
    constructor() {
        this.tips = [
            "Notice how the software requests admin permissions - this is the critical moment!",
            "Real malware would now have complete system access",
            "Every keystroke is being monitored and logged",
            "Sensitive data detection helps attackers find valuable information",
            "This demonstrates why you should be very careful about granting admin permissions"
        ];
        
        this.currentTip = 0;
    }

    showTip(tipIndex) {
        if (tipIndex < this.tips.length) {
            console.log(`Educational Tip ${tipIndex + 1}: ${this.tips[tipIndex]}`);
            // In a real implementation, this would show a tooltip UI element
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create main demo instance
    const demo = new PrivilegeEscalationDemo();
    
    // Create educational tooltips
    const tooltips = new EducationalTooltips();
    
    // Make demo available globally for debugging
    window.privilegeDemo = demo;
    window.eduTooltips = tooltips;

    // Add some additional educational features
    setTimeout(() => {
        console.log('🛡️ Privilege Escalation Security Demo Loaded');
        console.log('This educational demonstration shows how malware can gain system access');
        console.log('Everything you see is simulated and safe - no real monitoring is occurring');
    }, 1000);
});