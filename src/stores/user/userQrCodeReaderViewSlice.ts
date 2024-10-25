import { create } from 'zustand';

interface UserQrCodeReaderViewState {
  isQRCodeReaderVisible: boolean;
  showQRCodeReader: () => void;
  hideQRCodeReader: () => void;
}

export const useUserQrCodeReaderViewStore = create<UserQrCodeReaderViewState>((set) => ({
  isQRCodeReaderVisible: false,
  showQRCodeReader: () => set({ isQRCodeReaderVisible: true }),
  hideQRCodeReader: () => set({ isQRCodeReaderVisible: false }),
}));
