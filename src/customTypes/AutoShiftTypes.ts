export interface AutoShiftTime {
    auto_shift_times_id?: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_enabled: boolean;
    error?: Record<string, string>;
  }
  
  export interface AutoShiftSettings {
    auto_shift_setting_id?: number;
    user_id: number;
    is_holiday_included: boolean;
    is_enabled: boolean;
    auto_shift_times: AutoShiftTime[];
  }
  