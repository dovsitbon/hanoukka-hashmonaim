import raw from "@/data/campagne.json";

// Réglages de la campagne (data/campagne.json). Montants en euros dans le JSON, en centimes dans le code.
export type Palier = { montant: number; texte: { he: string; en: string; fr: string } };

type Raw = {
  campaignId: string;
  objectif: number;
  objectifBonus: number | null;
  dateDebut: string;
  dateFin: string;
  paliers: Palier[];
  afficherMontantsDonateurs: boolean;
  montantHorsStripe: number;
};

const c = raw as Raw;

export const CAMPAIGN = {
  id: c.campaignId,
  goal: Math.round(c.objectif * 100),
  bonusGoal: c.objectifBonus ? Math.round(c.objectifBonus * 100) : null,
  start: c.dateDebut,
  end: c.dateFin,
  milestones: [...(c.paliers ?? [])].sort((a, b) => a.montant - b.montant).map((p) => ({ amount: Math.round(p.montant * 100), text: p.texte })),
  showAmounts: c.afficherMontantsDonateurs !== false,
  offStripe: Math.round((c.montantHorsStripe ?? 0) * 100),
};

// Ancienne description des paiements, avant l'ajout de la metadata « campaign »
export const LEGACY_DESCRIPTION = "Don Hanoukka – soldats au front";

export type Donor = { name: string | null; amount: number | null; message: string | null; at: number };
export type CampaignData = {
  total: number; // centimes, remboursements déduits, + montantHorsStripe
  donors: number;
  recent: Donor[]; // du plus récent au plus ancien
  updatedAt: number;
};
