// supabaseのテーブルの型
export interface User {
    user_id?: number;
    user_name?: string; // 漢字
    employment_type?: 'full_time' | 'part_time';
    employee_no?: number;
}