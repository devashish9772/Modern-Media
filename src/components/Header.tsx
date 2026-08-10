import React from 'react';
import { Sparkles, Bookmark, Zap, Lightbulb } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenLibrary: () => void;
  onOpenPresets: () => void;
  onResetToGrid: () => void;
  activeToolTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  onOpenLibrary,
  onOpenPresets,
  onResetToGrid,
  activeToolTitle,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & App Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onResetToGrid}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/30 text-indigo-400 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-100 text-base leading-tight tracking-tight group-hover:text-indigo-300 transition-colors">
                  AI Content Creator
                </h1>
                {activeToolTitle && (
                  <>
                    <span className="text-slate-600">/</span>
                    <span className="text-xs font-medium text-slate-300 truncate max-w-[150px] sm:max-w-none">
                      {activeToolTitle}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Viral Titles, Social Captions, Scripts & Repurposing
              </p>
            </div>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Gemini Model Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Gemini 3.6 Flash Server Engine
          </div>

          {/* Quick Presets Button */}
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all"
            title="Load Example Ideas"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Try Ideas</span>
          </button>

          {/* Library Button */}
          <button
            onClick={onOpenLibrary}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all border border-indigo-500/50"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Library</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white text-indigo-950 font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
