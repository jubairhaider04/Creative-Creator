import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  services: string[];
  budget: string;
  timeline: string;
  description: string;
  createdAt: string;
  status: "new" | "reviewing" | "quoted" | "closed";
  estimatedValue: number;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  topics: string[];
  subscribedAt: string;
}

const leadsDatabase: Lead[] = [
  {
    id: "lead-1",
    name: "Alex Rivera",
    email: "alex@fintechpulse.io",
    company: "FintechPulse",
    services: ["Web Development", "Graphic Design"],
    budget: "$10,000 - $25,000",
    timeline: "4-6 weeks",
    description: "Complete redesign of our web platform and full design system refresh for our Series A launch.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: "new",
    estimatedValue: 18500
  },
  {
    id: "lead-2",
    name: "Sophia Chen",
    email: "sophia@luminaudio.com",
    company: "Lumin Audio",
    services: ["Video Editing", "Content Creation"],
    budget: "$5,000 - $10,000",
    timeline: "2-3 weeks",
    description: "Launch campaign video suite with 5 short-form TikTok/Reels and a 60-second 4K product showcase.",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: "reviewing",
    estimatedValue: 7500
  },
  {
    id: "lead-3",
    name: "Marcus Vance",
    email: "m.vance@solarestates.co",
    company: "Solar Estates",
    services: ["Web Development", "Content Creation", "Graphic Design"],
    budget: "$25,000+",
    timeline: "2-3 months",
    description: "Full luxury real estate portal with 3D virtual tours, interactive map integration and high-retention copywriting.",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: "quoted",
    estimatedValue: 32000
  }
];

const subscribersDatabase: NewsletterSubscriber[] = [
  {
    id: "sub-1",
    email: "designer.dan@agency.co",
    topics: ["Design Systems", "Web Performance"],
    subscribedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: "sub-2",
    email: "growth@startup.dev",
    topics: ["Content Strategy", "Video Production"],
    subscribedAt: new Date(Date.now() - 3600000 * 72).toISOString()
  }
];

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "Creative Creator API Engine",
      timestamp: new Date().toISOString(),
      capabilities: ["web_dev", "content_creation", "video_editing", "graphic_design"],
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // AI Creative Consultant & Project Scope Estimator
  app.post("/api/gemini/consultant", async (req, res) => {
    try {
      const { projectIdea, serviceType, targetAudience, budgetBracket, timeline } = req.body;

      if (!projectIdea || typeof projectIdea !== "string") {
        return res.status(400).json({ error: "Project idea is required" });
      }

      const client = getGeminiClient();
      if (!client) {
        // Fallback intelligent brief generator when API key is pending
        return res.json({
          plan: {
            title: `Creative Scope: ${serviceType || "All-in-One Digital Strategy"}`,
            summary: `High-impact execution roadmap tailored for "${projectIdea.slice(0, 100)}..." focusing on modern typography, minimalist dark aesthetics, and rapid conversion optimization.`,
            phases: [
              {
                phase: "Phase 1: Discovery & Strategy",
                duration: "Week 1",
                deliverables: ["Brand & Creative Direction Blueprint", "Target Audience Archetype Analysis", "Competitive Benchmarking & Moodboard"]
              },
              {
                phase: "Phase 2: Production & Development",
                duration: "Weeks 2-3",
                deliverables: ["High-Fidelity UI/UX & Interactive Prototypes", "4K Motion Assets & Cinematic Video Cuts", "Responsive Full-Stack Implementation"]
              },
              {
                phase: "Phase 3: Optimization & Launch",
                duration: "Week 4",
                deliverables: ["Performance & SEO Speed Audit (99+ score)", "Conversion Tracking & Analytics Funnel Setup", "Full Production Handover & Documentation"]
              }
            ],
            recommendedStack: ["React 19", "Tailwind CSS", "Motion", "Figma Design System", "Premiere Pro / After Effects 4K Pipeline", "Google GenAI Integration"],
            estimatedEffortHours: 120,
            recommendedBudgetTier: budgetBracket || "$10,000 - $20,000",
            keyMetricsToTarget: ["2.5x Conversion Uplift", "Under 0.8s Page Load", "+150% Social Engagement Retention"],
            thinkingNotes: "Strategically balanced high aesthetic value with conversion rigor to guarantee maximum brand memorability and frictionless user journeys."
          }
        });
      }

      const prompt = `You are the Principal Creative Director and Technical Architect at "Creative Creator", an elite digital agency providing Web Development, Content Creation, Video Editing, and Graphic Design.

A prospective client submitted the following project concept:
- Project Concept: ${projectIdea}
- Primary Service Pillar: ${serviceType || "All-in-One Digital"}
- Target Audience: ${targetAudience || "Modern digital consumers and B2B leaders"}
- Budget Range: ${budgetBracket || "Standard Agency Tier"}
- Target Timeline: ${timeline || "Optimal agency sprint"}

Analyze this project deeply using your highest creative, technical, and strategic reasoning.
Generate a structured JSON response with exact keys:
{
  "title": "Concise high-energy project initiative title",
  "summary": "2-3 sentence executive creative brief highlighting positioning and unique visual/technical hook",
  "phases": [
    {
      "phase": "Phase title (e.g. Discovery & Brand Architecture)",
      "duration": "e.g. 1-2 Weeks",
      "deliverables": ["Deliverable 1", "Deliverable 2", "Deliverable 3"]
    }
  ],
  "recommendedStack": ["Tech / Software / Tool 1", "Tech 2", "Tech 3", "Tech 4"],
  "estimatedEffortHours": number,
  "recommendedBudgetTier": "Estimated fair agency investment range",
  "keyMetricsToTarget": ["Target Metric 1 with %", "Target Metric 2", "Target Metric 3"],
  "thinkingNotes": "Brief strategic reasoning on why this approach maximizes ROI and aesthetic luxury"
}

Return ONLY valid JSON matching this schema.`;

      const response = await client.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      return res.json({ plan: parsed });
    } catch (err: any) {
      console.error("Gemini Consultant Error:", err);
      // Graceful fallback
      return res.json({
        plan: {
          title: "Custom Creative Strategy Sprint",
          summary: "A tailor-made digital blueprint built around your core goals, combining high-craft design and fast technical execution.",
          phases: [
            {
              phase: "Phase 1: Concept & Architecture",
              duration: "Week 1",
              deliverables: ["Creative Moodboard", "Technical Architecture Spec", "Copywriting Wireframes"]
            },
            {
              phase: "Phase 2: Production Sprint",
              duration: "Weeks 2-3",
              deliverables: ["Interactive Component Build", "4K Video Assets", "Brand Graphic Assets"]
            },
            {
              phase: "Phase 3: QA & Deployment",
              duration: "Week 4",
              deliverables: ["SEO & Core Web Vitals Optimization", "Cross-Device Testing", "Final Production Launch"]
            }
          ],
          recommendedStack: ["React", "Tailwind CSS", "Motion", "Figma", "After Effects", "Edge CDN"],
          estimatedEffortHours: 95,
          recommendedBudgetTier: "$8,000 - $18,000",
          keyMetricsToTarget: ["Sub-second load times", "+180% User Engagement", "99.9% Uptime"],
          thinkingNotes: "Optimized for maximum visual impact with clean neutral dark-mode aesthetics."
        }
      });
    }
  });

  // Client Leads capture endpoint
  app.post("/api/contact", (req, res) => {
    const { name, email, company, services, budget, timeline, description } = req.body;

    if (!name || !email || !description) {
      return res.status(400).json({ error: "Name, email, and project description are required." });
    }

    // Estimate value based on budget string
    let estimatedValue = 10000;
    if (budget?.includes("25,000+")) estimatedValue = 30000;
    else if (budget?.includes("10,000")) estimatedValue = 17500;
    else if (budget?.includes("5,000")) estimatedValue = 7500;
    else if (budget?.includes("2,500")) estimatedValue = 3500;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: String(name).trim(),
      email: String(email).trim(),
      company: company ? String(company).trim() : undefined,
      services: Array.isArray(services) && services.length > 0 ? services : ["General Inquiry"],
      budget: budget || "$5,000 - $10,000",
      timeline: timeline || "Flexible",
      description: String(description).trim(),
      createdAt: new Date().toISOString(),
      status: "new",
      estimatedValue
    };

    leadsDatabase.unshift(newLead);

    return res.status(201).json({
      success: true,
      message: "Thank you! Your project inquiry has been received by our Creative Director. We will review your brief within 24 hours.",
      leadId: newLead.id,
      lead: newLead
    });
  });

  // Get all leads (Admin access)
  app.get("/api/leads", (_req, res) => {
    res.json({ leads: leadsDatabase });
  });

  // Update lead status
  app.patch("/api/leads/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const lead = leadsDatabase.find(l => l.id === id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    if (["new", "reviewing", "quoted", "closed"].includes(status)) {
      lead.status = status;
      return res.json({ success: true, lead });
    }
    return res.status(400).json({ error: "Invalid status" });
  });

  // Newsletter signup
  app.post("/api/newsletter", (req, res) => {
    const { email, topics } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email address is required" });
    }

    const existing = subscribersDatabase.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.json({
        success: true,
        message: "You're already subscribed! We've updated your preference tags.",
        subscriber: existing
      });
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: email.toLowerCase().trim(),
      topics: Array.isArray(topics) && topics.length > 0 ? topics : ["Digital Insights", "Creative Trends"],
      subscribedAt: new Date().toISOString()
    };

    subscribersDatabase.unshift(newSub);

    return res.status(201).json({
      success: true,
      message: "Welcome to Creative Creator Insights! Look out for our monthly curated masterclass in your inbox.",
      subscriber: newSub
    });
  });

  // Analytics endpoint
  app.get("/api/analytics", (_req, res) => {
    const totalPipelineValue = leadsDatabase.reduce((acc, lead) => acc + (lead.estimatedValue || 0), 0);
    const wonValue = leadsDatabase.filter(l => l.status === "closed").reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

    res.json({
      realTimeVisitors: 42,
      todayPageviews: 1845,
      monthlyVisitors: 48920,
      leadConversionRate: 4.8,
      avgSessionDuration: "3m 48s",
      bounceRate: "26.4%",
      pipelineMetrics: {
        totalInquiries: leadsDatabase.length,
        totalPipelineValue,
        wonValue,
        subscribersCount: subscribersDatabase.length + 1420
      },
      serviceBreakdown: [
        { name: "Web Development", percentage: 38, revenueShare: "$240k", projectsCount: 42 },
        { name: "Video Editing", percentage: 26, revenueShare: "$165k", projectsCount: 68 },
        { name: "Graphic Design & Branding", percentage: 21, revenueShare: "$132k", projectsCount: 54 },
        { name: "Content Creation", percentage: 15, revenueShare: "$95k", projectsCount: 39 }
      ],
      trafficSources: [
        { source: "Direct / Brand Search", visitors: "18.4k", share: 38 },
        { source: "Organic Search (SEO)", visitors: "14.2k", share: 29 },
        { source: "LinkedIn & X / Social", visitors: "9.8k", share: 20 },
        { source: "Referral & Portfolios", visitors: "6.5k", share: 13 }
      ],
      topRegions: [
        { country: "United States", share: 44, flag: "🇺🇸" },
        { country: "United Kingdom", share: 18, flag: "🇬🇧" },
        { country: "Germany", share: 12, flag: "🇩🇪" },
        { country: "Canada", share: 9, flag: "🇨🇦" },
        { country: "Australia & Others", share: 17, flag: "🌏" }
      ]
    });
  });

  // Simulated MFA authentication
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Authenticate demo accounts
    const isAdmin = email.toLowerCase().includes("admin") || email.toLowerCase() === "creator@agency.com";
    return res.json({
      mfaRequired: true,
      challengeId: `mfa-${Date.now()}`,
      user: {
        email,
        name: isAdmin ? "Chief Creative Officer (Admin)" : "Client Partner",
        role: isAdmin ? "admin" : "client",
      },
      maskedPhone: "+1 (•••) •••-8829",
      mfaMethod: "TOTP / Authenticator App (Demo Code: 492018 or any 6-digit code)"
    });
  });

  app.post("/api/auth/verify-mfa", (req, res) => {
    const { code, challengeId, email, role } = req.body;
    if (!code || code.length < 6) {
      return res.status(400).json({ error: "Please enter a valid 6-digit authentication token." });
    }

    // Accept valid 6-digit codes
    return res.json({
      success: true,
      token: `jwt_cc_${Date.now()}_token`,
      user: {
        email: email || "admin@creativecreator.agency",
        name: role === "admin" ? "Chief Creative Officer" : "Client Partner",
        role: role || "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        mfaVerifiedAt: new Date().toISOString()
      }
    });
  });

  // Vite integration for dev vs static in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Creative Creator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
