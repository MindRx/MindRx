'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useStore } from '@/stores/store';
import { TerminalLine } from './TerminalLine';

export function TerminalOutput() {
  const messages = useStore((state) => state.messages);
  const streamingText = useStore((state) => state.streamingText);
  const isStreaming = useStore((state) => state.isStreaming);
  const profile = useStore((state) => state.profile);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.length === 0 && !isStreaming && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-purple-600 mx-auto mb-6 flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">MindRx</h2>
            <p className="text-text-muted text-sm mb-6">
              Cognitive state simulation for AI
            </p>
            
            {/* Agent Creation CTA */}
            <div className="mb-6">
              <Link
                href="/agents"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-medium">Create AI Agent</span>
              </Link>
              <p className="text-xs text-text-muted mt-2">
                Design custom AI agents with unique personalities and cognitive states
              </p>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-tertiary/50 border border-white/5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs text-text-secondary">
                Active profile: <span className="text-text-primary font-medium capitalize">{profile}</span>
              </span>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <TerminalLine key={message.id} message={message} />
        ))}

        {isStreaming && streamingText && (
          <div className="animate-fade-in">
            <div className="bg-bg-secondary/80 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
              <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
                {streamingText}
                <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse rounded-sm" />
              </p>
            </div>
          </div>
        )}

        {isStreaming && !streamingText && (
          <div className="animate-fade-in">
            <div className="bg-bg-secondary/80 rounded-2xl rounded-tl-sm p-4 inline-block">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
