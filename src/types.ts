export type ServiceCategory = "Web Development" | "Content Creation" | "Video Editing" | "Graphic Design";

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: ServiceCategory;
  client: string;
  year: string;
  thumbnail: string;
  galleryImages: string[];
  videoPreviewUrl?: string;
  videoDuration?: string;
  tags: string[];
  metrics: {
    label: string;
    value: string;
    description: string;
  }[];
  challenge: string;
  solution: string;
  deliverables: string[];
  techStack: string[];
  liveUrl?: string;
  featured?: boolean;
}

export interface ServicePillar {
  id: string;
  title: ServiceCategory;
  banglaTitle?: string;
  iconName: string;
  tagline: string;
  description: string;
  accentColor: string; // e.g. blue, emerald, purple, amber
  startingPrice: string;
  turnaroundTime: string;
  keyFeatures: string[];
  deliverables: string[];
  techStack: string[];
  highlightMetric: string;
  bn?: {
    tagline?: string;
    description?: string;
    turnaroundTime?: string;
    keyFeatures?: string[];
    deliverables?: string[];
    highlightMetric?: string;
  };
  es?: {
    tagline?: string;
    description?: string;
    turnaroundTime?: string;
    keyFeatures?: string[];
    deliverables?: string[];
    highlightMetric?: string;
  };
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  avatar: string;
  serviceCategory: ServiceCategory;
  rating: number;
  review: string;
  impactMetric: string;
  metricLabel: string;
  projectTitle: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: "Web Engineering" | "Content Strategy" | "Video Production" | "Design Systems" | "Agency Growth";
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  content: string; // Markdown formatted body
  tags: string[];
  clapsCount: number;
  viewsCount: number;
}

export interface LeadInquiry {
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

export interface AnalyticsData {
  realTimeVisitors: number;
  todayPageviews: number;
  monthlyVisitors: number;
  leadConversionRate: number;
  avgSessionDuration: string;
  bounceRate: string;
  pipelineMetrics: {
    totalInquiries: number;
    totalPipelineValue: number;
    wonValue: number;
    subscribersCount: number;
  };
  serviceBreakdown: {
    name: string;
    percentage: number;
    revenueShare: string;
    projectsCount: number;
  }[];
  trafficSources: {
    source: string;
    visitors: string;
    share: number;
  }[];
  topRegions: {
    country: string;
    share: number;
    flag: string;
  }[];
}

export interface UserAuth {
  email: string;
  name: string;
  role: "admin" | "client";
  avatar: string;
  mfaVerifiedAt: string;
}

export interface AiProjectPlan {
  title: string;
  summary: string;
  phases: {
    phase: string;
    duration: string;
    deliverables: string[];
  }[];
  recommendedStack: string[];
  estimatedEffortHours: number;
  recommendedBudgetTier: string;
  keyMetricsToTarget: string[];
  thinkingNotes: string;
}
