
import { useEffect } from 'react';
import { useCustomFullCalendarStore } from '@/stores/common/customFullCalendarSlice';

export function useCalendarRole(role: 'user' | 'admin') {
  const setCustomFullCalendarRole = useCustomFullCalendarStore((state) => state.setCustomFullCalendarRole);

  useEffect(() => {
    setCustomFullCalendarRole(role);
  }, [role, setCustomFullCalendarRole]);
}
