import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthPage } from "./components/AuthPage";
import { ClientDashboard } from "./components/ClientDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ServicesSection } from "./components/ServicesSection";
import { PricingSection } from "./components/PricingSection";
import { ProjectGallery } from "./components/ProjectGallery";
import { QuoteCalculator } from "./components/QuoteCalculator";
import { FaqSection } from "./components/FaqSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { BlogSection } from "./components/BlogSection";
import { NewsletterSection } from "./components/NewsletterSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { GoogleIntelligenceModal } from "./components/GoogleIntelligenceModal";
import { AnalyticsDashboardModal } from "./components/AnalyticsDashboardModal";
import { AuthModal } from "./components/AuthModal";
import { ServiceCategory, ServicePillar, Project } from "./types";
import { PricingPlan } from "./data/pricingData";
import { SERVICE_PILLARS } from "./data/servicesData";
import { PORTFOLIO_PROJECTS } from "./data/portfolioData";
import { 
  subscribeToServicesFirestore, 
  subscribeToPortfolioFirestore 
} from "./lib/firebase";

// Full Bongio Digital Homepage
function HomePage() {
  const { user, profile, logout } = useAuth();

  // Navigation & Category state
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | "All">("All");

  // Modal controls
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Real-time Firestore dynamic state
  const [services, setServices] = useState<ServicePillar[]>(SERVICE_PILLARS);
  const [projects, setProjects] = useState<Project[]>(PORTFOLIO_PROJECTS);

  // Subscriptions to Firestore Collections on mount
  useEffect(() => {
    const unsubServices = subscribeToServicesFirestore((liveServices) => {
      if (liveServices && liveServices.length > 0) {
        setServices(liveServices);
      }
    });

    const unsubProjects = subscribeToPortfolioFirestore((liveProjects) => {
      if (liveProjects && liveProjects.length > 0) {
        setProjects(liveProjects);
      }
    });

    return () => {
      if (unsubServices) unsubServices();
      if (unsubProjects) unsubProjects();
    };
  }, []);

  // Contact form pre-fill parameters
  const [inquiryBrief, setInquiryBrief] = useState<string>("");
  const [inquiryServices, setInquiryServices] = useState<string[]>(["Web Development"]);
  const [inquiryBudget, setInquiryBudget] = useState<string>("৳ ২৫,০০০ - ৳ ৫০,০০০ (গ্রোথ প্যাকেজ - মোস্ট পপুলার)");
  const [inquiryTimeline, setInquiryTimeline] = useState<string>("১০-১৪ দিন (স্ট্যান্ডার্ড টাইমলাইন)");

  // Handlers
  const handleSelectServiceForInquiry = (category: ServiceCategory) => {
    setInquiryServices([category]);
    const contactElem = document.getElementById("contact");
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectPlanForInquiry = (plan: PricingPlan) => {
    const planNameBn = plan.bn?.name ? ` / ${plan.bn.name}` : "";
    setInquiryBrief(`[Package Inquiry: ${plan.name}${planNameBn}]\nInvestment: ${plan.formattedTk} BDT\nDelivery Timeline: ${plan.turnaroundDays}\nPayment Terms: ${plan.paymentTerms}\nKey Requirements: `);
    setInquiryServices(["Web Development", "Graphic Design"]);
    setInquiryBudget(
      plan.id === "starter" 
        ? "৳ 10,000 - ৳ 25,000 BDT (Starter Tier)"
        : plan.id === "growth"
        ? "৳ 25,000 - ৳ 50,000 BDT (Growth Tier - Popular)"
        : "৳ 50,000 - ৳ 100,000 BDT (Scale Tier)"
    );
    setInquiryTimeline(
      plan.id === "starter"
        ? "5 - 7 Days (Rush Delivery)"
        : plan.id === "growth"
        ? "10 - 14 Days (Standard Sprint)"
        : "3 - 4 Weeks (Comprehensive Project)"
    );

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
    setInquiryBrief(`[ক্যালকুলেটর এস্টিমেট - প্যাকেজ: ${config.tier}]\nসার্ভিসসমূহ: ${config.services.join(", ")}\nঅ্যাড-অন ফিচার: ${config.addons.join(", ")}\nআনুমানিক ইনভেস্টমেন্ট: ${config.estimatedBudget}\nডেলিভারি সময়: ${config.estimatedWeeks}`);
    
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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Navigation Header */}
      <Navbar
        onOpenAiConsultant={() => setIsAiModalOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
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
          onOpenQuoteCalculator={() => {
            const el = document.getElementById("calculator");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
          }}
        />

        {/* 2. Four Core Disciplines (Services) with Live Firestore Data */}
        <ServicesSection
          services={services}
          onSelectServiceForInquiry={handleSelectServiceForInquiry}
          onOpenQuoteCalculator={() => {
            const el = document.getElementById("pricing");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* 3. Bangladeshi Business Pricing Plans (Starter, Growth, Scale in Bangla TK) */}
        <PricingSection
          onSelectPlanForInquiry={handleSelectPlanForInquiry}
          onOpenQuoteCalculator={() => {
            const el = document.getElementById("calculator");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* 4. Dynamic Case Study Gallery with Live Firestore Data */}
        <ProjectGallery
          projects={projects}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSelectForInquiry={handleSelectServiceForInquiry}
        />

        {/* 5. Interactive Scope & Quote Calculator */}
        <QuoteCalculator
          onApplyToInquiry={handleApplyQuoteToInquiry}
        />

        {/* 6. Frequently Asked Questions (Pricing & Delivery) */}
        <FaqSection
          onOpenQuoteCalculator={() => {
            const el = document.getElementById("calculator");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* 7. Client Testimonials with Impact Badges */}
        <TestimonialsSection />

        {/* 8. Blog & Industry Insights */}
        <BlogSection />

        {/* 9. Newsletter Signup */}
        <NewsletterSection />

        {/* 10. Contact & Lead Capture Form */}
        <ContactSection
          prefilledBrief={inquiryBrief}
          prefilledServices={inquiryServices}
          prefilledBudget={inquiryBudget}
          prefilledTimeline={inquiryTimeline}
        />
      </main>

      {/* Footer with Social Integration */}
      <Footer />

      {/* Google Intelligence Suite Modal */}
      <GoogleIntelligenceModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyBriefToContact={handleApplyAiBrief}
        currentUser={profile ? {
          email: profile.email,
          name: profile.displayName,
          role: profile.role,
          avatar: profile.photoURL || "",
          mfaVerifiedAt: ""
        } : null}
      />

      {/* Analytics, CMS & CRM Pipeline Modal */}
      <AnalyticsDashboardModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        currentUser={profile ? {
          email: profile.email,
          name: profile.displayName,
          role: profile.role,
          avatar: profile.photoURL || "",
          mfaVerifiedAt: ""
        } : null}
        services={services}
        projects={projects}
        onOpenAuth={() => {
          setIsAnalyticsOpen(false);
          setIsAuthOpen(true);
        }}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<HomePage />} />

          {/* Dedicated Auth Pages */}
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/register" element={<AuthPage initialMode="register" />} />
          <Route path="/forgot-password" element={<AuthPage initialMode="forgot-password" />} />

          {/* Protected Client Workspace */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Command Center */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
