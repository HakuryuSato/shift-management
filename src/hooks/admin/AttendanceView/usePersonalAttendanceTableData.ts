import { useEffect, useMemo } from 'react';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import {
  generateDateRange,
  formatDateStringToMM_DD_Day,
  formatTimeStringToHH_MM,
} from '@/utils/common/dateUtils';
import type { AttendanceRow } from '@/types/Attendance';
import { useAttendanceTablePersonalStore } from '@/stores/admin/AttendanceTablePersonalSlice';

// 個人出退勤テーブル用のデータを整形し、ストアにセットするためのフック
export function usePersonalAttendanceTableData() {
  const adminAttendanceViewSelectedUser = useAdminAttendanceViewStore(
    (state) => state.adminAttendanceViewSelectedUser
  );
  const adminAttendanceViewStartDate = useAdminAttendanceViewStore(
    (state) => state.adminAttendanceViewStartDate
  );
  const adminAttendanceViewEndDate = useAdminAttendanceViewStore(
    (state) => state.adminAttendanceViewEndDate
  );
  const adminAttendanceViewAllMembersMonthlyResult = useAdminAttendanceViewStore(
    (state) => state.adminAttendanceViewAllMembersMonthlyResult
  );

  const setPersonalAttendanceTableRows = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalTableRows
  );

  // 出退勤結果をMapに変換
  const attendancetMap = useMemo(() => {
    const map = new Map();
    adminAttendanceViewAllMembersMonthlyResult?.forEach((attendance) => {
      const dateString = attendance.adjusted_start_time?.split('T')[0];
      const key = `${attendance.user_id}_${dateString}`;
      map.set(key, attendance);
    });
    return map;
  }, [adminAttendanceViewAllMembersMonthlyResult]);


  // テーブル用のデータ作成
  useEffect(() => {
    if (!adminAttendanceViewSelectedUser) return;

    // 日付範囲の生成
    const dateRange = generateDateRange(
      adminAttendanceViewStartDate,
      adminAttendanceViewEndDate
    );

    const newRows: AttendanceRow[] = dateRange.map((date) => {
      const dateString = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      const key = `${adminAttendanceViewSelectedUser.user_id}_${dateString}`;

      // 当日の出退勤結果を取得
      const attendance = attendancetMap.get(key);


      // 日付のフォーマット 'MM/DD(曜日)'
      const formattedDate = formatDateStringToMM_DD_Day(date);

      // 平日普通(H)
      const workMinutes = attendance?.work_minutes ?? 0;
      const regularHours = Math.round((workMinutes / 60) * 2) / 2;

      // 平日時間外(H)
      const overtimeMinutes = attendance?.overtime_minutes ?? 0;
      const overtimeHours = Math.round((overtimeMinutes / 60) * 2) / 2;

      // 開始と終了
      const adjustedStartTime = attendance?.adjusted_start_time
        ? formatTimeStringToHH_MM(new Date(attendance.adjusted_start_time))
        : '';

      const adjustedEndTime = attendance?.adjusted_end_time
        ? formatTimeStringToHH_MM(new Date(attendance.adjusted_end_time))
        : '';

      // 休憩
      const restMinutes = attendance?.rest_minutes ?? 0;
      const breakHours = Math.round((restMinutes / 60) * 2) / 2;

      // 打刻開始と終了
      const stampStartTime = attendance?.stamp_start_time
        ? formatTimeStringToHH_MM(new Date(attendance.stamp_start_time))
        : '';

      const stampEndTime = attendance?.stamp_end_time
        ? formatTimeStringToHH_MM(new Date(attendance.stamp_end_time))
        : '';

      return {
        date: formattedDate,
        regularHours: regularHours.toFixed(1),
        overtimeHours: overtimeHours.toFixed(1),
        adjustedStartTime: adjustedStartTime,
        adjustedEndTime: adjustedEndTime,
        breakHours: breakHours.toFixed(1),
        stampStartTime:stampStartTime,
        stampEndTime:stampEndTime,
        attendanceId: attendance?.attendance_id,
      };
    });

    setPersonalAttendanceTableRows(newRows);
  }, [
    adminAttendanceViewSelectedUser,
    adminAttendanceViewStartDate,
    adminAttendanceViewEndDate,
    attendancetMap,
    setPersonalAttendanceTableRows,
  ]);
}
