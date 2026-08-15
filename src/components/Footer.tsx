import React from "react";
import { Sparkles, ArrowUp, Github, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";
import { ShareButtons } from "./ShareButtons";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-16 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-base tracking-tight leading-none">
                  Creative Creator
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  All-in-One Digital Studio
                </span>
              </div>
            </a>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Full-spectrum digital craftsmanship spanning high-performance Web Engineering, Content Systems, 4K Cinema Video Editing, and Identity Design.
            </p>

            {/* Social Share Bar */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-zinc-500 block mb-2">Spread the Word</span>
              <ShareButtons 
                title="Creative Creator - All-in-One Digital Services Studio" 
                url={typeof window !== "undefined" ? window.location.origin : ""}
                size="sm"
              />
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Disciplines
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#services" className="hover:text-white transition-colors">Web Development (60FPS)</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Content Creation & Copy</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">4K Video Post-Production</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Graphic & Identity Design</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Interactive Quote Builder</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Resources & Work
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="#showcase" className="hover:text-white transition-colors">Case Study Gallery</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Verified Client Outcomes</a></li>
              <li><a href="#insights" className="hover:text-white transition-colors">Engineering Insights</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Project Inquiries</a></li>
            </ul>
          </div>

          {/* Studio Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Standards & Legal
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li><span>95+ Core Web Vitals Guaranteed</span></li>
              <li><span>100% Commercial Source IP Handover</span></li>
              <li><span>90-Day Post-Launch Warranty</span></li>
              <li><span>San Francisco • London • Remote</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} Creative Creator Studio. All rights reserved. Crafted for maximum speed & clarity.
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              id="btn-footer-scroll-top"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
