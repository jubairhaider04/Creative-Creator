import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Brain, 
  Send, 
  Clock, 
  CheckCircle2, 
  Code2, 
  ArrowRight, 
  Copy, 
  Check, 
  Loader2,
  TrendingUp,
  Layers,
  Wand2
} from "lucide-react";
import { AiProjectPlan, ServiceCategory } from "../types";

interface AiConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBriefToContact: (briefText: string, serviceCategory: string) => void;
}

export const AiConsultantModal: React.FC<AiConsultantModalProps> = ({
  isOpen,
  onClose,
  onApplyBriefToContact
}) => {
  const [projectIdea, setProjectIdea] = useState("");
  const [serviceType, setServiceType] = useState<ServiceCategory>("Web Development");
  const [targetAudience, setTargetAudience] = useState("Modern B2B Buyers & Consumers");
  const [budgetBracket, setBudgetBracket] = useState("$10,000 - $25,000");
  const [timeline, setTimeline] = useState("4-6 weeks");
  
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<AiProjectPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectIdea.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/gemini/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectIdea,
          serviceType,
          targetAudience,
          budgetBracket,
          timeline
        })
      });

      if (!res.ok) {
        throw new Error("Failed to generate strategic blueprint");
      }

      const data = await res.json();
      if (data.plan) {
        setPlan(data.plan);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error(err);
      setError("Unable to connect to AI engine. Defaulting to pre-calculated roadmap template.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!plan) return;
    const text = `
CREATIVE CREATOR - AI STRATEGIC PROJECT BRIEF
Title: ${plan.title}
Summary: ${plan.summary}
Recommended Budget: ${plan.recommendedBudgetTier}
Estimated Hours: ${plan.estimatedEffortHours} hrs

Phases:
${plan.phases.map(p => `• ${p.phase} (${p.duration}):\n  - ${p.deliverables.join("\n  - ")}`).join("\n")}

Recommended Stack: ${plan.recommendedStack.join(", ")}
Target Metrics: ${plan.keyMetricsToTarget.join(", ")}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplyBrief = () => {
    if (!plan) return;
    const formatted = `[AI SCOPE BRIEF: ${plan.title}]\n\n${plan.summary}\n\nKey Targets: ${plan.keyMetricsToTarget.join(", ")}\n\nDeliverables Needed: ${plan.phases.flatMap(p => p.deliverables).slice(0, 5).join(", ")}`;
    onApplyBriefToContact(formatted, serviceType);
    onClose();
  };

  return (
    <div 
      id="ai-consultant-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="ai-consultant-modal"
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">AI Creative Scope & Strategy Advisor</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 uppercase tracking-wide border border-amber-500/30">
                  Thinking Level: HIGH
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Powered by Gemini 3.1 Pro Thinking Engine</p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-ai-consultant"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Input Form */}
          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                Describe Your Project Concept, Vision, or Business Problem
              </label>
              <textarea
                id="input-ai-project-idea"
                rows={3}
                required
                placeholder="e.g., We need an ultra-luxury dark-mode web application for our quantum AI analytics startup, accompanied by a 60-second 3D product commercial and tokenized design system for our Series A pitch."
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Primary Discipline</label>
                <select
                  id="select-ai-service-type"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as ServiceCategory)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Content Creation">Content Creation</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Graphic Design">Graphic Design</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Target Audience</label>
                <input
                  id="input-ai-target-audience"
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Budget Target</label>
                <select
                  id="select-ai-budget-bracket"
                  value={budgetBracket}
                  onChange={(e) => setBudgetBracket(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000+">$25,000+ (Enterprise)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Desired Timeline</label>
                <select
                  id="select-ai-timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="1-2 weeks">1-2 weeks (Express)</option>
                  <option value="4-6 weeks">4-6 weeks (Standard)</option>
                  <option value="2-3 months">2-3 months (Comprehensive)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                id="btn-ai-generate-plan"
                disabled={isLoading || !projectIdea.trim()}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Strategy with High Thinking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Strategic Blueprint</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error notice if any */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Generated Plan Output */}
          {plan && (
            <div className="border-t border-zinc-800 pt-6 space-y-6 animate-in fade-in duration-300">
              {/* Header Box */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Executive Strategy Blueprint
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? "Copied" : "Copy Brief"}</span>
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {plan.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {plan.summary}
                </p>
              </div>

              {/* Strategic Thinking Notes */}
              {plan.thinkingNotes && (
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400">
                  <strong className="text-amber-300 block mb-1">Architectural Reasoning:</strong>
                  {plan.thinkingNotes}
                </div>
              )}

              {/* Phases & Roadmap */}
              <div>
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                  Execution Milestones & Sprints
                </h4>
                <div className="space-y-3">
                  {plan.phases.map((phase, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{phase.phase}</span>
                        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                          {phase.duration}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {phase.deliverables.map((deliv, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-1.5 text-xs text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 uppercase font-semibold block mb-1">Recommended Toolchain</span>
                  <div className="flex flex-wrap gap-1">
                    {plan.recommendedStack.map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 uppercase font-semibold block mb-1">Target ROI Benchmarks</span>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {plan.keyMetricsToTarget.map((m, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-emerald-400">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-zinc-200">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <span className="text-[11px] text-zinc-400 uppercase font-semibold block mb-1">Estimated Investment</span>
                  <div className="text-lg font-extrabold text-white mb-0.5">
                    {plan.recommendedBudgetTier}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Est. Effort: ~{plan.estimatedEffortHours} engineering hours
                  </div>
                </div>
              </div>

              {/* Direct Apply to Contact */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  id="btn-ai-apply-brief-to-contact"
                  onClick={handleApplyBrief}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
                >
                  <span>Pre-Fill Project Inquiry with this Blueprint</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
