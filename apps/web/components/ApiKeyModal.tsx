'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/stores/store';
import { PROVIDERS } from '@/lib/types';

export function ApiKeyModal() {
  const [apiKey, setApiKey] = useState('');
  const showApiKeyModal = useStore((state) => state.showApiKeyModal);
  const pendingProvider = useStore((state) => state.pendingProvider);
  const setShowApiKeyModal = useStore((state) => state.setShowApiKeyModal);
  const setPendingProvider = useStore((state) => state.setPendingProvider);
  const setProvider = useStore((state) => state.setProvider);
  const setApiKeyStore = useStore((state) => state.setApiKey);

  const providerConfig = PROVIDERS.find((p) => p.value === pendingProvider);

  useEffect(() => {
    if (showApiKeyModal) {
      setApiKey('');
    }
  }, [showApiKeyModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim() && pendingProvider) {
      setApiKeyStore(pendingProvider, apiKey.trim());
      setProvider(pendingProvider);
      setShowApiKeyModal(false);
      setPendingProvider(null);
    }
  };

  const handleCancel = () => {
    setShowApiKeyModal(false);
    setPendingProvider(null);
  };

  if (!showApiKeyModal || !pendingProvider || !providerConfig) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative bg-bg-secondary border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl animate-fade-in">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          {providerConfig.label} API Key
        </h2>
        <p className="text-sm text-text-muted mb-6">
          Enter your API key to use {providerConfig.label}. The key is only stored in memory for this session and will not be saved.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`Enter your ${providerConfig.label} API key`}
              className="w-full bg-bg-tertiary/50 border border-white/10 text-text-primary px-4 py-3 rounded-lg text-sm focus:border-accent/50 focus:outline-none transition-colors"
              autoFocus
            />
            <p className="text-xs text-text-muted mt-2">
              Your key stays in your browser. We never store or transmit it to our servers.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-text-secondary hover:bg-bg-tertiary/50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!apiKey.trim()}
              className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent/80 disabled:bg-bg-tertiary disabled:text-text-muted transition-colors text-sm font-medium text-white"
            >
              Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
