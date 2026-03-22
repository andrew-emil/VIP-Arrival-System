import { logout as apiLogout } from '@/services/auth';
import { IStoredUser, Role } from '@/services/users';
import { create } from 'zustand';


interface AuthState {
  user: IStoredUser | null;
  isAuthenticated: boolean;
  login: (user: IStoredUser) => void;
  logout: () => Promise<void>;
  hasRole: (roles: Role[]) => boolean;
}

const getStoredUser = (): IStoredUser | null => {
  try {
    const raw = sessionStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    sessionStorage.removeItem('user');
    return null;
  }
};

const storedUser = getStoredUser();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storedUser,
  isAuthenticated: !!storedUser,
  login: (user) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  logout: async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      sessionStorage.removeItem('user');
      set({ user: null, isAuthenticated: false });
    }
  },
  hasRole: (roles) => {
    const { user } = get();
    return !!user && roles.includes(user.role);
  },
}));
