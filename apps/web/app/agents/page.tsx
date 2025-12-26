'use client';

import Link from 'next/link';
import { AgentList } from '@/components/AgentList';

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-text-primary">MindRx</span>
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-white">Agents</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-text-muted hover:text-text-secondary transition-colors text-sm"
          >
            Chat
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
      <div className="container mx-auto px-4 py-8">
        <AgentList />
      </div>
    </div>
  );
}