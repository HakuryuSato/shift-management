// downloadShiftTableXlsx.ts

import * as XLSX from 'xlsx';

// 2次元配列データからExcelシートを作成する関数
const createWorksheet = (data: string[][]): XLSX.WorkSheet => {
  return XLSX.utils.aoa_to_sheet(data);
};

// 新しいExcelブックを作成し、シートを追加する関数
const createWorkbook = (worksheet: XLSX.WorkSheet): XLSX.WorkBook => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  return workbook;
};

// Excelブックをバッファに変換する関数
const writeWorkbookToBuffer = (workbook: XLSX.WorkBook): ArrayBuffer => {
  return XLSX.write(workbook, { bookType: "xlsx", type: "array" });
};

// バッファからBlobを作成する関数
const createBlob = (buffer: ArrayBuffer): Blob => {
  return new Blob([buffer], { type: "application/octet-stream" });
};

// ダウンロード用のリンクを作成し、クリックさせる関数
const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// メインのダウンロード関数
 const downloadShiftTableXlsx = (data: string[][], year: number, month: number) => {
  const worksheet = createWorksheet(data); // 2次元配列データからシートを作成
  const workbook = createWorkbook(worksheet); // ブックを作成し、シートを追加
  const excelBuffer = writeWorkbookToBuffer(workbook); // ブックをバッファに変換
  const blob = createBlob(excelBuffer); // バッファからBlobを作成
  const fileName = `シフト管理表_${year}年${month + 1}月.xlsx`; // ファイル名を作成
  downloadBlob(blob, fileName); // Blobをダウンロード
};

export default downloadShiftTableXlsx