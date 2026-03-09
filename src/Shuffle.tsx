import React, { useRef, useMemo } from 'react';
import type { ElementType } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once at module level — safe to call multiple times
gsap.registerPlugin(ScrollTrigger, useGSAP);

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

  // Chars rendered as React elements — React owns the DOM, GSAP just animates
  const tokens = useMemo(() => tokenise(text), [text]);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const spans = gsap.utils.toArray<HTMLElement>('.shf-c', el);
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
        // Hero: play after first paint via GSAP's own scheduler
        gsap.delayedCall(0.08, play);
        if (triggerOnHover) {
          el.addEventListener('mouseenter', play);
          return () => el.removeEventListener('mouseenter', play);
        }
        return;
      }

      // Check if already in viewport at mount — fire immediately if so
      const rect = el.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight * 0.9;

      if (alreadyVisible) {
        gsap.delayedCall(0.08, play);
      } else {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: triggerOnce,
          onEnter: play,
        });
      }

      if (triggerOnHover) {
        el.addEventListener('mouseenter', play);
        return () => el.removeEventListener('mouseenter', play);
      }
    },
    {
      scope: containerRef,
      dependencies: [text, duration, stagger, ease, triggerOnce, triggerOnHover, immediate],
    }
  );

  const Tag = tag as ElementType;
  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLElement>}
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
