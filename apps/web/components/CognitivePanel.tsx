'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/stores/store';
import { ProfileSelector } from './ProfileSelector';
import { IntensitySlider } from './IntensitySlider';
import { ParameterPreview } from './ParameterPreview';
import { ModelSelector } from './ModelSelector';

export function CognitivePanel() {
  const setStates = useStore((state) => state.setStates);

  useEffect(() => {
    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => data.states && setStates(data.states))
      .catch(() => {});
  }, [setStates]);

  return (
    <aside className="w-80 border-r border-white/5 flex flex-col bg-bg-secondary/50">
      {/* Panel header */}
      <div className="p-5 border-b border-white/5">
        <h2 className="text-sm font-medium text-text-primary mb-1">Cognitive State</h2>
        <p className="text-xs text-text-muted">Select a mental profile for the AI</p>
      </div>

      {/* Controls */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <ProfileSelector />
        <IntensitySlider />

        <div className="pt-4 border-t border-white/5">
          <ParameterPreview />
        </div>

        <div className="pt-4 border-t border-white/5">
          <ModelSelector />
        </div>

        {/* Agent Creation Section */}
        <div className="pt-4 border-t border-white/5">
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              AI Agents
            </h3>
            <Link
              href="/agents"
              className="block w-full px-4 py-2.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 hover:border-purple-500/50 hover:text-purple-200 transition-all duration-200 text-sm font-medium text-center"
            >
              Create Agent
            </Link>
            <p className="text-xs text-text-muted text-center">
              Design custom AI with unique personalities
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
}
