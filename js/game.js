class CyberTrainingSystem {
  constructor() {
      this.currentGame = null;
      this.gameStats = {
          phishing: { score: 0, attempts: 0, streak: 0, totalCorrect: 0, reputation: 100 },
          password: { score: 0, attempts: 0, streak: 0, totalCorrect: 0, reputation: 100 },
          network: { score: 0, attempts: 0, streak: 0, totalCorrect: 0, reputation: 100 }
      };
      
      this.phishingData = {
          currentQuestion: 1,
          totalQuestions: 5,
          timeLimit: 30,
          timeLeft: 30,
          timer: null,
          consecutiveErrors: 0,
          difficulty: 'medium'
      };
      
      this.passwordData = {
          currentAttempt: 1,
          totalAttempts: 5,
          requirements: [],
          currentRequirements: null,
          hackingAttempts: 0,
          compromisedPasswords: new Set()
      };
      
      this.networkData = {
          threatsRemaining: 4,
          timeLimit: 30,
          timeLeft: 30,
          timer: null,
          currentThreat: null,
          missedThreats: 0,
          systemHealth: 100,
          isUnderAttack: false
      };
      
      this.init();
  }

  init() {
      this.setupEventListeners();
      this.generateRealisticData();
      this.displayPlayerStats();
  }

  setupEventListeners() {
      // Game launch buttons
      document.querySelectorAll('.game-launch-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const gameType = e.target.closest('.game-card').dataset.game;
              this.launchGame(gameType);
          });
      });

      // Close buttons
      document.querySelectorAll('.close-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
              const gameId = e.target.dataset.close;
              this.closeGame(gameId);
          });
      });

      // Phishing game events
      document.getElementById('markSafe')?.addEventListener('click', () => this.checkPhishingAnswer(false));
      document.getElementById('markPhishing')?.addEventListener('click', () => this.checkPhishingAnswer(true));
      document.getElementById('nextPhishing')?.addEventListener('click', () => this.nextPhishingQuestion());

      // Password game events
      document.getElementById('passwordInput')?.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
      document.getElementById('submitPassword')?.addEventListener('click', () => this.submitPassword());
      document.getElementById('nextPassword')?.addEventListener('click', () => this.nextPasswordChallenge());

      // Network game events
      document.getElementById('startNetworkGame')?.addEventListener('click', () => this.startNetworkDefense());
      this.setupNetworkDragAndDrop();
  }

  // ============= PHISHING DETECTION GAME =============
  launchGame(gameType) {
      this.currentGame = gameType;
      
      switch(gameType) {
          case 'phishing':
              this.startPhishingGame();
              break;
          case 'password':
              this.startPasswordGame();
              break;
          case 'network':
              this.startNetworkGame();
              break;
      }
  }

  startPhishingGame() {
      document.getElementById('phishingGame').classList.remove('hidden');
      this.phishingData.currentQuestion = 1;
      this.phishingData.consecutiveErrors = 0;
      this.resetPhishingTimer();
      this.loadPhishingQuestion();
  }

  generateRealisticData() {
      this.phishingEmails = [
          // LEGITIMATE EMAILS
          {
              isPhishing: false,
              sender: "notifications@linkedin.com",
              subject: "Weekly digest: 5 jobs you might be interested in",
              body: "Hi there,\n\nBased on your profile and recent activity, here are some job opportunities that might interest you:\n\n• Senior Developer at TechCorp\n• Security Analyst at CyberSafe Inc\n\nBest regards,\nThe LinkedIn Team\n\nUnsubscribe | Privacy Policy",
              difficulty: "easy"
          },
          {
              isPhishing: false,
              sender: "security@yourbank.com",
              subject: "Monthly Account Statement Available",
              body: "Dear Valued Customer,\n\nYour monthly statement for account ending in 1234 is now available in your secure online banking portal.\n\nTo view your statement, please log into your account at www.yourbank.com\n\nThank you for banking with us.\n\nCustomer Service Team",
              difficulty: "medium"
          },
          
          // OBVIOUS PHISHING
          {
              isPhishing: true,
              sender: "urgent-security@amaz0n.com",
              subject: "URGENT: Your account has been suspended!",
              body: "Your Amazon account has been SUSPENDED due to suspicious activity!\n\nClick here IMMEDIATELY to verify your account: http://amaz0n-security-update.malicious-site.ru\n\nIf you don't act within 24 hours, your account will be PERMANENTLY DELETED!\n\nAmazon Security Team",
              difficulty: "easy",
              indicators: ["Suspicious domain", "Urgent language", "Typos", "Threatening tone"]
          },
          
          // SOPHISTICATED PHISHING
          {
              isPhishing: true,
              sender: "noreply@microsoft.com",
              subject: "Security alert: New sign-in from unusual location",
              body: "We detected a new sign-in to your Microsoft account from:\n\nLocation: Moscow, Russia\nDevice: Chrome on Windows\nTime: Today, 3:47 AM\n\nIf this was you, you can safely ignore this message. If not, please secure your account immediately by clicking the link below:\n\nhttps://account.microsoft-security-center.tk/verify\n\nMicrosoft Security Team",
              difficulty: "hard",
              indicators: ["Suspicious domain (.tk)", "Creates urgency", "Looks legitimate"]
          },
          
          // VERY SOPHISTICATED
          {
              isPhishing: true,
              sender: "security-team@yourcompany.com",
              subject: "IT Security Update Required - Action Needed",
              body: "Dear Team Member,\n\nAs part of our ongoing security improvements, all employees must update their credentials by Friday, December 15th.\n\nPlease complete the security update process here:\nhttps://company-security-portal.herokuapp.com/update\n\nThis update is mandatory and failure to complete it will result in temporary account suspension.\n\nIT Security Department\nYour Company",
              difficulty: "expert",
              indicators: ["Internal spoofing", "Free hosting domain", "Authority pressure"]
          }
      ];

      this.passwordChallenges = [
          {
              difficulty: "basic",
              scenario: "Personal email account",
              requirements: ["8+ characters", "1 uppercase", "1 lowercase", "1 number"],
              minScore: 60,
              hackingRisk: "low"
          },
          {
              difficulty: "business", 
              scenario: "Company workstation login",
              requirements: ["12+ characters", "1 uppercase", "1 lowercase", "1 number", "1 special character"],
              minScore: 75,
              hackingRisk: "medium"
          },
          {
              difficulty: "critical",
              scenario: "Banking system access",
              requirements: ["15+ characters", "1 uppercase", "1 lowercase", "1 number", "2 special characters", "No common patterns"],
              minScore: 90,
              hackingRisk: "high"
          },
          {
              difficulty: "government",
              scenario: "Government classified system",
              requirements: ["20+ characters", "Mixed case", "Numbers", "Special chars", "No dictionary words", "No personal info"],
              minScore: 95,
              hackingRisk: "critical"
          },
          {
              difficulty: "military",
              scenario: "Defense contractor system",
              requirements: ["25+ characters", "All requirements", "Passphrase style", "No predictable patterns"],
              minScore: 98,
              hackingRisk: "extreme"
          }
      ];

      this.networkThreats = [
          { type: "DDoS Attack", target: "router", icon: "💥", description: "Overwhelming traffic flood", severity: "high" },
          { type: "SQL Injection", target: "database", icon: "💉", description: "Database exploitation attempt", severity: "critical" },
          { type: "Phishing Email", target: "workstation", icon: "📧", description: "Social engineering attack", severity: "medium" },
          { type: "Brute Force", target: "server", icon: "🔨", description: "Password cracking attempt", severity: "high" },
          { type: "Ransomware", target: "workstation", icon: "🔒", description: "File encryption malware", severity: "critical" },
          { type: "Man-in-Middle", target: "router", icon: "👤", description: "Traffic interception", severity: "high" },
          { type: "Privilege Escalation", target: "server", icon: "⬆️", description: "Unauthorized access attempt", severity: "critical" },
          { type: "Data Exfiltration", target: "database", icon: "📤", description: "Sensitive data theft", severity: "critical" }
      ];
  }

  loadPhishingQuestion() {
      if (this.phishingData.currentQuestion > this.phishingData.totalQuestions) {
          this.endPhishingGame();
          return;
      }

      // Select email based on difficulty and question number
      const availableEmails = this.phishingEmails.filter(email => {
          const difficultyOrder = ['easy', 'medium', 'hard', 'expert'];
          const maxDifficulty = difficultyOrder[Math.min(this.phishingData.currentQuestion - 1, 3)];
          const maxIndex = difficultyOrder.indexOf(maxDifficulty);
          return difficultyOrder.indexOf(email.difficulty) <= maxIndex;
      });

      const email = availableEmails[Math.floor(Math.random() * availableEmails.length)];

      document.getElementById('emailSender').textContent = email.sender;
      document.getElementById('emailSubject').textContent = email.subject;
      document.getElementById('emailBody').textContent = email.body;
      document.getElementById('currentQuestion').textContent = this.phishingData.currentQuestion;
      
      // Store current email for answer checking
      this.currentEmail = email;
      
      // Start/reset timer
      this.resetPhishingTimer();
      this.startPhishingTimer();
      
      // Hide feedback panel
      document.getElementById('phishingFeedback').classList.add('hidden');
  }

  startPhishingTimer() {
      this.phishingData.timer = setInterval(() => {
          this.phishingData.timeLeft--;
          
          if (this.phishingData.timeLeft <= 0) {
              this.handlePhishingTimeout();
          } else if (this.phishingData.timeLeft <= 5) {
              // Warning when time is running out
              this.showTimerWarning();
          }
      }, 1000);
  }

  resetPhishingTimer() {
      if (this.phishingData.timer) {
          clearInterval(this.phishingData.timer);
      }
      this.phishingData.timeLeft = this.phishingData.timeLimit;
  }

  handlePhishingTimeout() {
      clearInterval(this.phishingData.timer);
      this.phishingData.consecutiveErrors++;
      this.gameStats.phishing.reputation -= 10;
      
      this.showPhishingFeedback(false, "⏰ TIME'S UP! In a real scenario, hesitation can be costly. The email was " + 
          (this.currentEmail.isPhishing ? "PHISHING" : "LEGITIMATE"));
      
      // Increase difficulty after timeout
      if (this.phishingData.timeLimit > 10) {
          this.phishingData.timeLimit -= 3;
      }
  }

  showTimerWarning() {
      // Visual warning for time running out
      document.querySelector('.game-header').style.backgroundColor = '#ff6b35';
      setTimeout(() => {
          document.querySelector('.game-header').style.backgroundColor = '';
      }, 500);
  }

  checkPhishingAnswer(userAnswerIsPhishing) {
      clearInterval(this.phishingData.timer);
      
      const isCorrect = userAnswerIsPhishing === this.currentEmail.isPhishing;
      const responseTime = this.phishingData.timeLimit - this.phishingData.timeLeft;
      
      let score = 0;
      let feedback = "";
      
      if (isCorrect) {
          // Calculate score based on difficulty, speed, and streak
          const difficultyMultiplier = {
              'easy': 1, 'medium': 1.5, 'hard': 2, 'expert': 3
          }[this.currentEmail.difficulty] || 1;
          
          const speedBonus = Math.max(0, (this.phishingData.timeLimit - responseTime) / this.phishingData.timeLimit);
          score = Math.floor(100 * difficultyMultiplier * (1 + speedBonus));
          
          this.gameStats.phishing.streak++;
          this.gameStats.phishing.totalCorrect++;
          this.gameStats.phishing.score += score;
          this.gameStats.phishing.reputation += 5;
          
          feedback = `✅ CORRECT! (+${score} points)\n`;
          feedback += `Response time: ${responseTime}s\n`;
          
          if (speedBonus > 0.7) {
              feedback += "🚀 Lightning fast response!\n";
          }
          
          if (this.gameStats.phishing.streak >= 3) {
              feedback += `🔥 ${this.gameStats.phishing.streak} question streak!`;
          }
          
      } else {
          // Handle incorrect answer
          this.phishingData.consecutiveErrors++;
          this.gameStats.phishing.streak = 0;
          
          // Reputation loss varies by mistake severity
          let reputationLoss = 15;
          if (this.currentEmail.isPhishing && !userAnswerIsPhishing) {
              // Missed phishing - more severe
              reputationLoss = 25;
              feedback = `❌ CRITICAL ERROR! You missed a phishing attempt!\n`;
              feedback += `🚨 In a real scenario, this could compromise your entire network.\n`;
          } else {
              // False positive - less severe but still bad
              reputationLoss = 10;
              feedback = `❌ WRONG! You flagged a legitimate email as phishing.\n`;
              feedback += `😕 This could disrupt business operations.\n`;
          }
          
          this.gameStats.phishing.reputation -= reputationLoss;
          feedback += `Reputation: -${reputationLoss} points\n`;
          
          // Add educational information
          if (this.currentEmail.indicators) {
              feedback += `\n🔍 Red flags you missed:\n`;
              this.currentEmail.indicators.forEach(indicator => {
                  feedback += `• ${indicator}\n`;
              });
          }
      }
      
      // Check for game failure conditions
      if (this.gameStats.phishing.reputation <= 0) {
          this.triggerPhishingGameFailure();
          return;
      }
      
      if (this.phishingData.consecutiveErrors >= 3) {
          this.triggerPhishingGameFailure();
          return;
      }
      
      this.showPhishingFeedback(isCorrect, feedback);
  }

  triggerPhishingGameFailure() {
      const feedback = `🚨 TRAINING TERMINATED!\n\n`;
      
      if (this.gameStats.phishing.reputation <= 0) {
          feedback += "Your reputation has been completely destroyed. You've been flagged as a security risk and require immediate retraining.\n\n";
      } else {
          feedback += "Too many consecutive errors detected. You pose a significant risk to organizational security.\n\n";
      }
      
      feedback += `Final Stats:\n`;
      feedback += `• Correct: ${this.gameStats.phishing.totalCorrect}/${this.phishingData.currentQuestion}\n`;
      feedback += `• Reputation: ${this.gameStats.phishing.reputation}/100\n`;
      feedback += `• Consecutive Errors: ${this.phishingData.consecutiveErrors}\n\n`;
      feedback += "📚 Recommend: Complete cybersecurity awareness training before retrying.";
      
      this.showPhishingFeedback(false, feedback, true);
      document.getElementById('nextPhishing').textContent = "RESTART TRAINING";
  }

  showPhishingFeedback(isCorrect, message, isGameOver = false) {
      const feedbackPanel = document.getElementById('phishingFeedback');
      const feedbackContent = feedbackPanel.querySelector('.feedback-content');
      
      feedbackContent.innerHTML = `<pre>${message}</pre>`;
      feedbackContent.className = `feedback-content ${isCorrect ? 'success' : 'error'}`;
      
      feedbackPanel.classList.remove('hidden');
      
      // Update UI
      document.getElementById('phishingGameScore').textContent = this.gameStats.phishing.score;
      
      if (isGameOver) {
          document.getElementById('nextPhishing').onclick = () => this.restartPhishingGame();
      }
  }

  nextPhishingQuestion() {
      this.phishingData.currentQuestion++;
      this.phishingData.timeLeft = this.phishingData.timeLimit;
      this.loadPhishingQuestion();
  }

  endPhishingGame() {
      const totalCorrect = this.gameStats.phishing.totalCorrect;
      const accuracy = (totalCorrect / this.phishingData.totalQuestions) * 100;
      
      let outcome = "";
      let rank = "";
      
      if (accuracy >= 90) {
          rank = "🏆 CYBERSECURITY EXPERT";
          outcome = "Outstanding performance! You have excellent phishing detection skills.";
      } else if (accuracy >= 70) {
          rank = "🥈 SECURITY ANALYST";
          outcome = "Good job! You can identify most threats but need some improvement.";
      } else if (accuracy >= 50) {
          rank = "🥉 SECURITY AWARE";
          outcome = "Average performance. Additional training recommended.";
      } else {
          rank = "⚠️ HIGH RISK";
          outcome = "Poor performance. You are vulnerable to phishing attacks. Immediate training required.";
      }
      
      const finalFeedback = `${rank}\n\n${outcome}\n\n`;
      finalFeedback += `Final Results:\n`;
      finalFeedback += `• Accuracy: ${accuracy.toFixed(1)}%\n`;
      finalFeedback += `• Score: ${this.gameStats.phishing.score}\n`;
      finalFeedback += `• Reputation: ${this.gameStats.phishing.reputation}/100\n`;
      finalFeedback += `• Best Streak: ${this.gameStats.phishing.streak}`;
      
      this.showPhishingFeedback(accuracy >= 70, finalFeedback, true);
      document.getElementById('nextPhishing').textContent = "NEW TRAINING SESSION";
  }

  restartPhishingGame() {
      this.gameStats.phishing = { score: 0, attempts: 0, streak: 0, totalCorrect: 0, reputation: 100 };
      this.phishingData.currentQuestion = 1;
      this.phishingData.consecutiveErrors = 0;
      this.phishingData.timeLimit = 30;
      this.startPhishingGame();
  }

  // ============= PASSWORD FORTRESS GAME =============
  startPasswordGame() {
      document.getElementById('passwordGame').classList.remove('hidden');
      this.passwordData.currentAttempt = 1;
      this.passwordData.hackingAttempts = 0;
      this.loadPasswordChallenge();
  }

  loadPasswordChallenge() {
      if (this.passwordData.currentAttempt > this.passwordData.totalAttempts) {
          this.endPasswordGame();
          return;
      }

      const challenge = this.passwordChallenges[this.passwordData.currentAttempt - 1];
      this.passwordData.currentRequirements = challenge;
      
      // Display scenario
      const scenarioText = `Scenario ${this.passwordData.currentAttempt}: ${challenge.scenario}`;
      document.querySelector('#passwordGame .game-header h2').textContent = scenarioText;
      
      // Display requirements
      this.displayPasswordRequirements(challenge.requirements);
      
      // Clear previous input
      document.getElementById('passwordInput').value = '';
      this.updatePasswordStrength('');
      
      // Update attempt counter
      document.getElementById('passwordAttempt').textContent = this.passwordData.currentAttempt;
      
      // Hide feedback
      document.getElementById('passwordFeedback').classList.add('hidden');
      
      // Start simulated hacking attempts
      this.startHackingSimulation();
  }

  displayPasswordRequirements(requirements) {
      const requirementList = document.getElementById('requirementList');
      requirementList.innerHTML = requirements.map(req => 
          `<div class="requirement-item" data-requirement="${req}">
              <span class="requirement-icon">⚪</span>
              <span class="requirement-text">${req}</span>
          </div>`
      ).join('');
  }

  checkPasswordStrength(password) {
      const requirements = this.passwordData.currentRequirements.requirements;
      const minScore = this.passwordData.currentRequirements.minScore;
      
      let score = 0;
      let satisfiedReqs = 0;
      
      // Check each requirement
      const checks = {
          "8+ characters": password.length >= 8,
          "12+ characters": password.length >= 12,
          "15+ characters": password.length >= 15,
          "20+ characters": password.length >= 20,
          "25+ characters": password.length >= 25,
          "1 uppercase": /[A-Z]/.test(password),
          "1 lowercase": /[a-z]/.test(password),
          "1 number": /\d/.test(password),
          "1 special character": /[!@#$%^&*(),.?":{}|<>]/.test(password),
          "2 special characters": (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length >= 2,
          "Mixed case": /[A-Z]/.test(password) && /[a-z]/.test(password),
          "Numbers": /\d/.test(password),
          "Special chars": /[!@#$%^&*(),.?":{}|<>]/.test(password),
          "No common patterns": !this.hasCommonPatterns(password),
          "No dictionary words": !this.hasDictionaryWords(password),
          "No personal info": !this.hasPersonalInfo(password),
          "Passphrase style": this.isPassphraseStyle(password),
          "No predictable patterns": !this.hasPredictablePatterns(password),
          "All requirements": true // This will be calculated based on other requirements
      };
      
      // Update requirement indicators
      requirements.forEach(req => {
          const reqElement = document.querySelector(`[data-requirement="${req}"]`);
          if (reqElement) {
              const satisfied = checks[req];
              const icon = reqElement.querySelector('.requirement-icon');
              
              if (satisfied) {
                  icon.textContent = '✅';
                  icon.style.color = '#4CAF50';
                  satisfiedReqs++;
                  score += 20;
              } else {
                  icon.textContent = '❌';
                  icon.style.color = '#f44336';
              }
          }
      });
      
      // Additional scoring factors
      score += Math.min(password.length * 2, 40); // Length bonus
      score += this.calculateEntropy(password) / 2; // Entropy bonus
      score -= this.calculateVulnerabilities(password) * 5; // Vulnerability penalty
      
      score = Math.max(0, Math.min(100, score));
      
      this.updatePasswordStrengthMeter(score, minScore);
      
      return { score, satisfiedReqs, totalReqs: requirements.length };
  }

  hasCommonPatterns(password) {
      const commonPatterns = [
          /123456/, /qwerty/, /password/, /admin/, /letmein/,
          /111111/, /123123/, /welcome/, /monkey/, /dragon/
      ];
      return commonPatterns.some(pattern => pattern.test(password.toLowerCase()));
  }

  hasDictionaryWords(password) {
      const commonWords = [
          'password', 'admin', 'user', 'login', 'welcome', 'home', 'test', 
          'guest', 'info', 'master', 'root', 'system', 'access'
      ];
      return commonWords.some(word => password.toLowerCase().includes(word));
  }

  hasPersonalInfo(password) {
      // In a real implementation, this would check against known personal info
      const personalPatterns = [
          /john/, /jane/, /smith/, /2023/, /2024/, /birthday/
      ];
      return personalPatterns.some(pattern => pattern.test(password.toLowerCase()));
  }

  isPassphraseStyle(password) {
      // Check if password resembles a passphrase (multiple words with separators)
      return password.length >= 15 && /\s|-|_/.test(password);
  }

  hasPredictablePatterns(password) {
      // Check for keyboard patterns, repeated sequences, etc.
      const patterns = [
          /(.)\1{2,}/, // Same character repeated 3+ times
          /012345/, /abcdef/, /qwerty/,
          /asdf/, /zxcv/
      ];
      return patterns.some(pattern => pattern.test(password.toLowerCase()));
  }

  calculateEntropy(password) {
      // Simplified entropy calculation
      const charSets = [
          /[a-z]/g, /[A-Z]/g, /[0-9]/g, /[^a-zA-Z0-9]/g
      ];
      
      let charSetSize = 0;
      charSets.forEach(set => {
          if (set.test(password)) {
            charSetSize += /[a-z]/.test(set) ? 26 :
            /[A-Z]/.test(set) ? 26 :
            /[0-9]/.test(set) ? 10 : 32;
          }
      });
      
      return Math.log2(Math.pow(charSetSize, password.length));
  }

  calculateVulnerabilities(password) {
      let vulnerabilities = 0;
      
      // Check against common attack vectors
      if (password.length < 8) vulnerabilities += 3;
      if (!/[A-Z]/.test(password)) vulnerabilities += 2;
      if (!/[a-z]/.test(password)) vulnerabilities += 2;
      if (!/\d/.test(password)) vulnerabilities += 2;
      if (!/[^a-zA-Z0-9]/.test(password)) vulnerabilities += 2;
      if (this.hasCommonPatterns(password)) vulnerabilities += 4;
      if (this.hasDictionaryWords(password)) vulnerabilities += 3;
      
      return vulnerabilities;
  }

  updatePasswordStrengthMeter(score, minScore) {
      const strengthBar = document.getElementById('strengthBar');
      const strengthLabel = document.getElementById('strengthLabel');
      
      strengthBar.style.width = score + '%';
      
      let label = '';
      let color = '';
      
      if (score < 30) {
          label = 'Very Weak';
          color = '#ff4444';
      } else if (score < 50) {
          label = 'Weak';
          color = '#ff8800';
      } else if (score < 70) {
          label = 'Moderate';
          color = '#ffdd00';
      } else if (score < 85) {
          label = 'Strong';
          color = '#88cc00';
      } else {
          label = 'Very Strong';
          color = '#44cc44';
      }
      
      if (score >= minScore) {
          label += ' ✓';
      } else {
          label += ` (Need ${minScore}+)`;
      }
      
      strengthLabel.textContent = label;
      strengthBar.style.backgroundColor = color;
  }

  startHackingSimulation() {
      // Simulate ongoing hacking attempts during password creation
      const hackingInterval = setInterval(() => {
          if (this.passwordData.currentAttempt > this.passwordData.totalAttempts) {
              clearInterval(hackingInterval);
              return;
          }
          
          this.passwordData.hackingAttempts++;
          
          const hackingMessages = [
              `🚨 ${this.passwordData.hackingAttempts} brute force attempts detected`,
              `⚠️ Dictionary attack in progress...`,
              `🔴 ${Math.floor(Math.random() * 1000)} login attempts blocked`,
              `⚡ Advanced persistent threat detected`
          ];
          
          const message = hackingMessages[Math.floor(Math.random() * hackingMessages.length)];
          this.showHackingAlert(message);
      }, 5000);
  }

  showHackingAlert(message) {
      // Create temporary alert
      const alert = document.createElement('div');
      alert.className = 'hacking-alert';
      alert.textContent = message;
      alert.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #ff4444;
          color: white;
          padding: 10px;
          border-radius: 4px;
          z-index: 10000;
          font-family: monospace;
          animation: slideIn 0.3s ease;
      `;
      
      document.body.appendChild(alert);
      
      setTimeout(() => {
          alert.remove();
      }, 3000);
  }

  submitPassword() {
      const password = document.getElementById('passwordInput').value;
      const result = this.checkPasswordStrength(password);
      const challenge = this.passwordData.currentRequirements;
      
      let feedback = "";
      let success = false;
      
      if (result.score >= challenge.minScore && result.satisfiedReqs === result.totalReqs) {
          // Password passes
          success = true;
          const score = Math.floor(result.score * (challenge.minScore / 50));
          this.gameStats.password.score += score;
          this.gameStats.password.totalCorrect++;
          this.gameStats.password.reputation += 10;
          
          feedback = `✅ PASSWORD ACCEPTED!\n\n`;
          feedback += `Security Score: ${result.score}/100\n`;
          feedback += `Challenge Rating: ${challenge.difficulty.toUpperCase()}\n`;
          feedback += `Points Earned: +${score}\n`;
          feedback += `Estimated crack time: ${this.calculateCrackTime(password)}\n\n`;
          
          if (result.score >= 95) {
              feedback += `🏆 EXCEPTIONAL! This password would take centuries to crack.`;
          } else if (result.score >= 85) {
              feedback += `🛡️ EXCELLENT! Very secure password.`;
          } else {
              feedback += `✓ GOOD! Meets security requirements.`;
          }
          
      } else {
          // Password fails
          const vulnerabilities = this.calculateVulnerabilities(password);
          this.gameStats.password.reputation -= 15;
          
          feedback = `❌ PASSWORD REJECTED!\n\n`;
          feedback += `Security Score: ${result.score}/100 (Required: ${challenge.minScore}+)\n`;
          feedback += `Requirements Met: ${result.satisfiedReqs}/${result.totalReqs}\n`;
          feedback += `Vulnerability Score: ${vulnerabilities}/10\n\n`;
          
          if (vulnerabilities > 7) {
              feedback += `🚨 CRITICAL: This password would be cracked in minutes!\n`;
              feedback += `Estimated crack time: ${this.calculateCrackTime(password)}\n`;
              this.gameStats.password.reputation -= 10; // Extra penalty
          } else {
              feedback += `⚠️ This password is vulnerable to attacks.\n`;
          }
          
          feedback += `\n💡 Improvement suggestions:\n`;
          if (password.length < challenge.requirements.find(r => r.includes('characters'))?.match(/\d+/)?.[0] || 8) {
              feedback += `• Make it longer\n`;
          }
          if (!/[A-Z]/.test(password)) feedback += `• Add uppercase letters\n`;
          if (!/[a-z]/.test(password)) feedback += `• Add lowercase letters\n`;
          if (!/\d/.test(password)) feedback += `• Add numbers\n`;
          if (!/[^a-zA-Z0-9]/.test(password)) feedback += `• Add special characters\n`;
      }
      
      // Check for game failure
      if (this.gameStats.password.reputation <= 0) {
          this.triggerPasswordGameFailure();
          return;
      }
      
      this.showPasswordFeedback(success, feedback);
  }

  calculateCrackTime(password) {
      const vulnerabilities = this.calculateVulnerabilities(password);
      const entropy = this.calculateEntropy(password);
      
      if (vulnerabilities > 8) return "< 1 minute";
      if (vulnerabilities > 6) return "< 1 hour";
      if (vulnerabilities > 4) return "< 1 day";
      if (entropy < 40) return "< 1 week";
      if (entropy < 60) return "< 1 year";
      if (entropy < 80) return "10+ years";
      return "1000+ years";
  }

  triggerPasswordGameFailure() {
      const feedback = `🚨 SECURITY BREACH!\n\n`;
      feedback += `Your poor password choices have led to a complete security compromise.\n\n`;
      feedback += `Systems Affected:\n`;
      feedback += `• User accounts compromised\n`;
      feedback += `• Sensitive data accessed\n`;
      feedback += `• Financial losses: $${(Math.random() * 100000).toFixed(0)}\n`;
      feedback += `• Reputation damage: Severe\n\n`;
      feedback += `You have been flagged as a high-risk user and require immediate security training.`;
      
      this.showPasswordFeedback(false, feedback, true);
      document.getElementById('nextPassword').textContent = "RESTART TRAINING";
  }

  showPasswordFeedback(isCorrect, message, isGameOver = false) {
      const feedbackPanel = document.getElementById('passwordFeedback');
      const feedbackContent = feedbackPanel.querySelector('.feedback-content');
      
      feedbackContent.innerHTML = `<pre>${message}</pre>`;
      feedbackContent.className = `feedback-content ${isCorrect ? 'success' : 'error'}`;
      
      feedbackPanel.classList.remove('hidden');
      
      // Update UI
      document.getElementById('passwordGameScore').textContent = this.gameStats.password.score;
      
      if (isGameOver) {
          document.getElementById('nextPassword').onclick = () => this.restartPasswordGame();
      }
  }

  nextPasswordChallenge() {
      this.passwordData.currentAttempt++;
      this.loadPasswordChallenge();
  }

  endPasswordGame() {
      const accuracy = (this.gameStats.password.totalCorrect / this.passwordData.totalAttempts) * 100;
      
      let outcome = "";
      let rank = "";
      
      if (accuracy >= 90) {
          rank = "🏆 PASSWORD MASTER";
          outcome = "Outstanding! You create incredibly secure passwords.";
      } else if (accuracy >= 70) {
          rank = "🥈 SECURITY CONSCIOUS";
          outcome = "Good work! You understand password security fundamentals.";
      } else if (accuracy >= 50) {
          rank = "🥉 BASIC SECURITY";
          outcome = "Average performance. More training needed.";
      } else {
          rank = "⚠️ SECURITY RISK";
          outcome = "Poor performance. You create vulnerable passwords.";
      }
      
      const finalFeedback = `${rank}\n\n${outcome}\n\n`;
      finalFeedback += `Final Results:\n`;
      finalFeedback += `• Success Rate: ${accuracy.toFixed(1)}%\n`;
      finalFeedback += `• Total Score: ${this.gameStats.password.score}\n`;
      finalFeedback += `• Reputation: ${this.gameStats.password.reputation}/100\n`;
      finalFeedback += `• Hacking Attempts Blocked: ${this.passwordData.hackingAttempts}`;
      
      this.showPasswordFeedback(accuracy >= 70, finalFeedback, true);
      document.getElementById('nextPassword').textContent = "NEW TRAINING SESSION";
  }

  restartPasswordGame() {
      this.gameStats.password = { score: 0, attempts: 0, streak: 0, totalCorrect: 0, reputation: 100 };
      this.passwordData.currentAttempt = 1;
      this.passwordData.hackingAttempts = 0;
      this.startPasswordGame();
  }

  // ============= NETWORK DEFENSE GAME =============
  startNetworkGame() {
      document.getElementById('networkGame').classList.remove('hidden');
      this.networkData.threatsRemaining = 4;
      this.networkData.timeLeft = 30;
      this.networkData.systemHealth = 100;
      this.networkData.missedThreats = 0;
      document.getElementById('startNetworkGame').textContent = "START DEFENSE";
  }

  startNetworkDefense() {
      this.networkData.isUnderAttack = true;
      this.generateRandomThreat();
      this.startNetworkTimer();
      document.getElementById('startNetworkGame').style.display = 'none';
  }

  setupNetworkDragAndDrop() {
      const threatQueue = document.getElementById('currentThreat');
      const networkNodes = document.querySelectorAll('.network-node');

      // Make threat draggable
      if (threatQueue) {
          threatQueue.addEventListener('dragstart', (e) => {
              e.dataTransfer.setData('text/plain', 'threat');
              e.dataTransfer.effectAllowed = 'move';
          });
      }

      // Setup drop zones
      networkNodes.forEach(node => {
          node.addEventListener('dragover', (e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              node.classList.add('drag-over');
          });

          node.addEventListener('dragleave', () => {
              node.classList.remove('drag-over');
          });

          node.addEventListener('drop', (e) => {
              e.preventDefault();
              node.classList.remove('drag-over');
              
              const expectedTarget = node.dataset.accept.toLowerCase();
              const actualTarget = this.networkData.currentThreat?.target;
              
              this.handleThreatPlacement(actualTarget === expectedTarget, node);
          });
      });

      // Keyboard accessibility
      networkNodes.forEach(node => {
          node.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const expectedTarget = node.dataset.accept.toLowerCase();
                  const actualTarget = this.networkData.currentThreat?.target;
                  this.handleThreatPlacement(actualTarget === expectedTarget, node);
              }
          });
      });
  }

  generateRandomThreat() {
      if (this.networkData.threatsRemaining <= 0) {
          this.endNetworkGame();
          return;
      }

      const threat = this.networkThreats[Math.floor(Math.random() * this.networkThreats.length)];
      this.networkData.currentThreat = threat;

      const threatElement = document.getElementById('currentThreat');
      threatElement.innerHTML = `
          <div class="threat-item ${threat.severity}">
              <span class="threat-icon">${threat.icon}</span>
              <div class="threat-info">
                  <h4>${threat.type}</h4>
                  <p>${threat.description}</p>
                  <span class="severity ${threat.severity}">${threat.severity.toUpperCase()}</span>
              </div>
          </div>
      `;

      // Update threat counter
      document.getElementById('threatCount').textContent = this.networkData.threatsRemaining;
  }

  startNetworkTimer() {
      this.networkData.timer = setInterval(() => {
          this.networkData.timeLeft--;
          document.getElementById('networkTimer').textContent = this.networkData.timeLeft;

          if (this.networkData.timeLeft <= 0) {
              this.handleNetworkTimeout();
          } else if (this.networkData.timeLeft <= 5) {
              this.showNetworkWarning();
          }
      }, 1000);
  }

  handleNetworkTimeout() {
      this.networkData.missedThreats++;
      this.networkData.systemHealth -= 25;
      
      const damage = `⏰ TIMEOUT! ${this.networkData.currentThreat.type} succeeded!\n`;
      damage += `System Health: ${this.networkData.systemHealth}/100\n`;
      
      this.showNetworkAlert(damage, false);
      
      if (this.networkData.systemHealth <= 0) {
          this.triggerNetworkGameFailure();
      } else {
          this.nextNetworkThreat();
      }
  }

  showNetworkWarning() {
      document.querySelector('#networkGame .game-header').style.backgroundColor = '#ff6b35';
      setTimeout(() => {
          document.querySelector('#networkGame .game-header').style.backgroundColor = '';
      }, 500);
  }

  handleThreatPlacement(isCorrect, node) {
      clearInterval(this.networkData.timer);
      
      const threat = this.networkData.currentThreat;
      const responseTime = 30 - this.networkData.timeLeft;
      
      if (isCorrect) {
          // Correct placement
          const score = Math.floor(100 * (threat.severity === 'critical' ? 2 : threat.severity === 'high' ? 1.5 : 1));
          const speedBonus = Math.max(0, (30 - responseTime) / 30 * 50);
          const totalScore = score + speedBonus;
          
          this.gameStats.network.score += totalScore;
          this.gameStats.network.totalCorrect++;
          
          node.classList.add('success-flash');
          setTimeout(() => node.classList.remove('success-flash'), 1000);
          
          const feedback = `✅ THREAT NEUTRALIZED!\n`;
          feedback += `${threat.type} blocked at ${node.querySelector('label').textContent}\n`;
          feedback += `Points: +${Math.floor(totalScore)}\n`;
          feedback += `Response time: ${responseTime}s`;
          
          this.showNetworkAlert(feedback, true);
          
      } else {
          // Incorrect placement
          this.networkData.missedThreats++;
          this.networkData.systemHealth -= (threat.severity === 'critical' ? 30 : 
                                         threat.severity === 'high' ? 20 : 15);
          
          node.classList.add('error-flash');
          setTimeout(() => node.classList.remove('error-flash'), 1000);
          
          const feedback = `❌ MISPLACED DEFENSE!\n`;
          feedback += `${threat.type} should target ${threat.target}, not ${node.querySelector('label').textContent.toLowerCase()}\n`;
          feedback += `System Health: ${this.networkData.systemHealth}/100\n`;
          feedback += `Actual damage inflicted!`;
          
          this.showNetworkAlert(feedback, false);
          
          if (this.networkData.systemHealth <= 0) {
              this.triggerNetworkGameFailure();
              return;
          }
      }
      
      this.nextNetworkThreat();
  }

  showNetworkAlert(message, isSuccess) {
      const alert = document.createElement('div');
      alert.className = 'network-alert';
      alert.innerHTML = `<pre>${message}</pre>`;
      alert.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: ${isSuccess ? '#4CAF50' : '#f44336'};
          color: white;
          padding: 20px;
          border-radius: 8px;
          z-index: 10000;
          font-family: monospace;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      
      document.body.appendChild(alert);
      
      setTimeout(() => {
          alert.remove();
      }, 2500);
  }

  nextNetworkThreat() {
      this.networkData.threatsRemaining--;
      this.networkData.timeLeft = 30;
      
      if (this.networkData.threatsRemaining > 0) {
          setTimeout(() => {
              this.generateRandomThreat();
              this.startNetworkTimer();
          }, 3000);
      } else {
          setTimeout(() => {
              this.endNetworkGame();
          }, 3000);
      }
  }

  triggerNetworkGameFailure() {
      clearInterval(this.networkData.timer);
      
      const feedback = `🚨 NETWORK COMPROMISED!\n\n`;
      feedback += `Your network defenses have been completely overwhelmed.\n\n`;
      feedback += `Damage Assessment:\n`;
      feedback += `• System Health: 0/100\n`;
      feedback += `• Threats Missed: ${this.networkData.missedThreats}\n`;
      feedback += `• Successful Blocks: ${this.gameStats.network.totalCorrect}\n`;
      feedback += `• Estimated Financial Loss: $${(Math.random() * 500000 + 100000).toFixed(0)}\n\n`;
      feedback += `Critical systems offline. Emergency incident response required.`;
      
      this.showNetworkAlert(feedback, false);
      
      setTimeout(() => {
          document.getElementById('startNetworkGame').textContent = "RESTART DEFENSE";
          document.getElementById('startNetworkGame').style.display = 'block';
          document.getElementById('startNetworkGame').onclick = () => this.restartNetworkGame();
      }, 5000);
  }

  endNetworkGame() {
      clearInterval(this.networkData.timer);
      
      const accuracy = (this.gameStats.network.totalCorrect / 4) * 100;
      const healthBonus = this.networkData.systemHealth * 10;
      const finalScore = this.gameStats.network.score + healthBonus;
      
      let outcome = "";
      let rank = "";
      
      if (accuracy >= 90 && this.networkData.systemHealth >= 80) {
          rank = "🏆 NETWORK GUARDIAN";
          outcome = "Perfect defense! You protected all critical systems.";
      } else if (accuracy >= 75 && this.networkData.systemHealth >= 60) {
          rank = "🥈 CYBER DEFENDER";
          outcome = "Strong defense with minimal damage sustained.";
      } else if (accuracy >= 50 && this.networkData.systemHealth >= 40) {
          rank = "🥉 SECURITY ANALYST";
          outcome = "Adequate defense but some systems compromised.";
      } else {
          rank = "⚠️ SECURITY BREACH";
          outcome = "Poor defense. Critical vulnerabilities exposed.";
      }
      
      const finalFeedback = `${rank}\n\n${outcome}\n\n`;
      finalFeedback += `Final Results:\n`;
      finalFeedback += `• Accuracy: ${accuracy.toFixed(1)}%\n`;
      finalFeedback += `• Final Score: ${finalScore}\n`;
      finalFeedback += `• System Health: ${this.networkData.systemHealth}/100\n`;
      finalFeedback += `• Threats Blocked: ${this.gameStats.network.totalCorrect}/4\n`;
      finalFeedback += `• Health Bonus: +${healthBonus}`;
      
      this.showNetworkAlert(finalFeedback, accuracy >= 70);
      
      setTimeout(() => {
          document.getElementById('startNetworkGame').textContent = "NEW DEFENSE SCENARIO";
          document.getElementById('startNetworkGame').style.display = 'block';
          document.getElementById('startNetworkGame').onclick = () => this.restartNetworkGame();
      }, 8000);
  }

  restartNetworkGame() {
      this.gameStats.network = { score: 0, attempts: 0, streak: 0, totalCorrect: 0, reputation: 100 };
      this.networkData.threatsRemaining = 4;
      this.networkData.timeLeft = 30;
      this.networkData.systemHealth = 100;
      this.networkData.missedThreats = 0;
      this.networkData.isUnderAttack = false;
      this.startNetworkGame();
  }

  // ============= UTILITY METHODS =============
  closeGame(gameId) {
      document.getElementById(gameId).classList.add('hidden');
      
      // Clean up timers
      if (this.phishingData.timer) {
          clearInterval(this.phishingData.timer);
      }
      if (this.networkData.timer) {
          clearInterval(this.networkData.timer);
      }
      
      this.currentGame = null;
  }

  displayPlayerStats() {
      // This could be expanded to show player progress across sessions
      console.log('Player Stats:', this.gameStats);
  }
}

// Initialize the cyber training system
document.addEventListener('DOMContentLoaded', () => {
  new CyberTrainingSystem();
});

// Add CSS for dynamic elements
const dynamicStyles = `
.requirement-item {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: rgba(255,255,255,0.05);
  border-radius: 4px;
}

.requirement-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.threat-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid;
  margin: 0.5rem 0;
  cursor: move;
}

.threat-item.critical {
  border-color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
}

.threat-item.high {
  border-color: #ff8800;
  background: rgba(255, 136, 0, 0.1);
}

.threat-item.medium {
  border-color: #ffdd00;
  background: rgba(255, 221, 0, 0.1);
}

.threat-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.threat-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.threat-info p {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.severity {
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
}

.severity.critical {
  background: #ff4444;
  color: white;
}

.severity.high {
  background: #ff8800;
  color: white;
}

.severity.medium {
  background: #ffdd00;
  color: black;
}

.network-node.drag-over {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.success-flash {
  animation: successPulse 1s ease;
}

.error-flash {
  animation: errorPulse 1s ease;
}

@keyframes successPulse {
  0%, 100% { background: transparent; }
  50% { background: rgba(76, 175, 80, 0.3); }
}

@keyframes errorPulse {
  0%, 100% { background: transparent; }
  50% { background: rgba(244, 67, 54, 0.3); }
}

.feedback-content.success {
  border-left: 4px solid #4CAF50;
  background: rgba(76, 175, 80, 0.1);
}

.feedback-content.error {
  border-left: 4px solid #f44336;
  background: rgba(244, 67, 54, 0.1);
}

.hacking-alert {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);
