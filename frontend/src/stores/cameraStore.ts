import { create } from 'zustand';
import { Camera } from '@/types';
import { mockCameras } from '@/data/mock';

interface CameraState {
  cameras: Camera[];
  updateCamera: (id: string, data: Partial<Camera>) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  cameras: [...mockCameras],
  updateCamera: (id, data) =>
    set((s) => ({ cameras: s.cameras.map((c) => (c.id === id ? { ...c, ...data } : c)) })),
}));
