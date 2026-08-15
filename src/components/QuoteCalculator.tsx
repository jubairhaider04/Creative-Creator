import React, { useState } from "react";
import { 
  Calculator, 
  Check, 
  Sparkles, 
  Clock, 
  DollarSign, 
  Download, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  Code2,
  PenTool,
  Film,
  Palette
} from "lucide-react";
import { ServiceCategory } from "../types";

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
  const [selectedServices, setSelectedServices] = useState<ServiceCategory[]>([
    "Web Development"
  ]);
  const [tier, setTier] = useState<"Starter" | "Growth" | "Enterprise">("Growth");
  const [timelineUrgency, setTimelineUrgency] = useState<"standard" | "rush">("standard");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    "seo-optimization",
    "figma-design-tokens"
  ]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const availableServices = [
    { id: "Web Development" as ServiceCategory, label: "Web Development", basePrice: 4500, icon: Code2 },
    { id: "Content Creation" as ServiceCategory, label: "Content Creation", basePrice: 2800, icon: PenTool },
    { id: "Video Editing" as ServiceCategory, label: "Video Editing", basePrice: 3200, icon: Film },
    { id: "Graphic Design" as ServiceCategory, label: "Graphic Design", basePrice: 3500, icon: Palette },
  ];

  const addonsList = [
    { id: "seo-optimization", label: "Core Web Vitals & 99+ SEO Audit", price: 900, timeDays: 3 },
    { id: "figma-design-tokens", label: "Tokenized Figma Design System (400+ comps)", price: 1500, timeDays: 5 },
    { id: "4k-motion-assets", label: "4K Kinetic Motion & Video Cutdowns Suite", price: 1800, timeDays: 4 },
    { id: "interactive-3d-webgl", label: "Interactive 3D / WebGL Canvas Scene", price: 2400, timeDays: 6 },
    { id: "investor-pitch-deck", label: "Series A/B Investor Pitch Deck Master", price: 1200, timeDays: 3 },
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

  // Calculations
  const baseServiceTotal = selectedServices.reduce((sum, srv) => {
    const found = availableServices.find(s => s.id === srv);
    return sum + (found ? found.basePrice : 0);
  }, 0);

  const tierMultiplier = tier === "Starter" ? 1.0 : tier === "Growth" ? 1.45 : 2.2;
  const addonsTotal = selectedAddons.reduce((sum, aId) => {
    const found = addonsList.find(a => a.id === aId);
    return sum + (found ? found.price : 0);
  }, 0);

  const subtotal = (baseServiceTotal * tierMultiplier) + addonsTotal;
  const multiServiceDiscount = selectedServices.length > 1 ? subtotal * 0.12 : 0; // 12% bundle discount
  const urgencyFee = timelineUrgency === "rush" ? subtotal * 0.20 : 0;
  const finalEstimate = Math.round(subtotal - multiServiceDiscount + urgencyFee);

  // Time calculation
  let baseWeeks = selectedServices.length * (tier === "Starter" ? 1.5 : tier === "Growth" ? 2.5 : 4);
  if (selectedServices.length > 1) baseWeeks *= 0.75; // parallel sprint savings
  if (timelineUrgency === "rush") baseWeeks = Math.max(1, Math.round(baseWeeks * 0.6));
  const estimatedWeeksStr = `${Math.max(1, Math.round(baseWeeks))} - ${Math.max(2, Math.round(baseWeeks + 1.5))} Weeks`;
  const estimatedBudgetStr = `$${finalEstimate.toLocaleString()}`;

  const handleExportJson = () => {
    const scopeData = {
      studio: "Creative Creator",
      generatedAt: new Date().toISOString(),
      tier,
      services: selectedServices,
      addons: selectedAddons.map(id => addonsList.find(a => a.id === id)?.label),
      urgency: timelineUrgency,
      estimatedInvestment: estimatedBudgetStr,
      estimatedTimeline: estimatedWeeksStr,
      deliverablesIncluded: [
        "100% Production Code & Design Source Files",
        "Dedicated Lead Architect & Creative Director",
        "Weekly Milestone Sprint Reviews",
        "90-Day Post-Launch Warranty"
      ]
    };

    const blob = new Blob([JSON.stringify(scopeData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creative-creator-scope-estimate-${Date.now()}.json`;
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
            <span>Transparent Investment Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Build Your Custom <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-300">
              Project Scope & Timeline.
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Select your required disciplines and custom add-ons to calculate instant transparent agency pricing, delivery windows, and bundle discounts.
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
                  1. Select Service Disciplines
                </label>
                {selectedServices.length > 1 && (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    12% Multi-Service Bundle Discount Applied
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
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-zinc-800 border-blue-500/60 ring-1 ring-blue-500/40 text-white"
                          : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${isChecked ? "bg-blue-600 text-white" : "bg-zinc-900 text-zinc-400"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{srv.label}</div>
                          <div className="text-[10px] text-zinc-500">From ${srv.basePrice.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isChecked ? "bg-blue-600 border-blue-500 text-white" : "border-zinc-700 bg-zinc-900"}`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Project Scale Tier */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-3">
                2. Project Scale & Complexity Tier
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "Starter", label: "MVP / Foundation", sub: "Core features & clean launch" },
                  { id: "Growth", label: "Scale / High-Impact", sub: "Full feature suite & animations" },
                  { id: "Enterprise", label: "Signature Luxury", sub: "Custom 3D, WebGL & bespoke assets" }
                ].map((t) => {
                  const isSelected = tier === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      id={`calc-tier-${t.id.toLowerCase()}`}
                      onClick={() => setTier(t.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-zinc-800 border-white/40 ring-1 ring-white/20 text-white"
                          : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40"
                      }`}
                    >
                      <div className="text-xs font-bold text-white mb-0.5">{t.label}</div>
                      <div className="text-[10px] text-zinc-500 line-clamp-1">{t.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Add-on Capabilities */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-3">
                3. High-Leverage Add-ons & Integrations
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
                        +${addon.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Urgency timeline */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-3">
                4. Delivery Sprint Pace
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
                  <div className="text-xs font-bold text-white">Standard Delivery Pace</div>
                  <div className="text-[10px] text-zinc-500">Carefully staged weekly milestone reviews</div>
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
                    <span>Priority Rush Sprint (+20%)</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">Accelerated delivery with dedicated weekend hours</div>
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Summary Card */}
          <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Scope Summary
              </span>
              <span className="text-xs font-medium text-blue-400">
                Tier: {tier}
              </span>
            </div>

            {/* Price & Timeline Display */}
            <div className="space-y-4">
              <div>
                <span className="text-xs text-zinc-400 uppercase font-semibold">Estimated Agency Investment</span>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 flex items-baseline gap-2">
                  <span>{estimatedBudgetStr}</span>
                  <span className="text-xs text-zinc-500 font-normal">USD</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-300">
                  Estimated Sprint Window: <strong className="text-white">{estimatedWeeksStr}</strong>
                </span>
              </div>
            </div>

            {/* Scope Included Breakdown */}
            <div className="space-y-2 text-xs text-zinc-400 border-t border-zinc-800 pt-4">
              <div className="font-semibold text-zinc-300 mb-1">Included in this Estimate:</div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedServices.join(" + ")} Full Production</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedAddons.length} Selected High-Leverage Add-ons</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dedicated Principal Creative Director Oversight</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Commercial Source IP Handover</span>
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
                  estimatedWeeks: estimatedWeeksStr
                })}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Proceed to Inquiry with this Scope</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                id="btn-download-quote-json"
                onClick={handleExportJson}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>{downloadSuccess ? "Scope Downloaded!" : "Export Scope Document (.JSON)"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
