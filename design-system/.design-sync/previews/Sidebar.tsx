import React from "react";
import { Sidebar } from "taste-of-health-ds";
import { IMG, nav } from "./_data";

const tools = [
  { icon: "fa-solid fa-magnifying-glass", href: "#search", label: "Пошук" },
  { icon: "fa-solid fa-cart-shopping", href: "#program", label: "Кошик" },
  { icon: "fa-solid fa-user", href: "#subscribe", label: "Кабінет" },
];
const languages = [{ code: "uk", href: "./", active: true }, { code: "en", href: "en/" }];

/** Desktop sidebar as on the home page: current item "Рецепти" framed on top, tools and UA/EN at the bottom. */
export const Default = () => (
  <div style={{ position: "relative", height: 820, width: 140 }}>
    <Sidebar logoSrc={IMG + "/her/caricature.jpg"} items={nav} tools={tools} languages={languages} />
  </div>
);

/** Another section active (Про мене) and the English switcher selected. */
export const AboutActiveEnglish = () => (
  <div style={{ position: "relative", height: 820, width: 140 }}>
    <Sidebar
      logoSrc={IMG + "/her/caricature.jpg"}
      items={[
        { label: "Newsletter", href: "#subscribe" }, { label: "About", href: "#about", current: true }, { label: "Blog", href: "#blog" },
        { label: "Video", href: "#video" }, { label: "Guides", href: "#guides" }, { label: "Programs", href: "#program" }, { label: "Recipes", href: "#recipes" },
      ]}
      tools={tools}
      languages={[{ code: "uk", href: "../" }, { code: "en", href: "./", active: true }]}
    />
  </div>
);
