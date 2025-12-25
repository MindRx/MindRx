'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useStore } from '@/stores/store';

interface TerminalInputProps {
  onSubmit: (input: string) => void;
}

export function TerminalInput({ onSubmit }: TerminalInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isStreaming = useStore((state) => state.isStreaming);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isStreaming]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && input.trim() && !isStreaming) {
      e.preventDefault();
      onSubmit(input.trim());
      setInput('');
    }
  };

  const handleSubmit = () => {
    if (input.trim() && !isStreaming) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <div className="border-t border-white/5 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 bg-bg-secondary/80 rounded-2xl px-4 py-3 border border-white/5 focus-within:border-accent/50 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder={isStreaming ? 'Waiting for response...' : 'Type your message...'}
            className="flex-1 bg-transparent text-text-primary placeholder-text-muted text-sm focus:outline-none disabled:opacity-50"
            autoComplete="off"
            spellCheck="false"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isStreaming}
            className="w-8 h-8 rounded-lg bg-accent hover:bg-accent/80 disabled:bg-bg-tertiary disabled:opacity-50 flex items-center justify-center transition-all"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-text-muted text-center mt-2">
          Press Enter to send
        </p>
      </div>
    </div>
  );
}
