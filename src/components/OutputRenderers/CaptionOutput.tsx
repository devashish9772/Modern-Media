import React, { useState } from 'react';
import { CaptionResult, CaptionItem } from '../../types';
import { Copy, Check, MessageSquare } from 'lucide-react';

interface Props {
  data: CaptionResult;
}

export const CaptionOutput: React.FC<Props> = ({ data }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const captions = data?.captions || [];

  return (
    <div className="space-y-4">
      {captions.map((item: CaptionItem, idx: number) => (
        <div
          key={idx}
          className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {item.platform || 'Social Caption'}
            </span>
            <button
              onClick={() => handleCopy(item.text || `${item.hook}\n\n${item.text}`, idx)}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedIndex === idx ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Caption</span>
                </>
              )}
            </button>
          </div>

          {item.hook && (
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-amber-500/20 text-xs font-semibold text-amber-300">
              ⚡ Hook: {item.hook}
            </div>
          )}

          <p className="text-xs md:text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">
            {item.text}
          </p>

          {item.cta && (
            <div className="text-xs text-amber-400 font-semibold pt-1">
              📣 CTA: {item.cta}
            </div>
          )}

          {item.hashtags && item.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-zinc-800/60">
              {item.hashtags.map((tag, tIdx) => (
                <span key={tIdx} className="text-[11px] text-zinc-400 font-mono">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
