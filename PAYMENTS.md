# Payments — how it works and what is left to do

The static site and the payments API run in one Cloudflare Worker (`wrangler.toml`, code in `worker/`).
Orders are stored in Workers KV (`ORDERS`). Card data never touches the site: every provider
redirects to its own hosted page (LiqPay, monobank) or overlay (Paddle) and confirms by a signed webhook.

Pages: `checkout.html` (choose product → e-mail → method) and `thanks.html` (polls the order, shows the download).
The buttons «Отримати програму» and «Меню проти холестерину» on the home page already lead to the checkout.

## Endpoints (`/hybrid/api/...`)

| method | path | purpose |
|---|---|---|
| GET | `/products` | catalogue + which providers are configured |
| POST | `/checkout` | `{product, provider: liqpay\|mono\|paddle, currency, email, lang}` → creates the order and returns what the browser needs (LiqPay signed form, monobank `pageUrl`, Paddle price + client token) |
| POST | `/liqpay/callback` | LiqPay `server_url`: verifies `signature = base64(sha1(private + data + private))`, marks the order paid on `success`/`sandbox` |
| POST | `/mono/webhook` | monobank webhook: verifies the `X-Sign` ECDSA-P256/SHA-256 signature with `GET /api/merchant/pubkey` (cached 24 h, refetched once on failure) |
| POST | `/paddle/webhook` | Paddle Billing: verifies `Paddle-Signature` (`ts` + HMAC-SHA256 `h1`), marks paid on `transaction.completed` |
| GET | `/order/:id` | status for the thank-you page (`pending` → `paid` / `failed`) |
| GET | `/download/:id/:token` | serves the PDF of a paid digital product; raw `/hybrid/downloads/*` URLs are blocked |

Signature code is covered by `worker/test.mjs` (`node worker/test.mjs`) against Node's crypto.

## Products and prices

`worker/products.js` — three items to start with (program PDF, weekly meal plan PDF, 50-minute consultation)
in UAH / USD / EUR. Replace the placeholder PDFs in `downloads/` with the real files (same names or update the paths).

## What Olena / Rustam must do to switch it on

All three need a **ФОП or ТОВ**; connecting takes 1–5 working days. Nothing below requires code changes,
only secrets (`wrangler secret put NAME` from the `hybrid/` folder, then `./deploy.sh`).

### 1. LiqPay (PrivatBank) — Ukraine, also foreign Visa/Mastercard in USD/EUR
1. https://www.liqpay.ua → «Бізнесу» → register the shop (ФОП data, IBAN). Test keys are available immediately
   in the shop settings → «API» (`public_key` starts with `sandbox_i…`).
2. `wrangler secret put LIQPAY_PUBLIC_KEY` and `wrangler secret put LIQPAY_PRIVATE_KEY`.
3. While `LIQPAY_SANDBOX = "1"` in `wrangler.toml`, every payment is a test payment (status `sandbox`) —
   set it to `"0"` once the shop is activated. Fee: 1.3 % Ukrainian cards, 2 % foreign cards.
4. In the LiqPay shop settings the callback URL is taken from each request (`server_url`), nothing to configure.

### 2. monobank acquiring (Plata by mono) — Ukraine
1. https://web.monobank.ua → «Еквайринг» → «Інтернет-еквайринг» → create a terminal, get the **token**
   (a test token is offered there as well).
2. `wrangler secret put MONO_TOKEN`. Fee: 1.3 %. The webhook is signed by mono, the Worker fetches the public key itself.

### 3. Abroad — EU, USA, Canada
Two layers:

- **Immediately**: the «Міжнародна картка» option already uses LiqPay in USD or EUR (foreign cards, 2 %).
  Money lands on the Ukrainian account in that currency. No tax handling for the buyer's country.
- **Recommended for digital products in the EU/US**: **Paddle Billing** as merchant of record — Paddle is the
  legal seller, collects VAT / sales tax, handles chargebacks and pays out monthly. Ukrainian sellers are
  accepted (only the occupied regions are excluded). Steps:
  1. https://sandbox-vendors.paddle.com (sandbox) → create the three products/prices, copy the price ids.
  2. Developer tools → Authentication → client-side token; Notifications → add destination
     `https://fanatic.space/hybrid/api/paddle/webhook` for `transaction.completed`, copy the secret key.
  3. `wrangler secret put PADDLE_CLIENT_TOKEN`, `wrangler secret put PADDLE_WEBHOOK_SECRET`,
     `wrangler secret put PADDLE_PRICE_PROGRAM` (and `_MEALPLAN`, `_CONSULT`), set `PADDLE_ENV` to `production` when approved.
  As soon as Paddle is configured the «Міжнародна картка» option switches from LiqPay to the Paddle overlay automatically.
- Lemon Squeezy and Gumroad were checked and rejected: no payouts to Ukrainian bank accounts.
- Stripe is not available to Ukrainian entities directly; it would need a foreign company.

## Not done yet (needs accounts or decisions)
- E-mail receipts: the thank-you page says a letter is on its way, but no mailer is wired. Cheapest route on
  Cloudflare: Email Routing + MailChannels or Resend (free tier) from the webhook handlers.
- Consultation booking after payment (calendar link) — add the link to `thanks.html` or the receipt e-mail.
- Fiscalisation (ПРРО/чеки) if the ФОП group requires it: monobank offers a free ПРРО, LiqPay integrates with Checkbox.
