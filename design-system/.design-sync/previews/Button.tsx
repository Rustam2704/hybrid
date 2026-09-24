import React from "react";
import { Button } from "taste-of-health-ds";

/** theproof.com outline button: 2px green frame, condensed uppercase with 3.8px tracking. */
export const Outline = () => (
  <div style={{ padding: 32, background: "#fff4ea" }}><Button href="#">Читати більше</Button></div>
);

/** Solid green variant used for form submits and the program CTA. */
export const Solid = () => (
  <div style={{ padding: 32, background: "#fff4ea" }}><Button variant="solid" href="#">Отримати програму</Button></div>
);

/** cookingforpeanuts.com button: #766e6b block, white Lato 700, trailing arrow. */
export const Cfp = () => (
  <div style={{ padding: 32, background: "#fff", fontFamily: "Lato, sans-serif" }}><Button variant="cfp" href="#">Меню проти холестерину</Button></div>
);

/** All three side by side, plus the solid one on the green program background. */
export const AllVariants = () => (
  <div style={{ display: "grid", gap: 24, padding: 32, background: "#fff4ea" }}>
    <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
      <Button href="#">Outline</Button>
      <Button variant="solid" href="#">Solid</Button>
      <Button variant="cfp" href="#">Cooking for Peanuts</Button>
    </div>
    <div className="tp tp--program" style={{ padding: 24 }}>
      <Button variant="solid" href="#">On green</Button>
    </div>
  </div>
);
