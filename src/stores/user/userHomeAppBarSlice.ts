import { create } from 'zustand';

export type UserHomeAppBarView = 'Home' | 'Notifications' | 'Guide' | string;

interface UserHomeAppBarMenuItem {
  id: UserHomeAppBarView;
  label: string;
}

interface UserHomeAppBarState {
  // 現在のビュー（Home、Notifications、Guideなど）
  userHomeAppBarCurrentView: UserHomeAppBarView;
  setUserHomeAppBarCurrentView: (view: UserHomeAppBarView) => void;

  // Drawer（ハンバーガーメニュー）の状態
  isUserHomeAppBarDrawerOpen: boolean;
  openUserHomeAppBarDrawer: () => void;
  closeUserHomeAppBarDrawer: () => void;

  // メニュー項目のリスト
  userHomeAppBarMenuItems: UserHomeAppBarMenuItem[];
}

export const useUserHomeAppBarStore = create<UserHomeAppBarState>((set) => ({
  // 初期状態
  userHomeAppBarCurrentView: 'Home',
  isUserHomeAppBarDrawerOpen: false,
  userHomeAppBarMenuItems: [
    { id: 'Notifications', label: 'お知らせ' },
    { id: 'Guide', label: '使い方' },
    // 将来的にメニュー項目を追加可能
  ],

  // 現在のビューを設定するアクション
  setUserHomeAppBarCurrentView: (view) => set({ userHomeAppBarCurrentView: view }),

  // Drawerを操作するアクション
  openUserHomeAppBarDrawer: () => set({ isUserHomeAppBarDrawerOpen: true }),
  closeUserHomeAppBarDrawer: () => set({ isUserHomeAppBarDrawerOpen: false }),
}));
