import { supabase } from '@utils/supabase/supabase';
import type { InterFaceShiftQuery } from '@customTypes/InterFaceShiftQuery';

// サーバーからシフト情報を取得するサーバーサイドコンポーネント
const getShifts = async (context: InterFaceShiftQuery) => {
    const { user_id, year, month, start_time, end_time } = context.query;

    // 取得したい年月の情報がなければ今月として処理する
    const queryYear = year ?? new Date().getFullYear();
    const queryMonth = month ?? new Date().getMonth() + 1;

    // 取得したい日付範囲の指定がなければ今月または渡された年の月として処理する
    const defaultStartDate = new Date(queryYear, queryMonth - 1, 1); // monthは1から始まるため、-1する
    const defaultEndDate = new Date(queryYear, queryMonth, 0); // monthの次の月の0日目は、その月の最終日となる

    // 月の開始と終了日時を計算 (先月から翌月までになる予定)
    const startDate = start_time ? new Date(start_time) : defaultStartDate;
    const endDate = end_time ? new Date(end_time) : defaultEndDate;
    // console.log('startDate',startDate)
    // console.log('endDate',endDate)


    const { data, error } = await supabase
        .from('shifts')
        .select('start_time, end_time')
        .eq('user_id', user_id)
        .gte('start_time', startDate.toISOString())
        .lte('end_time', endDate.toISOString());

    console.log(data)
    console.log(error)

    return {
        props: {
            data,
            error,
        },
    };
};

export default getShifts;
