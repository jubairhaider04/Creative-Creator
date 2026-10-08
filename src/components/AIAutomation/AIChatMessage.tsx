import React from "react";
import { Check, CheckCheck, Clock, Sparkles, AlertCircle, ShoppingBag, Bot } from "lucide-react";
import { ChatMessageItem } from "../../data/aiAutomationData";

interface AIChatMessageProps {
  message: ChatMessageItem;
  mode: "without_ai" | "with_ai";
  isLast?: boolean;
}

export const AIChatMessage: React.FC<AIChatMessageProps> = ({ message, mode, isLast }) => {
  // 1. Order confirmed / System Action Card
  if (message.statusType === "order_card" && message.orderData) {
    return (
      <div className="my-2 p-3 rounded-2xl bg-gradient-to-br from-blue-950/80 via-zinc-900 to-zinc-950 border border-blue-500/40 shadow-lg shadow-blue-950/50 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>{message.orderData.status}</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 font-semibold px-2 py-0.5 rounded bg-blue-900/50">
            {message.orderData.orderId}
          </span>
        </div>

        <div className="text-[11px] text-zinc-300 space-y-1 font-sans">
          <div className="flex justify-between">
            <span className="text-zinc-400">Customer:</span>
            <span className="font-semibold text-white">{message.orderData.customer}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Item:</span>
            <span className="font-semibold text-white">{message.orderData.items}</span>
          </div>
          <div className="flex justify-between text-xs pt-1 border-t border-white/5">
            <span className="text-zinc-400">Total:</span>
            <span className="font-bold text-emerald-400">{message.orderData.total}</span>
          </div>
        </div>

        {message.checks && message.checks.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
            {message.checks.map((chk, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-emerald-300 font-mono">
                <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <span>{chk}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. Waiting Indicator (Without AI)
  if (message.statusType === "waiting") {
    return (
      <div className="my-2.5 px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[11px] flex items-center justify-center gap-2 font-mono shadow-sm">
        <Clock className="w-3.5 h-3.5 text-rose-400 animate-spin" />
        <span>{message.text}</span>
      </div>
    );
  }

  // 3. Customer Left / Lost Sale (Without AI)
  if (message.statusType === "left") {
    return (
      <div className="my-2.5 px-3.5 py-2.5 rounded-xl bg-rose-900/30 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-center gap-2 font-semibold shadow-md">
        <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
        <span>{message.text}</span>
      </div>
    );
  }

  // 4. Regular Chat Bubbles
  const isAiSender = message.sender === "ai";
  const isCustomerSender = message.sender === "customer";

  return (
    <div
      className={`flex items-end gap-1.5 my-1.5 ${
        isCustomerSender ? "justify-end" : "justify-start"
      } animate-in fade-in duration-200`}
    >
      {/* AI Avatar */}
      {isAiSender && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-[10px] shadow-sm flex-shrink-0 mb-1">
          <Bot className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed transition-all ${
          isCustomerSender
            ? "bg-zinc-800 text-zinc-100 rounded-br-sm border border-zinc-700/60 shadow-sm"
            : isAiSender
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-bl-sm shadow-md shadow-blue-900/30 font-medium"
            : "bg-zinc-900 text-zinc-300 rounded-bl-sm border border-zinc-800"
        }`}
      >
        <p className="break-words">{message.text}</p>
        <div
          className={`flex items-center justify-end gap-1 text-[9px] mt-1 font-mono ${
            isAiSender ? "text-blue-200/80" : "text-zinc-400"
          }`}
        >
          <span>{message.time}</span>
          {isCustomerSender && <CheckCheck className="w-3 h-3 text-blue-400" />}
          {isAiSender && (
            <span className="px-1 py-0.2 rounded bg-white/20 text-[8px] font-bold tracking-tight">
              AI
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
