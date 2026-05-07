import { createFileRoute } from "@tanstack/react-router";
import { Terminal } from "@/components/Terminal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "momo@hayase :~$ — Prabakaran P · Portfolio" },
      {
        name: "description",
        content:
          "Interactive terminal portfolio of Prabakaran P (alias Momo Hayase). Type `help` to explore projects, skills, and contact.",
      },
      { property: "og:title", content: "momo@hayase :~$ — Prabakaran P" },
      {
        property: "og:description",
        content:
          "A dark, hacker-aesthetic developer portfolio rendered as an interactive Linux terminal.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <h1 className="sr-only">Prabakaran P — Momo Hayase — Developer Portfolio</h1>
      <Terminal />
      <div className="scanline" />
      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </main>
  );
}
