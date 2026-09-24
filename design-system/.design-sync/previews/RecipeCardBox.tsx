import React from "react";
import { RecipeCardBox } from "taste-of-health-ds";
import { IMG } from "./_data";

/** The printable recipe card from the recipe page. */
export const QuinoaSalad = () => (
  <div style={{ width: 760, padding: 24, background: "#fff", fontFamily: "Lato, sans-serif", color: "#010101" }}>
    <RecipeCardBox
      imageSrc={IMG + "/recipes/r05.jpg"}
      title="Салат із кіноа та білої квасолі з лимонною заправкою"
      summary="Білковий салат для мілпрепу з вершковою лимонною заправкою."
      meta={[{ label: "Підготовка", value: "10 хв" }, { label: "Приготування", value: "15 хв" }, { label: "Разом", value: "25 хв" }, { label: "Порцій", value: "4" }]}
      ingredientsHeading="Інгредієнти"
      ingredients={["1 склянка кіноа (сухої)", "1 банка (400 г) білої квасолі", "1 огірок, кубиками", "200 г помідорів черрі", "½ пучка петрушки", "3 ст. л. тахіні", "сік 1 лимона", "1 зубчик часнику", "сіль, перець"]}
      stepsHeading="Приготування"
      steps={["Відваріть кіноа, охолодіть.", "Змішайте заправку до кремової консистенції.", "З'єднайте всі інгредієнти в мисці й полийте заправкою.", "Дайте настоятися 10 хвилин. Зберігайте до 4 днів."]}
      nutritionHeading="Харчова цінність (на порцію)"
      nutrition="Калорії 320 · Білок 14 г · Клітковина 12 г · Жири 9 г · Вуглеводи 46 г"
      printLabel="Друк"
    />
  </div>
);
