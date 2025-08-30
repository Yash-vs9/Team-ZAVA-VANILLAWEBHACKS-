// Glowing stars background for hero section
const canvas = document.getElementById('stars-bg');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.querySelector('.hero').offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const STAR_COUNT = 64;
let stars = [];

function createStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.9;
    const radius = 0.6 + Math.random() * 2.5;
    const glow = 4 + Math.random() * 10;
    const color = Math.random() < 0.25
      ? 'rgba(98,54,255,0.70)'
      : (Math.random() < 0.5 ? 'rgba(162,89,236,0.62)' : 'rgba(255,255,255,0.55)');
    stars.push({ x, y, radius, glow, color });
  }
}
createStars();
window.addEventListener('resize', () => { createStars(); drawStars(); });

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const star of stars) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI, false);
    ctx.shadowColor = star.color;
    ctx.shadowBlur = star.glow;
    ctx.fillStyle = star.color;
    ctx.fill();
    ctx.restore();
  }
}

function animate() {
  drawStars();
  requestAnimationFrame(animate);
}
animate();
