import React, { useState } from 'react';
import { CaptionResult } from '../../types';
import { Copy, Check, MessageSquare, Hash, Bookmark, Sparkles, Clock } from 'lucide-react';

interface Props {
  data: CaptionResult;
  onSave?: () => void;
  isSaved?: boolean;
}

export const CaptionOutput: React.FC<Props> = ({ data, onSave, isSaved }) => {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(data.fullCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyHashtags = () => {
    if (!data.hashtags) return;
    navigator.clipboard.writeText(data.hashtags.join(' '));
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
            Caption Ready
          </span>
          {data.engagementScore && (
            <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {data.engagementScore}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCaption}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors border border-indigo-500"
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCaption ? 'Caption Copied!' : 'Copy Caption'}
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

      {/* Main Hook Highlight Box */}
      {data.hook && (
        <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-sm font-medium leading-relaxed">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide block mb-1">
            ⚡ First-Line Hook
          </span>
          "{data.hook}"
        </div>
      )}

      {/* Main Caption Body Box */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-2">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            Formatted Social Caption
          </span>
          <span>{data.fullCaption.length} characters</span>
        </div>

        <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans selection:bg-indigo-500">
          {data.fullCaption}
        </div>
      </div>

      {/* Hashtags Section */}
      {data.hashtags && data.hashtags.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-400" />
              Suggested Hashtags ({data.hashtags.length})
            </span>
            <button
              onClick={handleCopyHashtags}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              {copiedHashtags ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedHashtags ? 'Copied Tags' : 'Copy Hashtags Only'}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {data.hashtags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-slate-800 text-indigo-300 text-xs font-mono border border-slate-700/60 hover:border-indigo-500/40 transition-colors"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Timing Advice */}
      {data.bestTimeToPostAdvice && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400">
          <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
          <span><strong>Posting Strategy:</strong> {data.bestTimeToPostAdvice}</span>
        </div>
      )}
    </div>
  );
};
