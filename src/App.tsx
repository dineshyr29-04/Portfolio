"use client";

import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import Shuffle from './Shuffle';
import './Shuffle.css';
import DarkVeil from './DarkVeil';
import './App.css';
import projectPhoto from './assets/DA (1).png';
import { Shield, Cpu, Database, Layout, Mail, ExternalLink, ChevronRight, Play, Clock, X, Menu } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   PREDEFINED CODES FOR RUNNER
   ═══════════════════════════════════════════════════════════════ */
const CODE_TABS = {
  C: {
    filename: 'kernel_scheduler.c',
    code: `#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/sched.h>

static int __init init_dinesh_scheduler(void) {
    pr_info("Initializing Dinesh-OS Task Scheduler...\\n");
    pr_info("Loading Virtual Memory paging: 4KB base pages\\n");
    pr_info("Status: CPU Cores Online (8 threads scheduled)\\n");
    return 0;
}

static void __exit exit_dinesh_scheduler(void) {
    pr_info("Task Scheduler module unloaded successfully.\\n");
}

module_init(init_dinesh_scheduler);
module_exit(exit_dinesh_scheduler);`,
    output: [
      '▶ Compiling module: gcc -O3 -Wall -D__KERNEL__ -c kernel_scheduler.c',
      '▶ Loading driver module: sudo insmod kernel_scheduler.ko',
      '  [   0.000000] Initializing Dinesh-OS Task Scheduler...',
      '  [   0.000105] Loading Virtual Memory paging: 4KB base pages',
      '  [   0.000214] Status: CPU Cores Online (8 threads scheduled)',
      '✓ Driver loaded successfully at address 0xffffffffc03f8000.'
    ]
  },
  Python: {
    filename: 'infer_transformer.py',
    code: `import torch
import torch.nn as nn
from model import TransformerClassifier

print("▶ Initializing pipeline...")
print("▶ Loading pre-trained weights: model_checkpoint.pt")

model = TransformerClassifier(d_model=512, n_heads=8, num_layers=4)
model.eval()

inputs = torch.randn(1, 64, 512)
with torch.no_grad():
    predictions = model(inputs)

print(f"✓ Inference successful. Latency: 12ms. Shape: {predictions.shape}")`,
    output: [
      '▶ Initializing pipeline...',
      '▶ Loading pre-trained weights: model_checkpoint.pt (340MB)',
      '  Initializing device: CUDA Core [0] GeForce RTX 4070 Ti',
      '  Performing classification forward pass...',
      '✓ Inference successful. Latency: 12ms. Shape: torch.Size([1, 10])'
    ]
  }
};

/* ═══════════════════════════════════════════════════════════════
   DATA STRUCTURES
   ═══════════════════════════════════════════════════════════════ */
const SKILL_MAPS = [
  {
    id: 'kernel',
    address: '0x0000 - 0x3FFF',
    title: 'Kernel & Core Systems',
    icon: Cpu,
    color: '#00f2fe',
    description: 'Low-level systems coding, core architectures, memory paging configurations and task scheduling methodologies.',
    skills: ['C', 'C++', 'Python', 'Bash', 'Operating Systems', 'Memory Management', 'CPU Scheduling']
  },
  {
    id: 'frontend',
    address: '0x4000 - 0x7FFF',
    title: 'Frontend & UIs',
    icon: Layout,
    color: '#c5a880',
    description: 'High-performance interactive client interfaces, clean component structures, web analytics, and fluid animations.',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vite', 'GSAP', 'WebGL']
  },
  {
    id: 'backend',
    address: '0x8000 - 0xBFFF',
    title: 'Backend & Databases',
    icon: Database,
    color: '#39ff14',
    description: 'Scalable backend API design, database schemas orchestration, query optimization, and structured storage.',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'REST APIs']
  },
  {
    id: 'tools',
    address: '0xC000 - 0xFFFF',
    title: 'Tools & Infrastructure',
    icon: Shield,
    color: '#ebd6b8',
    description: 'Development pipelines, containerization, environment automation scripts, and serverless hosting setups.',
    skills: ['Git', 'Docker', 'Linux', 'YAML', 'Jupyter', 'Vercel', 'Netlify']
  }
];

const PROJECTS = [
  {
    type: 'Premium Hospitality / Subscription OS',
    color: '#b3925c',
    photoFile: 'project-aura.jpg',
    title: 'Aura Banquet & Catering',
    desc: 'A premium, full-width catering and mess subscription platform. Features a React 19 interactive pricing calculator, custom menu builder, multi-language support, and client-side leads CRM.',
    metric: 'Next.js 16 · Tailwind v4 · Lead CRM',
    stack: ['Next.js', 'React 19', 'TypeScript', 'Tailwind CSS'],
    repoUrl: 'https://github.com/dineshyr29-04/catering-and-mess',
    liveUrl: 'https://aura-catering.vercel.app',
    hex: '0xffffffffc0001000'
  },
  {
    type: 'Quality Control Standardization System',
    color: '#10b981',
    photoFile: 'project-drug-secure.png',
    title: 'Drug Secure',
    desc: 'An AI-powered quality control and standardization system for Ayurvedic drug validation. Integrates E-Tongue electrochemical sensor inputs and unsupervised K-Means clustering for batch validation.',
    metric: 'Unsupervised ML · E-Tongue · K-Means',
    stack: ['React', 'GSAP', 'Unsupervised ML', 'Data Science'],
    repoUrl: 'https://github.com/dineshyr29-04/drug-secure',
    liveUrl: 'https://drug-secure.vercel.app',
    hex: '0xffffffffc0002000'
  },
  {
    type: 'Hackathon Platform / Event OS',
    color: '#6366f1',
    photoFile: 'project-sankalp.png',
    title: 'Project Sankalp',
    desc: 'A premium, high-impact hackathon management platform. Features an engineered UI for team collaboration, real-time tracking, and automated judging workflows.',
    metric: '500+ Participants · 48h Live Stream',
    stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    repoUrl: 'https://github.com/dineshyr29-04/Sankalp',
    liveUrl: 'https://project-sankalp.dev',
    hex: '0xffffffffc0003000'
  },
  {
    type: 'SaaS Frontend / Cloud Interface',
    color: '#ec4899',
    photoFile: 'project-thinknode.png',
    title: 'Thinknode Customer Portal',
    desc: 'An enterprise-grade customer dashboard for the ThinkNode cloud ecosystem. Orchestrates complex AI workflows and data visualization with sub-second latency.',
    metric: '10k+ Active Users · 99.9% Uptime',
    stack: ['JavaScript', 'HTML', 'CSS', 'Node.js'],
    repoUrl: 'https://github.com/dineshyr29-04?tab=repositories&q=thinknode',
    liveUrl: 'https://thinknode-customers.vercel.app/',
    hex: '0xffffffffc0004000'
  },
  {
    type: 'Workflow Orchestration',
    color: '#3b82f6',
    photoFile: 'project-openloop.png',
    title: 'Openloop Automation',
    desc: 'A scalable automation engine designed for AI pipeline orchestration. Leverages event-driven architecture to manage long-running repetitive tasks.',
    metric: '89% Accuracy · 5x Efficiency Gain',
    stack: ['JavaScript', 'TypeScript', 'Python', 'YAML'],
    repoUrl: 'https://github.com/dineshyr29-04/Openloop',
    liveUrl: 'https://open-loop.dev',
    hex: '0xffffffffc0005000'
  },
  {
    type: 'AgTech / IoT Dashboard',
    color: '#22c55e',
    photoFile: 'project-agro-nova.png',
    title: 'AgroNova Platform',
    desc: 'Smart agriculture platform integrating IoT sensor data for predictive crop analytics. Empowers farmers with real-time soil and climate insights.',
    metric: '15% Yield Increase · Real-time Monitoring',
    stack: ['JavaScript', 'Python', 'MongoDB', 'SQL'],
    repoUrl: 'https://github.com/dineshyr29-04?tab=repositories&q=agro+nova',
    liveUrl: '',
    hex: '0xffffffffc0006000'
  },
  {
    type: 'MedTech / Data Analytics',
    color: '#f59e0b',
    photoFile: 'project-cardio-nerve.png',
    title: 'Cardionerve Health',
    desc: 'Clinical-grade analytics system for cardiovascular and neurological diagnosis. Processes high-frequency medical data with advanced filtering.',
    metric: '97.5% Precision · Clinical Grade',
    stack: ['Python', 'JavaScript', 'Jupyter', 'DataViz'],
    repoUrl: 'https://github.com/dineshyr29-04?tab=repositories&q=cardio+nerve',
    liveUrl: '',
    hex: '0xffffffffc0007000'
  },
  {
    type: 'Web Development',
    color: '#a855f7',
    photoFile: 'project-portfolio.png',
    title: 'Developer Portfolio',
    desc: 'A high-performance cinematic portfolio showcasing advanced frontend engineering and creative UI patterns. Built for speed and visual impact.',
    metric: '100/100 Performance · SEO Optimized',
    stack: ['React', 'TypeScript', 'HTML', 'CSS'],
    repoUrl: 'https://github.com/dineshyr29-04/Portfolio',
    liveUrl: 'https://dinesh-portfolio.vercel.app',
    hex: '0xffffffffc0008000'
  }
];

const EXP_ITEMS = [
  {
    pid: 3001,
    period: '2025 — Present',
    company: 'Cardio Nerve',
    role: 'Full-Stack Developer',
    desc: 'An AI-driven cardiovascular intelligence platform that analyzes real-time heart rate and HRV data from PPG sensors to generate predictive cardiac risk scores. Designed a clinical dashboard for early detection, risk stratification, and preventive decision support. Architected and deployed production LLM pipelines processing 2M+ daily requests. Led fine-tuning initiatives for domain-specific applications.',
    tags: ['Express.js', 'PyTorch', 'Python', 'Node.js'],
    cpu: '18%',
    state: 'RUNNING'
  },
  {
    pid: 3002,
    period: '2024 — Present',
    company: 'College Tech Club',
    role: 'President',
    desc: 'Presided over the technical club, spearheading numerous events, hackathons, and hands-on workshops. Fostered a vibrant developer community by organizing technical seminars, mentoring students in modern web technologies, and coordinating large-scale tech fests.',
    tags: ['Leadership', 'Event Management', 'Community Building', 'Workshops'],
    cpu: '8%',
    state: 'SLEEPING'
  },
  {
    pid: 3003,
    period: '2023 — Present',
    company: 'Competitive Hackathons',
    role: 'Competitor & Finalist',
    desc: 'Actively competed in 9 major hackathons, rapidly prototyping complex full-stack and AI/ML solutions under tight 24-48 hour deadlines. Reached the grand finals in 2 prestigious hackathons, demonstrating exceptional problem-solving, teamwork, and technical execution.',
    tags: ['Hackathons', 'Rapid Prototyping', 'Full-Stack', 'AI/ML'],
    cpu: '12%',
    state: 'WAITING'
  }
];

const EXTRA_ITEMS = [
  {
    icon: '🏆',
    title: 'Hackathon Organizer',
    desc: 'Organized and managed large-scale hackathons with 500+ participants. Built the entire event platform from scratch.',
    highlight: 'Project Sankalp'
  },
  {
    icon: '📖',
    title: 'Research & Papers',
    desc: 'Actively studying transformer architectures, attention mechanisms, and publishing findings on ML system design.',
    highlight: 'Deep Learning Focus'
  },
  {
    icon: '🌐',
    title: 'Open Source',
    desc: 'Contributing to open-source ML tools and building developer utilities used by the community.',
    highlight: 'GitHub Active'
  },
  {
    icon: '🎤',
    title: 'Tech Talks & Mentoring',
    desc: 'Presenting on AI/ML topics at college events and mentoring junior developers in web and ML engineering.',
    highlight: 'Community Builder'
  }
];

export default function App() {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // System Stats Simulation
  const [cpuLoad, setCpuLoad] = useState('8.4%');
  const [ramUsage, setRamUsage] = useState('5.6GB');
  const [uptime, setUptime] = useState('00:00:00');

  // Code Playground States
  const [runnerTab, setRunnerTab] = useState<'C' | 'Python'>('C');
  const [editorCode, setEditorCode] = useState(CODE_TABS.C.code);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Skill Segment Map state
  const [selectedSegment, setSelectedSegment] = useState(SKILL_MAPS[0]);

  // Project Details Modal State
  const [expandedProject, setExpandedProject] = useState<typeof PROJECTS[0] | null>(null);

  // Uptime ticker
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - start;
      const hrs = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setUptime(`${hrs}:${mins}:${secs}`);

      // Fluctuating load
      setCpuLoad(`${(8.0 + Math.random() * 6).toFixed(1)}%`);
      setRamUsage(`${(5.4 + Math.random() * 0.4).toFixed(2)}GB`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Section Observer
  useEffect(() => {
    const handleScroll = () => {
      const secs = document.querySelectorAll<HTMLElement>('section[id]');
      let cur = '';
      secs.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 220) {
          cur = s.id;
        }
      });
      setActiveSection(cur);
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync scroll reveals
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
      { threshold: 0.05, rootMargin: '0px 0px 30px 0px' }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Initialize Code editor code
  const switchRunnerTab = (tab: 'C' | 'Python') => {
    setRunnerTab(tab);
    setEditorCode(CODE_TABS[tab].code);
    setOutputLines([]);
  };

  // Run Code trigger
  const runCode = () => {
    setIsCompiling(true);
    setOutputLines([]);
    let i = 0;
    const lines = CODE_TABS[runnerTab].output;

    const tick = () => {
      if (i >= lines.length) {
        setIsCompiling(false);
        return;
      }
      setOutputLines((prev) => [...prev, lines[i]]);
      i++;
      setTimeout(tick, 150);
    };
    setTimeout(tick, 300);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <Analytics />
      
      {/* Dynamic Visual Shader backdrop */}
      <DarkVeil
        hueShift={220}
        noiseIntensity={0}
        scanlineIntensity={0}
        speed={0.5}
        scanlineFrequency={0}
        warpAmount={0.2}
      />
      
      <div className="dot-grid" />

      {/* 💻 SYSTEM STATUS HEADER */}
      <div className="w-full bg-[#07080a]/90 backdrop-blur-md border-b border-white/5 py-2 px-6 md:px-16 lg:px-24 flex items-center justify-between text-[10px] font-code text-zinc-400 fixed top-0 left-0 right-0 z-50 select-none">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            SYS: ONLINE
          </span>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden sm:inline">KERNEL: dinesh-os v6.2.0-rc3</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-gold/60" />
            <span>CPU: <strong className="text-zinc-200">{cpuLoad}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-gold/60" />
            <span>RAM: <strong className="text-zinc-200">{ramUsage}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-gold/60" />
            <span>UPTIME: <strong className="text-zinc-200">{uptime}</strong></span>
          </div>
        </div>
      </div>

      {/* ══ NAV BAR ══ */}
      <nav className={`fixed top-7 left-0 right-0 z-40 transition-all duration-300 w-full ${
        scrolled ? "bg-[#07080a]/90 border-b border-white/5 py-4 shadow-2xl" : "bg-transparent py-5"
      }`}>
        <div className="w-full px-6 md:px-16 lg:px-24 flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 group"
          >
            <img
              src={projectPhoto}
              alt="Dinesh Face Profile"
              className="w-9 h-9 rounded-full border border-white/10 object-cover filter brightness-90 group-hover:border-gold/50 transition-all duration-300"
            />
            <div className="flex flex-col">
              <span className="font-serif text-base font-bold tracking-widest text-zinc-100 uppercase">DINESH A</span>
              <span className="text-[8px] font-code uppercase tracking-[0.25em] text-zinc-400 mt-0.5">Systems & Web Dev</span>
            </div>
          </a>

          <ul className="hidden md:flex items-center gap-8">
            {[
              ['about', 'About'],
              ['skills', 'Expertise'],
              ['projects', 'Work'],
              ['experience', 'Timeline'],
              ['contact', 'Contact']
            ].map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => { e.preventDefault(); scrollTo(id); }}
                  className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-200 py-1 border-b ${
                    activeSection === id ? "border-gold text-gold" : "border-transparent text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/15 bg-gold/5 text-[9px] font-code uppercase font-bold tracking-wider text-gold select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Available for work
            </span>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-100 focus:outline-none"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#07080a] border-b border-white/15 py-6 px-6 shadow-2xl flex flex-col gap-4">
            {[['about', 'About'], ['skills', 'Expertise'], ['projects', 'Work'], ['experience', 'Timeline'], ['contact', 'Contact']].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => { e.preventDefault(); scrollTo(id); }}
                className="text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-gold"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ══ HERO SECTION ══ */}
      <section id="hero" className="w-full min-h-[90vh] flex items-center bg-[#07080a] relative z-10 pt-32 pb-16">
        <div className="w-full px-6 md:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/15 bg-gold/5 text-gold text-[9px] font-code uppercase font-bold tracking-widest">
              <span className="w-1 h-1 rounded-full bg-gold" />
              Systems Engineering & Web Core
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              DINESH A
            </h1>

            <div className="font-code text-xs sm:text-sm text-gold flex items-center gap-2">
              <span>// </span>
              <Shuffle text="AI/ML Developer & Systems Engineer" duration={0.6} />
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl font-light">
              I design and deploy production-grade Full-Stack applications and explore low-level operating system architectures, task scheduling paradigms, and CPU memory segmentation algorithms. Currently focusing on kernel-level execution threads and Next.js 16 frameworks.
            </p>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => scrollTo('projects')}
                className="px-6 py-3 rounded-full bg-white hover:bg-gold text-[#07080a] font-bold text-[10px] tracking-widest uppercase transition-all shadow-lg hover:scale-[1.02]"
              >
                Explore Modules
              </button>
              <a
                href="https://www.linkedin.com/in/dinesh-a-122983374/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full border border-white/10 hover:border-gold/40 text-zinc-300 hover:text-gold font-bold text-[10px] tracking-widest uppercase transition-all flex items-center gap-1.5"
              >
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Hero Right Code simulation dashboard */}
          <div className="lg:col-span-6 bg-[#0d0e12] border border-white/5 rounded-2xl shadow-2xl p-5 md:p-6 font-code text-xs relative overflow-hidden select-none">
            
            {/* Header tab buttons */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              
              <div className="flex gap-1">
                {(['C', 'Python'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => switchRunnerTab(tab)}
                    className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                      runnerTab === tab ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-350"
                    }`}
                  >
                    {CODE_TABS[tab].filename}
                  </button>
                ))}
              </div>
            </div>

            {/* Code edit box */}
            <div className="min-h-[160px] bg-black/40 border border-white/5 p-4 rounded-xl text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed select-text">
              {editorCode}
            </div>

            {/* Console actions */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
              <span className="text-[10px] text-zinc-500">Ctrl + Enter to run</span>
              <button
                onClick={runCode}
                disabled={isCompiling}
                className="px-4 py-1.5 rounded bg-gold text-[#07080a] font-bold text-[10px] uppercase flex items-center gap-1.5 hover:bg-gold-light active:scale-95 transition-all disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isCompiling ? "COMPILING..." : "RUN CODE"}</span>
              </button>
            </div>

            {/* Console Output logs */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-2">System stdout:</div>
              <div className="p-3 bg-black/60 rounded-lg text-emerald-400 font-code text-[11px] min-h-[90px] max-h-[120px] overflow-y-auto space-y-1">
                {outputLines.map((line, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-zinc-600 select-none">►</span>
                    <span>{line}</span>
                  </div>
                ))}
                {isCompiling && <div className="blink-cursor inline-block w-2 h-4 bg-emerald-400" />}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══ ABOUT DINESH ══ */}
      <section id="about" className="w-full py-20 bg-[#0d0e12]/40 border-y border-white/5 relative z-10">
        <div className="w-full px-6 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-code text-gold">// 01. ABOUT SYSTEMS ARCHITECT</div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Systems thinker.<br />Full-stack execution.
              </h2>
              
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">
                I'm Dinesh A. I focus on developing clean, well-architected applications and digging deep into task scheduling processes and virtual memory tables. I believe in designing clean interfaces, structured data flows, and highly testable algorithms rather than basic templates.
              </p>
              
              <p className="text-zinc-500 text-xs leading-relaxed font-light">
                When I am not writing Node.js handlers or Next.js layout structures, I study operating system process states, memory segmentation registers, and contribute to repository tools.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { value: '2+', label: 'Years Exp' },
                  { value: '8+', label: 'Projects Built' },
                  { value: '5+', label: 'Deployments' }
                ].map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <span className="font-serif text-2xl font-bold text-white block mb-1">{stat.value}</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-zinc-500">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative p-6 border border-white/5 rounded-2xl bg-[#0d0e12]/80 max-w-sm w-full select-none shadow-xl">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gold animate-pulse" />
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Host Information</h4>
                <div className="space-y-3.5 text-xs font-code">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">USER:</span>
                    <span className="text-white font-semibold">dinesh_a</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">HOSTNAME:</span>
                    <span className="text-white font-semibold">Dinesh-PC</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">SHELL:</span>
                    <span className="text-white font-semibold">/bin/bash</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-zinc-500">LOCATION:</span>
                    <span className="text-white font-semibold">Bangalore, IN</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ CAPABILITIES VIRTUAL MEMORY EXPLORER ══ */}
      <section id="skills" className="w-full py-20 bg-[#07080a] relative z-10">
        <div className="w-full px-6 md:px-16 lg:px-24">
          
          <div className="max-w-xl mb-12">
            <span className="text-gold font-bold text-[10px] font-code uppercase tracking-widest">// 02. CAPABILITIES SEGMENTS</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
              Virtual Memory Mapping
            </h2>
            <p className="text-zinc-500 text-xs font-light mt-3 max-w-md">
              Click on the virtual memory segments below to explore my technical capabilities mapped into standard CPU segments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Visual Segments Map list (Left) */}
            <div className="lg:col-span-6 space-y-3 shrink-0">
              {SKILL_MAPS.map((seg) => {
                const Icon = seg.icon;
                return (
                  <button
                    key={seg.id}
                    onClick={() => setSelectedSegment(seg)}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-300 flex justify-between items-center ${
                      selectedSegment.id === seg.id
                        ? "bg-white/5 border-gold text-white translate-x-1"
                        : "border-white/5 bg-[#0d0e12]/40 text-zinc-500 hover:border-white/10 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2 rounded-lg transition-colors duration-300 ${
                        selectedSegment.id === seg.id ? "bg-gold text-[#07080a]" : "bg-white/5 text-zinc-400"
                      }`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="text-[9px] font-code uppercase font-bold tracking-wider block text-zinc-500">
                          {seg.address}
                        </span>
                        <h4 className="text-xs font-bold text-white tracking-wide">
                          {seg.title}
                        </h4>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-650" />
                  </button>
                );
              })}
            </div>

            {/* Segment Contents (Right) */}
            <div className="lg:col-span-6 bg-[#0d0e12] border border-white/5 p-6 md:p-8 rounded-2xl min-h-[280px] flex flex-col justify-between shadow-xl">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-code text-gold tracking-widest uppercase">
                    SEGMENT DUMP: {selectedSegment.address}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <h3 className="font-serif text-xl font-bold text-white border-b border-white/5 pb-3">
                  {selectedSegment.title}
                </h3>

                <p className="text-zinc-400 text-xs font-light leading-relaxed">
                  {selectedSegment.description}
                </p>

                {/* Sub-skills list */}
                <div className="pt-2">
                  <label className="block text-[9px] uppercase font-code font-bold tracking-widest text-zinc-500 mb-2">
                    Segment Variables:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSegment.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded bg-white/5 border border-white/5 font-code text-[10px] text-zinc-350"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[8px] font-code text-zinc-500 uppercase tracking-widest border-t border-white/5 pt-4 mt-6">
                * Hex segment memory block verified ok.
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ══ PROJECTS SECTION (SYSTEM DRIVERS) ══ */}
      <section id="projects" className="w-full py-20 bg-[#0d0e12]/40 border-y border-white/5 relative z-10">
        <div className="w-full px-6 md:px-16 lg:px-24">
          
          <div className="max-w-xl mb-12">
            <span className="text-gold font-bold text-[10px] font-code uppercase tracking-widest">// 03. LOADED DRIVERS</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
              System Driver Modules
            </h2>
            <div className="w-12 h-0.5 bg-gold mt-4" />
          </div>

          {/* Module drivers list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((p) => (
              <div
                key={p.title}
                onClick={() => setExpandedProject(p)}
                className="group cursor-pointer rounded-2xl border border-white/5 bg-[#07080a] overflow-hidden transition-all duration-300 hover:border-gold/30 hover:shadow-2xl"
              >
                <div className="h-[180px] relative overflow-hidden bg-neutral-900 border-b border-white/5">
                  <img
                    src={`/${p.photoFile}`}
                    alt={p.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-opacity duration-300"
                  />
                  <div className="absolute top-4 left-4 font-code text-[9px] bg-black/75 px-2 py-0.5 rounded border border-white/10 text-zinc-400">
                    ADDR: {p.hex}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-serif text-base font-bold text-white group-hover:text-gold transition-colors">
                    {p.title}
                  </h3>
                  <div className="text-[10px] font-code text-zinc-500 uppercase tracking-wider">{p.type}</div>
                  <p className="text-zinc-400 text-[11px] font-light leading-relaxed line-clamp-2">
                    {p.desc}
                  </p>
                  
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-code text-zinc-500 group-hover:text-gold uppercase tracking-wider">
                    <span>{p.metric}</span>
                    <span>EXPAND →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Project expanded Modal overlay */}
          {expandedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
              <div className="bg-[#0d0e12] border border-white/10 rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl relative">
                
                <button
                  onClick={() => setExpandedProject(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-black/60 text-zinc-400 hover:text-white border border-white/10 transition-colors z-10"
                >
                  <X className="w-4.5 h-4.5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-[200px] md:h-full relative min-h-[200px] bg-neutral-900 border-r border-white/5">
                    <img
                      src={`/${expandedProject.photoFile}`}
                      alt={expandedProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 font-code text-[9px] bg-black/75 px-2 py-0.5 rounded border border-white/15 text-zinc-300">
                      {expandedProject.hex}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[9px] font-code text-gold uppercase tracking-widest">
                          {expandedProject.type}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-white mt-1">
                          {expandedProject.title}
                        </h3>
                      </div>
                      <hr className="border-white/5" />
                      
                      <p className="text-zinc-400 text-[11px] font-light leading-relaxed">
                        {expandedProject.desc}
                      </p>

                      <div>
                        <label className="block text-[8px] font-code uppercase tracking-widest text-zinc-500 mb-1">
                          Compiled Stack:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {expandedProject.stack.map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-white/5 border border-white/5 font-code text-[9px] text-zinc-400 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <a
                        href={expandedProject.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2.5 rounded bg-white hover:bg-gold hover:text-[#07080a] text-[#07080a] font-bold text-[9px] uppercase tracking-wider text-center transition-all"
                      >
                        Repository ↗
                      </a>
                      {expandedProject.liveUrl && (
                        <a
                          href={expandedProject.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2.5 rounded border border-white/10 hover:border-gold text-zinc-300 hover:text-gold font-bold text-[9px] uppercase tracking-wider text-center transition-all"
                        >
                          Live Demo ↗
                        </a>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </section>

      {/* ══ EXPERIENCE SYSTEM PROCESS SCHEDULER ══ */}
      <section id="experience" className="w-full py-20 bg-[#07080a] relative z-10">
        <div className="w-full px-6 md:px-16 lg:px-24">
          
          <div className="max-w-xl mb-12">
            <span className="text-gold font-bold text-[10px] font-code uppercase tracking-widest">// 04. PROCESS SCHEDULER</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
              Career Execution Timeline
            </h2>
            <p className="text-zinc-500 text-xs font-light mt-3 max-w-md">
              A chronological sequence of professional process threads scheduled in active memory workspaces.
            </p>
          </div>

          {/* Process scheduler table */}
          <div className="w-full border border-white/5 rounded-2xl bg-[#0d0e12] overflow-x-auto shadow-xl select-none">
            <table className="w-full border-collapse text-left font-code text-xs">
              
              {/* Table header */}
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="p-4">PID</th>
                  <th className="p-4">Period</th>
                  <th className="p-4">Thread Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">CPU%</th>
                  <th className="p-4">State</th>
                </tr>
              </thead>

              {/* Table body */}
              <tbody>
                {EXP_ITEMS.map((exp, idx) => (
                  <React.Fragment key={idx}>
                    
                    {/* Main Row */}
                    <tr className="border-b border-white/5 text-zinc-350 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-gold font-bold">{exp.pid}</td>
                      <td className="p-4 text-zinc-400 font-light">{exp.period}</td>
                      <td className="p-4 text-white font-bold">{exp.company}</td>
                      <td className="p-4 text-zinc-450 font-bold">{exp.role}</td>
                      <td className="p-4 text-emerald-400">{exp.cpu}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest ${
                          exp.state === 'RUNNING' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          exp.state === 'SLEEPING' ? "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20" :
                          "bg-amber-500/10 text-gold border border-gold/20"
                        }`}>
                          {exp.state}
                        </span>
                      </td>
                    </tr>

                    {/* Detailed info nested row */}
                    <tr className="bg-black/20 border-b border-white/5">
                      <td colSpan={6} className="p-5 font-sans leading-relaxed text-zinc-400 text-xs font-light">
                        <p className="mb-3 max-w-4xl text-neutral-300">
                          {exp.desc}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[10px] font-code text-zinc-500 uppercase tracking-widest mr-2 flex items-center">Scope:</span>
                          {exp.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 bg-white/5 border border-white/5 font-code text-[9px] text-zinc-500 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>

                  </React.Fragment>
                ))}
              </tbody>

            </table>
          </div>

        </div>
      </section>

      {/* ══ BEYOND CODE (EXTRACURRICULAR) ══ */}
      <section id="extracurricular" className="w-full py-20 bg-[#0d0e12]/40 border-y border-white/5 relative z-10">
        <div className="w-full px-6 md:px-16 lg:px-24">
          
          <div className="max-w-xl mb-12">
            <span className="text-gold font-bold text-[10px] font-code uppercase tracking-widest">// 05. BEYOND COMPILATION</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
              Beyond Code
            </h2>
            <div className="w-12 h-0.5 bg-gold mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXTRA_ITEMS.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-[#07080a] shadow-md flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-2xl">{item.icon}</div>
                  <h3 className="font-serif text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-zinc-400 text-[11px] font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <span className="text-[10px] font-code text-gold bg-gold/5 px-2.5 py-0.5 rounded border border-gold/10 uppercase tracking-wider self-start select-none">
                  {item.highlight}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ CONTACT & SYSTEM SHUTDOWN ══ */}
      <section id="contact" className="w-full py-24 bg-[#07080a] relative z-10">
        <div className="w-full px-6 md:px-16 lg:px-24 flex justify-center">
          
          <div className="bg-[#0d0e12] border border-white/5 p-8 sm:p-12 rounded-3xl w-full max-w-4xl relative overflow-hidden shadow-2xl">
            {/* Subtle glowing circuit dot */}
            <div className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full bg-gold animate-ping" />

            <div className="text-[9px] font-code text-gold tracking-widest uppercase mb-4">// 06. SYSTEM TERMINAL INTERACTION</div>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
              Let's compile <br className="hidden sm:inline" />
              <em className="text-gold font-normal">something real.</em>
            </h2>

            <p className="text-zinc-400 text-xs sm:text-sm font-light max-w-xl mb-10 leading-relaxed">
              Open to collaborative ML pipelines explorations, technical internships, full-stack systems engineering architectures and complex software audits. Responses return within 24 execution hours.
            </p>

            <a
              href="mailto:dineshyr2904@gmail.com"
              className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-code text-gold bg-gold/5 px-4.5 py-2.5 rounded-xl border border-gold/15 hover:bg-gold hover:text-[#07080a] hover:border-gold transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
              <span>dineshyr2904@gmail.com</span>
            </a>

            {/* Social profiles and download */}
            <div className="flex flex-wrap gap-3.5 mt-8 border-t border-white/5 pt-8">
              <a
                href="https://www.linkedin.com/in/dinesh-a-122983374/"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg border border-white/10 hover:border-gold text-zinc-450 hover:text-gold text-[10px] font-code uppercase tracking-wider font-semibold transition-all"
              >
                ↗ LinkedIn
              </a>
              <a
                href="https://github.com/dineshyr29-04"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg border border-white/10 hover:border-gold text-zinc-450 hover:text-gold text-[10px] font-code uppercase tracking-wider font-semibold transition-all"
              >
                ↗ GitHub
              </a>
              <span className="px-4 py-2 rounded-lg border border-white/10 text-zinc-600 text-[10px] font-code uppercase tracking-wider font-semibold select-none cursor-not-allowed">
                ↓ Download Resume
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* ══ FOOTER SYSTEM HALT ══ */}
      <footer className="w-full py-8 border-t border-white/5 bg-[#07080a] text-center text-[10px] font-code text-zinc-550 select-none">
        <div className="w-full px-6 md:px-16 lg:px-24">
          <p>
            dinesh_a@Dinesh-PC:~$ shutdown -h now &nbsp;·&nbsp; Build v2.4.1 &nbsp;·&nbsp; Built with Precision &nbsp;·&nbsp; 2026
          </p>
        </div>
      </footer>
    </>
  );
}
