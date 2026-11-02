'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FolderHeart,
  Sparkles,
  Film,
  Heart,
  Search,
  Download,
  Trash2,
  Maximize2,
  Play,
  Filter,
  Plus,
} from 'lucide-react';
import { useGenerationStore } from '@/lib/store/useGenerationStore';
import { formatDate } from '@/lib/utils';
import { Generation } from '@/lib/types';

export default function AssetsPage() {
  const router = useRouter();
  const { generations, setSelectedAsset, toggleFavorite, deleteGeneration, setReferenceImageForVideo } =
    useGenerationStore();

  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video' | 'favorites'>('all');
  const [search, setSearch] = useState('');

  const filtered = generations.filter((item) => {
    if (activeFilter === 'image' && item.type !== 'image') return false;
    if (activeFilter === 'video' && item.type !== 'video') return false;
    if (activeFilter === 'favorites' && !item.isFavorite) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.prompt.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAnimate = (e: React.MouseEvent, imgUrl: string) => {
    e.stopPropagation();
    setReferenceImageForVideo(imgUrl);
    router.push('/create/video');
  };

  return (
    <div className="space-y-8 animate-in fade-in-50">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-apex-lime/10 text-apex-lime">
              <FolderHeart size={16} />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">
              My Creative Assets
            </h1>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-mono text-zinc-300">
              {generations.length} total
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Browse, inspect, filter, download, and repurpose your high-resolution image and video generations.
          </p>
        </div>

        {/* Quick Create Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/create/image')}
            className="glow-btn px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Sparkles size={13} className="fill-current" />
            New Image
          </button>
          <button
            onClick={() => router.push('/create/video')}
            className="px-3.5 py-2 rounded-xl bg-studio-900 hover:bg-white/10 text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Film size={13} className="text-apex-lime" />
            New Video
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center bg-studio-900/90 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-apex-lime text-black shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Assets
          </button>
          <button
            onClick={() => setActiveFilter('image')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'image'
                ? 'bg-apex-lime text-black shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles size={12} /> Images
          </button>
          <button
            onClick={() => setActiveFilter('video')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'video'
                ? 'bg-apex-lime text-black shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film size={12} /> Videos
          </button>
          <button
            onClick={() => setActiveFilter('favorites')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'favorites'
                ? 'bg-apex-lime text-black shadow-glow-subtle'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Heart size={12} /> Favorites
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by prompt or model..."
            className="w-full rounded-xl border border-white/10 bg-studio-900 py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 focus:border-apex-lime/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Asset Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedAsset(item)}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-studio-900 hover:border-apex-lime/40 transition-all duration-300 shadow-glass-card cursor-pointer flex flex-col"
            >
              {/* Media Preview with Aspect Ratio */}
              <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
                {item.type === 'video' ? (
                  <video
                    src={item.outputUrl}
                    poster={item.thumbnailUrl}
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={item.thumbnailUrl || item.outputUrl}
                    alt={item.prompt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <span className="rounded-full bg-black/70 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono text-apex-lime border border-white/10 flex items-center gap-1">
                    {item.type === 'video' ? <Film size={10} /> : <Sparkles size={10} />}
                    {item.model}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-white/20 transition-colors"
                  >
                    <Heart
                      size={13}
                      className={item.isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-300'}
                    />
                  </button>
                </div>

                {/* Video Play Indicator */}
                {item.type === 'video' && (
                  <div className="absolute bottom-2.5 right-2.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-mono text-zinc-300 flex items-center gap-1 pointer-events-none">
                    <Play size={8} className="fill-current text-apex-lime" />
                    {item.duration || '5s'}
                  </div>
                )}
              </div>

              {/* Card Meta & Prompt */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed">
                    {item.prompt}
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                {/* Bottom Quick Actions */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  {item.type === 'image' ? (
                    <button
                      onClick={(e) => handleAnimate(e, item.outputUrl)}
                      className="text-[11px] font-semibold text-apex-lime hover:underline flex items-center gap-1"
                    >
                      <Film size={11} /> Animate
                    </button>
                  ) : (
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {item.aspectRatio}
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGeneration(item.id);
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-white/5"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                    <button
                      onClick={() => setSelectedAsset(item)}
                      className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/5"
                      title="Inspect"
                    >
                      <Maximize2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl border border-white/5 bg-studio-900/40 space-y-3">
          <FolderHeart size={36} className="text-zinc-600 mx-auto" />
          <h3 className="text-sm font-semibold text-zinc-300">No assets found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search criteria or create your first generation in Create Image or Create Video.
          </p>
        </div>
      )}
    </div>
  );
}
