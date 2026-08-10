import React from 'react';
import { Sparkles, Bookmark, Lightbulb, FolderDown, Film, Music, Bot, Grid } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenLibrary: () => void;
  onOpenPresets: () => void;
  activeToolTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  activeTab,
  onSelectTab,
  onOpenLibrary,
  onOpenPresets,
  activeToolTitle,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & App Title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectTab('ai_tools')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-xl text-zinc-950 font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white text-base sm:text-lg leading-tight tracking-wider uppercase font-sans">
                  MODERN <span className="text-amber-400">MEDIA</span>
                </h1>
                {activeToolTitle && (
                  <>
                    <span className="text-zinc-600">/</span>
                    <span className="text-xs font-semibold text-amber-300 truncate max-w-[120px] sm:max-w-none">
                      {activeToolTitle}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 font-medium hidden sm:block">
                Golden AI Content & Media Suite
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => onSelectTab('ai_tools')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'ai_tools'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>AI Tools</span>
          </button>

          <button
            onClick={() => onSelectTab('media_tools')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'media_tools'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>Media Tools</span>
          </button>

          <button
            onClick={() => onSelectTab('video_tools')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'video_tools'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video Tools</span>
          </button>

          <button
            onClick={() => onSelectTab('audio_tools')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'audio_tools'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Audio Tools</span>
          </button>

          <button
            onClick={() => onSelectTab('ai_assistant')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'ai_assistant'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold shadow-md shadow-amber-500/10'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Assistant</span>
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Ideas Button */}
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-800 hover:border-amber-500/30 transition-all"
            title="Load Sample Ideas"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Try Ideas</span>
          </button>

          {/* Library Button */}
          <button
            onClick={onOpenLibrary}
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-all border border-amber-500/30"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Saved Library</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-zinc-950 font-bold">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="flex md:hidden items-center justify-around bg-zinc-900/90 border-t border-zinc-800 px-2 py-1.5 text-[11px] font-semibold text-zinc-400 overflow-x-auto">
        <button
          onClick={() => onSelectTab('ai_tools')}
          className={`px-2.5 py-1 rounded-lg ${
            activeTab === 'ai_tools' ? 'text-amber-400 font-bold bg-amber-500/10' : ''
          }`}
        >
          AI Tools
        </button>
        <button
          onClick={() => onSelectTab('media_tools')}
          className={`px-2.5 py-1 rounded-lg ${
            activeTab === 'media_tools' ? 'text-amber-400 font-bold bg-amber-500/10' : ''
          }`}
        >
          Media
        </button>
        <button
          onClick={() => onSelectTab('video_tools')}
          className={`px-2.5 py-1 rounded-lg ${
            activeTab === 'video_tools' ? 'text-amber-400 font-bold bg-amber-500/10' : ''
          }`}
        >
          Video
        </button>
        <button
          onClick={() => onSelectTab('audio_tools')}
          className={`px-2.5 py-1 rounded-lg ${
            activeTab === 'audio_tools' ? 'text-amber-400 font-bold bg-amber-500/10' : ''
          }`}
        >
          Audio
        </button>
        <button
          onClick={() => onSelectTab('ai_assistant')}
          className={`px-2.5 py-1 rounded-lg ${
            activeTab === 'ai_assistant' ? 'text-amber-400 font-bold bg-amber-500/10' : ''
          }`}
        >
          Assistant
        </button>
      </div>
    </header>
  );
};
