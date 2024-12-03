import { Holiday } from '@/types/Holiday';

export async function getHolidays(): Promise<Holiday[]> {
  const res = await fetch('https://holidays-jp.github.io/api/v1/date.json', {
    // キャッシュ時間を1ヶ月(2592000秒)に設定
    next: { revalidate: 2592000 },
  });

  if (!res.ok) {
    console.error('Failed to fetch holidays');
    throw new Error('Failed to fetch holidays');
  }

  // 型アサーションを追加
  const data: Record<string, string> = await res.json();

  const holidays: Holiday[] = Object.entries(data).map(([date, title]) => ({
    date,
    title,
  }));

  return holidays;
}
