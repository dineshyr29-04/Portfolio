import React from 'react';
import './Hero.css';
import SocialLinks from './SocialLinks';
import avatar from '../assets/DA (1).png';

export default function Hero() {
  const handleViewWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-component" aria-label="Hero section">
      <div className="hero-inner">
        <div className="hero-left-main">
          <h1 className="hero-name" aria-label="Dinesh A">
            Dinesh A
          </h1>
          <h2 className="hero-profession" aria-label="Full-Stack Developer and AI/ML Engineer">
            Full-Stack Developer & AI/ML Engineer
          </h2>
          <p className="hero-bio hero-bio-long">
            Welcome! I build robust, scalable, and modern web applications and AI/ML systems. My focus is on clean code, great user experience, and delivering real-world impact. Explore my work and see how I turn ideas into reality.
          </p>
          <div className="hero-ctas">
            <a className="btn-cta" href="#projects" aria-label="View my work">
              View My Work
            </a>
            <SocialLinks />
          </div>
        </div>
        <div className="hero-avatar-wrap">
          <img src={avatar} alt="Dinesh A avatar" className="hero-avatar" />
        </div>
      </div>
    </section>
  );
}
