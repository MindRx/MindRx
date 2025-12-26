'use client';

import Link from 'next/link';
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
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 hover:border-purple-500/50 hover:text-purple-200 transition-all duration-200 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Agents
          </Link>
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
