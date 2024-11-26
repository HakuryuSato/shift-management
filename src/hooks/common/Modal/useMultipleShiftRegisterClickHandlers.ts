import { useUserHomeStore } from "@/stores/user/userHomeSlice";
import { useModalContainerStore } from "@/stores/common/modalContainerSlice";
import { sendAutoShiftSettings } from "@/utils/client/apiClient";
import { AutoShiftSettings } from "@/types/AutoShiftTypes";
import { useMultipleShiftRegister } from "./useMultipleShiftRegister";

// クリックの処理は全てModalContainerに移動すること
export function useMultipleShiftRegisterClickHandlers() {
    const user_id = useUserHomeStore((state) => state.userId);
    const closeModal = useModalContainerStore((state) => state.closeModal);
    const {
        dayTimes,
        isHolidayIncluded,
        isAutoShiftEnabled,
        setIsAutoShiftEnabled,
        setError,
        mutateAutoShiftSettings,
    } = useMultipleShiftRegister();

    // const handleSubmit = async () => {
    //     const newIsEnabled = !isAutoShiftEnabled;

    //     try {
    //         const settingData: AutoShiftSettings = {
    //             user_id,
    //             is_holiday_included: isHolidayIncluded,
    //             is_enabled: newIsEnabled,
    //             auto_shift_times: dayTimes,
    //         };
    //         const response = await sendAutoShiftSettings(settingData);
    //         if (response && "error" in response) {
    //             setError("設定の保存に失敗しました。");
    //         } else {
    //             setIsAutoShiftEnabled(newIsEnabled);
    //             mutateAutoShiftSettings();
    //             closeModal();
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         setError("設定の保存に失敗しました。");
    //     }
    // };

    // return {
    //     handleSubmit,
    // };
}
