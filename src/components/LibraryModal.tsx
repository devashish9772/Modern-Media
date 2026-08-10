import React, { useState } from 'react';
import { SavedItem } from '../types';
import {
  X,
  Trash2,
  Copy,
  Check,
  Bookmark,
  Search,
  Calendar,
  Sparkles,
} from 'lucide-react';

import { YouTubeTitleOutput } from './OutputRenderers/YouTubeTitleOutput';
import { CaptionOutput } from './OutputRenderers/CaptionOutput';
import { ScriptOutput } from './OutputRenderers/ScriptOutput';
import { ViralHooksOutput } from './OutputRenderers/ViralHooksOutput';
import { HashtagOutput } from './OutputRenderers/HashtagOutput';
import { RepurposerOutput } from './OutputRenderers/RepurposerOutput';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedItem[];
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const LibraryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  savedItems,
  onDeleteItem,
  onClearAll,
}) => {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<SavedItem | null>(null);

  if (!isOpen) return null;

  const filteredItems = savedItems.filter(item => {
    const q = search.toLowerCase();
    return (
      item.toolTitle.toLowerCase().includes(q) ||
      JSON.stringify(item.inputs).toLowerCase().includes(q)
    );
  });

  const renderSavedOutput = (item: SavedItem) => {
    switch (item.toolId) {
      case 'youtube_title':
        return <YouTubeTitleOutput data={item.output} />;
      case 'caption_generator':
        return <CaptionOutput data={item.output} />;
      case 'script_outline':
        return <ScriptOutput data={item.output} />;
      case 'viral_hooks':
        return <ViralHooksOutput data={item.output} />;
      case 'hashtag_generator':
        return <HashtagOutput data={item.output} />;
      case 'content_repurposer':
        return <RepurposerOutput data={item.output} />;
      default:
        return (
          <pre className="p-4 bg-slate-950 rounded-xl text-xs text-slate-300 overflow-x-auto">
            {JSON.stringify(item.output, null, 2)}
          </pre>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 rounded-xl border border-indigo-500/30 text-indigo-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">
                Saved Content Library
              </h3>
              <p className="text-xs text-slate-400">
                {savedItems.length} saved outputs in local storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedItems.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors border border-red-500/20"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {savedItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-slate-300 font-semibold text-sm">
                Your library is empty
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Generate titles, captions, or scripts and click "Save to Library" to store them here for easy access.
              </p>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search saved creations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Grid of Saved Items */}
              <div className="space-y-4">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {item.toolTitle}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.createdAt}
                        </span>
                      </div>

                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete from Library"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Output Content */}
                    <div className="pt-1">{renderSavedOutput(item)}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
