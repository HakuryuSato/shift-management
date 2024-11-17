// src/hooks/admin/AttendanceView/usePersonalAttendanceTableData.ts
import { useEffect } from 'react';
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
  const adminAttendanceViewAllMembersMonthlyStamps = useAdminAttendanceViewStore(
    (state) => state.adminAttendanceViewAllMembersMonthlyStamps
  );

  const setPersonalAttendanceTableRows = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalTableRows
  );

  useEffect(() => {
    if (!adminAttendanceViewSelectedUser) return;

    // 日付範囲の生成
    const dateRange = generateDateRange(
      adminAttendanceViewStartDate,
      adminAttendanceViewEndDate
    );

    const newRows: AttendanceRow[] = dateRange.map((date) => {
      const dateString = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'

      // 当日の出退勤結果を取得
      const attendanceResult = adminAttendanceViewAllMembersMonthlyResult?.find(
        (result) =>
          result.attendance_stamps?.user_id === adminAttendanceViewSelectedUser.user_id &&
          result.work_start_time?.startsWith(dateString)
      );

      // 当日の打刻データを取得
      const attendanceStamp = adminAttendanceViewAllMembersMonthlyStamps?.find(
        (stamp) =>
          stamp.user_id === adminAttendanceViewSelectedUser.user_id &&
          stamp.start_time.startsWith(dateString)
      );

      // 日付のフォーマット 'MM/DD(曜日)'
      const formattedDate = formatDateStringToMM_DD_Day(date);

      // 平日普通(H)
      const workMinutes = attendanceResult?.work_minutes ?? 0;
      const regularHours = Math.round((workMinutes / 60) * 2) / 2;

      // 平日時間外(H)
      const overtimeMinutes = attendanceResult?.overtime_minutes ?? 0;
      const overtimeHours = Math.round((overtimeMinutes / 60) * 2) / 2;

      // 開始と終了
      const startTime = attendanceResult?.work_start_time
        ? formatTimeStringToHH_MM(new Date(attendanceResult.work_start_time))
        : '';

      const endTime = attendanceResult?.work_end_time
        ? formatTimeStringToHH_MM(new Date(attendanceResult.work_end_time))
        : '';

      // 休憩
      const restMinutes = attendanceResult?.rest_minutes ?? 0;
      const breakHours = Math.round((restMinutes / 60) * 2) / 2;

      // 打刻開始と終了
      const stampStartTime = attendanceStamp?.start_time
        ? formatTimeStringToHH_MM(new Date(attendanceStamp.start_time))
        : '';

      const stampEndTime = attendanceStamp?.end_time
        ? formatTimeStringToHH_MM(new Date(attendanceStamp.end_time))
        : '';

      return {
        date: formattedDate,
        regularHours: regularHours.toFixed(1),
        overtimeHours: overtimeHours.toFixed(1),
        startTime,
        endTime,
        breakHours: breakHours.toFixed(1),
        stampStartTime,
        stampEndTime,
        attendanceId: attendanceResult?.attendance_id,
      };
    });

    setPersonalAttendanceTableRows(newRows);
  }, [
    adminAttendanceViewSelectedUser,
    adminAttendanceViewStartDate,
    adminAttendanceViewEndDate,
    adminAttendanceViewAllMembersMonthlyResult,
    adminAttendanceViewAllMembersMonthlyStamps,
    setPersonalAttendanceTableRows,
  ]);
}
