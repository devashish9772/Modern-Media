import React, { useState } from 'react';
import { YouTubeTitleResult } from '../../types';
import { Copy, Check, Sparkles, AlertCircle, Image as ImageIcon, Bookmark } from 'lucide-react';

interface Props {
  data: YouTubeTitleResult;
  onSave?: () => void;
  isSaved?: boolean;
}

export const YouTubeTitleOutput: React.FC<Props> = ({ data, onSave, isSaved }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    if (!data.titles) return;
    const allText = data.titles.map((t, i) => `${i + 1}. ${t.title} (CTR: ${t.ctrScore}/100)`).join('\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (!data.titles || data.titles.length === 0) {
    return <div className="p-4 text-slate-400 text-sm">No titles generated. Try again.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
            5 High-CTR Options
          </span>
          <span className="text-xs text-slate-400">Optimized for YouTube Mobile & Desktop</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700/60"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedAll ? 'Copied All' : 'Copy All'}
          </button>

          {onSave && (
            <button
              onClick={onSave}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                isSaved
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {isSaved ? 'Saved to Library' : 'Save to Library'}
            </button>
          )}
        </div>
      </div>

      {/* Title Cards */}
      <div className="space-y-3">
        {data.titles.map((item, index) => {
          const charLength = item.title.length;
          const isOptimalLength = charLength >= 30 && charLength <= 60;

          return (
            <div
              key={index}
              className="group relative p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/90 transition-all shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-base font-medium text-slate-100 group-hover:text-indigo-200 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    {/* Metadata Tags */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Angle Badge */}
                      <span className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60 font-medium">
                        {item.angle}
                      </span>

                      {/* Thumbnail Pairing Suggestion */}
                      {item.thumbnailText && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                          <ImageIcon className="w-3 h-3 text-purple-400" />
                          Thumbnail: <strong className="text-purple-200">"{item.thumbnailText}"</strong>
                        </span>
                      )}

                      {/* Character Count warning */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono ${
                          isOptimalLength
                            ? 'text-slate-400 bg-slate-800/40'
                            : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                        }`}
                      >
                        {charLength} chars {!isOptimalLength && '(Best: 30-60)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTR Score Pill */}
                <div className="flex flex-col items-end shrink-0 gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>CTR {item.ctrScore}/100</span>
                  </div>

                  <button
                    onClick={() => handleCopy(item.title, index)}
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy Title"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pro Tip Callout */}
      {data.proTip && (
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-start gap-3 text-xs text-indigo-200 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-indigo-300 font-semibold block mb-0.5">YouTube Creator Tip</strong>
            {data.proTip}
          </div>
        </div>
      )}
    </div>
  );
};
