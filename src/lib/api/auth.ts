// Token management utilities
const TOKEN_KEY = "auth_token";

/**
 * Get the stored authentication token
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Store the authentication token
 */
export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove the stored authentication token
 */
export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Get headers for authenticated requests
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

/**
 * Check if there's a stored token
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Verify the stored token with the backend
 */
export const verifyAuth = async (): Promise<boolean> => {
  try {
    const token = getToken();
    if (!token) return false;

    const response = await fetch("/api/auth", {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      removeToken();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Auth verification failed:", error);
    removeToken();
    return false;
  }
};

// API Error class for handling API-specific errors
export class APIError extends Error {
  constructor(message: string, public status: number, public data?: any) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Handle API responses and throw appropriate errors
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new APIError(
      error.message || "An error occurred",
      response.status,
      error
    );
  }
  return response.json();
}
