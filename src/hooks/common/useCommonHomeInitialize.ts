import { useEffect } from 'react';
import { useUserHomeUserSession } from '@/hooks/user/useUserHomeUserSession';
import { useModalContainerStore } from '@/stores/common/modalContainerSlice';
import { useCustomFullCalendarStore } from '@/stores/common/customFullCalendarSlice';
import { useCalendarViewToggleStore } from '@/stores/user/calendarViewToggleSlice';

export function useCommonHomeInitialize(role: 'user' | 'admin') {
    useUserHomeUserSession();

    // 状態更新関数を取得
    const setCustomFullCalendarRole = useCustomFullCalendarStore((state) => state.setCustomFullCalendarRole);
    const setModalRole = useModalContainerStore((state) => state.setModalRole);

    const setCalendarViewModeToAllMembersShift = useCalendarViewToggleStore(
        (state) => state.setCalendarViewModeToAllMembersShift
    );


    if (role === 'admin') {
        setCalendarViewModeToAllMembersShift();
    }


    useEffect(() => {
        setCustomFullCalendarRole(role);
        setModalRole(role);
    }, [role, setCustomFullCalendarRole, setModalRole]);
}