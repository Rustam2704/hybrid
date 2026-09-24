import React from "react";
import { Button, ButtonGroup } from "taste-of-health-ds";

/** "ЧИТАТИ БЛОГ | instagram telegram youtube" — the about-block CTA of theproof.com. */
export const WithSocialIcons = () => (
  <div style={{ padding: 32, background: "#fff4ea" }}>
    <ButtonGroup
      button={<Button href="#">Читати блог</Button>}
      icons={[
        { icon: "fa-brands fa-instagram", href: "#", label: "Instagram" },
        { icon: "fa-brands fa-telegram", href: "#", label: "Telegram" },
        { icon: "fa-brands fa-youtube", href: "#", label: "YouTube" },
      ]}
    />
  </div>
);

/** Podcast-style: listen button with the three player icons. */
export const ListenNow = () => (
  <div style={{ padding: 32, background: "#fff4ea" }}>
    <ButtonGroup
      button={<Button href="#">Listen now</Button>}
      icons={[
        { icon: "fa-brands fa-spotify", href: "#", label: "Spotify" },
        { icon: "fa-brands fa-apple", href: "#", label: "Apple Podcasts" },
        { icon: "fa-brands fa-youtube", href: "#", label: "YouTube" },
      ]}
    />
  </div>
);
