/**
 * Chat Input Component
 *
 * Text input for sending messages to the AI assistant.
 * Supports Enter to send and Shift+Enter for new lines.
 */

'use client';

import { useState, useRef, KeyboardEvent, FormEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const sendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send, Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = () => {
    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const isDisabled = disabled || !message.trim();

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className="flex items-end gap-2 p-3 border-t border-[var(--color-light-gray)]"
        style={{ background: 'var(--color-surface)' }}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={10000}
          rows={1}
          className="flex-1 resize-none px-4 py-2.5 text-sm rounded-xl border border-[var(--color-light-gray)] focus:border-[var(--color-electric)] focus:outline-none transition-colors"
          style={{
            fontFamily: 'var(--font-body)',
            background: 'white',
            minHeight: '44px',
            maxHeight: '120px',
          }}
        />
        <button
          type="submit"
          disabled={isDisabled}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all"
          style={{
            background: isDisabled ? 'var(--color-light-gray)' : 'var(--color-electric)',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              transform: 'rotate(-45deg)',
              opacity: isDisabled ? 0.5 : 1,
            }}
          >
            <path
              d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <p
        className="text-xs px-3 pb-2"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-gray)',
          background: 'var(--color-surface)',
        }}
      >
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
