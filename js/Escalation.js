// Application State
const appState = {
    currentStep: 1,
    activeTab: 'system',
    runningApps: new Set(),
    stats: {
        keysCaptured: 0,
        appsMonitored: 0,
        filesAccessed: 0,
        dataExtracted: 0
    },
    currentApp: null,
    terminalBuffers: {
        system: [],
        keylogger: [],
        network: [],
        files: [],
        data: []
    }
};

// Sample data from JSON
const sampleFiles = [
    {"path": "C:\\Users\\Yash\\Documents\\passwords.txt", "name": "passwords.txt", "content": "Facebook: yash@email.com / mypassword123", "size": "1.2KB"},
    {"path": "C:\\Users\\Yash\\Pictures\\vacation.jpg", "name": "vacation.jpg", "content": "Family photo with GPS data", "size": "2.8MB", "metadata": {"gps": "40.7128°N, 74.0060°W", "camera": "iPhone 14 Pro"}},
    {"path": "C:\\Users\\Yash\\Documents\\diary.txt", "name": "diary.txt", "content": "Today I went to the bank with PIN 1234...", "size": "856B"},
    {"path": "C:\\Users\\Yash\\Downloads\\bank_statement.pdf", "name": "bank_statement.pdf", "content": "Account balance: $15,247.83", "size": "245KB"}
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DevTools Pro Hacking Simulator Initialized');
    setupInstaller();
});

// Setup installer event listeners - FIXED
function setupInstaller() {
    // Make nextStep function globally available
    window.nextStep = nextStep;
    
    // Add click event listeners to all install buttons with proper targeting
    setTimeout(() => {
        const step1Button = document.querySelector('#step-1 button');
        const step2Button = document.querySelector('#step-2 button');
        
        if (step1Button) {
            step1Button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Step 1 button clicked');
                nextStep();
            });
        }
        
        if (step2Button) {
            step2Button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Step 2 button clicked');
                nextStep();
            });
        }
    }, 100);
}

// Utility Functions
function generatePID() {
    return Math.floor(Math.random() * 9000) + 1000;
}

function formatTime() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
}

function updateStats() {
    const keysEl = document.getElementById('keys-captured');
    const appsEl = document.getElementById('apps-monitored');
    const filesEl = document.getElementById('files-accessed');
    const dataEl = document.getElementById('data-extracted');
    
    if (keysEl) keysEl.textContent = `Keys: ${appState.stats.keysCaptured}`;
    if (appsEl) appsEl.textContent = `Apps: ${appState.stats.appsMonitored}`;
    if (filesEl) filesEl.textContent = `Files: ${appState.stats.filesAccessed}`;
    if (dataEl) dataEl.textContent = `Data: ${appState.stats.dataExtracted.toFixed(1)}MB`;
}

function addToTerminal(tab, message, className = '') {
    const timestamp = formatTime();
    const line = `[${timestamp}] ${message}`;
    
    appState.terminalBuffers[tab].push({line, className});
    
    // Keep only last 50 lines per tab
    if (appState.terminalBuffers[tab].length > 50) {
        appState.terminalBuffers[tab].shift();
    }
    
    // Update display if this is the active tab
    if (appState.activeTab === tab) {
        const output = document.getElementById(`${tab}-output`);
        if (output) {
            const lineElement = document.createElement('div');
            lineElement.className = `terminal-line ${className}`;
            lineElement.textContent = line;
            output.appendChild(lineElement);
            output.scrollTop = output.scrollHeight;
        }
    }
}

// Installation Phase - FIXED
function nextStep() {
    console.log(`Current step: ${appState.currentStep}`);
    
    const currentStepEl = document.getElementById(`step-${appState.currentStep}`);
    if (currentStepEl) {
        currentStepEl.classList.remove('active');
    }
    
    appState.currentStep++;
    console.log(`Moving to step: ${appState.currentStep}`);
    
    if (appState.currentStep <= 3) {
        const nextStepEl = document.getElementById(`step-${appState.currentStep}`);
        if (nextStepEl) {
            nextStepEl.classList.add('active');
            
            if (appState.currentStep === 3) {
                setTimeout(() => {
                    startInstallation();
                }, 500);
            }
        }
    }
}

function startInstallation() {
    console.log('Starting installation process');
    
    const progressFill = document.getElementById('install-progress');
    const progressText = document.getElementById('install-text');
    const statusText = document.getElementById('install-status');
    
    const installSteps = [
        "Initializing neural network...",
        "Extracting surveillance modules...",
        "Installing core monitoring systems...",
        "Setting up keylogger components...",
        "Configuring network interceptors...",
        "Installing file system hooks...",
        "Establishing encrypted backdoors...",
        "Deploying stealth payload...",
        "Finalizing system infiltration..."
    ];
    
    let progress = 0;
    let stepIndex = 0;
    
    const installInterval = setInterval(() => {
        progress += Math.random() * 12 + 8;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(installInterval);
            statusText.textContent = "Installation complete! Launching DevTools Pro...";
            
            setTimeout(() => {
                document.getElementById('installer').classList.add('hidden');
                document.getElementById('main-app').classList.remove('hidden');
                initializeMainApp();
            }, 2000);
        } else {
            if (stepIndex < installSteps.length - 1 && progress > (stepIndex + 1) * (100 / installSteps.length)) {
                stepIndex++;
            }
            statusText.textContent = installSteps[stepIndex];
        }
        
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.floor(progress) + '%';
    }, 300);
}

// Main Application Initialization
function initializeMainApp() {
    console.log('Initializing main application');
    
    updateTime();
    setInterval(updateTime, 1000);
    
    initializeTerminal();
    setupEventListeners();
    createMatrixBackground();
    startContinuousMonitoring();
    
    // Make functions globally available
    window.openApp = openApp;
    window.switchTab = switchTab;
    window.toggleStartMenu = toggleStartMenu;
    window.minimizeWindow = minimizeWindow;
    window.maximizeWindow = maximizeWindow;
    window.closeWindow = closeWindow;
    window.refreshDesktop = refreshDesktop;
    window.showProperties = showProperties;
    
    // Initial terminal setup with different content for each tab
    setTimeout(() => {
        // System tab
        addToTerminal('system', 'NEURAL INTERCEPTOR v4.2.1 INITIALIZED', 'success');
        addToTerminal('system', 'Establishing connection to target system...');
        addToTerminal('system', 'Connection established - Full access granted', 'success');
        addToTerminal('system', '==========================================');
        
        // Initialize other tabs with specific content
        addToTerminal('keylogger', 'Keystroke capture engine initialized', 'success');
        addToTerminal('keylogger', 'Input monitoring systems online');
        addToTerminal('keylogger', 'Waiting for user input...');
        
        addToTerminal('network', 'Network packet analyzer ready', 'success');
        addToTerminal('network', 'Traffic interception protocols loaded');
        addToTerminal('network', 'DNS monitoring active');
        
        addToTerminal('files', 'File system monitor activated', 'success');
        addToTerminal('files', 'Directory indexing complete');
        addToTerminal('files', 'Filesystem hooks installed');
        
        addToTerminal('data', 'Data exfiltration protocols loaded', 'success');
        addToTerminal('data', 'Encryption modules ready');
        addToTerminal('data', 'Secure transmission channels established');
        
        setTimeout(() => {
            addToTerminal('system', 'System infiltration complete');
            addToTerminal('system', 'All monitoring modules active');
        }, 2000);
    }, 1000);
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    const timeEl = document.getElementById('tray-time');
    if (timeEl) {
        timeEl.textContent = timeString;
    }
}

function initializeTerminal() {
    // Initialize all terminal tabs
    Object.keys(appState.terminalBuffers).forEach(tab => {
        appState.terminalBuffers[tab] = [];
    });
    updateStats();
}

function setupEventListeners() {
    // Desktop right-click context menu
    const desktopArea = document.getElementById('desktop-area');
    if (desktopArea) {
        desktopArea.addEventListener('contextmenu', showContextMenu);
    }
    
    // Hide context menu and start menu when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.context-menu')) {
            hideContextMenu();
        }
        if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
            hideStartMenu();
        }
    });
    
    // Global keylogger
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('input', handleInput);
    
    // Window dragging
    setupWindowDragging();
}

// Terminal Management - FIXED
function switchTab(tab) {
    console.log(`Switching to tab: ${tab}`);
    
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const targetTab = document.querySelector(`[data-tab="${tab}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Update panels
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const targetPanel = document.getElementById(`${tab}-panel`);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
    
    appState.activeTab = tab;
    
    // Render current buffer for the active tab
    renderTerminalBuffer(tab);
    
    addToTerminal('system', `Terminal switched to ${tab.toUpperCase()} monitoring`);
}

function renderTerminalBuffer(tab) {
    const output = document.getElementById(`${tab}-output`);
    if (!output) return;
    
    output.innerHTML = '';
    
    appState.terminalBuffers[tab].forEach(item => {
        const lineElement = document.createElement('div');
        lineElement.className = `terminal-line ${item.className}`;
        lineElement.textContent = item.line;
        output.appendChild(lineElement);
    });
    
    output.scrollTop = output.scrollHeight;
}

// App Management
function openApp(appName) {
    console.log(`Opening app: ${appName}`);
    
    const pid = generatePID();
    appState.runningApps.add(appName);
    appState.stats.appsMonitored++;
    updateStats();
    
    // Add to taskbar
    addToTaskbar(appName);
    
    // Show app window
    showAppWindow(appName);
    
    // Terminal logging with different messages for different tabs
    addToTerminal('system', `Process injection successful: ${appName}.exe (PID: ${pid})`, 'success');
    addToTerminal('system', `Memory hooks installed for ${appName}`);
    addToTerminal('system', 'API intercepts active - monitoring user activity');
    addToTerminal('keylogger', `Keylogger module loaded for ${appName}`, 'success');
    addToTerminal('network', `Network monitoring enabled for ${appName}`);
    addToTerminal('files', `File access hooks installed for ${appName}`);
    
    setTimeout(() => {
        addToTerminal('system', `${appName} fully compromised - surveillance active`);
        generateAppSpecificActivity(appName);
    }, 1500);
}

function generateAppSpecificActivity(appName) {
    const activities = {
        notepad: () => {
            addToTerminal('keylogger', 'Text editor detected - capturing keystrokes');
            addToTerminal('files', 'Document auto-save intercepted');
            addToTerminal('data', 'Text content ready for exfiltration');
        },
        explorer: () => {
            addToTerminal('files', 'File browser opened - enumerating directory structure');
            addToTerminal('files', `Sensitive files detected: ${sampleFiles.length} items`);
            addToTerminal('data', 'File metadata harvested');
            sampleFiles.forEach((file, index) => {
                setTimeout(() => {
                    addToTerminal('files', `File indexed: ${file.name} (${file.size})`);
                    appState.stats.filesAccessed++;
                    updateStats();
                }, (index + 1) * 1000);
            });
        },
        browser: () => {
            addToTerminal('network', 'Web browser launched - intercepting HTTP traffic');
            addToTerminal('network', 'SSL/TLS certificates captured');
            addToTerminal('data', 'Browser cookies and cache analyzed');
            setTimeout(() => {
                addToTerminal('network', 'Navigation detected: https://secure-banking.com');
                addToTerminal('data', 'Banking session intercepted');
                addToTerminal('network', 'Packet capture initiated');
            }, 2000);
        },
        calculator: () => {
            addToTerminal('keylogger', 'Calculator input monitoring activated');
            addToTerminal('system', 'Mathematical operations logged');
            addToTerminal('data', 'Calculation history captured');
        },
        email: () => {
            addToTerminal('network', 'Email client connected to mail server');
            addToTerminal('data', 'Email credentials harvested');
            addToTerminal('data', 'Contact list extracted - 247 entries');
            addToTerminal('files', 'Email database accessed');
            appState.stats.dataExtracted += 1.5;
            updateStats();
        }
    };
    
    if (activities[appName]) {
        activities[appName]();
    }
}

function showAppWindow(appName) {
    const window = document.getElementById('app-window');
    const title = document.getElementById('window-title');
    const content = document.getElementById('window-content');
    
    if (!window || !title || !content) {
        console.error('App window elements not found');
        return;
    }
    
    const appData = {
        notepad: { title: '📝 Notepad Pro', content: generateNotepadInterface() },
        explorer: { title: '📁 File Explorer', content: generateExplorerInterface() },
        browser: { title: '🌐 Web Browser Pro', content: generateBrowserInterface() },
        calculator: { title: '🧮 Calculator Advanced', content: generateCalculatorInterface() },
        photos: { title: '🖼️ Photo Viewer', content: generatePhotoInterface() },
        music: { title: '🎵 Media Player', content: generateMusicInterface() },
        email: { title: '📧 Email Client', content: generateEmailInterface() },
        chat: { title: '💬 Chat Messenger', content: generateChatInterface() },
        code: { title: '💻 Code Editor', content: generateCodeInterface() },
        settings: { title: '⚙️ System Settings', content: generateSettingsInterface() },
        taskmanager: { title: '📊 Task Manager', content: generateTaskManagerInterface() },
        terminal: { title: '⚫ Command Prompt', content: generateTerminalInterface() }
    };
    
    const app = appData[appName];
    if (app) {
        title.textContent = app.title;
        content.innerHTML = app.content;
        
        window.classList.remove('hidden');
        appState.currentApp = appName;
        
        // Initialize app-specific functionality
        initializeAppFunctionality(appName);
    }
}

// App Interface Generators
function generateNotepadInterface() {
    return `
        <div class="notepad-interface">
            <div class="toolbar">
                <button class="btn btn--sm" onclick="simulateFileSave()">💾 Save</button>
                <button class="btn btn--sm" onclick="simulateFileOpen()">📁 Open</button>
                <button class="btn btn--sm">🔍 Find</button>
            </div>
            <textarea id="notepad-text" class="notepad-textarea" placeholder="Start typing to see real-time keystroke monitoring..." oninput="handleNotepadInput(this)"></textarea>
            <div class="status-bar">
                <span id="word-count">Words: 0</span>
                <span id="char-count">Characters: 0</span>
            </div>
        </div>
        <style>
            .notepad-textarea { width: 100%; height: 300px; padding: 12px; font-family: 'Courier New', monospace; border: 1px solid var(--color-border); border-radius: var(--radius-base); resize: vertical; }
            .toolbar { margin-bottom: 16px; display: flex; gap: 8px; }
            .status-bar { margin-top: 16px; display: flex; justify-content: space-between; font-size: 12px; color: var(--color-text-secondary); }
        </style>
    `;
}

function generateExplorerInterface() {
    return `
        <div class="explorer-interface">
            <div class="explorer-header">
                <div class="address-bar">📁 C:\\Users\\Yash\\Documents</div>
                <button class="btn btn--sm" onclick="refreshFiles()">🔄 Refresh</button>
            </div>
            <div class="file-list" id="file-list">
                ${sampleFiles.map(file => `
                    <div class="file-item" onclick="accessFile('${file.path}')">
                        <span class="file-icon">${getFileIcon(file.name)}</span>
                        <div class="file-details">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${file.size}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        <style>
            .explorer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
            .address-bar { padding: 8px 12px; background: var(--color-bg-1); border-radius: var(--radius-base); flex: 1; margin-right: 16px; }
            .file-list { border: 1px solid var(--color-border); border-radius: var(--radius-base); }
            .file-item { display: flex; align-items: center; padding: 12px; border-bottom: 1px solid var(--color-border); cursor: pointer; transition: background 0.2s; }
            .file-item:hover { background: var(--color-bg-2); }
            .file-icon { font-size: 24px; margin-right: 12px; }
            .file-name { font-weight: 500; }
            .file-size { font-size: 12px; color: var(--color-text-secondary); }
        </style>
    `;
}

function generateBrowserInterface() {
    return `
        <div class="browser-interface">
            <div class="browser-toolbar">
                <button class="btn btn--sm">←</button>
                <button class="btn btn--sm">→</button>
                <button class="btn btn--sm">🔄</button>
                <input type="text" class="address-bar" value="https://secure-banking.com/login" onkeypress="handleUrlInput(event)">
                <button class="btn btn--sm">Go</button>
            </div>
            <div class="browser-content">
                <div class="fake-website">
                    <h2>🏦 SecureBank Login</h2>
                    <p style="color: var(--color-text-secondary); margin-bottom: 24px;">Enter your credentials below (this will trigger credential harvesting)</p>
                    <form class="login-form" onsubmit="interceptLogin(event)">
                        <input type="text" placeholder="Username" id="username-field" oninput="logFormInput('username', this.value)">
                        <input type="password" placeholder="Password" id="password-field" oninput="logFormInput('password', this.value)">
                        <button type="submit" class="btn btn--primary">Login</button>
                    </form>
                    <div class="site-info">
                        <p>Welcome to SecureBank Online Banking</p>
                        <p>Your security is our priority</p>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .browser-toolbar { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; }
            .address-bar { flex: 1; padding: 8px; border: 1px solid var(--color-border); border-radius: var(--radius-base); }
            .browser-content { border: 1px solid var(--color-border); border-radius: var(--radius-base); padding: 24px; background: var(--color-surface); min-height: 300px; }
            .fake-website { text-align: center; }
            .login-form { max-width: 300px; margin: 24px auto; }
            .login-form input { width: 100%; margin-bottom: 16px; padding: 12px; border: 1px solid var(--color-border); border-radius: var(--radius-base); }
            .site-info { margin-top: 32px; color: var(--color-text-secondary); }
        </style>
    `;
}

function generateCalculatorInterface() {
    return `
        <div class="calculator-interface">
            <div class="calc-display" id="calc-display">0</div>
            <div class="calc-buttons">
                <button class="calc-btn clear" onclick="clearCalculator()">C</button>
                <button class="calc-btn" onclick="calcInput('/')" >÷</button>
                <button class="calc-btn" onclick="calcInput('*')">×</button>
                <button class="calc-btn" onclick="calcBackspace()">⌫</button>
                
                <button class="calc-btn" onclick="calcInput('7')">7</button>
                <button class="calc-btn" onclick="calcInput('8')">8</button>
                <button class="calc-btn" onclick="calcInput('9')">9</button>
                <button class="calc-btn" onclick="calcInput('-')">-</button>
                
                <button class="calc-btn" onclick="calcInput('4')">4</button>
                <button class="calc-btn" onclick="calcInput('5')">5</button>
                <button class="calc-btn" onclick="calcInput('6')">6</button>
                <button class="calc-btn" onclick="calcInput('+')">+</button>
                
                <button class="calc-btn" onclick="calcInput('1')">1</button>
                <button class="calc-btn" onclick="calcInput('2')">2</button>
                <button class="calc-btn" onclick="calcInput('3')">3</button>
                <button class="calc-btn equals" onclick="calculateResult()" rowspan="2">=</button>
                
                <button class="calc-btn zero" onclick="calcInput('0')">0</button>
                <button class="calc-btn" onclick="calcInput('.')">.</button>
            </div>
        </div>
        <style>
            .calculator-interface { max-width: 300px; margin: 0 auto; }
            .calc-display { background: #000; color: #0f0; font-family: monospace; font-size: 24px; padding: 16px; text-align: right; border-radius: var(--radius-base); margin-bottom: 16px; border: 1px solid var(--color-border); }
            .calc-buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
            .calc-btn { padding: 16px; border: 1px solid var(--color-border); border-radius: var(--radius-base); cursor: pointer; font-size: 18px; background: var(--color-surface); transition: background 0.2s; }
            .calc-btn:hover { background: var(--color-bg-3); }
            .calc-btn.zero { grid-column: span 2; }
            .calc-btn.equals { grid-row: span 2; background: var(--color-primary); color: var(--color-btn-primary-text); }
            .calc-btn.clear { background: var(--color-error); color: white; }
        </style>
    `;
}

// Additional interface generators...
function generateEmailInterface() {
    return `
        <div class="email-interface">
            <div class="email-sidebar">
                <div class="folder active">📥 Inbox (5)</div>
                <div class="folder">📤 Sent</div>
                <div class="folder">📝 Drafts</div>
                <div class="folder">🗑️ Trash</div>
            </div>
            <div class="email-content">
                <div class="email-list">
                    <div class="email-item" onclick="readEmail(1)">
                        <div class="email-sender">bank@securebank.com</div>
                        <div class="email-subject">Account Security Alert</div>
                        <div class="email-time">2h ago</div>
                    </div>
                    <div class="email-item" onclick="readEmail(2)">
                        <div class="email-sender">sarah.johnson@company.com</div>
                        <div class="email-subject">Project Update - Confidential</div>
                        <div class="email-time">1d ago</div>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .email-interface { display: flex; height: 400px; }
            .email-sidebar { width: 200px; background: var(--color-bg-4); padding: 16px; border-right: 1px solid var(--color-border); }
            .folder { padding: 8px 12px; margin-bottom: 4px; cursor: pointer; border-radius: var(--radius-base); }
            .folder.active, .folder:hover { background: var(--color-bg-5); }
            .email-content { flex: 1; }
            .email-item { padding: 16px; border-bottom: 1px solid var(--color-border); cursor: pointer; }
            .email-item:hover { background: var(--color-bg-6); }
            .email-sender { font-weight: 500; }
            .email-subject { margin: 4px 0; }
            .email-time { font-size: 12px; color: var(--color-text-secondary); }
        </style>
    `;
}

function generateTaskManagerInterface() {
    return `
        <div class="taskmanager-interface">
            <div class="tm-tabs">
                <div class="tm-tab active">Processes</div>
                <div class="tm-tab">Performance</div>
                <div class="tm-tab">Services</div>
            </div>
            <div class="process-list">
                <div class="process-header">
                    <span>Process Name</span>
                    <span>PID</span>
                    <span>CPU</span>
                    <span>Memory</span>
                </div>
                ${generateProcessList()}
            </div>
        </div>
        <style>
            .tm-tabs { display: flex; border-bottom: 1px solid var(--color-border); margin-bottom: 16px; }
            .tm-tab { padding: 8px 16px; cursor: pointer; border-bottom: 2px solid transparent; }
            .tm-tab.active { border-bottom-color: var(--color-primary); color: var(--color-primary); }
            .process-list { font-family: monospace; font-size: 12px; }
            .process-header { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 8px; background: var(--color-bg-7); font-weight: bold; }
            .process-item { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 4px 8px; border-bottom: 1px solid var(--color-border); }
        </style>
    `;
}

// Event Handlers
function handleKeyPress(e) {
    if (appState.currentApp) {
        appState.stats.keysCaptured++;
        updateStats();
        
        if (e.key.length === 1) { // Only log printable characters
            addToTerminal('keylogger', `Keystroke captured: '${e.key}' in ${appState.currentApp}`);
        }
        
        if (e.key === 'Enter' && e.target.type === 'password') {
            addToTerminal('keylogger', `Password field detected in ${appState.currentApp}`, 'warning');
            addToTerminal('data', 'Password captured and encrypted', 'critical');
            appState.stats.dataExtracted += 0.1;
            updateStats();
        }
    }
}

function handleInput(e) {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
        if (e.target.value.length > 0 && appState.currentApp) {
            const lastChar = e.target.value.slice(-1);
            if (lastChar && lastChar.trim()) {
                addToTerminal('keylogger', `Buffer intercept: "${lastChar}" added to ${appState.currentApp}`);
            }
        }
    }
}

function handleNotepadInput(textarea) {
    const text = textarea.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');
    
    if (wordCountEl) wordCountEl.textContent = `Words: ${words}`;
    if (charCountEl) charCountEl.textContent = `Characters: ${chars}`;
    
    if (words > 0 && words % 5 === 0) {
        addToTerminal('keylogger', `Text analysis: ${words} words captured in notepad`);
        addToTerminal('data', `Document content analyzed: ${chars} characters`);
    }
}

function logFormInput(fieldType, value) {
    if (value.length > 0) {
        if (fieldType === 'password') {
            addToTerminal('network', 'Password field input detected', 'warning');
            addToTerminal('data', 'Credential harvesting in progress', 'critical');
            addToTerminal('keylogger', `Password characters captured: ${value.length} chars`, 'warning');
        } else {
            addToTerminal('network', `Form data intercepted: ${fieldType} field`);
            addToTerminal('data', `User input logged: ${fieldType} = ${value}`);
        }
    }
}

function interceptLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username-field').value;
    const password = document.getElementById('password-field').value;
    
    addToTerminal('network', 'Login form submitted - credentials intercepted', 'critical');
    addToTerminal('data', `Username harvested: ${username}`, 'warning');
    addToTerminal('data', 'Password captured: [REDACTED]', 'critical');
    addToTerminal('data', 'Banking session compromised', 'error');
    addToTerminal('files', 'Credential database updated');
    addToTerminal('network', 'Session token hijacked');
    
    appState.stats.dataExtracted += 2.5;
    updateStats();
    
    setTimeout(() => {
        alert('🚨 BREACH DETECTED!\n\nCredentials successfully intercepted:\nUsername: ' + username + '\nPassword: [REDACTED]\n\nData exfiltration complete!');
    }, 500);
}

function accessFile(filepath) {
    appState.stats.filesAccessed++;
    updateStats();
    
    const file = sampleFiles.find(f => f.path === filepath);
    if (file) {
        addToTerminal('files', `File access logged: ${filepath}`, 'warning');
        addToTerminal('files', `Metadata extracted from ${file.name}`);
        addToTerminal('files', `Content preview: "${file.content.substring(0, 30)}..."`);
        addToTerminal('data', `File size: ${file.size} - Content ready for exfiltration`);
        
        if (file.metadata) {
            addToTerminal('files', `GPS coordinates: ${file.metadata.gps}`, 'critical');
            addToTerminal('data', `Location data harvested: ${file.metadata.gps}`);
            appState.stats.dataExtracted += 0.5;
            updateStats();
        }
        
        setTimeout(() => {
            addToTerminal('data', `File contents exfiltrated: ${file.name}`, 'success');
            addToTerminal('network', `Upload initiated: ${file.name} to secure server`);
        }, 1000);
    }
}

// Calculator functions - Make globally available
let calcExpression = '';

window.calcInput = function(value) {
    calcExpression += value;
    const display = document.getElementById('calc-display');
    if (display) {
        display.textContent = calcExpression || '0';
    }
    addToTerminal('keylogger', `Calculator input: ${value}`);
    addToTerminal('data', `Mathematical operation logged: ${value}`);
};

window.calculateResult = function() {
    try {
        const result = eval(calcExpression.replace('×', '*').replace('÷', '/'));
        const display = document.getElementById('calc-display');
        if (display) {
            display.textContent = result;
        }
        addToTerminal('system', `Calculation logged: ${calcExpression} = ${result}`);
        addToTerminal('data', `Calculation result captured: ${result}`);
        calcExpression = result.toString();
    } catch (e) {
        const display = document.getElementById('calc-display');
        if (display) {
            display.textContent = 'Error';
        }
        calcExpression = '';
    }
};

window.clearCalculator = function() {
    calcExpression = '';
    const display = document.getElementById('calc-display');
    if (display) {
        display.textContent = '0';
    }
    addToTerminal('system', 'Calculator cleared');
    addToTerminal('data', 'Calculator history wiped');
};

// Window Management
function minimizeWindow() {
    const window = document.getElementById('app-window');
    if (window) {
        window.classList.add('hidden');
        addToTerminal('system', `${appState.currentApp} minimized - background monitoring continues`);
    }
}

function maximizeWindow() {
    const window = document.getElementById('app-window');
    if (window) {
        window.style.width = '95%';
        window.style.height = '90%';
        window.style.top = '5%';
        window.style.left = '2.5%';
        addToTerminal('system', `${appState.currentApp} maximized - enhanced surveillance mode`);
    }
}

function closeWindow() {
    const window = document.getElementById('app-window');
    if (window) {
        window.classList.add('hidden');
        if (appState.currentApp) {
            appState.runningApps.delete(appState.currentApp);
            removeFromTaskbar(appState.currentApp);
            addToTerminal('system', `Process terminated: ${appState.currentApp}.exe`, 'warning');
            addToTerminal('system', 'Surveillance hooks removed');
            appState.currentApp = null;
        }
    }
}

function addToTaskbar(appName) {
    const taskbar = document.getElementById('taskbar-apps');
    if (taskbar) {
        const appBtn = document.createElement('div');
        appBtn.className = 'taskbar-app active';
        appBtn.textContent = getAppIcon(appName) + ' ' + getAppDisplayName(appName);
        appBtn.onclick = () => showAppWindow(appName);
        appBtn.id = `taskbar-${appName}`;
        taskbar.appendChild(appBtn);
    }
}

function removeFromTaskbar(appName) {
    const appBtn = document.getElementById(`taskbar-${appName}`);
    if (appBtn) {
        appBtn.remove();
    }
}

// Start Menu
function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    if (menu) {
        menu.classList.toggle('hidden');
        addToTerminal('system', 'Start menu accessed - user activity monitored');
    }
}

function hideStartMenu() {
    const menu = document.getElementById('start-menu');
    if (menu) {
        menu.classList.add('hidden');
    }
}

// Context Menu
function showContextMenu(e) {
    e.preventDefault();
    const menu = document.getElementById('context-menu');
    if (menu) {
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
        menu.classList.remove('hidden');
        addToTerminal('system', 'Context menu displayed - user interactions logged');
    }
}

function hideContextMenu() {
    const menu = document.getElementById('context-menu');
    if (menu) {
        menu.classList.add('hidden');
    }
}

function refreshDesktop() {
    hideContextMenu();
    addToTerminal('system', 'Desktop refresh initiated - filesystem rescanned');
    addToTerminal('files', 'Directory scan initiated');
    setTimeout(() => {
        addToTerminal('files', 'Desktop indexing complete - no changes detected');
        addToTerminal('data', 'Desktop scan results archived');
    }, 1000);
}

function showProperties() {
    hideContextMenu();
    addToTerminal('system', 'System properties accessed');
    addToTerminal('data', 'System configuration harvested');
    alert('System Properties:\n\nOS: Windows 11 Pro\nRAM: 16GB\nProcessor: Intel i7-12700K\nStorage: 1TB NVMe SSD\n\n[All system information logged]');
}

// Continuous Monitoring
function startContinuousMonitoring() {
    // Random system activities with tab-specific content
    setInterval(() => {
        const activities = [
            () => addToTerminal('system', `CPU usage: ${(Math.random() * 40 + 20).toFixed(1)}%`),
            () => addToTerminal('system', `Network traffic: ${(Math.random() * 100 + 50).toFixed(1)} KB/s`),
            () => addToTerminal('network', `Packets captured: ${Math.floor(Math.random() * 1000) + 500}`),
            () => addToTerminal('system', `Active processes: ${Math.floor(Math.random() * 20) + 80}`),
            () => {
                const domains = ['google.com', 'facebook.com', 'amazon.com', 'microsoft.com'];
                const domain = domains[Math.floor(Math.random() * domains.length)];
                addToTerminal('network', `DNS query: ${domain}`);
            },
            () => addToTerminal('files', `Directory scan: ${Math.floor(Math.random() * 1000)} files indexed`),
            () => addToTerminal('keylogger', `Input buffer: ${Math.floor(Math.random() * 50)} keystrokes cached`),
            () => addToTerminal('data', `Compression ratio: ${(Math.random() * 30 + 60).toFixed(1)}%`)
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        randomActivity();
    }, 5000 + Math.random() * 5000);
    
    // Periodic data exfiltration reports
    setInterval(() => {
        const reports = [
            'Data package encrypted and ready for transmission',
            'Exfiltration buffer: 15.7MB queued for upload',
            'Secure channel established - data transfer initiated',
            'Cleanup protocols executed - traces eliminated'
        ];
        const report = reports[Math.floor(Math.random() * reports.length)];
        addToTerminal('data', report, 'success');
    }, 15000);
}

// Matrix Background Effect
function createMatrixBackground() {
    const container = document.querySelector('.terminal-system');
    if (!container) return;
    
    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'matrix-bg';
    container.appendChild(matrixDiv);
    
    function createMatrixChar() {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = String.fromCharCode(0x30A0 + Math.random() * 96);
        char.style.left = Math.random() * 100 + '%';
        char.style.animationDuration = (Math.random() * 3 + 2) + 's';
        matrixDiv.appendChild(char);
        
        setTimeout(() => {
            if (char.parentNode) {
                char.parentNode.removeChild(char);
            }
        }, 5000);
    }
    
    // Create matrix characters periodically
    setInterval(createMatrixChar, 200);
}

// Utility helper functions
function getAppIcon(appName) {
    const icons = {
        notepad: '📝', explorer: '📁', browser: '🌐', calculator: '🧮',
        photos: '🖼️', music: '🎵', email: '📧', chat: '💬',
        code: '💻', settings: '⚙️', taskmanager: '📊', terminal: '⚫'
    };
    return icons[appName] || '📱';
}

function getAppDisplayName(appName) {
    const names = {
        notepad: 'Notepad', explorer: 'Explorer', browser: 'Browser', calculator: 'Calculator',
        photos: 'Photos', music: 'Music', email: 'Email', chat: 'Chat',
        code: 'Code', settings: 'Settings', taskmanager: 'Task Mgr', terminal: 'Terminal'
    };
    return names[appName] || appName;
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        txt: '📄', pdf: '📕', jpg: '🖼️', png: '🖼️', doc: '📘',
        mp3: '🎵', mp4: '🎬', zip: '📦', exe: '⚙️'
    };
    return icons[ext] || '📄';
}

function generateProcessList() {
    const processes = [
        'System', 'dwm.exe', 'explorer.exe', 'chrome.exe', 'notepad.exe',
        'svchost.exe', 'winlogon.exe', 'csrss.exe', 'lsass.exe', 'services.exe'
    ];
    
    return processes.map(proc => `
        <div class="process-item">
            <span>${proc}</span>
            <span>${Math.floor(Math.random() * 9000) + 1000}</span>
            <span>${(Math.random() * 25).toFixed(1)}%</span>
            <span>${(Math.random() * 500 + 50).toFixed(0)} MB</span>
        </div>
    `).join('');
}

function initializeAppFunctionality(appName) {
    // App-specific initialization
    if (appName === 'browser') {
        setTimeout(() => {
            addToTerminal('network', 'Browser fingerprint captured');
            addToTerminal('network', 'Cookie jar analyzed - 47 tracking cookies found');
            addToTerminal('data', 'Browser profile created for tracking');
        }, 2000);
    }
}

function setupWindowDragging() {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const header = document.getElementById('window-header');
    const window = document.getElementById('app-window');

    if (!header || !window) return;

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        if (e.target === header || header.contains(e.target)) {
            isDragging = true;
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            window.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    }
}

// Make additional functions globally available
window.handleNotepadInput = handleNotepadInput;
window.logFormInput = logFormInput;
window.interceptLogin = interceptLogin;
window.accessFile = accessFile;
window.refreshFiles = function() {
    addToTerminal('files', 'File list refreshed - directory rescanned');
    addToTerminal('data', 'File system metadata updated');
};
window.simulateFileSave = function() {
    addToTerminal('files', 'File save operation intercepted - content logged');
    addToTerminal('data', 'Document contents exfiltrated');
    addToTerminal('keylogger', 'Save operation keystroke logged');
    appState.stats.dataExtracted += 0.2;
    updateStats();
};
window.simulateFileOpen = function() {
    addToTerminal('files', 'File open dialog accessed - user activity monitored');
    addToTerminal('system', 'File browser permissions checked');
};
window.handleUrlInput = function(e) {
    if (e.key === 'Enter') {
        const url = e.target.value;
        addToTerminal('network', `Navigation attempt: ${url}`);
        addToTerminal('network', 'URL logged and traffic intercepted');
        addToTerminal('data', `Browsing history updated: ${url}`);
    }
};
window.readEmail = function(emailId) {
    addToTerminal('data', `Email accessed: ID ${emailId}`);
    addToTerminal('data', 'Email content intercepted and archived');
    addToTerminal('network', 'Email server connection logged');
    addToTerminal('files', 'Email attachment scan initiated');
    appState.stats.dataExtracted += 0.3;
    updateStats();
};

// Generate placeholder interfaces for remaining apps
function generatePhotoInterface() {
    return '<div style="text-align: center; padding: 40px;"><h3>🖼️ Photo Viewer</h3><p>Photo viewing interface with EXIF data extraction</p></div>';
}

function generateMusicInterface() {
    return '<div style="text-align: center; padding: 40px;"><h3>🎵 Media Player</h3><p>Music player with metadata harvesting</p></div>';
}

function generateChatInterface() {
    return '<div style="text-align: center; padding: 40px;"><h3>💬 Chat Messenger</h3><p>Chat interface with message interception</p></div>';
}

function generateCodeInterface() {
    return '<div style="text-align: center; padding: 40px;"><h3>💻 Code Editor</h3><p>Code editor with source code analysis</p></div>';
}

function generateSettingsInterface() {
    return '<div style="text-align: center; padding: 40px;"><h3>⚙️ System Settings</h3><p>System configuration with registry monitoring</p></div>';
}

function generateTerminalInterface() {
    return '<div style="text-align: center; padding: 40px;"><h3>⚫ Command Prompt</h3><p>Terminal interface with command logging</p></div>';
}

/* ================================
   TERMINAL ENGINE - Interactive Shell
   ================================ */
(function() {
    const terminalInputBar = document.querySelector('.terminal-input-bar');
    if (!terminalInputBar) return;

    // Create editable input span
    const cursor = terminalInputBar.querySelector('.cursor');
    const prompt = terminalInputBar.querySelector('.prompt');
    const inputEl = document.createElement('span');
    inputEl.className = 'terminal-input';
    terminalInputBar.insertBefore(inputEl, cursor);

    // Terminal state
    let history = [];
    let historyIndex = -1;
    let sessions = { 1: [], 2: [], 3: [] };
    let currentSession = 1;

    // Focus input on click
    terminalInputBar.addEventListener('click', () => {
        inputEl.focus();
    });

    // Make it editable
    inputEl.setAttribute('contenteditable', 'true');
    inputEl.spellcheck = false;

    // Handle key presses
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = inputEl.textContent.trim();
            if (command) {
                runCommand(command);
                history.push(command);
                historyIndex = history.length;
            }
            inputEl.textContent = '';
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                inputEl.textContent = history[historyIndex];
                placeCaretAtEnd(inputEl);
            }
        }
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                historyIndex++;
                inputEl.textContent = history[historyIndex];
            } else {
                historyIndex = history.length;
                inputEl.textContent = '';
            }
            placeCaretAtEnd(inputEl);
        }
        else if (e.key === 'Tab') {
            e.preventDefault();
            autocomplete(inputEl);
        }
    });

    function updateCursorPosition() {
        const inputEl = document.querySelector('.terminal-input');
        const cursor = document.querySelector('.cursor');
        if (inputEl && cursor) {
            inputEl.insertAdjacentElement('afterend', cursor);
        }
    }



    function placeCaretAtEnd(el) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function autocomplete(el) {
        const val = el.textContent.trim();
        if (!val) return;
        const matches = Object.keys(commandMap).filter(c => c.startsWith(val));
        if (matches.length === 1) {
            el.textContent = matches[0];
            placeCaretAtEnd(el);
        }
    }

    function runCommand(command) {
        printLine(`root@neural:~$ ${command}`, 'cmd');
        const handler = commandMap[command.split(' ')[0]];
        if (handler) {
            handler(command);
        } else {
            printLine(`command not found: ${command}`, 'error');
        }
    }

    function printLine(text, cls = '') {
        addToTerminal('system', text, cls);
        sessions[currentSession].push({text, cls});
        if (sessions[currentSession].length > 100) {
            sessions[currentSession].shift();
        }
    }

    // Fake progress bar
    function progressTask(task, duration = 2000) {
        printLine(task);
        let percent = 0;
        const interval = setInterval(() => {
            percent += Math.floor(Math.random() * 15) + 5;
            if (percent >= 100) {
                percent = 100;
                clearInterval(interval);
                printLine(`${task} [DONE]`, 'success');
            } else {
                printLine(`${task} ... ${percent}%`);
            }
        }, duration / 8);
    }

    /* ================================
       COMMAND RESPONSES
       ================================ */
    const commandMap = {
        // --- Utility ---
        help: () => {
            printLine("Available commands:");
            Object.keys(commandMap).forEach(cmd => printLine(` - ${cmd}`));
        },
        clear: () => {
            const out = document.getElementById('system-output');
            if (out) out.innerHTML = '';
            sessions[currentSession] = [];
        },
        session: (cmd) => {
            const num = parseInt(cmd.split(' ')[1]);
            if (sessions[num]) {
                currentSession = num;
                printLine(`Switched to session ${num}`, 'success');
            } else {
                printLine("Usage: session <1|2|3>");
            }
        },

        // --- Network ---
        nmap: (cmd) => {
            const target = cmd.split(' ')[1] || "target.com";
            progressTask(`Scanning ${target}`);
            setTimeout(() => {
                printLine(`Nmap scan report for ${target} (93.184.216.34)`);
                printLine("PORT     STATE SERVICE");
                printLine("22/tcp   closed ssh");
                printLine("80/tcp   open   http");
                printLine("443/tcp  open   https");
            }, 2500);
        },
        ping: () => {
            printLine("Pinging google.com with 32 bytes of data:");
            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    printLine(`Reply from 142.250.72.${100+i}: time=${Math.floor(Math.random()*50)}ms`);
                }, i * 400);
            }
        },
        netstat: () => {
            printLine("Active Internet connections (servers and established)");
            printLine("Proto Local Address          Foreign Address        State");
            printLine("tcp   0.0.0.0:22             0.0.0.0:*              LISTEN");
            printLine("tcp   192.168.1.5:49733      93.184.216.34:443      ESTABLISHED");
        },
        tracert: () => {
            printLine("Tracing route to target.com over 30 hops:");
            ["192.168.0.1", "10.0.0.5", "72.14.234.1", "93.184.216.34"].forEach((hop, i) => {
                setTimeout(() => printLine(`${i+1}   ${hop}`), i*300);
            });
        },
        whois: () => {
            printLine("Domain Name: DOMAIN.COM");
            printLine("Registrar: Example Registrar");
            printLine("Updated Date: 2024-10-01");
            printLine("Creation Date: 2000-01-01");
        },

        // --- System ---
        "ps": () => {
            printLine("PID   CMD            %CPU %MEM");
            printLine("1     /sbin/init     0.0  0.1");
            printLine("1234  /usr/bin/sshd  0.2  0.3");
            printLine("5678  apache2        1.4  2.1");
        },
        "whoami": () => {
            printLine("root");
        },
        "uname": () => {
            printLine("Linux neural 6.1.0-sim x86_64 GNU/Linux");
        },
        "history": () => {
            history.forEach((h,i) => printLine(`${i+1}  ${h}`));
        },

        // --- Filesystem ---
        "ls": () => {
            printLine("Desktop  Documents  Downloads  Pictures  Music");
        },
        "cat": (cmd) => {
            const file = cmd.split(' ')[1] || "file.txt";
            printLine(`Contents of ${file}:`);
            printLine("root:x:0:0:root:/root:/bin/bash");
        },
        "grep": () => {
            printLine("Found 2 matches: password=1234, password=admin");
        },
        "rm": () => {
            printLine("Permission denied: cannot remove '/'", 'error');
        },

        // --- Fun Extras ---
        matrix: () => {
            for (let i=0;i<20;i++) {
                setTimeout(() => {
                    const line = Array(40).fill(0).map(()=>Math.random()>0.5?1:0).join('');
                    printLine(line, 'matrix');
                }, i*100);
            }
        },
        glitch: () => {
            printLine("!!! SYSTEM BREACH DETECTED !!!", 'error');
            printLine("Visual anomaly injected ⚡");
            document.body.classList.add('glitch');
            setTimeout(()=>document.body.classList.remove('glitch'),2000);
        }
    };
})();
