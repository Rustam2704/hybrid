# Taste of Health — how to build with this design system

This is the component library of a nutritionist's website that is a deliberate hybrid of two references:
the **shell** (sidebar, hero, framed sections, condensed uppercase headings, outline buttons, dark green footer) comes from theproof.com,
the **recipe machinery** (white content column, serif uppercase section titles, 3:4 recipe grids, quote-bubble feature cards, search band, author card, recipe card) comes from cookingforpeanuts.com.
Keep the two vocabularies apart: theproof parts live on the cream background and use Roboto Condensed + Manrope; cookingforpeanuts parts live in the white `CfpContainer` and use Lora + Lato.

## Setup

No provider is needed. Wrap a page in the shell in this order and it renders like the live site:

```jsx
<Sidebar logoSrc="…" items={nav} tools={tools} languages={langs} />
<main className="main">
  <Hero imageSrc="…" brandLine1="Смак" brandLine2="здоров'я" tagline="…" squiggle="довше і смачніше" socials={socials} />
  <Band title="Прості, доступні та здорові рецепти" />
  <CfpContainer>
    <SectionTitle title="Нові рецепти" subtitle="…" />
    <RecipeGrid items={recipes} columns={4} />
    <FeatureStack><QuoteBubble … /><QuoteBubble … /></FeatureStack>
  </CfpContainer>
  <SearchBand title="Знайдіть те, що шукаєте:" />
  <FramedSection columns="default">…</FramedSection>
  <Footer … />
</main>
```

`.main` adds the 96px left margin for the fixed sidebar; without `<Sidebar>` you can drop that class. The check mark in `Hero` draws itself when `document.body` (or any ancestor) has the class `e-animated` — add it once on mount.

## Styling idiom

Everything is styled by the shipped `styles.css` through the class names the components already render; there are no style props. When you need custom layout glue, use the design tokens defined on `:root`:

| token | value | use |
|---|---|---|
| `--tp-bg` | `#fff4ea` | cream page background of theproof sections |
| `--tp-green` | `#375542` | frames, headings, buttons, footer background |
| `--tp-ink` | `#2d2a26` | body text on cream |
| `--tp-yellow` | `#ffc844` | accent labels, hover colour |
| `--tp-head` / `--tp-body` | Roboto Condensed / Manrope | theproof typography |
| `--cfp-bg` | `#f7f4ed` | beige band, bubbles, author card |
| `--cfp-primary` | `#766e6b` | cookingforpeanuts links, buttons, captions |
| `--cfp-ink` | `#010101` | cookingforpeanuts text |
| `--cfp-serif` / `--cfp-sans` | Lora / Lato | cookingforpeanuts typography |
| `--frame` | `2px solid var(--tp-green)` | every theproof rule and frame |

Utility classes you may reuse for glue inside sections: `tp__text`, `tp__media`, `tp__small`, `tp__center`, `tp__tiny`, `cfp__lead`, `visually-hidden`.
Never invent new colours for these blocks; the whole point of the system is that it looks like the two originals.

## Where the truth lives

Read `styles.css` (tokens at the top, then theproof shell, then cookingforpeanuts parts, then the recipe page and the responsive rules) and each component's `.prompt.md`. Measured values come from the originals at 1440px: hero tagline 32px/44.8px, big heading 58px/62px with 1.4px tracking, buttons 22px/29px with 3.8px tracking and 15px 30px padding, recipe captions Lato 19px in `#766e6b`, section titles Lora 30.875px uppercase.

## Idiomatic snippet

```jsx
<FramedSection columns="video">
  <div className="tp__text">
    <TpHeading>Дивіться останнє відео</TpHeading>
    <TpHeading as="h3" size="soft">Назва випуску</TpHeading>
    <p className="tp__small">Гостя випуску</p>
    <AccentLabel>Випуск #12</AccentLabel>
    <Button href="#">Читати більше</Button>
  </div>
  <VideoCard posterSrc="…" href="#" />
</FramedSection>
```
