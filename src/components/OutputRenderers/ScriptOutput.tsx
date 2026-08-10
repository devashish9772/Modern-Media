import React, { useState } from 'react';
import { ScriptResult } from '../../types';
import { Copy, Check, Clapperboard, Clock, Bookmark, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  data: ScriptResult;
  onSave?: () => void;
  isSaved?: boolean;
}

export const ScriptOutput: React.FC<Props> = ({ data, onSave, isSaved }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.markdownScript || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20 flex items-center gap-1.5">
            <Clapperboard className="w-3.5 h-3.5" />
            Script Outline
          </span>
          {data.estimatedDuration && (
            <span className="text-xs text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700/80 flex items-center gap-1">
              <Clock className="w-3 h-3 text-indigo-400" />
              {data.estimatedDuration}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors border border-indigo-500"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Script' : 'Copy Script'}
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

      {/* Key Takeaways */}
      {data.keyTakeaways && data.keyTakeaways.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Key Narrative Goals</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {data.keyTakeaways.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-800/60 p-2 rounded-lg border border-slate-700/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Script Markdown View */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-strong:text-indigo-300 prose-strong:font-semibold text-sm leading-relaxed">
        <ReactMarkdown>{data.markdownScript || ''}</ReactMarkdown>
      </div>
    </div>
  );
};
