'use server';

import type { Shift } from '@/types/Shift';
import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import { getShift } from '@/utils/server/api/shifts/getShift';
import { getDayRangeFromISOString } from '@/utils/common/dateUtils';

/**
 * 新しいシフトを挿入するサーバーアクション
 * @param shiftData シフトデータ
 * @returns 挿入されたシフトデータ
 */
export async function insertShift(shiftData: Shift | Shift[]): Promise<Shift[]> {
  console.log('=== シフト挿入処理開始 ===');
  console.log('入力データ:', JSON.stringify(shiftData, null, 2));

  const shiftArray = Array.isArray(shiftData) ? shiftData : [shiftData];
  console.log(`処理対象シフト数: ${shiftArray.length}`);

  const validShifts: Shift[] = [];

  // 各シフトに対して重複チェック
  for (const shift of shiftArray) {
    console.log('\n--- シフト処理開始 ---');
    console.log('シフトデータ:', JSON.stringify(shift, null, 2));

    // シフトデータが不完全な場合はスキップ
    if (!shift.user_id || !shift.start_time) {
      console.log('❌ スキップ：データが不完全');
      console.log(`user_id: ${shift.user_id}, start_time: ${shift.start_time}`);
      continue;
    }

    const { startTimeISO, endTimeISO } = getDayRangeFromISOString(shift.start_time);
    console.log('検索範囲:', { startTimeISO, endTimeISO });

    const existingShifts = await getShift({
      userId: shift.user_id.toString(),
      filterStartDateISO: startTimeISO,
      filterEndDateISO: endTimeISO
    });

    console.log(`既存シフト数: ${existingShifts.length}`);

    if (existingShifts.length === 0) {
      console.log('✅ 有効なシフトとして追加');
      validShifts.push(shift);
    } else {
      console.log('❌ スキップ：シフトが重複');
      console.log('既存シフト:', JSON.stringify(existingShifts, null, 2));
    }
  }

  // 有効なシフトがある場合のみ挿入を実行
  if (validShifts.length === 0) {
    console.log('\n❌ 有効なシフトがありません - 処理を終了します');
    return [];
  }

  console.log(`\n=== 有効なシフト数: ${validShifts.length} ===`);
  console.log('有効なシフト:', JSON.stringify(validShifts, null, 2));

  const result = await handleSupabaseRequest<Shift[]>(async (supabase) => {
    return supabase
      .from('shifts')
      .insert(validShifts)
      .select();
  });

  console.log('\n=== シフト挿入処理完了 ===');
  console.log('挿入結果:', JSON.stringify(result, null, 2));

  return result;
}
