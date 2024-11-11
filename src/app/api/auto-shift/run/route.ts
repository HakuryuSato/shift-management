import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/server/supabaseClient';
import {toJapanDateString} from '@/utils/toJapanDateString';
import type InterFaceShiftQuery from '@customTypes/InterFaceShiftQuery';
import type { Holiday } from '@/customTypes/Holiday';
import type InterFaceTableUsers from '@/customTypes/InterFaceTableUsers';
import type { AutoShiftTime } from '@/customTypes/AutoShiftTypes';

/*
シフトの自動登録設定に従い、
毎月20日に自動的にシフト登録を行うためのAPI
Vercel Cronで毎月呼び出しを行う
*/





// GET /api/auto_shift/run
export async function GET(req: NextRequest) {
  try {

    // ベースURLを取得
    const baseUrl = req.nextUrl.origin;

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
      `${baseUrl}/api/getShift?start_time=${startOfMonth.toISOString()}&end_time=${endOfMonth.toISOString()}&user_id=${'*'}`
    );

    let existingShifts: InterFaceShiftQuery[] = [];
    if (shiftsResponse.ok) {
      const shiftsData = await shiftsResponse.json();
      existingShifts = shiftsData.data || [];
    } else {
      console.error('Failed to fetch existing shifts');
      // エラー処理やデフォルト値の設定
    }

    // 既存のシフトの日付をセットに格納
    const existingShiftKeys = new Set(
      existingShifts
        .filter(
          (shift): shift is InterFaceShiftQuery & { start_time: string | number | Date } =>
            shift !== undefined && shift.start_time !== undefined
        )
        .map((shift) =>
          `${shift.user_id}_${toJapanDateString(new Date(shift.start_time))}`
        )
    );


    // 祝日情報を取得
    const holidaysResponse = await fetch(`${baseUrl}/api/holidays`);
    let holidaysData: Holiday[] = [];
    if (holidaysResponse.ok) {
      holidaysData = await holidaysResponse.json();
    } else {
      console.error('Failed to fetch holidays');
      // エラー処理やデフォルト値の設定
    }

    const holidaysInTargetMonth = holidaysData.filter((holiday) => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getFullYear() === targetYear &&
        holidayDate.getMonth() === targetMonth
      );
    });

    // 祝日の日付をセットに格納（高速化）
    const holidayDates = new Set(
      holidaysInTargetMonth.map((holiday) => holiday.date)
    );

    // ユーザー情報を取得
    const usersResponse = await fetch(`${baseUrl}/api/getUserData`);
    let users: InterFaceTableUsers[] = [];
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      users = usersData.data || [];
    } else {
      console.error('Failed to fetch users');
      return NextResponse.json(
        { error: 'ユーザー情報の取得に失敗しました。' },
        { status: 500 }
      );
    }

    // ユーザーIDをセットに格納（高速化）
    const userIds = new Set(users.map((user) => user.user_id));

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

    if (!autoShiftSettings || autoShiftSettings.length === 0) {
      return NextResponse.json(
        { message: '有効な自動シフト設定がありません。' },
        { status: 200 }
      );
    }

    // ユーザーが削除されているなら設定無効化
    for (const setting of autoShiftSettings) {
      if (!userIds.has(setting.user_id)) {
        await supabase
          .from('auto_shift_settings')
          .update({ is_enabled: false })
          .eq('id', setting.id);
      }
    }

    // シフト登録用データを作成
    const shiftsToInsert: InterFaceShiftQuery[] = [];

    // 設定があるものでループ 最大10
    for (const setting of autoShiftSettings) {
      const userId = setting.user_id;
      const isHolidayIncluded = setting.is_holiday_included;
      const autoShiftTimes: AutoShiftTime[] = setting.auto_shift_times || [];

      // 曜日ごとのシフト設定をマップに格納（高速化）
      const dayOfWeekToShiftTime = new Map<number, AutoShiftTime>();
      for (const autoShift of autoShiftTimes) {
        if (autoShift.is_enabled) {
          dayOfWeekToShiftTime.set(autoShift.day_of_week, autoShift);
        }
      }

      // 翌月の各日をループ 最大31
      for (let day = 1; day <= endOfMonth.getDate(); day++) {
        const currentDate = new Date(targetYear, targetMonth, day);
        const dayOfWeek = currentDate.getDay(); // 0 (日曜) ～ 6 (土曜)
        const dateString = toJapanDateString(currentDate);

        // 条件をまとめてチェック
        const isHoliday = holidayDates.has(dateString);
        const autoShiftTime = dayOfWeekToShiftTime.get(dayOfWeek);
        const shiftKey = `${userId}_${dateString}`;
        const shiftExists = existingShiftKeys.has(shiftKey);

        if (
          (!isHolidayIncluded && isHoliday) || // 祝日を除外かつ祝日
          !autoShiftTime ||                    // または 該当曜日のシフト設定がない
          shiftExists                          // または 既にシフトが登録されている場合
        ) {
          continue; // 次の日付へ
        }

        // シフトデータを作成
        const startTime = `${dateString} ${autoShiftTime.start_time}`;
        const endTime = `${dateString} ${autoShiftTime.end_time}`;

        shiftsToInsert.push({
          user_id: userId,
          start_time: startTime,
          end_time: endTime,
        });
      }
    }


    // シフトデータが空なら終了
    if (shiftsToInsert.length === 0) {
      return NextResponse.json(
        { message: '登録するデータがありませんでした' },
        {
          status: 200
        }
      );
    } else { // 空でないならシフトを一括登録
      const sendShiftResponse = await fetch(
        `${baseUrl}/api/sendShift`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shiftsToInsert),
        }
      );

      if (!sendShiftResponse.ok) {
        const errorData = await sendShiftResponse.json();
        return NextResponse.json({ error: errorData.error }, { status: 500 });
      }

      return NextResponse.json(
        { message: '登録に成功しました' },
        { status: 200 }
      );
    }



  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
