'use client';

import type { Message } from '@/lib/types';

interface TerminalLineProps {
  message: Message;
}

export function TerminalLine({ message }: TerminalLineProps) {
  const { type, content } = message;

  if (type === 'user') {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="bg-accent/20 border border-accent/30 rounded-2xl rounded-tr-sm p-4 max-w-[85%]">
          <p className="text-text-primary text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    );
  }

  if (type === 'system') {
    return (
      <div className="flex justify-center animate-fade-in">
        <div className="px-4 py-2 rounded-full bg-bg-tertiary/50 border border-white/5">
          <p className="text-text-muted text-xs">{content}</p>
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="animate-fade-in">
      <div className="bg-bg-secondary/80 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
        <p className="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
