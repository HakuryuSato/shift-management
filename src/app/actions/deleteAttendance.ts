'use server'

import { handleServerAction } from '@/utils/server/handleServerAction';
import { supabase as supabaseClient } from '@/utils/server/supabaseClient';

/**
 * 出勤データを削除するサーバーアクション
 * @param attendanceId 削除する出勤データのID
 * @returns 削除された出勤データまたはnull
 */
export async function deleteAttendance(attendanceId: number) {
  return await handleServerAction(async () => {
    const { data, error } = await supabaseClient
      .from('attendances')
      .delete()
      .eq('attendance_id', attendanceId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  });
}
