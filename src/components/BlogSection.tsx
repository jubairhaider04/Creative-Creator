import React, { useState } from "react";
import { 
  BookOpen, 
  ArrowUpRight, 
  Clock, 
  Search, 
  Sparkles,
  TrendingUp,
  Tag
} from "lucide-react";
import { BLOG_POSTS } from "../data/blogData";
import { BlogPost } from "../types";
import { ArticleModal } from "./ArticleModal";

export const BlogSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories = [
    "All",
    "Design Systems",
    "Web Engineering",
    "Video Production",
    "Content Strategy"
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="insights" className="py-24 relative border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Industry Insights & Masterclasses</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Knowledge Base & <br />
              <span className="text-zinc-400">Creative Architecture.</span>
            </h2>
          </div>

          {/* Search Filter */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              id="input-blog-search"
              type="text"
              placeholder="Search articles & guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              id={`btn-blog-category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? "bg-white text-zinc-950 border-white shadow-lg shadow-white/10"
                  : "bg-zinc-900/70 text-zinc-400 border-zinc-800/80 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              id={`blog-card-${post.id}`}
              onClick={() => setActivePost(post)}
              className="group cursor-pointer bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-zinc-300 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-[11px] text-zinc-500 mb-2">
                    {post.publishedAt}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Author Footer */}
              <div className="px-5 pb-5 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                  />
                  <span className="text-xs font-medium text-zinc-300">{post.author.name}</span>
                </div>
                <div className="text-xs text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Read Guide</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {activePost && (
        <ArticleModal
          post={activePost}
          onClose={() => setActivePost(null)}
        />
      )}
    </section>
  );
};
