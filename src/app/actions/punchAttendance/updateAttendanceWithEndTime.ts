'use server';

import { updateAttendance } from '../updateAttendance';
import { generateAttendanceWorkMinutes } from '@/utils/server/generateAttendanceWorkMinutes';
import type { Attendance } from '@/types/Attendance';

/**
 * 退勤時の打刻更新と勤務時間計算を行う
 */
export async function updateAttendanceWithEndTime(
  attendanceId: number,
  endTime: string
): Promise<Attendance[]> {
  // stamp_end_time を更新
  const updatedAttendance = await updateAttendance({
    attendance_id: attendanceId,
    stamp_end_time: endTime,
  });

  try {
    // 勤務時間や残業時間を計算し、データを更新
    const result = await generateAttendanceWorkMinutes(updatedAttendance[0]);
    return await updateAttendance(result);
  } catch (error) {
    console.error('Error generating attendance result:', error);
    throw new Error('Failed to calculate attendance result.');
  }
}
