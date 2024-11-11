'use client'

// サーバーアクション関数(サーバーアクションと同じ名称でこのクライアントから実行するため、serverAction xx でインポートしています)
import { deleteUser as serverActionDeleteUser } from '@/app/actions/deleteUser';
import { insertUser as serverActionInsertUser } from '@/app/actions/insertUser';
import { insertAttendance as serverActionInsertAttendance } from '@/app/actions/insertAttendance';
import { insertShift as serverActionInsertShift } from '@/app/actions/insertShift';
import { updateShift as serverActionUpdateShift } from '@/app/actions/updateShift';
import { deleteShift as serverActionDeleteShift } from '@/app/actions/deleteShift';

// 型
import type { User } from '@/customTypes/User';
import type { Shift } from '@/customTypes/Shift';


// サーバーアクションのエラーハンドリングを共通化する関数  ---------------------------------------------------------------------------------------------------
export async function handleServerAction<T>(action: () => Promise<T>): Promise<T | null> {
  try {
    const data = await action();
    console.log('serverActionClient:', data)
    return data;
  } catch (error: any) {
    console.error('サーバーアクション実行中にエラーが発生しました:', error.message || error);
    return null;
  }
}



// サーバーアクション呼び出し関数群  ---------------------------------------------------------------------------------------------------
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
 * 出退勤を挿入するサーバーアクションを呼び出す関数
 * @param userId ユーザーID
 * @returns メッセージオブジェクトまたは null
 */
export async function insertAttendance(userId: number): Promise<{ message: string } | null> {
  return await handleServerAction(() => serverActionInsertAttendance(userId));
}


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