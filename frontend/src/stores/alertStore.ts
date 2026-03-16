import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Alert, RealtimeEvent } from '@/types';

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
    }
  )
);
