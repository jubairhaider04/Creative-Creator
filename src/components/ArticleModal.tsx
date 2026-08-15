import React, { useState, useEffect } from "react";
import { 
  X, 
  Calendar, 
  Clock, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Sparkles, 
  Bookmark, 
  Send,
  User,
  Heart
} from "lucide-react";
import { BlogPost } from "../types";
import { ShareButtons } from "./ShareButtons";
import { subscribeToBlogComments, addBlogCommentFirestore } from "../lib/firebase";

interface ArticleModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  post,
  onClose
}) => {
  const [claps, setClaps] = useState<number>(post?.clapsCount || 0);
  const [hasClapped, setHasClapped] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{ id: string; name: string; text: string; time: string }[]>([
    {
      id: "c1",
      name: "Arthur Pendelton",
      text: "Outstanding breakdown on dark mode typography and contrast boundaries. We applied this to our SaaS platform and our usability scores improved immediately.",
      time: "2 days ago"
    },
    {
      id: "c2",
      name: "Lena Schilling",
      text: "The insight on 60FPS GPU offloading with translate3d versus layout triggers is gold. Bookmarked!",
      time: "4 days ago"
    }
  ]);

  useEffect(() => {
    if (post?.id) {
      const unsub = subscribeToBlogComments(post.id, (firestoreComments) => {
        if (firestoreComments && firestoreComments.length > 0) {
          setComments(prev => {
            const map = new Map();
            firestoreComments.forEach(c => map.set(c.id, c));
            prev.forEach(c => { if (!map.has(c.id)) map.set(c.id, c); });
            return Array.from(map.values());
          });
        }
      });
      return () => {
        if (unsub) unsub();
      };
    }
  }, [post?.id]);

  if (!post) return null;

  const handleClap = () => {
    setClaps(prev => prev + 1);
    setHasClapped(true);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      name: "You (Guest Reader)",
      text: commentText.trim(),
      time: "Just now"
    };

    setComments(prev => [newComment, ...prev]);
    const textToSend = commentText.trim();
    setCommentText("");

    if (post?.id) {
      try {
        await addBlogCommentFirestore(post.id, {
          name: "Guest Reader",
          text: textToSend
        });
      } catch (err) {
        console.warn("Firestore comment sync notice:", err);
      }
    }
  };

  return (
    <div 
      id="article-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="article-detail-modal"
        className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
              {post.category}
            </span>
            <span className="text-xs text-zinc-500">• {post.readTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <ShareButtons 
              title={post.title} 
              url={typeof window !== "undefined" ? window.location.href : ""}
              tags={post.tags}
              size="sm"
            />
            <button
              type="button"
              id="btn-close-article-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-10 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Article Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mb-6">
              {post.excerpt}
            </p>

            {/* Author info */}
            <div className="flex items-center justify-between py-4 border-y border-zinc-800 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                />
                <div>
                  <div className="font-bold text-white">{post.author.name}</div>
                  <div className="text-zinc-400">{post.author.role}</div>
                </div>
              </div>
              <div className="text-right text-zinc-500">
                <div>Published {post.publishedAt}</div>
                <div>{post.viewsCount.toLocaleString()} Reads</div>
              </div>
            </div>
          </div>

          {/* Cover image */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Content Markdown Style Rendering */}
          <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
            {post.content.split("\n\n").map((block, idx) => {
              if (block.startsWith("# ")) {
                return (
                  <h2 key={idx} className="text-xl sm:text-2xl font-bold text-white mt-6 mb-2">
                    {block.replace("# ", "")}
                  </h2>
                );
              }
              if (block.startsWith("### ")) {
                return (
                  <h3 key={idx} className="text-lg font-bold text-zinc-100 mt-5 mb-2">
                    {block.replace("### ", "")}
                  </h3>
                );
              }
              if (block.startsWith("> ")) {
                return (
                  <blockquote key={idx} className="p-4 rounded-xl bg-zinc-900/60 border-l-4 border-blue-500 italic text-zinc-200 text-sm my-4">
                    {block.replace("> ", "")}
                  </blockquote>
                );
              }
              return (
                <p key={idx} className="text-zinc-300">
                  {block}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                #{tag}
              </span>
            ))}
          </div>

          {/* Clap & Social Interaction Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="btn-clap-article"
                onClick={handleClap}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  hasClapped
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                }`}
              >
                <Heart className={`w-4 h-4 ${hasClapped ? "fill-rose-400 text-rose-400" : ""}`} />
                <span>{claps} Claps</span>
              </button>
            </div>

            <ShareButtons 
              title={post.title} 
              url={typeof window !== "undefined" ? window.location.href : ""}
              tags={post.tags}
              size="md"
            />
          </div>

          {/* Discussion / Comments Section */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span>Community Insights & Discussion ({comments.length})</span>
            </h3>

            {/* Comment input form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Share your perspective or ask a question..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>

            {/* Comments list */}
            <div className="space-y-3 pt-2">
              {comments.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-xs space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="font-semibold text-zinc-200">{c.name}</span>
                    <span className="text-[11px] text-zinc-500">{c.time}</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
