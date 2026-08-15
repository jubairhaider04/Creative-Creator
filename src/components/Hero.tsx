import React, { useState } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Code2, 
  PenTool, 
  Film, 
  Palette, 
  Calculator, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  Star,
  ShieldCheck,
  Play
} from "lucide-react";
import { ServiceCategory } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface HeroProps {
  onOpenAiConsultant: () => void;
  onOpenQuoteCalculator: () => void;
  onSelectCategory: (category: ServiceCategory) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAiConsultant,
  onOpenQuoteCalculator,
  onSelectCategory
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ServiceCategory>("Web Development");

  const services = [
    {
      id: "Web Development" as ServiceCategory,
      icon: Code2,
      label: t.servicesWebDev,
      accent: "text-blue-400 border-blue-500/30 bg-blue-500/10",
      description: "Next-gen React & WebGL full-stack apps with sub-second latency.",
      stat: "99+ Lighthouse"
    },
    {
      id: "Content Creation" as ServiceCategory,
      icon: PenTool,
      label: t.servicesContentCreation,
      accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      description: "Viral narratives, high-intent SEO essays, and executive ghostwriting.",
      stat: "4.5x Reach"
    },
    {
      id: "Video Editing" as ServiceCategory,
      icon: Film,
      label: t.servicesVideoEditing,
      accent: "text-purple-400 border-purple-500/30 bg-purple-500/10",
      description: "Cinematic color grading, 4K motion graphics & high-retention shorts.",
      stat: "85%+ Retention"
    },
    {
      id: "Graphic Design" as ServiceCategory,
      icon: Palette,
      label: t.servicesGraphicDesign,
      accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      description: "3D brand identity, tokenized Figma systems & luxury packaging.",
      stat: "100% Tokenized"
    },
  ];

  return (
    <section 
      id="hero"
      className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden"
    >
      {/* Background ambient lighting and subtle grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-emerald-600/10 blur-[130px] rounded-full" />
        <div className="absolute -top-40 right-10 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: "28px 28px"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        {/* Top pill badge */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 backdrop-blur-md shadow-lg shadow-black/20">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-zinc-300">
              {t.heroBadge}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-blue-400 font-semibold">
              4-in-1 Digital Studio
            </span>
          </div>
        </div>

        {/* Main Display Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
            {t.heroHeadline1}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              {t.heroHeadlineHighlight}
            </span>{" "}
            {t.heroHeadline2}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            {t.heroSubtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
            <a
              href="#showcase"
              id="hero-cta-showcase"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-600/25"
            >
              <span>{t.heroExploreShowcase}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              id="hero-cta-quote-calc"
              onClick={onOpenQuoteCalculator}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 hover:text-white border border-zinc-800 active:scale-95 transition-all"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>{t.heroQuoteBuilder}</span>
            </button>

            <button
              type="button"
              id="hero-cta-ai-advisor"
              onClick={onOpenAiConsultant}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.heroAiAdvisor}</span>
            </button>
          </div>
        </div>

        {/* 4 Pillars Interactive Switcher */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {services.map((s) => {
              const Icon = s.icon;
              const isSelected = activeTab === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  id={`hero-service-tab-${s.id.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => {
                    setActiveTab(s.id);
                    onSelectCategory(s.id);
                  }}
                  className={`p-4 rounded-xl text-left border transition-all relative overflow-hidden ${
                    isSelected
                      ? "bg-zinc-900/90 border-zinc-700 shadow-xl shadow-black/40 ring-1 ring-blue-500/40"
                      : "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/70 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`p-2 rounded-lg border ${s.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded">
                      {s.stat}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-white mb-1">
                    {s.label}
                  </h2>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-emerald-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick jump to selected category showcase */}
          <div className="flex items-center justify-between px-5 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Active Focus: <strong className="text-zinc-200">{activeTab}</strong></span>
            </div>
            <a
              href="#showcase"
              onClick={() => onSelectCategory(activeTab)}
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 group"
            >
              <span>View {activeTab} Case Studies</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
              120+
            </div>
            <div className="text-xs text-zinc-400 font-medium">
              High-Impact Deliverables
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight mb-1">
              99.4%
            </div>
            <div className="text-xs text-zinc-400 font-medium">
              Client Satisfaction Rating
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 tracking-tight mb-1">
              ৳ ৫০ কোটি+
            </div>
            <div className="text-xs text-zinc-400 font-medium">
              Client Revenue & Pipeline Growth (BDT)
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 tracking-tight mb-1">
              &lt; 0.8s
            </div>
            <div className="text-xs text-zinc-400 font-medium">
              Average Web & Asset Delivery Speed
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
