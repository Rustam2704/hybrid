// Catalogue of things the site sells. Prices are minor units (kopecks / cents).
// `file` is a path inside the static assets that is served only after payment.
export const PRODUCTS = {
  program: {
    id: "program",
    name: { uk: "Програма «12 тижнів» (PDF)", en: "The 12-Week Program (PDF)" },
    description: { uk: "Покроковий план звичок на 12 тижнів у PDF.", en: "A 12-week habit plan as a PDF." },
    prices: { UAH: 49000, USD: 1200, EUR: 1100 },
    file: "downloads/program-12-weeks.pdf",
    type: "digital",
  },
  mealplan: {
    id: "mealplan",
    name: { uk: "Тижневе меню зі списком покупок (PDF)", en: "Weekly meal plan with grocery list (PDF)" },
    description: { uk: "7 днів, 21 страва, список покупок.", en: "7 days, 21 dishes, grocery list." },
    prices: { UAH: 29000, USD: 800, EUR: 700 },
    file: "downloads/meal-plan-week.pdf",
    type: "digital",
  },
  consult: {
    id: "consult",
    name: { uk: "Онлайн-консультація, 50 хвилин", en: "Online consultation, 50 minutes" },
    description: { uk: "Відеодзвінок, розбір раціону, план на місяць.", en: "Video call, diet review, one-month plan." },
    prices: { UAH: 150000, USD: 4000, EUR: 3700 },
    type: "service",
  },
};

export function price(product, currency) {
  const p = PRODUCTS[product];
  if (!p || !(currency in p.prices)) return null;
  return p.prices[currency];
}
