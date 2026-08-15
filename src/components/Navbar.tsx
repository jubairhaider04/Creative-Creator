import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  BarChart3, 
  Menu, 
  X, 
  ShieldCheck, 
  Calculator, 
  Layers, 
  Flame, 
  Search,
  ExternalLink,
  ChevronRight,
  UserCheck
} from "lucide-react";
import { UserAuth } from "../types";

interface NavbarProps {
  onOpenAiConsultant: () => void;
  onOpenAnalytics: () => void;
  onOpenAuth: () => void;
  onOpenQuoteCalculator: () => void;
  currentUser: UserAuth | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAiConsultant,
  onOpenAnalytics,
  onOpenAuth,
  onOpenQuoteCalculator,
  currentUser,
  onLogout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ["services", "showcase", "calculator", "testimonials", "insights", "contact"];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Services", href: "#services", id: "services" },
    { label: "Showcase", href: "#showcase", id: "showcase" },
    { label: "Quote Builder", href: "#calculator", id: "calculator" },
    { label: "Testimonials", href: "#testimonials", id: "testimonials" },
    { label: "Insights", href: "#insights", id: "insights" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#090a0f]/90 backdrop-blur-md border-b border-zinc-800/80 py-3.5 shadow-2xl shadow-black/40"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            id="brand-logo"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-emerald-500 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <div className="w-full h-full bg-[#0d0f15] rounded-[11px] flex items-center justify-center">
                <span className="text-white font-black text-lg tracking-tighter">CC</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold text-base tracking-tight group-hover:text-blue-400 transition-colors">
                  Creative Creator
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] text-zinc-400 tracking-wider uppercase font-medium">
                All-in-One Digital Agency
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800/80">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "text-white bg-zinc-800 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* AI Scope Advisor Button */}
            <button
              type="button"
              id="btn-nav-ai-consultant"
              onClick={onOpenAiConsultant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>AI Scope Advisor</span>
              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-500/30 text-amber-200 rounded uppercase">
                Thinking
              </span>
            </button>

            {/* Performance & Analytics Dashboard Button */}
            <button
              type="button"
              id="btn-nav-analytics"
              onClick={onOpenAnalytics}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all"
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
              <span>Analytics</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
            </button>

            {/* User Auth / Client Portal */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1">
                <button
                  type="button"
                  id="btn-nav-user-profile"
                  onClick={onOpenAnalytics}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 transition-all"
                  title="Client & Admin Portal"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="max-w-[90px] truncate">{currentUser.name.split(" ")[0]}</span>
                </button>
                <button
                  type="button"
                  id="btn-nav-logout"
                  onClick={onLogout}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="btn-nav-login"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                <span>Portal / MFA</span>
              </button>
            )}

            {/* Get a Quote Button */}
            <a
              href="#contact"
              id="btn-nav-quote"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-600/30"
            >
              <span>Get a Quote</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              id="btn-mobile-quote"
              onClick={onOpenAiConsultant}
              className="p-2 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">AI Brief</span>
            </button>

            <button
              type="button"
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide Menu Drawer */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl lg:hidden flex flex-col pt-20 px-6 pb-8 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                CC
              </div>
              <span className="font-bold text-white text-base">Creative Creator</span>
            </div>
            <button
              type="button"
              id="btn-close-mobile-nav"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col gap-2 py-6 overflow-y-auto">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 text-zinc-200 text-sm font-medium border border-zinc-800/60"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </a>
            ))}

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                id="btn-mobile-ai-brief"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAiConsultant();
                }}
                className="w-full py-3 px-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-medium flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Project Scope Advisor (Thinking Mode)</span>
              </button>

              <button
                type="button"
                id="btn-mobile-analytics"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAnalytics();
                }}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm font-medium flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>Live Analytics & Inquiries Pipeline</span>
              </button>

              {currentUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Logged in as {currentUser.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-zinc-400 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  id="btn-mobile-mfa-auth"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-zinc-400" />
                  <span>Client & Admin Portal (MFA Secure)</span>
                </button>
              )}

              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold text-center shadow-lg shadow-blue-600/30"
              >
                Start Your Project Inquiry
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
