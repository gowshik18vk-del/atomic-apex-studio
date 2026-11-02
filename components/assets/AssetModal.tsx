'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Download,
  Copy,
  Heart,
  Film,
  Sparkles,
  Calendar,
  Layers,
  Zap,
  Sliders,
  Check,
} from 'lucide-react';
import { useGenerationStore } from '@/lib/store/useGenerationStore';
import { formatDate } from '@/lib/utils';

export default function AssetModal() {
  const router = useRouter();
  const { selectedAsset, setSelectedAsset, toggleFavorite, setReferenceImageForVideo } =
    useGenerationStore();
  const [copied, setCopied] = React.useState(false);

  if (!selectedAsset) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(selectedAsset.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnimateToVideo = () => {
    setReferenceImageForVideo(selectedAsset.outputUrl);
    setSelectedAsset(null);
    router.push('/create/video');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in-50">
      <div className="relative w-full max-w-5xl rounded-3xl border border-white/10 bg-studio-900/95 overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => setSelectedAsset(null)}
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors"
        >
          <X size={18} />
        </button>

        {/* Media Player / Preview */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[350px] md:min-h-[500px]">
          {selectedAsset.type === 'video' ? (
            <video
              src={selectedAsset.outputUrl}
              poster={selectedAsset.thumbnailUrl}
              controls
              autoPlay
              loop
              className="max-h-[80vh] w-full object-contain"
            />
          ) : (
            <img
              src={selectedAsset.outputUrl}
              alt={selectedAsset.prompt}
              className="max-h-[80vh] w-full object-contain"
            />
          )}

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-apex-lime uppercase tracking-wider border border-apex-lime/30 flex items-center gap-1.5">
              {selectedAsset.type === 'video' ? <Film size={12} /> : <Sparkles size={12} />}
              {selectedAsset.model}
            </span>
            {selectedAsset.aspectRatio && (
              <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-mono text-zinc-300 border border-white/10">
                {selectedAsset.aspectRatio}
              </span>
            )}
          </div>
        </div>

        {/* Metadata & Actions Panel */}
        <div className="w-full md:w-96 p-6 border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            {/* Header / Date */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  {formatDate(selectedAsset.createdAt)}
                </span>
                <button
                  onClick={() => toggleFavorite(selectedAsset.id)}
                  className={`flex items-center gap-1 text-xs ${
                    selectedAsset.isFavorite ? 'text-red-400' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <Heart size={15} className={selectedAsset.isFavorite ? 'fill-red-400' : ''} />
                  {selectedAsset.isFavorite ? 'Favorited' : 'Favorite'}
                </button>
              </div>
              <h3 className="font-display text-base font-bold text-white">
                {selectedAsset.type === 'video' ? 'Video Generation' : 'Image Generation'}
              </h3>
            </div>

            {/* Prompt */}
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Prompt
              </span>
              <p className="mt-1 text-xs leading-relaxed text-zinc-200 bg-studio-950/70 p-3 rounded-xl border border-white/5">
                {selectedAsset.prompt}
              </p>
            </div>

            {/* Negative Prompt if exists */}
            {selectedAsset.negativePrompt && (
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Negative Prompt
                </span>
                <p className="mt-1 text-xs text-zinc-400 bg-studio-950/70 p-2.5 rounded-xl border border-white/5 font-mono text-[11px]">
                  {selectedAsset.negativePrompt}
                </p>
              </div>
            )}

            {/* Technical Parameters */}
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Sliders size={12} /> Parameters
              </span>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-studio-950/50 p-2 rounded-lg border border-white/5">
                  <span className="text-zinc-500 text-[10px] block">Model</span>
                  <span className="text-zinc-200 font-medium truncate block">{selectedAsset.model}</span>
                </div>
                <div className="bg-studio-950/50 p-2 rounded-lg border border-white/5">
                  <span className="text-zinc-500 text-[10px] block">Ratio</span>
                  <span className="text-zinc-200 font-medium block">{selectedAsset.aspectRatio || '16:9'}</span>
                </div>
                {selectedAsset.duration && (
                  <div className="bg-studio-950/50 p-2 rounded-lg border border-white/5">
                    <span className="text-zinc-500 text-[10px] block">Duration</span>
                    <span className="text-zinc-200 font-medium block">{selectedAsset.duration}</span>
                  </div>
                )}
                {selectedAsset.parameters?.camera && (
                  <div className="bg-studio-950/50 p-2 rounded-lg border border-white/5">
                    <span className="text-zinc-500 text-[10px] block">Camera</span>
                    <span className="text-zinc-200 font-medium truncate block">{selectedAsset.parameters.camera}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-white/10 space-y-2">
            {selectedAsset.type === 'image' && (
              <button
                onClick={handleAnimateToVideo}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-apex-lime to-emerald-400 hover:from-apex-lime-hover hover:to-emerald-300 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-glow-lime transition-all"
              >
                <Film size={14} />
                Animate this Image into Video (Apex Pixel)
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyPrompt}
                className="py-2 px-3 rounded-xl bg-studio-950 hover:bg-white/10 text-zinc-200 text-xs font-medium border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check size={14} className="text-apex-lime" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>

              <a
                href={selectedAsset.outputUrl}
                download={`atomic-apex-${selectedAsset.id}`}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-studio-950 hover:bg-white/10 text-zinc-200 text-xs font-medium border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download size={14} />
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
