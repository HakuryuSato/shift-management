import { useCallback } from "react";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";
import type { AttendanceRowPersonal } from "@/types/Attendance";
import { updateAttendance, insertAttendance, updateAttendanceStamp } from "@/utils/client/serverActionClient";
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { hoursToMinutes } from '@/utils/common/dateUtils';
import type { Attendance } from "@/types/Attendance";
import { toJapanDateISOString } from "@/utils/common/dateUtils";

export function usePersonalAttendanceTableClickHandlers() {
  const AttendanceTablePersonalEditingCell = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalEditingCell
  );
  const setAttendanceTablePersonalEditingCell = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalEditingCell
  );
  const AttendanceTablePersonalTableRows = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalTableRows
  );
  const setAttendanceTablePersonalTableRows = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalTableRows
  );

  const adminAttendanceViewSelectedUser = useAdminAttendanceViewStore(
    (state) => state.adminAttendanceViewSelectedUser
  );

  const handleClickWorkTimeCell = useCallback(
    (rowIndex: number, field: keyof AttendanceRowPersonal) => {
      setAttendanceTablePersonalEditingCell({ rowIndex, field });
    },
    [setAttendanceTablePersonalEditingCell]
  );

  const handleBlurWorkTimeCell = useCallback(
    async (
      rowIndex: number,
      field: keyof AttendanceRowPersonal,
      newValue: string
    ) => {
      // 値に変更があるかチェック
      const originalRow = AttendanceTablePersonalTableRows[rowIndex];
      const originalValue = originalRow[field];

      if (originalValue !== newValue) {
        const attendanceId = originalRow.attendanceId;
        const userId = adminAttendanceViewSelectedUser?.user_id;

        if (!userId) {
          console.error('User ID is not available for insertion.');
          return;
        }

        // 送信用attendanceデータ作成 -------------------------------------------------
        // user_idを指定
        const attendance: Partial<Attendance> = {
          user_id: userId,
        };

        // 時間外または平日普通の時間を設定
        if (field === "regularHours") {
          attendance.work_minutes = hoursToMinutes(newValue);
        } else if (field === "overtimeHours") {
          attendance.overtime_minutes = hoursToMinutes(newValue);
        }




        // もし既に存在する出退勤データなら
        if (attendanceId) {
          // 更新ロジック
          attendance.attendance_id = attendanceId;
          const updatedResult = await updateAttendance(attendance);

          if (updatedResult && updatedResult.length > 0) {
            setAttendanceTablePersonalTableRows((prevRows) =>
              prevRows.map((row, idx) =>
                idx === rowIndex ? { ...row, [field]: newValue } : row
              )
            );
          }
        } else { // 存在しないなら
          // 日付を設定
          attendance.work_date = AttendanceTablePersonalTableRows[rowIndex].date;

          // 挿入ロジック
          const insertedResult = await insertAttendance(attendance);

          // ステートに戻り値を挿入し更新
          if (insertedResult && insertedResult.length > 0) {
            setAttendanceTablePersonalTableRows((prevRows) =>
              prevRows.map((row, idx) =>
                idx === rowIndex
                  ? {
                    ...row,
                    [field]: newValue,
                    attendanceId: insertedResult[0].attendance_id,
                  }
                  : row
              )
            );
          }
        }
      }

      setAttendanceTablePersonalEditingCell(null);
    },
    [
      AttendanceTablePersonalTableRows,
      setAttendanceTablePersonalEditingCell,
      setAttendanceTablePersonalTableRows,
      adminAttendanceViewSelectedUser,
    ]
  );

  /**
   * 打刻時間編集時にデータを更新する
   * @param rowIndex 行インデックス
   * @param field 変更対象のフィールド（"stampStartTime" | "stampEndTime"）
   * @param value 新しい時間値
   */
  const handleChangeStampTime = useCallback(
    async (rowIndex: number, field: "stampStartTime" | "stampEndTime", value: string) => {
      // 値に変更がない場合は処理を行わない
      const originalRow = AttendanceTablePersonalTableRows[rowIndex];
      const originalValue = originalRow[field];
      if (originalValue === value) return;

      // ユーザーIDが存在しない場合は処理を行わない
      const userId = adminAttendanceViewSelectedUser?.user_id;
      if (!userId) {
        console.error('User ID is not available for insertion.');
        return;
      }

      // 両方の打刻時間を取得
      const startTime = field === "stampStartTime" ? value : originalRow.stampStartTime;
      const endTime = field === "stampEndTime" ? value : originalRow.stampEndTime;

      let attendanceId = originalRow.attendanceId;
      let success = false;

      try {
        // 既存の出退勤データの場合
        if (attendanceId) {
          // 両方の打刻時間が存在する場合のみ時間集計を実行
          if (startTime && endTime) {
            await updateAttendanceStamp({
              attendance_id: attendanceId,
              stamp_start_time: startTime,
              stamp_end_time: endTime
            });
            success = true;
          }
        } else {
          // 新規の出退勤データの場合
          const initialAttendance: Partial<Attendance> = {
            user_id: userId,
            work_date: originalRow.date,
            [field === "stampStartTime" ? "stamp_start_time" : "stamp_end_time"]: value
          };

          // まず打刻時間のみで新規データを作成
          const insertedResult = await insertAttendance(initialAttendance);

          if (insertedResult && insertedResult.length > 0) {
            attendanceId = insertedResult[0].attendance_id;
            
            // 両方の打刻時間が存在する場合のみ時間集計を実行
            if (startTime && endTime) {
              await updateAttendanceStamp({
                attendance_id: attendanceId,
                stamp_start_time: startTime,
                stamp_end_time: endTime
              });
            }
            success = true;
          }
        }

        // 成功時のみテーブルの表示を更新
        if (success) {
          setAttendanceTablePersonalTableRows((prevRows) =>
            prevRows.map((row, idx) =>
              idx === rowIndex
                ? {
                  ...row,
                  [field]: value,
                  ...(attendanceId && { attendanceId })
                }
                : row
            )
          );
        }
      } catch (error) {
        console.error('Error updating attendance stamp:', error);
      }
    },
    [
      AttendanceTablePersonalTableRows,
      setAttendanceTablePersonalTableRows,
      adminAttendanceViewSelectedUser,
    ]
  );

  return {
    editingCell: AttendanceTablePersonalEditingCell,
    handleClickWorkTimeCell,
    handleBlurWorkTimeCell,
    handleChangeStampTime,
  };
}
