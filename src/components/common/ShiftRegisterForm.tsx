"use client";
// モーダルウィンドウとして表示される

// 基盤
import TimeInput from "@ui/TimeInput";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

// 独自
import Button from "@ui/Button";
import { getUserOptions, setUserOptions } from "@/utils/userOptions";
import Modal from "@/components/common/Modal";
import fetchUserData from "@/utils/fetchUserData";
import ShiftEditToolBar from "@components/common/ShiftEditToolBar";
import ShiftDeleteForm from "./ShiftDeleteForm";

// 型
import type InterFaceShiftQuery from "@customTypes/InterFaceShiftQuery";

type ShiftRegisterFormProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string | null;
  user_id: number;
  onRegister: (shiftData: InterFaceShiftQuery) => Promise<void>;
  isAdmin: boolean;
  selectedShiftId?: number | null;
  selectedEventShiftTime?: string | null;
};

const ShiftRegisterForm: React.FC<ShiftRegisterFormProps> = (
  {
    isOpen,
    onClose,
    selectedDate,
    user_id,
    onRegister,
    isAdmin,
    selectedShiftId,
    selectedEventShiftTime,
  },
) => {
  // 定数-----------------------------------
  // フック--------------------------------------------------------------------------------------------------
  // State
  const [userId, setUserId] = useState<number>(user_id);

  const [startTime, setStartTime] = useState<string>(
    selectedEventShiftTime ? selectedEventShiftTime.split("-")[0] : "08:30",
  );
  const [endTime, setEndTime] = useState<string>(
    selectedEventShiftTime ? selectedEventShiftTime.split("-")[1] : "18:00",
  );
  const [userData, setUserData] = useState<
    { user_name: string; user_id: Number }[]
  >([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => { // モーダル表示時にCookieから値取得してStateへ
    if (selectedShiftId && selectedEventShiftTime != null) { // もし選択シフトIDとイベントシフト時間がnullでないなら(編集モード)
      setStartTime(selectedEventShiftTime.split("-")[0]);
      setEndTime(selectedEventShiftTime.split("-")[1]);
    } else {
      const { start_time, end_time } = getUserOptions();
      setStartTime(start_time);
      setEndTime(end_time);
      setUserOptions({ start_time: startTime, end_time: endTime });
    }

    if (isAdmin) { // 管理者の場合、ユーザー名一覧を取得
      fetchUserData().then((data) => {
        setUserData(data);
        setUserId(Number(data[0].user_id));
      });
    }
    console.log("loop");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // エラー発生していた？

  // 関数------------------------------------------------------------
  const sendShiftData = async () => { // async 追加
    const formattedStartTime = `${selectedDate} ${startTime}`;
    const formattedEndTime = `${selectedDate} ${endTime}`;

    const context: InterFaceShiftQuery = {
      user_id: userId,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
    };

    await onRegister(context);
  };

  const updateShift = async () => {
    // ここでアップデート用APIを呼び出し
    console.log();
  };

  // ハンドラー---------------------------------------------------------------------------
  // モーダルを閉じる際の初期化処理
  const handleClose = () => {
    setIsEditMode(false);
    setIsDeleteModalOpen(false);
    onClose();
  };

  // 登録ボタン
  const handleRegisterClick = async () => {
    await sendShiftData();

    setUserOptions({ start_time: startTime, end_time: endTime });
    onClose();
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    // モーダル用の黒塗り背景
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div>
        {/* 編集モード用ツールバー */}
        {selectedShiftId && !isEditMode &&
          (
            <div>
              <ShiftEditToolBar
                onClose={handleClose}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </div>
          )}
      </div>

      <h2 className="text-lg mt-6 text-center">{selectedDate}</h2>
      {isAdmin && (
        <div className="mb-4">
          <h3 className="mb-4 pb-2 flex justify-center ">
            シフトを追加するユーザーを選択してください
          </h3>
          <select
            id="user-select"
            className="p-2 border mx-auto block w-30"
            onChange={(e) => {
              setUserId(Number(e.target.value));
            }}
            value={Number(userId)}
          >
            {userData.map((user) => (
              <option
                key={user.user_id.toString()}
                value={Number(user.user_id)}
              >
                {user.user_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedShiftId
        ? (
          isEditMode
            // シフト編集画面
            ? <div className="flex flex-col items-center space-y-4">

              <div className="flex justify-center items-center space-x-2">
                <TimeInput
                  initialValue={selectedEventShiftTime?.split("-")[0]}
                  onReturn={(selectedTime) => setStartTime(selectedTime)}
                />
                <a className="pt-3">-</a>
                <TimeInput
                  initialValue={selectedEventShiftTime?.split("-")[1]}
                  onReturn={(selectedTime) => setEndTime(selectedTime)}
                />
              </div>

                {/* handleCloseを */}
              <Button
                text="保存"
                onClick={handleClose} 
                className="w-20"
              />
            </div>
            // シフト確認画面
            : (
              // 管理者モードなら名前表示

              <div className="flex flex-col items-center space-y-4">
                <h1 className="text-3xl my-4 text-center">
                  {selectedEventShiftTime}
                </h1>

                <Button
                  text="確認"
                  onClick={handleClose}
                  className="w-20"
                />
              </div>
            )
        )
        // シフト登録画面
        : (
          <div>
            <div className="p-4">
              {/* <h3 className="mb-4 flex justify-center ">
                シフトを希望する時間を 入力してください
              </h3> */}

              <div className="flex justify-center items-center space-x-2">
                <TimeInput
                  initialValue={startTime}
                  onReturn={(selectedTime) => setStartTime(selectedTime)}
                />
                <a className="pt-3">-</a>
                <TimeInput
                  initialValue={endTime}
                  onReturn={(selectedTime) => setEndTime(selectedTime)}
                />
              </div>

              <div className="pt-10 flex justify-center ">
                <Button
                  text="保存"
                  onClick={handleRegisterClick}
                />
              </div>
            </div>
          </div>
        )}

      {selectedShiftId && // 選択されたシフトIDがあるなら、シフト削除フォーム読み込み
        (
          <ShiftDeleteForm
            isOpen={isDeleteModalOpen}
            onClose={handleClose}
            shiftId={selectedShiftId}
          />
        )}
    </Modal>
  );
};

export default ShiftRegisterForm;
