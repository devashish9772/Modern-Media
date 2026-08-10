import React, { useState } from 'react';
import { VideoIdeaResult, VideoIdeaItem } from '../../types';
import { Copy, Check, Video, Sparkles, Lightbulb } from 'lucide-react';

interface Props {
  data: VideoIdeaResult;
}

export const VideoIdeaOutput: React.FC<Props> = ({ data }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (item: VideoIdeaItem, idx: number) => {
    const text = `Title: ${item.title}\nHook: ${item.hook}\nConcept: ${item.concept}\nFormat: ${item.format}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const ideas = data?.ideas || [];

  return (
    <div className="space-y-4">
      {ideas.map((item: VideoIdeaItem, idx: number) => (
        <div
          key={idx}
          className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/30 transition-all space-y-3"
        >
          <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Idea #{idx + 1} • {item.format || 'Reels / Shorts'}
              </span>
              <h4 className="text-base font-bold text-white pt-1">{item.title}</h4>
            </div>

            <button
              onClick={() => handleCopy(item, idx)}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors shrink-0 text-xs flex items-center gap-1"
            >
              {copiedIndex === idx ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-amber-500/20 space-y-1">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 3-Second Hook:
            </span>
            <p className="text-xs text-zinc-200 font-medium">"{item.hook}"</p>
          </div>

          <div className="text-xs text-zinc-300 leading-relaxed">
            <span className="font-semibold text-zinc-400 block mb-1">Concept Summary:</span>
            {item.concept}
          </div>
        </div>
      ))}
    </div>
  );
};
