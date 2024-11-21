/* eslint-disable react-hooks/exhaustive-deps */
"use client";

// 基盤
import React, { useEffect, useState  } from "react";
import { useRouter } from 'next/navigation';
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import { ja } from "date-fns/locale";

// 型
// import type InterFaceShiftQuery from "@customTypes/InterFaceShiftQuery";
import type InterFaceTableUsers from "@/types/InterFaceTableUsers";
import type InterFaceAdminShiftTable from "@/types/InterFaceAdminShiftTable";

// 独自
import Button from "@ui/Button";
import formatShiftsForTable from "@utils/formatShiftsForTable";
import createTableForAdminShift from "@utils/createTableForAdminShift";
import downloadShiftTableXlsx from "@utils/downloadShiftTableXlsx";
import {toJapanDateString} from "@utils/toJapanDateString";

import { AdminUserManagementForm } from "../admin/AttendanceView/AdminUserManagementForm";

// store
import { useAdminUserManagementFormStore } from "@/stores/admin/adminUserManagementFormSlice";

// API呼び出し
import fetchShifts from "@utils/fetchShifts";
import fetchUserData from "@utils/fetchUserData";
import { fetchHolidays } from "@/utils/client/apiClient";

interface AdminShiftTableProps {
  onButtonClickBackToShiftApproval: () => void;
}

// コンポーネント ---------------------------------------------------------------------------------------------------
const AdminShiftTable: React.FC<AdminShiftTableProps> = ({
  onButtonClickBackToShiftApproval,
}) => {
  // 関数 ---------------------------------------------------------------------------------------------------
  // 2次元のテーブルを作成する
  const updateTable = async () => {
    const userNames = await fetchUserData();
    const shifts = await fetchShiftsFrom26thTo25th();
    const formattedData = formatShiftsForTable(shifts);
    const holidays = await fetchHolidays();

    const table = createTableForAdminShift(
      currentMonth,
      currentYear,
      formattedData,
      userNames,
      holidays,
    );

    setTable(table);
  };

  const fetchShiftsFrom26thTo25th = async () => {
    try {
      // 現在の日時を取得し、先月の26日と今月の25日を計算
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 26);
      const endDate = new Date(now.getFullYear(), now.getMonth(), 25);

      // 日本時間での日付をフォーマット
      const start_time = toJapanDateString(startDate);
      const end_time = toJapanDateString(endDate);

      // fetchShifts関数を使用してシフトデータを取得
      const data = await fetchShifts({ user_id: "*", start_time, end_time });

      const formattedEvents = formatShiftsForTable(data);

      return formattedEvents;
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
      return [];
    }
  };

  // モーダル閉じる
  const closeModal = () => {
    closeAdminUserManagementForm();
    updateTable();
  };

  // フック ---------------------------------------------------------------------------------------------------
  const { openAdminUserManagementForm, closeAdminUserManagementForm } =
    useAdminUserManagementFormStore();
  const [managementModalMode, setManagementModalMode] = useState<
    "register" | "delete"
  >("register");

  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [table, setTable] = useState<any>();

  useEffect(() => { // シフトデータ更新
    updateTable();
  }, []);
  const router = useRouter();
  

  // ハンドラー ---------------------------------------------------------------------------------------------------
  const userRegistrationClick = () => {
    openAdminUserManagementForm("register");
  };

  const userDeleteClick = () => {
    openAdminUserManagementForm("delete");
  };

  const handleCsvDownloadClick = () => {
    downloadShiftTableXlsx(table, currentYear, currentMonth);
  };

  const handleAttendanceButtonClick=()=>{
    router.push('/dev/admin_kanrisha');
  }

  return (
    <>
      <div id="header" className="flex">
        <div id="header-left" className="flex">
          <div className="m-4">
            <Button
              text="１週間の画面へ"
              onClick={onButtonClickBackToShiftApproval}
            />
          </div>
          <div className="m-4">
            <Button
              text="出退勤の画面へ(試験的機能)"
              onClick={handleAttendanceButtonClick}
            />
          </div>
        </div>

        <div id="header-right" className="flex ml-auto">
          <div className="m-4">
            <Button
              text="ユーザー登録"
              onClick={userRegistrationClick}
            />
          </div>
          <div className="m-4">
            <Button
              text="ユーザー削除"
              onClick={userDeleteClick}
              className="bg-red"
            />
          </div>

          <div className="m-4">
            <Button
              text="Excelダウンロード"
              onClick={handleCsvDownloadClick}
              className="bg-orange"
            />
          </div>
        </div>
      </div>
      {/* 表データ　ここから  -------------------------------------------------*/}

      {table && table.length > 0 && (
        <div className="overflow-x-auto">
          <table className="border-collapse table-auto w-full">
            <tbody>
              {table.map((row: string[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: string, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      className={`border p-1 text-xs text-black text-center
                  ${rowIndex === 2 ? "border-b-2 border-double" : "border-gray"}
                  ${
                        cellIndex === 1
                          ? "border-r-2 border-double border-gray"
                          : "border-gray"
                      }
                
                  `}
                      style={{ width: "80px" }} // 固定幅を設定
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 表データ　ここまで  -------------------------------------------------*/}

      <AdminUserManagementForm />
    </>
  );
};

export default AdminShiftTable;
