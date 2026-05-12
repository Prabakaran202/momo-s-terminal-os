import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <nav className="flex items-center gap-4 border-b border-border/40 px-4 py-2 text-sm">
      <Link to="/" className="text-terminal-green hover:underline">~/home</Link>
    </nav>
  );
}

export default Navbar;
