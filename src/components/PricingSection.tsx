import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Gift, 
  Zap, 
  CreditCard,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { PRICING_PLANS, PAYMENT_METHODS, PricingPlan } from "../data/pricingData";
import { useLanguage } from "../context/LanguageContext";

interface PricingSectionProps {
  onSelectPlanForInquiry: (plan: PricingPlan) => void;
  onOpenQuoteCalculator: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlanForInquiry,
  onOpenQuoteCalculator
}) => {
  const { t, language } = useLanguage();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("growth");

  return (
    <section id="pricing" className="py-24 relative border-t border-zinc-800/80 bg-zinc-950 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.pricingBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {t.pricingTitle} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-300">
              Starter, Growth & Scale
            </span>
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {t.pricingSubtitle}
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {PRICING_PLANS.map((plan) => {
            const isPopular = plan.isPopular;
            const localized = language === "bn" ? plan.bn : language === "es" ? plan.es : null;

            const name = localized?.name || plan.name;
            const tagline = localized?.tagline || plan.tagline;
            const badge = localized?.badge || plan.badge;
            const idealFor = localized?.idealFor || plan.idealFor;
            const turnaroundDays = localized?.turnaroundDays || plan.turnaroundDays;
            const paymentTerms = localized?.paymentTerms || plan.paymentTerms;
            const features = localized?.features || plan.features;
            const bonuses = localized?.bonuses || plan.bonuses;
            const ctaText = localized?.ctaText || plan.ctaText;
            const whatsAppMessage = localized?.whatsAppMessage || plan.whatsAppMessage;

            return (
              <div
                key={plan.id}
                id={`pricing-card-${plan.id}`}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-3xl flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  isPopular
                    ? "bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border-2 border-blue-500/80 shadow-2xl shadow-blue-500/20 lg:-translate-y-2"
                    : "bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80"
                } p-6 sm:p-8`}
              >
                {/* Popular Highlight Badge */}
                {badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${
                      isPopular 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/30"
                        : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                    }`}>
                      {badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Title & Tagline */}
                  <div className="border-b border-zinc-800/80 pb-6 mb-6">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {name}
                      </h3>
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800/80">
                        {plan.id.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed mb-5">
                      {tagline}
                    </p>

                    {/* Price in Bangla TK (BDT) */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {plan.formattedTk}
                      </span>
                      <span className="text-xs font-semibold text-zinc-400 uppercase">
                        BDT (৳)
                      </span>
                      <span className="text-xs text-zinc-500 line-through ml-1">
                        {plan.regularPriceTk}
                      </span>
                    </div>

                    {/* Key Info Meta */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-3">
                      <div className="flex items-center gap-1.5 text-zinc-300 bg-zinc-800/50 px-2.5 py-1.5 rounded-lg border border-zinc-800">
                        <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{t.pricingDeliveryLabel} <strong>{turnaroundDays}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-300 bg-zinc-800/50 px-2.5 py-1.5 rounded-lg border border-zinc-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{t.pricingPaymentLabel} <strong>{paymentTerms}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Ideal For Target Box */}
                  <div className="mb-6 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs">
                    <span className="text-[11px] font-semibold text-zinc-400 block mb-0.5">
                      {t.pricingIdealForLabel}
                    </span>
                    <span className="text-zinc-200 font-medium">
                      {idealFor}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                      {t.pricingIncludedLabel}
                    </span>
                    <ul className="space-y-2.5">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                          <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${
                            isPopular ? "text-blue-400" : "text-emerald-400"
                          }`} />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bonus Extras */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 mb-6">
                    <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                      <Gift className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.pricingBonusesLabel}</span>
                    </div>
                    {bonuses.map((bonus, bIdx) => (
                      <div key={bIdx} className="text-[11px] text-amber-200/90 leading-relaxed flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                        <span>{bonus}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-2.5 pt-4 border-t border-zinc-800/80">
                  {/* Direct WhatsApp Order Link */}
                  <a
                    href={`https://wa.me/8801676056414?text=${encodeURIComponent(whatsAppMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`btn-pricing-whatsapp-${plan.id}`}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm group"
                  >
                    <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814 3.183 0 5.768-2.587 5.768-5.766 0-3.18-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.519-4.481 10-10 10-1.745 0-3.385-.45-4.814-1.239l-5.186 1.36 1.385-5.06c-.868-1.488-1.385-3.218-1.385-5.061 0-5.519 4.481-10 10-10s10 4.481 10 10z"/>
                    </svg>
                    <span>{t.pricingWhatsAppBook}</span>
                  </a>

                  {/* Select for Instant Project Inquiry */}
                  <button
                    type="button"
                    id={`btn-pricing-inquiry-${plan.id}`}
                    onClick={() => onSelectPlanForInquiry(plan)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isPopular
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 active:scale-95"
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                    }`}
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Scope / Calculator Banner */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white mb-1">
                {t.pricingCustomTitle}
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400">
                {t.pricingCustomSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-pricing-open-calc"
            onClick={onOpenQuoteCalculator}
            className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 whitespace-nowrap flex items-center gap-2 transition-colors shrink-0"
          >
            <span>{t.pricingOpenCalc}</span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* Accepted Bangladeshi Payment Methods Banner */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t.pricingPaymentTitle}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium">
              {t.pricingPaymentSubtitle}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {PAYMENT_METHODS.map((method, mIdx) => (
              <div 
                key={mIdx}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${method.color}`}
              >
                <div className="w-2 h-2 rounded-full bg-current shrink-0" />
                <span className="truncate text-[11px] font-semibold">{method.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
