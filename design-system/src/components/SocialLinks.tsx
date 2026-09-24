import React from "react";

export interface SocialLink {
  /** Font Awesome brand class, e.g. "fa-brands fa-instagram" */
  icon: string;
  href: string;
  label: string;
}

export interface SocialLinksProps {
  links: SocialLink[];
  /** Extra class, e.g. "social--hero" for the cream icons over the hero photo */
  className?: string;
}

/** Row of 22px Font Awesome brand icons with 26px gaps (theproof.com hero and about block). */
export function SocialLinks({ links, className }: SocialLinksProps) {
  return (
    <ul className={["social", className].filter(Boolean).join(" ")} aria-label="Social media">
      {links.map((l) => (
        <li key={l.label}><a href={l.href} aria-label={l.label}><i className={l.icon} /></a></li>
      ))}
    </ul>
  );
}
