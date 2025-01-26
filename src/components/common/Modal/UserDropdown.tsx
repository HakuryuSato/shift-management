import React, { useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useAdminHomeStore } from "@/stores/admin/adminHomeSlice";
import { useModalContentStore } from "@/stores/common/modalContentSlice";

export const UserDropdown: React.FC = () => {
  // ユーザー全員分
  const adminHomeUsersData = useAdminHomeStore((state) =>
    state.adminHomeUsersData
  );

  // 選択されたユーザー用State,Set関数
  const modalContentSelectedUser = useModalContentStore(
    (state) => state.modalContentSelectedUser
  );
  const setModalContentSelectedUser = useModalContentStore(
    (state) => state.setModalContentSelectedUser
  );

  // 変更時にGlobalStateへ
  const handleChange = (event: SelectChangeEvent) => {
    const selectedUserName = event.target.value;
    
    const selectedUser = adminHomeUsersData?.find(
      (user) => user.user_name === selectedUserName
    ) || null;
    
    setModalContentSelectedUser(selectedUser);
  };

  useEffect(() => {
    // フィルタリングされたユーザーリストの最初のユーザーを自動選択
    const filteredUsers = adminHomeUsersData?.filter(user => user.employment_type === 'part_time') || [];
    if (filteredUsers.length > 0 && !modalContentSelectedUser) {
      setModalContentSelectedUser(filteredUsers[0]);
    }
  }, [adminHomeUsersData, modalContentSelectedUser, setModalContentSelectedUser]);

  return (
    <FormControl fullWidth>
      <InputLabel>ユーザー名</InputLabel>
      <Select
        value={modalContentSelectedUser?.user_name || ''}
        onChange={handleChange}
        label="ユーザー名"
        sx={{ minWidth: '150px' }}
      >
        {adminHomeUsersData?.filter(user => user.employment_type === 'part_time').map((user, index) => (
          <MenuItem key={index} value={user.user_name}>
            {user.user_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
