import React from "react";
import {
  Alert,
  Box,
  Checkbox,
  DialogContent,
  FormControlLabel,
  Typography,
} from "@mui/material";
import ShiftTimeInputPerDay from "@/components/shift/OldShiftTimeInputPerDay";
import { useMultipleShiftRegister } from "@/hooks/common/Modal/useMultipleShiftRegister";
import { useMultipleShiftRegisterStore } from "@/stores/common/multipleShiftRegisterSlice";

export const MultipleShiftRegister: React.FC = () => {
  const {
    setDayTimes,
    setIsHolidayIncluded,
    setIsAutoShiftEnabled,
    error,
  } = useMultipleShiftRegister();

  const multipleShiftRegisterIsCronJobsEnabled = useMultipleShiftRegisterStore(
    (state) => state.multipleShiftRegisterIsCronJobsEnabled,
  );
  const dayTimes = useMultipleShiftRegisterStore(
    (state) => state.multipleShiftRegisterDayTimes,
  );
  const isHolidayIncluded = useMultipleShiftRegisterStore(
    (state) => state.multipleShiftRegisterIsHolidayIncluded,
  );
  const isAutoShiftEnabled = useMultipleShiftRegisterStore(
    (state) => state.multipleShiftRegisterIsAutoShiftEnabled,
  );

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
          disabled={multipleShiftRegisterIsCronJobsEnabled}
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
                onChange={(event) => setIsHolidayIncluded(event.target.checked)}
                disabled={multipleShiftRegisterIsCronJobsEnabled}
              />
            }
          />

          <FormControlLabel
            label="毎月20日に自動で登録する"
            control={
              <Checkbox
                checked={isAutoShiftEnabled}
                onChange={(event) => setIsAutoShiftEnabled(event.target.checked)}
                disabled={multipleShiftRegisterIsCronJobsEnabled}
              />
            }
          />
        </Box>
      </DialogContent>
    </>
  );
};
