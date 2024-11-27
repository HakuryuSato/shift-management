import { useUserHomeFABStore } from "@stores/user/userHomeFABSlice";
import { useUserQrCodeReaderViewStore } from "@/stores/user/userQrCodeReaderViewSlice";
import { useUserCalendarViewStore } from "@/stores/user/userCalendarViewSlice";
import { useUserHomeAppBarStore } from "@/stores/user/userHomeAppBarSlice";
import { useModalContainerStore } from "@/stores/common/modalContainerSlice";

export const useUserHomeFABClickHandlers = () => {
    const fabIconType = useUserHomeFABStore((state) => state.fabIconType);
    const setIsUserHomeFABVisible = useUserHomeFABStore((state) =>
        state.setIsUserHomeFABVisible
    );
    const showQRCodeReader = useUserQrCodeReaderViewStore((state) =>
        state.showQRCodeReader
    );
    const setIsUserCalendarViewVisible = useUserCalendarViewStore((state) =>
        state.setIsUserCalendarViewVisible
    );
    const hideUserHomeAppBar = useUserHomeAppBarStore(
        (state) => state.hideUserHomeAppBar
    );
    const setModalMode = useModalContainerStore((state) => state.setModalMode)
    const openModal = useModalContainerStore((state) => state.openModal)



    const handleClickUserHomeFAB = () => {
        if (fabIconType === "qr") { // 出退勤なら
            showQRCodeReader();
            setIsUserHomeFABVisible(false);
            setIsUserCalendarViewVisible(false);
            hideUserHomeAppBar();
        } else if (fabIconType === "calendar") { // シフトなら
            //   setIsUserHomeFABVisible(false);
            setModalMode('multiple-register')
            openModal();


        }
    };

    return { handleClickUserHomeFAB };
};
