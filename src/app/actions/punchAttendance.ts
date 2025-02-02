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
  console.log(`punchAttendance user_id=${userId} 開始 `);
  const now = new Date();
  const nowTime = toJapanISOString(now);
  const today = toJapanDateISOString(now);

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

    console.log(`punchAttendance user_id=${userId} 2度目以降の打刻 Step0/3 開始 attendance_id=${attendanceId}`);
    // stamp_end_time を更新(ここでstartとendがそろっている想定になる)
    const updatedAttendance = await updateAttendance({
      attendance_id: attendanceId,
      stamp_end_time: nowTime,
    });
    console.log(`punchAttendance user_id=${userId} 2度目以降の打刻 Step1/3 終了時間の更新完了 attendance_id=${attendanceId}`);

    try {
      // 勤務時間や残業時間を計算し、データを更新
      const result = await generateAttendanceWorkMinutes(updatedAttendance[0]);
      console.log(`punchAttendance user_id=${userId} 2度目以降の打刻 Step2/3 generateAttendanceWorkMinutes完了 attendance_id=${attendanceId}`);

      const finalAttendance = await updateAttendance(result);
      console.log(`punchAttendance user_id=${userId} 2度目以降の打刻 Step3/3 adjustedなどの登録完了 attendance_id=${attendanceId}`);
      return finalAttendance;
    } catch (error) {
      console.error('Error generating attendance result:', error);
      throw new Error('Failed to calculate attendance result.');
    }
  } else {
    console.log(`punchAttendance 初回の打刻開始 user_id=${userId}`);
    // 出勤データが存在しない場合、新しいレコードを作成
    const newAttendance = await insertAttendance({
      user_id: userId,
      work_date: today,
      stamp_start_time: nowTime,
    });

    console.log(`punchAttendance user_id=${userId} 初回の打刻完了 `);
    return newAttendance;
  }
}
