import { CENTRALIZED_PRICING, DualPrice } from "./pricingConfig";

export interface PricingPlan {
  id: "starter" | "growth" | "scale";
  name: string;
  tagline: string;
  // Multilingual Dual Pricing
  price: DualPrice;
  regularPrice: DualPrice;
  // Legacy / convenience fields for backward compatibility
  priceTk: number;
  formattedTk: string;
  regularPriceTk: string;
  badge?: string;
  isPopular?: boolean;
  idealFor: string;
  turnaroundDays: string;
  paymentTerms: string;
  features: string[];
  bonuses: string[];
  ctaText: string;
  whatsAppMessage: string;
  // Localized versions
  bn?: {
    name: string;
    tagline: string;
    idealFor: string;
    turnaroundDays: string;
    paymentTerms: string;
    features: string[];
    bonuses: string[];
    ctaText: string;
    badge?: string;
    whatsAppMessage: string;
  };
  es?: {
    name: string;
    tagline: string;
    idealFor: string;
    turnaroundDays: string;
    paymentTerms: string;
    features: string[];
    bonuses: string[];
    ctaText: string;
    badge?: string;
    whatsAppMessage: string;
  };
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: CENTRALIZED_PRICING.plans.starter.name.en,
    tagline: CENTRALIZED_PRICING.plans.starter.tagline.en,
    price: CENTRALIZED_PRICING.plans.starter.price,
    regularPrice: CENTRALIZED_PRICING.plans.starter.regularPrice,
    priceTk: CENTRALIZED_PRICING.plans.starter.price.bdt,
    formattedTk: `৳ ${CENTRALIZED_PRICING.plans.starter.price.bdt.toLocaleString()}`,
    regularPriceTk: `৳ ${CENTRALIZED_PRICING.plans.starter.regularPrice.bdt.toLocaleString()}`,
    badge: CENTRALIZED_PRICING.plans.starter.badge?.en,
    isPopular: CENTRALIZED_PRICING.plans.starter.isPopular,
    idealFor: CENTRALIZED_PRICING.plans.starter.idealFor.en,
    turnaroundDays: CENTRALIZED_PRICING.plans.starter.turnaroundDays.en,
    paymentTerms: CENTRALIZED_PRICING.plans.starter.paymentTerms.en,
    features: CENTRALIZED_PRICING.plans.starter.features.en,
    bonuses: CENTRALIZED_PRICING.plans.starter.bonuses.en,
    ctaText: CENTRALIZED_PRICING.plans.starter.ctaText.en,
    whatsAppMessage: CENTRALIZED_PRICING.plans.starter.whatsAppMessage.en,
    bn: {
      name: CENTRALIZED_PRICING.plans.starter.name.bn,
      tagline: CENTRALIZED_PRICING.plans.starter.tagline.bn,
      idealFor: CENTRALIZED_PRICING.plans.starter.idealFor.bn,
      turnaroundDays: CENTRALIZED_PRICING.plans.starter.turnaroundDays.bn,
      paymentTerms: CENTRALIZED_PRICING.plans.starter.paymentTerms.bn,
      features: CENTRALIZED_PRICING.plans.starter.features.bn,
      bonuses: CENTRALIZED_PRICING.plans.starter.bonuses.bn,
      ctaText: CENTRALIZED_PRICING.plans.starter.ctaText.bn,
      badge: CENTRALIZED_PRICING.plans.starter.badge?.bn,
      whatsAppMessage: CENTRALIZED_PRICING.plans.starter.whatsAppMessage.bn
    },
    es: {
      name: CENTRALIZED_PRICING.plans.starter.name.es || "Paquete Starter",
      tagline: CENTRALIZED_PRICING.plans.starter.tagline.es || "",
      idealFor: CENTRALIZED_PRICING.plans.starter.idealFor.es || "",
      turnaroundDays: CENTRALIZED_PRICING.plans.starter.turnaroundDays.es || "",
      paymentTerms: CENTRALIZED_PRICING.plans.starter.paymentTerms.es || "",
      features: CENTRALIZED_PRICING.plans.starter.features.es || [],
      bonuses: CENTRALIZED_PRICING.plans.starter.bonuses.es || [],
      ctaText: CENTRALIZED_PRICING.plans.starter.ctaText.es || "",
      badge: CENTRALIZED_PRICING.plans.starter.badge?.es,
      whatsAppMessage: CENTRALIZED_PRICING.plans.starter.whatsAppMessage.es || ""
    }
  },
  {
    id: "growth",
    name: CENTRALIZED_PRICING.plans.growth.name.en,
    tagline: CENTRALIZED_PRICING.plans.growth.tagline.en,
    price: CENTRALIZED_PRICING.plans.growth.price,
    regularPrice: CENTRALIZED_PRICING.plans.growth.regularPrice,
    priceTk: CENTRALIZED_PRICING.plans.growth.price.bdt,
    formattedTk: `৳ ${CENTRALIZED_PRICING.plans.growth.price.bdt.toLocaleString()}`,
    regularPriceTk: `৳ ${CENTRALIZED_PRICING.plans.growth.regularPrice.bdt.toLocaleString()}`,
    badge: CENTRALIZED_PRICING.plans.growth.badge?.en,
    isPopular: CENTRALIZED_PRICING.plans.growth.isPopular,
    idealFor: CENTRALIZED_PRICING.plans.growth.idealFor.en,
    turnaroundDays: CENTRALIZED_PRICING.plans.growth.turnaroundDays.en,
    paymentTerms: CENTRALIZED_PRICING.plans.growth.paymentTerms.en,
    features: CENTRALIZED_PRICING.plans.growth.features.en,
    bonuses: CENTRALIZED_PRICING.plans.growth.bonuses.en,
    ctaText: CENTRALIZED_PRICING.plans.growth.ctaText.en,
    whatsAppMessage: CENTRALIZED_PRICING.plans.growth.whatsAppMessage.en,
    bn: {
      name: CENTRALIZED_PRICING.plans.growth.name.bn,
      tagline: CENTRALIZED_PRICING.plans.growth.tagline.bn,
      idealFor: CENTRALIZED_PRICING.plans.growth.idealFor.bn,
      turnaroundDays: CENTRALIZED_PRICING.plans.growth.turnaroundDays.bn,
      paymentTerms: CENTRALIZED_PRICING.plans.growth.paymentTerms.bn,
      features: CENTRALIZED_PRICING.plans.growth.features.bn,
      bonuses: CENTRALIZED_PRICING.plans.growth.bonuses.bn,
      ctaText: CENTRALIZED_PRICING.plans.growth.ctaText.bn,
      badge: CENTRALIZED_PRICING.plans.growth.badge?.bn,
      whatsAppMessage: CENTRALIZED_PRICING.plans.growth.whatsAppMessage.bn
    },
    es: {
      name: CENTRALIZED_PRICING.plans.growth.name.es || "Paquete Growth",
      tagline: CENTRALIZED_PRICING.plans.growth.tagline.es || "",
      idealFor: CENTRALIZED_PRICING.plans.growth.idealFor.es || "",
      turnaroundDays: CENTRALIZED_PRICING.plans.growth.turnaroundDays.es || "",
      paymentTerms: CENTRALIZED_PRICING.plans.growth.paymentTerms.es || "",
      features: CENTRALIZED_PRICING.plans.growth.features.es || [],
      bonuses: CENTRALIZED_PRICING.plans.growth.bonuses.es || [],
      ctaText: CENTRALIZED_PRICING.plans.growth.ctaText.es || "",
      badge: CENTRALIZED_PRICING.plans.growth.badge?.es,
      whatsAppMessage: CENTRALIZED_PRICING.plans.growth.whatsAppMessage.es || ""
    }
  },
  {
    id: "scale",
    name: CENTRALIZED_PRICING.plans.scale.name.en,
    tagline: CENTRALIZED_PRICING.plans.scale.tagline.en,
    price: CENTRALIZED_PRICING.plans.scale.price,
    regularPrice: CENTRALIZED_PRICING.plans.scale.regularPrice,
    priceTk: CENTRALIZED_PRICING.plans.scale.price.bdt,
    formattedTk: `৳ ${CENTRALIZED_PRICING.plans.scale.price.bdt.toLocaleString()}`,
    regularPriceTk: `৳ ${CENTRALIZED_PRICING.plans.scale.regularPrice.bdt.toLocaleString()}`,
    badge: CENTRALIZED_PRICING.plans.scale.badge?.en,
    isPopular: CENTRALIZED_PRICING.plans.scale.isPopular,
    idealFor: CENTRALIZED_PRICING.plans.scale.idealFor.en,
    turnaroundDays: CENTRALIZED_PRICING.plans.scale.turnaroundDays.en,
    paymentTerms: CENTRALIZED_PRICING.plans.scale.paymentTerms.en,
    features: CENTRALIZED_PRICING.plans.scale.features.en,
    bonuses: CENTRALIZED_PRICING.plans.scale.bonuses.en,
    ctaText: CENTRALIZED_PRICING.plans.scale.ctaText.en,
    whatsAppMessage: CENTRALIZED_PRICING.plans.scale.whatsAppMessage.en,
    bn: {
      name: CENTRALIZED_PRICING.plans.scale.name.bn,
      tagline: CENTRALIZED_PRICING.plans.scale.tagline.bn,
      idealFor: CENTRALIZED_PRICING.plans.scale.idealFor.bn,
      turnaroundDays: CENTRALIZED_PRICING.plans.scale.turnaroundDays.bn,
      paymentTerms: CENTRALIZED_PRICING.plans.scale.paymentTerms.bn,
      features: CENTRALIZED_PRICING.plans.scale.features.bn,
      bonuses: CENTRALIZED_PRICING.plans.scale.bonuses.bn,
      ctaText: CENTRALIZED_PRICING.plans.scale.ctaText.bn,
      badge: CENTRALIZED_PRICING.plans.scale.badge?.bn,
      whatsAppMessage: CENTRALIZED_PRICING.plans.scale.whatsAppMessage.bn
    },
    es: {
      name: CENTRALIZED_PRICING.plans.scale.name.es || "Paquete Scale",
      tagline: CENTRALIZED_PRICING.plans.scale.tagline.es || "",
      idealFor: CENTRALIZED_PRICING.plans.scale.idealFor.es || "",
      turnaroundDays: CENTRALIZED_PRICING.plans.scale.turnaroundDays.es || "",
      paymentTerms: CENTRALIZED_PRICING.plans.scale.paymentTerms.es || "",
      features: CENTRALIZED_PRICING.plans.scale.features.es || [],
      bonuses: CENTRALIZED_PRICING.plans.scale.bonuses.es || [],
      ctaText: CENTRALIZED_PRICING.plans.scale.ctaText.es || "",
      badge: CENTRALIZED_PRICING.plans.scale.badge?.es,
      whatsAppMessage: CENTRALIZED_PRICING.plans.scale.whatsAppMessage.es || ""
    }
  }
];

export const PAYMENT_METHODS = [
  { name: "Visa / Mastercard / Amex", icon: "Card", color: "bg-emerald-600/10 text-emerald-400 border-emerald-500/30" },
  { name: "Stripe / International Online Payments", icon: "Card", color: "bg-indigo-600/10 text-indigo-400 border-indigo-500/30" },
  { name: "bKash (Merchant & Personal)", icon: "bKash", color: "bg-pink-600/10 text-pink-400 border-pink-500/30" },
  { name: "Nagad (Digital Payment)", icon: "Nagad", color: "bg-orange-600/10 text-orange-400 border-orange-500/30" },
  { name: "Rocket (DBBL)", icon: "Rocket", color: "bg-purple-600/10 text-purple-400 border-purple-500/30" },
  { name: "Bank Wire Transfer (City, DBBL, Brac, EFT / SWIFT)", icon: "Bank", color: "bg-blue-600/10 text-blue-400 border-blue-500/30" }
];
