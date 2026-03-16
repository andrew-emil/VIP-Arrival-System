import { ILoginResponse } from '@/services/auth';
import { Role } from '@/services/users';
import { create } from 'zustand';


interface AuthState {
  user: ILoginResponse | null;
  isAuthenticated: boolean;
  login: (user: ILoginResponse) => void;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
}

const getStoredUser = (): ILoginResponse | null => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

const storedUser = getStoredUser();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storedUser,
  isAuthenticated: !!storedUser,
  login: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },
  hasRole: (roles) => {
    const { user } = get();
    return !!user && roles.includes(user.role);
  },
}));
