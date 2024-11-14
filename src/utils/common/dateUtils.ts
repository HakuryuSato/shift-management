// DBのリクエスト送信用に日付を計算する関数群
export function toJapanISOString(date: Date): string {
  const japanOffset = 9 * 60; // 日本標準時（UTC+9）
  const localOffset = date.getTimezoneOffset(); // ローカルタイムゾーンのオフセット
  const diff = japanOffset + localOffset; // 差分計算

  const japanTime = new Date(date.getTime() + diff * 60000);

  const yyyy = japanTime.getFullYear();
  const MM = String(japanTime.getMonth() + 1).padStart(2, '0');
  const dd = String(japanTime.getDate()).padStart(2, '0');
  const HH = String(japanTime.getHours()).padStart(2, '0');
  const mm = String(japanTime.getMinutes()).padStart(2, '0');
  const ss = String(japanTime.getSeconds()).padStart(2, '0');

  return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}`;
}

export function getStartOfDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function getEndOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

export function getEndOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

// monthモードは廃止予定？（全てのAPIが開始終了時間の範囲指定で取得する場合不要になる？）
export function getTimeRangeISOStrings(
  mode: 'day' | 'month' | 'range',
  date1: Date,
  date2?: Date
): { startTimeISO: string; endTimeISO: string } {
  let startDate: Date;
  let endDate: Date;

  switch (mode) {
    case 'day':
      startDate = getStartOfDay(date1);
      endDate = getEndOfDay(date1);
      break;
    case 'month':
      startDate = getStartOfMonth(date1);
      endDate = getEndOfMonth(date1);
      break;
    case 'range':
      if (!date2) {
        throw new Error('範囲指定モードではdate2が必要です');
      }
      startDate = getStartOfDay(date1);
      endDate = getEndOfDay(date2);
      break;
    default:
      throw new Error('無効なモードです');
  }

  const startTimeISO = toJapanISOString(startDate);
  const endTimeISO = toJapanISOString(endDate);

  return { startTimeISO, endTimeISO };
}

export const toJapanDateISOString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


// 先月の特定日付を返す
export function getPreviousMonthSpecificDate(
  day: number,
  hours: number,
  minutes: number,
  seconds: number
): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  date.setDate(day);
  date.setHours(hours, minutes, seconds, 0);
  return date;
}

// 今月の特定日付を返す
export function getCurrentMonthSpecificDate(
  day: number,
  hours: number,
  minutes: number,
  seconds: number
): Date {
  const date = new Date();
  date.setDate(day);
  date.setHours(hours, minutes, seconds, 999);
  return date;
}