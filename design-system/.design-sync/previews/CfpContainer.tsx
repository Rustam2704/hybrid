import React from "react";
import { CfpContainer, SectionTitle, RecipeGrid } from "taste-of-health-ds";
import { recipes } from "./_data";

/** The white cookingforpeanuts column with its lead paragraph and a 4-column grid inside. */
export const WithLeadAndGrid = () => (
  <div style={{ width: 1180 }}>
    <CfpContainer>
      <p className="cfp__lead">Прості, доступні та здорові рецепти від <a href="#">дипломованої нутриціологині</a>, які <strong>подовжують здорове життя</strong>.</p>
      <SectionTitle title="Нові рецепти" subtitle="Найсвіжіші рецепти з Instagram і TikTok у зручному друкованому форматі." />
      <RecipeGrid items={recipes.slice(0, 4)} columns={4} />
    </CfpContainer>
  </div>
);
