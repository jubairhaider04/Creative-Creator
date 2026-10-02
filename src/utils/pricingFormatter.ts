import { DualPrice } from "../data/pricingConfig";

export type { DualPrice };

export type SupportedLanguage = "en" | "bn" | "es" | string;
export type CurrencyCode = "USD" | "BDT";

/**
 * Returns the automatic currency associated with the given language.
 * English (and other languages) -> USD
 * Bangla (bn) -> BDT
 */
export const getCurrencyForLanguage = (language: SupportedLanguage): CurrencyCode => {
  return language === "bn" ? "BDT" : "USD";
};

/**
 * Returns the currency symbol for the given language.
 * Bangla (bn) -> ৳ (Bangladeshi Taka symbol)
 * Others -> $ (US Dollar)
 */
export const getCurrencySymbol = (language: SupportedLanguage): string => {
  return language === "bn" ? "৳" : "$";
};

/**
 * Formats a numeric price into a localized currency string.
 *
 * Examples:
 * formatPrice(499, "en")   => "$499"
 * formatPrice(1000, "en")  => "$1,000"
 * formatPrice(60000, "bn") => "৳60,000"
 * formatPrice(0, "en")     => "Free"
 * formatPrice(0, "bn")     => "ফ্রি"
 */
export const formatPrice = (amount: number, language: SupportedLanguage): string => {
  if (amount === 0) {
    return formatFree(language);
  }

  const isBn = language === "bn";
  const formattedNumber = amount.toLocaleString("en-US");
  return isBn ? `৳${formattedNumber}` : `$${formattedNumber}`;
};

/**
 * Formats a DualPrice object ({ usd: number, bdt: number }) into the appropriate currency string.
 */
export const formatDualPrice = (price: DualPrice, language: SupportedLanguage): string => {
  if (!price) return "";
  const isBn = language === "bn";
  const amount = isBn ? price.bdt : price.usd;
  return formatPrice(amount, language);
};

/**
 * Formats billing periods (/ month, / year) with proper translations.
 *
 * English: / month, / year
 * Bangla: / মাস, / বছর
 */
export const formatPeriod = (period: "month" | "year" | "package", language: SupportedLanguage): string => {
  if (language === "bn") {
    switch (period) {
      case "month": return "/ মাস";
      case "year": return "/ বছর";
      case "package": return "/ প্যাকেজ";
      default: return "";
    }
  }
  switch (period) {
    case "month": return "/ month";
    case "year": return "/ year";
    case "package": return "/ package";
    default: return "";
  }
};

/**
 * Formats a "Starting from" price.
 *
 * English: Starting from $499
 * Bangla: শুরু হচ্ছে ৳৬০,০০০ থেকে
 */
export const formatStartingFrom = (price: DualPrice, language: SupportedLanguage): string => {
  const formatted = formatDualPrice(price, language);
  if (language === "bn") {
    return `শুরু হচ্ছে ${formatted} থেকে`;
  }
  return `Starting from ${formatted}`;
};

/**
 * Formats a price range.
 *
 * English: $500 - $1,000
 * Bangla: ৳৫০,০০০ - ৳১,০০,০০০
 */
export const formatPriceRange = (
  min: DualPrice,
  max: DualPrice,
  language: SupportedLanguage
): string => {
  const minStr = formatDualPrice(min, language);
  const maxStr = formatDualPrice(max, language);
  return `${minStr} - ${maxStr}`;
};

/**
 * Formats a free service label.
 */
export const formatFree = (language: SupportedLanguage): string => {
  return language === "bn" ? "ফ্রি" : "Free";
};

/**
 * Formats custom pricing label.
 */
export const formatCustomPricing = (language: SupportedLanguage): string => {
  return language === "bn" ? "কাস্টম মূল্য" : "Custom Pricing";
};

/**
 * Helper to display client budget strings gracefully across languages
 * without altering the underlying raw data stored in Firestore.
 */
export const formatDisplayBudget = (rawBudget: string | undefined | null, language: SupportedLanguage): string => {
  if (!rawBudget) return language === "bn" ? "কাস্টম বাজেট" : "Custom Budget";

  const isBn = language === "bn";

  // If the user is on English, ensure BDT text is converted to USD format for display
  if (!isBn) {
    if (rawBudget.includes("10,000") || rawBudget.includes("১০,০০০") || rawBudget.toLowerCase().includes("starter")) {
      return "$100 - $250 (Starter Tier)";
    }
    if (rawBudget.includes("25,000") || rawBudget.includes("২৫,০০০") || rawBudget.toLowerCase().includes("growth")) {
      return "$250 - $500 (Growth Tier - Popular)";
    }
    if (rawBudget.includes("50,000") || rawBudget.includes("৫০,০০০") || rawBudget.toLowerCase().includes("scale")) {
      return "$500 - $1,000 (Scale Tier)";
    }
    if (rawBudget.includes("100,000") || rawBudget.includes("১,০০,০০০") || rawBudget.toLowerCase().includes("enterprise")) {
      return "$1,000+ (Enterprise Full Studio)";
    }
    // If it has Tk or ৳, replace with generic display or keep clean
    if (rawBudget.includes("৳")) {
      const numMatch = rawBudget.match(/[\d,]+/);
      if (numMatch) {
        const val = parseInt(numMatch[0].replace(/,/g, ""), 10);
        // Map to equivalent USD bracket
        if (val <= 20000) return "$149 (Starter)";
        if (val <= 45000) return "$299 (Growth)";
        return "$599 (Scale)";
      }
    }
  } else {
    // Visitor is on Bangla
    if (rawBudget.includes("100") && rawBudget.includes("250")) {
      return "৳ ১০,০০০ - ৳ ২৫,০০০ (স্টার্টার প্যাকেজ)";
    }
    if (rawBudget.includes("250") && rawBudget.includes("500")) {
      return "৳ ২৫,০০০ - ৳ ৫০,০০০ (গ্রোথ প্যাকেজ - সবচেয়ে জনপ্রিয়)";
    }
    if (rawBudget.includes("500") && rawBudget.includes("1,000")) {
      return "৳ ৫০,০০০ - ৳ ১,০০,০০০ (স্কেল প্যাকেজ)";
    }
    if (rawBudget.includes("1,000+") || rawBudget.includes("1000+")) {
      return "৳ ১,০০,০০০+ (ফুল এন্টারপ্রাইজ সল্যুশন)";
    }
    if (rawBudget.includes("$")) {
      const numMatch = rawBudget.match(/[\d,]+/);
      if (numMatch) {
        const val = parseInt(numMatch[0].replace(/,/g, ""), 10);
        if (val <= 200) return "৳ ১৫,০০০ (স্টার্টার)";
        if (val <= 400) return "৳ ৩৫,০০০ (গ্রোথ)";
        return "৳ ৭৫,০০০ (স্কেল)";
      }
    }
  }

  return rawBudget;
};
