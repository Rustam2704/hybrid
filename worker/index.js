// Payments backend for the hybrid site, running in the same Cloudflare Worker that
// serves the static files. Providers:
//   liqpay  — PrivatBank LiqPay checkout (UAH for Ukraine, USD/EUR for foreign cards)
//   mono    — monobank acquiring (Plata by mono) invoices, UAH
//   paddle  — Paddle Billing as merchant of record for EU / US / Canada (VAT & sales tax handled by Paddle)
// Orders live in Workers KV (binding ORDERS). Secrets are set with `wrangler secret put`:
//   LIQPAY_PUBLIC_KEY, LIQPAY_PRIVATE_KEY, MONO_TOKEN, PADDLE_WEBHOOK_SECRET
// Optional vars: LIQPAY_SANDBOX ("1" to force sandbox payments), SITE_URL, PADDLE_CLIENT_TOKEN,
//   PADDLE_ENV ("sandbox" | "production"), PADDLE_PRICE_<PRODUCT> price ids.
import { PRODUCTS, price } from "./products.js";

const API = "/hybrid/api";
const enc = new TextEncoder();

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers } });
const bad = (msg, status = 400) => json({ error: msg }, status);

const b64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const b64utf8 = (str) => b64(enc.encode(str));
const unb64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
const utf8 = (bytes) => new TextDecoder().decode(bytes);

async function sha1b64(str) { return b64(await crypto.subtle.digest("SHA-1", enc.encode(str))); }
async function hmac256hex(key, msg) {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return [...new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(msg)))].map((b) => b.toString(16).padStart(2, "0")).join("");
}
const timingSafeEqual = (a, b) => {
  if (a.length !== b.length) return false;
  let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
};
const newId = () => {
  const t = Date.now().toString(36); const r = crypto.getRandomValues(new Uint8Array(6));
  return `th-${t}-${[...r].map((b) => b.toString(36).padStart(2, "0")).join("")}`.slice(0, 32);
};

// ---------------------------------------------------------------- orders (KV)
async function saveOrder(env, order) { await env.ORDERS.put(`order:${order.id}`, JSON.stringify(order), { expirationTtl: 60 * 60 * 24 * 400 }); return order; }
async function getOrder(env, id) { const v = await env.ORDERS.get(`order:${id}`); return v ? JSON.parse(v) : null; }
async function markPaid(env, id, patch) {
  const o = await getOrder(env, id); if (!o) return null;
  if (o.status !== "paid") { o.status = "paid"; o.paidAt = new Date().toISOString(); o.downloadToken = newId(); }
  Object.assign(o, patch); await saveOrder(env, o); return o;
}

// ---------------------------------------------------------------- LiqPay
// data = base64(JSON), signature = base64(sha1(private_key + data + private_key))
export async function liqpaySign(privateKey, data) { return sha1b64(privateKey + data + privateKey); }

async function liqpayCheckout(env, order, siteUrl, lang) {
  if (!env.LIQPAY_PUBLIC_KEY || !env.LIQPAY_PRIVATE_KEY) return bad("LiqPay is not configured yet", 503);
  const params = {
    version: 3, public_key: env.LIQPAY_PUBLIC_KEY, action: "pay",
    amount: (order.amount / 100).toFixed(2), currency: order.currency,
    description: order.title, order_id: order.id, language: lang === "en" ? "en" : "uk",
    result_url: `${siteUrl}/hybrid/${lang === "en" ? "en/" : ""}thanks.html?order=${order.id}`,
    server_url: `${siteUrl}${API}/liqpay/callback`,
  };
  if (env.LIQPAY_SANDBOX === "1") params.sandbox = 1;
  const data = b64utf8(JSON.stringify(params));
  return json({ provider: "liqpay", action: "https://www.liqpay.ua/api/3/checkout", method: "POST", fields: { data, signature: await liqpaySign(env.LIQPAY_PRIVATE_KEY, data) }, order: order.id });
}

async function liqpayCallback(req, env) {
  const form = await req.formData();
  const data = form.get("data"); const signature = form.get("signature");
  if (!data || !signature) return bad("data/signature missing");
  const expected = await liqpaySign(env.LIQPAY_PRIVATE_KEY || "", data);
  if (!timingSafeEqual(expected, signature)) return bad("bad signature", 403);
  const p = JSON.parse(utf8(unb64(data)));
  const order = await getOrder(env, p.order_id);
  if (!order) return bad("unknown order", 404);
  const ok = p.status === "success" || p.status === "sandbox" || (p.status === "wait_accept");
  if (ok) await markPaid(env, order.id, { provider: "liqpay", providerRef: String(p.payment_id || p.liqpay_order_id || ""), providerStatus: p.status });
  else { order.providerStatus = p.status; order.status = ["failure", "error", "reversed"].includes(p.status) ? "failed" : order.status; await saveOrder(env, order); }
  return new Response("OK");
}

// ---------------------------------------------------------------- monobank acquiring
async function monoCheckout(env, order, siteUrl, lang) {
  if (!env.MONO_TOKEN) return bad("monobank is not configured yet", 503);
  const body = {
    amount: order.amount, ccy: 980,
    merchantPaymInfo: { reference: order.id, destination: order.title, comment: order.title, basketOrder: [{ name: order.title, qty: 1, sum: order.amount, total: order.amount, unit: "шт.", code: order.product }] },
    redirectUrl: `${siteUrl}/hybrid/${lang === "en" ? "en/" : ""}thanks.html?order=${order.id}`,
    webHookUrl: `${siteUrl}${API}/mono/webhook`,
    validity: 3600 * 24, paymentType: "debit",
  };
  const r = await fetch("https://api.monobank.ua/api/merchant/invoice/create", { method: "POST", headers: { "X-Token": env.MONO_TOKEN, "content-type": "application/json", "X-Cms": "hybrid-worker", "X-Cms-Version": "1.0" }, body: JSON.stringify(body) });
  if (!r.ok) return bad(`monobank error ${r.status}: ${await r.text()}`, 502);
  const inv = await r.json();
  order.providerRef = inv.invoiceId; await saveOrder(env, order);
  return json({ provider: "mono", redirect: inv.pageUrl, order: order.id });
}

async function monoPubKey(env) {
  const cached = await env.ORDERS.get("mono:pubkey");
  if (cached) return cached;
  const r = await fetch("https://api.monobank.ua/api/merchant/pubkey", { headers: { "X-Token": env.MONO_TOKEN } });
  if (!r.ok) throw new Error("pubkey fetch failed");
  const { key } = await r.json();
  await env.ORDERS.put("mono:pubkey", key, { expirationTtl: 3600 * 24 });
  return key;
}

// X-Sign = base64(ECDSA P-256 / SHA-256, DER) over the raw body; key = base64(PEM SPKI)
export async function ecdsaVerifyDer(pemBase64, signatureB64, rawBody) {
  const pem = utf8(unb64(pemBase64));
  const der = unb64(pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, ""));
  const key = await crypto.subtle.importKey("spki", der, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
  const sig = derToRaw(unb64(signatureB64));
  return crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, key, sig, enc.encode(rawBody));
}
function derToRaw(der) {           // ASN.1 SEQUENCE { INTEGER r, INTEGER s } -> r||s (32 bytes each)
  let i = 2; if (der[1] & 0x80) i += der[1] & 0x7f;
  const read = () => { if (der[i++] !== 0x02) throw new Error("bad DER"); let len = der[i++]; let v = der.slice(i, i + len); i += len; while (v.length > 32) v = v.slice(1); const out = new Uint8Array(32); out.set(v, 32 - v.length); return out; };
  const r = read(); const s = read(); const raw = new Uint8Array(64); raw.set(r); raw.set(s, 32); return raw;
}

async function monoWebhook(req, env) {
  const raw = await req.text();
  const sign = req.headers.get("X-Sign");
  if (!sign) return bad("no signature", 403);
  let ok = false;
  try { ok = await ecdsaVerifyDer(await monoPubKey(env), sign, raw); } catch (e) { ok = false; }
  if (!ok) {  // key may have rotated: refetch once
    await env.ORDERS.delete("mono:pubkey");
    try { ok = await ecdsaVerifyDer(await monoPubKey(env), sign, raw); } catch (e) { ok = false; }
  }
  if (!ok) return bad("bad signature", 403);
  const p = JSON.parse(raw);
  const order = await getOrder(env, p.reference);
  if (!order) return bad("unknown order", 404);
  if (p.status === "success") await markPaid(env, order.id, { provider: "mono", providerRef: p.invoiceId, providerStatus: p.status });
  else { order.providerStatus = p.status; if (["failure", "expired", "reversed"].includes(p.status)) order.status = "failed"; await saveOrder(env, order); }
  return new Response("OK");
}

// ---------------------------------------------------------------- Paddle (merchant of record)
// Checkout happens client-side with Paddle.js (client token + price id); we only confirm via webhook.
// Paddle-Signature: ts=<unix>;h1=<hex hmac-sha256(secret, `${ts}:${rawBody}`)>
export async function paddleVerify(secret, header, rawBody) {
  const parts = Object.fromEntries(header.split(";").map((kv) => kv.split("=")));
  if (!parts.ts || !parts.h1) return false;
  if (Math.abs(Date.now() / 1000 - Number(parts.ts)) > 300) return false;
  return timingSafeEqual(await hmac256hex(secret, `${parts.ts}:${rawBody}`), parts.h1);
}
async function paddleWebhook(req, env) {
  if (!env.PADDLE_WEBHOOK_SECRET) return bad("Paddle is not configured yet", 503);
  const raw = await req.text();
  if (!(await paddleVerify(env.PADDLE_WEBHOOK_SECRET, req.headers.get("Paddle-Signature") || "", raw))) return bad("bad signature", 403);
  const ev = JSON.parse(raw);
  if (ev.event_type === "transaction.completed" || ev.event_type === "transaction.paid") {
    const orderId = ev.data?.custom_data?.order;
    if (orderId) await markPaid(env, orderId, { provider: "paddle", providerRef: ev.data.id, providerStatus: ev.event_type });
  }
  return new Response("OK");
}
function paddleCheckout(env, order) {
  const priceId = env[`PADDLE_PRICE_${order.product.toUpperCase()}`];
  if (!env.PADDLE_CLIENT_TOKEN || !priceId) return bad("Paddle is not configured yet", 503);
  return json({ provider: "paddle", clientToken: env.PADDLE_CLIENT_TOKEN, environment: env.PADDLE_ENV || "sandbox", priceId, customData: { order: order.id }, customer: order.email ? { email: order.email } : undefined, order: order.id });
}

// ---------------------------------------------------------------- routes
async function handleApi(req, env, url) {
  const path = url.pathname.slice(API.length);
  const siteUrl = env.SITE_URL || `${url.protocol}//${url.host}`;

  if (req.method === "GET" && path === "/products") {
    return json({ products: Object.values(PRODUCTS).map(({ file, ...p }) => p), providers: {
      liqpay: Boolean(env.LIQPAY_PUBLIC_KEY && env.LIQPAY_PRIVATE_KEY), mono: Boolean(env.MONO_TOKEN),
      paddle: Boolean(env.PADDLE_CLIENT_TOKEN && env.PADDLE_WEBHOOK_SECRET), sandbox: env.LIQPAY_SANDBOX === "1" } });
  }
  if (req.method === "POST" && path === "/checkout") {
    const b = await req.json().catch(() => ({}));
    const provider = b.provider; const lang = b.lang === "en" ? "en" : "uk";
    const currency = provider === "mono" ? "UAH" : (["UAH", "USD", "EUR"].includes(b.currency) ? b.currency : "UAH");
    const amount = price(b.product, currency);
    if (!amount) return bad("unknown product or currency");
    const p = PRODUCTS[b.product];
    const order = { id: newId(), product: p.id, title: p.name[lang], amount, currency, email: (b.email || "").slice(0, 200), lang, provider, status: "pending", createdAt: new Date().toISOString() };
    await saveOrder(env, order);
    if (provider === "liqpay") return liqpayCheckout(env, order, siteUrl, lang);
    if (provider === "mono") return monoCheckout(env, order, siteUrl, lang);
    if (provider === "paddle") return paddleCheckout(env, order);
    return bad("unknown provider");
  }
  if (req.method === "POST" && path === "/liqpay/callback") return liqpayCallback(req, env);
  if (req.method === "POST" && path === "/mono/webhook") return monoWebhook(req, env);
  if (req.method === "POST" && path === "/paddle/webhook") return paddleWebhook(req, env);

  let m;
  if (req.method === "GET" && (m = path.match(/^\/order\/([\w-]+)$/))) {
    const o = await getOrder(env, m[1]); if (!o) return bad("not found", 404);
    const p = PRODUCTS[o.product];
    return json({ id: o.id, status: o.status, provider: o.provider, product: o.product, title: o.title, amount: o.amount, currency: o.currency,
      download: o.status === "paid" && p?.file ? `${API}/download/${o.id}/${o.downloadToken}` : null });
  }
  if (req.method === "GET" && (m = path.match(/^\/download\/([\w-]+)\/([\w-]+)$/))) {
    const o = await getOrder(env, m[1]);
    if (!o || o.status !== "paid" || o.downloadToken !== m[2]) return bad("not available", 403);
    const p = PRODUCTS[o.product]; if (!p?.file) return bad("nothing to download", 404);
    const asset = await env.ASSETS.fetch(new Request(`${url.origin}/hybrid/${p.file}`));
    if (!asset.ok) return bad("file missing", 404);
    return new Response(asset.body, { headers: { "content-type": "application/pdf", "content-disposition": `attachment; filename="${p.file.split("/").pop()}"`, "cache-control": "private, no-store" } });
  }
  return bad("not found", 404);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith(API + "/")) {
      try { return await handleApi(req, env, url); }
      catch (e) { return bad(`server error: ${e.message}`, 500); }
    }
    // protect raw download files: only the token route may serve them
    if (url.pathname.startsWith("/hybrid/downloads/")) return bad("forbidden", 403);
    return env.ASSETS.fetch(req);
  },
};
