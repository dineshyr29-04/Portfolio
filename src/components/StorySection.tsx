import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './StorySection.css';

type Props = {
  index: number;
  title?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function StorySection({ index, title, className = '', children }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref as any} className={`story-section ${className}`} aria-labelledby={`story-${index}-title`}>
      <div className="story-meta">
        <div className="story-badge">{String(index + 1).padStart(2, '0')}</div>
        {title && (
          <div className="story-title-wrap">
            <h3 id={`story-${index}-title`} className="story-title">{title}</h3>
          </div>
        )}
      </div>

      <motion.div
        className="story-body"
        initial={{ opacity: 0, y: 18 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}
