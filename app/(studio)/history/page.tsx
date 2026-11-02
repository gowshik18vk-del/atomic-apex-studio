'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  History as HistoryIcon,
  Sparkles,
  Film,
  Calendar,
  Maximize2,
  Trash2,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useGenerationStore } from '@/lib/store/useGenerationStore';
import { formatDate } from '@/lib/utils';
import { Generation } from '@/lib/types';

export default function HistoryPage() {
  const router = useRouter();
  const { generations, setSelectedAsset, deleteGeneration, addGeneration } = useGenerationStore();

  const handleRetry = (item: Generation) => {
    if (item.type === 'video') {
      router.push('/create/video');
    } else {
      router.push('/create/image');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 max-w-5xl">
      {/* Header */}
      <div className="border-b border-white/5 pb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-apex-lime/10 text-apex-lime">
            <HistoryIcon size={16} />
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Generation History & Audit
          </h1>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-mono text-zinc-300">
            {generations.length} records
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-400">
          Chronological table of every generation event, job status, cost, and one-click retry actions.
        </p>
      </div>

      {/* Table of Generations */}
      <div className="rounded-3xl border border-white/10 bg-studio-900 overflow-hidden shadow-glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-studio-950/80 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Preview</th>
                <th className="py-3.5 px-4">Model & Kind</th>
                <th className="py-3.5 px-4">Prompt Directive</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Cost</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {generations.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  {/* Thumbnail */}
                  <td className="py-3 px-4">
                    <div
                      onClick={() => setSelectedAsset(item)}
                      className="relative h-12 w-20 rounded-lg overflow-hidden bg-black border border-white/10 cursor-pointer flex-shrink-0"
                    >
                      <img
                        src={item.thumbnailUrl || item.outputUrl}
                        alt={item.prompt}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                  </td>

                  {/* Model */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="flex items-center gap-1.5 font-bold text-white">
                      {item.type === 'video' ? (
                        <Film size={13} className="text-apex-cyan" />
                      ) : (
                        <Sparkles size={13} className="text-apex-lime" />
                      )}
                      {item.model}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono block uppercase">
                      {item.type}
                    </span>
                  </td>

                  {/* Prompt */}
                  <td className="py-3 px-4 max-w-xs">
                    <p className="line-clamp-2 text-zinc-300 font-medium leading-relaxed">
                      {item.prompt}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                      <CheckCircle2 size={11} />
                      SUCCEEDED
                    </span>
                  </td>

                  {/* Cost */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-apex-lime">
                    ⚡ {item.creditsCost} cr
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 whitespace-nowrap text-zinc-500 font-mono text-[11px]">
                    {formatDate(item.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleRetry(item)}
                        className="p-1.5 rounded-lg bg-studio-950 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5 transition-colors"
                        title="Retry this prompt in studio"
                      >
                        <RotateCcw size={13} />
                      </button>
                      <button
                        onClick={() => setSelectedAsset(item)}
                        className="p-1.5 rounded-lg bg-studio-950 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5 transition-colors"
                        title="Inspect full resolution"
                      >
                        <Maximize2 size={13} />
                      </button>
                      <button
                        onClick={() => deleteGeneration(item.id)}
                        className="p-1.5 rounded-lg bg-studio-950 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 border border-white/5 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
