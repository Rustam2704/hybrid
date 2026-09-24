import React from "react";
import { AuthorCard } from "taste-of-health-ds";
import { IMG } from "./_data";

/** Home-page author card (avatar overlapping the beige card). */
export const Home = () => (
  <div style={{ width: 460, padding: "120px 24px 24px", background: "#fff4ea" }}>
    <AuthorCard avatarSrc={IMG + "/her/avatar.jpg"} title="Привіт! Я Олена." text="Дипломована нутриціологиня та випускниця кулінарної школи. Я створюю рецепти так, щоб вони були доступними, корисними та смачними для всієї родини." linkLabel="Більше про мене →" linkHref="#" />
  </div>
);

/** Recipe-page sidebar variant. */
export const Sidebar = () => (
  <div style={{ width: 340, padding: "20px 20px 24px", background: "#fff" }}>
    <AuthorCard side avatarSrc={IMG + "/her/avatar.jpg"} title="Hey! I'm Olena." text="A registered nutritionist and culinary school graduate. I design my recipes to be affordable, healthful and enjoyable for the whole family." linkLabel="More about me →" linkHref="#" />
  </div>
);
