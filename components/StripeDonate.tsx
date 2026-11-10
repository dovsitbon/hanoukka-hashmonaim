"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { loadStripe, type Appearance, type StripeExpressCheckoutElementConfirmEvent } from "@stripe/stripe-js";
import { Elements, ExpressCheckoutElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { Locale, StripeTexts } from "@/lib/i18n";

const PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = PK ? loadStripe(PK) : null;

const PRESETS = [18, 36, 50, 100, 180];
const MIN = 500;
const MAX = 5_000_000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const appearance: Appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#14213d",
    colorText: "#222222",
    colorDanger: "#b42318",
    borderRadius: "6px",
    fontSizeBase: "16px",
    spacingUnit: "4px",
  },
};

const INTL: Record<Locale, string> = { fr: "fr-FR", en: "en-IE", he: "he-IL" };

function euros(cents: number, lang: Locale) {
  return new Intl.NumberFormat(INTL[lang], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function parseCustom(v: string) {
  const n = Number(v.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : 0;
}

async function createIntent(amount: number, email: string, lang: Locale) {
  const r = await fetch("/api/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, email, lang }),
  });
  const data = (await r.json().catch(() => ({}))) as { clientSecret?: string };
  if (!r.ok || !data.clientSecret) throw new Error("intent");
  return data.clientSecret;
}

export function StripeDonate({ t, lang }: { t: StripeTexts; lang: Locale }) {
  const [preset, setPreset] = useState<number | null>(36);
  const [custom, setCustom] = useState("");
  const [done, setDone] = useState(false);
  const [expressShown, setExpressShown] = useState(false);

  const amount = preset ? preset * 100 : parseCustom(custom);
  const valid = amount >= MIN && amount <= MAX;

  // Retour d'une redirection Stripe (3-D Secure, etc.) : ?redirect_status=succeeded
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const status = q.get("redirect_status");
    if (!status) return;
    if (status === "succeeded" || status === "processing") setDone(true);
    window.history.replaceState(null, "", window.location.pathname + "#don");
    document.getElementById("don")?.scrollIntoView();
  }, []);

  // Options figées au premier rendu ; le montant suit via elements.update()
  const options = useMemo(
    () => ({ mode: "payment" as const, amount: 3600, currency: "eur", paymentMethodTypes: ["card"], locale: lang, appearance }),
    [lang],
  );

  if (done) {
    return (
      <div role="status" className="mb-4 rounded-[6px] border border-[#c8952f] bg-white p-6">
        <p className="font-serif text-[1.3rem] font-bold leading-snug text-night">{t.thanks}</p>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-[6px] border border-neutral-300 bg-white p-6">
      <h3 className="mb-1.5 text-[1.15rem] font-bold text-night">{t.title}</h3>
      <p className="text-[16px] text-neutral-600">{t.secure}</p>

      <fieldset className="mt-5">
        <legend className="mb-2.5 font-semibold text-neutral-800">{t.choose}</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={preset === p}
              onClick={() => {
                setPreset(p);
                setCustom("");
              }}
              className={`h-12 rounded-[6px] border text-[17px] font-semibold ${
                preset === p ? "border-night bg-night text-white" : "border-neutral-300 bg-white text-neutral-900 hover:border-neutral-500"
              }`}
            >
              <bdi>{euros(p * 100, lang)}</bdi>
            </button>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="mb-1 block text-[15px] text-neutral-600">
            {t.other} <span className="text-neutral-400">({t.min})</span>
          </span>
          <div className="relative max-w-[220px]">
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value.replace(/[^\d.,\s]/g, ""));
                setPreset(null);
              }}
              onFocus={() => {
                if (custom) setPreset(null);
              }}
              placeholder="5"
              dir="ltr"
              className={`h-12 w-full rounded-[6px] border bg-white pe-3 ps-9 text-[17px] outline-none focus:border-night ${
                preset === null ? "border-night" : "border-neutral-300"
              }`}
            />
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-500">€</span>
          </div>
        </label>
        {preset === null && custom !== "" && !valid && <p className="mt-2 text-[14px] text-[#b42318]">{t.minError}</p>}
      </fieldset>

      {!stripePromise ? null : (
        <>
          {valid && (
            <div className={expressShown ? "mt-6" : ""}>
              <Elements stripe={stripePromise} options={options}>
                <Express amount={amount} lang={lang} t={t} onDone={() => setDone(true)} onShown={setExpressShown} />
              </Elements>
            </div>
          )}
          {expressShown && valid && (
            <div className="mt-6 flex items-center gap-3 text-[14px] text-neutral-500">
              <span className="h-px flex-1 bg-neutral-200" />
              {t.or}
              <span className="h-px flex-1 bg-neutral-200" />
            </div>
          )}
          <div className="mt-6">
            <Elements stripe={stripePromise} options={options}>
              <CardForm amount={amount} valid={valid} lang={lang} t={t} onDone={() => setDone(true)} />
            </Elements>
          </div>
        </>
      )}
    </div>
  );
}

function useAmount(amount: number, valid: boolean) {
  const elements = useElements();
  useEffect(() => {
    if (elements && valid) elements.update({ amount });
  }, [elements, amount, valid]);
}

function Express({
  amount,
  lang,
  t,
  onDone,
  onShown,
}: {
  amount: number;
  lang: Locale;
  t: StripeTexts;
  onDone: () => void;
  onShown: (v: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  useAmount(amount, true);

  async function onConfirm(event: StripeExpressCheckoutElementConfirmEvent) {
    if (!stripe || !elements) return;
    setError("");
    const { error: submitError } = await elements.submit();
    if (submitError) {
      event.paymentFailed({ reason: "fail" });
      return;
    }
    try {
      const clientSecret = await createIntent(amount, event.billingDetails?.email ?? "", lang);
      const { error: payError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: `${window.location.origin}/${lang}` },
        redirect: "if_required",
      });
      if (payError) {
        event.paymentFailed({ reason: "fail" });
        setError(payError.message || t.error);
        return;
      }
      onDone();
    } catch {
      event.paymentFailed({ reason: "fail" });
      setError(t.error);
    }
  }

  return (
    <>
      <ExpressCheckoutElement
        options={{
          buttonType: { applePay: "donate", googlePay: "donate" },
          buttonHeight: 48,
          paymentMethods: { link: "never", amazonPay: "never", paypal: "never", klarna: "never" },
        }}
        onReady={({ availablePaymentMethods }) => onShown(!!availablePaymentMethods)}
        onClick={({ resolve }) => resolve({ emailRequired: true })}
        onConfirm={onConfirm}
      />
      {error && <p className="mt-2 text-[14px] text-[#b42318]">{error}</p>}
    </>
  );
}

function CardForm({
  amount,
  valid,
  lang,
  t,
  onDone,
}: {
  amount: number;
  valid: boolean;
  lang: Locale;
  t: StripeTexts;
  onDone: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useAmount(amount, valid);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements || busy) return;
    setError("");
    if (!valid) return setError(t.minError);
    if (!EMAIL.test(email.trim())) return setError(t.emailError);
    setBusy(true);
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || t.error);
        return;
      }
      const clientSecret = await createIntent(amount, email.trim(), lang);
      const { error: payError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: `${window.location.origin}/${lang}`, payment_method_data: { billing_details: { email: email.trim() } } },
        redirect: "if_required",
      });
      if (payError) {
        setError(payError.message || t.error);
        return;
      }
      onDone();
    } catch {
      setError(t.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label className="mb-4 block">
        <span className="mb-1 block text-[15px] text-neutral-600">{t.email}</span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          dir="ltr"
          className="h-12 w-full rounded-[6px] border border-neutral-300 bg-white px-3 text-[16px] outline-none focus:border-night"
        />
      </label>
      <PaymentElement options={{ wallets: { applePay: "never", googlePay: "never", link: "never" }, layout: "tabs" }} />
      {error && (
        <p role="alert" className="mt-3 text-[14px] text-[#b42318]">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || busy || !valid}
        className="mt-5 h-12 w-full rounded-[6px] bg-night px-6 font-bold text-white hover:bg-[#1d2d52] disabled:opacity-50 sm:w-auto sm:min-w-[240px]"
      >
        {busy ? t.processing : t.pay.replace("{amount}", valid ? euros(amount, lang) : "")}
      </button>
    </form>
  );
}
