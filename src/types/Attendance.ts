import type { User } from '@/types/User'

// GETリクエスト用の型
export type AttendanceQuery = Partial<Pick<Attendance, 'user_id'>> & {
  startDate?: string;
  endDate?: string;
};

// 新たなAttendanceテーブル
export interface Attendance {
  attendance_id: number; // 主キー
  user_id: number; // 外部キー
  work_date: string; // 勤務日 (YYYY-MM-DD形式)
  stamp_start_time: string | null; // 打刻の開始時間 (nullable)
  stamp_end_time: string | null; // 打刻の終了時間 (nullable)
  adjusted_start_time: string | null; // 補正後の開始時間
  adjusted_end_time: string | null; // 補正後の終了時間
  work_minutes: number | null; // 補正後の勤務時間 (分)
  overtime_minutes: number | null; // 残業時間 (分)
  rest_minutes: number | null; // 休憩時間 (分)
  special_event: '有給' | '振替出勤' | '振替休日' | null; // 特殊なイベント (nullable)
  created_at?: string; // レコード作成日時
};


// 個人用出退勤テーブルの型
export type AttendanceRowPersonal = {
  date: string; // YYYY-MM-DD
  formattedDate: string; // 'MM/DD(曜日) 有給' など。
  regularHours: string;
  overtimeHours: string;
  adjustedStartTime: string;
  adjustedEndTime: string;
  breakHours: string;
  stampStartTime: string | null;
  stampEndTime: string | null;
  attendanceId?: number;
};

// 全員出退勤要約テーブルの型
export type AttendanceRowAllMembers = {
  user: User;
  employeeNo: string;
  employmentTypeText: string;
  workDays: number;
  workHours: number;
  overtimeHours: number;
}
