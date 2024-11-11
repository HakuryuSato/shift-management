import { useModalContainerStore } from '@/stores/common/modalContainerSlice';

import { useModalTopBarStore } from "@/stores/common/modalTopBarSlice";
import { useModalContentStore } from '@/stores/common/modalContentSlice';
import { useCustomFullCalendarStore } from '@/stores/common/customFullCalendarSlice';

// ISO時間からHH:MMのみを抽出する関数
const extractHHMMfromISOString = (isoString: string) => {
    return isoString.slice(11, 16);
}


export const useModalTopBar = () => {
    const closeModal = useModalContainerStore((state) => state.closeModal);
    const setmodalMode = useModalContainerStore((state) => state.setModalMode)
    const setModalContentSelectedStartTime = useModalContentStore((state) => state.setModalContentSelectedStartTime)
    const setModalContentSelectedEndTime = useModalContentStore((state) => state.setModalContentSelectedEndTime)
    const customFullCalendarClickedEvent = useCustomFullCalendarStore((state) => state.customFullCalendarClickedEvent)

    // 編集アイコンクリック
    const handleClickEditIcon = () => {
        // モードを更新に(保存ボタンクリック時の処理分けるため)
        setmodalMode('update')
        const startTime = extractHHMMfromISOString(customFullCalendarClickedEvent?.event.startStr || "");
        const endTime = extractHHMMfromISOString(customFullCalendarClickedEvent?.event.endStr || "");
        setModalContentSelectedStartTime(startTime)
        setModalContentSelectedEndTime(endTime)


    };

    // 削除アイコンクリック
    const handleClickDeleteIcon = () => {
        setmodalMode('delete')

    };

    // 閉じるアイコンクリック
    const handleClickCloseIcon = () => {
        closeModal()
    }


    return {
        handleClickEditIcon,
        handleClickDeleteIcon,
        handleClickCloseIcon,
    };
};