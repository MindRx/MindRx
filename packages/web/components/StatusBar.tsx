'use client';

import { useStore } from '@/stores/store';

export function StatusBar() {
  const profile = useStore((state) => state.profile);
  const intensity = useStore((state) => state.intensity);
  const provider = useStore((state) => state.provider);
  const connectionStatus = useStore((state) => state.connectionStatus);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'streaming': return 'bg-accent';
      case 'error': return 'bg-error';
      case 'connected': return 'bg-success';
      default: return 'bg-text-muted';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'streaming': return 'Streaming';
      case 'error': return 'Error';
      case 'connected': return 'Connected';
      default: return 'Ready';
    }
  };

  return (
    <footer className="h-10 border-t border-white/5 px-6 flex items-center justify-between text-xs bg-bg-secondary/30">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-text-muted">Profile:</span>
          <span className="text-text-secondary font-medium capitalize">{profile}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-muted">Intensity:</span>
          <span className="text-accent font-mono">{intensity.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-muted">Provider:</span>
          <span className="text-text-secondary">{provider}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${getStatusColor()} ${connectionStatus === 'streaming' ? 'animate-pulse' : ''}`} />
        <span className="text-text-secondary">{getStatusText()}</span>
      </div>
    </footer>
  );
}
