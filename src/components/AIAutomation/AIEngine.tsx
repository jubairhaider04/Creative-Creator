import React from "react";
import { Sparkles, Cpu, Zap, ArrowRight, Bot } from "lucide-react";
import { SocialPlatform } from "../../data/aiAutomationData";
import { SocialPlatformIcon } from "./SocialPlatformIcon";

interface AIEngineProps {
  platforms: SocialPlatform[];
  className?: string;
}

export const AIEngine: React.FC<AIEngineProps> = ({ platforms, className = "" }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center p-6 ${className}`}>
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-blue-600/20 via-cyan-500/15 to-purple-600/20 blur-[90px] animate-pulse" />
      </div>

      {/* Futuristic Concentric Rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer Orbit Ring with dashed border */}
        <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-blue-500/20 border-dashed animate-[spin_40s_linear_infinite]" />

        {/* Middle Pulse Ring */}
        <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-cyan-400/25 animate-[ping_6s_cubic-bezier(0,0,0.2,1)_infinite]" />

        {/* Glowing Gradient Ring */}
        <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full p-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 shadow-[0_0_40px_rgba(59,130,246,0.35)] animate-[spin_15s_linear_infinite]">
          <div className="w-full h-full rounded-full bg-zinc-950/90 backdrop-blur-xl" />
        </div>

        {/* Central Core Glass Sphere */}
        <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/20 shadow-2xl flex flex-col items-center justify-center text-center p-2 backdrop-blur-md">
          {/* Glowing Central AI Badge */}
          <div className="relative flex items-center justify-center mb-1">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>

          <span className="text-[10px] sm:text-xs font-mono font-black tracking-widest uppercase text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-blue-200">
            BONGIO AI
          </span>
          <span className="text-[9px] font-mono text-cyan-400/90 font-semibold tracking-wider">
            CORE ENGINE
          </span>

          {/* Micro Status Chip */}
          <div className="mt-1 px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-[8px] font-mono text-blue-300 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            <span>24/7 ACTIVE</span>
          </div>
        </div>

        {/* Floating Social Icons surrounding the Core */}
        {platforms.map((p, idx) => {
          // Circular positioning around the central core
          const total = platforms.length;
          const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
          const radius = 120; // Radius in pixels
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={p.id}
              className="absolute hidden sm:flex items-center justify-center transition-transform hover:scale-125 duration-300 z-20"
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
            >
              <SocialPlatformIcon platform={p} size="sm" isFloating={idx % 2 === 0} />
            </div>
          );
        })}
      </div>

      {/* Visual Flow Banner underneath Core */}
      <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-md text-[11px] font-mono text-zinc-300 shadow-xl">
        <span className="text-zinc-400">5 Platforms</span>
        <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-cyan-300 font-bold">1 Unified Brain</span>
        <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-emerald-400 font-bold">&lt;1s Replies</span>
      </div>
    </div>
  );
};
