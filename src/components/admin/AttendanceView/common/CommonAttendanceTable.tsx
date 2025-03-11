import React, { ReactNode } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { TableStyleHeader } from "@/styles/TableStyleHeader";

// ヘッダー定義の型
export interface TableHeader {
    id: string;
    label: string;
}

// 共通テーブルコンポーネントのプロパティ型
export interface CommonAttendanceTableProps<T> {
    // テーブルのスタイルコンポーネント
    TableStyleComponent: React.ComponentType<any>;
    // ヘッダー定義
    headers: TableHeader[];
    // 行データ
    rows: T[];
    // 行のレンダリング関数
    renderRow: (row: T, index: number) => ReactNode;
    // ローディング状態
    isLoading?: boolean;
    // ローディング中に表示するコンポーネント
    loadingComponent?: ReactNode;
}

// 共通テーブルコンポーネント
export function CommonAttendanceTable<T>({
    TableStyleComponent,
    headers,
    rows,
    renderRow,
    isLoading = false,
    loadingComponent = <div>Loading...</div>,
}: CommonAttendanceTableProps<T>) {
    if (isLoading) {
        return loadingComponent;
    }

    return (
        <TableStyleComponent>
            {/* ヘッダー */}
            <TableHead>
                <TableRow>
                    {headers.map((header) => (
                        <TableCell key={header.id} sx={TableStyleHeader}>
                            {header.label}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>

            {/* ボディ */}
            <TableBody>
                {rows.map((row, index) => renderRow(row, index))}
            </TableBody>
        </TableStyleComponent>
    );
}
