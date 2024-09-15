// 基盤

// 型
import type InterFaceAdminShiftTable from '@customTypes/InterFaceAdminShiftTable';
import type InterFaceTableUsers from "@customTypes/InterFaceTableUsers";

// 変換用
import toJapanDateString from './toJapanDateString';



// メイン関数
export default function createTableForAdminShift(
  currentMonth: number,
  currentYear: number,
  formatedShifts: InterFaceAdminShiftTable[],
  userNames: InterFaceTableUsers[],
  holidays: { title: string; date: string }[]

): (string | number)[][] {
  // 関数ここから ---------------------------------------------------------------------------------------------------

  userNames.sort((a, b) => (a.user_name ?? '').localeCompare(b.user_name ?? ''));

  // 日付リストを生成（先月26日から今月25日まで）
  const dateList = generateDateListFrom26thTo25th(currentMonth, currentYear);


  const { dailyTotals, userTotals, userOvertimeTotals } = calculateTotalHours(
    formatedShifts,
    userNames,
    dateList,
    holidays
  );

  const headerRow = [`${currentMonth + 1}月`, "名前"].concat(userNames.map(user => user.user_name ?? ""));
  const overtimeRow = ["-", "時間外(H)"].concat(userOvertimeTotals.map(total => total.toString()));
  const totalRow = ["日付", "合計(H)"].concat(userTotals.map(total => total.toString()));
  const table: (string | number)[][] = [headerRow];

  dateList.forEach(date => {
    const row: (string | number)[] = [date, dailyTotals[date]];
    userNames.forEach(user => {
      const shift = formatedShifts.find(shift => shift.user_name === user.user_name && shift.start_time && toJapanDateString(new Date(shift.start_time))=== date);
      if (shift && shift.start_time && shift.end_time) {
        row.push(`${formatTimeForJPHourMinute(shift.start_time)}-${formatTimeForJPHourMinute(shift.end_time)}`);
      } else {
        row.push("");
      }
    });
    table.push(row);
  });

  table.splice(1, 0, overtimeRow);
  table.splice(2, 0, totalRow);

  const result = changeDateFormat(table);


  return result;
}



// Convert start_time and end_time to text
function formatTimeForJPHourMinute(time: string): string {
  return new Date(time).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
}

// Calculate shift hours
function calculateShiftHours(start: string, end: string): number {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  return (endHour + endMinute / 60) - (startHour + startMinute / 60);
}

// 先月26日から今月25日までの日付リストを生成する関数
function generateDateListFrom26thTo25th(currentMonth: number, currentYear: number): string[] {
  const dates = [];

  const startDate = new Date(currentYear, currentMonth - 1, 26); // 先月26日
  const endDate = new Date(currentYear, currentMonth, 25); // 今月25日

  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    dates.push(toJapanDateString(new Date(date)));
  }

  return dates;
}

// 日付の書式を変更("2024-07-01" => "7/1(月)")
function changeDateFormat(input: any) {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const output = [...input];
  for (let i = 3; i < input.length; i++) {
    const dateParts = input[i][0].split('-'); // "2024-07-01"を分割
    const date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
    const dayOfWeek = days[date.getDay()];
    output[i][0] = `${date.getMonth() + 1}/${date.getDate()}(${dayOfWeek})`;
  }
  return output;
}


// 日別とユーザー別の合計労働時間を計算
function calculateTotalHours(
  formatedShifts: InterFaceAdminShiftTable[],
  userNames: InterFaceTableUsers[],
  dateList: string[], // dateListを引数に追加
  holidays: { title: string; date: string }[] // 祝日データを追加
): { dailyTotals: Record<string, number>, userTotals: number[], userOvertimeTotals: number[] } {
  const userTotals = userNames.map(() => 0);
  const userOvertimeTotals = userNames.map(() => 0);

  const dailyTotals: Record<string, number> = {};
  dateList.forEach(date => { dailyTotals[date] = 0; });

  const holidaySet = new Set(holidays.map(holiday => holiday.date));

  formatedShifts.forEach(shift => {
    if (shift.start_time && shift.end_time) {
      const shiftDate = toJapanDateString(new Date(shift.start_time));
      let dailyShiftHours = calculateShiftHours(
        formatTimeForJPHourMinute(shift.start_time),
        formatTimeForJPHourMinute(shift.end_time)
      );



      // ユーザーごとの合計に加算
      const userIndex = userNames.findIndex(user => user.user_name === shift.user_name);
      if (userIndex !== -1) {

        // 昼休憩の時間を調整
        const startHour = new Date(shift.start_time).getHours();
        const endHour = new Date(shift.end_time).getHours();
        if (startHour <= 12 && endHour >= 13) {
          dailyShiftHours -= 1; // 1時間の昼休憩を減算
        }

        // 日ごとの合計に加算
        dailyTotals[shiftDate] += dailyShiftHours;

        const isHoliday = holidaySet.has(shiftDate);
        if (isHoliday) {
          userOvertimeTotals[userIndex] += dailyShiftHours;
        } else {
          userOvertimeTotals[userIndex] += Math.max(0, dailyShiftHours - 8);
          userTotals[userIndex] += Math.min(dailyShiftHours, 8);
        }

      }
    }
  });

  return { dailyTotals, userTotals, userOvertimeTotals };
}
