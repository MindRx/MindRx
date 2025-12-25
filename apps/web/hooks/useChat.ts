'use client';

import { useCallback } from 'react';
import { useStore } from '@/stores/store';
import type { ChatRequest, SSEEvent, Message } from '@/lib/types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function useChat() {
  const profile = useStore((state) => state.profile);
  const intensity = useStore((state) => state.intensity);
  const provider = useStore((state) => state.provider);
  const model = useStore((state) => state.model);
  const apiKeys = useStore((state) => state.apiKeys);
  const messages = useStore((state) => state.messages);
  const addMessage = useStore((state) => state.addMessage);
  const appendStreamingText = useStore((state) => state.appendStreamingText);
  const clearStreamingText = useStore((state) => state.clearStreamingText);
  const setConnectionStatus = useStore((state) => state.setConnectionStatus);

  const sendMessage = useCallback(
    async (input: string) => {
      const userMessage: Message = {
        id: generateId(),
        type: 'user',
        content: input,
        timestamp: new Date(),
      };
      addMessage(userMessage);

      const history = messages
        .filter((m) => m.type === 'user' || m.type === 'assistant')
        .map((m) => ({ role: m.type as 'user' | 'assistant', content: m.content }));

      const request: ChatRequest = {
        message: input,
        profile,
        intensity,
        provider,
        model: model || undefined,
        apiKey: apiKeys[provider] || undefined,
        history,
      };

      useStore.getState().setIsStreaming(true);
      setConnectionStatus('streaming');
      clearStreamingText();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });

        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const event: SSEEvent = JSON.parse(line.slice(6));
                if (event.type === 'chunk' && event.text) {
                  fullText += event.text;
                  appendStreamingText(event.text);
                } else if (event.type === 'error') {
                  throw new Error(event.error || 'Unknown error');
                }
              } catch (e) {
                if (e instanceof SyntaxError) continue;
                throw e;
              }
            }
          }
        }

        if (fullText) {
          const assistantMessage: Message = {
            id: generateId(),
            type: 'assistant',
            content: fullText,
            timestamp: new Date(),
          };
          addMessage(assistantMessage);
        }

        setConnectionStatus('connected');
      } catch (error) {
        setConnectionStatus('error');
        const errorMessage: Message = {
          id: generateId(),
          type: 'system',
          content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: new Date(),
        };
        addMessage(errorMessage);
      } finally {
        useStore.getState().setIsStreaming(false);
        clearStreamingText();
      }
    },
    [profile, intensity, provider, model, apiKeys, messages, addMessage, appendStreamingText, clearStreamingText, setConnectionStatus]
  );

  return { sendMessage };
}
