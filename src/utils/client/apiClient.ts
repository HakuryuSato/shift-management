import type InterFaceShiftQuery from "@/types/InterFaceShiftQuery";
import { AttendanceQuery, Attendance } from '@/types/Attendance';
import type { Holiday } from "@/types/Holiday";
import type { AutoShiftSettings } from "@/types/AutoShift";
import type { Shift, NewShiftQuery } from "@/types/Shift";
import type { User } from "@/types/User";

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
      console.log('apiClient:', result.data)
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

// ユーザー名からユーザー情報取得
export async function fetchUserByUsername(username: string): Promise<User | null> {
  return await handleFetch<User>(`/api/users/${encodeURIComponent(username)}`);
}

// ユーザー 一覧取得
export async function fetchUsers(): Promise<User[]> {
  return await handleFetch<User[]>(`/api/users`);
}





// シフト関連  ---------------------------------------------------------------------------------------------------
// シフト取得
export async function fetchShifts(
  params: NewShiftQuery = {}
): Promise<Shift[]> {
  const { user_id, startTime: start_time, endTime: end_time } = params;
  const queryParams = new URLSearchParams();

  if (user_id) {
    queryParams.append('user_id', user_id.toString());
  }

  if (start_time && end_time) {
    queryParams.append('filterStartTimeISO', start_time)
    queryParams.append('filterEndTimeISO', end_time)
  } else {
    console.error('filterStartTimeISOとfilterEndTimeISOは必須です');
    return [];
  }

  return await handleFetch<Shift[]>(
    `/api/shifts?${queryParams.toString()}`
  );
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
// 打刻データ取得
export async function fetchAttendances(
  params: AttendanceQuery = {}
): Promise<Attendance[]> {
  const { user_id, startDate: filterStartDateISO, endDate: filterEndDateISO } = params;
  const queryParams = new URLSearchParams();

  if (user_id) {
    queryParams.append('user_id', user_id.toString());
  }

  if (filterStartDateISO && filterEndDateISO) {
    queryParams.append('filterStartDateISO', filterStartDateISO)
    queryParams.append('filterEndDateISO', filterEndDateISO)
  } else {
    console.error('filterStartTimeISOとfilterEndTimeISOは必須です');
    return [];
  }

  return await handleFetch<Attendance[]>(
    `/api/attendances?${queryParams.toString()}`
  );
}
