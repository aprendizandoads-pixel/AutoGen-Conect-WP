export type AiProvider = 'gemini' | 'openai';
export type ImageProvider = 'gemini' | 'pollinations' | 'unsplash' | 'lorem-flickr';

export type PublicationFormat = 
  | 'blog-post' 
  | 'article' 
  | 'news' 
  | 'image-only' 
  | 'image-article' 
  | 'video-article' 
  | 'step-by-step' 
  | 'ebook' 
  | 'infographic'
  | 'whitepaper'
  | 'case-study'
  | 'landing-page'
  | 'wp-standard' 
  | 'wp-aside' 
  | 'wp-gallery' 
  | 'wp-quote' 
  | 'wp-audio';

export interface CompetitorReport {
  url: string;
  performanceScore: number; // 0-100
  demographics: string;
  marketingStrategy: string;
  strengths: string;
  failures: string;
  gapIdentified: string;
}

export interface SeoStrategy {
  competitorAnalysis: CompetitorReport[];
  gapAnalysis: string;
  contentPlan: string;
  projectedTrafficIncrease: number;
}

export interface GeneratedContent {
  strategy: SeoStrategy;
  htmlContent: string;
  cssContent?: string;
  jsContent?: string;
  jsonLd: string;
  metaTitle: string;
  metaDescription: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface SeoParams {
  mainKeywords: string;
  organicKeywords: string;
  snippetKeywords: string;
  ctaText: string;
  ctaUrl: string;
  competitorUrls: string;
  language: string;
  contentTone: string;
  publicationFormat: PublicationFormat;
  includeImages: boolean;
  aiProvider: AiProvider;
  imageProvider: ImageProvider;
  openAiKey?: string;
  openAiModel?: string;
}

export interface WordPressConnection {
  url: string;
  username: string;
  appPassword: string;
}

export interface SeoEvaluation {
  score: number;
  status: 'optimized' | 'needs-work' | 'poor';
  analysis: string;
  suggestions: string[];
}

export interface WordPressPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  link: string;
  date: string;
  status: string;
  seoEvaluation?: SeoEvaluation;
}