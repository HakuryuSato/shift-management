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



export type AttendanceResults = {
  attendance_id: bigint; // 外部キーとしてのattendance_id
  work_start_time: Date | null; // work_start_timeはnullableにすることでデータの欠損に対応
  work_end_time: Date | null;
  work_minutes: number | null;
  overtime_minutes: number | null;
  rest_minutes: number | null;
  created_at: Date;
};

export type AttendanceStamps = {
  attendance_id: bigint; // 自動インクリメント
  user_id: bigint; // 外部キーとしてのuser_id
  stamp_start_time: Date;
  stamp_end_time: Date | null; // nullableに設定
  created_at: Date;
};
