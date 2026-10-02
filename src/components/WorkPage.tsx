import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowRight, 
  Search, 
  SlidersHorizontal, 
  ExternalLink, 
  Maximize2, 
  Play, 
  FolderGit2,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  Filter
} from "lucide-react";
import { Project } from "../types";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WorkDetailModal } from "./WorkDetailModal";
import { WorkFullscreenViewer } from "./WorkFullscreenViewer";
import { portfolioService } from "../services/portfolioService";
import { PORTFOLIO_PROJECTS } from "../data/portfolioData";

interface WorkPageProps {
  onOpenAiConsultant?: () => void;
  onOpenAnalytics?: () => void;
  onOpenAuth?: () => void;
  onOpenQuoteCalculator?: () => void;
}

export const WorkPage: React.FC<WorkPageProps> = ({
  onOpenAiConsultant = () => {},
  onOpenAnalytics = () => {},
  onOpenAuth = () => {},
  onOpenQuoteCalculator = () => {}
}) => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>(PORTFOLIO_PROJECTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Active detail modal and fullscreen states
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenMediaIndex, setFullscreenMediaIndex] = useState(0);

  // Subscribe to live Firestore portfolio with local cache fallback
  useEffect(() => {
    const unsub = portfolioService.subscribe((liveProjects) => {
      if (liveProjects && liveProjects.length > 0) {
        setProjects(liveProjects);
      }
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  // Filter only published projects for public display
  const publishedProjects = useMemo(() => {
    return projects.filter((p) => p.isPublished !== false);
  }, [projects]);

  // Deep link handle: if slug param is present in URL, open that project detail modal
  useEffect(() => {
    if (slug) {
      const match = publishedProjects.find(
        (p) => (p.slug && p.slug.toLowerCase() === slug.toLowerCase()) || p.id === slug
      );
      if (match) {
        setActiveProject(match);
        setIsDetailOpen(true);
      }
    }
  }, [slug, publishedProjects]);

  // Dynamic SEO updating
  useEffect(() => {
    const defaultTitle = "Bongio Digital — Work & Selected Projects";
    const defaultDesc = "Explore verified production deployments, high-performance web applications, 4K commercial videos, and AI automations by Bongio Digital.";

    if (activeProject && isDetailOpen) {
      const projectTitle = `${activeProject.title} — Bongio Digital Work`;
      const projectDesc = activeProject.description || activeProject.subtitle || defaultDesc;
      const projectImg = activeProject.heroImageUrl || activeProject.thumbnailUrl || activeProject.thumbnail;

      document.title = projectTitle;

      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", projectDesc);

      // Update Open Graph tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", projectTitle);

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", projectDesc);

      let ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg && projectImg) ogImg.setAttribute("content", projectImg);
    } else {
      document.title = defaultTitle;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", defaultDesc);
    }

    return () => {
      document.title = "Bongio Digital — Creative Creator Studio";
    };
  }, [activeProject, isDetailOpen]);

  // Dynamic Category Extraction
  const categories = useMemo(() => {
    const set = new Set<string>();
    publishedProjects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [publishedProjects]);

  // Filtered & Searched Projects
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

  const handleOpenProject = (project: Project) => {
    setActiveProject(project);
    setIsDetailOpen(true);
    if (project.slug) {
      window.history.replaceState(null, "", `/work/${project.slug}`);
    }
  };

  const handleCloseProject = () => {
    setIsDetailOpen(false);
    window.history.replaceState(null, "", "/work");
  };

  const handleOpenFullscreen = (project: Project, mediaIndex = 0) => {
    setActiveProject(project);
    setFullscreenMediaIndex(mediaIndex);
    setIsFullscreenOpen(true);
  };

  const handleStartSimilarProject = (project: Project) => {
    // Navigate to homepage contact section with pre-filled service & brief
    sessionStorage.setItem("bongio_inquiry_prefill", JSON.stringify({
      service: project.category,
      brief: `[Inquiry inspired by Portfolio Project: ${project.title}]\nCategory: ${project.category}\nReference Slug: /work/${project.slug || project.id}\nTarget Timeline: Standard Sprint\nRequirements: `
    }));
    navigate("/#contact");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Navigation */}
      <Navbar
        onOpenAiConsultant={onOpenAiConsultant}
        onOpenAnalytics={onOpenAnalytics}
        onOpenAuth={onOpenAuth}
        onOpenQuoteCalculator={onOpenQuoteCalculator}
      />

      {/* Main Work Catalog Content */}
      <main className="flex-grow pt-24 pb-20 sm:pt-32 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          
          {/* Breadcrumbs & Header */}
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <Link to="/" className="hover:text-zinc-300 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="text-blue-400 font-semibold">Work Archive</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none">
              Selected Work
            </h1>

            <p className="text-base sm:text-xl text-zinc-400 font-light leading-relaxed">
              A curated catalog of client deployments, digital engineering milestones, and commercial video productions engineered by Bongio Digital.
            </p>
          </div>

          {/* Metric Highlights Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-5 sm:p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/80">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono text-blue-400">42+</span>
              <span className="text-xs text-zinc-400 block mt-0.5">Commercial Deployments</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono text-emerald-400">99.8%</span>
              <span className="text-xs text-zinc-400 block mt-0.5">Uptime SLA Standard</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono text-purple-400">14ms</span>
              <span className="text-xs text-zinc-400 block mt-0.5">Streaming Tick Latency</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono text-amber-400">100%</span>
              <span className="text-xs text-zinc-400 block mt-0.5">Bespoke Architecture</span>
            </div>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Pills */}
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

              {/* Search & View Mode */}
              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
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

                <div className="hidden sm:flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-zinc-800 text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-zinc-800 text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Project Catalog Grid / List */}
          {filteredProjects.length === 0 ? (
            <div className="py-24 text-center rounded-3xl bg-zinc-900/20 border border-zinc-800 space-y-3">
              <FolderGit2 className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-base font-semibold text-zinc-400">No portfolio projects match your filters.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="text-xs text-blue-400 hover:underline"
              >
                Reset search & category filter
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((proj, idx) => (
                <div
                  key={proj.id}
                  onClick={() => handleOpenProject(proj)}
                  className="group relative rounded-3xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700/80 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1 shadow-xl"
                >
                  {/* Thumbnail Cover */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                    <img
                      src={proj.thumbnailUrl || proj.thumbnail}
                      alt={proj.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />

                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-zinc-700/60">
                        {proj.category}
                      </span>
                      {proj.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-600 text-white">
                          Featured
                        </span>
                      )}
                    </div>

                    {(proj.videoUrl || proj.videoPreviewUrl) && (
                      <div className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-white">
                        <Play className="w-3.5 h-3.5 fill-white" />
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                        <span>{proj.clientName || proj.client}</span>
                        <span>{proj.year}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors tracking-tight line-clamp-1">
                        {proj.title}
                      </h3>

                      <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
                        {proj.description || proj.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Explore Case Study
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenFullscreen(proj, 0);
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Fullscreen view"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="divide-y divide-zinc-900 border-y border-zinc-900">
              {filteredProjects.map((proj, idx) => (
                <div
                  key={proj.id}
                  onClick={() => handleOpenProject(proj)}
                  className="group py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-zinc-900/30 px-4 rounded-2xl transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-mono font-bold text-zinc-500 pt-1">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">
                          {proj.category}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-xs text-zinc-500 font-mono">
                          {proj.year}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-zinc-400 font-light line-clamp-1 max-w-xl">
                        {proj.description || proj.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs text-zinc-400 font-mono hidden md:inline">
                      {proj.clientName || proj.client}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Work CTA */}
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-black border border-zinc-800 text-center relative overflow-hidden shadow-2xl">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
                START A SIMILAR PROJECT
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Ready to elevate your digital presence?
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 font-light">
                Talk directly with our technical director to explore how these production capabilities apply to your business goals.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/#contact")}
                  className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  Schedule Consultation
                </button>
                <Link
                  to="/"
                  className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-semibold text-xs uppercase tracking-wider transition-colors"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Project Detail Modal */}
      <WorkDetailModal
        isOpen={isDetailOpen}
        project={activeProject}
        allProjects={publishedProjects}
        onClose={handleCloseProject}
        onSelectProject={(p) => {
          setActiveProject(p);
          if (p.slug) {
            window.history.replaceState(null, "", `/work/${p.slug}`);
          }
        }}
        onOpenFullscreen={handleOpenFullscreen}
        onStartSimilarProject={handleStartSimilarProject}
      />

      {/* Fullscreen Media Viewer */}
      <WorkFullscreenViewer
        isOpen={isFullscreenOpen}
        project={activeProject}
        initialIndex={fullscreenMediaIndex}
        onClose={() => setIsFullscreenOpen(false)}
        onNextProject={() => {
          if (!activeProject) return;
          const idx = publishedProjects.findIndex((p) => p.id === activeProject.id);
          const next = idx < publishedProjects.length - 1 ? publishedProjects[idx + 1] : publishedProjects[0];
          setActiveProject(next);
        }}
        onPrevProject={() => {
          if (!activeProject) return;
          const idx = publishedProjects.findIndex((p) => p.id === activeProject.id);
          const prev = idx > 0 ? publishedProjects[idx - 1] : publishedProjects[publishedProjects.length - 1];
          setActiveProject(prev);
        }}
      />

      {/* Footer */}
      <Footer onOpenQuoteCalculator={onOpenQuoteCalculator} />
    </div>
  );
};
