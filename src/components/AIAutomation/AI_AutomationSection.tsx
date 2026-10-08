import React, { useState } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Bot, 
  MessageSquare, 
  Play, 
  RotateCcw, 
  Check, 
  Zap, 
  Layers, 
  ShieldCheck,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";
import { AI_AUTOMATION_CONFIG, SocialPlatform } from "../../data/aiAutomationData";
import { AIChatPhone } from "./AIChatPhone";
import { AIEngine } from "./AIEngine";
import { SocialPlatformIcon } from "./SocialPlatformIcon";
import { AutomationBenefitCard } from "./AutomationBenefitCard";
import { AutomationStats } from "./AutomationStats";
import { AutomationCTA } from "./AutomationCTA";
import { AIInquiryFormModal } from "./AIInquiryFormModal";

interface AI_AutomationSectionProps {
  onOpenInquiryModal?: () => void;
  className?: string;
}

export const AI_AutomationSection: React.FC<AI_AutomationSectionProps> = ({
  onOpenInquiryModal,
  className = ""
}) => {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | undefined>(undefined);
  const [mobilePhoneTab, setMobilePhoneTab] = useState<"with_ai" | "without_ai" | "both">("both");

  const handleOpenInquiry = (platform?: string) => {
    if (platform) setSelectedPlatform(platform);
    if (onOpenInquiryModal) {
      onOpenInquiryModal();
    } else {
      setIsInquiryModalOpen(true);
    }
  };

  const handleScrollToVisual = () => {
    const el = document.getElementById("ai-automation-visual");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="ai-automation"
      aria-label="Bongio Digital AI Customer Automation"
      className={`relative py-24 sm:py-32 bg-zinc-950 text-zinc-100 overflow-hidden border-t border-zinc-900 ${className}`}
    >
      {/* Background Ambient Glows & Tech Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-cyan-600/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Subtle Matrix / Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24 sm:space-y-32">
        
        {/* ======================================================== */}
        {/* 1. SECTION HEADER & MAIN HEADLINE                       */}
        {/* ======================================================== */}
        <header className="space-y-6 text-center max-w-4xl mx-auto">
          {/* Section Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-bold uppercase tracking-widest shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>{AI_AUTOMATION_CONFIG.badge}</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              {AI_AUTOMATION_CONFIG.title}
            </h2>
            <p className="text-base sm:text-xl lg:text-2xl font-light text-cyan-300/90 font-mono tracking-tight">
              {AI_AUTOMATION_CONFIG.alternativeTitle}
            </p>
          </div>

          {/* Detailed Narrative Description */}
          <p className="text-sm sm:text-base lg:text-lg text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed">
            {AI_AUTOMATION_CONFIG.description}
          </p>

          {/* Primary CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => handleOpenInquiry()}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
            >
              <span>{AI_AUTOMATION_CONFIG.ctaPrimary}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleScrollToVisual}
              className="px-6 py-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-semibold text-xs tracking-wide flex items-center gap-2 transition-colors"
            >
              <span>{AI_AUTOMATION_CONFIG.ctaSecondary}</span>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </header>

        {/* ======================================================== */}
        {/* 2. CORE VISUAL: 2 SMARTPHONE MOCKUPS + CENTRAL AI ENGINE */}
        {/* ======================================================== */}
        <div id="ai-automation-visual" className="relative scroll-mt-24">
          
          {/* Top Visual Concept Ribbon */}
          <div className="text-center mb-10 space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-[0.2em] text-cyan-400 block">
              {AI_AUTOMATION_CONFIG.conceptHeadline}
            </span>
            <p className="text-xs text-zinc-500 font-sans">
              Compare customer experience and business conversion in real time
            </p>

            {/* Mobile Tab Switcher */}
            <div className="flex sm:hidden items-center justify-center gap-1.5 pt-3">
              <button
                type="button"
                onClick={() => setMobilePhoneTab("both")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  mobilePhoneTab === "both"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-zinc-900 text-zinc-400"
                }`}
              >
                Both Phones
              </button>
              <button
                type="button"
                onClick={() => setMobilePhoneTab("without_ai")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  mobilePhoneTab === "without_ai"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-zinc-900 text-zinc-400"
                }`}
              >
                Without AI
              </button>
              <button
                type="button"
                onClick={() => setMobilePhoneTab("with_ai")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  mobilePhoneTab === "with_ai"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-zinc-900 text-zinc-400"
                }`}
              >
                With AI
              </button>
            </div>
          </div>

          {/* Central AI Composition Canvas */}
          <div className="relative rounded-[40px] sm:rounded-[48px] bg-gradient-to-b from-zinc-900/40 via-zinc-950/80 to-zinc-950 border border-zinc-800/80 p-4 sm:p-8 lg:p-12 shadow-2xl backdrop-blur-xl overflow-hidden">
            
            {/* Animated Connection Lines (Subtle SVG Overlay) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block opacity-30"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path
                d="M 280 320 Q 480 260 600 320"
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <path
                d="M 600 320 Q 720 380 920 320"
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center relative z-10">
              
              {/* Phone 1: WITHOUT AI */}
              {(mobilePhoneTab === "both" || mobilePhoneTab === "without_ai") && (
                <div className="lg:col-span-5 flex justify-center">
                  <AIChatPhone
                    mode="without_ai"
                    statusLabel={AI_AUTOMATION_CONFIG.withoutAiPhone.statusLabel}
                    bottomTagline={AI_AUTOMATION_CONFIG.withoutAiPhone.bottomTagline}
                    clientName={AI_AUTOMATION_CONFIG.withoutAiPhone.clientName}
                    lastSeen={AI_AUTOMATION_CONFIG.withoutAiPhone.lastSeen}
                    messages={AI_AUTOMATION_CONFIG.withoutAiPhone.messages}
                  />
                </div>
              )}

              {/* Central AI Engine Hub */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center py-4">
                <AIEngine platforms={AI_AUTOMATION_CONFIG.platforms} />
              </div>

              {/* Phone 2: WITH AI AUTOMATION */}
              {(mobilePhoneTab === "both" || mobilePhoneTab === "with_ai") && (
                <div className="lg:col-span-5 flex justify-center">
                  <AIChatPhone
                    mode="with_ai"
                    statusLabel={AI_AUTOMATION_CONFIG.withAiPhone.statusLabel}
                    bottomTagline={AI_AUTOMATION_CONFIG.withAiPhone.bottomTagline}
                    clientName={AI_AUTOMATION_CONFIG.withAiPhone.clientName}
                    statusBadge={AI_AUTOMATION_CONFIG.withAiPhone.statusBadge}
                    speedIndicator={AI_AUTOMATION_CONFIG.withAiPhone.speedIndicator}
                    messages={AI_AUTOMATION_CONFIG.withAiPhone.messages}
                  />
                </div>
              )}

            </div>

            {/* Floating Platform Icons Tray for Small Screens */}
            <div className="mt-8 pt-6 border-t border-zinc-800/80 flex sm:hidden flex-wrap items-center justify-center gap-3">
              {AI_AUTOMATION_CONFIG.platforms.map((p) => (
                <SocialPlatformIcon key={p.id} platform={p} size="sm" showLabel />
              ))}
            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. PLATFORM BADGES AREA                                  */}
        {/* ======================================================== */}
        <div className="space-y-6 text-center max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm font-mono text-zinc-400 uppercase tracking-wider">
            Automate conversations across the platforms your customers already use
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {AI_AUTOMATION_CONFIG.platforms.map((plat) => (
              <button
                key={plat.id}
                type="button"
                onClick={() => handleOpenInquiry(plat.name)}
                className="group p-3 sm:px-5 sm:py-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex items-center gap-3 backdrop-blur-md hover:scale-105 active:scale-95 shadow-md"
              >
                <SocialPlatformIcon platform={plat} size="sm" />
                <div className="text-left">
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors block">
                    {plat.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {plat.activeUsersLabel}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. STATISTICS STRIP                                      */}
        {/* ======================================================== */}
        <AutomationStats stats={AI_AUTOMATION_CONFIG.stats} />

        {/* ======================================================== */}
        {/* 5. KEY BENEFITS (4–6 GRID CARDS)                         */}
        {/* ======================================================== */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase font-bold tracking-widest text-blue-400">
              ENGINEERED FOR MODERN BUSINESS
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Why Businesses Choose Bongio AI Automation
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
              Every message is converted into actionable data, captured leads, and completed orders with zero human delay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {AI_AUTOMATION_CONFIG.benefits.map((benefit) => (
              <AutomationBenefitCard key={benefit.id} benefit={benefit} />
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 6. CALL TO ACTION AREA (BOTTOM CARD)                     */}
        {/* ======================================================== */}
        <AutomationCTA onOpenInquiry={() => handleOpenInquiry()} />

      </div>

      {/* Dedicated Inquiry Form Modal */}
      <AIInquiryFormModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        preselectedPlatform={selectedPlatform}
      />
    </section>
  );
};
