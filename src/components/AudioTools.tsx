import React, { useState, useRef } from 'react';
import { Music, Upload, Info, AlertTriangle, Play, Pause } from 'lucide-react';

export const AudioTools: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);

      const url = URL.createObjectURL(file);
      setAudioUrl(url);

      const tempAudio = new Audio(url);
      tempAudio.onloadedmetadata = () => {
        setDuration(tempAudio.duration);
      };
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatSeconds = (sec: number | null) => {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Audio & Song Inspector</h2>
            <p className="text-xs text-zinc-400">
              Inspect user-owned audio files, check format parameters, duration & identification status.
            </p>
          </div>
        </div>

        {/* Upload Audio File */}
        <div className="border-2 border-dashed border-zinc-800 hover:border-amber-500/40 rounded-2xl p-8 text-center space-y-3 bg-zinc-950/50 transition-all cursor-pointer relative">
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Music className="w-10 h-10 text-amber-400 mx-auto" />
          <p className="text-xs text-zinc-300 font-semibold">
            Upload user-owned audio file (.mp3, .wav, .aac, .m4a, .flac)
          </p>
          <p className="text-[11px] text-zinc-500">Supports all standard browser audio formats</p>
        </div>

        {/* Audio Player & Metadata */}
        {audioFile && audioUrl && (
          <div className="p-5 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-4">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{audioFile.name}</h4>
                <span className="text-xs text-zinc-400">
                  {formatBytes(audioFile.size)} • {audioFile.type || 'audio/mp3'}
                </span>
              </div>

              <button
                onClick={togglePlay}
                className="p-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
            </div>

            {/* Audio Properties Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-zinc-800">
              <div>
                <span className="text-zinc-500 block text-[10px]">File Name:</span>
                <span className="text-zinc-200 font-medium truncate block">{audioFile.name}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Duration:</span>
                <span className="text-amber-400 font-bold">{formatSeconds(duration)}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">File Size:</span>
                <span className="text-zinc-200">{formatBytes(audioFile.size)}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Audio Format:</span>
                <span className="text-zinc-200">{audioFile.type || 'Audio Track'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Song Identification Status Box */}
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4" /> Song Identification Status
          </div>
          <p className="text-zinc-400 leading-relaxed">
            Song identification is not configured yet.
          </p>
        </div>
      </div>
    </div>
  );
};
