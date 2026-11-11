# Jauge de dons (Stripe)

La jauge se remplit toute seule : chaque paiement réussi par carte, Apple Pay ou Google Pay sur le site la fait monter. Il n'y a rien à saisir à la main.

## D'où viennent les chiffres

- Le montant collecté, le nombre de donateurs et les derniers dons sont lus directement dans Stripe par la route `GET /api/campaign`.
- Sont comptés les paiements réussis de la campagne (metadata `campaign` = `campaignId`), moins les remboursements. Les tout premiers dons, faits avant l'ajout de cette metadata, sont reconnus grâce à leur description « Don Hanoukka – soldats au front ».
- Le résultat est gardé en cache 60 secondes. Le webhook Stripe vide ce cache à chaque nouveau don ou remboursement, donc la jauge se met à jour en quelques secondes.
- Sur la page, la jauge se recharge toute seule toutes les 60 secondes. Si Stripe ne répond pas, elle garde le dernier chiffre connu.
- Bit, PayPal et le virement ne sont pas comptés. Pour les inclure à la main, voir `montantHorsStripe` plus bas.
- Le site n'affiche jamais l'email, le téléphone ni le nom de facturation : seulement le nom que le donateur a choisi d'afficher. S'il coche « anonyme », il apparaît comme « Donateur anonyme ».

## Variables Vercel (déjà en place)

Dans Vercel > projet `hanoukka-hashmonaim` > Settings > Environment Variables, en Production :

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | clé publiable Stripe (`pk_live_…`) |
| `STRIPE_SECRET_KEY` | clé secrète Stripe (`sk_live_…`), côté serveur uniquement |
| `STRIPE_WEBHOOK_SECRET` | secret du webhook (`whsec_…`) |

Pour remplacer les deux clés Stripe, lance `node scripts/stripe-keys.mjs`, puis redéploie (un push suffit).

## Webhook Stripe (déjà créé)

- Adresse : `https://hanoukka-hashmonaim.vercel.app/api/stripe-webhook`
- Événements : `payment_intent.succeeded` et `charge.refunded`

Pour le recréer à la main :
1. Va dans Stripe > Développeurs > Webhooks, puis « Ajouter une destination ».
2. Colle l'adresse ci-dessus et coche les deux événements.
3. Copie le « Secret de signature » (`whsec_…`) dans la variable Vercel `STRIPE_WEBHOOK_SECRET`.
4. Redéploie.

## Changer l'objectif, les dates ou les paliers

Tout se règle dans `data/campagne.json`, puis il suffit de pousser sur GitHub (Vercel redéploie tout seul) :

```json
{
  "campaignId": "hanoukka-2026",
  "objectif": 7700,
  "objectifBonus": null,
  "dateDebut": "2026-11-01",
  "dateFin": "2026-12-04T16:00:00+02:00",
  "paliers": [],
  "afficherMontantsDonateurs": true,
  "montantHorsStripe": 0
}
```

- `objectif` : en euros.
- `objectifBonus` : un nouvel objectif, affiché une fois le premier atteint (sinon `null`).
- `dateDebut` : les paiements Stripe sont lus à partir de cette date.
- `dateFin` : date et heure utilisées pour « jours avant Hanoukka » (ici le 4 décembre 2026, veille du premier soir).
- `paliers` : marques sur la barre, par exemple :
  ```json
  "paliers": [
    { "montant": 2500, "texte": { "he": "…", "en": "…", "fr": "…" } }
  ]
  ```
- `afficherMontantsDonateurs` : `false` pour ne montrer que les noms dans la liste des derniers dons.
- `montantHorsStripe` : un montant fixe en euros ajouté au total (dons reçus par Bit, PayPal ou virement), `0` par défaut.
- `campaignId` : l'étiquette posée sur chaque paiement. Si tu la changes, la jauge repart de zéro.

## Image de partage

`/api/og?lang=he` (ou `en`, `fr`) génère l'image envoyée avec le lien sur WhatsApp ou Facebook : la hanoukia, le montant collecté et la barre. WhatsApp garde parfois l'ancienne image quelque temps.
