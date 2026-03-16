import { create } from 'zustand';
import { VASEvent } from '@/types';
import { mockEvents } from '@/data/mock';

interface EventState {
  events: VASEvent[];
  activeEventId: string | null;
  addEvent: (event: VASEvent) => void;
  updateEvent: (id: string, data: Partial<VASEvent>) => void;
  setActiveEvent: (id: string | null) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: [...mockEvents],
  activeEventId: 'e1',
  addEvent: (event) => set((s) => ({ events: [...s.events, event] })),
  updateEvent: (id, data) =>
    set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, ...data } : e)) })),
  setActiveEvent: (id) => set({ activeEventId: id }),
}));
