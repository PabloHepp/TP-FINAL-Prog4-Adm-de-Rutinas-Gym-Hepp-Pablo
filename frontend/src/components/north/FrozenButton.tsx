import { ButtonHTMLAttributes } from "react";

type Variant = "ice" | "frozen" | "stone" | "wood" | "rune";

export interface FrozenButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  glow?: boolean;
}

const variantClassMap: Record<Variant, string> = {
  ice: "frozen-btn--ice",
  frozen: "frozen-btn--frozen",
  stone: "frozen-btn--stone",
  wood: "frozen-btn--wood",
  rune: "frozen-btn--rune",
};

export function FrozenButton({ variant = "ice", glow = true, className = "", children, ...rest }: FrozenButtonProps) {
  const classes = ["frozen-btn", variantClassMap[variant]];
  if (glow) classes.push("frozen-btn--glow");
  if (className) classes.push(className);

  return (
    <button className={classes.join(" ")} {...rest}>
      {children}
    </button>
  );
}
