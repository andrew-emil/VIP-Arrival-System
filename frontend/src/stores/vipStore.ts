import { create } from 'zustand';
import { IVip } from '@/services/vip';

interface VipState {
  vipList: IVip[];
  addVip: (vip: IVip) => void;
  updateVip: (id: string, data: Partial<IVip>) => void;
  deleteVip: (id: string) => void;
}

export const useVipStore = create<VipState>((set) => ({
  vipList: [],
  addVip: (vip) => set((s) => ({ vipList: [...s.vipList, vip] })),
  updateVip: (id, data) =>
    set((s) => ({ vipList: s.vipList.map((v) => (v.id === id ? { ...v, ...data } : v)) })),
  deleteVip: (id) => set((s) => ({ vipList: s.vipList.filter((v) => v.id !== id) })),
}));
