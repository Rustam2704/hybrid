import React from "react";
import { SearchBand } from "taste-of-health-ds";

/** Full-width search band with the index link. */
export const Default = () => (
  <div style={{ width: 1180 }}>
    <SearchBand title="Знайдіть те, що шукаєте:" placeholder="знайти рецепт…" linkLead="Або перегляньте повний" linkLabel="каталог рецептів →" linkHref="#" />
  </div>
);

/** English, without the index link. */
export const English = () => (
  <div style={{ width: 1180 }}>
    <SearchBand title="Find what you're looking for:" placeholder="search for a recipe…" />
  </div>
);
