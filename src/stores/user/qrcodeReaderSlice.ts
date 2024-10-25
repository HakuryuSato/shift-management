import { create } from 'zustand';

interface QRCodeReaderState {
  isQRCodeReaderVisible: boolean;
  showQRCodeReader: () => void;
  hideQRCodeReader: () => void;
}

export const useQRCodeReaderStore = create<QRCodeReaderState>((set) => ({
  isQRCodeReaderVisible: false,
  showQRCodeReader: () => set({ isQRCodeReaderVisible: true }),
  hideQRCodeReader: () => set({ isQRCodeReaderVisible: false }),
}));
