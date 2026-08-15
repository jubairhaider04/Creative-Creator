import React, { useState } from "react";
import { 
  Code2, 
  PenTool, 
  Film, 
  Palette, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Layers, 
  ChevronRight 
} from "lucide-react";
import { SERVICE_PILLARS } from "../data/servicesData";
import { ServiceCategory } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface ServicesSectionProps {
  onSelectServiceForInquiry: (category: ServiceCategory) => void;
  onOpenQuoteCalculator: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForInquiry,
  onOpenQuoteCalculator
}) => {
  const { t } = useLanguage();
  const [activeServiceId, setActiveServiceId] = useState<string>("serv-web-dev");

  const currentService = SERVICE_PILLARS.find(s => s.id === activeServiceId) || SERVICE_PILLARS[0];

  const getIcon = (name: string) => {
    switch (name) {
      case "Code2": return Code2;
      case "PenTool": return PenTool;
      case "Film": return Film;
      case "Palette": return Palette;
      default: return Layers;
    }
  };

  const getAccentBg = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "emerald": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "purple": return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "amber": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default: return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <section id="services" className="py-24 relative border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.navServices}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {t.servicesTitle} <br />
              <span className="text-zinc-400">{t.servicesSubtitle}</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              id="btn-services-open-calculator"
              onClick={onOpenQuoteCalculator}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 transition-colors"
            >
              <span>{t.servicesCalculateQuote}</span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* 4 Pillars Nav Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {SERVICE_PILLARS.map((service) => {
            const Icon = getIcon(service.iconName);
            const isSelected = activeServiceId === service.id;
            return (
              <button
                key={service.id}
                type="button"
                id={`btn-service-select-${service.id}`}
                onClick={() => setActiveServiceId(service.id)}
                className={`p-5 rounded-2xl text-left border transition-all relative ${
                  isSelected
                    ? "bg-zinc-900 border-zinc-700 shadow-xl shadow-black/50 ring-1 ring-white/10"
                    : "bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900/50 hover:border-zinc-700/80"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${getAccentBg(service.accentColor)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-base text-white mb-1">
                  {service.title}
                </div>
                <div className="text-xs text-zinc-400 line-clamp-1">
                  Starting {service.startingPrice}
                </div>
                {isSelected && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Service Deep Dive Panel */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Overview & Features */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border bg-zinc-950/80 text-zinc-300 border-zinc-800">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Standard Sprint: {currentService.turnaroundTime}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                  {currentService.tagline}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {currentService.description}
                </p>
              </div>

              {/* Key Features List */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                  Execution Highlights & Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentService.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
                  Standard Scope Deliverables
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentService.deliverables.map((deliv, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800/70 border border-zinc-700/60 text-xs font-medium text-zinc-200"
                    >
                      {deliv}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Pricing, Tech Stack & Action Box */}
            <div className="lg:col-span-5 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 space-y-6">
              {/* Highlight Metric */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/30 to-zinc-900 border border-blue-500/20">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Performance Benchmark</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {currentService.highlightMetric}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="flex items-baseline justify-between border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-medium">Standard Investment</span>
                  <div className="text-3xl font-extrabold text-white mt-0.5">
                    {currentService.startingPrice}
                  </div>
                </div>
                <span className="text-xs text-zinc-500">Tier-based / Fixed Sprint</span>
              </div>

              {/* Tech Stack */}
              <div>
                <span className="text-xs text-zinc-400 uppercase font-semibold tracking-wider block mb-2.5">
                  Production Toolchain & Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentService.techStack.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <a
                  href="#contact"
                  id={`btn-inquire-service-${currentService.id}`}
                  onClick={() => onSelectServiceForInquiry(currentService.title)}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                >
                  <span>Inquire for {currentService.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  id="btn-service-calc-quote"
                  onClick={onOpenQuoteCalculator}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
                >
                  Configure Custom Add-ons
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
