'use server';

import type { Shift } from '@/types/Shift';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import { getShift } from '@/utils/server/api/shifts/getShift';
import { createJSTDateFromISO, getTimeRangeISOStrings } from '@/utils/common/dateUtils';

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

    const date = createJSTDateFromISO(shift.start_time);
    const { startTimeISO, endTimeISO } = getTimeRangeISOStrings('day', date);
    
    const existingShifts = await getShift({
      userId: shift.user_id.toString(),
      filterStartDateISO: startTimeISO,
      filterEndDateISO: endTimeISO
    });

    if (existingShifts.length === 0) {
      validShifts.push(shift);
    }
    // 重複している場合はスキップ
  }

  // 有効なシフトがある場合のみ挿入を実行
  if (validShifts.length === 0) {
    return [];
  }

  return await handleSupabaseRequest<Shift[]>(async (supabase) => {
    return supabase
      .from('shifts')
      .insert(validShifts)
      .select();
  });
}
