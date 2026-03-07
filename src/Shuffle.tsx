import React, { useEffect, useRef, useMemo } from 'react';
import type { ElementType } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once at module level — safe to call multiple times
gsap.registerPlugin(ScrollTrigger);

type ShuffleProps = {
  text: string;
  tag?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  stagger?: number;
  ease?: string;
  triggerOnce?: boolean;
  triggerOnHover?: boolean;
  /** Pass true for above-the-fold elements (e.g. hero) that don't need scroll trigger */
  immediate?: boolean;
};

/** Split a string into char tokens, handling newlines */
function tokenise(text: string) {
  const tokens: { ch: string; idx: number }[] = [];
  let idx = 0;
  for (const ch of text) {
    tokens.push({ ch, idx: idx++ });
  }
  return tokens;
}

const Shuffle: React.FC<ShuffleProps> = ({
  text,
  tag = 'p',
  className = '',
  style,
  duration = 0.55,
  stagger = 0.025,
  ease = 'power3.out',
  triggerOnce = true,
  triggerOnHover = true,
  immediate = false,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const hoverFn = useRef<(() => void) | null>(null);

  // Chars rendered as React elements — React owns the DOM, GSAP just animates
  const tokens = useMemo(() => tokenise(text), [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const spans = Array.from(el.querySelectorAll<HTMLElement>('.shf-c'));
    if (!spans.length) return;

    // Set hidden starting state
    gsap.set(spans, { y: 20, opacity: 0, force3D: true });

    const play = () => {
      tlRef.current?.kill();
      tlRef.current = gsap.timeline().to(spans, {
        y: 0,
        opacity: 1,
        duration,
        ease,
        stagger: { each: stagger, from: 'start' },
        force3D: true,
        clearProps: 'transform',
      });
    };

    if (immediate) {
      // Hero: play after first paint
      const id = window.setTimeout(play, 80);
      return () => window.clearTimeout(id);
    }

    // Check if already in viewport at mount — fire immediately if so
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight * 0.9;

    if (alreadyVisible) {
      const id = window.setTimeout(play, 80);
      // Still wire hover retrigger
      if (triggerOnHover) {
        hoverFn.current = play;
        el.addEventListener('mouseenter', hoverFn.current);
      }
      return () => {
        window.clearTimeout(id);
        tlRef.current?.kill();
        if (hoverFn.current) el.removeEventListener('mouseenter', hoverFn.current);
      };
    }

    // Element is off-screen — use ScrollTrigger
    stRef.current = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: triggerOnce,
      onEnter: play,
    });

    if (triggerOnHover) {
      hoverFn.current = play;
      el.addEventListener('mouseenter', hoverFn.current);
    }

    return () => {
      stRef.current?.kill();
      tlRef.current?.kill();
      if (hoverFn.current) el.removeEventListener('mouseenter', hoverFn.current);
    };
  // Re-run when these props change
  }, [text, duration, stagger, ease, triggerOnce, triggerOnHover, immediate]);

  const Tag = tag as any;
  return (
    <Tag
      ref={(n: any) => { containerRef.current = n; }}
      className={`shf-parent ${className}`}
      style={style}
      aria-label={text}
    >
      {tokens.map(({ ch, idx }) =>
        ch === '\n' ? (
          <br key={idx} />
        ) : ch === ' ' ? (
          <span key={idx} className="shf-sp" aria-hidden="true">&nbsp;</span>
        ) : (
          <span key={idx} className="shf-c" aria-hidden="true">{ch}</span>
        )
      )}
    </Tag>
  );
};

export default Shuffle;
