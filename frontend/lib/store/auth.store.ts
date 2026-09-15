import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthUser } from '@/types';

interface AuthState {
  user:         AuthUser | null;
  accessToken:  string | null;
  refreshToken: string | null;
  setAuth:      (user: AuthUser, accessToken: string, refreshToken: string) => void;
  setAccessToken:(token: string) => void;
  clearAuth:    () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,

      setAuth: (user, accessToken, refreshToken) => {
        if (typeof document !== 'undefined') {
          document.cookie = `cc_auth=true; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `cc_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
        }
        set({ user, accessToken, refreshToken });
      },

      setAccessToken: (accessToken) =>
        set({ accessToken }),

      clearAuth: () => {
        if (typeof document !== 'undefined') {
          document.cookie = `cc_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
          document.cookie = `cc_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    {
      name:    'campusconnect-auth',
      storage: createJSONStorage(() => localStorage),
      // Only persist refresh token + user; access token refreshed on demand
      partialize: (state) => ({
        user:         state.user,
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
