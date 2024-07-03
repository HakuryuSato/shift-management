// Import required types
import type InterFaceAdminShiftTable from '@customTypes/InterFaceAdminShiftTable';
import type InterFaceTableUsers from "@customTypes/InterFaceTableUsers";

// Convert start_time and end_time to text
function formatTime(time: string): string {
  return new Date(time).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
}

// Calculate shift hours
function calculateShiftHours(start: string, end: string): number {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  return (endHour + endMinute / 60) - (startHour + startMinute / 60);
}

// Generate a list of dates for the given month
function generateDateList(currentMonth: number, currentYear: number): string[] {
  const dates = [];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    dates.push(date.toLocaleDateString('ja-JP'));
  }
  return dates;
}

// Function to calculate total shift hours for each user
function calculateUserTotals(
  formatedShifts: InterFaceAdminShiftTable[],
  userNames: InterFaceTableUsers[]
): number[] {
  const userTotals = userNames.map(() => 0);

  formatedShifts.forEach(shift => {
    if (shift.start_time && shift.end_time) {
      const userIndex = userNames.findIndex(user => user.user_name === shift.user_name);
      if (userIndex !== -1) {
        const shiftHours = calculateShiftHours(
          formatTime(shift.start_time),
          formatTime(shift.end_time)
        );
        userTotals[userIndex] += shiftHours;
      }
    }
  });

  return userTotals;
}

// Function to calculate total shift hours for each day
function calculateDailyTotals(
  currentMonth: number,
  currentYear: number,
  formatedShifts: InterFaceAdminShiftTable[]
): Record<string, number> {
  const dateList = generateDateList(currentMonth, currentYear);
  const dailyTotals: Record<string, number> = {};

  dateList.forEach(date => {
    dailyTotals[date] = 0;
  });

  formatedShifts.forEach(shift => {
    if (shift.start_time && shift.end_time) {
      const shiftDate = new Date(shift.start_time).toLocaleDateString('ja-JP');
      const shiftHours = calculateShiftHours(
        formatTime(shift.start_time),
        formatTime(shift.end_time)
      );
      if (dailyTotals[shiftDate] !== undefined) {
        dailyTotals[shiftDate] += shiftHours;
      }
    }
  });

  return dailyTotals;
}

// Main function to generate the 2D array
export default function createTableForAdminShift(
  currentMonth: number,
  currentYear: number,
  formatedShifts: InterFaceAdminShiftTable[],
  userNames: InterFaceTableUsers[]
): (string | number)[][] {
  userNames.sort((a, b) => (a.user_name ?? '').localeCompare(b.user_name ?? ''));


  const dateList = generateDateList(currentMonth, currentYear);
  
  const userTotals = calculateUserTotals(formatedShifts, userNames);
  const dailyTotals = calculateDailyTotals(currentMonth, currentYear, formatedShifts);
  
  const headerRow = [`${currentMonth + 1}月`, "名前"].concat(userNames.map(user => user.user_name ?? ""));
  const totalRow = ["日付", "合計"].concat(userTotals.map(total => total.toString()));

  const table: (string | number)[][] = [headerRow];

  dateList.forEach(date => {
    const row: (string | number)[] = [date, dailyTotals[date]];
    userNames.forEach(user => {
      const shift = formatedShifts.find(shift => shift.user_name === user.user_name && shift.start_time && new Date(shift.start_time).toLocaleDateString('ja-JP') === date);
      if (shift && shift.start_time && shift.end_time) {
        row.push(`${formatTime(shift.start_time)}-${formatTime(shift.end_time)}`);
      } else {
        row.push("");
      }
    });
    table.push(row);
  });

  table.splice(1, 0, totalRow); // Insert the totalRow after the header row

  return table;
}
