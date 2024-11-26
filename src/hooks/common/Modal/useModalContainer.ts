// サーバーアクション
import { insertShift, updateShift, deleteShift, upsertAutoShift } from "@/utils/client/serverActionClient"

// カスタムHooks
import { useCalendarShiftAllMembers } from "../CustomFullCalendar/useCalendarShiftAllmembers";
import { useCalendarShiftPersonal } from "../CustomFullCalendar/useCalendarShiftPersonal";

// Store
import { useModalContainerStore } from "@/stores/common/modalContainerSlice"
import { useUserHomeStore } from "@/stores/user/userHomeSlice"
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice"
import { useModalContentStore } from "@/stores/common/modalContentSlice";
import { useMultipleShiftRegisterStore } from "@/stores/common/multipleShiftRegisterSlice";
import { useMultipleShiftRegister } from "@/hooks/common/Modal/useMultipleShiftRegister"


// util関数
import { toJapanISOString } from "@/utils/toJapanISOString";

// 型
import type { AutoShiftSettings } from "@/types/AutoShift";


export const useModalContainer = () => {
    // Modal Container
    const modalMode = useModalContainerStore((state) => state.modalMode);
    const closeModal = useModalContainerStore((state) => state.closeModal);

    // Modal Content
    const modalContentSelectedStartTime = useModalContentStore((state) => state.modalContentSelectedStartTime)
    const modalContentSelectedEndTime = useModalContentStore((state) => state.modalContentSelectedEndTime)

    // User Home
    const userId = useUserHomeStore((state) => state.userId);

    // Calendar
    const customFullCalendarRole = useCustomFullCalendarStore((state) => state.customFullCalendarRole);
    const customFullCalendarSelectedDate = useCustomFullCalendarStore((state) => state.customFullCalendarClickedDate)
    const customFullCalendarClickedEvent = useCustomFullCalendarStore((state) => state.customFullCalendarClickedEvent)
    const customFullCalendarPersonalShiftEvents = useCustomFullCalendarStore((state) => state.customFullCalendarPersonalShiftEvents)
    const customFullCalendarStartDate = useCustomFullCalendarStore((state) => state.customFullCalendarStartDate)
    const customFullCalendarEndDate = useCustomFullCalendarStore((state) => state.customFullCalendarEndDate)


    // Multiple Shift Register
    const multipleShiftRegisterDayTimes = useMultipleShiftRegisterStore.getState().multipleShiftRegisterDayTimes;
    const multipleShiftRegisterIsHolidayIncluded = useMultipleShiftRegisterStore.getState().multipleShiftRegisterIsHolidayIncluded;
    const multipleShiftRegisterIsAutoShiftEnabled = useMultipleShiftRegisterStore.getState().multipleShiftRegisterIsAutoShiftEnabled;
    const multipleShiftRegisterIsCronJobsEnabled = useMultipleShiftRegisterStore.getState().multipleShiftRegisterIsCronJobsEnabled;

    // useSWR mutate
    const { mutateAllShifts } = useCalendarShiftAllMembers()
    const { mutatePersonalShifts } = useCalendarShiftPersonal()
    const { mutateAutoShiftSettings } = useMultipleShiftRegister()


    // 確認、保存、削除のテキストが入る親モーダルのボタン
    const handleClickModalContainerButton = async () => {
        // ModalModeに応じて条件分岐、apiClientを呼び出して処理を行う
        if (modalMode === 'register') { // 登録  ---------------------------------------------------------------------------------------------------
            // ユーザーの場合
            if (customFullCalendarRole === 'user') {
                // 選択された日付と開始・終了時刻を組み合わせてISO形式の日時文字列を生成
                const startDateTime = new Date(`${customFullCalendarSelectedDate?.dateStr}T${modalContentSelectedStartTime}:00`);
                const endDateTime = new Date(`${customFullCalendarSelectedDate?.dateStr}T${modalContentSelectedEndTime}:00`);


                // Shift用のデータを作成して送信
                await insertShift({
                    user_id: userId,
                    start_time: toJapanISOString(startDateTime),
                    end_time: toJapanISOString(endDateTime)
                });

            } else if (customFullCalendarRole === 'admin') { // 管理者の場合

            }


        } else if (modalMode === 'delete') { // 削除 ---------------------------------------------------------------------------------------------------
            console.log('deleteShift(Number(customFullCalendarClickedEvent?.event.id))')
            await deleteShift(Number(customFullCalendarClickedEvent?.event.id))

        } else if (modalMode === 'update') { // 更新  ---------------------------------------------------------------------------------------------------
            // クリックされたイベントからシフト情報を作る

            const selectedEventDate = customFullCalendarClickedEvent?.event.startStr.split('T')[0] // YYYY-MM-DD

            await updateShift({
                shift_id: Number(customFullCalendarClickedEvent?.event.id),
                start_time: `${selectedEventDate} ${modalContentSelectedStartTime}`,
                end_time: `${selectedEventDate} ${modalContentSelectedEndTime}`,
            })


            // 曜日でまとめてなら
        } else if (modalMode === 'multiple-register') {


            // AutoShift用の処理  ---------------------------------------------------------------------------------------------------
            // AutoShift 送信用データ
            const autoShiftData: AutoShiftSettings = {
                user_id: userId,
                is_holiday_included: multipleShiftRegisterIsHolidayIncluded,
                is_enabled: multipleShiftRegisterIsAutoShiftEnabled,
                auto_shift_times: multipleShiftRegisterDayTimes,
            };

            // シフト自動登録がサーバー側で有効の場合
            if (multipleShiftRegisterIsCronJobsEnabled) {
                // 解除してサーバーに送信
                autoShiftData.is_enabled = false
                await upsertAutoShift(autoShiftData)

                // 再取得してIsCronJobsEnabledを更新(useMultipleShiftRegisterでuseEffect処理)
                mutateAutoShiftSettings()
            } else { // 無効の場合
                //送信
                await upsertAutoShift(autoShiftData)
            }

            // MultipleShift用の処理 ---------------------------------------------------------------------------------------------------
            // 
            // customFullCalendarPersonalShiftEvents



        }

        // データを再取得し変更をカレンダーに反映
        await mutateAllShifts();
        await mutatePersonalShifts();


        // モーダルを閉じる
        closeModal();
    };

    return { handleClickModalContainerButton };
};