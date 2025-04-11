import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

interface Props {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export const DateDropdown: React.FC<Props> = ({ value, onChange, label = "日付" }) => {
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        label={label}
      >
        {dates.map((date) => (
          <MenuItem key={date} value={date}>
            {date}日
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}; 