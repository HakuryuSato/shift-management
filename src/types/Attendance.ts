// GETリクエスト用の型
export type AttendanceQuery = Partial<Pick<Attendance, 'user_id'>> & {
  filterStartTimeISO?: string;
  filterEndTimeISO?: string;
  filterTimeType?: 'stamp' | 'adjusted';
};

// 新たなAttendanceテーブル
export interface Attendance {
  attendance_id: number; // 主キー
  user_id: number; // 外部キー
  stamp_start_time: string; // 打刻の開始時間
  stamp_end_time: string | null; // 打刻の終了時間 (nullable)
  adjusted_start_time: string | null; // 補正後の開始時間
  adjusted_end_time: string | null; // 補正後の終了時間
  work_minutes: number | null; // 補正後の勤務時間 (分)
  overtime_minutes: number | null; // 残業時間 (分)
  rest_minutes: number | null; // 休憩時間 (分)
  created_at?: string; // レコード作成日時
};


// 個人用出退勤テーブルの型
export type AttendanceRow = {
  date: string;
  regularHours: string;
  overtimeHours: string;
  adjustedStartTime: string;
  adjustedEndTime: string;
  breakHours: string;
  stampStartTime: string;
  stampEndTime: string;
  attendanceId?: number;
};




// export interface Attendance {
//   attendance_id: number;
//   user_id: number;
//   user_name?: string;
//   start_time: string; // ISO文字列
//   end_time?: string | null;
// }


// // DBの型
// export type Attendance = {
//   attendance_id: number; // 外部キーとしてのattendance_id
//   work_start_time: string | null; // work_start_timeはnullableにすることでデータの欠損に対応
//   work_end_time: string | null;
//   work_minutes: number | null;
//   overtime_minutes: number | null;
//   rest_minutes: number | null;
//   created_at?: string;
//   attendance_stamps?: { // クエリで結合
//     user_id?: string | number;
//   };
// };



// // DBの型
// export type Attendance = {
//   attendance_id: number; // 自動インクリメント
//   user_id: number; // 外部キーとしてのuser_id
//   start_time: string; // ISO文字列
//   end_time: string | null; // nullableに設定
//   created_at?: string;
// };