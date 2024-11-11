'use server';

import type { Shift } from '@/customTypes/Shift';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';

/**
 * 既存シフトを更新するサーバーアクション
 * @param shiftData 更新するシフトデータ
 * @returns 更新されたシフトデータ
 */
export async function updateShift(shiftData: Shift): Promise<Shift[]> {
  const data = await handleSupabaseRequest<Shift[]>(async (supabase) => {
    return supabase
      .from('shifts')
      .update({
        start_time: shiftData.start_time,
        end_time: shiftData.end_time,
      })
      .eq('shift_id', shiftData.shift_id)
      .select();
  });

  return data;
}
