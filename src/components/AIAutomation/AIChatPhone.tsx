import React, { useState, useEffect } from "react";
import { 
  Phone, 
  Video, 
  Info, 
  Send, 
  Image as ImageIcon, 
  Mic, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw,
  Bot,
  User,
  ShieldCheck,
  Zap
} from "lucide-react";
import { ChatMessageItem } from "../../data/aiAutomationData";
import { AIChatMessage } from "./AIChatMessage";

interface AIChatPhoneProps {
  mode: "without_ai" | "with_ai";
  statusLabel: string;
  bottomTagline: string;
  clientName: string;
  statusBadge?: string;
  lastSeen?: string;
  speedIndicator?: string;
  messages: ChatMessageItem[];
  className?: string;
}

export const AIChatPhone: React.FC<AIChatPhoneProps> = ({
  mode,
  statusLabel,
  bottomTagline,
  clientName,
  statusBadge,
  lastSeen,
  speedIndicator,
  messages,
  className = ""
}) => {
  const isWithAi = mode === "with_ai";

  // Animation step simulation: sequentially reveal messages or show all
  const [visibleCount, setVisibleCount] = useState<number>(messages.length);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const startSimulation = () => {
    setVisibleCount(1);
    setIsSimulating(true);
  };

  useEffect(() => {
    if (!isSimulating) return;

    if (visibleCount < messages.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, isWithAi ? 900 : 1200);
      return () => clearTimeout(timer);
    } else {
      setIsSimulating(false);
    }
  }, [isSimulating, visibleCount, messages.length, isWithAi]);

  return (
    <div className={`flex flex-col items-center w-full max-w-[340px] sm:max-w-[360px] mx-auto ${className}`}>
      {/* 1. Status Label Above Phone */}
      <div className="mb-3 flex items-center justify-between w-full px-2">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${
            isWithAi
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 shadow-emerald-950/40"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/40 shadow-rose-950/40"
          }`}
        >
          {isWithAi ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span>{statusLabel}</span>
        </div>

        {/* Small Simulation Replay Toggle */}
        <button
          type="button"
          onClick={startSimulation}
          title="Replay conversation simulation"
          className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition-colors text-[10px] flex items-center gap-1 font-mono"
        >
          <RotateCcw className={`w-3 h-3 ${isSimulating ? "animate-spin text-blue-400" : ""}`} />
          <span className="hidden sm:inline">Replay</span>
        </button>
      </div>

      {/* 2. Modern Smartphone Frame */}
      <div
        className={`relative w-full rounded-[42px] sm:rounded-[48px] p-2.5 sm:p-3 bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 shadow-2xl transition-all duration-500 border ${
          isWithAi
            ? "border-emerald-500/40 hover:border-emerald-400/70 shadow-emerald-950/30 ring-1 ring-emerald-500/20"
            : "border-rose-500/30 hover:border-rose-400/50 shadow-rose-950/20 ring-1 ring-rose-500/15"
        }`}
      >
        {/* Outer Bezel Accent */}
        <div className="relative w-full rounded-[34px] sm:rounded-[38px] bg-zinc-950 overflow-hidden flex flex-col h-[520px] sm:h-[550px] border border-white/5">
          
          {/* Top Speaker / Dynamic Island Notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-30 flex items-center justify-between px-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800" />
            <span className="w-2 h-2 rounded-full bg-blue-900/60" />
          </div>

          {/* Status Bar */}
          <div className="pt-3 px-5 flex items-center justify-between text-[10px] font-mono text-zinc-400 z-20">
            <span>11:10</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2 border border-zinc-400 rounded-sm p-[1px] flex items-center">
                <div className="w-full h-full bg-zinc-200 rounded-xs" />
              </div>
            </div>
          </div>

          {/* Messenger Chat Header */}
          <div className="px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-900/90 backdrop-blur-md flex items-center justify-between z-20">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-white text-xs font-bold border border-white/20">
                  {clientName.charAt(0)}
                </div>
                {isWithAi ? (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
                ) : (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-rose-500 border-2 border-zinc-950" />
                )}
              </div>

              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1">
                  {clientName}
                  {isWithAi && (
                    <span title="Bongio AI Verified" className="text-cyan-400 inline-flex">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-zinc-400 truncate max-w-[150px]">
                  {isWithAi ? "Bongio AI • Instant" : lastSeen || "Offline"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-400">
              <Phone className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
              <Video className="w-4 h-4 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Conversation Area with smooth scrolling */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-none flex flex-col justify-end bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900/40">
            {messages.slice(0, visibleCount).map((msg, idx) => (
              <AIChatMessage
                key={msg.id}
                message={msg}
                mode={mode}
                isLast={idx === visibleCount - 1}
              />
            ))}
          </div>

          {/* Messenger Input Simulation Bar */}
          <div className="p-2.5 border-t border-zinc-800/80 bg-zinc-900/80 flex items-center gap-2">
            <Plus className="w-4 h-4 text-zinc-400" />
            <ImageIcon className="w-4 h-4 text-zinc-400" />
            <div className="flex-1 px-3 py-1.5 rounded-full bg-zinc-800 text-[11px] text-zinc-400 border border-zinc-700/60 flex items-center justify-between">
              <span>{isWithAi ? "AI auto-reply active..." : "Write a message..."}</span>
              <Mic className="w-3 h-3 text-zinc-500" />
            </div>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${
                isWithAi ? "bg-blue-600 shadow-sm" : "bg-zinc-700 text-zinc-400"
              }`}
            >
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Home Indicator bar */}
          <div className="pb-1.5 flex justify-center bg-zinc-900/80">
            <div className="w-24 h-1 bg-zinc-600/70 rounded-full" />
          </div>

        </div>
      </div>

      {/* 3. Bottom Tagline / Outcome Label */}
      <div className="mt-3.5 text-center space-y-1">
        <div
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
            isWithAi
              ? "text-emerald-300 bg-emerald-950/40 border border-emerald-500/30"
              : "text-rose-300 bg-rose-950/40 border border-rose-500/30"
          }`}
        >
          {isWithAi ? (
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span>{bottomTagline}</span>
        </div>

        {speedIndicator && (
          <p className="text-[10px] font-mono text-zinc-400">
            {speedIndicator}
          </p>
        )}
      </div>
    </div>
  );
};
