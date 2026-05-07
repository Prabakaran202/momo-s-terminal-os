export const PROFILE = {
  name: "Prabakaran P",
  alias: "Momo Hayase",
  handle: "momo@hayase",
  role: "Full-Stack Developer · Systems Tinkerer",
  location: "Earth / Terminal#1",
  email: "prabakaran@hayase.dev",
  github: "https://github.com/momohayase",
  linkedin: "https://linkedin.com/in/prabakaran-p",
  twitter: "https://twitter.com/momohayase",
};

export const ABOUT = `I'm Prabakaran P — known online as "Momo Hayase".
I build web systems, automate boring things, and spend too much
time inside terminals. Comfortable across the stack: TypeScript,
Python, Rust, Go, plus the assorted plumbing that keeps it all alive.

Currently: shipping side-projects, breaking production locally,
and learning whatever rabbit hole the week throws at me.`;

export const SKILLS = {
  languages: ["TypeScript", "Python", "Rust", "Go", "C", "SQL"],
  frontend: ["React", "Next.js", "TanStack", "Tailwind", "Three.js"],
  backend: ["Node.js", "FastAPI", "Postgres", "Redis", "gRPC"],
  devops: ["Docker", "Linux", "Nginx", "Cloudflare", "GitHub Actions"],
  tools: ["Neovim", "tmux", "zsh", "git", "ffmpeg"],
};

export const PROJECTS = [
  {
    name: "kernel-cat",
    desc: "A tiny syscall-tracing CLI written in Rust. eBPF-based.",
    stack: ["Rust", "eBPF", "Linux"],
    url: "https://github.com/momohayase/kernel-cat",
  },
  {
    name: "lofi-tunnel",
    desc: "Self-hosted reverse-proxy + lofi radio. Because why not.",
    stack: ["Go", "WebRTC", "Docker"],
    url: "https://github.com/momohayase/lofi-tunnel",
  },
  {
    name: "neon.nvim",
    desc: "A Neovim colorscheme tuned for late nights and cyberpunk vibes.",
    stack: ["Lua", "Neovim"],
    url: "https://github.com/momohayase/neon.nvim",
  },
  {
    name: "packet-poet",
    desc: "Turns network captures into haikus. Useless. Beautiful.",
    stack: ["Python", "Scapy"],
    url: "https://github.com/momohayase/packet-poet",
  },
];

export const EXPERIENCE = [
  {
    when: "2024 — present",
    where: "Freelance / Independent",
    what: "Building products, tooling, and infrastructure for small teams.",
  },
  {
    when: "2022 — 2024",
    where: "Hayase Labs",
    what: "Lead engineer on real-time data pipelines and dashboards.",
  },
  {
    when: "2020 — 2022",
    where: "Various Startups",
    what: "Full-stack: React, Node, Postgres. Shipped, broke, fixed.",
  },
];
