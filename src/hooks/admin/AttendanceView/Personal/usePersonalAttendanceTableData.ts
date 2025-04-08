// ライブラリ
import { useEffect, useMemo } from 'react';

// Store
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { useAttendanceTablePersonalStore } from '@/stores/admin/attendanceTablePersonalSlice';

// Utils
import {
  generateDateRange,
  formatDateStringToMM_DD_Day,
  formatTimeStringToHH_MM,
  toJapanDateISOString,
} from '@/utils/common/dateUtils';


import type { AttendanceRowPersonal } from '@/types/Attendance';


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

  // APIからの出退勤データをMapに変換(検索高速化用)
  const attendancetMap = useMemo(() => {
    const map = new Map();
    adminAttendanceViewAllMembersMonthlyResult?.forEach((attendance) => {
      const dateString = attendance.work_date?.split('T')[0];
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

    const newRows: AttendanceRowPersonal[] = dateRange.map((date) => {

      const dateString = toJapanDateISOString(date); // 'YYYY-MM-DD'
      const key = `${adminAttendanceViewSelectedUser.user_id}_${dateString}`;

      // 当日の出退勤結果を取得
      const attendance = attendancetMap.get(key);

      // 日付のフォーマット 'MM/DD(曜日)'
      const formattedDate = formatDateStringToMM_DD_Day(date);

      // 平日普通(H)
      const regularHours = attendance?.work_minutes === null || attendance?.work_minutes === undefined
        ? "-"
        : (Math.round((attendance.work_minutes / 60) * 2) / 2).toFixed(1);

      // 平日時間外(H)
      const overtimeHours = attendance?.overtime_minutes === null || attendance?.overtime_minutes === undefined
        ? "-"
        : (Math.round((attendance.overtime_minutes / 60) * 2) / 2).toFixed(1);

      // 開始と終了
      const adjustedStartTime = attendance?.adjusted_start_time
        ? formatTimeStringToHH_MM(new Date(attendance.adjusted_start_time))
        : '';

      const adjustedEndTime = attendance?.adjusted_end_time
        ? formatTimeStringToHH_MM(new Date(attendance.adjusted_end_time))
        : '';

      // 休憩
      const breakHours = attendance?.rest_minutes === null || attendance?.rest_minutes === undefined
        ? "-"
        : (Math.round((attendance.rest_minutes / 60) * 2) / 2).toFixed(1);

      // 打刻開始と終了
      const stampStartTime = attendance?.stamp_start_time
        ? formatTimeStringToHH_MM(new Date(attendance.stamp_start_time))
        : '';

      const stampEndTime = attendance?.stamp_end_time
        ? formatTimeStringToHH_MM(new Date(attendance.stamp_end_time))
        : '';

      // 備考
      const remarks = attendance?.remarks || null;

      return {
        date: dateString,
        formattedDate: formattedDate,
        regularHours,
        overtimeHours,
        adjustedStartTime: adjustedStartTime,
        adjustedEndTime: adjustedEndTime,
        breakHours,
        stampStartTime: stampStartTime,
        stampEndTime: stampEndTime,
        attendanceId: attendance?.attendance_id,
        remarks: remarks,
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
