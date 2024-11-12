import { NextRequest } from 'next/server';
import { handleApiRequest } from '@/utils/server/handleApiRequest';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import type { AttendanceResult } from '@/types/Attendance';
/**
 * 
 * @param request 
 * @returns 
 */
export async function GET(request: NextRequest) {
    return handleApiRequest<AttendanceResult[]>(async () => {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('user_id') || '*';
        const attendanceId = searchParams.get('attendance_id') || '*';
        const startTimeISO = searchParams.get('start_time');
        const endTimeISO = searchParams.get('end_time');

        if (!startTimeISO || !endTimeISO) {
            throw new Error('start_timeとend_timeは必須です');
        }

        return await handleSupabaseRequest<AttendanceResult[]>(async (supabase) => {
            return supabase
                .from('attendance_results')
                .select(`
                *,
                attendance_stamps!inner(user_id)
            `)
                .gte('attendance_stamps.start_time', startTimeISO)
                .lte('attendance_stamps.end_time', endTimeISO)
                .eq('attendance_stamps.user_id', userId)
                .eq('attendance_results.attendance_id', attendanceId);
        });


    });
}
