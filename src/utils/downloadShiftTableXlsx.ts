import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

// 色の定数定義
const GREY_COLOR = 'FF8E8E93';

// 共通のスタイル
const commonStyle: Partial<ExcelJS.Style> = {
  border: {
    top: { style: 'thin', color: { argb: GREY_COLOR } },
    bottom: { style: 'thin', color: { argb: GREY_COLOR } },
    left: { style: 'thin', color: { argb: GREY_COLOR } },
    right: { style: 'thin', color: { argb: GREY_COLOR } }
  },
  alignment: { horizontal: 'center' }
};

// 条件付きスタイル
const dateStyle: Partial<ExcelJS.Style> = {
  numFmt: 'mm/dd (ddd)',
  font: { size: 12 },
  alignment: { horizontal: 'center' }
};

// B列スタイル
const rightBorderStyle: Partial<ExcelJS.Style> = {
  border: { right: { style: 'medium', color: { argb: GREY_COLOR } } }
};

// 2行目スタイル
const bottomBorderStyle: Partial<ExcelJS.Style> = {
  border: { bottom: { style: 'medium', color: { argb: GREY_COLOR } } }
};

// 2次元配列データからExcelシートを作成する関数
const createWorksheet = (data: any[][]): ExcelJS.Workbook => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  worksheet.addRows(data);

  // スタイルを条件に応じて適用
  worksheet.eachRow((row, rowIndex) => {
    row.eachCell((cell, colIndex) => {
      applyStyles(cell, rowIndex, colIndex);
    });
  });

  return workbook;
};

// スタイルを適用する関数 
const applyStyles = (cell: ExcelJS.Cell, rowIndex: number, colIndex: number) => {
  // 日付スタイル適用
  if (rowIndex > 1 && colIndex === 1 && cell.type === ExcelJS.ValueType.Date) {
    cell.numFmt = dateStyle.numFmt as string;
    Object.assign(cell.style, commonStyle, dateStyle);
  } 
  // B列スタイル適用
  else if (colIndex === 2) {
    Object.assign(cell.style, commonStyle, rightBorderStyle);
  } 
  // 2行目スタイル適用
  else if (rowIndex === 2) {
    Object.assign(cell.style, commonStyle, bottomBorderStyle);
  } 
  // 共通スタイル適用
  else {
    Object.assign(cell.style, commonStyle);
  }
};

// ダウンロード用の関数
const downloadShiftTableXlsx = async (data: any[][], year: number, month: number) => {
  const workbook = createWorksheet(data);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const fileName = `シフト管理表_${year}年${month + 1}月.xlsx`; // ファイル名を作成
  saveAs(blob, fileName); // Blobをダウンロード
};

export default downloadShiftTableXlsx;
