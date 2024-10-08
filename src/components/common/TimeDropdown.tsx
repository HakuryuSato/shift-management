import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

interface TimeDropdownProps {
  label?: string;
  value?: string;
  onChange: (time: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({
  label,
  value,
  onChange,
  error = false,
  helperText = "",
  disabled = false,
}) => {
  const timeOptions = [];
  for (let hour = 8; hour <= 21; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, "0")}:00`);
    timeOptions.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  return (
    <FormControl variant="outlined" size="small" fullWidth error={error} disabled={disabled}>
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
