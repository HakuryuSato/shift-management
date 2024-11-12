// GETリクエストを送る型
export interface AttendanceQuery {
  user_id?: string | number;
  startTimeISO?: string; // dateUtilで生成
  endTimeISO?: string;
}

export interface Attendance {
  attendance_id: number;
  user_id: number;
  user_name?: string;
  start_time: string; // ISO文字列
  end_time?: string | null;
}


// DBの型
export type AttendanceResults = {
  attendance_id: number; // 外部キーとしてのattendance_id
  work_start_time: string | null; // work_start_timeはnullableにすることでデータの欠損に対応
  work_end_time: string | null;
  work_minutes: number | null;
  overtime_minutes: number | null;
  rest_minutes: number | null;
  created_at?: string;
};


// DBの型
export type AttendanceStamp = {
  attendance_id: number; // 自動インクリメント
  user_id: number; // 外部キーとしてのuser_id
  start_time: string; // ISO文字列
  end_time: string | null; // nullableに設定
  created_at?: string;
};
