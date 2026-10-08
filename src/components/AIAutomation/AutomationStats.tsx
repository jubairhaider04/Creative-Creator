import React from "react";
import { AutomationStat } from "../../data/aiAutomationData";

interface AutomationStatsProps {
  stats: AutomationStat[];
  className?: string;
}

export const AutomationStats: React.FC<AutomationStatsProps> = ({ stats, className = "" }) => {
  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-xl shadow-2xl ${className}`}
    >
      {stats.map((st, idx) => (
        <div
          key={idx}
          className="p-4 sm:p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 hover:border-zinc-700 transition-all flex flex-col justify-between text-left group"
        >
          <div>
            <div
              className={`text-2xl sm:text-3xl lg:text-4xl font-black font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${st.color} group-hover:scale-105 transition-transform origin-left`}
            >
              {st.value}
            </div>
            <div className="text-[11px] sm:text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mt-1.5">
              {st.label}
            </div>
          </div>

          <p className="text-[10px] text-zinc-500 font-sans mt-2 pt-2 border-t border-zinc-800/60">
            {st.sublabel}
          </p>
        </div>
      ))}
    </div>
  );
};
