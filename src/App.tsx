import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   Default code for the interactive playground
   ═══════════════════════════════════════════════════════════════ */
const DEFAULT_CODE = `import torch
import torch.nn as nn

class TransformerBlock(nn.Module):
    def __init__(self, d_model=512, heads=8):
        super().__init__()
        self.attn = nn.MultiheadAttention(
            d_model, heads, batch_first=True
        )
        self.norm = nn.LayerNorm(d_model)
        self.ff = nn.Sequential(
            nn.Linear(d_model, d_model * 4),
            nn.GELU(),
            nn.Linear(d_model * 4, d_model)
        )

    def forward(self, x):
        out, _ = self.attn(x, x, x)
        x = self.norm(x + out)
        return self.norm(x + self.ff(x))

model = TransformerBlock(512, 8)
params = sum(p.numel() for p in model.parameters())
print(f"Params: {params:,}")
print(f"Architecture: Transformer (d=512, h=8)")
print(f"Status: Ready for training ✓")`;

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
    "ML & AI",
    [
      "PyTorch", "TensorFlow", "HuggingFace", "Transformers",
      "Scikit-learn", "XGBoost", "ONNX", "LangChain",
      "RAG Systems", "LoRA / QLoRA",
    ],
  ],
  [
    "MLOps & Infrastructure",
    [
      "Docker", "Kubernetes", "MLflow", "Weights & Biases",
      "FastAPI", "Triton", "Redis", "PostgreSQL",
      "Prometheus", "Celery",
    ],
  ],
  ["Languages", ["Python", "SQL", "Bash", "C++", "TypeScript"]],
  [
    "Cloud & Platforms",
    ["AWS SageMaker", "AWS EC2 / S3", "GCP Vertex AI", "Azure ML", "Lambda"],
  ],
  [
    "Research Areas",
    [
      "Large Language Models", "Diffusion Models",
      "Reinforcement Learning", "Model Quantization",
      "Retrieval Augmented Gen.",
    ],
  ],
  [
    "Tools & Workflow",
    ["Git", "Linux", "Jupyter", "Airflow", "Terraform", "VS Code"],
  ],
];

const PROJECTS = [
  {
    type: "LLM Fine-tuning",
    title: "Domain-Adapted LLM Pipeline",
    desc: "End-to-end fine-tuning system for domain-specific LLMs using LoRA/QLoRA. Handles data curation, distributed training, evaluation, and model registry with full experiment tracking.",
    metric: "34% accuracy gain \u00B7 80% memory reduction",
    stack: ["PyTorch", "HuggingFace", "LoRA", "W&B", "SageMaker"],
  },
  {
    type: "MLOps \u00B7 Inference",
    title: "Real-time ML Inference API",
    desc: "High-throughput REST API serving multiple ML models simultaneously with dynamic batching, model versioning, and Kubernetes auto-scaling. Built for production reliability.",
    metric: "10k+ req/sec \u00B7 p99 latency <80ms",
    stack: ["FastAPI", "Triton", "Kubernetes", "Redis", "Prometheus"],
  },
  {
    type: "RAG \u00B7 NLP",
    title: "RAG Knowledge System",
    desc: "Production RAG pipeline with hybrid semantic + BM25 retrieval, cross-encoder re-ranking, and citation tracking. Powers an internal enterprise Q&A assistant.",
    metric: "89% answer accuracy on domain queries",
    stack: ["LangChain", "Qdrant", "FastAPI", "PostgreSQL", "GPT-4"],
  },
  {
    type: "Computer Vision",
    title: "Automated Defect Detection",
    desc: "Real-time CV pipeline for manufacturing defect detection deployed on edge GPUs. Replaced manual QA inspection process entirely with continuous model drift monitoring.",
    metric: "97.3% precision \u00B7 fully replaced manual QA",
    stack: ["PyTorch", "ONNX", "OpenCV", "Docker", "Edge GPU"],
  },
];

const EXP_ITEMS = [
  {
    period: "2022 \u2014 Present",
    company: "Tech Company",
    role: "AI/ML Engineer",
    desc: "Architected and deployed production LLM pipelines processing 2M+ daily requests. Led fine-tuning initiatives for domain-specific applications and built internal MLOps tooling adopted across 4 teams.",
    tags: ["LLM", "PyTorch", "MLOps", "AWS", "Python"],
  },
  {
    period: "2020 \u2014 2022",
    company: "ML Startup",
    role: "ML Engineer",
    desc: "Built recommendation and ranking systems serving real-time inference. Reduced model serving latency 60% through quantization and batching optimizations. Deployed CV models to edge devices.",
    tags: ["Inference", "TensorFlow", "FastAPI", "Docker"],
  },
  {
    period: "2019 \u2014 2020",
    company: "Analytics Firm",
    role: "Junior Data Scientist",
    desc: "Developed predictive models for customer churn and demand forecasting. Automated data pipelines reducing manual reporting by 80%. Worked directly with product and business stakeholders.",
    tags: ["Scikit-learn", "SQL", "Python", "Airflow"],
  },
];

/* ═══════════════════════════════════════════════════════════════
   APP COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [lineCount, setLineCount] = useState(DEFAULT_CODE.split("\n").length);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [outputDone, setOutputDone] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lnumsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>(0);

  /* ── Nav scroll + active section detection ── */
  useEffect(() => {
    const handler = () => {
      setNavScrolled(window.scrollY > 60);
      const secs = document.querySelectorAll<HTMLElement>("section[id]");
      let cur = "";
      secs.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 160) cur = s.id;
      });
      setActiveSection(cur);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* ── Scroll reveal: .rev elements ── */
  useEffect(() => {
    const els = document.querySelectorAll(".rev");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Project card stagger reveal ── */
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".pc");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const d =
              parseInt((e.target as HTMLElement).dataset.i || "0") * 100;
            setTimeout(() => e.target.classList.add("in"), d);
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  /* ── Experience timeline reveal ── */
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".ei");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const d = parseInt(
              (e.target as HTMLElement).dataset.delay || "0"
            );
            setTimeout(() => e.target.classList.add("in"), d);
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    items.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Cleanup output timer ── */
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
    },
    [syncLines]
  );

  const runCode = useCallback(() => {
    clearTimeout(timerRef.current);
    setOutputLines([]);
    setOutputDone(false);

    const code = editorRef.current?.value || "";
    const lines: string[] = [];
    const re = /print\(f?["'`](.*?)["'`]\)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(code)) !== null) {
      let out = m[1];
      out = out.replace(/\{params:,\}/g, "4,722,176");
      out = out.replace(/\{params\}/g, "4722176");
      out = out.replace(/\{([^}]+)\}/g, (_: string, expr: string) => {
        if (expr.includes("params")) return "4,722,176";
        if (expr.includes("d_model")) return "512";
        if (expr.includes("heads")) return "8";
        return `<${expr}>`;
      });
      lines.push(out);
    }
    if (!lines.length) {
      lines.push("\u25ba Execution complete");
      lines.push("\u25ba No output statements found");
    }

    let i = 0;
    const tick = () => {
      if (i >= lines.length) {
        setOutputDone(true);
        return;
      }
      setOutputLines((prev) => [...prev, lines[i]]);
      i++;
      timerRef.current = window.setTimeout(tick, 190);
    };
    tick();
  }, []);

  /* ── Smooth anchor click ── */
  const scrollTo = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    },
    []
  );

  /* ════════════════════════ RENDER ════════════════════════ */
  return (
    <>
      <style>{STYLES}</style>

      {/* ══ NAV ══ */}
      <nav id="nav" className={navScrolled ? "scrolled" : ""}>
        <div className="wrap">
          <div className="nav-row">
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

            {/* Desktop links */}
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

            {/* Mobile hamburger */}
            <button
              className="mobile-toggle"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className={`bar${menuOpen ? " open" : ""}`} />
              <span className={`bar${menuOpen ? " open" : ""}`} />
              <span className={`bar${menuOpen ? " open" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-menu">
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
      )}

      {/* ══ HERO ══ */}
      <section id="hero">
        <div className="wrap">
          <div className="hero-grid">
            {/* Left: identity */}
            <div>
              <p className="hero-eyebrow">
                AI / ML Engineer &middot; Researcher &middot; Builder
              </p>
              <h1 className="hero-name">
                Dinesh
                <br />
                <span className="violet">A.</span>
              </h1>
              <p className="hero-role">
                Building systems that learn &amp; scale.
              </p>
              <p className="hero-bio">
                I design and deploy production ML systems — from model
                architecture to inference pipelines — with a focus on
                reliability, efficiency, and real-world impact.
              </p>
              <div className="ctas">
                <a
                  href="#projects"
                  className="btn btn-v"
                  onClick={(e) => scrollTo(e, "projects")}
                >
                  View My Work &rarr;
                </a>
                <a
                  href="https://www.linkedin.com/in/dinesh-a-122983374/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-o"
                >
                  LinkedIn &nearr;
                </a>
              </div>
            </div>

            {/* Right: Code Playground */}
            <div className="playground">
              <div className="pg-header">
                <div className="dots">
                  <div className="dot r" />
                  <div className="dot y" />
                  <div className="dot g" />
                </div>
                <span className="pg-fname">playground.py — editable</span>
                <button className="run" onClick={runCode} type="button">
                  &#9654; Run
                </button>
              </div>
              <div className="pg-editor">
                <div className="lnums" ref={lnumsRef}>
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i} className="lnum">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <textarea
                  ref={editorRef}
                  id="editor"
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  defaultValue={DEFAULT_CODE}
                  onInput={syncLines}
                  onScroll={syncScroll}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="pg-out">
                <div className="out-lbl">OUTPUT &rsaquo;</div>
                <div id="output">
                  {outputLines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {"\n"}
                    </span>
                  ))}
                  {outputDone && <span className="cursor" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about">
        <div className="wrap">
          <div>
              <div className="label rev">01 — About</div>
              <h2 className="about-h rev d1">
                Precision-driven
                <br />
                ML engineer.
              </h2>
              <p className="about-p rev d1">
                I'm Dinesh A — an AI/ML Engineer focused on building
                production-grade machine learning systems that deliver
                real-world impact. My work spans the full ML stack: from
                research and architecture design to deployment and monitoring at
                scale.
              </p>
              <p className="about-p rev d2">
                I specialize in large language models, transformer
                architectures, and MLOps pipelines. I believe great ML
                engineering is about systems thinking, clean abstractions, and
                measurable outcomes — not just notebook accuracy scores.
              </p>
              <p className="about-p rev d2">
                When I'm not shipping models, I'm contributing to open-source,
                studying research papers, and exploring the intersection of
                systems engineering and deep learning.
              </p>
              <a
                href="https://www.linkedin.com/in/dinesh-a-122983374/"
                target="_blank"
                rel="noopener noreferrer"
                className="li-link rev d3"
              >
                &nearr; linkedin.com/in/dinesh-a-122983374
              </a>

              <div className="stats">
                <div className="stat rev">
                  <b>3+</b>
                  <small>Years Exp</small>
                </div>
                <div className="stat rev d1">
                  <b>15+</b>
                  <small>Projects</small>
                </div>
                <div className="stat rev d2">
                  <b>8+</b>
                  <small>Models Deployed</small>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <section id="skills">
        <div className="wrap">
          <div className="label rev">02 — Skills</div>
          <h2 className="skills-h rev d1">Technical Expertise</h2>
          <div className="skills-grid">
            {SKILL_GROUPS.map(([title, tags], gi) => (
              <div key={title} className={`rev${gi % 2 ? " d1" : ""}`}>
                <div className="sg-title">{title}</div>
                <div className="tags">
                  {tags.map((t) => (
                    <span key={t} className="tag">
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
      <section id="projects">
        <div className="wrap">
          <div className="label rev">03 — Selected Work</div>
          <h2 className="projects-h rev d1">What I've Built</h2>
          <div className="pg-grid">
            {PROJECTS.map((p, i) => (
              <div key={p.title} className="pc" data-i={i}>
                <span className="pc-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="pc-type">{p.type}</span>
                <h3 className="pc-title">{p.title}</h3>
                <p className="pc-desc">{p.desc}</p>
                <div className="pc-metric">{p.metric}</div>
                <div className="pc-stack">
                  {p.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
                <a href="#" className="pc-link">
                  View Details &rarr;
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ EXPERIENCE ══ */}
      <section id="experience">
        <div className="wrap">
          <div className="label rev">04 — Experience</div>
          <h2 className="exp-h rev d1">Career Timeline</h2>
          <div className="timeline">
            {EXP_ITEMS.map((exp, i) => (
              <div key={i} className="ei" data-delay={i * 120}>
                <div className="ei-dot" />
                <div className="ei-meta">
                  <span className="ei-yr">{exp.period}</span>
                  <span className="ei-co">{exp.company}</span>
                  <span className="ei-role">{exp.role}</span>
                </div>
                <p className="ei-desc">{exp.desc}</p>
                <div className="ei-tags">
                  {exp.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact">
        <div className="wrap">
          <div className="ct-inner">
            <div className="label rev" style={{ justifyContent: "center" }}>
              05 — Contact
            </div>
            <h2 className="ct-h rev d1">
              Let's build
              <br />
              <em>something real.</em>
            </h2>
            <p className="ct-sub rev d2">
              Open to senior ML engineering roles, research collaborations, and
              high-impact projects. I respond within 24 hours.
            </p>
            <a href="mailto:hello@dinesh.dev" className="ct-email rev d2">
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
            <div className="ct-socials rev d3">
              <a
                href="https://www.linkedin.com/in/dinesh-a-122983374/"
                target="_blank"
                rel="noopener noreferrer"
                className="soc"
              >
                &nearr; LinkedIn
              </a>
              <a href="#" className="soc">
                &nearr; GitHub
              </a>
              <a href="#" className="soc">
                &darr; Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer>
        <div className="wrap">
          <p>
            Dinesh A &nbsp;&middot;&nbsp; AI/ML Engineer &nbsp;&middot;&nbsp;
            Built with precision &nbsp;&middot;&nbsp; 2025
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
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#07070f;
  --surface:#0d0d1a;
  --surface2:#111120;
  --border:#1c1c2e;
  --border2:#252540;
  --text:#eeeef5;
  --muted:#5a5a75;
  --muted2:#8888a8;
  --accent:#7c3aed;
  --accent2:#a855f7;
  --accent-glow:rgba(124,58,237,0.15);
  --green:#10b981;
}

html{scroll-behavior:smooth;font-size:16px}

body{
  background:var(--bg);
  color:var(--text);
  font-family:'DM Sans',sans-serif;
  line-height:1.7;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}

::selection{background:var(--accent);color:#fff}

::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border2)}

/* ─── Layout ─── */
.wrap{width:100%;max-width:1160px;margin-left:auto;margin-right:auto;padding-left:48px;padding-right:48px}
section{padding:120px 0}

/* ─── Nav ─── */
#nav{
  position:fixed;top:0;left:0;right:0;z-index:200;
  padding:22px 0;
  transition:padding .3s,background .3s,border-color .3s;
  border-bottom:1px solid transparent;
}
#nav.scrolled{
  padding:14px 0;
  background:rgba(7,7,15,.92);
  backdrop-filter:blur(20px);
  border-bottom:1px solid var(--border);
}
.nav-row{display:flex;align-items:center;justify-content:space-between}
.logo{
  font-family:'Syne',sans-serif;font-weight:800;font-size:19px;
  color:var(--text);text-decoration:none;letter-spacing:-.03em;
}
.logo em{font-style:normal;color:var(--accent2)}
.nav-links{display:flex;gap:38px;list-style:none}
.nav-links a{
  font-family:'JetBrains Mono',monospace;font-size:11.5px;
  color:var(--muted2);text-decoration:none;letter-spacing:.08em;
  transition:color .2s;position:relative;
}
.nav-links a:hover,.nav-links a.active{color:var(--text)}
.nav-links a.active::after{
  content:'';position:absolute;left:0;right:0;bottom:-5px;
  height:1px;background:var(--accent);
}

/* Mobile nav */
.mobile-toggle{
  display:none;background:none;border:none;cursor:pointer;
  padding:4px;flex-direction:column;gap:5px;
}
.mobile-toggle .bar{
  display:block;width:22px;height:1.5px;background:var(--text);
  transition:transform .3s,opacity .3s;
}
.mobile-toggle .bar.open:nth-child(1){transform:rotate(45deg) translate(4px,4px)}
.mobile-toggle .bar.open:nth-child(2){opacity:0}
.mobile-toggle .bar.open:nth-child(3){transform:rotate(-45deg) translate(4px,-4px)}

.mobile-menu{
  position:fixed;inset:0;z-index:150;background:var(--bg);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;
}
.mobile-menu a{
  font-family:'JetBrains Mono',monospace;font-size:16px;
  color:var(--muted2);text-decoration:none;letter-spacing:.12em;
  transition:color .2s;
}
.mobile-menu a:hover,.mobile-menu a.active{color:var(--text)}

/* ─── Section label ─── */
.label{
  font-family:'JetBrains Mono',monospace;font-size:10.5px;
  color:var(--accent2);letter-spacing:.18em;text-transform:uppercase;
  margin-bottom:18px;display:flex;align-items:center;gap:10px;
}
.label::before{content:'';width:20px;height:1px;background:var(--accent);flex-shrink:0}

/* ─── HERO ─── */
#hero{
  min-height:100vh;display:flex;align-items:center;
  padding-top:100px;position:relative;overflow:hidden;
}
#hero::before{
  content:'';position:absolute;inset:0;
  background-image:linear-gradient(var(--border) 1px,transparent 1px),
                   linear-gradient(90deg,var(--border) 1px,transparent 1px);
  background-size:64px 64px;opacity:.22;pointer-events:none;
}
#hero::after{
  content:'';position:absolute;
  width:700px;height:700px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(124,58,237,.14) 0%,transparent 68%);
  top:-120px;right:-80px;pointer-events:none;
}
.hero-grid{
  display:grid;grid-template-columns:1fr 1fr;
  gap:64px;align-items:center;width:100%;position:relative;z-index:1;
}
.hero-eyebrow{
  font-family:'JetBrains Mono',monospace;font-size:11px;
  color:var(--accent2);letter-spacing:.2em;text-transform:uppercase;
  margin-bottom:20px;
  opacity:0;animation:up .6s ease .15s forwards;
}
.hero-name{
  font-family:'Syne',sans-serif;font-weight:800;
  font-size:clamp(56px,7vw,96px);
  line-height:.9;letter-spacing:-.05em;
  color:var(--text);margin-bottom:6px;
  opacity:0;animation:up .65s ease .3s forwards;
}
.hero-name .violet{color:var(--accent2)}
.hero-role{
  font-family:'Syne',sans-serif;font-weight:600;
  font-size:clamp(17px,2vw,24px);
  color:var(--muted2);letter-spacing:-.02em;
  margin-bottom:28px;
  opacity:0;animation:up .6s ease .45s forwards;
}
.hero-bio{
  font-size:15.5px;color:var(--muted2);max-width:420px;
  line-height:1.85;margin-bottom:44px;
  opacity:0;animation:up .6s ease .6s forwards;
}
.ctas{
  display:flex;gap:14px;flex-wrap:wrap;
  opacity:0;animation:up .6s ease .75s forwards;
}
.btn{
  display:inline-flex;align-items:center;gap:8px;
  font-family:'JetBrains Mono',monospace;font-size:11.5px;
  letter-spacing:.07em;padding:13px 28px;border-radius:3px;
  text-decoration:none;cursor:pointer;transition:all .22s;white-space:nowrap;border:none;
}
.btn-v{background:var(--accent);color:#fff}
.btn-v:hover{background:#6d28d9;transform:translateY(-2px);box-shadow:0 10px 28px rgba(124,58,237,.38)}
.btn-o{background:transparent;color:var(--muted2);border:1px solid var(--border2)}
.btn-o:hover{border-color:var(--accent2);color:var(--text);transform:translateY(-2px)}

/* ─── CODE PLAYGROUND ─── */
.playground{
  background:var(--surface);border:1px solid var(--border2);
  border-radius:8px;overflow:hidden;
  box-shadow:0 32px 80px rgba(0,0,0,.55);
  opacity:0;animation:fromRight .7s ease .45s forwards;
  display:flex;flex-direction:column;
  max-height:480px;
}
.pg-header{
  background:var(--surface2);
  padding:11px 18px;
  display:flex;align-items:center;gap:12px;
  border-bottom:1px solid var(--border);
  flex-shrink:0;
}
.dots{display:flex;gap:6px}
.dot{width:11px;height:11px;border-radius:50%}
.dot.r{background:#ff5f57}.dot.y{background:#febc2e}.dot.g{background:#28c840}
.pg-fname{
  font-family:'JetBrains Mono',monospace;font-size:10.5px;
  color:var(--muted);flex:1;text-align:center;
}
.run{
  font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.05em;
  background:var(--accent);color:#fff;border:none;
  padding:5px 14px;border-radius:3px;cursor:pointer;
  transition:background .2s;
}
.run:hover{background:#6d28d9}
.pg-editor{display:flex;flex:1;overflow:hidden;position:relative}
.lnums{
  background:var(--surface2);border-right:1px solid var(--border);
  padding:16px 0;min-width:40px;
  display:flex;flex-direction:column;align-items:center;gap:0;
  overflow:hidden;flex-shrink:0;
}
.lnum{
  font-family:'JetBrains Mono',monospace;font-size:11.5px;
  color:var(--muted);line-height:1.56;
}
#editor{
  flex:1;background:transparent;border:none;outline:none;
  resize:none;
  font-family:'JetBrains Mono',monospace;font-size:12.5px;
  color:#c8c8e0;padding:16px;line-height:1.56;
  caret-color:var(--accent2);tab-size:2;overflow:auto;
}
#editor::selection{background:rgba(124,58,237,.25)}
.pg-out{
  border-top:1px solid var(--border);
  background:#050512;padding:12px 18px;
  min-height:78px;max-height:110px;overflow:auto;flex-shrink:0;
}
.out-lbl{
  font-family:'JetBrains Mono',monospace;font-size:9.5px;
  color:var(--muted);letter-spacing:.12em;margin-bottom:6px;
}
#output{
  font-family:'JetBrains Mono',monospace;font-size:12px;
  color:#7ff0aa;white-space:pre-wrap;line-height:1.55;
}
.cursor{
  display:inline-block;width:7px;height:13px;
  background:var(--accent2);
  animation:blink 1s step-end infinite;
  vertical-align:middle;margin-left:1px;
}

/* ─── ABOUT ─── */
#about{background:var(--surface)}
.li-link{
  display:inline-flex;align-items:center;gap:6px;margin-top:24px;
  font-family:'JetBrains Mono',monospace;font-size:11px;
  color:var(--accent2);text-decoration:none;transition:color .2s;
}
.li-link:hover{color:var(--accent)}
.about-h{
  font-family:'Syne',sans-serif;font-weight:700;
  font-size:clamp(28px,3vw,42px);letter-spacing:-.03em;
  line-height:1.12;margin-bottom:26px;
}
.about-p{font-size:15.5px;color:var(--muted2);line-height:1.85;margin-bottom:16px;max-width:680px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:40px}
.stat{
  background:var(--bg);border:1px solid var(--border);
  border-radius:3px;padding:22px 18px;text-align:center;
  transition:border-color .2s;
}
.stat:hover{border-color:var(--accent)}
.stat b{
  display:block;font-family:'Syne',sans-serif;font-weight:800;
  font-size:34px;color:var(--accent2);letter-spacing:-.03em;
}
.stat small{
  font-family:'JetBrains Mono',monospace;font-size:9.5px;
  color:var(--muted);letter-spacing:.1em;text-transform:uppercase;margin-top:4px;display:block;
}

/* ─── SKILLS ─── */
#skills{background:var(--bg)}
.skills-h{
  font-family:'Syne',sans-serif;font-weight:700;
  font-size:clamp(26px,3vw,38px);letter-spacing:-.03em;margin-bottom:52px;
}
.skills-grid{display:grid;grid-template-columns:1fr 1fr;gap:44px 72px}
.sg-title{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--muted);letter-spacing:.14em;text-transform:uppercase;
  margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--border);
}
.tags{display:flex;flex-wrap:wrap;gap:7px}
.tag{
  font-family:'JetBrains Mono',monospace;font-size:11px;
  background:var(--surface);border:1px solid var(--border);
  color:var(--muted2);padding:5px 12px;border-radius:2px;
  transition:all .18s;cursor:default;
}
.tag:hover{border-color:var(--accent2);color:var(--text);background:rgba(124,58,237,.08)}

/* ─── PROJECTS ─── */
#projects{background:var(--surface)}
.projects-h{
  font-family:'Syne',sans-serif;font-weight:700;
  font-size:clamp(26px,3vw,38px);letter-spacing:-.03em;margin-bottom:52px;
}
.pg-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:22px}
.pc{
  background:var(--bg);border:1px solid var(--border);
  border-radius:6px;padding:34px;position:relative;overflow:hidden;
  transition:transform .35s cubic-bezier(.16,1,.3,1),border-color .35s,box-shadow .35s;
  opacity:0;transform:translateY(36px);
}
.pc.in{animation:cardIn .58s cubic-bezier(.16,1,.3,1) forwards}
.pc::after{
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at top left,rgba(124,58,237,.12) 0%,transparent 65%);
  opacity:0;transition:opacity .35s;pointer-events:none;
}
.pc:hover{transform:translateY(-6px)!important;border-color:var(--accent);box-shadow:0 20px 60px rgba(0,0,0,.5)}
.pc:hover::after{opacity:1}
.pc-num{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--accent);letter-spacing:.15em;
  display:block;margin-bottom:16px;
}
.pc-type{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--muted2);background:var(--surface2);
  border:1px solid var(--border);padding:3px 10px;
  border-radius:999px;display:inline-block;margin-bottom:18px;
}
.pc-title{
  font-family:'Syne',sans-serif;font-weight:700;
  font-size:21px;letter-spacing:-.02em;color:var(--text);
  margin-bottom:12px;line-height:1.2;
}
.pc-desc{font-size:14px;color:var(--muted2);line-height:1.8;margin-bottom:22px}
.pc-metric{
  font-family:'JetBrains Mono',monospace;font-size:11.5px;
  color:var(--green);margin-bottom:20px;
  display:flex;align-items:center;gap:6px;
}
.pc-metric::before{content:'\\2191';font-size:9px}
.pc-stack{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:24px}
.pc-stack span{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--muted);border:1px solid var(--border);
  padding:2px 8px;border-radius:2px;
}
.pc-link{
  font-family:'JetBrains Mono',monospace;font-size:11px;
  color:var(--accent2);text-decoration:none;letter-spacing:.05em;
  display:inline-flex;align-items:center;gap:6px;
  transition:gap .2s,color .2s;
}
.pc-link:hover{gap:11px;color:#c084fc}

/* ─── EXPERIENCE ─── */
#experience{background:var(--bg)}
.exp-h{
  font-family:'Syne',sans-serif;font-weight:700;
  font-size:clamp(26px,3vw,38px);letter-spacing:-.03em;margin-bottom:52px;
}
.timeline{position:relative;padding-left:36px}
.timeline::before{
  content:'';position:absolute;left:5px;top:10px;bottom:0;
  width:1px;background:linear-gradient(var(--accent),var(--border),transparent);
}
.ei{
  position:relative;margin-bottom:48px;
  opacity:0;transform:translateX(-18px);transition:opacity .5s ease,transform .5s ease;
}
.ei.in{opacity:1;transform:translateX(0)}
.ei:last-child{margin-bottom:0}
.ei-dot{
  position:absolute;left:-36px;top:5px;
  width:12px;height:12px;border-radius:50%;
  border:2px solid var(--accent);background:var(--bg);
}
.ei-dot::after{
  content:'';position:absolute;inset:3px;
  border-radius:50%;background:var(--accent);
  opacity:0;transition:opacity .2s;
}
.ei:hover .ei-dot::after{opacity:1}
.ei-meta{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:8px}
.ei-yr{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--muted);letter-spacing:.1em}
.ei-co{font-family:'Syne',sans-serif;font-weight:700;font-size:17px;color:var(--text)}
.ei-role{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--accent2);background:rgba(124,58,237,.12);
  border:1px solid rgba(124,58,237,.2);padding:2px 9px;border-radius:999px;
}
.ei-desc{font-size:14px;color:var(--muted2);line-height:1.82;margin-bottom:12px;max-width:620px}
.ei-tags{display:flex;flex-wrap:wrap;gap:5px}
.ei-tags span{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--muted);border:1px solid var(--border);padding:2px 7px;border-radius:2px;
}

/* ─── CONTACT ─── */
#contact{
  background:var(--surface);text-align:center;
  position:relative;overflow:hidden;
}
#contact::before{
  content:'';position:absolute;inset:0;
  background-image:radial-gradient(circle,var(--border2) 1px,transparent 1px);
  background-size:26px 26px;opacity:.35;pointer-events:none;
}
#contact::after{
  content:'';position:absolute;
  width:520px;height:520px;border-radius:50%;
  background:radial-gradient(ellipse,rgba(124,58,237,.1) 0%,transparent 70%);
  top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;
}
.ct-inner{position:relative;z-index:1}
.ct-h{
  font-family:'Syne',sans-serif;font-weight:800;
  font-size:clamp(34px,5.5vw,72px);letter-spacing:-.05em;line-height:1;
  margin-bottom:22px;
}
.ct-h em{font-style:normal;color:var(--accent2)}
.ct-sub{font-size:15px;color:var(--muted2);max-width:430px;margin:0 auto 42px;line-height:1.82}
.ct-email{
  display:inline-flex;align-items:center;gap:10px;
  font-family:'JetBrains Mono',monospace;font-size:14px;
  color:var(--text);text-decoration:none;
  border:1px solid var(--border2);border-radius:3px;
  padding:15px 32px;margin-bottom:40px;
  background:var(--bg);transition:all .22s;
}
.ct-email:hover{border-color:var(--accent);color:var(--accent2);box-shadow:0 0 32px rgba(124,58,237,.22)}
.ct-socials{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}
.soc{
  display:inline-flex;align-items:center;gap:6px;
  font-family:'JetBrains Mono',monospace;font-size:11px;
  color:var(--muted2);text-decoration:none;
  border:1px solid var(--border);border-radius:3px;padding:9px 18px;
  transition:all .2s;
}
.soc:hover{border-color:var(--accent2);color:var(--text)}

/* ─── FOOTER ─── */
footer{padding:28px 0;border-top:1px solid var(--border);text-align:center}
footer p{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:.06em}

/* ─── ANIMATIONS ─── */
@keyframes up{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fromRight{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:translateX(0)}}
@keyframes cardIn{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

/* scroll reveal */
.rev{opacity:0;transform:translateY(32px);transition:opacity .65s ease,transform .65s ease}
.rev.in{opacity:1;transform:translateY(0)}
.d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}

/* ─── RESPONSIVE ─── */
@media(max-width:900px){
  section{padding:80px 0}
  .wrap{padding-left:24px;padding-right:24px}
  .hero-grid{grid-template-columns:1fr;gap:44px}
  .playground{animation:up .7s ease .45s forwards}

  .skills-grid{grid-template-columns:1fr}
  .pg-grid{grid-template-columns:1fr}
  .nav-links{display:none}
  .mobile-toggle{display:flex}
}
@media(max-width:520px){
  .stats{grid-template-columns:1fr}
  .ctas{flex-direction:column}
  .ct-h{font-size:36px}
}
`;
