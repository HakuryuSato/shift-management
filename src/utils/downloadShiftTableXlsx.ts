import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

const GREY_COLOR = 'FF8E8E93';
const MEDIUM_BORDER = { style: 'medium' as ExcelJS.BorderStyle, color: { argb: GREY_COLOR } };
const THIN_BORDER = { style: 'thin' as ExcelJS.BorderStyle, color: { argb: GREY_COLOR } };
const THICK_BORDER = { style: 'thick' as ExcelJS.BorderStyle, color: { argb: GREY_COLOR } };



const createWorksheet = (data: any[][]): ExcelJS.Workbook => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  worksheet.addRows(data);

  worksheet.eachRow((row, rowIndex) => {
    const rowCount = worksheet.rowCount;
    const colCount = worksheet.columnCount;

    row.eachCell((cell, colIndex) => {
      const isSecondRow = rowIndex === 3;
      const isSecondCol = colIndex === 2;

      const borders: Partial<ExcelJS.Borders> = {
        top: THIN_BORDER,
        bottom: THIN_BORDER,
        left: THIN_BORDER,
        right: THIN_BORDER
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
      if (rowIndex === 1) borders.top = THICK_BORDER
      if (rowIndex === rowCount) borders.bottom = THICK_BORDER
      if (colIndex === 1) borders.left = THICK_BORDER
      if (colIndex === colCount) borders.right = THICK_BORDER



      cell.style = {
        border: borders,
        alignment: { horizontal: 'center' }
      };

      if (colIndex >= 3) {
        worksheet.getColumn(colIndex).width = 11;
      }



    });
  });

  // // 最後の行に下線を引く
  // addThickBorderToEdges(worksheet);

  return workbook;
};

const downloadShiftTableXlsx = async (data: any[][], year: number, month: number) => {
  const workbook = createWorksheet(data);
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `シフト管理表_${year}年${month + 1}月.xlsx`);
};

export default downloadShiftTableXlsx;
