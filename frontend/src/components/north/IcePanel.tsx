import { HTMLAttributes } from "react";

export interface IcePanelProps extends HTMLAttributes<HTMLDivElement> {
  blur?: number;
  translucent?: boolean;
}

export function IcePanel({ blur = 14, translucent = true, className = "", style, children, ...rest }: IcePanelProps) {
  const classes = ["ice-panel"];
  if (translucent) classes.push("ice-panel--translucent");
  if (className) classes.push(className);

  return (
    <div
      className={classes.join(" ")}
      style={{
        backdropFilter: `blur(${blur}px)`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
