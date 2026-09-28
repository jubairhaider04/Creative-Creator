export interface PricingPlan {
  id: "starter" | "growth" | "scale";
  name: string;
  tagline: string;
  priceTk: number;
  formattedTk: string;
  regularPriceTk: string;
  badge?: string;
  isPopular?: boolean;
  idealFor: string;
  turnaroundDays: string;
  paymentTerms: string;
  features: string[];
  bonuses: string[];
  ctaText: string;
  whatsAppMessage: string;
  // Localized versions
  bn?: {
    name: string;
    tagline: string;
    idealFor: string;
    turnaroundDays: string;
    paymentTerms: string;
    features: string[];
    bonuses: string[];
    ctaText: string;
    badge?: string;
    whatsAppMessage: string;
  };
  es?: {
    name: string;
    tagline: string;
    idealFor: string;
    turnaroundDays: string;
    paymentTerms: string;
    features: string[];
    bonuses: string[];
    ctaText: string;
    badge?: string;
    whatsAppMessage: string;
  };
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter Package",
    tagline: "Essential online presence for local shops, clinics, restaurants & startups.",
    priceTk: 15000,
    formattedTk: "৳ 15,000",
    regularPriceTk: "৳ 20,000",
    badge: "Startup Friendly",
    isPopular: false,
    idealFor: "Local shops, personal portfolios, clinics, restaurants & new entrepreneurs",
    turnaroundDays: "5 - 7 Days",
    paymentTerms: "50% upfront, 50% upon final delivery",
    features: [
      "1–3 Page ultra-fast & mobile-responsive website",
      "Direct WhatsApp chat & click-to-call integration",
      "Google Maps listing & Local SEO optimization",
      "5 Custom social media promotional banner designs",
      "Free .com domain connection & 1-year fast cloud hosting guidance",
      "Interactive contact form with instant email alerts",
      "1 Month of free technical support & warranty"
    ],
    bonuses: [
      "Free logo refresh & Facebook page cover kit",
      "Video walkthrough tutorial for site management"
    ],
    ctaText: "Book Starter Package",
    whatsAppMessage: "Hello Bongio Digital! I am interested in the Starter Package (৳ 15,000 BDT) for my business and would like to start.",
    bn: {
      name: "স্টার্টার প্যাকেজ",
      tagline: "ছোট ব্যবসা, শপ ও নতুন উদ্যোক্তাদের জন্য নিখুঁত অনলাইন সূচনা।",
      idealFor: "লোকাল শপ, পার্সোনাল ব্র্যান্ড, ক্লিনিক, রেস্টুরেন্ট ও নতুন উদ্যোক্তা",
      turnaroundDays: "৫ - ৭ দিন",
      paymentTerms: "৫০% অগ্রিম এবং কাজ শেষে বাকি ৫০%",
      features: [
        "১-৩ পৃষ্ঠার আল্ট্রা-ফাস্ট ও মোবাইল ফ্রেন্ডলি ওয়েবসাইট",
        "সরাসরি WhatsApp চ্যাট বাটন ও কলিং ইন্টিগ্রেশন",
        "গুগল ম্যাপস লোকেশন ও লোকাল এসইও (Google My Business)",
        "৫টি আকর্ষণীয় সোশ্যাল মিডিয়া প্রমোশনাল ব্যানার ডিজাইন",
        "ফ্রি .com ডোমেইন কানেকশন ও ১ বছর সুপার-ফাস্ট ক্লাউড হোস্টিং",
        "কন্ট্যাক্ট ও ইনকোয়ারি ফর্ম (সরাসরি ইমেইল নোটিফিকেশন)",
        "১ মাসের ফ্রি টেকনিক্যাল সাপোর্ট ও মেইনটেনেন্স"
      ],
      bonuses: [
        "ফ্রি বেসিক লোগো রিফ্রেশ ও ফেসবুক পেজ কভার সেটআপ",
        "ওয়েবসাইট পরিচালনার সহজ বাংলা ভিডিও টিউটোরিয়াল"
      ],
      ctaText: "স্টার্টার প্যাকেজ বুক করুন",
      badge: "স্টার্টআপ ফ্রেন্ডলি",
      whatsAppMessage: "হ্যালো বংজিও ডিজিটাল! আমি আপনাদের 'স্টার্টার প্যাকেজ' (৳১৫,০০০) সম্পর্কে বিস্তারিত জানতে এবং প্রজেক্ট শুরু করতে আগ্রহী।"
    },
    es: {
      name: "Paquete Starter",
      tagline: "Presencia online esencial para negocios locales, clínicas, tiendas y startups.",
      idealFor: "Negocios locales, portafolios personales, clínicas y nuevos emprendedores",
      turnaroundDays: "5 - 7 Días",
      paymentTerms: "50% de anticipo, 50% contra entrega final",
      features: [
        "Sitio web de 1 a 3 páginas ultra rápido y responsive",
        "Integración de botón de chat directo por WhatsApp y llamada",
        "Configuración en Google Maps y SEO local optimizado",
        "5 Diseños de banners promocionales para redes sociales",
        "Conexión de dominio .com y hosting en la nube por 1 año",
        "Formulario de contacto con alertas inmediatas por correo",
        "1 Mes de soporte técnico y mantenimiento incluido"
      ],
      bonuses: [
        "Kit de portada para redes sociales y rediseño de logo básico",
        "Tutorial en video para la autogestión de la web"
      ],
      ctaText: "Reservar Paquete Starter",
      badge: "Ideal Startups",
      whatsAppMessage: "¡Hola Bongio Digital! Estoy interesado en el Paquete Starter (৳ 15,000 BDT) para mi negocio."
    }
  },
  {
    id: "growth",
    name: "Growth Package",
    tagline: "High-converting digital engine for E-commerce, apparel & growing brands.",
    priceTk: 35000,
    formattedTk: "৳ 35,000",
    regularPriceTk: "৳ 45,000",
    badge: "Most Popular",
    isPopular: true,
    idealFor: "E-commerce stores, clothing brands, consulting agencies & mid-market companies",
    turnaroundDays: "10 - 14 Days",
    paymentTerms: "40% upfront, 30% milestone review, 30% delivery",
    features: [
      "Dynamic business portal or full E-commerce store (Unlimited products)",
      "Automated payment gateways (bKash, Nagad, Rocket & Cards)",
      "10 High-retention viral video reels & social shorts editing",
      "Full brand identity kit (Vector Logo, business cards & social kit)",
      "Advanced on-page & Local SEO for top Google rankings",
      "Intuitive Admin Dashboard (Order management & inventory tracking)",
      "Automated SMS & email order notifications",
      "3 Months of full technical maintenance & speed tuning"
    ],
    bonuses: [
      "Free Meta Pixel & Conversion API setup (৳ 5,000 value)",
      "Product photography retouching & marketing banner support"
    ],
    ctaText: "Choose Growth Package",
    whatsAppMessage: "Hello Bongio Digital! I want to book the Growth Package (৳ 35,000 BDT) to scale my business sales.",
    bn: {
      name: "গ্রোথ প্যাকেজ",
      tagline: "ই-কমার্স, গ্রোয়িং কোম্পানি ও ব্র্যান্ডের জন্য সেলস বাড়ানোর সেরা প্যাকেজ।",
      idealFor: "ই-কমার্স শপ, ট্রাভেল এজেন্সি, ক্লোথিং ব্র্যান্ড ও মাঝারি কোম্পানি",
      turnaroundDays: "১০ - ১৪ দিন",
      paymentTerms: "৪০% অগ্রিম, ৩০% ডেমো দেখে, বাকি ৩০% ডেলিভারিতে",
      features: [
        "সম্পূর্ণ ডায়নামিক ওয়েবসাইট অথবা ফুল ই-কমার্স স্টোর (আনলিমিটেড প্রোডাক্ট)",
        "স্বয়ংক্রিয় পেমেন্ট গেটওয়ে (bKash, Nagad, Rocket ও Card পেমেন্ট)",
        "১০টি হাই-রিটেনশন ভাইরাল ভিডিও রিলস / ফেসবুক শর্টস এডিটিং",
        "সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি কিট (লোগো, বিজনেস কার্ড ও সোশ্যাল মিডিয়া কিট)",
        "গুগলে দ্রুত র‍্যাংক করার জন্য অ্যাডভান্সড অন-পেজ ও লোকাল এসইও",
        "সহজ অ্যাডমিন প্যানেল (অর্ডার ও ইনভেন্টরি ম্যানেজমেন্ট)",
        "অটোমেটিক SMS ও ইমেইল ইনভয়েস কনফার্মেশন",
        "৩ মাসের কমপ্লিট ফ্রি মেইনটেনেন্স ও স্পিড অপটিমাইজেশন"
      ],
      bonuses: [
        "৳ ৫,০০০ সমমূল্যের ফেসবুক পিক্সেল ও কনভার্সন এপিআই সেটআপ ফ্রি",
        "প্রোডাক্ট ফটোগ্রাফি এডিটিং ও ব্যানার গ্রাফিক্স সাপোর্ট"
      ],
      ctaText: "গ্রোথ প্যাকেজ নির্বাচন করুন",
      badge: "সবচেয়ে জনপ্রিয়",
      whatsAppMessage: "হ্যালো বংজিও ডিজিটাল! আমি আপনাদের 'গ্রোথ প্যাকেজ' (৳৩৫,০০০) বুক করতে চাই এবং আমার ব্যবসার বিস্তারিত আলোচনা করতে চাই।"
    },
    es: {
      name: "Paquete Growth",
      tagline: "Motor digital de alta conversión para E-commerce y marcas en expansión.",
      idealFor: "Tiendas online, marcas de ropa, agencias de servicios y empresas medianas",
      turnaroundDays: "10 - 14 Días",
      paymentTerms: "40% anticipo, 30% tras revisión de demo, 30% entrega",
      features: [
        "Portal dinámico o tienda E-commerce completa con productos ilimitados",
        "Pasarelas de pago automatizadas (bKash, Nagad, tarjetas internacionales)",
        "10 Reels/Shorts de video viral con edición y retención garantizada",
        "Kit completo de identidad visual (Logo vectorial, tarjetas y redes)",
        "SEO On-Page y Local para posicionamiento en Google",
        "Panel de administración intuitivo para pedidos e inventario",
        "Notificaciones automáticas por SMS y correo",
        "3 Meses de soporte técnico y optimización de velocidad"
      ],
      bonuses: [
        "Instalación gratuita de Meta Pixel y API de Conversiones",
        "Retoque fotográfico de productos y banners publicitarios"
      ],
      ctaText: "Elegir Paquete Growth",
      badge: "Más Popular",
      whatsAppMessage: "¡Hola Bongio Digital! Deseo contratar el Paquete Growth (৳ 35,000 BDT) para escalar mis ventas."
    }
  },
  {
    id: "scale",
    name: "Scale Package",
    tagline: "All-in-one digital studio solution for established enterprises & multi-branch brands.",
    priceTk: 75000,
    formattedTk: "৳ 75,000",
    regularPriceTk: "৳ 95,000",
    badge: "Full Studio Solution",
    isPopular: false,
    idealFor: "Multi-branch businesses, exporters, software firms & corporate enterprises",
    turnaroundDays: "3 - 4 Weeks",
    paymentTerms: "Flexible 3-stage milestone installment schedule",
    features: [
      "Custom high-end web platform / multi-vendor / SaaS system architecture",
      "Full digital studio production (Web + 25 viral video edits + 20 graphic assets)",
      "Smart 24/7 AI customer service chatbot (Powered by Gemini AI)",
      "Advanced CRM, inventory automation & automated billing system",
      "Full domestic & international payment gateway integrations (SSLCommerz, Stripe, bKash)",
      "High-conversion Facebook & Google ad funnel strategy and setup",
      "Dedicated Senior Project Manager & 24/7 priority WhatsApp/phone channel",
      "6 Months of fully managed cloud infrastructure and daily automated backups"
    ],
    bonuses: [
      "Free custom 3D product visuals and promo video (৳ 15,000 value)",
      "VIP 1-on-1 growth consulting & marketing strategy roadmap"
    ],
    ctaText: "Inquire for Scale Package",
    whatsAppMessage: "Hello Bongio Digital! Our enterprise requires the Scale Package (৳ 75,000 BDT) full studio production. Let's discuss our roadmap.",
    bn: {
      name: "স্কেল প্যাকেজ",
      tagline: "প্রতিষ্ঠিত কোম্পানি, এক্সপোর্টার ও হাই-গ্রোথ ব্যবসার জন্য অল-ইন-ওয়ান সল্যুশন।",
      idealFor: "মাল্টি-ব্রাঞ্চ ব্যবসা, এক্সপোর্টার, সফটওয়্যার কোম্পানি ও কর্পোরেট ব্র্যান্ড",
      turnaroundDays: "৩ - ৪ সপ্তাহ",
      paymentTerms: "মাইলস্টোন অনুযায়ী ৩ কিস্তিতে পেমেন্ট সুবিধা",
      features: [
        "কাস্টম হাই-এন্ড ওয়েব পোর্টাল / মাল্টি-ভেন্ডর / SaaS প্ল্যাটফর্ম আর্কিটেকচার",
        "সম্পূর্ণ ডিজিটাল স্টুডিও সাপোর্ট (ওয়েব + ২৫টি ভাইরাল ভিডিও এডিটিং + ২০টি গ্রাফিক্স)",
        "স্মার্ট AI কাস্টমার সাপোর্ট চ্যাটবট ইন্টিগ্রেশন (Gemini AI Powered)",
        "অ্যাডভান্সড CRM, স্টক ম্যানেজমেন্ট ও ইনভয়েস অটোমেশন সিস্টেম",
        "আন্তর্জাতিক ও দেশীয় সকল পেমেন্ট গেটওয়ে (SSLCommerz, Stripe, bKash)",
        "ফেসবুক ও গুগল হাই-কনভার্সন বিজ্ঞাপন ফানেল স্ট্র্যাটেজি ও সেটআপ",
        "ডেডিকেটেড প্রজেক্ট ম্যানেজার ও ২৪/৭ প্রায়োরিটি ফোন/WhatsApp সাপোর্ট",
        "৬ মাসের ফুল ডেডিকেটেড ক্লাউড সার্ভার ম্যানেজমেন্ট ও সিকিউরিটি ব্যাকআপ"
      ],
      bonuses: [
        "৳ ১৫,০০০ সমমূল্যের কাস্টম ৩D প্রোডাক্ট ভিজ্যুয়াল ও ব্র্যান্ড ভিডিও ফ্রি",
        "ভিআইপি ওয়ান-অন-ওয়ান গ্রোথ কনসাল্টেশন সেশন"
      ],
      ctaText: "স্কেল প্যাকেজে আলোচনা শুরু করুন",
      badge: "ফুল স্টুডিও সল্যুশন",
      whatsAppMessage: "হ্যালো বংজিও ডিজিটাল! আমাদের প্রতিষ্ঠিত ব্যবসার জন্য 'স্কেল প্যাকেজ' (৳৭৫,০০০) ফুল স্টুডিও সল্যুশন প্রয়োজন। প্রজেক্ট নিয়ে কথা বলতে চাই।"
    },
    es: {
      name: "Paquete Scale",
      tagline: "Solución de estudio integral para empresas consolidadas y marcas corporativas.",
      idealFor: "Empresas multisede, exportadores, startups SaaS y marcas consolidadas",
      turnaroundDays: "3 - 4 Semanas",
      paymentTerms: "Esquema flexible de pago en 3 etapas por hitos",
      features: [
        "Portal web personalizado de alto rendimiento / multi-vendedor o SaaS",
        "Producción integral de estudio (Web + 25 videos virales + 20 creatividades)",
        "Chatbot inteligente de atención al cliente 24/7 (Potenciado por Gemini AI)",
        "CRM avanzado, control de stock y automatización de facturación",
        "Integración completa de pagos nacionales e internacionales (SSLCommerz, Stripe)",
        "Estrategia e implementación de embudos de conversión para Meta y Google Ads",
        "Project Manager dedicado y canal prioritario de WhatsApp 24/7",
        "6 Meses de infraestructura cloud dedicada y copias de seguridad continuas"
      ],
      bonuses: [
        "Visuales 3D para productos y video corporativo incluidos",
        "Sesión VIP de consultoría estratégica 1-a-1"
      ],
      ctaText: "Consultar por Paquete Scale",
      badge: "Estudio Completo",
      whatsAppMessage: "¡Hola Bongio Digital! Nuestra empresa requiere la solución integral Paquete Scale (৳ 75,000 BDT)."
    }
  }
];

export const PAYMENT_METHODS = [
  { name: "bKash (Merchant & Personal)", icon: "bKash", color: "bg-pink-600/10 text-pink-400 border-pink-500/30" },
  { name: "Nagad (Digital Payment)", icon: "Nagad", color: "bg-orange-600/10 text-orange-400 border-orange-500/30" },
  { name: "Rocket (DBBL)", icon: "Rocket", color: "bg-purple-600/10 text-purple-400 border-purple-500/30" },
  { name: "Bank Transfer (EFT / NPSB / City, DBBL, Brac)", icon: "Bank", color: "bg-blue-600/10 text-blue-400 border-blue-500/30" },
  { name: "Visa / Mastercard / Amex (SSLCommerz)", icon: "Card", color: "bg-emerald-600/10 text-emerald-400 border-emerald-500/30" }
];
