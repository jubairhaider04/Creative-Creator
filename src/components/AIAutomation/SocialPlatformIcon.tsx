import React from "react";
import { SocialPlatform } from "../../data/aiAutomationData";

interface SocialPlatformIconProps {
  platform: SocialPlatform;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  isFloating?: boolean;
}

export const SocialPlatformIcon: React.FC<SocialPlatformIconProps> = ({
  platform,
  size = "md",
  showLabel = false,
  className = "",
  isFloating = false
}) => {
  const renderSvg = () => {
    switch (platform.id) {
      case "messenger":
        // Official Facebook Messenger Icon
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            fill="currentColor"
            role="img"
            aria-label="Facebook Messenger"
          >
            <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.915 1.455 5.525 3.738 7.228V22l3.354-1.844c.919.255 1.897.394 2.908.394 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm1.042 12.456l-2.667-2.845-5.208 2.845 5.729-6.083 2.73 2.845 5.145-2.845-5.729 6.083z" />
          </svg>
        );

      case "whatsapp":
        // Official WhatsApp Icon
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            fill="currentColor"
            role="img"
            aria-label="WhatsApp"
          >
            <path d="M17.507 14.301c-.276-.138-1.636-.807-1.89-.9-.253-.092-.437-.138-.621.138-.184.276-.713.9-875 1.084-.161.184-.323.207-.6.069-.276-.138-1.168-.431-2.225-1.373-.822-.733-1.377-1.639-1.538-1.915-.161-.276-.017-.425.121-.562.124-.124.276-.323.414-.484.138-.161.184-.276.276-.461.092-.184.046-.346-.023-.484-.069-.138-.621-1.496-.851-2.05-.224-.539-.452-.466-.621-.475-.161-.008-.346-.01-.529-.01-.184 0-.483.069-.736.346-.253.276-.966.945-.966 2.304 0 1.359.989 2.671 1.127 2.855.138.184 1.947 2.973 4.717 4.168.659.284 1.174.454 1.576.581.662.21 1.265.18 1.742.109.532-.079 1.636-.669 1.866-1.314.23-.645.23-1.198.161-1.314-.069-.115-.253-.184-.529-.323zM12.046 2C6.524 2 2.036 6.488 2.036 12.01c0 1.763.459 3.483 1.332 5.003L2 22.046l5.176-1.358a9.957 9.957 0 0 0 4.87 1.268h.004c5.522 0 10.01-4.488 10.01-10.01C22.06 6.488 17.568 2 12.046 2z" />
          </svg>
        );

      case "instagram":
        // Official Instagram Icon
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            fill="currentColor"
            role="img"
            aria-label="Instagram"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );

      case "tiktok":
        // Official TikTok Icon
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            fill="currentColor"
            role="img"
            aria-label="TikTok"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.34 6.34 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 9.07 5.71 6.31 6.31 0 0 0 3.61-5.71V9.08a8.27 8.27 0 0 0 4.77 1.51V7.14a4.84 4.84 0 0 1-1-.45z" />
          </svg>
        );

      case "imo":
        // Official IMO Style Icon (Messaging chat with speech loop and double wave)
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            fill="currentColor"
            role="img"
            aria-label="IMO"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.93.55 3.73 1.5 5.25L2.3 21.7l4.57-1.18A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-4.5 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm4.5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm4.5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-9 6.2c.4 1.8 2.2 3.1 4.5 3.1s4.1-1.3 4.5-3.1H7.5z" />
          </svg>
        );

      default:
        return null;
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8 p-1.5",
    md: "w-11 h-11 p-2.5",
    lg: "w-14 h-14 p-3.5"
  };

  return (
    <div
      className={`relative inline-flex items-center gap-2 group ${
        isFloating ? "animate-pulse" : ""
      } ${className}`}
      style={{
        filter: `drop-shadow(0 0 12px ${platform.glowColor})`
      }}
    >
      <div
        className={`rounded-2xl transition-all duration-300 flex items-center justify-center border border-white/10 backdrop-blur-md bg-zinc-900/90 text-white group-hover:scale-110 group-hover:border-white/30 ${sizeClasses[size]}`}
        style={{
          boxShadow: `0 8px 24px -4px ${platform.glowColor}`
        }}
      >
        <div style={{ color: platform.brandColor }} className="w-full h-full flex items-center justify-center">
          {renderSvg()}
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white tracking-wide">
            {platform.shortName}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {platform.activeUsersLabel}
          </span>
        </div>
      )}
    </div>
  );
};
