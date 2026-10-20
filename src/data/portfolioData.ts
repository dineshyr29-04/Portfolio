/**
 * PORTFOLIO DATA SOURCE OF TRUTH
 * ============================================================================
 * ALL personal details, projects, focuses, skills, achievements, experience,
 * and contact links are centralized in this single file.
 * 
 * To edit or add any details in your portfolio, simply modify this file!
 * ============================================================================
 */

export const github = 'https://github.com/dineshyr29-04';
export const email = 'dineshyr2904@gmail.com';
export const linkedin = 'https://www.linkedin.com/in/dinesha291204/';

export const navigation = [
  'Work',
  'Skills',
  'Achievements',
  'Approach',
  'About',
  'Contact',
];

export interface Project {
  name: string;
  category: string;
  featured?: boolean;
  summary: string;
  stack: string;
  source: string;
  live: string;
  detail: string;
}

export const projects: Project[] = [
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
    source: 'https://github.com/abbysallord/drug-secure',
    live: 'https://drug-secure.vercel.app',
    detail:
      'An Ayurvedic drug quality-control project using E-Tongue sensor inputs and K-Means clustering to explore patterns across batches.',
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

export interface Focus {
  name: string;
  number: string;
  title: string;
  description: string;
  tools: string;
  nodes: string[];
  note: string;
}

export const focuses: Focus[] = [
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

export const languages = [
  { name: 'C', context: 'Systems fundamentals' },
  { name: 'C++', context: 'Low-level programming' },
  { name: 'Rust', context: 'Memory-safe systems' },
  { name: 'Python', context: 'Data & automation' },
  { name: 'TypeScript', context: 'Typed applications' },
  { name: 'JavaScript', context: 'Web & services' },
  { name: 'SQL', context: 'Working with data' },
];

export const toolsets = [
  {
    title: 'Applications',
    note: 'Interfaces & services',
    tools: [
      'React',
      'Next.js',
      'HTML / CSS',
      'Tailwind CSS',
      'Node.js',
      'Express.js',
      'REST APIs',
    ],
  },
  {
    title: 'Systems & tooling',
    note: 'Development & deployment',
    tools: ['Linux', 'Git', 'Docker', 'Redis', 'Vercel'],
  },
  {
    title: 'Data & machine learning',
    note: 'Storage, analysis & models',
    tools: ['PostgreSQL', 'MongoDB', 'MySQL', 'PyTorch', 'Jupyter', 'K-Means'],
  },
];

export const clubRoles = [
  {
    club: 'NIAT Tech Club',
    role: 'President',
    description:
      'Leading technical initiatives, workshops, events, and student developer engagement.',
  },
  {
    club: 'YenTech Club',
    role: 'Web Development Head',
    description:
      'Leading web development activities, website projects, and technical collaboration.',
  },
];

export const achievements = [
  {
    title: 'Hackathon winner',
    detail: 'Won a hackathon through technical problem-solving and teamwork.',
  },
  {
    title: 'Two international hackathons',
    detail: 'Selected to participate in two international hackathons.',
  },
  {
    title: 'OpenLoop',
    detail: 'Led website development for a 24-hour national hackathon.',
  },
  {
    title: 'Project Sankalp — Code for Change',
    detail: 'Developed the official website for a 24-hour hackathon.',
  },
  {
    title: 'Replit Vibeathon',
    detail: 'Built a Smart AutoForm AI MVP during a 36-hour hackathon.',
  },
];

export const experiences = [
  {
    period: '2026 — Present',
    status: 'Current',
    organization: 'AWS Student Builder Group',
    role: 'Technical Lead',
  },
];
