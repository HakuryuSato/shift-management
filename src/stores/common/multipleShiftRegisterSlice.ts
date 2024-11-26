import { create } from 'zustand';
import { AutoShiftTime } from '@/types/AutoShift';

interface MultipleShiftRegisterStoreState {
    multipleShiftRegisterDayTimes: AutoShiftTime[];
    multipleShiftRegisterIsHolidayIncluded: boolean;
    multipleShiftRegisterIsAutoShiftEnabled: boolean;
    multipleShiftRegisterIsCronJobsEnabled: boolean; // DB上の設定がenabledか
    multipleShiftRegisterError: string | null;
    setMultipleShiftRegisterDayTimes: (dayTimes: AutoShiftTime[]) => void;
    setMultipleShiftRegisterIsHolidayIncluded: (value: boolean) => void;
    setMultipleShiftRegisterIsAutoShiftEnabled: (value: boolean) => void;
    setMultipleShiftRegisterIsCronJobsEnabled: (value: boolean) => void;
    setMultipleShiftRegisterError: (error: string | null) => void;
}

export const useMultipleShiftRegisterStore = create<MultipleShiftRegisterStoreState>((set) => ({


    multipleShiftRegisterDayTimes: [],
    multipleShiftRegisterIsHolidayIncluded: false,
    multipleShiftRegisterIsAutoShiftEnabled: false,
    multipleShiftRegisterIsCronJobsEnabled: false,
    multipleShiftRegisterError: null,
    setMultipleShiftRegisterDayTimes: (dayTimes) => set({ multipleShiftRegisterDayTimes: dayTimes }),
    setMultipleShiftRegisterIsHolidayIncluded: (value) => set({ multipleShiftRegisterIsHolidayIncluded: value }),
    setMultipleShiftRegisterIsAutoShiftEnabled: (value) => set({ multipleShiftRegisterIsAutoShiftEnabled: value }),
    setMultipleShiftRegisterIsCronJobsEnabled: (value) => set({ multipleShiftRegisterIsCronJobsEnabled: value }),
    setMultipleShiftRegisterError: (error) => set({ multipleShiftRegisterError: error }),
}));
