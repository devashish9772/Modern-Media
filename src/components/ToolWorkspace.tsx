import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ToolMeta, ToolId, SavedItem } from '../types';
import { TOOLS } from '../data/tools';
import { PRESET_IDEAS } from '../data/presets';
import {
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Bookmark,
  AlertCircle,
  Lightbulb,
  Globe,
  Trash2,
} from 'lucide-react';

import { YouTubeTitleOutput } from './OutputRenderers/YouTubeTitleOutput';
import { CaptionOutput } from './OutputRenderers/CaptionOutput';
import { DescriptionOutput } from './OutputRenderers/DescriptionOutput';
import { HashtagOutput } from './OutputRenderers/HashtagOutput';
import { VideoIdeaOutput } from './OutputRenderers/VideoIdeaOutput';
import { ScriptOutput } from './OutputRenderers/ScriptOutput';
import { ThumbnailPromptOutput } from './OutputRenderers/ThumbnailPromptOutput';
import { SEOKeywordOutput } from './OutputRenderers/SEOKeywordOutput';
import { ContentHookOutput } from './OutputRenderers/ContentHookOutput';
import { ContentImproverOutput } from './OutputRenderers/ContentImproverOutput';

interface ToolWorkspaceProps {
  toolId: ToolId;
  onBack: () => void;
  onSaveItem: (item: SavedItem) => void;
  savedItemIds: string[];
  initialInputs?: Record<string, any>;
}

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Hindi',
  'Portuguese',
  'Japanese',
  'Korean',
  'Arabic',
  'Italian',
  'Russian',
  'Chinese',
  'Dutch',
  'Turkish',
];

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({
  toolId,
  onBack,
  onSaveItem,
  savedItemIds,
  initialInputs,
}) => {
  const meta: ToolMeta = TOOLS.find(t => t.id === toolId) || {
    id: toolId,
    title: 'AI Content Generator',
    shortDesc: 'Generate AI content',
    description: 'AI content generator',
    category: 'YouTube & Video',
    iconName: 'Sparkles',
    estimatedTime: '~2s',
  };

  // Default Inputs State
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    if (initialInputs) return initialInputs;
    return {
      language: 'English',
      platform: 'YouTube',
      tone: 'Engaging & Professional',
      category: 'General',
      audience: 'General Viewers',
      count: 5,
      style: 'YouTube',
      duration: '5 minutes',
      option: 'Make it more engaging, concise & professional',
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialInputs) {
      setInputs(prev => ({ ...prev, ...initialInputs }));
    }
  }, [initialInputs]);

  const handleInputChange = (key: string, val: any) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
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
        } else if (json.error) {
          throw new Error(json.error);
        }
      }

      // 2. Client-side fallback if static host or direct API key
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          'AI usage limit reached. Please try again later or configure another supported API/model.'
        );
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Generate JSON output for tool ${toolId} in ${inputs.language || 'English'} with inputs: ${JSON.stringify(
        inputs
      )}`;

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
      console.error('Generation Error:', err);
      const msg = err.message || 'AI usage limit reached. Please try again later or configure another supported API/model.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setOutput(null);
    setError(null);
  };

  const handleSaveToLibrary = () => {
    if (!output) return;
    const item: SavedItem = {
      id: Date.now().toString(),
      toolId,
      toolTitle: meta.title,
      inputs,
      output,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    onSaveItem(item);
    setSaved(true);
  };

  const renderFormInputs = () => {
    return (
      <div className="space-y-4">
        {/* Language Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Output Language
          </label>
          <select
            value={inputs.language || 'English'}
            onChange={e => handleInputChange('language', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
          >
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Tool-specific form fields */}
        {toolId === 'youtube_title' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Video Topic / Concept *</label>
              <input
                type="text"
                value={inputs.topic || ''}
                onChange={e => handleInputChange('topic', e.target.value)}
                placeholder="e.g. How to learn coding in 6 months at age 30"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Keywords (Comma separated)</label>
              <input
                type="text"
                value={inputs.keywords || ''}
                onChange={e => handleInputChange('keywords', e.target.value)}
                placeholder="e.g. coding, software engineer, learn programming"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200">Category</label>
                <select
                  value={inputs.category || 'Tech & Education'}
                  onChange={e => handleInputChange('category', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Tech & Education">Tech & Education</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Vlog & Lifestyle">Vlog & Lifestyle</option>
                  <option value="Business & Finance">Business & Finance</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Fitness & Health">Fitness & Health</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200">Tone</label>
                <select
                  value={inputs.tone || 'High CTR'}
                  onChange={e => handleInputChange('tone', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="High CTR">High CTR / Click-worthy</option>
                  <option value="Curious">Curiosity Gap</option>
                  <option value="Authoritative">Authoritative / Professional</option>
                  <option value="Emotional">Emotional & Inspiring</option>
                  <option value="Dramatic">Dramatic / Controversial</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Target Audience</label>
              <input
                type="text"
                value={inputs.audience || ''}
                onChange={e => handleInputChange('audience', e.target.value)}
                placeholder="e.g. Beginners, Career changers, Tech enthusiasts"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </>
        )}

        {toolId === 'caption_generator' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Topic or Concept *</label>
              <textarea
                rows={3}
                value={inputs.topic || ''}
                onChange={e => handleInputChange('topic', e.target.value)}
                placeholder="e.g. 5 essential morning habits for productivity"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200">Platform Focus</label>
                <select
                  value={inputs.platform || 'Instagram'}
                  onChange={e => handleInputChange('platform', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Shorts">YouTube Shorts</option>
                  <option value="Reels">Instagram Reels</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200">Tone</label>
                <select
                  value={inputs.tone || 'Engaging'}
                  onChange={e => handleInputChange('tone', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Engaging">Engaging & Authentic</option>
                  <option value="Inspirational">Inspirational</option>
                  <option value="Humorous">Humorous & Witty</option>
                  <option value="Educational">Educational</option>
                  <option value="Sales Driven">Sales / Promotion</option>
                </select>
              </div>
            </div>
          </>
        )}

        {toolId === 'description_generator' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Video Topic / Content Summary *</label>
              <textarea
                rows={3}
                value={inputs.topic || ''}
                onChange={e => handleInputChange('topic', e.target.value)}
                placeholder="e.g. Complete tutorial on building full-stack Web Apps with React & Node"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Target Keywords</label>
              <input
                type="text"
                value={inputs.keywords || ''}
                onChange={e => handleInputChange('keywords', e.target.value)}
                placeholder="e.g. react tutorial, node.js, full stack app"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200">Platform</label>
                <select
                  value={inputs.platform || 'YouTube'}
                  onChange={e => handleInputChange('platform', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="YouTube">YouTube Main Video</option>
                  <option value="Shorts">YouTube Shorts</option>
                  <option value="Facebook">Facebook Video</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200">Tone</label>
                <input
                  type="text"
                  value={inputs.tone || 'Informative & Professional'}
                  onChange={e => handleInputChange('tone', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </>
        )}

        {toolId === 'hashtag_generator' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Topic or Niche *</label>
              <input
                type="text"
                value={inputs.topic || ''}
                onChange={e => handleInputChange('topic', e.target.value)}
                placeholder="e.g. Calisthenics street workout beginner tips"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Target Platform</label>
              <select
                value={inputs.platform || 'Instagram / TikTok'}
                onChange={e => handleInputChange('platform', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Instagram / TikTok">Instagram & TikTok</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="Facebook">Facebook</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>
          </>
        )}

        {toolId === 'video_idea_generator' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Topic or Niche *</label>
              <input
                type="text"
                value={inputs.topic || ''}
                onChange={e => handleInputChange('topic', e.target.value)}
                placeholder="e.g. AI tools, Personal Finance, Travel Vlogging"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200">Platform</label>
                <select
                  value={inputs.platform || 'YouTube / Reels / Shorts'}
                  onChange={e => handleInputChange('platform', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="YouTube Main">YouTube Longform</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200">Number of Ideas</label>
                <select
                  value={inputs.count || 5}
                  onChange={e => handleInputChange('count', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value={3}>3 Ideas</option>
                  <option value={5}>5 Ideas</option>
                  <option value={10}>10 Ideas</option>
                </select>
              </div>
            </div>
          </>
        )}

        {toolId === 'script_generator' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Script Style / Format *</label>
              <select
                value={inputs.style || 'YouTube'}
                onChange={e => handleInputChange('style', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              >
                <option value="YouTube">YouTube Main Video</option>
                <option value="Shorts">YouTube Shorts (60s)</option>
                <option value="Reels">Instagram Reels (30-60s)</option>
                <option value="Documentary">Mini Documentary</option>
                <option value="Educational">Educational Tutorial</option>
                <option value="Storytelling">Personal Storytelling</option>
                <option value="Review">Product / Tech Review</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Topic / Core Subject *</label>
              <textarea
                rows={2}
                value={inputs.topic || ''}
                onChange={e => handleInputChange('topic', e.target.value)}
                placeholder="e.g. The hidden truth behind why smartphones slow down after 2 years"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200">Duration</label>
                <input
                  type="text"
                  value={inputs.duration || '5 minutes'}
                  onChange={e => handleInputChange('duration', e.target.value)}
                  placeholder="e.g. 60 seconds / 8 minutes"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200">Tone</label>
                <input
                  type="text"
                  value={inputs.tone || 'Engaging & Dramatic'}
                  onChange={e => handleInputChange('tone', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </>
        )}

        {toolId === 'thumbnail_prompt' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Video Topic *</label>
              <input
                type="text"
                value={inputs.topic || ''}
                onChange={e => handleInputChange('topic', e.target.value)}
                placeholder="e.g. I Spent 30 Days in an AI Smart Home"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Main Subject / Person</label>
              <input
                type="text"
                value={inputs.subject || ''}
                onChange={e => handleInputChange('subject', e.target.value)}
                placeholder="e.g. Shocked creator holding futuristic glowing holographic phone"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200">Mood / Vibe</label>
                <select
                  value={inputs.mood || 'High Energy'}
                  onChange={e => handleInputChange('mood', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="High Energy">High Energy / Shocking</option>
                  <option value="Mysterious">Mysterious / Dark</option>
                  <option value="Clean & Techy">Clean & Techy</option>
                  <option value="Cinematic">Cinematic Movie Style</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-200">Art Style</label>
                <select
                  value={inputs.style || 'Photorealistic'}
                  onChange={e => handleInputChange('style', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Photorealistic">Photorealistic 8K Studio</option>
                  <option value="3D Cyberpunk">3D Cyberpunk Render</option>
                  <option value="Minimalist Graphic">Minimalist Bold Vector</option>
                  <option value="Anime Digital">Anime / Digital Illustration</option>
                </select>
              </div>
            </div>
          </>
        )}

        {toolId === 'seo_keyword' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Topic / Core Keyword *</label>
              <input
                type="text"
                value={inputs.topic || ''}
                onChange={e => handleInputChange('topic', e.target.value)}
                placeholder="e.g. Best budget mirrorless cameras for vlogging 2026"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Platform Focus</label>
              <select
                value={inputs.platform || 'YouTube & Google Search'}
                onChange={e => handleInputChange('platform', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              >
                <option value="YouTube & Google Search">YouTube & Google Search</option>
                <option value="Instagram Search">Instagram Search</option>
                <option value="TikTok SEO">TikTok SEO</option>
              </select>
            </div>
          </>
        )}

        {toolId === 'content_hook' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Topic / Concept *</label>
              <input
                type="text"
                value={inputs.topic || ''}
                onChange={e => handleInputChange('topic', e.target.value)}
                placeholder="e.g. Why most remote workers burn out without knowing it"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Platform</label>
              <select
                value={inputs.platform || 'YouTube Shorts / Reels'}
                onChange={e => handleInputChange('platform', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              >
                <option value="YouTube Shorts / Reels">YouTube Shorts / Reels</option>
                <option value="YouTube Longform">YouTube Longform (0:00 - 0:05)</option>
                <option value="Instagram Feed">Instagram Feed</option>
                <option value="Facebook Video">Facebook Video</option>
              </select>
            </div>
          </>
        )}

        {toolId === 'content_improver' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Paste Your Draft Text *</label>
              <textarea
                rows={5}
                value={inputs.originalText || ''}
                onChange={e => handleInputChange('originalText', e.target.value)}
                placeholder="Paste your video draft, post caption, or script text here..."
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-200">Improvement Goal</label>
              <select
                value={inputs.option || 'Make it more engaging, concise & professional'}
                onChange={e => handleInputChange('option', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Improve grammar & structure">Improve grammar & polish spelling</option>
                <option value="Make it more engaging & viral">Make it more engaging & punchy</option>
                <option value="Make it shorter & concise">Make it shorter & concise</option>
                <option value="Make it professional">Make it professional & authoritative</option>
                <option value="Make it easier to understand">Make it easier to understand (Simple language)</option>
                <option value="Make it SEO friendly">Make it more SEO friendly</option>
              </select>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderOutputArea = () => {
    if (!output) return null;

    switch (toolId) {
      case 'youtube_title':
        return <YouTubeTitleOutput data={output} onRegenerate={handleGenerate} />;
      case 'caption_generator':
        return <CaptionOutput data={output} />;
      case 'description_generator':
        return <DescriptionOutput data={output} />;
      case 'hashtag_generator':
        return <HashtagOutput data={output} />;
      case 'video_idea_generator':
        return <VideoIdeaOutput data={output} />;
      case 'script_generator':
        return <ScriptOutput data={output} onRegenerate={handleGenerate} />;
      case 'thumbnail_prompt':
        return <ThumbnailPromptOutput data={output} />;
      case 'seo_keyword':
        return <SEOKeywordOutput data={output} />;
      case 'content_hook':
        return <ContentHookOutput data={output} />;
      case 'content_improver':
        return <ContentImproverOutput data={output} />;
      default:
        return (
          <pre className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 overflow-x-auto">
            {JSON.stringify(output, null, 2)}
          </pre>
        );
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20">
      {/* Back Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tools
        </button>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
          {meta.category}
        </span>
      </div>

      {/* Grid: Inputs Panel on Left/Top, Output Panel on Right/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Card */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl h-fit">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">{meta.title}</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">{meta.description}</p>
          </div>

          {/* Form Fields */}
          {renderFormInputs()}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating AI Content...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-zinc-950" />
                  <span>Generate AI Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 space-y-4">
          {error && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-300">Notice:</span>
                {error}
              </div>
            </div>
          )}

          {!output && !isLoading && !error && (
            <div className="p-12 rounded-2xl bg-zinc-900/60 border border-zinc-800 border-dashed text-center space-y-3">
              <Sparkles className="w-10 h-10 text-amber-500/40 mx-auto" />
              <h3 className="text-zinc-300 font-bold text-sm">Ready to Generate</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Fill out the input options on the left and click "Generate AI Content" to get instant results.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="p-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Crafting Content...</h4>
                <p className="text-xs text-amber-300/80">Using Gemini 3.6 Flash Server Engine</p>
              </div>
            </div>
          )}

          {output && !isLoading && (
            <div className="space-y-4 animate-fade-in">
              {/* Output Top Controls Bar */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> AI Output Ready
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveToLibrary}
                    disabled={saved}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{saved ? 'Saved in Library' : 'Save to Library'}</span>
                  </button>

                  <button
                    onClick={handleGenerate}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="Regenerate Output"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleClearAll}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Clear Output"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rendered Tool Output Component */}
              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
                {renderOutputArea()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
