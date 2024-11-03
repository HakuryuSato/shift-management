
import { create } from "zustand";

interface AdminUserManagementFormState {
  isAdminUserManagementFormVisible: boolean;
  mode: "register" | "delete";
  userName: string;
  employmentType: "full_time" | "part_time";
  openAdminUserManagementForm: (mode: "register" | "delete") => void;
  closeAdminUserManagementForm: () => void;
  setUserName: (userName: string) => void;
  setEmploymentType: (employmentType: "full_time" | "part_time") => void;
}

export const useAdminUserManagementFormStore = create<AdminUserManagementFormState>(
  (set) => ({
    isAdminUserManagementFormVisible: false,
    mode: "register",
    userName: "",
    employmentType: "full_time",
    openAdminUserManagementForm: (mode) =>
      set({ isAdminUserManagementFormVisible: true, mode }),
    closeAdminUserManagementForm: () =>
      set({
        isAdminUserManagementFormVisible: false,
        userName: "",
        employmentType: "full_time",
      }),
    setUserName: (userName) => set({ userName }),
    setEmploymentType: (employmentType) => set({ employmentType }),
  })
);
