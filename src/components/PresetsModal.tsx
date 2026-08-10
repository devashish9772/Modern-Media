import React from 'react';
import { PRESET_IDEAS } from '../data/presets';
import { ToolId } from '../types';
import { X, Lightbulb, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (toolId: ToolId, inputs: Record<string, any>) => void;
}

export const PresetsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">
                Sample Creator Ideas
              </h3>
              <p className="text-xs text-zinc-400">
                Click any preset idea to prefill inputs & test generators
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Presets */}
        <div className="p-6 overflow-y-auto space-y-3">
          {PRESET_IDEAS.map(preset => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset.toolId, preset.inputs);
                onClose();
              }}
              className="group p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-900 transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {preset.niche}
                  </span>
                  <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors">
                    {preset.title}
                  </h4>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-1">
                  {preset.inputs.topic || preset.inputs.sourceText || ''}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:text-amber-300 shrink-0">
                <span>Try Concept</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
