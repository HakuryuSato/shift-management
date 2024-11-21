'use server';

import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import type { Attendance } from '@/types/Attendance';

/**
 * 出勤データを更新するサーバーアクション
 * @param attendanceData 更新する出勤データ（attendance_idを含む）
 * @returns 更新された出勤データ
 */
export async function updateAttendance(attendanceData: Partial<Attendance>): Promise<Attendance[]> {
    return await handleSupabaseRequest<Attendance[]>(async (supabase) => {
        const { attendance_id, ...newAttendanceData } = attendanceData;
        return supabase
            .from('attendances')
            .update(newAttendanceData)
            .eq('attendance_id', attendance_id)
            .select();
    });
}
