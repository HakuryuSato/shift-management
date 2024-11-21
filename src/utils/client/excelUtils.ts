import * as ExcelJS from 'exceljs';
import saveAs from 'file-saver';

export const createWorkbook = (): ExcelJS.Workbook => {
    return new ExcelJS.Workbook();
};

export const saveWorkbook = async (workbook: ExcelJS.Workbook, fileName: string) => {
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, fileName);
};

export const addTableToWorksheet = (
    worksheet: ExcelJS.Worksheet,
    data: string[][],
    options?: { headerStyles?: Partial<ExcelJS.Style>; rowStyles?: Partial<ExcelJS.Style> }
) => {
    worksheet.addRows(data);

    // デフォルトのスタイル設定
    const defaultHeaderStyles: Partial<ExcelJS.Style> = {
        alignment: { horizontal: 'center' },
        font: { bold: true },
    };

    const defaultRowStyles: Partial<ExcelJS.Style> = {
        alignment: { horizontal: 'center' },
    };

    // スタイル適用
    worksheet.eachRow((row, rowIndex) => {
        row.eachCell((cell) => {
            if (rowIndex === 1) {
                cell.style = { ...defaultHeaderStyles, ...options?.headerStyles };
            } else {
                cell.style = { ...defaultRowStyles, ...options?.rowStyles };
            }
        });
    });
};