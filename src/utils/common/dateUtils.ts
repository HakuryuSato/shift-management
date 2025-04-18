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

// 開始終了日のISO文字列を返す
export function getTimeRangeISOStrings(
  startDate: Date,
  endDate: Date
): { startTimeISO: string; endTimeISO: string } {
  const startTimeISO = toJapanISOString(getStartOfDay(startDate));
  const endTimeISO = toJapanISOString(getEndOfDay(endDate));
  return { startTimeISO, endTimeISO };
}

export const toJapanDateISOString = (date: Date = new Date()): string => {
  const { year, month, date: day } = getJapanDateComponents(date);
  const monthStr = String(month + 1).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  return `${year}-${monthStr}-${dayStr}`;
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


// 日付の一覧を生成する
export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

/**
 * 指定日が属する週の開始日を取得
 * @param date 対象日
 * @returns 週の開始日
 */
export function getStartOfWeek(date: Date): Date {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // 月曜日基準
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

/**
 * 指定日が属する週の終了日を取得
 * @param date 対象日
 * @returns 週の終了日
 */
export function getEndOfWeek(date: Date): Date {
  const end = new Date(getStartOfWeek(date));
  end.setDate(end.getDate() + 6); // 週末日は月曜日+6
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * 日付を'MM/DD(曜日)'の形式にフォーマットする関数
 * @param date Dateオブジェクト
 * @returns フォーマットされた日付文字列
 */
export function formatDateStringToMM_DD_Day(date: Date): string {
  const options = {
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  } as const;
  return date.toLocaleDateString('ja-JP', options);
}

/**
 * 時刻を'HH:mm'の形式にフォーマットする関数
 * @param date Dateオブジェクト
 * @returns フォーマットされた時刻文字列
 */
export function formatTimeStringToHH_MM(date: Date): string {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
  } as const;
  return date.toLocaleTimeString('ja-JP', options);
}

/**
 * 時間を分に変換する関数
 * @param hoursString 
 * @returns 
 */
export function hoursToMinutes(hoursString: string): number {
  const hours = parseFloat(hoursString);
  if (isNaN(hours)) {
    return 0;
  }
  return hours * 60;
}


/**
 * 日付を 'YYYY年M月' の形式にフォーマットする関数（0詰めなし）
 * @param date Dateオブジェクト（省略時は現在日時）
 * @returns フォーマットされた日付文字列
 */
export function formatJapanDateToYearMonthNoZeroPadding(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const M = date.getMonth() + 1;
  return `${yyyy}年${M}月`;
}

/**
 * 日付を 'YYYY年MM月' の形式にフォーマットする関数
 * @param date Dateオブジェクト（省略時は現在日時）
 * @returns フォーマットされた日付文字列
 */
export function formatJapanDateToYearMonth(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  return `${yyyy}年${MM}月`;
}


/**
 * 指定した基準日をもとに「26日から翌月25日まで」の日付範囲を取得する関数
 * @param baseDate 基準となる日付
 * @param offsetMonths 基準月からのオフセット
 *   - 0: 現在の26日から翌月25日
 *   - -1: 先月の26日から当月25日
 *   - 1: 翌月の26日から翌々月25日
 * @returns 指定した範囲の開始日と終了日（ローカルタイム）
 */
export function getCustomDateRangeFrom26To25(baseDate: Date, offsetMonths: number): { rangeStartDate: Date; rangeEndDate: Date } {
  // 開始日: offsetMonths分前の26日
  const rangeStartDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + offsetMonths - 1, 26, 0, 0, 0, 0);

  // 終了日: offsetMonths分の月の25日
  const rangeEndDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + offsetMonths, 25, 23, 59, 59, 999);

  return { rangeStartDate, rangeEndDate };
}

/**
 * JSTのISO文字列からDateオブジェクトを生成する関数
 * @param dateString "YYYY-MM-DDTHH:mm:ss" の形式の文字列
 * @returns JSTのDateオブジェクト
 */
export function createJSTDateFromISO(dateString: string): Date {
  // JSTのタイムゾーンオフセットを追加
  const dateTimeWithOffset = dateString + '+09:00';

  // タイムゾーン付きの日時文字列からDateオブジェクトを作成
  return new Date(dateTimeWithOffset);
}

/**
 * 日付を 'YYYY年MM月DD日' の形式にフォーマットする関数
 * @param date Dateオブジェクト
 * @returns フォーマットされた日付文字列
 */
export function formatJapanDateToYearMonthDay(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getJapanDateComponents(date: Date): {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  dayOfWeek: number; // 追加
} {
  const utcTime = date.getTime();
  const japanTime = utcTime + 9 * 60 * 60 * 1000;
  const japanDate = new Date(japanTime);
  return {
    year: japanDate.getUTCFullYear(),
    month: japanDate.getUTCMonth(),
    date: japanDate.getUTCDate(),
    hours: japanDate.getUTCHours(),
    minutes: japanDate.getUTCMinutes(),
    dayOfWeek: japanDate.getUTCDay(), // 追加
  };
}

export function getDayRangeFromISOString(isoString: string): { startTimeISO: string; endTimeISO: string } {
  const [datePart] = isoString.split('T');
  return {
    startTimeISO: `${datePart}T00:00:00`,
    endTimeISO: `${datePart}T23:59:59`
  };
}
/**
 * 指定した年月の最終日を取得する
 */
function getLastDayOfMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 指定した日付から指定月数オフセットした新しい日付を生成する
 */
function createDateWithMonthOffset(baseDate: Date, monthOffset: number): Date {
  const newDate = new Date(baseDate);
  newDate.setMonth(newDate.getMonth() + monthOffset);
  return newDate;
}


/** 指定年月の締め日範囲（開始0:00／終了23:59:59.999）を返す */
function getClosingMonthRange(
  year: number,
  month: number,        // 0‑based
  closingDay: number,
): { start: Date; end: Date } {
  const last = getLastDayOfMonth(year, month);

  // 終了日は「締め日 or 月末」の小さい方
  const endDay = Math.min(closingDay, last);
  const end    = getEndOfDay(new Date(year, month, endDay));

  // 31 など月末締め ⇒ 当月1日始まり
  if (closingDay >= last) {
    return { start: getStartOfDay(new Date(year, month, 1)), end };
  }

  // 通常 ⇒ 前月 (締め日+1)
  const prevYear  = month === 0 ? year - 1 : year;
  const prevMonth = (month + 11) % 12;
  const prevLast  = getLastDayOfMonth(prevYear, prevMonth);
  const startDay  = Math.min(closingDay, prevLast) + 1;

  return { start: getStartOfDay(new Date(prevYear, prevMonth, startDay)), end };
}


/**
 * 締め日に基づく日付範囲を返す
 * @param baseDate     基準日
 * @param closingDay   1‑31（31＝月末締め）
 * @param offsetMonths 0=当月, ±n= n か月ズラす
 */
export function getDateRangeByClosingDate(
  baseDate: Date,
  closingDay: number,
  offsetMonths = 0,
): { rangeStartDate: Date; rangeEndDate: Date } {
  if (closingDay < 1 || closingDay > 31)
    throw new Error('締め日は 1‑31 で指定してください');

  // 対象月 1 日
  const target1st = createDateWithMonthOffset(
    new Date(baseDate.getFullYear(), baseDate.getMonth(), 1),
    offsetMonths,
  );

  const { start, end } = getClosingMonthRange(
    target1st.getFullYear(),
    target1st.getMonth(),
    closingDay,
  );

  return { rangeStartDate: start, rangeEndDate: end };
}