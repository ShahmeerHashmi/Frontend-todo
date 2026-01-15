/**
 * TypeScript types for User entities matching backend schemas.
 */

export interface User {
  id: string;
  email: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user_id: string;
}

export interface ErrorDetail {
  field: string;
  message: string;
}

export interface ErrorResponse {
  message: string;
  errors: ErrorDetail[];
  statusCode: number;
  timestamp: string;
}
