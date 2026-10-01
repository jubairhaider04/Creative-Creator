import React, { useState } from "react";
import { 
  Send, 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  X, 
  Sparkles, 
  Clock, 
  ShieldCheck,
  Building,
  Mail,
  User,
  AlertCircle,
  Loader2
} from "lucide-react";
import confetti from "canvas-confetti";
import { saveInquiryToFirestore, submitContactMessageFirestore } from "../lib/firebase";
import { useLanguage } from "../context/LanguageContext";

interface ContactSectionProps {
  prefilledBrief?: string;
  prefilledServices?: string[];
  prefilledBudget?: string;
  prefilledTimeline?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  prefilledBrief = "",
  prefilledServices = ["Web Development"],
  prefilledBudget = "৳ 25,000 - ৳ 50,000 BDT",
  prefilledTimeline = "10 - 14 Days"
}) => {
  const { t, language } = useLanguage();
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

  const budgetOptions = language === "bn" ? [
    "৳ ১০,০০০ - ৳ ২৫,০০০ (স্টার্টার প্যাকেজ)",
    "৳ ২৫,০০০ - ৳ ৫০,০০০ (গ্রোথ প্যাকেজ - সবচেয়ে জনপ্রিয়)",
    "৳ ৫০,০০০ - ৳ ১,০০,০০০ (স্কেল প্যাকেজ)",
    "৳ ১,০০,০০০+ (ফুল এন্টারপ্রাইজ সল্যুশন)"
  ] : language === "es" ? [
    "$100 - $250 (Nivel Inicial)",
    "$250 - $500 (Nivel Crecimiento - Popular)",
    "$500 - $1,000 (Nivel Escala)",
    "$1,000+ (Solución Corporativa)"
  ] : [
    "$100 - $250 (Starter Tier)",
    "$250 - $500 (Growth Tier - Popular)",
    "$500 - $1,000 (Scale Tier)",
    "$1,000+ (Enterprise Full Studio)"
  ];

  const timelineOptions = language === "bn" ? [
    "৫-৭ দিন (জরুরি / রাশ ডেলিভারি)",
    "১০-১৪ দিন (স্ট্যান্ডার্ড টাইমলাইন)",
    "৩-৪ সপ্তাহ (কম্প্রিহেনসিভ প্রজেক্ট)",
    "মাসিক রিটেইনার পার্টনারশিপ"
  ] : language === "es" ? [
    "5 - 7 Días (Entrega Urgente)",
    "10 - 14 Días (Plazo Estándar)",
    "3 - 4 Semanas (Proyecto Completo)",
    "Contrato Mensual Continuo"
  ] : [
    "5 - 7 Days (Rush Delivery)",
    "10 - 14 Days (Standard Sprint)",
    "3 - 4 Weeks (Comprehensive Project)",
    "Monthly Studio Retainer"
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
      // Save to Cloud Firestore contactMessages and leads
      try {
        await submitContactMessageFirestore({
          name,
          email,
          phone: "",
          company,
          subject: selectedServices.join(", ") || "Project Inquiry",
          message: description + (attachedFiles.length > 0 ? `\n[Attachments: ${attachedFiles.map(f => f.name).join(", ")}]` : "")
        });
      } catch (firestoreErr) {
        console.warn("Firestore contactMessages sync notice:", firestoreErr);
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
                <span>{t.contactBadge}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {t.contactTitle} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                  {t.contactSubtitle}
                </span>
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                {language === "bn"
                  ? "আপনার প্রজেক্টের লক্ষ্য ও বাজেট জানান। আমাদের টিম ২৪ ঘণ্টার মধ্যে কাস্টম প্রপোজাল সহ যোগাযোগ করবে।"
                  : "Tell us about your objectives. Our team will review your requirements and respond within 24 hours with an actionable roadmap."}
              </p>
            </div>

            {/* Guarantees Box */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                {language === "bn" ? "আমাদের কোয়ালিটি অঙ্গীকার" : "The Bongio Digital Standard"}
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {language === "bn" ? "২৪ ঘণ্টার মধ্যে স্কোপিং ফিডব্যাক" : "24-Hour Scoping Turnaround"}
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      {language === "bn" ? "১ কার্যদিবসের মধ্যে পূর্ণাঙ্গ রোডম্যাপ ও মূল্য প্রস্তাবনা।" : "Receive a structured milestone roadmap & pricing proposal within one business day."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {language === "bn" ? "১০০% সোর্স কোড ও ডিজাইন মালিকানা" : "100% IP & Code Ownership"}
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      {language === "bn" ? "কাজ শেষে সমস্ত কোড, ভেক্টর ও প্রোডাকশন ফাইলস সরাসরি হস্তান্তর।" : "All Figma tokens, video masters, and production repositories transfer to you upon completion."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {language === "bn" ? "সর্বোচ্চ স্পিড ও কোয়ালিটি গ্যারান্টি" : "Top Performance Guarantee"}
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      {language === "bn" ? "ওয়েবসাইট ও ডিজিটাল অ্যাসেটের সর্বোচ্চ স্পিড ও মসৃণ ইউজার এক্সপেরিয়েন্স।" : "Guaranteed 95+ Core Web Vitals score on all modern web builds."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Info & WhatsApp */}
            <div className="pt-2 space-y-3">
              <a
                href="https://wa.me/8801676056414?text=Hi%2C%20I%20found%20your%20portfolio%20on%20Creative%20Creator%20and%20would%20like%20to%20discuss%20a%20project!"
                target="_blank"
                rel="noopener noreferrer"
                id="btn-contact-whatsapp-direct"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-900/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center">
                    <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814 3.183 0 5.768-2.587 5.768-5.766 0-3.18-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.519-4.481 10-10 10-1.745 0-3.385-.45-4.814-1.239l-5.186 1.36 1.385-5.06c-.868-1.488-1.385-3.218-1.385-5.061 0-5.519 4.481-10 10-10s10 4.481 10 10z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{language === "bn" ? "হোয়াটসঅ্যাপে কথা বলতে চান?" : "Prefer WhatsApp?"}</span>
                      <span className="text-[10px] text-emerald-400 font-normal bg-emerald-500/10 px-1.5 py-0.2 rounded">Fastest</span>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-300">+880 1676-056414</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  {language === "bn" ? "মেসেজ দিন →" : "Chat Now →"}
                </span>
              </a>

              <div className="text-xs text-zinc-500 space-y-1">
                <div>Direct Inquiries: <strong className="text-zinc-300 font-mono">hello@creativecreator.agency</strong></div>
                <div>Headquarters: <strong className="text-zinc-300">Dhaka, Bangladesh • Global Remote</strong></div>
              </div>
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
                  {language === "bn" ? "ইনকোয়ারি সফলভাবে গ্রহণ করা হয়েছে!" : "Inquiry Dispatched Successfully!"}
                </h3>
                <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                  {language === "bn" 
                    ? "ধন্যবাদ! আমাদের টিম আপনার ব্রিফ পর্যালোচনা করছে। ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করা হবে।"
                    : "Thank you! Our Creative Director and Technical Architect are reviewing your brief. We will email you your bespoke scope roadmap within 24 hours."}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setSubmitSuccess(false)}
                    className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 border border-zinc-800"
                  >
                    {language === "bn" ? "আরেকটি ইনকোয়ারি পাঠান" : "Submit Another Inquiry"}
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
                    {language === "bn" ? "১. প্রয়োজনীয় সার্ভিস (প্রযোজ্য সবগুলো নির্বাচন করুন)" : "1. Required Disciplines (Select all that apply)"}
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
                      {language === "bn" ? "আপনার নাম *" : "Your Name *"}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        id="input-contact-name"
                        type="text"
                        required
                        placeholder={language === "bn" ? "যেমন: হাসান মাহমুদ" : "e.g. Alex Sterling"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                      {language === "bn" ? "ইমেইল অ্যাড্রেস *" : "Work Email *"}
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
                    {language === "bn" ? "কোম্পানি / ব্যবসার নাম (ঐচ্ছিক)" : "Company / Business Name (Optional)"}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      id="input-contact-company"
                      type="text"
                      placeholder={language === "bn" ? "যেমন: ঢাকা ফ্যাশন হাউজ" : "e.g. Acme Enterprise"}
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
                      {language === "bn" ? "বাজেট ব্র্যাকেট" : "Approximate Budget Bracket"}
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
                      {language === "bn" ? "কাঙ্ক্ষিত সময়সীমা" : "Desired Timeline"}
                    </label>
                    <select
                      id="select-contact-timeline"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      {timelineOptions.map(to => <option key={to} value={to}>{to}</option>)}
                    </select>
                  </div>
                </div>

                {/* 4. Project Details */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    {language === "bn" ? "প্রজেক্টের বিবরণ ও লক্ষ্য *" : "Project Goals & Specific Deliverables *"}
                  </label>
                  <textarea
                    id="input-contact-description"
                    rows={4}
                    required
                    placeholder={language === "bn" 
                      ? "আপনার কি ধরনের কাজ প্রয়োজন, রেফারেন্স ওয়েবসাইট বা ফেসবুক পেইজের লিংক উল্লেখ করুন..." 
                      : "Describe what you want to create, current pain points, target metrics, or reference links..."}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                {/* File Attachment Dropzone */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
                    {language === "bn" ? "ব্র্যান্ড ফাইল / লোগো অ্যাটাচ করুন (ঐচ্ছিক)" : "Attach Brand Guidelines / Files (Optional)"}
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
                      <span className="text-xs text-zinc-300 font-medium">
                        {language === "bn" ? "ফাইল আপলোড করতে ক্লিক করুন বা টেনে আনুন" : "Click or drag & drop files here"}
                      </span>
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
                      <span>{language === "bn" ? "পাঠানো হচ্ছে..." : "Transmitting Inquiry..."}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.contactSubmitBtn}</span>
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
