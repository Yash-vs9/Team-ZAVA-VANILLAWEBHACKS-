
  window.addEventListener("load", () => {
    // --- Loader and Main Content Logic ---
    setTimeout(() => {
      document.getElementById("loader").style.display = "none";
      document.getElementById("main-content").style.display = "block";

      // Show panels one by one
      const panels = document.querySelectorAll(".panel");
      panels.forEach((panel, index) => {
        setTimeout(() => {
          panel.classList.add("show");
        }, index * 500); // stagger effect
      });
    }, 1000); // Loader stays for 2s

    // Redirect after 7s
    setTimeout(() => {
      window.location.href = "../html/glitch.html"; // check path
    }, 4000);
  });

  // --- Landing Page Code Animation ---
  const container = document.getElementById("code-container");
  const linesCount = 60;
  const lineHeight = 22;
  const scrollDurationSeconds = 2;
  const totalScrollDistance = window.innerHeight + lineHeight;
  const scrollSpeedPerSecond = totalScrollDistance / scrollDurationSeconds;

  const keywords = [
    "async","await","function","var","let","const","if","else","while","for","return",
    "try","catch","throw","import","export","from","class","constructor","super","extends",
    "console.log","Math.random","document.getElementById","setTimeout","setInterval",
    "clearTimeout","clearInterval","JSON.stringify","JSON.parse","window.addEventListener",
    "eval","fetch","then","catch",
  ];
  const symbols = [
    "{","}","(",")","[","]",";",".",",","=","+","-","*","/","<",">","%",";",":","'","\"",
    "&&","||","!=","==","===","=>",
  ];

  // Popup logic
  const popup = document.getElementById("popup-overlay");
  setTimeout(() => {
    popup.style.display = "flex";
  }, 5000);
  popup.addEventListener("click", () => {
    popup.style.display = "none";
  });

  function randomChar() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }

  function randomToken() {
    let r = Math.random();
    if (r < 0.15) return keywords[Math.floor(Math.random() * keywords.length)];
    if (r < 0.3) return symbols[Math.floor(Math.random() * symbols.length)];
    if (r < 0.6) {
      let len = 3 + Math.floor(Math.random() * 6);
      let str = "";
      for (let i = 0; i < len; i++) str += randomChar();
      if (Math.random() < 0.3) str += Math.random() < 0.5 ? "()" : "[]";
      return str;
    }
    return "";
  }

  function generateLine() {
    const approxChars = Math.floor(window.innerWidth / 10);
    let line = "";
    while (line.length < approxChars) {
      let token = randomToken();
      if (line.length + token.length + 1 > approxChars) break;
      line += token + " ";
    }
    return line.trim();
  }

  // Generate scrolling code lines
  const lines = [];
  for (let i = 0; i < linesCount; i++) {
    const lineDiv = document.createElement("div");
    lineDiv.classList.add("code-line");
    if (i % 3 === 0) lineDiv.classList.add("green-glow");
    lineDiv.textContent = generateLine();
    lineDiv.style.top = -(i * lineHeight) + "px";
    container.appendChild(lineDiv);
    lines.push({ el: lineDiv, y: -(i * lineHeight), speed: scrollSpeedPerSecond });
  }

  // Animate lines
  function animate() {
    lines.forEach((lineObj) => {
      lineObj.y += lineObj.speed / 60;
      if (lineObj.y > window.innerHeight) {
        lineObj.y = -lineHeight;
        lineObj.el.textContent = generateLine();
      }
      lineObj.el.style.top = lineObj.y + "px";
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
