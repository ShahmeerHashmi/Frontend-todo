/**
 * Better Auth configuration for frontend authentication.
 *
 * Configured to work with backend API at http://localhost:8000.
 * Uses cookie-based session management with httpOnly cookies.
 */

// Better Auth client configuration
export const authConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  basePath: '/auth',
  credentials: 'include' as RequestCredentials, // Include cookies in requests
};

// Auth endpoints
export const authEndpoints = {
  register: `${authConfig.baseURL}/auth/register`,
  login: `${authConfig.baseURL}/auth/login`,
  logout: `${authConfig.baseURL}/auth/logout`,
};
