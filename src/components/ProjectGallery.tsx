import React, { useState } from "react";
import { 
  Search, 
  Play, 
  ArrowUpRight, 
  Sparkles
} from "lucide-react";
import { Project, ServiceCategory } from "../types";
import { PORTFOLIO_PROJECTS } from "../data/portfolioData";
import { ProjectModal } from "./ProjectModal";
import { useLanguage } from "../context/LanguageContext";

interface ProjectGalleryProps {
  selectedCategory: ServiceCategory | "All";
  onSelectCategory: (category: ServiceCategory | "All") => void;
  onSelectForInquiry: (category: ServiceCategory) => void;
  projects?: Project[];
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectForInquiry,
  projects = PORTFOLIO_PROJECTS
}) => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories: (ServiceCategory | "All")[] = [
    "All",
    "Web Development",
    "Content Creation",
    "Video Editing",
    "Graphic Design",
  ];

  const getCategoryLabel = (cat: ServiceCategory | "All") => {
    if (cat === "All") return t.showcaseAll;
    if (cat === "Web Development") return t.servicesWebDev;
    if (cat === "Content Creation") return t.servicesContentCreation;
    if (cat === "Video Editing") return t.servicesVideoEditing;
    if (cat === "Graphic Design") return t.servicesGraphicDesign;
    return cat;
  };

  const filteredProjects = projects.filter((proj) => {
    const matchesCategory = selectedCategory === "All" || proj.category === selectedCategory;
    const matchesSearch = 
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="showcase" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.showcaseBadge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {t.showcaseTitle} <br />
              <span className="text-zinc-400">{t.showcaseSubtitle}</span>
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              id="input-gallery-search"
              type="text"
              placeholder={language === "bn" ? "সার্চ করুন..." : "Search stack, client, tag..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                {language === "bn" ? "মুছুন" : "Clear"}
              </button>
            )}
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                id={`btn-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => {
                  if (typeof onSelectCategory === "function") {
                    onSelectCategory(cat);
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-white text-zinc-950 border-white shadow-lg shadow-white/10"
                    : "bg-zinc-900/70 text-zinc-400 border-zinc-800/80 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {getCategoryLabel(cat)}
                {cat === "All" ? ` (${projects.length})` : ` (${projects.filter(p => p.category === cat).length})`}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800/60 p-8">
            <p className="text-zinc-400 text-sm mb-4">
              {language === "bn" ? "কোনো প্রজেক্ট পাওয়া যায়নি।" : "No projects matched your search criteria."}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                if (typeof onSelectCategory === "function") {
                  onSelectCategory("All");
                }
              }}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700"
            >
              {language === "bn" ? "ফিল্টার রিসেট করুন" : "Reset Filters"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              return (
                <div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  onClick={() => setActiveProject(project)}
                  className="group relative cursor-pointer rounded-2xl transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02]"
                >
                  {/* Subtle Ambient Glow Aura on Hover */}
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-blue-500/0 via-indigo-500/0 to-emerald-500/0 opacity-0 group-hover:opacity-100 group-hover:from-blue-500/25 group-hover:via-indigo-500/20 group-hover:to-cyan-400/20 blur-xl transition-all duration-500 -z-10 pointer-events-none" />

                  {/* Card Container with border glow */}
                  <div className="h-full bg-zinc-900/70 group-hover:bg-zinc-900/95 border border-zinc-800/80 group-hover:border-blue-500/40 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-[0_12px_36px_-8px_rgba(59,130,246,0.22)] transition-all duration-300 flex flex-col backdrop-blur-sm">
                    
                    {/* Card Thumbnail Container */}
                    <div className="relative aspect-video overflow-hidden bg-black">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />

                      {/* Subtle Top Gradient Sheen */}
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                      {/* Category pill with hover glow */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                        <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white group-hover:border-blue-400/50 transition-colors">
                          {project.category}
                        </span>
                      </div>

                      {/* Video badge if available */}
                      {project.videoPreviewUrl && (
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600/90 backdrop-blur-md text-[10px] font-bold text-white shadow-md group-hover:bg-blue-500 transition-colors">
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>{project.videoDuration || "Video"}</span>
                        </div>
                      )}

                      {/* Quick Metric overlay badge */}
                      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between p-2.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 group-hover:border-white/20 text-[11px] transition-all">
                        <span className="text-zinc-400">{project.metrics[0].label}</span>
                        <span className="font-bold text-emerald-400 tracking-tight">{project.metrics[0].value}</span>
                      </div>
                    </div>

                    {/* Card Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5 font-medium">
                          <span>{project.client}</span>
                          <span>{project.year}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 mb-1.5">
                          {project.title}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                          {project.subtitle}
                        </p>
                      </div>

                      <div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-zinc-800/80 group-hover:bg-zinc-800 text-[10px] font-mono text-zinc-300 border border-zinc-700/30 group-hover:border-zinc-700/60 transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-500">
                              +{project.tags.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Footer link */}
                        <div className="pt-3 border-t border-zinc-800/80 group-hover:border-zinc-800 flex items-center justify-between text-xs text-blue-400 font-medium transition-colors">
                          <span className="group-hover:text-blue-300">{t.showcaseViewProject}</span>
                          <ArrowUpRight className="w-4 h-4 text-blue-400 group-hover:text-blue-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
          onSelectForInquiry={onSelectForInquiry}
        />
      )}
    </section>
  );
};
