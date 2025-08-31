class CyberTerminal {
    constructor() {
        this.currentPath = '/home/cyberguard';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentLesson = 'basics';
        this.completedCommands = new Set();
        this.achievements = new Set();
        
        this.lessons = {
            basics: {
                title: 'Basic Commands',
                description: 'Learn essential Linux commands for cybersecurity.',
                objectives: [
                    { command: 'ls', description: 'List files with ls', completed: false },
                    { command: 'pwd', description: 'Find current directory with pwd', completed: false },
                    { command: 'cd', description: 'Navigate with cd', completed: false },
                    { command: 'grep', description: 'Search files with grep', completed: false }
                ]
            },
            network: {
                title: 'Network Reconnaissance',
                description: 'Master network scanning and analysis tools.',
                objectives: [
                    { command: 'nmap', description: 'Scan networks with nmap', completed: false },
                    { command: 'netstat', description: 'View network connections', completed: false },
                    { command: 'ping', description: 'Test connectivity with ping', completed: false },
                    { command: 'ss', description: 'Monitor socket connections', completed: false }
                ]
            },
            processes: {
                title: 'Process Analysis',
                description: 'Analyze and manage system processes.',
                objectives: [
                    { command: 'ps', description: 'List running processes', completed: false },
                    { command: 'top', description: 'Monitor system resources', completed: false },
                    { command: 'kill', description: 'Terminate processes', completed: false },
                    { command: 'jobs', description: 'View background jobs', completed: false }
                ]
            },
            logs: {
                title: 'Log Analysis',
                description: 'Investigate system logs for security incidents.',
                objectives: [
                    { command: 'tail', description: 'Monitor log files in real-time', completed: false },
                    { command: 'grep', description: 'Search through log entries', completed: false },
                    { command: 'awk', description: 'Process and analyze logs', completed: false },
                    { command: 'journalctl', description: 'Query systemd logs', completed: false }
                ]
            },
            security: {
                title: 'Security Tools',
                description: 'Use essential security and hardening tools.',
                objectives: [
                    { command: 'chmod', description: 'Manage file permissions', completed: false },
                    { command: 'ssh', description: 'Secure shell connections', completed: false },
                    { command: 'iptables', description: 'Configure firewall rules', completed: false },
                    { command: 'sudo', description: 'Execute with elevated privileges', completed: false }
                ]
            },
            forensics: {
                title: 'Digital Forensics',
                description: 'Investigate and analyze digital evidence.',
                objectives: [
                    { command: 'find', description: 'Locate files and evidence', completed: false },
                    { command: 'strings', description: 'Extract readable text from files', completed: false },
                    { command: 'md5sum', description: 'Calculate file hashes', completed: false },
                    { command: 'file', description: 'Identify file types', completed: false }
                ]
            }
        };

        this.fileSystem = {
            '/home/cyberguard': {
                'documents': 'directory',
                'logs': 'directory',
                'scripts': 'directory',
                'suspicious.txt': 'file',
                'README.md': 'file'
            },
            '/home/cyberguard/documents': {
                'passwords.txt': 'file',
                'network-scan.log': 'file',
                'incident-report.pdf': 'file'
            },
            '/home/cyberguard/logs': {
                'auth.log': 'file',
                'system.log': 'file',
                'security.log': 'file'
            },
            '/home/cyberguard/scripts': {
                'backup.sh': 'file',
                'monitor.py': 'file',
                'scan-network.sh': 'file'
            }
        };

        this.commands = {
            // Basic Commands
            ls: this.handleLs.bind(this),
            pwd: this.handlePwd.bind(this),
            cd: this.handleCd.bind(this),
            grep: this.handleGrep.bind(this),
            cat: this.handleCat.bind(this),
            
            // Network Commands
            nmap: this.handleNmap.bind(this),
            netstat: this.handleNetstat.bind(this),
            ping: this.handlePing.bind(this),
            ss: this.handleSs.bind(this),
            
            // Process Commands
            ps: this.handlePs.bind(this),
            top: this.handleTop.bind(this),
            kill: this.handleKill.bind(this),
            jobs: this.handleJobs.bind(this),
            
            // Log Analysis
            tail: this.handleTail.bind(this),
            awk: this.handleAwk.bind(this),
            journalctl: this.handleJournalctl.bind(this),
            
            // Security Commands
            chmod: this.handleChmod.bind(this),
            ssh: this.handleSsh.bind(this),
            iptables: this.handleIptables.bind(this),
            sudo: this.handleSudo.bind(this),
            
            // Forensics Commands
            find: this.handleFind.bind(this),
            strings: this.handleStrings.bind(this),
            md5sum: this.handleMd5sum.bind(this),
            file: this.handleFile.bind(this),
            
            // Utility Commands
            clear: this.handleClear.bind(this),
            help: this.handleHelp.bind(this),
            hint: this.handleHint.bind(this),
            man: this.handleMan.bind(this),
            whoami: this.handleWhoami.bind(this),
            date: this.handleDate.bind(this),
            history: this.handleHistory.bind(this)
        };

        this.init();
    }

    init() {
        this.createMatrixBackground();
        this.setupBootSequence();
        this.setupTerminalInput();
        this.setupLessonNavigation();
        this.loadProgress();
        this.updateLessonDisplay();
    }

    createMatrixBackground() {
        const canvas = document.getElementById('matrix-bg');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
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
        }

        setInterval(draw, 33);

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    setupBootSequence() {
        const bootMessages = document.querySelectorAll('.boot-line');
        let delay = 200;
        
        bootMessages.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
                if (index === bootMessages.length - 1) {
                    setTimeout(() => {
                        document.getElementById('boot-screen').classList.add('hidden');
                        document.getElementById('main-interface').classList.remove('hidden');
                        this.showWelcomeMessage();
                    }, 100);
                }
            }, delay * (index + 1));
        });
    }

    setupTerminalInput() {
        const input = document.getElementById('command-input');
        
        input.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                    this.executeCommand(input.value.trim());
                    input.value = '';
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateHistory(-1, input);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateHistory(1, input);
                    break;
                case 'Tab':
                    e.preventDefault();
                    this.handleTabCompletion(input);
                    break;
            }
        });

        input.addEventListener('input', (e) => {
            this.showSuggestions(e.target.value);
        });

        // Keep focus on input
        document.addEventListener('click', () => {
            input.focus();
        });
    }

    setupLessonNavigation() {
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', () => {
                const lesson = item.dataset.lesson;
                this.switchLesson(lesson);
            });
        });
    }

    showWelcomeMessage() {
        this.addOutput(`
<span class="output-success">Welcome to CyberGuard Terminal Training!</span>

<span class="output-info">🎯 Mission: Master cybersecurity command-line tools</span>
<span class="output-info">🛡️  Status: Training Mode Active</span>
<span class="output-info">📚 Current Lesson: ${this.lessons[this.currentLesson].title}</span>

Type <span class="output-success">help</span> to see available commands
Type <span class="output-success">hint</span> to get guidance for your current mission
Type <span class="output-success">clear</span> to clear the terminal

<span class="output-warning">Ready for cyber operations. Begin when ready, agent.</span>
        `.trim(), 'info');
    }

    executeCommand(commandLine) {
        if (!commandLine) return;

        this.commandHistory.push(commandLine);
        this.historyIndex = this.commandHistory.length;
        
        // Display command
        this.addOutput(`cyberguard@security-lab:~$ ${commandLine}`, 'command');
        
        // Parse command and arguments
        const parts = commandLine.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Execute command
        if (this.commands[command]) {
            this.commands[command](args, commandLine);
            this.markCommandCompleted(command);
        } else {
            this.addOutput(`bash: ${command}: command not found`, 'error');
            this.addOutput('Type "help" to see available commands', 'info');
        }
        
        this.scrollToBottom();
    }

    markCommandCompleted(command) {
        if (!this.completedCommands.has(command)) {
            this.completedCommands.add(command);
            this.updateProgress();
            this.checkObjectiveCompletion(command);
            this.updateStats();
        }
    }

    checkObjectiveCompletion(command) {
        const lesson = this.lessons[this.currentLesson];
        const objective = lesson.objectives.find(obj => obj.command === command);
        
        if (objective && !objective.completed) {
            objective.completed = true;
            this.showAchievement(`Command Mastered: ${command.toUpperCase()}`, `You've successfully used the ${command} command!`);
            this.updateLessonDisplay();
            
            // Check if lesson is complete
            if (lesson.objectives.every(obj => obj.completed)) {
                this.completedLesson(this.currentLesson);
            }
        }
    }

    // Command Handlers
    handleLs(args) {
        const currentDir = this.fileSystem[this.currentPath] || {};
        const files = Object.keys(currentDir);
        
        if (files.length === 0) {
            this.addOutput('(empty directory)', 'result');
            return;
        }

        let output = '';
        files.forEach(file => {
            const type = currentDir[file];
            const color = type === 'directory' ? 'output-info' : 'output-result';
            output += `<span class="${color}">${file}${type === 'directory' ? '/' : ''}</span>\n`;
        });
        
        this.addOutput(output.trim(), 'result');
    }

    handlePwd(args) {
        this.addOutput(this.currentPath, 'result');
    }

    handleCd(args) {
        if (args.length === 0) {
            this.currentPath = '/home/cyberguard';
            this.addOutput('', 'result');
            return;
        }

        const targetPath = args[0];
        if (targetPath === '..') {
            const parts = this.currentPath.split('/');
            parts.pop();
            this.currentPath = parts.join('/') || '/';
        } else if (targetPath.startsWith('/')) {
            if (this.fileSystem[targetPath]) {
                this.currentPath = targetPath;
            } else {
                this.addOutput(`cd: ${targetPath}: No such file or directory`, 'error');
                return;
            }
        } else {
            const newPath = `${this.currentPath}/${targetPath}`;
            if (this.fileSystem[newPath]) {
                this.currentPath = newPath;
            } else {
                this.addOutput(`cd: ${targetPath}: No such file or directory`, 'error');
                return;
            }
        }
        
        this.updatePrompt();
    }

    handleGrep(args) {
        if (args.length < 2) {
            this.addOutput('Usage: grep [pattern] [file]', 'error');
            return;
        }

        const pattern = args[0];
        const filename = args[1];
        
        // Simulate grep results
        const grepResults = [
            `suspicious.txt:1:Failed login attempt from 192.168.1.100`,
            `suspicious.txt:5:Unusual network traffic detected`,
            `suspicious.txt:12:${pattern} found in system logs`
        ];

        this.addOutput(grepResults.join('\n'), 'result');
    }

    handleNmap(args) {
        this.addOutput('Starting Nmap scan...', 'info');
        
        setTimeout(() => {
            this.addOutput(`
Nmap scan report for target network
Host is up (0.0012s latency)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3389/tcp open  ms-wbt-server

<span class="output-warning">⚠️  Open ports detected - investigate further</span>
            `.trim(), 'result');
        }, 2000);
    }

    handleNetstat(args) {
        this.addOutput(`
Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN
tcp        0    240 10.0.0.5:22            192.168.1.100:45234     ESTABLISHED

<span class="output-info">💡 Tip: Look for suspicious connections from unknown IPs</span>
        `.trim(), 'result');
    }

    handlePing(args) {
        if (args.length === 0) {
            this.addOutput('Usage: ping [hostname/IP]', 'error');
            return;
        }

        const target = args[0];
        this.addOutput(`PING ${target} (8.8.8.8): 56 data bytes`, 'info');
        
        let count = 0;
        const pingInterval = setInterval(() => {
            count++;
            const time = (Math.random() * 50 + 10).toFixed(1);
            this.addOutput(`64 bytes from ${target}: icmp_seq=${count} time=${time}ms`, 'result');
            
            if (count >= 4) {
                clearInterval(pingInterval);
                this.addOutput(`\n--- ${target} ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss`, 'info');
            }
        }, 1000);
    }

    handlePs(args) {
        this.addOutput(`
  PID TTY          TIME CMD
 1234 pts/0    00:00:01 bash
 1337 pts/0    00:00:00 suspicious_proc
 1456 pts/0    00:00:00 python3
 1789 pts/0    00:00:00 nc
 2048 pts/0    00:00:00 ps

<span class="output-warning">⚠️  Suspicious process detected (PID 1337)</span>
        `.trim(), 'result');
    }

    handleTop(args) {
        this.addOutput(`
top - 14:25:30 up 1 day, 3:45, 2 users, load average: 0.15, 0.05, 0.01
Tasks: 157 total, 1 running, 156 sleeping
%Cpu(s): 12.5 us, 2.1 sy, 0.0 ni, 85.2 id, 0.2 wa

PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
1337 root      20   0   50000  25000  12000 S  25.0  2.5   0:45.67 suspicious_proc
1456 cyber     20   0  123456  45678  23456 S   5.3  4.6   0:12.34 python3
2048 cyber     20   0   12345   5678   3456 R   2.1  0.6   0:00.12 top

<span class="output-warning">⚠️  High CPU usage by suspicious_proc</span>
        `.trim(), 'result');
    }

    handleTail(args) {
        if (args.length === 0) {
            this.addOutput('Usage: tail [file] or tail -f [file]', 'error');
            return;
        }

        const filename = args[args.length - 1];
        this.addOutput(`==> ${filename} <==`, 'info');
        
        const logEntries = [
            '[2025-08-30 19:15:23] INFO: User login successful',
            '[2025-08-30 19:16:45] WARNING: Multiple failed login attempts',
            '[2025-08-30 19:17:12] ERROR: Unauthorized access attempt',
            '[2025-08-30 19:18:33] INFO: Firewall rule triggered',
            '[2025-08-30 19:19:55] CRITICAL: Potential security breach detected'
        ];

        logEntries.forEach(entry => {
            const level = entry.includes('ERROR') || entry.includes('CRITICAL') ? 'error' : 
                         entry.includes('WARNING') ? 'warning' : 'result';
            this.addOutput(entry, level);
        });
    }

    handleFind(args) {
        if (args.length === 0) {
            this.addOutput('Usage: find [path] [options]', 'error');
            return;
        }

        this.addOutput('Searching for files...', 'info');
        setTimeout(() => {
            const findings = [
                './documents/passwords.txt',
                './logs/security.log',
                './scripts/backup.sh',
                './.hidden_malware',
                './tmp/suspicious_file.bin'
            ];
            
            findings.forEach(file => {
                const className = file.includes('malware') || file.includes('suspicious') ? 'warning' : 'result';
                this.addOutput(file, className);
            });
        }, 1500);
    }

    handleClear(args) {
        document.getElementById('output').innerHTML = '';
    }

    handleHelp(args) {
        const helpText = `
<span class="output-success">🛡️  CyberGuard Terminal - Available Commands</span>

<span class="output-info">📁 BASIC COMMANDS:</span>
  ls          - List directory contents
  pwd         - Print working directory
  cd          - Change directory
  cat         - Display file contents
  grep        - Search text patterns

<span class="output-info">🌐 NETWORK COMMANDS:</span>
  nmap        - Network port scanner
  netstat     - Display network connections
  ping        - Test network connectivity
  ss          - Socket statistics

<span class="output-info">⚙️  PROCESS COMMANDS:</span>
  ps          - List running processes
  top         - Display system processes
  kill        - Terminate processes
  jobs        - Show background jobs

<span class="output-info">📊 LOG ANALYSIS:</span>
  tail        - Display end of files
  grep        - Search log entries
  awk         - Text processing
  journalctl  - Query systemd logs

<span class="output-info">🔒 SECURITY TOOLS:</span>
  chmod       - Change file permissions
  ssh         - Secure shell connection
  iptables    - Firewall configuration
  sudo        - Execute as another user

<span class="output-info">🔍 FORENSICS:</span>
  find        - Locate files
  strings     - Extract readable text
  md5sum      - Calculate hash values
  file        - Identify file types

<span class="output-info">🎯 TRAINING COMMANDS:</span>
  hint        - Get help for current mission
  clear       - Clear terminal screen
  history     - Show command history
  man         - Manual pages

Type any command to learn more!
        `.trim();
        
        this.addOutput(helpText, 'info');
    }

    handleHint(args) {
        const lesson = this.lessons[this.currentLesson];
        const incomplete = lesson.objectives.find(obj => !obj.completed);
        
        if (incomplete) {
            const hints = {
                ls: "Try typing 'ls' to see what files are in the current directory. Use 'ls -la' for detailed information.",
                pwd: "Type 'pwd' to see your current location in the file system.",
                cd: "Use 'cd documents' to enter the documents folder, or 'cd ..' to go back.",
                grep: "Try 'grep password suspicious.txt' to search for patterns in files.",
                nmap: "Use 'nmap 192.168.1.1' to scan a network for open ports.",
                netstat: "Type 'netstat -tulpn' to see active network connections.",
                ping: "Try 'ping google.com' to test internet connectivity.",
                ps: "Use 'ps aux' to see all running processes on the system.",
                top: "Type 'top' to see real-time process information.",
                tail: "Use 'tail -f /var/log/auth.log' to monitor log files in real-time.",
                chmod: "Try 'chmod 755 filename' to set file permissions.",
                find: "Use 'find . -name \"*.txt\"' to search for text files."
            };
            
            const hint = hints[incomplete.command] || `Try using the '${incomplete.command}' command to complete this objective.`;
            this.addOutput(`💡 Hint: ${hint}`, 'info');
        } else {
            this.addOutput('🎉 All objectives completed! Switch to a new lesson to continue learning.', 'success');
        }
    }

    // Additional command handlers...
    handleWhoami(args) {
        this.addOutput('cyberguard', 'result');
    }

    handleDate(args) {
        this.addOutput(new Date().toString(), 'result');
    }

    handleHistory(args) {
        this.commandHistory.forEach((cmd, index) => {
            this.addOutput(`${index + 1}  ${cmd}`, 'result');
        });
    }

    // Utility Methods
    addOutput(text, type = 'result') {
        const output = document.getElementById('output');
        const line = document.createElement('div');
        line.className = `output-line output-${type}`;
        line.innerHTML = text;
        output.appendChild(line);
    }

    scrollToBottom() {
        const output = document.getElementById('output');
        output.scrollTop = output.scrollHeight;
    }

    updatePrompt() {
        const prompt = document.querySelector('.prompt');
        const path = this.currentPath.replace('/home/cyberguard', '~');
        prompt.textContent = `cyberguard@security-lab:${path}$ `;
    }

    switchLesson(lessonKey) {
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelector(`[data-lesson="${lessonKey}"]`).classList.add('active');
        this.currentLesson = lessonKey;
        this.updateLessonDisplay();
        
        this.addOutput(`\n📚 Switched to lesson: ${this.lessons[lessonKey].title}`, 'info');
        this.addOutput('Type "hint" for guidance on the current objectives.', 'info');
    }

    updateLessonDisplay() {
        const lesson = this.lessons[this.currentLesson];
        const content = document.getElementById('lesson-content');
        
        const objectivesList = lesson.objectives.map(obj => 
            `<li class="${obj.completed ? 'completed' : ''}">${obj.description}</li>`
        ).join('');
        
        content.innerHTML = `
            <h4>${lesson.title}</h4>
            <p>${lesson.description}</p>
            <div class="objectives">
                <h5>Objectives:</h5>
                <ul id="objectives-list">${objectivesList}</ul>
            </div>
        `;
    }

    updateStats() {
        const commandsLearned=localStorage.getItem("commands-learned")||0
        if(commandsLearned<this.completedCommands.size){
            localStorage.setItem("commands-learned",this.completedCommands.size)
        }
        document.getElementById('commands-learned').textContent = this.completedCommands.size;
        document.getElementById('missions-completed').textContent = this.achievements.size;
    }

    updateProgress() {
        // Update progress bars based on completed commands
        const categories = {
            basics: ['ls', 'pwd', 'cd', 'grep', 'cat'],
            network: ['nmap', 'netstat', 'ping', 'ss'],
            security: ['chmod', 'ssh', 'iptables', 'sudo']
        };

        Object.keys(categories).forEach(category => {
            const completed = categories[category].filter(cmd => 
                this.completedCommands.has(cmd)
            ).length;
            const total = categories[category].length;
            const percentage = (completed / total) * 100;
            
            const progressBar = document.getElementById(`progress-${category}`);
            if (progressBar) {
                progressBar.style.width = `${percentage}%`;
            }
        });
    }

    showAchievement(title, description) {
        const popup = document.getElementById('achievement-popup');
        document.getElementById('achievement-title').textContent = title;
        document.getElementById('achievement-desc').textContent = description;
        
        popup.classList.remove('hidden');
        
        document.querySelector('.achievement-close').onclick = () => {
            popup.classList.add('hidden');
        };
        
        setTimeout(() => {
            popup.classList.add('hidden');
        }, 5000);
    }

    completedLesson(lessonKey) {
        this.achievements.add(lessonKey);
        this.showAchievement(
            `Mission Complete: ${this.lessons[lessonKey].title}`, 
            'You have mastered all commands in this lesson!'
        );
    }

    navigateHistory(direction, input) {
        if (this.commandHistory.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            input.value = '';
            return;
        }
        
        input.value = this.commandHistory[this.historyIndex] || '';
    }

    showSuggestions(input) {
        if (!input.trim()) {
            document.getElementById('suggestions').classList.add('hidden');
            return;
        }
        
        const matches = Object.keys(this.commands)
            .filter(cmd => cmd.startsWith(input.toLowerCase()))
            .slice(0, 5);
        
        if (matches.length === 0) {
            document.getElementById('suggestions').classList.add('hidden');
            return;
        }
        
        const suggestionsContent = document.querySelector('.suggestions-content');
        suggestionsContent.innerHTML = matches.map(cmd => 
            `<div class="suggestion-item" onclick="document.getElementById('command-input').value='${cmd}'">
                <span class="suggestion-command">${cmd}</span>
            </div>`
        ).join('');
        
        document.getElementById('suggestions').classList.remove('hidden');
    }

    handleTabCompletion(input) {
        const matches = Object.keys(this.commands)
            .filter(cmd => cmd.startsWith(input.value.toLowerCase()));
        
        if (matches.length === 1) {
            input.value = matches[0] + ' ';
        }
    }

    loadProgress() {
        const saved = localStorage.getItem('cyberTerminalProgress');
        if (saved) {
            const data = JSON.parse(saved);
            this.completedCommands = new Set(data.commands || []);
            this.achievements = new Set(data.achievements || []);
            this.updateStats();
            this.updateProgress();
        }
    }

    saveProgress() {
        const data = {
            commands: Array.from(this.completedCommands),
            achievements: Array.from(this.achievements)

        };
        localStorage.setItem('cyberTerminalProgress', JSON.stringify(data));
    }

    // Missing command implementations
    handleSs(args) {
        this.addOutput(`
Netid State   Recv-Q Send-Q Local Address:Port  Peer Address:Port
tcp   LISTEN  0      128    127.0.0.1:22        *:*
tcp   LISTEN  0      128    0.0.0.0:80          *:*  
tcp   ESTAB   0      0      10.0.0.5:22         192.168.1.100:45234

<span class="output-info">💡 ss is the modern replacement for netstat</span>
        `.trim(), 'result');
    }

    handleKill(args) {
        if (args.length === 0) {
            this.addOutput('Usage: kill [PID] or kill -9 [PID]', 'error');
            return;
        }
        
        const pid = args[args.length - 1];
        this.addOutput(`Process ${pid} terminated`, 'success');
    }

    handleJobs(args) {
        this.addOutput(`
[1]+  Running    nmap -sS 192.168.1.0/24 &
[2]-  Stopped    tail -f /var/log/auth.log
        `.trim(), 'result');
    }

    handleAwk(args) {
        this.addOutput(`
192.168.1.100 - Failed login
192.168.1.101 - Successful login  
192.168.1.102 - Multiple attempts
192.168.1.255 - Suspicious activity

<span class="output-info">💡 awk is powerful for processing structured log data</span>
        `.trim(), 'result');
    }

    handleJournalctl(args) {
        this.addOutput(`
Aug 30 19:15:23 security-lab systemd[1]: Started Session c1 of user cyber.
Aug 30 19:16:45 security-lab sshd[1234]: Failed password for invalid user admin
Aug 30 19:17:12 security-lab kernel: [UFW BLOCK] IN=eth0 OUT= SRC=192.168.1.100
Aug 30 19:18:33 security-lab fail2ban.actions: WARNING [sshd] Ban 192.168.1.100

<span class="output-info">💡 Use journalctl -f to follow logs in real-time</span>
        `.trim(), 'result');
    }

    handleChmod(args) {
        if (args.length < 2) {
            this.addOutput('Usage: chmod [permissions] [file] , sample permissions:[u+x,g-w,o+r]', 'error');
            return;
        }
        
        const perms = args[0];
        const file = args[1];
        this.addOutput(`Changed permissions of '${file}' to ${perms}`, 'success');
    }

    handleSsh(args) {
        if (args.length === 0) {
            this.addOutput('Usage: ssh [user@]hostname', 'error');
            return;
        }
        
        const target = args[0];
        this.addOutput(`Connecting to ${target}...`, 'info');
        setTimeout(() => {
            this.addOutput(`Connection established to ${target}`, 'success');
        }, 1500);
    }

    handleIptables(args) {
        this.addOutput(`
Chain INPUT (policy ACCEPT)
target     prot opt source               destination
ACCEPT     all  --  127.0.0.1/8          anywhere
DROP       tcp  --  192.168.1.100        anywhere             tcp dpt:22
ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:80

<span class="output-warning">⚠️  Blocked suspicious IP from SSH access</span>
        `.trim(), 'result');
    }

    handleSudo(args) {
        if (args.length === 0) {
            this.addOutput('Usage: sudo [command]', 'error');
            return;
        }
        
        this.addOutput(`[sudo] password for cyberguard: ********`, 'info');
        this.addOutput(`Executing: ${args.join(' ')} with elevated privileges`, 'success');
    }

    handleStrings(args) {
        if (args.length === 0) {
            this.addOutput('Usage: strings [file]', 'error');
            return;
        }
        
        this.addOutput(`
config.ini
192.168.1.1
admin:password123
/tmp/.hidden
GET /admin/login
User-Agent: Suspicious
        `.trim(), 'result');
    }

    handleMd5sum(args) {
        if (args.length === 0) {
            this.addOutput('Usage: md5sum [file]', 'error');
            return;
        }
        
        const file = args[0];
        const hash = 'd41d8cd98f00b204e9800998ecf8427e';
        this.addOutput(`${hash}  ${file}`, 'result');
    }

    handleFile(args) {
        if (args.length === 0) {
            this.addOutput('Usage: file [filename]', 'error');
            return;
        }
        
        const filename = args[0];
        const types = {
            'suspicious.txt': 'ASCII text',
            'malware.bin': 'ELF 64-bit LSB executable',
            'document.pdf': 'PDF document, version 1.4',
            'image.jpg': 'JPEG image data'
        };
        
        const type = types[filename] || 'data';
        this.addOutput(`${filename}: ${type}`, 'result');
    }

    handleCat(args) {
        if (args.length === 0) {
            this.addOutput('Usage: cat [file]', 'error');
            return;
        }
        
        const file = args[0];
        const contents = {
            'suspicious.txt': 'Failed login attempts detected\nUnusual network traffic\nPotential security breach',
            'README.md': '# CyberGuard Terminal\nWelcome to cybersecurity training!'
        };
        
        this.addOutput(contents[file] || `cat: ${file}: No such file or directory`, 
                      contents[file] ? 'result' : 'error');
    }

    handleMan(args) {
        if (args.length === 0) {
            this.addOutput('Usage: man [command]', 'error');
            return;
        }
        
        const cmd = args[0];
        this.addOutput(`Manual page for ${cmd} - use 'help' for available commands`, 'info');
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new CyberTerminal();
    
    // Auto-save progress
    setInterval(() => {
        window.terminal.saveProgress();
    }, 30000);
});
