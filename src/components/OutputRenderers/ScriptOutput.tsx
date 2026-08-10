import React, { useState } from 'react';
import { ScriptResult } from '../../types';
import { Copy, Check, Clapperboard, RefreshCw } from 'lucide-react';

interface Props {
  data: ScriptResult;
  onRegenerate?: () => void;
}

export const ScriptOutput: React.FC<Props> = ({ data, onRegenerate }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const getFullScript = () => {
    return `TITLE: ${data.title || 'Video Script'}
FORMAT: ${data.platform || 'Video'} (${data.duration || '5 mins'})

--- HOOK ---
${data.hook}

--- INTRODUCTION ---
${data.introduction}

--- MAIN CONTENT ---
${data.mainContent}

--- ENDING ---
${data.ending}

--- CALL TO ACTION ---
${data.callToAction}`;
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(getFullScript());
    setCopiedKey('all');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Script Header Bar */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{data.title || 'Structured Video Script'}</h3>
            <p className="text-xs text-zinc-400">
              Format: {data.platform || 'YouTube'} • Duration: {data.duration || '5 mins'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          )}
          <button
            onClick={handleCopyAll}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-amber-500/10"
          >
            {copiedKey === 'all' ? (
              <>
                <Check className="w-4 h-4 text-zinc-950" />
                <span>Copied Full Script!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Full Script</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sections Breakdown */}
      <div className="space-y-4">
        {/* HOOK */}
        {data.hook && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-amber-500/30 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              1. HOOK (First 0:00 - 0:05)
            </span>
            <p className="text-xs text-zinc-100 whitespace-pre-wrap leading-relaxed font-sans">{data.hook}</p>
          </div>
        )}

        {/* INTRODUCTION */}
        {data.introduction && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider block">
              2. INTRODUCTION
            </span>
            <p className="text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">{data.introduction}</p>
          </div>
        )}

        {/* MAIN CONTENT */}
        {data.mainContent && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              3. MAIN CONTENT
            </span>
            <p className="text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">{data.mainContent}</p>
          </div>
        )}

        {/* ENDING */}
        {data.ending && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
              4. ENDING / CONCLUSION
            </span>
            <p className="text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">{data.ending}</p>
          </div>
        )}

        {/* CTA */}
        {data.callToAction && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
              5. CALL TO ACTION (CTA)
            </span>
            <p className="text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed font-sans">{data.callToAction}</p>
          </div>
        )}
      </div>
    </div>
  );
};
