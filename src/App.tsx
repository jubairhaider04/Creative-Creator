import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ServicesSection } from "./components/ServicesSection";
import { ProjectGallery } from "./components/ProjectGallery";
import { QuoteCalculator } from "./components/QuoteCalculator";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { BlogSection } from "./components/BlogSection";
import { NewsletterSection } from "./components/NewsletterSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { GoogleIntelligenceModal } from "./components/GoogleIntelligenceModal";
import { AnalyticsDashboardModal } from "./components/AnalyticsDashboardModal";
import { AuthModal } from "./components/AuthModal";
import { ServiceCategory, UserAuth } from "./types";
import { subscribeToAuthState, signOutUser } from "./lib/firebase";

export default function App() {
  // Navigation & Category state
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | "All">("All");

  // Modal controls
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Authenticated User state
  const [currentUser, setCurrentUser] = useState<UserAuth | null>(null);

  // Subscribe to Firebase Auth state on mount
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser({
          email: firebaseUser.email || "user@google.com",
          name: firebaseUser.displayName || "Google User",
          role: (firebaseUser.email?.includes("admin") || firebaseUser.email?.includes("creative")) ? "admin" : "client",
          avatar: firebaseUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          mfaVerifiedAt: new Date().toISOString()
        });
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Contact form pre-fill parameters
  const [inquiryBrief, setInquiryBrief] = useState<string>("");
  const [inquiryServices, setInquiryServices] = useState<string[]>(["Web Development"]);
  const [inquiryBudget, setInquiryBudget] = useState<string>("$10,000 - $25,000");
  const [inquiryTimeline, setInquiryTimeline] = useState<string>("4-6 weeks");

  // Handlers
  const handleSelectServiceForInquiry = (category: ServiceCategory) => {
    setInquiryServices([category]);
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleApplyQuoteToInquiry = (config: {
    services: string[];
    tier: string;
    addons: string[];
    estimatedBudget: string;
    estimatedWeeks: string;
  }) => {
    setInquiryServices(config.services);
    setInquiryBudget(config.estimatedBudget);
    setInquiryTimeline(config.estimatedWeeks);
    setInquiryBrief(`[CALCULATOR ESTIMATE - Tier: ${config.tier}]\nServices: ${config.services.join(", ")}\nSelected Addons: ${config.addons.join(", ")}\nEstimated Investment: ${config.estimatedBudget}\nEstimated Sprint: ${config.estimatedWeeks}`);
    
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleApplyAiBrief = (briefText: string, serviceCategory: string) => {
    setInquiryBrief(briefText);
    setInquiryServices([serviceCategory]);
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.warn("Sign out notice:", err);
    }
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        onOpenAiConsultant={() => setIsAiModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenQuoteCalculator={() => {
          const el = document.getElementById("calculator");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero
          onOpenAiConsultant={() => setIsAiModalOpen(true)}
          onOpenCalculator={() => {
            const el = document.getElementById("calculator");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* 2. Four Core Disciplines (Services) */}
        <ServicesSection
          onSelectServiceForInquiry={handleSelectServiceForInquiry}
          onOpenQuoteCalculator={() => {
            const el = document.getElementById("calculator");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* 3. Dynamic Case Study Gallery */}
        <ProjectGallery
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectForInquiry={handleSelectServiceForInquiry}
        />

        {/* 4. Interactive Scope & Quote Calculator */}
        <QuoteCalculator
          onApplyToInquiry={handleApplyQuoteToInquiry}
        />

        {/* 5. Client Testimonials with Impact Badges */}
        <TestimonialsSection />

        {/* 6. Blog & Industry Insights */}
        <BlogSection />

        {/* 7. Newsletter Signup */}
        <NewsletterSection />

        {/* 8. Contact & Lead Capture Form */}
        <ContactSection
          prefilledBrief={inquiryBrief}
          prefilledServices={inquiryServices}
          prefilledBudget={inquiryBudget}
          prefilledTimeline={inquiryTimeline}
        />
      </main>

      {/* Footer with Social Integration */}
      <Footer />

      {/* Google Intelligence Suite Modal (High Thinking, Search Grounding, Maps Grounding, Flash Lite) */}
      <GoogleIntelligenceModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyBriefToContact={handleApplyAiBrief}
        currentUser={currentUser}
      />

      {/* Analytics & CRM Pipeline Modal */}
      <AnalyticsDashboardModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        currentUser={currentUser}
        onOpenAuth={() => {
          setIsAnalyticsOpen(false);
          setIsAuthOpen(true);
        }}
      />

      {/* Authentication & MFA / Google Sign-in Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}
