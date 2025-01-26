import React, { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useAdminHomeStore } from "@/stores/admin/adminHomeSlice";

export const UserDropdown: React.FC = () => {
  const adminHomeUsersData = useAdminHomeStore((state) =>
    state.adminHomeUsersData
  );
  const [selectedUser, setSelectedUser] = useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedUser(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>ユーザー名</InputLabel>
      <Select
        value={selectedUser}
        onChange={handleChange}
        label="ユーザー名"
        sx={{ minWidth: '150px' }}
      >
        {adminHomeUsersData?.map((user, index) => (
          <MenuItem key={index} value={user.user_name}>
            {user.user_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
