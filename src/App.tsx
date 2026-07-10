import { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Mail, Menu, X, ArrowRight, Download, MapPin, ArrowUpRight } from 'lucide-react';
import './App.css';
import DarkVeil from './DarkVeil';

const GithubIcon = ({ size = 15, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const LinkedinIcon = ({ size = 15, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

/* ─── DATA ─── */
const SKILLS = [
  { category: 'Frontend', icon: '⚡', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'GSAP'] },
  { category: 'Backend', icon: '🔧', items: ['Node.js', 'Express.js', 'Python', 'REST APIs', 'Redis'] },
  { category: 'Databases', icon: '🗄️', items: ['PostgreSQL', 'MongoDB', 'MySQL'] },
  { category: 'Systems & Tools', icon: '🛠️', items: ['C', 'C++', 'Linux', 'Git', 'Docker', 'Vercel'] },
];

const PROJECTS = [
  {
    num: '01', category: 'AI · Healthcare', title: 'Drug Secure',
    description: 'AI-powered quality control system for Ayurvedic drug validation using E-Tongue electrochemical sensor inputs and K-Means clustering for batch validation.',
    stack: ['React', 'GSAP', 'Unsupervised ML', 'Data Science'],
    repoUrl: 'https://github.com/dineshyr29-04/drug-secure', liveUrl: 'https://drug-secure.vercel.app', accent: '#10b981',
  },
  {
    num: '02', category: 'Hackathon Platform', title: 'HackArena',
    description: 'Co-founded a premium hackathon evaluation ecosystem with real-time tracking, team matchmaking, and automated scoring — supporting 500+ participants.',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    repoUrl: 'https://github.com/dineshyr29-04/Sankalp', liveUrl: 'https://project-sankalp.dev', accent: '#6366f1',
  },
  {
    num: '03', category: 'SaaS · Cloud', title: 'ThinkNode Portal',
    description: 'Co-founded and engineered the customer portal for a cloud platform with automated SaaS workflows and high-speed analytics dashboards serving 10k+ users.',
    stack: ['JavaScript', 'HTML', 'CSS', 'Node.js'],
    repoUrl: 'https://github.com/dineshyr29-04?tab=repositories&q=thinknode', liveUrl: 'https://thinknode-customers.vercel.app/', accent: '#ec4899',
  },
  {
    num: '04', category: 'Automation · AI', title: 'Openloop',
    description: 'A scalable automation engine for AI pipeline orchestration using event-driven architecture to manage long-running repetitive tasks with 89% accuracy.',
    stack: ['JavaScript', 'TypeScript', 'Python', 'YAML'],
    repoUrl: 'https://github.com/dineshyr29-04/Openloop', liveUrl: '', accent: '#f59e0b',
  },
  {
    num: '05', category: 'AgTech · IoT', title: 'AgroNova',
    description: 'Smart agriculture platform integrating IoT sensor data for predictive crop analytics — empowering farmers with real-time soil and climate insights.',
    stack: ['JavaScript', 'Python', 'MongoDB', 'SQL'],
    repoUrl: 'https://github.com/dineshyr29-04?tab=repositories&q=agro+nova', liveUrl: '', accent: '#22c55e',
  },
  {
    num: '06', category: 'MedTech · AI', title: 'CardioNerve',
    description: 'Co-founded an AI-driven cardiovascular analytics platform processing PPG sensor telemetry to compute predictive cardiac health scores at 97.5% precision.',
    stack: ['Python', 'JavaScript', 'Jupyter', 'PyTorch'],
    repoUrl: 'https://github.com/dineshyr29-04?tab=repositories&q=cardio+nerve', liveUrl: '', accent: '#ef4444',
  },
];

const EXPERIENCE = [
  {
    period: '2024 — Present', company: 'AWS Cloud Club', role: 'Tech Relationship Head',
    description: 'Spearheaded cloud architecture initiatives and fostered technical partnerships within the AWS student community. Organized hands-on cloud deployment workshops and networking events.',
    tags: ['AWS', 'Cloud Architecture', 'Leadership'], accent: '#f59e0b',
  },
  {
    period: '2024 — Present', company: 'HackArena', role: 'Co-Founder & Lead Developer',
    description: 'Co-founded and engineered HackArena — a next-generation hackathon management engine supporting 500+ active participants with automated judging and real-time team collaboration.',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'], accent: '#6366f1',
  },
];

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

/* ─── APP ─── */
export default function App() {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sent'>('idle');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const secs = document.querySelectorAll<HTMLElement>('section[id]');
      let cur = '';
      secs.forEach((s) => { if (window.scrollY >= s.offsetTop - 200) cur = s.id; });
      setActiveSection(cur);
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Robust scroll-reveal: uses a stable ref for the observer
  useEffect(() => {
    // Disconnect any existing observer
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.rvVisible = 'true';
            observerRef.current?.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 60px 0px' }
    );

    // Observe all .rv elements
    const els = document.querySelectorAll('.rv');
    els.forEach((el) => {
      // If already in viewport, mark visible immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        (el as HTMLElement).dataset.rvVisible = 'true';
      } else {
        observerRef.current?.observe(el);
      }
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const win = window as any;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (win.lenis) {
      win.lenis.scrollTo(el, { offset: -80 });
    } else {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.pageYOffset - 80,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
    setMenuOpen(false);
  };

  const handleSend = () => {
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) return;
    window.open(`mailto:dineshyr2904@gmail.com?subject=Portfolio Message from ${encodeURIComponent(contactForm.name)}&body=${encodeURIComponent(contactForm.message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(contactForm.name)} (${encodeURIComponent(contactForm.email)})`);
    setFormStatus('sent');
  };

  return (
    <>
      <Analytics />
      <DarkVeil
        hueShift={0}
        noiseIntensity={0.06}
        scanlineIntensity={0.4}
        speed={0.3}
        scanlineFrequency={800}
        warpAmount={0.3}
        resolutionScale={1.5}
      />

      {/* ── NAVBAR ── */}
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__container">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="navbar__logo">
            Dinesh.
          </a>

          <ul className="navbar__links hidden-mobile">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }}
                  className={`navbar__link ${activeSection === id ? 'active' : ''}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <a href="mailto:dineshyr2904@gmail.com" className="navbar__btn hidden-mobile">
            Hire Me
          </a>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map(({ id, label }) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id); }} className="mobile-menu__link">{label}</a>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section id="hero" className="hero hero--split">
        <div className="container hero__container--split">
          
          <div className="hero__left-split rv">
            <div className="hero__badge-row">
              <span className="hero__badge">
                <MapPin size={12} /> Chennai, India
              </span>
              <span className="hero__badge hero__badge--green">
                <span className="hero__pulse" />
                Open to Opportunities
              </span>
            </div>

            <h1 className="hero__headline">
              Crafting <br />
              <span className="hero__headline-gradient">Digital</span> <br />
              Experiences.
            </h1>

            <p className="hero__sub">
              Hi, I'm <strong>Dinesh A.</strong> I specialize in building 
              high-performance web applications, scalable AI infrastructure, 
              and beautiful user interfaces.
            </p>

            <div className="hero__actions hero__actions--split">
              <button className="btn-primary" onClick={() => scrollTo('projects')}>
                Explore Work <ArrowRight size={15} />
              </button>
              <div className="hero__socials hero__socials--inline">
                <a href="https://github.com/dineshyr29-04" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <GithubIcon size={18} />
                </a>
                <a href="https://www.linkedin.com/in/dinesha291204/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <LinkedinIcon size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="hero__right-split rv">
            {/* Pseudo Code Editor Window */}
            <div className="code-window">
              <div className="code-window__header">
                <div className="code-window__dots">
                  <span className="dot dot--red"></span>
                  <span className="dot dot--yellow"></span>
                  <span className="dot dot--green"></span>
                </div>
                <div className="code-window__title">developer.ts</div>
              </div>
              <div className="code-window__body">
                <pre><code>
<span className="code-keyword">const</span> <span className="code-var">developer</span> = {'{'}
  <span className="code-prop">name</span>: <span className="code-string">"Dinesh A."</span>,
  <span className="code-prop">role</span>: <span className="code-string">"Full Stack Engineer"</span>,
  <span className="code-prop">skills</span>: [<span className="code-string">"React"</span>, <span className="code-string">"Node.js"</span>, <span className="code-string">"Python"</span>],
  <span className="code-prop">co_founded</span>: [<span className="code-string">"CardioNerve"</span>, <span className="code-string">"HackArena"</span>],
  <span className="code-prop">status</span>: <span className="code-string">"Building next-gen systems"</span>
{'}'};
<br/>
<span className="code-keyword">export default</span> <span className="code-var">developer</span>;
                </code></pre>
              </div>
            </div>
          </div>

        </div>

        <div className="scroll-indicator">
          <div className="scroll-indicator__line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="section">
        <div className="container">
          <div className="about__layout">
            <div className="about__left rv">
              <div className="section-eyebrow">About Me</div>
              <h2 className="section-title">
                Systems thinker.<br />
                <span className="text-gold">Full-stack executor.</span>
              </h2>
              <p className="about__para">
                I'm Dinesh A — a builder, co-founder, and engineer who thrives at the intersection of AI and product.
                I focus on designing clean, well-architected systems that solve real problems at scale.
              </p>
              <p className="about__para">
                From kernel-level operating systems to production LLM pipelines, I bring deep technical curiosity
                to every layer of the stack. I believe in shipping fast, iterating intelligently, and building things that last.
              </p>
              <div className="about__actions">
                <a href="/resume.pdf" download="Dinesh_Resume.pdf" className="btn-primary">
                  <Download size={14} /> Download Resume
                </a>
                <a href="mailto:dineshyr2904@gmail.com" className="btn-ghost">
                  <Mail size={14} /> Get in touch
                </a>
              </div>
            </div>

            <div className="about__right">
              <div className="info-card rv">
                <div className="info-card__header">
                  <span className="info-card__label">Personal Info</span>
                  <span className="status-dot" />
                </div>
                <div className="info-card__rows">
                  {[
                    { k: 'Location', v: 'Bangalore, India' },
                    { k: 'Email', v: 'dineshyr2904@gmail.com' },
                    { k: 'GitHub', v: 'dineshyr29-04' },
                    { k: 'Status', v: 'Open to opportunities' },
                    { k: 'Interests', v: 'AI/ML, OS, Full-Stack' },
                  ].map(({ k, v }) => (
                    <div key={k} className="info-row">
                      <span className="info-row__key">{k}</span>
                      <span className="info-row__val">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="activity-grid">
                {[
                  { icon: '🏆', title: 'Hackathon Organizer', sub: '500+ participants' },
                  { icon: '📖', title: 'ML Research', sub: 'Transformers & LLMs' },
                  { icon: '🌐', title: 'Open Source', sub: 'GitHub active' },
                  { icon: '🎤', title: 'Tech Talks', sub: 'Community builder' },
                ].map((item, i) => (
                  <div key={i} className="activity-card rv">
                    <span className="activity-card__icon">{item.icon}</span>
                    <p className="activity-card__title">{item.title}</p>
                    <p className="activity-card__sub">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="section section--dark">
        <div className="container">
          <div className="section-header rv">
            <div className="section-eyebrow">Skills</div>
            <h2 className="section-title">Technical Expertise</h2>
            <p className="section-subtitle">Technologies I use to design, build, and ship production systems.</p>
          </div>
          <div className="skills__grid">
            {SKILLS.map((group, i) => (
              <div key={i} className="skill-card rv">
                <div className="skill-card__top">
                  <span className="skill-card__icon">{group.icon}</span>
                  <span className="skill-card__cat">{group.category}</span>
                </div>
                <div className="skill-card__tags">
                  {group.items.map((item) => (
                    <span key={item} className="skill-pill">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="section">
        <div className="container">
          <div className="section-header rv">
            <div className="section-eyebrow">Projects</div>
            <h2 className="section-title">Selected Work</h2>
            <p className="section-subtitle">A curated selection of projects I've designed, built, and shipped.</p>
          </div>
          <div className="projects__grid">
            {PROJECTS.map((p, i) => (
              <div
                key={i}
                className="project-card rv"
                data-dimmed={hoveredProject !== null && hoveredProject !== i ? 'true' : 'false'}
                onMouseEnter={() => setHoveredProject(i)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{ '--card-accent': p.accent } as React.CSSProperties}
              >
                {/* Accent glow strip at top */}
                <div className="project-card__strip" />

                {/* Header row */}
                <div className="project-card__meta">
                  <span className="project-card__num">{p.num}</span>
                  <span className="project-card__cat">{p.category}</span>
                </div>

                {/* Title */}
                <h3 className="project-card__title">{p.title}</h3>

                {/* Description */}
                <p className="project-card__desc">{p.description}</p>

                {/* Footer */}
                <div className="project-card__footer">
                  <div className="project-card__stack">
                    {p.stack.map(tech => <span key={tech} className="stack-txt">{tech}</span>)}
                  </div>
                  <div className="project-card__links">
                    {p.repoUrl && (
                      <a href={p.repoUrl} target="_blank" rel="noreferrer" className="project-link" aria-label="View Source">
                        <GithubIcon size={15} />
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noreferrer" className="project-link" aria-label="Visit Live">
                        <ArrowUpRight size={15} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="section section--dark">
        <div className="container">
          <div className="section-header rv">
            <div className="section-eyebrow">Experience</div>
            <h2 className="section-title">Professional Journey</h2>
          </div>
          <div className="timeline rv">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} className="tl-item" style={{ '--accent': exp.accent } as React.CSSProperties}>
                <div className="tl-item__line" />
                <div className="tl-item__dot" />
                <div className="tl-item__card">
                  <div className="tl-item__head">
                    <div>
                      <h3 className="tl-item__company">{exp.company}</h3>
                      <div className="tl-item__role">{exp.role}</div>
                    </div>
                    <span className="tl-item__period">{exp.period}</span>
                  </div>
                  <p className="tl-item__desc">{exp.description}</p>
                  <div className="tl-item__tags">
                    {exp.tags.map(t => <span key={t} className="skill-pill">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="section">
        <div className="container">
          <div className="contact__layout">
            <div className="contact__left rv">
              <div className="section-eyebrow">Contact</div>
              <h2 className="section-title">Let's build<br /><span className="text-gold">something great.</span></h2>
              <p className="contact__desc">
                Currently open to new opportunities. Whether you have a question, a project idea, or just want to connect — my inbox is always open.
              </p>
              <div className="contact__links">
                <a href="mailto:dineshyr2904@gmail.com" className="contact-item">
                  <div className="contact-item__icon"><Mail size={18} /></div>
                  <div>
                    <div className="contact-item__label">Email Me</div>
                    <div className="contact-item__val">dineshyr2904@gmail.com</div>
                  </div>
                </a>
                <a href="https://www.linkedin.com/in/dinesha291204/" target="_blank" rel="noreferrer" className="contact-item">
                  <div className="contact-item__icon"><LinkedinIcon size={18} /></div>
                  <div>
                    <div className="contact-item__label">Connect on LinkedIn</div>
                    <div className="contact-item__val">linkedin.com/in/dinesha291204</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="contact__right rv">
              <div className="contact__form-wrap">
                {formStatus === 'idle' ? (
                  <form className="contact__form" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                    <h3 className="form-title">Send a Message</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-input" placeholder="Your name" required
                          value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-input" placeholder="john@example.com" required
                          value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea className="form-input form-textarea" placeholder="How can I help you?" required
                        value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} />
                    </div>
                    <button type="submit" className="btn-primary form-submit">
                      Send Message <ArrowRight size={15} />
                    </button>
                  </form>
                ) : (
                  <div className="form-success">
                    <div className="form-success__check">✓</div>
                    <h4>Message Sent!</h4>
                    <p>Thanks for reaching out! Your email client should have opened with the message ready to send.</p>
                    <button onClick={() => { setFormStatus('idle'); setContactForm({ name: '', email: '', message: '' }); }} className="btn-ghost" style={{ marginTop: '12px' }}>
                      Send Another
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <div className="footer__left">
              <span className="footer__logo">Dinesh.</span>
              <span>© {new Date().getFullYear()} Dinesh A. All rights reserved.</span>
            </div>
            <div className="footer__socials">
              <a href="https://github.com/dineshyr29-04" target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon size={16} /></a>
              <a href="https://www.linkedin.com/in/dinesha291204/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon size={16} /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
