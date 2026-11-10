// Saisie des clés Stripe dans le terminal, sans jamais les écrire dans le code.
// Clés live : .env.local + variables Vercel (production) + domaine Apple Pay dans Stripe.
// Clés test : .env.local seulement.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

// Toujours travailler à la racine du projet, d'où que le script soit lancé
process.chdir(fileURLToPath(new URL("..", import.meta.url)));

const DOMAIN = "hanoukka-hashmonaim.vercel.app";
const NL = String.fromCharCode(10);

console.log(NL + "Collez vos 2 clés Stripe (publiable pk_... et secrète sk_...), ensemble ou l'une après l'autre.");
console.log("Rien ne s'affiche pendant la saisie, c'est normal. Appuyez sur Entrée après avoir collé." + NL);
let pk = "";
let sk = "";
// Une seule interface pour toutes les lignes : un collage sur plusieurs lignes n'est pas perdu
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
rl._writeToOutput = () => {}; // saisie masquée
process.stdout.write("Clés : ");
await new Promise((resolve) => {
  let empty = 0;
  rl.on("line", (line) => {
    for (const k of line.match(/(pk|sk|rk)_(live|test)_[A-Za-z0-9]+/g) || []) {
      if (k.startsWith("pk_")) pk = k;
      else sk = k;
    }
    if (!line.trim()) empty++;
    if ((pk && sk) || empty >= 3) return resolve();
    process.stdout.write(NL + (pk ? "Clé publiable reçue. " : "") + (sk ? "Clé secrète reçue. " : "") + "Collez la clé manquante : ");
  });
  rl.on("close", resolve);
});
rl.close();
process.stdout.write(NL);
if (!pk || !sk) {
  console.error("Il faut la clé publiable (pk_...) ET la clé secrète (sk_...). Rien n'a été modifié.");
  process.exit(1);
}
const want = pk.split("_")[1];
if (sk.split("_")[1] !== want) {
  console.error("Les deux clés ne sont pas du même mode (live / test). Rien n'a été modifié.");
  process.exit(1);
}
const PROD = want === "live";
console.log("Clés " + want.toUpperCase() + " reconnues.");

// Vérifie la clé secrète auprès de Stripe avant d'écrire quoi que ce soit
const auth = { Authorization: `Bearer ${sk}` };
const acct = await fetch("https://api.stripe.com/v1/account", { headers: auth });
if (!acct.ok) {
  console.error(`Stripe refuse la clé secrète (HTTP ${acct.status}). Rien n'a été modifié.`);
  process.exit(1);
}
console.log("OK  clé secrète acceptée par Stripe");

// .env.local (ignoré par git)
const lines = existsSync(".env.local") ? readFileSync(".env.local", "utf8").split(/\r?\n/) : [];
const kept = lines.filter((l) => l && !/^(STRIPE_SECRET_KEY|NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)=/.test(l));
kept.push(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${pk}`, `STRIPE_SECRET_KEY=${sk}`);
writeFileSync(".env.local", kept.join(NL) + NL);
console.log("OK  .env.local mis à jour");

if (PROD) {
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  for (const [name, value, sensitive] of [
    ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", pk, false],
    ["STRIPE_SECRET_KEY", sk, true],
  ]) {
    const r = spawnSync(
      npx,
      ["--yes", "vercel@latest", "env", "add", name, "--environment", "production", "--force", "--yes", sensitive ? "--sensitive" : "--no-sensitive", "--scope", "ds6-b15d"],
      { input: value, encoding: "utf8", shell: process.platform === "win32" },
    );
    if (r.status !== 0) {
      console.error(`Échec Vercel pour ${name} :` + NL + (r.stderr || r.stdout || "").replaceAll(value, "***"));
      process.exit(1);
    }
    console.log(`OK  Vercel production : ${name}`);
  }
}

// Domaine des moyens de paiement (nécessaire pour qu'Apple Pay s'affiche sur le site)
const list = await fetch(`https://api.stripe.com/v1/payment_method_domains?domain_name=${DOMAIN}`, { headers: auth }).then((r) => r.json());
let dom = list.data?.[0];
if (!dom) {
  dom = await fetch("https://api.stripe.com/v1/payment_method_domains", {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ domain_name: DOMAIN }),
  }).then((r) => r.json());
} else {
  dom = await fetch(`https://api.stripe.com/v1/payment_method_domains/${dom.id}/validate`, { method: "POST", headers: auth }).then((r) => r.json());
}
if (dom.error) console.error(`Domaine Stripe : ${dom.error.message}`);
else console.log(`OK  domaine ${DOMAIN} enregistré dans Stripe (${want}) : Apple Pay ${dom.apple_pay?.status}, Google Pay ${dom.google_pay?.status}`);

console.log(NL + "Terminé. Vous pouvez revenir dans la conversation." + NL);
