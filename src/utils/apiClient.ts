import type InterFaceShiftQuery from "@customTypes/InterFaceShiftQuery";
import type { GetShiftAPIResponse, AutoShiftSettingsAPIResponse, GetAutoShiftSettingsAPIResponse, GetHolidaysAPIResponse } from '@/customTypes/ApiResponses';


/*

[クライアントサイドからAPIを呼び出す関数群]
response.dataからの展開はこの関数内で行い、展開後のデータをクライアントサイドへ返す。

*/

// 共通のfetchエラーハンドリング関数
// APIレスポンスの型をジェネリクス型として受け取る
async function handleFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result)
    if (!response.ok) {
      console.error(`Network response was not ok: ${response.statusText}`);
      console.error(`Error details: ${JSON.stringify(result)}`);
      return null;
    }
    return result as T;
  } catch (error) {
    console.error(
      "An error occurred:",
      error instanceof Error ? error.message : "An unknown error occurred"
    );
    return null;
  }
}

// ユーザー関連 ---------------------------------------------------------------------------------------------------
// ユーザー 一覧取得
export async function fetchUsers() {
  return await handleFetch(`/api/getUserData`) || [];
}

// ユーザー存在確認
export async function fetchGetIsUser(user_name: string) {
  return await handleFetch(`/api/getIsUser?user_name=${user_name}`);
}

// ユーザー登録
export async function sendUser(userName: string) {
  return await handleFetch('/api/sendUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName }),
  });
}

// ユーザー削除
export async function deleteUser(user_name: string) {
  return await handleFetch(`/api/deleteUser?user_name=${user_name}`, { method: 'DELETE' });
}

// シフト関連  ---------------------------------------------------------------------------------------------------
// シフト取得
export async function fetchShifts(params: InterFaceShiftQuery = {}): Promise<InterFaceShiftQuery[]> {
  const { // paramsになければ初期値
    user_id = '*',
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1,
    start_time,
    end_time
  } = params; // 渡された引数で上書き

  const query = start_time && end_time
    ? `/api/getShift?user_id=${user_id}&start_time=${start_time}&end_time=${end_time}`
    : `/api/getShift?user_id=${user_id}&year=${year}&month=${month}`;

  const response = await handleFetch<GetShiftAPIResponse>(query);

  if (response && 'data' in response) {
    return response.data;
  } else {
    return [];
  }
}

// シフト送信
export async function fetchSendShift(shiftData: InterFaceShiftQuery | InterFaceShiftQuery[]) {
  return await handleFetch("/api/sendShift", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(shiftData),
  });
}

// シフト更新
export async function fetchUpdateShift(shiftData: InterFaceShiftQuery) {
  return await handleFetch("/api/updateShift", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(shiftData),
  });
}

// 祝日データの取得 ---------------------------------------------------------------------------------------------------
// 注意：Holidaysのみ、response.data の展開をAPI側で行っている。　時間があれば修正すること
export async function fetchHolidays() {
  const response = await handleFetch<GetHolidaysAPIResponse>("/api/holidays");
  if (response && 'data' in response) {
    return response.data;
  } else {
    // エラーが発生した場合は空配列を返す
    return [];
  }
}

// 自動シフト関連 ---------------------------------------------------------------------------------------------------
// 自動シフトの実行
export async function runAutoShift() {
  return await handleFetch("/api/auto-shift/run");
}

// 自動シフト設定の取得
export async function fetchAutoShiftSettings(userId?: string): Promise<GetAutoShiftSettingsAPIResponse | null> {
  const query = userId ? `/api/auto-shift/settings?user_id=${userId}` : `/api/auto-shift/settings`;
  return await handleFetch<GetAutoShiftSettingsAPIResponse>(query);
}

// 自動シフト設定の保存
export async function sendAutoShiftSettings(autoShiftSettingData: any) {
  return await handleFetch<AutoShiftSettingsAPIResponse>("/api/auto-shift/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(autoShiftSettingData),
  });
}
