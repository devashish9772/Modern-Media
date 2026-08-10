import React, { useState } from 'react';
import { ContentHookResult, ContentHookItem } from '../../types';
import { Copy, Check, Zap } from 'lucide-react';

interface Props {
  data: ContentHookResult;
}

export const ContentHookOutput: React.FC<Props> = ({ data }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const hooks = data?.hooks || [];

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Curiosity':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Question':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Story':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Emotional':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Educational':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Unexpected fact':
        return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-4">
      {hooks.map((item: ContentHookItem, idx: number) => (
        <div
          key={idx}
          className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition-all space-y-3"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getCategoryBadge(
                  item.category
                )}`}
              >
                {item.category}
              </span>
              <span className="text-xs text-zinc-400 font-medium">{item.platform}</span>
            </div>

            <button
              onClick={() => handleCopy(item.hookText, idx)}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
            >
              {copiedIndex === idx ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Hook</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <p className="text-sm font-bold text-white leading-snug">"{item.hookText}"</p>

          {item.reason && (
            <p className="text-xs text-amber-400/90 bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/10">
              💡 Why it works: {item.reason}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
