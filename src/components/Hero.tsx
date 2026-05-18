import './Hero.css';
import SocialLinks from './SocialLinks';

const STATS = [
  { label: 'Projects', value: '10+' },
  { label: 'Experience', value: '1  +yrs' },
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
    <section className="hero-component" aria-label="Hero section">
      <div className="hero-background-pattern" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-left-main">
          <h1 className="hero-name">Dinesh A</h1>
          <h2 className="hero-profession">
            Full-Stack Developer & AI/ML Engineer
          </h2>

          {/* Stats */}
          <div className="hero-stats">
            {STATS.map((stat, idx) => (
              <div key={idx} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Skills Pills */}
          <div className="hero-skills">
            {SKILLS.map((skill, idx) => (
              <span key={idx} className="skill-pill">
                {skill}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hero-ctas">
            <a className="btn-cta btn-primary" href="#projects">
              View My Work
            </a>
            <a className="btn-cta btn-secondary" href="#contact">
              Get In Touch
            </a>
          </div>

          {/* Social Links */}
          <div className="hero-socials">
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
