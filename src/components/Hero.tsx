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
    <section className="hero-component" aria-label="Hero section">
      <ParticleBackground />
      <div className="hero-inner">
        <div className="hero-left-main">
          <span className="hero-badge">✦ Portfolio of</span>
          <h1 className="hero-name" aria-label="Dinesh A">
            Dinesh A
          </h1>
          <h2 className="hero-profession" aria-label="Full-Stack Developer and AI/ML Engineer">
            Full-Stack Developer & AI/ML Engineer
          </h2>
          <p className="hero-bio hero-bio-long">
            Welcome to my portfolio! I am passionate about building robust, scalable, and visually stunning web applications. With a strong foundation in both frontend and backend technologies, I specialize in creating seamless digital experiences and production-grade AI/ML systems. My expertise spans modern JavaScript frameworks, cloud infrastructure, and machine learning pipelines.<br /><br />
            I thrive on solving complex problems, architecting efficient solutions, and continuously learning new technologies. Explore my work below to see how I blend creativity, engineering, and innovation to deliver impactful results.
          </p>
          <div className="hero-ctas">
            <button
              className="btn-cta"
              onClick={handleViewWork}
              aria-label="View my work"
            >
              View My Work
            </button>
            <SocialLinks />
          </div>
        </div>
        <div className="hero-avatar-wrap">
          <div className="avatar-glow" aria-hidden="true" />
          <img src={avatar} alt="Dinesh A avatar" className="hero-avatar" />
        </div>
      </div>
    </section>
  );
}
