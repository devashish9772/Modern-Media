import React, { useState } from 'react';
import { RepurposerResult } from '../../types';
import { Copy, Check, Repeat, Twitter, Linkedin, Instagram, Video, Bookmark } from 'lucide-react';

interface Props {
  data: RepurposerResult;
  onSave?: () => void;
  isSaved?: boolean;
}

export const RepurposerOutput: React.FC<Props> = ({ data, onSave, isSaved }) => {
  const [activeSubTab, setActiveSubTab] = useState<'twitter' | 'linkedin' | 'carousel' | 'video'>('twitter');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const handleCopyCurrent = () => {
    let textToCopy = '';
    if (activeSubTab === 'twitter') {
      textToCopy = (data.twitterThread || []).map((t, idx) => `[${idx + 1}/${data.twitterThread.length}]\n${t}`).join('\n\n---\n\n');
    } else if (activeSubTab === 'linkedin') {
      textToCopy = data.linkedInPost || '';
    } else if (activeSubTab === 'carousel') {
      textToCopy = (data.instagramCarousel || [])
        .map(s => `SLIDE ${s.slideNumber}: ${s.title}\n${s.content}`)
        .join('\n\n');
    } else if (activeSubTab === 'video') {
      textToCopy = data.shortVideoScript || '';
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedTab(activeSubTab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20 flex items-center gap-1">
            <Repeat className="w-3.5 h-3.5" />
            4 Repurposed Formats
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCurrent}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors border border-indigo-500"
          >
            {copiedTab === activeSubTab ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedTab === activeSubTab ? 'Copied View' : 'Copy Active Format'}
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

      {/* Format Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveSubTab('twitter')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeSubTab === 'twitter'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Twitter className="w-3.5 h-3.5" />
          Twitter/X Thread
        </button>

        <button
          onClick={() => setActiveSubTab('linkedin')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeSubTab === 'linkedin'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Linkedin className="w-3.5 h-3.5" />
          LinkedIn Post
        </button>

        <button
          onClick={() => setActiveSubTab('carousel')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeSubTab === 'carousel'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Instagram className="w-3.5 h-3.5" />
          IG Carousel
        </button>

        <button
          onClick={() => setActiveSubTab('video')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
            activeSubTab === 'video'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          Reels/Short Script
        </button>
      </div>

      {/* Tab Content Display */}
      {activeSubTab === 'twitter' && (
        <div className="space-y-3">
          {(data.twitterThread || []).map((tweet, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-indigo-400">Tweet {idx + 1} / {data.twitterThread.length}</span>
                <span>{tweet.length}/280</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{tweet}</p>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'linkedin' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">LinkedIn Thought Leadership Post</div>
          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{data.linkedInPost}</div>
        </div>
      )}

      {activeSubTab === 'carousel' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(data.instagramCarousel || []).map((slide, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-400">SLIDE #{slide.slideNumber || idx + 1}</span>
                <span className="text-slate-400">{idx === 0 ? 'Hook Slide' : idx === (data.instagramCarousel.length - 1) ? 'CTA Slide' : 'Value Slide'}</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100">{slide.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{slide.content}</p>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'video' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">30-40 Second Video Script</div>
          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{data.shortVideoScript}</div>
        </div>
      )}
    </div>
  );
};
