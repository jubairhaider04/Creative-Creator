/**
 * Bongio Digital - Centralized Multilingual Pricing Configuration
 *
 * IMPORTANT:
 * - This is the single source of truth for all pricing across the entire website.
 * - Stores fixed BDT and USD prices for every service, package, addon, and tier.
 * - Prices are NOT converted dynamically on the frontend via exchange rates;
 *   each market's pricing is explicitly defined here so Bongio Digital controls
 *   exact pricing in both USD ($) and BDT (৳).
 */

export type CurrencyCode = "USD" | "BDT";

export interface DualPrice {
  usd: number;
  bdt: number;
}

export interface LocalizedText {
  en: string;
  bn: string;
  es?: string;
}

export interface PlanConfig {
  id: "starter" | "growth" | "scale";
  name: LocalizedText;
  tagline: LocalizedText;
  price: DualPrice;
  regularPrice: DualPrice;
  period?: LocalizedText;
  badge?: LocalizedText;
  isPopular?: boolean;
  idealFor: LocalizedText;
  turnaroundDays: LocalizedText;
  paymentTerms: LocalizedText;
  features: {
    en: string[];
    bn: string[];
    es?: string[];
  };
  bonuses: {
    en: string[];
    bn: string[];
    es?: string[];
  };
  ctaText: LocalizedText;
  whatsAppMessage: LocalizedText;
}

export interface ServicePriceConfig {
  id: string;
  title: LocalizedText;
  startingPrice: DualPrice;
  turnaroundTime: LocalizedText;
}

export interface AddonPriceConfig {
  id: string;
  label: LocalizedText;
  price: DualPrice;
}

export interface BudgetBracketConfig {
  id: string;
  label: LocalizedText;
  min: DualPrice;
  max: DualPrice | null;
}

export const CENTRALIZED_PRICING = {
  // 1. Packages / Subscription Plans
  plans: {
    starter: {
      id: "starter",
      name: {
        en: "Starter Package",
        bn: "স্টার্টার প্যাকেজ",
        es: "Paquete Starter"
      },
      tagline: {
        en: "Essential online presence for local shops, clinics, restaurants & startups.",
        bn: "ছোট ব্যবসা, শপ ও নতুন উদ্যোক্তাদের জন্য নিখুঁত অনলাইন সূচনা।",
        es: "Presencia online esencial para negocios locales, clínicas, tiendas y startups."
      },
      // Fixed Market Pricing: USD $149 | BDT ৳15,000 (Easily updateable here)
      price: {
        usd: 149,
        bdt: 15000
      },
      regularPrice: {
        usd: 199,
        bdt: 20000
      },
      period: {
        en: "/ package",
        bn: "/ প্যাকেজ",
        es: "/ paquete"
      },
      badge: {
        en: "Startup Friendly",
        bn: "স্টার্টআপ ফ্রেন্ডলি",
        es: "Ideal Startups"
      },
      isPopular: false,
      idealFor: {
        en: "Local shops, personal portfolios, clinics, restaurants & new entrepreneurs",
        bn: "লোকাল শপ, পার্সোনাল ব্র্যান্ড, ক্লিনিক, রেস্টুরেন্ট ও নতুন উদ্যোক্তা",
        es: "Negocios locales, portafolios personales, clínicas y nuevos emprendedores"
      },
      turnaroundDays: {
        en: "5 - 7 Days",
        bn: "৫ - ৭ দিন",
        es: "5 - 7 Días"
      },
      paymentTerms: {
        en: "50% upfront, 50% upon final delivery",
        bn: "৫০% অগ্রিম এবং কাজ শেষে বাকি ৫০%",
        es: "50% de anticipo, 50% contra entrega final"
      },
      features: {
        en: [
          "1–3 Page ultra-fast & mobile-responsive website",
          "Direct WhatsApp chat & click-to-call integration",
          "Google Maps listing & Local SEO optimization",
          "5 Custom social media promotional banner designs",
          "Free .com domain connection & 1-year fast cloud hosting guidance",
          "Interactive contact form with instant email alerts",
          "1 Month of free technical support & warranty"
        ],
        bn: [
          "১-৩ পৃষ্ঠার আল্ট্রা-ফাস্ট ও মোবাইল ফ্রেন্ডলি ওয়েবসাইট",
          "সরাসরি WhatsApp চ্যাট বাটন ও কলিং ইন্টিগ্রেশন",
          "গুগল ম্যাপস লোকেশন ও লোকাল এসইও (Google My Business)",
          "৫টি আকর্ষণীয় সোশ্যাল মিডিয়া প্রমোশনাল ব্যানার ডিজাইন",
          "ফ্রি .com ডোমেইন কানেকশন ও ১ বছর সুপার-ফাস্ট ক্লাউড হোস্টিং",
          "কন্ট্যাক্ট ও ইনকোয়ারি ফর্ম (সরাসরি ইমেইল নোটিফিকেশন)",
          "১ মাসের ফ্রি টেকনিক্যাল সাপোর্ট ও মেইনটেনেন্স"
        ],
        es: [
          "Sitio web de 1 a 3 páginas ultra rápido y responsive",
          "Integración de botón de chat directo por WhatsApp y llamada",
          "Configuración en Google Maps y SEO local optimizado",
          "5 Diseños de banners promocionales para redes sociales",
          "Conexión de dominio .com y hosting en la nube por 1 año",
          "Formulario de contacto con alertas inmediatas por correo",
          "1 Mes de soporte técnico y mantenimiento incluido"
        ]
      },
      bonuses: {
        en: [
          "Free logo refresh & Facebook page cover kit ($50 value)",
          "Video walkthrough tutorial for site management"
        ],
        bn: [
          "ফ্রি বেসিক লোগো রিফ্রেশ ও ফেসবুক পেজ কভার সেটআপ (৳ ৩,০০০ মূল্য)",
          "ওয়েবসাইট পরিচালনার সহজ বাংলা ভিডিও টিউটোরিয়াল"
        ],
        es: [
          "Kit de portada para redes sociales y rediseño de logo básico",
          "Tutorial en video para la autogestión de la web"
        ]
      },
      ctaText: {
        en: "Book Starter Package",
        bn: "স্টার্টার প্যাকেজ বুক করুন",
        es: "Reservar Paquete Starter"
      },
      whatsAppMessage: {
        en: "Hello Bongio Digital! I am interested in the Starter Package ($149 USD) for my business and would like to start.",
        bn: "হ্যালো বংজিও ডিজিটাল! আমি আপনাদের 'স্টার্টার প্যাকেজ' (৳১৫,০০০) সম্পর্কে বিস্তারিত জানতে এবং প্রজেক্ট শুরু করতে আগ্রহী।",
        es: "¡Hola Bongio Digital! Estoy interesado en el Paquete Starter ($149 USD) para mi negocio."
      }
    },
    growth: {
      id: "growth",
      name: {
        en: "Growth Package",
        bn: "গ্রোথ প্যাকেজ",
        es: "Paquete Growth"
      },
      tagline: {
        en: "High-converting digital engine for E-commerce, apparel & growing brands.",
        bn: "ই-কমার্স, গ্রোয়িং কোম্পানি ও ব্র্যান্ডের জন্য সেলস বাড়ানোর সেরা প্যাকেজ।",
        es: "Motor digital de alta conversión para E-commerce y marcas en expansión."
      },
      // Fixed Market Pricing: USD $299 | BDT ৳35,000 (Easily updateable here)
      price: {
        usd: 299,
        bdt: 35000
      },
      regularPrice: {
        usd: 399,
        bdt: 45000
      },
      period: {
        en: "/ package",
        bn: "/ প্যাকেজ",
        es: "/ paquete"
      },
      badge: {
        en: "Most Popular",
        bn: "সবচেয়ে জনপ্রিয়",
        es: "Más Popular"
      },
      isPopular: true,
      idealFor: {
        en: "E-commerce stores, clothing brands, consulting agencies & mid-market companies",
        bn: "ই-কমার্স শপ, ট্রাভেল এজেন্সি, ক্লোথিং ব্র্যান্ড ও মাঝারি কোম্পানি",
        es: "Tiendas online, marcas de ropa, agencias de servicios y empresas medianas"
      },
      turnaroundDays: {
        en: "10 - 14 Days",
        bn: "১০ - ১৪ দিন",
        es: "10 - 14 Días"
      },
      paymentTerms: {
        en: "40% upfront, 30% milestone review, 30% delivery",
        bn: "৪০% অগ্রিম, ৩০% ডেমো দেখে, বাকি ৩০% ডেলিভারিতে",
        es: "40% anticipo, 30% tras revisión de demo, 30% entrega"
      },
      features: {
        en: [
          "Dynamic business portal or full E-commerce store (Unlimited products)",
          "Automated payment gateways (bKash, Nagad, Rocket & Cards / Stripe)",
          "10 High-retention viral video reels & social shorts editing",
          "Full brand identity kit (Vector Logo, business cards & social kit)",
          "Advanced on-page & Local SEO for top Google rankings",
          "Intuitive Admin Dashboard (Order management & inventory tracking)",
          "Automated SMS & email order notifications",
          "3 Months of full technical maintenance & speed tuning"
        ],
        bn: [
          "সম্পূর্ণ ডায়নামিক ওয়েবসাইট অথবা ফুল ই-কমার্স স্টোর (আনলিমিটেড প্রোডাক্ট)",
          "স্বয়ংক্রিয় পেমেন্ট গেটওয়ে (bKash, Nagad, Rocket ও Card পেমেন্ট)",
          "১০টি হাই-রিটেনশন ভাইরাল ভিডিও রিলস / ফেসবুক শর্টস এডিটিং",
          "সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি কিট (লোগো, বিজনেস কার্ড ও সোশ্যাল মিডিয়া কিট)",
          "গুগলে দ্রুত র‍্যাংক করার জন্য অ্যাডভান্সড অন-পেজ ও লোকাল এসইও",
          "সহজ অ্যাডমিন প্যানেল (অর্ডার ও ইনভেন্টরি ম্যানেজমেন্ট)",
          "অটোমেটিক SMS ও ইমেইল ইনভয়েস কনফার্মেশন",
          "৩ মাসের কমপ্লিট ফ্রি মেইনটেনেন্স ও স্পিড অপটিমাইজেশন"
        ],
        es: [
          "Portal dinámico o tienda E-commerce completa con productos ilimitados",
          "Pasarelas de pago automatizadas (bKash, Nagad, tarjetas internacionales)",
          "10 Reels/Shorts de video viral con edición y retención garantizada",
          "Kit completo de identidad visual (Logo vectorial, tarjetas y redes)",
          "SEO On-Page y Local para posicionamiento en Google",
          "Panel de administración intuitivo para pedidos e inventario",
          "Notificaciones automáticas por SMS y correo",
          "3 Meses de soporte técnico y optimización de velocidad"
        ]
      },
      bonuses: {
        en: [
          "Free Meta Pixel & Conversion API setup ($50 value)",
          "Product photography retouching & marketing banner support"
        ],
        bn: [
          "৳ ৫,০০০ সমমূল্যের ফেসবুক পিক্সেল ও কনভার্সন এপিআই সেটআপ ফ্রি",
          "প্রোডাক্ট ফটোগ্রাফি এডিটিং ও ব্যানার গ্রাফিক্স সাপোর্ট"
        ],
        es: [
          "Instalación gratuita de Meta Pixel y API de Conversiones ($50 valor)",
          "Retoque fotográfico de productos y banners publicitarios"
        ]
      },
      ctaText: {
        en: "Choose Growth Package",
        bn: "গ্রোথ প্যাকেজ নির্বাচন করুন",
        es: "Elegir Paquete Growth"
      },
      whatsAppMessage: {
        en: "Hello Bongio Digital! I want to book the Growth Package ($299 USD) to scale my business sales.",
        bn: "হ্যালো বংজিও ডিজিটাল! আমি আপনাদের 'গ্রোথ প্যাকেজ' (৳৩৫,০০০) বুক করতে চাই এবং আমার ব্যবসার বিস্তারিত আলোচনা করতে চাই।",
        es: "¡Hola Bongio Digital! Deseo contratar el Paquete Growth ($299 USD) para escalar mis ventas."
      }
    },
    scale: {
      id: "scale",
      name: {
        en: "Scale Package",
        bn: "স্কেল প্যাকেজ",
        es: "Paquete Scale"
      },
      tagline: {
        en: "All-in-one digital studio solution for established enterprises & multi-branch brands.",
        bn: "প্রতিষ্ঠিত কোম্পানি, এক্সপোর্টার ও হাই-গ্রোথ ব্যবসার জন্য অল-ইন-ওয়ান সল্যুশন।",
        es: "Solución de estudio integral para empresas consolidadas y marcas corporativas."
      },
      // Fixed Market Pricing: USD $599 | BDT ৳75,000 (Easily updateable here)
      price: {
        usd: 599,
        bdt: 75000
      },
      regularPrice: {
        usd: 799,
        bdt: 95000
      },
      period: {
        en: "/ package",
        bn: "/ প্যাকেজ",
        es: "/ paquete"
      },
      badge: {
        en: "Full Studio Solution",
        bn: "ফুল স্টুডিও সল্যুশন",
        es: "Estudio Completo"
      },
      isPopular: false,
      idealFor: {
        en: "Multi-branch businesses, exporters, software firms & corporate enterprises",
        bn: "মাল্টি-ব্রাঞ্চ ব্যবসা, এক্সপোর্টার, সফটওয়্যার কোম্পানি ও কর্পোরেট ব্র্যান্ড",
        es: "Empresas multisede, exportadores, startups SaaS y marcas consolidadas"
      },
      turnaroundDays: {
        en: "3 - 4 Weeks",
        bn: "৩ - ৪ সপ্তাহ",
        es: "3 - 4 Semanas"
      },
      paymentTerms: {
        en: "Flexible 3-stage milestone installment schedule",
        bn: "মাইলস্টোন অনুযায়ী ৩ কিস্তিতে পেমেন্ট সুবিধা",
        es: "Esquema flexible de pago en 3 etapas por hitos"
      },
      features: {
        en: [
          "Custom high-end web platform / multi-vendor / SaaS system architecture",
          "Full digital studio production (Web + 25 viral video edits + 20 graphic assets)",
          "Smart 24/7 AI customer service chatbot (Powered by Gemini AI)",
          "Advanced CRM, inventory automation & automated billing system",
          "Full domestic & international payment gateway integrations (SSLCommerz, Stripe, bKash)",
          "High-conversion Facebook & Google ad funnel strategy and setup",
          "Dedicated Senior Project Manager & 24/7 priority WhatsApp/phone channel",
          "6 Months of fully managed cloud infrastructure and daily automated backups"
        ],
        bn: [
          "কাস্টম হাই-এন্ড ওয়েব পোর্টাল / মাল্টি-ভেন্ডর / SaaS প্ল্যাটফর্ম আর্কিটেকচার",
          "সম্পূর্ণ ডিজিটাল স্টুডিও সাপোর্ট (ওয়েব + ২৫টি ভাইরাল ভিডিও এডিটিং + ২০টি গ্রাফিক্স)",
          "স্মার্ট AI কাস্টমার সাপোর্ট চ্যাটবট ইন্টিগ্রেশন (Gemini AI Powered)",
          "অ্যাডভান্সড CRM, স্টক ম্যানেজমেন্ট ও ইনভয়েস অটোমেশন সিস্টেম",
          "আন্তর্জাতিক ও দেশীয় সকল পেমেন্ট গেটওয়ে (SSLCommerz, Stripe, bKash)",
          "ফেসবুক ও গুগল হাই-কনভার্সন বিজ্ঞাপন ফানেল স্ট্র্যাটেজি ও সেটআপ",
          "ডেডিকেটেড প্রজেক্ট ম্যানেজার ও ২৪/৭ প্রায়োরিটি ফোন/WhatsApp সাপোর্ট",
          "৬ মাসের ফুল ডেডিকেটেড ক্লাউড সার্ভার ম্যানেজমেন্ট ও সিকিউরিটি ব্যাকআপ"
        ],
        es: [
          "Portal web personalizado de alto rendimiento / multi-vendedor o SaaS",
          "Producción integral de estudio (Web + 25 videos virales + 20 creatividades)",
          "Chatbot inteligente de atención al cliente 24/7 (Potenciado por Gemini AI)",
          "CRM avanzado, control de stock y automatización de facturación",
          "Integración completa de pagos nacionales e internacionales (SSLCommerz, Stripe)",
          "Estrategia e implementación de embudos de conversión para Meta y Google Ads",
          "Project Manager dedicado y canal prioritario de WhatsApp 24/7",
          "6 Meses de infraestructura cloud dedicada y copias de seguridad continuas"
        ]
      },
      bonuses: {
        en: [
          "Free custom 3D product visuals and promo video ($150 value)",
          "VIP 1-on-1 growth consulting & marketing strategy roadmap"
        ],
        bn: [
          "৳ ১৫,০০০ সমমূল্যের কাস্টম ৩D প্রোডাক্ট ভিজ্যুয়াল ও ব্র্যান্ড ভিডিও ফ্রি",
          "ভিআইপি ওয়ান-অন-ওয়ান গ্রোথ কনসাল্টেশন সেশন"
        ],
        es: [
          "Visuales 3D para productos y video corporativo incluidos ($150 valor)",
          "Sesión VIP de consultoría estratégica 1-a-1"
        ]
      },
      ctaText: {
        en: "Inquire for Scale Package",
        bn: "স্কেল প্যাকেজে আলোচনা শুরু করুন",
        es: "Consultar por Paquete Scale"
      },
      whatsAppMessage: {
        en: "Hello Bongio Digital! Our enterprise requires the Scale Package ($599 USD) full studio production. Let's discuss our roadmap.",
        bn: "হ্যালো বংজিও ডিজিটাল! আমাদের প্রতিষ্ঠিত ব্যবসার জন্য 'স্কেল প্যাকেজ' (৳৭৫,০০০) ফুল স্টুডিও সল্যুশন প্রয়োজন। প্রজেক্ট নিয়ে কথা বলতে চাই।",
        es: "¡Hola Bongio Digital! Nuestra empresa requiere la solución integral Paquete Scale ($599 USD)."
      }
    }
  } as Record<string, PlanConfig>,

  // 2. Individual Core Services (Starting / Base Rates)
  services: {
    webDevelopment: {
      id: "serv-web-dev",
      title: {
        en: "Web Development",
        bn: "ওয়েব ডেভেলপমেন্ট",
        es: "Desarrollo Web"
      },
      startingPrice: {
        usd: 150,
        bdt: 18000
      },
      turnaroundTime: {
        en: "7 - 10 Days",
        bn: "৭ - ১০ দিন",
        es: "7 - 10 Días"
      }
    },
    contentCreation: {
      id: "serv-content-creation",
      title: {
        en: "Content Creation",
        bn: "কনটেন্ট ক্রিয়েশন ও সোশ্যাল মিডিয়া",
        es: "Creación de Contenido"
      },
      startingPrice: {
        usd: 75,
        bdt: 8500
      },
      turnaroundTime: {
        en: "3 - 5 Days",
        bn: "৩ - ৫ দিন",
        es: "3 - 5 Días"
      }
    },
    videoEditing: {
      id: "serv-video-editing",
      title: {
        en: "Video Editing",
        bn: "ভিডিও এডিটিং ও কালার গ্রেডিং",
        es: "Edición de Video"
      },
      startingPrice: {
        usd: 89,
        bdt: 10000
      },
      turnaroundTime: {
        en: "2 - 4 Days",
        bn: "২ - ৪ দিন",
        es: "2 - 4 Días"
      }
    },
    graphicDesign: {
      id: "serv-graphic-design",
      title: {
        en: "Graphic Design",
        bn: "গ্রাফিক ডিজাইন ও ব্র্যান্ড আইডেন্টিটি",
        es: "Diseño Gráfico"
      },
      startingPrice: {
        usd: 79,
        bdt: 9500
      },
      turnaroundTime: {
        en: "2 - 3 Days",
        bn: "২ - ৩ দিন",
        es: "2 - 3 Días"
      }
    }
  } as Record<string, ServicePriceConfig>,

  // 3. Calculator Strategic Add-ons
  addons: {
    seoOptimization: {
      id: "seo-optimization",
      label: {
        en: "Google Maps & Local SEO Optimization (99+ Audit)",
        bn: "গুগল ম্যাপস ও লোকাল এসইও (99+ SEO Audit)",
        es: "Optimización SEO Local y Google Maps"
      },
      price: {
        usd: 29,
        bdt: 3500
      }
    },
    paymentGateway: {
      id: "bkash-nagad-gateway",
      label: {
        en: "Automatic Payment Gateway Setup (bKash/Nagad/Stripe)",
        bn: "বিকাশ ও নগদ অটোমেটিক পেমেন্ট গেটওয়ে সেটআপ",
        es: "Pasarelas de pago automatizadas"
      },
      price: {
        usd: 35,
        bdt: 4000
      }
    },
    figmaBrandKit: {
      id: "figma-brand-kit",
      label: {
        en: "Complete Brand Identity & Figma Vector Kit",
        bn: "কমপ্লিট ব্র্যান্ড আইডেন্টিটি ও Figma ভেক্টর কিট",
        es: "Kit de Identidad de Marca y Archivos Figma"
      },
      price: {
        usd: 45,
        bdt: 5000
      }
    },
    aiAutomationSocial: {
      id: "ai-automation-social",
      label: {
        en: "AI Automation Develop for Any Social Media Services (Auto DMs, Comment Bots & Auto-Posting)",
        bn: "সোশ্যাল মিডিয়ার জন্য AI Automation Develop (অটো DM, কমেন্ট বট ও পোস্টিং)",
        es: "AI Automation Develop para redes sociales"
      },
      price: {
        usd: 39,
        bdt: 4500
      }
    },
    motionReels: {
      id: "4k-motion-reels",
      label: {
        en: "5 Custom Viral Video Reels & Ad Creatives",
        bn: "৫টি কাস্টম ভাইরাল ভিডিও রিলস ও সোশ্যাল অ্যাডস",
        es: "5 Reels de Video Viral y Anuncios Promocionales"
      },
      price: {
        usd: 50,
        bdt: 6000
      }
    },
    interactive3d: {
      id: "interactive-3d-webgl",
      label: {
        en: "Interactive 3D / WebGL Animations & Custom Features",
        bn: "ইন্টারেক্টিভ ৩D অ্যানিমেশন ও কাস্টম ফিচার্স",
        es: "Animaciones 3D / WebGL y Funcionalidades a Medida"
      },
      price: {
        usd: 69,
        bdt: 8000
      }
    }
  } as Record<string, AddonPriceConfig>,

  // 4. Budget Brackets for Inquiries, Quote Selection & Dashboards
  budgetBrackets: [
    {
      id: "starter-tier",
      label: {
        en: "$100 - $250 (Starter Tier)",
        bn: "৳ ১০,০০০ - ৳ ২৫,০০০ (স্টার্টার প্যাকেজ)",
        es: "$100 - $250 (Nivel Inicial)"
      },
      min: { usd: 100, bdt: 10000 },
      max: { usd: 250, bdt: 25000 }
    },
    {
      id: "growth-tier",
      label: {
        en: "$250 - $500 (Growth Tier - Popular)",
        bn: "৳ ২৫,০০০ - ৳ ৫০,০০০ (গ্রোথ প্যাকেজ - সবচেয়ে জনপ্রিয়)",
        es: "$250 - $500 (Nivel Crecimiento - Popular)"
      },
      min: { usd: 250, bdt: 25000 },
      max: { usd: 500, bdt: 50000 }
    },
    {
      id: "scale-tier",
      label: {
        en: "$500 - $1,000 (Scale Tier)",
        bn: "৳ ৫০,০০০ - ৳ ১,০০,০০০ (স্কেল প্যাকেজ)",
        es: "$500 - $1,000 (Nivel Escala)"
      },
      min: { usd: 500, bdt: 50000 },
      max: { usd: 1000, bdt: 100000 }
    },
    {
      id: "enterprise-tier",
      label: {
        en: "$1,000+ (Enterprise Full Studio)",
        bn: "৳ ১,০০,০০০+ (ফুল এন্টারপ্রাইজ সল্যুশন)",
        es: "$1,000+ (Solución Corporativa)"
      },
      min: { usd: 1000, bdt: 100000 },
      max: null
    }
  ] as BudgetBracketConfig[]
};
