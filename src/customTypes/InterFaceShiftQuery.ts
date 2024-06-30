// DBのshiftsテーブルと同じ型
export interface InterFaceShiftQuery {
    query: {
        user_id: string | number,
        year?: number,
        month?: number,
        is_approved?: boolean;
        start_time?: string;
        end_time?: string;
    };
}