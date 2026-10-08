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
                  Bongio Digital
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  All-in-One Digital Studio
                </span>
              </div>
            </a>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Full-spectrum digital craftsmanship spanning high-performance Web Engineering, Content Systems, 4K Cinema Video Editing, and Identity Design.
            </p>

            {/* Direct WhatsApp Messaging Card */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 max-w-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 fill-[#25D366]" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814 3.183 0 5.768-2.587 5.768-5.766 0-3.18-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.519-4.481 10-10 10-1.745 0-3.385-.45-4.814-1.239l-5.186 1.36 1.385-5.06c-.868-1.488-1.385-3.218-1.385-5.061 0-5.519 4.481-10 10-10s10 4.481 10 10z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-white">Direct WhatsApp</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Instant Reply
                </span>
              </div>
              <p className="text-[11px] text-zinc-300">
                Direct consultation & quick turnaround scoping:
              </p>
              <a
                href="https://wa.me/8801676056414?text=Hi%2C%20I%20found%20your%20portfolio%20on%20Bongio%20Digital%20and%20would%20like%20to%20discuss%20a%20project!"
                target="_blank"
                rel="noopener noreferrer"
                id="btn-footer-whatsapp-chat"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-900/40 group"
              >
                <span className="font-mono tracking-tight text-white">+880 1676-056414</span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-100 group-hover:translate-x-0.5 transition-transform">
                  Message Now →
                </span>
              </a>
            </div>

            {/* Social Share Bar */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-zinc-500 block mb-2">Spread the Word</span>
              <ShareButtons 
                title="Bongio Digital - All-in-One Digital Services Studio" 
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
              <li><a href="#ai-automation" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">AI Customer Automation (24/7)</a></li>
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
              <li><a href="#work" className="hover:text-white transition-colors">Selected Work (#work)</a></li>
              <li><a href="/work" className="hover:text-white transition-colors">All Projects Archive (/work)</a></li>
              <li><a href="#showcase" className="hover:text-white transition-colors">Case Study Gallery</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Verified Client Outcomes</a></li>
              <li><a href="#insights" className="hover:text-white transition-colors">Engineering Insights</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Project Inquiries</a></li>
              <li>
                <a 
                  href="https://wa.me/8801676056414?text=Hi%2C%20I%20found%20your%20portfolio%20on%20Bongio%20Digital%20and%20would%20like%20to%20discuss%20a%20project!" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-medium"
                >
                  <span>WhatsApp: +8801676056414</span>
                </a>
              </li>
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
            © {new Date().getFullYear()} Bongio Digital Studio. All rights reserved. Crafted for maximum speed & clarity.
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
