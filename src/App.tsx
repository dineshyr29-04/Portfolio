import { useState, useEffect, useRef, useCallback } from "react";

import Shuffle from './Shuffle';
import './Shuffle.css';
import DarkVeil from './DarkVeil';
import './App.css';
import projectPhoto from './assets/DA (1).png';



/* ═══════════════════════════════════════════════════════════════
   PLAYGROUND CODE TABS
   ═══════════════════════════════════════════════════════════════ */
const CODE_TABS: Record<string, { code: string; output: string[] }> = {
  Python: {
    code: `import technology as tech
    import innovation as inn
    print("NAME: Dinesh A"
    print("Role: AI/ML Enginneer and Full-Stack Developer")
    print("Focus: Building production level Full Stack and Web devs and learning about systems of ML and architechures))`,
    output: [
      "Parameters: 4,722,176",
      "Architecture: Transformer (d=512, h=8)",
      "Status: Ready for training ✓",
    ],
  },
  Bash: {
    code: `#!/bin/bash
# Deploy ML model to production

echo "▶ Building Docker image..."
docker build -t ml-api:v2.1 .

echo "▶ Running health check..."
curl -s localhost:8080/health | jq .

echo "▶ Deploying to Kubernetes..."
kubectl apply -f deploy.yaml
kubectl rollout status deploy/ml-api

echo "▶ Verifying inference endpoint..."
curl -X POST localhost:8080/predict \\
  -H "Content-Type: application/json" \\
  -d '{"input": [1.0, 2.0, 3.0]}'

echo "✓ Deployment complete"`,
    output: [
      "▶ Building Docker image...",
      "  → ml-api:v2.1 built (340MB)",
      "▶ Running health check...",
      '  { "status": "healthy", "gpu": true }',
      "▶ Deploying to Kubernetes...",
      "  deployment/ml-api rolled out",
      "▶ Verifying inference endpoint...",
      '  { "prediction": [0.87], "latency": "12ms" }',
      "✓ Deployment complete",
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const NAV_ITEMS: [string, string][] = [
  ["about", "About"],
  ["skills", "Skills"],
  ["projects", "Work"],
  ["experience", "Experience"],
  ["contact", "Contact"],
];

const SKILL_GROUPS: [string, string[]][] = [
  ["Languages", ["Python", "SQL", "Bash", "C++", "TypeScript", "JavaScript"]],
  ["Backend & Cloud", ["Node.js", "Express.js", "MongoDB", "MySQL", "PostgreSQL", "Redis"]],
  ["Frontend & UI", ["React", "Next.js", "Vite", "Tailwind CSS", "GSAP", "Three.js"]],
  ["AI & Data Science", ["LLMs", "Prompt Engineering", "MLOps", "PyTorch", "OpenCV", "K-means"]],
  ["Domains", ["Healthcare (MedTech)", "Agriculture (AgTech)", "Security Systems", "Automation"]],
  ["Tools", ["Git", "Docker", "Linux", "Jupyter", "Vercel", "Netlify"]],
];

const PROJECTS = [
  {
    type: "SaaS Frontend / Cloud Interface",
    color: "var(--accent3)",
    photoFile: "project-thinknode-premium.png",
    title: "Thinknode Customer Portal",
    desc: "A customer-facing web application for the ThinkNode ecosystem. Features a comprehensive dashboard for interacting with backend data processing and AI-driven workflows.",
    metric: "10k+ Active Users · 99.9% Uptime",
    stack: ["JavaScript", "HTML", "CSS", "Node.js"],
    repoUrl: "https://github.com/dineshyr29-04?tab=repositories&q=thinknode&type=&language=&sort=",
    liveUrl: "https://thinknode-customers.vercel.app/",
  },
  {
    type: "Workflow Orchestration",
    color: "var(--accent2)",
    photoFile: "project-openloop-premium.png",
    title: "Openloop Automation",
    desc: "A scalable automation system designed for managing complex AI pipelines and event-driven tasks. Orchestrates repetitive processes through efficient continuous loops.",
    metric: "89% Accuracy · 5x Efficiency Gain",
    stack: ["JavaScript", "TypeScript", "Python", "YAML"],
    repoUrl: "https://github.com/dineshyr29-04/Openloop",
    liveUrl: "https://open-loop.dev",
  },
  {
    type: "AgTech / IoT Dashboard",
    color: "var(--green)",
    photoFile: "project-agronova-premium.png",
    title: "AgroNova Platform",
    desc: "An advanced agriculture technology platform improving farming efficiency through digital insights. Integrates IoT data for real-time crop monitoring and predictive analytics.",
    metric: "15% Yield Increase · Real-time Monitoring",
    stack: ["JavaScript", "Python", "MongoDB", "SQL"],
    repoUrl: "https://github.com/dineshyr29-04?tab=repositories&q=agro+nova&type=&language=&sort=",
    liveUrl: "",
  },
  {
    type: "MedTech / Data Analytics",
    color: "var(--accent)",
    photoFile: "project-cardionerve-premium.png",
    title: "Cardionerve Health",
    desc: "A healthcare analytics system focused on cardiovascular and neurological data analysis. Processes complex medical data to assist in diagnosis and monitoring.",
    metric: "97.5% Precision · Clinical Grade",
    stack: ["Python", "JavaScript", "Jupyter", "DataViz"],
    repoUrl: "https://github.com/dineshyr29-04?tab=repositories&q=cardio+nerve&type=&language=&sort=",
    liveUrl: "",
  },
  {
    type: "Web Development",
    color: "var(--accent2)",
    photoFile: "project-portfolio-premium.png",
    title: "Personal Portfolio",
    desc: "A high-performance developer portfolio showcasing advanced frontend engineering. Features responsive layouts, custom animations, and a cinematic UI design.",
    metric: "100/100 Performance · SEO Optimized",
    stack: ["React", "TypeScript", "HTML", "CSS"],
    repoUrl: "https://github.com/dineshyr29-04/Portfolio",
    liveUrl: "https://dinesh-portfolio.vercel.app",
  },
  {
    type: "Pharma Security / Supply Chain",
    color: "var(--accent3)",
    photoFile: "project-drugsecure-premium.png",
    title: "Drug-Secure System",
    desc: "A pharmaceutical verification platform ensuring medicine authenticity. Tracks products across the supply chain using digital identifiers to prevent counterfeiting.",
    metric: "Zero Counterfeits · 100% Traceability",
    stack: ["JavaScript", "TypeScript", "Python", "SQL"],
    repoUrl: "https://github.com/dineshyr29-04?tab=repositories&q=drug-secure&type=&language=&sort=",
    liveUrl: "",
  },
];

const EXP_ITEMS = [
  {
    period: "2025 — Present",
    company: "Cardio Nerve",
    role: "Full-Stack Developer",
    desc: "An AI-driven cardiovascular intelligence platform that analyzes real-time heart rate and HRV data from PPG sensors to generate predictive cardiac risk scores. Designed a clinical dashboard for early detection, risk stratification, and preventive decision support.Architected and deployed production LLM pipelines processing 2M+ daily requests. Led fine-tuning initiatives for domain-specific applications and built internal MLOps tooling adopted across 4 teams.",
    tags: ["Express.js", "PyTorch", "MLOps", "Python"],
  },
  
];

/* ═══════════════════════════════════════════════════════════════
   SIMPLE CODE SIMULATOR
   ═══════════════════════════════════════════════════════════════ */
function simulateCode(code: string, lang: string): string[] {
  const output: string[] = [];
  if (lang === "Python") {
    const re = /\bprint\s*\(\s*(.+?)\s*\)\s*$/gm;
    let m: RegExpExecArray | null;
    while ((m = re.exec(code)) !== null) {
      let arg = m[1].trim();
      // f-string
      if (/^f["']/.test(arg)) {
        const q = arg[1];
        const end = arg.lastIndexOf(q);
        const inner = end > 1 ? arg.slice(2, end) : arg.slice(2);
        output.push(inner);
      }
      // String literal
      else if (/^["']/.test(arg) && /["']$/.test(arg)) {
        output.push(arg.slice(1, -1));
      }
      // Expression / variable
      else {
        output.push(String(arg));
      }
    }
  } else if (lang === "Bash") {
    for (const line of code.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const em = t.match(/^echo\s+(.+)$/);
      if (em) {
        let v = em[1].trim();
        if (
          (v.startsWith('"') && v.endsWith('"')) ||
          (v.startsWith("'") && v.endsWith("'"))
        ) {
          v = v.slice(1, -1);
        }
        output.push(v);
      }
    }
  }
  return output.length > 0 ? output : ["► Program executed (no output)"];
}

/* ═══════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Python" | "Bash">("Python");
  const [lineCount, setLineCount] = useState(
    CODE_TABS.Python.code.split("\n").length
  );
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [outputDone, setOutputDone] = useState(false);
  // Removed unused: carIdx, setCarIdx

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lnumsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>(0);
  const autoRan = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  /* ── Active section via scroll ── */
  useEffect(() => {
    const h = () => {
      const secs = document.querySelectorAll<HTMLElement>("section[id]");
      let cur = "";
      secs.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 200) cur = s.id;
      });
      setActiveSection(cur);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* ── Scroll reveal ── */
  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.04, rootMargin: "0px 0px 40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Parallax removed — DarkVeil handles animated background

  /* ── Section portal / depth observer ── */
  useEffect(() => {
    const secs = Array.from(document.querySelectorAll<HTMLElement>('section'));
    const colors: Record<string, string> = {
      hero: 'rgba(99,102,241,0.16)',
      about: 'rgba(139,92,246,0.12)',
      skills: 'rgba(6,182,212,0.12)',
      projects: 'rgba(99,102,241,0.14)',
      experience: 'rgba(139,92,246,0.12)',
      contact: 'rgba(6,182,212,0.1)'
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.target) return;
          const s = en.target as HTMLElement;
          if (en.isIntersecting) {
            const id = s.id || 'hero';
            const c = colors[id] || 'rgba(99,102,241,0.12)';
            document.documentElement.style.setProperty('--portal-color', c);
            document.documentElement.style.setProperty('--portal-opacity', '0.55');
            document.documentElement.style.setProperty('--bg-zoom', '1.06');
          } else {
            // when no section intersects (fast scroll), gently fade
            document.documentElement.style.setProperty('--portal-opacity', '0');
            document.documentElement.style.setProperty('--bg-zoom', '1');
          }
        });
      },
      { threshold: 0.48 }
    );

    secs.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);



  /* ── Experience reveal ── */
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".ei");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const d =
              parseInt((e.target as HTMLElement).dataset.delay || "0");
            setTimeout(() => e.target.classList.add("visible"), d);
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    items.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Auto-run playground on mount ── */
  useEffect(() => {
    if (autoRan.current) return;
    autoRan.current = true;
    setTimeout(() => runCode(), 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Cleanup timer ── */
  useEffect(() => () => clearTimeout(timerRef.current), []);

  /* ── Editor helpers ── */
  const syncLines = useCallback(() => {
    if (editorRef.current)
      setLineCount(editorRef.current.value.split("\n").length);
  }, []);

  const syncScroll = useCallback(() => {
    if (editorRef.current && lnumsRef.current)
      lnumsRef.current.scrollTop = editorRef.current.scrollTop;
  }, []);
  const runCode = useCallback(() => {
    clearTimeout(timerRef.current);
    setOutputLines([]);
    setOutputDone(false);
    const code = editorRef.current?.value || "";
    const defaultCode = CODE_TABS[activeTab]?.code || "";
    // Use polished predefined output for unmodified code
    const lines =
      code.trim() === defaultCode.trim()
        ? CODE_TABS[activeTab]?.output || ["► No output"]
        : simulateCode(code, activeTab);
    let i = 0;
    const tick = () => {
      if (i >= lines.length) {
        setOutputDone(true);
        return;
      }
      setOutputLines((prev) => [...prev, lines[i]]);
      i++;
      timerRef.current = window.setTimeout(tick, 120);
    };
    tick();
  }, [activeTab]);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const el = editorRef.current!;
        const s = el.selectionStart;
        const end = el.selectionEnd;
        el.value = el.value.slice(0, s) + "  " + el.value.slice(end);
        el.selectionStart = el.selectionEnd = s + 2;
        syncLines();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
    },
    [syncLines, runCode]
  );



  const switchTab = useCallback(
    (tab: "Python" | "Bash") => {
      setActiveTab(tab);
      setOutputLines([]);
      setOutputDone(false);
      if (editorRef.current) {
        editorRef.current.value = CODE_TABS[tab].code;
      }
      setLineCount(CODE_TABS[tab].code.split("\n").length);
    },
    []
  );

  const scrollTo = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    const win: any = window as any;
    if (win.lenis && el) {
      win.lenis.scrollTo(el, { offset: -72 });
    } else {
      el?.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  }, []);


  // Removed unused: handleCardMouse, handleCardLeave, scrollCarousel


  // Removed useEffect for carIdx scroll sync (no longer needed)

  /* ── Auto-scroll carousel with infinite loop ── */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleMouseEnter = () => {
      track.style.animationPlayState = "paused";
    };

    const handleMouseLeave = () => {
      track.style.animationPlayState = "running";
    };

    track.addEventListener("mouseenter", handleMouseEnter);
    track.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      track.removeEventListener("mouseenter", handleMouseEnter);
      track.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  /* ════════════════════════ RENDER ════════════════════════ */
  return (
    <>
      {/* WebGL animated background */}
      <DarkVeil
        hueShift={220}
        noiseIntensity={0}
        scanlineIntensity={0}
        speed={0.6}
        scanlineFrequency={0}
        warpAmount={0.22}
      />
      <div className="bg-portal" aria-hidden="true" />
      <div className="dot-grid" aria-hidden="true" />

      
      {/* ══ NAV ══ */}
      <nav id="nav" role="navigation">
        <div className="wrap nav-row">
          <a
            href="#hero"
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              const win: any = window as any;
              if (win.lenis) {
                win.lenis.scrollTo(0);
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <img
              src={projectPhoto}
              alt="Project Logo"
              className="logo-img"
              style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
            />
          </a>

          <ul className="nav-links">
            {NAV_ITEMS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className={activeSection === id ? "active" : ""}
                  onClick={(e) => scrollTo(e, id)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            <span className="avail-badge">
              <span className="avail-dot" />
              Available for work
            </span>
          </div>

          <button
            className="mobile-btn"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className={`mb${menuOpen ? " open" : ""}`} />
            <span className={`mb${menuOpen ? " open" : ""}`} />
            <span className={`mb${menuOpen ? " open" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-drawer${menuOpen ? " open" : ""}`}>
        {NAV_ITEMS.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className={activeSection === id ? "active" : ""}
            onClick={(e) => scrollTo(e, id)}
          >
            {label}
          </a>
        ))}
      </div>

      {/* ══ HERO ══ */}
      <section id="hero">
        <div className="wrap hero-grid rv">
          {/* Left */}
          <div className="hero-left">
            <span className="hero-badge">✦ Open to Web development roles</span>
            <h1 className="hero-name" aria-label="DINESH A">
              <Shuffle tag="span" text="DINESH" duration={0.65} stagger={0.03} immediate />
              {" "}
              <span className="spana">
                <Shuffle tag="span" text="A" duration={0.72} stagger={0.03} immediate />
              </span>
            </h1>
            <p className="hero-role">
              {"// AI · ML · LLM · MLOps · Production Systems"}
            </p>
            <p className="hero-bio">
              I design and deploy production Full-Stack and Web systems — from model
              architecture to inference pipelines and a clean UI — with a focus on reliability,
              efficiency, and real-world impact.
            </p>
            <div className="hero-ctas">
              <a
                href="https://github.com/dineshyr29-04"
                target="_blank"
                className="btn-glass btn-glow"
                
              >
                View My Work →
              </a>
              <a
                href="https://www.linkedin.com/in/dinesh-a-122983374/"
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-glass"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>

          {/* Right — Playground */}
          <div className="pg glass-2">
            <div className="pg-top glass-1">
              <div className="pg-dots">
                <span className="dot-r" />
                <span className="dot-y" />
                <span className="dot-g" />
              </div>
              <span className="pg-file">model.py</span>
              <div className="pg-tabs">
                {(["Python", "Bash"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`pg-tab${activeTab === t ? " active" : ""}`}
                    onClick={() => switchTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="pg-body">
              <div className="pg-lnums" ref={lnumsRef}>
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className="pg-ln">
                    {i + 1}
                  </div>
                ))}
              </div>
              <textarea
                ref={editorRef}
                className="pg-editor"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                defaultValue={CODE_TABS.Python.code}
                onInput={syncLines}
                onScroll={syncScroll}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="pg-footer glass-1">
              <span className="pg-hint">Ctrl + Enter to run</span>
              <button
                type="button"
                className="pg-run"
                onClick={() => runCode()}
              >
                ▶ Run
              </button>
            </div>

            <div className="pg-out">
              <div className="pg-out-label">OUTPUT</div>
              <pre className="pg-out-text">
                {outputLines.map((l, i) => (
                  <span key={i}>
                    {l}
                    {"\n"}
                  </span>
                ))}
                {outputDone && <span className="blink-cursor">█</span>}
              </pre>
            </div>
          </div>
        </div>

        {/* Scroll chevron */}
        <div className="scroll-hint">
          <span>scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" className="sec-deep">
        <div className="wrap">
          <div className="label rv">// 01 — ABOUT</div>
          <Shuffle tag="h2" className="sec-h" text={"Precision-driven\nFull-Stack Developer."} duration={0.55} stagger={0.022} />
          <p className="about-p rv d1">
            I'm Dinesh A — an AI/ML Engineer and a Full-Stack Developer focused on building
            production-grade machine learning systems and Web applications that deliver real-world
            impact. My work spans the full ML stack: from research and
            architecture design to deployment and monitoring at scale.
          </p>
          <p className="about-p rv d2">
            I specialize in large language models, prompt Engineering,
            and MLOps pipelines. I believe great ML engineering is about systems
            thinking, clean abstractions, and measurable outcomes — not just
            notebook accuracy scores.
          </p>
          <p className="about-p rv d2">
            When I'm not shipping models, I'm contributing to open-source,
            studying research papers, and exploring the intersection of systems
            engineering and deep learning.
          </p>
          <a
            href="https://www.linkedin.com/in/dinesh-a-122983374/"
            target="_blank"
            rel="noopener noreferrer"
            className="li-chip glass-3 rv d3"
          >
            ↗ linkedin.com/in/dinesh-a-122983374
          </a>
          <div className="stats-row">
            {[
              { n: "2+", l: "Years Exp" },
              { n: "5+", l: "Projects" },
              { n: "3+", l: "Models Deployed" },
            ].map((s, i) => (
              <div
                key={s.l}
                className={`stat-card glass-2 rv${i ? ` d${i}` : ""}`}
              >
                <b>{s.n}</b>
                <small>{s.l}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <section id="skills">
        <div className="wrap">
          <div className="label rv d1">// 02 — SKILLS</div>
          <Shuffle tag="h2" className="sec-h" text={"Technical Expertise"} duration={0.5} stagger={0.025} />
          <div className="skills-grid">
            {SKILL_GROUPS.map(([title, tags], gi) => (
              <div
                key={title}
                className={`skill-group glass-2 rv${gi % 2 ? " d1" : ""}`}
              >
                <div className="sg-title">{title}</div>
                <div className="sg-tags">
                  {tags.map((t) => (
                    <span key={t} className="stag glass-3">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROJECTS ══ */}
      <section id="projects" className="sec-deep">
        <div className="wrap">
          <div className="label rv">// 03 — SELECTED WORK</div>
          <Shuffle tag="h2" className="sec-h" text={"What I've Built"} duration={0.5} stagger={0.025} />

          {/* Rod / rail */}
          <div className="hang-rail rv d2" />


          {/* Static responsive grid for projects */}
          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <div 
                key={p.title}
                className="project-card glass-2"
                style={{ '--delay': `${i * 120}ms`, borderTop: `4px solid ${p.color}` } as React.CSSProperties}
              >
                <div className="project-card-icon" style={{ background: p.color }}>
                  <img
                    src={`/src/assets/${p.photoFile}`}
                    alt={`${p.title} preview`}
                    className="project-card-photo"
                    loading="lazy"
                  />
                </div>
                <div className="project-card-content">
                  <h3 className="project-card-title">{p.title}</h3>
                  <div className="project-card-type">{p.type}</div>
                  <div className="project-card-desc">{p.desc}</div>
                  <div className="project-card-metric">{p.metric}</div>
                  <div className="project-card-stack">
                    {p.stack.map((s) => (
                      <span key={s} className="project-card-chip glass-3">{s}</span>
                    ))}
                  </div>
                  <div className="project-card-actions">
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-card-link"
                      aria-label={`${p.title} repository`}
                    >
                      View Repository
                    </a>
                    {p.liveUrl ? (
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-card-link project-card-link-secondary"
                        aria-label={`${p.title} live project`}
                      >
                        Live Demo
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* ══ EXPERIENCE ══ */}
      <section id="experience">
        <div className="wrap">
          <div className="label rv d1">// 04 — EXPERIENCE</div>
          <Shuffle tag="h2" className="sec-h" text={"Career Timeline"} duration={0.5} stagger={0.025} />
          <div className="tl">
            <div className="tl-line" />
            {EXP_ITEMS.map((exp, i) => (
              <div key={i} className="ei" data-delay={i * 150}>
                <div className="ei-dot" />
                <div className="ei-card glass-2">
                  <div className="ei-meta">
                    <span className="ei-yr glass-3">{exp.period}</span>
                    <span className="ei-co">{exp.company}</span>
                    <span className="ei-role">{exp.role}</span>
                  </div>
                  <p className="ei-desc">{exp.desc}</p>
                  <div className="ei-tags">
                    {exp.tags.map((t) => (
                      <span key={t} className="glass-3">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="sec-deep">
        <div className="wrap ct-wrap">
          <div className="ct-glow" />
          <div className="ct-panel glass-2 rv d1">
            <div className="label">
              // 05 — CONTACT
            </div>
            <h2 className="ct-h">
              Let's build
              <br />
              <em>something real.</em>
            </h2>
            <p className="ct-sub">
              Open to junior frontend engineering roles, research collaborations, and
              high-impact projects. I respond within 24 hours.
            </p>
            <a href="mailto:dineshyr2904@gmail.com" className="ct-email">
              <svg
                width="15"
                height="15"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              dineshyr2904@gmail.com
            </a>
            <div className="ct-socials">
              <a
                href="https://www.linkedin.com/in/dinesh-a-122983374/"
                target="_blank"
                rel="noopener noreferrer"
                className="soc-btn glass-3"
                aria-label="LinkedIn"
              >
                ↗ LinkedIn
              </a>
              <a href="https://github.com/dineshyr29-04" target="_blank" rel="noopener noreferrer" className="soc-btn glass-3" aria-label="GitHub">
                ↗ GitHub
              </a>
              <a href="" className="soc-btn glass-3" aria-label="Resume">
                ↓ Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer>
        <div className="wrap">
          <p>
            Dinesh A &nbsp;·&nbsp;Full Stack Developer &nbsp;·&nbsp; AI/ML Engineer &nbsp;·&nbsp; Built with
            precision &nbsp;·&nbsp; 2025 &nbsp;·&nbsp; Designed by Dinesh A
          </p>
        </div>
      </footer>
    </>
  );
}

