export type ToolId = 
  | 'youtube_title'
  | 'caption_generator'
  | 'description_generator'
  | 'hashtag_generator'
  | 'video_idea_generator'
  | 'script_generator'
  | 'thumbnail_prompt'
  | 'seo_keyword'
  | 'content_hook'
  | 'content_improver'
  | 'ai_assistant'
  | 'media_tools'
  | 'audio_tools'
  | 'video_tools';

export type Category = 
  | 'All' 
  | 'YouTube & Video' 
  | 'Social Captions & Hooks' 
  | 'SEO & Strategy' 
  | 'Creative & Prompts' 
  | 'AI Assistant'
  | 'Media & Files';

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

// 1. YouTube Titles Result Interface
export interface YouTubeTitleItem {
  title: string;
  ctrScore: number;
  angle: string;
  thumbnailText: string;
  categoryType: 'SEO' | 'Curiosity' | 'Professional' | 'Short' | 'Emotional';
}

export interface YouTubeTitleResult {
  titles: YouTubeTitleItem[];
  proTip?: string;
}

// 2. Caption Generator Result
export interface CaptionItem {
  platform: string;
  hook: string;
  text: string;
  hashtags: string[];
  cta: string;
}

export interface CaptionResult {
  captions: CaptionItem[];
}

// 3. Description Generator Result
export interface DescriptionResult {
  seoDescription: string;
  shortDescription: string;
  longDescription: string;
  callToAction: string;
  keywords: string[];
  hashtags: string[];
}

// 4. Hashtags Result
export interface HashtagResult {
  popular: string[];
  niche: string[];
  longTail: string[];
  copyAllString: string;
}

// 5. Video Idea Result
export interface VideoIdeaItem {
  title: string;
  hook: string;
  concept: string;
  format: string;
}

export interface VideoIdeaResult {
  ideas: VideoIdeaItem[];
}

// 6. Script Generator Result
export interface ScriptResult {
  title: string;
  platform: string;
  duration: string;
  hook: string;
  introduction: string;
  mainContent: string;
  ending: string;
  callToAction: string;
}

// 7. Thumbnail Prompt Result
export interface ThumbnailPromptResult {
  prompt: string;
  composition: string;
  subject: string;
  background: string;
  lighting: string;
  cameraAngle: string;
  colors: string;
  facialExpression: string;
  typographyPlacement: string;
  aspectRatio: string;
  detailInstructions: string;
}

// 8. SEO Keyword Result
export interface SEOKeywordResult {
  primaryKeywords: string[];
  secondaryKeywords: string[];
  longTailKeywords: string[];
  searchIntentSuggestions: string[];
  copyAllString: string;
}

// 9. Content Hook Result
export interface ContentHookItem {
  category: 'Curiosity' | 'Question' | 'Story' | 'Emotional' | 'Educational' | 'Unexpected fact';
  platform: string;
  hookText: string;
  reason: string;
}

export interface ContentHookResult {
  hooks: ContentHookItem[];
}

// 10. Content Improver Result
export interface ContentImproverResult {
  originalText: string;
  improvedText: string;
  changesMade: string[];
  summary: string;
}

// 11. Chat Message
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
