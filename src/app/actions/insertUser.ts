'use server';

import type { User } from '@/types/User';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';

/**
 * 新しいユーザーを挿入するサーバーアクション
 * @param userName ユーザー名
 * @returns 挿入されたユーザーデータ
 */

export async function insertUser(user: User): Promise<User> {
  const data = await handleSupabaseRequest<User>(async (supabase) => {
    return supabase
      .from('users')
      .insert({ user_name: user.user_name, employment_type: user.employment_type })
      .select()
      .single();
  });

  return data;
}
