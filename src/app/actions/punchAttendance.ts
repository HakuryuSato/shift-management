'use server';

// サーバーアクション
import { insertAttendance } from './insertAttendance';
import { updateAttendance } from './updateAttendance';

// utils
import { toJapanDateISOString, toJapanISOString } from '@/utils/common/dateUtils';
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
  console.log(`[${new Date().toISOString()}] punchAttendance 開始`);
  const now = new Date();
  const nowTime = toJapanISOString(now);
  const today = toJapanDateISOString(now);

  console.log(`[${new Date().toISOString()}] punchAttendance existingAttendance 取得`);
  // 当日の出勤記録を取得
  const existingAttendance = await handleSupabaseRequest<Attendance[]>(async (supabase) => {
    return supabase
      .from('attendances')
      .select('*')
      .eq('user_id', userId)
      .eq('work_date', today)
      // .order('work_date', { ascending: false })
      .limit(1);
  });

  // 戻り値があり、[]でなく、打刻開始があるなら
  if (existingAttendance && existingAttendance.length > 0 && existingAttendance[0].stamp_start_time) {
    const attendanceId = existingAttendance[0].attendance_id;

    console.log(`[${new Date().toISOString()}] punchAttendance updateAttendance 開始`);
    // stamp_end_time を更新(ここでstartとendがそろっている想定になる)
    const updatedAttendance = await updateAttendance({
      attendance_id: attendanceId,
      stamp_end_time: nowTime,
    });
    console.log(`[${new Date().toISOString()}] punchAttendance updateAttendance 終了、generateAttendanceWorkMinutes開始`);


    // 非同期で勤務時間や残業時間を計算し、データを更新
    generateAttendanceWorkMinutes(updatedAttendance[0])
      .then(async (result) => {
        console.log(`[${new Date().toISOString()}] punchAttendance generateAttendanceWorkMinutes終了, updateAttendance(result) 開始 `);
        await updateAttendance(result);
        console.log(`[${new Date().toISOString()}] punchAttendance updateAttendance(result) 終了 `);
      })
      .catch((error) => {
        console.error('Error generating attendance result:', error);
        throw new Error('Failed to calculate attendance result.');
      });
    
      console.log(`[${new Date().toISOString()}] punchAttendance 終了`);
    return updatedAttendance;
  } else {
    console.log(`[${new Date().toISOString()}] punchAttendance insertAttendance 開始`);
    // 出勤データが存在しない場合、新しいレコードを作成
    const newAttendance = await insertAttendance({
      user_id: userId,
      work_date: today,
      stamp_start_time: nowTime,
    });

    console.log(`[${new Date().toISOString()}] punchAttendance 終了 insertAttendance 終了`);
    return newAttendance;
  }
}
