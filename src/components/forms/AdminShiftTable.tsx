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
import getUserNames from "@api/getUserNames";
import getShift from "@api/getShift";
import createContext from "@utils/createContext";
import formatShiftsForTable from "@utils/formatShiftsForTable";
import createTableForAdminShift from "@utils/createTableForAdminShift";
import AdminUserManagementForm from "@forms/AdminUserManagementForm";
import downloadShiftTableXlsx from "@utils/downloadShiftTableXlsx"

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
    const userNames = await fetchUserNames();
    const shifts = await fetchShifts();
    const formattedData = formatShiftsForTable(shifts);

    // console.log( //デバッグ用
    //   "BEFORE CREATE TABLE:",
    //   "Current Month:",
    //   currentMonth,
    //   "Current Year:",
    //   currentYear,
    //   "Formatted Data:",
    //   formattedData,
    //   "User Names:",
    //   userNames,
    // );

    const table = createTableForAdminShift(
      currentMonth,
      currentYear,
      formattedData,
      userNames,
    );

    // console.log(table);
    setTable(table);
  };

  // ユーザー名取得
  const fetchUserNames = async () => {
    const result = await getUserNames();
    if (result.props.user) {
      // console.log(result.props.user);
      return result.props.user;
    }
    return [];
  };

  // シフトデータ取得
  const fetchShifts = async () => {
    const context = createContext({
      year: currentYear,
      month: currentMonth,
      is_approved: true,
    });

    const result = await getShift(context);

    if (result.props.data) {
      return result.props.data;
    }
    return [];
  };

  // モーダル閉じる
  const closeModal = () => {
    setIsModalOpen(false);
    updateTable();
  };

  // フック ---------------------------------------------------------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [managementModalMode, setManagementModalMode] = useState<"register" | "delete">("register");

  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth(),
  );
  const [table, setTable] = useState<any>(!null);

  useEffect(() => { // シフトデータ更新
    // console.log(shift)
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
    downloadShiftTableXlsx(table,currentYear,currentMonth)
  };

  return (
    <>
      <div id="header" className="flex">
        <div id="header-left" className="flex">
          <div className="m-4">
            <Button
              text="シフト承認画面"
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
                      className={`border p-1 text-xs text-black 
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
