// import React from "react";
// import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import { useAdminHomeStore } from "@/stores/admin/adminHomeSlice";

// export const UserDropdown: React.FC = () => {
//   const adminHomeUsersData = useAdminHomeStore((state) =>
//     state.adminHomeUsersData
//   );

//   return (
//     <FormControl fullWidth>
//       <InputLabel>ユーザー名</InputLabel>
//       <Select>
//         {adminHomeUsersData?.map((user, index) => (
//           <MenuItem key={index} value={user.user_name}>
//             {user.user_name}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// };
