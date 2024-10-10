import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@api/supabase';
import toJapanDateString from '@/utils/toJapanDateString';
import type InterFaceShiftQuery from '@customTypes/InterFaceShiftQuery';
import type { Holiday } from '@/customTypes/Holiday';
import type InterFaceTableUsers from '@/customTypes/InterFaceTableUsers';
import type { AutoShiftTime } from '@/customTypes/AutoShiftTypes';

/*
シフトの自動登録設定に従い、
毎月x日に自動的にシフト登録を行うためのAPI
Vercel Cronで毎月呼び出しを行う
*/

// GET /api/auto_shift/run
export async function GET(req: NextRequest) {
  try {
    // 現在の日時を取得
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-11

    // 翌月の年月を計算
    const targetDate = new Date(year, month + 1, 1);
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth(); // 0-11

    // 翌月の開始日と終了日を取得
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0);

    // 翌月のシフト情報を全て取得（重複チェック用）
    const shiftsResponse = await fetch(
      `${process.env.BASE_URL}/api/getShift?start_time=${startOfMonth.toISOString()}&end_time=${endOfMonth.toISOString()}&user_id=${'*'}`
    );
    const shiftsData = await shiftsResponse.json();
    const existingShifts = shiftsData.data;

    // 翌月の祝日情報を取得
    const holidaysResponse = await fetch(`${process.env.BASE_URL}/api/holidays`);
    const holidaysData = await holidaysResponse.json();
    const holidays = holidaysData.filter((holiday: Holiday) => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getFullYear() === targetYear && holidayDate.getMonth() === targetMonth
      );
    });

    // ユーザー情報を取得
    const usersResponse = await fetch(`${process.env.BASE_URL}/api/getUserData`);
    const usersData = await usersResponse.json();
    const users = usersData.data;

    // 有効な自動シフト設定を取得
    const { data: autoShiftSettings, error } = await supabase
      .from('auto_shift_settings')
      .select(
        `
        *,
        auto_shift_times(*)
      `
      )
      .eq('is_enabled', true);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ユーザーIDの存在チェックと無効化
    for (const setting of autoShiftSettings) {
      const userExists = users.some((user: InterFaceTableUsers) => user.user_id === setting.user_id);
      if (!userExists) {
        // ユーザーが存在しない場合、is_enabledをfalseに更新
        await supabase
          .from('auto_shift_settings')
          .update({ is_enabled: false })
          .eq('id', setting.id);
      }
    }

    // シフト登録用データを作成
    const shiftsToInsert: InterFaceShiftQuery[] = [];

    for (const setting of autoShiftSettings) {
      const userId = setting.user_id;
      const isHolidayIncluded = setting.is_holiday_included;
      const autoShiftTimes = setting.auto_shift_times;

      // 翌月の各日をループ
      for (let day = 1; day <= endOfMonth.getDate(); day++) {
        const currentDate = new Date(targetYear, targetMonth, day);
        const dayOfWeek = currentDate.getDay(); // 0 (日曜) ～ 6 (土曜)

        // 祝日判定
        const isHoliday = holidays.some(
          (holiday: Holiday) => holiday.date === toJapanDateString(currentDate)
        );
        if (!isHolidayIncluded && isHoliday) {
          continue; // 祝日を含めない設定の場合、スキップ
        }

        // 該当曜日のシフト設定が有効でない場合、スキップ
        const autoShiftTime = autoShiftTimes.find(
          (autoShift: AutoShiftTime) => autoShift.day_of_week === dayOfWeek && autoShift.is_enabled
        );
        if (!autoShiftTime) {
          continue;
        }

        // 既にシフトが登録されているか確認
        const shiftExists = existingShifts.some((shift: InterFaceShiftQuery | undefined) => {
          if (!shift || !shift.start_time) {
            return false; // shift または start_time が undefined の場合、falseを返す
          }
          return (
            shift.user_id === userId &&
            toJapanDateString(new Date(shift.start_time)) === toJapanDateString(currentDate)
          );
        });

        if (shiftExists) {
          continue; // 既にシフトがある場合、スキップ
        }

        // シフトデータを作成
        const dateString = toJapanDateString(currentDate);
        const startTime = `${dateString} ${autoShiftTime.start_time}`;
        const endTime = `${dateString} ${autoShiftTime.end_time}`;

        shiftsToInsert.push({
          user_id: userId,
          start_time: startTime,
          end_time: endTime,
        });
      }
    }

    // シフトを一括登録
    if (shiftsToInsert.length > 0) {
      const sendShiftResponse = await fetch(`${process.env.BASE_URL}/api/sendShift`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shiftsToInsert),
      });

      if (!sendShiftResponse.ok) {
        const errorData = await sendShiftResponse.json();
        return NextResponse.json({ error: errorData.error }, { status: 500 });
      }
    }

    return NextResponse.json({ message: '自動シフト登録が完了しました。' }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
