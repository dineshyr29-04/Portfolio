import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Menu,
  X,
} from 'lucide-react';
import './portfolio.css';
import ProjectGallery from './components/ProjectGallery';
import TechnicalSkills from './components/TechnicalSkills';
import Community from './components/Community';
import Experience from './components/Experience';
import useReveal from './hooks/useReveal';
import './motion.css';

const github = 'https://github.com/dineshyr29-04';
const email = 'dineshyr2904@gmail.com';
const navigation = [
  'Work',
  'Focus',
  'Skills',
  'About',
  'Experience',
  'Community',
  'Contact',
];
const projects = [
  {
    name: 'ExaProp',
    category: 'Featured / distributed systems',
    featured: true,
    summary:
      'Open-source observability and resilience engineering for distributed systems, built in Rust.',
    stack: 'Rust · Tokio · Hyper',
    source: `${github}/exaprop`,
    live: '',
    detail:
      'An open-source, Rust-based distributed systems observability and resilience engineering tool, built with Tokio and Hyper. The focus is on HTTP traffic monitoring and anomaly detection, with fault injection planned for a future release.',
  },
  {
    name: 'OpenLoop',
    category: 'National hackathon / website',
    summary: 'Led website development for a 24-hour national hackathon.',
    stack: '',
    source: `${github}/Openloop`,
    live: '',
    detail:
      'Led the website development for OpenLoop, a 24-hour national hackathon.',
  },
  {
    name: 'Project Sankalp',
    category: 'Code for Change / hackathon website',
    summary:
      'Developed the official website for Project Sankalp — Code for Change, a 24-hour hackathon.',
    stack: '',
    source: `${github}/Sankalp`,
    live: 'https://project-sankalp.dev',
    detail:
      'Developed the official website for Project Sankalp — Code for Change, a 24-hour hackathon.',
  },
  {
    name: 'Drug Secure',
    category: 'Applied machine learning',
    summary:
      'Drug batch validation using electrochemical sensor inputs and clustering.',
    stack: 'React · K-Means · Data science',
    source: `${github}/drug-secure`,
    live: 'https://drug-secure.vercel.app',
    detail:
      'An Ayurvedic drug quality-control project using E-Tongue sensor inputs and K-Means clustering to explore patterns across batches.',
  },
  {
    name: 'ThinkNode Portal',
    category: 'Cloud / application development',
    summary:
      'A customer portal for cloud services, SaaS workflows, and analytics.',
    stack: 'JavaScript · Node.js · HTML / CSS',
    source: `${github}?tab=repositories&q=thinknode`,
    live: 'https://thinknode-customers.vercel.app/',
    detail:
      'Co-founded and built the customer portal, bringing cloud service workflows and analytics dashboards into a shared application.',
  },
  {
    name: 'AgroNova',
    category: 'IoT / data applications',
    summary:
      'A smart agriculture project bringing soil and climate sensor data into view.',
    stack: 'JavaScript · Python · MongoDB',
    source: `${github}?tab=repositories&q=agro+nova`,
    live: '',
    detail:
      'A platform connecting IoT sensor data with crop analytics and soil and climate insights. The project explores the path from physical measurements to useful application data.',
  },
  {
    name: 'CardioNerve',
    category: 'Sensor data / machine learning',
    summary:
      'A cardiovascular analytics project working with PPG sensor telemetry.',
    stack: 'Python · PyTorch · Jupyter',
    source: `${github}?tab=repositories&q=cardio+nerve`,
    live: '',
    detail:
      'Co-founded a project exploring cardiovascular analytics from PPG signals, using Python and PyTorch to work with sensor data and predictive models.',
  },
];
const focuses = [
  {
    name: 'System design',
    number: '01',
    title: 'Start with the boundaries.',
    description:
      'I’m interested in how services communicate, where data lives, and what happens when a dependency fails. My application work gives me a place to explore those questions.',
    tools: 'APIs / PostgreSQL / Redis / Docker',
    nodes: ['Request', 'Service', 'Storage'],
    note: 'Think through the data path, ownership, and failure cases before adding more moving parts.',
  },
  {
    name: 'Low-level programming',
    number: '02',
    title: 'Understand what runs underneath.',
    description:
      'C, C++, Rust, and Linux are my foundation for going closer to the machine. My focus is on understanding memory, execution, and the cost of abstractions.',
    tools: 'C / C++ / Rust / Linux / Git',
    nodes: ['Source', 'Compiler', 'Program'],
    note: 'A current area of study: how memory layout and resource ownership shape program behavior.',
  },
  {
    name: 'Practical AI',
    number: '03',
    title: 'Use the tool. Check the result.',
    description:
      'I use AI to work through ideas, explore implementations, and help with repetitive work. I review the output and keep responsibility for the code and its behavior.',
    tools: 'Python / PyTorch / Automation',
    nodes: ['Input', 'Model', 'Review'],
    note: 'Useful output needs a clear task, inspectable results, and a human decision about what ships.',
  },
];

export default function App() {
  useReveal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [focus, setFocus] = useState(0);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>(
    'idle'
  );
  const selected = focuses[focus];
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);
  useEffect(() => {
    if (copyState === 'idle') return;
    const timer = window.setTimeout(() => setCopyState('idle'), 3000);
    return () => window.clearTimeout(timer);
  }, [copyState]);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  }
  return (
    <>
      <Analytics />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Dinesh A, home">
          dinesh<span>.a</span>
          <span className="wordmark-square" />
        </a>
        <nav
          aria-label="Main navigation"
          className={menuOpen ? 'navigation is-open' : 'navigation'}
          id="navigation"
        >
          {navigation.map((item, i) => (
            <a
              href={`#${item.toLowerCase()}`}
              key={item}
              onClick={() => setMenuOpen(false)}
            >
              <span>0{i + 1}</span> {item}
            </a>
          ))}
        </nav>
        <a
          className="header-resume"
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Résumé <ArrowUpRight size={15} />
        </a>
        <button
          className="menu-button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>
      <main id="main">
        <section
          className="hero page-width"
          id="top"
          aria-labelledby="intro-title"
        >
          <div className="hero-meta">
            <span>SOFTWARE ENGINEERING / DINESH A.</span>
            <span>
              CHENNAI, INDIA <span className="small-cross">+</span>
            </span>
          </div>
          <h1 id="intro-title">
            Good software.
            <br />
            From the <span className="serif-word">inside</span> out
            <span className="orange">.</span>
          </h1>
          <div className="hero-bottom">
            <div className="hero-description">
              <p>
                I’m Dinesh. I build software and care about how it works
                underneath.
              </p>
              <p className="muted">
                System design, low-level programming, and AI used with intent.
              </p>
              <a className="primary-link" href="#work">
                Explore my work <ArrowDown size={17} />
              </a>
            </div>
            <div className="hero-index" aria-label="Areas of interest">
              <span className="micro-label">WHERE MY INTERESTS MEET</span>
              {[
                'Systems & architecture',
                'C / C++ / Rust & Linux',
                'AI & automation',
              ].map((name, i) => (
                <a key={name} href="#focus" onClick={() => setFocus(i)}>
                  <span>0{i + 1}</span>
                  {name}
                  <ArrowUpRight size={15} />
                </a>
              ))}
            </div>
          </div>
          <div className="hero-footnote">
            <span>SYSTEMS / CODE / AUTOMATION</span>
            <span>
              SCROLL TO EXPLORE <ArrowDown size={12} />
            </span>
          </div>
        </section>
        <section
          id="work"
          className="work-section"
          aria-labelledby="work-title"
        >
          <div className="page-width">
            <div className="section-heading" data-reveal>
              <div>
                <span className="eyebrow">01 / SELECTED WORK</span>
                <h2 id="work-title">Built to do something.</h2>
              </div>
              <p>
                Applications, automation, and experiments.
                <br />A look at what I’ve been working on.
              </p>
            </div>
            <ProjectGallery projects={projects} />
            <a
              className="text-link repository-link"
              href={github}
              target="_blank"
              rel="noreferrer"
            >
              More on GitHub <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
        <section
          id="focus"
          className="focus-section"
          aria-labelledby="focus-title"
        >
          <div className="page-width">
            <div className="section-heading" data-reveal>
              <div>
                <span className="eyebrow">02 / ENGINEERING FOCUS</span>
                <h2 id="focus-title">Below the surface.</h2>
              </div>
              <p>
                The parts of programming
                <br />I keep coming back to.
              </p>
            </div>
            <div className="focus-layout">
              <div
                className="focus-selector"
                role="tablist"
                aria-label="Engineering focus"
                aria-orientation="vertical"
              >
                {focuses.map((item, i) => (
                  <button
                    key={item.name}
                    role="tab"
                    id={`focus-tab-${i}`}
                    aria-selected={focus === i}
                    aria-controls="focus-panel"
                    tabIndex={focus === i ? 0 : -1}
                    onClick={() => setFocus(i)}
                    onKeyDown={event => {
                      if (
                        ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(
                          event.key
                        )
                      ) {
                        event.preventDefault();
                        const next =
                          event.key === 'Home'
                            ? 0
                            : event.key === 'End'
                              ? focuses.length - 1
                              : (focus +
                                  (event.key === 'ArrowDown' ? 1 : -1) +
                                  focuses.length) %
                                focuses.length;
                        setFocus(next);
                        document.getElementById(`focus-tab-${next}`)?.focus();
                      }
                    }}
                  >
                    <span>{item.number}</span>
                    {item.name}
                    <ArrowRight size={17} />
                  </button>
                ))}
              </div>
              <div
                key={selected.number}
                className="focus-panel"
                id="focus-panel"
                role="tabpanel"
                aria-labelledby={`focus-tab-${focus}`}
                tabIndex={0}
              >
                <span className="micro-label">FOCUS / {selected.number}</span>
                <h3>{selected.title}</h3>
                <p>{selected.description}</p>
                <div
                  className="flow-diagram"
                  aria-label={selected.nodes.join(' to ')}
                >
                  {selected.nodes.map((node, i) => (
                    <div className="flow-step" key={node}>
                      {i > 0 && <ArrowRight aria-hidden="true" size={17} />}
                      <span>{node}</span>
                    </div>
                  ))}
                </div>
                <p className="diagram-note">{selected.note}</p>
                <div className="focus-tools">{selected.tools}</div>
              </div>
            </div>
          </div>
        </section>
        <TechnicalSkills />
        <section
          id="about"
          className="about-section page-width"
          aria-labelledby="about-title"
        >
          <div className="about-intro" data-reveal>
            <span className="eyebrow">04 / THE PERSON</span>
            <h2 id="about-title">
              Curious about <br />
              the whole stack.
            </h2>
            <a
              href="/resume.pdf"
              download="Dinesh_Resume.pdf"
              className="text-link"
            >
              Download résumé <Download size={15} />
            </a>
          </div>
          <div className="about-content" data-reveal data-reveal-delay="60">
            <p className="about-lead">
              I like taking things apart, understanding the pieces, and putting
              them back together with a clearer idea of why they work.
            </p>
            <p>
              My projects span web applications, cloud services, automation, and
              sensor data. I’m interested in moving deeper into systems
              programming and the decisions that make software easier to
              understand and maintain.
            </p>
            <p>
              AI is part of my toolkit. I use it to explore and build, while
              reading the code, testing the assumptions, and making the
              engineering decisions myself.
            </p>
          </div>
        </section>
        <Experience />
        <Community />
        <section
          id="contact"
          className="contact-section"
          aria-labelledby="contact-title"
        >
          <div className="page-width">
            <span className="eyebrow">07 / GET IN TOUCH</span>
            <div className="contact-layout" data-reveal>
              <div>
                <h2 id="contact-title">
                  Something worth
                  <br />
                  <span className="serif-word">building?</span>
                </h2>
                <p>
                  I’m interested in engineering opportunities and thoughtful
                  collaborations.
                  <br />
                  Tell me what you’re working on.
                </p>
                <a className="contact-email" href={`mailto:${email}`}>
                  {email}
                  <ArrowUpRight size={24} />
                </a>
                <button className="copy-email" onClick={copyEmail}>
                  {copyState === 'copied' ? (
                    <Check size={13} />
                  ) : (
                    <Copy size={13} />
                  )}{' '}
                  Copy email
                </button>
                <span className="copy-status" role="status">
                  {copyState === 'copied'
                    ? 'Email copied.'
                    : copyState === 'error'
                      ? 'Could not copy. Please select the email above.'
                      : ''}
                </span>
              </div>
              <div className="contact-aside">
                <span className="micro-label">ELSEWHERE</span>
                <a href={github} target="_blank" rel="noreferrer">
                  GitHub
                  <ArrowUpRight size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/in/dinesha291204/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                  <ArrowUpRight size={16} />
                </a>
                <a href="/resume.pdf" target="_blank" rel="noreferrer">
                  Résumé
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer page-width">
        <span>© {new Date().getFullYear()} Dinesh A.</span>
        <span>Built with care. Kept simple.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
