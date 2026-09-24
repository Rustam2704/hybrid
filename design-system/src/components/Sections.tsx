import React from "react";

export interface BandProps {
  /** Short slogan, Lora 700 22.8px centered */
  title: string;
}

/** cookingforpeanuts.com beige (#f7f4ed) full-width title band under the header. */
export function Band({ title }: BandProps) {
  return (
    <div className="band"><h2 className="band__title">{title}</h2></div>
  );
}

export interface CfpContainerProps {
  children: React.ReactNode;
  /** White content column, 1080px max, Lato 19px/34.2px, black text */
  className?: string;
}

/** cookingforpeanuts.com content area: white background, 1080px column, Lato body text. Wrap recipe grids, bubbles and leads in it. */
export function CfpContainer({ children, className }: CfpContainerProps) {
  return <div className={["cfp", className].filter(Boolean).join(" ")}>{children}</div>;
}

export interface SectionTitleProps {
  /** Uppercase Lora 700 30.875px, centered */
  title: string;
  /** Italic Lato 19px line under the title */
  subtitle?: string;
  /** Keep the title in sentence case (search band) */
  plain?: boolean;
}

/** cookingforpeanuts.com section heading pair: "RECENT RECIPES" + italic subtitle. */
export function SectionTitle({ title, subtitle, plain }: SectionTitleProps) {
  return (
    <>
      <h2 className={plain ? "cfp__h2 cfp__h2--plain" : "cfp__h2"}>{title}</h2>
      {subtitle && <p className="cfp__sub"><em>{subtitle}</em></p>}
    </>
  );
}

export interface FramedSectionProps {
  children: React.ReactNode;
  /** "cream" (default, #fff4ea) or "green" (#375542 with cream text, used for the program block) */
  tone?: "cream" | "green";
  id?: string;
  /** Two-column grid inside (image + text). Pass the two children in order. */
  columns?: "none" | "default" | "video" | "subscribe";
}

/**
 * theproof.com framed section: 100px vertical padding, 123px left offset next to the sidebar,
 * 2px green bottom rule. Optional 2-column grid presets matching the home page blocks.
 */
export function FramedSection({ children, tone = "cream", id, columns = "none" }: FramedSectionProps) {
  const cls = ["tp", tone === "green" ? "tp--program" : "tp--framed", columns === "video" ? "tp--split" : ""].filter(Boolean).join(" ");
  const colCls = columns === "none" ? null : ["tp__cols", columns === "video" ? "tp__cols--video" : "", columns === "subscribe" ? "tp__cols--sub" : ""].filter(Boolean).join(" ");
  return (
    <section className={cls} id={id}>
      {colCls ? <div className={colCls}>{children}</div> : children}
    </section>
  );
}

export interface TpHeadingProps {
  children: React.ReactNode;
  /** "big": Roboto Condensed 700 58px/62px uppercase green. "soft": Manrope 400 32px/44.8px green. */
  size?: "big" | "soft";
  center?: boolean;
  as?: "h1" | "h2" | "h3";
}

/** theproof.com headings: the big condensed uppercase title or the soft 32px Manrope one. */
export function TpHeading({ children, size = "big", center, as = "h2" }: TpHeadingProps) {
  const Tag = as;
  const cls = [size === "big" ? "tp__h2--big" : "tp__h2", center ? "tp__h2--center" : ""].filter(Boolean).join(" ");
  return <Tag className={cls}>{children}</Tag>;
}

export interface AccentLabelProps {
  children: React.ReactNode;
}

/** Yellow (#ffc844) uppercase Roboto Condensed 18px label with a dot, e.g. "● EPISODE #12". */
export function AccentLabel({ children }: AccentLabelProps) {
  return <p className="tp__accent"><i className="fa-solid fa-circle" /> {children}</p>;
}
