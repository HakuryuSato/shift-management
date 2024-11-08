import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';


export const UserDropdown: React.FC = () => (
  <FormControl fullWidth>
    <InputLabel>ユーザー名</InputLabel>
    <Select>
      <MenuItem value="User1">User1</MenuItem>
      <MenuItem value="User2">User2</MenuItem>
    </Select>
  </FormControl>
);


