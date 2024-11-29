import { create } from "zustand";

interface AdminUserManagementFormState {
  isVisibleAdminUserManagementForm: boolean;
  adminUserManagementFormMode: "register" | "delete";
  openAdminUserManagementForm: (mode: "register" | "delete") => void;
  closeAdminUserManagementForm: () => void;
}

export const useAdminUserManagementFormStore = create<AdminUserManagementFormState>(
  (set) => ({
    isVisibleAdminUserManagementForm: false,
    adminUserManagementFormMode: "register",
    openAdminUserManagementForm: (mode) =>
      set({ isVisibleAdminUserManagementForm: true, adminUserManagementFormMode: mode }),
    closeAdminUserManagementForm: () =>
      set({
        isVisibleAdminUserManagementForm: false,
      }),
  })
);
