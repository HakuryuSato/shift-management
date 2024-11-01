export interface AttendanceQuery {
    user_id?: string | number;
    start_date?: string; // ISO (YYYY-MM-DD)
    end_date?: string;
  }
  
  // DBの構造
  export interface Attendance {
    attendance_id: number;
    user_id: number;
    user_name?: string;
    start_time: string; // ISO文字列
    end_time?: string | null;
  }
  
  export interface AttendanceAPIResponse {
    data: Attendance[];
    error?: string;
  }
  