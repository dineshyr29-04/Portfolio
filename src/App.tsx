import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import projectPhoto from './assets/DA (1).png';
import { Mail, ExternalLink, Menu, X, ArrowRight, Download } from 'lucide-react';
import './App.css';

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.11.77-.25.77-.55 0-.27-.01-1-.02-1.95-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.27-1.7-1.27-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.25 3.33.96.1-.75.4-1.25.72-1.54-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.52-1.47.11-3.06 0 0 .96-.31 3.14 1.18a10.9 10.9 0 0 1 2.86-.39c.97 0 1.95.13 2.86.39 2.17-1.49 3.13-1.18 3.13-1.18.63 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.43-2.71 5.4-5.29 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.77-.01 3.15 0 .3.2.66.78.55C20.71 21.39 24 17.08 24 12c0-6.35-5.15-11.5-12-11.5z" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.99 1.98 1.99 1.1 0 1.98-.89 1.98-1.99C6.96 4.38 6.08 3.5 4.98 3.5zM3.5 8.98h3v11.52h-3V8.98zM9.5 8.98h2.87v1.57h.04c.4-.76 1.38-1.57 2.84-1.57 3.04 0 3.6 2.01 3.6 4.62v6.9h-3v-6.11c0-1.46-.03-3.34-2.03-3.34-2.03 0-2.34 1.58-2.34 3.22v6.23h-3V8.98z" />
  </svg>
);

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const SKILLS = [
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'GSAP'],
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express.js', 'Python', 'REST APIs', 'Redis'],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'MongoDB', 'MySQL'],
  },
  {
    category: 'Systems & Tools',
    items: ['C', 'C++', 'Linux', 'Git', 'Docker', 'Vercel'],
  },
];

const PROJECTS = [
  {
    category: 'AI · Healthcare',
    title: 'Drug Secure',
    description:
      'AI-powered quality control and standardization system for Ayurvedic drug validation. Integrates E-Tongue electrochemical sensor inputs and K-Means clustering for batch validation.',
    stack: ['React', 'GSAP', 'Unsupervised ML', 'Data Science'],
    repoUrl: 'https://github.com/dineshyr29-04/drug-secure',
    liveUrl: 'https://drug-secure.vercel.app',
    metric: 'Unsupervised ML · E-Tongue Sensors',
  },
  {
    category: 'Hackathon Platform',
    title: 'HackArena',
    description:
      'Co-founded and engineered HackArena — a premium hackathon evaluation and management ecosystem with real-time tracking, team matchmaking, and automated scoring.',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    repoUrl: 'https://github.com/dineshyr29-04/Sankalp',
    liveUrl: 'https://project-sankalp.dev',
    metric: '500+ Participants · 48h Live',
  },
  {
    category: 'SaaS · Cloud',
    title: 'ThinkNode Customer Portal',
    description:
      'Co-founded and engineered the customer portal for the ThinkNode cloud platform, enabling automated SaaS workflows and high-speed data analytics dashboards.',
    stack: ['JavaScript', 'HTML', 'CSS', 'Node.js'],
    repoUrl: 'https://github.com/dineshyr29-04?tab=repositories&q=thinknode',
    liveUrl: 'https://thinknode-customers.vercel.app/',
    metric: '10k+ Active Users · 99.9% Uptime',
  },
  {
    category: 'Automation · AI',
    title: 'Openloop Automation',
    description:
      'A scalable automation engine for AI pipeline orchestration. Leverages event-driven architecture to manage long-running repetitive tasks efficiently.',
    stack: ['JavaScript', 'TypeScript', 'Python', 'YAML'],
    repoUrl: 'https://github.com/dineshyr29-04/Openloop',
    liveUrl: '',
    metric: '89% Accuracy · 5x Efficiency Gain',
  },
  {
    category: 'AgTech · IoT',
    title: 'AgroNova',
    description:
      'Smart agriculture platform integrating IoT sensor data for predictive crop analytics. Empowers farmers with real-time soil and climate insights.',
    stack: ['JavaScript', 'Python', 'MongoDB', 'SQL'],
    repoUrl: 'https://github.com/dineshyr29-04?tab=repositories&q=agro+nova',
    liveUrl: '',
    metric: '15% Yield Increase · Real-time',
  },
  {
    category: 'MedTech · AI',
    title: 'CardioNerve Analytics',
    description:
      'Co-founded and architected CardioNerve — an AI-driven cardiovascular analytics platform processing PPG sensor telemetry to compute predictive cardiac health scores.',
    stack: ['Python', 'JavaScript', 'Jupyter', 'PyTorch'],
    repoUrl: 'https://github.com/dineshyr29-04?tab=repositories&q=cardio+nerve',
    liveUrl: '',
    metric: '97.5% Precision · Clinical Grade',
  },
];

const EXPERIENCE = [
  {
    period: '2025 — Present',
    company: 'CardioNerve',
    role: 'Co-Founder & Systems Architect',
    description:
      'Co-founded an AI-driven cardiovascular intelligence platform analyzing real-time HRV data from PPG sensors to generate predictive risk scores. Designed clinical dashboards and deployed production LLM pipelines.',
    tags: ['Express.js', 'PyTorch', 'Python', 'Node.js'],
  },
  {
    period: '2024 — Present',
    company: 'HackArena',
    role: 'Co-Founder & Lead Developer',
    description:
      'Co-founded and engineered HackArena, a next-generation hackathon management engine supporting 500+ active participants, automated judging algorithms, and real-time team collaboration metrics.',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
  },
  {
    period: '2024 — Present',
    company: 'ThinkNode',
    role: 'Co-Founder & Full-Stack Architect',
    description:
      'Co-founded ThinkNode, building enterprise cloud customer portals and SaaS interfaces. Managed multi-tenant architectures, AI model deployment pipelines, and high-performance serverless dashboards.',
    tags: ['Node.js', 'Next.js', 'MongoDB', 'Redis'],
  },
];

/* ─────────────────────────────────────────────
   NAV LINKS
───────────────────────────────────────────── */
const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

/* ─────────────────────────────────────────────
   APP
───────────────────────────────────────────── */
export default function App() {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sent'>('idle');

  // Section observer + scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const secs = document.querySelectorAll<HTMLElement>('section[id]');
      let cur = '';
      secs.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 200) cur = s.id;
      });
      setActiveSection(cur);
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('.rv');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px 40px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.pageYOffset - offset,
        behavior: 'smooth',
      });
    }
    setMenuOpen(false);
  };

  const handleSend = () => {
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) return;
    const href = `mailto:dineshyr2904@gmail.com?subject=Portfolio Message from ${encodeURIComponent(contactForm.name)}&body=${encodeURIComponent(contactForm.message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(contactForm.name)} (${encodeURIComponent(contactForm.email)})`;
    window.open(href);
    setFormStatus('sent');
  };

  return (
    <>
      <Analytics />

      {/* Dot grid backdrop */}
      <div className="dot-grid" />

      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="navbar__logo"
          >
            <img src={projectPhoto} alt="Dinesh A" className="navbar__avatar" />
            <div>
              <span className="navbar__name">Dinesh A</span>
              <span className="navbar__subtitle">Full-Stack · AI/ML</span>
            </div>
          </a>

          {/* Desktop links */}
          <ul className="navbar__links">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => { e.preventDefault(); scrollTo(id); }}
                  className={`navbar__link ${activeSection === id ? 'navbar__link--active' : ''}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Available badge */}
          <span className="available-badge hidden-mobile">
            <span className="badge-dot" />
            Available for work
          </span>

          {/* Mobile hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu">
            {NAV_LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => { e.preventDefault(); scrollTo(id); }}
                className="mobile-menu__link"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="hero">
        <div className="container hero__inner">
          <div className="hero__text rv">
            <span className="chip">Open to opportunities · Bangalore, India</span>
            <h1 className="hero__name">
              Dinesh A
            </h1>
            <p className="hero__tagline">
              Co-Founder of <strong>CardioNerve</strong>, <strong>HackArena</strong> &amp; <strong>ThinkNode</strong>.<br />
              I design and ship production-grade AI systems and full-stack web applications.
            </p>
            <div className="hero__actions">
              <button className="btn-primary" onClick={() => scrollTo('projects')}>
                View Projects <ArrowRight size={14} />
              </button>
              <a
                href="https://www.linkedin.com/in/dinesha291204/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <LinkedinIcon size={14} /> LinkedIn
              </a>
            </div>

            {/* Quick stat row */}
            <div className="hero__stats">
              {[
                { value: '3+', label: 'Startups Co-founded' },
                { value: '7+', label: 'Projects Shipped' },
                { value: '500+', label: 'Users Impacted' },
              ].map((s) => (
                <div key={s.label} className="stat">
                  <span className="stat__value">{s.value}</span>
                  <span className="stat__label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero photo card */}
          <div className="hero__card rv">
            <img src={projectPhoto} alt="Dinesh A" className="hero__photo" />
            <div className="hero__card-body">
              <p className="hero__card-name">Dinesh A</p>
              <p className="hero__card-role">AI/ML · Full-Stack Engineer</p>
              <div className="hero__card-links">
                <a href="https://github.com/dineshyr29-04" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <GithubIcon size={16} />
                </a>
                <a href="https://www.linkedin.com/in/dinesha291204/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <LinkedinIcon size={16} />
                </a>
                <a href="mailto:dineshyr2904@gmail.com" aria-label="Email">
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="section section--alt">
        <div className="container">
          <div className="section-header rv">
            <span className="section-label">About</span>
            <h2 className="section-title">Who I am</h2>
          </div>

          <div className="about__grid">
            <div className="rv">
              <p className="about__text">
                I'm Dinesh A — a systems thinker and full-stack engineer based in Bangalore, India. I focus on building
                clean, well-architected applications that solve real problems. My interests span AI/ML pipelines,
                operating systems internals, and high-performance web interfaces.
              </p>
              <p className="about__text" style={{ marginTop: '1rem' }}>
                When I'm not writing Node.js handlers or tuning transformer models, I study OS process states,
                memory segmentation, and contribute to open-source tooling.
              </p>

              <div className="about__info">
                {[
                  { label: 'Location', value: 'Bangalore, India' },
                  { label: 'Email', value: 'dineshyr2904@gmail.com' },
                  { label: 'GitHub', value: 'github.com/dineshyr29-04' },
                  { label: 'Status', value: 'Available for opportunities' },
                ].map((i) => (
                  <div key={i.label} className="about__info-row">
                    <span className="about__info-label">{i.label}</span>
                    <span className="about__info-value">{i.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="about__extras rv">
              {[
                { icon: '🏆', title: 'Hackathon Organizer', desc: 'Organized large-scale hackathons with 500+ participants, building the entire event platform from scratch.' },
                { icon: '📖', title: 'Research Focus', desc: 'Actively studying transformer architectures, attention mechanisms, and publishing findings on ML system design.' },
                { icon: '🌐', title: 'Open Source', desc: 'Contributing to open-source ML tools and building developer utilities used by the community.' },
                { icon: '🎤', title: 'Tech Talks', desc: 'Presenting on AI/ML topics at college events and mentoring junior developers in web and ML engineering.' },
              ].map((item, i) => (
                <div key={i} className="extra-card">
                  <span className="extra-card__icon">{item.icon}</span>
                  <div>
                    <h4 className="extra-card__title">{item.title}</h4>
                    <p className="extra-card__desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="section">
        <div className="container">
          <div className="section-header rv">
            <span className="section-label">Skills</span>
            <h2 className="section-title">Technical Expertise</h2>
            <p className="section-desc">Technologies I use to design and build production systems.</p>
          </div>

          <div className="skills__grid">
            {SKILLS.map((group) => (
              <div key={group.category} className="skill-group rv">
                <h3 className="skill-group__title">{group.category}</h3>
                <div className="skill-group__tags">
                  {group.items.map((item) => (
                    <span key={item} className="skill-tag">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="section section--alt">
        <div className="container">
          <div className="section-header rv">
            <span className="section-label">Projects</span>
            <h2 className="section-title">Selected Work</h2>
            <p className="section-desc">A selection of projects I've built and co-founded.</p>
          </div>

          <div className="projects__grid">
            {PROJECTS.map((p) => (
              <div key={p.title} className="project-card rv">
                <div className="project-card__top">
                  <span className="project-card__category">{p.category}</span>
                  <div className="project-card__links">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer" aria-label="Live demo">
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <a href={p.repoUrl} target="_blank" rel="noreferrer" aria-label="Repository">
                      <GithubIcon size={14} />
                    </a>
                  </div>
                </div>

                <h3 className="project-card__title">{p.title}</h3>
                <p className="project-card__desc">{p.description}</p>

                <div className="project-card__footer">
                  <div className="project-card__stack">
                    {p.stack.map((s) => (
                      <span key={s} className="stack-tag">{s}</span>
                    ))}
                  </div>
                  <span className="project-card__metric">{p.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="section">
        <div className="container">
          <div className="section-header rv">
            <span className="section-label">Experience</span>
            <h2 className="section-title">Career Timeline</h2>
          </div>

          <div className="timeline">
            {EXPERIENCE.map((exp, idx) => (
              <div key={idx} className="timeline__item rv">
                <div className="timeline__dot" />
                <div className="timeline__content">
                  <div className="timeline__header">
                    <div>
                      <h3 className="timeline__company">{exp.company}</h3>
                      <p className="timeline__role">{exp.role}</p>
                    </div>
                    <span className="timeline__period">{exp.period}</span>
                  </div>
                  <p className="timeline__desc">{exp.description}</p>
                  <div className="timeline__tags">
                    {exp.tags.map((t) => (
                      <span key={t} className="stack-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="section section--alt">
        <div className="container">
          <div className="section-header rv">
            <span className="section-label">Contact</span>
            <h2 className="section-title">Let's work together</h2>
            <p className="section-desc">
              Open to internships, collaborative projects, and full-time roles. I respond within 24 hours.
            </p>
          </div>

          <div className="contact__grid rv">
            {/* Contact info */}
            <div className="contact__info">
              <h3 className="contact__info-title">Get in touch</h3>
              <div className="contact__info-links">
                <a href="mailto:dineshyr2904@gmail.com" className="contact-link">
                  <Mail size={16} />
                  <span>dineshyr2904@gmail.com</span>
                </a>
                <a href="https://github.com/dineshyr29-04" target="_blank" rel="noreferrer" className="contact-link">
                  <GithubIcon size={16} />
                  <span>github.com/dineshyr29-04</span>
                </a>
                <a href="https://www.linkedin.com/in/dinesha291204/" target="_blank" rel="noreferrer" className="contact-link">
                  <LinkedinIcon size={16} />
                  <span>linkedin.com/in/dinesha291204</span>
                </a>
              </div>
              <a href="/resume.pdf" download="Dinesh_Resume.pdf" className="btn-outline" style={{ marginTop: '2rem', display: 'inline-flex' }}>
                <Download size={14} /> Download Resume
              </a>
            </div>

            {/* Contact form */}
            <div className="contact__form">
              {formStatus === 'sent' ? (
                <div className="form-success">
                  <span className="form-success__icon">✓</span>
                  <h4>Your mail client should open!</h4>
                  <p>If it didn't, email me directly at <a href="mailto:dineshyr2904@gmail.com">dineshyr2904@gmail.com</a></p>
                  <button className="btn-outline" onClick={() => setFormStatus('idle')} style={{ marginTop: '1rem' }}>
                    Send another
                  </button>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="you@company.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="Tell me about your project or opportunity..."
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    />
                  </div>
                  <button
                    className="btn-primary"
                    onClick={handleSend}
                    disabled={!contactForm.name || !contactForm.email || !contactForm.message}
                  >
                    Send Message <ArrowRight size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container footer__inner">
          <span>© 2026 Dinesh A · Built with React &amp; TypeScript</span>
          <div className="footer__links">
            <a href="https://github.com/dineshyr29-04" target="_blank" rel="noreferrer" aria-label="GitHub">
              <GithubIcon size={16} />
            </a>
            <a href="https://www.linkedin.com/in/dinesha291204/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedinIcon size={16} />
            </a>
            <a href="mailto:dineshyr2904@gmail.com" aria-label="Email">
              <Mail size={16} />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
