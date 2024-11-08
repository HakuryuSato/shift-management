import { useUserHomeUserSession } from '@/hooks/user/useUserHomeUserSession';
import { useModalStore } from '@/stores/common/modalSlice';
import { useCustomFullCalendarStore } from '@/stores/common/customFullCalendarSlice';

export function useCommonHomeInitialize(role: 'user' | 'admin') {

    // userの場合はuser_idなどを設定
    const initializeUserSession = role === 'user' ? useUserHomeUserSession : () => { };
    const setCustomFullCalendarRole = useCustomFullCalendarStore((state) => state.setCustomFullCalendarRole);
    const setModalRole = useModalStore((state) => state.setModalRole);

    initializeUserSession();
    setCustomFullCalendarRole(role);
    setModalRole(role);
}
