import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "ice" | "stone" | "rune";

interface Palette {
  background: string;
  border: string;
}

const paletteMap: Record<Variant, Palette> = {
  ice: { background: "rgba(61, 108, 140, 0.9)", border: "#8fc9e7" },
  stone: { background: "rgba(55, 62, 70, 0.9)", border: "#8f969a" },
  rune: { background: "rgba(37, 49, 57, 0.92)", border: "#c47b38" },
};

export interface HammerIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
  variant?: Variant;
  icon?: ReactNode;
}

const DefaultIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M5 7h8V5h-2V3H8v2H5v2zm11 2h3l-1-3h-4v3H5v4h10v2h2v3h3v-3h-2v-3h-2V9zM9 15h2v6H9z"
      fill="currentColor"
    />
  </svg>
);

export function HammerIconButton({ size = 56, variant = "ice", icon, className = "", style, ...rest }: HammerIconButtonProps) {
  const palette = paletteMap[variant];
  const classes = ["hammer-icon-btn"];
  if (className) classes.push(className);

  return (
    <button
      className={classes.join(" ")}
      style={{
        width: size,
        height: size,
        background: palette.background,
        borderColor: palette.border,
        ...style,
      }}
      {...rest}
    >
      {icon ?? <DefaultIcon />}
    </button>
  );
}
