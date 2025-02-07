// サーバーアクション
import { insertShift, updateShift, deleteShift, upsertAutoShift } from "@/utils/client/serverActionClient"

// カスタムHooks
import { useCalendarShiftAllMembers } from "../CustomFullCalendar/useCalendarShiftAllmembers";
import { useCalendarShiftPersonal } from "../CustomFullCalendar/useCalendarShiftPersonal";
import { useAdminUserManagementFormStore } from "@/stores/admin/adminUserManagementFormSlice";

// Store
import { useModalContainerStore } from "@/stores/common/modalContainerSlice"
import { useUserHomeStore } from "@/stores/user/userHomeSlice"
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice"
import { useModalContentStore } from "@/stores/common/modalContentSlice";
import { useMultipleShiftRegisterStore } from "@/stores/common/multipleShiftRegisterSlice";
import { useMultipleShiftRegister } from "@/hooks/common/Modal/useMultipleShiftRegister"


// util関数
import { toJapanISOString, toJapanDateISOString } from "@/utils/common/dateUtils";

// 型
import type { AutoShiftSettings, AutoShiftTime } from "@/types/AutoShift";
import type { CustomFullCalendarEvent } from "@/types/CustomFullCalendarEvent";


export const useModalContainer = () => {
    // Modal Container
    const modalMode = useModalContainerStore((state) => state.modalMode);
    const closeModal = useModalContainerStore((state) => state.closeModal);

    // Modal Content
    const modalContentSelectedUser = useModalContentStore((state) => state.modalContentSelectedUser)
    const modalContentSelectedStartTime = useModalContentStore((state) => state.modalContentSelectedStartTime)
    const modalContentSelectedEndTime = useModalContentStore((state) => state.modalContentSelectedEndTime)

    // User Home
    const userId = useUserHomeStore((state) => state.userId);

    // Calendar
    const customFullCalendarRole = useCustomFullCalendarStore((state) => state.customFullCalendarRole);
    const customFullCalendarSelectedDate = useCustomFullCalendarStore((state) => state.customFullCalendarClickedDate)
    const customFullCalendarClickedEvent = useCustomFullCalendarStore((state) => state.customFullCalendarClickedEvent)
    const customFullCalendarPersonalShiftEvents = useCustomFullCalendarStore((state) => state.customFullCalendarPersonalShiftEvents)
    const customFullCalendarHolidayEvents = useCustomFullCalendarStore((state) => state.customFullCalendarHolidayEvents)
    const customFullCalendarStartDate = useCustomFullCalendarStore((state) => state.customFullCalendarStartDate)
    const customFullCalendarEndDate = useCustomFullCalendarStore((state) => state.customFullCalendarEndDate)

    // Multiple Shift Register
    const multipleShiftRegisterDayTimes = useMultipleShiftRegisterStore((state) => state.multipleShiftRegisterDayTimes);
    const multipleShiftRegisterIsHolidayIncluded = useMultipleShiftRegisterStore((state) => state.multipleShiftRegisterIsHolidayIncluded);
    const multipleShiftRegisterIsAutoShiftEnabled = useMultipleShiftRegisterStore((state) => state.multipleShiftRegisterIsAutoShiftEnabled);
    const multipleShiftRegisterIsCronJobsEnabled = useMultipleShiftRegisterStore((state) => state.multipleShiftRegisterIsCronJobsEnabled);

    // useSWR mutate
    const { mutateAllShifts } = useCalendarShiftAllMembers()
    const { mutatePersonalShifts } = useCalendarShiftPersonal()
    const { mutateAutoShiftSettings } = useMultipleShiftRegister()


    // 確認、保存、削除のテキストが入る親モーダルのボタン
    const handleClickModalContainerButton = async () => {
        // ModalModeに応じて条件分岐、apiClientを呼び出して処理を行う
        if (modalMode === 'register') { // 登録  ---------------------------------------------------------------------------------------------------
            // 選択された日付と開始・終了時刻を組み合わせてISO形式の日時文字列を生成
            const startDateTime = new Date(`${customFullCalendarSelectedDate?.dateStr}T${modalContentSelectedStartTime}:00`);
            const endDateTime = new Date(`${customFullCalendarSelectedDate?.dateStr}T${modalContentSelectedEndTime}:00`);

            // ユーザーIDを決定（ユーザーの場合はuserIdを、管理者の場合は選択されたユーザーのIDを使用）
            const targetUserId = customFullCalendarRole === 'user' ? userId : modalContentSelectedUser?.user_id;

            // Shift用のデータを作成して送信
            await insertShift({
                user_id: targetUserId,
                start_time: toJapanISOString(startDateTime),
                end_time: toJapanISOString(endDateTime)
            });


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
                // 送信
                await upsertAutoShift(autoShiftData)
            }

            // 自動シフト関連の操作がなければシフトをまとめて登録処理実行
            if (!multipleShiftRegisterIsCronJobsEnabled && !multipleShiftRegisterIsAutoShiftEnabled) {

                // MultipleShift用の処理 ---------------------------------------------------------------------------------------------------

                // 個人のシフトイベントを日付（YYYY-MM-DD）をキーとしたMapに変換
                const personalShiftEventsMap = new Map<string, CustomFullCalendarEvent>();
                customFullCalendarPersonalShiftEvents.forEach((event: CustomFullCalendarEvent) => {
                    if (!event.start) return;
                    const dateStr = event.start.split('T')[0];
                    personalShiftEventsMap.set(dateStr, event);
                });

                // 祝日イベントを日付（YYYY-MM-DD）をキーとしたMapに変換
                const holidayEventsMap = new Map<string, CustomFullCalendarEvent>();
                customFullCalendarHolidayEvents.forEach((event: CustomFullCalendarEvent) => {
                    if (!event.start) return;
                    const dateStr = event.start.split('T')[0];
                    holidayEventsMap.set(dateStr, event);
                });

                // AutoShiftTimeを曜日をキーとしたMapに変換
                const autoShiftTimeMap = new Map<number, AutoShiftTime>();
                multipleShiftRegisterDayTimes.forEach((autoShiftTime) => {
                    autoShiftTimeMap.set(autoShiftTime.day_of_week, autoShiftTime);
                });

                // シフトを登録するためのデータを格納する配列
                const shiftsToInsert = [];

                // 開始日と終了日をDateオブジェクトに変換
                let currentDate = new Date(customFullCalendarStartDate);
                const endDate = new Date(customFullCalendarEndDate);

                // 日付範囲内をループ
                while (currentDate <= endDate) {
                    // 日付を日本時間のYYYY-MM-DD形式で取得
                    const dateStr = toJapanDateISOString(currentDate);
                    const weekDay = currentDate.getDay(); // 0 (日曜日) - 6 (土曜日)

                    // 当日のAutoShiftTimeを取得
                    const autoShiftTime = autoShiftTimeMap.get(weekDay);

                    // 以下の条件を満たす場合にシフトを登録
                    if (
                        autoShiftTime &&
                        autoShiftTime.is_enabled &&
                        (!holidayEventsMap.has(dateStr) || multipleShiftRegisterIsHolidayIncluded) &&
                        !personalShiftEventsMap.has(dateStr)
                    ) {
                        // シフトデータを作成
                        const startDateTimeStr = `${dateStr}T${autoShiftTime.start_time}:00`;
                        const endDateTimeStr = `${dateStr}T${autoShiftTime.end_time}:00`;

                        shiftsToInsert.push({
                            user_id: userId,
                            start_time: toJapanISOString(new Date(startDateTimeStr)),
                            end_time: toJapanISOString(new Date(endDateTimeStr)),
                        });
                    }

                    // 次の日付へ
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                // シフトの一括登録
                if (shiftsToInsert.length > 0) {
                    for (const shiftData of shiftsToInsert) {
                        await insertShift(shiftData);
                    }
                }
            }
        }

        // データを再取得し変更をカレンダーに反映
        await mutateAllShifts();
        await mutatePersonalShifts();


        // モーダルを閉じる
        closeModal();
    };

    return { handleClickModalContainerButton };
};
