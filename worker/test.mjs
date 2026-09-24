// Offline checks of the three signature schemes against Node's crypto.
import crypto from "node:crypto";
import { liqpaySign, ecdsaVerifyDer, paddleVerify } from "./index.js";

// LiqPay: base64(sha1(priv + data + priv))
const priv = "sandbox_private_key_123", data = Buffer.from(JSON.stringify({ version: 3, action: "pay", amount: "4.90", currency: "UAH" })).toString("base64");
const ref = crypto.createHash("sha1").update(priv + data + priv).digest("base64");
console.log("liqpay signature", (await liqpaySign(priv, data)) === ref ? "OK" : "FAIL");

// monobank: ECDSA P-256 / SHA-256, DER signature, key as base64(PEM SPKI)
const { publicKey, privateKey } = crypto.generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const body = JSON.stringify({ invoiceId: "p2_9ZgpZVsl3", status: "success", amount: 49000, ccy: 980, reference: "th-abc" });
const der = crypto.sign("sha256", Buffer.from(body), { key: privateKey, dsaEncoding: "der" });
const pemB64 = Buffer.from(publicKey.export({ type: "spki", format: "pem" })).toString("base64");
console.log("mono webhook verify", (await ecdsaVerifyDer(pemB64, der.toString("base64"), body)) ? "OK" : "FAIL");
console.log("mono tampered body rejected", (await ecdsaVerifyDer(pemB64, der.toString("base64"), body + " ")) ? "FAIL" : "OK");

// Paddle: ts=..;h1=hmac_sha256(secret, `${ts}:${body}`)
const secret = "pdl_ntfset_test", ts = Math.floor(Date.now() / 1000), pbody = JSON.stringify({ event_type: "transaction.completed", data: { id: "txn_1", custom_data: { order: "th-abc" } } });
const h1 = crypto.createHmac("sha256", secret).update(`${ts}:${pbody}`).digest("hex");
console.log("paddle verify", (await paddleVerify(secret, `ts=${ts};h1=${h1}`, pbody)) ? "OK" : "FAIL");
console.log("paddle wrong secret rejected", (await paddleVerify("other", `ts=${ts};h1=${h1}`, pbody)) ? "FAIL" : "OK");
