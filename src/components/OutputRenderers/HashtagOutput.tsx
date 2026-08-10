import React, { useState } from 'react';
import { HashtagResult } from '../../types';
import { Copy, Check, Hash, Search, Bookmark, Layers } from 'lucide-react';

interface Props {
  data: HashtagResult;
  onSave?: () => void;
  isSaved?: boolean;
}

export const HashtagOutput: React.FC<Props> = ({ data, onSave, isSaved }) => {
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);

  const handleCopy = (tags: string[], groupName: string) => {
    const text = tags.map(t => (t.startsWith('#') ? t : `#${t}`)).join(' ');
    navigator.clipboard.writeText(text);
    setCopiedGroup(groupName);
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  const handleCopyKeywords = () => {
    if (!data.seoKeywords) return;
    navigator.clipboard.writeText(data.seoKeywords.join(', '));
    setCopiedGroup('keywords');
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  const handleCopyAllCombined = () => {
    const all = data.copyAllHashtagsString || 
      [...(data.massiveReach || []), ...(data.targetedNiche || []), ...(data.lowCompetition || [])].join(' ');
    navigator.clipboard.writeText(all);
    setCopiedGroup('all_combined');
    setTimeout(() => setCopiedGroup(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5" />
            SEO & Hashtag Strategy
          </span>
          <span className="text-xs text-slate-400">Algorithmic Category Split</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAllCombined}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors border border-indigo-500"
          >
            {copiedGroup === 'all_combined' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedGroup === 'all_combined' ? 'Copied 15 Hashtags!' : 'Copy All 15 Hashtags'}
          </button>

          {onSave && (
            <button
              onClick={onSave}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                isSaved
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {isSaved ? 'Saved' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {/* Massive Reach */}
      {data.massiveReach && data.massiveReach.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Layers className="w-3.5 h-3.5" />
              </span>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Massive Reach Tags (1M+ Posts)</h4>
                <p className="text-[11px] text-slate-400">Broad exposure & category index</p>
              </div>
            </div>
            <button
              onClick={() => handleCopy(data.massiveReach, 'massive')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              {copiedGroup === 'massive' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedGroup === 'massive' ? 'Copied Set' : 'Copy Set'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.massiveReach.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-slate-800 text-purple-300 text-xs font-mono border border-purple-500/20">
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Targeted Niche */}
      {data.targetedNiche && data.targetedNiche.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Hash className="w-3.5 h-3.5" />
              </span>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Targeted Niche Tags (50k - 500k Posts)</h4>
                <p className="text-[11px] text-slate-400">High engagement from core community</p>
              </div>
            </div>
            <button
              onClick={() => handleCopy(data.targetedNiche, 'niche')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              {copiedGroup === 'niche' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedGroup === 'niche' ? 'Copied Set' : 'Copy Set'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.targetedNiche.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-slate-800 text-indigo-300 text-xs font-mono border border-indigo-500/20">
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Low Competition */}
      {data.lowCompetition && data.lowCompetition.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Search className="w-3.5 h-3.5" />
              </span>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">High-Conversion Low Competition (&lt;50k Posts)</h4>
                <p className="text-[11px] text-slate-400">Easy to rank in Top Posts tab</p>
              </div>
            </div>
            <button
              onClick={() => handleCopy(data.lowCompetition, 'low')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              {copiedGroup === 'low' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedGroup === 'low' ? 'Copied Set' : 'Copy Set'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.lowCompetition.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-slate-800 text-emerald-300 text-xs font-mono border border-emerald-500/20">
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SEO Keywords */}
      {data.seoKeywords && data.seoKeywords.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              Top 10 Search Keywords (Include in Audio/Text)
            </h4>
            <button
              onClick={handleCopyKeywords}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              {copiedGroup === 'keywords' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedGroup === 'keywords' ? 'Copied Keywords' : 'Copy Keywords'}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {data.seoKeywords.map((kw, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 text-xs border border-slate-700/60">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
