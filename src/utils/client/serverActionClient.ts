'use client'

import { deleteUser } from '@/app/actions/deleteUser';
import { insertUser } from '@/app/actions/insertUser';
import { insertAttendance } from '@/app/actions/insertAttendance';
import type { User } from '@/customTypes/User';

// サーバーアクションのエラーハンドリングを共通化する関数
export async function handleServerAction<T>(action: () => Promise<T>): Promise<T | null> {
  try {
    const data = await action();
    return data;
  } catch (error: any) {
    console.error('サーバーアクション実行中にエラーが発生しました:', error.message || error);
    // 必要に応じてユーザーへのエラーメッセージ表示やログ送信を行う
    return null;
  }
}


/**
 * ユーザーを削除するサーバーアクションを呼び出す関数
 * @param userName ユーザー名
 * @returns 削除されたユーザーデータまたは null
 */
export async function deleteUserAction(userName: string): Promise<any | null> {
  return await handleServerAction(() => deleteUser(userName));
}

/**
 * 新しいユーザーを挿入するサーバーアクションを呼び出す関数
 * @param user ユーザーオブジェクト
 * @returns 挿入されたユーザーデータまたは null
 */
export async function insertUserAction(user: User): Promise<User | null> {
  return await handleServerAction(() => insertUser(user));
}

/**
 * 出退勤を挿入するサーバーアクションを呼び出す関数
 * @param userId ユーザーID
 * @returns メッセージオブジェクトまたは null
 */
export async function insertAttendanceAction(userId: number): Promise<{ message: string } | null> {
  return await handleServerAction(() => insertAttendance(userId));
}


