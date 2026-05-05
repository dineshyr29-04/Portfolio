import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type Props = { phrases: string[]; period?: number };

export default function TypewriterText({ phrases, period = 2500 }: Props) {
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let mounted = true;
    let t: number;
    const current = phrases[idx % phrases.length];

    if (typing) {
      t = window.setInterval(() => {
        setSub(s => {
          const next = current.slice(0, s.length + 1);
          if (next === s) return s;
          if (!mounted) return next;
          if (next === current) {
            setTyping(false);
            clearInterval(t);
            window.setTimeout(() => setTyping(false), 0);
          }
          return next;
        });
      }, 70);
    } else {
      t = window.setTimeout(() => {
        // pause then start deleting
        const del = window.setInterval(() => {
          setSub(s => {
            if (s.length === 0) {
              clearInterval(del);
              setIdx(i => i + 1);
              setTyping(true);
              return '';
            }
            return s.slice(0, -1);
          });
        }, 40);
      }, period);
    }

    return () => {
      mounted = false;
      clearInterval(t);
    };
  }, [idx, typing, phrases, period]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <span className="typewrap">{sub}</span>
      <span className="type-cursor" aria-hidden>
        █
      </span>
    </motion.span>
  );
}
