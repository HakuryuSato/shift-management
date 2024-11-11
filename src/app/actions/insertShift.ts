'use server';

import type { Shift } from '@/types/Shift';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';

/**
 * 新しいシフトを挿入するサーバーアクション
 * @param shiftData シフトデータ
 * @returns 挿入されたシフトデータ
 */
export async function insertShift(shiftData: Shift | Shift[]): Promise<Shift[]> {
  const data = await handleSupabaseRequest<Shift[]>(async (supabase) => {
    const shiftArray = Array.isArray(shiftData) ? shiftData : [shiftData];
    return supabase
      .from('shifts')
      .insert(shiftArray)
      .select();
  });

  return data;
}