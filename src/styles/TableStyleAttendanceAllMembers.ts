import { styled } from "@mui/material/styles";
import { Table } from "@mui/material";
import { Theme } from "@mui/material/styles/createTheme";
import { TableStyleAttendance } from "./TableStyleAttendance";

export const TableStyleAttendanceAllMembers = styled(Table)(({ theme }: { theme: Theme }) => ({
  ...TableStyleAttendance({ theme }),
}));
