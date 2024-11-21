import { create } from 'zustand';

interface AdminHomeTopBarStore {
    adminHomeTopBarTitleText: string;
    setAdminHomeTopBarTitleText: (text: string) => void;

    isVisibleAdminHomeTopBarUserEditButtons: boolean;
    showAdminHomeTopBarUserEditButtons: () => void;
    hideAdminHomeTopBarUserEditButtons: () => void;

    isVisibleAdminHomeTopBarExcelDownloadButton: boolean;
    showAdminHomeTopBarExcelDownloadButton: () => void;
    hideAdminHomeTopBarExcelDownloadButton: () => void;
}

export const useAdminHomeTopBarStore = create<AdminHomeTopBarStore>((set) => ({
    adminHomeTopBarTitleText: '',
    setAdminHomeTopBarTitleText: (text: string) => set({ adminHomeTopBarTitleText: text }),

    isVisibleAdminHomeTopBarUserEditButtons: true,
    showAdminHomeTopBarUserEditButtons: () => set({ isVisibleAdminHomeTopBarUserEditButtons: true }),
    hideAdminHomeTopBarUserEditButtons: () => set({ isVisibleAdminHomeTopBarUserEditButtons: false }),

    isVisibleAdminHomeTopBarExcelDownloadButton: true,
    showAdminHomeTopBarExcelDownloadButton: () => set({ isVisibleAdminHomeTopBarExcelDownloadButton: true }),
    hideAdminHomeTopBarExcelDownloadButton: () => set({ isVisibleAdminHomeTopBarExcelDownloadButton: false }),
}));
