import React from "react";
import { CfpContainer, RecipeGrid } from "taste-of-health-ds";
import { recipes } from "./_data";

/** Four columns, eight recipes — the "recent recipes" block. */
export const FourColumns = () => (
  <div style={{ width: 1180 }}><CfpContainer><RecipeGrid items={recipes.slice(0, 8)} columns={4} /></CfpContainer></div>
);

/** Five columns with smaller captions — the "most popular" block. */
export const FiveColumns = () => (
  <div style={{ width: 1180 }}><CfpContainer><RecipeGrid items={recipes} columns={5} /></CfpContainer></div>
);
