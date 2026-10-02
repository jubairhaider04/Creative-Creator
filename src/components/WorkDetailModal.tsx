import React, { useState, useEffect } from "react";
import { 
  X, 
  ExternalLink, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Code2, 
  Play, 
  MessageSquarePlus,
  Share2,
  Calendar,
  Building,
  Target
} from "lucide-react";
import { Project } from "../types";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { saveInquiryToFirestore } from "../lib/firebase";

interface WorkDetailModalProps {
  isOpen: boolean;
  project: Project | null;
  allProjects?: Project[];
  onClose: () => void;
  onSelectProject?: (project: Project) => void;
  onOpenFullscreen?: (project: Project, mediaIndex?: number) => void;
  onStartSimilarProject: (project: Project) => void;
}

export const WorkDetailModal: React.FC<WorkDetailModalProps> = ({
  isOpen,
  project,
  allProjects = [],
  onClose,
  onSelectProject,
  onOpenFullscreen,
  onStartSimilarProject
}) => {
  const { user, profile, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [clientInquiryStatus, setClientInquiryStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [copiedLink, setCopiedLink] = useState(false);

  // Prevent background scroll
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
  }, [isOpen]);

  useEffect(() => {
    setActiveMediaIndex(0);
    setIsPlayingVideo(false);
    setClientInquiryStatus("idle");
  }, [project?.id]);

  if (!isOpen || !project) return null;

  // Ordering calculations for previous/next project navigation
  const currentIndex = allProjects.findIndex((p) => p.id === project.id || p.slug === project.slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  const galleryList = (project.gallery && project.gallery.length > 0)
    ? project.gallery
    : (project.galleryImages || []).map((url, i) => ({
        url,
        caption: `${project.title} - Showcase ${i + 1}`,
        alt: project.title
      }));

  const servicesList = project.services || [project.category];
  const techList = project.technologies || project.techStack || [];
  const resultsList = project.results || project.metrics || [];

  const videoSource = project.videoUrl || project.videoPreviewUrl;
  const isYoutube = videoSource?.includes("youtube.com") || videoSource?.includes("youtu.be");
  const isVimeo = videoSource?.includes("vimeo.com");

  // Client quick discuss inquiry
  const handleClientDiscussProject = async () => {
    if (!user?.uid) return;
    setClientInquiryStatus("submitting");
    try {
      await saveInquiryToFirestore({
        name: profile?.displayName || profile?.fullName || user.displayName || "Client Partner",
        email: user.email || "",
        company: profile?.company || profile?.companyName || "Direct Client",
        services: [project.category],
        budget: "Custom Scope",
        timeline: "Standard Sprint",
        description: `Client requested to discuss a similar project modeled after case study: "${project.title}" (ID: ${project.id}).`,
        userId: user.uid
      });
      setClientInquiryStatus("success");
    } catch (err) {
      console.error("Failed to create client project discussion inquiry:", err);
      setClientInquiryStatus("idle");
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/work/${project.slug || project.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} Case Study Details`}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div 
        className="relative w-full max-w-5xl h-full sm:h-[92vh] bg-zinc-950 border border-zinc-800/80 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[11px] font-black tracking-widest uppercase text-blue-400 font-mono">
              BONGIO DIGITAL
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs text-zinc-400 font-mono">
              PROJECT {currentIndex >= 0 ? String(currentIndex + 1).padStart(2, "0") : "01"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-xs flex items-center gap-1.5"
              title="Copy share link"
              aria-label="Share case study"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-mono">{copiedLink ? "Copied!" : "Share"}</span>
            </button>

            {onOpenFullscreen && (
              <button
                type="button"
                onClick={() => onOpenFullscreen(project, 0)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                title="Open fullscreen view"
                aria-label="Fullscreen view"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
              aria-label="Close modal (Escape)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8 py-6 space-y-8 scrollbar-thin scrollbar-thumb-zinc-800">
          
          {/* 1. Project Title & Metadata Header */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] uppercase font-bold tracking-wider bg-blue-950/60 text-blue-400 border border-blue-500/30">
                {project.category}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-zinc-500" />
                {project.year}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 flex items-center gap-1.5">
                <Building className="w-3 h-3 text-zinc-500" />
                {project.clientName || project.client}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {project.title}
            </h1>

            {project.subtitle && (
              <p className="text-base sm:text-lg text-zinc-400 font-light leading-relaxed max-w-3xl">
                {project.subtitle}
              </p>
            )}
          </div>

          {/* 2. Hero Visual / Interactive Video Stage */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/40 group">
            {videoSource && isPlayingVideo ? (
              <div className="aspect-video w-full bg-black">
                {isYoutube ? (
                  <iframe
                    src={videoSource.replace("watch?v=", "embed/") + "?autoplay=1"}
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={project.title}
                  />
                ) : isVimeo ? (
                  <iframe
                    src={videoSource.replace("vimeo.com/", "player.vimeo.com/video/") + "?autoplay=1"}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title={project.title}
                  />
                ) : (
                  <video
                    src={videoSource}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            ) : (
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={project.heroImageUrl || project.thumbnailUrl || project.thumbnail}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />

                {/* Video Play Trigger if available */}
                {videoSource && (
                  <button
                    type="button"
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute inset-0 flex items-center justify-center group/play cursor-pointer"
                    aria-label="Play project video preview"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl transition-all duration-300 group-hover/play:scale-110 group-hover/play:shadow-blue-500/50">
                      <Play className="w-7 h-7 fill-white translate-x-0.5" />
                    </div>
                  </button>
                )}

                {/* Fullscreen Badge */}
                {onOpenFullscreen && (
                  <button
                    type="button"
                    onClick={() => onOpenFullscreen(project, 0)}
                    className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white border border-zinc-700/60 backdrop-blur-md transition-all hover:scale-105"
                    aria-label="Expand media to fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3. Executive Summary / About the Project */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-mono font-bold tracking-widest text-zinc-500">
              ABOUT THE PROJECT
            </h3>
            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-light">
              {project.description || project.subtitle}
            </p>
          </div>

          {/* 4. Challenge & Solution Grid */}
          {(project.challenge || project.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {project.challenge && (
                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Target className="w-4 h-4" />
                    <span>THE CHALLENGE</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                    {project.challenge}
                  </p>
                </div>
              )}

              {project.solution && (
                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>OUR SOLUTION</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 5. Quantifiable Impact / Results Badges */}
          {resultsList.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-mono font-bold tracking-widest text-zinc-500">
                PROVEN RESULTS & METRICS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {resultsList.map((res, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center sm:text-left space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono text-blue-400">
                      {res.value}
                    </div>
                    <div className="text-xs font-bold text-zinc-200">
                      {res.label}
                    </div>
                    {res.description && (
                      <p className="text-[11px] text-zinc-400 font-light">
                        {res.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Services & Technologies Architecture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-zinc-900">
            {/* Services */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-mono font-bold tracking-widest text-zinc-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span>SERVICES PROVIDED</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {servicesList.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs bg-zinc-900 text-zinc-200 border border-zinc-800 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-mono font-bold tracking-widest text-zinc-500 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>TECHNOLOGIES & TOOLS</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {techList.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs bg-zinc-900 text-zinc-400 border border-zinc-800 font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 7. Additional Gallery Showcase */}
          {galleryList.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-mono font-bold tracking-widest text-zinc-500">
                  PROJECT GALLERY ({galleryList.length})
                </h3>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Click any image to view fullscreen
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {galleryList.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onOpenFullscreen && onOpenFullscreen(project, idx)}
                    className="group relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 aspect-video cursor-pointer hover:border-zinc-600 transition-all"
                  >
                    <img
                      src={item.url}
                      alt={item.alt || `${project.title} - ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                      <p className="text-xs text-white font-medium line-clamp-2">
                        {item.caption || "Click to expand"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Strong Call to Action Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-950/40 via-zinc-900/80 to-zinc-950 border border-blue-500/30 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 font-mono">
                WANT ONE LIKE THIS?
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Start a Similar Project with Bongio Digital
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl font-light">
                We will engineer a high-craft execution roadmap matching this quality standard for your business.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartSimilarProject(project);
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Start a Similar Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-medium text-xs flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  <span>View Live Deployment</span>
                </a>
              )}

              {/* Authenticated Client Quick-Connect */}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={handleClientDiscussProject}
                  disabled={clientInquiryStatus !== "idle"}
                  className="px-4 py-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 font-medium text-xs flex items-center gap-2 transition-colors"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {clientInquiryStatus === "submitting" 
                      ? "Recording..." 
                      : clientInquiryStatus === "success" 
                      ? "Inquiry Sent to Your Dashboard!" 
                      : "Discuss as Client"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Project Navigator (Previous / Next) */}
        <footer className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md flex items-center justify-between z-20">
          {prevProject ? (
            <button
              type="button"
              onClick={() => onSelectProject && onSelectProject(prevProject)}
              className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors group text-left"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-mono">Previous Project</span>
                <span className="font-bold text-zinc-300 group-hover:text-white truncate max-w-[140px] sm:max-w-xs block">
                  {prevProject.title}
                </span>
              </div>
            </button>
          ) : <div />}

          {nextProject ? (
            <button
              type="button"
              onClick={() => onSelectProject && onSelectProject(nextProject)}
              className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors group text-right"
            >
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-mono">Next Project</span>
                <span className="font-bold text-zinc-300 group-hover:text-white truncate max-w-[140px] sm:max-w-xs block">
                  {nextProject.title}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : <div />}
        </footer>
      </div>
    </div>
  );
};
