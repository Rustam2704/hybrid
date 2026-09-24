import React from "react";
import { VideoCard, TpHeading, AccentLabel, Button, FramedSection } from "taste-of-health-ds";
import { IMG } from "./_data";

/** The poster with the play badge alone. */
export const Poster = () => (
  <div style={{ width: 640, padding: 24, background: "#fff4ea" }}><VideoCard posterSrc={IMG + "/her/museum.jpg"} href="#" /></div>
);

/** The whole "latest video" section as on the home page. */
export const LatestEpisodeSection = () => (
  <div style={{ width: 1180 }}>
    <FramedSection columns="video">
      <div className="tp__text">
        <TpHeading>Дивіться останнє відео</TpHeading>
        <TpHeading as="h3" size="soft">Клітковина, мікробіом і чому «здоровий кишківник» починається з тарілки</TpHeading>
        <p className="tp__small">Розмова з гастроентерологинею</p>
        <AccentLabel>Випуск #12</AccentLabel>
        <Button href="#">Читати більше</Button>
      </div>
      <VideoCard posterSrc={IMG + "/her/museum.jpg"} href="#" />
    </FramedSection>
  </div>
);
