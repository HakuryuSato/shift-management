import type InterFaceShiftQuery from "@customTypes/InterFaceShiftQuery";
import type { GetShiftAPIResponse, AutoShiftSettingsAPIResponse, GetAutoShiftSettingsAPIResponse, GetHolidaysAPIResponse } from '@/customTypes/ApiResponses';
import { AttendanceQuery, Attendance, AttendanceAPIResponse } from '@customTypes/Attendance';
import type { Holiday } from "@/customTypes/Holiday";
import type { AutoShiftSettings } from "@/customTypes/AutoShiftTypes";

/*

[クライアントサイドからAPIを呼び出す関数群]
response.dataからの展開はこの関数内で行い、展開後のデータをクライアントサイドへ返す。

*/

// 共通のfetchエラーハンドリング関数
// APIレスポンスの型をジェネリクス型として受け取る
async function handleFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    const result = await response.json();



    if (response.ok && result && 'data' in result) {
      console.log(result.data)
      return result.data as T;
    } else {
      console.error(`Error fetching ${url}:`, result);
      return [] as unknown as T;
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return [] as unknown as T;
  }
}

// ユーザー関連 ---------------------------------------------------------------------------------------------------
// ユーザー 一覧取得 未使用のため一時的にコメントアウト
// export async function fetchUsers() {
//   return await handleFetch(`/api/getUserData`) || [];
// }




// シフト関連  ---------------------------------------------------------------------------------------------------
// シフト取得
export async function fetchShifts(
  params: InterFaceShiftQuery = {}
): Promise<InterFaceShiftQuery[]> {
  const {
    user_id = '*',
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1,
    start_time,
    end_time,
  } = params;

  const query = start_time && end_time
    ? `/api/getShift?user_id=${user_id}&start_time=${start_time}&end_time=${end_time}`
    : `/api/getShift?user_id=${user_id}&year=${year}&month=${month}`;

  return await handleFetch<InterFaceShiftQuery[]>(query);
}



// 祝日データの取得 ---------------------------------------------------------------------------------------------------
export async function fetchHolidays(): Promise<Holiday[]> {
  return await handleFetch<Holiday[]>('/api/holidays');
}

// 自動シフト関連 ---------------------------------------------------------------------------------------------------
// 自動シフトの実行　デバッグ用
// export async function runAutoShift() {
//   return await handleFetch("/api/auto-shift/run");
// }

// 自動シフト設定の取得
export async function fetchAutoShiftSettings(userId?: string): Promise<AutoShiftSettings | null> {
  const query = userId ? `/api/auto-shift/settings?user_id=${userId}` : `/api/auto-shift/settings`;
  return await handleFetch<AutoShiftSettings>(query);
}

// 自動シフト設定の保存 サーバーアクションに移行予定
export async function sendAutoShiftSettings(autoShiftSettingData: any) {
  return await handleFetch<AutoShiftSettings>("/api/auto-shift/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(autoShiftSettingData),
  });
}

// 出退勤  ---------------------------------------------------------------------------------------------------
// 出退勤データ取得
export async function fetchAttendance(
  params: AttendanceQuery = {}
): Promise<Attendance[]> {
  const { user_id = '*', start_date, end_date } = params;

  const queryParams = new URLSearchParams();

  if (user_id) {
    queryParams.append('user_id', user_id.toString());
  }

  if (start_date && end_date) {
    queryParams.append('start_date', start_date);
    queryParams.append('end_date', end_date);
  }

  return await handleFetch<Attendance[]>(
    `/api/attendance?${queryParams.toString()}`
  );
}