import { create } from 'zustand';
import { VIP } from '@/types';
import { mockVIPs } from '@/data/mock';

interface VipState {
  vipList: VIP[];
  addVip: (vip: VIP) => void;
  updateVip: (id: string, data: Partial<VIP>) => void;
  deleteVip: (id: string) => void;
}

export const useVipStore = create<VipState>((set) => ({
  vipList: [...mockVIPs],
  addVip: (vip) => set((s) => ({ vipList: [...s.vipList, vip] })),
  updateVip: (id, data) =>
    set((s) => ({ vipList: s.vipList.map((v) => (v.id === id ? { ...v, ...data } : v)) })),
  deleteVip: (id) => set((s) => ({ vipList: s.vipList.filter((v) => v.id !== id) })),
}));
