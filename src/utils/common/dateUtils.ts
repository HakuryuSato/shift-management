/**
 * 日本時間におけるDateオブジェクトを取得する関数
 * @param date 元のDateオブジェクト
 * @returns 日本時間に調整されたDateオブジェクト
 */
function getJapanDate(date: Date): Date {
  // 日本標準時 (UTC+9) へのオフセット計算
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const japanTime = utc + 9 * 3600000;
  return new Date(japanTime);
}

/**
 * 日本時間の各種日時要素を取得する関数
 * @param date Dateオブジェクト
 * @returns 年、月、日、曜日、時間、分、秒を含むオブジェクト
 */
function getJapanDateComponents(date: Date): {
  year: number;
  month: number;
  day: number;
  weekday: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const japanDate = getJapanDate(date);
  return {
    year: japanDate.getUTCFullYear(),
    month: japanDate.getUTCMonth() + 1, // 月は0始まりなので+1
    day: japanDate.getUTCDate(),
    weekday: japanDate.getUTCDay(), // 0 (日曜日) ～ 6 (土曜日)
    hours: japanDate.getUTCHours(),
    minutes: japanDate.getUTCMinutes(),
    seconds: japanDate.getUTCSeconds(),
  };
}

// 以下、既存の関数を修正

/**
 * DBのリクエスト送信用に日付を計算する関数
 * @param date Dateオブジェクト
 * @returns 日本時間のISO形式の文字列
 */
export function toJapanISOString(date: Date): string {
  const { year, month, day, hours, minutes, seconds } = getJapanDateComponents(date);

  const yyyy = year;
  const MM = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const HH = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}`;
}

export function getStartOfDay(date: Date): Date {
  const japanDate = getJapanDate(date);
  japanDate.setUTCHours(0, 0, 0, 0);
  return japanDate;
}

export function getEndOfDay(date: Date): Date {
  const japanDate = getJapanDate(date);
  japanDate.setUTCHours(23, 59, 59, 999);
  return japanDate;
}

export function getStartOfMonth(date: Date): Date {
  const japanDate = getJapanDate(date);
  return new Date(Date.UTC(japanDate.getUTCFullYear(), japanDate.getUTCMonth(), 1, 0, 0, 0, 0));
}

export function getEndOfMonth(date: Date): Date {
  const japanDate = getJapanDate(date);
  return new Date(Date.UTC(japanDate.getUTCFullYear(), japanDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));
}

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

/**
 * 日本時間の「YYYY-MM-DD」形式の日付文字列を取得する関数
 * @param date 任意の日付オブジェクト（省略時は現在日時）
 * @returns 日本時間でフォーマットされた「YYYY-MM-DD」形式の日付文字列
 */
export const toJapanDateISOString = (date: Date = new Date()): string => {
  const { year, month, day } = getJapanDateComponents(date);
  const yyyy = year;
  const MM = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${yyyy}-${MM}-${dd}`;
};

// 先月の特定日付を返す
export function getPreviousMonthSpecificDate(
  day: number,
  hours: number,
  minutes: number,
  seconds: number
): Date {
  const date = getJapanDate(new Date());
  date.setUTCMonth(date.getUTCMonth() - 1);
  date.setUTCDate(day);
  date.setUTCHours(hours, minutes, seconds, 0);
  return date;
}

// 今月の特定日付を返す
export function getCurrentMonthSpecificDate(
  day: number,
  hours: number,
  minutes: number,
  seconds: number
): Date {
  const date = getJapanDate(new Date());
  date.setUTCDate(day);
  date.setUTCHours(hours, minutes, seconds, 999);
  return date;
}

// 日付の一覧を生成する
export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let currentDate = getStartOfDay(startDate);
  endDate = getEndOfDay(endDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return dates;
}

/**
 * 指定日が属する週の開始日を取得
 * @param date 対象日
 * @returns 週の開始日
 */
export function getStartOfWeek(date: Date): Date {
  const japanDate = getJapanDate(date);
  const day = japanDate.getUTCDay();
  const diff = japanDate.getUTCDate() - day + (day === 0 ? -6 : 1); // 月曜日基準
  japanDate.setUTCDate(diff);
  japanDate.setUTCHours(0, 0, 0, 0);
  return japanDate;
}

/**
 * 指定日が属する週の終了日を取得
 * @param date 対象日
 * @returns 週の終了日
 */
export function getEndOfWeek(date: Date): Date {
  const startOfWeek = getStartOfWeek(date);
  startOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6); // 週末日は月曜日+6
  startOfWeek.setUTCHours(23, 59, 59, 999);
  return startOfWeek;
}

/**
 * 日付を'MM/DD(曜日)'の形式にフォーマットする関数
 * @param date Dateオブジェクト
 * @returns フォーマットされた日付文字列
 */
export function formatDateStringToMM_DD_Day(date: Date): string {
  const { month, day, weekday } = getJapanDateComponents(date);
  const MM = String(month).padStart(2, '0');
  const DD = String(day).padStart(2, '0');
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekdayStr = weekdays[weekday];
  return `${MM}/${DD}(${weekdayStr})`;
}

/**
 * 時刻を'HH:mm'の形式にフォーマットする関数
 * @param date Dateオブジェクト
 * @returns フォーマットされた時刻文字列
 */
export function formatTimeStringToHH_MM(date: Date): string {
  const { hours, minutes } = getJapanDateComponents(date);
  const HH = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${HH}:${mm}`;
}

/**
 * 時間を分に変換する関数
 * @param hoursString 
 * @returns 分に変換された数値
 */
export function hoursToMinutes(hoursString: string): number {
  const hours = parseFloat(hoursString);
  if (isNaN(hours)) {
    return 0;
  }
  return hours * 60;
}

/**
 * 日本時間の日付を「xx年xx月」の形式で返す関数
 * @param date Dateオブジェクト
 * @returns フォーマットされた日付文字列
 */
export function formatJapanDateToYearMonth(date: Date): string {
  const { year, month } = getJapanDateComponents(date);
  return `${year}年${month}月`;
}
