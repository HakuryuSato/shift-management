'use server';

import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import { toJapanDateISOString } from '@/utils/common/dateUtils';
import type { Attendance } from '@/types/Attendance';

/**
 * 当日の出勤記録を取得する
 */
export async function getTodayAttendance(userId: number): Promise<Attendance[]> {
  const today = toJapanDateISOString(new Date());

  return handleSupabaseRequest<Attendance[]>(async (supabase) => {
    return supabase
      .from('attendances')
      .select('*')
      .eq('user_id', userId)
      .eq('work_date', today)
      .limit(1);
  });
}
