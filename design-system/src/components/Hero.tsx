import React from "react";
import { SocialLinks, SocialLink } from "./SocialLinks";

export interface HeroProps {
  /** Full-bleed background photo (desktop) */
  imageSrc: string;
  /** Optional portrait crop used below 768px */
  imageSrcMobile?: string;
  /** First line of the giant headline, e.g. "Смак" */
  brandLine1: string;
  /** Second line; gets the animated check mark, e.g. "здоров'я" */
  brandLine2: string;
  /** One-sentence tagline under the headline (h1) */
  tagline: React.ReactNode;
  /** Words inside the tagline that get the hand-drawn squiggle underline */
  squiggle?: string;
  socials?: SocialLink[];
}

/**
 * theproof.com hero: 100vh photo with a dark gradient, social icons row,
 * giant uppercase condensed headline (Roboto Condensed 700, up to 168px)
 * with a self-drawing check mark, and a 32px tagline with a squiggle underline.
 */
export function Hero({ imageSrc, imageSrcMobile, brandLine1, brandLine2, tagline, squiggle, socials = [] }: HeroProps) {
  return (
    <section className="hero">
      <picture className="hero__bg">
        {imageSrcMobile && <source media="(max-width: 767px)" srcSet={imageSrcMobile} />}
        <img src={imageSrc} alt="" />
      </picture>
      <div className="hero__inner">
        {socials.length > 0 && <SocialLinks links={socials} className="social--hero" />}
        <p className="hero__brand headline" aria-label={`${brandLine1} ${brandLine2}`}>
          <span className="headline__text">{brandLine1}</span>
          <span className="headline__text headline__text--accent">
            {brandLine2}
            <svg className="headline__check" viewBox="0 0 60 60" aria-hidden="true">
              <path d="M8 34 L24 50 L54 10" fill="none" stroke="currentColor" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </p>
        <h1 className="hero__tagline">
          {tagline}
          {squiggle && <> <span className="squiggle">{squiggle}</span>.</>}
        </h1>
      </div>
    </section>
  );
}
