import React, { useState, useMemo } from "react";
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  Layers
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export interface FaqItem {
  id: string;
  category: "pricing" | "delivery" | "process" | "support";
  question: string;
  answer: string;
  keyPoints?: string[];
  bn?: {
    question: string;
    answer: string;
    keyPoints?: string[];
  };
  es?: {
    question: string;
    answer: string;
    keyPoints?: string[];
  };
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-pricing-tiers",
    category: "pricing",
    question: "What is included in the Starter (৳15,000), Growth (৳35,000), and Scale (৳75,000) packages?",
    answer: "Our pricing is structured into three transparent, fixed-investment tiers tailored for businesses at different stages. There are no hidden fees or surprise billings.",
    keyPoints: [
      "Starter (৳15,000): 1–3 page responsive site, Google Maps listing, WhatsApp integration, 5 custom social banners, and 1 month warranty (5–7 days delivery).",
      "Growth (৳35,000): Full dynamic/E-commerce portal, automated bKash/Nagad checkout, CMS admin dashboard, 3 viral video reels, and 3 months priority support (10–14 days delivery).",
      "Scale (৳75,000): Enterprise multi-page application, custom portals, complete brand identity kit, 4K video post-production, full AI automation pipeline, and 6 months VIP maintenance (3–4 weeks delivery)."
    ],
    bn: {
      question: "স্টার্টার (৳১৫,০০০), গ্রোথ (৳৩৫,০০০) ও স্কেল (৳৭৫,০০০) প্যাকেজে কী কী অন্তর্ভুক্ত থাকে?",
      answer: "আমাদের প্যাকেজগুলো নির্দিষ্ট বাজেট ও স্বচ্ছ ডেলিভারি টাইমলাইনে বিভক্ত। কোনো লুকানো চার্জ বা অতিরিক্ত ফি নেই।",
      keyPoints: [
        "স্টার্টার (৳১৫,০০০): ১-৩ পৃষ্ঠার ওয়েবসাইট, গুগল ম্যাপস ও এসইও, হোয়াটসঅ্যাপ চ্যাট, ৫টি সোশ্যাল ব্যানার ও ১ মাসের ফ্রি সাপোর্ট (৫-৭ দিন ডেলিভারি)।",
        "গ্রোথ (৳৩৫,০০০): পূর্ণাঙ্গ ই-কমার্স বা বিজনেস পোর্টাল, বিকাশ/নগদ অটো পেমেন্ট, অ্যাডমিন প্যানেল, ৩টি ভাইরাল রিলস ও ৩ মাসের প্রায়োরিটি সাপোর্ট (১০-১৪ দিন ডেলিভারি)।",
        "স্কেল (৳৭৫,০০০): এন্টারপ্রাইজ কাস্টম ওয়েব অ্যাপ, ফুল ব্র্যান্ডিং কিট, ৪K ভিডিও প্রোডাকশন, সোশ্যাল AI অটোমেশন ও ৬ মাসের VIP রক্ষণাবেক্ষণ (৩-৪ সপ্তাহ ডেলিভারি)।"
      ]
    },
    es: {
      question: "¿Qué incluye cada paquete: Starter (৳15.000), Growth (৳35.000) y Scale (৳75.000)?",
      answer: "Nuestras tarifas fijas y transparentes están diseñadas para diferentes etapas empresariales sin costos ocultos.",
      keyPoints: [
        "Starter (৳15.000): Sitio de 1-3 páginas, Google Maps, WhatsApp directo, 5 banners y 1 mes de garantía (5-7 días).",
        "Growth (৳35.000): Tienda online o portal dinámico, pasarelas bKash/tarjetas, panel admin, 3 reels virales y 3 meses de soporte (10-14 días).",
        "Scale (৳75.000): Aplicación web a medida, kit de marca completo, video 4K, pipelines de automatización con IA y 6 meses de soporte VIP (3-4 semanas)."
      ]
    }
  },
  {
    id: "faq-delivery-process",
    category: "delivery",
    question: "How does the step-by-step delivery process work from kickoff to launch?",
    answer: "We follow a battle-tested 5-stage sprint cycle that guarantees rapid turnaround, complete transparency, and flawless execution without project delays.",
    keyPoints: [
      "1. Discovery & Strategy: We analyze your brand goals, target customers, and tech stack via a rapid kickoff briefing or AI brief generator.",
      "2. UI/UX Wireframing & Creative Concepts: We share Figma prototypes, ad copy angles, and video scripts for your review and approval.",
      "3. Agile Development & Production: Full-stack coding with sub-second page loads, automated payment gateway integration, and 4K media rendering.",
      "4. Staging QA & Collaborative Revisions: You test a private live preview link and provide feedback through our streamlined revision portal.",
      "5. Live Deployment & Ownership Transfer: Final launch on high-speed CDN, custom domain setup, 100% source code handover, and admin training tutorial."
    ],
    bn: {
      question: "প্রজেক্ট শুরুর পর থেকে ফাইনাল ডেলিভারি পর্যন্ত পুরো প্রক্রিয়া কীভাবে সম্পন্ন হয়?",
      answer: "আমরা ৫টি সুনির্দিষ্ট ধাপে কাজ সম্পন্ন করি, যাতে কোনো বিলম্ব ছাড়াই নিখুঁত কোয়ালিটি ও পূর্ণ স্বচ্ছতা বজায় থাকে।",
      keyPoints: [
        "১. ব্রিফিং ও প্ল্যানিং: আপনার ব্যবসার লক্ষ্য, টার্গেট কাস্টমার ও প্রয়োজনীয় ফিচার বুঝে প্রজেক্ট রোডম্যাপ তৈরি।",
        "২. ডিজাইন ও কনসেপ্ট: Figma প্রোটোটাইপ, বিজ্ঞাপনের কপিরাইটিং ও ভিডিও স্ক্রিপ্ট তৈরি করে ক্লায়েন্টের মতামত গ্রহণ।",
        "৩. ডেভেলপমেন্ট ও প্রোডাকশন: লেটেস্ট React/Next.js ফুল-স্ট্যাক কোডিং, বিকাশ/নগদ পেমেন্ট সেটআপ ও ৪K ভিডিও এডিটিং।",
        "৪. রিভিউ ও রিভিশন: ক্লায়েন্টকে প্রাইভেট লাইভ প্রিভিউ লিংক দিয়ে টেস্টিং ও প্রয়োজনীয় পরিমার্জন সম্পন্ন।",
        "৫. লাইভ হ্যান্ডওভার ও ট্রেনিং: লাইভ ডোমেইনে লঞ্চ, সম্পূর্ণ সোর্স কোড/ফাইল হস্তান্তর ও ব্যবহারের বাংলা ভিডিও টিউটোরিয়াল প্রদান।"
      ]
    },
    es: {
      question: "¿Cómo funciona el proceso de entrega desde el inicio hasta el lanzamiento?",
      answer: "Seguimos un ciclo ágil de 5 fases diseñado para garantizar rapidez, comunicación continua y entregas de máxima calidad.",
      keyPoints: [
        "1. Diagnóstico y Brief: Definición de objetivos comerciales, audiencia y arquitectura técnica.",
        "2. Diseño y Prototipado: Wireframes interactivos en Figma, guiones y textos persuasivos para aprobación.",
        "3. Desarrollo y Producción: Programación de alto rendimiento, pasarelas de pago y edición multimedia.",
        "4. Revisión en Staging: Pruebas en enlace privado y ajustes colaborativos con el cliente.",
        "5. Despliegue y Entrega: Lanzamiento en CDN, configuración de dominio, código fuente y tutorial de administración."
      ]
    }
  },
  {
    id: "faq-payment-terms",
    category: "pricing",
    question: "What are your payment terms and which payment methods do you accept?",
    answer: "To ensure mutual commitment and financial peace of mind, all standard projects are structured on milestone-based payment schedules. We accept all major Bangladeshi mobile banking, international cards, and direct bank transfers.",
    keyPoints: [
      "Standard Schedule: 50% initial deposit upon contract kickoff, and remaining 50% upon final client sign-off before domain DNS propagation.",
      "Scale / Enterprise Milestones: 40% kickoff, 30% after staging prototype approval, and 30% upon final deployment.",
      "Accepted Payment Channels: bKash (Personal/Merchant), Nagad, Rocket, Bank Wire (Dutch-Bangla, BRAC, City Bank), and International Visa/MasterCard via secure gateway."
    ],
    bn: {
      question: "পেমেন্ট পলিসি কেমন এবং কোন কোন মাধ্যমে পেমেন্ট করা যায়?",
      answer: "উভয় পক্ষের সুরক্ষা ও স্বচ্ছতার জন্য আমাদের পেমেন্ট পলিসি মাইলস্টোন ভিত্তিক। কোনো অপ্রকাশ্য বা অতিরিক্ত ফি নেই।",
      keyPoints: [
        "স্ট্যান্ডার্ড শর্ত: কাজ শুরুর সময় ৫০% অগ্রিম এবং কাজ সন্তোষজনকভাবে সম্পন্ন হওয়ার পর বাকি ৫০% পরিশোধ।",
        "বড় প্রজেক্টের ক্ষেত্রে: ৪০% শুরুতেই, ৩০% প্রিভিউ অ্যাপ্রুভালের পর এবং ৩০% লাইভ ডেপ্লয়মেন্টে।",
        "পেমেন্ট মাধ্যম: বিকাশ (bKash), নগদ (Nagad), রকেট, ব্যাংক ট্রান্সফার (DBBL, City, BRAC Bank) এবং আন্তর্জাতিক কার্ড।"
      ]
    },
    es: {
      question: "¿Cuáles son las condiciones de pago y qué métodos aceptan?",
      answer: "Manejamos esquemas de pago por hitos para total tranquilidad y transparencia para ambas partes.",
      keyPoints: [
        "Esquema Estándar: 50% de anticipo al inicio y 50% contra entrega y satisfacción final antes del lanzamiento.",
        "Proyectos Scale: 40% inicial, 30% tras validación del prototipo funcional y 30% en entrega final.",
        "Medios Aceptados: Transferencias bancarias, bKash/Nagad, y tarjetas Visa/Mastercard internacionales."
      ]
    }
  },
  {
    id: "faq-turnaround-timelines",
    category: "delivery",
    question: "How long does delivery take, and do you offer rush / urgent delivery?",
    answer: "Delivery timelines depend on the chosen package and scope complexity, but we strictly respect all agreed deadlines. Rush sprint options are available for time-sensitive product launches.",
    keyPoints: [
      "Starter Package: 5 to 7 business days from brief confirmation.",
      "Growth Package: 10 to 14 business days including payment gateway testing.",
      "Scale Package: 3 to 4 weeks with iterative sprint releases.",
      "Express Rush Service: 48 to 72-hour turnaround is available on select services (add-on rates apply in Quote Calculator)."
    ],
    bn: {
      question: "একটি প্রজেক্ট ডেলিভারি দিতে কতদিন সময় লাগে? আর্জেন্ট ডেলিভারি কি সম্ভব?",
      answer: "প্যাকেজ ও স্কোপ অনুযায়ী ডেলিভারি সময় নির্ধারিত হয়। আমরা সব সময় নির্ধারিত ডেডলাইনের মধ্যেই নিখুঁত কাজ ডেলিভারি করি।",
      keyPoints: [
        "স্টার্টার প্যাকেজ: ৫ থেকে ৭ কার্যদিবস।",
        "গ্রোথ প্যাকেজ: ১০ থেকে ১৪ কার্যদিবস (পেমেন্ট গেটওয়ে টেস্টিং সহ)।",
        "স্কেল প্যাকেজ: ৩ থেকে ৪ সপ্তাহ (ধাপে ধাপে প্রিভিউ ডেলিভারি)।",
        "জরুরি বা এক্সপ্রেস ডেলিভারি: ৪৮-৭২ ঘণ্টার ফাস্ট-ট্র্যাক অপশন প্রযোজ্য (ক্যালকুলেটরে রাশ ফি অনুযায়ী)।"
      ]
    },
    es: {
      question: "¿Cuánto tiempo toma la entrega y ofrecen servicios urgentes?",
      answer: "Los plazos dependen del alcance del paquete seleccionado, con cumplimiento riguroso de fechas límite pactadas.",
      keyPoints: [
        "Paquete Starter: 5 a 7 días hábiles tras recibir los requerimientos.",
        "Paquete Growth: 10 a 14 días hábiles con pruebas de pasarelas incluidas.",
        "Paquete Scale: 3 a 4 semanas con entregas continuas en staging.",
        "Servicio Express Urgente: Entrega en 48 a 72 horas disponible con tarifa de sprint acelerado."
      ]
    }
  },
  {
    id: "faq-revisions-warranty",
    category: "support",
    question: "What is your revision policy, and what technical warranty is included?",
    answer: "We believe in collaborative client satisfaction. Every project includes structured revision rounds during the staging phase and a post-launch technical warranty to protect against bugs or broken scripts.",
    keyPoints: [
      "Revision Rounds: Up to 3 dedicated revision cycles on designs, copy, and layout before public deployment.",
      "Bug-Free Guarantee: 1 to 6 months of free technical warranty (depending on package tier) covering bug fixes, broken links, or API updates.",
      "Transparent Feedback: We provide timestamped preview links and video screen recordings so revisions are simple and painless."
    ],
    bn: {
      question: "কাজের রিভিশন বা সংশোধনের নিয়ম কী? কাজ শেষে কোনো ওয়ারেন্টি আছে কি?",
      answer: "আমরা শতভাগ ক্লায়েন্ট সন্তুষ্টি নিশ্চিত করতে প্রতিটি প্রজেক্টে ডেডিকেটেড রিভিশন রাউন্ড এবং কাজ শেষে টেকনিক্যাল ওয়ারেন্টি প্রদান করি।",
      keyPoints: [
        "রিভিশন পলিসি: লাইভ হওয়ার পূর্বে ডিজাইন, কনটেন্ট ও ফিচারে ৩ রাউন্ড ডেডিকেটেড রিভিশন সুবিধা।",
        "টেকনিক্যাল ওয়ারেন্টি: প্যাকেজ ভেদে ১ থেকে ৬ মাসের ফ্রি ওয়ারেন্টি (বাগ ফিক্স, লিংক চেক ও টেকনিক্যাল সাপোর্ট)।",
        "সহজ ফিডব্যাক: ক্লায়েন্ট সহজেই প্রাইভেট লিংকের মাধ্যমে সরাসরি মতামত ও পরিবর্তন জানাতে পারেন।"
      ]
    },
    es: {
      question: "¿Cuál es la política de revisiones y qué garantía técnica se incluye?",
      answer: "Garantizamos total satisfacción mediante ciclos estructurados de revisión en staging y garantía técnica posterior.",
      keyPoints: [
        "Rondas de Revisión: Hasta 3 rondas dedicadas de ajustes en diseño y contenido antes del despliegue final.",
        "Garantía Técnica: De 1 a 6 meses de mantenimiento gratuito contra errores, enlaces caídos y ajustes de API.",
        "Comunicación Ágil: Revisiones mediante enlaces de staging y notas en video explicativas."
      ]
    }
  },
  {
    id: "faq-source-code-ownership",
    category: "support",
    question: "Do I get full ownership of the source code, design files, and video assets?",
    answer: "Yes, 100%. Unlike restrictive agencies that lock clients into proprietary systems or monthly hostage fees, we transfer full commercial ownership and intellectual property to you upon project completion.",
    keyPoints: [
      "Full Code Access: Complete GitHub repository handover and deployment access on your chosen cloud account (Vercel, Firebase, AWS, or cPanel).",
      "Vector & Master Assets: Editable vector design files (.AI, .EPS, .SVG, .FIGMA) and 4K video exports.",
      "Zero Vendor Lock-in: You own your domain, database credentials, CMS credentials, and all customer data."
    ],
    bn: {
      question: "প্রজেক্টের সোর্স কোড, ডিজাইন ফাইলস ও ভিডিওর সম্পূর্ণ মালিকানা কি ক্লায়েন্টের থাকবে?",
      answer: "হ্যাঁ, ১০০% মালিকানা আপনার। অনেক এজেন্সি সোর্স কোড আটকে রেখে নিয়মিত ফি দাবি করে, কিন্তু ক্রিয়েটিভ ক্রিয়েটরে আপনি সম্পূর্ণ কোড ও ফাইলের পূর্ণাঙ্গ মালিকানা পান।",
      keyPoints: [
        "সম্পূর্ণ কোড হ্যান্ডওভার: প্রজেক্ট শেষে ফুল গিট রিপোজিটরি ও ক্লাউড ডেপ্লয়মেন্টের অ্যাক্সেস ক্লায়েন্টকে হস্তান্তর।",
        "মাস্টার ডিজাইন ফাইলস: এডিটেবল ভেক্টর ফাইল (.AI, .EPS, .SVG, .FIGMA) এবং ৪K ফুল এইচডি ভিডিও ফাইলস।",
        "নো ভেন্ডর লক-ইন: ডোমেইন, ডাটাবেস এবং কাস্টমার ডেটার সম্পূর্ণ নিয়ন্ত্রণ আপনার হাতে থাকবে।"
      ]
    },
    es: {
      question: "¿Recibo la propiedad total del código fuente, diseños y videos maestros?",
      answer: "Sí, el 100%. Transferimos todos los derechos comerciales y archivos fuente sin ningún tipo de dependencia tecnológica.",
      keyPoints: [
        "Código Fuente Completo: Entrega del repositorio Git y credenciales de despliegue en su propia nube.",
        "Archivos Vectoriales y Multimedia: Archivos editables en Figma, Illustrator y videos maestros en 4K.",
        "Sin Cuotas Ocultas: Dominio, base de datos y contenidos son enteramente suyos."
      ]
    }
  },
  {
    id: "faq-ai-automation",
    category: "process",
    question: "How do your 'AI automation develop' services work for social media and customer operations?",
    answer: "We engineer intelligent automation pipelines across WhatsApp, Facebook, Instagram, TikTok, and YouTube that operate 24/7 without manual staff overhead.",
    keyPoints: [
      "Auto-DM & Lead Funnels: Smart AI chat agents that instantly greet prospects, qualify requirements, and capture phone numbers into your CRM.",
      "Comment-to-Order Bots: Automated triggers that respond to Facebook & Instagram comments with instant product links via direct message.",
      "Multi-Channel Publishing: Automated scheduling workflows via Make.com and Zapier to publish content across all networks simultaneously.",
      "AI Video & Content Repurposing: Automated captioning, kinetic typography generation, and multi-ratio video exports for Reels and Shorts."
    ],
    bn: {
      question: "সোশ্যাল মিডিয়া ও কাস্টমার সার্ভিসের জন্য 'AI automation develop' কীভাবে কাজ করে?",
      answer: "আমরা ফেসবুক, ইনস্টাগ্রাম, হোয়াটসঅ্যাপ, টিকটক ও ইউটিউবে এমন ইন্টেলিজেন্ট অটোমেশন পাইপলাইন তৈরি করি যা মানুষের হস্তক্ষেপ ছাড়াই ২৪/৭ কার্যকর থাকে।",
      keyPoints: [
        "অটো-ডিএম ও লিড ফানেল: স্মার্ট AI বট যা কাস্টমারের মেসেজের তাৎক্ষণিক উত্তর দেয়, চাহিদা যাচাই করে এবং ফোন নম্বর সংগ্রহ করে।",
        "কমেন্ট-টু-লিড অটোমেশন: পোস্টে কেউ কমেন্ট করলে সাথে সাথে অটোমেটিক ডিএমে প্রোডাক্টের লিংক ও অফার পাঠিয়ে দেয়।",
        "মাল্টি-চ্যানেল শিডিউলিং: Make.com ও Zapier-এর মাধ্যমে এক ক্লিকেই সব সোশ্যাল প্ল্যাটফর্মে কনটেন্ট শিডিউল ও পাবলিশ।",
        "AI ভিডিও রিপারপাসিং: লং ভিডিও থেকে অটোমেটিক ভাইরাল শর্টস ও রিলস রূপান্তর এবং সাবটাইটেল জেনারেশন।"
      ]
    },
    es: {
      question: "¿Cómo funcionan sus servicios de 'AI automation develop' para redes sociales?",
      answer: "Diseñamos sistemas automatizados inteligentes en WhatsApp, Meta, TikTok y YouTube que operan de forma ininterrumpida.",
      keyPoints: [
        "Auto-DM y Calificación de Leads: Asistentes virtuales que capturan datos y atienden clientes las 24 horas.",
        "Automatización de Comentarios: Respuestas instantáneas por mensaje privado ante comentarios en publicaciones.",
        "Publicación Multicanal: Integraciones con Make y Zapier para distribución automática de contenidos.",
        "Adaptación Multimedia con IA: Generación masiva de subtítulos cinéticos y formatos para Reels y Shorts."
      ]
    }
  },
  {
    id: "faq-custom-quotes",
    category: "pricing",
    question: "Can I combine specific services or get a custom package if my business needs don't fit standard tiers?",
    answer: "Absolutely. While our standard tiers cover 90% of business requirements, we frequently build bespoke packages for specialized software portals, custom booking engines, or high-volume multi-brand marketing retainers.",
    keyPoints: [
      "Interactive Quote Calculator: Use our on-page calculator to select individual services, add-ons, and timelines for instant real-time estimates.",
      "Custom Scope Consultation: Book a free 15-minute briefing via WhatsApp or our contact form to receive a detailed line-item proposal within 24 hours.",
      "Modular Add-ons: You can easily add extra features (e.g., automated payment gateways, 3D WebGL animations, extra video reels) to any tier."
    ],
    bn: {
      question: "আমার ব্যবসার প্রয়োজন যদি স্ট্যান্ডার্ড প্যাকেজে না মেলে, তবে কি কাস্টম প্যাকেজ তৈরি করা সম্ভব?",
      answer: "অবশ্যই! আমাদের স্ট্যান্ডার্ড প্যাকেজের পাশাপাশি আপনি যেকোনো সার্ভিস ও ফিচার নিজের মতো পছন্দ করে কাস্টম কোটেশন তৈরি করতে পারেন।",
      keyPoints: [
        "ইন্টারেক্টিভ কোট ক্যালকুলেটর: আমাদের ওয়েবসাইটে থাকা ক্যালকুলেটর ব্যবহার করে সার্ভিস সিলেক্ট করুন এবং তাৎক্ষণিক বাজেট হিসাব পান।",
        "ফ্রি কাস্টম কনসাল্টেশন: হোয়াটসঅ্যাপ বা কন্ট্যাক্ট ফর্মের মাধ্যমে ১৫ মিনিটের ফ্রি ব্রিফিং আলোচনা করুন।",
        "মডুলার ফিচারস: যেকোনো প্যাকেজের সাথে অতিরিক্ত ফিচার যেমন বিকাশ গেটওয়ে, ৩D অ্যানিমেশন বা এক্সট্রা রিলস যুক্ত করা যায়।"
      ]
    },
    es: {
      question: "¿Puedo personalizar un paquete si los planes estándar no se ajustan a mi proyecto?",
      answer: "Por supuesto. Adaptamos soluciones a la medida para portales especializados, sistemas de reserva o marcas con altos volúmenes.",
      keyPoints: [
        "Calculadora Interactiva de Presupuesto: Seleccione servicios y add-ons individuales para una estimación en tiempo real.",
        "Asesoría Personalizada: Agende una sesión rápida por WhatsApp para recibir una propuesta desglosada en menos de 24 horas.",
        "Módulos Flexibles: Incorpore pasarelas de pago adicionales, animaciones interactivas o reels extra a cualquier paquete."
      ]
    }
  }
];

interface FaqSectionProps {
  onOpenQuoteCalculator?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenQuoteCalculator }) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openFaqId, setOpenFaqId] = useState<string>("faq-pricing-tiers");

  const categories = [
    { 
      id: "all", 
      label: language === "bn" ? "সকল প্রশ্ন" : language === "es" ? "Todas las Preguntas" : "All Questions" 
    },
    { 
      id: "pricing", 
      label: language === "bn" ? "প্রাইসিং ও পেমেন্ট" : language === "es" ? "Precios y Pagos" : "Pricing & Payment",
      icon: DollarSign
    },
    { 
      id: "delivery", 
      label: language === "bn" ? "ডেলিভারি প্রসেস" : language === "es" ? "Proceso de Entrega" : "Delivery Process",
      icon: Clock
    },
    { 
      id: "process", 
      label: language === "bn" ? "AI অটোমেশন ও স্কোপ" : language === "es" ? "IA y Flujos" : "AI Automation & Workflows",
      icon: Sparkles
    },
    { 
      id: "support", 
      label: language === "bn" ? "ওয়ারেন্টি ও সাপোর্ট" : language === "es" ? "Garantía y Soporte" : "Warranty & Ownership",
      icon: ShieldCheck
    }
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      
      const qText = language === "bn" && item.bn ? item.bn.question : language === "es" && item.es ? item.es.question : item.question;
      const aText = language === "bn" && item.bn ? item.bn.answer : language === "es" && item.es ? item.es.answer : item.answer;
      
      const matchesSearch = searchQuery.trim() === "" || 
        qText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aText.toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, language]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => prev === id ? "" : id);
  };

  const sectionTitles = {
    badge: language === "bn" ? "সাধারণ প্রশ্নোত্তর" : language === "es" ? "Preguntas Frecuentes" : "Frequently Asked Questions",
    title: language === "bn" ? "প্রাইসিং ও ডেলিভারি সম্পর্কিত স্পষ্ট ধারণা" : language === "es" ? "Claridad total sobre precios y entregas" : "Clear Answers on Pricing & Delivery",
    subtitle: language === "bn" 
      ? "আপনার প্রতিটি বিনিয়োগের সর্বোচ্চ মান ও শতভাগ স্বচ্ছতা নিশ্চিত করতে সাধারণ প্রশ্নাবলীর উত্তর।"
      : language === "es"
      ? "Todo lo que necesita saber sobre plazos de entrega, métodos de pago, garantías y código fuente."
      : "Everything you need to know about pricing packages, delivery sprints, payment terms, revisions, and code ownership.",
    searchPlaceholder: language === "bn" ? "প্রশ্ন খুঁজুন (যেমন: প্রাইসিং, ডেলিভারি, বিকাশ, ওয়ারেন্টি)..." : language === "es" ? "Buscar preguntas (ej. precios, entrega, pagos, código)..." : "Search questions (e.g. pricing, delivery timeline, payment, warranty)...",
    stillQuestions: language === "bn" ? "আপনার কি কোনো বিশেষ প্রশ্ন রয়েছে?" : language === "es" ? "¿Tiene una pregunta específica sobre su proyecto?" : "Have a specific question about your project?",
    stillDesc: language === "bn" 
      ? "আমাদের সাথে সরাসরি WhatsApp-এ কথা বলুন অথবা ইন্টারেক্টিভ কোট ক্যালকুলেটরে বাজেট এস্টিমেট করুন।" 
      : language === "es"
      ? "Escríbanos directamente por WhatsApp o use nuestra calculadora interactiva para una cotización instantánea."
      : "Speak directly with our technical team on WhatsApp or calculate an instant customized scope proposal.",
    chatWhatsApp: language === "bn" ? "হোয়াটসঅ্যাপে চ্যাট করুন" : language === "es" ? "Consultar por WhatsApp" : "Chat on WhatsApp",
    calcQuote: language === "bn" ? "বাজেট হিসাব করুন" : language === "es" ? "Calcular Presupuesto" : "Calculate Instant Quote",
    noResults: language === "bn" ? "কোনো প্রশ্ন পাওয়া যায়নি। ফিল্টার রিসেট করুন।" : language === "es" ? "No se encontraron preguntas coincidentes." : "No matching questions found.",
    resetFilter: language === "bn" ? "সব প্রশ্ন দেখুন" : language === "es" ? "Ver todas las preguntas" : "View all questions"
  };

  return (
    <section id="faq" className="py-24 relative border-t border-zinc-800/80 bg-zinc-950/40">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>{sectionTitles.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {sectionTitles.title}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            {sectionTitles.subtitle}
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Segmented Category Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl w-full md:w-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  id={`btn-faq-filter-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-faq-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={sectionTitles.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 mb-14" role="region" aria-label="Frequently Asked Questions">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const localizedQ = language === "bn" && faq.bn ? faq.bn.question : language === "es" && faq.es ? faq.es.question : faq.question;
              const localizedA = language === "bn" && faq.bn ? faq.bn.answer : language === "es" && faq.es ? faq.es.answer : faq.answer;
              const localizedPoints = language === "bn" && faq.bn?.keyPoints ? faq.bn.keyPoints : language === "es" && faq.es?.keyPoints ? faq.es.keyPoints : faq.keyPoints;

              return (
                <div
                  key={faq.id}
                  id={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-zinc-900/90 border-blue-500/40 shadow-xl shadow-black/40 ring-1 ring-blue-500/20"
                      : "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/70 hover:border-zinc-700/80"
                  }`}
                >
                  <button
                    type="button"
                    id={`btn-faq-toggle-${faq.id}`}
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-colors ${
                        isOpen ? "bg-blue-500/20 text-blue-400" : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {faq.category === "pricing" ? (
                          <DollarSign className="w-4 h-4" />
                        ) : faq.category === "delivery" ? (
                          <Clock className="w-4 h-4" />
                        ) : faq.category === "process" ? (
                          <Sparkles className="w-4 h-4" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                      </div>
                      <span className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                        isOpen ? "text-white" : "text-zinc-200 hover:text-white"
                      }`}>
                        {localizedQ}
                      </span>
                    </div>

                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 ${
                      isOpen 
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-400 rotate-180" 
                        : "bg-zinc-800/60 border-zinc-700/50 text-zinc-400"
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      className="px-5 sm:px-6 pb-6 pt-1 text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 animate-in fade-in duration-150"
                    >
                      <p className="mb-4 text-zinc-300 text-sm">
                        {localizedA}
                      </p>

                      {localizedPoints && localizedPoints.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-zinc-800/40">
                          {localizedPoints.map((point, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-2.5 text-xs text-zinc-300 bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/40">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 p-8 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
              <HelpCircle className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-300">{sectionTitles.noResults}</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
              >
                {sectionTitles.resetFilter}
              </button>
            </div>
          )}
        </div>

        {/* Bottom CTA Card: Direct WhatsApp & Quote Calculator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-zinc-900 border border-blue-500/30 shadow-2xl backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{sectionTitles.stillQuestions}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {language === "bn" ? "চলুন আপনার প্রজেক্টের পরিকল্পনা শুরু করি" : language === "es" ? "Comencemos a planificar su proyecto hoy" : "Let's plan your custom project sprint today"}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              {sectionTitles.stillDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {onOpenQuoteCalculator && (
              <button
                type="button"
                id="btn-faq-open-quote-calculator"
                onClick={onOpenQuoteCalculator}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{sectionTitles.calcQuote}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <a
              href="https://api.whatsapp.com/send?phone=8801676056414&text=Hi%2C%20I%20have%20a%20question%20about%20your%20pricing%20tiers%20and%20delivery%20process%20on%20Creative%20Creator!"
              target="_blank"
              rel="noopener noreferrer"
              id="btn-faq-whatsapp-inquiry"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-95"
            >
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.814 3.183 0 5.768-2.587 5.768-5.766 0-3.18-2.585-5.766-5.768-5.766zm9.969 5.766c0 5.519-4.481 10-10 10-1.745 0-3.385-.45-4.814-1.239l-5.186 1.36 1.385-5.06c-.868-1.488-1.385-3.218-1.385-5.061 0-5.519 4.481-10 10-10s10 4.481 10 10z"/>
              </svg>
              <span>{sectionTitles.chatWhatsApp}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
