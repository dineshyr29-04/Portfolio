import { useEffect, useState } from 'react';
import './Hero.css';

const ROLES = ['AI', 'ML', 'LLM', 'MLOps', 'Production Systems'];

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIdx(i => (i + 1) % ROLES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    const win = window as unknown as {
      lenis?: {
        scrollTo: (
          target: HTMLElement | number,
          options?: { offset?: number }
        ) => void;
      };
    };
    if (win.lenis && el) {
      win.lenis.scrollTo(el, { offset: -72 });
    } else {
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="hero-left" aria-label="Hero introduction">
      {/* Status Badge */}
      <div className="hero-badge" aria-label="Status">
        <span className="hero-badge-dot" />
        Open to Web development roles
      </div>

      {/* Large Name */}
      <h1 className="hero-name">
        <span className="hero-name-first">DINESH</span>
        <span className="hero-name-last">A</span>
      </h1>

      {/* Animated Role Tags */}
      <div className="hero-role" aria-label="Specializations">
        <span className="hero-role-prefix">// </span>
        {ROLES.map((role, i) => (
          <span key={role} className={`hero-role-tag ${i === roleIdx ? 'active' : ''}`}>
            {role}
            {i < ROLES.length - 1 && (
              <span className="hero-role-sep"> · </span>
            )}
          </span>
        ))}
      </div>

      {/* Bio */}
      <p className="hero-bio">
        I design and deploy production Full-Stack and Web systems —
        <br />
        from model architecture to inference pipelines and a clean UI —
        <br />
        with a focus on reliability, efficiency, and real-world impact.
      </p>

      {/* CTA Buttons */}
      <div className="hero-ctas">
        <button
          className="btn-glass btn-glow"
          onClick={() => scrollTo('projects')}
          type="button"
        >
          View My Work →
        </button>
        <a
          href="https://www.linkedin.com/in/dinesh-a-122983374/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-glass btn-outline"
        >
          LinkedIn ↗
        </a>
      </div>
    </div>
  );
}
