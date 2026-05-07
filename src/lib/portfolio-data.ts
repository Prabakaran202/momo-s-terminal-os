export const PROFILE = {
  name: "Prabakaran P",
  alias: "Momo Hayase",
  handle: "developer-labs@portfolio",
  role: "Founder of Developer Labs | Backend Architect | LLVM & AI Enthusiast",
  github: "https://github.com/Prabakaran202",
  resume: "/resume.pdf",
  tamizhiForge: "#tamizhi-forge",
};

export const ABOUT = `Name : Prabakaran P  (alias: Momo Hayase)
Role : Founder of Developer Labs | Backend Architect | LLVM & AI Enthusiast

Bio  : BCA student with deep passion for System-Level Programming and
       Backend Architecture. Through Developer Labs, building tools that
       simplify the developer's workflow — from Linux kernel internals
       to cloud deployments.`;

export const SKILLS = `── Core Systems ─────────────────────────────
   LLVM Infrastructure · Compiler Design · DNA-VM Logic

── Backend ──────────────────────────────────
   FastAPI · Python (Expert) · SQL Engine Optimization

── DevOps / Linux ───────────────────────────
   Arch Linux · Manjaro · Termux · Git/GitHub · Render / Vercel

── Frontend ─────────────────────────────────
   React · Next.js  (for Dev Tools UI)`;

export const EXPERIENCE = `▸ Founder @ Developer Labs
    Open-source developer tooling ecosystem.

▸ Backend Developer Intern @ Neoskillz
    Production FastAPI services & data pipelines.

▸ Community Lead @ BackendDeveloperHub
    Mentoring aspiring backend engineers.`;

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  bullets: string[];
  stack: string[];
  link?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "tamizhi",
    name: "Tamizhi Language",
    tagline: "Linux-native, LLVM-based compiled programming language.",
    bullets: [
      "3-pass parser architecture",
      "Universal IR backend",
      "Native code generation via LLVM",
    ],
    stack: ["C", "LLVM-C", "Python"],
  },
  {
    slug: "tamizhi-forge",
    name: "Tamizhi Forge IDE",
    tagline: "Modern glassmorphic online IDE for Tamizhi.",
    bullets: [
      "Live AST visualizer",
      "Embedded terminal",
      "Monaco-powered editor",
    ],
    stack: ["Next.js", "Monaco Editor", "Tailwind CSS"],
    link: "#tamizhi-forge",
  },
  {
    slug: "dna-vm",
    name: "DNA-VM",
    tagline: "Futuristic binary AOT storage system.",
    bullets: [
      "Encodes machine code into DNA sequences",
      "Custom decode pipeline",
    ],
    stack: ["C", "Machine Logic"],
  },
  {
    slug: "ai-api-butler",
    name: "AI-API-Butler",
    tagline: "Intelligent API orchestration layer.",
    bullets: [
      "Manages multi-model AI interactions",
      "Simplified, unified REST surface",
    ],
    stack: ["FastAPI", "Python", "REST APIs"],
  },
  {
    slug: "bdh-linux",
    name: "BDH-Linux",
    tagline: "Open-source CLI tool for backend devs.",
    bullets: [
      "Automates backend env setup on Arch & Manjaro",
      "One-shot reproducible installs",
    ],
    stack: ["Shell", "Python"],
  },
  {
    slug: "bdh-fastapi-new",
    name: "bdh-fastapi-new",
    tagline: "Advanced FastAPI scaffolding CLI.",
    bullets: [
      "Rapid backend project initialization",
      "Opinionated, production-ready layout",
    ],
    stack: ["Python"],
  },
];
