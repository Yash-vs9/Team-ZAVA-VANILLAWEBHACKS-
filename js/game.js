// -- Cyberpunk Cybersecurity Training JS --

document.addEventListener('DOMContentLoaded', () => {
  // --- Phishing Detection Game Setup ---
  const phishingEmails = [
    {
      sender: "security@yourbank-ver1fy.com",
      subject: "URGENT: Account Suspension Notice",
      body: "Your account will be suspended in 24 hours. Click now to verify your credentials.",
      phishing: true,
      feedback: "Domain is misspelled and message uses urgent language."
    },
    {
      sender: "info@company.com",
      subject: "Team meeting update",
      body: "Reminder: Meeting at 2pm in HQ. Please attend on time.",
      phishing: false,
      feedback: "Legitimate internal message."
    },
    {
      sender: "admin@paypal-secure.net",
      subject: "Unusual Activity Detected",
      body: "Please confirm your credentials to avoid being locked out.",
      phishing: true,
      feedback: "Fake domain and threatening message."
    },
    {
      sender: "hr@company.com",
      subject: "Annual Leave Policy",
      body: "Read the updated leave policy. Let us know if you have questions.",
      phishing: false,
      feedback: "Typical HR communication."
    },
    {
      sender: "amazon-secure@amaz0n.com",
      subject: "Refund processed",
      body: "We've processed your refund. Click here to see transaction details.",
      phishing: true,
      feedback: "Domain uses zero instead of 'o' (amaz0n)."
    },
    // Additional examples
    {
      sender: "support@faceb00k.com",
      subject: "Your account has been locked",
      body: "We detected suspicious activity. Login now to secure your account.",
      phishing: true,
      feedback: "Fake domain uses zeros in 'facebook'."
    },
    {
      sender: "newsletter@company.com",
      subject: "Monthly Newsletter - October Edition",
      body: "Here's what's new this month at the company.",
      phishing: false,
      feedback: "Standard newsletter email."
    },
    {
      sender: "security-alert@apple.com",
      subject: "Important: Verify Your Apple ID",
      body: "Your Apple ID has suspicious activity. Verify your account immediately.",
      phishing: true,
      feedback: "Official company domain misused with alarming language."
    },
    {
      sender: "service@netflix.com",
      subject: "Subscription renewal confirmation",
      body: "Your subscription has been renewed successfully.",
      phishing: false,
      feedback: "Genuine subscription confirmation email."
    },
    {
      sender: "updates@goog1e.com",
      subject: "Password reset required",
      body: "Your password expired. Click link to reset password.",
      phishing: true,
      feedback: "Fake Google domain with number '1' instead of letter 'l'."
    }
  ];


    let phishingIndex = 0;
    let phishingScore = 0;
    const phishingGameModal = document.getElementById('phishingGame');
    const phishingScoreEl = document.getElementById('phishingGameScore');
    const currentQuestionEl = document.getElementById('currentQuestion');
    const emailSenderEl = document.getElementById('emailSender');
    const emailSubjectEl = document.getElementById('emailSubject');
    const emailBodyEl = document.getElementById('emailBody');
    const feedbackPanelPhishing = document.getElementById('phishingFeedback');
    const feedbackContentPhishing = feedbackPanelPhishing.querySelector('.feedback-content');
    const nextBtnPhishing = document.getElementById('nextPhishing');
    const markSafeBtn = document.getElementById('markSafe');
    const markPhishingBtn = document.getElementById('markPhishing');

    // --- Password Fortress Game Setup ---
    const passwordGameModal = document.getElementById('passwordGame');
    const passwordScoreEl = document.getElementById('passwordGameScore');
    const passwordAttemptEl = document.getElementById('passwordAttempt');
    const passwordInput = document.getElementById('passwordInput');
    const strengthBar = document.getElementById('strengthBar');
    const strengthLabel = document.getElementById('strengthLabel');
    const requirementListEl = document.getElementById('requirementList');
    const passwordFeedbackPanel = document.getElementById('passwordFeedback');
    const passwordFeedbackContent = passwordFeedbackPanel.querySelector('.feedback-content');
    const submitPasswordBtn = document.getElementById('submitPassword');
    const nextPasswordBtn = document.getElementById('nextPassword');

    // Enhanced Password Game with 5 Progressive Levels
    const passwordChallenges = [
      {
        id: 1,
        title: "Basic Security",
        description: "Create a basic secure password",
        requirements: [
          { test: (pw) => pw.length >= 8, text: "At least 8 characters", points: 1 },
          { test: (pw) => /[A-Z]/.test(pw), text: "At least one uppercase letter", points: 1 },
          { test: (pw) => /[a-z]/.test(pw), text: "At least one lowercase letter", points: 1 }
        ],
        minScore: 3,
        tip: "Start with a memorable phrase and modify it!"
      },
      {
        id: 2,
        title: "Standard Protection",
        description: "Enhance your password with numbers",
        requirements: [
          { test: (pw) => pw.length >= 10, text: "At least 10 characters", points: 1 },
          { test: (pw) => /[A-Z]/.test(pw), text: "At least one uppercase letter", points: 1 },
          { test: (pw) => /[a-z]/.test(pw), text: "At least one lowercase letter", points: 1 },
          { test: (pw) => /[0-9]/.test(pw), text: "At least one number", points: 1 }
        ],
        minScore: 4,
        tip: "Replace letters with numbers: 'E' → '3', 'A' → '@'"
      },
      {
        id: 3,
        title: "Enhanced Security",
        description: "Add special characters for extra protection",
        requirements: [
          { test: (pw) => pw.length >= 12, text: "At least 12 characters", points: 1 },
          { test: (pw) => /[A-Z]/.test(pw), text: "At least one uppercase letter", points: 1 },
          { test: (pw) => /[a-z]/.test(pw), text: "At least one lowercase letter", points: 1 },
          { test: (pw) => /[0-9]/.test(pw), text: "At least one number", points: 1 },
          { test: (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\|,.<>\/?]/.test(pw), text: "At least one special character", points: 1 }
        ],
        minScore: 5,
        tip: "Use special characters like !@#$%^&* to strengthen your password"
      },
      {
        id: 4,
        title: "Corporate Standard",
        description: "Meet enterprise-level security requirements",
        requirements: [
          { test: (pw) => pw.length >= 14, text: "At least 14 characters", points: 1 },
          { test: (pw) => /[A-Z]/.test(pw), text: "At least one uppercase letter", points: 1 },
          { test: (pw) => /[a-z]/.test(pw), text: "At least one lowercase letter", points: 1 },
          { test: (pw) => /[0-9]/.test(pw), text: "At least one number", points: 1 },
          { test: (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\|,.<>\/?]/.test(pw), text: "At least one special character", points: 1 },
          { test: (pw) => !/(.){2,}/.test(pw), text: "No more than 2 consecutive identical characters", points: 1 }
        ],
        minScore: 6,
        tip: "Avoid patterns like 'aaa' or '111'. Mix different character types throughout!"
      },
      {
        id: 5,
        title: "Maximum Security",
        description: "Ultimate password fortress - military grade!",
        requirements: [
          { test: (pw) => pw.length >= 16, text: "At least 16 characters", points: 1 },
          { test: (pw) => /[A-Z]/.test(pw), text: "At least one uppercase letter", points: 1 },
          { test: (pw) => /[a-z]/.test(pw), text: "At least one lowercase letter", points: 1 },
          { test: (pw) => /[0-9]/.test(pw), text: "At least one number", points: 1 },
          { test: (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\|,.<>\/?]/.test(pw), text: "At least one special character", points: 1 },
          { test: (pw) => !/(.){2,}/.test(pw), text: "No more than 2 consecutive identical characters", points: 1 },
          { test: (pw) => /^(?=.*[A-Z].*[A-Z])(?=.*[a-z].*[a-z])(?=.*[0-9].*[0-9])/.test(pw), text: "At least 2 uppercase, 2 lowercase, and 2 numbers", points: 1 }
        ],
        minScore: 7,
        tip: "Think passphrases: 'MyDog@Loves2Run&Jump!' - long, memorable, and secure!"
      }
    ];

    const commonPasswords = [
      "password", "123456", "123456789", "qwerty", "abc123", "password1"
    ];

    let passwordScore = 0;
    let passwordAttempt = 1;
    let currentPasswordLevel = 0;
    const maxPasswordAttempts = 5;


    // --- Network Defense Simulator Setup ---
    const networkGameModal = document.getElementById('networkGame');
    const threatCountEl = document.getElementById('threatCount');
    const threatItemsEl = document.getElementById('threatItems');
    const startNetworkGameBtn = document.getElementById('startNetworkGame');
    const nodes = document.querySelectorAll(".network-node");
    const networkScoreEl = document.getElementById('networkGameScore');
    let networkScore = 0;
    const maxThreats = 4;
    let intervalId;
    let bestNetworkScore=localStorage.getItem("networkBestScore") || 0
    let bestPhishingScore=localStorage.getItem("phishingBestScore") || 0
    let time=30;
    let threats = [];

    function showModal(modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function hideModal(modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }

    // Launch buttons for all games
    document.querySelectorAll('.game-launch-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const gameType = btn.closest('.game-card').getAttribute('data-game');
        if (gameType === 'phishing') {
          startPhishingGame();
          showModal(phishingGameModal);
        } else if (gameType === 'password') {
          startPasswordGame();
          showModal(passwordGameModal);
        } else if (gameType === 'network') {
          startNetworkGame();
          showModal(networkGameModal);
        }
      });
    });

    // Close buttons for all modals
    document.querySelectorAll('.close-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const modalId = btn.getAttribute('data-close');
        const modal = document.getElementById(modalId);
        hideModal(modal);
        if (modalId === 'phishingGame') resetPhishingGame();
        if (modalId === 'passwordGame') resetPasswordGame();
        if (modalId === 'networkGame') resetNetworkGame();
      });
    });

    // --- Network Defense Simulator Logic ---
    const threatTypes = [
      {type: "unauthorized", label: "Unauthorized Access", icon: "👤", severity: "medium"},
      {type: "phishing", label: "Phishing", icon: "🎣", severity: "medium"},
      {type: "hacking", label: "Hacking", icon: "💀", severity: "high"},
      {type: "ddos", label: "DDoS", icon: "🌐", severity: "high"},
  ];
    const timer=document.getElementById("networkTimer")

    function startNetworkGame() {
      const nodes = document.querySelectorAll(".network-node");

nodes.forEach(node => {
  node.addEventListener("dragover", e => {
      e.preventDefault();
      node.classList.add("drag-over");
  });

  node.addEventListener("dragleave", () => {
      node.classList.remove("drag-over");
  });

  node.addEventListener("drop", e => {
      e.preventDefault();
      node.classList.remove("drag-over");

      const threatType = e.dataTransfer.getData("type").toLowerCase();
      const validThreatIndex = threats.findIndex(t => t.type.toLowerCase() === threatType);

      if (validThreatIndex === -1) return;
      // Check if this threat exists in threatTypes array
      const validThreat = threatTypes.find(t => t.type.toLowerCase() === threatType);

      if (!validThreat) {
          alert("This is not a valid threat!");
          return;
      }
      console.log(validThreat)

      const accepted = node.dataset.accept.toLowerCase().split(",").map(s => s.trim());
      console.log(accepted)
      if (accepted.includes(threatType)) {
          node.style.backgroundColor = "#00ff40";
          alert(`Successfully blocked ${validThreat.label} on ${node.querySelector("label").innerText}`);
          // Remove from array

      // Re-render threats

          networkScore+=1;
          networkScoreEl.innerHTML=networkScore
          threatCountEl.innerHTML=4-networkScore
          if(networkScore==4){
              clearInterval(intervalId); 
              alert("You win!")
              localStorage.setItem("networkScore",networkScore)

              hideModal(networkGameModal); 
              resetNetworkGame(networkGameModal)
          }
      } else {
          node.style.backgroundColor = "#ff0040";
          alert(`Failed! ${validThreat.label} cannot be dropped on ${node.querySelector("label").innerText}`);
      }
  });
});
          intervalId = setInterval(() => {
          time-=1;

          timer.innerHTML=time;
          if (time <= 0) {
              alert("Time out!")
            clearInterval(intervalId);
            resetNetworkGame();

          }
        }, 1000);
      networkScore = 0;
      networkScoreEl.textContent = networkScore;
      threats = generateThreats(maxThreats);
      threatCountEl.textContent = threats.length;
      renderThreats();
      startNetworkGameBtn.disabled = true;
    }

    function resetNetworkGame(modal) {
      console.log(networkScore)
      if(networkScore > bestNetworkScore) {
          localStorage.setItem("bestNetworkScore", networkScore);
          bestNetworkScore = networkScore;
      }
      localStorage.setItem("latestNetworkGame", networkScore);
      console.log(`🛡️ Network completed: ${networkScore}/4`);
      cyberDashboard.recordGameSession('network', networkScore);
      clearInterval(intervalId)
      time=30
      nodes.forEach(node => node.style.backgroundColor = '');
      networkScore = 0;
      networkScoreEl.textContent = networkScore;
      hideModal(modal)
      threatCountEl.textContent = maxThreats;
      threatItemsEl.innerHTML = '';
      startNetworkGameBtn.disabled = false;
    }

    // Render threats in the threat queue
    function renderThreats() {
      threatItemsEl.innerHTML = '';
      threats.forEach((threat, i) => {
          const div = document.createElement('div');
          div.className = "threat-item cyber-panel";
          div.draggable = true;
          div.textContent = `${threat.icon} ${threat.label}`;
          div.dataset.index = i;
          div.dataset.type = threat.type; 
          div.title = `Severity: ${threat.severity}`;
          div.style.cursor = 'pointer';

          div.addEventListener('click', () => handleThreatClick(i));

          div.addEventListener('dragstart', e => {
              e.dataTransfer.setData('type', threat.type.toLowerCase());
          });

          threatItemsEl.appendChild(div);
      });
  }

    // Generate random threats for the game
    function generateThreats(count) {
      const arr = [];
      for (let i = 0; i < count; i++) {
        const threat = threatTypes[i];
        arr.push(Object.assign({}, threat));
      }
      return arr;
    }

    // Handle clicking a threat to block it
    function handleThreatClick(index) {
      const threat = threats[index];
      networkScore++;
      networkScoreEl.textContent = networkScore;
      threats.splice(index, 1);
      renderThreats();
      threatCountEl.textContent = threats.length;
      if (threats.length === 0) alert(`All threats blocked! Final score: ${networkScore}`);
    }

    startNetworkGameBtn.addEventListener('click', startNetworkGame);

    // --- Phishing Game Functions ---
    let selectedPhishingEmails = [];

    function getRandomEmails(arr, n) {
      const shuffled = arr.slice();  // copy array
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, n);
    }

    function startPhishingGame() {
      selectedPhishingEmails = getRandomEmails(phishingEmails, 5);
      phishingIndex = 0;
      phishingScore = 0;
      phishingScoreEl.textContent = phishingScore;
      showPhishingQuestion();
      feedbackPanelPhishing.classList.add('hidden');
      markSafeBtn.disabled = false;
      markPhishingBtn.disabled = false;
    }
    function showNotification(title, message) {
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
    function showPhishingQuestion() {
      if (phishingIndex >= selectedPhishingEmails.length) {
        showNotification("Phishing Game Completed","You scored "+phishingScore+"/5")
        hideModal(phishingGameModal)
        return
      }
      const email = selectedPhishingEmails[phishingIndex];
      emailSenderEl.textContent = email.sender;
      emailSubjectEl.textContent = email.subject;
      emailBodyEl.textContent = email.body;
      currentQuestionEl.textContent = phishingIndex + 1;
      feedbackPanelPhishing.classList.add('hidden');
      markSafeBtn.disabled = false;
      markPhishingBtn.disabled = false;
      nextBtnPhishing.disabled = true;
    }


    function handlePhishingAnswer(isPhishing) {
      const email = phishingEmails[phishingIndex];
      const correct = isPhishing === email.phishing;
      let msg = correct 
        ? `<span style="color:#00ff40;">Correct!</span>` 
        : `<span style="color:#ff0040;">Incorrect!</span>`;
      msg += `<br><small>Hint: ${email.feedback}</small>`;
      feedbackContentPhishing.innerHTML = msg;
      feedbackPanelPhishing.classList.remove('hidden');
      markSafeBtn.disabled = true;
      markPhishingBtn.disabled = true;
      nextBtnPhishing.disabled = false;
      if (correct) {
        phishingScore++;
        phishingScoreEl.textContent = phishingScore;
        localStorage.setItem("phishingScore",phishingScore);
        localStorage.setItem("correctAnswers",++correctAnswers);

      }
    }

    markSafeBtn.addEventListener('click', () => handlePhishingAnswer(false));
    markPhishingBtn.addEventListener('click', () => handlePhishingAnswer(true));
    nextBtnPhishing.addEventListener('click', () => {
      phishingIndex++;
      showPhishingQuestion();
    });

    function resetPhishingGame() {
      if(phishingScore>bestPhishingScore){
          localStorage.setItem("bestPhishingScore",phishingScore)
      }
      localStorage.setItem("latestPhishingScore",phishingScore)
      if (typeof window.cyberDashboard !== 'undefined') {
        window.cyberDashboard.recordGameSession('phishing', phishingScore);
      }
      phishingIndex = 0;
      phishingScore = 0;
      phishingScoreEl.textContent = phishingScore;
      currentQuestionEl.textContent = 1;
      feedbackPanelPhishing.classList.add('hidden');
      markSafeBtn.disabled = false;
      markPhishingBtn.disabled = false;
      nextBtnPhishing.disabled = true;

      localStorage.setItem("latestPhishingGame", phishingScore);
      const currentBest = parseInt(localStorage.getItem("phishingBestScore")) || 0;
      if(phishingScore > currentBest) {
          localStorage.setItem("phishingBestScore", phishingScore);
      }
      console.log(`📧 Phishing completed: ${phishingScore}/5`);
    }

    // --- Password Fortress Functions (Enhanced with 5 Levels) ---

    // Get current challenge
    function getCurrentPasswordChallenge() {
      return passwordChallenges[currentPasswordLevel];
    }

    function startPasswordGame() {
      passwordScore = 0;
      passwordAttempt = 1;
      currentPasswordLevel = 0;
      passwordScoreEl.textContent = passwordScore;
      passwordAttemptEl.textContent = passwordAttempt;
      resetPasswordFeedback();
      loadPasswordLevel();
      passwordInput.value = '';
      submitPasswordBtn.disabled = false;
      nextPasswordBtn.disabled = true;
    }

    function loadPasswordLevel() {
      const challenge = getCurrentPasswordChallenge();

      // Update the game header to show current level
      const gameTitle = document.querySelector('#passwordGame .game-header h2');
      if (gameTitle) {
        gameTitle.textContent = `${challenge.title} - Level ${currentPasswordLevel + 1}`;
      }

      // Add level description
      let descriptionEl = document.querySelector('.password-level-description');
      if (!descriptionEl) {
        descriptionEl = document.createElement('div');
        descriptionEl.className = 'password-level-description';
        descriptionEl.style.cssText = `
          background: rgba(0, 255, 65, 0.1);
          border: 1px solid rgba(0, 255, 65, 0.3);
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          text-align: center;
        `;
        const inputSection = document.querySelector('.password-input-section');
        if (inputSection && inputSection.parentNode) {
          inputSection.parentNode.insertBefore(descriptionEl, inputSection);
        }
      }

      if (descriptionEl) {
        descriptionEl.innerHTML = `
          <h4 style="color: #00ff41; margin-bottom: 10px;">${challenge.title}</h4>
          <p style="color: #cccccc; margin-bottom: 10px;">${challenge.description}</p>
          <p style="color: #00ffbc; font-size: 0.9rem;"><strong>💡 Tip:</strong> ${challenge.tip}</p>
        `;
      }

      updatePasswordStrength('');
      renderPasswordRequirements('');
    }

    function resetPasswordFeedback() {
      passwordFeedbackPanel.classList.add('hidden');
      passwordFeedbackContent.innerHTML = '';
    }

    function updatePasswordStrength(pw) {
      const challenge = getCurrentPasswordChallenge();
      let score = 0;
      let passed = [];

      challenge.requirements.forEach(req => {
        if (req.test(pw)) {
          score += req.points;
          passed.push(req.text);
        }
      });

      const maxScore = challenge.requirements.reduce((a, b) => a + b.points, 0);
      const percent = (score / maxScore) * 100;

      if (strengthBar) {
        strengthBar.style.width = percent + '%';
      }

      let label = "Very Weak";
      let color = "#ff0040";

      if (percent === 100) {
        label = "Excellent";
        color = "#00ff40";
      } else if (percent > 80) {
        label = "Very Strong";
        color = "#00ffbc";
      } else if (percent > 60) {
        label = "Strong";
        color = "#40ff80";
      } else if (percent > 40) {
        label = "Medium";
        color = "#ffaa00";
      } else if (percent > 20) {
        label = "Weak";
        color = "#ff8000";
      }

      if (strengthLabel) {
        strengthLabel.textContent = label;
        strengthLabel.style.color = color;
      }

      if (strengthBar) {
        strengthBar.style.background = `linear-gradient(90deg, #ff0040, ${color})`;
      }

      renderPasswordRequirements(pw);

      return score;
    }

    function renderPasswordRequirements(pw) {
      const challenge = getCurrentPasswordChallenge();
      if (!requirementListEl) return;

      requirementListEl.innerHTML = '';

      challenge.requirements.forEach(req => {
        const met = req.test(pw);
        const el = document.createElement('div');
        el.className = 'requirement';
        el.innerHTML = `
          <span class="requirement-icon" style="color: ${met ? '#00ffbc' : '#ff0040'};">
            ${met ? '✓' : '✗'}
          </span>
          <span style="color: ${met ? '#00ffbc' : '#cccccc'};">${req.text}</span>
        `;
        el.style.cssText = `
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 5px 0;
          transition: all 0.3s ease;
        `;
        requirementListEl.appendChild(el);
      });
    }

    passwordInput.addEventListener('input', (e) => {
      updatePasswordStrength(e.target.value);
    });

    submitPasswordBtn.addEventListener('click', () => {
      const pw = passwordInput.value;
      if (pw === '') return alert('Please enter a password');

      const challenge = getCurrentPasswordChallenge();
      const score = updatePasswordStrength(pw);
      let msg = '';

      if (score >= challenge.minScore) {
        msg = `
          <div style="color:#00ff40; text-align: center;">
            <h4>🎉 Excellent Password!</h4>
            <p>You've successfully completed <strong>${challenge.title}</strong>!</p>
            <p style="color: #00ffbc;">Your password meets all security requirements.</p>
          </div>
        `;
        passwordScore++;
        passwordScoreEl.textContent = passwordScore;
      } else {
        const needed = challenge.minScore - score;
        msg = `
          <div style="color:#ff6060; text-align: center;">
            <h4>⚠️ Password Too Weak</h4>
            <p>You need <strong>${needed} more requirement${needed > 1 ? 's' : ''}</strong> to pass this level.</p>
            <p style="color: #ffaa00;">Review the requirements above and try again!</p>
          </div>
        `;
      }

      passwordFeedbackContent.innerHTML = msg;
      passwordFeedbackPanel.classList.remove('hidden');
      submitPasswordBtn.disabled = true;
      nextPasswordBtn.disabled = false;
    });

    nextPasswordBtn.addEventListener('click', () => {
      passwordInput.value = '';
      passwordAttempt++;
      currentPasswordLevel++;

      if (passwordAttempt > maxPasswordAttempts) {
        const finalScore = passwordScore;
        let performance = '';
        if (finalScore === 5) performance = '🏆 PERFECT! Password Master!';
        else if (finalScore >= 4) performance = '🥇 Excellent! Security Expert!';
        else if (finalScore >= 3) performance = '🥈 Good! Keep Learning!';
        else if (finalScore >= 2) performance = '🥉 Fair! More Practice Needed!';
        else performance = '📚 Keep Studying Security!';

        passwordFeedbackContent.innerHTML = `
          <div style="text-align: center;">
            <h3 style="color: #00ff41;">🔐 Password Fortress Complete!</h3>
            <div style="background: rgba(0,255,65,0.1); padding: 20px; border-radius: 10px; margin: 15px 0;">
              <p style="font-size: 1.2rem; color: #00ffff; margin-bottom: 10px;">
                Final Score: <strong>${finalScore}</strong> / ${maxPasswordAttempts}
              </p>
              <p style="color: #00ffbc; font-size: 1.1rem;">${performance}</p>
            </div>
            <div style="color: #cccccc; font-size: 0.9rem; margin-top: 15px;">
              <p><strong>Remember:</strong> Strong passwords are your first line of defense!</p>
              <p>Use unique passwords for each account and consider a password manager.</p>
            </div>
          </div>
        `;
        submitPasswordBtn.disabled = true;
        nextPasswordBtn.disabled = true;
        passwordAttemptEl.textContent = maxPasswordAttempts;
        return;
      }

      passwordAttemptEl.textContent = passwordAttempt;
      resetPasswordFeedback();
      loadPasswordLevel();
      submitPasswordBtn.disabled = false;
      nextPasswordBtn.disabled = true;
      updatePasswordStrength('');
    });

    function resetPasswordGame() {
      localStorage.setItem("latestPasswordGame", passwordScore);
      const currentPasswordBest = parseInt(localStorage.getItem("passwordBestScore")) || 0;
      if(passwordScore > currentPasswordBest) {
          localStorage.setItem("passwordBestScore", passwordScore);
      }
      console.log(`🔐 Password completed: ${passwordScore}/5`);

      // Update dashboard score if cyberDashboard exists
      if (typeof cyberDashboard !== 'undefined') {
        cyberDashboard.recordGameSession('password', passwordScore);
      }

      passwordScore = 0;
      passwordAttempt = 1;
      currentPasswordLevel = 0;
      passwordScoreEl.textContent = passwordScore;
      passwordAttemptEl.textContent = passwordAttempt;
      resetPasswordFeedback();
      passwordInput.value = '';
      submitPasswordBtn.disabled = false;
      nextPasswordBtn.disabled = true;
      updatePasswordStrength('');

      // Remove level description if it exists
      const descriptionEl = document.querySelector('.password-level-description');
      if (descriptionEl) {
        descriptionEl.remove();
      }
    }

});