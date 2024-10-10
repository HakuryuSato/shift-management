/*
シフト自動登録用の型定義ファイル

[注意事項]
start_timeとend_timeについて、DB上はHH:MM:SSとして保存されているが、コンポーネントではHH:MMとして扱っている。
（送信時はHH:MMで送信、受信時はTimeDropdown内の関数で書式変換している）

*/
export interface AutoShiftTime {
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
  
  export interface AutoShiftSettingsUpsertData {
    auto_shift_setting_id?: number;
    user_id: number;
    is_holiday_included: boolean;
    is_enabled: boolean;
  }
  
  export interface AutoShiftTimeUpsertData {
    auto_shift_setting_id: number;
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_enabled: boolean;
  }