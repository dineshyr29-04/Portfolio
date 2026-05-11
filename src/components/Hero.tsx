import React from 'react';
import './Hero.css';
import SocialLinks from './SocialLinks';
import avatar from '../assets/DA (1).png';

const STATS = [
  { label: 'Projects', value: '6+' },
  { label: 'Experience', value: '2+yrs' },
  { label: 'Focus', value: 'Full-Stack' },
];

const SKILLS = [
  'React',
  'TypeScript',
  'Node.js',
  'Python',
  'AI/ML',
  'PostgreSQL',
];

export default function Hero() {
  return (
    <section className="" aria-label="Hero section">
      <h1 className="hero-title"> I'm Dinesh A</h1>
    </section>
  );
}
