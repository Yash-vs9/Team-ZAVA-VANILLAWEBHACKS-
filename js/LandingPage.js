window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const mainContent = document.getElementById("main-content");
  const panels = document.querySelectorAll(".panel");
  const container = document.getElementById("code-container");
  const blank = document.getElementById("blank-screen");

  const overlay = document.querySelector(".glitch-overlay");
  const noise = document.querySelector(".noise");
  const scan = document.querySelector(".scan-lines");
  const rgb = document.querySelector(".rgb-split");

  // --- Step 1: Loader (1s) ---
  setTimeout(() => {
    loader.style.display = "none";
    mainContent.style.display = "block";

    // Panels appear staggered
    panels.forEach((panel, index) => {
      setTimeout(() => panel.classList.add("show"), index * 400);
    });

    // --- Step 2: Code + Panels run for 5s, then glitch ---
    setTimeout(() => startGlitchTransition(), 5000);

  }, 1000);

  // --- Code Rain ---
  const linesCount = 60;
  const lineHeight = 22;

  const keywords = ["async","await","function","var","let","const","if","else","while","for","return",
    "try","catch","throw","import","export","from","class","constructor","super","extends",
    "console.log","Math.random","document.getElementById","setTimeout","setInterval",
    "clearTimeout","clearInterval","JSON.stringify","JSON.parse","window.addEventListener",
    "eval","fetch","then","catch"];
  const symbols = ["{","}","(",")","[","]",";",".",",","=","+","-","*","/","<",">","%",";",":","'","\"","&&","||","!=","==","===","=>"];

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
      if (!token) token = randomChar();
      if (line.length + token.length + 1 <= approxChars) line += token + " ";
      else break;
    }
    return line.trim().padEnd(approxChars, " ");
  }

  let currentLine = 0;
  function addLine() {
    if (currentLine >= linesCount) return;
    const lineDiv = document.createElement("div");
    lineDiv.classList.add("code-line");
    if (currentLine % 3 === 0) lineDiv.classList.add("green-glow");

    lineDiv.textContent = generateLine();
    lineDiv.style.position = "absolute";
    lineDiv.style.top = currentLine * lineHeight + "px";
    lineDiv.style.left = "0";
    lineDiv.style.width = "100%";

    container.appendChild(lineDiv);
    currentLine++;
  }

  const lineInterval = setInterval(() => {
    addLine();
    if (currentLine >= linesCount) clearInterval(lineInterval);
  }, 120);

  // --- Step 3: Smooth transition to glitch ---
  function startGlitchTransition() {
    // Fade out panels + code
    mainContent.style.transition = "opacity 1s";
    mainContent.style.opacity = "0";

    setTimeout(() => {
      mainContent.style.display = "none";
      triggerGlitchSequence();
    }, 1000); // wait for fade out
  }

  // --- Glitch Sequence ---
  function triggerGlitchSequence() {
    overlay.style.display = "block";
    noise.style.display = "block";
    scan.style.display = "block";
    rgb.style.display = "block";

    let glitchInterval = setInterval(createGlitchBlock, 200);

    setTimeout(() => {
      clearInterval(glitchInterval);

      overlay.style.display = "none";
      noise.style.display = "none";
      scan.style.display = "none";
      rgb.style.display = "none";

      blank.style.display = "block";

      // --- Step 4: Redirect ---
      setTimeout(() => {
        window.location.href = "../html/home.html";
      }, 1500);
    }, 2000); // glitch duration
  }

  // --- Random Glitch Block ---
  function createGlitchBlock() {
    const block = document.createElement("div");
    block.className = "glitch-block";
    block.style.height = Math.random() * 50 + 10 + "px";
    block.style.width = Math.random() * 200 + 50 + "px";
    block.style.top = Math.random() * window.innerHeight + "px";
    block.style.left = Math.random() * window.innerWidth + "px";
    block.style.background = "rgba(255,255,255,0.1)";
    block.style.position = "absolute";

    overlay.appendChild(block);
    setTimeout(() => block.remove(), 500);
  }
});
