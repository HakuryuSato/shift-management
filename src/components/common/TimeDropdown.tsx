// src/components/common/TimeDropdown.tsx
import React from "react";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

interface TimeDropdownProps {
  label?: string;
  value?: string;
  onChange: (time: string) => void;
  error?: boolean;
  helperText?: string;
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText = "",
}) => {
  const timeOptions = [
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

  return (
    <FormControl variant="outlined" size="small" fullWidth error={error}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        <MenuItem value="">
          <em>--</em>
        </MenuItem>
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

export default TimeDropdown;
