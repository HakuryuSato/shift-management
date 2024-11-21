import * as ExcelJS from 'exceljs';

interface ColumnDefinition {
  header: string;
  key: string;
  width?: number;
  style?: Partial<ExcelJS.Style>;
}

interface ExcelOptions {
  sheetName?: string;
  defaultColumnWidth?: number;
  headerStyle?: Partial<ExcelJS.Style>;
  rowStyle?: Partial<ExcelJS.Style>;
}

export async function generateExcelFile(
  data: any[],
  columns: ColumnDefinition[],
  options?: ExcelOptions
): Promise<Buffer> { // 修正点
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(options?.sheetName || 'Sheet1');

  // 列の設定
  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width || options?.defaultColumnWidth || 15,
    style: col.style,
  }));

  // データの追加
  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // ヘッダーのスタイル適用
  if (options?.headerStyle) {
    worksheet.getRow(1).eachCell((cell) => {
      cell.style = { ...cell.style, ...options.headerStyle };
    });
  }

  // 行のスタイル適用
  if (options?.rowStyle) {
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) { // ヘッダー行を除く
        row.eachCell((cell) => {
          cell.style = { ...cell.style, ...options.rowStyle };
        });
      }
    });
  }

  // バッファとしてエクスポート
  const uint8Array = await workbook.xlsx.writeBuffer(); // Uint8Array 型
  return Buffer.from(uint8Array); // 修正点: Buffer に変換
}
