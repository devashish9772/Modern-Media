import React, { useState } from 'react';
import { ThumbnailPromptResult } from '../../types';
import { Copy, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

interface Props {
  data: ThumbnailPromptResult;
}

export const ThumbnailPromptOutput: React.FC<Props> = ({ data }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!data) return null;

  return (
    <div className="space-y-5">
      {/* Main Consolidated Prompt */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Ready-to-Copy Midjourney / DALL-E Prompt
          </span>
          <button
            onClick={() => handleCopy(data.prompt || data.detailInstructions, 'prompt')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-500/30 transition-colors"
          >
            {copiedKey === 'prompt' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied Prompt!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy AI Prompt</span>
              </>
            )}
          </button>
        </div>

        <p className="p-3.5 rounded-xl bg-zinc-950 font-mono text-xs text-amber-200 leading-relaxed border border-zinc-800">
          {data.prompt || data.detailInstructions}
        </p>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {data.subject && (
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="font-bold text-amber-400 block">👤 Main Subject</span>
            <span className="text-zinc-300">{data.subject}</span>
          </div>
        )}
        {data.composition && (
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="font-bold text-amber-400 block">📐 Composition</span>
            <span className="text-zinc-300">{data.composition}</span>
          </div>
        )}
        {data.background && (
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="font-bold text-amber-400 block">🖼️ Background</span>
            <span className="text-zinc-300">{data.background}</span>
          </div>
        )}
        {data.lighting && (
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="font-bold text-amber-400 block">💡 Lighting</span>
            <span className="text-zinc-300">{data.lighting}</span>
          </div>
        )}
        {data.cameraAngle && (
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="font-bold text-amber-400 block">📷 Camera Angle</span>
            <span className="text-zinc-300">{data.cameraAngle}</span>
          </div>
        )}
        {data.colors && (
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="font-bold text-amber-400 block">🎨 Palette</span>
            <span className="text-zinc-300">{data.colors}</span>
          </div>
        )}
        {data.facialExpression && (
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="font-bold text-amber-400 block">😲 Facial Expression</span>
            <span className="text-zinc-300">{data.facialExpression}</span>
          </div>
        )}
        {data.typographyPlacement && (
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="font-bold text-amber-400 block">🔤 Text Placement</span>
            <span className="text-zinc-300">{data.typographyPlacement}</span>
          </div>
        )}
      </div>
    </div>
  );
};
