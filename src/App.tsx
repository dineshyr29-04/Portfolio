import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   PLAYGROUND CODE TABS
   ═══════════════════════════════════════════════════════════════ */
const CODE_TABS: Record<string, { code: string; output: string[] }> = {
  Python: {
    code: `import torch
import torch.nn as nn

class TransformerBlock(nn.Module):
    def __init__(self, d=512, h=8):
        super().__init__()
        self.attn = nn.MultiheadAttention(d, h)
        self.norm = nn.LayerNorm(d)
        self.ff = nn.Sequential(
            nn.Linear(d, d*4), nn.GELU(),
            nn.Linear(d*4, d)
        )

    def forward(self, x):
        x = self.norm(x + self.attn(x,x,x)[0])
        return self.norm(x + self.ff(x))

model = TransformerBlock(512, 8)
params = sum(p.numel() for p in model.parameters())
print(f"Parameters: {params:,}")
print(f"Architecture: Transformer (d=512, h=8)")
print(f"Status: Ready for training ✓")`,
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
    ["Docker", "Kubernetes", "MLflow", "Weights & Biases", "FastAPI"],
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
      "Retrieval Augmented Gen.",
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
    type: "MLOps · Inference",
    color: "var(--accent)",
    title: "Real-time ML Inference API",
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
    period: "2022 — Present",
    company: "Tech Company",
    role: "AI/ML Engineer",
    desc: "Architected and deployed production LLM pipelines processing 2M+ daily requests. Led fine-tuning initiatives for domain-specific applications and built internal MLOps tooling adopted across 4 teams.",
    tags: ["LLM", "PyTorch", "MLOps", "AWS", "Python"],
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

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lnumsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>(0);
  const autoRan = useRef(false);

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
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Project card stagger ── */
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".pc");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const d =
              parseInt((e.target as HTMLElement).dataset.i || "0") * 120;
            setTimeout(() => e.target.classList.add("visible"), d);
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    cards.forEach((c) => obs.observe(c));
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
    setTimeout(() => runCodeForTab("Python"), 800);
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
        runCodeForTab(activeTab);
      }
    },
    [syncLines, activeTab]
  );

  const runCodeForTab = useCallback((tab: string) => {
    clearTimeout(timerRef.current);
    setOutputLines([]);
    setOutputDone(false);
    const lines = CODE_TABS[tab]?.output || ["► No output"];
    let i = 0;
    const tick = () => {
      if (i >= lines.length) {
        setOutputDone(true);
        return;
      }
      setOutputLines((prev) => [...prev, lines[i]]);
      i++;
      timerRef.current = window.setTimeout(tick, 160);
    };
    tick();
  }, []);

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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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

  /* ════════════════════════ RENDER ════════════════════════ */
  return (
    <>
      <style>{STYLES}</style>

      {/* Mesh gradient background */}
      <div className="mesh-bg" aria-hidden="true" />
      <div className="dot-grid" aria-hidden="true" />

      {/* ══ NAV ══ */}
      <nav id="nav" role="navigation">
        <div className="wrap nav-row">
          <a
            href="#hero"
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
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
            <h1 className="hero-name">
              DINESH
              <span>    </span><span className="spana">A</span>
              
            </h1>
            <p className="hero-role">
              {"// AI · ML · LLM · MLOps · Production Systems"}
            </p>
            <p className="hero-bio">
              I design and deploy production ML systems — from model
              architecture to inference pipelines — with a focus on reliability,
              efficiency, and real-world impact.
            </p>
            <div className="hero-ctas">
              <a
                href="#projects"
                className="btn-glass btn-glow"
                onClick={(e) => scrollTo(e, "projects")}
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
              <span className="pg-hint">Ctrl+Enter to run</span>
              <button
                type="button"
                className="pg-run"
                onClick={() => runCodeForTab(activeTab)}
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
          <h2 className="sec-h rv d1">
            Precision-driven
            <br />
            ML engineer.
          </h2>
          <p className="about-p rv d1">
            I'm Dinesh A — an AI/ML Engineer focused on building
            production-grade machine learning systems that deliver real-world
            impact. My work spans the full ML stack: from research and
            architecture design to deployment and monitoring at scale.
          </p>
          <p className="about-p rv d2">
            I specialize in large language models, transformer architectures,
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
              { n: "3+", l: "Years Exp" },
              { n: "15+", l: "Projects" },
              { n: "8+", l: "Models Deployed" },
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
          <h2 className="sec-h rv d1">Technical Expertise</h2>
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
          <h2 className="sec-h rv d1">What I've Built</h2>
          <div className="proj-grid">
            {PROJECTS.map((p, i) => (
              <div
                key={p.title}
                className="pc glass-2"
                data-i={i}
                onMouseMove={handleCardMouse}
                onMouseLeave={handleCardLeave}
              >
                {/* Spotlight layer */}
                <div className="pc-spot" />
                {/* Scanline */}
                <div className="pc-scan" />
                {/* Content */}
                <div className="pc-content">
                  <span className="pc-num">
                    {String(i + 1).padStart(2, "0")} ——
                  </span>
                  <span
                    className="pc-type glass-3"
                    style={
                      {
                        "--tc": p.color,
                      } as React.CSSProperties
                    }
                  >
                    {p.type}
                  </span>
                  <h3 className="pc-title">{p.title}</h3>
                  <p className="pc-desc">{p.desc}</p>
                  <div className="pc-metric">{p.metric}</div>
                  <div className="pc-stack">
                    {p.stack.map((s) => (
                      <span key={s} className="glass-3">
                        {s}
                      </span>
                    ))}
                  </div>
                  <a href="#" className="pc-link">
                    View Details →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCE ══ */}
      <section id="experience">
        <div className="wrap">
          <div className="label rv">// 04 — EXPERIENCE</div>
          <h2 className="sec-h rv d1">Career Timeline</h2>
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
            <div className="label" style={{ justifyContent: "center" }}>
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
            <a href="mailto:hello@dinesh.dev" className="ct-email">
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
              hello@dinesh.dev
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
              <a href="#" className="soc-btn glass-3" aria-label="GitHub">
                ↗ GitHub
              </a>
              <a href="#" className="soc-btn glass-3" aria-label="Resume">
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
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════ */
const STYLES = `
/* ─── RESET ─── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --void:#020408;
  --deep:#050b14;
  --glass-bg:rgba(255,255,255,0.04);
  --glass-bg-h:rgba(255,255,255,0.07);
  --glass-border:rgba(255,255,255,0.08);
  --glass-border-h:rgba(255,255,255,0.18);
  --blur-sm:blur(12px);
  --blur-md:blur(16px);
  --blur-lg:blur(48px);
  --text:#f0f4ff;
  --text-muted:rgba(255,255,255,0.45);
  --text-dim:rgba(255,255,255,0.25);
  --accent:#6366f1;
  --accent2:#8b5cf6;
  --accent3:#06b6d4;
  --glow-indigo:rgba(99,102,241,0.25);
  --glow-violet:rgba(139,92,246,0.2);
  --glow-cyan:rgba(6,182,212,0.15);
  --green:#10b981;
}
.spana{color:var(--accent)}
html{scroll-behavior:smooth;font-size:16px}
body{
  background:var(--void);color:var(--text);
  font-family:'Outfit',sans-serif;font-weight:400;
  line-height:1.7;overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
::selection{background:var(--accent);color:#fff}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--void)}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}

/* ─── MESH BG ─── */
.mesh-bg{
  position:fixed;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(ellipse 600px 600px at 15% 10%, rgba(99,102,241,0.15), transparent),
    radial-gradient(ellipse 500px 500px at 85% 8%, rgba(139,92,246,0.12), transparent),
    radial-gradient(ellipse 700px 700px at 50% 95%, rgba(6,182,212,0.08), transparent),
    radial-gradient(ellipse at 50% 50%, var(--void), var(--void));
}
.dot-grid{
  position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.4;
  background-image:radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px);
  background-size:32px 32px;
}

/* ─── LAYOUT ─── */
.wrap{width:100%;margin:0 auto;padding:0 48px;position:relative;z-index:2}
section{padding:120px 0;position:relative;z-index:1}
.sec-deep{background:var(--deep)}

/* ─── GLASS LEVELS ─── */
.glass-1{
  background:rgba(2,4,8,0.7);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border:1px solid rgba(255,255,255,0.06);
}
.glass-2{
  background:var(--glass-bg);
  backdrop-filter:var(--blur-md);-webkit-backdrop-filter:var(--blur-md);
  border:1px solid var(--glass-border);
  border-radius:16px;
  box-shadow:0 8px 32px rgba(0,0,0,0.4),0 1px 0 rgba(255,255,255,0.06) inset,0 -1px 0 rgba(0,0,0,0.3) inset;
  transition:all .35s cubic-bezier(.16,1,.3,1);
}
.glass-2:hover{
  background:var(--glass-bg-h);
  border-color:var(--glass-border-h);
  box-shadow:0 20px 60px rgba(0,0,0,0.5),0 0 40px var(--glow-indigo),0 1px 0 rgba(255,255,255,0.1) inset;
}
.glass-3{
  background:rgba(255,255,255,0.05);
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:6px;
  transition:all .25s cubic-bezier(.16,1,.3,1);
}
.glass-3:hover{
  background:rgba(99,102,241,0.12);
  border-color:rgba(99,102,241,0.35);
  box-shadow:0 0 12px rgba(99,102,241,0.2);
  transform:translateY(-2px);
}

/* ─── NAV ─── */
#nav{
  position:fixed;top:0;left:0;right:0;z-index:200;
  padding:16px 0;
  background:rgba(2,4,8,0.7);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border-bottom:1px solid rgba(255,255,255,0.06);
}
.nav-row{display:flex;align-items:center;justify-content:space-between;gap:24px}
.logo{
  font-family:'Syne',sans-serif;font-weight:800;font-size:20px;
  color:var(--text);text-decoration:none;letter-spacing:-.03em;flex-shrink:0;
}
.logo em{font-style:normal;color:var(--accent2)}
.nav-links{display:flex;gap:32px;list-style:none;flex:1;justify-content:center}
.nav-links a{
  font-family:'Outfit',sans-serif;font-weight:400;font-size:13px;
  color:rgba(255,255,255,0.55);text-decoration:none;letter-spacing:.04em;
  transition:color .2s;
}
.nav-links a:hover,.nav-links a.active{color:#fff}
.nav-right{flex-shrink:0}
.avail-badge{
  display:inline-flex;align-items:center;gap:8px;
  font-family:'JetBrains Mono',monospace;font-size:11px;
  background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);
  color:#34d399;padding:6px 14px;border-radius:9999px;
}
.avail-dot{
  width:6px;height:6px;border-radius:50%;background:#34d399;
  animation:pulse-dot 2s infinite;
}
@keyframes pulse-dot{
  0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)}
  50%{box-shadow:0 0 0 6px rgba(52,211,153,0)}
}

/* Mobile nav */
.mobile-btn{
  display:none;background:none;border:none;cursor:pointer;
  padding:4px;flex-direction:column;gap:5px;
}
.mobile-btn .mb{display:block;width:22px;height:1.5px;background:var(--text);transition:all .3s}
.mobile-btn .mb.open:nth-child(1){transform:rotate(45deg) translate(4px,4px)}
.mobile-btn .mb.open:nth-child(2){opacity:0}
.mobile-btn .mb.open:nth-child(3){transform:rotate(-45deg) translate(4px,-4px)}
.mobile-drawer{
  position:fixed;top:0;right:0;bottom:0;width:280px;z-index:190;
  background:rgba(2,4,8,0.92);backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);
  border-left:1px solid rgba(255,255,255,0.06);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;
  transform:translateX(100%);transition:transform .35s cubic-bezier(.16,1,.3,1);
}
.mobile-drawer.open{transform:translateX(0)}
.mobile-drawer a{
  font-family:'Outfit',sans-serif;font-size:18px;
  color:rgba(255,255,255,0.55);text-decoration:none;transition:color .2s;
}
.mobile-drawer a:hover,.mobile-drawer a.active{color:#fff}

/* ─── HERO ─── */
#hero{min-height:100vh;display:flex;align-items:center;padding-top:80px;overflow:hidden}
.hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.hero-left{display:flex;flex-direction:column;gap:20px}
.hero-badge{
  display:inline-flex;align-items:center;gap:6px;width:fit-content;
  font-family:'JetBrains Mono',monospace;font-size:11px;
  padding:7px 16px;border-radius:9999px;
  background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);
  color:var(--accent);
  box-shadow:0 0 16px rgba(99,102,241,0.15);
  animation:hero-up .6s ease .1s both;
}
.hero-name{
  font-family:'Syne',sans-serif;font-weight:800;
  font-size:clamp(56px,7.5vw,110px);
  line-height:.88;letter-spacing:-.05em;color:var(--text);
  text-shadow:0 0 80px rgba(99,102,241,0.3);
  animation:hero-up .65s ease .25s both;
}
.hero-role{
  font-family:'JetBrains Mono',monospace;font-size:13px;
  color:var(--text-muted);letter-spacing:.06em;
  animation:hero-up .6s ease .4s both;
}
.hero-bio{
  font-weight:300;font-size:15.5px;color:rgba(255,255,255,0.55);
  max-width:480px;line-height:1.85;
  animation:hero-up .6s ease .55s both;
}
.hero-ctas{
  display:flex;gap:12px;flex-wrap:wrap;
  animation:hero-up .6s ease .7s both;
}
.btn-glass{
  display:inline-flex;align-items:center;gap:8px;
  font-family:'JetBrains Mono',monospace;font-size:12px;
  padding:12px 24px;border-radius:10px;cursor:pointer;
  text-decoration:none;white-space:nowrap;
  background:var(--glass-bg);border:1px solid var(--glass-border);
  color:var(--text-muted);
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  transition:all .3s cubic-bezier(.16,1,.3,1);
}
.btn-glass:hover{
  background:var(--glass-bg-h);border-color:var(--glass-border-h);color:var(--text);
  box-shadow:0 0 24px rgba(99,102,241,0.15);
}
.btn-glow{
  background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.4);
  color:var(--text);
  box-shadow:0 0 20px rgba(99,102,241,0.2);
}
.btn-glow:hover{
  box-shadow:0 0 40px rgba(99,102,241,0.4);
  background:rgba(99,102,241,0.22);border-color:rgba(99,102,241,0.6);
}
@keyframes hero-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}

/* Scroll hint */
.scroll-hint{
  position:absolute;bottom:32px;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:6px;
  color:var(--text-dim);font-family:'JetBrains Mono',monospace;font-size:10px;
  letter-spacing:.15em;text-transform:uppercase;
  animation:float-y 2.5s ease-in-out infinite;
}
@keyframes float-y{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}

/* ─── PLAYGROUND ─── */
.pg{
  border-radius:16px;overflow:hidden;display:flex;flex-direction:column;
  max-height:520px;
  box-shadow:0 32px 80px rgba(0,0,0,0.6);
  animation:pg-in .7s ease .5s both;
}
@keyframes pg-in{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:translateX(0)}}
.pg-top{
  display:flex;align-items:center;gap:12px;
  padding:10px 16px;border-radius:0;border-bottom:1px solid rgba(255,255,255,0.06);
  flex-shrink:0;
}
.pg-dots{display:flex;gap:6px}
.dot-r,.dot-y,.dot-g{width:10px;height:10px;border-radius:50%}
.dot-r{background:#ff5f57}.dot-y{background:#febc2e}.dot-g{background:#28c840}
.pg-file{
  font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--text-dim);flex:1;
}
.pg-tabs{display:flex;gap:4px}
.pg-tab{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  padding:4px 12px;border-radius:6px;cursor:pointer;
  background:transparent;border:1px solid transparent;
  color:var(--text-dim);transition:all .2s;
}
.pg-tab.active{
  background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.1);color:var(--text);
}
.pg-body{display:flex;flex:1;overflow:hidden}
.pg-lnums{
  padding:14px 0;min-width:38px;
  display:flex;flex-direction:column;align-items:center;
  overflow:hidden;flex-shrink:0;border-right:1px solid rgba(255,255,255,0.04);
  background:rgba(0,0,0,0.15);
}
.pg-ln{
  font-family:'JetBrains Mono',monospace;font-size:11px;
  color:rgba(255,255,255,0.18);line-height:1.56;
}
.pg-editor{
  flex:1;background:transparent;border:none;outline:none;resize:none;
  font-family:'JetBrains Mono',monospace;font-size:12px;
  color:rgba(255,255,255,0.7);padding:14px;line-height:1.56;
  caret-color:var(--accent2);tab-size:2;overflow:auto;
}
.pg-editor::selection{background:rgba(99,102,241,0.25)}
.pg-footer{
  display:flex;align-items:center;justify-content:space-between;
  padding:8px 16px;border-radius:0;
  border-top:1px solid rgba(255,255,255,0.04);flex-shrink:0;
}
.pg-hint{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--text-dim)}
.pg-run{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  padding:5px 14px;border-radius:6px;cursor:pointer;
  background:rgba(99,102,241,0.2);border:1px solid rgba(99,102,241,0.4);
  color:var(--text);transition:all .2s;
}
.pg-run:hover{background:rgba(99,102,241,0.35);box-shadow:0 0 16px rgba(99,102,241,0.3)}
.pg-out{
  border-top:1px solid rgba(255,255,255,0.04);
  background:rgba(0,0,0,0.2);padding:12px 16px;
  min-height:72px;max-height:100px;overflow:auto;flex-shrink:0;
}
.pg-out-label{
  font-family:'JetBrains Mono',monospace;font-size:9px;
  color:var(--text-dim);letter-spacing:.12em;margin-bottom:4px;
}
.pg-out-text{
  font-family:'JetBrains Mono',monospace;font-size:11.5px;
  color:#7ff0aa;white-space:pre-wrap;line-height:1.55;margin:0;
}
.blink-cursor{animation:blink 1s step-end infinite;color:var(--accent2)}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

/* ─── COMMON SECTION ─── */
.label{
  font-family:'JetBrains Mono',monospace;font-size:11px;
  color:var(--accent);letter-spacing:.15em;text-transform:uppercase;
  margin-bottom:16px;display:flex;align-items:center;gap:10px;
}
.label::before{content:'';width:20px;height:1px;background:var(--accent);flex-shrink:0}
.sec-h{
  font-family:'Syne',sans-serif;font-weight:700;
  font-size:clamp(28px,3.5vw,44px);letter-spacing:-.03em;
  line-height:1.1;margin-bottom:32px;color:var(--text);
}

/* ─── ABOUT ─── */
.about-p{font-weight:300;font-size:15.5px;color:var(--text-muted);line-height:1.85;margin-bottom:14px}
.li-chip{
  display:inline-flex;align-items:center;gap:6px;margin-top:16px;
  font-family:'JetBrains Mono',monospace;font-size:11px;
  color:var(--accent2);text-decoration:none;padding:6px 14px;
  border-radius:6px;
}
.stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:40px}
.stat-card{padding:24px 20px;text-align:center;border-radius:16px}
.stat-card b{
  display:block;font-family:'Syne',sans-serif;font-weight:800;
  font-size:36px;color:var(--text);letter-spacing:-.03em;
  text-shadow:0 0 30px var(--accent);
}
.stat-card small{
  font-family:'JetBrains Mono',monospace;font-size:9.5px;
  color:var(--text-dim);letter-spacing:.1em;text-transform:uppercase;
  margin-top:4px;display:block;
}

/* ─── SKILLS ─── */
.skills-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.skill-group{padding:28px;border-radius:16px}
.sg-title{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--accent);letter-spacing:.14em;text-transform:uppercase;
  margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.06);
}
.sg-tags{display:flex;flex-wrap:wrap;gap:8px}
.stag{
  font-family:'JetBrains Mono',monospace;font-size:11px;
  color:var(--text-muted);padding:6px 14px;cursor:default;
}

/* ─── PROJECTS ─── */
.proj-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:22px}
.pc{
  position:relative;overflow:hidden;border-radius:16px;
  transition:all .35s cubic-bezier(.16,1,.3,1);
  opacity:0;transform:translateY(32px);
  will-change:transform;
}
.pc.visible{opacity:1;transform:translateY(0)}
.pc:hover{
  border-color:var(--glass-border-h);
  box-shadow:0 32px 80px rgba(99,102,241,0.2),0 0 40px var(--glow-indigo),0 1px 0 rgba(255,255,255,0.1) inset;
}
.pc:hover .pc-scan{animation:scan-sweep .8s ease forwards}
.pc:hover .pc-title{color:var(--accent)}

/* Spotlight */
.pc-spot{
  position:absolute;inset:0;pointer-events:none;z-index:1;opacity:0;
  background:radial-gradient(300px circle at var(--spot-x,50%) var(--spot-y,50%), rgba(99,102,241,0.12), transparent 60%);
  transition:opacity .3s;
}
.pc:hover .pc-spot{opacity:1}

/* Scanline */
.pc-scan{
  position:absolute;left:0;right:0;height:1px;top:-1px;z-index:2;
  background:linear-gradient(90deg,transparent,rgba(139,92,246,0.8),transparent);
  pointer-events:none;opacity:0;
}
@keyframes scan-sweep{0%{top:-1px;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0}}

/* Content */
.pc-content{position:relative;z-index:10;padding:32px}
.pc-num{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--text-dim);letter-spacing:.15em;display:block;margin-bottom:14px;
}
.pc-type{
  display:inline-block;font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--tc,var(--accent2));padding:3px 10px;
  border-color:color-mix(in srgb, var(--tc,var(--accent2)) 30%, transparent);
  margin-bottom:16px;
}
.pc-title{
  font-family:'Syne',sans-serif;font-weight:700;font-size:20px;
  color:var(--text);letter-spacing:-.02em;line-height:1.2;
  margin-bottom:12px;transition:color .3s;
}
.pc-desc{font-weight:300;font-size:14px;color:var(--text-muted);line-height:1.8;margin-bottom:20px}
.pc-metric{
  font-family:'JetBrains Mono',monospace;font-size:11.5px;
  color:var(--green);margin-bottom:18px;
  padding-left:12px;border-left:2px solid rgba(16,185,129,0.4);
  display:flex;align-items:center;gap:6px;
  background:rgba(16,185,129,0.06);padding:8px 12px;border-radius:6px;
}
.pc-stack{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px}
.pc-stack span{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--text-dim);padding:3px 8px;
}
.pc-link{
  font-family:'JetBrains Mono',monospace;font-size:11px;
  color:var(--accent2);text-decoration:none;letter-spacing:.05em;
  display:inline-flex;align-items:center;gap:6px;
  transition:gap .2s,color .2s;
}
.pc-link:hover{gap:11px;color:#c084fc}

/* ─── EXPERIENCE ─── */
.tl{position:relative;padding-left:40px}
.tl-line{
  position:absolute;left:5px;top:10px;bottom:0;width:1px;
  background:linear-gradient(var(--accent),rgba(99,102,241,0.1),transparent);
  box-shadow:0 0 8px var(--accent);
}
.ei{position:relative;margin-bottom:24px;opacity:0;transform:translateX(-20px);transition:all .6s cubic-bezier(.16,1,.3,1)}
.ei.visible{opacity:1;transform:translateX(0)}
.ei:last-child{margin-bottom:0}
.ei-dot{
  position:absolute;left:-40px;top:24px;width:12px;height:12px;
  border-radius:50%;border:2px solid var(--accent);background:var(--void);
  box-shadow:0 0 12px rgba(99,102,241,0.4);
  z-index:3;
}
.ei-dot::after{
  content:'';position:absolute;inset:2px;border-radius:50%;
  background:var(--accent);opacity:0;transition:opacity .3s;
}
.ei:hover .ei-dot::after{opacity:1}
.ei-card{padding:28px 32px;border-radius:16px}
.ei-meta{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px}
.ei-yr{
  font-family:'JetBrains Mono',monospace;font-size:10.5px;
  color:var(--text-dim);padding:4px 10px;
}
.ei-co{font-family:'Syne',sans-serif;font-weight:700;font-size:17px;color:var(--text)}
.ei-role{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--accent2);background:rgba(139,92,246,0.1);
  border:1px solid rgba(139,92,246,0.2);padding:3px 10px;border-radius:9999px;
}
.ei-desc{font-weight:300;font-size:14px;color:var(--text-muted);line-height:1.82;margin-bottom:12px;max-width:620px}
.ei-tags{display:flex;flex-wrap:wrap;gap:6px}
.ei-tags span{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--text-dim);padding:3px 8px;
}

/* ─── CONTACT ─── */
.ct-wrap{display:flex;justify-content:center;position:relative}
.ct-glow{
  position:absolute;width:500px;height:500px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(99,102,241,0.12) 0%,rgba(139,92,246,0.06) 40%,transparent 70%);
  top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:0;
}
.ct-panel{
  max-width:680px;width:100%;text-align:center;padding:56px 48px;
  border-radius:16px;position:relative;z-index:2;
}
.ct-h{
  font-family:'Syne',sans-serif;font-weight:800;
  font-size:clamp(32px,5vw,56px);letter-spacing:-.05em;
  line-height:1;margin-bottom:18px;color:var(--text);
}
.ct-h em{font-style:normal;color:var(--accent2)}
.ct-sub{font-weight:300;font-size:15px;color:var(--text-muted);max-width:420px;margin:0 auto 36px;line-height:1.82}
.ct-email{
  display:inline-flex;align-items:center;gap:10px;
  font-family:'JetBrains Mono',monospace;font-size:14px;
  color:var(--text);text-decoration:none;
  background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);
  border-radius:10px;padding:14px 28px;margin-bottom:32px;
  box-shadow:0 0 30px rgba(99,102,241,0.2);
  transition:all .3s cubic-bezier(.16,1,.3,1);
}
.ct-email:hover{
  box-shadow:0 0 50px rgba(99,102,241,0.35);background:rgba(99,102,241,0.18);
  border-color:rgba(99,102,241,0.5);
}
.ct-socials{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
.soc-btn{
  display:inline-flex;align-items:center;gap:6px;
  font-family:'JetBrains Mono',monospace;font-size:11px;
  color:var(--text-muted);text-decoration:none;
  padding:9px 18px;
}

/* ─── FOOTER ─── */
footer{padding:28px 0;border-top:1px solid rgba(255,255,255,0.04);text-align:center;position:relative;z-index:1}
footer p{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text-dim);letter-spacing:.06em}

/* ─── SCROLL REVEAL ─── */
.rv{opacity:0;transform:translateY(32px);transition:opacity .7s ease,transform .7s ease}
.rv.visible{opacity:1;transform:translateY(0)}
.d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}

/* ─── RESPONSIVE ─── */
@media(max-width:1024px){
  .wrap{padding:0 32px}
  .hero-grid{grid-template-columns:1fr;gap:40px}
  .pg{animation:hero-up .7s ease .5s both}
  .skills-grid{grid-template-columns:1fr}
  .proj-grid{grid-template-columns:1fr}
}
@media(max-width:768px){
  section{padding:80px 0}
  .wrap{padding:0 20px}
  .nav-links{display:none}
  .nav-right{display:none}
  .mobile-btn{display:flex}
  .hero-name{font-size:clamp(40px,12vw,64px)}
  .stats-row{grid-template-columns:1fr}
  .skills-grid{grid-template-columns:1fr}
  .proj-grid{grid-template-columns:1fr}
  .ct-panel{padding:40px 24px}
  .tl{padding-left:32px}
  .ei-dot{left:-32px}
  .ei-card{padding:20px}
  .ei-meta{flex-direction:column;align-items:flex-start;gap:6px}
}
@media(max-width:480px){
  section{padding:60px 0}
  .wrap{padding:0 16px}
  .hero-ctas{flex-direction:column}
  .ct-h{font-size:28px}
  .hero-name{font-size:clamp(36px,11vw,52px)}
  .pc-content{padding:24px}
  .ct-socials{flex-direction:column;align-items:center}
}
`;
