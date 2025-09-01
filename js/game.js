// -- Cyberpunk Cybersecurity Training JS (FIXED VERSION) --

document.addEventListener('DOMContentLoaded', () => {
  // --- Global Game State Variables ---
  let phishingIndex = 0;
  let phishingScore = 0;
  let selectedPhishingEmails = [];
  let networkScore = 0;
  let passwordScore = 0;
  let passwordAttempt = 1;
  let currentPasswordLevel = 0;
  let threats = [];
  let networkGameTimer = 30;
  let intervalId = null;
  let gameCompletionInProgress = false;

  // --- DOM Elements ---
  const phishingGameModal = document.getElementById('phishingGame');
  const phishingScoreEl = document.getElementById('phishingGameScore');
  const currentQuestionEl = document.getElementById('currentQuestion');
  const emailSenderEl = document.getElementById('emailSender');
  const emailSubjectEl = document.getElementById('emailSubject');
  const emailBodyEl = document.getElementById('emailBody');
  const feedbackPanelPhishing = document.getElementById('phishingFeedback');
  const feedbackContentPhishing = feedbackPanelPhishing?.querySelector('.feedback-content');
  const nextBtnPhishing = document.getElementById('nextPhishing');
  const markSafeBtn = document.getElementById('markSafe');
  const markPhishingBtn = document.getElementById('markPhishing');

  // Password Game Elements
  const passwordGameModal = document.getElementById('passwordGame');
  const passwordScoreEl = document.getElementById('passwordGameScore');
  const passwordAttemptEl = document.getElementById('passwordAttempt');
  const passwordInput = document.getElementById('passwordInput');
  const strengthBar = document.getElementById('strengthBar');
  const strengthLabel = document.getElementById('strengthLabel');
  const requirementListEl = document.getElementById('requirementList');
  const passwordFeedbackPanel = document.getElementById('passwordFeedback');
  const passwordFeedbackContent = passwordFeedbackPanel?.querySelector('.feedback-content');
  const submitPasswordBtn = document.getElementById('submitPassword');
  const nextPasswordBtn = document.getElementById('nextPassword');

  // Network Game Elements
  const networkGameModal = document.getElementById('networkGame');
  const threatCountEl = document.getElementById('threatCount');
  const threatItemsEl = document.getElementById('threatItems');
  const startNetworkGameBtn = document.getElementById('startNetworkGame');
  const networkScoreEl = document.getElementById('networkGameScore');
  const networkTimer = document.getElementById("networkTimer");
  const nodes = document.querySelectorAll(".network-node");

  // --- Phishing Detection Game Data ---
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

  // --- Password Fortress Game Data ---
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
        { test: (pw) => !/(.)\1{2,}/.test(pw), text: "No more than 2 consecutive identical characters", points: 1 }
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
        { test: (pw) => !/(.)\1{2,}/.test(pw), text: "No more than 2 consecutive identical characters", points: 1 },
        { test: (pw) => /^(?=.*[A-Z].*[A-Z])(?=.*[a-z].*[a-z])(?=.*[0-9].*[0-9])/.test(pw), text: "At least 2 uppercase, 2 lowercase, and 2 numbers", points: 1 }
      ],
      minScore: 7,
      tip: "Think passphrases: 'MyDog@Loves2Run&Jump!' - long, memorable, and secure!"
    }
  ];

  // --- Network Defense Game Data ---
  const threatTypes = [
    {type: "unauthorized", label: "Unauthorized Access", icon: "👤", severity: "medium"},
    {type: "phishing", label: "Phishing", icon: "🎣", severity: "medium"},
    {type: "hacking", label: "Hacking", icon: "💀", severity: "high"},
    {type: "ddos", label: "DDoS", icon: "🌐", severity: "high"}
  ];

  const maxThreats = 4;
  const maxPasswordAttempts = 5;

  // --- Utility Functions ---
  function showModal(modal) {
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function hideModal(modal) {
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
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
      background: rgba(41, 37, 80, 0.95);
      color: #ffffff;
      border-left: 6px solid #00ff41;
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
      animation: slideIn 0.4s ease forwards;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }

  function getRandomEmails(arr, n) {
    const shuffled = [...arr];  // Create a copy
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, n);
  }

  // --- Phishing Game Functions (FIXED) ---
  function startPhishingGame() {
    selectedPhishingEmails = getRandomEmails(phishingEmails, 5);
    phishingIndex = 0;
    phishingScore = 0;
    gameCompletionInProgress = false;
    
    if (phishingScoreEl) phishingScoreEl.textContent = phishingScore;
    
    showPhishingQuestion();
    hideFeedbackPanel();
    enablePhishingButtons();
  }

  function showPhishingQuestion() {
    if (gameCompletionInProgress) return;
    
    if (phishingIndex >= selectedPhishingEmails.length) {
      completePhishingGame();
      return;
    }

    const email = selectedPhishingEmails[phishingIndex];
    if (emailSenderEl) emailSenderEl.textContent = email.sender;
    if (emailSubjectEl) emailSubjectEl.textContent = email.subject;
    if (emailBodyEl) emailBodyEl.textContent = email.body;
    if (currentQuestionEl) currentQuestionEl.textContent = phishingIndex + 1;
    
    hideFeedbackPanel();
    enablePhishingButtons();
    if (nextBtnPhishing) nextBtnPhishing.disabled = true;
  }

  function handlePhishingAnswer(isPhishing) {
    if (gameCompletionInProgress || phishingIndex >= selectedPhishingEmails.length) return;
    
    const email = selectedPhishingEmails[phishingIndex]; // FIXED: Use selectedPhishingEmails
    const correct = isPhishing === email.phishing;
    
    let msg = correct 
      ? `<span style="color:#00ff40;">✓ Correct!</span>` 
      : `<span style="color:#ff0040;">✗ Incorrect!</span>`;
    msg += `<br><small>💡 ${email.feedback}</small>`;
    
    if (feedbackContentPhishing) {
      feedbackContentPhishing.innerHTML = msg;
    }
    
    showFeedbackPanel();
    disablePhishingButtons();
    if (nextBtnPhishing) nextBtnPhishing.disabled = false;
    
    if (correct) {
      phishingScore++;
      if (phishingScoreEl) phishingScoreEl.textContent = phishingScore;
    }
  }

  function completePhishingGame() {
    if (gameCompletionInProgress) return;
    gameCompletionInProgress = true;
    
    const performance = getPhishingPerformance(phishingScore);
    showNotification("🎯 Phishing Detection Complete!", `Score: ${phishingScore}/5 - ${performance}`);
    
    // Save scores
    savePhishingScore();
    
    // Delayed modal hide for better UX
    setTimeout(() => {
      hideModal(phishingGameModal);
      resetPhishingGame();
    }, 2000);
  }

  function getPhishingPerformance(score) {
    if (score === 5) return "Perfect Detection!";
    if (score >= 4) return "Excellent!";
    if (score >= 3) return "Good Job!";
    if (score >= 2) return "Keep Learning!";
    return "More Practice Needed!";
  }

  function savePhishingScore() {
    try {
      localStorage.setItem("latestPhishingScore", phishingScore);
      const bestScore = parseInt(localStorage.getItem("phishingBestScore")) || 0;
      if (phishingScore > bestScore) {
        localStorage.setItem("phishingBestScore", phishingScore);
      }
      
      // Update dashboard if available
      if (typeof window.cyberDashboard !== 'undefined' && window.cyberDashboard.recordGameSession) {
        window.cyberDashboard.recordGameSession('phishing', phishingScore);
      }
    } catch (error) {
      console.warn('Could not save phishing score to localStorage:', error);
    }
  }

  function resetPhishingGame() {
    phishingIndex = 0;
    phishingScore = 0;
    gameCompletionInProgress = false;
    selectedPhishingEmails = [];
    
    if (phishingScoreEl) phishingScoreEl.textContent = phishingScore;
    if (currentQuestionEl) currentQuestionEl.textContent = 1;
    
    hideFeedbackPanel();
    enablePhishingButtons();
    if (nextBtnPhishing) nextBtnPhishing.disabled = true;
  }

  function enablePhishingButtons() {
    if (markSafeBtn) markSafeBtn.disabled = false;
    if (markPhishingBtn) markPhishingBtn.disabled = false;
  }

  function disablePhishingButtons() {
    if (markSafeBtn) markSafeBtn.disabled = true;
    if (markPhishingBtn) markPhishingBtn.disabled = true;
  }

  function showFeedbackPanel() {
    if (feedbackPanelPhishing) feedbackPanelPhishing.classList.remove('hidden');
  }

  function hideFeedbackPanel() {
    if (feedbackPanelPhishing) feedbackPanelPhishing.classList.add('hidden');
  }

  // --- Password Fortress Functions ---
  function getCurrentPasswordChallenge() {
    return passwordChallenges[currentPasswordLevel];
  }

  function startPasswordGame() {
    passwordScore = 0;
    passwordAttempt = 1;
    currentPasswordLevel = 0;
    
    if (passwordScoreEl) passwordScoreEl.textContent = passwordScore;
    if (passwordAttemptEl) passwordAttemptEl.textContent = passwordAttempt;
    
    resetPasswordFeedback();
    loadPasswordLevel();
    
    if (passwordInput) passwordInput.value = '';
    if (submitPasswordBtn) submitPasswordBtn.disabled = false;
    if (nextPasswordBtn) nextPasswordBtn.disabled = true;
  }

  function loadPasswordLevel() {
    const challenge = getCurrentPasswordChallenge();
    
    // Update game header
    const gameTitle = document.querySelector('#passwordGame .game-header h2');
    if (gameTitle) {
      gameTitle.textContent = `${challenge.title} - Level ${currentPasswordLevel + 1}`;
    }

    // Add/update level description
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

  function updatePasswordStrength(pw) {
    const challenge = getCurrentPasswordChallenge();
    let score = 0;

    challenge.requirements.forEach(req => {
      if (req.test(pw)) {
        score += req.points;
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

  function resetPasswordFeedback() {
    if (passwordFeedbackPanel) passwordFeedbackPanel.classList.add('hidden');
    if (passwordFeedbackContent) passwordFeedbackContent.innerHTML = '';
  }

  function resetPasswordGame() {
    try {
      localStorage.setItem("latestPasswordScore", passwordScore);
      const currentPasswordBest = parseInt(localStorage.getItem("passwordBestScore")) || 0;
      if (passwordScore > currentPasswordBest) {
        localStorage.setItem("passwordBestScore", passwordScore);
      }

      if (typeof window.cyberDashboard !== 'undefined' && window.cyberDashboard.recordGameSession) {
        window.cyberDashboard.recordGameSession('password', passwordScore);
      }
    } catch (error) {
      console.warn('Could not save password score:', error);
    }

    passwordScore = 0;
    passwordAttempt = 1;
    currentPasswordLevel = 0;
    
    if (passwordScoreEl) passwordScoreEl.textContent = passwordScore;
    if (passwordAttemptEl) passwordAttemptEl.textContent = passwordAttempt;
    
    resetPasswordFeedback();
    
    if (passwordInput) passwordInput.value = '';
    if (submitPasswordBtn) submitPasswordBtn.disabled = false;
    if (nextPasswordBtn) nextPasswordBtn.disabled = true;
    
    updatePasswordStrength('');

    // Remove level description
    const descriptionEl = document.querySelector('.password-level-description');
    if (descriptionEl && descriptionEl.parentNode) {
      descriptionEl.parentNode.removeChild(descriptionEl);
    }
  }

  // --- Network Defense Functions ---
  function startNetworkGame() {
    networkGameTimer = 30;
    networkScore = 0;
    threats = generateThreats(maxThreats);
    
    if (networkScoreEl) networkScoreEl.textContent = networkScore;
    if (threatCountEl) threatCountEl.textContent = threats.length;
    if (networkTimer) networkTimer.textContent = networkGameTimer;
    if (startNetworkGameBtn) startNetworkGameBtn.disabled = true;
    
    renderThreats();
    setupNetworkNodes();
    startNetworkTimer();
  }

  function setupNetworkNodes() {
    nodes.forEach(node => {
      // Clear any existing styles
      node.style.backgroundColor = '';
      
      node.addEventListener("dragover", handleDragOver);
      node.addEventListener("dragleave", handleDragLeave);
      node.addEventListener("drop", handleDrop);
    });
  }

  function handleDragOver(e) {
    e.preventDefault();
    this.classList.add("drag-over");
  }

  function handleDragLeave() {
    this.classList.remove("drag-over");
  }

  function handleDrop(e) {
    e.preventDefault();
    this.classList.remove("drag-over");

    const threatType = e.dataTransfer.getData("type").toLowerCase();
    const threatIndex = parseInt(e.dataTransfer.getData("index"));
    
    if (isNaN(threatIndex) || threatIndex >= threats.length || threatIndex < 0) return;

    const threat = threats[threatIndex];
    const accepted = this.dataset.accept.toLowerCase().split(",").map(s => s.trim());
    
    if (accepted.includes(threatType)) {
      this.style.backgroundColor = "#00ff40";
      showNotification("Success!", `Blocked ${threat.label} successfully!`);
      
      // Remove threat from array
      threats.splice(threatIndex, 1);
      networkScore++;
      
      if (networkScoreEl) networkScoreEl.textContent = networkScore;
      if (threatCountEl) threatCountEl.textContent = threats.length;
      
      renderThreats();
      
      if (threats.length === 0) {
        completeNetworkGame();
      }
    } else {
      this.style.backgroundColor = "#ff0040";
      showNotification("Failed!", `${threat.label} cannot be blocked here!`);
      
      setTimeout(() => {
        this.style.backgroundColor = '';
      }, 1000);
    }
  }

  function startNetworkTimer() {
    intervalId = setInterval(() => {
      networkGameTimer--;
      if (networkTimer) networkTimer.textContent = networkGameTimer;
      
      if (networkGameTimer <= 0) {
        completeNetworkGame();
      }
    }, 1000);
  }

  function completeNetworkGame() {
    clearInterval(intervalId);
    
    const success = threats.length === 0;
    const title = success ? "🛡️ Network Secured!" : "⏰ Time's Up!";
    const message = `Score: ${networkScore}/${maxThreats}`;
    
    showNotification(title, message);
    
    setTimeout(() => {
      hideModal(networkGameModal);
      resetNetworkGame();
    }, 2000);
  }

  function renderThreats() {
    if (!threatItemsEl) return;
    
    threatItemsEl.innerHTML = '';
    threats.forEach((threat, i) => {
      const div = document.createElement('div');
      div.className = "threat-item cyber-panel";
      div.draggable = true;
      div.textContent = `${threat.icon} ${threat.label}`;
      div.dataset.index = i;
      div.dataset.type = threat.type;
      div.title = `Severity: ${threat.severity}`;
      div.style.cursor = 'grab';

      div.addEventListener('dragstart', e => {
        e.dataTransfer.setData('type', threat.type.toLowerCase());
        e.dataTransfer.setData('index', i.toString());
        div.style.cursor = 'grabbing';
      });

      div.addEventListener('dragend', () => {
        div.style.cursor = 'grab';
      });

      threatItemsEl.appendChild(div);
    });
  }

  function generateThreats(count) {
    return threatTypes.slice(0, count).map(threat => ({...threat}));
  }

  function resetNetworkGame() {
    clearInterval(intervalId);
    
    try {
      localStorage.setItem("latestNetworkScore", networkScore);
      const bestNetworkScore = parseInt(localStorage.getItem("networkBestScore")) || 0;
      if (networkScore > bestNetworkScore) {
        localStorage.setItem("networkBestScore", networkScore);
      }

      if (typeof window.cyberDashboard !== 'undefined' && window.cyberDashboard.recordGameSession) {
        window.cyberDashboard.recordGameSession('network', networkScore);
      }
    } catch (error) {
      console.warn('Could not save network score:', error);
    }

    networkGameTimer = 30;
    networkScore = 0;
    threats = [];
    
    nodes.forEach(node => {
      node.style.backgroundColor = '';
      node.classList.remove("drag-over");
    });
    
    if (networkScoreEl) networkScoreEl.textContent = networkScore;
    if (threatCountEl) threatCountEl.textContent = maxThreats;
    if (networkTimer) networkTimer.textContent = networkGameTimer;
    if (threatItemsEl) threatItemsEl.innerHTML = '';
    if (startNetworkGameBtn) startNetworkGameBtn.disabled = false;
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Game launch buttons
    document.querySelectorAll('.game-launch-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const gameCard = btn.closest('.game-card');
        if (!gameCard) return;
        
        const gameType = gameCard.getAttribute('data-game');
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

    // Close buttons for modals
    document.querySelectorAll('.close-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const modalId = btn.getAttribute('data-close');
        const modal = document.getElementById(modalId);
        if (modal) {
          hideModal(modal);
          if (modalId === 'phishingGame') resetPhishingGame();
          if (modalId === 'passwordGame') resetPasswordGame();
          if (modalId === 'networkGame') resetNetworkGame();
        }
      });
    });

    // Phishing game buttons
    if (markSafeBtn) {
      markSafeBtn.addEventListener('click', () => handlePhishingAnswer(false));
    }
    if (markPhishingBtn) {
      markPhishingBtn.addEventListener('click', () => handlePhishingAnswer(true));
    }
    if (nextBtnPhishing) {
      nextBtnPhishing.addEventListener('click', () => {
        phishingIndex++;
        showPhishingQuestion();
      });
    }

    // Password game listeners
    if (passwordInput) {
      passwordInput.addEventListener('input', (e) => {
        updatePasswordStrength(e.target.value);
      });
    }

    if (submitPasswordBtn) {
      submitPasswordBtn.addEventListener('click', () => {
        const pw = passwordInput ? passwordInput.value : '';
        if (pw === '') {
          showNotification("Error", "Please enter a password");
          return;
        }

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
          if (passwordScoreEl) passwordScoreEl.textContent = passwordScore;
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

        if (passwordFeedbackContent) {
          passwordFeedbackContent.innerHTML = msg;
        }
        if (passwordFeedbackPanel) {
          passwordFeedbackPanel.classList.remove('hidden');
        }
        if (submitPasswordBtn) submitPasswordBtn.disabled = true;
        if (nextPasswordBtn) nextPasswordBtn.disabled = false;
      });
    }

    if (nextPasswordBtn) {
      nextPasswordBtn.addEventListener('click', () => {
        if (passwordInput) passwordInput.value = '';
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

          if (passwordFeedbackContent) {
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
          }
          if (submitPasswordBtn) submitPasswordBtn.disabled = true;
          if (nextPasswordBtn) nextPasswordBtn.disabled = true;
          if (passwordAttemptEl) passwordAttemptEl.textContent = maxPasswordAttempts;
          return;
        }

        if (passwordAttemptEl) passwordAttemptEl.textContent = passwordAttempt;
        resetPasswordFeedback();
        loadPasswordLevel();
        if (submitPasswordBtn) submitPasswordBtn.disabled = false;
        if (nextPasswordBtn) nextPasswordBtn.disabled = true;
        updatePasswordStrength('');
      });
    }

    // Network game start button
    if (startNetworkGameBtn) {
      startNetworkGameBtn.addEventListener('click', startNetworkGame);
    }
  }

  // Initialize the application
  function init() {
    setupEventListeners();
    
    // Add CSS animations if not present
    if (!document.querySelector('#cyber-animations')) {
      const style = document.createElement('style');
      style.id = 'cyber-animations';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .drag-over {
          background-color: rgba(0, 255, 65, 0.2) !important;
          border: 2px dashed #00ff41;
        }
      `;
      document.head.appendChild(style);
    }
    
    console.log('🔐 Cyberpunk Security Training Initialized');
  }

  // Start the application
  init();
});