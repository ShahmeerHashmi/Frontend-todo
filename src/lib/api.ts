/**
 * API client utility for making authenticated requests to backend.
 *
 * Provides fetch wrapper functions with:
 * - Automatic cookie inclusion for JWT authentication
 * - Standardized error handling
 * - 401 redirect to login
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors: Array<{ field: string; message: string }> = []
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { skipAuthRedirect?: boolean } = {}
): Promise<T> {
  const url = new URL(endpoint, API_BASE_URL).toString();
  const { skipAuthRedirect, ...fetchOptions } = options;

  const defaultOptions: RequestInit = {
    credentials: 'include', // Include cookies for JWT
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...fetchOptions });

    // Handle 401 Unauthorized - redirect to login (unless skipAuthRedirect is true)
    if (response.status === 401) {
      if (!skipAuthRedirect && typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new APIError(401, 'Authentication required');
    }

    // Handle errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'An error occurred',
        errors: [],
        statusCode: response.status,
      }));

      throw new APIError(
        errorData.statusCode || response.status,
        errorData.message || 'An error occurred',
        errorData.errors || []
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // Network or other errors
    throw new APIError(
      0,
      error instanceof Error ? error.message : 'Network error occurred'
    );
  }
}

/**
 * Auth API functions
 */
export const authAPI = {
  register: async (email: string, password: string) => {
    return apiRequest<{ message: string; user_id: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest<{ message: string; user: { id: string; email: string } }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },

  logout: async () => {
    return apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  me: async () => {
    return apiRequest<{ message: string; user: { id: string; email: string } }>(
      '/auth/me',
      {
        method: 'GET',
        skipAuthRedirect: true, // Don't redirect on 401 for auth check
      }
    );
  },
};

/**
 * Task API functions
 */
export const taskAPI = {
  getAll: async () => {
    return apiRequest<Array<{
      id: string;
      user_id: string;
      title: string;
      description: string | null;
      completed: boolean;
      created_at: string;
      updated_at: string;
    }>>('/tasks');
  },

  getById: async (taskId: string) => {
    return apiRequest<{
      id: string;
      user_id: string;
      title: string;
      description: string | null;
      completed: boolean;
      created_at: string;
      updated_at: string;
    }>(`/tasks/${taskId}`);
  },

  create: async (data: { title: string; description?: string }) => {
    return apiRequest<{
      id: string;
      user_id: string;
      title: string;
      description: string | null;
      completed: boolean;
      created_at: string;
      updated_at: string;
    }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (
    taskId: string,
    data: { title?: string; description?: string; updated_at?: string }
  ) => {
    return apiRequest<{
      id: string;
      user_id: string;
      title: string;
      description: string | null;
      completed: boolean;
      created_at: string;
      updated_at: string;
    }>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (taskId: string) => {
    return apiRequest<null>(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  toggleComplete: async (taskId: string, updated_at?: string) => {
    return apiRequest<{
      id: string;
      user_id: string;
      title: string;
      description: string | null;
      completed: boolean;
      created_at: string;
      updated_at: string;
    }>(`/tasks/${taskId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ updated_at }),
    });
  },
};
