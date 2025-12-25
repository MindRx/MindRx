'use client';

import { CognitivePanel } from '@/components/CognitivePanel';
import { Terminal } from '@/components/Terminal';
import { StatusBar } from '@/components/StatusBar';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { OllamaModal } from '@/components/OllamaModal';

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-semibold text-text-primary">MindRx</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/MindRx/MindRx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-secondary transition-colors text-sm"
          >
            GitHub
          </a>
          <a
            href="https://www.npmjs.com/package/mindrx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-text-secondary transition-colors text-sm"
          >
            npm
          </a>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <CognitivePanel />
        <Terminal />
      </div>

      {/* Status bar */}
      <StatusBar />

      {/* Modals */}
      <ApiKeyModal />
      <OllamaModal />
    </div>
  );
}
