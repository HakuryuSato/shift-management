"use client";
// モーダルウィンドウとして表示される

// 基盤
import OldTimeInput from "@/components/ui/OldTimeInput";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

// 独自
import Button from "@ui/Button";
import { getUserOptions, setUserOptions } from "@/utils/userOptions";
import Modal from "@/components/common/Modal";
import fetchUserData from "@/utils/fetchUserData";
import ShiftEditToolBar from "@components/common/ShiftEditToolBar";
import ShiftDeleteForm from "./ShiftDeleteForm";
import DaySelector from "@components/common/DaySelector";
import {toJapanDateString} from "@/utils/toJapanDateString";

// 型
import type InterFaceShiftQuery from "@customTypes/InterFaceShiftQuery";

type ShiftRegisterFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (
    shiftData: InterFaceShiftQuery | InterFaceShiftQuery[],
  ) => Promise<void>;
  onUpdate: (shiftData: InterFaceShiftQuery) => Promise<void>;
  selectedDate: string | null;
  user_id: number;
  user_name?: string;
  isAdmin: boolean;
  isMultiple?: boolean;
  selectedShiftId?: number | null;
  selectedEventShiftTime?: string | null;
  fullCalendarShiftEvents?: {
    [x: string]:
      // モーダルウィンドウとして表示される
      // 基盤
      any;
    start: string;
    end: string;
  }[];
  currentYear?: number;
  currentMonth?: number;
};

const ShiftRegisterForm: React.FC<ShiftRegisterFormProps> = (
  {
    // 共通
    onClose, //true false
    onRegister, // true false

    // 日付クリック時用
    isOpen, // true false
    selectedDate, // "2024-08-22"
    user_id, // 2

    // 管理者用
    isAdmin, //true false
    user_name,

    // シフトイベントクリック時
    selectedShiftId, // 306
    selectedEventShiftTime, // "10:00-18:00"
    onUpdate,

    // 曜日でまとめて登録用
    isMultiple, // true false
    fullCalendarShiftEvents,
    /* fullCalendarShiftEventsの例

    [
      {
        id: "306",
        start: "2024-08-01T10:00:00",
        end: "2024-08-01T18:00:00",
        title: "",
        display: "block",
        extendedProps: {
          is_approved: false,
          user_name: "山田一郎",
          user_id: 2,
        },
      },
      {
        id: "291",
        start: "2024-08-02T09:00:00",
        end: "2024-08-02T18:00:00",
        title: "",
        display: "block",
        extendedProps: {
          is_approved: false,
          user_name: "山田一郎",
          user_id: 2,
        },
      },
      ...
    [
    */

    currentYear, // 2024
    currentMonth, // 7
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
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  useEffect(() => { // モーダル表示時にCookieから値取得してStateへ
    // 編集モードなら(選択シフトIDとイベントシフト時間がnullでない)
    if (selectedShiftId && selectedEventShiftTime != null) {
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
    // console.log("loop");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // エラー発生していた？

  // 関数------------------------------------------------------------
  const createContext = (selectedDate: string): InterFaceShiftQuery => {
    const formattedStartTime = `${selectedDate} ${startTime}`;
    const formattedEndTime = `${selectedDate} ${endTime}`;

    return {
      user_id: userId,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
    };
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
    if (isMultiple) { // もしまとめて登録なら
      let currentDateCount = 0;

      // undefinedチェック(currentMonthとYearがオプショナルプロパティのため)
      if (currentYear !== undefined && currentMonth !== undefined) {
        // 現在月(0~11)+1から見て、先月の最終日を取得
        currentDateCount = new Date(currentYear, currentMonth + 1, 0).getDate();
      }

      // 既に自分のシフトがある日のリストを作成
      let alreadyRegistedDays: string[] = [];
      if (fullCalendarShiftEvents) {
        alreadyRegistedDays = fullCalendarShiftEvents
          .filter((event) => event.extendedProps.user_id === userId)
          .map((event) => event.start.split("T")[0]);
      }

      // fetchAPIへ渡すためのContextを作成
      let multipleContexts: InterFaceShiftQuery[] = [];
      for (let i = 1; i <= currentDateCount; i++) {
        const currentDate = new Date(currentYear!, currentMonth!, i);
        const dayOfWeek = currentDate.getDay(); // 曜日取得
        const formattedDate = toJapanDateString(currentDate); // 'YYYY-MM-DD'

        if (
          // 選択した曜日　かつ　既に自分のシフトが登録されていない日
          selectedDays.includes(dayOfWeek) &&
          !alreadyRegistedDays.includes(formattedDate)
        ) {
          multipleContexts.push(createContext(formattedDate));
        }
      }

      // 完了して、multipleContextsの中身が存在するなら、onRegisterを実行
      if (multipleContexts.length > 0) {
        await onRegister(multipleContexts);
      }
    } else { // 個別に登録なら
      const formattedStartTime = `${selectedDate} ${startTime}`;
      const formattedEndTime = `${selectedDate} ${endTime}`;

      const context: InterFaceShiftQuery = {
        user_id: userId,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
      };
      await onRegister(context);
    }

    setUserOptions({ start_time: startTime, end_time: endTime }); // キャッシュに時間保存
    handleClose();
  };

  const handleUpdateClick = async () => {
    const formattedStartTime = `${selectedDate} ${startTime}`;
    const formattedEndTime = `${selectedDate} ${endTime}`;

    const context: InterFaceShiftQuery = {
      shift_id: selectedShiftId!,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
    };

    await onUpdate(context);

    setUserOptions({ start_time: startTime, end_time: endTime });
    handleClose();
  };




  // 編集ボタン(えんぴつ)
  const handleEditClick = () => {
    if (selectedEventShiftTime) {
      const [startTime, endTime] = selectedEventShiftTime.split("-");
      setStartTime(startTime);
      setEndTime(endTime);
    }
    setIsEditMode(true);
  };

  // 削除ボタン(ゴミ箱)
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  // 曜日選択時
  const handleDaysSelected = (days: number[]) => {
    setSelectedDays(days);
  };

  // モーダルisOpenでないならnullを返す
  if (!isOpen) return null;

  return (
    // モーダル用の黒塗り背景
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
    >
      {/* 編集モード用ツールバー シフトIDが存在し、編集モードでない*/}
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

      {/* 曜日選択 複数シフト登録(ユーザーのみtrueにできる)*/}
      {isMultiple && (
        <div>
          <DaySelector onDaysSelected={handleDaysSelected} />
        </div>
      )}

      {!isMultiple && (
        <h2 className="text-lg mt-6 text-center mb-4">{selectedDate}</h2>
      )}

      {/* ユーザー名選択　管理者かつ、登録モード(編集モードでない) */}
      {isAdmin && !selectedShiftId && (
        <div className="mb-4">
          <a>{user_name}</a>
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

      {/* ユーザー名確認 管理者かつ編集モード */}
      {isAdmin && selectedShiftId && (
        <div className="flex flex-col items-center space-y-4">
          <a className="text-2xl my-4 text-center">
            {user_name}
          </a>
        </div>
      )}

      {/* 時間確認 確認画面かつ編集モードでない */}
      {selectedShiftId && !isEditMode && (
        <h1 className="text-3xl my-4 text-center">
          {selectedEventShiftTime}
        </h1>
      )}

      {/* 時間入力  確認モードでない(シフトidなし) または編集モード または曜日でまとめて */}
      {(!selectedShiftId || isEditMode || isMultiple) && (
        <div className="flex justify-center items-center space-x-2">
          <OldTimeInput
            initialValue={startTime}
            onReturn={(selectedTime) => setStartTime(selectedTime)}
          />
          <a className="pt-3">-</a>
          <OldTimeInput
            initialValue={endTime}
            onReturn={(selectedTime) => setEndTime(selectedTime)}
          />
        </div>
      )}

      {/* ボタン 全ての場合で表示*/}
      <div className="pt-10 flex justify-center">
        <Button
          text={selectedShiftId && !isEditMode
            ? "確認"
            : isEditMode
            ? "更新"
            : "保存"}
          onClick={selectedShiftId && !isEditMode
            ? handleClose
            : isEditMode
            ? handleUpdateClick
            : handleRegisterClick}
        />
      </div>

      {/* シフト削除フォーム */}
      {selectedShiftId && // 選択されたシフトIDがあるなら読み込み
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
