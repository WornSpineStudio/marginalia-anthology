const galleryButtons = Array.from(document.querySelectorAll('.gallery-open'));
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const closeButton = document.querySelector('.lightbox-close');
const previousButton = document.querySelector('.lightbox-prev');
const nextButton = document.querySelector('.lightbox-next');

let activeIndex = 0;
let lastFocusedElement = null;

function showImage(index) {
  if (!galleryButtons.length || !lightbox || !lightboxImage) return;

  activeIndex = (index + galleryButtons.length) % galleryButtons.length;
  const button = galleryButtons[activeIndex];
  const image = button.querySelector('img');

  lightboxImage.src = button.dataset.full || image.src;
  lightboxImage.alt = image.alt;
}

function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  showImage(index);
  lightbox.hidden = false;
  document.body.classList.add('lightbox-open');
  closeButton.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove('lightbox-open');
  lightboxImage.src = '';
  if (lastFocusedElement) lastFocusedElement.focus();
}

galleryButtons.forEach((button, index) => {
  button.addEventListener('click', () => openLightbox(index));
});

closeButton?.addEventListener('click', closeLightbox);
previousButton?.addEventListener('click', () => showImage(activeIndex - 1));
nextButton?.addEventListener('click', () => showImage(activeIndex + 1));

lightbox?.addEventListener('click', event => {
  if (event.target === lightbox || event.target.classList.contains('lightbox-backdrop')) {
    closeLightbox();
  }
});

document.addEventListener('keydown', event => {
  if (!lightbox || lightbox.hidden) return;

  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showImage(activeIndex - 1);
  if (event.key === 'ArrowRight') showImage(activeIndex + 1);
});
