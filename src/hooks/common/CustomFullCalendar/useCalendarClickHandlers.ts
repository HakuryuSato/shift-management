import { useEffect } from "react";
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice";
import { useUserHomeStore } from "@/stores/user/userHomeSlice";
import { useModalContainerStore } from "@/stores/common/modalContainerSlice";
import { useCalendarViewToggleStore } from "@/stores/user/calendarViewToggleSlice";
import { useModalTopBarStore } from "@/stores/common/modalTopBarSlice";
import { useModalContent } from "@/hooks/common/Modal/useModalContent"


/**
 * 
 * @returns 
 */
export const useCalendarClickHandlers = () => {
    const customFullCalendarRole = useCustomFullCalendarStore((state) => state.customFullCalendarRole);
    const userId = useUserHomeStore((state) => state.userId);
    const setCustomFullCalendarClickedDate = useCustomFullCalendarStore((state) => state.setCustomFullCalendarClickedDate);
    const setCustomFullCalendarClickedEvent = useCustomFullCalendarStore((state) => state.setCustomFullCalendarClickedEvent);
    const customFullCalendarClickedEvent = useCustomFullCalendarStore((state) => state.customFullCalendarClickedEvent);
    const customFullCalendarClickedDate = useCustomFullCalendarStore((state) => state.customFullCalendarClickedDate);
    const openModal = useModalContainerStore((state) => state.openModal);
    const modalMode = useModalContainerStore((state) => state.modalMode);
    const calendarViewMode = useCalendarViewToggleStore((state) => state.calendarViewMode) // 'ATTENDANCE' | 'PERSONAL_SHIFT' | 'ALL_MEMBERS_SHIFT';
    const showModalTopBarEditIcons = useModalTopBarStore((state) => state.showModalTopBarEditIcons)
    const hideModalTopBarEditIcons = useModalTopBarStore((state) => state.hideModalTopBarEditIcons)
    const { modalContentInitialize } = useModalContent()
    const setModalMode = useModalContainerStore((state) => state.setModalMode)
    const customFullCalendarPersonalShiftEvents = useCustomFullCalendarStore((state) => state.customFullCalendarPersonalShiftEvents)


    // イベントクリック ---------------------------------------------------------------------------------------------------
    // 各種モーダルの状態を初期化するための関数
    const initializeModalsAfterClieckedEvent = (customFullCalendarClickedEvent: EventClickArg) => {
        // userかつ自分のイベントの場合
        if (customFullCalendarRole === "user" && customFullCalendarClickedEvent.event.extendedProps.user_id == userId) {
            // シフト個人画面 または全員画面 なら編集アイコンを表示
            if (calendarViewMode === 'PERSONAL_SHIFT' || calendarViewMode === 'ALL_MEMBERS_SHIFT') {
                showModalTopBarEditIcons()
            } else { // シフト全員画面or出退勤なら編集アイコン非表示
                hideModalTopBarEditIcons()
            }

        }

        // adminの場合 編集可能
        if (customFullCalendarRole === "admin") {
            showModalTopBarEditIcons()
        }

        modalContentInitialize('eventClick')
        setModalMode('confirm')
        openModal();
    }

    // フルカレンダーのイベントクリック時に呼ばれる関数
    const handleClickEvent = (eventInfo: EventClickArg) => {
        // 終日イベント(祝日)なら終了
        if (eventInfo.event.allDay) return;

        // フルカレStoreにクリックされたEvent情報保存
        setCustomFullCalendarClickedEvent(eventInfo);

        // 選択されたイベント情報を表示
        console.log("選択されたイベント情報:", eventInfo);
    }

    // クリックされたEventをフルカレStoreにset後 モーダルを更新
    useEffect(() => {
        if (customFullCalendarClickedEvent) {
            // モーダル関連初期化
            initializeModalsAfterClieckedEvent(customFullCalendarClickedEvent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customFullCalendarClickedEvent]);



    // 日付クリック  ---------------------------------------------------------------------------------------------------
    const initializeModalsAfterClieckedDate = (customFullCalendarClickedDate: DateClickArg) => {
        // イベントがあるかどうかを判定

        // userかつ、個人シフトかつ、その日にイベントがない？
        // if (customFullCalendarRole === "user" && customFullCalendarClickedDate.event.extendedProps.user_id == userId) {
        //     // シフト個人画面 または全員画面 なら編集アイコンを表示
        //     if (calendarViewMode === 'PERSONAL_SHIFT' || calendarViewMode === 'ALL_MEMBERS_SHIFT') {
        //         showModalTopBarEditIcons()
        //     } else { // シフト全員画面or出退勤なら編集アイコン非表示
        //         hideModalTopBarEditIcons()
        //     }

        // }

        // adminの場合 編集可能
        if (customFullCalendarRole === "admin") {
            showModalTopBarEditIcons()
        }

        modalContentInitialize('dateClick')
        setModalMode('register')
        openModal();
    }

    const handleClickDate = (dateInfo: DateClickArg) => {
        // その日に既に自分のシフトが存在しないか？



        setCustomFullCalendarClickedDate(dateInfo);


    };



    // クリックされたDateをフルカレStoreにset後 モーダルを更新
    useEffect(() => {
        if (customFullCalendarClickedDate) {
            console.log("選択された日付情報:", customFullCalendarClickedDate);
            // モーダル関連初期化
            initializeModalsAfterClieckedDate(customFullCalendarClickedDate);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customFullCalendarClickedDate]);



    return {
        handleClickEvent,
        handleClickDate,
    };
};
