import { create } from 'zustand';

interface AdminHomeTopBarStore {
    isVisibleAdminHomeTopBarUserEditButtons: boolean;
    showAdminHomeTopBarUserEditButtons: () => void;
    hideAdminHomeTopBarUserEditButtons: () => void;

    isVisibleAdminHomeTopBarExcelDownloadButton: boolean;
    showAdminHomeTopBarExcelDownloadButton: () => void;
    hideAdminHomeTopBarExcelDownloadButton: () => void;
}

export const useAdminHomeTopBarStore = create<AdminHomeTopBarStore>((set) => ({
    isVisibleAdminHomeTopBarUserEditButtons: true,
    showAdminHomeTopBarUserEditButtons: () => set({ isVisibleAdminHomeTopBarUserEditButtons: true }),
    hideAdminHomeTopBarUserEditButtons: () => set({ isVisibleAdminHomeTopBarUserEditButtons: false }),

    isVisibleAdminHomeTopBarExcelDownloadButton: true,
    showAdminHomeTopBarExcelDownloadButton: () => set({ isVisibleAdminHomeTopBarExcelDownloadButton: true }),
    hideAdminHomeTopBarExcelDownloadButton: () => set({ isVisibleAdminHomeTopBarExcelDownloadButton: false }),
}));
