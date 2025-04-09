import { Box, TextField, Typography } from "@mui/material";
import { useAdminClosingDateFormStore } from "../../stores/admin/adminClosingDateFormSlice";

export const AdminClosingDateForm = () => {
  const { isVisibleAdminClosingDateForm, closeAdminClosingDateForm, adminClosingDateFormDate, setAdminClosingDateFormDate } = useAdminClosingDateFormStore();

  if (!isVisibleAdminClosingDateForm) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={closeAdminClosingDateForm}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: 2,
          borderRadius: 1,
          width: "300px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Typography variant="h6" gutterBottom>
          締め日を変更
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
    </Box>
  );
}; 