(() => {
  const plates = Array.from(document.querySelectorAll('.tale-plate'));
  if (!plates.length) return;

  const supportsHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!supportsHover || reduceMotion) return;

  plates.forEach((plate) => {
    let frame = 0;

    const update = (event) => {
      const rect = plate.getBoundingClientRect();
      const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
      const y = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
      const nx = x / rect.width;
      const ny = y / rect.height;

      const tiltY = (nx - 0.5) * 3.2;
      const tiltX = (0.5 - ny) * 3.2;
      const shiftX = (0.5 - nx) * 10;
      const shiftY = (0.5 - ny) * 10;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        plate.style.setProperty('--spot-x', `${(nx * 100).toFixed(2)}%`);
        plate.style.setProperty('--spot-y', `${(ny * 100).toFixed(2)}%`);
        plate.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
        plate.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
        plate.style.setProperty('--shift-x', `${shiftX.toFixed(2)}px`);
        plate.style.setProperty('--shift-y', `${shiftY.toFixed(2)}px`);
        plate.classList.add('is-pointer-active');
      });
    };

    const reset = () => {
      cancelAnimationFrame(frame);
      plate.classList.remove('is-pointer-active');
      plate.style.setProperty('--spot-x', '50%');
      plate.style.setProperty('--spot-y', '50%');
      plate.style.setProperty('--tilt-x', '0deg');
      plate.style.setProperty('--tilt-y', '0deg');
      plate.style.setProperty('--shift-x', '0px');
      plate.style.setProperty('--shift-y', '0px');
    };

    plate.addEventListener('pointermove', update);
    plate.addEventListener('pointerleave', reset);
  });
})();
