'use server';

import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';

/**
 * シフトを削除するサーバーアクション
 * @param shiftId 削除するシフトのID
 * @returns 削除結果データ
 */
export async function deleteShift(shiftId: Number): Promise<any> {

  const data = await handleSupabaseRequest(async (supabase) => {
    return supabase
      .from('shifts')
      .delete()
      .eq('shift_id', shiftId);
  });

  return { success: true };
}