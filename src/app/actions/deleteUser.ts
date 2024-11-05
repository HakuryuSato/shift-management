'use server';

import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';

/**
 * ユーザーを削除するサーバーアクション
 * @param userName ユーザー名
 * @returns 削除されたユーザーデータ
 */
export async function deleteUser(userName: string) {
  const data = await handleSupabaseRequest(async (supabase) => {
    return supabase
      .from('users')
      .delete()
      .eq('user_name', userName)
      .select()
      .single();
  });

  return data;
}
