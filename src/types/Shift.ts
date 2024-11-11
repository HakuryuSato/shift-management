// GETリクエストで使用している型
export interface ShiftQuery {
    user_id?: string | number,
    shift_id?: number,
    year?: number,
    month?: number,
    is_approved?: boolean; // 廃止予定
    start_time?: string | number | Date;
    end_time?: string | number | Date;
}


// DBの構造と同じ型 + サバアクの送信で使用している型
export interface Shift {
    shift_id?: number;
    user_id?: number;
    start_time: string; // ISO文字列
    end_time?: string;
}
