import { create } from 'zustand';

interface AdminShiftViewState {
    isAdminShiftViewVisible: boolean;
    setIsAdminShiftViewVisible: (visible: boolean) => void;
}

export const useAdminShiftViewStore = create<AdminShiftViewState>((set) => ({
    isAdminShiftViewVisible: true,
    setIsAdminShiftViewVisible: (visible) => set({ isAdminShiftViewVisible: visible }),
}));