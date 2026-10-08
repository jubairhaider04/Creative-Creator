export interface SocialPlatform {
  id: "messenger" | "whatsapp" | "instagram" | "tiktok" | "imo";
  name: string;
  shortName: string;
  brandColor: string;
  glowColor: string;
  accentBg: string;
  textColor: string;
  activeUsersLabel: string;
  description: string;
}

export interface AutomationBenefit {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: "clock" | "zap" | "layers" | "shopping-cart" | "target" | "trending-up";
  metricBadge: string;
}

export interface AutomationStat {
  value: string;
  label: string;
  sublabel: string;
  color: string;
}

export interface ChatMessageItem {
  id: string;
  sender: "customer" | "ai" | "system";
  text: string;
  time: string;
  isAi?: boolean;
  avatar?: string;
  statusType?: "waiting" | "left" | "success" | "order_card";
  orderData?: {
    orderId: string;
    items: string;
    total: string;
    status: string;
    customer: string;
  };
  checks?: string[];
}

export const AI_AUTOMATION_CONFIG = {
  sectionId: "ai-automation",
  badge: "BONGIO AI AUTOMATION",
  title: "Turn Every Customer Message Into an Opportunity.",
  alternativeTitle: "AI-Powered Customer Automation for Every Conversation.",
  description:
    "Stop losing customers because of slow replies. Bongio Digital AI Automation helps businesses automatically handle customer questions, product inquiries, orders, follow-ups, and repetitive conversations across multiple messaging platforms — 24/7.",
  brandPositioning:
    "Bongio Digital helps businesses automate customer communication, marketing workflows and repetitive business processes using AI.",
  ctaPrimary: "Build My AI Automation",
  ctaSecondary: "See How It Works",
  conceptHeadline: "ONE AI SYSTEM → MULTIPLE CUSTOMER CHANNELS",
  
  platforms: [
    {
      id: "messenger",
      name: "Facebook Messenger",
      shortName: "Messenger",
      brandColor: "#0084FF",
      glowColor: "rgba(0, 132, 255, 0.4)",
      accentBg: "bg-blue-600/15 border-blue-500/30 text-blue-400",
      textColor: "text-[#0084FF]",
      activeUsersLabel: "1.3B+ Users",
      description: "Direct Page inbox auto-replies, catalog browsing & order taking."
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      shortName: "WhatsApp",
      brandColor: "#25D366",
      glowColor: "rgba(37, 211, 102, 0.4)",
      accentBg: "bg-emerald-600/15 border-emerald-500/30 text-emerald-400",
      textColor: "text-[#25D366]",
      activeUsersLabel: "2.7B+ Users",
      description: "Official WhatsApp Cloud API, verified green-tick workflows & order receipts."
    },
    {
      id: "instagram",
      name: "Instagram",
      shortName: "Instagram",
      brandColor: "#E1306C",
      glowColor: "rgba(225, 48, 108, 0.4)",
      accentBg: "bg-pink-600/15 border-pink-500/30 text-pink-400",
      textColor: "text-[#E1306C]",
      activeUsersLabel: "2.0B+ Users",
      description: "Story replies, DM keyword triggers & automated product links."
    },
    {
      id: "tiktok",
      name: "TikTok",
      shortName: "TikTok",
      brandColor: "#00F2FE",
      glowColor: "rgba(0, 242, 254, 0.4)",
      accentBg: "bg-cyan-600/15 border-cyan-500/30 text-cyan-400",
      textColor: "text-[#00F2FE]",
      activeUsersLabel: "1.5B+ Users",
      description: "Automated video comment to inbox routing & rapid lead capture."
    },
    {
      id: "imo",
      name: "IMO",
      shortName: "IMO",
      brandColor: "#00B2FF",
      glowColor: "rgba(0, 178, 255, 0.4)",
      accentBg: "bg-sky-600/15 border-sky-500/30 text-sky-400",
      textColor: "text-[#00B2FF]",
      activeUsersLabel: "200M+ Users",
      description: "High-adoption expatriate & cross-border customer communication."
    }
  ] as SocialPlatform[],

  stats: [
    {
      value: "1,000+",
      label: "CUSTOMER CONVERSATIONS / DAY",
      sublabel: "Processed with zero delays",
      color: "from-blue-400 to-cyan-300"
    },
    {
      value: "24/7",
      label: "AI AVAILABILITY",
      sublabel: "Never misses midnight inquiries",
      color: "from-emerald-400 to-teal-300"
    },
    {
      value: "< 1 SEC",
      label: "RESPONSE TIME",
      sublabel: "Instant contextual reply",
      color: "from-purple-400 to-pink-300"
    },
    {
      value: "5+",
      label: "MESSAGING PLATFORMS",
      sublabel: "Single unified AI core",
      color: "from-amber-400 to-orange-300"
    }
  ] as AutomationStat[],

  benefits: [
    {
      id: "b1",
      number: "01",
      title: "24/7 Customer Support",
      description: "Respond to customers even when your team is offline or sleeping. Keep the shop active day and night.",
      iconName: "clock",
      metricBadge: "100% Uptime"
    },
    {
      id: "b2",
      number: "02",
      title: "Instant Replies",
      description: "Answer common customer questions in sub-seconds. Speed creates instant buyer confidence and momentum.",
      iconName: "zap",
      metricBadge: "<1s Latency"
    },
    {
      id: "b3",
      number: "03",
      title: "Multi-Channel Automation",
      description: "Manage conversations seamlessly across Messenger, WhatsApp, Instagram, TikTok, and IMO in one central brain.",
      iconName: "layers",
      metricBadge: "5 Channels"
    },
    {
      id: "b4",
      number: "04",
      title: "Order Automation",
      description: "Capture customer name, phone, delivery address, and generate order confirmations straight into your system.",
      iconName: "shopping-cart",
      metricBadge: "Zero Data Entry"
    },
    {
      id: "b5",
      number: "05",
      title: "Lead Qualification",
      description: "Identify high-intent buyers, filter casual browsers, and collect qualified contact details automatically.",
      iconName: "target",
      metricBadge: "+48% Conversion"
    },
    {
      id: "b6",
      number: "06",
      title: "Save Time & Scale",
      description: "Automate repetitive conversations while your team focuses on fulfillment, strategy, and business growth.",
      iconName: "trending-up",
      metricBadge: "Save 30h/Week"
    }
  ] as AutomationBenefit[],

  withoutAiPhone: {
    statusLabel: "WITHOUT AI",
    indicatorColor: "rose",
    bottomTagline: "Slow replies = lost customers",
    clientName: "Nusrat Jahan",
    lastSeen: "Seen • 3h waiting — no reply",
    messages: [
      {
        id: "wo-1",
        sender: "customer",
        text: "Hello, is this product available?",
        time: "11:04 PM"
      },
      {
        id: "wo-2",
        sender: "customer",
        text: "Can you tell me the price?",
        time: "11:06 PM"
      },
      {
        id: "wo-3",
        sender: "customer",
        text: "Anyone there?",
        time: "11:41 PM"
      },
      {
        id: "wo-4",
        sender: "system",
        statusType: "waiting",
        text: "⏳ 3 hours waiting... No response from business",
        time: "02:41 AM"
      },
      {
        id: "wo-5",
        sender: "system",
        statusType: "left",
        text: "❌ Customer left the conversation (sale lost)",
        time: "02:45 AM"
      }
    ] as ChatMessageItem[]
  },

  withAiPhone: {
    statusLabel: "WITH AI AUTOMATION",
    indicatorColor: "emerald",
    bottomTagline: "Fast replies = more opportunities",
    clientName: "Fahim Ahmed",
    statusBadge: "Active now • Bongio AI responding in real-time",
    speedIndicator: "Replies in <1s • Order confirmed",
    messages: [
      {
        id: "w-1",
        sender: "customer",
        text: "Hi, is this product available?",
        time: "11:07 PM"
      },
      {
        id: "w-2",
        sender: "ai",
        isAi: true,
        text: "Hi Fahim! 👋 Yes, this product is currently available in all sizes.",
        time: "11:07 PM"
      },
      {
        id: "w-3",
        sender: "customer",
        text: "How much is it?",
        time: "11:08 PM"
      },
      {
        id: "w-4",
        sender: "ai",
        isAi: true,
        text: "The current price is ৳1,350 with free delivery inside Dhaka. Would you like to place an order?",
        time: "11:08 PM"
      },
      {
        id: "w-5",
        sender: "customer",
        text: "Yes, I want to order.",
        time: "11:09 PM"
      },
      {
        id: "w-6",
        sender: "ai",
        isAi: true,
        text: "Great! Please send your full name, phone number, and delivery address.",
        time: "11:09 PM"
      },
      {
        id: "w-7",
        sender: "customer",
        text: "Fahim Ahmed, 0171X-XXXXXX, GEC Circle, Chattogram",
        time: "11:10 PM"
      },
      {
        id: "w-8",
        sender: "system",
        statusType: "order_card",
        text: "Order Confirmed",
        time: "11:10 PM",
        orderData: {
          orderId: "#BG-9421",
          items: "1x Premium Cotton T-Shirt (Navy)",
          total: "৳1,350 BDT",
          status: "Order Confirmed & Invoice Sent",
          customer: "Fahim Ahmed"
        },
        checks: [
          "Customer information collected",
          "Order created (#BG-9421)",
          "Invoice & tracking confirmation sent"
        ]
      }
    ] as ChatMessageItem[]
  },

  ctaCard: {
    headline: "Ready to Automate Your Customer Conversations?",
    description: "Let AI handle repetitive customer conversations while your team focuses on growing the business.",
    primaryButton: "Start AI Automation",
    secondaryButton: "Talk to an Expert"
  },

  inquiryFormOptions: {
    industries: [
      "E-commerce & D2C",
      "Fashion & Clothing",
      "Electronics & Gadgets",
      "Retail & Wholesale",
      "Real Estate & Property",
      "Digital Agency / Service",
      "Restaurant & Food Delivery",
      "Healthcare & Clinic",
      "Education & Coaching",
      "Other Industry"
    ],
    monthlyVolume: [
      "Less than 500 messages / month",
      "500 – 2,000 messages / month",
      "2,000 – 10,000 messages / month",
      "10,000+ high-volume enterprise"
    ],
    preferredPlatforms: [
      { id: "Facebook Messenger", label: "Facebook Messenger", icon: "messenger" },
      { id: "WhatsApp", label: "WhatsApp", icon: "whatsapp" },
      { id: "Instagram", label: "Instagram", icon: "instagram" },
      { id: "TikTok", label: "TikTok", icon: "tiktok" },
      { id: "IMO", label: "IMO", icon: "imo" }
    ],
    automationRequirements: [
      { id: "Customer Support", label: "24/7 Customer Support & FAQ" },
      { id: "Product Questions", label: "Product Inquiries & Catalog Browsing" },
      { id: "Order Taking", label: "Automated Order Taking & Invoicing" },
      { id: "Lead Generation", label: "Lead Qualification & Contact Capture" },
      { id: "Appointment Booking", label: "Appointment & Consultation Booking" },
      { id: "Follow-up", label: "Automated Follow-ups & Cart Recovery" },
      { id: "Other", label: "Custom Business Workflow Integration" }
    ]
  }
};
