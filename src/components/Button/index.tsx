import type { ButtonHTMLAttributes } from "react";
import { cls } from "@/utils/helpers";

export function Button({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cls(
        "rounded border border-terminal-green/40 px-3 py-1 text-sm text-terminal-green transition hover:bg-terminal-green hover:text-primary-foreground",
        className,
      )}
      {...rest}
    />
  );
}

export default Button;
