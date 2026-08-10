import React, { useState } from 'react';
import { ContentImproverResult } from '../../types';
import { Copy, Check, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  data: ContentImproverResult;
}

export const ContentImproverOutput: React.FC<Props> = ({ data }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Summary Badge */}
      {data.summary && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{data.summary}</span>
        </div>
      )}

      {/* Side-by-side / Stacked Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
            Original Text
          </span>
          <p className="text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed">
            {data.originalText}
          </p>
        </div>

        {/* Improved */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Improved Version
            </span>
            <button
              onClick={() => handleCopy(data.improvedText, 'improved')}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {copiedKey === 'improved' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Improved</span>
                </>
              )}
            </button>
          </div>

          <p className="text-sm font-medium text-white whitespace-pre-wrap leading-relaxed">
            {data.improvedText}
          </p>
        </div>
      </div>

      {/* Key Improvements Made */}
      {data.changesMade && data.changesMade.length > 0 && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            Key Improvements Applied
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.changesMade.map((change, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-zinc-950 text-xs text-zinc-200 border border-zinc-800 flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{change}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
