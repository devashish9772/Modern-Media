import React, { useState } from 'react';
import { ViralHooksResult } from '../../types';
import { Copy, Check, Sparkles, Video, Bookmark, Zap } from 'lucide-react';

interface Props {
  data: ViralHooksResult;
  onSave?: () => void;
  isSaved?: boolean;
}

export const ViralHooksOutput: React.FC<Props> = ({ data, onSave, isSaved }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleCopyAll = () => {
    if (!data.hooks) return;
    const allHooks = data.hooks
      .map((h, i) => `${i + 1}. [${h.angleName}] Verbal: "${h.verbalHook}" | Visual: ${h.visualAction}`)
      .join('\n\n');
    navigator.clipboard.writeText(allHooks);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (!data.hooks || data.hooks.length === 0) {
    return <div className="p-4 text-slate-400 text-sm">No viral hooks generated. Try again.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            5 High-Retention Hooks
          </span>
          <span className="text-xs text-slate-400">First 0-3 Seconds Blueprint</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedAll ? 'Copied All' : 'Copy All Hooks'}
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
              {isSaved ? 'Saved' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {/* Hook Cards */}
      <div className="space-y-4">
        {data.hooks.map((item, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-all space-y-3.5 relative group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold flex items-center justify-center">
                  #{index + 1}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                  {item.angleName}
                </span>
              </div>

              <button
                onClick={() => handleCopy(item.verbalHook, index)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              >
                {copiedIdx === index ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIdx === index ? 'Copied' : 'Copy Hook'}
              </button>
            </div>

            {/* Verbal Hook */}
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                🗣️ What To Say (Verbal Line)
              </span>
              <p className="text-base font-medium text-slate-100 leading-snug">
                "{item.verbalHook}"
              </p>
            </div>

            {/* Visual Action & Text Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              {item.visualAction && (
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-start gap-2 text-xs text-indigo-200">
                  <Video className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-indigo-300 font-medium block">Visual Cue:</strong>
                    {item.visualAction}
                  </div>
                </div>
              )}

              {item.textOverlay && (
                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-start gap-2 text-xs text-purple-200">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-purple-300 font-medium block">On-Screen Text:</strong>
                    "{item.textOverlay}"
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
