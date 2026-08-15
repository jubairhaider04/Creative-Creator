import { ServicePillar } from "../types";

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: "serv-web-dev",
    title: "Web Development",
    iconName: "Code2",
    tagline: "Ultra-fast, responsive web architectures engineered for maximum conversions and zero lag.",
    description: "From custom SaaS platforms and headless e-commerce to dynamic interactive brand portfolios, we build resilient, scalable, and WCAG-accessible digital products with modern React, Next.js, and Tailwind CSS.",
    accentColor: "blue",
    startingPrice: "$4,500",
    turnaroundTime: "2-4 Weeks",
    highlightMetric: "99+ Lighthouse Score & Sub-second First Contentful Paint",
    keyFeatures: [
      "Modern React 19 & Next.js Full-Stack Architecture",
      "Tailwind CSS with responsive micro-animations",
      "Interactive 3D WebGL / Canvas integrations",
      "Core Web Vitals & SEO optimization (99+ score)",
      "Headless CMS & REST/GraphQL API development",
      "Secure authentication & payment gateway setups"
    ],
    deliverables: [
      "Production-ready codebase & Git repository",
      "Zero-downtime CI/CD deployment setup",
      "Figma-to-code pixel perfection guarantee",
      "Technical architecture documentation & handover"
    ],
    techStack: ["React 19", "Next.js", "TypeScript", "Tailwind CSS", "Motion", "Node.js / Express", "PostgreSQL / Firebase"]
  },
  {
    id: "serv-content-creation",
    title: "Content Creation",
    iconName: "PenTool",
    tagline: "High-retention storytelling, authoritative SEO articles, and viral founder narratives.",
    description: "We translate complex value propositions into compelling narratives that stop the scroll, educate decision-makers, and systematically turn passive readers into high-intent inbound clients.",
    accentColor: "emerald",
    startingPrice: "$2,800",
    turnaroundTime: "1-2 Weeks",
    highlightMetric: "4.5x Average Organic Reach Growth across B2B channels",
    keyFeatures: [
      "High-intent SEO keyword research & strategy",
      "Long-form thought leadership & technical whitepapers",
      "Viral LinkedIn & X / Twitter thread ghostwriting",
      "High-converting landing page & sales funnel copy",
      "Email marketing sequences & weekly newsletters",
      "Brand voice guidelines & messaging frameworks"
    ],
    deliverables: [
      "Monthly content editorial calendars",
      "Fully researched, formatted articles & essays",
      "Multi-platform social distribution hooks",
      "SEO rank tracking & engagement reports"
    ],
    techStack: ["Ahrefs", "SEMrush", "Notion Content Engine", "Grammarly Business", "Substack / Beehiiv", "Google Search Console"]
  },
  {
    id: "serv-video-editing",
    title: "Video Editing",
    iconName: "Film",
    tagline: "Cinematic commercial spots, high-energy short-form reels, and seamless 4K motion graphics.",
    description: "In an attention economy, audio-visual rhythm is everything. We combine master color grading, dynamic sound design, kinetic typography, and 3D visual effects to captivate audiences and drive conversions.",
    accentColor: "purple",
    startingPrice: "$3,200",
    turnaroundTime: "5-10 Days",
    highlightMetric: "85%+ Average Video Completion Retention on Short-Form",
    keyFeatures: [
      "Cinematic 4K color grading (ACES & DaVinci Studio)",
      "Kinetic typography & animated caption systems",
      "Bespoke sound design, SFX layering & audio mastering",
      "3D camera tracking & motion graphic overlays",
      "Platform optimization for YouTube, TikTok, Reels & Ads",
      "Fast turnaround with iterative frame-accurate reviews"
    ],
    deliverables: [
      "High-bitrate Master exports (ProRes & 4K MP4)",
      "Multi-aspect ratio cuts (16:9, 9:16, 1:1, 4:5)",
      "Custom SFX & background soundtrack licensing",
      "Editable project archives & motion presets"
    ],
    techStack: ["DaVinci Resolve Studio", "Adobe Premiere Pro", "After Effects", "Logic Pro / Pro Tools", "Mocha Pro 3D"]
  },
  {
    id: "serv-graphic-design",
    title: "Graphic Design",
    iconName: "Palette",
    tagline: "Iconic brand identities, tokenized design systems, and stunning digital & print assets.",
    description: "We craft distinctive visual identities that establish instant market authority. From cohesive Figma design systems to tactile packaging and 3D render collateral, your brand will look timeless and unforgettable.",
    accentColor: "amber",
    startingPrice: "$3,500",
    turnaroundTime: "2-3 Weeks",
    highlightMetric: "100% Tokenized Design-to-Code Sync with Figma",
    keyFeatures: [
      "Complete brand identity & logo architecture",
      "Figma design system with tokenized components",
      "UI/UX interface wireframing & interactive prototypes",
      "3D product modeling & photorealistic key renders",
      "Luxury packaging design & print dielines",
      "High-converting marketing banners & ad kits"
    ],
    deliverables: [
      "Comprehensive Brand Identity Book (PDF)",
      "Vector master files (.SVG, .AI, .EPS, .FIG)",
      "Design token library synced for developers",
      "Full commercial copyright transfer"
    ],
    techStack: ["Figma Enterprise", "Adobe Illustrator", "Photoshop", "Blender 3D", "Cinema 4D", "KeyShot"]
  }
];
