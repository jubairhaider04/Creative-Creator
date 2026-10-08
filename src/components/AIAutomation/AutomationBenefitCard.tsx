import React from "react";
import { 
  Clock, 
  Zap, 
  Layers, 
  ShoppingCart, 
  Target, 
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { AutomationBenefit } from "../../data/aiAutomationData";

interface AutomationBenefitCardProps {
  benefit: AutomationBenefit;
  className?: string;
}

export const AutomationBenefitCard: React.FC<AutomationBenefitCardProps> = ({
  benefit,
  className = ""
}) => {
  const renderIcon = () => {
    switch (benefit.iconName) {
      case "clock":
        return <Clock className="w-5 h-5 text-blue-400" />;
      case "zap":
        return <Zap className="w-5 h-5 text-amber-400" />;
      case "layers":
        return <Layers className="w-5 h-5 text-cyan-400" />;
      case "shopping-cart":
        return <ShoppingCart className="w-5 h-5 text-emerald-400" />;
      case "target":
        return <Target className="w-5 h-5 text-purple-400" />;
      case "trending-up":
        return <TrendingUp className="w-5 h-5 text-pink-400" />;
      default:
        return <Zap className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div
      className={`group relative p-6 sm:p-7 rounded-3xl bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/20 flex flex-col justify-between overflow-hidden ${className}`}
    >
      {/* Background Hover Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 group-hover:bg-blue-600/10 rounded-full blur-2xl transition-all pointer-events-none" />

      {/* Top Header: Number & Icon */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center group-hover:scale-110 transition-transform">
            {renderIcon()}
          </div>
          <span className="font-mono text-xs font-bold text-zinc-500 group-hover:text-blue-400 transition-colors">
            {benefit.number}
          </span>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-zinc-800/80 border border-zinc-700/70 text-zinc-300">
          {benefit.metricBadge}
        </span>
      </div>

      {/* Body Content */}
      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-blue-200 transition-colors">
          {benefit.title}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
          {benefit.description}
        </p>
      </div>

      {/* Subtle Bottom Accent Indicator */}
      <div className="mt-5 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
        <span>Bongio AI Engine</span>
        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </div>
  );
};
