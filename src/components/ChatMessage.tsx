/**
 * Chat Message Component
 *
 * Renders a single message in the chat conversation.
 * Supports both user and assistant messages with distinct styling.
 */

'use client';

import type { ChatMessage as ChatMessageType } from '@/lib/chatApi';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 ${
          isUser
            ? 'bg-[var(--color-navy)] text-white'
            : 'bg-[var(--color-surface)] border border-[var(--color-light-gray)]'
        }`}
        style={{
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        }}
      >
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            fontFamily: 'var(--font-body)',
            color: isUser ? 'white' : 'var(--color-navy)',
          }}
        >
          {message.content}
        </p>
        <span
          className="block text-xs mt-1.5 opacity-60"
          style={{
            fontFamily: 'var(--font-mono)',
            color: isUser ? 'white' : 'var(--color-gray)',
          }}
        >
          {formatTime(message.created_at)}
        </span>
      </div>
    </div>
  );
}

/**
 * Format timestamp for display
 */
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
