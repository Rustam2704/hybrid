import React from "react";
import { Hero } from "taste-of-health-ds";
import { IMG, socials } from "./_data";

/** The home hero: garden photo, six social icons, "СМАК ЗДОРОВ'Я" with the drawn check, tagline with squiggle. */
export const Ukrainian = () => (
  <div className="e-animated" style={{ width: 1180, height: 760, overflow: "hidden" }}>
    <Hero
      imageSrc={IMG + "/her/hero-garden.jpg"}
      brandLine1="Смак"
      brandLine2="здоров'я"
      tagline="Прості, доступні та здорові рецепти й науково обґрунтовані поради, щоб ви жили"
      squiggle="довше і смачніше"
      socials={socials}
    />
  </div>
);

/** English copy of the same hero. */
export const English = () => (
  <div className="e-animated" style={{ width: 1180, height: 760, overflow: "hidden" }}>
    <Hero
      imageSrc={IMG + "/her/hero-garden.jpg"}
      brandLine1="Taste of"
      brandLine2="health"
      tagline="Easy, affordable and healthy recipes plus science-based advice so you can live"
      squiggle="longer and tastier"
      socials={socials}
    />
  </div>
);
