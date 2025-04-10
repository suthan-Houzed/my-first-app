// utils/auth.ts

export const setAuthToken = (token: string) => {
  // Set cookie with proper options
  document.cookie = `auth-token=${token}; path=/; max-age=3600; secure; samesite=strict`;
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth-token');
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-token');
  }
};
