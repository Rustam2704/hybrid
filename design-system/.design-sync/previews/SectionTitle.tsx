import React from "react";
import { CfpContainer, SectionTitle } from "taste-of-health-ds";

/** Uppercase Lora title with the italic subtitle, as above every recipe grid. */
export const WithSubtitle = () => (
  <div style={{ width: 900 }}>
    <CfpContainer><SectionTitle title="Найпопулярніші рецепти" subtitle="Десять рецептів, які зараз читають найчастіше." /></CfpContainer>
  </div>
);

/** Sentence-case variant used in the search band. */
export const Plain = () => (
  <div style={{ width: 900 }}>
    <CfpContainer><SectionTitle title="Знайдіть те, що шукаєте:" plain /></CfpContainer>
  </div>
);
