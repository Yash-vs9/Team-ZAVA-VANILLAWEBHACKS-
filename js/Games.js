const track = document.querySelector('.slider-track');
const cards = Array.from(track.children);
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');

let currentIndex = 0;

function updateSlider() {
  const cardWidth = cards[0].getBoundingClientRect().width + 32; // 32px gap from your CSS flex gap
  track.style.transform = `translateX(${-cardWidth * currentIndex}px)`;
}

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    updateSlider();
  }
});

// Optional: resize listener to adjust slider transform on window resize
window.addEventListener('resize', updateSlider);

// Initialize slider position
updateSlider();
