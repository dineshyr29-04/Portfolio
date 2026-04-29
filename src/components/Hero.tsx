import React from 'react';
import Shuffle from '../Shuffle';
import './Hero.css';
import TypewriterText from './TypewriterText';
import SocialLinks from './SocialLinks';
import ParticleBackground from './ParticleBackground';
import avatar from '../assets/DA (1).png';

export default function Hero() {
  const handleViewWork = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="hero-component">
      <ParticleBackground />
      <div className="hero-inner">
        <div className="hero-left-main">
          <span className="hero-badge">✦ Open to Web development roles</span>
          <h1 className="hero-name" aria-label="DINESH A">
            <Shuffle tag="span" text="DINESH" duration={0.65} stagger={0.03} immediate />{' '}
            <span className="spana">
              <Shuffle tag="span" text="A" duration={0.72} stagger={0.03} immediate />
            </span>
          </h1>

          <div className="hero-role-typed" aria-live="polite">
            <TypewriterText
              phrases={[
                'Full-Stack Developer',
                'Problem Solver',
                'Tech Enthusiast',
                'AI / ML Engineer',
              ]}
            />
          </div>

          <p className="hero-bio">I design and deploy production Full-Stack and Web systems — from model architecture to inference pipelines and a clean UI.</p>

          <div className="hero-ctas">
            <button className="btn-cta" onClick={handleViewWork} aria-label="View my work">View My Work</button>
            <SocialLinks />
          </div>
        </div>

        <div className="hero-avatar-wrap">
          <div className="avatar-glow" aria-hidden="true" />
          <img src={avatar} alt="Dinesh A avatar" className="hero-avatar" />
        </div>
      </div>
    </div>
  );
}
