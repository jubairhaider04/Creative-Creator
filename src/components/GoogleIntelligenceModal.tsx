import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Brain, 
  Search, 
  MapPin, 
  Clapperboard, 
  Zap, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Loader2, 
  TrendingUp, 
  ExternalLink, 
  Bookmark, 
  FileText,
  Sliders,
  Compass,
  Building2,
  Video,
  Layers,
  Wand2
} from "lucide-react";
import { AiProjectPlan, ServiceCategory, UserAuth } from "../types";
import { saveAiPlanToFirestore } from "../lib/firebase";

interface GoogleIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBriefToContact: (briefText: string, serviceCategory: string) => void;
  currentUser: UserAuth | null;
}

type TabType = "thinking" | "search_radar" | "maps_locator" | "creative_studio" | "fast_lite";

export const GoogleIntelligenceModal: React.FC<GoogleIntelligenceModalProps> = ({
  isOpen,
  onClose,
  onApplyBriefToContact,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("thinking");

  // 1. High Thinking State (gemini-3.1-pro-preview with ThinkingLevel.HIGH)
  const [projectIdea, setProjectIdea] = useState("");
  const [serviceType, setServiceType] = useState<ServiceCategory>("Web Development");
  const [targetAudience, setTargetAudience] = useState("Modern B2B Buyers & Consumers");
  const [budgetBracket, setBudgetBracket] = useState("$10,000 - $25,000");
  const [timeline, setTimeline] = useState("4-6 weeks");
  const [isThinkingLoading, setIsThinkingLoading] = useState(false);
  const [thinkingPlan, setThinkingPlan] = useState<AiProjectPlan | null>(null);
  const [isPlanSaved, setIsPlanSaved] = useState(false);

  // 2. Google Search Grounding State (gemini-3.5-flash with googleSearch)
  const [searchQuery, setSearchQuery] = useState("2026 luxury dark mode web design trends and tech stack standards");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    text: string;
    sources: { title: string; url: string }[];
  } | null>(null);

  // 3. Google Maps Grounding State (gemini-3.5-flash with googleMaps)
  const [mapsLocation, setMapsLocation] = useState("San Francisco, CA");
  const [mapsFacilityType, setMapsFacilityType] = useState("4K film production studio with soundstage and cyclorama");
  const [isMapsLoading, setIsMapsLoading] = useState(false);
  const [mapsResult, setMapsResult] = useState<string | null>(null);

  // 4. Creative Video & Content Studio (gemini-3.5-flash)
  const [creativeTopic, setCreativeTopic] = useState("Next-Gen Quantum AI Analytics Launch Commercial");
  const [creativeFormat, setCreativeFormat] = useState("60-Second Cinema Commercial");
  const [isCreativeLoading, setIsCreativeLoading] = useState(false);
  const [creativeScript, setCreativeScript] = useState<any | null>(null);

  // 5. Fast Flash Lite State (gemini-3.1-flash-lite)
  const [liteTask, setLiteTask] = useState<"headline" | "polish">("headline");
  const [liteInput, setLiteInput] = useState("We craft 60fps websites and cinematic videos for ambitious brands.");
  const [isLiteLoading, setIsLiteLoading] = useState(false);
  const [liteOutput, setLiteOutput] = useState<any | null>(null);

  // General copied state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Handler: High Thinking Plan
  const handleGenerateThinkingPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectIdea.trim()) return;
    setIsThinkingLoading(true);
    setIsPlanSaved(false);

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
      const data = await res.json();
      if (data.plan) {
        setThinkingPlan(data.plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinkingLoading(false);
    }
  };

  // Save Plan to Firestore
  const handleSavePlanToFirestore = async () => {
    if (!thinkingPlan) return;
    try {
      await saveAiPlanToFirestore(thinkingPlan, currentUser?.email || "guest", currentUser?.email);
      setIsPlanSaved(true);
    } catch (err) {
      console.error("Firestore save error:", err);
    }
  };

  // Handler: Google Search Grounding
  const handleSearchGrounding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchLoading(true);

    try {
      const res = await fetch("/api/gemini/search-grounding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // Handler: Google Maps Grounding
  const handleMapsGrounding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMapsLoading(true);

    try {
      const res = await fetch("/api/gemini/maps-grounding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: mapsLocation,
          query: mapsFacilityType
        })
      });
      const data = await res.json();
      setMapsResult(data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMapsLoading(false);
    }
  };

  // Handler: Creative Video Script (gemini-3.5-flash)
  const handleGenerateCreativeScript = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreativeLoading(true);

    try {
      const res = await fetch("/api/gemini/creative-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discipline: "Video Production",
          topic: creativeTopic,
          format: creativeFormat,
          targetLength: "60 seconds"
        })
      });
      const data = await res.json();
      setCreativeScript(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreativeLoading(false);
    }
  };

  // Handler: Fast Flash Lite
  const handleFastLite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liteInput.trim()) return;
    setIsLiteLoading(true);

    try {
      const res = await fetch("/api/gemini/fast-lite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: liteTask,
          input: liteInput,
          context: "Creative Creator Agency Brand Copy"
        })
      });
      const data = await res.json();
      setLiteOutput(data.output);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiteLoading(false);
    }
  };

  return (
    <div 
      id="google-intelligence-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="google-intelligence-modal"
        className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 via-amber-500/20 to-emerald-500/20 border border-blue-500/30 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Google Intelligence Suite</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                  Gemini & Google Grounding
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                High Thinking Architecture, Google Search Radar, Maps Studio Locator & Fast Flash Engines
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-google-intel-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2 border-b border-zinc-800 bg-zinc-950 overflow-x-auto no-scrollbar shrink-0 text-xs font-semibold">
          {/* Tab 1: High Thinking */}
          <button
            type="button"
            onClick={() => setActiveTab("thinking")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === "thinking"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-amber-400" />
            <span>High Thinking Scope Advisor</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/30 text-amber-200">
              gemini-3.1-pro
            </span>
          </button>

          {/* Tab 2: Google Search Grounding */}
          <button
            type="button"
            onClick={() => setActiveTab("search_radar")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === "search_radar"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Search Radar</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/30 text-blue-200">
              gemini-3.5-flash
            </span>
          </button>

          {/* Tab 3: Google Maps Grounding */}
          <button
            type="button"
            onClick={() => setActiveTab("maps_locator")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === "maps_locator"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Maps Studio Finder</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/30 text-emerald-200">
              gemini-3.5-flash
            </span>
          </button>

          {/* Tab 4: Creative Script Studio */}
          <button
            type="button"
            onClick={() => setActiveTab("creative_studio")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === "creative_studio"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5 text-purple-400" />
            <span>Cinema Storyboard Studio</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/30 text-purple-200">
              gemini-3.5-flash
            </span>
          </button>

          {/* Tab 5: Fast Flash Lite */}
          <button
            type="button"
            onClick={() => setActiveTab("fast_lite")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeTab === "fast_lite"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Instant Fast Lite</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/30 text-rose-200">
              gemini-3.1-flash-lite
            </span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-grow">
          {/* TAB 1: HIGH THINKING MODE */}
          {activeTab === "thinking" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-200">
                <Brain className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold text-sm">Gemini 3.1 Pro Thinking Engine (`ThinkingLevel.HIGH`)</strong>
                  Uses deep step-by-step reasoning chains without token bottlenecks to analyze architectural tradeoffs, sprint roadmaps, and precise budget allocations.
                </div>
              </div>

              <form onSubmit={handleGenerateThinkingPlan} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Project Vision or Business Objective
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. We need an ultra-modern interactive 60FPS dark-mode web application and a 60-second 3D product commercial for our quantum AI analytics startup Series A launch."
                    value={projectIdea}
                    onChange={(e) => setProjectIdea(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-zinc-400 block mb-1">Service Pillar</label>
                    <select
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
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-zinc-400 block mb-1">Budget Target</label>
                    <select
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
                    <label className="text-[11px] font-medium text-zinc-400 block mb-1">Target Timeline</label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="1-2 weeks">1-2 weeks (Express)</option>
                      <option value="4-6 weeks">4-6 weeks (Standard)</option>
                      <option value="2-3 months">2-3 months</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isThinkingLoading || !projectIdea.trim()}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 transition-all"
                  >
                    {isThinkingLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>High Thinking in Progress...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4" />
                        <span>Generate High-Reasoning Scope</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {thinkingPlan && (
                <div className="border-t border-zinc-800 pt-6 space-y-6 animate-in fade-in duration-300">
                  <div className="p-5 rounded-2xl bg-zinc-900/80 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        Executive Blueprint (gemini-3.1-pro-preview)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSavePlanToFirestore}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 flex items-center gap-1"
                        >
                          <Bookmark className={`w-3 h-3 ${isPlanSaved ? "text-emerald-400 fill-emerald-400" : ""}`} />
                          <span>{isPlanSaved ? "Saved to Cloud" : "Save Scope (Firestore)"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(JSON.stringify(thinkingPlan, null, 2), "thinking")}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 flex items-center gap-1"
                        >
                          {copiedKey === "thinking" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === "thinking" ? "Copied" : "Copy JSON"}</span>
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white">{thinkingPlan.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{thinkingPlan.summary}</p>
                  </div>

                  {thinkingPlan.thinkingNotes && (
                    <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400">
                      <strong className="text-amber-300 block mb-1">Architectural Thinking Trace:</strong>
                      {thinkingPlan.thinkingNotes}
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Milestone Sprints</h4>
                    {thinkingPlan.phases.map((phase, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-white">
                          <span>{phase.phase}</span>
                          <span className="font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded text-[11px]">{phase.duration}</span>
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

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const formatted = `[HIGH THINKING SCOPE: ${thinkingPlan.title}]\n\n${thinkingPlan.summary}\n\nKey Targets: ${thinkingPlan.keyMetricsToTarget.join(", ")}\n\nMilestones:\n${thinkingPlan.phases.map(p => `- ${p.phase} (${p.duration}): ${p.deliverables.join(", ")}`).join("\n")}`;
                        onApplyBriefToContact(formatted, serviceType);
                        onClose();
                      }}
                      className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30"
                    >
                      <span>Pre-Fill Project Inquiry Form</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GOOGLE SEARCH GROUNDING */}
          {activeTab === "search_radar" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-200">
                <Search className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold text-sm">Google Search Grounding (`gemini-3.5-flash` with `googleSearch`)</strong>
                  Fetches live real-world information, current 2026 digital creative trends, real-time competitor intelligence, and verified web citations.
                </div>
              </div>

              <form onSubmit={handleSearchGrounding} className="space-y-3">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Search Query for Live Market Intelligence
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. 2026 luxury agency dark mode web design benchmarks"
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={isSearchLoading}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/20 disabled:opacity-50 shrink-0"
                  >
                    {isSearchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>Search Web Grounding</span>
                  </button>
                </div>
              </form>

              {searchResult && (
                <div className="border-t border-zinc-800 pt-6 space-y-4 animate-in fade-in duration-300">
                  <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
                      <span className="font-semibold text-white">Live Grounded Analysis</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(searchResult.text, "search")}
                        className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
                      >
                        {copiedKey === "search" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === "search" ? "Copied" : "Copy Report"}</span>
                      </button>
                    </div>

                    <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {searchResult.text}
                    </div>
                  </div>

                  {searchResult.sources && searchResult.sources.length > 0 && (
                    <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Verified Google Search Sources & Citations
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {searchResult.sources.map((src, idx) => (
                          <a
                            key={idx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="max-w-[240px] truncate">{src.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GOOGLE MAPS GROUNDING */}
          {activeTab === "maps_locator" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 text-xs text-emerald-200">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold text-sm">Google Maps Grounding (`gemini-3.5-flash` with `googleMaps`)</strong>
                  Locate real physical production facilities, 4K video stages, photography studios, cinema equipment rental houses, and audio editing labs across any global city.
                </div>
              </div>

              <form onSubmit={handleMapsGrounding} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Target City / Metro</label>
                    <input
                      type="text"
                      required
                      value={mapsLocation}
                      onChange={(e) => setMapsLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA or London, UK"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Facility / Production Type</label>
                    <input
                      type="text"
                      required
                      value={mapsFacilityType}
                      onChange={(e) => setMapsFacilityType(e.target.value)}
                      placeholder="e.g. 4K soundstage with cyclorama wall and grip rental"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isMapsLoading}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {isMapsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
                    <span>Locate Facilities on Google Maps</span>
                  </button>
                </div>
              </form>

              {mapsResult && (
                <div className="border-t border-zinc-800 pt-6 animate-in fade-in duration-300">
                  <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
                      <span className="font-semibold text-white">Verified Grounded Locations ({mapsLocation})</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(mapsResult, "maps")}
                        className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
                      >
                        {copiedKey === "maps" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === "maps" ? "Copied" : "Copy Locations"}</span>
                      </button>
                    </div>

                    <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {mapsResult}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CINEMA STORYBOARD & CONTENT STUDIO */}
          {activeTab === "creative_studio" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-3 text-xs text-purple-200">
                <Clapperboard className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold text-sm">Cinema & Content Studio (`gemini-3.5-flash`)</strong>
                  Generate full multi-scene 60-second video commercial storyboards with timestamped camera choreography, lighting, and audio design cues.
                </div>
              </div>

              <form onSubmit={handleGenerateCreativeScript} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Product / Topic</label>
                    <input
                      type="text"
                      required
                      value={creativeTopic}
                      onChange={(e) => setCreativeTopic(e.target.value)}
                      placeholder="e.g. Luxury Electric Hypercar or Enterprise AI Suite"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">Asset Format</label>
                    <select
                      value={creativeFormat}
                      onChange={(e) => setCreativeFormat(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="60-Second Cinema Commercial">60-Second Cinema Commercial</option>
                      <option value="15-Second High-Impact TikTok/Reel">15-Second High-Impact TikTok/Reel</option>
                      <option value="Brand Manifesto & Voice Architecture">Brand Manifesto & Voice Architecture</option>
                      <option value="Interactive Web Narrative Script">Interactive Web Narrative Script</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isCreativeLoading}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/20 disabled:opacity-50"
                  >
                    {isCreativeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                    <span>Generate Storyboard & Script</span>
                  </button>
                </div>
              </form>

              {creativeScript && (
                <div className="border-t border-zinc-800 pt-6 space-y-4 animate-in fade-in duration-300">
                  <div className="p-5 rounded-2xl bg-zinc-900/60 border border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                      <span>{creativeScript.title}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(JSON.stringify(creativeScript, null, 2), "script")}
                        className="text-zinc-400 hover:text-white"
                      >
                        {copiedKey === "script" ? "Copied" : "Copy Script"}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                      <strong className="text-purple-400 block mb-1">Visual Hook (First 3s):</strong>
                      {creativeScript.hook}
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Scene Breakdown</span>
                      {creativeScript.scenes?.map((scene: any, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                          <div className="sm:col-span-2 font-mono text-purple-400 font-bold">{scene.timestamp}</div>
                          <div className="sm:col-span-6 text-zinc-200">
                            <span className="text-zinc-500 font-semibold block text-[10px] uppercase">Visual & Camera</span>
                            {scene.visual}
                          </div>
                          <div className="sm:col-span-4 text-zinc-400">
                            <span className="text-zinc-500 font-semibold block text-[10px] uppercase">Audio & Voiceover</span>
                            {scene.audio}
                          </div>
                        </div>
                      ))}
                    </div>

                    {creativeScript.tagline && (
                      <div className="text-center pt-2 text-xs font-mono text-purple-300 font-bold">
                        “{creativeScript.tagline}”
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: FAST FLASH LITE */}
          {activeTab === "fast_lite" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-xs text-rose-200">
                <Zap className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-bold text-sm">Instant Fast Lite (`gemini-3.1-flash-lite`)</strong>
                  Optimized for sub-500ms ultra-fast micro-tasks: generate 1-click punchy headline options, instant copy polish, and marketing tags without latency.
                </div>
              </div>

              <form onSubmit={handleFastLite} className="space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLiteTask("headline")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      liteTask === "headline"
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800"
                    }`}
                  >
                    Instant Headline Variations
                  </button>
                  <button
                    type="button"
                    onClick={() => setLiteTask("polish")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      liteTask === "polish"
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800"
                    }`}
                  >
                    1-Click High-Craft Copy Polish
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Input Text
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={liteInput}
                    onChange={(e) => setLiteInput(e.target.value)}
                    placeholder="Enter short text to transform..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLiteLoading}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/20 disabled:opacity-50"
                  >
                    {isLiteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    <span>Run Fast Lite (Instant)</span>
                  </button>
                </div>
              </form>

              {liteOutput && (
                <div className="border-t border-zinc-800 pt-6 animate-in fade-in duration-300">
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Fast Lite Results (gemini-3.1-flash-lite)
                    </span>

                    {Array.isArray(liteOutput) ? (
                      <div className="space-y-2">
                        {liteOutput.map((h, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs">
                            <span className="text-white font-semibold">{h}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(h, `h-${i}`)}
                              className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-900 border border-zinc-800"
                            >
                              {copiedKey === `h-${i}` ? "Copied" : "Use"}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 leading-relaxed">
                        {liteOutput}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
