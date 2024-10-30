export interface Shift {

    user_id?: string | number,
    shift_id?: number,
    year?: number,
    month?: number,
    is_approved?: boolean;
    start_time?: string | number | Date;
    end_time?: string | number | Date;

}