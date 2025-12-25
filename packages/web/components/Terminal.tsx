'use client';

import { useChat } from '@/hooks/useChat';
import { TerminalOutput } from './TerminalOutput';
import { TerminalInput } from './TerminalInput';

export function Terminal() {
  const { sendMessage } = useChat();

  return (
    <main className="flex-1 flex flex-col min-w-0">
      <TerminalOutput />
      <TerminalInput onSubmit={sendMessage} />
    </main>
  );
}
