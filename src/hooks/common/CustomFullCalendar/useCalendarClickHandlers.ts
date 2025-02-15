import { useEffect } from "react";
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice";
import { useUserHomeStore } from "@/stores/user/userHomeSlice";
import { useModalContainerStore } from "@/stores/common/modalContainerSlice";
import { useCalendarViewToggleStore } from "@/stores/user/calendarViewToggleSlice";
import { useModalTopBarStore } from "@/stores/common/modalTopBarSlice";
import { useModalContent } from "@/hooks/common/Modal/useModalContent"
import { isUserCalendarEventOnDate } from "@/utils/client/isUserCalendarEventOnDate";



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
    // クリックされたEventをフルカレStoreにsetした際 モーダルを更新
    useEffect(() => {
        if (customFullCalendarClickedEvent) {
            // モーダル関連初期化
            initializeModalsAfterClieckedEvent();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customFullCalendarClickedEvent]);

    // 各種モーダルの状態を初期化するための関数
    const initializeModalsAfterClieckedEvent = () => {

        modalContentInitialize('eventClick')
        setModalMode('confirm')
    }

    // フルカレンダーのイベントクリック時に呼ばれる関数
    const handleClickEvent = (eventInfo: EventClickArg) => {
        // 終日イベント(祝日) または ユーザーかつ全員シフト画面 なら終了
        if (eventInfo.event.allDay || (customFullCalendarRole === "user" && calendarViewMode === 'ALL_MEMBERS_SHIFT')) return;

        // フルカレStoreにクリックされたEvent情報保存 -> useEffectが実行
        setCustomFullCalendarClickedEvent(eventInfo);

        showModalTopBarEditIcons()
        openModal();
        // 選択されたイベント情報を表示
        // console.log("選択されたイベント情報:", eventInfo);
    }


    // 日付クリック  ---------------------------------------------------------------------------------------------------
    // クリックされたDateをフルカレStoreにsetした際 モーダルを更新
    useEffect(() => {
        if (customFullCalendarClickedDate) {
            // console.log("選択された日付情報:", customFullCalendarClickedDate);
            // モーダル関連初期化
            initializeModalsAfterClieckedDate(customFullCalendarClickedDate);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customFullCalendarClickedDate]);



    const initializeModalsAfterClieckedDate = (customFullCalendarClickedDate: DateClickArg) => {
        hideModalTopBarEditIcons()
        modalContentInitialize('dateClick')
        setModalMode('register')
    }


    // フルカレンダーの日付クリック時に呼ばれる関数
    const handleClickDate = (dateInfo: DateClickArg) => {
        console.log(dateInfo.dateStr)

        // userかつ個人画面以外　または　すでに該当ユーザーのイベントが存在する なら終了
        if ((customFullCalendarRole === 'user' && calendarViewMode !== 'PERSONAL_SHIFT')
            || isUserCalendarEventOnDate(dateInfo.dateStr, userId, customFullCalendarPersonalShiftEvents))
            return;

        // 管理者ならばテキストを整形
        if(customFullCalendarRole === 'admin'){
            // ISO文字列からYYYY-MM-DD部分を抽出
            const formattedDate = dateInfo.dateStr.split('T')[0];
            dateInfo.dateStr = formattedDate;
        }

        hideModalTopBarEditIcons()
        openModal()

        // 日付データを状態にセット
        setCustomFullCalendarClickedDate(dateInfo);
    };






    return {
        handleClickEvent,
        handleClickDate,
    };
};
