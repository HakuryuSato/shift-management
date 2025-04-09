import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useAdminClosingDateFormStore } from "@/stores/admin/adminClosingDateFormSlice";

export const ClosingDateContent: React.FC = () => {
  const adminClosingDateFormDate = useAdminClosingDateFormStore(
    (state) => state.adminClosingDateFormDate
  );
  const setAdminClosingDateFormDate = useAdminClosingDateFormStore(
    (state) => state.setAdminClosingDateFormDate
  );

  return (
    <Box>
      <Typography variant="body1" mb={2}>
        新しい締め日を選択してください
      </Typography>
      <TextField
        type="date"
        value={adminClosingDateFormDate}
        onChange={(e) => setAdminClosingDateFormDate(e.target.value)}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Box>
  );
}; 