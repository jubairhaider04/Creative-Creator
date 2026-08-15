import React, { useState } from "react";
import { Share2, Check, Twitter, Linkedin, Facebook, Link2, MessageSquare } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url?: string;
  description?: string;
  tags?: string[];
  size?: "sm" | "md";
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  url = typeof window !== "undefined" ? window.location.href : "https://creativecreator.agency",
  description = "Check out this digital showcase on Creative Creator.",
  tags = ["Design", "WebDev", "CreativeCreator"],
  size = "md"
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch {
        // User cancelled or failed
      }
    } else {
      handleCopyLink();
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);
  const encodedTags = encodeURIComponent(tags.join(","));

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${encodedTags}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;

  const iconSizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const btnClass = size === "sm" 
    ? "p-1.5 rounded-md bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
    : "p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors";

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <button
        type="button"
        id="btn-native-share"
        onClick={handleNativeShare}
        title="Share"
        className={`${btnClass} flex items-center gap-1.5 text-xs font-medium`}
      >
        <Share2 className={iconSizeClass} />
        {size === "md" && <span>Share</span>}
      </button>

      <a
        id="btn-share-twitter"
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on X (Twitter)"
        className={btnClass}
      >
        <Twitter className={iconSizeClass} />
      </a>

      <a
        id="btn-share-linkedin"
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on LinkedIn"
        className={btnClass}
      >
        <Linkedin className={iconSizeClass} />
      </a>

      <a
        id="btn-share-facebook"
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share on Facebook"
        className={btnClass}
      >
        <Facebook className={iconSizeClass} />
      </a>

      <a
        id="btn-share-whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Share via WhatsApp"
        className={btnClass}
      >
        <MessageSquare className={iconSizeClass} />
      </a>

      <button
        type="button"
        id="btn-copy-share-link"
        onClick={handleCopyLink}
        title="Copy Link"
        className={`${btnClass} relative`}
      >
        {copied ? (
          <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
            <Check className={iconSizeClass} />
            {size === "md" && <span>Copied!</span>}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs">
            <Link2 className={iconSizeClass} />
            {size === "md" && <span>Copy Link</span>}
          </span>
        )}
      </button>
    </div>
  );
};
