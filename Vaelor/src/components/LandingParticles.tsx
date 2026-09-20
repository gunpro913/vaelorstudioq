import { useEffect } from 'react';

const TARGETS: { selector: string; intensity: number; spacing: number }[] = [
  { selector: '#top > section:first-of-type', intensity: 1, spacing: 0 },
  { selector: '#ai-approach', intensity: 0.45, spacing: 6 },
  { selector: '#pause', intensity: 0.35, spacing: 8 },
];

function attach(section: HTMLElement, intensity: number, extraSpacing: number) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.className = 'landing-particles';
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.pointerEvents = 'none';
  section.prepend(canvas);

  const context = canvas.getContext('2d');
  if (!context) {
    canvas.remove();
    return () => {};
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: -9999, y: -9999, active: false };
  let points: { x: number; y: number }[] = [];
  let width = 0;
  let height = 0;
  let frame = 0;

  const resize = () => {
    const rect = section.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const baseSpacing = width < 640 ? 30 : 34;
    const spacing = baseSpacing + extraSpacing;
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;
    points = [];

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        points.push({ x: col * spacing, y: row * spacing });
      }
    }
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);

    for (const point of points) {
      const dx = point.x - pointer.x;
      const dy = point.y - pointer.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = pointer.active ? Math.max(0, 1 - distance / 150) * intensity : 0;
      const offset = influence * 7;
      const angle = Math.atan2(dy, dx);
      const x = point.x + Math.cos(angle) * offset;
      const y = point.y + Math.sin(angle) * offset;
      const radius = (0.8 + influence * 1.15) * (0.7 + intensity * 0.3);
      const alpha = (0.12 + influence * 0.48) * (0.5 + intensity * 0.5);

      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(160, 235, 232, ${alpha})`;
      context.fill();
    }

    if (!reduceMotion) frame = window.requestAnimationFrame(draw);
  };

  const updatePointer = (clientX: number, clientY: number) => {
    const rect = section.getBoundingClientRect();
    pointer.x = clientX - rect.left;
    pointer.y = clientY - rect.top;
    pointer.active = pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height;
  };

  const onPointerMove = (event: PointerEvent) => updatePointer(event.clientX, event.clientY);
  const onPointerLeave = () => {
    pointer.active = false;
  };
  const onTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];
    if (touch) updatePointer(touch.clientX, touch.clientY);
  };
  const onTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0];
    if (touch) updatePointer(touch.clientX, touch.clientY);
  };
  const onTouchEnd = () => {
    pointer.active = false;
  };

  resize();
  draw();
  if (getComputedStyle(section).position === 'static') {
    section.style.position = 'relative';
  }
  window.addEventListener('resize', resize, { passive: true });
  section.addEventListener('pointermove', onPointerMove, { passive: true });
  section.addEventListener('pointerleave', onPointerLeave, { passive: true });
  section.addEventListener('touchstart', onTouchStart, { passive: true });
  section.addEventListener('touchmove', onTouchMove, { passive: true });
  section.addEventListener('touchend', onTouchEnd, { passive: true });

  return () => {
    window.cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    section.removeEventListener('pointermove', onPointerMove);
    section.removeEventListener('pointerleave', onPointerLeave);
    section.removeEventListener('touchstart', onTouchStart);
    section.removeEventListener('touchmove', onTouchMove);
    section.removeEventListener('touchend', onTouchEnd);
    canvas.remove();
  };
}

export default function LandingParticles() {
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    for (const target of TARGETS) {
      const section = document.querySelector<HTMLElement>(target.selector);
      if (section) cleanups.push(attach(section, target.intensity, target.spacing));
    }
    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
