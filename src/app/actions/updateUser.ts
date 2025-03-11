'use server';

import type { User } from '@/types/User';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';

/**
 * ユーザー情報を更新するサーバーアクション
 * @param userData 更新するユーザーデータ（user_idを含む）
 * @returns 更新されたユーザーデータ
 * @note 更新可能なフィールドは user_name, employment_type, employee_no のみ
 */
export async function updateUser(userData: Partial<User>): Promise<User> {
  // user_id が必須
  if (!userData.user_id) {
    throw new Error('user_id is required');
  }

  // 更新可能なフィールドのみを抽出
  const updateData: Partial<User> = {};
  if (userData.user_name !== undefined) updateData.user_name = userData.user_name;
  if (userData.employment_type !== undefined) updateData.employment_type = userData.employment_type;
  if (userData.employee_no !== undefined) updateData.employee_no = userData.employee_no;

  const data = await handleSupabaseRequest<User>(async (supabase) => {
    return supabase
      .from('users')
      .update(updateData)
      .eq('user_id', userData.user_id)
      .select()
      .single();
  });

  return data;
}
