import React from "react";

export interface VideoCardProps {
  /** 16:9 poster image */
  posterSrc: string;
  href: string;
  label?: string;
}

/** theproof.com "latest episode" poster with the red YouTube-style play badge (turns green on hover). */
export function VideoCard({ posterSrc, href, label = "Watch the video" }: VideoCardProps) {
  return (
    <div className="tp__media tp__media--video">
      <a className="video" href={href} aria-label={label}>
        <img src={posterSrc} alt="" loading="lazy" width={960} height={540} />
        <span className="video__play"><i className="fa-solid fa-play" /></span>
      </a>
    </div>
  );
}

export interface PhotoGridProps {
  /** Square photos; 4 per row on desktop, 2 on phones */
  images: { src: string; alt?: string }[];
}

/** theproof.com Instagram-style grid of square photos with 14px gaps (used for the pets block). */
export function PhotoGrid({ images }: PhotoGridProps) {
  return (
    <ul className="pets">
      {images.map((im, i) => <li key={i}><img src={im.src} alt={im.alt || ""} loading="lazy" width={800} height={800} /></li>)}
    </ul>
  );
}

export interface NewsletterProps {
  /** Big condensed heading, e.g. "Want a recipe every week?" */
  title: string;
  text?: string;
  placeholder?: string;
  buttonLabel?: string;
  /** Small note under the form */
  note?: string;
  action?: string;
}

/** theproof.com newsletter block: big condensed title, framed input joined to a solid green button. */
export function Newsletter({ title, text, placeholder = "Your email address", buttonLabel = "Subscribe", note, action = "#" }: NewsletterProps) {
  return (
    <div className="newsletter">
      <h2 className="tp__h2--big">{title}</h2>
      {text && <p>{text}</p>}
      <form className="newsletter__form" action={action} onSubmit={(e) => e.preventDefault()}>
        <label className="visually-hidden" htmlFor="nl-email">Email</label>
        <input id="nl-email" type="email" placeholder={placeholder} required />
        <button className="btn-tp btn-tp--solid" type="submit">{buttonLabel}</button>
      </form>
      {note && <p className="tp__tiny">{note}</p>}
    </div>
  );
}

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

export interface FooterProps {
  logoSrc: string;
  /** Brand word in the first column, uppercase condensed 34px */
  brand: string;
  columns: FooterColumn[];
  copyright: string;
  topLabel?: string;
  topHref?: string;
}

/** theproof.com footer: dark green (#375542), cream text, condensed uppercase column headings with 3.8px tracking. */
export function Footer({ logoSrc, brand, columns, copyright, topLabel = "↑ back to top", topHref = "#top" }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer__cols">
        <div className="footer__brand">
          <img src={logoSrc} alt="" width={72} height={72} loading="lazy" />
          <p className="footer__word">{brand}</p>
        </div>
        {columns.map((c) => (
          <div key={c.heading}>
            <h3>{c.heading}</h3>
            <ul>{c.links.map((l) => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <p className="footer__copy">{copyright}</p>
      <a className="footer__top" href={topHref}>{topLabel}</a>
    </footer>
  );
}

export interface RecipeCardBoxProps {
  imageSrc: string;
  title: string;
  summary: string;
  /** Meta cells: label + value, e.g. { label: "Prep", value: "10 min" } */
  meta: { label: string; value: string }[];
  ingredientsHeading?: string;
  ingredients: string[];
  stepsHeading?: string;
  steps: string[];
  nutritionHeading?: string;
  nutrition?: string;
  printLabel?: string;
  pinLabel?: string;
}

/** WP-Recipe-Maker-style recipe card from the cookingforpeanuts.com recipe page: photo + meta header, ingredients / steps columns, nutrition line. */
export function RecipeCardBox({ imageSrc, title, summary, meta, ingredientsHeading = "Ingredients", ingredients, stepsHeading = "Instructions", steps, nutritionHeading = "Nutrition (per serving)", nutrition, printLabel = "Print", pinLabel = "Pinterest" }: RecipeCardBoxProps) {
  return (
    <section className="card">
      <div className="card__head">
        <img src={imageSrc} alt="" width={200} height={267} loading="lazy" />
        <div>
          <h2 className="card__title">{title}</h2>
          <p className="card__summary">{summary}</p>
          <div className="card__meta">{meta.map((m) => <span key={m.label}><b>{m.label}</b> {m.value}</span>)}</div>
          <div className="card__btns"><a className="btn-cfp" href="#">{printLabel}</a><a className="btn-cfp" href="#">{pinLabel}</a></div>
        </div>
      </div>
      <div className="card__cols">
        <div><h3>{ingredientsHeading}</h3><ul className="card__ing">{ingredients.map((i) => <li key={i}>{i}</li>)}</ul></div>
        <div>
          <h3>{stepsHeading}</h3><ol className="card__steps">{steps.map((s) => <li key={s}>{s}</li>)}</ol>
          {nutrition && <><h3>{nutritionHeading}</h3><p className="card__nutrition">{nutrition}</p></>}
        </div>
      </div>
    </section>
  );
}
