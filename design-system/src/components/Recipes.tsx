import React from "react";

export interface RecipeItem {
  title: string;
  href: string;
  /** 3:4 photo, 360×480 or larger */
  imageSrc: string;
}

export interface RecipeGridProps {
  items: RecipeItem[];
  /** 4 columns (recent recipes) or 5 (most popular). 3 columns below 1024px, 2 below 600px. */
  columns?: 4 | 5;
}

/**
 * cookingforpeanuts.com recipe grid (Feast .fsri-list): 16px gaps, 3:4 photos with a 3px white
 * border and 1px #e3ded6 outline, centered Lato captions in #766e6b.
 */
export function RecipeGrid({ items, columns = 4 }: RecipeGridProps) {
  return (
    <ul className={`grid grid--${columns}`}>
      {items.map((r) => (
        <li key={r.href + r.title}>
          <a href={r.href}>
            <img src={r.imageSrc} alt="" loading="lazy" width={360} height={480} />
            <span>{r.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export interface QuoteBubbleProps {
  imageSrc: string;
  /** Lora 700 30.875px */
  title: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
}

/**
 * cookingforpeanuts.com "quote bubble" feature card (Feast .is-style-group-quote-bubble):
 * beige rounded 40px card with the big quote mark at the top-left corner and a speech tail,
 * square photo on the left, heading + text + arrow button on the right.
 */
export function QuoteBubble({ imageSrc, title, text, buttonLabel, buttonHref }: QuoteBubbleProps) {
  return (
    <div className="bubble">
      <div className="bubble__media"><img src={imageSrc} alt="" loading="lazy" width={720} height={960} /></div>
      <div className="bubble__content">
        <h2>{title}</h2>
        <p>{text}</p>
        <a className="btn-cfp" href={buttonHref}>{buttonLabel}</a>
      </div>
    </div>
  );
}

export interface FeatureStackProps {
  children: React.ReactNode;
}

/** Vertical stack of QuoteBubble cards with 46px gaps. */
export function FeatureStack({ children }: FeatureStackProps) {
  return <section className="features">{children}</section>;
}

export interface SearchBandProps {
  title: string;
  placeholder?: string;
  /** Text before the link, e.g. "Or browse the full" */
  linkLead?: string;
  linkLabel?: string;
  linkHref?: string;
  action?: string;
}

/** cookingforpeanuts.com full-width beige search band: centered Lora title, input + square button, index link. */
export function SearchBand({ title, placeholder = "search for a recipe…", linkLead, linkLabel, linkHref = "#", action = "#" }: SearchBandProps) {
  return (
    <section className="search" id="search">
      <h2 className="cfp__h2 cfp__h2--plain">{title}</h2>
      <form className="search__form" role="search" action={action} onSubmit={(e) => e.preventDefault()}>
        <label className="visually-hidden" htmlFor="q">Search</label>
        <input id="q" type="search" placeholder={placeholder} />
        <button type="submit" aria-label="Search"><i className="fa-solid fa-magnifying-glass" /></button>
      </form>
      {linkLabel && <p>{linkLead} <a href={linkHref}>{linkLabel}</a></p>}
    </section>
  );
}

export interface AuthorCardProps {
  avatarSrc: string;
  /** Lora 700 26px, e.g. "Hey! I'm Olena." */
  title: string;
  /** Italic Lato paragraph */
  text: string;
  linkLabel?: string;
  linkHref?: string;
  /** Sidebar variant used on the recipe page (narrower, avatar overlapping the top) */
  side?: boolean;
}

/** cookingforpeanuts.com "Hey! I'm …" card: 170px round avatar with white ring and shadow over a beige card. */
export function AuthorCard({ avatarSrc, title, text, linkLabel, linkHref = "#", side }: AuthorCardProps) {
  return (
    <div className={side ? "author author--side" : "author"}>
      <img className={side ? "author__avatar author__avatar--side" : "author__avatar"} src={avatarSrc} alt="" width={170} height={170} loading="lazy" />
      <h2 className="author__title">{title}</h2>
      <p><em>{text}</em></p>
      {linkLabel && <a href={linkHref}>{linkLabel}</a>}
    </div>
  );
}
