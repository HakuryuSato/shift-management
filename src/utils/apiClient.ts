import type InterFaceShiftQuery from "@customTypes/InterFaceShiftQuery";

// 共通のfetchエラーハンドリング関数
async function handleFetch(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return { data: await response.json(), error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

// ユーザー削除
export async function deleteUser(user_name: string) {
  return handleFetch(`/api/deleteUser?user_name=${user_name}`, { method: 'DELETE' });
}

// ユーザー確認
export async function fetchGetIsUser(user_name: string) {
  return handleFetch(`/api/getIsUser?user_name=${user_name}`);
}

// シフト送信
export async function fetchSendShift(shiftData: InterFaceShiftQuery | InterFaceShiftQuery[]) {
  return handleFetch("/api/sendShift", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(shiftData),
  });
}

// ユーザー送信
export async function sendUser(userName: string) {
  return handleFetch('/api/sendUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName }),
  });
}

// シフト取得
export async function fetchShifts(params: InterFaceShiftQuery = {}): Promise<any[]> {
  const { user_id = '*', year = new Date().getFullYear(), month = new Date().getMonth() + 1, start_time, end_time } = params;
  const query = start_time && end_time 
    ? `/api/getShift?user_id=${user_id}&start_time=${start_time}&end_time=${end_time}`
    : `/api/getShift?user_id=${user_id}&year=${year}&month=${month}`;

  const { data, error } = await handleFetch(query);
  if (error) {
    console.error("Failed to fetch shifts:", error);
    return [];
  }
  return data;
}

// シフト更新
export async function fetchUpdateShift(shiftData: InterFaceShiftQuery) {
  return handleFetch("/api/updateShift", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(shiftData),
  });
}

// ユーザーデータ取得
export async function fetchUserData() {
  const { data, error } = await handleFetch(`/api/getUserData`);
  if (error) {
    console.error("Failed to fetch user data:", error);
    return [];
  }
  return data;
}

// 祝日データの取得
export async function fetchHolidays() {
  const response = await handleFetch("/api/holidays");
  
  if (response.error) {
    console.error("Failed to fetch holidays:", response.error);
    return [];
  }
  
  return response.data;
}