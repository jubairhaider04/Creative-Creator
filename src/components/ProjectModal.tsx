import React, { useState } from "react";
import { 
  X, 
  ExternalLink, 
  Play, 
  CheckCircle2, 
  TrendingUp, 
  Layers, 
  Calendar, 
  User, 
  Share2,
  Code2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Project, ServiceCategory } from "../types";
import { ShareButtons } from "./ShareButtons";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectForInquiry: (category: ServiceCategory) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onSelectForInquiry
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  if (!project) return null;

  return (
    <div 
      id="project-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="project-detail-modal"
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Close & Share Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
              {project.category}
            </span>
            <span className="text-xs text-zinc-500">• {project.year}</span>
          </div>

          <div className="flex items-center gap-3">
            <ShareButtons 
              title={`${project.title} - Creative Creator Portfolio`} 
              url={typeof window !== "undefined" ? window.location.href : ""}
              size="sm"
            />
            <button
              type="button"
              id="btn-close-project-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Preview Stage */}
        <div className="relative bg-black aspect-video sm:aspect-[21/9] overflow-hidden group">
          {isPlayingVideo && project.videoPreviewUrl ? (
            <div className="w-full h-full flex items-center justify-center bg-zinc-950">
              <video 
                src={project.videoPreviewUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <>
              <img 
                src={project.galleryImages[activeImageIdx] || project.thumbnail} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {project.videoPreviewUrl && (
                <button
                  type="button"
                  id="btn-play-project-video"
                  onClick={() => setIsPlayingVideo(true)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
                >
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </button>
              )}
            </>
          )}

          {/* Image thumbnails strip */}
          {project.galleryImages.length > 1 && !isPlayingVideo && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 overflow-x-auto p-1.5 rounded-xl bg-black/60 backdrop-blur-md">
              {project.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIdx === idx ? "border-blue-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 font-normal">
              {project.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>Client: <strong className="text-zinc-300">{project.client}</strong></span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Delivered: <strong className="text-zinc-300">{project.year}</strong></span>
              </span>
            </div>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {project.metrics.map((metric, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="text-2xl font-extrabold text-white mb-0.5">
                  {metric.value}
                </div>
                <div className="text-xs font-semibold text-blue-400 mb-0.5">
                  {metric.label}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {metric.description}
                </div>
              </div>
            ))}
          </div>

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800">
              <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                The Client Challenge
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {project.challenge}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                Our Strategic Solution
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Deliverables Checklist */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
              Key Deliverables Handed Over
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.deliverables.map((deliv, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{deliv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Tech Stack & Toolchain
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
            <div className="text-xs text-zinc-400">
              Need similar results for your product or brand?
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="#contact"
                id="btn-modal-inquire-similar"
                onClick={() => {
                  onClose();
                  onSelectForInquiry(project.category);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Inquire for Similar Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
