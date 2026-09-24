import React from "react";
import { PhotoGrid, FramedSection, TpHeading } from "taste-of-health-ds";
import { IMG } from "./_data";

const pets = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({ src: IMG + `/pets/pet-${i}.jpg` }));

/** Eight square photos, four per row. */
export const EightPhotos = () => (
  <div style={{ width: 1180, padding: 24, background: "#fff4ea" }}><PhotoGrid images={pets} /></div>
);

/** The full pets section with its centered heading and intro. */
export const PetsSection = () => (
  <div style={{ width: 1180 }}>
    <FramedSection>
      <TpHeading center>Мої найчесніші дегустатори</TpHeading>
      <p className="tp__center">Кухня без хвостатих помічників не працює. Підписуйтесь на <a href="#">@instagram</a>, там їх більше.</p>
      <PhotoGrid images={pets} />
    </FramedSection>
  </div>
);
