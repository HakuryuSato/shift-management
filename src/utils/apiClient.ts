import type InterFaceShiftQuery from "@customTypes/InterFaceShiftQuery";
import type { getShiftAPIResponse,AutoShiftSettingsAPIResponse   } from '@/customTypes/ApiResponses';


// 共通のfetchエラーハンドリング関数
async function handleFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error(`Network response was not ok: ${response.statusText}`);
      return null;
    }
    const result = await response.json();
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

  const response = await handleFetch<getShiftAPIResponse>(query);

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
export async function fetchHolidays() {
  return await handleFetch("/api/holidays") || [];
}

// 自動シフト関連 ---------------------------------------------------------------------------------------------------
// 自動シフトの実行
export async function runAutoShift() {
  return await handleFetch("/api/auto-shift/run");
}

// 自動シフト設定の取得
export async function fetchAutoShiftSettings(userId?: string) {
  const query = userId ? `/api/auto-shift/settings?user_id=${userId}` : `/api/auto-shift/settings`;
  return await handleFetch(query);
}

// 自動シフト設定の保存
export async function sendAutoShiftSettings(autoShiftSettingData: any) {
  return await handleFetch<AutoShiftSettingsAPIResponse>("/api/auto-shift/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(autoShiftSettingData),
  });
}
