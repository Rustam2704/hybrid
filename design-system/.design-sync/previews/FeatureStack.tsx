import React from "react";
import { CfpContainer, QuoteBubble, FeatureStack } from "taste-of-health-ds";
import { IMG } from "./_data";

/** The stack wrapper with two bubbles (46px gap). */
export const TwoBubbles = () => (
  <div style={{ width: 1180 }}>
    <CfpContainer>
      <FeatureStack>
        <QuoteBubble imageSrc={IMG + "/recipes/r05.jpg"} title="Меню на тиждень" text="План харчування зі списком покупок." buttonLabel="Отримати меню" buttonHref="#" />
        <QuoteBubble imageSrc={IMG + "/recipes/r07.jpg"} title="Сніданки за 10 хвилин" text="Швидкі білкові сніданки без цукру." buttonLabel="Дивитися" buttonHref="#" />
      </FeatureStack>
    </CfpContainer>
  </div>
);
