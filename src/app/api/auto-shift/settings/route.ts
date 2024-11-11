import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/server/supabaseClient';

import {
  AutoShiftSettings,
  AutoShiftTime,
  AutoShiftSettingsUpsertData,
  AutoShiftTimeUpsertData,
} from '@/types/AutoShiftTypes';

// GET /api/auto_shift/settings
// 現在の設定の取得
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('user_id');

    let query = supabase
      .from('auto_shift_settings')
      .select(
        `
        *,
        auto_shift_times(*)
      `
      );

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/auto_shift/settings
export async function POST(req: NextRequest) {
  try {
    const requestData: AutoShiftSettings = await req.json();

    // auto_shift_settings の UPSERT用
    const settingDataToUpsert: AutoShiftSettingsUpsertData = {
      user_id: requestData.user_id,
      is_holiday_included: requestData.is_holiday_included,
      is_enabled: requestData.is_enabled,
    };

    const { data: settingData, error: settingError } = await supabase
      .from('auto_shift_settings')
      // 既に同じユーザーで作成済みならば更新
      .upsert(settingDataToUpsert, { onConflict: 'user_id' })
      .select();

    if (settingError || !settingData || settingData.length === 0) {
      console.error('Setting upsert error:', settingError);
      return NextResponse.json(
        { error: settingError?.message || '設定の保存に失敗しました。' },
        { status: 500 }
      );
    }

    const autoShiftSettingId = settingData[0].auto_shift_setting_id;

    // auto_shift_times の UPSERT
    const timesData: AutoShiftTimeUpsertData[] = requestData.auto_shift_times.map(
      (time: AutoShiftTime) => {
        const timeData: AutoShiftTimeUpsertData = {
          auto_shift_setting_id: autoShiftSettingId,
          day_of_week: time.day_of_week,
          start_time: time.start_time,
          end_time: time.end_time,
          is_enabled: time.is_enabled,
        };
        return timeData;
      }
    );

    const { error: timesError } = await supabase
      .from('auto_shift_times')
      .upsert(timesData, { onConflict: 'auto_shift_setting_id,day_of_week' });

    if (timesError) {
      console.error('Times upsert error:', timesError);
      return NextResponse.json({ error: timesError.message }, { status: 500 });
    }

    return NextResponse.json({ data: { message: '自動シフト設定が保存されました。' } },{ status: 200 });
  } catch (error: unknown) {
    console.error('Unhandled error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}

