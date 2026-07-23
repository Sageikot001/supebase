export type ApiIconName = 'tradingChart' | 'zap' | 'translate' | 'globe' | 'creditCard' | 'coin' | 'sun' | 'bell' | 'mail' | 'analytics' | 'mapPin' | 'search' | 'cpu' | 'image' | 'video' | 'cloud' | 'shield' | 'link';

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  icon: ApiIconName;
  color: string;
  features: string[];
  pricing: {
    type: 'fixed' | 'usage' | 'tiered';
    monthly: number;
    yearly: number;
    yearlyDiscount?: number;
    trialDays: number;
  };
  useCases: string[];
  documentation?: string;
  featured?: boolean;
}

export interface LocalizationLanguage {
  code: string;
  name: string;
  pricePerMonth: number;
}

export const localizationLanguages: LocalizationLanguage[] = [
  { code: 'fr', name: 'French', pricePerMonth: 2 },
  { code: 'de', name: 'German', pricePerMonth: 2 },
  { code: 'es', name: 'Spanish', pricePerMonth: 2 },
  { code: 'it', name: 'Italian', pricePerMonth: 2 },
  { code: 'pt', name: 'Portuguese', pricePerMonth: 2 },
  { code: 'nl', name: 'Dutch', pricePerMonth: 2 },
  { code: 'pl', name: 'Polish', pricePerMonth: 2 },
  { code: 'ru', name: 'Russian', pricePerMonth: 2 },
  { code: 'ja', name: 'Japanese', pricePerMonth: 2 },
  { code: 'ko', name: 'Korean', pricePerMonth: 2 },
  { code: 'zh', name: 'Chinese', pricePerMonth: 2 },
  { code: 'ar', name: 'Arabic', pricePerMonth: 2 },
];

export const apiProducts: ApiProduct[] = [
  {
    id: 'tradingview',
    name: 'TradingView API',
    slug: 'tradingview',
    description: 'Real-time market data, charts, and technical analysis tools',
    longDescription: 'Access comprehensive financial market data with TradingView API. Get real-time quotes, historical data, advanced charting capabilities, and over 100+ technical indicators. Perfect for building trading platforms, financial dashboards, and market analysis tools.',
    category: 'Finance',
    icon: 'tradingChart',
    color: '#5B8DEF',
    features: [
      'Real-time market data for stocks, forex, and crypto',
      'Historical OHLCV data up to 20 years',
      'Advanced charting with 100+ technical indicators',
      'WebSocket streaming for live updates',
      'Symbol search and market screener',
      'Economic calendar integration',
    ],
    pricing: {
      type: 'fixed',
      monthly: 3,
      yearly: 36,
      trialDays: 14,
    },
    useCases: [
      'Trading platforms',
      'Financial dashboards',
      'Market analysis tools',
      'Portfolio trackers',
    ],
    featured: true,
  },
  {
    id: 'supabase-api',
    name: 'Supebase API',
    slug: 'supabase-api',
    description: 'Backend-as-a-Service with Postgres, Auth, and Realtime',
    longDescription: 'The official Supebase API gives you instant access to a full PostgreSQL database, authentication, real-time subscriptions, storage, and edge functions. Build production-ready applications in minutes with auto-generated APIs and comprehensive SDKs.',
    category: 'Backend',
    icon: 'zap',
    color: '#3ECF8E',
    features: [
      'Instant PostgreSQL database',
      'Auto-generated REST & GraphQL APIs',
      'Built-in authentication with 20+ providers',
      'Real-time subscriptions',
      'File storage with CDN',
      'Edge functions with Deno',
    ],
    pricing: {
      type: 'fixed',
      monthly: 9,
      yearly: 89,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'Web applications',
      'Mobile apps',
      'SaaS products',
      'Real-time collaboration tools',
    ],
    featured: true,
  },
  {
    id: 'localization',
    name: 'Localization API',
    slug: 'localization',
    description: 'AI-powered translation and localization for your apps',
    longDescription: 'Translate your application into multiple languages with our AI-powered localization API. Supports context-aware translations, pluralization, date/number formatting, and real-time updates. Pricing varies based on the number of target languages.',
    category: 'Localization',
    icon: 'translate',
    color: '#F59E0B',
    features: [
      'AI-powered context-aware translations',
      'Support for 50+ languages',
      'Pluralization and gender handling',
      'Date, time, and number formatting',
      'Real-time translation updates',
      'Translation memory for consistency',
    ],
    pricing: {
      type: 'tiered',
      monthly: 0,
      yearly: 0,
      trialDays: 14,
    },
    useCases: [
      'Multi-language websites',
      'Global mobile apps',
      'E-commerce platforms',
      'SaaS applications',
    ],
    featured: true,
  },
  {
    id: 'weather',
    name: 'Weather API',
    slug: 'weather',
    description: 'Global weather data, forecasts, and historical records',
    longDescription: 'Get accurate weather data for any location worldwide. Access current conditions, hourly and daily forecasts up to 16 days, historical data, weather alerts, and air quality information. Perfect for travel, agriculture, and logistics applications.',
    category: 'Weather',
    icon: 'sun',
    color: '#0EA5E9',
    features: [
      'Current weather conditions',
      '16-day weather forecasts',
      'Hourly forecasts up to 48 hours',
      'Historical weather data',
      'Severe weather alerts',
      'Air quality index',
    ],
    pricing: {
      type: 'fixed',
      monthly: 5,
      yearly: 49,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'Travel applications',
      'Agriculture platforms',
      'Logistics management',
      'Event planning apps',
    ],
  },
  {
    id: 'email',
    name: 'Email API',
    slug: 'email',
    description: 'Transactional and marketing email delivery at scale',
    longDescription: 'Send transactional and marketing emails with high deliverability. Features include email templates, analytics, bounce handling, and dedicated IP addresses. Send millions of emails with 99.9% uptime guarantee.',
    category: 'Communication',
    icon: 'mail',
    color: '#8B5CF6',
    features: [
      'High deliverability rates',
      'Email templates with variables',
      'Detailed analytics and tracking',
      'Bounce and complaint handling',
      'Dedicated IP addresses',
      'DKIM and SPF authentication',
    ],
    pricing: {
      type: 'fixed',
      monthly: 5,
      yearly: 50,
      yearlyDiscount: 17,
      trialDays: 14,
    },
    useCases: [
      'Transactional emails',
      'Marketing campaigns',
      'User notifications',
      'Password resets',
    ],
  },
  {
    id: 'internationalization',
    name: 'Internationalization API',
    slug: 'internationalization',
    description: 'Complete i18n solution with formatting, timezones & currencies',
    longDescription: 'A comprehensive internationalization API for global applications. Handle date/time formatting across timezones, currency conversion, number formatting, and locale-aware string comparisons. Pricing is $2 per language per month. Perfect for building apps that work seamlessly worldwide.',
    category: 'Localization',
    icon: 'globe',
    color: '#10B981',
    features: [
      'Timezone conversion & formatting',
      'Currency formatting & conversion',
      'Number & percentage formatting',
      'Locale-aware date/time',
      'RTL language support',
      'Pluralization rules',
    ],
    pricing: {
      type: 'tiered',
      monthly: 0,
      yearly: 0,
      trialDays: 14,
    },
    useCases: [
      'Global e-commerce',
      'Multi-region SaaS',
      'Financial applications',
      'Travel & booking platforms',
    ],
  },
  {
    id: 'payments',
    name: 'Payments API',
    slug: 'payments',
    description: 'Accept payments globally with multiple payment methods',
    longDescription: 'Process payments securely with support for credit cards, bank transfers, and local payment methods. PCI compliant, with built-in fraud detection and recurring billing support.',
    category: 'Finance',
    icon: 'creditCard',
    color: '#6366F1',
    features: [
      'Credit card processing',
      'Bank transfers and ACH',
      'Local payment methods',
      'Recurring billing',
      'Fraud detection',
      'PCI DSS compliant',
    ],
    pricing: {
      type: 'fixed',
      monthly: 9,
      yearly: 89,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'E-commerce platforms',
      'SaaS subscriptions',
      'Marketplace payments',
      'Donation platforms',
    ],
  },
  {
    id: 'maps',
    name: 'Maps API',
    slug: 'maps',
    description: 'Interactive maps, geocoding, and routing services',
    longDescription: 'Add interactive maps to your applications with customizable styles, markers, and overlays. Includes geocoding, reverse geocoding, routing, and places search functionality.',
    category: 'Location',
    icon: 'mapPin',
    color: '#EF4444',
    features: [
      'Interactive vector maps',
      'Custom map styles',
      'Geocoding and reverse geocoding',
      'Turn-by-turn routing',
      'Places search',
      'Traffic data',
    ],
    pricing: {
      type: 'fixed',
      monthly: 6,
      yearly: 59,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'Delivery tracking',
      'Store locators',
      'Real estate platforms',
      'Travel applications',
    ],
  },
  {
    id: 'ai-vision',
    name: 'AI Vision API',
    slug: 'ai-vision',
    description: 'Image recognition, OCR, and object detection',
    longDescription: 'Analyze images with AI-powered computer vision. Extract text with OCR, detect objects and faces, classify images, and generate image descriptions. Built on state-of-the-art machine learning models.',
    category: 'AI & ML',
    icon: 'search',
    color: '#EC4899',
    features: [
      'Object detection and classification',
      'Optical character recognition (OCR)',
      'Face detection and analysis',
      'Image moderation',
      'Custom model training',
      'Batch processing',
    ],
    pricing: {
      type: 'fixed',
      monthly: 8,
      yearly: 79,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'Document processing',
      'Content moderation',
      'Visual search',
      'Accessibility tools',
    ],
  },
  {
    id: 'search',
    name: 'Search API',
    slug: 'search',
    description: 'Full-text search with typo tolerance and filters',
    longDescription: 'Add powerful search functionality to your applications. Features include typo tolerance, faceted filtering, synonyms, and AI-powered ranking. Index millions of documents with sub-millisecond response times.',
    category: 'Search',
    icon: 'search',
    color: '#F97316',
    features: [
      'Full-text search',
      'Typo tolerance',
      'Faceted filtering',
      'Synonyms and stop words',
      'AI-powered ranking',
      'Analytics dashboard',
    ],
    pricing: {
      type: 'fixed',
      monthly: 7,
      yearly: 69,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'E-commerce search',
      'Documentation search',
      'Content discovery',
      'Job boards',
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics API',
    slug: 'analytics',
    description: 'Track user behavior and product metrics',
    longDescription: 'Understand how users interact with your product. Track events, page views, and conversions with a privacy-focused analytics solution. Build custom dashboards and export data for further analysis.',
    category: 'Analytics',
    icon: 'analytics',
    color: '#14B8A6',
    features: [
      'Event tracking',
      'User journey mapping',
      'Funnel analysis',
      'Cohort analysis',
      'Custom dashboards',
      'Data export',
    ],
    pricing: {
      type: 'fixed',
      monthly: 6,
      yearly: 59,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'Product analytics',
      'Marketing attribution',
      'A/B testing analysis',
      'User behavior insights',
    ],
  },
  {
    id: 'notifications',
    name: 'Push Notifications API',
    slug: 'notifications',
    description: 'Cross-platform push notifications for web and mobile',
    longDescription: 'Send push notifications to users across web, iOS, and Android. Segment your audience, schedule notifications, and track engagement metrics. Supports rich media and action buttons.',
    category: 'Communication',
    icon: 'bell',
    color: '#A855F7',
    features: [
      'Cross-platform support',
      'Audience segmentation',
      'Scheduled notifications',
      'Rich media support',
      'Action buttons',
      'Engagement analytics',
    ],
    pricing: {
      type: 'fixed',
      monthly: 5,
      yearly: 49,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'User re-engagement',
      'Order updates',
      'Breaking news alerts',
      'Promotional campaigns',
    ],
  },
  {
    id: 'tradingview-widgets',
    name: 'TradingView Widgets',
    slug: 'tradingview-widgets',
    description: 'Embedded financial charts, tickers, and market widgets',
    longDescription: 'Integrate professional-grade TradingView charts and widgets into your application. Display real-time stock prices, crypto charts, market heatmaps, and technical analysis tools. Fully customizable with your branding.',
    category: 'Finance',
    icon: 'analytics',
    color: '#131722',
    features: [
      'Advanced charting widgets',
      'Real-time market tickers',
      'Market overview heatmaps',
      'Technical analysis tools',
      'Cryptocurrency support',
      'Custom branding options',
    ],
    pricing: {
      type: 'fixed',
      monthly: 8,
      yearly: 79,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'Trading platforms',
      'Financial dashboards',
      'Investment apps',
      'Crypto portfolios',
    ],
  },
  {
    id: 'financial-news',
    name: 'Financial News API',
    slug: 'financial-news',
    description: 'Aggregated news from MarketWatch, Yahoo Finance, CNBC & WSJ',
    longDescription: 'Access curated financial news from top sources including MarketWatch, Yahoo Finance, CNBC, and Wall Street Journal. Get real-time market updates, earnings reports, and breaking business news through a unified API.',
    category: 'Finance',
    icon: 'cpu',
    color: '#DC2626',
    features: [
      'Multi-source news aggregation',
      'Real-time market updates',
      'Earnings & economic calendar',
      'Sentiment analysis',
      'Category filtering',
      'Search functionality',
    ],
    pricing: {
      type: 'fixed',
      monthly: 6,
      yearly: 59,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'Financial news apps',
      'Trading platforms',
      'Investment research',
      'Market dashboards',
    ],
  },
  {
    id: 'crypto-news',
    name: 'Crypto News API',
    slug: 'crypto-news',
    description: 'Real-time cryptocurrency news from CoinDesk and top sources',
    longDescription: 'Stay updated with the latest cryptocurrency news from CoinDesk, CoinTelegraph, and other leading crypto publications. Get breaking news, market analysis, regulatory updates, and DeFi coverage.',
    category: 'Crypto',
    icon: 'coin',
    color: '#F7931A',
    features: [
      'Real-time crypto news',
      'Multi-source aggregation',
      'Price movement alerts',
      'DeFi & NFT coverage',
      'Regulatory updates',
      'Sentiment tracking',
    ],
    pricing: {
      type: 'fixed',
      monthly: 5,
      yearly: 49,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'Crypto trading apps',
      'Portfolio trackers',
      'News aggregators',
      'Research platforms',
    ],
  },
  {
    id: 'bitcoin-explorer',
    name: 'Bitcoin Explorer API',
    slug: 'bitcoin-explorer',
    description: 'Bitcoin blockchain data via Mempool.space integration',
    longDescription: 'Access comprehensive Bitcoin blockchain data through our Mempool.space integration. Query transactions, blocks, addresses, and mempool data. Get fee estimates, UTXO sets, and real-time network statistics.',
    category: 'Crypto',
    icon: 'coin',
    color: '#F7931A',
    features: [
      'Transaction lookups',
      'Block explorer data',
      'Address balance & history',
      'Mempool monitoring',
      'Fee estimation',
      'Network statistics',
    ],
    pricing: {
      type: 'fixed',
      monthly: 7,
      yearly: 69,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'Bitcoin wallets',
      'Payment verification',
      'Blockchain analytics',
      'Exchange platforms',
    ],
  },
  {
    id: 'ethereum-explorer',
    name: 'Ethereum Explorer API',
    slug: 'ethereum-explorer',
    description: 'Ethereum & ERC20 blockchain data via Etherscan integration',
    longDescription: 'Query Ethereum blockchain data through our Etherscan integration. Access transaction details, smart contract data, token balances, gas prices, and ENS lookups. Full support for ERC20 and ERC721 tokens.',
    category: 'Crypto',
    icon: 'coin',
    color: '#627EEA',
    features: [
      'Transaction tracking',
      'Smart contract data',
      'ERC20/ERC721 support',
      'Gas price oracle',
      'ENS resolution',
      'Event logs access',
    ],
    pricing: {
      type: 'fixed',
      monthly: 7,
      yearly: 69,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'Ethereum wallets',
      'DeFi applications',
      'NFT platforms',
      'Token analytics',
    ],
  },
  {
    id: 'tron-explorer',
    name: 'TRON Explorer API',
    slug: 'tron-explorer',
    description: 'TRON & TRC20 blockchain data via Tronscan integration',
    longDescription: 'Access TRON blockchain data through our Tronscan integration. Query transactions, smart contracts, TRC20 token transfers, and account details. Monitor energy and bandwidth consumption.',
    category: 'Crypto',
    icon: 'link',
    color: '#FF0013',
    features: [
      'Transaction lookups',
      'TRC20 token support',
      'Smart contract data',
      'Account resources',
      'Energy & bandwidth stats',
      'Validator information',
    ],
    pricing: {
      type: 'fixed',
      monthly: 6,
      yearly: 59,
      yearlyDiscount: 18,
      trialDays: 14,
    },
    useCases: [
      'TRON wallets',
      'USDT tracking',
      'DApp development',
      'Payment systems',
    ],
  },
];

export function getApiById(id: string): ApiProduct | undefined {
  return apiProducts.find(api => api.id === id);
}

export function getApiBySlug(slug: string): ApiProduct | undefined {
  return apiProducts.find(api => api.slug === slug);
}

export function getApisByCategory(category: string): ApiProduct[] {
  return apiProducts.filter(api => api.category === category);
}

export function getFeaturedApis(): ApiProduct[] {
  return apiProducts.filter(api => api.featured);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(apiProducts.map(api => api.category)));
}

export function calculateLocalizationPrice(languageCodes: string[]): { monthly: number; yearly: number } {
  const monthly = languageCodes.reduce((total, code) => {
    const lang = localizationLanguages.find(l => l.code === code);
    return total + (lang?.pricePerMonth || 0);
  }, 0);

  const yearly = Math.round(monthly * 10);

  return { monthly, yearly };
}
