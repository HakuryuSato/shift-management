'use server';

import type { Shift } from '@/types/Shift';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import { getShift } from '@/utils/server/api/shifts/getShift';
import { getDayRangeFromISOString } from '@/utils/common/dateUtils';

/**
 * 新しいシフトを挿入するサーバーアクション
 * @param shiftData シフトデータ
 * @returns 挿入されたシフトデータ
 */
export async function insertShift(shiftData: Shift | Shift[]): Promise<Shift[]> {
  const shiftArray = Array.isArray(shiftData) ? shiftData : [shiftData];
  const validShifts: Shift[] = [];

  // 各シフトに対して重複チェック
  for (const shift of shiftArray) {
    // シフトデータが不完全な場合はスキップ
    if (!shift.user_id || !shift.start_time) {
      continue;
    }

    const { startTimeISO, endTimeISO } = getDayRangeFromISOString(shift.start_time);

    // 重複しているシフトがないか取得
    const existingShifts = await getShift({
      userId: shift.user_id.toString(),
      filterStartDateISO: startTimeISO,
      filterEndDateISO: endTimeISO
    });

    // 重複していない場合は有効なシフトとして追加
    if (existingShifts.length === 0) {
      validShifts.push(shift);
    }
  }

  // 有効なシフトがある場合のみ挿入を実行
  if (validShifts.length === 0) {
    return [];
  }

  const result = await handleSupabaseRequest<Shift[]>(async (supabase) => {
    return supabase
      .from('shifts')
      .insert(validShifts)
      .select();
  });
  return result;
}
