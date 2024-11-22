import { useUserHomeFABStore } from "@stores/user/userHomeFABSlice";
import { useUserQrCodeReaderViewStore } from "@/stores/user/userQrCodeReaderViewSlice";
import { useUserCalendarViewStore } from "@/stores/user/userCalendarViewSlice";
import { useUserHomeAppBarStore } from "@/stores/user/userHomeAppBarSlice";

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

  const handleClickUserHomeFAB = () => {
    if (fabIconType === "qr") {
      showQRCodeReader();
      setIsUserHomeFABVisible(false);
      setIsUserCalendarViewVisible(false);
      hideUserHomeAppBar();
    } else if (fabIconType === "calendar") {
      // シフト追加用
      
    }
  };

  return { handleClickUserHomeFAB };
};
