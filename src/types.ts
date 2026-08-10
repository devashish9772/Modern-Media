export type ToolId = 
  | 'youtube_title'
  | 'caption_generator'
  | 'script_outline'
  | 'viral_hooks'
  | 'hashtag_generator'
  | 'content_repurposer';

export type Category = 'All' | 'YouTube' | 'Social Media' | 'Shorts & Reels' | 'SEO & Strategy' | 'Repurposing';

export interface ToolMeta {
  id: ToolId;
  title: string;
  shortDesc: string;
  description: string;
  category: Category;
  iconName: string;
  badge?: string;
  estimatedTime: string;
  popularPrompt?: string;
}

export interface PresetIdea {
  id: string;
  title: string;
  niche: string;
  toolId: ToolId;
  inputs: Record<string, string>;
}

export interface SavedItem {
  id: string;
  toolId: ToolId;
  toolTitle: string;
  inputs: Record<string, any>;
  output: any;
  createdAt: string;
}

// YouTube Titles Result Interface
export interface YouTubeTitleItem {
  title: string;
  ctrScore: number;
  angle: string;
  thumbnailText: string;
  characterCount: number;
}

export interface YouTubeTitleResult {
  titles: YouTubeTitleItem[];
  proTip?: string;
}

// Caption Generator Result
export interface CaptionResult {
  hook: string;
  fullCaption: string;
  hashtags: string[];
  engagementScore?: string;
  bestTimeToPostAdvice?: string;
}

// Script Outline Result
export interface ScriptResult {
  title: string;
  estimatedDuration: string;
  markdownScript: string;
  keyTakeaways: string[];
}

// Viral Hooks Result
export interface ViralHookItem {
  angleName: string;
  verbalHook: string;
  visualAction: string;
  textOverlay: string;
}

export interface ViralHooksResult {
  hooks: ViralHookItem[];
}

// Hashtags Result
export interface HashtagResult {
  massiveReach: string[];
  targetedNiche: string[];
  lowCompetition: string[];
  seoKeywords: string[];
  copyAllHashtagsString: string;
}

// Content Repurposer Result
export interface CarouselSlide {
  slideNumber: number;
  title: string;
  content: string;
}

export interface RepurposerResult {
  twitterThread: string[];
  linkedInPost: string;
  instagramCarousel: CarouselSlide[];
  shortVideoScript: string;
}
