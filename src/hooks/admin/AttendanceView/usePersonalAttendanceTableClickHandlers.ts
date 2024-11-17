import { useCallback } from "react";
import { usePersonalAttendanceTableData } from "./usePersonalAttendanceTableData";
import type { AttendanceRow } from "@/types/Attendance";

export function usePersonalAttendanceTableClickHandlers() {
  const { setEditingCell, setRows, editingCell } = usePersonalAttendanceTableData();

  const handleClickCell = useCallback(
    (rowIndex: number, field: keyof AttendanceRow) => {
      setEditingCell({ rowIndex, field });
    },
    [setEditingCell]
  );

  const handleCellChange = useCallback(
    (
      rowIndex: number,
      field: keyof AttendanceRow,
      value: string
    ) => {
      setRows((prevRows) =>
        prevRows.map((row, idx) =>
          idx === rowIndex ? { ...row, [field]: value } : row
        )
      );
      console.log(`Value changed in row ${rowIndex}, field ${field}`);
    },
    [setRows]
  );

  const handleBlur = useCallback(() => {
    setEditingCell(null);
  }, [setEditingCell]);

  return {
    editingCell,
    handleClickCell,
    handleCellChange,
    handleBlur,
  };
}
