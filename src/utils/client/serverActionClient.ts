'use client'

// サーバーアクション関数(サーバーアクションと同じ名称でこのクライアントから実行するため、serverAction xx でインポートしています)
import { deleteUser as serverActionDeleteUser } from '@/app/actions/deleteUser';
import { insertUser as serverActionInsertUser } from '@/app/actions/insertUser';
import { updateUser as serverActionUpdateUser } from '@/app/actions/updateUser';
import { insertShift as serverActionInsertShift } from '@/app/actions/insertShift';
import { updateShift as serverActionUpdateShift } from '@/app/actions/updateShift';
import { deleteShift as serverActionDeleteShift } from '@/app/actions/deleteShift';
import { punchAttendance as serverActionpunchAttendance } from '@/app/actions/punchAttendance';
import { updateAttendance as serverActionUpdateAttendance } from '@/app/actions/updateAttendance';
import { insertAttendance as serverActionInsertAttendance } from '@/app/actions/insertAttendance';
import { updateAttendanceStamp as serverActionUpdateAttendanceStamp } from '@/app/actions/updateAttendanceStamp';
import { deleteAttendance as serverActionDeleteAttendance } from '@/app/actions/deleteAttendance';
import { upsertAutoShift as serverActionUpsertAutoShift } from '@/app/actions/upsertAutoShift';
import { updateSettings as serverActionUpdateSettings } from '@/app/actions/updateSettings';

// 型
import type { User } from '@/types/User';
import type { Shift } from '@/types/Shift';
import type { Attendance } from '@/types/Attendance'
import type { AutoShiftSettings } from '@/types/AutoShift';




// サーバーアクションのエラーハンドリングを共通化する関数 -------------------------------------------------
export async function handleServerAction<T>(action: () => Promise<T>): Promise<T> {
  try {
    // 開発環境でのみ関数の文字列表現をログ出力
    if (process.env.NODE_ENV === 'development') {
      console.log('serverActionClient sending:', action.toString());
    }
    const data = await action();
    // 開発環境でのみデータをログ出力
    if (process.env.NODE_ENV === 'development') {
      console.log('serverActionClient received:', data);
    }
    return data;
  } catch (error: any) {
    console.error('サーバーアクション実行中にエラーが発生しました:', error.message || error);
    throw error; // エラーを再スローして上位で処理できるようにする
  }
}



// サーバーアクション呼び出し関数群 -------------------------------------------------

// ユーザー関連 ---------------------------------------------------------------------------------------------------
/**
 * ユーザーを削除するサーバーアクションを呼び出す関数
 * @param userName ユーザー名
 * @returns 削除されたユーザーデータまたは null
 */
export async function deleteUser(userName: string): Promise<any | null> {
  return await handleServerAction(() => serverActionDeleteUser(userName));
}

/**
 * 新しいユーザーを挿入するサーバーアクションを呼び出す関数
 * @param user ユーザーオブジェクト
 * @returns 挿入されたユーザーデータまたは null
 */
export async function insertUser(user: User): Promise<User | null> {
  return await handleServerAction(() => serverActionInsertUser(user));
}

/**
 * ユーザー情報を更新するサーバーアクションを呼び出す関数
 * @param userData 更新するユーザーデータ
 * @returns 更新されたユーザーデータまたは null
 */
export async function updateUser(userData: Partial<User>): Promise<User> {
  return await handleServerAction(() => serverActionUpdateUser(userData));
}








// 出退勤関連  ---------------------------------------------------------------------------------------------------
/**
 * 出退勤StampとResultを挿入するサーバーアクションを呼び出す関数(出退勤のみ挿入はサーバーアクション側で処理している)
 * @param userId ユーザーID
 * @returns メッセージオブジェクトまたは null
 */
export async function punchAttendance(userId: number): Promise<Attendance[]> {
  return await handleServerAction(() => serverActionpunchAttendance(userId));
}

/**
 * 出勤データを挿入するサーバーアクションを呼び出す関数
 * @param attendanceData 挿入する出勤データ
 * @returns 挿入された出勤データまたは null
 */
export async function insertAttendance(attendanceData: Partial<Attendance>): Promise<Attendance[] | null> {
  return await handleServerAction(() => serverActionInsertAttendance(attendanceData));
}


/**
 * 出退勤データを更新するサーバーアクションを呼び出す関数
 * @param attendanceData 出勤データ（単一または複数のAttendanceResult型）
 * @returns 挿入または更新された出勤データまたは null
 */
export async function updateAttendance(attendanceData: Partial<Attendance>): Promise<Attendance[] | null> {
  return await handleServerAction(() => serverActionUpdateAttendance(attendanceData));
}

/**
 * 打刻時間の修正と勤務時間の再計算を行うサーバーアクションを呼び出す関数
 * @param attendance 更新する出勤データ
 * @returns 更新された出勤データ
 */
export async function updateAttendanceStamp(attendance: Partial<Attendance>): Promise<Attendance> {
  return await handleServerAction(() => serverActionUpdateAttendanceStamp(attendance));
}

/**
 * 出勤データを削除するサーバーアクションを呼び出す関数
 * @param attendanceId 削除する出勤データのID
 * @returns 削除された出勤データまたはnull
 */
export async function deleteAttendance(attendanceId: number): Promise<Attendance | null> {
  return await handleServerAction(() => serverActionDeleteAttendance(attendanceId));
}












// シフト関連 ---------------------------------------------------------------------------------------------------
/**
 * シフトを挿入するサーバーアクションを呼び出す関数
 * @param shiftData シフトデータ（単一または複数のShiftQuery型）
 * @returns 挿入されたシフトデータまたは null
 */
export async function insertShift(shiftData: Shift | Shift[]): Promise<Shift[] | null> {
  return await handleServerAction(() => serverActionInsertShift(shiftData));
}

/**
 * シフトを更新するサーバーアクションを呼び出す関数
 * @param shiftData 更新するシフトデータ
 * @returns 更新されたシフトデータまたは null
 */
export async function updateShift(shiftData: Shift): Promise<Shift[] | null> {
  return await handleServerAction(() => serverActionUpdateShift(shiftData));
}

/**
 * シフトを削除するサーバーアクションを呼び出す関数
 * @param shiftId シフトID
 * @returns 削除されたシフトデータまたは null
 */
export async function deleteShift(shiftId: Number): Promise<Shift | null> {
  return await handleServerAction(() => serverActionDeleteShift(shiftId));
}












// 自動シフト関連 ---------------------------------------------------------------------------------------------------
/**
 * 自動シフト設定をアップサートするサーバーアクションを呼び出す関数
 * @param autoShiftData アップサートする自動シフトデータ
 * @returns 成功メッセージまたは null
 */
export async function upsertAutoShift(
  autoShiftData: AutoShiftSettings
): Promise<{ message: string } | null> {
  return await handleServerAction(() => serverActionUpsertAutoShift(autoShiftData));
}

// 設定関連 ---------------------------------------------------------------------------------------------------
/**
 * 設定を更新するサーバーアクションを呼び出す関数
 * @param key 設定のキー
 * @param value 設定の値
 * @returns 更新された設定の値
 */
export async function updateSettings(key: string, value: string): Promise<string> {
  return await handleServerAction(() => serverActionUpdateSettings({ key, value }));
}
