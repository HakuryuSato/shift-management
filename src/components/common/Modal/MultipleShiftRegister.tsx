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
import ShiftTimeInputPerDay from "@/components/shift/OldShiftTimeInputPerDay";
import { useMultipleShiftRegister } from "@/hooks/common/Modal/useMultipleShiftRegister";

export const MultipleShiftRegister: React.FC = () => {
  const {
    dayTimes,
    setDayTimes,
    isHolidayIncluded,
    setIsHolidayIncluded,
    isAutoShiftEnabled,
    error,
  } = useMultipleShiftRegister();

  return (
    <>
      <Typography sx={{ textAlign: "center" }}>
        曜日でまとめて登録{isAutoShiftEnabled ? "：現在有効" : ""}
      </Typography>

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

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            mt: 2,
          }}
        >
          <FormControlLabel
            label="祝日も登録する"
            control={
              <Checkbox
                checked={isHolidayIncluded}
                onChange={() => setIsHolidayIncluded(!isHolidayIncluded)}
                disabled={isAutoShiftEnabled}
              />
            }
          />

          <FormControlLabel
            label="毎月20日に自動で登録する"
            control={
              <Checkbox
                checked={isHolidayIncluded}
                onChange={() => setIsHolidayIncluded(!isHolidayIncluded)}
                disabled={isAutoShiftEnabled}
              />
            }
          />
        </Box>
      </DialogContent>
    </>
  );
};
