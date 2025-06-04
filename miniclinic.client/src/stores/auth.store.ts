import { create } from 'zustand';
import { authService } from '@/services/auth.service';
import { UserModel } from '@/types';
import { LoginCredentials } from '@/api/mutation/user.mutation';

// Define authentication store state
interface AuthState {
  user: UserModel | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: UserModel) => void;
}

// Create authentication store
export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  isLoading: false,
  error: null,
  isAuthenticated: authService.isAuthenticated(),

  // Set user method
  setUser: (user: UserModel) => {
    set({ user, isAuthenticated: true });
  },

  // Login action - kept for backward compatibility
  login: async (_credentials: LoginCredentials) => {
    try {
      set({ isLoading: true, error: null });
      // This is kept for backward compatibility
      // The actual login process is now handled in the Login component
      set({ isLoading: false, isAuthenticated: true });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to login',
        isAuthenticated: false
      });
    }
  },

  // Logout action
  logout: async () => {
    try {
      set({ isLoading: true });
      await authService.logout();
      set({
        user: null,
        isLoading: false,
        isAuthenticated: false
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to logout'
      });
    }
  },

  // Clear error action
  clearError: () => set({ error: null })
}));
