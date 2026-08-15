import { Project } from "../types";

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: "proj-kroma-fintech",
    title: "Kroma Next-Gen Financial OS",
    subtitle: "High-Frequency Asset Management & WebGL Trading Dashboard",
    category: "Web Development",
    client: "Kroma Technologies (San Francisco)",
    year: "2025",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80"
    ],
    videoPreviewUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-42880-large.mp4",
    videoDuration: "0:45",
    tags: ["React 19", "WebGL", "TypeScript", "Tailwind CSS", "High-Frequency WebSocket"],
    metrics: [
      { label: "Execution Latency", value: "14ms", description: "Real-time streaming tick update" },
      { label: "Conversion Lift", value: "+312%", description: "Institutional onboarding rate" },
      { label: "Daily Volume", value: "$42M+", description: "Asset flow through platform" }
    ],
    challenge: "The client needed a Bloomberg-grade trading interface that could stream 10,000 price ticks/sec without frame drops, wrapped in an ultra-clean minimalist dark design.",
    solution: "Architected a custom canvas-accelerated WebGL charts layer paired with React 19 concurrent mode and zero-layout shift state pipelines.",
    deliverables: ["Full-Stack Trading Web App", "Interactive Charts Engine", "Design System (500+ tokens)", "Real-Time Telemetry API"],
    techStack: ["React 19", "TypeScript", "Tailwind CSS", "Motion", "ChartJS / D3", "Node.js WebSocket"],
    liveUrl: "https://kroma-preview.example.com",
    featured: true
  },
  {
    id: "proj-zenith-hypercar",
    title: "Zenith GT: Cinematic Launch Film",
    subtitle: "4K Color Grade, Dynamic Speed-Ramps & Sound Architecture",
    category: "Video Editing",
    client: "Zenith Automotive (Munich)",
    year: "2025",
    thumbnail: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80"
    ],
    videoPreviewUrl: "https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-through-a-dark-tunnel-41712-large.mp4",
    videoDuration: "1:15",
    tags: ["DaVinci Resolve", "After Effects 3D", "Cinematic Sound Design", "4K HDR Master"],
    metrics: [
      { label: "Total Views", value: "8.4M+", description: "Across YouTube & Instagram" },
      { label: "Pre-Orders Placed", value: "1,240", description: "$248M reservation value" },
      { label: "Retention Rate", value: "88.2%", description: "Completed full 75-second film" }
    ],
    challenge: "Deliver an adrenaline-fueled luxury car reveal with seamless match-cuts, customized ACES color pipeline, and spatial Dolby 5.1 audio mix.",
    solution: "Executed multi-cam 4K ProRes editing with custom kinetic 3D typography overlays, bespoke sub-bass synthesizer sound design, and aggressive micro-contrast grade.",
    deliverables: ["60s Cinema Commercial", "15s Vertical Shorts Suite", "Custom Sound Design Score", "Color LUTs Package"],
    techStack: ["DaVinci Resolve Studio", "Adobe Premiere Pro", "After Effects", "Pro Tools"],
    liveUrl: "https://zenith-film.example.com",
    featured: true
  },
  {
    id: "proj-nebula-quantum",
    title: "Nebula Quantum Brand Architecture",
    subtitle: "Complete 3D Visual Identity, Typography Guidelines & UI Kit",
    category: "Graphic Design",
    client: "Nebula Quantum Computing (London)",
    year: "2025",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1200&auto=format&fit=crop&q=80"
    ],
    tags: ["Figma Enterprise", "Blender 3D", "Brand Identity", "Design System", "Print Packaging"],
    metrics: [
      { label: "Brand Equity Index", value: "+280%", description: "Post-rebrand investor survey" },
      { label: "Design Token Coverage", value: "100%", description: "Synced directly into production code" },
      { label: "Series B Funding", value: "$65M", description: "Raised with new brand kit" }
    ],
    challenge: "Quantum computing is complex and abstract. Nebula needed an identity that conveyed cutting-edge scientific precision without sacrificing warmth and commercial luxury.",
    solution: "Crafted a dynamic generative particle mark inspired by quantum entanglement, paired with a custom geometric sans typeface and ultra-rich obsidian packaging textures.",
    deliverables: ["Brand Identity Manual (140 pgs)", "Custom 3D Iconography Suite", "Figma Tokenized Design System", "Investor Pitch Deck Master"],
    techStack: ["Figma", "Blender 3D", "Adobe Illustrator", "Cinema 4D"],
    liveUrl: "https://nebula-brand.example.com",
    featured: true
  },
  {
    id: "proj-hyperscale-content",
    title: "Hyperscale Viral Growth & Thought Leadership",
    subtitle: "Multi-Platform B2B Copywriting, Technical Articles & Newsletter Engine",
    category: "Content Creation",
    client: "Hyperscale Cloud (Austin)",
    year: "2025",
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80"
    ],
    tags: ["SEO Architecture", "Ghostwriting", "Viral LinkedIn Scripts", "B2B Whitepapers"],
    metrics: [
      { label: "Newsletter Growth", value: "94,000+", description: "Subscribers gained in 6 months" },
      { label: "SEO #1 Positions", value: "48 Keywords", description: "High-intent developer search" },
      { label: "Inbound Pipeline", value: "$3.8M", description: "Directly attributed to content" }
    ],
    challenge: "Cloud infrastructure marketing was filled with dry jargon that produced low social engagement and zero inbound enterprise leads.",
    solution: "Rebuilt the editorial engine into a developer-first story studio: crafting deep-dive technical benchmarks, viral founder essays, and an irresistible weekly newsletter.",
    deliverables: ["Weekly Engineering Newsletter", "32 Long-form Technical Whitepapers", "Social Media Hook Playbook", "Executive LinkedIn Ghostwriting"],
    techStack: ["Substack Engine", "Notion CMS", "Ahrefs & SEMRush", "Ghost API"],
    liveUrl: "https://hyperscale-insights.example.com",
    featured: true
  },
  {
    id: "proj-verve-atelier",
    title: "Verve Atelier: 3D Luxury Commerce",
    subtitle: "High-End Architectural E-Commerce with Real-Time Room Configurator",
    category: "Web Development",
    client: "Verve Atelier (Stockholm & Milan)",
    year: "2025",
    thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop&q=80"
    ],
    videoPreviewUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-keyboard-43380-large.mp4",
    videoDuration: "0:30",
    tags: ["Headless Shopify", "Three.js", "React Three Fiber", "Next.js", "Tailwind CSS"],
    metrics: [
      { label: "Average Order Value", value: "$3,450", description: "+84% increase with 3D preview" },
      { label: "Lighthouse Score", value: "99 / 100", description: "Performance on mobile" },
      { label: "Cart Abandonment", value: "-41%", description: "Optimized 1-page checkout" }
    ],
    challenge: "Bridging the gap between ultra-luxury bespoke furniture shopping and web interactivity without compromising speed or mobile responsiveness.",
    solution: "Engineered a photorealistic Three.js shader engine that allows customers to swap fabric textures, wood grains, and lighting environments in real-time.",
    deliverables: ["Custom Headless Storefront", "3D WebGL Configurator", "Automated ERP Order Sync", "Multilingual Internationalization"],
    techStack: ["Next.js 15", "Three.js", "Shopify Storefront API", "Tailwind CSS", "Stripe Connect"],
    liveUrl: "https://verve-atelier.example.com",
    featured: false
  },
  {
    id: "proj-bytedance-reels",
    title: "Global Creator Series: Viral Motion Engine",
    subtitle: "Fast-Paced Kinetic Typography & Short-Form Storytelling Suite",
    category: "Video Editing",
    client: "Pulse Media Global",
    year: "2025",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&auto=format&fit=crop&q=80"
    ],
    tags: ["TikTok / Reels", "Kinetic Typography", "Motion Graphics", "3D Camera Tracking"],
    metrics: [
      { label: "Accumulated Views", value: "32.6M", description: "Across 40 short-form releases" },
      { label: "Follower Growth", value: "+420k", description: "Within 90 days of release" },
      { label: "Engagement Rate", value: "14.8%", description: "Industry benchmark is ~3.2%" }
    ],
    challenge: "Create rapid-fire visual edits that hold viewer attention past the 3-second drop-off mark while maintaining crisp high-fashion brand aesthetics.",
    solution: "Implemented frame-by-frame sound design sync, custom 3D element tracking, and animated kinetic subtitles tailored for sound-off mobile browsing.",
    deliverables: ["40x Vertical Master Edits", "Reusable Motion Graphics Template", "Sound Effects SFX Library", "Aspect Ratio Conversion Kit"],
    techStack: ["Adobe Premiere Pro", "After Effects", "Boris FX Mocha", "Logic Pro X"],
    liveUrl: "https://creator-reel.example.com",
    featured: false
  },
  {
    id: "proj-onyx-packaging",
    title: "Onyx Reserve: Luxury Tactile Packaging",
    subtitle: "Matte Foil Stamping, Structural 3D CAD & Sustainable Unboxing Experience",
    category: "Graphic Design",
    client: "Onyx Distillers (Kyoto & New York)",
    year: "2025",
    thumbnail: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=900&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80"
    ],
    tags: ["Packaging Design", "Structural CAD", "3D KeyShot Renders", "Foil Stamping"],
    metrics: [
      { label: "Red Dot Design Award", value: "Winner 2025", description: "Best Luxury Packaging" },
      { label: "Retail Placement", value: "450+ Stores", description: "Secured high-end boutique shelves" },
      { label: "Eco-Footprint", value: "-62%", description: "100% Biodegradable hemp pulp" }
    ],
    challenge: "Craft an unboxing ritual for an ultra-premium single-malt spirit that feels regal, tactile, and completely eco-responsible.",
    solution: "Designed custom molded cellulose structures encased in embossed charcoal cotton paper, accented with debossed gold leaf typography.",
    deliverables: ["Structural Dieline Blueprints", "Production Ready CMYK + Spot Plates", "3D Photorealistic KeyShot Renders", "Retail Point-of-Sale Displays"],
    techStack: ["Adobe Illustrator", "KeyShot 3D", "Rhino CAD", "InDesign"],
    liveUrl: "https://onyx-reserve.example.com",
    featured: false
  },
  {
    id: "proj-solstice-narrative",
    title: "Solstice Lifestyle: The Rebirth Campaign",
    subtitle: "Brand Manifesto, Visual Scripting & Omnichannel Launch Strategy",
    category: "Content Creation",
    client: "Solstice Apparel",
    year: "2025",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80"
    ],
    tags: ["Brand Manifesto", "Scriptwriting", "E-Commerce Copy", "Omnichannel Strategy"],
    metrics: [
      { label: "Launch Day Revenue", value: "$890,000", description: "Sold out initial 10,000 units" },
      { label: "Email Open Rate", value: "54.2%", description: "Industry average is 21.5%" },
      { label: "Social Mentions", value: "+600%", description: "UGC campaign participation" }
    ],
    challenge: "Reposition a fast-fashion brand into an elevated sustainable luxury house through deeply evocative, poetic brand storytelling.",
    solution: "Authored 'The Rebirth Manifesto' - a multi-sensory brand narrative woven across video voiceovers, product tags, editorial lookbooks, and high-converting launch emails.",
    deliverables: ["Brand Manifesto Film Script", "30-Day Launch Copy Kit", "Product Description System", "Press Release & Media Kit"],
    techStack: ["Figma Copy Tokens", "Notion Narrative Hub", "Klaviyo Workflow Studio"],
    liveUrl: "https://solstice-story.example.com",
    featured: false
  }
];
