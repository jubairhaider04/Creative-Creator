import React from "react";
import { ArrowRight, Bot, MessageCircle, Sparkles, Zap, ShieldCheck } from "lucide-react";

interface AutomationCTAProps {
  onOpenInquiry: () => void;
  className?: string;
}

export const AutomationCTA: React.FC<AutomationCTAProps> = ({ onOpenInquiry, className = "" }) => {
  const handleTalkToExpert = () => {
    const phone = "8801676056414";
    const msg = encodeURIComponent(
      "Hi Bongio Digital! I want to discuss implementing AI Customer Automation for our business messages (Messenger, WhatsApp & Instagram)."
    );
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${msg}`, "_blank");
  };

  return (
    <div
      className={`relative p-8 sm:p-12 lg:p-16 rounded-[36px] bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 shadow-2xl overflow-hidden text-center ${className}`}
    >
      {/* Background Lighting Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/15 via-cyan-500/10 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
          <Bot className="w-4 h-4 text-cyan-400" />
          <span>Bongio Digital AI Automation</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          Ready to Automate Your Customer Conversations?
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
          Let AI handle repetitive customer questions, order taking, and lead qualification while your team focuses on growing the business. Get live within 48 hours.
        </p>

        {/* Features Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-300 pt-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>&lt;1s Response Speed</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>24/7 Guaranteed Uptime</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multi-Platform Sync</span>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <button
            type="button"
            onClick={onOpenInquiry}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95"
          >
            <span>Start AI Automation</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleTalkToExpert}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all hover:border-zinc-500"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Talk to an Expert</span>
          </button>
        </div>
      </div>
    </div>
  );
};
