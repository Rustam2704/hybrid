import React from "react";
import { FramedSection, TpHeading, Button, ButtonGroup } from "taste-of-health-ds";
import { IMG } from "./_data";

/** The about block: photo left, soft heading, two paragraphs and the button group. */
export const About = () => (
  <div style={{ width: 1180 }}>
    <FramedSection columns="default">
      <div className="tp__media"><img src={IMG + "/her/about-portrait.jpg"} alt="" width={768} height={960} /></div>
      <div className="tp__text">
        <TpHeading size="soft">Простір для розмови про здоров'я на основі науки</TpHeading>
        <p>Я досліджую, як харчування, рух, сон і відновлення впливають на здоров'я та довголіття, і перекладаю наукові дані на мову простих кроків і смачних страв.</p>
        <p>Факти, нюанси та поради, яким можна довіряти, без перебільшень і чудо-дієт.</p>
        <ButtonGroup button={<Button href="#">Читати блог</Button>} icons={[{ icon: "fa-brands fa-instagram", href: "#", label: "Instagram" }, { icon: "fa-brands fa-youtube", href: "#", label: "YouTube" }]} />
      </div>
    </FramedSection>
  </div>
);

/** The green program block with a framed portrait. */
export const GreenProgram = () => (
  <div style={{ width: 1180 }}>
    <FramedSection tone="green" columns="default">
      <div className="tp__text">
        <p><strong>Програма «12 тижнів»</strong> — науково обґрунтований челендж зі створення звичок, який покращує самопочуття та допомагає жити довше.</p>
        <p>Разом із командою лікарів ми зібрали безкоштовний PDF-план на 12 тижнів змін.</p>
        <Button variant="solid" href="#">Отримати програму</Button>
      </div>
      <div className="tp__media tp__media--program"><img src={IMG + "/her/park.jpg"} alt="" width={983} height={1228} /></div>
    </FramedSection>
  </div>
);
