import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  /**
   * "outline" / "solid" are the theproof.com buttons: 2px green frame, Roboto Condensed 22px,
   * letter-spacing 3.8px, uppercase, 15px 30px padding. "cfp" is the cookingforpeanuts.com
   * button: #766e6b background, white Lato 700 20px, 11px 18px padding, trailing arrow.
   */
  variant?: "outline" | "solid" | "cfp";
  /** cfp variant only: hide the trailing "→" */
  noArrow?: boolean;
  type?: "button" | "submit";
  className?: string;
}

/** The three button styles of the hybrid. Renders <a> when href is given, <button> otherwise. */
export function Button({ children, href, onClick, variant = "outline", noArrow, type = "button", className }: ButtonProps) {
  const cls = [
    variant === "cfp" ? "btn-cfp" : "btn-tp",
    variant === "solid" ? "btn-tp--solid" : "",
    noArrow ? "btn-cfp--plain" : "",
    className || "",
  ].filter(Boolean).join(" ");
  const style = noArrow ? ({ ["--arrow" as string]: "none" } as React.CSSProperties) : undefined;
  if (href) return <a className={cls} href={href} onClick={onClick} style={style}>{children}</a>;
  return <button className={cls} type={type} onClick={onClick} style={style}>{children}</button>;
}

export interface ButtonGroupProps {
  /** The framed button on the left */
  button: React.ReactNode;
  /** Icon links shown in the right cell, e.g. [{icon:"fa-brands fa-instagram", href:"#", label:"Instagram"}] */
  icons: { icon: string; href: string; label: string }[];
}

/** theproof.com "LISTEN NOW | ● ● ●" block: an outline button and an icon cell sharing one 2px frame. */
export function ButtonGroup({ button, icons }: ButtonGroupProps) {
  return (
    <div className="btn-group">
      {button}
      <span className="btn-group__icons">
        {icons.map((i) => <a key={i.label} href={i.href} aria-label={i.label}><i className={i.icon} /></a>)}
      </span>
    </div>
  );
}
