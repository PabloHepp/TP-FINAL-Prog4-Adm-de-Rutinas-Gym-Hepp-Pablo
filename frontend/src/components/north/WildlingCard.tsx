import { HTMLAttributes } from "react";

type Variant = "ice" | "frozen" | "stone" | "wood" | "rune";

export interface WildlingCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  title?: string;
}

const variantClassMap: Record<Variant, string> = {
  ice: "wildling-card--ice",
  frozen: "wildling-card--frozen",
  stone: "wildling-card--stone",
  wood: "wildling-card--wood",
  rune: "wildling-card--rune",
};

export function WildlingCard({ variant = "frozen", title, className = "", children, ...rest }: WildlingCardProps) {
  const classes = ["wildling-card", variantClassMap[variant]];
  if (className) classes.push(className);

  return (
    <div className={classes.join(" ")} {...rest}>
      {title && <h3 className="wildling-card__title">{title}</h3>}
      {children}
    </div>
  );
}
