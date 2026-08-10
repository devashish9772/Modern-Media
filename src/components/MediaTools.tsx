import React, { useState } from 'react';
import { FolderDown, ShieldAlert, Download, FileText, Check, Info, Upload } from 'lucide-react';

export const MediaTools: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlStatus, setUrlStatus] = useState<string | null>(null);

  const handleUrlCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const lower = urlInput.toLowerCase();
    const isRestrictedPlatform =
      lower.includes('youtube.com') ||
      lower.includes('youtu.be') ||
      lower.includes('instagram.com') ||
      lower.includes('facebook.com') ||
      lower.includes('tiktok.com') ||
      lower.includes('twitter.com') ||
      lower.includes('x.com');

    if (isRestrictedPlatform) {
      setUrlStatus('restricted');
    } else if (lower.match(/\.(mp4|webm|mp3|wav|png|jpg|jpeg|gif)$/i)) {
      setUrlStatus('permitted');
    } else {
      setUrlStatus('restricted');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
            <FolderDown className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Media Tools & Permitted Downloader</h2>
            <p className="text-xs text-zinc-400">
              Inspect user-owned files, public-domain assets, and legally downloadable media URLs.
            </p>
          </div>
        </div>

        {/* URL Inspector Form */}
        <form onSubmit={handleUrlCheck} className="space-y-3 pt-2">
          <label className="text-xs font-bold text-amber-300 block">
            Media URL Inspector (Public Domain / Direct Links)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={urlInput}
              onChange={e => {
                setUrlInput(e.target.value);
                setUrlStatus(null);
              }}
              placeholder="https://example.com/my-public-video.mp4"
              className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold text-xs hover:from-amber-300 hover:to-yellow-400 shrink-0 transition-colors"
            >
              Inspect Link
            </button>
          </div>
        </form>

        {/* Status Alerts */}
        {urlStatus === 'restricted' && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-amber-300">Platform Policy Warning:</span>
              This media cannot be downloaded through Modern Media. Please use media that you own or have permission to download.
            </div>
          </div>
        )}

        {urlStatus === 'permitted' && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <Check className="w-4 h-4" /> Permitted Direct Media File Detected
            </div>
            <div className="text-zinc-300 text-xs font-mono bg-zinc-950 p-3 rounded-lg border border-zinc-800 break-all">
              URL: {urlInput}
            </div>
            <a
              href={urlInput}
              download
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
            >
              <Download className="w-4 h-4" /> Download Permitted Media File
            </a>
          </div>
        )}
      </div>

      {/* Local File Inspector */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-amber-400" /> Inspect Local Media File
        </h3>

        <div className="border-2 border-dashed border-zinc-800 hover:border-amber-500/40 rounded-2xl p-8 text-center space-y-3 bg-zinc-950/50 transition-all cursor-pointer relative">
          <input
            type="file"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <FileText className="w-10 h-10 text-amber-400 mx-auto" />
          <p className="text-xs text-zinc-300 font-semibold">
            Click or drag & drop a user-owned video, audio, or image file
          </p>
          <p className="text-[11px] text-zinc-500">Supports MP4, WEBM, MP3, WAV, PNG, JPG, GIF</p>
        </div>

        {selectedFile && (
          <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-2 text-xs">
            <div className="font-bold text-amber-300 flex items-center justify-between">
              <span>File Details: {selectedFile.name}</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                Locally Verified
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-zinc-300 pt-1">
              <div>
                <span className="text-zinc-500 block text-[10px]">Size:</span>
                {formatBytes(selectedFile.size)}
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">MIME Type:</span>
                {selectedFile.type || 'Unknown'}
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Last Modified:</span>
                {new Date(selectedFile.lastModified).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
