const track   = document.getElementById('track');
const cards   = track.querySelectorAll('.card');
const prev    = document.getElementById('prev');
const next    = document.getElementById('next');

let current = 0;

function perView() {
  if (window.innerWidth <= 560) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function goTo(idx) {
  const max = cards.length - perView();
  current = Math.max(0, Math.min(idx, max));

  const cardWidth = cards[0].offsetWidth + 20;
  track.style.transform = `translateX(-${current * cardWidth}px)`;

  prev.disabled = current === 0;
  next.disabled = current >= max;
}

prev.addEventListener('click', () => goTo(current - 1));
next.addEventListener('click', () => goTo(current + 1));
window.addEventListener('resize', () => goTo(current));

goTo(0);
