export interface AttendanceQuery {
    user_id?: string | number;
    attendance_id?: number;
    year?: number;
    month?: number;
    start_date?: string;
    end_date?: string;
    start_time?: string | number | Date;
    end_time?: string | number | Date;
  }
  
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
  