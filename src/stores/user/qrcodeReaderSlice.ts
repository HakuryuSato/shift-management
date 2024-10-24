import { create } from 'zustand';

interface QRCodeReaderState {
    isQRCodeReaderVisible: boolean;
    show: () => void;
    hide: () => void;
}

export const useQRCodeReaderStore = create<QRCodeReaderState>((set) => ({
    isQRCodeReaderVisible: false,
    show: () => set({ isQRCodeReaderVisible: true }),
    hide: () => set({ isQRCodeReaderVisible: false }),
}));
