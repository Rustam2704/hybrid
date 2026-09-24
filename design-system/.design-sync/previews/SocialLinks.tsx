import React from "react";
import { SocialLinks } from "taste-of-health-ds";
import { socials } from "./_data";

/** Green icons on cream (about block, footer). */
export const OnCream = () => (
  <div style={{ padding: 24, background: "#fff4ea", color: "#375542" }}><SocialLinks links={socials} /></div>
);

/** Cream icons over a dark photo, as in the hero. */
export const OnDark = () => (
  <div style={{ padding: 24, background: "#1e2a20", color: "#fff4ea" }}><SocialLinks links={socials} className="social--hero" /></div>
);
