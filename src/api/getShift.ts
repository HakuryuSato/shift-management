import { supabase } from '@/utils/supabase';
import type InterFaceShiftQuery from '@customTypes/InterFaceShiftQuery';

// サーバーからシフト情報を取得するサーバーサイドコンポーネント
const getShifts = async (context: InterFaceShiftQuery) => {
    const { user_id = '*', year, month, start_time, end_time, is_approved } = context.query;
   
    // 取得したい年月の情報がなければ今月として処理する
    const now = new Date();
    const queryYear = year ?? now.getFullYear();
    const queryMonth = month! + 1 ?? now.getMonth() + 1;

    // 取得したい日付範囲の指定がなければ今月または渡された年の月として処理する
    const defaultStartDate = new Date(queryYear, queryMonth - 1, 1); // monthは1から始まるため、-1する
    const defaultEndDate = new Date(queryYear, queryMonth, 0); // monthの次の月の0日目は、その月の最終日となる

    // 月の開始と終了日時を計算 (先月から翌月までになる予定)
    const startDate = start_time ? new Date(start_time) : defaultStartDate;
    const endDate = end_time ? new Date(end_time) : defaultEndDate;

    // 開始日と終了日をUTCのISO形式で設定
    const startDateISOString = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())).toISOString();
    const endDateISOString = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)).toISOString();



    // クエリの設定
    let query = supabase
        .from('shifts')
        .select('shift_id,user_id,user_name,start_time, end_time,is_approved')
        .gte('start_time', startDateISOString)
        .lte('end_time', endDateISOString);

    const conditions = {
        user_id: user_id !== '*' ? user_id : null,
        is_approved: is_approved !== undefined ? is_approved : null,
        // 追加の条件があればここに追加
    };

    Object.entries(conditions).forEach(([key, value]) => {
        if (value !== null) {
            query = query.eq(key, value);
        }
    });

    const { data, error } = await query;

    return {
        props: {
            data,
            error,
        },
    };
};

export default getShifts;
