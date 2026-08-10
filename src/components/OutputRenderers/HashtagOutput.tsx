import React, { useState } from 'react';
import { HashtagResult } from '../../types';
import { Copy, Check, Hash } from 'lucide-react';

interface Props {
  data: HashtagResult;
}

export const HashtagOutput: React.FC<Props> = ({ data }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const allTags =
    data?.copyAllString ||
    [...(data?.popular || []), ...(data?.niche || []), ...(data?.longTail || [])].join(' ');

  return (
    <div className="space-y-5">
      {/* Copy All Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-600/10 border border-amber-500/30">
        <div>
          <h4 className="text-sm font-bold text-amber-300">Hashtag Strategy Ready</h4>
          <p className="text-xs text-zinc-400">Popular, Niche, and Long-Tail combined</p>
        </div>
        <button
          onClick={() => handleCopy(allTags, 'all')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
        >
          {copiedKey === 'all' ? (
            <>
              <Check className="w-4 h-4 text-zinc-950" />
              <span>Copied All Tags!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy All Hashtags</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Popular Tiers */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">Popular (High Volume)</span>
            <button
              onClick={() => handleCopy((data?.popular || []).join(' '), 'popular')}
              className="text-[11px] text-zinc-400 hover:text-white"
            >
              {copiedKey === 'popular' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(data?.popular || []).map((tag, idx) => (
              <span key={idx} className="px-2 py-1 rounded bg-zinc-950 text-amber-300 font-mono text-xs border border-zinc-800">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Niche Tiers */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">Niche (Targeted)</span>
            <button
              onClick={() => handleCopy((data?.niche || []).join(' '), 'niche')}
              className="text-[11px] text-zinc-400 hover:text-white"
            >
              {copiedKey === 'niche' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(data?.niche || []).map((tag, idx) => (
              <span key={idx} className="px-2 py-1 rounded bg-zinc-950 text-emerald-300 font-mono text-xs border border-zinc-800">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Long-Tail Tiers */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400">Long-Tail (Low Comp)</span>
            <button
              onClick={() => handleCopy((data?.longTail || []).join(' '), 'longTail')}
              className="text-[11px] text-zinc-400 hover:text-white"
            >
              {copiedKey === 'longTail' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(data?.longTail || []).map((tag, idx) => (
              <span key={idx} className="px-2 py-1 rounded bg-zinc-950 text-blue-300 font-mono text-xs border border-zinc-800">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
