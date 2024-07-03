import * as XLSX from 'xlsx';

// セルに適用するスタイル ---------------------------------------------------------------------------------------------------
// 色の定数定義
const GREY_COLOR = '8E8E93';

// 共通のスタイル
const commonStyle = {
  border: {
    top: { style: 'thin', color: { rgb: GREY_COLOR } },
    bottom: { style: 'thin', color: { rgb: GREY_COLOR } },
    left: { style: 'thin', color: { rgb: GREY_COLOR } },
    right: { style: 'thin', color: { rgb: GREY_COLOR } }
  },
  alignment: { horizontal: 'center' }
};

// 条件付きスタイル
const dateStyle = {
  numFmt: 'mm/dd (ddd)',
  font: { sz: 12 },
  alignment: { horizontal: 'center' }
};

// B列スタイル
const rightBorderStyle = {
  border: { right: { style: 'medium', color: { rgb: GREY_COLOR } } }
};

// 2行目スタイル
const bottomBorderStyle = {
  border: { bottom: { style: 'medium', color: { rgb: GREY_COLOR } } }
};



// 関数 ---------------------------------------------------------------------------------------------------
// 2次元配列データからExcelシートを作成する関数
const createWorksheet = (data: any[][]): XLSX.WorkSheet => {
  const ws = XLSX.utils.aoa_to_sheet(data);

  // データ範囲を取得
  const range = XLSX.utils.decode_range(ws['!ref']!);

  // スタイルを条件に応じて適用
  for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex++) {
    for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex });
      const cell = ws[cellAddress];
      if (!cell) continue;
      
      applyStyles(cell, rowIndex, colIndex);
    }
  }

  return ws;
};

// 新しいExcelブックを作成し、シートを追加する関数
const createWorkbook = (worksheet: XLSX.WorkSheet): XLSX.WorkBook => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  return workbook;
};

// スタイルを適用する関数 
const applyStyles = (cell: any, rowIndex: number, colIndex: number) => {
  // 日付スタイル適用
  if (rowIndex > 0 && colIndex === 0 && cell.t === 'd') {
    cell.z = dateStyle.numFmt;
    cell.s = { ...commonStyle, ...dateStyle };
    console.log(`日付スタイル適用: ${XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })}`);
  } 
  // B列スタイル適用
  else if (colIndex === 1) {
    cell.s = { ...commonStyle, ...rightBorderStyle };
    console.log(`B列スタイル適用: ${XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })}`);
  } 
  // 2行目スタイル適用
  else if (rowIndex === 1) {
    cell.s = { ...commonStyle, ...bottomBorderStyle };
    console.log(`2行目スタイル適用: ${XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })}`);
  } 
  // 共通スタイル適用
  else {
    cell.s = commonStyle;
    console.log(`共通スタイル適用: ${XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })}`);
  }
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
const downloadShiftTableXlsx = (data: any[][], year: number, month: number) => {
  const worksheet = createWorksheet(data); // 2次元配列データからシートを作成
  const workbook = createWorkbook(worksheet); // ブックを作成し、シートを追加
  const excelBuffer = writeWorkbookToBuffer(workbook); // ブックをバッファに変換
  const blob = createBlob(excelBuffer); // バッファからBlobを作成
  const fileName = `シフト管理表_${year}年${month + 1}月.xlsx`; // ファイル名を作成
  downloadBlob(blob, fileName); // Blobをダウンロード
};

export default downloadShiftTableXlsx;
