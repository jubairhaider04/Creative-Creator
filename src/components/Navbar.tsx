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
  ChevronDown,
  UserCheck,
  Globe,
  Check,
  User,
  FolderGit2,
  ShoppingBag,
  LogOut,
  LayoutDashboard
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../types";
import { useLanguage, Language } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onOpenAiConsultant: () => void;
  onOpenAnalytics: () => void;
  onOpenAuth: () => void;
  onOpenQuoteCalculator: () => void;
  currentUser?: UserAuth | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAiConsultant,
  onOpenAnalytics,
  onOpenAuth,
  onOpenQuoteCalculator,
  currentUser: propUser,
  onLogout: propLogout
}) => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const { user, profile, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const langMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobileOrTablet = typeof navigator !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const message = encodeURIComponent("Hi, I found your portfolio on Bongio Digital and would like to discuss a project!");
    const phone = "8801676056414";

    if (isMobileOrTablet) {
      e.preventDefault();
      window.location.href = `whatsapp://send?phone=${phone}&text=${message}`;
      setTimeout(() => {
        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${message}`, "_blank");
      }, 1200);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ["home", "services", "ai-automation", "work", "pricing", "showcase", "calculator", "faq", "testimonials", "insights", "contact"];
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
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    if (propLogout) {
      propLogout();
    } else {
      await logout();
      navigate("/");
    }
  };

  const navLinks = [
    { label: "Home", href: "/", id: "home" },
    { label: t.navServices || "Services", href: "#services", id: "services" },
    { label: "AI Automation", href: "#ai-automation", id: "ai-automation" },
    { label: "Work", href: "#work", id: "work" },
    { label: "Portfolio", href: "#showcase", id: "showcase" },
    { label: t.navPricing || "Pricing", href: "#pricing", id: "pricing" },
    { label: "About", href: "#faq", id: "faq" },
    { label: t.navContact || "Contact", href: "#contact", id: "contact" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    if (href === "/") {
      if (window.location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("home");
      } else {
        navigate("/");
      }
      return;
    }
    if (href.startsWith("#")) {
      if (window.location.pathname !== "/") {
        e.preventDefault();
        navigate("/" + href);
        return;
      }
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: "smooth" });
        setActiveSection(id);
      }
    }
  };

  const currentLangObj = availableLanguages.find(l => l.code === language) || availableLanguages[0];
  const activeUser = profile || (propUser ? {
    displayName: propUser.name,
    email: propUser.email,
    photoURL: propUser.avatar,
    role: propUser.role
  } : null);

  const firstName = activeUser?.displayName ? activeUser.displayName.split(" ")[0] : "User";

  return (
    <>
      <header
        id="main-navigation"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 py-3 shadow-xl shadow-black/40"
            : "bg-transparent py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo Link */}
          <Link
            to="/"
            id="brand-logo"
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Bongio Digital Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-emerald-500 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <div className="w-full h-full bg-[#0d0f15] rounded-[11px] flex items-center justify-center font-bold text-white text-xs tracking-wider">
                BD
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-base tracking-tight leading-none group-hover:text-blue-400 transition-colors">
                Bongio Digital
              </span>
              <span className="text-[10px] text-zinc-400 tracking-wider uppercase font-semibold font-mono mt-0.5">
                Full-Spectrum Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/60 p-1.5 rounded-full border border-zinc-800/80 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-zinc-300 hover:text-white hover:bg-zinc-800/60"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Language Selector Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                id="btn-lang-selector"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 transition-all shadow-sm"
                title="Change language / ভাষা পরিবর্তন করুন"
              >
                <span>{currentLangObj.flag}</span>
                <span className="uppercase text-[11px] font-semibold">{currentLangObj.code}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {availableLanguages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800/80 text-left transition-colors"
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

            {/* Direct WhatsApp CTA */}
            <a
              href="https://api.whatsapp.com/send?phone=8801676056414&text=Hi%2C%20I%20found%20your%20portfolio%20on%20Bongio%20Digital%20and%20would%20like%20to%20discuss%20a%20project!"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              id="btn-nav-whatsapp"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-sm group"
              title="Open WhatsApp"
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

            {/* AUTHENTICATION STATE */}
            {isAuthenticated && activeUser ? (
              <div className="flex items-center gap-2 pl-1" ref={profileMenuRef}>
                {/* Dashboard Button */}
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  id="btn-nav-dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{isAdmin ? "Admin Hub" : "Dashboard"}</span>
                </Link>

                {/* Profile Dropdown Toggle */}
                <div className="relative">
                  <button
                    type="button"
                    id="btn-nav-user-dropdown"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-zinc-200 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 transition-all"
                    aria-expanded={profileDropdownOpen}
                  >
                    {activeUser.photoURL ? (
                      <img src={activeUser.photoURL} alt="" className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                        {firstName[0]}
                      </div>
                    )}
                    <span className="max-w-[70px] truncate">{firstName}</span>
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3.5 py-2 border-b border-zinc-800">
                        <div className="font-semibold text-white text-xs truncate">{activeUser.displayName}</div>
                        <div className="text-[10px] text-zinc-400 truncate">{activeUser.email}</div>
                        <span className={`inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                          isAdmin ? "bg-purple-950 text-purple-300 border border-purple-500/30" : "bg-blue-950 text-blue-300 border border-blue-500/30"
                        }`}>
                          {isAdmin ? "Administrator" : "Client"}
                        </span>
                      </div>

                      <div className="py-1 text-xs">
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
                          <span>Client Dashboard</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-3.5 py-2 text-purple-300 hover:text-white hover:bg-purple-950/40 transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                            <span>Admin Command Hub</span>
                          </Link>
                        )}

                        <Link
                          to="/dashboard/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Account Profile</span>
                        </Link>

                        <Link
                          to="/dashboard/projects"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                        >
                          <FolderGit2 className="w-3.5 h-3.5 text-zinc-400" />
                          <span>My Projects</span>
                        </Link>

                        <Link
                          to="/dashboard/orders"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Inquiries & Quotes</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-zinc-800">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 text-left transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* GUEST: LOGIN & GET STARTED */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-nav-login"
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 transition-all shadow-sm"
                >
                  Login
                </button>

                <a
                  href="#contact"
                  id="btn-nav-quote"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all shadow-md shadow-blue-600/30"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
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

      {/* MOBILE SLIDE MENU DRAWER */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl lg:hidden flex flex-col pt-16 px-6 pb-8 animate-in fade-in duration-200 overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                BD
              </div>
              <span className="font-bold text-white text-base">Bongio Digital</span>
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

          <div className="py-6 flex flex-col gap-3">
            {/* Language Switcher on Mobile */}
            <div className="mb-2">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold block mb-2">Language</span>
              <div className="grid grid-cols-3 gap-2">
                {availableLanguages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setLanguage(l.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border ${
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

            {/* Standard Nav links */}
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, link.href, link.id);
                }}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-800 text-zinc-200 text-sm font-medium border border-zinc-800/60"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </a>
            ))}

            {/* Mobile Auth actions */}
            <div className="pt-4 border-t border-zinc-800 space-y-2">
              {isAuthenticated && activeUser ? (
                <>
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white text-xs">{activeUser.displayName}</div>
                      <div className="text-[10px] text-zinc-400">{activeUser.email}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-500/30">
                      {isAdmin ? "Admin" : "Client"}
                    </span>
                  </div>

                  <Link
                    to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white text-xs font-semibold text-center block shadow-md"
                  >
                    {isAdmin ? "Open Admin Command Center" : "Open Client Dashboard"}
                  </Link>

                  <Link
                    to="/dashboard/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-semibold text-center block"
                  >
                    Account Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full py-2.5 px-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-semibold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    id="btn-mobile-login"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-semibold"
                  >
                    Login
                  </button>
                  <a
                    href="#contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 px-4 rounded-xl bg-blue-600 text-white text-xs font-semibold text-center"
                  >
                    Get Started
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
