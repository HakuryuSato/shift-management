import { create } from 'zustand';

interface UserSnackBarState {
  isUserSnackBarVisible: boolean;
  snackBarMessage: string;
  snackBarStatus: 'success' | 'error' | 'info' | 'warning';
  showUserSnackBar: (
    message: string,
    status: 'success' | 'error' | 'info' | 'warning'
  ) => void;
  hideUserSnackBar: () => void;
}

export const useUserSnackBarStore = create<UserSnackBarState>((set) => ({
  isUserSnackBarVisible: false,
  snackBarMessage: '',
  snackBarStatus: 'info',
  showUserSnackBar: (message, status) =>
    set({
      isUserSnackBarVisible: true,
      snackBarMessage: message,
      snackBarStatus: status,
    }),
  hideUserSnackBar: () => set({ isUserSnackBarVisible: false }),
}));
