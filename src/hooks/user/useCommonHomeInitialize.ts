import { useUserHomeUserSession } from '@/hooks/user/useUserHomeUserSession';
import { useModalContainerStore } from '@/stores/common/modalContainerSlice';
import { useCustomFullCalendarStore } from '@/stores/common/customFullCalendarSlice';

export function useCommonHomeInitialize(role: 'user' | 'admin') {

    // userの場合はuser_idなどを設定
    const initializeUserSession = role === 'user' ? useUserHomeUserSession : () => { };
    const setCustomFullCalendarRole = useCustomFullCalendarStore((state) => state.setCustomFullCalendarRole);
    const setModalRole = useModalContainerStore((state) => state.setModalRole);

    initializeUserSession();
    setCustomFullCalendarRole(role);
    setModalRole(role);
}
