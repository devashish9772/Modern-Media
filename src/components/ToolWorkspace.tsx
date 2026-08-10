import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ToolMeta, ToolId, SavedItem } from '../types';
import { TOOLS } from '../data/tools';
import { PRESET_IDEAS } from '../data/presets';
import {
  ArrowLeft,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Lightbulb,
  Zap,
} from 'lucide-react';

import { YouTubeTitleOutput } from './OutputRenderers/YouTubeTitleOutput';
import { CaptionOutput } from './OutputRenderers/CaptionOutput';
import { ScriptOutput } from './OutputRenderers/ScriptOutput';
import { ViralHooksOutput } from './OutputRenderers/ViralHooksOutput';
import { HashtagOutput } from './OutputRenderers/HashtagOutput';
import { RepurposerOutput } from './OutputRenderers/RepurposerOutput';

interface Props {
  toolId: ToolId;
  onBack: () => void;
  onSaveItem: (item: SavedItem) => void;
  savedItemIds: string[];
  initialInputs?: Record<string, any>;
}

export const ToolWorkspace: React.FC<Props> = ({
  toolId,
  onBack,
  onSaveItem,
  savedItemIds,
  initialInputs,
}) => {
  const toolMeta = TOOLS.find(t => t.id === toolId) || TOOLS[0];

  // Input states
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    if (initialInputs) return initialInputs;
    if (toolId === 'youtube_title') {
      return {
        topic: 'I tested 5 AI coding tools for 30 days to see which one builds real fullstack web apps best.',
        niche: 'Tech & Programming',
        tone: 'Curiosity Gap',
        audience: 'Software Engineers & Creators',
      };
    } else if (toolId === 'caption_generator') {
      return {
        topic: '10 minimal aesthetic desk setup essentials for productivity and deep focus',
        platform: 'Instagram',
        tone: 'Casual & Inspiring',
        cta: 'Save this post for setup inspiration!',
        context: 'Ergonomic lighting, mechanical keyboard, cable management box',
      };
    } else if (toolId === 'script_outline') {
      return {
        topic: 'How to build and launch a SaaS app in 2026',
        format: 'YouTube (10-15 min)',
        audience: 'Intermediate Developers & Indie Hackers',
        goal: 'Actionable Step-by-Step Guide',
      };
    } else if (toolId === 'viral_hooks') {
      return {
        topic: 'The secret AI workflow that doubled my video creation output',
        value: 'Save 10 hours a week on content editing and scripting',
      };
    } else if (toolId === 'hashtag_generator') {
      return {
        topic: 'Calisthenics full body workout routine at home without equipment',
        platform: 'Instagram & TikTok',
      };
    } else if (toolId === 'content_repurposer') {
      return {
        sourceText:
          'Building a successful software product in 2026 isn\'t about adding 50 features. It\'s about solving 1 painful problem for 100 dedicated users who love your product. Focus on speed, clean UI, and listening directly to customer feedback.',
      };
    }
    return {};
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<any | null>(null);
  const [saved, setSaved] = useState(false);

  // Sync inputs if initialInputs change
  useEffect(() => {
    if (initialInputs) {
      setInputs(initialInputs);
    }
  }, [initialInputs]);

  const handleInputChange = (key: string, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      // 1. Try Express backend endpoint
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: toolId,
          inputs,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setOutput(json.data);
          return;
        }
      }

      // 2. If server API returned error or 404 (e.g. GitHub Pages static deployment), fallback to client-side
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          'Static deployment detected (e.g. GitHub Pages). To run AI generation on static hosts, set VITE_GEMINI_API_KEY in your environment variables.'
        );
      }

      const ai = new GoogleGenAI({ apiKey });
      let prompt = `Generate JSON response for tool ${toolId} with inputs: ${JSON.stringify(inputs)}`;
      
      const clientRes = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(clientRes.text || '{}');
      setOutput(parsed);
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI content.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!output) return;
    const newItem: SavedItem = {
      id: Date.now().toString(),
      toolId,
      toolTitle: toolMeta.title,
      inputs,
      output,
      createdAt: new Date().toLocaleDateString(),
    };
    onSaveItem(newItem);
    setSaved(true);
  };

  const handleApplyPreset = (presetInputs: Record<string, any>) => {
    setInputs(presetInputs);
  };

  const relevantPresets = PRESET_IDEAS.filter(p => p.toolId === toolId);

  return (
    <div className="space-y-8 pb-16">
      {/* Workspace Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {toolMeta.category}
          </span>
        </div>
      </div>

      {/* Main Workspace Layout (Form Left/Top + Output Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form & Controls */}
        <div className="lg:col-span-5 space-y-6 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              {toolMeta.title}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {toolMeta.description}
            </p>
          </div>

          {/* Quick Presets Bar */}
          {relevantPresets.length > 0 && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
              <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" />
                Quick Preset Prompts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {relevantPresets.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.inputs)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-[11px] text-slate-300 hover:text-white transition-colors"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Tool Form Fields */}
          <div className="space-y-4 text-xs">
            {toolId === 'youtube_title' && (
              <>
                <div className="space-y-1.5">
                  <label className="font-medium text-slate-300 block">
                    Video Topic or Core Idea *
                  </label>
                  <textarea
                    rows={3}
                    value={inputs.topic || ''}
                    onChange={e => handleInputChange('topic', e.target.value)}
                    placeholder="Describe your video subject..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-medium text-slate-300 block">
                      Niche
                    </label>
                    <select
                      value={inputs.niche || 'Tech & Programming'}
                      onChange={e => handleInputChange('niche', e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option>Tech & Programming</option>
                      <option>Gaming & Esports</option>
                      <option>Personal Finance</option>
                      <option>Fitness & Health</option>
                      <option>Education & Science</option>
                      <option>Lifestyle & Vlogs</option>
                      <option>Business & Marketing</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-slate-300 block">
                      Desired Tone
                    </label>
                    <select
                      value={inputs.tone || 'Curiosity Gap'}
                      onChange={e => handleInputChange('tone', e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option>High CTR / Viral</option>
                      <option>Curiosity Gap</option>
                      <option>How-To / Educational</option>
                      <option>Direct & Clean</option>
                      <option>Storytelling</option>
                      <option>Controversial</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-slate-300 block">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={inputs.audience || ''}
                    onChange={e => handleInputChange('audience', e.target.value)}
                    placeholder="e.g. Software Engineers, Creators, Beginners"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            {toolId === 'caption_generator' && (
              <>
                <div className="space-y-1.5">
                  <label className="font-medium text-slate-300 block">
                    Content Topic / Photo Concept *
                  </label>
                  <textarea
                    rows={3}
                    value={inputs.topic || ''}
                    onChange={e => handleInputChange('topic', e.target.value)}
                    placeholder="What is this post about?"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-medium text-slate-300 block">
                      Target Platform
                    </label>
                    <select
                      value={inputs.platform || 'Instagram'}
                      onChange={e => handleInputChange('platform', e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option>Instagram</option>
                      <option>TikTok</option>
                      <option>LinkedIn</option>
                      <option>Twitter/X</option>
                      <option>YouTube Shorts</option>
                      <option>Threads</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-slate-300 block">
                      Tone of Voice
                    </label>
                    <select
                      value={inputs.tone || 'Casual & Inspiring'}
                      onChange={e => handleInputChange('tone', e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option>Casual & Inspiring</option>
                      <option>Professional</option>
                      <option>Punchy & Direct</option>
                      <option>Humorous</option>
                      <option>Controversial</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-slate-300 block">
                    Call To Action (CTA)
                  </label>
                  <input
                    type="text"
                    value={inputs.cta || ''}
                    onChange={e => handleInputChange('cta', e.target.value)}
                    placeholder="e.g. Save for later, Drop a comment, Link in bio"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-slate-300 block">
                    Extra Context / Details (Optional)
                  </label>
                  <input
                    type="text"
                    value={inputs.context || ''}
                    onChange={e => handleInputChange('context', e.target.value)}
                    placeholder="Specific items, features or steps mentioned..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            {toolId === 'script_outline' && (
              <>
                <div className="space-y-1.5">
                  <label className="font-medium text-slate-300 block">
                    Video Topic / Title *
                  </label>
                  <textarea
                    rows={3}
                    value={inputs.topic || ''}
                    onChange={e => handleInputChange('topic', e.target.value)}
                    placeholder="What is your video about?"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-medium text-slate-300 block">
                      Video Format / Length
                    </label>
                    <select
                      value={inputs.format || 'YouTube (10-15 min)'}
                      onChange={e => handleInputChange('format', e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option>YouTube (10-15 min)</option>
                      <option>Shorts / Reel (60s)</option>
                      <option>TikTok (30s)</option>
                      <option>Deep Dive Essay (15-20 min)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-slate-300 block">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={inputs.audience || ''}
                      onChange={e => handleInputChange('audience', e.target.value)}
                      placeholder="e.g. Beginners, Developers"
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </>
            )}

            {toolId === 'viral_hooks' && (
              <>
                <div className="space-y-1.5">
                  <label className="font-medium text-slate-300 block">
                    Video Concept / Topic *
                  </label>
                  <textarea
                    rows={3}
                    value={inputs.topic || ''}
                    onChange={e => handleInputChange('topic', e.target.value)}
                    placeholder="Describe what your short video shows or teaches..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-slate-300 block">
                    Main Takeaway / Viewer Outcome
                  </label>
                  <input
                    type="text"
                    value={inputs.value || ''}
                    onChange={e => handleInputChange('value', e.target.value)}
                    placeholder="e.g. Save 10 hours a week, learn 1 hidden hack"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </>
            )}

            {toolId === 'hashtag_generator' && (
              <>
                <div className="space-y-1.5">
                  <label className="font-medium text-slate-300 block">
                    Topic or Niche *
                  </label>
                  <input
                    type="text"
                    value={inputs.topic || ''}
                    onChange={e => handleInputChange('topic', e.target.value)}
                    placeholder="e.g. Calisthenics workout, AI web development"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-slate-300 block">
                    Target Platform
                  </label>
                  <select
                    value={inputs.platform || 'Instagram & TikTok'}
                    onChange={e => handleInputChange('platform', e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option>Instagram & TikTok</option>
                    <option>YouTube & YouTube Shorts</option>
                    <option>LinkedIn</option>
                    <option>Twitter/X</option>
                  </select>
                </div>
              </>
            )}

            {toolId === 'content_repurposer' && (
              <div className="space-y-1.5">
                <label className="font-medium text-slate-300 block">
                  Source Content / Article / Transcript *
                </label>
                <textarea
                  rows={6}
                  value={inputs.sourceText || ''}
                  onChange={e => handleInputChange('sourceText', e.target.value)}
                  placeholder="Paste your core post, transcript, or article here..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 border border-indigo-500/50 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating with Gemini AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                Generate Content
              </>
            )}
          </button>
        </div>

        {/* Right Column: Output Workspace */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl min-h-[420px] flex flex-col justify-between">
          {loading ? (
            /* Loading Skeleton */
            <div className="space-y-6 animate-pulse my-auto py-12">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg" />
                <div className="h-4 bg-slate-800 rounded w-48" />
              </div>
              <div className="space-y-3">
                <div className="h-16 bg-slate-800/80 rounded-xl" />
                <div className="h-16 bg-slate-800/80 rounded-xl" />
                <div className="h-16 bg-slate-800/80 rounded-xl" />
              </div>
              <p className="text-center text-xs text-slate-400">
                Analyzing content patterns & building strategic output...
              </p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="p-6 rounded-xl bg-red-950/30 border border-red-500/30 my-auto text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
              <h3 className="font-semibold text-red-300 text-sm">
                Generation Encountered an Issue
              </h3>
              <p className="text-xs text-red-400/90 max-w-md mx-auto">
                {error}
              </p>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-red-800/40 hover:bg-red-800/60 text-red-200 rounded-lg text-xs font-semibold border border-red-700/50 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : output ? (
            /* Render Specific Tool Output */
            <div className="space-y-4">
              {toolId === 'youtube_title' && (
                <YouTubeTitleOutput
                  data={output}
                  onSave={handleSave}
                  isSaved={saved}
                />
              )}
              {toolId === 'caption_generator' && (
                <CaptionOutput
                  data={output}
                  onSave={handleSave}
                  isSaved={saved}
                />
              )}
              {toolId === 'script_outline' && (
                <ScriptOutput
                  data={output}
                  onSave={handleSave}
                  isSaved={saved}
                />
              )}
              {toolId === 'viral_hooks' && (
                <ViralHooksOutput
                  data={output}
                  onSave={handleSave}
                  isSaved={saved}
                />
              )}
              {toolId === 'hashtag_generator' && (
                <HashtagOutput
                  data={output}
                  onSave={handleSave}
                  isSaved={saved}
                />
              )}
              {toolId === 'content_repurposer' && (
                <RepurposerOutput
                  data={output}
                  onSave={handleSave}
                  isSaved={saved}
                />
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="my-auto py-16 text-center space-y-3">
              <div className="p-4 bg-slate-800/50 rounded-2xl w-fit mx-auto border border-slate-700/50 text-indigo-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-slate-200 font-semibold text-base">
                Ready to Generate Content
              </h3>
              <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
                Fill in your topic or select a preset idea on the left, then click{' '}
                <strong className="text-indigo-300">Generate Content</strong> to create tailored AI outputs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
