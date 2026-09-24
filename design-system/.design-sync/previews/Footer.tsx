import React from "react";
import { Footer } from "taste-of-health-ds";
import { IMG } from "./_data";

const columns = [
  { heading: "Інфо", links: [{ label: "Про мене", href: "#" }, { label: "Рецепти", href: "#" }, { label: "Програми", href: "#" }, { label: "Контакти", href: "#" }] },
  { heading: "Стежте", links: [{ label: "Instagram", href: "#" }, { label: "Telegram", href: "#" }, { label: "YouTube", href: "#" }, { label: "TikTok", href: "#" }] },
  { heading: "Правове", links: [{ label: "Політика конфіденційності", href: "#" }, { label: "Умови використання", href: "#" }, { label: "Відмова від відповідальності", href: "#" }] },
];

/** The dark green footer with three link columns. */
export const Default = () => (
  <div style={{ width: 1180 }}>
    <Footer logoSrc={IMG + "/her/caricature.jpg"} brand="Смак здоров'я" columns={columns} copyright="© 2026 Олена Калитовська · Смак здоров'я. Інформація на сайті має освітній характер і не замінює консультацію лікаря." topLabel="↑ вгору" />
  </div>
);
