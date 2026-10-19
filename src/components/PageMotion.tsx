import { useEffect, useRef } from 'react';
import './PageMotion.css';

export default function PageMotion() {
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const sections = [
      ...document.querySelectorAll<HTMLElement>('main section[id]'),
    ];
    const links = [
      ...document.querySelectorAll<HTMLAnchorElement>(
        '.navigation a[href^="#"]'
      ),
    ];
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const distance = root.scrollHeight - root.clientHeight;
      const progress =
        distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${progress})`;
      let current = '';
      sections.forEach(section => {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.35)
          current = section.id;
      });
      links.forEach(link => {
        if (link.hash === `#${current}`)
          link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const resize =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(schedule)
        : null;
    resize?.observe(document.body);
    schedule();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      resize?.disconnect();
      links.forEach(link => link.removeAttribute('aria-current'));
    };
  }, []);
  return (
    <div ref={progressRef} className="reading-progress" aria-hidden="true" />
  );
}
