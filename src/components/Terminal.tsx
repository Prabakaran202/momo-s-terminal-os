import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PROFILE, ABOUT, SKILLS, PROJECTS, EXPERIENCE } from "@/lib/portfolio-data";

type Line = {
  id: number;
  type: "system" | "input" | "output" | "error" | "ascii" | "success";
  content: React.ReactNode;
};

const BANNER = String.raw`
   __  ___                       __  __                          
  /  |/  /___  ____ ___  ____   / / / /___ ___  ______ _________ 
 / /|_/ / __ \/ __ \`__ \/ __ \ / /_/ / __ \`/ / / / __ \`/ ___/ _ \
/ /  / / /_/ / / / / / / /_/ // __  / /_/ / /_/ / /_/ (__  )  __/
\_/  /_/\____/_/ /_/ /_/\____//_/ /_/\__,_/\__, /\__,_/____/\___/ 
                                          /____/                  
`;

const BOOT_LINES = [
  "[    0.000000] BIOS-provided physical RAM map ::",
  "[    0.000123] Linux version 6.6.6-hayase (momo@hayase)",
  "[    0.001834] Command line: BOOT_IMAGE=/momo root=/dev/portfolio ro quiet",
  "[    0.012004] Detected CPU: hayase-cortex @ 4.20 GHz",
  "[    0.045210] Memory: 64GB RAM available · 1.21GW reserved for caffeine",
  "[    0.103482] Initializing terminal interface ........ [  OK  ]",
  "[    0.184012] Mounting /dev/portfolio at / .......... [  OK  ]",
  "[    0.231908] Loading kernel module: charisma.ko .... [  OK  ]",
  "[    0.302561] Starting service: ssh-into-the-void ... [  OK  ]",
  "[    0.430112] Bringing up loopback interface ........ [  OK  ]",
  "[    0.512904] Establishing connection to /dev/null .. [  OK  ]",
  "[    0.701032] Decrypting alias: Momo Hayase ......... [  OK  ]",
  "[    0.812004] All systems nominal. Welcome, operator.",
];

const CMD_HELP: Array<[string, string]> = [
  ["help", "show this list of commands"],
  ["whoami", "print operator identity"],
  ["about", "summary of who I am"],
  ["skills", "tech stack & tools"],
  ["projects", "list public projects"],
  ["experience", "work history"],
  ["contact", "ways to reach me"],
  ["socials", "github / linkedin / twitter"],
  ["ls", "list virtual filesystem"],
  ["cat <file>", "print a file (try: cat about.txt)"],
  ["sudo", "you do not have permission"],
  ["matrix", "follow the white rabbit"],
  ["clear", "wipe the terminal"],
  ["exit", "...try it"],
];

const FILES: Record<string, string> = {
  "about.txt": ABOUT,
  "skills.json": JSON.stringify(SKILLS, null, 2),
  "contact.txt": `email    :: ${PROFILE.email}\ngithub   :: ${PROFILE.github}\nlinkedin :: ${PROFILE.linkedin}\ntwitter  :: ${PROFILE.twitter}`,
  "readme.md": `# ${PROFILE.name}\n\nalias: ${PROFILE.alias}\nrole : ${PROFILE.role}\n\nType \`help\` to explore.`,
};

let _id = 0;
const nextId = () => ++_id;

export function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const [matrix, setMatrix] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const push = useCallback((line: Omit<Line, "id">) => {
    setLines((prev) => [...prev, { ...line, id: nextId() }]);
  }, []);

  // Boot sequence
  useEffect(() => {
    let cancelled = false;
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      if (i < BOOT_LINES.length) {
        push({ type: "system", content: BOOT_LINES[i] });
        i++;
        setTimeout(tick, 90 + Math.random() * 110);
      } else {
        push({ type: "ascii", content: BANNER });
        push({
          type: "success",
          content: (
            <>
              Welcome,{" "}
              <span className="text-terminal-cyan">operator</span>. Type{" "}
              <span className="text-terminal-yellow">help</span> to list commands.
            </>
          ),
        });
        setBooted(true);
      }
    };
    tick();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);

  const focusInput = () => inputRef.current?.focus();

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      push({
        type: "input",
        content: (
          <>
            <Prompt /> <span className="text-foreground">{raw}</span>
          </>
        ),
      });
      if (!cmd) return;
      const [name, ...args] = cmd.split(/\s+/);
      const lower = name.toLowerCase();

      switch (lower) {
        case "help":
          push({
            type: "output",
            content: (
              <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-0.5">
                {CMD_HELP.map(([c, d]) => (
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
                <span className="text-terminal-cyan">{PROFILE.handle}</span>{" "}
                <span className="text-muted-foreground">·</span>{" "}
                <span>{PROFILE.name}</span>{" "}
                <span className="text-muted-foreground">aka</span>{" "}
                <span className="text-terminal-magenta">{PROFILE.alias}</span>
                <div className="text-muted-foreground">{PROFILE.role}</div>
              </div>
            ),
          });
          break;
        case "about":
          push({ type: "output", content: <pre className="whitespace-pre-wrap">{ABOUT}</pre> });
          break;
        case "skills":
          push({
            type: "output",
            content: (
              <div className="space-y-1">
                {Object.entries(SKILLS).map(([cat, items]) => (
                  <div key={cat} className="flex flex-wrap gap-x-2">
                    <span className="text-terminal-yellow w-24 inline-block">{cat}</span>
                    <span className="text-muted-foreground">::</span>
                    <span>{items.join("  ·  ")}</span>
                  </div>
                ))}
              </div>
            ),
          });
          break;
        case "projects":
          push({
            type: "output",
            content: (
              <div className="space-y-3">
                {PROJECTS.map((p) => (
                  <div key={p.name} className="border-l-2 border-terminal-green/40 pl-3">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-terminal-cyan hover:underline"
                    >
                      ▸ {p.name}
                    </a>
                    <div className="text-foreground/90">{p.desc}</div>
                    <div className="text-xs text-muted-foreground">
                      [{p.stack.join(", ")}]
                    </div>
                  </div>
                ))}
              </div>
            ),
          });
          break;
        case "experience":
        case "exp":
          push({
            type: "output",
            content: (
              <div className="space-y-2">
                {EXPERIENCE.map((e) => (
                  <div key={e.when}>
                    <span className="text-terminal-yellow">{e.when}</span>{" "}
                    <span className="text-terminal-magenta">{e.where}</span>
                    <div className="text-muted-foreground pl-4">↳ {e.what}</div>
                  </div>
                ))}
              </div>
            ),
          });
          break;
        case "contact":
          push({ type: "output", content: <pre className="whitespace-pre-wrap">{FILES["contact.txt"]}</pre> });
          break;
        case "socials":
          push({
            type: "output",
            content: (
              <div className="flex flex-col gap-1">
                <a className="text-terminal-cyan hover:underline" href={PROFILE.github} target="_blank" rel="noreferrer">→ github.com/momohayase</a>
                <a className="text-terminal-cyan hover:underline" href={PROFILE.linkedin} target="_blank" rel="noreferrer">→ linkedin.com/in/prabakaran-p</a>
                <a className="text-terminal-cyan hover:underline" href={PROFILE.twitter} target="_blank" rel="noreferrer">→ twitter.com/momohayase</a>
              </div>
            ),
          });
          break;
        case "ls": {
          const files = Object.keys(FILES);
          push({
            type: "output",
            content: (
              <div className="flex flex-wrap gap-x-4">
                {files.map((f) => (
                  <span key={f} className="text-terminal-cyan">{f}</span>
                ))}
                <span className="text-terminal-yellow">projects/</span>
                <span className="text-terminal-yellow">.secrets/</span>
              </div>
            ),
          });
          break;
        }
        case "cat": {
          const file = args[0];
          if (!file) {
            push({ type: "error", content: "cat: missing file operand" });
            break;
          }
          if (FILES[file]) {
            push({ type: "output", content: <pre className="whitespace-pre-wrap">{FILES[file]}</pre> });
          } else {
            push({ type: "error", content: `cat: ${file}: No such file or directory` });
          }
          break;
        }
        case "sudo":
          push({
            type: "error",
            content: `[sudo] password for momo: ✗ ✗ ✗\nmomo is not in the sudoers file. This incident will be reported.`,
          });
          break;
        case "matrix":
          setMatrix(true);
          push({ type: "success", content: "Wake up, Neo… (click anywhere to exit)" });
          break;
        case "clear":
        case "cls":
          setLines([]);
          break;
        case "exit":
        case "logout":
          push({ type: "error", content: "nice try. there is no exit." });
          break;
        case "echo":
          push({ type: "output", content: args.join(" ") });
          break;
        case "date":
          push({ type: "output", content: new Date().toString() });
          break;
        case "uname":
          push({ type: "output", content: "HayaseOS 6.6.6-momo x86_64 GNU/Linux" });
          break;
        case "neofetch":
          push({ type: "output", content: <Neofetch /> });
          break;
        default:
          push({
            type: "error",
            content: `command not found: ${name} — type 'help' for a list`,
          });
      }
    },
    [push],
  );

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
    } else if (e.key === "Tab") {
      e.preventDefault();
      const cmds = CMD_HELP.map((c) => c[0].split(" ")[0]);
      const match = cmds.find((c) => c.startsWith(input));
      if (match) setInput(match);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const quickButtons = useMemo(
    () => ["help", "about", "skills", "projects", "contact"],
    [],
  );

  return (
    <div
      className="relative mx-auto flex h-[100dvh] w-full max-w-6xl flex-col p-2 sm:p-6"
      onClick={focusInput}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 rounded-t-lg border border-border border-b-0 bg-card/70 px-3 py-2 backdrop-blur">
        <span className="h-3 w-3 rounded-full bg-terminal-red/80" />
        <span className="h-3 w-3 rounded-full bg-terminal-yellow/80" />
        <span className="h-3 w-3 rounded-full bg-terminal-green/80" />
        <span className="ml-3 text-xs text-muted-foreground">
          momo@hayase: ~/portfolio — zsh — 132×42
        </span>
        <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">
          {new Date().toLocaleString()}
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="flicker flex-1 overflow-y-auto rounded-b-lg border border-border bg-card/40 p-4 text-[13px] leading-relaxed backdrop-blur sm:text-sm"
      >
        {lines.map((l) => (
          <div key={l.id} className={lineClass(l.type)}>
            {typeof l.content === "string" && l.type === "ascii" ? (
              <pre className="text-glow text-terminal-green text-[10px] sm:text-xs leading-tight">
                {l.content}
              </pre>
            ) : (
              l.content
            )}
          </div>
        ))}

        {booted && (
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
      </div>

      {/* Quick chips */}
      {booted && (
        <div className="mt-3 flex flex-wrap gap-2">
          {quickButtons.map((c) => (
            <button
              key={c}
              onClick={(e) => {
                e.stopPropagation();
                run(c);
                focusInput();
              }}
              className="rounded border border-terminal-green/40 px-2 py-1 text-xs text-terminal-green transition hover:bg-terminal-green hover:text-primary-foreground"
            >
              $ {c}
            </button>
          ))}
        </div>
      )}

      {matrix && <MatrixRain onClose={() => setMatrix(false)} />}
    </div>
  );
}

function Prompt() {
  return (
    <span className="whitespace-nowrap">
      <span className="text-terminal-green">momo@hayase</span>
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

function Neofetch() {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-6">
      <pre className="text-terminal-magenta text-[10px] leading-tight">{`
        .--.
       |o_o |
       |:_/ |
      //   \\ \\
     (|     | )
    /'\\_   _/\`\\
    \\___)=(___/
`}</pre>
      <div className="text-sm self-center space-y-0.5">
        <div><span className="text-terminal-cyan">{PROFILE.handle}</span></div>
        <div className="text-terminal-dim">─────────────────</div>
        <div><span className="text-terminal-yellow">OS</span>: HayaseOS 6.6.6</div>
        <div><span className="text-terminal-yellow">Shell</span>: zsh 5.9</div>
        <div><span className="text-terminal-yellow">Editor</span>: nvim</div>
        <div><span className="text-terminal-yellow">CPU</span>: hayase-cortex (16) @ 4.2GHz</div>
        <div><span className="text-terminal-yellow">Memory</span>: 4096MiB / 65536MiB</div>
        <div><span className="text-terminal-yellow">Uptime</span>: ∞</div>
      </div>
    </div>
  );
}

function MatrixRain({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const fontSize = 16;
    const cols = () => Math.floor(c.width / fontSize);
    let drops = Array(cols()).fill(1);
    const chars = "アァカサタナハマヤラワ0123456789ABCDEF$#@%&*";
    const draw = () => {
      ctx.fillStyle = "rgba(10,18,12,0.08)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#7CFC9E";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const t = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(t, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const id = setInterval(draw, 45);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] cursor-pointer bg-background/80"
    >
      <canvas ref={ref} className="block h-full w-full" />
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-terminal-green">
        click anywhere to disconnect
      </div>
    </div>
  );
}
