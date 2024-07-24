"use client";

// 基盤
import React, { useEffect, useState } from "react";
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import { ja } from "date-fns/locale";

// 型
// import type InterFaceShiftQuery from "@customTypes/InterFaceShiftQuery";
import type InterFaceTableUsers from "@customTypes/InterFaceTableUsers";
import type InterFaceAdminShiftTable from "@customTypes/InterFaceAdminShiftTable";

// 独自
import Button from "@ui/Button";
// import createContext from "@utils/createContext";
import formatShiftsForTable from "@utils/formatShiftsForTable";
import createTableForAdminShift from "@utils/createTableForAdminShift";
import AdminUserManagementForm from "@forms/AdminUserManagementForm";
import downloadShiftTableXlsx from "@utils/downloadShiftTableXlsx";

// API fetch
import fetchUserData from "@utils/fetchUserData"


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


    const shifts = await fetchGetShifts();
    const formattedData = formatShiftsForTable(shifts);

    const table = createTableForAdminShift(
      currentMonth,
      currentYear,
      formattedData,
      userNames,
    );


    setTable(table);
  };




  // シフトデータ取得
  const fetchGetShifts = async () => { // 納期の都合でfetch関数化断念

    try {
      // APIからシフトデータを取得
      const response = await fetch(
        `/api/getShift?user_id=${'*'}&year=${currentYear}&month=${currentMonth}`,
      );
      const responseData = await response.json();
      const data = responseData.data; // dataキーの値を使用
      const formattedEvents = formatShiftsForTable(
        data,
      );

      return formattedEvents
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
      return [];
    }

  };

  // モーダル閉じる
  const closeModal = () => {
    setIsModalOpen(false);
    updateTable();
  };

  // フック ---------------------------------------------------------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [managementModalMode, setManagementModalMode] = useState<
    "register" | "delete"
  >("register");

  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [table, setTable] = useState<any>(!null);

  useEffect(() => { // シフトデータ更新
    updateTable();
  }, []);

  // ハンドラー ---------------------------------------------------------------------------------------------------
  const userRegistrationClick = () => {
    setIsModalOpen(true);
    setManagementModalMode("register");
  };

  const userDeleteClick = () => {
    setIsModalOpen(true);
    setManagementModalMode("delete");
  };

  const handleCsvDownloadClick = () => {
    downloadShiftTableXlsx(table, currentYear, currentMonth);
  };

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
                  ${rowIndex === 1 ? "border-b-2 border-double" : "border-gray"}
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

      <AdminUserManagementForm
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={managementModalMode}
      />
    </>
  );
};

export default AdminShiftTable;
