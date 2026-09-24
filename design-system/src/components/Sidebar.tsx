import React from "react";

export interface NavItem {
  /** Visible label, rendered uppercase in Roboto Condensed */
  label: string;
  href: string;
  /** Marks the section currently in view: gets the 2px green frame */
  current?: boolean;
}

export interface SidebarProps {
  /** Round logo / avatar shown at the top (56px) */
  logoSrc: string;
  logoAlt?: string;
  homeHref?: string;
  /** Menu items; rendered bottom-to-top like theproof.com, so the LAST item sits on top */
  items: NavItem[];
  /** Tool icons under the menu (Font Awesome class names), e.g. "fa-solid fa-magnifying-glass" */
  tools?: { icon: string; href: string; label: string }[];
  /** Language switcher; active one gets the framed style */
  languages?: { code: string; href: string; active?: boolean }[];
}

/**
 * theproof.com shell: fixed 96px sidebar with a round logo, vertically written
 * uppercase menu (current item framed), tool icons and the UA/EN switcher.
 * Collapses into a 64px top bar with a burger below 1024px.
 */
export function Sidebar({ logoSrc, logoAlt = "", homeHref = "./", items, tools = [], languages = [] }: SidebarProps) {
  return (
    <header className="side" id="top">
      <a className="side__logo" href={homeHref} aria-label="Home">
        <img src={logoSrc} alt={logoAlt} width={56} height={56} />
      </a>
      <button className="side__burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="Menu">
        <span /><span /><span />
      </button>
      <nav className="side__nav" id="nav" aria-label="Main menu">
        <ul>
          {items.map((it) => (
            <li key={it.href + it.label} className={it.current ? "is-current" : undefined}>
              <a href={it.href}>{it.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="side__tools">
        {tools.map((t) => (
          <a key={t.label} href={t.href} aria-label={t.label}><i className={t.icon} /></a>
        ))}
        {languages.length > 0 && (
          <span className="lang" aria-label="Language">
            {languages.map((l) => (
              <a key={l.code} className={l.active ? "is-active" : undefined} href={l.href} hrefLang={l.code}>{l.code.toUpperCase()}</a>
            ))}
          </span>
        )}
      </div>
    </header>
  );
}
