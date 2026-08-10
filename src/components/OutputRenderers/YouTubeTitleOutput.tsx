import React, { useState } from 'react';
import { YouTubeTitleResult, YouTubeTitleItem } from '../../types';
import { Copy, Check, Sparkles, TrendingUp, Lightbulb, Bookmark } from 'lucide-react';

interface Props {
  data: YouTubeTitleResult;
  onUseTitle?: (title: string) => void;
  onRegenerate?: () => void;
}

export const YouTubeTitleOutput: React.FC<Props> = ({ data, onUseTitle, onRegenerate }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const titles = data?.titles || [];

  const getCategoryColor = (type?: string) => {
    switch (type) {
      case 'SEO':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Curiosity':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Professional':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Short':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Emotional':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Tip */}
      {data?.proTip && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3 text-xs leading-relaxed">
          <Lightbulb className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div>
            <span className="font-bold text-amber-400 block mb-0.5">Growth Pro Tip:</span>
            {data.proTip}
          </div>
        </div>
      )}

      {/* Title Cards Grid */}
      <div className="space-y-3">
        {titles.map((item: YouTubeTitleItem, idx: number) => (
          <div
            key={idx}
            className="group p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getCategoryColor(
                    item.categoryType
                  )}`}
                >
                  {item.categoryType || 'Suggested'}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                  Angle: {item.angle}
                </span>
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {item.ctrScore}% CTR Score
                </span>
              </div>

              <h4 className="text-sm md:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {item.title}
              </h4>

              {item.thumbnailText && (
                <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <span className="text-zinc-500">Thumbnail Text overlay:</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-950 font-mono text-amber-300 text-[11px] border border-amber-500/20">
                    "{item.thumbnailText}"
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              {onUseTitle && (
                <button
                  onClick={() => onUseTitle(item.title)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  Use Title
                </button>
              )}
              <button
                onClick={() => handleCopy(item.title, idx)}
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all text-xs flex items-center gap-1"
                title="Copy Title"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
