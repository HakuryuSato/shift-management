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
            const query = supabase
              .from('attendance_results')
              .select(`
                attendance_id,
                work_start_time,
                work_end_time,
                work_minutes,
                overtime_minutes,
                rest_minutes,
                attendance_stamps (
                  user_id
                )
              `)
              .gte('work_start_time', startTimeISO)
              .lte('work_end_time', endTimeISO);
      
            if (attendanceId && attendanceId !== '*') {
              query.eq('attendance_id', attendanceId);
            }
      
            if (userId && userId !== '*') {
              query.eq('attendance_stamps.user_id', userId);
            }
      
            return query;
          });
        });
      }