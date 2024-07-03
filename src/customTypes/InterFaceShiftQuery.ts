// DBのshiftsテーブルと同じ型
export default interface InterFaceShiftQuery {
    query: {
        user_id?: string | number, // idは必須要素
        shift_id?: number,
        year?: number,
        month?: number,
        is_approved?: boolean;
        start_time?: string | number;
        end_time?: string | number;
    };
}