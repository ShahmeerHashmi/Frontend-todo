/**
 * Chat Panel Component
 *
 * Main container for the conversational AI interface.
 * Manages chat state, message history, and AI interactions.
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatAPI, isServiceUnavailableError } from '@/lib/chatApi';
import type { ChatMessage as ChatMessageType, ToolCall } from '@/lib/chatApi';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatPanelProps {
  onTasksChanged?: () => void;
}

export function ChatPanel({ onTasksChanged }: ChatPanelProps) {
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch message history
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useQuery({
    queryKey: ['chatHistory'],
    queryFn: () => chatAPI.getHistory({ limit: 50 }),
    staleTime: 30000,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: chatAPI.sendMessage,
    onMutate: async (message) => {
      setError(null);

      // Optimistically add user message
      await queryClient.cancelQueries({ queryKey: ['chatHistory'] });
      const previousHistory = queryClient.getQueryData(['chatHistory']);

      const optimisticMessage: ChatMessageType = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData(['chatHistory'], (old: any) => {
        if (!old) return { conversation_id: '', messages: [optimisticMessage], has_more: false };
        return {
          ...old,
          messages: [...old.messages, optimisticMessage],
        };
      });

      return { previousHistory };
    },
    onSuccess: (data, variables) => {
      // Add assistant response to history
      queryClient.setQueryData(['chatHistory'], (old: any) => {
        if (!old) return old;

        // Find and update the optimistic user message with real data
        const messages = old.messages.filter(
          (m: ChatMessageType) => !m.id.startsWith('temp-')
        );

        // Add the actual user message and assistant response
        const userMessage: ChatMessageType = {
          id: `user-${data.message_id}`,
          role: 'user',
          content: variables,
          created_at: new Date().toISOString(),
        };

        const assistantMessage: ChatMessageType = {
          id: data.message_id,
          role: 'assistant',
          content: data.response,
          created_at: new Date().toISOString(),
        };

        return {
          ...old,
          conversation_id: data.conversation_id,
          messages: [...messages, userMessage, assistantMessage],
        };
      });

      // If tools were called that might affect tasks, notify parent
      if (data.tool_calls.length > 0 && onTasksChanged) {
        const taskModifyingTools = ['create_task', 'complete_task', 'update_task', 'delete_task'];
        const hasTaskChanges = data.tool_calls.some(
          (tc: ToolCall) => taskModifyingTools.includes(tc.tool) && tc.result === 'success'
        );
        if (hasTaskChanges) {
          onTasksChanged();
        }
      }
    },
    onError: (err, _variables, context) => {
      // Rollback optimistic update
      if (context?.previousHistory) {
        queryClient.setQueryData(['chatHistory'], context.previousHistory);
      }

      // Set user-friendly error message
      if (isServiceUnavailableError(err)) {
        setError("I'm having trouble connecting. Please try again in a moment.");
      } else {
        setError('Failed to send message. Please try again.');
      }
    },
  });

  // Clear history mutation
  const clearHistoryMutation = useMutation({
    mutationFn: chatAPI.clearHistory,
    onSuccess: () => {
      queryClient.setQueryData(['chatHistory'], {
        conversation_id: historyData?.conversation_id || '',
        messages: [],
        has_more: false,
      });
      setError(null);
    },
    onError: () => {
      setError('Failed to clear chat history. Please try again.');
    },
  });

  const handleClearHistory = () => {
    if (messages.length > 0 && !clearHistoryMutation.isPending) {
      clearHistoryMutation.mutate();
    }
  };

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [historyData?.messages, scrollToBottom]);

  const handleSendMessage = (message: string) => {
    sendMessageMutation.mutate(message);
  };

  const messages = historyData?.messages || [];

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '2px solid var(--color-light-gray)',
        boxShadow: 'var(--shadow-float)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-[var(--color-light-gray)]"
        style={{ background: 'white' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: sendMessageMutation.isPending
                  ? 'var(--color-yellow)'
                  : 'var(--color-lime)',
              }}
            />
            <h2
              className="font-semibold text-sm"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-navy)',
              }}
            >
              AI Assistant
            </h2>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              disabled={clearHistoryMutation.isPending}
              className="text-xs px-2 py-1 rounded transition-colors hover:bg-[var(--color-light-gray)]"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-gray)',
                cursor: clearHistoryMutation.isPending ? 'not-allowed' : 'pointer',
                opacity: clearHistoryMutation.isPending ? 0.5 : 1,
              }}
              title="Clear chat history"
            >
              {clearHistoryMutation.isPending ? 'Clearing...' : 'Clear'}
            </button>
          )}
        </div>
        <p
          className="text-xs mt-0.5"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-gray)',
          }}
        >
          {sendMessageMutation.isPending ? 'Thinking...' : 'Ask me to manage your tasks'}
        </p>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={{ background: 'var(--color-background)' }}
      >
        {isLoadingHistory && (
          <div className="flex justify-center py-8">
            <div
              className="animate-spin w-6 h-6 border-2 rounded-full"
              style={{
                borderColor: 'var(--color-light-gray)',
                borderTopColor: 'var(--color-electric)',
              }}
            />
          </div>
        )}

        {historyError && (
          <div
            className="text-center py-4 px-3 rounded-xl text-sm"
            style={{
              background: 'var(--color-pink-light)',
              color: 'var(--color-pink)',
            }}
          >
            Failed to load message history
          </div>
        )}

        {!isLoadingHistory && messages.length === 0 && (
          <div className="text-center py-8">
            <p
              className="text-sm mb-2"
              style={{ color: 'var(--color-gray)' }}
            >
              No messages yet
            </p>
            <p
              className="text-xs"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-gray)',
              }}
            >
              Try saying &quot;Add buy groceries to my list&quot;
            </p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Typing indicator */}
        {sendMessageMutation.isPending && (
          <div className="flex justify-start mb-3">
            <div
              className="px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-light-gray)]"
              style={{ borderRadius: '16px 16px 16px 4px' }}
            >
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    background: 'var(--color-gray)',
                    animationDelay: '0ms',
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    background: 'var(--color-gray)',
                    animationDelay: '150ms',
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{
                    background: 'var(--color-gray)',
                    animationDelay: '300ms',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div
          className="mx-4 mb-2 px-3 py-2 rounded-lg text-sm"
          style={{
            background: 'var(--color-pink-light)',
            color: 'var(--color-pink)',
          }}
        >
          {error}
        </div>
      )}

      {/* Input Area */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={sendMessageMutation.isPending}
        placeholder={
          sendMessageMutation.isPending
            ? 'Waiting for response...'
            : 'Type a message...'
        }
      />
    </div>
  );
}
