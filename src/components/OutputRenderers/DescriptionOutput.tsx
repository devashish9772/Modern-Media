import React, { useState } from 'react';
import { DescriptionResult } from '../../types';
import { Copy, Check, FileText } from 'lucide-react';

interface Props {
  data: DescriptionResult;
}

export const DescriptionOutput: React.FC<Props> = ({ data }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Short Description */}
      {data.shortDescription && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Short Summary
            </h4>
            <button
              onClick={() => handleCopy(data.shortDescription, 'short')}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
            >
              {copiedKey === 'short' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'short' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">{data.shortDescription}</p>
        </div>
      )}

      {/* SEO Description */}
      {data.seoDescription && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              SEO-Friendly Description
            </h4>
            <button
              onClick={() => handleCopy(data.seoDescription, 'seo')}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
            >
              {copiedKey === 'seo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'seo' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed">{data.seoDescription}</p>
        </div>
      )}

      {/* Long Description */}
      {data.longDescription && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Long Description & Chapter Timestamps
            </h4>
            <button
              onClick={() => handleCopy(data.longDescription, 'long')}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
            >
              {copiedKey === 'long' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'long' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed font-mono">{data.longDescription}</p>
        </div>
      )}

      {/* CTA & Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.callToAction && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Call to Action</h4>
            <p className="text-xs text-zinc-200">{data.callToAction}</p>
          </div>
        )}

        {data.keywords && data.keywords.length > 0 && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">SEO Keywords</h4>
            <div className="flex flex-wrap gap-1.5">
              {data.keywords.map((kw, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 text-[11px] border border-zinc-800">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hashtags */}
      {data.hashtags && data.hashtags.length > 0 && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Hashtags</h4>
            <button
              onClick={() => handleCopy(data.hashtags.join(' '), 'tags')}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
            >
              {copiedKey === 'tags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'tags' ? 'Copied All' : 'Copy All'}
            </button>
          </div>
          <p className="text-xs font-mono text-amber-300">{data.hashtags.join(' ')}</p>
        </div>
      )}
    </div>
  );
};
