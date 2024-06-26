// モーダルウィンドウとして表示される
import TimeInput from '@ui/TimeInput'
import React, { useState } from 'react';
import Button from '@ui/Button'
import sendShift from '@api/sendShift'
import type { InterFaceShiftQuery } from '@customTypes/InterFaceShiftQuery'


let user_id = 1

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, selectedDate }) => {
  // サーバー送信用State
  const [userId, setuserId] = useState<string>(""); // *** 親から受け取る？
  const [startTime, setStartTime] = useState<string>("08:30");
  const [endTime, setEndTime] = useState<string>("18:00");
  // const [recievedShift, setrecievedShift] = useState([]);



  // 背景クリック時にモーダル非表示
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // シフトデータ送信メソッド
  const sendShiftData = () => {
    // 送信用に日付のテキスト整形
    const formattedStartTime = `${selectedDate} ${startTime}`;
    const formattedEndTime = `${selectedDate} ${endTime}`;

    // 送信用データの定義
    const context: InterFaceShiftQuery = {
      query: {
        user_id: 1, // *****仮データ*****
        start_time: formattedStartTime,
        end_time: formattedEndTime,
      }
    };

    // contextをsupabaseへ送信
    sendShift(context)
      .then((response: any) => {
        console.log(response);
      })
      .catch((error: any) => {
        console.error(error);
      });

    // モーダル閉じる
    onClose()
  };



    if (!isOpen) return null;

    return (
      // ↓モーダル用の黒塗り背景
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleOverlayClick}>

        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{selectedDate}</h2>
          </div>

          <div className="p-4">

            <h3 className="mb-4 flex justify-center ">シフトを希望する時間を入力してください</h3>
            <div className="flex justify-center items-center space-x-2">
              <TimeInput initialValue={startTime} onReturn={setStartTime} />
              <a className="pt-3">-</a>
              <TimeInput initialValue={endTime} onReturn={setEndTime} />
            </div>

            <div className="pt-10 flex justify-center ">


              <Button
                text='登録'
                onClick={sendShiftData}
              />


            </div>

          </div>


        </div>
      </div>
    );
  };

  export default Modal;
