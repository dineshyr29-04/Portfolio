"use client";

import { useState, useEffect, useRef } from 'react';
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
    title: 'HackArena Platform',
    desc: 'Co-founded and engineered HackArena, a premium hackathon evaluation and management ecosystem. Features real-time tracking, team matchmaking modules, and automated scoring configurations.',
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
    desc: 'Co-founded and engineered the customer portal for the ThinkNode cloud platform, enabling automated SaaS workflows and high-speed data analytics dashboards.',
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
    title: 'CardioNerve Analytics',
    desc: 'Co-founded and architected CardioNerve, an AI-driven cardiovascular analytics platform to process sensor telemetry data and compute predictive cardiac health scores.',
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
    role: 'Founder & Chief Systems Architect',
    desc: 'Co-founded and architected Cardio Nerve, an AI-driven cardiovascular intelligence platform analyzing real-time HRV data from PPG sensors to generate predictive risk scores. Designed clinical dashboards and deployed production LLM pipelines processing 2M+ daily requests.',
    tags: ['Express.js', 'PyTorch', 'Python', 'Node.js'],
    cpu: '18%',
    state: 'RUNNING'
  },
  {
    pid: 3002,
    period: '2024 — Present',
    company: 'HackArena',
    role: 'Founder & Lead Developer',
    desc: 'Co-founded and engineered HackArena, a next-generation hackathon management engine and event platform. Spearheaded the technical infrastructure supporting 500+ active participants, automated judging algorithms, and real-time team collaboration metrics.',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    cpu: '12%',
    state: 'RUNNING'
  },
  {
    pid: 3003,
    period: '2024 — Present',
    company: 'ThinkNode',
    role: 'Founder & Full-Stack Architect',
    desc: 'Co-founded ThinkNode, building enterprise cloud customer portals and SaaS interfaces. Managed multi-tenant architectures, AI model deployment pipelines, and high-performance serverless dashboards.',
    tags: ['Node.js', 'Next.js', 'MongoDB', 'Redis'],
    cpu: '15%',
    state: 'RUNNING'
  }
];

const EXTRA_ITEMS = [
  {
    icon: '🏆',
    title: 'Hackathon Organizer',
    desc: 'Organized and managed large-scale hackathons with 500+ participants. Built the entire event platform from scratch.',
    highlight: 'Project Sankalp',
    log: 'LOG: EVENT_OK'
  },
  {
    icon: '📖',
    title: 'Research & Papers',
    desc: 'Actively studying transformer architectures, attention mechanisms, and publishing findings on ML system design.',
    highlight: 'Deep Learning Focus',
    log: 'LOG: RUN_OK'
  },
  {
    icon: '🌐',
    title: 'Open Source',
    desc: 'Contributing to open-source ML tools and building developer utilities used by the community.',
    highlight: 'GitHub Active',
    log: 'LOG: BUILD_OK'
  },
  {
    icon: '🎤',
    title: 'Tech Talks & Mentoring',
    desc: 'Presenting on AI/ML topics at college events and mentoring junior developers in web and ML engineering.',
    highlight: 'Community Builder',
    log: 'LOG: SYNC_OK'
  }
];

function Sparkline({ active }: { active: boolean }) {
  const [points, setPoints] = useState<number[]>([10, 15, 8, 12, 18, 14, 25, 20, 30, 22]);
  
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setPoints((prev) => {
        const next = [...prev.slice(1)];
        const last = prev[prev.length - 1];
        const change = (Math.random() - 0.5) * 12;
        const newVal = Math.max(5, Math.min(45, last + change));
        next.push(newVal);
        return next;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [active]);

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * 12} ${50 - p}`).join(' ');
  return (
    <svg className="w-24 h-8 text-emerald-400 opacity-80" viewBox="0 0 108 50" fill="none">
      <path d={pathD} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // System Stats Simulation
  const [cpuLoad, setCpuLoad] = useState('8.4%');
  const [ramUsage, setRamUsage] = useState('5.6GB');
  const [uptime, setUptime] = useState('00:00:00');

  // Accent Theme Controller state
  const [theme, setTheme] = useState<'gold' | 'emerald' | 'amber' | 'cobalt' | 'crimson'>('gold');

  // Code Playground States
  const [runnerTab, setRunnerTab] = useState<'C' | 'Python'>('C');
  const [editorCode, setEditorCode] = useState(CODE_TABS.C.code);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);

  // Skill Segment Map state
  const [selectedSegment, setSelectedSegment] = useState(SKILL_MAPS[0]);
  const [isSegmentLoading, setIsSegmentLoading] = useState(false);

  // Project Details Modal State
  const [expandedProject, setExpandedProject] = useState<typeof PROJECTS[0] | null>(null);

  // Experience details expand state
  const [expandedExp, setExpandedExp] = useState<number | null>(3001);

  // Projects View Mode & Console Explorer States
  const [projectsViewMode, setProjectsViewMode] = useState<'grid' | 'console'>('grid');
  const [selectedConsoleProj, setSelectedConsoleProj] = useState<typeof PROJECTS[0] | null>(null);

  // Diagnostics Drawer & CLI Terminal States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<string[]>([
    'Welcome to Cadi Shell v0.2.2',
    'Type "help" to see available commands.',
    ''
  ]);
  const [isRebooting, setIsRebooting] = useState(false);
  const [rebootLogs, setRebootLogs] = useState<string[]>([]);

  // BASH Mail client state
  const [mailForm, setMailForm] = useState({ name: '', email: '', message: '' });
  const [mailStep, setMailStep] = useState(0);
  const [mailLogs, setMailLogs] = useState<string[]>([]);

  // Refs for Terminal scroll and focus
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const terminalInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll terminal history to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [cliHistory]);

  // Auto-focus terminal input when diagnostics drawer opens
  useEffect(() => {
    if (drawerOpen) {
      const timer = setTimeout(() => {
        terminalInputRef.current?.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [drawerOpen]);

  // Sync Accent CSS Variables to root
  useEffect(() => {
    const root = document.documentElement;
    const themes = {
      gold: { accent: '#c5a880', light: '#ebd6b8' },
      emerald: { accent: '#10b981', light: '#34d399' },
      amber: { accent: '#f59e0b', light: '#fbbf24' },
      cobalt: { accent: '#3b82f6', light: '#60a5fa' },
      crimson: { accent: '#ef4444', light: '#f87171' }
    };
    const active = themes[theme];
    root.style.setProperty('--color-gold', active.accent);
    root.style.setProperty('--color-gold-light', active.light);
    root.style.setProperty('--accent3', active.accent);
  }, [theme]);

  // Select memory segment with transition
  const selectSegmentWithAnim = (seg: typeof SKILL_MAPS[0]) => {
    setIsSegmentLoading(true);
    setSelectedSegment(seg);
    setTimeout(() => {
      setIsSegmentLoading(false);
    }, 450);
  };

  // Run cyber hacking print simulation
  const runHackingSimulation = (currentHistory: string[]) => {
    const hist = [...currentHistory, 'cadi-os:~$ hack', '[*] INITIATING DECRYPTION PROTOCOL ON THINKNODE CORE...', ''];
    setCliHistory(hist);
    
    const steps = [
      '[*] Scanning network ports...',
      '[+] Port 8080 (ThinkNode API) - Vulnerability CVE-2026-X found.',
      '[*] Injecting payload to memory address 0x7FFF5DEC...',
      '[*] Overflowing stack pointer register (ESP)...',
      '[+] Firewall bypassed! Elevating privileges to kernel root...',
      '[SUCCESS] ROOT ACCESS ACQUIRED: dinesh_a@cadi-os:~#',
      'DECRYPTED FLAG: {CADI_OS_CORE_UNLOCKED}',
      'SYSTEM STATUS: ThinkNode, CardioNerve, and HackArena are 100% operational.',
      ''
    ];

    steps.forEach((stepText, index) => {
      setTimeout(() => {
        setCliHistory((prev) => [...prev, stepText]);
      }, (index + 1) * 300);
    });
  };

  // Contact client transmission simulation
  const startMailTransmission = () => {
    setMailStep(4);
    setMailLogs(['[*] Initializing SMTP handshake...', '[*] Compiling message payload...']);
    
    const logs = [
      '[*] Performing security handshake with SMTP client...',
      '[*] Packaging envelope: [From: ' + mailForm.email + ']',
      '[*] Encrypting message body (AES-256)...',
      '[+] Mail packet compiled successfully.',
      'cadi-mail:~$ ready to transmit payload to dineshyr2904@gmail.com'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setMailLogs((prev) => [...prev, log]);
        if (index === logs.length - 1) {
          setMailStep(5);
        }
      }, (index + 1) * 300);
    });
  };

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = cliInput.trim();
    if (!trimmedInput) return;

    const parts = trimmedInput.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    let response = '';
    const newHistory = [...cliHistory, `cadi-os:~$ ${cliInput}`];

    switch (cmd) {
      case 'help':
        response = 'Available commands:\n  help      - Show this menu\n  ls        - List active project drivers\n  neofetch  - Display system statistics\n  skills    - Visualise capabilities ASCII chart\n  theme     - Change CLI theme (e.g. "theme cobalt")\n  hack      - Launch cyber-security port decryptor\n  contact   - Get contact coordinates\n  reboot    - Reboot the Cadi OS system\n  clear     - Clear the console terminal';
        break;
      case 'ls':
      case 'projects':
        response = 'Loaded driver modules:\n  • Drug Secure\n  • HackArena Platform\n  • Thinknode Customer Portal\n  • Openloop Automation\n  • AgroNova Platform\n  • CardioNerve Analytics\n  • Developer Portfolio';
        break;
      case 'neofetch':
        response = ' dinesh_a@Cadi-PC\n ----------------\n OS: Cadi OS v0.2.2 (x86_64)\n Host: Dinesh-PC (Bangalore)\n Kernel: cadi-kernel v0.2.2-lts\n Uptime: ' + uptime + '\n Shell: bash / cadi-shell\n CPU: Simulated 8-Core Threaded Processor\n Memory: 5.6GB / 16GB (35%)';
        break;
      case 'skills':
        response = [
          'TECHNICAL CAPABILITIES SEGMENTS:',
          '=====================================',
          '• React/TypeScript   [██████████] 100%',
          '• Node.js/Vite       [█████████░]  90%',
          '• Tailwind CSS v4    [██████████] 100%',
          '• Python/MLOps       [████████░░]  80%',
          '• SQL/Databases      [████████░░]  80%',
          '=====================================',
          'Type "ls" to see project modules or scroll to the virtual memory sections.'
        ].join('\n');
        break;
      case 'theme':
        if (!arg) {
          response = 'Usage: theme <color>\nAvailable themes: gold, emerald, amber, cobalt, crimson\nExample: theme cobalt';
        } else if (['gold', 'emerald', 'amber', 'cobalt', 'crimson'].includes(arg)) {
          setTheme(arg as any);
          response = `Theme changed successfully to: ${arg.toUpperCase()}`;
        } else {
          response = `Theme "${arg}" not recognized. Available: gold, emerald, amber, cobalt, crimson`;
        }
        break;
      case 'hack':
        runHackingSimulation(cliHistory);
        setCliInput('');
        return;
      case 'contact':
        response = 'Credentials:\n  Email: dineshyr2904@gmail.com\n  GitHub: github.com/dineshyr29-04\n  LinkedIn: linkedin.com/in/dinesha291204';
        break;
      case 'clear':
        setCliHistory([]);
        setCliInput('');
        return;
      case 'reboot':
        triggerReboot();
        setCliInput('');
        return;
      default:
        response = `Command not found: "${cmd}". Type "help" for a list of commands.`;
    }

    setCliHistory([...newHistory, response, '']);
    setCliInput('');
  };

  const triggerReboot = () => {
    setIsRebooting(true);
    setDrawerOpen(false);
    setRebootLogs(['[cadi-os] Initiating system teardown...', '[cadi-os] Unmounting core memory segments...', '[cadi-os] Terminating active process threads...']);
    
    let step = 0;
    const logs = [
      '[cadi-os] Initiating system teardown...',
      '[cadi-os] Unmounting core memory segments...',
      '[cadi-os] Terminating active process threads...',
      '[cadi-os] Halt complete. Booting kernel bootstrap loader...',
      '[cadi-os] Memory check: 16384 MB OK',
      '[cadi-os] Loading virtual paging file systems...',
      '[cadi-os] CPU Core ONLINE (8 threads scheduled)',
      '[cadi-os] Mounting CardioNerve API node [OK]',
      '[cadi-os] Mounting HackArena Socket gateway [OK]',
      '[cadi-os] Mounting ThinkNode Client Portal [OK]',
      '[cadi-os] Starting system GUI...',
      '[cadi-os] Reboot sequence completed successfully.'
    ];

    const interval = setInterval(() => {
      if (step >= logs.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRebooting(false);
        }, 300);
        return;
      }
      setRebootLogs(prev => [...prev, logs[step]]);
      step++;
    }, 180);
  };

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
    const win = window as any;
    if (el) {
      if (win.lenis) {
        win.lenis.scrollTo(el, { offset: -90 });
      } else {
        const offset = 90;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
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
      <div 
        onClick={() => setDrawerOpen(!drawerOpen)}
        className="w-full bg-[#07080a]/90 backdrop-blur-md border-b border-white/5 py-2 px-6 md:px-16 lg:px-24 flex items-center justify-between text-[10px] font-code text-zinc-400 fixed top-0 left-0 right-0 z-50 select-none cursor-pointer hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            SYS: ONLINE
          </span>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden sm:inline">KERNEL: cadi-os v0.2.2</span>
          <span className="text-zinc-650 font-bold bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[8px] hover:text-gold transition-colors flex items-center gap-1">
            {drawerOpen ? "▲ CLOSE SHELL" : "▼ OPEN DIAGNOSTICS & SHELL"}
          </span>
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

      {/* 🛠️ DIAGNOSTICS DRAWER */}
      <div 
        className={`fixed left-0 right-0 z-45 bg-[#0a0b0e]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 ${
          drawerOpen ? "top-[34px] max-h-[350px] py-6" : "top-[-350px] max-h-0 py-0"
        }`}
      >
        <div className="w-full px-6 md:px-16 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 select-none text-left">
          {/* Left Panel: Service Telemetry */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] font-code font-bold text-zinc-400 uppercase tracking-widest">
                Telemetry Diagnostics
              </span>
              <span className="inline-flex items-center gap-1.5 text-[9px] font-code font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                PING: 24ms
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] font-code">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                <span className="text-zinc-500 block text-[9px] uppercase">Node Cluster</span>
                <span className="text-white font-bold">CADI-SOUTH-1</span>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                <span className="text-zinc-500 block text-[9px] uppercase">Telemetry Host</span>
                <span className="text-white font-bold">Cadi-PC</span>
              </div>
            </div>

            {/* Microservice checklist */}
            <div className="space-y-2 text-[10px] font-code pt-1">
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.01] border border-white/5">
                <span className="text-zinc-400">CardioNerve AI Pipeline</span>
                <span className="text-emerald-400 font-bold">HEALTHY</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.01] border border-white/5">
                <span className="text-zinc-400">HackArena Gateway Node</span>
                <span className="text-emerald-400 font-bold">HEALTHY</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white/[0.01] border border-white/5">
                <span className="text-zinc-400">ThinkNode Cloud Portal</span>
                <span className="text-emerald-400 font-bold">HEALTHY</span>
              </div>
            </div>

            {/* Reboot CTA */}
            <button
              onClick={triggerReboot}
              className="w-full py-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 font-code font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
            >
              ☢️ Force System Reboot
            </button>
          </div>

          {/* Right Panel: CLI Terminal Shell */}
          <div className="md:col-span-7 flex flex-col bg-black/60 border border-white/5 rounded-2xl overflow-hidden min-h-[220px]">
            {/* Terminal Header */}
            <div className="bg-white/5 px-4 py-2 flex justify-between items-center text-[10px] font-code border-b border-white/5">
              <span className="text-zinc-400 font-bold">cadi-shell --terminal</span>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
              </div>
            </div>

            {/* Terminal History */}
            <div className="flex-1 p-4 font-code text-[11px] text-zinc-300 overflow-y-auto max-h-[160px] space-y-1.5 select-text leading-relaxed" data-lenis-prevent>
              {cliHistory.map((line, idx) => (
                <div key={idx} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Input */}
            <form onSubmit={handleCliSubmit} className="border-t border-white/5 px-4 py-2.5 flex items-center gap-2">
              <span className="font-code text-[11px] text-emerald-400 select-none">cadi-os:~$</span>
              <input
                ref={terminalInputRef}
                type="text"
                value={cliInput}
                onChange={(e) => setCliInput(e.target.value)}
                placeholder="Type 'help' or 'neofetch'..."
                className="flex-1 bg-transparent border-none outline-none font-code text-[11px] text-white placeholder-zinc-750"
                autoFocus={drawerOpen}
              />
            </form>
          </div>
        </div>
      </div>

      {/* ══ NAV BAR ══ */}
      <nav className="fixed top-12 left-0 right-0 z-40 w-full px-6 select-none">
        <div className={`mx-auto w-full max-w-5xl rounded-full border transition-all duration-300 flex items-center justify-between ${
          scrolled 
            ? "bg-[#07080b]/85 backdrop-blur-lg border-white/10 py-2.5 px-6 md:px-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
            : "bg-white/[0.02] backdrop-blur-sm border-white/5 py-3 px-6 md:px-8"
        }`}>
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 group animate-fade-in"
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
                  className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-200 py-1 border-b relative group/item ${
                    activeSection === id ? "border-gold text-gold" : "border-transparent text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {label}
                  <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 transition-transform duration-300 origin-left group-hover/item:scale-x-100 ${
                    activeSection === id ? "scale-x-100" : ""
                  }`} />
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
          <div className="md:hidden absolute top-full left-6 right-6 mt-2 bg-[#07080a]/95 backdrop-blur-lg border border-white/10 py-5 px-6 rounded-2xl shadow-2xl flex flex-col gap-4 animate-fade-in">
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
              <Shuffle text="Founder of CardioNerve, HackArena & ThinkNode" duration={0.6} />
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl font-light">
              I am the founder of CardioNerve, HackArena, and ThinkNode. I design and deploy production-grade AI pipelines and full-stack systems with a focus on high-impact low-level core web architectures.
            </p>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => scrollTo('projects')}
                className="px-6 py-3 rounded-full bg-white hover:bg-gold text-[#07080a] font-bold text-[10px] tracking-widest uppercase transition-all shadow-lg hover:scale-[1.02]"
              >
                Explore Modules
              </button>
              <a
                href="https://www.linkedin.com/in/dinesha291204/"
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
          <div className="lg:col-span-6 bg-[#05070a] border border-white/5 rounded-2xl shadow-2xl p-5 md:p-6 font-code text-xs relative overflow-hidden select-none">
            
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
              <div className="p-3 bg-black/60 rounded-lg text-emerald-400 font-code text-[11px] min-h-[90px] max-h-[120px] overflow-y-auto space-y-1" data-lenis-prevent>
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
      <section id="about" className="w-full py-20 bg-[#05070a]/40 border-y border-white/5 relative z-10">
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
              <div className="relative p-6 border border-white/5 rounded-2xl bg-[#05070a]/80 max-w-sm w-full select-none shadow-xl">
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
                    onClick={() => selectSegmentWithAnim(seg)}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-300 flex justify-between items-center ${
                      selectedSegment.id === seg.id
                        ? "bg-white/5 border-gold text-white translate-x-1"
                        : "border-white/5 bg-[#05070a]/40 text-zinc-500 hover:border-white/10 hover:text-zinc-200"
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
            <div className="lg:col-span-6 bg-[#05070a] border border-white/5 p-6 md:p-8 rounded-2xl min-h-[280px] flex flex-col justify-between shadow-xl relative overflow-hidden">
              
              {isSegmentLoading ? (
                <div className="space-y-4 font-code text-gold/60 text-[11px] leading-relaxed select-none h-full flex flex-col justify-center py-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                    <span className="uppercase tracking-widest text-[9px] font-bold text-gold">READING MEMORY SEGMENT...</span>
                  </div>
                  <pre className="opacity-80 animate-pulse">
{`0x1E0D:  A2 C5 80 EB D6 B8 FF FF
0x2C4B:  10 B9 81 34 D3 99 AA BB
0x7F2A:  F5 9E 0B FB BF 24 CC DD
0x8E1B:  3B 82 F6 60 A5 FA EE FF
0x9D0C:  EF 44 44 F8 71 71 00 11`}
                  </pre>
                </div>
              ) : (
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
                    <label className="block text-[9px] uppercase font-code font-bold tracking-widest text-zinc-500 mb-3">
                      Segment Variables:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedSegment.skills.map((skill) => (
                        <div
                          key={skill}
                          className="px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 transition-all duration-300 hover:border-gold/30 hover:bg-white/[0.04] group/skill"
                        >
                          <div className="flex flex-col text-left">
                            <span className="font-code text-[10px] font-bold text-white tracking-wide group-hover/skill:text-gold transition-colors">{skill}</span>
                            <span className="font-code text-[7px] text-zinc-600 mt-0.5 select-none uppercase tracking-wider">
                              [0x{(skill.charCodeAt(0) * 16 + skill.charCodeAt(skill.length - 1)).toString(16).toUpperCase()}]
                            </span>
                          </div>
                          <span className="w-1 h-1 rounded-full bg-gold/40 group-hover/skill:bg-gold transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="text-[8px] font-code text-zinc-500 uppercase tracking-widest border-t border-white/5 pt-4 mt-6">
                * Hex segment memory block verified ok.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══ PROJECTS SECTION (SYSTEM DRIVERS) ══ */}
      <section id="projects" className="w-full py-20 bg-[#05070a]/40 border-y border-white/5 relative z-10">
        <div className="w-full px-6 md:px-16 lg:px-24">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
            <div>
              <span className="text-gold font-bold text-[10px] font-code uppercase tracking-widest">// 03. LOADED DRIVERS</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
                System Driver Modules
              </h2>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl font-code text-[9px] font-bold select-none shrink-0">
              <button
                onClick={() => setProjectsViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  projectsViewMode === 'grid' ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                GRID_HUD
              </button>
              <button
                onClick={() => {
                  setProjectsViewMode('console');
                  if (!selectedConsoleProj) setSelectedConsoleProj(PROJECTS[0]);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  projectsViewMode === 'console' ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                CONSOLE_SHELL
              </button>
            </div>
          </div>

          {projectsViewMode === 'grid' ? (
            /* Module drivers list */
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

                  <div className="p-5 space-y-2 text-left">
                    <h3 className="font-serif text-base font-bold text-white group-hover:text-gold transition-colors">
                      {p.title}
                    </h3>
                    <div className="text-[10px] font-code text-zinc-550 uppercase tracking-wider">{p.type}</div>
                    <p className="text-zinc-400 text-[11px] font-light leading-relaxed line-clamp-2">
                      {p.desc}
                    </p>
                    
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-code text-zinc-550 group-hover:text-gold uppercase tracking-wider">
                      <span>{p.metric}</span>
                      <span>EXPAND →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Console Explorer View */
            (() => {
              const activeProj = selectedConsoleProj || PROJECTS[0];
              return (
                <div className="w-full border border-white/10 rounded-2xl bg-[#090a0d]/90 backdrop-blur-md shadow-2xl flex flex-col md:flex-row min-h-[400px] overflow-hidden text-left font-code">
                  
                  {/* Left Pane: File Tree Explorer */}
                  <div className="w-full md:w-[280px] border-r border-white/5 bg-black/20 flex flex-col p-4 shrink-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-4 pb-2 border-b border-white/5 flex items-center gap-1.5">
                      <span>📁</span>
                      <span>SYSTEM_DRIVERS</span>
                    </div>
                    
                    <div className="space-y-1.5 overflow-y-auto max-h-[300px]" data-lenis-prevent>
                      {PROJECTS.map((p) => {
                        const isSelected = activeProj.title === p.title;
                        const fileBase = p.title.toLowerCase().replace(/\s+/g, '_') + '.sys';
                        return (
                          <button
                            key={p.title}
                            onClick={() => setSelectedConsoleProj(p)}
                            className={`w-full text-left p-2.5 rounded-xl border text-[11px] flex items-center gap-2.5 transition-all cursor-pointer ${
                              isSelected
                                ? "bg-gold/10 border-gold/30 text-gold"
                                : "bg-transparent border-transparent text-zinc-400 hover:bg-white/[0.02] hover:text-zinc-200"
                            }`}
                          >
                            <span>📄</span>
                            <span className="truncate">{fileBase}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Pane: Visual Console Inspector */}
                  <div className="flex-1 flex flex-col bg-black/40 min-h-[320px]">
                    
                    {/* File Path Header */}
                    <div className="bg-white/5 px-6 py-3 flex justify-between items-center text-[10px] border-b border-white/5">
                      <span className="text-zinc-400 font-bold">
                        cadi-editor: ~/system_drivers/{activeProj.title.toLowerCase().replace(/\s+/g, '_')}.sys
                      </span>
                      <span className="text-zinc-650 font-bold">[VIM MODE]</span>
                    </div>

                    {/* Inspector Content */}
                    <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[360px]" data-lenis-prevent>
                      
                      {/* Top header stats block */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-white/5 pb-5">
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase text-zinc-550 block">Memory Address</span>
                          <span className="text-emerald-400 text-xs font-bold font-code">{activeProj.hex}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase text-zinc-550 block">Driver Stack</span>
                          <span className="text-white text-xs font-bold font-code truncate block">
                            {activeProj.stack.join(' · ')}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] uppercase text-zinc-555 block">System Metric</span>
                          <span className="text-gold text-xs font-bold font-code block">{activeProj.metric}</span>
                        </div>
                      </div>

                      {/* Body Text and description */}
                      <div className="space-y-3">
                        <span className="text-[9px] uppercase text-zinc-555 block">Module Description</span>
                        <p className="text-zinc-350 text-xs md:text-sm font-sans font-light leading-relaxed max-w-4xl">
                          {activeProj.desc}
                        </p>
                      </div>

                      {/* Direct Action triggers */}
                      <div className="flex flex-wrap gap-3.5 pt-4 border-t border-white/5">
                        <a
                          href={activeProj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2.5 rounded-xl bg-white hover:bg-gold text-[#07080a] hover:text-[#07080a] font-bold text-[10px] uppercase tracking-wider transition-all"
                        >
                          View Source Code ↗
                        </a>
                        {activeProj.liveUrl && (
                          <a
                            href={activeProj.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-gold text-zinc-350 hover:text-gold font-bold text-[10px] uppercase tracking-wider transition-all"
                          >
                            Initialize Live Demo ↗
                          </a>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              );
            })()
          )}

          {/* Project expanded Modal overlay */}
          {expandedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
              <div className="bg-[#05070a] border border-white/10 rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl relative">
                
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

          {/* Process scheduler container */}
          <div className="space-y-4">
            {EXP_ITEMS.map((exp) => {
              const isExpanded = expandedExp === exp.pid;
              const color = exp.state === 'RUNNING' ? '#10b981' : exp.state === 'SLEEPING' ? '#71717a' : '#f59e0b';
              const shadowColor = exp.state === 'RUNNING' ? 'rgba(16,185,129,0.15)' : exp.state === 'SLEEPING' ? 'rgba(113,113,122,0.1)' : 'rgba(245,158,11,0.15)';
              return (
                <div
                  key={exp.pid}
                  onClick={() => setExpandedExp(isExpanded ? null : exp.pid)}
                  className={`group cursor-pointer rounded-2xl border transition-all duration-300 p-5 md:p-6 bg-[#05070a]/60 hover:bg-[#05070a]/90 ${
                    isExpanded 
                      ? "border-gold/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
                      : "border-white/5 hover:border-white/10"
                  }`}
                  style={{
                    borderLeft: `4px solid ${color}`,
                    boxShadow: isExpanded ? `0 15px 40px ${shadowColor}` : ''
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left side: Role + Company */}
                    <div className="flex items-center gap-4">
                      <div className="font-code text-xs text-zinc-500 font-bold bg-white/5 px-2.5 py-1 rounded border border-white/5">
                        PID: {exp.pid}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold transition-colors">
                            {exp.company}
                          </h3>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            exp.state === 'RUNNING' ? 'bg-emerald-500 animate-pulse' :
                            exp.state === 'SLEEPING' ? 'bg-zinc-500' : 'bg-amber-500'
                          }`} />
                        </div>
                        <p className="text-zinc-400 text-xs font-semibold mt-0.5">
                          {exp.role} <span className="text-zinc-700 font-normal">|</span> <span className="text-zinc-500 font-normal">{exp.period}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right side: Stats Dashboard */}
                    <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                      {/* Real-time Sparkline for RUNNING state */}
                      <div className="hidden sm:block">
                        <Sparkline active={exp.state === 'RUNNING'} />
                      </div>
                      
                      <div className="font-code text-right text-[11px] space-y-1">
                        <div className="text-zinc-500">
                          LOAD: <strong className="text-emerald-400">{exp.cpu}</strong>
                        </div>
                        <div className="text-zinc-500">
                          STATUS: <strong style={{ color }}>{exp.state}</strong>
                        </div>
                      </div>

                      <div className="text-zinc-400 group-hover:text-gold transition-colors pl-2">
                        <span className="text-lg font-code">{isExpanded ? '−' : '+'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Details with height animation */}
                  <div className={`transition-all duration-500 overflow-hidden ${
                    isExpanded ? "max-h-[500px] opacity-100 mt-5 pt-5 border-t border-white/5" : "max-h-0 opacity-0"
                  }`}>
                    <p className="text-zinc-350 text-xs md:text-sm font-light leading-relaxed max-w-4xl">
                      {exp.desc}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-4 pt-2">
                      <span className="text-[10px] font-code text-zinc-500 uppercase tracking-widest mr-2 flex items-center">
                        Active Workspace Modules:
                      </span>
                      {exp.tags.map((t) => (
                        <span key={t} className="px-2.5 py-1 bg-white/5 border border-white/5 font-code text-[10px] text-zinc-450 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══ BEYOND CODE (EXTRACURRICULAR) ══ */}
      <section id="extracurricular" className="w-full py-20 bg-[#05070a]/40 border-y border-white/5 relative z-10">
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
              <div
                key={idx}
                className="group relative p-6 rounded-2xl border border-white/5 bg-[#05070a]/40 backdrop-blur-md flex flex-col justify-between space-y-5 transition-all duration-300 hover:border-gold/30 hover:bg-[#05070a]/80 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(197,168,128,0.1)]"
              >
                {/* Glowing top line accent on hover */}
                <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                
                <div className="space-y-4">
                  {/* Glowing Icon Wrapper */}
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-lg transition-colors group-hover:bg-gold/10 group-hover:border-gold/30">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-white group-hover:text-gold transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-zinc-400 text-[11px] font-light leading-relaxed mt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[9px] font-code text-gold bg-gold/5 px-2.5 py-0.5 rounded-full border border-gold/15 uppercase tracking-wider select-none">
                    {item.highlight}
                  </span>
                  <span className="text-zinc-600 group-hover:text-gold transition-colors text-[9px] font-code tracking-wider uppercase">
                    {item.log}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══ CONTACT & SYSTEM SHUTDOWN ══ */}
      <section id="contact" className="w-full py-24 bg-[#07080a] relative z-10">
        <div className="w-full px-6 md:px-16 lg:px-24 flex justify-center">
          
          <div className="bg-[#05070a] border border-white/5 p-8 sm:p-12 rounded-3xl w-full max-w-4xl relative overflow-hidden shadow-2xl">
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

            {/* Cadi Mail Client Terminal */}
            <div className="mt-8 bg-black/45 border border-white/5 rounded-2xl p-6 font-code text-xs text-left text-zinc-350">
              <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-4 text-[10px] text-zinc-550">
                <span>cadi-mail --form-handler</span>
                <span className="text-gold font-bold uppercase select-none tracking-widest">[ READY ]</span>
              </div>
              
              {mailStep === 0 && (
                <div className="space-y-3">
                  <p className="text-zinc-500">// Enter sender&apos;s identifier to begin secure connection.</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gold">cadi-mail:~$ enter name:</span>
                    <input
                      type="text"
                      className="bg-transparent text-white border-b border-white/10 focus:border-gold focus:outline-none w-full sm:w-64 py-0.5 tracking-wide"
                      placeholder="e.g. Recruiter Name"
                      value={mailForm.name}
                      autoFocus
                      onChange={(e) => setMailForm({ ...mailForm, name: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && mailForm.name.trim()) setMailStep(1);
                      }}
                    />
                    <button
                      disabled={!mailForm.name.trim()}
                      onClick={() => setMailStep(1)}
                      className="px-3 py-1 rounded bg-white/5 hover:bg-gold hover:text-black transition-colors font-bold text-[10px] disabled:opacity-50 disabled:hover:bg-white/5 disabled:hover:text-zinc-350"
                    >
                      NEXT [Enter]
                    </button>
                  </div>
                </div>
              )}

              {mailStep === 1 && (
                <div className="space-y-3">
                  <p className="text-zinc-500">// Enter email coordinates for response routing.</p>
                  <div>
                    <span className="text-zinc-500">cadi-mail:~$ enter name:</span>
                    <span className="text-white ml-2">{mailForm.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gold">cadi-mail:~$ enter email:</span>
                    <input
                      type="email"
                      className="bg-transparent text-white border-b border-white/10 focus:border-gold focus:outline-none w-full sm:w-64 py-0.5 tracking-wide"
                      placeholder="e.g. name@company.com"
                      value={mailForm.email}
                      autoFocus
                      onChange={(e) => setMailForm({ ...mailForm, email: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && mailForm.email.trim().includes('@')) setMailStep(2);
                      }}
                    />
                    <button
                      disabled={!mailForm.email.trim().includes('@')}
                      onClick={() => setMailStep(2)}
                      className="px-3 py-1 rounded bg-white/5 hover:bg-gold hover:text-black transition-colors font-bold text-[10px] disabled:opacity-50 disabled:hover:bg-white/5"
                    >
                      NEXT [Enter]
                    </button>
                    <button 
                      onClick={() => setMailStep(0)} 
                      className="text-[9px] text-zinc-500 hover:text-zinc-300 ml-2"
                    >
                      [Back]
                    </button>
                  </div>
                </div>
              )}

              {mailStep === 2 && (
                <div className="space-y-3">
                  <p className="text-zinc-500">// Input payload message text bytes.</p>
                  <div>
                    <span className="text-zinc-500">cadi-mail:~$ enter name:</span>
                    <span className="text-white ml-2">{mailForm.name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">cadi-mail:~$ enter email:</span>
                    <span className="text-white ml-2">{mailForm.email}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-gold">cadi-mail:~$ enter message:</div>
                    <textarea
                      rows={3}
                      className="bg-transparent text-white border border-white/10 focus:border-gold focus:outline-none w-full p-2.5 rounded-lg tracking-wide resize-none font-code"
                      placeholder="Write your email proposal here..."
                      value={mailForm.message}
                      autoFocus
                      onChange={(e) => setMailForm({ ...mailForm, message: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey && mailForm.message.trim()) {
                          setMailStep(3);
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        disabled={!mailForm.message.trim()}
                        onClick={() => setMailStep(3)}
                        className="px-3.5 py-1.5 rounded bg-white/5 hover:bg-gold hover:text-black transition-colors font-bold text-[10px] disabled:opacity-50 disabled:hover:bg-white/5"
                      >
                        COMPILE [Ctrl+Enter]
                      </button>
                      <button 
                        onClick={() => setMailStep(1)} 
                        className="text-[9px] text-zinc-500 hover:text-zinc-300 flex items-center"
                      >
                        [Back]
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {mailStep === 3 && (
                <div className="space-y-3">
                  <p className="text-emerald-400 font-bold">// SECURE PACKET PRE-COMPILE COMPLETE. REVIEW SEGMENTS:</p>
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 space-y-1 text-zinc-400">
                    <div><span className="text-zinc-550">SENDER:</span> {mailForm.name}</div>
                    <div><span className="text-zinc-550">ROUTING:</span> {mailForm.email}</div>
                    <div className="border-t border-white/5 mt-2 pt-2"><span className="text-zinc-550">PAYLOAD:</span></div>
                    <p className="text-zinc-350 italic text-[11px] font-light leading-relaxed">{mailForm.message}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={startMailTransmission}
                      className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[10px] transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      TRANSMIT PACKET [send]
                    </button>
                    <button
                      onClick={() => {
                        setMailForm({ name: '', email: '', message: '' });
                        setMailStep(0);
                      }}
                      className="px-4 py-2 rounded bg-white/5 hover:bg-red-500 hover:text-white text-zinc-350 font-bold text-[10px] transition-all uppercase tracking-wider cursor-pointer"
                    >
                      RESET FORM [abort]
                    </button>
                  </div>
                </div>
              )}

              {mailStep === 4 && (
                <div className="space-y-2">
                  {mailLogs.map((log, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="text-gold">►</span>
                      <span className="font-code text-zinc-350">{log}</span>
                    </div>
                  ))}
                  <div className="blink-cursor inline-block w-1.5 h-3.5 bg-gold" />
                </div>
              )}

              {mailStep === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>[SUCCESS] ENVELOPE COMPILED & SEALED!</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] leading-relaxed max-w-lg">
                    Your email payload was encrypted and packetized into a standard URL stream. Press the button below to dispatch the secure envelope over your device&apos;s native mail client.
                  </p>
                  <div className="flex items-center gap-3.5 flex-wrap">
                    <a
                      href={`mailto:dineshyr2904@gmail.com?subject=Portfolio%20Message%20from%20${encodeURIComponent(mailForm.name)}&body=${encodeURIComponent(mailForm.message)}%0D%0A%0D%0AFrom:%20${encodeURIComponent(mailForm.name)}%20(${encodeURIComponent(mailForm.email)})`}
                      className="inline-flex items-center gap-2 text-xs font-code font-bold text-black bg-gold hover:bg-gold-light px-4 py-2.5 rounded-xl border border-gold hover:border-gold-light transition-all shadow-[0_0_12px_rgba(197,168,128,0.3)] animate-pulse"
                    >
                      <Mail className="w-4 h-4" />
                      <span>DISPATCH PAYLOAD (OPEN MAIL)</span>
                    </a>
                    <button
                      onClick={() => {
                        setMailForm({ name: '', email: '', message: '' });
                        setMailStep(0);
                        setMailLogs([]);
                      }}
                      className="px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-gold text-zinc-500 hover:text-gold transition-colors font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                    >
                      WRITE ANOTHER
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick fallback option */}
            <div className="mt-6 text-[10px] text-zinc-500 font-code text-center">
              Fallback direct address: <a href="mailto:dineshyr2904@gmail.com" className="text-gold hover:underline">dineshyr2904@gmail.com</a>
            </div>

            {/* Social profiles and download */}
            <div className="flex flex-wrap gap-3.5 mt-8 border-t border-white/5 pt-8">
              <a
                href="https://www.linkedin.com/in/dinesha291204/"
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
              <a
                href="/resume.pdf"
                download="Dinesh_Resume.pdf"
                className="px-4 py-2 rounded-lg border border-white/10 hover:border-gold text-zinc-450 hover:text-gold text-[10px] font-code uppercase tracking-wider font-semibold transition-all cursor-pointer"
              >
                ↓ Download Resume
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ══ FOOTER SYSTEM HALT ══ */}
      <footer className="w-full py-8 border-t border-white/5 bg-[#07080a] text-center text-[10px] font-code text-zinc-550 select-none">
        <div className="w-full px-6 md:px-16 lg:px-24">
          <p>
            dinesh_a@Cadi-PC:~$ shutdown -h now &nbsp;·&nbsp; Build v0.2.2 &nbsp;·&nbsp; Built with Precision &nbsp;·&nbsp; 2026
          </p>
        </div>
      </footer>

      {/* 🔌 REBOOT SYSTEM OVERLAY */}
      {isRebooting && (
        <div className="fixed inset-0 bg-[#040608] z-[9999] p-8 md:p-16 flex flex-col justify-start font-code text-xs text-emerald-400 overflow-y-auto leading-relaxed select-none text-left">
          <div className="max-w-2xl space-y-1">
            <pre className="text-emerald-500 font-bold mb-4">
{`
   ____          _  _           ___  ____  
  / ___|  __ _  (_)(_)         / _ \\/ ___| 
 | |     / _\` | | || | _____  | | | \\___ \\ 
 | |___ | (_| | | || ||_____| | |_| |___) |
  \\____| \\__,_| |_||_|         \\___/|____/ 
                                           
`}
            </pre>
            {rebootLogs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-emerald-600 select-none">►</span>
                <span>{log}</span>
              </div>
            ))}
            <div className="blink-cursor inline-block w-2 h-4 bg-emerald-400 mt-2" />
          </div>
        </div>
      )}
    </>
  );
}
