import React, { useState } from 'react';
import { SEOKeywordResult } from '../../types';
import { Copy, Check, Search } from 'lucide-react';

interface Props {
  data: SEOKeywordResult;
}

export const SEOKeywordOutput: React.FC<Props> = ({ data }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const allKeywords =
    data?.copyAllString ||
    [
      ...(data?.primaryKeywords || []),
      ...(data?.secondaryKeywords || []),
      ...(data?.longTailKeywords || []),
    ].join(', ');

  return (
    <div className="space-y-5">
      {/* Copy All Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-amber-500/30">
        <div>
          <h4 className="text-sm font-bold text-amber-300">SEO Keyword Research Complete</h4>
          <p className="text-xs text-zinc-400">Primary, Secondary, and Search Intent clusters</p>
        </div>
        <button
          onClick={() => handleCopy(allKeywords, 'all')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
        >
          {copiedKey === 'all' ? (
            <>
              <Check className="w-4 h-4 text-zinc-950" />
              <span>Copied All Keywords!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy All Keywords</span>
            </>
          )}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            Primary High-Volume Keywords
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(data?.primaryKeywords || []).map((kw, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-zinc-950 text-amber-300 font-mono text-xs border border-zinc-800">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Secondary */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            Secondary Semantic Keywords
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(data?.secondaryKeywords || []).map((kw, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-zinc-950 text-emerald-300 font-mono text-xs border border-zinc-800">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Long-Tail */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
            Long-Tail Search Phrases
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(data?.longTailKeywords || []).map((kw, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-zinc-950 text-blue-300 font-mono text-xs border border-zinc-800">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Search Intent */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
            User Search Intent & Questions
          </span>
          <div className="space-y-1">
            {(data?.searchIntentSuggestions || []).map((query, idx) => (
              <div key={idx} className="text-xs text-zinc-300 flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">•</span> {query}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
