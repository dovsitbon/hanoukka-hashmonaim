export const locales = ["he", "en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);

export const SITE_URL = "https://hanoukka-hashmonaim.vercel.app";
export type StripeTexts = {
  title: string; choose: string; other: string; min: string; or: string; email: string; pay: string;
  processing: string; minError: string; emailError: string; error: string; secure: string; thanks: string;
};

export const BIT_URL = "https://www.bitpay.co.il/app/me/32219B0E-AD5E-6854-E161-3DFC2133863E76A6";
export const PAYPAL_URL = "https://www.paypal.me/ShneorSitbon37";

// Ordre de la galerie : ordre de la maquette, puis les 10 photos envoyées ensuite (p16 à p25).
export const PHOTOS = [1, 2, 3, 8, 5, 10, 12, 9, 4, 7, 11, 13, 14, 15, 6, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];

export const BANK = {
  beneficiary: "Shneor Sitbon",
  iban: "FR76 2823 3000 0132 2764 5618 830",
  bic: "REVOFRP2",
  bank: "Revolut Bank UAB, 10 avenue Kléber, 75116 Paris",
  intermediaryBic: "BARCGB22",
  reference: "Hanoukka Hashmonaïm",
};

type Dict = {
  htmlTitle: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  brand: string;
  donate: string;
  coverAlt: string;
  title: string;
  by: string;
  goal: string;
  letter: { p: string[]; list: string[]; listIntro: string; after: string[]; sign: [string, string] };
  seePhotos: string;
  lastYear: { title: string; stats: { n: string; label: string }[]; hebron: string; thisYear: string };
  galleryTitle: string;
  photoAlt: (n: number) => string;
  videoLabel: (n: number) => string;
  donateTitle: string;
  stripe: StripeTexts;
  bit: { btn: string; note: string; to: string; qrAlt: string };
  paypalTitle: string;
  paypalNote: string;
  paypalBtn: string;
  qrAlt: string;
  transferTitle: string;
  referenceLabel: string;
  quote: [string, string];
  rows: { beneficiary: string; iban: string; bic: string; bank: string };
  copy: string;
  copied: string;
  abroad: string;
  legal: string;
  footer: string;
  close: string;
  prev: string;
  next: string;
  langLabel: string;
};

export const dict: Record<Locale, Dict> = {
  fr: {
    htmlTitle: "Hanoukka avec les soldats au front",
    description:
      "Beignets, repas chauds et bougies de Hanoukka pour les soldats au front et la brigade Hashmonaïm. Collecte de Shneor Sitbon, objectif 7 700 $.",
    ogTitle: "Hanoukka avec les soldats au front",
    ogDescription: "Ramener la lumière jusqu'au dernier check-point. Collecte de Shneor Sitbon.",
    brand: "Hanoukka · Soldats de Tsahal",
    donate: "Faire un don",
    coverAlt: "Coffre de voiture rempli de soufganiot, de boissons et de coffrets de bougies, prêt pour une sortie",
    title: "Hanoukka avec les soldats au front",
    by: "Collecte organisée par Shneor Sitbon",
    goal: "Objectif : 7 700 $",
    letter: {
      p: [
        "Shalom à tous,",
        "Avec un groupe de jeunes, on va chaque année à la rencontre des soldats pendant Hanoukka. Sur les check-points, dans les postes isolés, en pleine nuit. Ils sont loin de leurs familles pendant la fête, alors on leur apporte un peu de la maison.",
      ],
      listIntro: "Concrètement, ça veut dire :",
      list: [
        "des boîtes de soufganiot (beignets) livrées sur place,",
        "des barbecues et des repas chauds avec les unités,",
        "des coffrets de bougies pour allumer la hanoukia, même en mission,",
        "des boissons et des gâteaux pour les nuits de garde.",
      ],
      after: [
        "Cette année, le but est simple : passer Hanoukka avec les soldats au front, et en particulier ceux de la brigade Hashmonaïm. Ramener la lumière jusqu'au dernier check-point. Tout ce qu'on récolte sert à acheter ce qu'on leur apporte. Les photos ci-dessous viennent de nos sorties.",
        "On vise 7 700 $. Chaque don, même petit, c'est une boîte de beignets ou une bougie de plus.",
      ],
      sign: ["Merci beaucoup et joyeuses fêtes de Hanoukka,", "Shneor"],
    },
    seePhotos: "Voir les photos",
    lastYear: {
      title: "L'année dernière",
      stats: [
        { n: "400+", label: "bases et check-points visités" },
        { n: "2 000+", label: "bougies distribuées et allumées" },
        { n: "5 000+", label: "beignets distribués" },
        { n: "5 000+", label: "canettes distribuées" },
      ],
      hebron: "Et un grand allumage public avec barbecue pour les soldats, au tombeau des Patriarches à Hébron.",
      thisYear: "Cette année, on veut en faire autant. Ça dépend de votre générosité.",
    },
    galleryTitle: "Nos sorties en photos",
    photoAlt: (n) => `Sortie de Hanoukka avec les soldats, photo ${n}`,
    videoLabel: (n) => `Vidéo ${n} d'une sortie de Hanoukka`,
    donateTitle: "Faire un don",
    stripe: {"title":"Apple Pay, Google Pay ou carte bancaire","choose":"Choisissez votre don","other":"Autre montant","min":"Minimum 5 €","or":"ou par carte bancaire","email":"Votre email (pour le reçu)","pay":"Donner {amount}","processing":"Paiement en cours…","minError":"Le montant minimum est de 5 €.","emailError":"Indiquez un email valide pour recevoir le reçu.","error":"Le paiement n'a pas abouti. Réessayez, ou passez par PayPal ou le virement ci-dessous.","secure":"Paiement sécurisé par Stripe. Pas besoin de compte.","thanks":"Merci pour votre don ! Un reçu vous a été envoyé par email."},
    bit: {"btn":"Payer avec Bit","note":"Pour les donateurs en Israël, avec l'application Bit.","to":"Bénéficiaire :","qrAlt":"QR code Bit pour Shneor Zalman Sitbon"},
    paypalTitle: "Par carte bancaire ou PayPal",
    paypalNote: "Pas besoin de compte PayPal, vous pouvez payer directement par carte.",
    paypalBtn: "Donner avec PayPal",
    qrAlt: "QR code PayPal de Shneor Sitbon",
    transferTitle: "Par virement",
    referenceLabel: "Motif à indiquer :",
    quote: ["« ", " »"],
    rows: { beneficiary: "Bénéficiaire", iban: "IBAN", bic: "BIC", bank: "Banque" },
    copy: "Copier",
    copied: "Copié",
    abroad: "Depuis l'étranger (hors zone euro) : BIC de la banque correspondante BARCGB22.",
    legal:
      "Collecte personnelle de Shneor Sitbon et de bénévoles, au profit des soldats de la brigade Hashmonaïm. Initiative indépendante, non gérée par Tsahal. Les dons ne donnent pas droit à un reçu fiscal.",
    footer: "Merci pour votre soutien",
    close: "Fermer",
    prev: "Photo précédente",
    next: "Photo suivante",
    langLabel: "Langue",
  },
  en: {
    htmlTitle: "Hanukkah with the soldiers on the front line",
    description:
      "Sufganiyot, hot meals and Hanukkah candles for soldiers on the front lines and the Hashmonaim Brigade. A fundraiser by Shneor Sitbon, goal $7,700.",
    ogTitle: "Hanukkah with the soldiers on the front line",
    ogDescription: "Bringing the light all the way to the last checkpoint. A fundraiser by Shneor Sitbon.",
    brand: "Hanukkah · IDF Soldiers",
    donate: "Donate",
    coverAlt: "A car trunk packed with sufganiyot, drinks and candle kits, ready for a visit",
    title: "Hanukkah with the soldiers on the front line",
    by: "A fundraiser organized by Shneor Sitbon",
    goal: "Goal: $7,700",
    letter: {
      p: [
        "Shalom everyone,",
        "Every year, a group of us young volunteers goes out to meet the soldiers during Hanukkah. At checkpoints, at isolated posts, in the middle of the night. They're far from their families for the holiday, so we bring them a little taste of home.",
      ],
      listIntro: "In practice, that means:",
      list: [
        "boxes of sufganiyot (doughnuts) delivered on site,",
        "barbecues and hot meals with the units,",
        "candle kits so they can light the menorah even on duty,",
        "drinks and snacks for the night shifts.",
      ],
      after: [
        "This year the goal is simple: spend Hanukkah with the soldiers on the front lines, especially the Hashmonaim Brigade. Bring the light all the way to the last checkpoint. Everything we raise goes toward what we bring them. The photos below are from our past visits.",
        "We're aiming for $7,700. Every donation, even a small one, means one more box of doughnuts or one more candle.",
      ],
      sign: ["Thank you so much and happy Hanukkah,", "Shneor"],
    },
    seePhotos: "See the photos",
    lastYear: {
      title: "Last year",
      stats: [
        { n: "400+", label: "bases and checkpoints visited" },
        { n: "2,000+", label: "candles handed out and lit" },
        { n: "5,000+", label: "sufganiyot handed out" },
        { n: "5,000+", label: "cans of drinks handed out" },
      ],
      hebron: "And a big public candle lighting with a barbecue for the soldiers, at the Cave of the Patriarchs in Hebron.",
      thisYear: "This year we want to do just as much. It depends on your generosity.",
    },
    galleryTitle: "Our visits in photos",
    photoAlt: (n) => `Hanukkah visit with the soldiers, photo ${n}`,
    videoLabel: (n) => `Video ${n} from a Hanukkah visit`,
    donateTitle: "Donate",
    stripe: {"title":"Apple Pay, Google Pay or card","choose":"Choose your donation","other":"Other amount","min":"Minimum €5","or":"or by card","email":"Your email (for the receipt)","pay":"Donate {amount}","processing":"Processing…","minError":"The minimum amount is €5.","emailError":"Enter a valid email to receive your receipt.","error":"The payment didn't go through. Try again, or use PayPal or the bank transfer below.","secure":"Secure payment by Stripe. No account needed.","thanks":"Thank you for your donation! A receipt has been sent to your email."},
    bit: {"btn":"Pay with Bit","note":"For donors in Israel, with the Bit app.","to":"Recipient:","qrAlt":"Bit QR code for Shneor Zalman Sitbon"},
    paypalTitle: "By card or PayPal",
    paypalNote: "No PayPal account needed, you can pay by card.",
    paypalBtn: "Donate with PayPal",
    qrAlt: "Shneor Sitbon's PayPal QR code",
    transferTitle: "By bank transfer",
    referenceLabel: "Payment reference:",
    quote: ["“", "”"],
    rows: { beneficiary: "Beneficiary", iban: "IBAN", bic: "BIC", bank: "Bank" },
    copy: "Copy",
    copied: "Copied",
    abroad: "From outside the euro zone: correspondent bank BIC BARCGB22.",
    legal:
      "Personal fundraiser by Shneor Sitbon and volunteers, for the soldiers of the Hashmonaim Brigade. Independent initiative, not run by the IDF. Donations are not tax-deductible.",
    footer: "Thank you for your support",
    close: "Close",
    prev: "Previous photo",
    next: "Next photo",
    langLabel: "Language",
  },
  he: {
    htmlTitle: "חנוכה עם הלוחמים בחזית",
    description:
      "סופגניות, ארוחות חמות ונרות חנוכה ללוחמים בחזית ולחטיבת החשמונאים. מגבית של שניאור סיטבון, יעד 7,700 דולר.",
    ogTitle: "חנוכה עם הלוחמים בחזית",
    ogDescription: "להביא את האור עד המחסום האחרון. מגבית של שניאור סיטבון.",
    brand: "חנוכה · חיילי צה״ל",
    donate: "לתרומה",
    coverAlt: "תא מטען מלא בסופגניות, שתייה וערכות נרות, מוכן ליציאה",
    title: "חנוכה עם הלוחמים בחזית",
    by: "מגבית בארגון שניאור סיטבון",
    goal: "היעד: 7,700 דולר",
    letter: {
      p: [
        "שלום לכולם,",
        "כל שנה, קבוצה של בחורים יוצאת לפגוש את החיילים בחנוכה. במחסומים, בעמדות מבודדות, באמצע הלילה. הם רחוקים מהמשפחות שלהם בחג, אז אנחנו מביאים להם קצת מהבית.",
      ],
      listIntro: "בפועל:",
      list: [
        "קופסאות סופגניות עד לעמדה,",
        "מנגלים וארוחות חמות עם היחידות,",
        "ערכות נרות כדי להדליק חנוכייה גם במשימה,",
        "שתייה ומתוקים למשמרות הלילה.",
      ],
      after: [
        "השנה המטרה פשוטה: לעשות חנוכה עם הלוחמים בחזית, ובמיוחד עם לוחמי חטיבת החשמונאים. להביא את האור עד המחסום האחרון. כל מה שנאסף הולך לקנות את מה שאנחנו מביאים להם. התמונות למטה הן מהיציאות שלנו.",
        "היעד שלנו: 7,700 דולר. כל תרומה, גם קטנה, היא עוד קופסת סופגניות או עוד נר.",
      ],
      sign: ["תודה רבה וחג חנוכה שמח,", "שניאור"],
    },
    seePhotos: "לתמונות",
    lastYear: {
      title: "בשנה שעברה",
      stats: [
        { n: "+400", label: "בסיסים ומחסומים שביקרנו בהם" },
        { n: "+2,000", label: "נרות שחולקו והודלקו" },
        { n: "+5,000", label: "סופגניות שחולקו" },
        { n: "+5,000", label: "פחיות שתייה שחולקו" },
      ],
      hebron: "והדלקה גדולה ופתוחה לציבור עם מנגל לחיילים, במערת המכפלה בחברון.",
      thisYear: "השנה אנחנו רוצים לעשות לפחות אותו דבר. זה תלוי בנדיבות שלכם.",
    },
    galleryTitle: "היציאות שלנו בתמונות",
    photoAlt: (n) => `יציאת חנוכה עם החיילים, תמונה ${n}`,
    videoLabel: (n) => `סרטון ${n} מיציאת חנוכה`,
    donateTitle: "לתרומה",
    stripe: {"title":"Apple Pay, Google Pay או כרטיס אשראי","choose":"בחרו את סכום התרומה","other":"סכום אחר","min":"מינימום 5 €","or":"או בכרטיס אשראי","email":"האימייל שלכם (לקבלה)","pay":"לתרום {amount}","processing":"התשלום מתבצע…","minError":"הסכום המינימלי הוא 5 €.","emailError":"רשמו אימייל תקין כדי לקבל קבלה.","error":"התשלום לא עבר. נסו שוב, או השתמשו ב-PayPal או בהעברה בנקאית למטה.","secure":"תשלום מאובטח דרך Stripe. לא צריך חשבון.","thanks":"תודה על התרומה! קבלה נשלחה אליך במייל."},
    bit: {"btn":"תשלום בביט","note":"לתורמים בישראל, דרך אפליקציית ביט. מהיר ופשוט.","to":"המוטב:","qrAlt":"קוד QR של ביט לשניאור זלמן סיטבון"},
    paypalTitle: "בכרטיס אשראי או PayPal",
    paypalNote: "אין צורך בחשבון PayPal, אפשר לשלם בכרטיס אשראי.",
    paypalBtn: "לתרום ב-PayPal",
    qrAlt: "קוד QR של PayPal של שניאור סיטבון",
    transferTitle: "בהעברה בנקאית",
    referenceLabel: "לציין בהעברה:",
    quote: ["\"", "\""],
    rows: { beneficiary: "מוטב", iban: "IBAN", bic: "BIC", bank: "בנק" },
    copy: "העתקה",
    copied: "הועתק",
    abroad: "מחוץ לגוש האירו: BIC של הבנק המתווך BARCGB22.",
    legal: 'מגבית פרטית של שניאור סיטבון ומתנדבים, לטובת לוחמי חטיבת החשמונאים. יוזמה עצמאית, לא מטעם צה"ל.',
    footer: "תודה על התמיכה",
    close: "סגירה",
    prev: "התמונה הקודמת",
    next: "התמונה הבאה",
    langLabel: "שפה",
  },
};
