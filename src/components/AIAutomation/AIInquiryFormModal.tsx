import React, { useState, useEffect } from "react";
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  MessageSquare, 
  Loader2 
} from "lucide-react";
import confetti from "canvas-confetti";
import { AI_AUTOMATION_CONFIG } from "../../data/aiAutomationData";
import { saveInquiryToFirestore } from "../../lib/firebase";

interface AIInquiryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPlatform?: string;
}

export const AIInquiryFormModal: React.FC<AIInquiryFormModalProps> = ({
  isOpen,
  onClose,
  preselectedPlatform
}) => {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("E-commerce & D2C");
  const [monthlyVolume, setMonthlyVolume] = useState("500 – 2,000 messages / month");
  const [preferredPlatforms, setPreferredPlatforms] = useState<string[]>([
    "Facebook Messenger",
    "WhatsApp"
  ]);
  const [automationRequirements, setAutomationRequirements] = useState<string[]>([
    "Customer Support",
    "Product Questions",
    "Order Taking"
  ]);
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Set preselected platform if passed
  useEffect(() => {
    if (preselectedPlatform && !preferredPlatforms.includes(preselectedPlatform)) {
      setPreferredPlatforms((prev) => [...prev, preselectedPlatform]);
    }
  }, [preselectedPlatform]);

  // Lock body scroll on modal open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const togglePlatform = (p: string) => {
    setPreferredPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const toggleRequirement = (r: string) => {
    setAutomationRequirements((prev) =>
      prev.includes(r) ? prev.filter((item) => item !== r) : [...prev, r]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage("Please fill in your Name, Email and Phone / WhatsApp number.");
      return;
    }

    if (preferredPlatforms.length === 0) {
      setErrorMessage("Please select at least one preferred messaging platform.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const detailedBrief = [
        `[BONGIO DIGITAL AI AUTOMATION INQUIRY]`,
        `Business Name: ${businessName || "Not provided"}`,
        `Industry: ${industry}`,
        `Monthly Messages Volume: ${monthlyVolume}`,
        `Target Platforms: ${preferredPlatforms.join(", ")}`,
        `Automation Requirements: ${automationRequirements.join(", ")}`,
        website ? `Website: ${website}` : null,
        notes ? `Custom Requirements / Notes: ${notes}` : null
      ]
        .filter(Boolean)
        .join("\n");

      await saveInquiryToFirestore({
        name: name.trim(),
        email: email.trim(),
        company: businessName.trim() || "Independent Business",
        services: ["AI Automation", ...preferredPlatforms],
        budget: "AI Automation Plan",
        timeline: "Immediate Implementation",
        description: detailedBrief,
        estimatedValue: 450
      });

      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      console.error("AI automation inquiry submission error:", err);
      setErrorMessage(
        err.message || "Failed to submit inquiry. Please check your network connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left scrollbar-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-inquiry-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              AI Automation Architecture Request Received!
            </h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="text-white font-semibold">{name}</span>. Our AI automation engineers at Bongio Digital will review your message workflows and reach out within 2 hours with a tailored implementation roadmap.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="space-y-1.5 pr-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-blue-400">
                  BONGIO DIGITAL · 24/7 AI AUTOMATION
                </span>
              </div>
              <h2 id="ai-inquiry-title" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Build Your Custom AI Customer Automation
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                Connect your business inboxes to our AI brain. Respond to customer inquiries, capture leads, and take orders instantly — 24/7.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fahim Ahmed"
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Business / Company Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Dhaka Outfit Co."
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 17XX-XXXXXX"
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {AI_AUTOMATION_CONFIG.inquiryFormOptions.industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Monthly Customer Inquiries Volume
                </label>
                <select
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(e.target.value)}
                  className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {AI_AUTOMATION_CONFIG.inquiryFormOptions.monthlyVolume.map((vol) => (
                    <option key={vol} value={vol}>
                      {vol}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preferred Platforms Checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-300 uppercase font-mono tracking-wider">
                Preferred Messaging Platforms *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AI_AUTOMATION_CONFIG.inquiryFormOptions.preferredPlatforms.map((plat) => {
                  const isChecked = preferredPlatforms.includes(plat.id);
                  return (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => togglePlatform(plat.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left flex items-center justify-between border transition-all ${
                        isChecked
                          ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      <span>{plat.label}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Automation Requirements Checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-300 uppercase font-mono tracking-wider">
                Automation Capabilities Needed
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AI_AUTOMATION_CONFIG.inquiryFormOptions.automationRequirements.map((req) => {
                  const isChecked = automationRequirements.includes(req.id);
                  return (
                    <button
                      key={req.id}
                      type="button"
                      onClick={() => toggleRequirement(req.id)}
                      className={`px-3 py-2 rounded-xl text-xs text-left flex items-center justify-between border transition-all ${
                        isChecked
                          ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      <span>{req.label}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Notes */}
            <div className="space-y-1">
              <label className="block text-xs text-zinc-300 font-semibold">
                Additional Workflow Requirements or Website Link
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us about your current order workflow, CRM system, or common questions customers ask..."
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Configuring Architecture...</span>
                  </>
                ) : (
                  <>
                    <span>Submit AI Automation Request</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
