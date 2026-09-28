import React, { useState, useEffect, useRef } from "react";
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
  UserCheck,
  Globe,
  Check
} from "lucide-react";
import { UserAuth } from "../types";
import { useLanguage, Language } from "../context/LanguageContext";

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
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const langMenuRef = useRef<HTMLDivElement>(null);

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobileOrTablet = typeof navigator !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const message = encodeURIComponent("Hi, I found your portfolio on Creative Creator and would like to discuss a project!");
    const phone = "8801676056414";

    if (isMobileOrTablet) {
      e.preventDefault();
      // Directly trigger native WhatsApp app
      window.location.href = `whatsapp://send?phone=${phone}&text=${message}`;
      // Fallback in case app scheme isn't registered
      setTimeout(() => {
        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${message}`, "_blank");
      }, 1200);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ["services", "pricing", "showcase", "calculator", "faq", "testimonials", "insights", "contact"];
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

    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { label: t.navServices, href: "#services", id: "services" },
    { label: t.navPricing, href: "#pricing", id: "pricing" },
    { label: t.navShowcase, href: "#showcase", id: "showcase" },
    { label: t.navQuoteBuilder, href: "#calculator", id: "calculator" },
    { label: t.navFaq, href: "#faq", id: "faq" },
    { label: t.navTestimonials, href: "#testimonials", id: "testimonials" },
    { label: t.navInsights, href: "#insights", id: "insights" },
    { label: t.navContact, href: "#contact", id: "contact" },
  ];

  const currentLangObj = availableLanguages.find(l => l.code === language) || availableLanguages[0];

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
          <div className="hidden sm:flex items-center gap-2">
            {/* Language Switcher Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                id="btn-nav-language-switcher"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-zinc-300 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm"
                title="Change Language / ভাষা পরিবর্তন / Cambiar Idioma"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] font-bold">{currentLangObj.flag} {currentLangObj.code.toUpperCase()}</span>
              </button>

              {langDropdownOpen && (
                <div 
                  id="nav-language-dropdown"
                  className="absolute right-0 mt-2 w-36 py-1.5 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                    Language / ভাষা
                  </div>
                  {availableLanguages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      id={`btn-select-lang-${l.code}`}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                        language === l.code
                          ? "bg-blue-600/20 text-blue-400 font-semibold"
                          : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct WhatsApp CTA Button */}
            <a
              href="https://api.whatsapp.com/send?phone=8801676056414&text=Hi%2C%20I%20found%20your%20portfolio%20on%20Creative%20Creator%20and%20would%20like%20to%20discuss%20a%20project!"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              id="btn-nav-whatsapp"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-sm group"
              title="Open WhatsApp App"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <svg className="w-3.5 h-3.5 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814 3.183 0 5.768-2.587 5.768-5.766 0-3.18-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.519-4.481 10-10 10-1.745 0-3.385-.45-4.814-1.239l-5.186 1.36 1.385-5.06c-.868-1.488-1.385-3.218-1.385-5.061 0-5.519 4.481-10 10-10s10 4.481 10 10z"/>
              </svg>
              <span className="text-[11px] font-semibold tracking-wide">WhatsApp</span>
            </a>

            {/* User Auth if signed in */}
            {currentUser && (
              <div className="flex items-center gap-2 pl-1">
                <button
                  type="button"
                  id="btn-nav-user-profile"
                  onClick={onOpenAnalytics}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 transition-all"
                  title="Client & Admin Portal (Firebase Auth)"
                >
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" className="w-4 h-4 rounded-full object-cover" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span className="max-w-[90px] truncate">{currentUser.name.split(" ")[0]}</span>
                </button>
                <button
                  type="button"
                  id="btn-nav-logout"
                  onClick={onLogout}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {t.navSignOut}
                </button>
              </div>
            )}

            {/* Get a Quote Button */}
            <a
              href="#contact"
              id="btn-nav-quote"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-600/30"
            >
              <span>{t.navGetQuote}</span>
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
            {/* Mobile Language Switcher Row */}
            <div className="pb-3 mb-2 border-b border-zinc-800/80">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
                Select Language / ভাষা
              </span>
              <div className="grid grid-cols-3 gap-2">
                {availableLanguages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    id={`btn-mobile-lang-${l.code}`}
                    onClick={() => setLanguage(l.code)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      language === l.code
                        ? "bg-blue-600/20 border-blue-500/50 text-blue-400 shadow-sm"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

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
              {/* Mobile WhatsApp Direct Message Button */}
              <a
                href="https://api.whatsapp.com/send?phone=8801676056414&text=Hi%2C%20I%20found%20your%20portfolio%20on%20Creative%20Creator%20and%20would%20like%20to%20discuss%20a%20project!"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleWhatsAppClick(e);
                }}
                id="btn-mobile-whatsapp"
                className="w-full py-3 px-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814 3.183 0 5.768-2.587 5.768-5.766 0-3.18-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.519-4.481 10-10 10-1.745 0-3.385-.45-4.814-1.239l-5.186 1.36 1.385-5.06c-.868-1.488-1.385-3.218-1.385-5.061 0-5.519 4.481-10 10-10s10 4.481 10 10z"/>
                </svg>
                <span>WhatsApp</span>
              </a>

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
                <span>Google AI Suite (Thinking, Search & Maps Grounding)</span>
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
                    {t.navSignOut}
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
                  <span>{t.navSignIn}</span>
                </button>
              )}

              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold text-center shadow-lg shadow-blue-600/30"
              >
                {t.contactSubmitBtn}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
