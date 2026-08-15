import React, { useState } from "react";
import { 
  Send, 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  X, 
  Sparkles, 
  Clock, 
  DollarSign, 
  ShieldCheck,
  Building,
  Mail,
  User,
  MessageSquare,
  AlertCircle,
  Loader2
} from "lucide-react";
import confetti from "canvas-confetti";
import { saveInquiryToFirestore } from "../lib/firebase";

interface ContactSectionProps {
  prefilledBrief?: string;
  prefilledServices?: string[];
  prefilledBudget?: string;
  prefilledTimeline?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  prefilledBrief = "",
  prefilledServices = ["Web Development"],
  prefilledBudget = "$10,000 - $25,000",
  prefilledTimeline = "4-6 weeks"
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>(prefilledServices);
  const [budget, setBudget] = useState(prefilledBudget);
  const [timeline, setTimeline] = useState(prefilledTimeline);
  const [description, setDescription] = useState(prefilledBrief);

  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update when prefilled values change
  React.useEffect(() => {
    if (prefilledBrief) setDescription(prefilledBrief);
    if (prefilledServices && prefilledServices.length > 0) setSelectedServices(prefilledServices);
    if (prefilledBudget) setBudget(prefilledBudget);
    if (prefilledTimeline) setTimeline(prefilledTimeline);
  }, [prefilledBrief, prefilledServices, prefilledBudget, prefilledTimeline]);

  const serviceOptions = [
    "Web Development",
    "Content Creation",
    "Video Editing",
    "Graphic Design"
  ];

  const budgetOptions = [
    "$2,500 - $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000+ (Enterprise)"
  ];

  const timelineOptions = [
    "1-2 weeks (Rush)",
    "4-6 weeks (Standard)",
    "2-3 months",
    "Ongoing Retainer"
  ];

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== srv));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((f: File) => ({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + " MB"
      }));
      setAttachedFiles([...attachedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !description.trim()) {
      setErrorMessage("Please complete all required fields (Name, Email, and Project Details).");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Save to Cloud Firestore
      try {
        await saveInquiryToFirestore({
          name,
          email,
          company,
          services: selectedServices,
          budget,
          timeline,
          description: description + (attachedFiles.length > 0 ? `\n[Attachments: ${attachedFiles.map(f => f.name).join(", ")}]` : "")
        });
      } catch (firestoreErr) {
        console.warn("Firestore sync notice:", firestoreErr);
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          services: selectedServices,
          budget,
          timeline,
          description: description + (attachedFiles.length > 0 ? `\n[Attachments: ${attachedFiles.map(f => f.name).join(", ")}]` : "")
        })
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry");
      }

      setSubmitSuccess(true);
      
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"]
        });
      } catch {
        // Safe fallback
      }

      // Reset form
      setName("");
      setEmail("");
      setCompany("");
      setDescription("");
      setAttachedFiles([]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Something went wrong submitting your inquiry. Please try again or reach out directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Guarantees */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                <Send className="w-3.5 h-3.5 text-blue-400" />
                <span>Start a Project</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Let’s Build Something <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                  Remarkable Together.
                </span>
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Tell us about your objectives. Our Principal Creative Director reviews all submissions and replies within 24 hours with an actionable scope recommendation.
              </p>
            </div>

            {/* Guarantees Box */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                The Creative Creator Standard
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">24-Hour Scoping Turnaround</h4>
                    <p className="text-[11px] text-zinc-400">Receive a structured milestone roadmap & pricing proposal within one business day.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">100% IP & Code Ownership</h4>
                    <p className="text-[11px] text-zinc-400">All Figma tokens, video masters, and production repositories transfer to you upon completion.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">No-Jank 60FPS Performance</h4>
                    <p className="text-[11px] text-zinc-400">Guaranteed 95+ Core Web Vitals score on all web builds.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Info */}
            <div className="pt-2 text-xs text-zinc-500 space-y-1">
              <div>Direct Inquiries: <strong className="text-zinc-300 font-mono">hello@creativecreator.agency</strong></div>
              <div>Headquarters: <strong className="text-zinc-300">San Francisco • London • Remote Worldwide</strong></div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
            {submitSuccess ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">
                  Inquiry Dispatched Successfully!
                </h3>
                <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Thank you! Our Creative Director and Technical Architect are reviewing your brief. We will email you your bespoke scope roadmap within 24 hours.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 border border-zinc-800"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 1. Services selection */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2.5">
                    1. Required Disciplines (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceOptions.map((srv) => {
                      const isSelected = selectedServices.includes(srv);
                      return (
                        <button
                          key={srv}
                          type="button"
                          id={`contact-srv-${srv.toLowerCase().replace(/\s+/g, "-")}`}
                          onClick={() => toggleService(srv)}
                          className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? "bg-blue-600/10 border-blue-500/60 text-white ring-1 ring-blue-500/30"
                              : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                          }`}
                        >
                          <span>{srv}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Personal & Company Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                      Your Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        id="input-contact-name"
                        type="text"
                        required
                        placeholder="e.g. Alex Sterling"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                      Work Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        id="input-contact-email"
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Company / Organization (Optional)
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      id="input-contact-company"
                      type="text"
                      placeholder="e.g. Acme Hypermedia"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 3. Budget & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                      Approximate Budget Bracket
                    </label>
                    <select
                      id="select-contact-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      {budgetOptions.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                      Desired Timeline
                    </label>
                    <select
                      id="select-contact-timeline"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      {timelineOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                {/* 4. Project Details */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Project Goals & Specific Deliverables *
                  </label>
                  <textarea
                    id="input-contact-description"
                    rows={4}
                    required
                    placeholder="Describe what you want to create, current pain points, target metrics, or reference links..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                {/* File Attachment Dropzone */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
                    Attach Brand Guidelines / Wireframes (Optional)
                  </label>
                  <div className="border border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl p-4 text-center bg-zinc-900/40 transition-colors">
                    <input
                      id="input-file-attachments"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="input-file-attachments"
                      className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
                    >
                      <UploadCloud className="w-5 h-5 text-zinc-400" />
                      <span className="text-xs text-zinc-300 font-medium">Click or drag & drop files here</span>
                      <span className="text-[10px] text-zinc-500">PDF, PNG, JPG, FIG, ZIP up to 50MB</span>
                    </label>
                  </div>

                  {/* Attached files list */}
                  {attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {attachedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span className="max-w-[120px] truncate">{file.name}</span>
                          <span className="text-zinc-500 text-[10px]">({file.size})</span>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="text-zinc-500 hover:text-red-400 ml-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="btn-submit-inquiry"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-60 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Inquiry Securely...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Project Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
