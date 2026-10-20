import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
} from 'lucide-react';
import './portfolio.css';
import ProjectGallery from './components/ProjectGallery';
import TechnicalSkills from './components/TechnicalSkills';
import Achievements from './components/Achievements';
import Experience from './components/Experience';
import PageMotion from './components/PageMotion';
import OptionWheel from './components/OptionWheel';
import MobileNavigation from './components/MobileNavigation';
import useReveal from './hooks/useReveal';
import './motion.css';
import {
  github,
  email,
  navigation,
  projects,
  focuses,
} from './data/portfolioData';

export default function App() {
  useReveal();
  const [focus, setFocus] = useState(0);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>(
    'idle'
  );
  const selected = focuses[focus];
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
      <PageMotion />
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
          className="navigation"
          id="navigation"
        >
          {navigation.map((item, i) => (
            <a href={`#${item.toLowerCase()}`} key={item} data-section-link>
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
        <MobileNavigation items={navigation} />
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
            <span className="hero-line">
              <span>Good software.</span>
            </span>
            <span className="hero-line">
              <span>
                From the <span className="serif-word">inside</span> out
                <span className="text-accent">.</span>
              </span>
            </span>
          </h1>
          <div className="hero-bottom">
            <div className="hero-description">
              <p>
                I’m Dinesh. I build with Rust, explore distributed systems, and
                develop full-stack applications.
              </p>
              <p className="muted">
                From HTTP traffic and service boundaries to the interfaces
                people use.
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
                <a key={name} href="#approach" onClick={() => setFocus(i)}>
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
        <TechnicalSkills />
        <Achievements />
        <section
          id="approach"
          className="focus-section"
          aria-labelledby="focus-title"
        >
          <div className="page-width">
            <div className="section-heading" data-reveal>
              <div>
                <span className="eyebrow">04 / ENGINEERING APPROACH</span>
                <h2 id="focus-title">Below the surface.</h2>
              </div>
              <p>
                The parts of programming
                <br />I keep coming back to.
              </p>
            </div>
            <div className="focus-layout">
              <OptionWheel
                items={focuses.map(item => item.name)}
                selected={focus}
                onChange={setFocus}
              />
              <div
                key={selected.number}
                className="focus-panel"
                id="focus-panel"
                role="tabpanel"
                aria-labelledby={`focus-tab-${focus}`}
                tabIndex={0}
              >
                <span className="micro-label">
                  APPROACH / {selected.number}
                </span>
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
        <section
          id="about"
          className="about-section page-width"
          aria-labelledby="about-title"
        >
          <div className="about-intro" data-reveal>
            <span className="eyebrow">05 / THE PERSON</span>
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
          <Experience embedded />
        </section>
        <section
          id="contact"
          className="contact-section"
          aria-labelledby="contact-title"
        >
          <div className="page-width">
            <span className="eyebrow">06 / GET IN TOUCH</span>
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
