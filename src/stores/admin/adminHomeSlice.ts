import { create } from 'zustand';
import type { User } from '@/types/User';

interface AdminHomeState {
  adminHomeMode: 'SHIFT' | 'MONTHLY_ATTENDANCE' | 'PERSONAL_ATTENDANCE';
  setAdminHomeMode: (mode: 'SHIFT' | 'MONTHLY_ATTENDANCE' | 'PERSONAL_ATTENDANCE') => void;
  adminHomeUsersData: User[] | null;
  setAdminHomeUsersData: (users: User[]) => void;
}

export const useAdminHomeStore = create<AdminHomeState>((set) => ({
  adminHomeMode: 'SHIFT',
  setAdminHomeMode: (mode) => set({ adminHomeMode: mode }),
  adminHomeUsersData: null,
  setAdminHomeUsersData: (users) => set({ adminHomeUsersData: users }),
}));
