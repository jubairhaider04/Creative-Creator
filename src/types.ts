import { DualPrice } from "./data/pricingConfig";

export type ServiceCategory = "Web Development" | "Content Creation" | "Video Editing" | "Graphic Design" | "AI Automation" | "Motion Graphics" | "Digital Marketing";

export interface ProjectGalleryItem {
  url: string;
  alt?: string;
  caption?: string;
}

export interface ProjectResultMetric {
  label: string;
  value: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  slug?: string;
  subtitle?: string;
  description?: string;
  category: string;
  clientName?: string;
  client?: string; // legacy alias
  year: number | string;
  featured?: boolean;
  isPublished?: boolean;
  thumbnailUrl?: string;
  thumbnail: string; // fallback / alias
  heroImageUrl?: string;
  gallery?: ProjectGalleryItem[];
  galleryImages?: string[]; // legacy alias
  videoUrl?: string;
  videoPreviewUrl?: string; // legacy alias
  videoDuration?: string;
  liveUrl?: string;
  services?: string[];
  technologies?: string[];
  techStack?: string[]; // legacy alias
  deliverables?: string[];
  challenge?: string;
  solution?: string;
  results?: ProjectResultMetric[];
  metrics?: ProjectResultMetric[]; // legacy alias
  tags?: string[];
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type PortfolioProject = Project;

export interface ServicePillar {
  id: string;
  title: ServiceCategory;
  banglaTitle?: string;
  iconName: string;
  tagline: string;
  description: string;
  accentColor: string; // e.g. blue, emerald, purple, amber
  startingPrice: string;
  price?: DualPrice;
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

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  fullName?: string;
  photoURL?: string;
  avatarUrl?: string;
  phone?: string;
  company?: string;
  companyName?: string;
  country?: string;
  website?: string;
  role: "admin" | "client";
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  service: string;
  projectTitle: string;
  description: string;
  budget: string;
  deadline: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "new" | "reviewing" | "approved" | "in_progress" | "waiting_for_client" | "completed" | "cancelled";
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  notes?: string;
}

export interface ClientProject {
  id: string;
  clientId: string;
  clientName: string;
  projectName: string;
  service: string;
  description: string;
  status: "planning" | "in_progress" | "review" | "completed" | "paused" | "cancelled";
  progress: number;
  startDate: string;
  deadline: string;
  budget: string;
  assignedTo?: string;
  deliverables?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: "client" | "admin";
  receiverId: string;
  message: string;
  attachments?: string[];
  read: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
}

export interface TestimonialDoc {
  id: string;
  clientId?: string;
  clientName: string;
  company: string;
  testimonial: string;
  rating: number;
  imageUrl?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "request" | "project";
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface CrmLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  service: string;
  budget: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "converted" | "lost";
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  createdAt: string;
}

export interface UserAuth {
  uid?: string;
  email: string;
  name: string;
  role: "admin" | "client";
  avatar: string;
  phone?: string;
  company?: string;
  status?: "active" | "suspended";
  mfaVerifiedAt?: string;
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
