'use server';

// サーバーアクション
import { insertAttendance } from './insertAttendance';
import { updateAttendance } from './updateAttendance';

// utils
import { getTimeRangeISOStrings, toJapanISOString } from '@/utils/common/dateUtils';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import { generateAttendanceWorkMinutes } from '@/utils/server/generateAttendanceWorkMinutes';

// 型
import type { Attendance } from '@/types/Attendance';

/**
 * 出退勤の打刻を行うサーバーアクション
 * @param userId ユーザーID
 * @returns 更新または作成された Attendance データ
 */
export async function punchAttendance(userId: number): Promise<Attendance[]> {
  const now = new Date();
  const nowISO = toJapanISOString(now);

  // 当日の時間範囲を取得
  const { startTimeISO, endTimeISO } = getTimeRangeISOStrings('day', now);

  // 当日の出勤記録を取得
  const existingAttendance = await handleSupabaseRequest<Attendance[]>(async (supabase) => {
    return supabase
      .from('attendances')
      .select('*')
      .eq('user_id', userId)
      .gte('work_date', startTimeISO)
      .lte('work_date', endTimeISO)
      .order('stamp_start_time', { ascending: false })
      .limit(1);
  });

  if (existingAttendance && existingAttendance.length > 0) {
    // 出勤データが既に存在する場合
    const attendanceId = existingAttendance[0].attendance_id;

    // stamp_end_time を更新
    const updatedAttendance = await updateAttendance({
      attendance_id: attendanceId,
      stamp_end_time: nowISO,
    });

    // 非同期で勤務時間や残業時間を計算し、データを更新
    generateAttendanceWorkMinutes(updatedAttendance[0])
      .then(async (result) => {
        await updateAttendance(result);
      })
      .catch((error) => {
        console.error('Error generating attendance result:', error);
        throw new Error('Failed to calculate attendance result.');
      });

    return updatedAttendance;
  } else {
    // 出勤データが存在しない場合、新しいレコードを作成
    const newAttendance = await insertAttendance({
      user_id: userId,
      stamp_start_time: nowISO,
    });

    return newAttendance;
  }
}
