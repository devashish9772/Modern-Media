import React, { useState } from 'react';
import { ToolMeta, Category, ToolId } from '../types';
import { TOOLS } from '../data/tools';
import {
  Youtube,
  MessageSquareText,
  FileText,
  Hash,
  Video,
  Clapperboard,
  Image as ImageIcon,
  Search,
  Zap,
  Sparkles,
  Bot,
  FolderDown,
  Music,
  Film,
  ArrowRight,
} from 'lucide-react';

interface ToolGridProps {
  onSelectTool: (toolId: ToolId) => void;
}

const CATEGORIES: Category[] = [
  'All',
  'YouTube & Video',
  'Social Captions & Hooks',
  'SEO & Strategy',
  'Creative & Prompts',
  'AI Assistant',
  'Media & Files',
];

export const ToolGrid: React.FC<ToolGridProps> = ({ onSelectTool }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Youtube':
        return <Youtube className="w-5 h-5 text-red-400" />;
      case 'MessageSquareText':
        return <MessageSquareText className="w-5 h-5 text-amber-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-yellow-400" />;
      case 'Hash':
        return <Hash className="w-5 h-5 text-emerald-400" />;
      case 'Video':
        return <Video className="w-5 h-5 text-amber-300" />;
      case 'Clapperboard':
        return <Clapperboard className="w-5 h-5 text-amber-400" />;
      case 'Image':
        return <ImageIcon className="w-5 h-5 text-purple-400" />;
      case 'Search':
        return <Search className="w-5 h-5 text-blue-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-yellow-300" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-amber-400" />;
      case 'FolderDown':
        return <FolderDown className="w-5 h-5 text-amber-400" />;
      case 'Music':
        return <Music className="w-5 h-5 text-emerald-400" />;
      case 'Film':
        return <Film className="w-5 h-5 text-amber-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  const getActionButtonText = (id: ToolId) => {
    switch (id) {
      case 'youtube_title':
        return 'Generate Titles';
      case 'caption_generator':
        return 'Create Captions';
      case 'description_generator':
        return 'Build Description';
      case 'hashtag_generator':
        return 'Find Hashtags';
      case 'video_idea_generator':
        return 'Generate Ideas';
      case 'script_generator':
        return 'Write Script';
      case 'thumbnail_prompt':
        return 'Generate Prompt';
      case 'seo_keyword':
        return 'Research Keywords';
      case 'content_hook':
        return 'Generate Hooks';
      case 'content_improver':
        return 'Improve Text';
      case 'ai_assistant':
        return 'Start Chat';
      case 'media_tools':
        return 'Inspect Media';
      case 'audio_tools':
        return 'Inspect Audio';
      case 'video_tools':
        return 'Extract Frames';
      default:
        return 'Open Tool';
    }
  };

  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory =
      selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Golden Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-gradient-to-br from-amber-500/10 to-yellow-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Modern Media Suite • Powered by Gemini 3.6 Flash
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Golden Content & Media Suite for Professional Creators
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
            Generate viral YouTube titles, social captions, SEO keywords, structured video scripts, AI thumbnail prompts, and inspect media files with server-backed AI intelligence.
          </p>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 14 media tools..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900 transition-all cursor-pointer shadow-sm hover:shadow-amber-500/10"
          >
            <div>
              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 transition-colors">
                  {renderIcon(tool.iconName)}
                </div>

                <div className="flex items-center gap-1.5">
                  {tool.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {tool.badge}
                    </span>
                  )}
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {tool.estimatedTime}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                {tool.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                {tool.shortDesc}
              </p>
            </div>

            {/* Card Footer */}
            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">
                {tool.category}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                <span>{getActionButtonText(tool.id)}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
