import { Theme } from "@mui/material/styles/createTheme";

export const TableStyleAttendance = ({ theme }: { theme: Theme }) => ({
  width: "auto",
  margin: "0 auto",
  "& th, & td": {
    border: "1px solid #ccc",
    padding: "4px",
    textAlign: "center",
    fontSize: "0.8rem",
    minWidth: "150px",
  },
  "& tr:nth-of-type(even) td": {
    backgroundColor: theme.palette.action.hover,
  },
  "& td:nth-of-type(2), & th:nth-of-type(2)": {
    borderRight: "2px solid #ccc",
  },
  "& tr:nth-of-type(3) th": {
    borderBottom: "2px solid #ccc",
  },
});
