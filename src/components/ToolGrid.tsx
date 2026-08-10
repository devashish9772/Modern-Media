import React, { useState } from 'react';
import { ToolMeta, Category, ToolId } from '../types';
import { TOOLS } from '../data/tools';
import {
  Youtube,
  MessageSquareText,
  Clapperboard,
  Sparkles,
  Hash,
  Repeat,
  Search,
  ArrowRight,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface ToolGridProps {
  onSelectTool: (toolId: ToolId) => void;
  onSelectPreset?: (preset: any) => void;
}

const CATEGORIES: Category[] = [
  'All',
  'YouTube',
  'Social Media',
  'Shorts & Reels',
  'SEO & Strategy',
  'Repurposing',
];

export const ToolGrid: React.FC<ToolGridProps> = ({ onSelectTool }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Youtube':
        return <Youtube className="w-5 h-5 text-red-400" />;
      case 'MessageSquareText':
        return <MessageSquareText className="w-5 h-5 text-indigo-400" />;
      case 'Clapperboard':
        return <Clapperboard className="w-5 h-5 text-purple-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Hash':
        return <Hash className="w-5 h-5 text-emerald-400" />;
      case 'Repeat':
        return <Repeat className="w-5 h-5 text-sky-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
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
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 md:p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-400" /> Powered by Gemini 3.6 Flash
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Create Viral Titles, Captions, Hooks & Scripts in Seconds
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Select an AI content generator below to generate click-worthy YouTube titles, high-converting social captions, retention hooks, hashtag strategies, or multi-platform repurposing.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="group relative flex flex-col justify-between p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all cursor-pointer shadow-sm hover:shadow-indigo-500/5"
          >
            <div>
              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 group-hover:bg-indigo-600/10 group-hover:border-indigo-500/30 transition-colors">
                  {renderIcon(tool.iconName)}
                </div>

                <div className="flex items-center gap-1.5">
                  {tool.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {tool.badge}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-500 font-mono">
                    {tool.estimatedTime}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors mb-2">
                {tool.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {tool.shortDesc}
              </p>
            </div>

            {/* Card Footer */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {tool.category}
              </span>
              <span className="flex items-center gap-1 font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                Launch Tool
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
