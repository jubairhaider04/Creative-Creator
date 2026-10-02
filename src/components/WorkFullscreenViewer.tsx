import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, ExternalLink } from "lucide-react";
import { Project, ProjectGalleryItem } from "../types";

interface WorkFullscreenViewerProps {
  isOpen: boolean;
  project: Project | null;
  initialIndex?: number;
  onClose: () => void;
  onNextProject?: () => void;
  onPrevProject?: () => void;
}

export const WorkFullscreenViewer: React.FC<WorkFullscreenViewerProps> = ({
  isOpen,
  project,
  initialIndex = 0,
  onClose,
  onNextProject,
  onPrevProject
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = React.useState(initialIndex);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    setActiveMediaIndex(initialIndex);
  }, [initialIndex, project?.id]);

  // Lock body scroll and handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, activeMediaIndex, project]);

  if (!isOpen || !project) return null;

  // Build media items list: hero first, then gallery items
  const mediaItems: { url: string; caption?: string; alt?: string; isVideo?: boolean }[] = [];

  const mainImage = project.heroImageUrl || project.thumbnailUrl || project.thumbnail;
  if (mainImage) {
    mediaItems.push({
      url: mainImage,
      caption: project.subtitle || project.title,
      alt: project.title
    });
  }

  if (project.gallery && project.gallery.length > 0) {
    project.gallery.forEach((g) => {
      if (g.url && g.url !== mainImage) {
        mediaItems.push({
          url: g.url,
          caption: g.caption,
          alt: g.alt || project.title
        });
      }
    });
  } else if (project.galleryImages && project.galleryImages.length > 0) {
    project.galleryImages.forEach((url, i) => {
      if (url && url !== mainImage) {
        mediaItems.push({
          url,
          caption: `${project.title} - Showcase ${i + 1}`,
          alt: project.title
        });
      }
    });
  }

  const currentMedia = mediaItems[activeMediaIndex] || mediaItems[0];
  const totalCount = mediaItems.length;

  const handleNext = () => {
    if (activeMediaIndex < totalCount - 1) {
      setActiveMediaIndex((prev) => prev + 1);
    } else if (onNextProject) {
      onNextProject();
      setActiveMediaIndex(0);
    } else {
      setActiveMediaIndex(0);
    }
  };

  const handlePrev = () => {
    if (activeMediaIndex > 0) {
      setActiveMediaIndex((prev) => prev - 1);
    } else if (onPrevProject) {
      onPrevProject();
      setActiveMediaIndex(0);
    } else {
      setActiveMediaIndex(totalCount - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} Fullscreen Media Showcase`}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none animate-in fade-in duration-200"
    >
      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-black/60 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest bg-zinc-800 text-zinc-300 border border-zinc-700">
            {project.category}
          </span>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">
              {project.title}
            </h2>
            <p className="text-[11px] text-zinc-400 font-mono">
              {project.clientName || project.client} • {project.year}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-400">
            {activeMediaIndex + 1} / {totalCount || 1}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
            aria-label="Close fullscreen view (Escape)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Center Media Stage */}
      <main className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {currentMedia ? (
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <img
              src={currentMedia.url}
              alt={currentMedia.alt || project.title}
              className="max-h-[82vh] max-w-[94vw] object-contain rounded-xl shadow-2xl transition-all duration-300"
            />
          </div>
        ) : (
          <div className="text-zinc-500 text-sm font-mono">Media preview unavailable</div>
        )}

        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          aria-label="Previous image (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          aria-label="Next image (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </main>

      {/* Bottom Footer Caption & Thumbnails */}
      <footer className="px-6 py-4 border-t border-zinc-900 bg-black/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
        <p className="text-xs text-zinc-300 text-center sm:text-left max-w-2xl font-light">
          {currentMedia?.caption || project.subtitle || project.description}
        </p>

        {/* Thumbnail Dots / Strips */}
        {totalCount > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs py-1">
            {mediaItems.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveMediaIndex(idx)}
                className={`h-1.5 transition-all rounded-full ${
                  idx === activeMediaIndex ? "w-6 bg-blue-500" : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Project Switcher */}
        <div className="flex items-center gap-2">
          {onPrevProject && (
            <button
              type="button"
              onClick={onPrevProject}
              className="text-[11px] text-zinc-400 hover:text-white transition-colors"
            >
              ← Prev Project
            </button>
          )}
          {onPrevProject && onNextProject && <span className="text-zinc-600">•</span>}
          {onNextProject && (
            <button
              type="button"
              onClick={onNextProject}
              className="text-[11px] text-zinc-400 hover:text-white transition-colors"
            >
              Next Project →
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
