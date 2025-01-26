import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import {toJapanDateString} from './toJapanDateString';

// FullCalendar用の型メモ
type ShiftEvent = {
  id: string;
  start: string;
  end: string;
  title: string;
  display: string;
  extendedProps: {
    is_approved: boolean;
    user_name: string;
    user_id: number;
  };
};

// メイン関数
export const downloadWeeklyShiftTableXlsx = async (startDate: Date, endDate: Date, shiftEvents: any[]) => {
  // 表示用文字列生成 MM月DD日~MM月DD日
  const fileName = `週間シフト表_${startDate.getMonth() + 1}月${startDate.getDate()}日 ~ ${
    endDate.getMonth() + 1
  }月${endDate.getDate()}日`;

  // 祝日を除外（endプロパティが存在しないイベント）
  const shiftEventsOnly: ShiftEvent[] = shiftEvents.filter(
    (event: any): event is ShiftEvent => event.end
  );

  const table = generateShiftTableData(shiftEventsOnly, startDate, fileName);

  const workbook = createWorkbookFromTable(table);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, fileName);
};

// シフトイベントをExcel用の2次元配列に変換する関数
function generateShiftTableData(
  shiftEvents: ShiftEvent[],
  startDate: Date,
  titleText: string
): string[][] {
  const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  const result: string[][] = [];

  // 1行目：タイトル
  result.push([titleText]);

  // 週の日付を取得（月曜日から土曜日まで）
  const weekDates: Date[] = [];
  for (let i = 1; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    weekDates.push(currentDate);
  }

  // 2行目：曜日を追加
  const weekDays: string[] = weekDates.map((date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekDay = daysOfWeek[date.getDay()];
    return `${month}/${day} (${weekDay})`;
  });
  result.push(['名前', ...weekDays]);

  // 全ての名前を取得して昇順ソート
  const names: string[] = Array.from(new Set(shiftEvents.map((event) => event.title))).sort();

  // 3行目以降：各名前ごとのシフトデータ
  for (const name of names) {
    const row: string[] = [name];
    for (const date of weekDates) {
      const dateString = toJapanDateString(date).split('T')[0];
      const matchingEvent = shiftEvents.find(
        (event) => event.title === name && event.start.startsWith(dateString)
      );
      if (matchingEvent) {
        const startTime = matchingEvent.start.split('T')[1].substring(0, 5);
        const endTime = matchingEvent.end.split('T')[1].substring(0, 5);
        row.push(`${startTime} ~ ${endTime}`);
      } else {
        row.push(''); // シフトがない場合は空白
      }
    }
    result.push(row);
  }

  return result;
}

// xlsxワークブック作成関数
const createWorkbookFromTable = (data: string[][]): ExcelJS.Workbook => {
  const GREY_COLOR = 'FF8E8E93';
  const RIGHT_GRAY = 'FFDDDDDD';
  const MEDIUM_BORDER = { style: 'medium' as ExcelJS.BorderStyle, color: { argb: GREY_COLOR } };
  const THIN_BORDER = { style: 'thin' as ExcelJS.BorderStyle, color: { argb: GREY_COLOR } };
  const THICK_BORDER = { style: 'thick' as ExcelJS.BorderStyle, color: { argb: GREY_COLOR } };

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('週間シフト');
  worksheet.addRows(data);

  worksheet.eachRow((row, rowIndex) => {
    const rowCount = worksheet.rowCount;
    const colCount = worksheet.columnCount;

    row.eachCell((cell, colIndex) => {
      if (rowIndex === 1 && colIndex === 1) return; // A1除外

      const isSecondRow = rowIndex === 2;
      const isSecondCol = colIndex === 1;

      const borders: Partial<ExcelJS.Borders> = {
        top: THIN_BORDER,
        bottom: THIN_BORDER,
        left: THIN_BORDER,
        right: THIN_BORDER,
      };

      if (isSecondRow && isSecondCol) {
        borders.right = MEDIUM_BORDER;
        borders.bottom = MEDIUM_BORDER;
      } else if (isSecondRow) {
        borders.bottom = MEDIUM_BORDER;
      } else if (isSecondCol) {
        borders.right = MEDIUM_BORDER;
      }

      // 外側のセルのボーダー追加
      if (rowIndex === 2) borders.top = THICK_BORDER; // 上
      if (rowIndex === rowCount) borders.bottom = THICK_BORDER; // 下
      if (colIndex === 1) borders.left = THICK_BORDER; // 左
      if (colIndex === colCount) borders.right = THICK_BORDER; // 右

      cell.style = {
        border: borders,
        alignment: { horizontal: 'center' },
      };
    });
  });

  // タイトルは左揃えに
  worksheet.getCell('A1').alignment = { horizontal: 'left' };

  // 列幅の設定
  worksheet.getColumn(1).width = 12;
  for (let colIndex = 2; colIndex <= worksheet.columnCount; colIndex++) {
    worksheet.getColumn(colIndex).width = 13;
  }

  // 偶数行に色を付ける
  for (let rowIndex = 3; rowIndex <= worksheet.rowCount; rowIndex += 2) {
    const row = worksheet.getRow(rowIndex);
    row.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: RIGHT_GRAY },
      };
    });
  }

  return workbook;
};

