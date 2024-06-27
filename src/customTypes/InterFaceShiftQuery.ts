export interface InterFaceShiftQuery {
    query: {
        user_id: number,
        year?: number,
        month?: number,
        is_approved?: boolean;
        start_time?: string;
        end_time?: string;
    };
}