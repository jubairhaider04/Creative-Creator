import React, { useState } from "react";
import { 
  Star, 
  Quote, 
  TrendingUp, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { TESTIMONIALS } from "../data/testimonialsData";
import { ServiceCategory } from "../types";

export const TestimonialsSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<ServiceCategory | "All">("All");

  const filterOptions: (ServiceCategory | "All")[] = [
    "All",
    "Web Development",
    "Video Editing",
    "Graphic Design",
    "Content Creation"
  ];

  const filteredTestimonials = TESTIMONIALS.filter((t) => {
    return selectedFilter === "All" || t.serviceCategory === selectedFilter;
  });

  return (
    <section id="testimonials" className="py-24 relative border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Client Outcomes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Trusted by High-Growth <br />
              <span className="text-zinc-400">Founders & Global Brands.</span>
            </h2>
          </div>

          {/* Service filter buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                id={`btn-test-filter-${opt.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setSelectedFilter(opt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  selectedFilter === opt
                    ? "bg-zinc-800 text-white border-zinc-600"
                    : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-white"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((t) => (
            <div
              key={t.id}
              id={`testimonial-card-${t.id}`}
              className="p-6 sm:p-7 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Rating & Metric badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <div className="px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{t.impactMetric} {t.metricLabel}</span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  "{t.review}"
                </p>

                <div className="text-[11px] text-zinc-500 font-mono">
                  Project: <span className="text-zinc-300">{t.projectTitle}</span>
                </div>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/60">
                <img
                  src={t.avatar}
                  alt={t.clientName}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{t.clientName}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {t.role} • {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
