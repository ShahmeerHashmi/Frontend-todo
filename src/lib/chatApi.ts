/**
 * Chat API client for conversational AI interface.
 *
 * Provides functions for:
 * - Sending chat messages to AI assistant
 * - Retrieving message history
 * - Handling chat-specific errors (503 service unavailable)
 */

import { apiRequest, APIError } from './api';

/**
 * Tool call information from AI processing
 */
export interface ToolCall {
  tool: 'create_task' | 'list_tasks' | 'complete_task' | 'update_task' | 'delete_task';
  params: Record<string, unknown>;
  result: 'success' | 'error';
}

/**
 * Chat message in conversation history
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

/**
 * Response from sending a chat message
 */
export interface ChatResponse {
  response: string;
  conversation_id: string;
  message_id: string;
  tool_calls: ToolCall[];
}

/**
 * Response from getting message history
 */
export interface MessageHistoryResponse {
  conversation_id: string;
  messages: ChatMessage[];
  has_more: boolean;
}

/**
 * Check if error is a service unavailable error (AI service down)
 */
export function isServiceUnavailableError(error: unknown): boolean {
  return error instanceof APIError && error.statusCode === 503;
}

/**
 * Chat API functions
 */
export const chatAPI = {
  /**
   * Send a message to the AI assistant
   * @param message Natural language message from user
   * @returns AI response with tool calls made
   * @throws APIError with statusCode 503 if AI service unavailable
   */
  sendMessage: async (message: string): Promise<ChatResponse> => {
    return apiRequest<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  /**
   * Get conversation message history
   * @param options Pagination options
   * @returns Messages in chronological order with pagination info
   */
  getHistory: async (options?: {
    limit?: number;
    before?: string;
  }): Promise<MessageHistoryResponse> => {
    const params = new URLSearchParams();
    if (options?.limit) {
      params.set('limit', String(options.limit));
    }
    if (options?.before) {
      params.set('before', options.before);
    }

    const queryString = params.toString();
    const endpoint = `/chat/messages${queryString ? `?${queryString}` : ''}`;

    return apiRequest<MessageHistoryResponse>(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Clear all chat history
   * @returns void on success
   */
  clearHistory: async (): Promise<void> => {
    await apiRequest('/chat/messages', {
      method: 'DELETE',
    });
  },
};
