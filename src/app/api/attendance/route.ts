import { supabase } from '@/utils/server/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import { AttendanceQuery } from '@/customTypes/Attendance';




// 日付範囲を計算するヘルパー関数
function getTimeRange(params: AttendanceQuery): { startDate: Date; endDate: Date; error?: string } {
    let startDate: Date;
    let endDate: Date;

    const { start_date, end_date } = params;

    // 日付指定があるならばその日付範囲
    if (start_date && end_date) {
        startDate = new Date(start_date);
        endDate = new Date(end_date);

        // 時間を明確に設定
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

    } else {
        // デフォルトは現在の月（この記述方法が最も簡潔
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth();
        startDate = new Date(y, m, 1);
        endDate = new Date(y, m + 1, 0, 23, 59, 59);
    }

    return { startDate, endDate };
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const user_id = searchParams.get('user_id') || '*';
        const start_date = searchParams.get('start_date') ?? undefined; // nullをundefinedに変換
        const end_date = searchParams.get('end_date') ?? undefined; // nullをundefinedに変換

        const { startDate, endDate, error: dateError } = getTimeRange({ start_date, end_date });

        if (dateError) {
            return NextResponse.json({ error: dateError }, { status: 400 });
        }

        // Shift側でもtoISOString。
        const startDateISOString = startDate.toISOString();
        const endDateISOString = endDate.toISOString();

        let query = supabase
            .from('attendances')
            .select(`
                attendance_id,
                user_id,
                start_time,
                end_time
            `)
            .gte('start_time', startDateISOString)
            .lte('start_time', endDateISOString);

        if (user_id !== '*') {
            query = query.eq('user_id', user_id);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 200 });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
