class DDoSDefenseSimulator {
    constructor() {
        this.isAttackActive = false;
        this.attackIntensity = 0;
        this.attackPattern = 'sustained';
        this.attackSources = [];
        this.attackStartTime = null;
        this.attackDuration = 0;
        this.currentAttackType = null;
        
        // Realistic defense configuration
        this.defenseConfig = {
            firewall: true,
            rateLimit: 100,
            timeout: 60,
            geoBlocking: [],
            loadBalancer: false,
            serverCount: 3,
            loadDistribution: 'round-robin',
            cdn: false,
            cacheTTL: 60,
            edgeLocations: 5,
            advancedFiltering: false,
            botDetection: 5,
            captchaThreshold: 50,
            customRules: '',
            ddosProtection: false,
            blackholRouting: false,
            synFloodProtection: false,
            detectionSensitivity: 5
        };
        
        // Enhanced statistics
        this.stats = {
            totalRequests: 0,
            blockedRequests: 0,
            allowedRequests: 0,
            currentRPS: 0,
            peakRPS: 0,
            effectiveness: 0,
            score: 0,
            falsePositives: 0,
            latency: 50,
            packetLoss: 0,
            serverLoad: [0, 0, 0],
            bandwidthUtilization: 0,
            connectionCount: 0,
            zombieIPs: new Set(),
            legitimateIPs: new Set()
        };
        
        // Real attack types
        this.attackTypes = {
            volumetric: {
                name: 'Volumetric Attack',
                characteristics: {
                    rampUp: 'fast',
                    pattern: 'sustained',
                    peakMultiplier: 50,
                    duration: [30, 180],
                    sources: [100, 5000],
                    bandwidth: 'high',
                    difficulty: 'medium'
                },
                variants: ['UDP Flood', 'ICMP Flood', 'Amplification']
            },
            protocol: {
                name: 'Protocol Attack',
                characteristics: {
                    rampUp: 'gradual',
                    pattern: 'burst',
                    peakMultiplier: 20,
                    duration: [60, 300],
                    sources: [10, 100],
                    bandwidth: 'low',
                    difficulty: 'high'
                },
                variants: ['SYN Flood', 'TCP RST', 'LAND Attack']
            },
            application: {
                name: 'Application Layer Attack',
                characteristics: {
                    rampUp: 'slow',
                    pattern: 'adaptive',
                    peakMultiplier: 10,
                    duration: [120, 600],
                    sources: [5, 50],
                    bandwidth: 'low',
                    difficulty: 'very_high'
                },
                variants: ['HTTP Flood', 'Slowloris', 'RUDY']
            }
        };
        
        // Geo sources
        this.geoSources = {
            'CN': { weight: 0.25, hostile: 0.8, name: 'China', flag: '🇨🇳' },
            'RU': { weight: 0.18, hostile: 0.7, name: 'Russia', flag: '🇷🇺' },
            'US': { weight: 0.15, hostile: 0.3, name: 'United States', flag: '🇺🇸' },
            'BR': { weight: 0.12, hostile: 0.5, name: 'Brazil', flag: '🇧🇷' },
            'IN': { weight: 0.10, hostile: 0.4, name: 'India', flag: '🇮🇳' },
            'KR': { weight: 0.08, hostile: 0.3, name: 'South Korea', flag: '🇰🇷' },
            'DE': { weight: 0.06, hostile: 0.2, name: 'Germany', flag: '🇩🇪' },
            'FR': { weight: 0.06, hostile: 0.2, name: 'France', flag: '🇫🇷' }
        };
        
        this.uptime = 0;
        this.achievements = new Set();
        this.trafficData = [];
        this.latencyData = [];
        this.maxDataPoints = 100;
        this.realTimeEvents = [];
        this.emergencyMode = false;
        
        this.init();
    }

    init() {
        this.setupLoadingScreen();
        this.setupEventListeners();
        this.setupTrafficChart();
        this.startRealisticSimulation();
        this.updateServerHealth();
        this.startUptimeCounter();
        this.initializeBaselineTraffic();
    }

    setupLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            document.getElementById('main-interface').classList.remove('hidden');
            this.showWelcomeMessage();
        }, 1500);
    }

    initializeBaselineTraffic() {
        // Generate realistic baseline traffic
        const hour = new Date().getHours();
        let baselineMultiplier = 1.0;
        
        if (hour >= 9 && hour <= 17) {
            baselineMultiplier = 1.5;
        } else if (hour >= 18 && hour <= 22) {
            baselineMultiplier = 1.2;
        } else {
            baselineMultiplier = 0.7;
        }
        
        // Generate legitimate IPs
        for (let i = 0; i < 50 + Math.random() * 100; i++) {
            this.stats.legitimateIPs.add(this.generateRealisticIP());
        }
    }

    generateRealisticIP() {
        const ranges = [
            '192.168.',
            '10.0.',
            '203.0.',
            '151.101.',
            '8.8.',
            '1.1.',
        ];
        
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        const ip = range + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256);
        return ip;
    }

    setupEventListeners() {
        // Configuration controls
        document.getElementById('firewall-enabled').addEventListener('change', (e) => {
            this.defenseConfig.firewall = e.target.checked;
            this.updateDefenseList();
        });

        document.getElementById('rate-limit').addEventListener('input', (e) => {
            this.defenseConfig.rateLimit = parseInt(e.target.value);
            document.getElementById('rate-limit-value').textContent = e.target.value;
        });

        document.getElementById('timeout-duration').addEventListener('input', (e) => {
            this.defenseConfig.timeout = parseInt(e.target.value);
            document.getElementById('timeout-value').textContent = e.target.value;
        });

        document.getElementById('ddos-protection').addEventListener('change', (e) => {
            this.defenseConfig.ddosProtection = e.target.checked;
            this.updateDefenseList();
        });

        document.getElementById('detection-sensitivity').addEventListener('input', (e) => {
            this.defenseConfig.detectionSensitivity = parseInt(e.target.value);
            document.getElementById('detection-sensitivity-value').textContent = e.target.value;
        });

        document.getElementById('blackhole-routing').addEventListener('change', (e) => {
            this.defenseConfig.blackholRouting = e.target.checked;
            this.updateDefenseList();
        });

        document.getElementById('syn-flood-protection').addEventListener('change', (e) => {
            this.defenseConfig.synFloodProtection = e.target.checked;
            this.updateDefenseList();
        });

        document.getElementById('loadbalancer-enabled').addEventListener('change', (e) => {
            this.defenseConfig.loadBalancer = e.target.checked;
            this.updateDefenseList();
            this.updateServerHealth();
        });

        document.getElementById('server-count').addEventListener('input', (e) => {
            this.defenseConfig.serverCount = parseInt(e.target.value);
            document.getElementById('server-count-value').textContent = e.target.value;
            this.updateServerHealth();
        });

        document.getElementById('load-distribution').addEventListener('change', (e) => {
            this.defenseConfig.loadDistribution = e.target.value;
        });

        document.getElementById('cdn-enabled').addEventListener('change', (e) => {
            this.defenseConfig.cdn = e.target.checked;
            this.updateDefenseList();
        });

        document.getElementById('cache-ttl').addEventListener('input', (e) => {
            this.defenseConfig.cacheTTL = parseInt(e.target.value);
            document.getElementById('cache-ttl-value').textContent = e.target.value;
        });

        document.getElementById('edge-locations').addEventListener('input', (e) => {
            this.defenseConfig.edgeLocations = parseInt(e.target.value);
            document.getElementById('edge-locations-value').textContent = e.target.value;
        });

        document.getElementById('advanced-filtering').addEventListener('change', (e) => {
            this.defenseConfig.advancedFiltering = e.target.checked;
            this.updateDefenseList();
        });

        document.getElementById('bot-detection').addEventListener('input', (e) => {
            this.defenseConfig.botDetection = parseInt(e.target.value);
            document.getElementById('bot-detection-value').textContent = e.target.value;
        });

        document.getElementById('captcha-threshold').addEventListener('input', (e) => {
            this.defenseConfig.captchaThreshold = parseInt(e.target.value);
            document.getElementById('captcha-threshold-value').textContent = e.target.value;
        });

        // Control buttons
        document.getElementById('apply-config').addEventListener('click', () => {
            this.applyConfiguration();
        });

        document.getElementById('reset-config').addEventListener('click', () => {
            this.resetConfiguration();
        });

        document.getElementById('test-defense').addEventListener('click', () => {
            this.testDefense();
        });

        document.getElementById('emergency-mode').addEventListener('click', () => {
            this.activateEmergencyMode();
        });

        // Scenario buttons
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const scenario = e.target.dataset.scenario;
                this.startAttackScenario(scenario);
            });
        });

        // Alert modal
        document.getElementById('activate-emergency').addEventListener('click', () => {
            this.activateEmergencyMode();
            this.hideAlert();
        });

        document.getElementById('dismiss-alert').addEventListener('click', () => {
            this.hideAlert();
        });
    }

    saveDDoSStats() {
        const ddosStats = {
            score: this.stats.score,
            effectiveness: this.stats.effectiveness,
            totalRequests: this.stats.totalRequests,
            blockedRequests: this.stats.blockedRequests,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('ddos_defense_stats', JSON.stringify(ddosStats));
        console.log(`🚫 DDoS stats saved: ${Math.round(this.stats.effectiveness)}%`);
    }


    setupTrafficChart() {
        this.canvas = document.getElementById('traffic-chart');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size to match display size
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    startRealisticSimulation() {
        // Main simulation loop
        setInterval(() => {
            this.updateRealisticTrafficData();
            this.calculateRealisticStats();
            this.simulateNetworkConditions();
            this.updateRealisticUI();
            this.drawEnhancedTrafficChart();
            this.checkRealisticThreats();
            this.processSecurityEvents();
        }, 500);

        // Secondary analysis loop
        setInterval(() => {
            this.analyzeTrafficPatterns();
            this.updateThreatIntelligence();
            this.optimizeDefenses();
        }, 2000);
    }
    updateRealisticTrafficData() {
        const now = Date.now();
        
        // Base legitimate traffic
        let legitimateTraffic = this.calculateLegitimateTraffic();
        
        // Add attack traffic if active
        let attackTraffic = 0;
        if (this.isAttackActive) {
            attackTraffic = this.calculateAttackTraffic(now);
        }
        
        const totalTraffic = legitimateTraffic + attackTraffic;
        
        // Apply defense filtering
        const filteredTraffic = this.applyDefenseFiltering(totalTraffic, attackTraffic);
        
        this.stats.currentRPS = Math.floor(filteredTraffic);
        this.stats.peakRPS = Math.max(this.stats.peakRPS, this.stats.currentRPS);
        this.stats.totalRequests += this.stats.currentRPS;
        
        // Update data arrays
        this.trafficData.push(totalTraffic);
        if (this.trafficData.length > this.maxDataPoints) {
            this.trafficData.shift();
        }
        
        // Calculate latency
        const latency = this.calculateRealisticLatency(totalTraffic);
        this.latencyData.push(latency);
        if (this.latencyData.length > this.maxDataPoints) {
            this.latencyData.shift();
        }
    }

    calculateLegitimateTraffic() {
        const hour = new Date().getHours();
        let baseRate = 80;
        
        // Business hours pattern
        if (hour >= 8 && hour <= 18) {
            baseRate *= 1.8;
        } else if (hour >= 19 && hour <= 23) {
            baseRate *= 1.3;
        } else {
            baseRate *= 0.6;
        }
        
        // Add realistic variance
        const variance = this.gaussianRandom(0, baseRate * 0.1);
        
        // Weekly patterns
        const dayOfWeek = new Date().getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            baseRate *= 0.7;
        }
        
        return Math.max(10, baseRate + variance);
    }

    calculateAttackTraffic(currentTime) {
        if (!this.attackStartTime) {
            this.attackStartTime = currentTime;
        }
        
        const attackAge = (currentTime - this.attackStartTime) / 1000;
        const attackType = this.attackTypes[this.currentAttackType];
        
        if (!attackType) return 0;
        
        let intensity = this.attackIntensity;
        
        // Apply realistic attack patterns
        switch (attackType.characteristics.rampUp) {
            case 'fast':
                intensity = this.attackIntensity;
                break;
            case 'gradual':
                intensity = Math.min(this.attackIntensity, (attackAge / 30) * this.attackIntensity);
                break;
            case 'slow':
                intensity = this.attackIntensity * (1 - Math.exp(-attackAge / 60));
                break;
        }
        
        // Apply pattern variations
        switch (attackType.characteristics.pattern) {
            case 'sustained':
                break;
            case 'burst':
                intensity *= (Math.sin(attackAge * 0.628) + 1) * 0.5 + 0.5;
                break;
            case 'adaptive':
                const blockingRate = this.stats.blockedRequests / Math.max(1, this.stats.totalRequests);
                intensity *= (1 + blockingRate * 0.5);
                break;
        }
        
        return intensity;
    }

    applyDefenseFiltering(totalTraffic, attackTraffic) {
        let blockedTraffic = 0;
        let allowedTraffic = totalTraffic;
        
        // Rate limiting
        if (this.defenseConfig.firewall && totalTraffic > this.defenseConfig.rateLimit) {
            const excess = totalTraffic - this.defenseConfig.rateLimit;
            blockedTraffic += Math.min(excess, attackTraffic);
            allowedTraffic = this.defenseConfig.rateLimit;
        }
        
        // DDoS protection
        if (this.defenseConfig.ddosProtection && attackTraffic > 0) {
            const detectionRate = Math.min(0.95, 0.3 + (this.defenseConfig.detectionSensitivity / 10) * 0.6);
            const detectedAttack = attackTraffic * detectionRate;
            blockedTraffic += detectedAttack;
            allowedTraffic -= detectedAttack;
            
            // False positives
            const falsePositiveRate = Math.max(0.001, 0.05 - (this.defenseConfig.detectionSensitivity / 10) * 0.04);
            const falsePositives = (totalTraffic - attackTraffic) * falsePositiveRate;
            this.stats.falsePositives += falsePositives;
            blockedTraffic += falsePositives;
            allowedTraffic -= falsePositives;
        }
        
        // CDN filtering
        if (this.defenseConfig.cdn) {
            const cdnEffectiveness = Math.min(0.8, this.defenseConfig.edgeLocations * 0.1);
            const cdnBlocked = attackTraffic * cdnEffectiveness;
            blockedTraffic += cdnBlocked;
            allowedTraffic -= cdnBlocked;
        }
        
        // Advanced filtering
        if (this.defenseConfig.advancedFiltering) {
            const advancedDetection = attackTraffic * 0.7;
            blockedTraffic += advancedDetection;
            allowedTraffic -= advancedDetection;
        }
        
        this.stats.blockedRequests += blockedTraffic;
        this.stats.allowedRequests += Math.max(0, allowedTraffic);
        
        return Math.max(0, allowedTraffic);
    }
    stopAttack() {
        if (!this.isAttackActive) return;
      
        // Immediately reduce attack intensity and mark attack as inactive
        this.attackIntensity = 0;
        this.isAttackActive = false;
        this.attackPattern = null;
        this.currentAttackType = null;
        this.attackStartTime = null;

        // Log the mitigation event
        this.addLogEntry("DDoS attack mitigated successfully.", "success");
      
        // Update UI elements
        this.hideAlert();
        this.updateGeoAttackDisplay();

      
        // Evaluate performance and achievements
        this.checkAchievements();
      
        // Optionally reset defense boosts if emergency mode was active
        if (this.emergencyMode) {
          this.emergencyMode = false;
          const btn = document.getElementById('emergency-mode');
          btn.textContent = '🚨 EMERGENCY MODE';
          btn.classList.remove('active');
        }
      }
      
    calculateRealisticLatency(traffic) {
        let latency = 50; // Base latency
        
        // Load-based latency increase
        const loadFactor = traffic / 100;
        latency += loadFactor * 20;
        
        // Server processing delay
        const avgServerLoad = this.stats.serverLoad.reduce((a, b) => a + b, 0) / this.stats.serverLoad.length;
        latency += avgServerLoad * 2;
        
        // Network jitter
        latency += this.gaussianRandom(0, 5);
        
        // DDoS protection overhead
        if (this.defenseConfig.ddosProtection && this.isAttackActive) {
            latency += 15;
        }
        
        // CDN reduces latency
        if (this.defenseConfig.cdn) {
            latency *= 0.7;
        }
        
        this.stats.latency = Math.max(1, latency);
        return this.stats.latency;
    }

    simulateNetworkConditions() {
        // Packet loss simulation
        let packetLoss = 0.001;
        
        if (this.isAttackActive) {
            packetLoss += this.attackIntensity / 10000;
        }
        
        const maxServerLoad = Math.max(...this.stats.serverLoad);
        if (maxServerLoad > 80) {
            packetLoss += (maxServerLoad - 80) / 1000;
        }
        
        this.stats.packetLoss = Math.min(0.1, packetLoss);
        
        // Connection count
        const baseConnections = this.stats.currentRPS * 0.1;
        this.stats.connectionCount = Math.floor(baseConnections);
        
        // Bandwidth utilization
        const avgRequestSize = 1500;
        const bandwidth = (this.stats.currentRPS * avgRequestSize * 8) / (1024 * 1024);
        this.stats.bandwidthUtilization = bandwidth;
    }

    calculateRealisticStats() {
        // Calculate defense effectiveness
        let effectiveness = 0;
        let maxEffectiveness = 0;
        
        if (this.defenseConfig.firewall) {
            effectiveness += 15;
            maxEffectiveness += 15;
        }
        
        maxEffectiveness += 20;
        if (this.defenseConfig.rateLimit > 50) {
            effectiveness += Math.min(20, this.defenseConfig.rateLimit / 50 * 20);
        }
        
        maxEffectiveness += 15;
        if (this.defenseConfig.loadBalancer) {
            const serverEffectiveness = Math.min(15, this.defenseConfig.serverCount * 3);
            effectiveness += serverEffectiveness;
        }
        
        maxEffectiveness += 25;
        if (this.defenseConfig.cdn) {
            const cdnEffectiveness = Math.min(25, this.defenseConfig.edgeLocations * 2.5);
            effectiveness += cdnEffectiveness;
        }
        
        maxEffectiveness += 25;
        if (this.defenseConfig.advancedFiltering) {
            effectiveness += 25;
        }
        
        if (this.defenseConfig.ddosProtection) {
            effectiveness += 20;
            maxEffectiveness += 20;
        }
        
        this.stats.effectiveness = Math.min(100, (effectiveness / Math.max(maxEffectiveness, 1)) * 100);
        
        // Update server loads
        this.updateServerLoads();
        
        // Calculate score
        if (this.isAttackActive) {
            const blockingEfficiency = this.stats.effectiveness / 100;
            const latencyPenalty = Math.max(0, 1 - (this.stats.latency - 50) / 500);
            const falsePositivePenalty = Math.max(0, 1 - this.stats.falsePositives / 1000);
            
            this.stats.score += Math.floor(blockingEfficiency * latencyPenalty * falsePositivePenalty * 10);

        }
        this.saveDDoSStats();
    }

    updateServerLoads() {
        const totalLoad = this.stats.currentRPS;
        
        if (this.defenseConfig.loadBalancer) {
            const serverCount = this.defenseConfig.serverCount;
            
            switch (this.defenseConfig.loadDistribution) {
                case 'round-robin':
                    for (let i = 0; i < serverCount; i++) {
                        this.stats.serverLoad[i] = Math.min(100, (totalLoad / serverCount) * 0.8 + Math.random() * 20);
                    }
                    break;
                    
                case 'least-connections':
                    const sorted = [...Array(serverCount)].map((_, i) => ({index: i, load: this.stats.serverLoad[i] || 0}))
                        .sort((a, b) => a.load - b.load);
                    
                    for (let i = 0; i < serverCount; i++) {
                        const server = sorted[i];
                        server.load = Math.min(100, server.load + (totalLoad / serverCount) * (1 - i * 0.1));
                        this.stats.serverLoad[server.index] = server.load;
                    }
                    break;
                    
                case 'weighted':
                    const weights = [0.4, 0.35, 0.25];
                    for (let i = 0; i < serverCount && i < weights.length; i++) {
                        this.stats.serverLoad[i] = Math.min(100, totalLoad * weights[i] * 0.8 + Math.random() * 20);
                    }
                    break;
            }
        } else {
            this.stats.serverLoad[0] = Math.min(100, totalLoad * 0.8);
            for (let i = 1; i < 3; i++) {
                this.stats.serverLoad[i] = 0;
            }
        }
    }

    updateRealisticUI() {
        // Update traffic stats
        document.getElementById('current-rps').textContent = this.stats.currentRPS.toLocaleString();
        document.getElementById('peak-rps').textContent = this.stats.peakRPS.toLocaleString();
        document.getElementById('avg-latency').textContent = Math.floor(this.stats.latency) + 'ms';
        document.getElementById('blocked-requests').textContent = this.stats.blockedRequests.toLocaleString();
        document.getElementById('allowed-requests').textContent = this.stats.allowedRequests.toLocaleString();
        document.getElementById('false-positives').textContent = Math.floor(this.stats.falsePositives).toLocaleString();
        
        // Update effectiveness meter
        const effectivenessCircle = document.getElementById('effectiveness-circle');
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (this.stats.effectiveness / 100) * circumference;
        effectivenessCircle.style.strokeDashoffset = offset;
        document.getElementById('effectiveness-value').textContent = Math.floor(this.stats.effectiveness);
        
        // Update resource usage
        const avgServerLoad = this.stats.serverLoad.reduce((a, b) => a + b, 0) / 3;
        const memoryUsage = Math.min(100, 25 + (this.stats.currentRPS / 20) + (this.stats.connectionCount / 100));
        const bandwidthUsage = Math.min(100, (this.stats.bandwidthUtilization / 100) * 100);
        const connectionUsage = Math.min(100, this.stats.connectionCount / 10);
        
        document.getElementById('cpu-usage').style.width = avgServerLoad + '%';
        document.getElementById('cpu-value').textContent = Math.floor(avgServerLoad) + '%';
        document.getElementById('memory-usage').style.width = memoryUsage + '%';
        document.getElementById('memory-value').textContent = Math.floor(memoryUsage) + '%';
        document.getElementById('bandwidth-usage').style.width = bandwidthUsage + '%';
        document.getElementById('bandwidth-value').textContent = Math.floor(bandwidthUsage) + '%';
        document.getElementById('connection-usage').style.width = connectionUsage + '%';
        document.getElementById('connection-value').textContent = this.stats.connectionCount;
        
        // Update score

        document.getElementById('total-score').textContent = this.stats.score.toLocaleString();
        
        
        // Update attack analysis
        if (this.isAttackActive) {
            this.updateRealisticAttackAnalysis();
        }
    }

    updateRealisticAttackAnalysis() {
        const attackTypes = ['volumetric', 'protocol', 'application'];
        
        attackTypes.forEach(type => {
            let percentage = 0;
            
            if (this.currentAttackType === type) {
                percentage = 60 + Math.random() * 40; // Current attack type gets higher percentage
            } else {
                percentage = Math.random() * 30; // Other types get random small percentages
            }
            
            const fill = document.querySelector(`[data-type="${type}"]`);
            const percentageSpan = fill.parentElement.parentElement.querySelector('.attack-percentage');
            
            if (fill && percentageSpan) {
                fill.style.width = percentage + '%';
                percentageSpan.textContent = Math.floor(percentage) + '%';
            }
        });
    }

    drawEnhancedTrafficChart() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        this.drawChartGrid(ctx, canvas);
        
        // Draw traffic lines
        this.drawTrafficLine(ctx, canvas, this.trafficData, '#00ff41', 2);
        
        // Draw latency (scaled for visibility)
        const scaledLatency = this.latencyData.map(l => l * 3);
        this.drawTrafficLine(ctx, canvas, scaledLatency, '#ffff00', 1);
        
        // Draw blocked traffic if attack is active
        if (this.isAttackActive) {
            const blockedData = this.calculateBlockedTrafficData();
            this.drawTrafficLine(ctx, canvas, blockedData, '#ff0040', 2);
        }
    }

    drawChartGrid(ctx, canvas) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        // Horizontal lines
        for (let i = 0; i <= 10; i++) {
            const y = (canvas.height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Vertical lines
        for (let i = 0; i <= 10; i++) {
            const x = (canvas.width / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
    }

    drawTrafficLine(ctx, canvas, data, color, lineWidth) {
        if (data.length < 2) return;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        
        const maxValue = Math.max(...data, 1000); // Minimum scale
        
        for (let i = 0; i < data.length; i++) {
            const x = (canvas.width / this.maxDataPoints) * i;
            const y = canvas.height - (data[i] / maxValue) * canvas.height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }

    calculateBlockedTrafficData() {
        return this.trafficData.map(total => {
            const blockingRate = this.stats.effectiveness / 100;
            return total * blockingRate * (this.isAttackActive ? 0.8 : 0.1);
        });
    }

    checkRealisticThreats() {
        const threatLevel = document.getElementById('threat-level');
        const systemStatus = document.getElementById('system-status');
        
        if (this.stats.currentRPS > 500) {
            threatLevel.textContent = 'HIGH';
            threatLevel.className = 'threat-indicator high';
            systemStatus.textContent = 'UNDER ATTACK';
            systemStatus.style.color = '#ff0040';
            
            if (this.isAttackActive && !document.getElementById('attack-alert').classList.contains('hidden') === false) {
                this.showAttackAlert();
            }
        } else if (this.stats.currentRPS > 200) {
            threatLevel.textContent = 'MEDIUM';
            threatLevel.className = 'threat-indicator medium';
            systemStatus.textContent = 'ELEVATED';
            systemStatus.style.color = '#ffff00';
        } else {
            threatLevel.textContent = 'LOW';
            threatLevel.className = 'threat-indicator';
            systemStatus.textContent = 'SECURE';
            systemStatus.style.color = '#00ff41';
        }
    }

    processSecurityEvents() {
        // Generate realistic security events
        if (this.isAttackActive && Math.random() < 0.1) {
            const events = [
                `Blocked ${Math.floor(Math.random() * 1000)} malicious requests`,
                `Rate limit triggered for ${this.generateRealisticIP()}`,
                `Geo-blocking active: ${Math.floor(Math.random() * 50)} IPs blocked`,
                `DDoS signature detected: ${this.currentAttackType || 'Unknown'}`,
                `Auto-scaling triggered: Adding server capacity`
            ];
            
            const event = events[Math.floor(Math.random() * events.length)];
            this.addLogEntry(event, 'blocked');
        }
    }

    analyzeTrafficPatterns() {
        if (this.trafficData.length < 10) return;
        
        const recent = this.trafficData.slice(-10);
        const average = recent.reduce((a, b) => a + b, 0) / recent.length;
        const variance = recent.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / recent.length;
        const stdDev = Math.sqrt(variance);
        
        const currentTraffic = this.trafficData[this.trafficData.length - 1];
        if (currentTraffic > average + (stdDev * 3)) {
            this.addLogEntry(`Traffic anomaly detected: ${Math.floor(currentTraffic)} RPS (avg: ${Math.floor(average)})`, 'blocked');
        }
    }

    updateThreatIntelligence() {
        if (this.isAttackActive && Math.random() < 0.1) {
            const threats = [
                'New botnet signatures detected',
                'Threat actor IP ranges identified',
                'Attack pattern analysis complete',
                'Malicious user agents blocked',
                'Geo-location filters updated'
            ];
            
            const threat = threats[Math.floor(Math.random() * threats.length)];
            this.addLogEntry(`Threat Intelligence: ${threat}`, 'blocked');
        }
    }

    optimizeDefenses() {
        // Auto-optimization based on conditions
        if (this.stats.currentRPS > this.defenseConfig.rateLimit * 1.5 && this.defenseConfig.firewall) {
            if (!this.isAttackActive && Math.random() < 0.1) {
                this.defenseConfig.rateLimit = Math.min(1000, this.defenseConfig.rateLimit * 1.1);
                document.getElementById('rate-limit').value = this.defenseConfig.rateLimit;
                document.getElementById('rate-limit-value').textContent = Math.floor(this.defenseConfig.rateLimit);
                this.addLogEntry('Auto-optimization: Rate limit increased', 'allowed');
            }
        }
    }
    startAttackScenario(scenario) {
        // Clear existing timer if any
        if (this.attackTimerInterval) {
            clearInterval(this.attackTimerInterval);
        }
        
        const timerElement = document.getElementById('attack-timer');
        
        this.isAttackActive = true;
        
        // Define attack config
        let attackConfig;
        switch (scenario) {
            case 'light':
                attackConfig = {
                    type: 'volumetric',
                    intensity: 150 + Math.random() * 100,
                    duration: 20,
                    sources: 50 + Math.random() * 100,
                    pattern: 'sustained'
                };
                break;
            case 'moderate':
                attackConfig = {
                    type: Math.random() < 0.6 ? 'volumetric' : 'protocol',
                    intensity: 400 + Math.random() * 300,
                    duration: 45,
                    sources: 200 + Math.random() * 500,
                    pattern: Math.random() < 0.5 ? 'sustained' : 'burst'
                };
                break;
            case 'severe':
                attackConfig = {
                    type: ['volumetric', 'protocol'][Math.floor(Math.random() * 2)],
                    intensity: 800 + Math.random() * 700,
                    duration: 90,
                    sources: 1000 + Math.random() * 2000,
                    pattern: 'adaptive'
                };
                break;
            case 'advanced':
                attackConfig = {
                    type: 'application',
                    intensity: 1200 + Math.random() * 800,
                    duration: 180,
                    sources: 50 + Math.random() * 200,
                    pattern: 'adaptive'
                };
                break;
        }
        
        this.currentAttackType = attackConfig.type;
        this.attackIntensity = attackConfig.intensity;
        
        this.generateAttackSources(attackConfig.sources);
        
        timerElement.innerHTML = attackConfig.duration;
        
        let remaining = attackConfig.duration;
        
        this.attackTimerInterval = setInterval(() => {
            remaining -= 1;
            if (remaining >= 0) {
                timerElement.innerHTML = remaining;
            }

            if (remaining <= 0) {
                clearInterval(this.attackTimerInterval);
                this.attackTimerInterval = null;

                this.showNotification(scenario+" attack","Completed")
                this.endAttack(scenario);
                this.stopAttack();
            }
        }, 1000);
    }
    

    generateAttackSources(count) {
        this.attackSources = [];
        this.stats.zombieIPs.clear();
        
        for (let i = 0; i < count; i++) {
            let country = this.selectHostileCountry();
            let ip = this.generateIPFromCountry(country);
            this.attackSources.push({ ip, country, firstSeen: Date.now() });
            this.stats.zombieIPs.add(ip);
        }
        
        this.updateGeoAttackDisplay();
    }

    selectHostileCountry() {
        const random = Math.random();
        let cumulative = 0;
        
        for (const [country, data] of Object.entries(this.geoSources)) {
            cumulative += data.weight * data.hostile;
            if (random < cumulative) {
                return country;
            }
        }
        
        return 'CN';
    }

    generateIPFromCountry(country) {
        const ipRanges = {
            'CN': ['223.0.', '124.0.', '61.0.'],
            'RU': ['95.0.', '178.0.', '91.0.'],
            'US': ['204.0.', '162.0.', '64.0.'],
            'BR': ['201.0.', '189.0.', '177.0.'],
            'IN': ['103.0.', '117.0.', '152.0.'],
            'KR': ['211.0.', '220.0.', '175.0.'],
            'DE': ['217.0.', '62.0.', '46.0.'],
            'FR': ['213.0.', '82.0.', '90.0.']
        };
        
        const ranges = ipRanges[country] || ['192.0.'];
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        return range + Math.floor(Math.random() * 256) + '.' + Math.floor(Math.random() * 256);
    }

    updateGeoAttackDisplay() {
        // const attackSources = document.getElementById('attack-sources');
        // const countryCounts = {};
        
        // // Count attacks by country
        // this.attackSources.forEach(source => {
        //     countryCounts[source.country] = (countryCounts[source.country] || 0) + 1;
        // });
        
        // // Update display
        // let html = '';
        // for (const [country, data] of Object.entries(this.geoSources)) {
        //     const count = countryCounts[country] || 0;
        //     html += `<div class="source-item">${data.flag} ${data.name}: <span>${count} attacks</span></div>`;
        // }
        
        // attackSources.innerHTML = html;
    }
    endAttack(scenario) {


        
        
        
        const duration = Math.floor((Date.now() - (this.attackStartTime || Date.now())) / 1000);
        this.addLogEntry(`Attack mitigated successfully - Duration: ${duration}s`, "allowed");
        
        const effectiveness = this.stats.effectiveness;
        const avgLatency = this.stats.latency;
        const falsePositives = this.stats.falsePositives;
        
        this.addLogEntry(`Performance - Effectiveness: ${Math.floor(effectiveness)}%, Latency: ${Math.floor(avgLatency)}ms`, "allowed");
        
        this.checkAchievements(scenario);
        this.hideAlert();
        

    }
    

    showAttackAlert() {
        const alert = document.getElementById('attack-alert');
        document.getElementById('alert-volume').textContent = this.stats.currentRPS + ' RPS';
        document.getElementById('alert-sources').textContent = this.attackSources.length;
        document.getElementById('alert-type').textContent = this.attackTypes[this.currentAttackType]?.name || 'Unknown';
        alert.classList.remove('hidden');
    }

    hideAlert() {
        document.getElementById('attack-alert').classList.add('hidden');
    }

    addLogEntry(message, type) {
        const logContainer = document.getElementById('attack-log');
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${timestamp}] ${message}`;
        
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
        
        // Keep only last 50 entries
        while (logContainer.children.length > 50) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }

    updateDefenseList() {
        const defenseList = document.getElementById('defense-list');
        defenseList.innerHTML = '';
        
        const defenses = [
            { key: 'firewall', name: 'Firewall', icon: '' },
            { key: 'ddosProtection', name: 'DDoS Protection', icon: '' },
            { key: 'loadBalancer', name: 'Load Balancer', icon: '' },
            { key: 'cdn', name: 'CDN', icon: '' },
            { key: 'advancedFiltering', name: 'Advanced Filtering', icon: '' },
            { key: 'blackholRouting', name: 'Blackhole Routing', icon: '' },
            { key: 'synFloodProtection', name: 'SYN Flood Protection', icon: '' }
        ];
        
        defenses.forEach(defense => {
            if (this.defenseConfig[defense.key]) {
                const item = document.createElement('div');
                item.className = 'defense-item';
                item.innerHTML = `
                    <span class="defense-icon">${defense.icon}</span>
                    <span class="defense-name">${defense.name}</span>
                    <span class="defense-status">ACTIVE</span>
                `;
                defenseList.appendChild(item);
            }
        });
    }

    updateServerHealth() {
        const serverHealth = document.getElementById('server-health');
        serverHealth.innerHTML = '';
        
        for (let i = 0; i < this.defenseConfig.serverCount; i++) {
            const server = document.createElement('div');
            server.className = 'server-indicator';
            
            const load = this.stats.serverLoad[i] || Math.random() * 100;
            if (load > 80) {
                server.classList.add('overloaded');
                server.textContent = 'HIGH';
            } else if (load > 60) {
                server.classList.add('warning');
                server.textContent = 'MED';
            } else {
                server.textContent = 'OK';
            }
            
            serverHealth.appendChild(server);
        }
    }

    applyConfiguration() {
        this.updateDefenseList();
        this.updateServerHealth();
        this.addLogEntry('Configuration applied successfully', 'allowed');
        this.stats.score += 10;
        
        const btn = document.getElementById('apply-config');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Applied!';
        btn.style.background = '#00ff41';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 2000);
    }

    resetConfiguration() {
        // Reset all form controls
        document.getElementById('firewall-enabled').checked = true;
        document.getElementById('rate-limit').value = 100;
        document.getElementById('rate-limit-value').textContent = '100';
        document.getElementById('timeout-duration').value = 60;
        document.getElementById('timeout-value').textContent = '60';
        document.getElementById('ddos-protection').checked = false;
        document.getElementById('detection-sensitivity').value = 5;
        document.getElementById('detection-sensitivity-value').textContent = '5';
        document.getElementById('blackhole-routing').checked = false;
        document.getElementById('syn-flood-protection').checked = false;
        document.getElementById('loadbalancer-enabled').checked = false;
        document.getElementById('server-count').value = 3;
        document.getElementById('server-count-value').textContent = '3';
        document.getElementById('load-distribution').value = 'round-robin';
        document.getElementById('cdn-enabled').checked = false;
        document.getElementById('cache-ttl').value = 60;
        document.getElementById('cache-ttl-value').textContent = '60';
        document.getElementById('edge-locations').value = 5;
        document.getElementById('edge-locations-value').textContent = '5';
        document.getElementById('advanced-filtering').checked = false;
        document.getElementById('bot-detection').value = 5;
        document.getElementById('bot-detection-value').textContent = '5';
        document.getElementById('captcha-threshold').value = 50;
        document.getElementById('captcha-threshold-value').textContent = '50';
        document.getElementById('custom-rules').value = '# Block suspicious user agents\nUser-Agent: *bot*\n# Block rapid requests from same IP\nRate: >100/min';
        
        // Reset config object
        this.defenseConfig = {
            firewall: true,
            rateLimit: 100,
            timeout: 60,
            geoBlocking: [],
            loadBalancer: false,
            serverCount: 3,
            loadDistribution: 'round-robin',
            cdn: false,
            cacheTTL: 60,
            edgeLocations: 5,
            advancedFiltering: false,
            botDetection: 5,
            captchaThreshold: 50,
            customRules: '',
            ddosProtection: false,
            blackholRouting: false,
            synFloodProtection: false,
            detectionSensitivity: 5
        };
        
        this.updateDefenseList();
        this.updateServerHealth();
        this.addLogEntry('Configuration reset to defaults', 'allowed');
    }

    testDefense() {
        this.addLogEntry('Running defense test...', 'allowed');
    
        const originalIntensity = this.attackIntensity;
        const originalAttackState = this.isAttackActive;
        this.isAttackActive = true;
        this.attackIntensity = 300;
        this.currentAttackType = 'volumetric';
    
        const timerElement = document.getElementById('attack-timer');
        let remaining = 10; // test duration in seconds
        timerElement.innerHTML = remaining;
    
        // Clear any existing timer interval if used elsewhere
        if (this.attackTimerInterval) {
            clearInterval(this.attackTimerInterval);
        }
    
        this.attackTimerInterval = setInterval(() => {
            remaining -= 1;
            if (remaining >= 0) {
                timerElement.innerHTML = remaining;
            }
            if (remaining <= 0) {
                clearInterval(this.attackTimerInterval);
                this.attackTimerInterval = null;
    
                // Restore original attack values and stop
                this.isAttackActive = originalAttackState;
                this.attackIntensity = originalIntensity;
                this.addLogEntry('Defense test completed successfully', 'allowed');
                this.stats.score += 5;
    
                this.stopAttack();
            }
        }, 1000);
    }
    testDefense() {
        this.addLogEntry('Running defense test...', 'allowed');
    
        const originalIntensity = this.attackIntensity;
        const originalAttackState = this.isAttackActive;
        this.isAttackActive = true;
        this.attackIntensity = 300;
        this.currentAttackType = 'volumetric';
    
        const timerElement = document.getElementById('attack-timer');
        let remaining = 10; // test duration in seconds
        timerElement.innerHTML = remaining;
    
        // Clear any existing timer interval if used elsewhere
        if (this.attackTimerInterval) {
            clearInterval(this.attackTimerInterval);
        }
    
        this.attackTimerInterval = setInterval(() => {
            remaining -= 1;
            if (remaining >= 0) {
                timerElement.innerHTML = remaining;
            }
            if (remaining <= 0) {
                clearInterval(this.attackTimerInterval);
                this.attackTimerInterval = null;
                this.showNotification("Test Defence","Successful!")
                // Restore original attack values and stop
                this.isAttackActive = originalAttackState;
                this.attackIntensity = originalIntensity;
                this.addLogEntry('Defense test completed successfully', 'allowed');
                this.stats.score += 5;
    
                this.stopAttack();
            }
        }, 1000);
    }
    
        

    activateEmergencyMode() {
        this.emergencyMode = !this.emergencyMode;
        
        if (this.emergencyMode) {
            // Boost defenses
            this.defenseConfig.rateLimit = Math.max(this.defenseConfig.rateLimit, 500);
            this.defenseConfig.firewall = true;
            this.defenseConfig.advancedFiltering = true;
            this.defenseConfig.ddosProtection = true;
            
            // Update UI
            document.getElementById('rate-limit').value = this.defenseConfig.rateLimit;
            document.getElementById('rate-limit-value').textContent = this.defenseConfig.rateLimit;
            document.getElementById('firewall-enabled').checked = true;
            document.getElementById('advanced-filtering').checked = true;
            document.getElementById('ddos-protection').checked = true;
            
            this.updateDefenseList();
            this.addLogEntry('EMERGENCY MODE ACTIVATED - All defenses maximized', 'allowed');
            
            const btn = document.getElementById('emergency-mode');
            btn.textContent = '🟢 EMERGENCY ACTIVE';
            btn.classList.add('active');
            
            setTimeout(() => {
                this.emergencyMode = false;
                btn.textContent = '🚨 EMERGENCY MODE';
                btn.classList.remove('active');
                this.addLogEntry('Emergency mode deactivated', 'allowed');
            }, 60000);
        }
    }

    checkAchievements(scenario) {
        if (!this.achievements.has('first-defense') && this.stats.effectiveness > 50) {
            this.unlockAchievement('first-defense', 'First Defense', 'Successfully defended against your first attack');
        }
        
        if (!this.achievements.has('perfect-defense') && this.stats.effectiveness >= 90) {
            this.unlockAchievement('perfect-defense', 'Perfect Defense', 'Achieved 90%+ defense effectiveness');
        }
        
        if (!this.achievements.has('master-defender') && scenario === 'advanced' && this.stats.effectiveness > 70) {
            this.unlockAchievement('master-defender', 'Master Defender', 'Successfully defended against advanced persistent attack');
        }
    }

    unlockAchievement(id, name, description) {
        this.achievements.add(id);
        
        const achievement = document.querySelector(`[data-achievement="${id}"]`);
        if (achievement) {
            achievement.classList.remove('locked');
            achievement.classList.add('unlocked');
        }
        
        this.showNotification(`🏆 Achievement Unlocked: ${name}`, description);
        
        // Save achievements set to localStorage as array
        localStorage.setItem(
          "achievements",
          JSON.stringify(Array.from(this.achievements))
        );
        
        this.stats.score += 100;
    }
    

    showNotification(title, message) {
        console.log("HELLOO")
        const score=Number(localStorage.getItem("ddos-score")||0)
        if(this.stats.score>score){
            localStorage.setItem("ddos-score",this.stats.score)
        }
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            border: 2px solid var(--accent-green);
            border-radius: 8px;
            padding: 1rem;
            z-index: 10000;
            animation: slideIn 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    startUptimeCounter() {
        setInterval(() => {
            this.uptime++;
            const hours = Math.floor(this.uptime / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((this.uptime % 3600) / 60).toString().padStart(2, '0');
            const seconds = (this.uptime % 60).toString().padStart(2, '0');
            document.getElementById('uptime').textContent = `${hours}:${minutes}:${seconds}`;
        }, 1000);
    }

    showWelcomeMessage() {
        this.addLogEntry('DDoS Defense System initialized', 'allowed');
        this.addLogEntry('All systems operational', 'allowed');
        this.addLogEntry('Monitoring network traffic...', 'allowed');
        this.addLogEntry('Threat intelligence feeds active', 'allowed');
        this.updateDefenseList();
    }

    gaussianRandom(mean = 0, stdev = 1) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdev + mean;
    }
}

// Initialize the enhanced simulator
document.addEventListener('DOMContentLoaded', () => {
    new DDoSDefenseSimulator();
});
