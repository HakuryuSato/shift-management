'use server';

import { handleServerAction } from '@/utils/server/handleServerAction';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import type {
  AutoShiftSettings,
  AutoShiftSettingsUpsertData,
  AutoShiftTimeUpsertData,
  AutoShiftTime,
} from '@/types/AutoShift';

/**
 * 自動シフト設定と時間をアップサートするサーバーアクション
 * @param autoShiftData アップサートする自動シフトデータ
 * @returns 成功メッセージ
 */
export async function upsertAutoShift(
  autoShiftData: AutoShiftSettings
): Promise<{ message: string }> {
  return await handleServerAction(async () => {
    // auto_shift_settings の UPSERT
    const upsertedSetting = await upsertAutoShiftSetting(autoShiftData);

    // auto_shift_times の UPSERT
    await upsertAutoShiftTimes(autoShiftData.auto_shift_times, upsertedSetting.auto_shift_setting_id!);

    return { message: '自動シフト設定が保存されました。' };
  });
}

// auto_shift_settings テーブルへの UPSERT
async function upsertAutoShiftSetting(settingData: AutoShiftSettings): Promise<AutoShiftSettings> {
  const settingDataToUpsert: AutoShiftSettingsUpsertData = {
    user_id: settingData.user_id,
    is_holiday_included: settingData.is_holiday_included,
    is_enabled: settingData.is_enabled,
  };

  const upsertedSettings = await handleSupabaseRequest<AutoShiftSettings[]>(async (supabase) => {
    return supabase
      .from('auto_shift_settings')
      .upsert(settingDataToUpsert, { onConflict: 'user_id' })
      .select();
  });

  if (!upsertedSettings || upsertedSettings.length === 0) {
    throw new Error('設定の保存に失敗しました。');
  }

  return upsertedSettings[0];
}

// auto_shift_times テーブルへの UPSERT
async function upsertAutoShiftTimes(
  times: AutoShiftTime[],
  autoShiftSettingId: number
): Promise<void> {
  const timesData: AutoShiftTimeUpsertData[] = times.map((time) => ({
    auto_shift_setting_id: autoShiftSettingId,
    day_of_week: time.day_of_week,
    start_time: time.start_time,
    end_time: time.end_time,
    is_enabled: time.is_enabled,
  }));

  await handleSupabaseRequest(async (supabase) => {
    return supabase
      .from('auto_shift_times')
      .upsert(timesData, { onConflict: 'auto_shift_setting_id,day_of_week' })
      .select();
  });
}
