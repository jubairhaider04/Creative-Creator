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
