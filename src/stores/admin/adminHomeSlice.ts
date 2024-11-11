import { create } from 'zustand';

interface AdminHomeState {
    adminHomeMode: 'SHIFT' | 'ATTENDANCE';
    setAdminHomeMode: (mode: 'SHIFT' | 'ATTENDANCE') => void;
}

export const useAdminHomeStore = create<AdminHomeState>((set) => ({
    adminHomeMode: 'SHIFT',
    setAdminHomeMode: (mode) => set({ adminHomeMode: mode }),
}));
