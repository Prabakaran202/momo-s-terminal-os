import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Terminal } from "@/components/Terminal";
import { PROFILE } from "@/lib/portfolio-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "developer-labs@portfolio:~$ — Prabakaran P" },
      {
        name: "description",
        content:
          "Interactive terminal portfolio of Prabakaran P (Momo Hayase) — Founder of Developer Labs. Explore the Tamizhi ecosystem, projects, and skills.",
      },
      { property: "og:title", content: "developer-labs@portfolio:~$ — Prabakaran P" },
      {
        property: "og:description",
        content:
          "A dark, hacker-aesthetic developer portfolio rendered as an interactive Linux terminal.",
      },
    ],
  }),
  component: Index,
});

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const u = () => setM(mq.matches);
    u();
    mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);
  return m;
}

function Index() {
  const mobile = useIsMobile();

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-background pt-14">
      {/* Background */}
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Taskbar */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 sm:px-6">
          <span className="truncate text-xs sm:text-sm">
            <span className="text-terminal-green">developer-labs@portfolio</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-terminal-cyan">~</span>
            <span className="text-muted-foreground">$</span>
            <span className="ml-1 inline-block w-2 animate-pulse bg-terminal-green text-transparent">_</span>
          </span>
          <nav className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-terminal-green/40 px-2 py-1 text-[11px] text-terminal-green transition hover:bg-terminal-green hover:text-primary-foreground sm:text-xs"
            >
              GitHub
            </a>
            <a
              href={PROFILE.resume}
              download
              className="rounded border border-terminal-cyan/40 px-2 py-1 text-[11px] text-terminal-cyan transition hover:bg-terminal-cyan hover:text-primary-foreground sm:text-xs"
            >
              Resume
            </a>
            <a
              href={PROFILE.tamizhiForge}
              target="_blank"
              rel="noreferrer"
              className="rounded border border-terminal-magenta/40 px-2 py-1 text-[11px] text-terminal-magenta transition hover:bg-terminal-magenta hover:text-primary-foreground sm:text-xs"
            >
              Tamizhi Forge ↗
            </a>
          </nav>
        </div>
      </header>

      <h1 className="sr-only">
        Prabakaran P — Momo Hayase — Founder of Developer Labs
      </h1>

      <div className="px-2 py-4 sm:px-6 sm:py-8">
        <Terminal mobile={mobile} />
      </div>

      {/* Floating Forge button */}
      <a
        href={PROFILE.tamizhiForge}
        target="_blank"
        rel="noreferrer"
        className="group fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-md border border-terminal-magenta bg-card/90 px-3 py-2 text-xs text-terminal-magenta shadow-[0_0_24px_-4px_var(--terminal-magenta)] backdrop-blur transition hover:scale-105 hover:bg-terminal-magenta hover:text-primary-foreground sm:text-sm"
        style={{ animation: "flicker 4s infinite" }}
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-terminal-magenta group-hover:bg-primary-foreground" />
        Open IDE ↗
      </a>

      {/* Effects */}
      <div className="scanline" />
      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </main>
  );
}
