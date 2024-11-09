import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

interface TimeDropdownProps {
  label?: string;
  value?: string;
  onChange: (time: string) => void;
  error?: boolean;
  helperText?: string;
}

export const TimeDropdown: React.FC<TimeDropdownProps> = ({
  label,
  value = "",
  onChange,
  error = false,
  helperText = "",
}) => {
  const timeOptions = [
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
  ];

  function formatTime(timeStr: string): string {
    return timeStr.length === 8 ? timeStr.slice(0, 5) : timeStr;
  }

  return (
    <FormControl
      variant="outlined"
      size="small"
      error={error}
      sx={{ minWidth: 120 }}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={formatTime(value) || ""}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        {timeOptions.map((time) => (
          <MenuItem key={time} value={time}>
            {time}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};