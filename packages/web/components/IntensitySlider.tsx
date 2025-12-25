'use client';

import { useStore } from '@/stores/store';

export function IntensitySlider() {
  const intensity = useStore((state) => state.intensity);
  const setIntensity = useStore((state) => state.setIntensity);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          Intensity
        </label>
        <span className="text-accent text-sm font-mono">
          {intensity.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={intensity}
        onChange={(e) => setIntensity(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-bg-tertiary rounded-full appearance-none cursor-pointer accent-accent"
      />
      <div className="flex justify-between text-text-muted text-xs mt-2">
        <span>baseline</span>
        <span>full</span>
      </div>
    </div>
  );
}
