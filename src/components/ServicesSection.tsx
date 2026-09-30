import React, { useState } from "react";
import { 
  Code2, 
  PenTool, 
  Film, 
  Palette, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  Bot,
  Zap
} from "lucide-react";
import { SERVICE_PILLARS } from "../data/servicesData";
import { ServiceCategory, ServicePillar } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface ServicesSectionProps {
  onSelectServiceForInquiry: (category: ServiceCategory) => void;
  onOpenQuoteCalculator: () => void;
  services?: ServicePillar[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceForInquiry,
  onOpenQuoteCalculator,
  services = SERVICE_PILLARS
}) => {
  const { t, language } = useLanguage();
  const [activeServiceId, setActiveServiceId] = useState<string>("serv-web-dev");

  const currentService = services.find(s => s.id === activeServiceId) || services[0] || SERVICE_PILLARS[0];

  const getLocalizedService = (service: typeof currentService) => {
    if (language === "bn" && service.bn) {
      return {
        title: service.banglaTitle || service.title,
        tagline: service.bn.tagline || service.tagline,
        description: service.bn.description || service.description,
        turnaroundTime: service.bn.turnaroundTime || service.turnaroundTime,
        highlightMetric: service.bn.highlightMetric || service.highlightMetric,
        keyFeatures: service.bn.keyFeatures || service.keyFeatures,
        deliverables: service.bn.deliverables || service.deliverables,
        startingPrice: service.startingPrice,
        techStack: service.techStack
      };
    }
    if (language === "es" && service.es) {
      return {
        title: service.title,
        tagline: service.es.tagline || service.tagline,
        description: service.es.description || service.description,
        turnaroundTime: service.es.turnaroundTime || service.turnaroundTime,
        highlightMetric: service.es.highlightMetric || service.highlightMetric,
        keyFeatures: service.es.keyFeatures || service.keyFeatures,
        deliverables: service.es.deliverables || service.deliverables,
        startingPrice: service.startingPrice,
        techStack: service.techStack
      };
    }
    return {
      title: service.title,
      tagline: service.tagline,
      description: service.description,
      turnaroundTime: service.turnaroundTime,
      highlightMetric: service.highlightMetric,
      keyFeatures: service.keyFeatures,
      deliverables: service.deliverables,
      startingPrice: service.startingPrice,
      techStack: service.techStack
    };
  };

  const localizedActive = getLocalizedService(currentService);

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

        {/* Feature Highlight: AI Automation Develop for Any Social Media Services */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-zinc-900 border border-blue-500/30 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl shadow-blue-950/20">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  AI Automation Develop
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  For Any Social Media Services
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                We design and implement custom <strong>AI automation develop</strong> workflows for any social media platform—including Facebook, Instagram, WhatsApp, YouTube, TikTok & LinkedIn. Scale 24/7 lead intake, smart Auto-DMs, comment-to-order funnels, and automated content scheduling.
              </p>
            </div>
          </div>
          <a
            href="#contact"
            id="btn-services-ai-automation-inquire"
            onClick={() => onSelectServiceForInquiry("Content Creation")}
            className="shrink-0 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-600/30 active:scale-95"
          >
            <span>Inquire AI Automation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4 Pillars Nav Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {services.map((service) => {
            const Icon = getIcon(service.iconName);
            const isSelected = activeServiceId === service.id;
            const tabTitle = language === "bn" && service.banglaTitle ? service.banglaTitle : service.title;
            const isSocialMedia = service.id !== "serv-web-dev";
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
                  {tabTitle}
                </div>
                <div className="text-xs text-zinc-400 line-clamp-1 mb-2">
                  {t.servicesStartingAt} {service.startingPrice}
                </div>
                {isSocialMedia && (
                  <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                    <span>AI Automation</span>
                  </div>
                )}
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
                  <span>{t.servicesTurnaround}: {localizedActive.turnaroundTime}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                  {localizedActive.tagline}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {localizedActive.description}
                </p>
              </div>

              {/* Key Features List */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                  {t.servicesKeyFeatures}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {localizedActive.keyFeatures.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Automation Develop for Social Media Services Showcase */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-indigo-950/30 to-purple-950/30 border border-blue-500/30 shadow-lg shadow-blue-950/20">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                        AI Automation Develop
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Available for Any Social Media Services
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                      We engineer custom AI automation develop systems for <strong>Facebook, Instagram, WhatsApp, YouTube, TikTok & LinkedIn</strong> to eliminate repetitive manual work:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-300">
                      <div className="flex items-center gap-1.5 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>24/7 Smart Auto-DM & Chatbots</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Instant Comment-to-Lead Funnels</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Multi-Platform Auto Scheduling</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>AI Video & Banner Batch Creation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deliverables */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
                  {t.servicesDeliverables}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {localizedActive.deliverables.map((deliv, idx) => (
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
                  {localizedActive.highlightMetric}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="flex items-baseline justify-between border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-medium">Standard Investment</span>
                  <div className="text-3xl font-extrabold text-white mt-0.5">
                    {localizedActive.startingPrice}
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
                  {localizedActive.techStack.map((tech, idx) => (
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
                  <span>{t.servicesInquireNow}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  id="btn-service-calc-quote"
                  onClick={onOpenQuoteCalculator}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
                >
                  {t.servicesCalculateQuote}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
