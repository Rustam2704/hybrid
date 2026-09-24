import React from "react";
import { CfpContainer, QuoteBubble, FeatureStack } from "taste-of-health-ds";
import { IMG } from "./_data";

/** One quote-bubble feature card. */
export const Single = () => (
  <div style={{ width: 1180 }}>
    <CfpContainer>
      <div style={{ paddingTop: 30 }}>
        <QuoteBubble imageSrc={IMG + "/recipes/r13.jpg"} title="Рецепти для зниження холестерину" text="Їжте так, щоб ЛПНЩ знижувався!" buttonLabel="Меню проти холестерину" buttonHref="#" />
      </div>
    </CfpContainer>
  </div>
);

/** Two cards stacked with the 46px gap, as on the home page. */
export const Stacked = () => (
  <div style={{ width: 1180 }}>
    <CfpContainer>
      <FeatureStack>
        <QuoteBubble imageSrc={IMG + "/recipes/r13.jpg"} title="Рецепти для зниження холестерину" text="Їжте так, щоб ЛПНЩ знижувався!" buttonLabel="Меню проти холестерину" buttonHref="#" />
        <QuoteBubble imageSrc={IMG + "/recipes/r01.jpg"} title="Як проростити насіння та заправки" text="Мій гайд із пророщування з рецептами заправок." buttonLabel="Як проростити" buttonHref="#" />
      </FeatureStack>
    </CfpContainer>
  </div>
);
