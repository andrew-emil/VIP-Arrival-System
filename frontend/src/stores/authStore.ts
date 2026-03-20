import { ILoginResponse, logout as apiLogout } from '@/services/auth';
import { Role } from '@/services/users';
import { create } from 'zustand';


interface AuthState {
  user: ILoginResponse | null;
  isAuthenticated: boolean;
  login: (user: ILoginResponse) => void;
  logout: () => Promise<void>;
  hasRole: (roles: Role[]) => boolean;
}

const getStoredUser = (): ILoginResponse | null => {
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
