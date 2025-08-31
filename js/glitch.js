
      // Create random glitch blocks
      function createGlitchBlock() {
        const block = document.createElement("div");
        block.className = "glitch-block";

        const height = Math.random() * 50 + 10;
        const top = Math.random() * (window.innerHeight - height);
        const width = Math.random() * 200 + 50;

        block.style.height = height + "px";
        block.style.width = width + "px";
        block.style.top = top + "px";
        block.style.left = "-" + width + "px";

        // Random color
        const colors = [
          "rgba(255, 0, 64, 0.8)",
          "rgba(0, 255, 255, 0.8)",
          "rgba(255, 255, 0, 0.8)",
        ];
        block.style.background =
          colors[Math.floor(Math.random() * colors.length)];

        document.body.appendChild(block);

        setTimeout(() => {
          if (block.parentNode) {
            block.parentNode.removeChild(block);
          }
        }, 1000);
      }

      // Start glitch effects
      let glitchInterval = setInterval(createGlitchBlock, 200);

      // STEP 1 → Run glitch for 1 second
      setTimeout(() => {
        clearInterval(glitchInterval); // stop glitch
        document.querySelector(".glitch-overlay").style.display = "none";
        document.querySelector(".noise").style.display = "none";
        document.querySelector(".scan-lines").style.display = "none";
        document.querySelector(".rgb-split").style.display = "none";

        // STEP 2 → Show blank screen
        document.getElementById("blank-screen").style.display = "block";
      }, 1000);

      // STEP 3 → Redirect after 2 seconds total
      setTimeout(() => {
        window.location.href = "./home.html"; // <-- change to your home page path
      }, 2000);
   
      (function () {
        function c() {
          var b = a.contentDocument || a.contentWindow.document;
          if (b) {
            var d = b.createElement("script");
            d.innerHTML =
              "window.__CF$cv$params={r:'977adcc8d392b29f',t:'MTc1NjYyNTg0NS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
            b.getElementsByTagName("head")[0].appendChild(d);
          }
        }
        if (document.body) {
          var a = document.createElement("iframe");
          a.height = 1;
          a.width = 1;
          a.style.position = "absolute";
          a.style.top = 0;
          a.style.left = 0;
          a.style.border = "none";
          a.style.visibility = "hidden";
          document.body.appendChild(a);
          if ("loading" !== document.readyState) c();
          else if (window.addEventListener)
            document.addEventListener("DOMContentLoaded", c);
          else {
            var e = document.onreadystatechange || function () {};
            document.onreadystatechange = function (b) {
              e(b);
              "loading" !== document.readyState &&
                ((document.onreadystatechange = e), c());
            };
          }
        }
      })();
   