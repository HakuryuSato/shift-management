import { useEffect } from 'react';
import { useModalStore } from '@/stores/common/modalSlice';

export function useModalRole(role: 'user' | 'admin') {
    const setModalRole = useModalStore((state) => state.setModalRole);

    useEffect(() => {
        setModalRole(role);
    }, [role, setModalRole]);
}
