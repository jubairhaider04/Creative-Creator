import React, { useState } from "react";
import { Mail, CheckCircle2, Sparkles, Send, ShieldCheck, Loader2 } from "lucide-react";
import { saveNewsletterSubscriberFirestore } from "../lib/firebase";

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "Design Systems",
    "Web Engineering"
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableTopics = [
    "Design Systems",
    "Web Engineering",
    "4K Video Production",
    "B2B Content Strategy",
    "Founder Insights"
  ];

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter(t => t !== topic));
      }
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      try {
        await saveNewsletterSubscriberFirestore(email, selectedTopics);
      } catch (fErr) {
        console.warn("Firestore newsletter sync notice:", fErr);
      }

      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          topics: selectedTopics
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Subscription failed");
      }

      setSuccessMessage(data.message || "You are subscribed! Welcome to Bongio Digital Insights.");
      setEmail("");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 relative border-t border-zinc-800/80 bg-zinc-950/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Subtle glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Weekly Technical Masterclasses</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
              Join 14,000+ Founders & Creators
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
              Get our monthly teardowns on 60FPS web architectures, DaVinci Resolve color pipelines, and high-retention copywriting frameworks. Zero fluff, strictly high-signal.
            </p>

            {/* Topic preference pills */}
            <div className="flex flex-wrap justify-center gap-1.5 mb-6">
              {availableTopics.map((topic) => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${
                      isSelected
                        ? "bg-blue-600/20 text-blue-300 border-blue-500/40"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>

            {/* Newsletter form */}
            {successMessage ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  id="input-newsletter-email"
                  type="email"
                  required
                  placeholder="Enter your work email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  id="btn-subscribe-newsletter"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {errorMessage && (
              <div className="text-xs text-red-400 mt-2">{errorMessage}</div>
            )}

            <div className="flex items-center justify-center gap-4 mt-6 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>No spam ever</span>
              </span>
              <span>•</span>
              <span>One-click unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
