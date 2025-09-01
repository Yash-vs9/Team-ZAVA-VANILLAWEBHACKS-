// Game Data
const gameData = {
    rooms: [
      {
        id: 1,
        name: "File Encryption Challenge",
        description: "Secure sensitive documents by encrypting confidential files",
        files: [
          {"name": "company_payroll.xlsx", "type": "confidential", "icon": "📊"},
          {"name": "meeting_notes.txt", "type": "internal", "icon": "📝"},
          {"name": "press_release.pdf", "type": "public", "icon": "📰"},
          {"name": "employee_ssn.csv", "type": "confidential", "icon": "🔢"},
          {"name": "lunch_menu.pdf", "type": "public", "icon": "🍽️"},
          {"name": "client_contracts.docx", "type": "confidential", "icon": "📄"},
          {"name": "office_map.jpg", "type": "public", "icon": "🗺️"}
        ]
      },
      {
        id: 2,
        name: "USB Malware Detection",
        description: "Identify and quarantine malicious USB devices",
        usbDevices: [
          {
            id: "usb1",
            name: "Marketing USB",
            status: "safe",
            files: ["presentation.pptx", "logo.png", "brochure.pdf"]
          },
          {
            id: "usb2", 
            name: "Unknown USB",
            status: "malicious",
            files: ["setup.exe", "autorun.inf", ".hidden_keylogger.dll"]
          },
          {
            id: "usb3",
            name: "Finance Reports",
            status: "safe", 
            files: ["q3_report.xlsx", "budget.csv", "expenses.pdf"]
          },
          {
            id: "usb4",
            name: "Employee USB",
            status: "malicious",
            files: ["vacation_photos.zip", "trojan.scr", "readme.txt"]
          }
        ]
      },
      {
        id: 3,
        name: "Laptop Screen Lock",
        description: "Secure all unattended laptops before security breach occurs",
        laptops: [
          {"id": "laptop1", "location": "Reception Desk", "locked": false, "user": "Sarah"},
          {"id": "laptop2", "location": "Conference Room", "locked": true, "user": "Mike"},
          {"id": "laptop3", "location": "Break Room", "locked": false, "user": "Jessica"},
          {"id": "laptop4", "location": "Manager Office", "locked": false, "user": "David"},
          {"id": "laptop5", "location": "IT Department", "locked": true, "user": "Alex"}
        ]
      }
    ],
    securityTips: [
      "Always encrypt confidential files containing personal or financial data",
      "Never plug unknown USB devices into company computers",
      "Lock your screen whenever you step away from your desk", 
      "Use Windows+L shortcut for quick screen locking",
      "Set automatic screen lock after 15 minutes of inactivity",
      "Scan USB devices with antivirus before accessing files",
      "Classify data as Public, Internal, or Confidential before sharing"
    ]
  };
  
  // Game State
  let gameState = {
    currentRoom: 1,
    score: 0,
    startTime: null,
    roomStartTime: null,
    completedRooms: [],
    room1: {
      encryptedFiles: [],
      totalConfidentialFiles: 0
    },
    room2: {
      scannedDevices: [],
      correctIdentifications: 0
    },
    room3: {
      lockedLaptops: [],
      timeRemaining: 60,
      timer: null
    }
  };
  
  // Utility Functions
  function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
  }
  
  function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
  
  function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const currentScore = document.getElementById('current-score');
    
    const progress = ((gameState.currentRoom - 1) / 3) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Room ${gameState.currentRoom} of 3`;
    currentScore.textContent = gameState.score;
  }
  
  function updateRoomTitle() {
    const titleElement = document.getElementById('current-room-title');
    const currentRoomData = gameData.rooms[gameState.currentRoom - 1];
    titleElement.textContent = currentRoomData.name;
  }

  function updateScore(points) {
    gameState.score += points;
    
    // ENHANCED LOCALSTORAGE INTEGRATION - Save current progress
    try {
        const currentProgress = {
            score: gameState.score,
            currentRoom: gameState.currentRoom,
            completedRooms: gameState.completedRooms,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('escape_room_progress', JSON.stringify(currentProgress));
        console.log('💾 Escape room progress saved:', currentProgress);
    } catch (error) {
        console.warn('Could not save escape room progress:', error);
    }
    
    updateProgress();
}
  
  // Game Flow Functions
  function startGame() {
    try {
      gameState.startTime = Date.now();
      gameState.roomStartTime = Date.now();
      showScreen('game-screen');
      updateProgress();
      updateRoomTitle();
      initializeRoom1();
      console.log('Game started successfully');
    } catch (error) {
      console.error('Error starting game:', error);
      showNotification('Error starting game. Please refresh and try again.', 'error');
    }
  }
  
  function nextRoom() {
    gameState.completedRooms.push(gameState.currentRoom);
    gameState.currentRoom++;
    gameState.roomStartTime = Date.now();
    
    if (gameState.currentRoom <= 3) {
      updateProgress();
      updateRoomTitle();
      showRoom(gameState.currentRoom);
      
      if (gameState.currentRoom === 2) {
        initializeRoom2();
      } else if (gameState.currentRoom === 3) {
        initializeRoom3();
      }
    } else {
      showVictoryScreen();
    }
  }
  
  function showRoom(roomNumber) {
    document.querySelectorAll('.room').forEach(room => room.classList.remove('active-room'));
    document.getElementById(`room${roomNumber}`).classList.add('active-room');
  }
  
  // Room 1: File Encryption
  function initializeRoom1() {
    const filesContainer = document.getElementById('files-container');
    const roomData = gameData.rooms[0];
    
    gameState.room1.totalConfidentialFiles = roomData.files.filter(file => file.type === 'confidential').length;
    
    filesContainer.innerHTML = '';
    
    roomData.files.forEach((file, index) => {
      const fileElement = createFileElement(file, index);
      filesContainer.appendChild(fileElement);
    });
    
    setupDragAndDrop();
  }
  
  function createFileElement(file, index) {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file-item';
    fileDiv.draggable = true;
    fileDiv.dataset.fileIndex = index;
    fileDiv.dataset.fileType = file.type;
    
    fileDiv.innerHTML = `
      <div class="file-icon">${file.icon}</div>
      <div class="file-name">${file.name}</div>
      <div class="file-type ${file.type}">${file.type}</div>
    `;
    
    return fileDiv;
  }
  
  function setupDragAndDrop() {
    const fileItems = document.querySelectorAll('.file-item');
    const dropZone = document.getElementById('encryption-drop-zone');
    
    fileItems.forEach(item => {
      item.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', item.dataset.fileIndex);
        e.dataTransfer.effectAllowed = 'move';
        item.classList.add('dragging');
      });
      
      item.addEventListener('dragend', function(e) {
        item.classList.remove('dragging');
      });
    });
    
    // Setup drop zone
    dropZone.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragenter', function(e) {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', function(e) {
      if (!dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove('drag-over');
      }
    });
    
    dropZone.addEventListener('drop', function(e) {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      
      const fileIndex = e.dataTransfer.getData('text/plain');
      
      if (fileIndex !== '') {
        handleFileDrop(fileIndex);
      }
    });
  }
  
  function handleFileDrop(fileIndex) {
    const fileElement = document.querySelector(`[data-file-index="${fileIndex}"]`);
    if (!fileElement) return;
    
    const fileType = fileElement.dataset.fileType;
    const file = gameData.rooms[0].files[fileIndex];
    
    if (fileType === 'confidential') {
      // Correct - encrypt the file
      if (!gameState.room1.encryptedFiles.includes(fileIndex)) {
        gameState.room1.encryptedFiles.push(fileIndex);
        fileElement.style.display = 'none';
        gameState.score += 100;
        
        showNotification(`✅ Encrypted: ${file.name}`, 'success');
        updateEncryptionProgress();
        
        if (gameState.room1.encryptedFiles.length === gameState.room1.totalConfidentialFiles) {
          setTimeout(() => {
            showNotification('🎉 All confidential files encrypted! Proceeding to next room...', 'success');
            gameState.score += 200; // Bonus for completion
            setTimeout(nextRoom, 2000);
          }, 1000);
        }
      }
    } else {
      // Incorrect - show error
      showNotification(`❌ Error: ${file.name} is ${fileType} and doesn't need encryption!`, 'error');
      fileElement.classList.add('shake');
      setTimeout(() => fileElement.classList.remove('shake'), 500);
      gameState.score = Math.max(0, gameState.score - 25);
    }
    
    updateProgress();
  }
  
  function updateEncryptionProgress() {
    const progressBar = document.getElementById('encryption-progress-fill');
    const statusText = document.getElementById('encryption-status');
    
    const progress = (gameState.room1.encryptedFiles.length / gameState.room1.totalConfidentialFiles) * 100;
    progressBar.style.width = `${progress}%`;
    statusText.textContent = `${gameState.room1.encryptedFiles.length}/${gameState.room1.totalConfidentialFiles} confidential files encrypted`;
  }
  
  // Room 2: USB Detection
  function initializeRoom2() {
    const usbContainer = document.getElementById('usb-devices-container');
    const roomData = gameData.rooms[1];
    
    usbContainer.innerHTML = '';
    
    roomData.usbDevices.forEach(device => {
      const usbElement = createUSBElement(device);
      usbContainer.appendChild(usbElement);
    });
  }
  
  function createUSBElement(device) {
    const usbDiv = document.createElement('div');
    usbDiv.className = 'usb-device';
    usbDiv.dataset.usbId = device.id;
    usbDiv.dataset.status = device.status;
    
    const filesHtml = device.files.map(file => {
      const isSuspicious = file.includes('.exe') || file.includes('autorun') || file.includes('.dll') || file.includes('.scr') || file.startsWith('.');
      return `<div class="file-item-small ${isSuspicious ? 'suspicious' : ''}">${file}</div>`;
    }).join('');
    
    usbDiv.innerHTML = `
      <div class="usb-header">
        <div class="usb-icon">💾</div>
        <div class="usb-name">${device.name}</div>
      </div>
      <div class="usb-files">
        <h4>Files found:</h4>
        <div class="file-list">${filesHtml}</div>
      </div>
      <button class="btn btn--primary scan-button" onclick="scanUSB('${device.id}')">
        🔍 Scan Device
      </button>
    `;
    
    return usbDiv;
  }
  
  function scanUSB(usbId) {
    const usbElement = document.querySelector(`[data-usb-id="${usbId}"]`);
    const device = gameData.rooms[1].usbDevices.find(d => d.id === usbId);
    const scanResults = document.getElementById('scan-results-list');
    
    if (!usbElement || !device) return;
    
    usbElement.classList.add('scanned');
    const scanButton = usbElement.querySelector('.scan-button');
    scanButton.disabled = true;
    scanButton.textContent = '⏳ Scanning...';
    
    setTimeout(() => {
      gameState.room2.scannedDevices.push(usbId);
      
      if (device.status === 'malicious') {
        usbElement.classList.add('malicious');
        scanButton.textContent = '⚠️ THREAT DETECTED';
        
        const resultDiv = document.createElement('div');
        resultDiv.className = 'scan-result threat';
        resultDiv.innerHTML = `
          <span class="threat-icon">🚨</span>
          <div>
            <strong>${device.name}:</strong> Malware detected! Device quarantined.
          </div>
        `;
        scanResults.appendChild(resultDiv);
        
        showNotification(`🚨 Threat detected in ${device.name}!`, 'error');
        gameState.score += 150;
        gameState.room2.correctIdentifications++;
      } else {
        usbElement.classList.add('safe');
        scanButton.textContent = '✅ SAFE';
        
        const resultDiv = document.createElement('div');
        resultDiv.className = 'scan-result safe';
        resultDiv.innerHTML = `
          <span class="threat-icon">✅</span>
          <div>
            <strong>${device.name}:</strong> No threats detected. Safe to use.
          </div>
        `;
        scanResults.appendChild(resultDiv);
        
        showNotification(`✅ ${device.name} is safe to use`, 'success');
        gameState.score += 100;
        gameState.room2.correctIdentifications++;
      }
      
      if (gameState.room2.scannedDevices.length === gameData.rooms[1].usbDevices.length) {
        setTimeout(() => {
          showNotification('🎉 All USB devices scanned! Proceeding to final room...', 'success');
          gameState.score += 250; // Bonus for completion
          setTimeout(nextRoom, 2000);
        }, 1000);
      }
      
      updateProgress();
    }, 2000);
  }
  
  // Room 3: Laptop Security
  function initializeRoom3() {
    const laptopsContainer = document.getElementById('laptops-container');
    const roomData = gameData.rooms[2];
    
    laptopsContainer.innerHTML = '';
    
    roomData.laptops.forEach(laptop => {
      const laptopElement = createLaptopElement(laptop);
      laptopsContainer.appendChild(laptopElement);
    });
    
    startSecurityTimer();
  }
  
  function createLaptopElement(laptop) {
    const laptopDiv = document.createElement('div');
    laptopDiv.className = `laptop-station ${laptop.locked ? 'locked' : 'unlocked'}`;
    laptopDiv.dataset.laptopId = laptop.id;
    laptopDiv.dataset.locked = laptop.locked;
    
    if (!laptop.locked) {
      laptopDiv.onclick = () => lockLaptop(laptop.id);
    }
    
    laptopDiv.innerHTML = `
      <div class="laptop-icon">${laptop.locked ? '🔒' : '💻'}</div>
      <div class="laptop-location">${laptop.location}</div>
      <div class="laptop-user">User: ${laptop.user}</div>
      <div class="laptop-status ${laptop.locked ? 'locked' : 'unlocked'}">
        ${laptop.locked ? '🔒 Secured' : '⚠️ Unlocked'}
      </div>
    `;
    
    return laptopDiv;
  }
  
  function lockLaptop(laptopId) {
    const laptopElement = document.querySelector(`[data-laptop-id="${laptopId}"]`);
    const laptop = gameData.rooms[2].laptops.find(l => l.id === laptopId);
    
    if (!laptop || laptop.locked) return;
    
    laptop.locked = true;
    gameState.room3.lockedLaptops.push(laptopId);
    
    laptopElement.dataset.locked = 'true';
    laptopElement.classList.remove('unlocked');
    laptopElement.classList.add('locked');
    laptopElement.onclick = null;
    
    laptopElement.querySelector('.laptop-icon').textContent = '🔒';
    laptopElement.querySelector('.laptop-status').textContent = '🔒 Secured';
    laptopElement.querySelector('.laptop-status').className = 'laptop-status locked';
    
    showNotification(`🔒 Secured ${laptop.location} laptop`, 'success');
    gameState.score += 120;
    
    const unlockedLaptops = gameData.rooms[2].laptops.filter(l => !l.locked);
    if (unlockedLaptops.length === 0) {
      if (gameState.room3.timer) {
        clearInterval(gameState.room3.timer);
      }
      setTimeout(() => {
        showNotification('🎉 All laptops secured! Office is safe!', 'success');
        gameState.score += 300; // Bonus for completion
        setTimeout(nextRoom, 2000);
      }, 1000);
    }
    
    updateProgress();
  }
  
  function startSecurityTimer() {
    const timerDisplay = document.getElementById('security-timer');
    gameState.room3.timeRemaining = 60;
    
    if (gameState.room3.timer) {
      clearInterval(gameState.room3.timer);
    }
    
    gameState.room3.timer = setInterval(() => {
      gameState.room3.timeRemaining--;
      timerDisplay.textContent = gameState.room3.timeRemaining;
      
      if (gameState.room3.timeRemaining <= 0) {
        clearInterval(gameState.room3.timer);
        showNotification('⏰ Time\'s up! Security breach occurred!', 'error');
        gameState.score = Math.max(0, gameState.score - 200);
        setTimeout(nextRoom, 2000);
      }
    }, 1000);
  }
  
  // Victory Screen
  function showVictoryScreen() {
    const totalTime = Date.now() - gameState.startTime;
    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);
    
    try {
        const escapeStats = {
            score: gameState.score,
            completed: true,
            completedRooms: gameState.completedRooms.length,
            timestamp: new Date().toISOString(),
            totalTime: totalTime,
            finalRoom: gameState.currentRoom
        };
        
        localStorage.setItem('escape_room_progress', JSON.stringify(escapeStats));
        console.log('💾 Escape room completion saved:', escapeStats);
    } catch (error) {
        console.warn('Could not save escape room completion:', error);
    }

    showScreen('victory-screen');
    
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('total-time').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    const accuracy = Math.round((gameState.score / 1000) * 100);
    document.getElementById('accuracy-rate').textContent = `${Math.min(100, accuracy)}%`;
    
    displaySecurityTips();
  }

  function showGameOver() {
    try {
        const escapeStats = {
            score: gameState.score,
            completed: false,
            completedRooms: gameState.completedRooms.length,
            timestamp: new Date().toISOString(),
            totalTime: (Date.now() - gameState.startTime) / 1000,
            failedRoom: gameState.currentRoom
        };
        
        localStorage.setItem('escape_room_progress', JSON.stringify(escapeStats));
        console.log('💾 Escape room game over saved:', escapeStats);
    } catch (error) {
        console.warn('Could not save game over data:', error);
    }

    document.getElementById('game-over-score').textContent = gameState.score;
    document.getElementById('rooms-completed').textContent = gameState.completedRooms.length;

    showScreen('game-over-screen');
}

  
  function displaySecurityTips() {
    const tipsList = document.getElementById('security-tips-list');
    tipsList.innerHTML = '';
    
    gameData.securityTips.forEach(tip => {
      const tipDiv = document.createElement('div');
      tipDiv.className = 'tip-item';
      tipDiv.innerHTML = `💡 ${tip}`;
      tipsList.appendChild(tipDiv);
    });
  }
  
  // Control Functions
  function restartGame() {
    // Clear any existing timers
    if (gameState.room3.timer) {
      clearInterval(gameState.room3.timer);
    }
    
    gameState = {
      currentRoom: 1,
      score: 0,
      startTime: null,
      roomStartTime: null,
      completedRooms: [],
      room1: {
        encryptedFiles: [],
        totalConfidentialFiles: 0
      },
      room2: {
        scannedDevices: [],
        correctIdentifications: 0
      },
      room3: {
        lockedLaptops: [],
        timeRemaining: 60,
        timer: null
      }
    };
    
    // Reset room data
    gameData.rooms[2].laptops.forEach(laptop => {
      if (laptop.id === 'laptop1' || laptop.id === 'laptop3' || laptop.id === 'laptop4') {
        laptop.locked = false;
      }
    });
    
    startGame();
  }
  
  function showWelcome() {
    showScreen('welcome-screen');
  }
  
  // Make functions globally available
  window.startGame = startGame;
  window.scanUSB = scanUSB;
  window.lockLaptop = lockLaptop;
  window.restartGame = restartGame;
  window.showWelcome = showWelcome;
  
  // Initialize game when page loads
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');
    showScreen('welcome-screen');
  });