// Import required types
import type InterFaceAdminShiftTable from '@customTypes/InterFaceAdminShiftTable';
import type InterFaceTableUsers from "@customTypes/InterFaceTableUsers";


// メイン関数
export default function createTableForAdminShift(
  currentMonth: number,
  currentYear: number,
  formatedShifts: InterFaceAdminShiftTable[],
  userNames: InterFaceTableUsers[]
): (string | number)[][] {
  userNames.sort((a, b) => (a.user_name ?? '').localeCompare(b.user_name ?? ''));



  // 日付リストを生成（先月26日から今月25日まで）
  const dateList = generateDateListFrom26thTo25th(currentMonth, currentYear);
  
  const { userTotals, userOvertimeTotals } = calculateUserTotals(formatedShifts, userNames);
  const dailyTotals = calculateDailyTotals(currentMonth, currentYear, formatedShifts);
  
  const headerRow = [`${currentMonth + 1}月`, "名前"].concat(userNames.map(user => user.user_name ?? ""));
  const overtimeRow = ["-", "時間外(H)"].concat(userOvertimeTotals.map(total => total.toString()));
  const totalRow = ["日付", "合計(H)"].concat(userTotals.map(total => total.toString()));




  const table: (string | number)[][] = [headerRow];

  dateList.forEach(date => {
    const row: (string | number)[] = [date, dailyTotals[date]];
    userNames.forEach(user => {
      const shift = formatedShifts.find(shift => shift.user_name === user.user_name && shift.start_time && new Date(shift.start_time).toLocaleDateString('ja-JP') === date);
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
    dates.push(new Date(date).toLocaleDateString('ja-JP'));
  }

  return dates;
}

// Function to calculate total shift hours for each user
function calculateUserTotals(
  formatedShifts: InterFaceAdminShiftTable[],
  userNames: InterFaceTableUsers[]
): { userTotals: number[], userOvertimeTotals: number[] } {
  const userTotals = userNames.map(() => 0);
  const userOvertimeTotals = userNames.map(() => 0);

  formatedShifts.forEach(shift => {
    if (shift.start_time && shift.end_time) {
      const userIndex = userNames.findIndex(user => user.user_name === shift.user_name);
      if (userIndex !== -1) {
        let shiftHours = calculateShiftHours(
          formatTimeForJPHourMinute(shift.start_time),
          formatTimeForJPHourMinute(shift.end_time)
        );

        // 昼休憩の時間を調整
        const startHour = new Date(shift.start_time).getHours();
        const endHour = new Date(shift.end_time).getHours();
        if (startHour <= 12 && endHour >= 13) {
          shiftHours -= 1; // 1時間の昼休憩を減算
        }

        // 8時間を超えた分は時間外として加算
        if (shiftHours > 8) {
          userOvertimeTotals[userIndex] += (shiftHours - 8); // 8時間を超える分を残業時間として計算
          shiftHours = 8; // 残業時間を除いた8時間を通常時間として計算
        }

        userTotals[userIndex] += shiftHours;
      }
    }
  });

  return { userTotals, userOvertimeTotals };
}

// Function to calculate total shift hours for each day
function calculateDailyTotals(
  currentMonth: number,
  currentYear: number,
  formatedShifts: InterFaceAdminShiftTable[]
): Record<string, number> {
  const dateList = generateDateListFrom26thTo25th(currentMonth, currentYear);
  const dailyTotals: Record<string, number> = {};

  dateList.forEach(date => {
    dailyTotals[date] = 0;
  });

  formatedShifts.forEach(shift => {
    if (shift.start_time && shift.end_time) {
      const shiftDate = new Date(shift.start_time).toLocaleDateString('ja-JP');
      const shiftHours = calculateShiftHours(
        formatTimeForJPHourMinute(shift.start_time),
        formatTimeForJPHourMinute(shift.end_time)
      );
      if (dailyTotals[shiftDate] !== undefined) {
        dailyTotals[shiftDate] += shiftHours;
      }
    }
  });

  return dailyTotals;
}

// 日付の書式を変更("2024/07/01" => "7/1(月)"")
function changeDateFormat(input:any) {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const output = [...input];
  for (let i = 3; i < input.length; i++) {
      const date = new Date(input[i][0]);
      const dayOfWeek = days[date.getDay()];
      output[i][0] = `${date.getMonth() + 1}/${date.getDate()}(${dayOfWeek})`;
  }
  return output;
}

