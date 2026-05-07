import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-mono">
      <div className="max-w-md text-center">
        <pre className="text-terminal-red text-sm leading-tight">{`
  ╔═══════════════════════╗
  ║   SEGFAULT (core)     ║
  ║   404 :: NOT FOUND    ║
  ╚═══════════════════════╝
        `}</pre>
        <p className="mt-2 text-sm text-muted-foreground">
          $ cat /requested/path → No such file or directory
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-terminal-green px-4 py-2 text-sm font-medium text-terminal-green transition-colors hover:bg-terminal-green hover:text-primary-foreground"
          >
            $ cd ~/
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-mono">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-terminal-red">
          [ERROR] kernel panic
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md border border-terminal-green px-4 py-2 text-sm text-terminal-green hover:bg-terminal-green hover:text-primary-foreground"
          >
            $ retry
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            $ cd ~/
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Prabakaran P :: momo@hayase ~ %" },
      {
        name: "description",
        content:
          "Prabakaran P (alias Momo Hayase) — developer portfolio rendered as an interactive terminal. Type `help` to begin.",
      },
      { name: "author", content: "Prabakaran P" },
      { property: "og:title", content: "momo@hayase :~$ portfolio" },
      {
        property: "og:description",
        content: "Interactive terminal portfolio of Prabakaran P (Momo Hayase).",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
