'use server';

import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import { toJapanDateISOString } from '@/utils/common/dateUtils';
import type { Attendance } from '@/types/Attendance';

/**
 * 当日の出勤記録を取得する
 */
export async function getTodayAttendance(
  userId: number,
  work_date: string
): Promise<Attendance[]> {
  return handleSupabaseRequest<Attendance[]>(async (supabase) => {
    return supabase
      .from('attendances')
      .select('*')
      .eq('user_id', userId)
      .eq('work_date', work_date)
      .limit(1);
  });
}
