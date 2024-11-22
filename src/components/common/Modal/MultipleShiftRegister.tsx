import React from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
} from "@mui/material";
import ShiftTimeInputPerDay from "@/components/shift/ShiftTimeInputPerDay";
import { useMultipleShiftRegister } from "@/hooks/common/Modal/useMultipleShiftRegister";
import { useMultipleShiftRegisterClickHandlers } from "@/hooks/common/Modal/useMultipleShiftRegisterClickHandlers";

const MultipleShiftRegister: React.FC = () => {
  const {
    dayTimes,
    setDayTimes,
    isHolidayIncluded,
    setIsHolidayIncluded,
    isAutoShiftEnabled,
    error,
  } = useMultipleShiftRegister();

  const { handleSubmit } = useMultipleShiftRegisterClickHandlers();

  return (
    <>
      <DialogTitle>
        自動シフト登録設定 {isAutoShiftEnabled ? "：現在有効" : ""}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          height: "100%",
        }}
      >
        <Typography variant="body1">
          *毎月20日に、翌月1日から月末まで自動登録します
        </Typography>
        <Box display="flex" alignItems="center" sx={{ m: 2 }} />

        <ShiftTimeInputPerDay
          disabled={isAutoShiftEnabled}
          initialDayTimes={dayTimes}
          onChange={(data) => setDayTimes(data)}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <FormControlLabel
          label="祝日も登録する"
          control={
            <Checkbox
              checked={isHolidayIncluded}
              onChange={() => setIsHolidayIncluded(!isHolidayIncluded)}
              disabled={isAutoShiftEnabled}
            />
          }
          sx={{ mt: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          {isAutoShiftEnabled ? "無効にする" : "有効にする"}
        </Button>
      </DialogContent>
    </>
  );
};

export default MultipleShiftRegister;
