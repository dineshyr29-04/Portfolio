import { useEffect } from 'react';

/** Content stays visible if observers or animations are unavailable. */
export default function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const element = entry.target as HTMLElement;
          element.dataset.revealed = 'true';
          if (motion.matches || !element.animate) return;
          const animation = element.animate(
            [
              { opacity: 0, transform: 'translateY(20px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            {
              duration: 650,
              delay: Number(element.dataset.revealDelay || 0),
              easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)',
              fill: 'backwards',
            }
          );
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        });
      },
      { threshold: 0.12 }
    );
    document
      .querySelectorAll<HTMLElement>('[data-reveal]')
      .forEach(element => observer.observe(element));
    const cancelMotion = () => {
      if (motion.matches) {
        animations.forEach(animation => animation.cancel());
        animations.clear();
      }
    };
    motion.addEventListener('change', cancelMotion);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      motion.removeEventListener('change', cancelMotion);
    };
  }, []);
}
