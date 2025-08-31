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
      
      const passwordRequirements = [
        {text: "Minimum 8 characters", test: pw => pw.length >= 8, points: 1},
        {text: "Contains uppercase letter", test: pw => /[A-Z]/.test(pw), points: 1},
        {text: "Contains lowercase letter", test: pw => /[a-z]/.test(pw), points: 1},
        {text: "Contains number", test: pw => /\d/.test(pw), points: 1},
        {text: "Contains special character", test: pw => /[^A-Za-z0-9]/.test(pw), points: 1},
        {text: "Minimum 12 characters (Bonus)", test: pw => pw.length >= 12, points: 2},
      ];
      
      const commonPasswords = [
        "password", "123456", "123456789", "qwerty", "abc123", "password1"
      ];
      
      let passwordScore = 0;
      let passwordAttempt = 1;
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
        if(networkScore>bestNetworkScore){
            localStorage.setItem("bestNetworkScore",networkScore)
        }
        localStorage.setItem("latestNetworkGame",networkScore)
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
      function startPhishingGame() {
        phishingIndex = 0;
        phishingScore = 0;
        phishingScoreEl.textContent = phishingScore;
        showPhishingQuestion();
        feedbackPanelPhishing.classList.add('hidden');
        markSafeBtn.disabled = false;
        markPhishingBtn.disabled = false;
      }
      
      function showPhishingQuestion() {
        if (phishingIndex >= phishingEmails.length) {
          emailSenderEl.textContent = '';
          emailSubjectEl.textContent = '';
          emailBodyEl.textContent = '';
          feedbackPanelPhishing.classList.remove('hidden');
          feedbackContentPhishing.innerHTML = `<h3>Training Complete!</h3>
            <p>Your final score: <strong style="color:#00ffff">${phishingScore}</strong> out of ${phishingEmails.length}</p>`;
          markSafeBtn.disabled = true;
          markPhishingBtn.disabled = true;
          nextBtnPhishing.disabled = true;
          return;
        }
        const email = phishingEmails[phishingIndex];
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
        phishingIndex = 0;
        phishingScore = 0;
        phishingScoreEl.textContent = phishingScore;
        currentQuestionEl.textContent = 1;
        feedbackPanelPhishing.classList.add('hidden');
        markSafeBtn.disabled = false;
        markPhishingBtn.disabled = false;
        nextBtnPhishing.disabled = true;
      }
      
      // --- Password Fortress Functions ---
      
      function startPasswordGame() {
        passwordScore = 0;
        passwordAttempt = 1;
        passwordScoreEl.textContent = passwordScore;
        passwordAttemptEl.textContent = passwordAttempt;
        resetPasswordFeedback();
        updatePasswordStrength('');
        renderPasswordRequirements('');
        passwordInput.value = '';
        submitPasswordBtn.disabled = false;
        nextPasswordBtn.disabled = true;
      }
      
      function resetPasswordFeedback() {
        passwordFeedbackPanel.classList.add('hidden');
        passwordFeedbackContent.textContent = '';
      }
      
      function updatePasswordStrength(pw) {
        let score = 0, passed = [];
        passwordRequirements.forEach(req => {
          if (req.test(pw)) {
            score += req.points;
            passed.push(req.text);
          }
        });
        const maxScore = passwordRequirements.reduce((a,b) => a+b.points,0);
        const percent = (score / maxScore) * 100;
        strengthBar.style.width = percent + '%';
      
        let label = "Very Weak";
        if (percent > 80) label = "Excellent";
        else if (percent > 60) label = "Strong";
        else if (percent > 40) label = "Medium";
        else if (percent > 20) label = "Weak";
      
        strengthLabel.textContent = label;
      
        renderPasswordRequirements(pw);
      
        return score;
      }
      
      function renderPasswordRequirements(pw) {
        requirementListEl.innerHTML = '';
        passwordRequirements.forEach(req => {
          const met = req.test(pw);
          const el = document.createElement('div');
          el.textContent = req.text;
          el.style.color = met ? '#00ffbc' : '#ff0040';
          requirementListEl.appendChild(el);
        });
      }
      
      passwordInput.addEventListener('input', (e) => {
        updatePasswordStrength(e.target.value);
      });
      
      submitPasswordBtn.addEventListener('click', () => {
        const pw = passwordInput.value;
        if (pw === '') return alert('Please enter a password');
        const score = updatePasswordStrength(pw);
        let msg = '';
        if (score >= 5) { // You can adjust threshold
          msg = `<span style="color:#00ff40;">Great Password!</span> Keep it safe!`;
          passwordScore++;
          passwordScoreEl.textContent = passwordScore;
        } else {
          msg = `<span style="color:#ff0040;">Password too weak.</span> Try to meet all requirements.`;
        }
        passwordFeedbackContent.innerHTML = msg;
        passwordFeedbackPanel.classList.remove('hidden');
        submitPasswordBtn.disabled = true;
        nextPasswordBtn.disabled = false;
      });
      
      nextPasswordBtn.addEventListener('click', () => {
        passwordInput.value = '';
        passwordAttempt++;
        if (passwordAttempt > maxPasswordAttempts) {
          passwordFeedbackContent.innerHTML = `<h3>Challenge Complete!</h3>
            <p>Your score: <strong style="color:#00ffff">${passwordScore}</strong> / ${maxPasswordAttempts}</p>`;
          submitPasswordBtn.disabled = true;
          nextPasswordBtn.disabled = true;
          passwordAttemptEl.textContent = maxPasswordAttempts;
          return;
        }
        passwordAttemptEl.textContent = passwordAttempt;
        resetPasswordFeedback();
        submitPasswordBtn.disabled = false;
        nextPasswordBtn.disabled = true;
        updatePasswordStrength('');
      });
      
      function resetPasswordGame() {
        passwordScore = 0;
        passwordAttempt = 1;
        passwordScoreEl.textContent = passwordScore;
        passwordAttemptEl.textContent = passwordAttempt;
        resetPasswordFeedback();
        passwordInput.value = '';
        submitPasswordBtn.disabled = false;
        nextPasswordBtn.disabled = true;
        updatePasswordStrength('');
      }
  });
  