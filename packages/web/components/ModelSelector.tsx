'use client';

import { useStore } from '@/stores/store';
import { PROVIDERS, type ProviderName } from '@/lib/types';

export function ModelSelector() {
  const provider = useStore((state) => state.provider);
  const model = useStore((state) => state.model);
  const apiKeys = useStore((state) => state.apiKeys);
  const setProvider = useStore((state) => state.setProvider);
  const setModel = useStore((state) => state.setModel);
  const setShowApiKeyModal = useStore((state) => state.setShowApiKeyModal);
  const setShowOllamaModal = useStore((state) => state.setShowOllamaModal);
  const setPendingProvider = useStore((state) => state.setPendingProvider);

  const currentProviderConfig = PROVIDERS.find((p) => p.value === provider);

  const handleProviderChange = (newProvider: ProviderName) => {
    const config = PROVIDERS.find((p) => p.value === newProvider);

    if (newProvider === 'ollama' && provider !== 'ollama') {
      // Show Ollama setup instructions
      setShowOllamaModal(true);
    } else if (config?.requiresApiKey && !apiKeys[newProvider]) {
      // Show modal to get API key
      setPendingProvider(newProvider);
      setShowApiKeyModal(true);
    } else {
      setProvider(newProvider);
    }
  };

  const hasApiKey = (providerValue: string) => {
    return !!apiKeys[providerValue];
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
          Provider
        </label>
        <select
          value={provider}
          onChange={(e) => handleProviderChange(e.target.value as ProviderName)}
          className="w-full bg-bg-tertiary/50 border border-white/10 text-text-primary px-3 py-2.5 rounded-lg text-sm focus:border-accent/50 focus:outline-none transition-colors appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1rem',
          }}
        >
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label} {p.requiresApiKey && hasApiKey(p.value) ? '✓' : ''}
            </option>
          ))}
        </select>
        <p className="text-xs text-text-muted mt-2">
          {currentProviderConfig?.description}
          {currentProviderConfig?.requiresApiKey && hasApiKey(provider) && (
            <span className="text-success ml-1">• API key set</span>
          )}
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
          Model (optional)
        </label>
        <input
          type="text"
          value={model || ''}
          onChange={(e) => setModel(e.target.value || null)}
          placeholder={currentProviderConfig?.placeholder || 'default'}
          className="w-full bg-bg-tertiary/50 border border-white/10 text-text-primary px-3 py-2.5 rounded-lg text-sm placeholder-text-muted focus:border-accent/50 focus:outline-none transition-colors"
        />
      </div>
    </div>
  );
}
