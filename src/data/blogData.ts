import { BlogPost } from "../types";

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-dark-mode-aesthetic",
    slug: "minimalist-dark-mode-aesthetic-high-ticket-clients",
    title: "The Minimalist Dark Mode Aesthetic: Why Ultra-Clean Contrast Wins High-Ticket Clients",
    excerpt: "Exploring the psychological impact of deep obsidian neutrals, typographic restraint, and intentional negative space when targeting enterprise buyers.",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80",
    category: "Design Systems",
    author: {
      name: "Marcus Vance",
      role: "Lead Creative Technologist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    publishedAt: "August 12, 2026",
    readTime: "5 min read",
    featured: true,
    tags: ["UI/UX Design", "Dark Mode", "Typography", "Conversion Rate"],
    clapsCount: 248,
    viewsCount: 3420,
    content: `
# The Minimalist Dark Mode Aesthetic

In a digital landscape cluttered with neon gradients and hyper-saturated visual noise, high-tier decision-makers naturally gravitate toward restraint, clarity, and optical precision.

### 1. The Power of Sophisticated Neutrals
Pure black (\`#000000\`) can be jarring and causes severe optical haloing around white text. By introducing subtle undertones—such as rich charcoal (\`#090a0f\`) with 2% cool slate saturation—the eye experiences lower strain while preserving crisp visual hierarchy.

> "True luxury design isn't about what you add to the canvas; it is about having the confidence to protect empty space."

### 2. Typographic Scale and Contrast Ratios
When building for dark mode, subtle text weight adjustments are essential:
- **Display Headings**: High-contrast geometric sans-serifs with tight tracking (\`-0.03em\`) command authority.
- **Body Copy**: Standardize on a minimum contrast ratio of 7:1 against dark backgrounds for effortless scanning.
- **Micro-Interactions**: Soft border luminescence (\`border-white/10\`) provides structural definition without loud box-shadows.

### 3. Business Impact
Portfolios utilizing minimalist dark frameworks demonstrated a **38% longer session duration** and a **2.4x higher inquiry completion rate** among venture-backed founders and corporate procurement officers.
    `
  },
  {
    id: "blog-60fps-web-performance",
    slug: "building-60fps-web-experiences-react-motion-optimization",
    title: "Building 60FPS Web Experiences: Optimizing React & Motion for Heavy Portfolios",
    excerpt: "A deep technical blueprint for achieving sub-second load times and silky smooth animation pipelines in media-rich web applications.",
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=900&auto=format&fit=crop&q=80",
    category: "Web Engineering",
    author: {
      name: "Darius Thorne",
      role: "Principal Systems Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    publishedAt: "August 8, 2026",
    readTime: "7 min read",
    featured: false,
    tags: ["React 19", "Web Performance", "Vite", "Framer Motion", "Core Web Vitals"],
    clapsCount: 182,
    viewsCount: 2890,
    content: `
# Silky Smooth: Engineering 60FPS on the Modern Web

Media-heavy digital agency portfolios frequently suffer from animation jank, layout shifts, and heavy bundle sizes. Here is our battle-tested engineering formula for maintaining 99+ Lighthouse performance scores.

### Key Optimization Pillars
1. **GPU Offloading with Transform & Opacity**: Never animate layout properties like \`width\`, \`height\`, \`top\`, or \`margin\`. Rely exclusively on CSS \`transform: translate3d()\` and hardware-accelerated \`opacity\` channels.
2. **Lazy Media Streaming**: Serve WebP and AVIF image formats alongside compressed WebM video previews that pause execution when scrolled outside the viewport.
3. **Sub-Component Isolation**: Break heavy states into localized leaf components to prevent broad DOM tree re-render cascades.

### Measuring the Metric That Matters: INP
With Google's emphasis on Interaction to Next Paint (INP), keeping event handler execution times under 50ms is paramount for SEO rankings and user delight.
    `
  },
  {
    id: "blog-video-retention-formula",
    slug: "modern-video-formula-15-second-retention-hooks",
    title: "The Modern Video Formula: How 15-Second Retention Hooks Drive 7-Figure Pipeline",
    excerpt: "Analyzing the anatomy of high-converting video edits: dynamic pacing, kinetic typography, and surgical audio mastering.",
    coverImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&auto=format&fit=crop&q=80",
    category: "Video Production",
    author: {
      name: "Chloe Vance",
      role: "Senior Video Director",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    publishedAt: "July 28, 2026",
    readTime: "6 min read",
    featured: false,
    tags: ["Video Editing", "DaVinci Resolve", "Short-Form", "Conversion Strategy"],
    clapsCount: 315,
    viewsCount: 4120,
    content: `
# The Anatomy of a High-Retention Video Edit

Why do some commercial videos generate millions of views and massive inbound customer leads while others are skipped in 2 seconds? The difference lies in audio-visual pacing and psychological pattern interrupts.

### 1. The 3-Second Hook Rule
The opening frame must establish visual intrigue immediately. Use rapid camera movement, bold kinetic typography, or an unexpected audio drop to arrest viewer scrolling habits.

### 2. Audio is 60% of the Video Experience
Viewers will forgive a 1080p camera feed, but they will instantly swipe away from poor audio. We layer sub-bass hits, micro-swooshes, and spatial room tones to create a tactile listening experience.
    `
  },
  {
    id: "blog-content-seo-blueprint",
    slug: "content-strategy-blueprint-transforming-organic-search-into-leads",
    title: "Content Strategy Blueprint: Transforming Organic Search Into High-Intent Leads",
    excerpt: "How to craft authoritative technical whitepapers and viral founder essays that bypass vanity metrics and deliver real sales pipeline.",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&auto=format&fit=crop&q=80",
    category: "Content Strategy",
    author: {
      name: "Kirsten Bradley",
      role: "Head of Editorial & Strategy",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
    publishedAt: "July 15, 2026",
    readTime: "4 min read",
    featured: false,
    tags: ["Content Creation", "SEO Growth", "B2B Storytelling", "Inbound Funnels"],
    clapsCount: 194,
    viewsCount: 2450,
    content: `
# Moving Beyond Vanity Traffic: High-Intent Content Engineering

Most B2B content strategies fail because they optimize for generic high-volume keywords rather than addressing specific commercial pain points of budget-holding buyers.

### The Problem-Aware to Decision-Ready Funnel
- **Top of Funnel**: High-level trends and industry benchmarking.
- **Middle of Funnel**: In-depth architectural case studies comparing internal builds versus agency partnerships.
- **Bottom of Funnel**: Transparent pricing formulas, ROI calculators, and client proof assets.
    `
  }
];
