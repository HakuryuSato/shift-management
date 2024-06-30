"use client";
// モーダルウィンドウとして表示される

// 基盤
import TimeInput from "@ui/TimeInput";
import React, { use, useEffect, useState } from "react";
import Cookies from "js-cookie";

// 独自
import Button from "@ui/Button";
import sendShift from "@api/sendShift";
import {
  getUserOptions,
  setUserOptions,
  updateOptionsIfNeeded,
} from "@/utils/userOptions";

// 型
import type { InterFaceShiftQuery } from "@customTypes/InterFaceShiftQuery";
import type { InterFaceUserOptions } from "@customTypes/InterFaceUserOptions";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  user_id: number;
};

// コンポーネント------------------------------------------------------------------------------------------------------------------------
const Modal: React.FC<ModalProps> = (
  { isOpen, onClose, selectedDate, user_id },
) => {
  // 定数-----------------------------------

  // 関数------------------------------------------------------------
  // シフトデータ送信メソッド
  const sendShiftData = () => {
    // 送信用に日付のテキスト整形
    const formattedStartTime = `${selectedDate} ${startTime}`;
    const formattedEndTime = `${selectedDate} ${endTime}`;

    // 送信用データの定義
    const context: InterFaceShiftQuery = {
      query: {
        user_id: userId,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
      },
    };

    // contextをsupabaseへ送信
    sendShift(context)
      .then((response: any) => {
        // console.log(response);
      })
      .catch((error: any) => {
        // console.error(error);
      });
  };

  // フック--------------------------------------------------------------------------------------------------
  // State
  const [userId, setuserId] = useState<number>(user_id);
  const [startTime, setStartTime] = useState<string>("08:30");
  const [endTime, setEndTime] = useState<string>("18:00");

  useEffect(() => { // モーダル表示時にCookieから値取得してStateへ
    const { start_time, end_time } = getUserOptions();
    setStartTime(start_time);
    setEndTime(end_time);
    setUserOptions({start_time:startTime , end_time:endTime})
  }, []);

  // ハンドラー---------------------------------------------------------------------------
  // 背景クリック時にモーダル非表示
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRegisterClick = () => {
    sendShiftData();
    setUserOptions({ start_time: startTime, end_time: endTime });
    onClose();
  };

  if (!isOpen) return null;

  return (
    // ↓モーダル用の黒塗り背景
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
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
    </div>
  );
};

export default Modal;
