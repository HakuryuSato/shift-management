import { useCallback } from "react";
import { usePersonalAttendanceTableData } from "./usePersonalAttendanceTableData";
import type { AttendanceRow } from "@/types/Attendance";

export function usePersonalAttendanceTableClickHandlers() {
  const { setEditingCell, setRows } = usePersonalAttendanceTableData();

  const handleClickCell = useCallback(
    (rowIndex: number, field: keyof AttendanceRow) => {
      setEditingCell({ rowIndex, field });
    },
    [setEditingCell]
  );

  const handleChangeCellInput = useCallback(
    (rowIndex: number, field: keyof AttendanceRow, value: string) => {
      setRows((prevRows) =>
        prevRows.map((row, idx) =>
          idx === rowIndex ? { ...row, [field]: value } : row
        )
      );
      console.log(`Value changed in row ${rowIndex}, field ${field}`);
    },
    [setRows]
  );

  return { handleClickCell, handleChangeCellInput };
}
