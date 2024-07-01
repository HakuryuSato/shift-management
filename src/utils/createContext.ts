import type { InterFaceShiftQuery } from "@/customTypes/InterFaceShiftQuery";

// 送信用クエリ作成
export function createContext(params: InterFaceShiftQuery['query']): InterFaceShiftQuery {
    const query: InterFaceShiftQuery['query'] = {};
    
    if (params.user_id !== undefined) query.user_id = params.user_id;
    if (params.shift_id !== undefined) query.shift_id = params.shift_id;
    if (params.year !== undefined) query.year = params.year;
    if (params.month !== undefined) query.month = params.month;
    if (params.is_approved !== undefined) query.is_approved = params.is_approved;
    if (params.start_time !== undefined) query.start_time = params.start_time;
    if (params.end_time !== undefined) query.end_time = params.end_time;

    return { query };
}
