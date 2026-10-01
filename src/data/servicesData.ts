import { ServicePillar } from "../types";
import { CENTRALIZED_PRICING } from "./pricingConfig";

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: "serv-web-dev",
    title: "Web Development",
    banglaTitle: "ওয়েব ডেভেলপমেন্ট",
    iconName: "Code2",
    tagline: "Ultra-fast, conversion-optimized modern web applications & digital stores for growing businesses.",
    description: "Responsive business websites, high-converting E-commerce portals, custom web applications, and automated booking systems engineered with sub-second latency and 99+ Lighthouse performance scores.",
    accentColor: "blue",
    startingPrice: "৳ 18,000 (BDT)",
    price: CENTRALIZED_PRICING.services.webDevelopment.startingPrice,
    turnaroundTime: "7 - 10 Days",
    highlightMetric: "99+ Lighthouse Speed Score & < 0.8s load time",
    keyFeatures: [
      "Modern React & Next.js full-stack architecture",
      "Seamless bKash, Nagad, Card & SSLCommerz gateway integration",
      "Mobile-first responsive UX with direct WhatsApp order button",
      "Local SEO optimization & Google My Business maps integration",
      "Intuitive Admin dashboard for effortless product & content management",
      "Free SSL certificate, domain connection & 1-year cloud hosting guidance"
    ],
    deliverables: [
      "100% Production-ready source code & Git repository handover",
      "Live deployment on fast cloud CDN with automated SSL",
      "Video walkthrough tutorial & CMS documentation",
      "3 Months of complimentary technical maintenance & warranty"
    ],
    techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "bKash / Nagad API", "Firebase", "Node.js"],
    bn: {
      tagline: "বাংলাদেশের লোকাল ব্যবসা ও ব্র্যান্ডের জন্য আল্ট্রা-ফাস্ট, কনভার্সন-ফ্রেন্ডলি আধুনিক ওয়েবসাইট।",
      description: "রেসপনসিভ বিজনেস ওয়েবসাইট, ই-কমার্স স্টোর, রেস্টুরেন্ট অর্ডারিং সিস্টেম বা কাস্টম ওয়েব পোর্টাল—আমরা তৈরি করি লাইটহাউস ৯৯+ স্পিড এবং বিকাশ/নগদ পেমেন্ট সাপোর্টেড সেরা ওয়েবসাইট।",
      turnaroundTime: "৭ - ১০ দিন",
      highlightMetric: "৯৯+ লাইটহাউস স্পিড স্কোর এবং ১ সেকেন্ডের কম লোডিং টাইম",
      keyFeatures: [
        "মডার্ন React ও Next.js ফুল-স্ট্যাক আর্কিটেকচার",
        "বিকাশ (bKash), নগদ (Nagad) ও কার্ড পেমেন্ট গেটওয়ে ইন্টিগ্রেশন",
        "মোবাইল-ফার্স্ট রেসপনসিভ ডিজাইন ও WhatsApp ডিরেক্ট চ্যাট বাটন",
        "গুগল ম্যাপস ও লোকাল বাংলাদেশ এসইও (SEO) অপটিমাইজেশন",
        "সহজেই পণ্য ও কনটেন্ট আপডেটের জন্য অ্যাডমিন ড্যাশবোর্ড",
        "ফ্রি SSL সার্টিফিকেট, ডোমেইন ও ক্লাউড হোস্টিং সেটআপ গাইডেন্স"
      ],
      deliverables: [
        "১০০% প্রোডাকশন কোড ও গিট রিপোজিটরি হ্যান্ডওভার",
        "লাইভ ডেপ্লয়মেন্ট ও ডোমেইন হোস্টিং কানেকশন",
        "ওয়েবসাইট ব্যবহারের বাংলা ভিডিও টিউটোরিয়াল ও ডকুমেন্টেশন",
        "৩ মাসের ফ্রি টেকনিক্যাল মেইনটেনেন্স সাপোর্ট"
      ]
    },
    es: {
      tagline: "Aplicaciones web modernas, ultrarrápidas y optimizadas para conversión.",
      description: "Sitios web corporativos responsivos, tiendas de comercio electrónico de alta conversión y portales personalizados con tiempos de carga inferiores a un segundo.",
      turnaroundTime: "7 - 10 Días",
      highlightMetric: "99+ Puntuación Lighthouse y < 0.8s de tiempo de carga",
      keyFeatures: [
        "Arquitectura full-stack moderna con React y Next.js",
        "Integración de pasarelas de pago automatizadas y tarjetas",
        "Diseño móvil responsive con botón directo de WhatsApp",
        "Optimización SEO local y presencia en Google Maps",
        "Panel administrativo intuitivo para gestión de contenidos",
        "Certificado SSL gratuito y despliegue en CDN"
      ],
      deliverables: [
        "100% de código fuente listo para producción y repositorio Git",
        "Despliegue en vivo en infraestructura cloud",
        "Tutorial en video y documentación para administración",
        "3 Meses de soporte técnico y mantenimiento incluido"
      ]
    }
  },
  {
    id: "serv-content-creation",
    title: "Content Creation",
    banglaTitle: "কনটেন্ট ক্রিয়েশন ও সোশ্যাল মিডিয়া",
    iconName: "PenTool",
    tagline: "High-retention social narratives, viral ad copy & AI automation develop for any social media services.",
    description: "We supercharge your brand with persuasive copywriting, viral social narratives, and full-stack AI automation develop for any social media platform—including Facebook, Instagram, WhatsApp, TikTok, and LinkedIn. From 24/7 smart Auto-DM funnels to automated content scheduling and lead capture.",
    accentColor: "emerald",
    startingPrice: "৳ 8,500 (BDT)",
    price: CENTRALIZED_PRICING.services.contentCreation.startingPrice,
    turnaroundTime: "3 - 5 Days",
    highlightMetric: "4.5x Higher Social Engagement & 24/7 Automated Lead Capture",
    keyFeatures: [
      "AI automation develop for any social media services (Auto-DM, smart comment replies & lead funnels)",
      "AI automation develop for automated multi-channel publishing & social scheduling (Make / Zapier)",
      "High-converting Facebook & Instagram ad copywriting & persuasive hooks",
      "Bilingual SEO blog articles, viral scripts, and product descriptions",
      "Monthly social media content calendars with strategic hashtag research & AI batch creation",
      "WhatsApp & Instagram Direct AI chatbot integration for instant customer onboarding",
      "Irresistible promotional offer crafting, campaign planning & competitor trend analysis"
    ],
    deliverables: [
      "Turnkey AI automation develop setup for your social channels (ManyChat / Zapier / Meta Business API)",
      "Monthly strategic content schedule & planning documentation",
      "Complete ready-to-publish copy with compelling hooks, captions, and automated CTA links",
      "High-converting sales angles for digital marketing campaigns",
      "Quarterly performance, automation analytics and audience engagement reports"
    ],
    techStack: ["AI Automation (Make / Zapier / ManyChat)", "Meta Business Suite", "Facebook Creator Studio", "OpenAI & Claude API", "SEO Tools", "Notion Content Hub"],
    bn: {
      tagline: "ফেসবুক, ইনস্টাগ্রাম ও টিকটকে ভাইরাল কনটেন্ট এবং যেকোনো সোশ্যাল মিডিয়ার জন্য AI automation develop।",
      description: "আপনার ব্যবসার পণ্য ও সেবাকে আকর্ষণীয় বাংলা ও ইংরেজি কনটেন্টে রূপান্তরের সাথে যেকোনো সোশ্যাল মিডিয়া সার্ভিসের জন্য আমরা তৈরি করি সম্পূর্ণ AI automation develop—যেমন ২৪/৭ অটোমেটিক ডিএম রিপ্লাই, কমেন্ট-টু-লিড ফানেল এবং অটো-পোস্টিং।",
      turnaroundTime: "৩ - ৫ দিন",
      highlightMetric: "৪.৫x বেশি সোশ্যাল এঙ্গেজমেন্ট ও ২৪/৭ অটোমেটেড লিড ক্যাপচার",
      keyFeatures: [
        "যেকোনো সোশ্যাল মিডিয়া সার্ভিসের জন্য AI automation develop (অটো ডিএম, স্মার্ট চ্যাটবট ও লিড ফানেল)",
        "অটোমেটেড সোশ্যাল মিডিয়া শিডিউলিং ও কন্টেন্ট ডিস্ট্রিবিউশন পাইপলাইন (Make / Zapier)",
        "হাই-কনভার্টিং ফেসবুক বিজ্ঞাপন ও সেলস পোস্ট কপিরাইটিং",
        "বাংলা ও ইংরেজি এসইও ব্লগ আর্টিকেল ও প্রোডাক্ট ডেসক্রিপশন",
        "মাসিক সোশ্যাল মিডিয়া কনটেন্ট ক্যালেন্ডার ও হ্যাশট্যাগ স্ট্র্যাটেজি",
        "হোয়াটসঅ্যাপ ও ইনস্টাগ্রাম ডিরেক্ট AI চ্যাটবট ইন্টিগ্রেশন",
        "কাস্টমারকে আকৃষ্ট করার আকর্ষণীয় অফার ও ক্যাম্পেইন প্ল্যানিং"
      ],
      deliverables: [
        "সোশ্যাল মিডিয়ার জন্য সম্পূর্ণ AI automation develop সেটআপ (ManyChat / Make / Zapier)",
        "মাসিক কনটেন্ট শিডিউল ও প্ল্যানিং ডক",
        "সম্পূর্ণ রেডি-টু-পোস্ট বাংলা/ইংরেজি টেক্সট ও ক্যাপশন",
        "বিজ্ঞাপনের জন্য হাই-কনভার্টিং সেলস হুক ও স্ক্রিপ্ট",
        "পারফরম্যান্স ও অটোমেশন অ্যানালিটিক্স রিপোর্ট"
      ]
    },
    es: {
      tagline: "Narrativas sociales virales, copys persuasivos y AI automation develop para redes sociales.",
      description: "Transformamos los productos y servicios de su empresa en contenido persuasivo con AI automation develop para cualquier red social: respuestas automáticas por DM, embudos de comentarios a leads y publicación programada.",
      turnaroundTime: "3 - 5 Días",
      highlightMetric: "4.5x Mayor Interacción y Captación Automatizada 24/7",
      keyFeatures: [
        "AI automation develop para cualquier red social (Auto-DM, bots inteligentes y calificación de leads)",
        "AI automation develop para publicación y programación multicanal (Make / Zapier)",
        "Copywriting de alta conversión para anuncios en redes sociales",
        "Artículos de blog optimizados para SEO y descripciones de producto",
        "Calendario mensual de contenidos con investigación de hashtags",
        "Integración de bots de IA para WhatsApp e Instagram Direct",
        "Planificación estratégica de promociones y campañas publicitarias"
      ],
      deliverables: [
        "Configuración completa de AI automation develop para redes sociales (ManyChat / Zapier)",
        "Calendario mensual de publicaciones y brief estratégico",
        "Textos listos para publicar con llamadas a la acción",
        "Guiones y ganchos persuasivos para anuncios",
        "Reporte de rendimiento y análisis de automatización"
      ]
    }
  },
  {
    id: "serv-video-editing",
    title: "Video Editing",
    banglaTitle: "ভিডিও এডিটিং ও রিলস",
    iconName: "Film",
    tagline: "High-retention 4K viral video editing & AI automation develop for Reels, TikTok & YouTube.",
    description: "Cinematic color grading, dynamic kinetic subtitles, immersive sound effects, and AI automation develop for video repurposing across any social media channel—turning long-form footage into viral Shorts, Reels, and TikToks effortlessly.",
    accentColor: "purple",
    startingPrice: "৳ 10,000 (BDT)",
    price: CENTRALIZED_PRICING.services.videoEditing.startingPrice,
    turnaroundTime: "3 - 7 Days",
    highlightMetric: "85%+ Average Video Retention & Watch-Time Rate",
    keyFeatures: [
      "AI automation develop for social media reel repurposing, kinetic auto-captions & viral hook generation",
      "Cinematic 4K color grading and premium master exports",
      "Dynamic animated subtitles & synchronized kinetic typography",
      "Custom sound design, background music sync & audio mixing",
      "Optimized 9:16 (Reels/Shorts) & 16:9 (YouTube/Facebook) formats",
      "High-converting commercial product ad edits and promos",
      "Fast turnaround with collaborative revisions included"
    ],
    deliverables: [
      "4K and 1080p Full HD master video delivery",
      "AI automation develop templates for batch social media video processing",
      "Multi-aspect ratio exports for social platforms (9:16, 1:1, 16:9)",
      "Fully licensed, royalty-free audio tracks & SFX",
      "High-CTR YouTube/Reels cover thumbnail designs"
    ],
    techStack: ["AI Video Automation Tools", "Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut Pro", "Logic Pro"],
    bn: {
      tagline: "ফেসবুক, টিকটক ও শর্টসের জন্য হাই-রিটেনশন ভিডিও এবং AI automation develop।",
      description: "সিনেম্যাটিক কালার গ্রেডিং, আকর্ষণীয় সাবটাইটেল এবং সোশ্যাল মিডিয়া ভিডিওর জন্য AI automation develop দিয়ে লং ভিডিও থেকে নিমেষেই তৈরি করুন ভাইরাল রিলস ও শর্টস।",
      turnaroundTime: "৩ - ৭ দিন",
      highlightMetric: "৮৫%+ বেশি ভিডিও ওয়াচ-টাইম ও রিটেনশন রেট",
      keyFeatures: [
        "সোশ্যাল মিডিয়া ভিডিওর জন্য AI automation develop ও অটো-সাবটাইটেল জেনারেশন",
        "সিনেমাটিক ৪K কালার গ্রেডিং ও হাই-কোয়ালিটি এক্সপোর্ট",
        "ট্রেন্ডি কাইনেটিক সাবটাইটেল ও অ্যানিমেটেড টেক্সট ইফেক্ট",
        "ব্যাকগ্রাউন্ড মিউজিক সিঙ্কিং ও প্রো সাউন্ড ইফেক্টস (SFX)",
        "ফেসবুক ও ইনস্টাগ্রাম রিলস, টিকটক এবং ইউটিউব শর্টস ফরম্যাট",
        "পণ্য ও সেবার আকর্ষণীয় প্রোমোশনাল অ্যাড ভিডিও মেকিং",
        "দ্রুত ডেলিভারি ও আনলিমিটেড রিভিশন পলিসি"
      ],
      deliverables: [
        "৪K ও ১০৮০p ফুল এইচডি মাস্টার ভিডিও ফাইলস",
        "সোশ্যাল মিডিয়া ব্যাচ প্রসেসিংয়ের জন্য AI automation develop টেমপ্লেটস",
        "৯:১৬ (রিলস/শর্টস) এবং ১৬:৯ (ইউটিউব/ফেসবুক) রেশিও ভার্সন",
        "রয়্যালটি-ফ্রি লাইসেন্সড সাউন্ডট্র্যাক ও ইফেক্টস",
        "সোশ্যাল মিডিয়া থাম্বনেইল ডিজাইন"
      ]
    },
    es: {
      tagline: "Edición 4K y AI automation develop para Reels, TikTok y YouTube.",
      description: "Gradación de color cinematográfica, subtítulos dinámicos y AI automation develop para reutilización de videos en cualquier red social.",
      turnaroundTime: "3 - 7 Días",
      highlightMetric: "85%+ Tasa de Retención y Tiempo de Visualización",
      keyFeatures: [
        "AI automation develop para repurposing de videos en redes sociales y subtitulado automático",
        "Gradación de color 4K y exportación en máxima resolución",
        "Subtítulos animados con tipografía cinética",
        "Diseño sonoro envolvente y sincronización musical",
        "Formatos optimizados para 9:16 (Reels/TikTok) y 16:9 (YouTube)",
        "Edición de anuncios promocionales de alta conversión",
        "Flujo ágil con revisiones colaborativas"
      ],
      deliverables: [
        "Archivos maestros en 4K y 1080p Full HD",
        "Plantillas de AI automation develop para renderizado masivo",
        "Exportaciones en múltiples formatos para redes sociales",
        "Pistas musicales con licencia comercial y efectos de sonido",
        "Diseño de miniaturas y portadas de alto impacto"
      ]
    }
  },
  {
    id: "serv-graphic-design",
    title: "Graphic Design",
    banglaTitle: "গ্রাফিক ডিজাইন ও ব্র্যান্ডিং",
    iconName: "Palette",
    tagline: "Memorable brand identities, vector logos & AI automation develop for social creatives.",
    description: "Elevate your business perception with world-class visual aesthetics and AI automation develop for social media creatives. We design distinctive logos, stationery, packaging, and high-volume automated social ad templates that scale your campaigns effortlessly.",
    accentColor: "amber",
    startingPrice: "৳ 9,500 (BDT)",
    price: CENTRALIZED_PRICING.services.graphicDesign.startingPrice,
    turnaroundTime: "5 - 7 Days",
    highlightMetric: "100% Vector & Print-Ready Master Files Included",
    keyFeatures: [
      "AI automation develop for rapid social media banner generation & dynamic ad creatives",
      "Custom vector logo design & comprehensive brand identity guidelines",
      "High-engagement social media banners, covers & Facebook ad creatives",
      "Business cards, letterheads, invoice templates & stationery kits",
      "Product packaging, custom labels & die-line print designs",
      "Figma UI/UX mobile app and website interface systems",
      "Complete commercial brand style guide (Color tokens, typography & assets)"
    ],
    deliverables: [
      "AI automation develop templates for automated social media post variants",
      "Complete Brand Identity Guideline Handbook (PDF)",
      "Editable vector source files (.AI, .EPS, .SVG, .PNG, .PSD)",
      "Social media brand toolkit & digital banner assets",
      "100% Commercial intellectual property and copyright transfer"
    ],
    techStack: ["Adobe Illustrator", "Photoshop", "Figma", "AI Automation Creative Tools", "InDesign", "Blender 3D"],
    bn: {
      tagline: "স্মরণীয় লোগো, সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি এবং সোশ্যাল মিডিয়ায় AI automation develop।",
      description: "আপনার ব্যবসাকে বিশ্বমানের লুক দিন। প্রিমিয়াম লোগো ডিজাইন, বিজনেস কার্ড, প্রোডাক্ট প্যাকেজিং এবং সোশ্যাল মিডিয়ার জন্য AI automation develop ব্যানার ও ক্রিয়েটিভস।",
      turnaroundTime: "৫ - ৭ দিন",
      highlightMetric: "১০০% ভেক্টর ও প্রিন্ট-রেডি মাস্টার ফাইলস প্রদান",
      keyFeatures: [
        "সোশ্যাল মিডিয়া ব্যানার ভ্যারিয়েশনের জন্য AI automation develop",
        "ইউনিক ভেক্টর লোগো ডিজাইন ও সম্পূর্ণ ব্র্যান্ড গাইডলাইন",
        "সোশ্যাল মিডিয়া পোস্ট, কভার ও ফেসবুক অ্যাড ব্যানার ডিজাইন",
        "বিজনেস কার্ড, লেটারহেড, মানি রিসিপ্ট ও স্টেশনারি ডিজাইন",
        "প্রোডাক্ট প্যাকেজিং, লেবেল ও প্রিন্ট ডাই-লাইন ডিজাইন",
        "Figma UI/UX মোবাইল অ্যাপ ও ওয়েবসাইট ইন্টারফেস ডিজাইন",
        "সব ধরণের সোশ্যাল মিডিয়া ব্যানার ও প্রমোশনাল প্যাকেজ"
      ],
      deliverables: [
        "সোশ্যাল মিডিয়া অটোমেশনের জন্য এডিটেবল ক্রিয়েটিভ টেমপ্লেটস",
        "কমপ্লিট ব্র্যান্ড গাইডবুক (PDF)",
        "প্রিন্ট ও এডিটেবল ভেক্টর মাস্টার ফাইলস (.AI, .EPS, .SVG, .PNG, .PSD)",
        "সোশ্যাল মিডিয়া প্রোফাইল ও ব্যানার কিট",
        "১০০% কমার্শিয়াল কপিরাইট ও মালিকানা হস্তান্তর"
      ]
    },
    es: {
      tagline: "Identidades de marca, logos vectoriales y AI automation develop para redes sociales.",
      description: "Diseño gráfico de clase mundial combinado con AI automation develop para creatividades de redes sociales, empaques y sistemas visuales completos.",
      turnaroundTime: "5 - 7 Días",
      highlightMetric: "Archivos maestros 100% vectoriales listos para imprenta",
      keyFeatures: [
        "AI automation develop para variaciones automáticas de banners en redes sociales",
        "Diseño de logotipo vectorial y manual de identidad visual",
        "Banners para redes sociales y piezas creativas para anuncios",
        "Tarjetas de presentación, membretes y papelería corporativa",
        "Diseño de packaging, etiquetas y líneas de troquel para impresión",
        "Diseño de interfaces UI/UX en Figma para web y apps",
        "Guía de estilo completa con tipografías y paleta de color"
      ],
      deliverables: [
        "Plantillas de AI automation develop para creatividades masivas",
        "Manual de identidad de marca completo (PDF)",
        "Archivos vectoriales editables (.AI, .EPS, .SVG, .PNG, .PSD)",
        "Kit de recursos para perfiles y banners digitales",
        "Transferencia total de derechos comerciales"
      ]
    }
  }
];
