import React, { useState } from "react";
import { 
  Calculator, 
  Check, 
  Clock, 
  Download, 
  ArrowRight, 
  Zap, 
  Code2, 
  PenTool, 
  Film, 
  Palette 
} from "lucide-react";
import { ServiceCategory } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface QuoteCalculatorProps {
  onApplyToInquiry: (config: {
    services: string[];
    tier: string;
    addons: string[];
    estimatedBudget: string;
    estimatedWeeks: string;
  }) => void;
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({
  onApplyToInquiry
}) => {
  const { t, language } = useLanguage();
  const [selectedServices, setSelectedServices] = useState<ServiceCategory[]>([
    "Web Development"
  ]);
  const [tier, setTier] = useState<"Starter" | "Growth" | "Scale">("Growth");
  const [timelineUrgency, setTimelineUrgency] = useState<"standard" | "rush">("standard");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    "seo-optimization",
    "bkash-nagad-gateway"
  ]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const availableServices = [
    { 
      id: "Web Development" as ServiceCategory, 
      label: language === "bn" ? "ওয়েব ডেভেলপমেন্ট" : language === "es" ? "Desarrollo Web" : "Web Development",
      basePrice: 18000, 
      icon: Code2 
    },
    { 
      id: "Content Creation" as ServiceCategory, 
      label: language === "bn" ? "কনটেন্ট ক্রিয়েশন" : language === "es" ? "Creación de Contenido" : "Content Creation",
      basePrice: 8500, 
      icon: PenTool 
    },
    { 
      id: "Video Editing" as ServiceCategory, 
      label: language === "bn" ? "ভিডিও এডিটিং ও রিলস" : language === "es" ? "Edición de Video" : "Video Editing",
      basePrice: 10000, 
      icon: Film 
    },
    { 
      id: "Graphic Design" as ServiceCategory, 
      label: language === "bn" ? "গ্রাফিক ডিজাইন ও ব্র্যান্ডিং" : language === "es" ? "Diseño Gráfico" : "Graphic Design",
      basePrice: 9500, 
      icon: Palette 
    },
  ];

  const addonsList = [
    { 
      id: "seo-optimization", 
      label: language === "bn" ? "গুগল ম্যাপস ও লোকাল এসইও (99+ SEO Audit)" : language === "es" ? "Optimización SEO Local y Google Maps" : "Google Maps & Local SEO Optimization (99+ Audit)", 
      price: 3500 
    },
    { 
      id: "bkash-nagad-gateway", 
      label: language === "bn" ? "বিকাশ ও নগদ অটোমেটিক পেমেন্ট গেটওয়ে সেটআপ" : language === "es" ? "Pasarelas de pago bKash y Nagad automatizadas" : "bKash & Nagad Automatic Payment Gateway Setup", 
      price: 4000 
    },
    { 
      id: "figma-brand-kit", 
      label: language === "bn" ? "কমপ্লিট ব্র্যান্ড আইডেন্টিটি ও Figma ভেক্টর কিট" : language === "es" ? "Kit de Identidad de Marca y Archivos Figma" : "Complete Brand Identity & Figma Vector Kit", 
      price: 5000 
    },
    { 
      id: "ai-automation-social", 
      label: language === "bn" ? "সোশ্যাল মিডিয়ার জন্য AI Automation Develop (অটো DM, কমেন্ট বট ও পোস্টিং)" : language === "es" ? "AI Automation Develop para redes sociales (Auto DM, bots y publicaciones)" : "AI Automation Develop for Any Social Media Services (Auto DMs, Comment Bots & Auto-Posting)", 
      price: 4500 
    },
    { 
      id: "4k-motion-reels", 
      label: language === "bn" ? "৫টি কাস্টম ভাইরাল ভিডিও রিলস ও সোশ্যাল অ্যাডস" : language === "es" ? "5 Reels de Video Viral y Anuncios Promocionales" : "5 Custom Viral Video Reels & Ad Creatives", 
      price: 6000 
    },
    { 
      id: "interactive-3d-webgl", 
      label: language === "bn" ? "ইন্টারেক্টিভ ৩D অ্যানিমেশন ও কাস্টম ফিচার্স" : language === "es" ? "Animaciones 3D / WebGL y Funcionalidades a Medida" : "Interactive 3D / WebGL Animations & Custom Features", 
      price: 8000 
    },
  ];

  const toggleService = (srv: ServiceCategory) => {
    if (selectedServices.includes(srv)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== srv));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(a => a !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  // Calculations in BDT (৳)
  const baseServiceTotal = selectedServices.reduce((sum, srv) => {
    const found = availableServices.find(s => s.id === srv);
    return sum + (found ? found.basePrice : 0);
  }, 0);

  const tierMultiplier = tier === "Starter" ? 0.9 : tier === "Growth" ? 1.35 : 2.1;
  const addonsTotal = selectedAddons.reduce((sum, aId) => {
    const found = addonsList.find(a => a.id === aId);
    return sum + (found ? found.price : 0);
  }, 0);

  const subtotal = (baseServiceTotal * tierMultiplier) + addonsTotal;
  const multiServiceDiscount = selectedServices.length > 1 ? subtotal * 0.12 : 0; // 12% bundle discount
  const urgencyFee = timelineUrgency === "rush" ? subtotal * 0.15 : 0;
  const finalEstimate = Math.round(subtotal - multiServiceDiscount + urgencyFee);

  // Time calculation
  let baseDays = selectedServices.length * (tier === "Starter" ? 4 : tier === "Growth" ? 7 : 12);
  if (selectedServices.length > 1) baseDays *= 0.8; // parallel sprint savings
  if (timelineUrgency === "rush") baseDays = Math.max(3, Math.round(baseDays * 0.6));
  
  const minDays = Math.max(3, Math.round(baseDays));
  const maxDays = Math.max(5, Math.round(baseDays + 4));
  const estimatedDaysStr = language === "bn" 
    ? `${minDays} - ${maxDays} দিন` 
    : language === "es" 
    ? `${minDays} - ${maxDays} Días` 
    : `${minDays} - ${maxDays} Days`;
  const estimatedBudgetStr = `৳ ${finalEstimate.toLocaleString("en-US")} BDT`;

  const handleExportJson = () => {
    const scopeData = {
      studio: "Creative Creator (Dhaka, Bangladesh)",
      whatsapp: "+8801676056414",
      generatedAt: new Date().toISOString(),
      currency: "BDT (Bangla Taka - ৳)",
      tier,
      services: selectedServices,
      addons: selectedAddons.map(id => addonsList.find(a => a.id === id)?.label),
      urgency: timelineUrgency,
      estimatedInvestment: estimatedBudgetStr,
      estimatedTimeline: estimatedDaysStr,
      deliverablesIncluded: [
        "100% Production source code & design files",
        "bKash/Nagad payment & WhatsApp direct chat integration",
        "Live cloud hosting deployment assistance",
        "Technical maintenance warranty"
      ]
    };

    const blob = new Blob([JSON.stringify(scopeData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creative-creator-quote-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <section id="calculator" className="py-24 relative border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.calcBadge} (BDT / ৳)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {t.calcTitle}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {t.calcSubtitle}
          </p>
        </div>

        {/* Interactive Calculator Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
            {/* Step 1: Select Services */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  {t.calcSelectDisciplines}
                </label>
                {selectedServices.length > 1 && (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {language === "bn" ? "১২% বান্ডল ডিসকাউন্ট অ্যাপ্লাইড" : "12% Multi-Service Bundle Discount Applied"}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableServices.map((srv) => {
                  const Icon = srv.icon;
                  const isChecked = selectedServices.includes(srv.id);
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      id={`calc-service-${srv.id.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => toggleService(srv.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-blue-600/10 border-blue-500 text-white ring-1 ring-blue-500/30"
                          : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isChecked ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{srv.label}</div>
                          <div className="text-[11px] text-zinc-400">
                            {language === "bn" ? `বেস: ৳${srv.basePrice.toLocaleString()}` : `Base: ৳${srv.basePrice.toLocaleString()} BDT`}
                          </div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isChecked ? "bg-blue-600 border-blue-500 text-white" : "border-zinc-700 bg-zinc-900"}`}>
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Project Scale Tier */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-3">
                {t.calcSelectComplexity}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { 
                    id: "Starter", 
                    label: "Starter", 
                    sub: language === "bn" ? "মৌলিক ফিচার ও দ্রুত লঞ্চ" : language === "es" ? "Funciones esenciales" : "Essential Scope" 
                  },
                  { 
                    id: "Growth", 
                    label: "Growth", 
                    sub: language === "bn" ? "সম্পূর্ণ ফিচার ও অ্যানিমেশন" : language === "es" ? "Alcance comercial completo" : "Full Business Suite" 
                  },
                  { 
                    id: "Scale", 
                    label: "Scale", 
                    sub: language === "bn" ? "কাস্টম পোর্টাল ও ফুল স্টুডিও" : language === "es" ? "Solución a medida y full studio" : "Custom Enterprise" 
                  }
                ].map((tierItem) => {
                  const isSelected = tier === tierItem.id;
                  return (
                    <button
                      key={tierItem.id}
                      type="button"
                      id={`calc-tier-${tierItem.id.toLowerCase()}`}
                      onClick={() => setTier(tierItem.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-zinc-800 border-white/40 ring-1 ring-white/20 text-white"
                          : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40"
                      }`}
                    >
                      <div className="text-xs font-bold text-white mb-0.5">{tierItem.label}</div>
                      <div className="text-[10px] text-zinc-500 line-clamp-1">{tierItem.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Add-on Capabilities */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-3">
                {t.calcSelectAddons}
              </label>
              <div className="space-y-2">
                {addonsList.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      id={`calc-addon-${addon.id}`}
                      onClick={() => toggleAddon(addon.id)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-zinc-800/90 border-emerald-500/50 text-white"
                          : "bg-zinc-950/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? "bg-emerald-500 border-emerald-400 text-zinc-950" : "border-zinc-700 bg-zinc-900"}`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium text-zinc-200">{addon.label}</span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-semibold">
                        +৳{addon.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Urgency timeline */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-3">
                {language === "bn" ? "৪. ডেলিভারির গতি (Delivery Speed)" : "4. Delivery Speed & Urgency"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="calc-urgency-standard"
                  onClick={() => setTimelineUrgency("standard")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    timelineUrgency === "standard"
                      ? "bg-zinc-800 border-zinc-600 text-white"
                      : "bg-zinc-950/60 border-zinc-800 text-zinc-400"
                  }`}
                >
                  <div className="text-xs font-bold text-white">
                    {language === "bn" ? "স্ট্যান্ডার্ড গতি" : "Standard Timeline"}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {language === "bn" ? "ধাপে ধাপে কোয়ালিটি রিভিউ ও রিভিশন" : "Iterative milestones & collaborative reviews"}
                  </div>
                </button>

                <button
                  type="button"
                  id="calc-urgency-rush"
                  onClick={() => setTimelineUrgency("rush")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    timelineUrgency === "rush"
                      ? "bg-amber-950/30 border-amber-500/60 text-amber-200"
                      : "bg-zinc-950/60 border-zinc-800 text-zinc-400"
                  }`}
                >
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{language === "bn" ? "সুপার-ফাস্ট রাশ স্প্রিন্ট (+১৫%)" : "Fast-Track Sprint (+15%)"}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {language === "bn" ? "জরুরি অগ্রাধিকার ভিত্তিক দ্রুত ডেলিভারি" : "Priority overtime sprint & accelerated launch"}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Summary Card */}
          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {language === "bn" ? "বাজেট সারসংক্ষেপ" : "Scope & Investment Summary"}
              </span>
              <span className="text-xs font-medium text-blue-400">
                Tier: {tier}
              </span>
            </div>

            {/* Price & Timeline Display */}
            <div className="space-y-4">
              <div>
                <span className="text-xs text-zinc-400 uppercase font-semibold">
                  {t.calcEstimatedTotal}
                </span>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 flex items-baseline gap-2">
                  <span className="text-emerald-400">{estimatedBudgetStr}</span>
                </div>
                <span className="text-[11px] text-zinc-500 block mt-1">
                  {language === "bn" ? "* বিকাশ, নগদ বা ব্যাংকে কিস্তিতে পেমেন্ট সুবিধা" : "* Flexible installment options via bKash, Nagad or Bank"}
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-300">
                  {t.calcEstimatedSprint}: <strong className="text-white">{estimatedDaysStr}</strong>
                </span>
              </div>
            </div>

            {/* Scope Included Breakdown */}
            <div className="space-y-2 text-xs text-zinc-400 border-t border-zinc-800 pt-4">
              <div className="font-semibold text-zinc-300 mb-1">
                {language === "bn" ? "যা যা অন্তর্ভুক্ত থাকবে:" : "Standard Inclusions:"}
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedServices.join(" + ")} production</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedAddons.length} {language === "bn" ? "টি অতিরিক্ত ফিচার" : "Strategic add-on capabilities"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === "bn" ? "মোবাইল রেসপনসিভ ও WhatsApp সাপোর্ট" : "Mobile-first responsive UX & WhatsApp direct support"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === "bn" ? "১০০% সোর্স কোড ও কপিরাইট ওনারশিপ" : "100% Source code, design files & copyright transfer"}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href="#contact"
                id="btn-apply-quote-to-inquiry"
                onClick={() => onApplyToInquiry({
                  services: selectedServices,
                  tier,
                  addons: selectedAddons,
                  estimatedBudget: estimatedBudgetStr,
                  estimatedWeeks: estimatedDaysStr
                })}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>{t.calcApplyToInquiry}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/8801676056414?text=${encodeURIComponent(`Hello Creative Creator! I calculated a project quote: ${selectedServices.join(", ")} (${tier} Tier, Estimated Budget: ${estimatedBudgetStr}, Timeline: ${estimatedDaysStr}). I would like to discuss next steps.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-calculator-whatsapp"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814 3.183 0 5.768-2.587 5.768-5.766 0-3.18-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.519-4.481 10-10 10-1.745 0-3.385-.45-4.814-1.239l-5.186 1.36 1.385-5.06c-.868-1.488-1.385-3.218-1.385-5.061 0-5.519 4.481-10 10-10s10 4.481 10 10z"/>
                </svg>
                <span>{language === "bn" ? "হোয়াটসঅ্যাপে তাৎক্ষণিক আলোচনা" : "Direct WhatsApp Discussion"}</span>
              </a>

              <button
                type="button"
                id="btn-download-quote-json"
                onClick={handleExportJson}
                className="w-full py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-[11px] font-medium border border-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3 h-3 text-zinc-400" />
                <span>
                  {downloadSuccess 
                    ? (language === "bn" ? "ডকুমেন্ট ডাউনলোড সম্পন্ন!" : "Quote Exported Successfully!") 
                    : (language === "bn" ? "কোট ডকুমেন্ট (.JSON) ডাউনলোড" : "Export Scope Document (.JSON)")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
