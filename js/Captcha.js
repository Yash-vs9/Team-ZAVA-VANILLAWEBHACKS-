// CyberSec CAPTCHA Bot Detection System
class BotDetectionCAPTCHA {
    constructor() {
        this.canvas = document.getElementById('drawingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.demoCanvas = document.getElementById('demoCanvas');
        this.demoCtx = this.demoCanvas ? this.demoCanvas.getContext('2d') : null;
        
        // Drawing state
        this.isDrawing = false;
        this.mouseData = [];
        this.startTime = null;
        this.hasDrawn = false;
        
        // Configuration from provided data
        this.config = {
            canvas: { width: 800, height: 400 },
            start: { x: 100, y: 200 },
            end: { x: 700, y: 200 },
            thresholds: {
                deviation_bot: 5,
                deviation_human: 20,
                speed_variance_bot: 0.1,
                speed_variance_human: 0.5,
                jitter_bot: 2,
                jitter_human: 8,
                efficiency_bot: 1.02,
                efficiency_human: 1.15
            }
        };
        
        // Demo data
        this.demoData = {
            human: [
                {"x": 100, "y": 200, "t": 0}, {"x": 120, "y": 198, "t": 50},
                {"x": 145, "y": 202, "t": 100}, {"x": 170, "y": 199, "t": 150},
                {"x": 200, "y": 203, "t": 200}, {"x": 230, "y": 198, "t": 250},
                {"x": 265, "y": 201, "t": 300}, {"x": 300, "y": 197, "t": 350},
                {"x": 340, "y": 202, "t": 400}, {"x": 380, "y": 199, "t": 450},
                {"x": 420, "y": 203, "t": 500}, {"x": 460, "y": 198, "t": 550},
                {"x": 500, "y": 201, "t": 600}, {"x": 540, "y": 197, "t": 650},
                {"x": 580, "y": 202, "t": 700}, {"x": 620, "y": 199, "t": 750},
                {"x": 660, "y": 201, "t": 800}, {"x": 700, "y": 200, "t": 850}
            ],
            bot: [
                {"x": 100, "y": 200, "t": 0}, {"x": 133, "y": 200, "t": 50},
                {"x": 166, "y": 200, "t": 100}, {"x": 200, "y": 200, "t": 150},
                {"x": 233, "y": 200, "t": 200}, {"x": 266, "y": 200, "t": 250},
                {"x": 300, "y": 200, "t": 300}, {"x": 333, "y": 200, "t": 350},
                {"x": 366, "y": 200, "t": 400}, {"x": 400, "y": 200, "t": 450},
                {"x": 433, "y": 200, "t": 500}, {"x": 466, "y": 200, "t": 550},
                {"x": 500, "y": 200, "t": 600}, {"x": 533, "y": 200, "t": 650},
                {"x": 566, "y": 200, "t": 700}, {"x": 600, "y": 200, "t": 750},
                {"x": 633, "y": 200, "t": 800}, {"x": 666, "y": 200, "t": 850},
                {"x": 700, "y": 200, "t": 900}
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.drawInitialState();
        this.setupModals();
    }
    
    setupCanvas() {
        // Set canvas size explicitly
        this.canvas.width = this.config.canvas.width;
        this.canvas.height = this.config.canvas.height;
        
        if (this.demoCanvas) {
            this.demoCanvas.width = 400;
            this.demoCanvas.height = 200;
        }
        
        // Draw grid background
        this.drawGrid(this.ctx, this.canvas.width, this.canvas.height);
        if (this.demoCtx) {
            this.drawGrid(this.demoCtx, this.demoCanvas.width, this.demoCanvas.height);
        }
    }
    
    drawGrid(ctx, width, height) {
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.3;
        
        // Vertical lines
        for (let x = 0; x <= width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1.0;
    }
    
    drawInitialState() {
        // Clear canvas first
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid(this.ctx, this.canvas.width, this.canvas.height);
        
        // Draw start and end points
        this.drawStartEndPoints();
    }
    
    drawStartEndPoints() {
        // Draw START point
        this.ctx.beginPath();
        this.ctx.arc(this.config.start.x, this.config.start.y, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#00ff41';
        this.ctx.fill();
        this.ctx.strokeStyle = '#00ff41';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw END point
        this.ctx.beginPath();
        this.ctx.arc(this.config.end.x, this.config.end.y, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ff4757';
        this.ctx.fill();
        this.ctx.strokeStyle = '#ff4757';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    setupEventListeners() {
        // Canvas drawing events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseleave', this.stopDrawing.bind(this));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouch.bind(this));
        
        // Button events
        const resetBtn = document.getElementById('resetBtn');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const demoBtn = document.getElementById('demoBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        
        if (resetBtn) resetBtn.addEventListener('click', this.reset.bind(this));
        if (analyzeBtn) analyzeBtn.addEventListener('click', this.showResults.bind(this));
        if (demoBtn) demoBtn.addEventListener('click', this.openDemo.bind(this));
        if (settingsBtn) settingsBtn.addEventListener('click', this.openSettings.bind(this));
    }
    
    handleTouch(event) {
        event.preventDefault();
        const touch = event.touches[0] || event.changedTouches[0];
        const mouseEvent = new MouseEvent(event.type.replace('touch', 'mouse'), {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        
        if (event.type === 'touchstart') this.startDrawing(mouseEvent);
        else if (event.type === 'touchmove') this.draw(mouseEvent);
        else if (event.type === 'touchend') this.stopDrawing(mouseEvent);
    }
    
    setupModals() {
        // Demo modal
        const closeDemoBtn = document.getElementById('closeDemoModal');
        const playHumanBtn = document.getElementById('playHumanDemo');
        const playBotBtn = document.getElementById('playBotDemo');
        
        if (closeDemoBtn) closeDemoBtn.addEventListener('click', () => this.closeModal('demoModal'));
        if (playHumanBtn) playHumanBtn.addEventListener('click', () => this.playDemo('human'));
        if (playBotBtn) playBotBtn.addEventListener('click', () => this.playDemo('bot'));
        
        // Settings modal
        const closeSettingsBtn = document.getElementById('closeSettingsModal');
        const saveSettingsBtn = document.getElementById('saveSettings');
        
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => this.closeModal('settingsModal'));
        if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', this.saveSettings.bind(this));
        
        // Backdrop clicks
        const modalBackdrop = document.getElementById('modalBackdrop');
        if (modalBackdrop) modalBackdrop.addEventListener('click', this.closeAllModals.bind(this));
        
        // Range input updates
        this.setupRangeInputs();
    }
    
    setupRangeInputs() {
        const ranges = [
            { id: 'deviationThreshold', valueId: 'deviationValue' },
            { id: 'speedThreshold', valueId: 'speedValue' },
            { id: 'jitterThreshold', valueId: 'jitterValue' }
        ];
        
        ranges.forEach(range => {
            const input = document.getElementById(range.id);
            const valueSpan = document.getElementById(range.valueId);
            
            if (input && valueSpan) {
                input.addEventListener('input', () => {
                    valueSpan.textContent = input.value;
                });
            }
        });
    }
    
    getMousePos(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    }
    
    isNearStart(pos) {
        const distance = Math.sqrt(
            Math.pow(pos.x - this.config.start.x, 2) + 
            Math.pow(pos.y - this.config.start.y, 2)
        );
        return distance < 25;
    }
    
    isNearEnd(pos) {
        const distance = Math.sqrt(
            Math.pow(pos.x - this.config.end.x, 2) + 
            Math.pow(pos.y - this.config.end.y, 2)
        );
        return distance < 25;
    }
    
    startDrawing(event) {
        const pos = this.getMousePos(event);
        
        if (!this.isNearStart(pos)) {
            this.updateStatus('Start drawing from the green START point', 'warning');
            return;
        }
        
        this.isDrawing = true;
        this.hasDrawn = false;
        this.startTime = Date.now();
        this.mouseData = [{
            x: pos.x,
            y: pos.y,
            t: 0
        }];
        
        this.updateStatus('Drawing in progress...', 'active');
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) analyzeBtn.disabled = true;
        this.hideResults();
        
        // Prevent default to avoid scrolling
        event.preventDefault();
    }
    
    draw(event) {
        if (!this.isDrawing) return;
        
        const pos = this.getMousePos(event);
        const currentTime = Date.now() - this.startTime;
        
        // Add mouse data point
        this.mouseData.push({
            x: pos.x,
            y: pos.y,
            t: currentTime
        });
        
        // Draw line segment
        if (this.mouseData.length > 1) {
            const prevPoint = this.mouseData[this.mouseData.length - 2];
            
            // Draw main line
            this.ctx.beginPath();
            this.ctx.moveTo(prevPoint.x, prevPoint.y);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.strokeStyle = '#00d4ff';
            this.ctx.lineWidth = 3;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.stroke();
            
            // Add subtle glow effect
            this.ctx.beginPath();
            this.ctx.moveTo(prevPoint.x, prevPoint.y);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
            this.ctx.lineWidth = 6;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.stroke();
            
            this.hasDrawn = true;
        }
        
        // Update real-time metrics
        if (this.mouseData.length > 3) {
            this.updateRealTimeMetrics();
        }
        
        event.preventDefault();
    }
    
    stopDrawing(event) {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        
        if (!this.hasDrawn || this.mouseData.length < 5) {
            this.updateStatus('Line too short. Please draw from START to END', 'warning');
            return;
        }
        
        const pos = this.getMousePos(event);
        const distance = this.isNearEnd(pos) ? 0 : Math.sqrt(
            Math.pow(pos.x - this.config.end.x, 2) + 
            Math.pow(pos.y - this.config.end.y, 2)
        );
        
        if (distance > 40) {
            this.updateStatus('Please end your line near the red END point', 'warning');
            return;
        }
        
        this.updateStatus('Line complete! Click "Analyze Results" to see detection results', 'success');
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) analyzeBtn.disabled = false;
        
        // Redraw start/end points on top
        this.drawStartEndPoints();
    }
    
    updateRealTimeMetrics() {
        if (this.mouseData.length < 3) return;
        
        const metrics = this.calculateMetrics(this.mouseData);
        
        // Update metric displays
        const deviationMetric = document.getElementById('deviationMetric');
        const speedMetric = document.getElementById('speedMetric');
        const jitterMetric = document.getElementById('jitterMetric');
        const efficiencyMetric = document.getElementById('efficiencyMetric');
        
        if (deviationMetric) deviationMetric.textContent = `${metrics.deviation.toFixed(1)}px`;
        if (speedMetric) speedMetric.textContent = metrics.speedVariance.toFixed(2);
        if (jitterMetric) jitterMetric.textContent = metrics.jitter.toFixed(0);
        if (efficiencyMetric) efficiencyMetric.textContent = `${(metrics.efficiency * 100).toFixed(1)}%`;
        
        // Update metric bars
        this.updateMetricBar('deviationBar', metrics.deviation, 0, 50);
        this.updateMetricBar('speedBar', metrics.speedVariance, 0, 1);
        this.updateMetricBar('jitterBar', metrics.jitter, 0, 20);
        this.updateMetricBar('efficiencyBar', (metrics.efficiency - 1) * 100, 0, 50);
    }
    
    updateMetricBar(barId, value, min, max) {
        const bar = document.getElementById(barId);
        if (!bar) return;
        
        const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
        bar.style.width = `${percentage}%`;
    }
    
    calculateMetrics(data) {
        if (data.length < 2) return { deviation: 0, speedVariance: 0, jitter: 0, efficiency: 1 };
        
        const startPoint = this.config.start;
        const endPoint = this.config.end;
        
        // Calculate deviations from perfect line
        let totalDeviation = 0;
        const perfectLine = this.getLineEquation(startPoint, endPoint);
        
        data.forEach(point => {
            const deviation = this.getDistanceFromLine(point, perfectLine);
            totalDeviation += deviation;
        });
        
        const avgDeviation = totalDeviation / data.length;
        
        // Calculate speed variance
        const speeds = [];
        for (let i = 1; i < data.length; i++) {
            const distance = Math.sqrt(
                Math.pow(data[i].x - data[i-1].x, 2) + 
                Math.pow(data[i].y - data[i-1].y, 2)
            );
            const time = Math.max(1, data[i].t - data[i-1].t);
            speeds.push(distance / time);
        }
        
        if (speeds.length === 0) return { deviation: avgDeviation, speedVariance: 0, jitter: 0, efficiency: 1 };
        
        const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
        const speedVariance = speeds.reduce((sum, speed) => sum + Math.pow(speed - avgSpeed, 2), 0) / speeds.length;
        
        // Calculate jitter (direction changes)
        let jitter = 0;
        for (let i = 2; i < data.length; i++) {
            const angle1 = Math.atan2(data[i-1].y - data[i-2].y, data[i-1].x - data[i-2].x);
            const angle2 = Math.atan2(data[i].y - data[i-1].y, data[i].x - data[i-1].x);
            let angleDiff = Math.abs(angle2 - angle1);
            if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
            jitter += angleDiff;
        }
        
        // Calculate path efficiency
        let pathLength = 0;
        for (let i = 1; i < data.length; i++) {
            pathLength += Math.sqrt(
                Math.pow(data[i].x - data[i-1].x, 2) + 
                Math.pow(data[i].y - data[i-1].y, 2)
            );
        }
        
        const straightDistance = Math.sqrt(
            Math.pow(endPoint.x - startPoint.x, 2) + 
            Math.pow(endPoint.y - startPoint.y, 2)
        );
        
        const efficiency = pathLength / Math.max(1, straightDistance);
        
        return {
            deviation: avgDeviation,
            speedVariance: Math.sqrt(Math.max(0, speedVariance)),
            jitter: jitter * (180 / Math.PI), // Convert to degrees
            efficiency: efficiency
        };
    }
    
    getLineEquation(start, end) {
        const A = end.y - start.y;
        const B = start.x - end.x;
        const C = A * start.x + B * start.y;
        return { A, B, C };
    }
    
    getDistanceFromLine(point, line) {
        const denominator = Math.sqrt(line.A * line.A + line.B * line.B);
        if (denominator === 0) return 0;
        return Math.abs(line.A * point.x + line.B * point.y - line.C) / denominator;
    }
    
    detectBot(metrics) {
        let humanScore = 50; // Start with neutral score
        const factors = [];
        
        // Deviation analysis
        if (metrics.deviation < this.config.thresholds.deviation_bot) {
            humanScore -= 25;
            factors.push({ type: 'bot', text: 'Line too perfect - lacks human tremor' });
        } else if (metrics.deviation < this.config.thresholds.deviation_human) {
            humanScore += 15;
            factors.push({ type: 'human', text: 'Natural hand tremor detected' });
        }
        
        // Speed variance analysis
        if (metrics.speedVariance < this.config.thresholds.speed_variance_bot) {
            humanScore -= 20;
            factors.push({ type: 'bot', text: 'Constant speed - robotic movement' });
        } else if (metrics.speedVariance > this.config.thresholds.speed_variance_human) {
            humanScore += 10;
            factors.push({ type: 'human', text: 'Natural speed variations' });
        }
        
        // Jitter analysis
        if (metrics.jitter < this.config.thresholds.jitter_bot) {
            humanScore -= 15;
            factors.push({ type: 'bot', text: 'No micro-movements detected' });
        } else if (metrics.jitter > this.config.thresholds.jitter_human) {
            humanScore += 15;
            factors.push({ type: 'human', text: 'Human-like micro-corrections' });
        }
        
        // Efficiency analysis
        if (metrics.efficiency < this.config.thresholds.efficiency_bot) {
            humanScore -= 20;
            factors.push({ type: 'bot', text: 'Mathematically optimal path' });
        } else if (metrics.efficiency > this.config.thresholds.efficiency_human) {
            humanScore += 10;
            factors.push({ type: 'human', text: 'Natural path inefficiency' });
        }
        
        // Ensure score is within bounds
        humanScore = Math.max(0, Math.min(100, humanScore));
        
        let classification;
        if (humanScore < 30) {
            classification = { result: 'bot', confidence: 'high' };
        } else if (humanScore < 70) {
            classification = { result: 'suspicious', confidence: 'medium' };
        } else {
            classification = { result: 'human', confidence: 'high' };
        }
        
        return {
            humanScore,
            classification,
            factors,
            metrics
        };
    }
    
    showResults() {
        if (this.mouseData.length < 5) {
            this.updateStatus('Please draw a line first', 'warning');
            return;
        }
        
        const metrics = this.calculateMetrics(this.mouseData);
        const analysis = this.detectBot(metrics);
        
        try {
            const captchaStats = {
                accuracy: analysis.humanScore,
                score: analysis.humanScore,
                timestamp: new Date().toISOString(),
                classification: analysis.classification.result,
                metrics: analysis.metrics
            };
            
            localStorage.setItem('captcha_verification_stats', JSON.stringify(captchaStats));
            console.log('💾 CAPTCHA stats saved to localStorage:', captchaStats);
        } catch (error) {
            console.warn('Could not save CAPTCHA stats:', error);
        }

        // Update results display
        const resultsPanel = document.getElementById('resultsPanel');
        const resultIcon = document.getElementById('resultIcon');
        const resultTitle = document.getElementById('resultTitle');
        const resultSubtitle = document.getElementById('resultSubtitle');
        const confidenceScore = document.getElementById('confidenceScore');
        
        if (resultsPanel) {
            // Set result icon and text
            if (analysis.classification.result === 'human') {
                if (resultIcon) resultIcon.textContent = '✅';
                if (resultTitle) resultTitle.textContent = 'Human Verified';
                if (resultSubtitle) resultSubtitle.textContent = 'Natural movement patterns detected';
            } else if (analysis.classification.result === 'bot') {
                this.showNotification("Congratulations!","You have completed this game!")
                if (resultIcon) resultIcon.textContent = '🤖';
                if (resultTitle) resultTitle.textContent = 'Bot Detected';
                if (resultSubtitle) resultSubtitle.textContent = 'Artificial movement patterns identified';
                setTimeout(() => {
                    window.history.back(); // navigates to previous page
                }, 2000); 
            } else {
                if (resultIcon) resultIcon.textContent = '⚠️';
                if (resultTitle) resultTitle.textContent = 'Suspicious Activity';
                if (resultSubtitle) resultSubtitle.textContent = 'Mixed signals detected - please try again';
            }
            
            if (confidenceScore) confidenceScore.textContent = analysis.humanScore;
            
            // Update detailed metrics
            const finalDeviation = document.getElementById('finalDeviation');
            const finalSpeed = document.getElementById('finalSpeed');
            const finalTremor = document.getElementById('finalTremor');
            const finalEfficiency = document.getElementById('finalEfficiency');
            
            if (finalDeviation) finalDeviation.textContent = `${metrics.deviation.toFixed(1)}px`;
            if (finalSpeed) finalSpeed.textContent = metrics.speedVariance.toFixed(3);
            if (finalTremor) finalTremor.textContent = `${metrics.jitter.toFixed(1)}°`;
            if (finalEfficiency) finalEfficiency.textContent = `${(metrics.efficiency * 100).toFixed(1)}%`;
            
            // Update detection factors
            const factorsContainer = document.getElementById('detectionFactors');
            if (factorsContainer) {
                factorsContainer.innerHTML = '';
                
                analysis.factors.forEach(factor => {
                    const factorDiv = document.createElement('div');
                    factorDiv.className = `detection-factor factor-${factor.type}`;
                    factorDiv.innerHTML = `
                        <span class="factor-icon">${factor.type === 'human' ? '👤' : '🤖'}</span>
                        <span class="factor-text">${factor.text}</span>
                    `;
                    factorsContainer.appendChild(factorDiv);
                });
            }
            
            // Show results panel
            resultsPanel.classList.remove('hidden');
            resultsPanel.scrollIntoView({ behavior: 'smooth' });
        }
    }
    showNotification(title, message) {
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
  background: rgba(41, 37, 80, 0.85); /* Dark semi-transparent background */
        color: var(--text-primary);
        border-left: 6px solid var(--accent-green);
        border-radius: 6px;
        padding: 1rem 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 1rem;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        z-index: 10000;
        animation: slideIn 0.4s ease forwards, fadeOut 0.3s ease 2.7s forwards;
      `;
      

        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    hideResults() {
        const resultsPanel = document.getElementById('resultsPanel');
        if (resultsPanel) resultsPanel.classList.add('hidden');
    }
    
    reset() {
        this.isDrawing = false;
        this.hasDrawn = false;
        this.mouseData = [];
        this.startTime = null;
        
        // Clear canvas and redraw initial state
        this.drawInitialState();
        
        // Reset UI
        this.updateStatus('Ready to draw', 'ready');
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) analyzeBtn.disabled = true;
        this.hideResults();
        
        // Reset metrics
        const deviationMetric = document.getElementById('deviationMetric');
        const speedMetric = document.getElementById('speedMetric');
        const jitterMetric = document.getElementById('jitterMetric');
        const efficiencyMetric = document.getElementById('efficiencyMetric');
        
        if (deviationMetric) deviationMetric.textContent = '0px';
        if (speedMetric) speedMetric.textContent = '0.0';
        if (jitterMetric) jitterMetric.textContent = '0';
        if (efficiencyMetric) efficiencyMetric.textContent = '100%';
        
        // Reset metric bars
        ['deviationBar', 'speedBar', 'jitterBar', 'efficiencyBar'].forEach(id => {
            const bar = document.getElementById(id);
            if (bar) bar.style.width = '0%';
        });
    }
    
    updateStatus(message, type) {
        const statusText = document.getElementById('statusText');
        const statusDot = document.querySelector('.status-dot');
        
        if (statusText) statusText.textContent = message;
        
        if (statusDot) {
            // Update status indicator color
            statusDot.className = 'status-dot';
            if (type === 'warning') {
                statusDot.style.background = '#ff6b35';
            } else if (type === 'success') {
                statusDot.style.background = '#00ff41';
            } else if (type === 'active') {
                statusDot.style.background = '#00d4ff';
            } else {
                statusDot.style.background = '#00ff41';
            }
        }
    }
    
    openDemo() {
        this.openModal('demoModal');
        // Clear demo canvas and prepare it
        if (this.demoCtx) {
            this.demoCtx.clearRect(0, 0, this.demoCanvas.width, this.demoCanvas.height);
            this.drawGrid(this.demoCtx, this.demoCanvas.width, this.demoCanvas.height);
        }
    }
    
    openSettings() {
        this.openModal('settingsModal');
        
        // Set current threshold values
        const deviationThreshold = document.getElementById('deviationThreshold');
        const speedThreshold = document.getElementById('speedThreshold');
        const jitterThreshold = document.getElementById('jitterThreshold');
        const deviationValue = document.getElementById('deviationValue');
        const speedValue = document.getElementById('speedValue');
        const jitterValue = document.getElementById('jitterValue');
        
        if (deviationThreshold && deviationValue) {
            deviationThreshold.value = this.config.thresholds.deviation_human;
            deviationValue.textContent = this.config.thresholds.deviation_human;
        }
        
        if (speedThreshold && speedValue) {
            speedThreshold.value = this.config.thresholds.speed_variance_human;
            speedValue.textContent = this.config.thresholds.speed_variance_human;
        }
        
        if (jitterThreshold && jitterValue) {
            jitterThreshold.value = this.config.thresholds.jitter_human;
            jitterValue.textContent = this.config.thresholds.jitter_human;
        }
    }
    
    saveSettings() {
        const deviationThreshold = document.getElementById('deviationThreshold');
        const speedThreshold = document.getElementById('speedThreshold');
        const jitterThreshold = document.getElementById('jitterThreshold');
        
        if (deviationThreshold) this.config.thresholds.deviation_human = parseFloat(deviationThreshold.value);
        if (speedThreshold) this.config.thresholds.speed_variance_human = parseFloat(speedThreshold.value);
        if (jitterThreshold) this.config.thresholds.jitter_human = parseFloat(jitterThreshold.value);
        
        this.closeModal('settingsModal');
        this.updateStatus('Settings saved successfully', 'success');
    }
    
    playDemo(type) {
        if (!this.demoCtx) return;
        
        const data = this.demoData[type];
        const scale = 0.5; // Scale demo to fit smaller canvas
        
        // Clear canvas
        this.demoCtx.clearRect(0, 0, this.demoCanvas.width, this.demoCanvas.height);
        this.drawGrid(this.demoCtx, this.demoCanvas.width, this.demoCanvas.height);
        
        // Draw start and end points
        this.demoCtx.beginPath();
        this.demoCtx.arc(50, 100, 8, 0, 2 * Math.PI);
        this.demoCtx.fillStyle = '#00ff41';
        this.demoCtx.fill();
        
        this.demoCtx.beginPath();
        this.demoCtx.arc(350, 100, 8, 0, 2 * Math.PI);
        this.demoCtx.fillStyle = '#ff4757';
        this.demoCtx.fill();
        
        // Animate drawing
        let index = 0;
        const animate = () => {
            if (index >= data.length - 1) return;
            
            const current = data[index];
            const next = data[index + 1];
            
            this.demoCtx.beginPath();
            this.demoCtx.moveTo(current.x * scale, current.y * scale);
            this.demoCtx.lineTo(next.x * scale, next.y * scale);
            this.demoCtx.strokeStyle = type === 'human' ? '#00ff41' : '#ff4757';
            this.demoCtx.lineWidth = 2;
            this.demoCtx.lineCap = 'round';
            this.demoCtx.stroke();
            
            index++;
            if (index < data.length - 1) {
                setTimeout(animate, 50);
            }
        };
        
        animate();
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        const backdrop = document.getElementById('modalBackdrop');
        
        if (modal) modal.classList.remove('hidden');
        if (backdrop) backdrop.classList.remove('hidden');
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        const backdrop = document.getElementById('modalBackdrop');
        
        if (modal) modal.classList.add('hidden');
        if (backdrop) backdrop.classList.add('hidden');
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        
        const backdrop = document.getElementById('modalBackdrop');
        if (backdrop) backdrop.classList.add('hidden');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BotDetectionCAPTCHA();
});