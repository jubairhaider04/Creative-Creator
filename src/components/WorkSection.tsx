import React, { useState, useMemo } from "react";
import { 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Play, 
  Search, 
  SlidersHorizontal, 
  Maximize2,
  Calendar,
  Layers,
  Check,
  FolderGit2
} from "lucide-react";
import { Project } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface WorkSectionProps {
  projects?: Project[];
  onSelectProject: (project: Project) => void;
  onOpenFullscreen?: (project: Project, mediaIndex?: number) => void;
  onStartSimilarProject: (project: Project) => void;
  onOpenQuoteCalculator?: () => void;
  onViewServices?: () => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({
  projects = [],
  onSelectProject,
  onOpenFullscreen,
  onStartSimilarProject,
  onOpenQuoteCalculator,
  onViewServices
}) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  // Filter only published projects for public display
  const publishedProjects = useMemo(() => {
    return projects.filter((p) => p.isPublished !== false);
  }, [projects]);

  // Featured Project Selection (featured === true, sorted by sortOrder, or first published)
  const featuredProject = useMemo(() => {
    const featuredList = publishedProjects.filter((p) => p.featured === true);
    if (featuredList.length > 0) {
      featuredList.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
      return featuredList[0];
    }
    return publishedProjects[0] || null;
  }, [publishedProjects]);

  // Dynamic Category Extraction
  const categories = useMemo(() => {
    const set = new Set<string>();
    publishedProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [publishedProjects]);

  // Filtered & Searched Projects for the Project Index
  const filteredProjects = useMemo(() => {
    return publishedProjects.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category?.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        p.title.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.services?.some((s) => s.toLowerCase().includes(q)) ||
        p.technologies?.some((t) => t.toLowerCase().includes(q)) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }).sort((a, b) => {
      const orderA = a.sortOrder ?? 999;
      const orderB = b.sortOrder ?? 999;
      return orderA - orderB;
    });
  }, [publishedProjects, selectedCategory, searchQuery]);

  return (
    <section 
      id="work" 
      aria-label="Bongio Digital Featured Work & Portfolio Archive"
      className="relative py-24 sm:py-32 bg-zinc-950 text-zinc-100 overflow-hidden border-t border-zinc-900"
    >
      {/* Background Ambience / Subtle Lighting Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ======================================================== */}
        {/* 1. SECTION HEADER                                        */}
        {/* ======================================================== */}
        <div className="space-y-4 mb-16 sm:mb-20">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-blue-500" />
            <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-blue-400">
              WORK
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                Selected Work
              </h2>
              <p className="mt-4 text-base sm:text-xl text-zinc-400 font-light max-w-2xl leading-relaxed">
                “Digital experiences built to move brands forward.”
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-500 bg-zinc-900/80 px-3.5 py-1.5 rounded-full border border-zinc-800">
                {publishedProjects.length} Verified Production Cases
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. LARGE FEATURED PROJECT EXPERIENCE                     */}
        {/* ======================================================== */}
        {featuredProject && (
          <div className="mb-24 sm:mb-32">
            <div className="group relative rounded-3xl sm:rounded-[36px] bg-gradient-to-b from-zinc-900/60 to-zinc-950 border border-zinc-800 hover:border-zinc-700/80 transition-all duration-500 overflow-hidden shadow-2xl">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                
                {/* Left Visual Column */}
                <div 
                  className="lg:col-span-7 relative min-h-[340px] sm:min-h-[440px] lg:min-h-[560px] overflow-hidden cursor-pointer"
                  onClick={() => onSelectProject(featuredProject)}
                >
                  <img
                    src={featuredProject.heroImageUrl || featuredProject.thumbnailUrl || featuredProject.thumbnail}
                    alt={featuredProject.title}
                    loading="eager"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent opacity-90 lg:opacity-75" />

                  {/* Top Badge */}
                  <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-blue-600/90 text-white backdrop-blur-md shadow-lg">
                      01 / FEATURED WORK
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono text-zinc-300 bg-black/60 backdrop-blur-md border border-zinc-700">
                      {featuredProject.year}
                    </span>
                  </div>

                  {/* Video Play Icon Indicator if applicable */}
                  {(featuredProject.videoUrl || featuredProject.videoPreviewUrl) && (
                    <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-black/70 backdrop-blur-md border border-zinc-700/80 text-white text-xs font-mono">
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                      <span>Watch Reel</span>
                    </div>
                  )}

                  {/* Fullscreen Expand Button */}
                  {onOpenFullscreen && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFullscreen(featuredProject, 0);
                      }}
                      className="absolute top-6 right-6 p-2.5 rounded-full bg-black/60 hover:bg-black text-white border border-zinc-700/80 backdrop-blur-md transition-all hover:scale-105 z-10"
                      aria-label="View featured project in fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Right Details Column */}
                <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-6 sm:space-y-8 bg-zinc-950/40">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold block">
                        {featuredProject.category} · {featuredProject.clientName || featuredProject.client}
                      </span>
                      <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight group-hover:text-blue-200 transition-colors">
                        {featuredProject.title}
                      </h3>
                    </div>

                    {/* Punchy Narrative Hook */}
                    <div className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed space-y-2 border-l-2 border-blue-500/60 pl-4 py-1">
                      <p className="font-semibold text-white">
                        Automate. Create. Scale.
                      </p>
                      <p className="text-zinc-400 text-xs sm:text-sm">
                        {featuredProject.description || featuredProject.subtitle}
                      </p>
                    </div>

                    {/* Key Metrics Badges */}
                    {(featuredProject.results || featuredProject.metrics) && (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {(featuredProject.results || featuredProject.metrics)?.slice(0, 2).map((m, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
                            <span className="text-lg sm:text-xl font-black text-white font-mono text-blue-400 block">
                              {m.value}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono">
                              {m.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Services Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(featuredProject.services || [featuredProject.category]).slice(0, 4).map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-[10px] bg-zinc-900 text-zinc-300 border border-zinc-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectProject(featuredProject)}
                      className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md"
                    >
                      <span>Explore Project</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onStartSimilarProject(featuredProject)}
                      className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold text-xs transition-colors"
                    >
                      Start a Similar Project
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. INTERACTIVE PROJECT INDEX (SELECTED WORK)             */}
        {/* ======================================================== */}
        <div className="space-y-8">
          
          {/* Index Header & Category Filtering & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Our Work Index
              </h3>
              <p className="text-xs text-zinc-400 font-light mt-0.5">
                Browse our verified production deployments across digital disciplines.
              </p>
            </div>

            {/* Subtle Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, stack, tags..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-zinc-500 hover:text-white text-[10px] absolute right-3 top-1/2 -translate-y-1/2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-zinc-100 text-zinc-950 font-bold shadow-md"
                    : "bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects List / Grid with Interactive Hover */}
          {filteredProjects.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-zinc-900/20 border border-zinc-800 space-y-3">
              <FolderGit2 className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-semibold text-zinc-400">No projects match your filter criteria.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="text-xs text-blue-400 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-900 border-y border-zinc-900">
              {filteredProjects.map((proj, index) => {
                const projectNumber = String(index + 1).padStart(2, "0");
                const isHovered = hoveredProjectId === proj.id;

                return (
                  <div
                    key={proj.id}
                    onMouseEnter={() => setHoveredProjectId(proj.id)}
                    onMouseLeave={() => setHoveredProjectId(null)}
                    onClick={() => onSelectProject(proj)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectProject(proj);
                      }
                    }}
                    className="group py-6 sm:py-8 transition-all duration-300 cursor-pointer outline-none focus-visible:bg-zinc-900/40 focus-visible:px-4 rounded-xl"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
                      
                      {/* Number & Basic Info */}
                      <div className="lg:col-span-4 flex items-start gap-4">
                        <span className="font-mono text-xs font-bold text-zinc-500 group-hover:text-blue-400 transition-colors pt-1">
                          {projectNumber}
                        </span>
                        <div>
                          <span className="text-[11px] uppercase font-mono text-zinc-400 block tracking-wider font-semibold">
                            {proj.category}
                          </span>
                          <h4 className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors tracking-tight">
                            {proj.title}
                          </h4>
                          <span className="text-xs text-zinc-500 font-mono">
                            {proj.clientName || proj.client} • {proj.year}
                          </span>
                        </div>
                      </div>

                      {/* Short Description */}
                      <div className="lg:col-span-5 text-xs sm:text-sm text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {proj.description || proj.subtitle}
                      </div>

                      {/* Thumbnail Preview & Action Button */}
                      <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-4">
                        <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 flex-shrink-0 group-hover:scale-105 group-hover:border-zinc-700 transition-all duration-300">
                          <img
                            src={proj.thumbnailUrl || proj.thumbnail}
                            alt={proj.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="w-10 h-10 rounded-full bg-zinc-900 group-hover:bg-blue-600 text-zinc-400 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                          <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* 4. WORK CTA: WANT ONE LIKE THIS?                         */}
        {/* ======================================================== */}
        <div className="mt-24 sm:mt-32 p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-black border border-zinc-800 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-blue-600/5 blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
              HAVE A PROJECT IN MIND?
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Let’s build something people remember.
            </h3>
            <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
              From high-frequency WebGL interfaces to cinematic 4K video campaigns and autonomous AI workflows, we turn vision into market leadership.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  const contactEl = document.getElementById("contact");
                  if (contactEl) contactEl.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
              >
                Start a Project
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onViewServices) {
                    onViewServices();
                  } else {
                    const servEl = document.getElementById("services");
                    if (servEl) servEl.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold text-xs uppercase tracking-wider transition-colors"
              >
                View Services
              </button>

              {onOpenQuoteCalculator && (
                <button
                  type="button"
                  onClick={onOpenQuoteCalculator}
                  className="px-6 py-3.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 font-mono text-xs transition-colors"
                >
                  Estimate Quote
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
