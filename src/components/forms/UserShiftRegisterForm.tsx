"use client";
// モーダルウィンドウとして表示される

// 基盤
import TimeInput from "@ui/TimeInput";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

// 独自
import Button from "@ui/Button";
import sendShift from "@api/sendShift";
import {
  getUserOptions,
  setUserOptions,
} from "@/utils/userOptions";
import Modal from "@/components/common/Modal"; // Modal インポート追加

// 型
import type InterFaceShiftQuery from "@customTypes/InterFaceShiftQuery";

type UserShiftRegisterFormProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  user_id: number;
  onRegister: (shiftData: InterFaceShiftQuery) => Promise<void>;
};

const UserShiftRegisterForm: React.FC<UserShiftRegisterFormProps> = (
  { isOpen, onClose, selectedDate, user_id, onRegister }
) => {
  // 定数-----------------------------------
  // フック--------------------------------------------------------------------------------------------------
  // State
  const [userId, setuserId] = useState<number>(user_id);
  const [startTime, setStartTime] = useState<string>("08:30");
  const [endTime, setEndTime] = useState<string>("18:00");

  useEffect(() => { // モーダル表示時にCookieから値取得してStateへ
    const { start_time, end_time } = getUserOptions();
    setStartTime(start_time);
    setEndTime(end_time);
    setUserOptions({ start_time: startTime, end_time: endTime });
  }, []);

  // 関数------------------------------------------------------------
  const sendShiftData = async () => { // async 追加
    const formattedStartTime = `${selectedDate} ${startTime}`;
    const formattedEndTime = `${selectedDate} ${endTime}`;

    const context: InterFaceShiftQuery = {
      query: {
        user_id: userId,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
      },
    };

    await onRegister(context); 
  };

  // ハンドラー---------------------------------------------------------------------------
  // 背景クリック時にモーダル非表示
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRegisterClick = async () => {
    await sendShiftData();
    setUserOptions({ start_time: startTime, end_time: endTime });
    onClose();
  };

  if (!isOpen) return null;

  return (
    // ↓モーダル用の黒塗り背景
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{selectedDate}</h2>
        </div>

        <div className="p-4">
          <h3 className="mb-4 flex justify-center ">
            シフトを希望する時間を入力してください
          </h3>
          <div className="flex justify-center items-center space-x-2">
            <TimeInput initialValue={startTime} onReturn={(selectedTime) => setStartTime(selectedTime)} />
            <a className="pt-3">-</a>
            <TimeInput initialValue={endTime} onReturn={(selectedTime) => setEndTime(selectedTime)} />
          </div>

          <div className="pt-10 flex justify-center ">
            <Button
              text="登録"
              onClick={handleRegisterClick}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserShiftRegisterForm;
