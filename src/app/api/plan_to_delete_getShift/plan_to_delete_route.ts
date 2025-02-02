// import { supabase } from '@/utils/server/supabaseClient';
// import { NextRequest, NextResponse } from 'next/server';
// import type InterFaceShiftQuery from '@/types/InterFaceShiftQuery';

// // API群の整理時、このAPIの呼び出し方法をAttendanceと同じ形式にすること（start_date,end_dateの範囲までを指定し、API側で開始日0時から終了日23:59:59に変更する


// export async function GET(req: NextRequest, res: NextResponse) {

//     const user_id: InterFaceShiftQuery['user_id'] = req.nextUrl.searchParams.get('user_id') as string | number;
//     const year: InterFaceShiftQuery['year'] = parseInt(req.nextUrl.searchParams.get('year') || '');
//     const month: InterFaceShiftQuery['month'] = parseInt(req.nextUrl.searchParams.get('month') || '');
//     const start_time: InterFaceShiftQuery['start_time'] = req.nextUrl.searchParams.get('start_time') as string | number;
//     const end_time: InterFaceShiftQuery['end_time'] = req.nextUrl.searchParams.get('end_time') as string | number;


//     const now = new Date();
//     const queryYear = year ?? now.getFullYear();
//     const queryMonth = (month ? Number(month) : now.getMonth()) + 1;

//     const defaultStartDate = new Date(queryYear, queryMonth - 1, 1);
//     const defaultEndDate = new Date(queryYear, queryMonth, 0);

//     const startDate = start_time ? new Date(start_time) : defaultStartDate;
//     const endDate = end_time ? new Date(end_time) : defaultEndDate;

//     const startDateISOString = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())).toISOString();
//     const endDateISOString = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)).toISOString();


//     // クエリの作成  -------------------------------------------------
//     let query = supabase
//         .from('shifts')
//         .select('shift_id,user_id,user_name,start_time, end_time,is_approved')
//         .gte('start_time', startDateISOString)
//         .lte('end_time', endDateISOString)


//     if (user_id !== '*') {
//         query = query.eq('user_id', user_id);
//     }

//     const { data, error } = await query;

//     if (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     } else {
//         return NextResponse.json({ data }, { status: 200 });
//     }
// };

