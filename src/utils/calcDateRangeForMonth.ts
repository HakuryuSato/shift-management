import {toJapanDateString} from '@/utils/toJapanDateString';

export function calcDateRangeForMonth(month:number,isAdmin?:boolean) {
  const now = new Date();
  const year = now.getFullYear();

  if (isAdmin) {
    // 管理者用範囲: 前月の26日から今月の25日まで
    const startDate = new Date(year, month - 1, 26); // 前月の26日
    const endDate = new Date(year, month, 25);       // 今月の25日
    return {
      start_date: toJapanDateString(startDate),
      end_date: toJapanDateString(endDate)
    };
  } else {
    // 通常ユーザー範囲: 該当月の1日から末尾まで
    const startDate = new Date(year, month, 1);      // 該当月の1日
    const endDate = new Date(year, month + 1, 0);    // 該当月の末日
    return {
      start_date: toJapanDateString(startDate),
      end_date: toJapanDateString(endDate)
    };
  }
}
