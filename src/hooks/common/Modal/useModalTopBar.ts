import { useModalContainerStore } from '@/stores/common/modalContainerSlice';

import { useModalTopBarStore } from "@/stores/common/modalTopBarSlice";


export const useModalTopBar = () => {
    const closeModal = useModalContainerStore((state) => state.closeModal);
    const setmodalMode = useModalContainerStore((state) => state.setmodalMode)
    const openModal = useModalContainerStore((state) => state.openModal)



    // 編集アイコンクリック
    const handleClickEditIcon = () => {
        setmodalMode('register')
        closeModal()
        openModal('register')

    };

    // 削除アイコンクリック
    const handleClickDeleteIcon = () => {


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