import React, { useEffect, useRef } from 'react';
import './Hero.css';

export default function ParticleBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let w = (canvas.width = canvas.clientWidth * devicePixelRatio);
    let h = (canvas.height = canvas.clientHeight * devicePixelRatio);

    const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const count = Math.floor((canvas.clientWidth * canvas.clientHeight) / 7000);

    for (let i = 0; i < Math.max(30, count); i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 0.5 + Math.random() * 1.8,
      });
    }

    let raf = 0;
    let mouseX = w / 2;
    let mouseY = h / 2;

    const onMove = (e: MouseEvent) => {
      mouseX = (e.clientX * devicePixelRatio) || mouseX;
      mouseY = (e.clientY * devicePixelRatio) || mouseY;
    };

    window.addEventListener('mousemove', onMove);

    function render() {
      ctx.clearRect(0, 0, w, h);
      // subtle gradient
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, 'rgba(10,12,22,0.75)');
      g.addColorStop(1, 'rgba(18,18,30,0.75)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // attraction to mouse for subtle parallax
        const dx = (mouseX - p.x) * 0.0008;
        const dy = (mouseY - p.y) * 0.0008;
        p.vx += dx;
        p.vy += dy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = 'rgba(124, 58, 237, 0.9)';
        ctx.shadowColor = 'rgba(124, 58, 237, 0.8)';
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(render);
    }

    render();

    const onResize = () => {
      w = canvas.width = canvas.clientWidth * devicePixelRatio;
      h = canvas.height = canvas.clientHeight * devicePixelRatio;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className="hero-particles" aria-hidden />;
}
