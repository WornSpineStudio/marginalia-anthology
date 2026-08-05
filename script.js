const entrance = document.querySelector('.entrance');
const target = document.querySelector('#marginalia');
const enterButtons = [
  document.querySelector('#enterLibrary'),
  document.querySelector('#scrollCue')
];

const returningToBooks = window.location.hash === '#books';
let siteEntered = returningToBooks;

function blockScroll(event) {
  if (!siteEntered) event.preventDefault();
}

function blockScrollKeys(event) {
  if (siteEntered) return;
  const blocked = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];
  if (blocked.includes(event.key)) event.preventDefault();
}

function releaseScrollLock() {
  siteEntered = true;
  document.body.style.overflow = '';
  window.removeEventListener('wheel', blockScroll);
  window.removeEventListener('touchmove', blockScroll);
  window.removeEventListener('keydown', blockScrollKeys);
}

if (returningToBooks) {
  releaseScrollLock();
  requestAnimationFrame(() => document.querySelector('#books')?.scrollIntoView({ block: 'start' }));
} else {
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';
  window.addEventListener('wheel', blockScroll, { passive: false });
  window.addEventListener('touchmove', blockScroll, { passive: false });
  window.addEventListener('keydown', blockScrollKeys, { passive: false });
}

window.addEventListener('pageshow', event => {
  if (event.persisted || window.location.hash === '#books') {
    releaseScrollLock();
    requestAnimationFrame(() => document.querySelector('#books')?.scrollIntoView({ block: 'start' }));
  }
});

function enterLibrary() {
  if (siteEntered) return;
  siteEntered = true;
  entrance?.classList.add('leaving');
  releaseScrollLock();

  window.setTimeout(() => {
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 390);

  window.setTimeout(() => {
    entrance?.classList.remove('leaving');
  }, 1250);
}

enterButtons.forEach(button => button?.addEventListener('click', enterLibrary));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointer = window.matchMedia('(pointer: coarse)');
const mobileViewport = window.matchMedia('(max-width: 900px)');
const pointer = {
  targetX: 0,
  targetY: 0,
  currentX: 0,
  currentY: 0
};

function setPointerTarget(event) {
  if (coarsePointer.matches || mobileViewport.matches) return;
  pointer.targetX = (event.clientX / window.innerWidth - 0.5) * 2;
  pointer.targetY = (event.clientY / window.innerHeight - 0.5) * 2;
}

function resetPointerTarget() {
  pointer.targetX = 0;
  pointer.targetY = 0;
}

window.addEventListener('pointermove', setPointerTarget, { passive: true });
document.documentElement.addEventListener('mouseleave', resetPointerTarget);
window.addEventListener('blur', resetPointerTarget);

function animateParallax() {
  if (entrance && !prefersReducedMotion.matches && !coarsePointer.matches && !mobileViewport.matches) {
    pointer.currentX += (pointer.targetX - pointer.currentX) * 0.035;
    pointer.currentY += (pointer.targetY - pointer.currentY) * 0.035;

    const bgX = pointer.currentX * -22;
    const bgY = pointer.currentY * -14;
    const contentX = pointer.currentX * 9;
    const contentY = pointer.currentY * 6;

    entrance.style.setProperty('--bg-x', `${bgX}px`);
    entrance.style.setProperty('--bg-y', `${bgY}px`);
    entrance.style.setProperty('--content-x', `${contentX}px`);
    entrance.style.setProperty('--content-y', `${contentY}px`);
  } else if (entrance) {
    entrance.style.setProperty('--bg-x', '0px');
    entrance.style.setProperty('--bg-y', '0px');
    entrance.style.setProperty('--content-x', '0px');
    entrance.style.setProperty('--content-y', '0px');
  }

  requestAnimationFrame(animateParallax);
}

animateParallax();

const canvas = document.querySelector('#dust');
const ctx = canvas?.getContext('2d', { alpha: true });
let particles = [];
let dustWidth = 0;
let dustHeight = 0;
let dpr = 1;
let dustAnimationId = null;

function makeParticle(randomY = true) {
  const large = Math.random() < 0.16;
  return {
    x: Math.random() * dustWidth,
    y: randomY ? Math.random() * dustHeight : dustHeight + Math.random() * 40,
    r: large ? Math.random() * 2.1 + 1.15 : Math.random() * 1.05 + 0.22,
    vx: (Math.random() - 0.5) * (large ? 0.12 : 0.075),
    vy: -(Math.random() * (large ? 0.18 : 0.11) + 0.025),
    alpha: large ? Math.random() * 0.34 + 0.18 : Math.random() * 0.28 + 0.08,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.018 + 0.006,
    warm: Math.random()
  };
}

function resizeDust() {
  if (!canvas || !ctx) return;
  const isMobile = mobileViewport.matches || coarsePointer.matches;
  dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 2);
  dustWidth = window.innerWidth;
  dustHeight = window.innerHeight;

  canvas.width = Math.floor(dustWidth * dpr);
  canvas.height = Math.floor(dustHeight * dpr);
  canvas.style.width = `${dustWidth}px`;
  canvas.style.height = `${dustHeight}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const desktopCount = Math.min(240, Math.max(145, Math.floor((dustWidth * dustHeight) / 7500)));
  const mobileCount = Math.min(85, Math.max(48, Math.floor((dustWidth * dustHeight) / 11500)));
  const count = isMobile ? mobileCount : desktopCount;
  particles = Array.from({ length: count }, () => makeParticle(true));
}

function drawDust() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, dustWidth, dustHeight);

  for (const p of particles) {
    p.pulse += p.pulseSpeed;
    p.x += p.vx + pointer.currentX * 0.018;
    p.y += p.vy;

    if (p.y < -12 || p.x < -20 || p.x > dustWidth + 20) {
      Object.assign(p, makeParticle(false));
    }

    const shimmer = 0.76 + Math.sin(p.pulse) * 0.24;
    const alpha = p.alpha * shimmer;

    if (p.r > 1.2) {
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4.2);
      glow.addColorStop(0, `rgba(239, 180, 132, ${alpha})`);
      glow.addColorStop(.26, `rgba(205, 127, 84, ${alpha * .55})`);
      glow.addColorStop(1, 'rgba(170, 93, 59, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const red = p.warm > .45 ? 224 : 198;
      const green = p.warm > .45 ? 157 : 132;
      const blue = p.warm > .45 ? 112 : 91;
      ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  dustAnimationId = requestAnimationFrame(drawDust);
}

function handleVisibilityChange() {
  if (!canvas || !ctx) return;
  if (document.hidden) {
    if (dustAnimationId) cancelAnimationFrame(dustAnimationId);
    dustAnimationId = null;
    return;
  }

  if (!dustAnimationId) drawDust();
}

if (canvas && ctx) {
  window.addEventListener('resize', resizeDust, { passive: true });
  mobileViewport.addEventListener?.('change', resizeDust);
  coarsePointer.addEventListener?.('change', resizeDust);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  resizeDust();
  drawDust();
}
