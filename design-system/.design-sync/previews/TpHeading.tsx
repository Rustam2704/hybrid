import React from "react";
import { TpHeading } from "taste-of-health-ds";

/** The 58px condensed uppercase heading. */
export const Big = () => (
  <div style={{ padding: 32, background: "#fff4ea" }}><TpHeading>Дивіться останнє відео</TpHeading></div>
);

/** The soft 32px Manrope heading of the about block. */
export const Soft = () => (
  <div style={{ padding: 32, background: "#fff4ea", maxWidth: 520 }}><TpHeading size="soft">Простір для розмови про здоров'я на основі науки</TpHeading></div>
);

/** Centered big heading, as above the pets grid. */
export const BigCentered = () => (
  <div style={{ padding: 32, background: "#fff4ea" }}><TpHeading center>Мої найчесніші дегустатори</TpHeading></div>
);
