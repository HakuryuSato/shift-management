import { styled } from "@mui/material/styles";
import { Table } from "@mui/material";
import { Theme } from "@mui/material/styles/createTheme";
import { TableStyleAttendance } from "./TableStyleAttendance";

export const TableStyleAttendancePersonal = styled(Table)(({ theme }: { theme: Theme }) => ({
  ...TableStyleAttendance({ theme }),
  "& td:nth-of-type(2), & td:nth-of-type(3)": {
    position: "relative",
    "&:hover": {
      backgroundColor: "lightgrey !important",
    },
  },
}));
