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

// 型
import type InterFaceShiftQuery from "@customTypes/InterFaceShiftQuery";

type CommonShiftRegisterFormProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  user_id: number;
  onRegister: (shiftData: InterFaceShiftQuery) => Promise<void>;
  isAdmin: boolean;
  isEditMode: boolean;
};

const CommonShiftRegisterForm: React.FC<CommonShiftRegisterFormProps> = (
  { isOpen, onClose, selectedDate, user_id, onRegister, isAdmin , isEditMode},
) => {
  // 定数-----------------------------------
  // フック--------------------------------------------------------------------------------------------------
  // State
  const [userId, setUserId] = useState<number>(user_id);
  const [startTime, setStartTime] = useState<string>("08:30");
  const [endTime, setEndTime] = useState<string>("18:00");
  const [userData, setUserData] = useState<
    { user_name: string; user_id: Number }[]
  >([]);

  useEffect(() => { // モーダル表示時にCookieから値取得してStateへ
    const { start_time, end_time } = getUserOptions();
    setStartTime(start_time);
    setEndTime(end_time);
    setUserOptions({ start_time: startTime, end_time: endTime });

    if (isAdmin) { // 管理者の場合、ユーザー名一覧を取得
      fetchUserData().then((data) => {
        setUserData(data);
        setUserId(Number(data[0].user_id));
      });
    }
  }, []);

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

  // ハンドラー---------------------------------------------------------------------------

  // 登録ボタン
  const handleRegisterClick = async () => {
    await sendShiftData();

    setUserOptions({ start_time: startTime, end_time: endTime });
    onClose();
  };

  if (!isOpen) return null;

  return (
    // ↓モーダル用の黒塗り背景
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{selectedDate}</h2>
      </div>

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

      <div className="p-4">
        <h3 className="mb-4 flex justify-center ">
          シフトを希望する時間を入力してください
        </h3>
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
            text="登録"
            onClick={handleRegisterClick}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CommonShiftRegisterForm;
