import React, { createContext, useContext, useState } from "react";

export type Language = "en" | "bn" | "es";

export interface Translations {
  // Navbar
  navServices: string;
  navPricing: string;
  navShowcase: string;
  navQuoteBuilder: string;
  navFaq: string;
  navTestimonials: string;
  navInsights: string;
  navContact: string;
  navAiSuite: string;
  navCrmTelemetry: string;
  navSignIn: string;
  navSignOut: string;
  navGetQuote: string;
  navWhatsApp: string;
  navAiBrief: string;

  // Hero
  heroBadge: string;
  heroStudioLabel: string;
  heroHeadline1: string;
  heroHeadlineHighlight: string;
  heroHeadline2: string;
  heroSubtitle: string;
  heroExploreShowcase: string;
  heroQuoteBuilder: string;
  heroAiAdvisor: string;
  heroActiveFocus: string;
  heroViewCaseStudies: string;
  heroMetric1Label: string;
  heroMetric2Label: string;
  heroMetric3Label: string;
  heroMetric3Value: string;
  heroMetric4Label: string;

  // Pricing Section
  pricingBadge: string;
  pricingTitle: string;
  pricingSubtitle: string;
  pricingDeliveryLabel: string;
  pricingPaymentLabel: string;
  pricingIdealForLabel: string;
  pricingIncludedLabel: string;
  pricingBonusesLabel: string;
  pricingWhatsAppBook: string;
  pricingSelectBtn: string;
  pricingCustomTitle: string;
  pricingCustomSubtitle: string;
  pricingOpenCalc: string;
  pricingPaymentTitle: string;
  pricingPaymentSubtitle: string;

  // Services
  servicesTitle: string;
  servicesSubtitle: string;
  servicesWebDev: string;
  servicesContentCreation: string;
  servicesVideoEditing: string;
  servicesGraphicDesign: string;
  servicesStartingAt: string;
  servicesTurnaround: string;
  servicesKeyFeatures: string;
  servicesDeliverables: string;
  servicesInquireNow: string;
  servicesCalculateQuote: string;

  // Showcase
  showcaseBadge: string;
  showcaseTitle: string;
  showcaseSubtitle: string;
  showcaseAll: string;
  showcaseViewProject: string;
  showcaseChallenge: string;
  showcaseSolution: string;
  showcaseKeyDeliverables: string;
  showcaseTechStack: string;
  showcaseClient: string;
  showcaseYear: string;

  // Quote Calculator
  calcBadge: string;
  calcTitle: string;
  calcSubtitle: string;
  calcSelectDisciplines: string;
  calcSelectComplexity: string;
  calcSelectAddons: string;
  calcEstimatedTotal: string;
  calcEstimatedSprint: string;
  calcApplyToInquiry: string;
  calcResetConfig: string;

  // Testimonials
  testimonialsBadge: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;

  // Insights / Blog
  blogBadge: string;
  blogTitle: string;
  blogSubtitle: string;
  blogReadArticle: string;
  blogLeaveComment: string;

  // Newsletter
  newsletterBadge: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterPlaceholder: string;
  newsletterSubscribe: string;
  newsletterPrivacyNote: string;

  // Contact
  contactBadge: string;
  contactTitle: string;
  contactSubtitle: string;
  contactNameLabel: string;
  contactEmailLabel: string;
  contactCompanyLabel: string;
  contactServicesLabel: string;
  contactBudgetLabel: string;
  contactTimelineLabel: string;
  contactDetailsLabel: string;
  contactSubmitBtn: string;
  contactSubmitting: string;
  contactSuccessTitle: string;
  contactWhatsAppDirect: string;
  contactInstantReply: string;

  // Footer
  footerTagline: string;
  footerWhatsAppTitle: string;
  footerMessageNow: string;
  footerRights: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Navbar
    navServices: "Services",
    navPricing: "Packages & Pricing (৳)",
    navShowcase: "Showcase",
    navQuoteBuilder: "Quote Builder",
    navFaq: "FAQ",
    navTestimonials: "Testimonials",
    navInsights: "Insights",
    navContact: "Contact",
    navAiSuite: "Google AI Suite",
    navCrmTelemetry: "CRM & Telemetry",
    navSignIn: "Google Sign-In / MFA",
    navSignOut: "Sign Out",
    navGetQuote: "Get a Quote",
    navWhatsApp: "WhatsApp",
    navAiBrief: "AI Brief",

    // Hero
    heroBadge: "Q3/Q4 Project Bookings Open",
    heroStudioLabel: "4-in-1 Digital Studio",
    heroHeadline1: "Digital Craftsmanship across",
    heroHeadlineHighlight: "Code, Video, Design",
    heroHeadline2: "& Narrative.",
    heroSubtitle: "Bongio Digital unites world-class web engineering, high-retention video editing, 3D graphic design, and viral content creation under one seamless studio.",
    heroExploreShowcase: "Explore Showcase",
    heroQuoteBuilder: "Instant Quote Builder",
    heroAiAdvisor: "AI Scope Advisor",
    heroActiveFocus: "Active Focus",
    heroViewCaseStudies: "View Case Studies",
    heroMetric1Label: "High-Impact Deliverables",
    heroMetric2Label: "Client Satisfaction Rating",
    heroMetric3Label: "Client Revenue & Pipeline Growth (BDT)",
    heroMetric3Value: "৳ 50+ Cr BDT",
    heroMetric4Label: "Average Web & Asset Delivery Speed",

    // Pricing
    pricingBadge: "Tailored Packages & Transparent Pricing (BDT / ৳)",
    pricingTitle: "Transparent Packages & Pricing.",
    pricingSubtitle: "No hidden fees. Choose the ideal tier for your business with fast turnaround, official invoice, and flexible installment options via bKash, Nagad, and Bank Transfer.",
    pricingDeliveryLabel: "Delivery:",
    pricingPaymentLabel: "Payment:",
    pricingIdealForLabel: "Ideal For:",
    pricingIncludedLabel: "Included Deliverables & Features:",
    pricingBonusesLabel: "Special Free Bonuses:",
    pricingWhatsAppBook: "Book on WhatsApp (+880 1676056414)",
    pricingSelectBtn: "Select This Package",
    pricingCustomTitle: "Need a custom scope or specific budget?",
    pricingCustomSubtitle: "Use our interactive Quote Calculator to configure your exact features and receive an instant estimate.",
    pricingOpenCalc: "Open Custom Quote Calculator",
    pricingPaymentTitle: "Accepted Bangladeshi & International Payment Methods",
    pricingPaymentSubtitle: "100% official invoice and receipt provided for every project",

    // Services
    servicesTitle: "Four Specialized Disciplines. One Unified Vision.",
    servicesSubtitle: "Engineered for high-growth startups, local businesses, and modern brands demanding elite execution.",
    servicesWebDev: "Web Development",
    servicesContentCreation: "Content Creation",
    servicesVideoEditing: "Video Editing",
    servicesGraphicDesign: "Graphic Design",
    servicesStartingAt: "Starting at",
    servicesTurnaround: "Turnaround",
    servicesKeyFeatures: "Core Capabilities",
    servicesDeliverables: "Signature Deliverables",
    servicesInquireNow: "Inquire for this Discipline",
    servicesCalculateQuote: "Configure Custom Scope",

    // Showcase
    showcaseBadge: "Selected Portfolio & Case Studies",
    showcaseTitle: "Engineered for Exponential Performance & Visual Mastery",
    showcaseSubtitle: "Deep dive into real-world client engagements, architecture diagrams, video reels, and verified commercial metrics.",
    showcaseAll: "All Disciplines",
    showcaseViewProject: "Inspect Case Study",
    showcaseChallenge: "The Core Challenge",
    showcaseSolution: "Architectural & Creative Solution",
    showcaseKeyDeliverables: "Key Deliverables",
    showcaseTechStack: "Technology & Production Stack",
    showcaseClient: "Client",
    showcaseYear: "Year",

    // Quote Calculator
    calcBadge: "Transparent Pricing Engine",
    calcTitle: "Interactive Scope & Budget Calculator",
    calcSubtitle: "Select disciplines, project complexity, and strategic add-ons to receive an instant, accurate investment breakdown and sprint estimate in BDT (৳).",
    calcSelectDisciplines: "1. Select Service Disciplines",
    calcSelectComplexity: "2. Select Project Scope & Complexity",
    calcSelectAddons: "3. Optional Strategic Add-ons",
    calcEstimatedTotal: "Estimated Investment",
    calcEstimatedSprint: "Estimated Delivery Sprint",
    calcApplyToInquiry: "Lock In Scope & Book Consultation",
    calcResetConfig: "Reset Calculator",

    // Testimonials
    testimonialsBadge: "Verified Client Testimonials",
    testimonialsTitle: "What Founders & Creative Directors Say",
    testimonialsSubtitle: "Real feedback from enterprise leaders, founders, and creators who scaled with Bongio Digital.",

    // Insights
    blogBadge: "Engineering & Creative Insights",
    blogTitle: "Perspectives on Modern Craft, AI & Architecture",
    blogSubtitle: "In-depth technical breakdowns, creative directing workflows, and industry intelligence written by our lead practitioners.",
    blogReadArticle: "Read Full Article",
    blogLeaveComment: "Leave a Thoughtful Comment",

    // Newsletter
    newsletterBadge: "Weekly Creator Intelligence",
    newsletterTitle: "Stay Ahead of the Curve in Code, Design & AI",
    newsletterSubtitle: "Join 14,000+ engineers, creative directors, and founders receiving our weekly deep dives on modern full-stack workflows and visual trends.",
    newsletterPlaceholder: "Enter your work email...",
    newsletterSubscribe: "Subscribe to Dispatch",
    newsletterPrivacyNote: "No spam. Unsubscribe with one click anytime.",

    // Contact
    contactBadge: "Start a Conversation",
    contactTitle: "Let's Build Something Exceptional Together",
    contactSubtitle: "Tell us about your objectives, timeline, and vision. We will formulate a tailored architectural brief and quotation within 24 business hours.",
    contactNameLabel: "Your Name",
    contactEmailLabel: "Work Email",
    contactCompanyLabel: "Company / Organization (Optional)",
    contactServicesLabel: "Services Required",
    contactBudgetLabel: "Estimated Budget",
    contactTimelineLabel: "Target Timeline",
    contactDetailsLabel: "Project Brief & Requirements",
    contactSubmitBtn: "Send Project Inquiry",
    contactSubmitting: "Submitting Brief...",
    contactSuccessTitle: "Inquiry Received Successfully!",
    contactWhatsAppDirect: "Prefer WhatsApp?",
    contactInstantReply: "Instant Reply",

    // Footer
    footerTagline: "Full-spectrum digital craftsmanship spanning high-performance Web Engineering, Content Systems, 4K Cinema Video Editing, and Identity Design.",
    footerWhatsAppTitle: "Direct WhatsApp",
    footerMessageNow: "Message Now →",
    footerRights: "All rights reserved. Built with precision and care."
  },
  bn: {
    // Navbar
    navServices: "সার্ভিসসমূহ",
    navPricing: "মূল্য তালিকা ও প্যাকেজ (৳)",
    navShowcase: "প্রজেক্ট শোকেস",
    navQuoteBuilder: "কোট ক্যালকুলেটর",
    navFaq: "সাধারণ জিজ্ঞাসা",
    navTestimonials: "গ্রাহক মতামত",
    navInsights: "ইনসাইটস",
    navContact: "যোগাযোগ",
    navAiSuite: "গুগল এআই স্যুট",
    navCrmTelemetry: "সিআরএম ও ডাটা",
    navSignIn: "গুগল সাইন-ইন / এমএফএ",
    navSignOut: "লগআউট",
    navGetQuote: "কোটেশন নিন",
    navWhatsApp: "হোয়াটসঅ্যাপ",
    navAiBrief: "এআই ব্রিফ",

    // Hero
    heroBadge: "Q3/Q4 প্রজেক্ট বুকিং চলছে",
    heroStudioLabel: "৪-ইন-১ ডিজিটাল স্টুডিও",
    heroHeadline1: "দক্ষ ডিজিটাল কারুশিল্প —",
    heroHeadlineHighlight: "কোড, ভিডিও, ডিজাইন",
    heroHeadline2: "ও কনটেন্ট নির্মাণ।",
    heroSubtitle: "বংজিও ডিজিটাল (Bongio Digital) উচ্চমানের ওয়েব ডেভেলপমেন্ট, আকর্ষক ভিডিও এডিটিং, ৩ডি গ্রাফিক ডিজাইন এবং ভাইরাল কনটেন্ট ক্রিয়েশনকে একটি অনন্য প্ল্যাটফর্মে যুক্ত করে।",
    heroExploreShowcase: "প্রজেক্ট শোকেস দেখুন",
    heroQuoteBuilder: "ইনস্ট্যান্ট কোটেশন বিল্ডার",
    heroAiAdvisor: "এআই প্রজেক্ট অ্যাডভাইজার",
    heroActiveFocus: "বর্তমান ফোকাস",
    heroViewCaseStudies: "কেস স্টাডি দেখুন",
    heroMetric1Label: "সফল প্রজেক্ট ডেলিভারি",
    heroMetric2Label: "গ্রাহক সন্তুষ্টির হার",
    heroMetric3Label: "ক্লায়েন্ট ভ্যালু ও পাইপলাইন তৈরি",
    heroMetric3Value: "৳ ৫০ কোটি+",
    heroMetric4Label: "গড় ওয়েব ডেলিভারি স্পিড",

    // Pricing
    pricingBadge: "বাংলাদেশি ব্যবসার জন্য সাশ্রয়ী প্যাকেজ (BDT / ৳)",
    pricingTitle: "স্বচ্ছ মূল্য তালিকা ও প্যাকেজ।",
    pricingSubtitle: "কোনো লুকানো খরচ নেই। আপনার ব্যবসার প্রয়োজন অনুযায়ী নিখুঁত প্যাকেজ বেছে নিন। প্রতিটি প্যাকেজে রয়েছে ফ্রি ডোমেইন, সুপার-ফাস্ট হোস্টিং এবং বিকাশ/নগদে সহজ কিস্তির সুবিধা।",
    pricingDeliveryLabel: "ডেলিভারি সময়:",
    pricingPaymentLabel: "পেমেন্ট শর্ত:",
    pricingIdealForLabel: "উপযুক্ত যাদের জন্য:",
    pricingIncludedLabel: "প্যাকেজের অন্তর্ভুক্ত সেবাসমূহ:",
    pricingBonusesLabel: "স্পেশাল ফ্রি বোনাস:",
    pricingWhatsAppBook: "হোয়াটসঅ্যাপে বুক করুন (+880 1676056414)",
    pricingSelectBtn: "এই প্যাকেজটি নির্বাচন করুন",
    pricingCustomTitle: "আপনার কি কাস্টম রিকোয়ারমেন্ট বা নির্দিষ্ট বাজেট আছে?",
    pricingCustomSubtitle: "আমাদের ইন্টারেক্টিভ কোট ক্যালকুলেটর দিয়ে নিজের পছন্দমতো ফিচার ও সার্ভিস যোগ করে ইনস্ট্যান্ট বাজেট হিসাব করুন।",
    pricingOpenCalc: "কাস্টম কোট ক্যালকুলেটর খুলুন",
    pricingPaymentTitle: "সহজ ও নিরাপদ পেমেন্ট মেথড (Payment Methods in Bangladesh)",
    pricingPaymentSubtitle: "১০০% অফিসিয়াল ইনভয়েস ও রসিদ প্রদান করা হয়",

    // Services
    servicesTitle: "চারটি বিশেষায়িত বিভাগ। একটি সমন্বিত লক্ষ্য।",
    servicesSubtitle: "উচ্চ প্রবৃদ্ধিশীল স্টার্টআপ, প্রিমিয়াম ব্র্যান্ড এবং বিশ্বমানের ক্রিয়েটরদের জন্য নিখুঁত সমাধান।",
    servicesWebDev: "ওয়েব ডেভেলপমেন্ট",
    servicesContentCreation: "কনটেন্ট ক্রিয়েশন",
    servicesVideoEditing: "ভিডিও এডিটিং",
    servicesGraphicDesign: "গ্রাফিক ডিজাইন",
    servicesStartingAt: "শুরু",
    servicesTurnaround: "সময়সীমা",
    servicesKeyFeatures: "মূল বৈশিষ্ট্যসমূহ",
    servicesDeliverables: "প্রধান ডেলিভারেবলস",
    servicesInquireNow: "এই সার্ভিসের জন্য যোগাযোগ করুন",
    servicesCalculateQuote: "কাস্টম স্কোপ কনফিগার করুন",

    // Showcase
    showcaseBadge: "নির্বাচিত পোর্টফোলিও ও কেস স্টাডিজ",
    showcaseTitle: "অনবদ্য পারফরম্যান্স ও নান্দনিক ভিজ্যুয়াল ক্রাফট",
    showcaseSubtitle: "বাস্তব ক্লায়েন্ট প্রজেক্ট, আর্কিটেকচার ডায়াগ্রাম, ভিডিও রিল এবং যাচাইকৃত বাণিজ্যিক পরিসংখ্যান অন্বেষণ করুন।",
    showcaseAll: "সকল বিভাগ",
    showcaseViewProject: "কেস স্টাডি দেখুন",
    showcaseChallenge: "মূল চ্যালেঞ্জ",
    showcaseSolution: "আর্কিটেকচারাল ও ক্রিয়েটিভ সমাধান",
    showcaseKeyDeliverables: "প্রধান ডেলিভারেবলস",
    showcaseTechStack: "ব্যবহৃত প্রযুক্তি ও প্রোডাকশন স্ট্যাক",
    showcaseClient: "ক্লায়েন্ট",
    showcaseYear: "বছর",

    // Quote Calculator
    calcBadge: "স্বচ্ছ মূল্য নির্ধারণ ক্যালকুলেটর",
    calcTitle: "ইন্টারেক্টিভ স্কোপ ও বাজেট ক্যালকুলেটর",
    calcSubtitle: "সার্ভিস, প্রজেক্টের জটিলতা এবং অতিরিক্ত ফিচার বেছে নিয়ে তাত্ক্ষণিক বাজেট ও সময়সীমা জানুন।",
    calcSelectDisciplines: "১. সার্ভিসসমূহ নির্বাচন করুন",
    calcSelectComplexity: "২. প্রজেক্টের পরিধি ও জটিলতা",
    calcSelectAddons: "৩. অতিরিক্ত বিশেষ ফিচারসমূহ",
    calcEstimatedTotal: "আনুমানিক বাজেট",
    calcEstimatedSprint: "আনুমানিক সময়সীমা",
    calcApplyToInquiry: "বাজেট নিশ্চিত করুন ও কথা বলুন",
    calcResetConfig: "রিসেট করুন",

    // Testimonials
    testimonialsBadge: "যাচাইকৃত ক্লায়েন্ট রিভিউ",
    testimonialsTitle: "প্রতিষ্ঠাতা ও ডিরেক্টরদের অভিমত",
    testimonialsSubtitle: "বিশ্বখ্যাত উদ্যোক্তা এবং ক্রিয়েটিভ লিডারদের বাস্তব অভিজ্ঞতা ও মতামত।",

    // Insights
    blogBadge: "ইঞ্জিনিয়ারিং ও ক্রিয়েটিভ ইনসাইটস",
    blogTitle: "আধুনিক প্রযুক্তি, এআই ও ডিজাইন আর্কিটেকচার",
    blogSubtitle: "আমাদের সিনিয়র ডেভেলপার ও ডিজাইনারদের লেখা প্রযুক্তিগত বিশ্লেষণ ও কৌশল।",
    blogReadArticle: "সম্পূর্ণ প্রবন্ধ পড়ুন",
    blogLeaveComment: "আপনার মন্তব্য জানান",

    // Newsletter
    newsletterBadge: "সাপ্তাহিক ক্রিয়েটর ইনটেলিজেন্স",
    newsletterTitle: "কোড, ডিজাইন এবং এআই-এর সর্বশেষ ট্রেন্ড",
    newsletterSubtitle: "১৪,০০০+ ইঞ্জিনিয়ার এবং ক্রিয়েটিভ লিডারদের সাথে যুক্ত থাকুন আমাদের সাপ্তাহিক বিশেষ ব্লগে।",
    newsletterPlaceholder: "আপনার কাজের ইমেইল দিন...",
    newsletterSubscribe: "সাবস্ক্রাইব করুন",
    newsletterPrivacyNote: "কোন স্প্যাম পাঠানো হবে না। যেকোনো সময় আনসাবস্ক্রাইব করতে পারবেন।",

    // Contact
    contactBadge: "কথা শুরু করুন",
    contactTitle: "আসুন একসাথে দারুণ কিছু তৈরি করি",
    contactSubtitle: "আপনার প্রজেক্টের লক্ষ্য ও সময়সীমা আমাদের জানান। আমরা ২৪ ঘণ্টার মধ্যে পূর্ণাঙ্গ প্রস্তাবনা ও কোটেশন পাঠাব।",
    contactNameLabel: "আপনার নাম",
    contactEmailLabel: "ইমেইল এড্রেস",
    contactCompanyLabel: "কোম্পানি / প্রতিষ্ঠান (ঐচ্ছিক)",
    contactServicesLabel: "প্রয়োজনীয় সার্ভিসসমূহ",
    contactBudgetLabel: "আনুমানিক বাজেট",
    contactTimelineLabel: "কাজের সময়সীমা",
    contactDetailsLabel: "প্রজেক্টের বিবরণ ও রিকোয়ারমেন্ট",
    contactSubmitBtn: "প্রজেক্ট প্রস্তাবনা পাঠান",
    contactSubmitting: "পাঠানো হচ্ছে...",
    contactSuccessTitle: "প্রস্তাবনা সফলভাবে গৃহীত হয়েছে!",
    contactWhatsAppDirect: "হোয়াটসঅ্যাপে চ্যাট করবেন?",
    contactInstantReply: "দ্রুত উত্তর",

    // Footer
    footerTagline: "ওয়েব ইঞ্জিনিয়ারিং, কনটেন্ট সিস্টেম, ফোর-কে সিনেমা ভিডিও এডিটিং ও ব্র্যান্ড আইডেন্টিটি ডিজাইনের অনন্য সমন্বয়।",
    footerWhatsAppTitle: "সরাসরি হোয়াটসঅ্যাপ",
    footerMessageNow: "মেসেজ পাঠান →",
    footerRights: "সর্বস্বত্ব সংরক্ষিত। নিখুঁত যত্নের সাথে নির্মিত।"
  },
  es: {
    // Navbar
    navServices: "Servicios",
    navPricing: "Paquetes y Precios (৳)",
    navShowcase: "Portafolio",
    navQuoteBuilder: "Cotizador",
    navFaq: "Preguntas Frecuentes",
    navTestimonials: "Testimonios",
    navInsights: "Artículos",
    navContact: "Contacto",
    navAiSuite: "Google AI Suite",
    navCrmTelemetry: "CRM y Telemetría",
    navSignIn: "Iniciar Sesión / MFA",
    navSignOut: "Cerrar Sesión",
    navGetQuote: "Cotizar Ahora",
    navWhatsApp: "WhatsApp",
    navAiBrief: "Brief de IA",

    // Hero
    heroBadge: "Reservas de Proyectos Abiertas",
    heroStudioLabel: "Estudio Digital 4-en-1",
    heroHeadline1: "Artesanía Digital en",
    heroHeadlineHighlight: "Código, Video, Diseño",
    heroHeadline2: "y Narrativa.",
    heroSubtitle: "Bongio Digital une ingeniería web de alto rendimiento, edición de video cinematográfica, diseño 3D y creación de contenido viral en un solo estudio.",
    heroExploreShowcase: "Explorar Portafolio",
    heroQuoteBuilder: "Cotizador Instantáneo",
    heroAiAdvisor: "Asesor de Alcance con IA",
    heroActiveFocus: "Enfoque Activo",
    heroViewCaseStudies: "Ver Casos de Estudio",
    heroMetric1Label: "Entregables de Alto Impacto",
    heroMetric2Label: "Calificación de Satisfacción",
    heroMetric3Label: "Valor de Pipeline Generado",
    heroMetric3Value: "৳ 50+ Cr BDT",
    heroMetric4Label: "Velocidad de Carga y Entrega",

    // Pricing
    pricingBadge: "Paquetes Transparentes y Precios (BDT / ৳)",
    pricingTitle: "Paquetes y Precios Transparentes.",
    pricingSubtitle: "Sin costos ocultos. Elija el paquete ideal para su negocio con entrega rápida, factura oficial y facilidades de pago en cuotas.",
    pricingDeliveryLabel: "Entrega:",
    pricingPaymentLabel: "Pago:",
    pricingIdealForLabel: "Ideal Para:",
    pricingIncludedLabel: "Servicios y Entregables Incluidos:",
    pricingBonusesLabel: "Bonos Gratuitos Especiales:",
    pricingWhatsAppBook: "Reservar por WhatsApp (+880 1676056414)",
    pricingSelectBtn: "Seleccionar Este Paquete",
    pricingCustomTitle: "¿Tiene requerimientos personalizados o presupuesto específico?",
    pricingCustomSubtitle: "Utilice nuestro cotizador interactivo para agregar características a medida y obtener un presupuesto instantáneo.",
    pricingOpenCalc: "Abrir Cotizador Personalizado",
    pricingPaymentTitle: "Métodos de Pago Aceptados en Bangladesh e Internacionales",
    pricingPaymentSubtitle: "100% de facturación oficial y recibo emitido por cada proyecto",

    // Services
    servicesTitle: "Cuatro Disciplinas Especializadas. Una Visión Unificada.",
    servicesSubtitle: "Diseñado para startups de rápido crecimiento, marcas premium y creadores globales.",
    servicesWebDev: "Desarrollo Web",
    servicesContentCreation: "Creación de Contenido",
    servicesVideoEditing: "Edición de Video",
    servicesGraphicDesign: "Diseño Gráfico",
    servicesStartingAt: "Desde",
    servicesTurnaround: "Tiempo de Entrega",
    servicesKeyFeatures: "Capacidades Clave",
    servicesDeliverables: "Entregables de Firma",
    servicesInquireNow: "Consultar por esta Disciplina",
    servicesCalculateQuote: "Configurar Alcance a Medida",

    // Showcase
    showcaseBadge: "Portafolio y Casos de Estudio",
    showcaseTitle: "Diseñado para Rendimiento Exponencial y Maestría Visual",
    showcaseSubtitle: "Explore proyectos reales con clientes, diagramas de arquitectura, reels de video y métricas comerciales verificadas.",
    showcaseAll: "Todas las Disciplinas",
    showcaseViewProject: "Ver Caso de Estudio",
    showcaseChallenge: "El Desafío Central",
    showcaseSolution: "Solución Arquitectónica y Creativa",
    showcaseKeyDeliverables: "Entregables Clave",
    showcaseTechStack: "Stack Tecnológico y Producción",
    showcaseClient: "Cliente",
    showcaseYear: "Año",

    // Quote Calculator
    calcBadge: "Motor de Precios Transparente",
    calcTitle: "Calculadora Interactiva de Alcance y Presupuesto",
    calcSubtitle: "Seleccione disciplinas, complejidad del proyecto y complementos estratégicos para obtener un desglose instantáneo en BDT (৳).",
    calcSelectDisciplines: "1. Seleccione las Disciplinas",
    calcSelectComplexity: "2. Seleccione el Alcance y Complejidad",
    calcSelectAddons: "3. Complementos Estratégicos",
    calcEstimatedTotal: "Inversión Estimada",
    calcEstimatedSprint: "Tiempo de Sprint Estimado",
    calcApplyToInquiry: "Asegurar Alcance y Agendar Consulta",
    calcResetConfig: "Restablecer Calculadora",

    // Testimonials
    testimonialsBadge: "Testimonios Verificados",
    testimonialsTitle: "Lo que Dicen Fundadores y Directores Creativos",
    testimonialsSubtitle: "Comentarios reales de líderes empresariales y creadores que han escalado con Bongio Digital.",

    // Insights
    blogBadge: "Artículos e Ingeniería Creativa",
    blogTitle: "Perspectivas sobre Tecnología Moderna, IA y Arquitectura",
    blogSubtitle: "Análisis técnicos profundos y flujos de trabajo de dirección creativa escritos por nuestros líderes.",
    blogReadArticle: "Leer Artículo Completo",
    blogLeaveComment: "Dejar un Comentario",

    // Newsletter
    newsletterBadge: "Inteligencia Semanal para Creadores",
    newsletterTitle: "Manténgase a la Vanguardia en Código, Diseño e IA",
    newsletterSubtitle: "Únase a más de 14,000 ingenieros, directores creativos y fundadores que reciben nuestras publicaciones semanales.",
    newsletterPlaceholder: "Ingrese su correo corporativo...",
    newsletterSubscribe: "Suscribirse al Boletín",
    newsletterPrivacyNote: "Sin spam. Cancele su suscripción en cualquier momento.",

    // Contact
    contactBadge: "Iniciar una Conversación",
    contactTitle: "Construyamos Algo Excepcional Juntos",
    contactSubtitle: "Cuéntenos sus objetivos, cronograma y visión. Le enviaremos una propuesta técnica y cotización en 24 horas hábiles.",
    contactNameLabel: "Su Nombre",
    contactEmailLabel: "Correo Electrónico",
    contactCompanyLabel: "Empresa / Organización (Opcional)",
    contactServicesLabel: "Servicios Requeridos",
    contactBudgetLabel: "Presupuesto Estimado",
    contactTimelineLabel: "Cronograma Objetivo",
    contactDetailsLabel: "Brief y Requerimientos del Proyecto",
    contactSubmitBtn: "Enviar Solicitud de Proyecto",
    contactSubmitting: "Enviando Solicitud...",
    contactSuccessTitle: "¡Solicitud Recibida con Éxito!",
    contactWhatsAppDirect: "¿Prefiere WhatsApp?",
    contactInstantReply: "Respuesta Instantánea",

    // Footer
    footerTagline: "Artesanía digital de espectro completo: Desarrollo Web de alto rendimiento, Sistemas de Contenido, Edición 4K y Diseño de Identidad.",
    footerWhatsAppTitle: "WhatsApp Directo",
    footerMessageNow: "Enviar Mensaje →",
    footerRights: "Todos los derechos reservados. Creado con precisión y dedicación."
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  availableLanguages: { code: Language; label: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default strictly to English ("en")
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("cc_preferred_language") as Language;
      if (saved === "en" || saved === "bn" || saved === "es") {
        return saved;
      }
    } catch {
      // ignore
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("cc_preferred_language", lang);
    } catch {
      // safe fallback
    }
  };

  const availableLanguages: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "bn", label: "বাংলা", flag: "🇧🇩" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];

  const value = {
    language,
    setLanguage,
    t: translations[language] || translations.en,
    availableLanguages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
