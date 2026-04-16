import { useState, useEffect, useRef, useCallback } from "react";
import Shuffle from './Shuffle';
import './Shuffle.css';
import DarkVeil from './DarkVeil';
import { PortfolioSkeleton } from './components/Skeleton';
import './App.css';



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
  [
    "MLOps & Infrastructure",
    ["K-means Clustering"],
  ],
  ["Languages", ["Python", "SQL", "Bash", "C++", "TypeScript", "JavaScript"]],
  ["Backend & Cloud", ["Node.js", "Express.js", "MongoDB", "MySQL"]],
  [
    "Research Areas",
    [
      "Large Language Models",
      "Diffusion Models",
      "Reinforcement Learning",
      "K-means Clustering",
      
    ],
  ],
  ["Tools & Workflow", ["Git", "Linux", "Jupyter", "VS Code"]],
];

const PROJECTS = [
  {
    type: "AI Triage System",
    color: "var(--accent2)",
    title: "Cardio Nerve",
    desc: "End-to-end fine-tuning system for domain-specific LLMs using LoRA/QLoRA. Handles data curation, distributed training, evaluation, and model registry with full experiment tracking.",
    metric: "34% accuracy gain · 80% memory reduction",
    stack: ["Python", "Arduino coding", "Next.js"],
  },
  {
    type: "AI assisted farming assist",
    color: "var(--accent)",
    title: "Agro Nova",
    desc: "High-throughput REST API serving multiple ML models simultaneously with dynamic batching, model versioning, and Kubernetes auto-scaling. Built for production reliability.",
    metric: "10k+ req/sec · p99 latency <80ms",
    stack: ["FastAPI", "Triton", "Kubernetes", "Redis", "Prometheus"],
  },
  {
    type: "RAG · NLP",
    color: "var(--accent2)",
    title: "RAG Knowledge System",
    desc: "Production RAG pipeline with hybrid semantic + BM25 retrieval, cross-encoder re-ranking, and citation tracking. Powers an internal enterprise Q&A assistant.",
    metric: "89% answer accuracy on domain queries",
    stack: ["LangChain", "Qdrant", "FastAPI", "PostgreSQL", "GPT-4"],
  },
  {
    type: "Computer Vision",
    color: "var(--accent3)",
    title: "Automated Defect Detection",
    desc: "Real-time CV pipeline for manufacturing defect detection deployed on edge GPUs. Replaced manual QA inspection process entirely with continuous model drift monitoring.",
    metric: "97.3% precision · fully replaced manual QA",
    stack: ["PyTorch", "ONNX", "OpenCV", "Docker", "Edge GPU"],
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
  {
    period: "2020 — 2022",
    company: "ML Startup",
    role: "ML Engineer",
    desc: "Built recommendation and ranking systems serving real-time inference. Reduced model serving latency 60% through quantization and batching optimizations. Deployed CV models to edge devices.",
    tags: ["Inference", "TensorFlow", "FastAPI", "Docker"],
  },
  {
    period: "2019 — 2020",
    company: "Analytics Firm",
    role: "Junior Data Scientist",
    desc: "Developed predictive models for customer churn and demand forecasting. Automated data pipelines reducing manual reporting by 80%. Worked directly with product and business stakeholders.",
    tags: ["Scikit-learn", "SQL", "Python", "Airflow"],
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Python" | "Bash">("Python");
  const [lineCount, setLineCount] = useState(
    CODE_TABS.Python.code.split("\n").length
  );
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [outputDone, setOutputDone] = useState(false);
  const [carIdx, setCarIdx] = useState(0);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lnumsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>(0);
  const autoRan = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  /* ── Loader simulate ── */
  useEffect(() => {
    // Artificial delay to show the skeleton loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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

  /* ── Project card 3D tilt + spotlight ── */
  const handleCardMouse = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -8;
      const rotateY = ((x - cx) / cx) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
      card.style.setProperty("--spot-x", `${x}px`);
      card.style.setProperty("--spot-y", `${y}px`);
    },
    []
  );

  const handleCardLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.transform = "";
    },
    []
  );

  /* ── Carousel navigation ── */
  const scrollCarousel = useCallback((dir: -1 | 1) => {
    setCarIdx((prev) => {
      const next = prev + dir;
      if (next < 0 || next >= PROJECTS.length) return prev;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!trackRef.current) return;
    const card = trackRef.current.children[carIdx] as HTMLElement | undefined;
    if (card) {
      trackRef.current.scrollTo({
        left: card.offsetLeft - trackRef.current.offsetWidth / 2 + card.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  }, [carIdx]);

  /* ════════════════════════ RENDER ════════════════════════ */
  return (
    <>
      {isLoading && <PortfolioSkeleton />}
      
      <div style={{ 
        opacity: isLoading ? 0 : 1, 
        visibility: isLoading ? 'hidden' : 'visible',
        transition: 'opacity 0.5s ease-in-out',
        height: isLoading ? '100vh' : 'auto',
        overflow: isLoading ? 'hidden' : 'visible'
      }}>
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
            D<em>.</em>A
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

      {/* Mobile overlay */}
      <div
        className={`mobile-overlay${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

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
        <div className="wrap hero-grid">
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
          <div className="label rv">// 02 — SKILLS</div>
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

          {/* Carousel wrapper */}
          <div className="hang-carousel">
            <button
              className="car-arrow car-prev"
              onClick={() => scrollCarousel(-1)}
              disabled={carIdx === 0}
              aria-label="Previous project"
            >
              ‹
            </button>

            <div className="hang-track" ref={trackRef}>
              {PROJECTS.map((p, i) => (
                <div
                  key={p.title}
                  className={`hang-item${carIdx === i ? " active" : ""}`}
                >
                  {/* Thread from rail to card */}
                  <div className="hang-thread">
                    <div className="hang-knot" />
                  </div>

                  {/* The card */}
                  <div
                    className="pc glass-2"
                    data-i={i}
                    onMouseMove={handleCardMouse}
                    onMouseLeave={handleCardLeave}
                    onClick={() => setCarIdx(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setCarIdx(i);
                    }}
                  >
                    <div className="pc-spot" />
                    <div className="pc-scan" /> 
                    <div className="pc-content">
                      <span className="pc-num">
                        {String(i + 1).padStart(2, "0")} ——
                      </span>
                      <span
                        className="pc-type glass-3"
                        style={{ "--tc": p.color } as React.CSSProperties}
                      >
                        {p.type}
                      </span>
                      <h3 className="pc-title">{p.title}</h3>
                      <p className="pc-desc">{p.desc}</p>
                      <div className="pc-metric">{p.metric}</div>
                    </div>
                  </div>

                  {/* Threads down to each tech pill */}
                  <div className="hang-branches">
                    {p.stack.map((s, si) => (
                      <div
                        key={s}
                        className="branch"
                        style={{ "--bi": si } as React.CSSProperties}
                      >
                        <div className="branch-wire" />
                        <span className="branch-pill glass-3">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="car-arrow car-next"
              onClick={() => scrollCarousel(1)}
              disabled={carIdx === PROJECTS.length - 1}
              aria-label="Next project"
            >
              ›
            </button>
          </div>

          {/* Dot indicators */}
          <div className="car-dots rv d3">
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                className={`car-dot${carIdx === i ? " on" : ""}`}
                onClick={() => setCarIdx(i)}
                aria-label={`Go to project ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCE ══ */}
      <section id="experience">
        <div className="wrap">
          <div className="label rv">// 04 — EXPERIENCE</div>
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
          <div className="ct-panel glass-2 rv">
            <div className="label">
              // 05 — CONTACT
            </div>
            <h2 className="ct-h">
              Let's build
              <br />
              <em>something real.</em>
            </h2>
            <p className="ct-sub">
              Open to senior ML engineering roles, research collaborations, and
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
            Dinesh A &nbsp;·&nbsp; AI/ML Engineer &nbsp;·&nbsp; Built with
            precision &nbsp;·&nbsp; 2025
          </p>
        </div>
      </footer>
      </div>
    </>
  );
}

