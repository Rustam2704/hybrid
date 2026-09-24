import React from "react";
import { Newsletter, AuthorCard, FramedSection } from "taste-of-health-ds";
import { IMG } from "./_data";

/** Newsletter block alone. */
export const Default = () => (
  <div style={{ width: 760, padding: 32, background: "#fff4ea" }}>
    <Newsletter title="Хочете рецепт щотижня?" text="Раз на тиждень: план харчування, список покупок і одна наукова новина без паніки." placeholder="Ваша електронна пошта" buttonLabel="Підписатися" note="Жодного спаму. Відписатися можна одним кліком." />
  </div>
);

/** Author card + newsletter in the two-column subscribe section. */
export const SubscribeSection = () => (
  <div style={{ width: 1180 }}>
    <FramedSection columns="subscribe">
      <div style={{ paddingTop: 110 }}>
        <AuthorCard avatarSrc={IMG + "/her/avatar.jpg"} title="Привіт! Я Олена." text="Дипломована нутриціологиня та випускниця кулінарної школи." linkLabel="Більше про мене →" linkHref="#" />
      </div>
      <Newsletter title="Хочете рецепт щотижня?" text="Раз на тиждень: план харчування, список покупок і одна наукова новина без паніки." placeholder="Ваша електронна пошта" buttonLabel="Підписатися" note="Жодного спаму. Відписатися можна одним кліком." />
    </FramedSection>
  </div>
);
