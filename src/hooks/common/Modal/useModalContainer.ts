import { useModalContainerStore } from "@/stores/common/modalContainerSlice"
import { insertShift, updateShift, deleteShift } from "@/utils/client/serverActionClient"
import { useUserHomeStore } from "@/stores/user/userHomeSlice"
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice"
import { useModalContentStore } from "@/stores/common/modalContentSlice";
import { toJapanISOString } from "@/utils/toJapanISOString";
import { useCalendarShiftAllMembers } from "../CustomFullCalendar/useCalendarShiftAllmembers";
import { useCalendarShiftPersonal } from "../CustomFullCalendar/useCalendarShiftPersonal";

export const useModalContainer = () => {
    const modalMode = useModalContainerStore((state) => state.modalMode);
    const closeModal = useModalContainerStore((state) => state.closeModal);
    const userId = useUserHomeStore((state) => state.userId);
    const customFullCalendarRole = useCustomFullCalendarStore((state) => state.customFullCalendarRole);
    const customFullCalendarSelectedDate = useCustomFullCalendarStore((state) => state.customFullCalendarClickedDate)
    const customFullCalendarClickedEvent = useCustomFullCalendarStore((state) => state.customFullCalendarClickedEvent)
    const modalContentSelectedStartTime = useModalContentStore((state) => state.modalContentSelectedStartTime)
    const modalContentSelectedEndTime = useModalContentStore((state) => state.modalContentSelectedEndTime)
    const { mutateAllShifts } = useCalendarShiftAllMembers()
    const { mutatePersonalShifts } = useCalendarShiftPersonal()


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


            // 更新処理をここに追加
        } else if (modalMode === 'multiple-register') {
            // 複数登録の処理をここに追加
        }

        // データを再取得し変更をカレンダーに反映
        await mutateAllShifts();
        await mutatePersonalShifts();


        // モーダルを閉じる
        closeModal();
    };

    return { handleClickModalContainerButton };
};