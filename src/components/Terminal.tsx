import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PROFILE, ABOUT, SKILLS, EXPERIENCE, PROJECTS, type Project } from "@/lib/portfolio-data";

type Line = {
  id: number;
  type: "system" | "input" | "output" | "error" | "ascii" | "success";
  content: React.ReactNode;
};

const BANNER = String.raw`
  ____                 _                         _          _           
 |  _ \  _____   _____| | ___  _ __   ___ _ __  | |    __ _| |__  ___   
 | | | |/ _ \ \ / / _ \ |/ _ \| '_ \ / _ \ '__| | |   / _\` | '_ \/ __|  
 | |_| |  __/\ V /  __/ | (_) | |_) |  __/ |    | |__| (_| | |_) \__ \  
 |____/ \___| \_/ \___|_|\___/| .__/ \___|_|    |_____\__,_|_.__/|___/  
                              |_|                                       
`;

const BOOT_LINES = [
  "Initializing Developer Labs OS...",
  "[ OK ] Mounting /dev/portfolio",
  "[ OK ] Loading module: compiler",
  "[ OK ] Loading module: backend",
  "[ OK ] Loading module: ai-engine",
  "[ OK ] Linking LLVM infrastructure",
  "[ OK ] Spawning shell: bash 5.2",
  "Welcome, Visitor. Type 'help' for available commands.",
];

const HELP: Array<[string, string]> = [
  ["help", "show this list of commands"],
  ["cat about.txt", "display bio"],
  ["cat skills.txt", "show technical skills"],
  ["cat experience.txt", "show experience"],
  ["ls projects/", "list all projects"],
  ["cat projects/<name>", "show project details"],
  ["open resume", "download CV"],
  ["open github", "open GitHub profile"],
  ["open tamizhi-forge", "open Tamizhi Forge IDE"],
  ["whoami", "current operator"],
  ["clear", "clear terminal"],
];

const PROJECT_MAP: Record<string, Project> = Object.fromEntries(
  PROJECTS.map((p) => [p.slug, p]),
);

let _id = 0;
const nextId = () => ++_id;

export function Terminal({ mobile = false }: { mobile?: boolean }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(mobile);
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const push = useCallback((line: Omit<Line, "id">) => {
    setLines((prev) => [...prev, { ...line, id: nextId() }]);
  }, []);

  const run = useCallback(
    (raw: string, opts?: { silent?: boolean }) => {
      const cmd = raw.trim();
      if (!opts?.silent) {
        push({
          type: "input",
          content: (
            <>
              <Prompt /> <span className="text-foreground">{raw}</span>
            </>
          ),
        });
      }
      if (!cmd) return;
      const lower = cmd.toLowerCase();

      // Easter egg
      if (lower === "sudo rm -rf /" || lower === "sudo rm -rf /*") {
        push({
          type: "error",
          content: "Nice try. Developer Labs is indestructible. 💀",
        });
        return;
      }

      const [name, ...args] = cmd.split(/\s+/);
      const arg = args.join(" ");

      switch (name.toLowerCase()) {
        case "help":
          push({
            type: "output",
            content: (
              <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-0.5">
                {HELP.map(([c, d]) => (
                  <div key={c} className="contents">
                    <span className="text-terminal-yellow">{c}</span>
                    <span className="text-muted-foreground">— {d}</span>
                  </div>
                ))}
              </div>
            ),
          });
          break;
        case "whoami":
          push({
            type: "output",
            content: (
              <div>
                <span className="text-terminal-cyan">{PROFILE.handle}</span>
                <div>{PROFILE.name} <span className="text-muted-foreground">aka</span> <span className="text-terminal-magenta">{PROFILE.alias}</span></div>
                <div className="text-muted-foreground">{PROFILE.role}</div>
              </div>
            ),
          });
          break;
        case "cat": {
          if (!arg) {
            push({ type: "error", content: "cat: missing file operand" });
            break;
          }
          if (arg === "about.txt" || arg === "about") {
            push({ type: "output", content: <pre className="whitespace-pre-wrap">{ABOUT}</pre> });
          } else if (arg === "skills.txt" || arg === "skills") {
            push({ type: "output", content: <pre className="whitespace-pre-wrap">{SKILLS}</pre> });
          } else if (arg === "experience.txt" || arg === "experience") {
            push({ type: "output", content: <pre className="whitespace-pre-wrap">{EXPERIENCE}</pre> });
          } else if (arg.startsWith("projects/")) {
            const slug = arg.replace(/^projects\//, "").replace(/\.txt$/, "");
            const p = PROJECT_MAP[slug];
            if (!p) {
              push({ type: "error", content: `cat: projects/${slug}: No such file or directory` });
            } else {
              push({ type: "output", content: <ProjectCard p={p} /> });
            }
          } else {
            push({ type: "error", content: `cat: ${arg}: No such file or directory` });
          }
          break;
        }
        case "ls": {
          const target = arg.replace(/\/$/, "");
          if (!arg || target === "" || target === "." || target === "~") {
            push({
              type: "output",
              content: (
                <div className="flex flex-wrap gap-x-4">
                  <span className="text-terminal-cyan">about.txt</span>
                  <span className="text-terminal-cyan">skills.txt</span>
                  <span className="text-terminal-cyan">experience.txt</span>
                  <span className="text-terminal-yellow">projects/</span>
                </div>
              ),
            });
          } else if (target === "projects") {
            push({
              type: "output",
              content: (
                <div>
                  <div className="mb-2 text-terminal-magenta">── The Tamizhi Ecosystem ──</div>
                  <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                    {PROJECTS.map((p) => (
                      <button
                        key={p.slug}
                        onClick={() => run(`cat projects/${p.slug}`)}
                        className="text-left text-terminal-cyan hover:underline"
                      >
                        ▸ {p.slug}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    hint: cat projects/&lt;name&gt;
                  </div>
                </div>
              ),
            });
          } else {
            push({ type: "error", content: `ls: cannot access '${arg}': No such file or directory` });
          }
          break;
        }
        case "open": {
          if (!arg) {
            push({ type: "error", content: "open: usage — open <resume|github|tamizhi-forge>" });
            break;
          }
          const t = arg.toLowerCase();
          if (t === "resume" || t === "cv") {
            push({ type: "success", content: "Triggering CV download…" });
            const a = document.createElement("a");
            a.href = PROFILE.resume;
            a.download = "Prabakaran-P-Resume.pdf";
            a.click();
          } else if (t === "github") {
            push({ type: "success", content: `Opening ${PROFILE.github}` });
            window.open(PROFILE.github, "_blank", "noopener,noreferrer");
          } else if (t === "tamizhi-forge" || t === "forge" || t === "ide") {
            push({ type: "success", content: "Launching Tamizhi Forge IDE ↗" });
            window.open(PROFILE.tamizhiForge, "_blank", "noopener,noreferrer");
          } else {
            push({ type: "error", content: `open: unknown target '${arg}'` });
          }
          break;
        }
        case "clear":
        case "cls":
          setLines([]);
          break;
        case "echo":
          push({ type: "output", content: args.join(" ") });
          break;
        case "date":
          push({ type: "output", content: new Date().toString() });
          break;
        case "exit":
        case "logout":
          push({ type: "error", content: "There is no escape from the terminal." });
          break;
        default:
          push({ type: "error", content: `bash: command not found. Type 'help'` });
      }
    },
    [push],
  );

  // Boot sequence (desktop only)
  useEffect(() => {
    if (mobile) return;
    let cancelled = false;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      if (i < BOOT_LINES.length) {
        push({ type: "system", content: BOOT_LINES[i] });
        i++;
        setTimeout(tick, 180 + Math.random() * 140);
      } else {
        push({ type: "ascii", content: BANNER });
        setBooted(true);
      }
    };
    tick();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile]);

  // Mobile: pre-run common commands
  useEffect(() => {
    if (!mobile) return;
    push({ type: "ascii", content: BANNER });
    push({ type: "system", content: "Welcome, Visitor. Showing pre-run commands ↓" });
    const cmds = ["whoami", "cat about.txt", "ls projects/", "cat skills.txt", "cat experience.txt"];
    cmds.forEach((c) => run(c, { silent: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    if (booted && !mobile) inputRef.current?.focus();
  }, [booted, mobile]);

  const focusInput = () => inputRef.current?.focus();

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const v = input;
      setInput("");
      if (v.trim()) {
        setHistory((h) => [...h, v]);
        setHIdx(-1);
      }
      run(v);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = hIdx === -1 ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIdx === -1) return;
      const idx = hIdx + 1;
      if (idx >= history.length) {
        setHIdx(-1);
        setInput("");
      } else {
        setHIdx(idx);
        setInput(history[idx]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const quickButtons = useMemo(
    () => ["help", "cat about.txt", "ls projects/", "cat skills.txt", "open resume"],
    [],
  );

  return (
    <div
      className="relative mx-auto flex w-full max-w-6xl flex-col"
      onClick={focusInput}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 rounded-t-md border border-border border-b-0 bg-card/70 px-3 py-2 backdrop-blur">
        <span className="h-3 w-3 rounded-full bg-terminal-red/80" />
        <span className="h-3 w-3 rounded-full bg-terminal-yellow/80" />
        <span className="h-3 w-3 rounded-full bg-terminal-green/80" />
        <span className="ml-3 truncate text-xs text-muted-foreground">
          developer-labs@portfolio: ~ — bash
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="flicker max-h-[70dvh] min-h-[60dvh] flex-1 overflow-y-auto rounded-b-md border border-border bg-card/40 p-3 text-[12.5px] leading-relaxed backdrop-blur sm:p-4 sm:text-sm"
      >
        {lines.map((l) => (
          <div key={l.id} className={lineClass(l.type)}>
            {l.type === "ascii" && typeof l.content === "string" ? (
              <pre className="text-glow text-terminal-green text-[8px] sm:text-xs leading-tight">
                {l.content}
              </pre>
            ) : (
              l.content
            )}
          </div>
        ))}

        {booted && !mobile && (
          <div className="flex items-center gap-2">
            <Prompt />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              className="flex-1 bg-transparent text-foreground caret-terminal-green outline-none"
              aria-label="terminal input"
            />
          </div>
        )}

        {mobile && (
          <div className="mt-2 flex items-center gap-2">
            <Prompt />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              placeholder="tap a chip below or type…"
              className="flex-1 bg-transparent text-foreground caret-terminal-green outline-none placeholder:text-muted-foreground/60"
              aria-label="terminal input"
            />
          </div>
        )}
      </div>

      {/* Quick chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {quickButtons.map((c) => (
          <button
            key={c}
            onClick={(e) => {
              e.stopPropagation();
              run(c);
              focusInput();
            }}
            className="rounded border border-terminal-green/40 px-2 py-1 text-[11px] text-terminal-green transition hover:bg-terminal-green hover:text-primary-foreground sm:text-xs"
          >
            $ {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <div className="border-l-2 border-terminal-green/60 pl-3">
      <div className="text-terminal-green text-glow font-semibold">▸ {p.name}</div>
      <div className="text-foreground/90">{p.tagline}</div>
      <ul className="mt-1 space-y-0.5">
        {p.bullets.map((b) => (
          <li key={b} className="text-muted-foreground">  · {b}</li>
        ))}
      </ul>
      <div className="mt-1 text-xs text-terminal-cyan">
        stack :: [{p.stack.join(", ")}]
      </div>
      {p.link && (
        <a
          href={p.link}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block text-terminal-magenta hover:underline"
        >
          ↗ open {p.name}
        </a>
      )}
    </div>
  );
}

function Prompt() {
  return (
    <span className="whitespace-nowrap">
      <span className="text-terminal-green">developer-labs@portfolio</span>
      <span className="text-muted-foreground">:</span>
      <span className="text-terminal-cyan">~</span>
      <span className="text-muted-foreground">$</span>
    </span>
  );
}

function lineClass(t: Line["type"]) {
  switch (t) {
    case "system":
      return "text-terminal-dim text-xs";
    case "error":
      return "text-terminal-red whitespace-pre-wrap";
    case "success":
      return "text-terminal-green";
    case "ascii":
      return "";
    case "input":
      return "mt-1";
    default:
      return "text-foreground";
  }
}
