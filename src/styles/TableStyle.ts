import { styled } from '@mui/material/styles';
import { Table } from '@mui/material';

export const TableStyle = styled(Table)(({ theme }) => ({
  // 共通
  "& th, & td": {
    border: "1px solid #ccc", // 全てのヘッダーとセルに罫線
    padding: "4px",
    textAlign: "center",
    fontSize: "0.8rem",
  },

  // 偶数行に色を付ける
  "& tr:nth-of-type(even) td": {
    backgroundColor: theme.palette.action.hover,
  },

  // ヘッダーとデータの境界線は太めにする
  "& td:nth-of-type(2), & th:nth-of-type(2)": {
    // th,tdの2列目右
    borderRight: "2px solid #ccc",
  },
  "& tr:nth-of-type(3) th": {
    // thの3行目下
    borderBottom: "2px solid #ccc",
  },
}));
