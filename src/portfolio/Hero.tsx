import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ───────── Data ───────── */

const RIGHT_LINES = [
  "Real-time Intelligence",
  "LLM Integration",
  "Predictive Systems",
  "Data-Driven Architectures",
];

const SKILLS = [
  { category: "Languages", items: ["Python", "SQL", "JavaScript", "C++"] },
  { category: "ML / DL", items: ["PyTorch", "TensorFlow", "scikit-learn", "Keras"] },
  { category: "Data", items: ["Pandas", "NumPy", "Spark", "Airflow"] },
  { category: "Tools", items: ["Docker", "Git", "AWS", "GCP"] },
  { category: "Specialised", items: ["LLMs", "NLP", "Computer Vision", "MLOps"] },
];

const PROJECTS = [
  {
    title: "Predictive Maintenance Engine",
    desc: "Real-time anomaly detection pipeline processing 2M+ sensor events/day with 97% precision.",
    tags: ["PyTorch", "Kafka", "Docker"],
  },
  {
    title: "LLM-Powered Document QA",
    desc: "Retrieval-augmented generation system for enterprise knowledge bases using fine-tuned LLaMA.",
    tags: ["LangChain", "FAISS", "FastAPI"],
  },
  {
    title: "Vision Quality Inspector",
    desc: "CNN-based defect detection on manufacturing lines — reduced manual QA effort by 80%.",
    tags: ["TensorFlow", "OpenCV", "GCP"],
  },
  {
    title: "Customer Churn Forecast",
    desc: "Gradient-boosted ensemble achieving 0.93 AUC, integrated into CRM dashboards.",
    tags: ["XGBoost", "Pandas", "Streamlit"],
  },
];

const EXPERIENCE = [
  {
    role: "ML Engineer",
    company: "Stealth AI Startup",
    period: "2024 — Present",
    points: [
      "Architected real-time inference pipelines serving 50k+ requests/min.",
      "Fine-tuned LLMs for domain-specific text generation with RLHF.",
      "Reduced model latency by 40% through quantization and ONNX export.",
    ],
  },
  {
    role: "Data Science Intern",
    company: "TechCorp Analytics",
    period: "2023 — 2024",
    points: [
      "Built automated feature engineering pipelines for tabular datasets.",
      "Developed dashboards tracking model drift and data quality metrics.",
    ],
  },
];

/* ───────── Component ───────── */

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  /* Hero refs */
  const heroRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const rightRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const scrollIndRef = useRef<HTMLDivElement>(null);

  /* Section refs for scroll-triggered fade-up */
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const expRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Hero entrance timeline ── */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(nameRef.current, { y: 40, opacity: 0, duration: 1 })
        .from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.7 }, "-=0.4")
        .from(taglineRef.current, { y: 20, opacity: 0, duration: 0.7 }, "-=0.3")
        .from(
          rightRefs.current.filter(Boolean),
          { y: 24, opacity: 0, duration: 0.6, stagger: 0.12 },
          "-=0.3"
        )
        .from(scrollIndRef.current, { opacity: 0, duration: 0.8 }, "-=0.2");

      /* ── Scroll-triggered fade-ups ── */
      const sections = [aboutRef, skillsRef, projectsRef, expRef, contactRef];
      sections.forEach((ref) => {
        if (!ref.current) return;
        const children = ref.current.querySelectorAll(".fade-up");
        if (children.length === 0) return;
        gsap.from(children, {
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
        });
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef}>
      {/* ════════════════════ HERO ════════════════════ */}
      <section
        ref={heroRef}
        className="relative z-1 flex h-screen w-full items-center justify-between px-6 sm:px-12 lg:px-24 overflow-hidden"
      >
        {/* Left */}
        <div className="flex flex-col justify-center max-w-3xl">
          <h1
            ref={nameRef}
            className="font-extrabold tracking-tighter leading-none select-none"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              background: "linear-gradient(135deg, #e2e2e2 40%, #7f5af0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            DINESH A
          </h1>
          <p
            ref={subtitleRef}
            className="mt-3 text-base sm:text-lg md:text-xl font-semibold tracking-widest uppercase"
            style={{ color: "#7f5af0" }}
          >
            AI / ML Engineer
          </p>
          <p
            ref={taglineRef}
            className="mt-3 max-w-md text-sm sm:text-base leading-relaxed"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Designing scalable machine learning architectures for predictive
            intelligence.
          </p>
        </div>

        {/* Right */}
        <div className="hidden lg:flex flex-col items-end gap-3 select-none">
          {RIGHT_LINES.map((line, i) => (
            <span
              key={line}
              ref={(el) => { rightRefs.current[i] = el; }}
              className="block text-xs sm:text-sm font-medium tracking-[0.25em] uppercase"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {line}
            </span>
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollIndRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span
            className="text-[0.65rem] tracking-[0.2em] uppercase"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Scroll
          </span>
          <span className="scroll-line" />
        </div>
      </section>

      {/* ════════════════════ ABOUT ════════════════════ */}
      <section
        ref={aboutRef}
        className="relative z-1 px-6 sm:px-12 lg:px-24 py-24 sm:py-32 max-w-5xl mx-auto"
      >
        <h2 className="fade-up section-heading">About</h2>
        <p
          className="fade-up mt-6 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          I'm an AI/ML engineer focused on building production-grade machine
          learning systems — from data pipelines and model training to
          deployment at scale. I work across predictive analytics, NLP, and
          computer vision, always aiming for clean architecture, measurable
          impact, and reliable inference.
        </p>
        <p
          className="fade-up mt-4 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          When I'm not training models, I explore LLM integrations, contribute
          to open-source tooling, and write about lessons learned shipping ML
          in the real world.
        </p>
      </section>

      {/* ════════════════════ SKILLS ════════════════════ */}
      <section
        ref={skillsRef}
        className="relative z-1 px-6 sm:px-12 lg:px-24 py-24 sm:py-32 max-w-5xl mx-auto"
      >
        <h2 className="fade-up section-heading">Skills</h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SKILLS.map((group) => (
            <div key={group.category} className="fade-up">
              <h3
                className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
                style={{ color: "#7f5af0" }}
              >
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item} className="skill-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════ PROJECTS ════════════════════ */}
      <section
        ref={projectsRef}
        className="relative z-1 px-6 sm:px-12 lg:px-24 py-24 sm:py-32 max-w-5xl mx-auto"
      >
        <h2 className="fade-up section-heading">Projects</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((p) => (
            <div key={p.title} className="fade-up project-card">
              <h3 className="text-base sm:text-lg font-semibold text-white/90">
                {p.title}
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {p.desc}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="project-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════ EXPERIENCE ════════════════════ */}
      <section
        ref={expRef}
        className="relative z-1 px-6 sm:px-12 lg:px-24 py-24 sm:py-32 max-w-5xl mx-auto"
      >
        <h2 className="fade-up section-heading">Experience</h2>
        <div className="mt-10 space-y-12">
          {EXPERIENCE.map((e) => (
            <div key={e.role + e.company} className="fade-up">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h3 className="text-base sm:text-lg font-semibold text-white/90">
                  {e.role}{" "}
                  <span style={{ color: "#7f5af0" }}>@ {e.company}</span>
                </h3>
                <span
                  className="text-xs tracking-wider uppercase shrink-0"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {e.period}
                </span>
              </div>
              <ul className="mt-3 space-y-2 pl-4 list-disc list-outside marker:text-[#7f5af033]">
                {e.points.map((pt, i) => (
                  <li
                    key={i}
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════ CONTACT ════════════════════ */}
      <section
        ref={contactRef}
        className="relative z-1 px-6 sm:px-12 lg:px-24 py-24 sm:py-32 max-w-5xl mx-auto text-center"
      >
        <h2 className="fade-up section-heading" style={{ textAlign: "center" }}>
          Get in Touch
        </h2>
        <p
          className="fade-up mt-6 mx-auto max-w-md text-sm sm:text-base leading-relaxed"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Open to opportunities, collaborations, and conversations about
          ML engineering, LLMs, and data systems.
        </p>
        <div className="fade-up mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:dinesh@example.com"
            className="cta-btn"
          >
            Say Hello
          </a>
          <a
            href="https://www.linkedin.com/in/dinesh-a-122983374/"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn-outline"
          >
            LinkedIn
          </a>
        </div>
      </section>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="relative z-1 py-10 text-center">
        <p
          className="text-xs tracking-wider"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          &copy; {new Date().getFullYear()} Dinesh A &mdash; Built with React,
          GSAP &amp; intention.
        </p>
      </footer>

      {/* ════════════════════ INLINE STYLES ════════════════════ */}
      <style>{`
        /* Scroll indicator */
        .scroll-line {
          width: 1px;
          height: 28px;
          background: rgba(127, 90, 240, 0.5);
          animation: scrollPulse 2s ease-in-out infinite;
          transform-origin: top;
        }
        @keyframes scrollPulse {
          0%   { transform: scaleY(0); opacity: 0; }
          40%  { transform: scaleY(1); opacity: 1; }
          100% { transform: scaleY(0); opacity: 0; }
        }

        /* Section headings */
        .section-heading {
          font-size: clamp(1.6rem, 4vw, 2.5rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #e2e2e2;
        }

        /* Skill chips */
        .skill-chip {
          display: inline-block;
          padding: 0.3rem 0.75rem;
          font-size: 0.75rem;
          border-radius: 9999px;
          border: 1px solid rgba(127, 90, 240, 0.2);
          color: rgba(255, 255, 255, 0.6);
          background: rgba(127, 90, 240, 0.06);
          transition: border-color 0.25s, color 0.25s;
        }
        .skill-chip:hover {
          border-color: rgba(127, 90, 240, 0.5);
          color: #7f5af0;
        }

        /* Project cards */
        .project-card {
          padding: 1.5rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.02);
          transition: border-color 0.3s, background 0.3s;
        }
        .project-card:hover {
          border-color: rgba(127, 90, 240, 0.25);
          background: rgba(127, 90, 240, 0.04);
        }

        /* Project tags */
        .project-tag {
          display: inline-block;
          padding: 0.2rem 0.55rem;
          font-size: 0.65rem;
          border-radius: 4px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: rgba(127, 90, 240, 0.7);
          background: rgba(127, 90, 240, 0.08);
        }

        /* CTA buttons */
        .cta-btn {
          display: inline-block;
          padding: 0.7rem 2rem;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          border-radius: 9999px;
          background: #7f5af0;
          color: #fff;
          transition: background 0.25s, transform 0.2s;
        }
        .cta-btn:hover {
          background: #6b46d6;
          transform: translateY(-1px);
        }

        .cta-btn-outline {
          display: inline-block;
          padding: 0.7rem 2rem;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          border-radius: 9999px;
          border: 1px solid rgba(127, 90, 240, 0.4);
          color: #7f5af0;
          transition: border-color 0.25s, background 0.25s, transform 0.2s;
        }
        .cta-btn-outline:hover {
          border-color: #7f5af0;
          background: rgba(127, 90, 240, 0.08);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
