import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { Alert, RealtimeEvent } from '@/types';

// Custom storage for IndexedDB using idb-keyval
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

interface AlertState {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  setAlerts: (alerts: Alert[]) => void;
  acknowledgeAlert: (id: string) => void;
  confirmAlert: (id: string) => void;
  rejectAlert: (id: string) => void;
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set) => ({
      alerts: [],
      addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts] })),
      setAlerts: (alerts) => set({ alerts }),
      acknowledgeAlert: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) => (a.id === id ? { ...a, status: RealtimeEvent.VIP_CONFIRMED } : a)),
        })),
      confirmAlert: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) => (a.id === id ? { ...a, status: RealtimeEvent.VIP_CONFIRMED } : a)),
        })),
      rejectAlert: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) => (a.id === id ? { ...a, status: RealtimeEvent.VIP_REJECTED } : a)),
        })),
    }),
    {
      name: 'alert-store',
      storage: createJSONStorage(() => storage),
    }
  )
);
