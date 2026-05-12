import { createContext, useContext, useState, type ReactNode } from "react";

type AppCtx = {
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
};

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside <AppProvider>");
  return v;
}
