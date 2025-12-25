'use client';

import { useStore } from '@/stores/store';

export function OllamaModal() {
  const showOllamaModal = useStore((state) => state.showOllamaModal);
  const setShowOllamaModal = useStore((state) => state.setShowOllamaModal);
  const setProvider = useStore((state) => state.setProvider);

  const handleContinue = () => {
    setProvider('ollama');
    setShowOllamaModal(false);
  };

  const handleCancel = () => {
    setShowOllamaModal(false);
  };

  if (!showOllamaModal) {
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
      <div className="relative bg-bg-secondary border border-white/10 rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl animate-fade-in">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Ollama Setup Required
        </h2>
        <p className="text-sm text-text-muted mb-6">
          Ollama runs AI models locally on your computer. You'll need to install it first.
        </p>

        <div className="bg-bg-tertiary/50 rounded-xl p-4 mb-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-2">1. Install Ollama</h3>
            <p className="text-xs text-text-muted mb-2">Download and install from the official website:</p>
            <a
              href="https://ollama.com/download"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 text-sm transition-colors"
            >
              ollama.com/download
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-primary mb-2">2. Pull a model</h3>
            <p className="text-xs text-text-muted mb-2">Open terminal and run:</p>
            <code className="block bg-bg-primary/50 text-text-primary text-xs px-3 py-2 rounded-lg font-mono">
              ollama pull llama3.2
            </code>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-primary mb-2">3. Start Ollama</h3>
            <p className="text-xs text-text-muted">
              Make sure Ollama is running (it starts automatically on install).
            </p>
          </div>
        </div>

        <p className="text-xs text-text-muted mb-6">
          Once installed, Ollama runs at <code className="text-text-secondary">localhost:11434</code>.
          MindRx will connect to it automatically.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-text-secondary hover:bg-bg-tertiary/50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-sm font-medium text-white"
          >
            I have Ollama installed
          </button>
        </div>
      </div>
    </div>
  );
}
