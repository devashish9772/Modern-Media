import React, { useState, useRef } from 'react';
import { Film, Upload, Camera, Download, Info } from 'lucide-react';

export const VideoTools: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoMeta, setVideoMeta] = useState<{
    width: number;
    height: number;
    duration: number;
    aspectRatio: string;
  } | null>(null);
  const [extractedFrame, setExtractedFrame] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setExtractedFrame(null);

      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const w = videoRef.current.videoWidth;
      const h = videoRef.current.videoHeight;
      const dur = videoRef.current.duration;

      // Calculate simplified aspect ratio
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(w, h);
      const aspect = `${w / divisor}:${h / divisor}`;

      setVideoMeta({
        width: w,
        height: h,
        duration: dur,
        aspectRatio: aspect === '16:9' || aspect === '9:16' || aspect === '1:1' ? aspect : `${(w / h).toFixed(2)}:1`,
      });
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setExtractedFrame(dataUrl);
    }
  };

  const formatSeconds = (sec: number) => {
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
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Video Tools & Frame Extractor</h2>
            <p className="text-xs text-zinc-400">
              Inspect video specs, verify aspect ratios, and capture HD thumbnail frames from local files.
            </p>
          </div>
        </div>

        {/* Upload Video Box */}
        <div className="border-2 border-dashed border-zinc-800 hover:border-amber-500/40 rounded-2xl p-8 text-center space-y-3 bg-zinc-950/50 transition-all cursor-pointer relative">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Film className="w-10 h-10 text-amber-400 mx-auto" />
          <p className="text-xs text-zinc-300 font-semibold">
            Upload user-owned video file (.mp4, .webm, .mov)
          </p>
          <p className="text-[11px] text-zinc-500">Supports standard browser video playback</p>
        </div>

        {/* Video Player & Specs */}
        {videoUrl && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player */}
              <div className="lg:col-span-2 space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  onLoadedMetadata={handleLoadedMetadata}
                  className="w-full max-h-[360px] rounded-lg bg-black"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-zinc-400 font-semibold">
                    Play to any moment and click capture to extract HD thumbnail frame.
                  </span>
                  <button
                    onClick={captureFrame}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 hover:from-amber-300 hover:to-yellow-400 transition-colors shadow-md shadow-amber-500/10"
                  >
                    <Camera className="w-4 h-4" /> Capture Frame
                  </button>
                </div>
              </div>

              {/* Specs Panel */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-3 text-xs">
                <h4 className="font-bold text-amber-400 text-sm border-b border-zinc-800 pb-2">
                  Video Specifications
                </h4>

                {videoFile && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">File Name:</span>
                    <span className="text-zinc-200 font-medium truncate block">{videoFile.name}</span>
                  </div>
                )}

                {videoFile && (
                  <div>
                    <span className="text-zinc-500 block text-[10px]">File Size:</span>
                    <span className="text-zinc-200">{formatBytes(videoFile.size)}</span>
                  </div>
                )}

                {videoMeta && (
                  <>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Resolution:</span>
                      <span className="text-amber-300 font-bold">
                        {videoMeta.width} x {videoMeta.height} px
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[10px]">Aspect Ratio:</span>
                      <span className="text-zinc-200">{videoMeta.aspectRatio}</span>
                    </div>

                    <div>
                      <span className="text-zinc-500 block text-[10px]">Duration:</span>
                      <span className="text-zinc-200">{formatSeconds(videoMeta.duration)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Hidden Canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Extracted Frame Snapshot Preview */}
            {extractedFrame && (
              <div className="p-5 rounded-2xl bg-zinc-950 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Camera className="w-4 h-4" /> HD Thumbnail Frame Extracted
                  </span>
                  <a
                    href={extractedFrame}
                    download="extracted_thumbnail_frame.png"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center gap-1 hover:bg-emerald-400 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Snapshot
                  </a>
                </div>

                <img
                  src={extractedFrame}
                  alt="Extracted Frame"
                  className="w-full max-h-[300px] object-contain rounded-xl border border-zinc-800 bg-black"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
