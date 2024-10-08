import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@api/supabase';

// GET /api/auto_shift/settings
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/auto_shift/settings
export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json();

    // auto_shift_settings の UPSERT
    const { data: settingData, error: settingError } = await supabase
      .from('auto_shift_settings')
      .upsert(
        {
          id: requestData.id, // 新規の場合は undefined
          user_id: requestData.user_id,
          is_holiday_included: requestData.is_holiday_included,
          is_enabled: requestData.is_enabled,
        },
        { onConflict: 'id' }
      )
      .select();

    if (settingError || !settingData || settingData.length === 0) {
      return NextResponse.json({ error: settingError?.message || '設定の保存に失敗しました。' }, { status: 500 });
    }

    const autoShiftSettingId = settingData[0].id;

    // auto_shift_times の UPSERT
    const timesData = requestData.auto_shift_times.map((time: any) => ({
      id: time.id, // 新規の場合は undefined
      auto_shift_setting_id: autoShiftSettingId,
      day_of_week: time.day_of_week,
      start_time: time.start_time,
      end_time: time.end_time,
      is_enabled: time.is_enabled,
    }));

    const { error: timesError } = await supabase
      .from('auto_shift_times')
      .upsert(timesData, { onConflict: 'id' });

    if (timesError) {
      return NextResponse.json({ error: timesError.message }, { status: 500 });
    }

    return NextResponse.json({ message: '自動シフト設定が保存されました。' }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
