'use server';

import { insertAttendance } from './insertAttendance';
import { toJapanDateISOString, toJapanISOString } from '@/utils/common/dateUtils';
import { getTodayAttendance } from './punchAttendance/getTodayAttendance';
import { checkDuplicatePunch } from './punchAttendance/checkDuplicatePunch';
import { updateAttendanceWithEndTime } from './punchAttendance/updateAttendanceWithEndTime';
import type { Attendance } from '@/types/Attendance';

/**
 * 出退勤の打刻を行うサーバーアクション
 * @param userId ユーザーID
 * @returns 更新または作成された Attendance データ
 */
export async function punchAttendance(userId: number): Promise<Attendance[]> {
  console.log(`punchAttendance user_id=${userId} 開始`);
  const now = new Date();
  const nowTime = toJapanISOString(now);
  const today = toJapanDateISOString(now);

  // 当日の出勤記録を取得
  const existingAttendance = await getTodayAttendance(userId, today);

  // 戻り値があり、[]でなく、打刻開始があるなら
  if (existingAttendance && existingAttendance.length > 0 && existingAttendance[0].stamp_start_time) {
    const attendance = existingAttendance[0];
    
    // 重複打刻チェック（stamp_startとstamp_endの差が2分以下かどうか）
    const duplicateResult = await checkDuplicatePunch(attendance, nowTime);
    if (duplicateResult) {
      // 重複打刻の場合はエラーを投げる
      throw new Error("打刻終了までは1時間以上空ける必要があります。");
    }

    console.log(`punchAttendance user_id=${userId} 2度目以降の打刻開始 attendance_id=${attendance.attendance_id}`);
    // 更新したAttendanceを返す
    return await updateAttendanceWithEndTime(attendance.attendance_id, nowTime);
  }

  // 初回の打刻
  console.log(`punchAttendance 初回の打刻開始 user_id=${userId}`);
  const newAttendance = await insertAttendance({
    user_id: userId,
    work_date: today,
    stamp_start_time: nowTime,
  });

  console.log(`punchAttendance user_id=${userId} 初回の打刻完了`);
  // 初回打刻したデータを返す
  return newAttendance;
}
