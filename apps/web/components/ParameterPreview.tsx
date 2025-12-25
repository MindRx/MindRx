'use client';

import { useStore } from '@/stores/store';
import { getScaledParameters } from '@/lib/intensity';

export function ParameterPreview() {
  const profile = useStore((state) => state.profile);
  const intensity = useStore((state) => state.intensity);
  const states = useStore((state) => state.states);

  const currentState = states.find((s) => s.name === profile);

  if (!currentState) {
    return (
      <div className="text-text-muted text-xs">
        Loading parameters...
      </div>
    );
  }

  const scaledParams = getScaledParameters(currentState.parameters, intensity);
  const behavior = currentState.behavior;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
          Parameters
        </h4>
        <div className="space-y-2 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-text-muted">temperature</span>
            <span className="text-text-primary">{scaledParams.temperature}</span>
          </div>
          {scaledParams.top_p !== undefined && (
            <div className="flex justify-between">
              <span className="text-text-muted">top_p</span>
              <span className="text-text-primary">{scaledParams.top_p}</span>
            </div>
          )}
          {scaledParams.frequency_penalty !== undefined && (
            <div className="flex justify-between">
              <span className="text-text-muted">freq_penalty</span>
              <span className="text-text-primary">{scaledParams.frequency_penalty}</span>
            </div>
          )}
          {scaledParams.presence_penalty !== undefined && (
            <div className="flex justify-between">
              <span className="text-text-muted">pres_penalty</span>
              <span className="text-text-primary">{scaledParams.presence_penalty}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">
          Behavior
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">association</span>
            <span className="text-text-primary">{behavior.association}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">coherence</span>
            <span className="text-text-primary">{behavior.coherence}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">pacing</span>
            <span className="text-text-primary">{behavior.pacing}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">confidence</span>
            <span className="text-text-primary">{behavior.confidence}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
