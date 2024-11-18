// src/utils/server/__tests__/generateAttendanceWorkMinutes.server.test.ts

import { generateAttendanceWorkMinutes } from '../generateAttendanceWorkMinutes';
import { Attendance } from '@/types/Attendance';
import { Holiday } from '@/types/Holiday';
import { fetchHolidays } from '@/utils/client/apiClient';

jest.mock('@/utils/client/apiClient', () => ({
    fetchHolidays: jest.fn(),
}));

const mockedFetchHolidays = fetchHolidays as jest.MockedFunction<typeof fetchHolidays>;

describe('generateAttendanceWorkMinutes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('8:25から18:00までの通常勤務時間と残業時間を正しく計算できる', async () => {
        // Arrange
        const attendance: Attendance = {
            attendance_id: 1,
            user_id: 1,
            stamp_start_time: '2023-10-02T08:25:00', // 月曜日
            stamp_end_time: '2023-10-02T18:00:00',
            adjusted_start_time: null,
            adjusted_end_time: null,
            work_minutes: null,
            overtime_minutes: null,
            rest_minutes: null,
        };

        mockedFetchHolidays.mockResolvedValue([]);

        // Act
        const attendanceResult = await generateAttendanceWorkMinutes(attendance);

        // Assert
        expect(attendanceResult.adjusted_start_time).toBe('2023-10-02T08:30:00');
        expect(attendanceResult.adjusted_end_time).toBe('2023-10-02T18:00:00');
        expect(attendanceResult.rest_minutes).toBe(60);
        expect(attendanceResult.work_minutes).toBe(480);
        expect(attendanceResult.overtime_minutes).toBe(30);
    });

    test('12:58から18:01までの通常勤務時間と休憩時間を正しく計算できる', async () => {
        const attendance: Attendance = {
            attendance_id: 2,
            user_id: 1,
            stamp_start_time: '2023-10-02T12:58:00', // 月曜日
            stamp_end_time: '2023-10-02T18:01:00',
            adjusted_start_time: null,
            adjusted_end_time: null,
            work_minutes: null,
            overtime_minutes: null,
            rest_minutes: null,
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const attendanceResult = await generateAttendanceWorkMinutes(attendance);

        expect(attendanceResult.adjusted_start_time).toBe('2023-10-02T13:00:00');
        expect(attendanceResult.adjusted_end_time).toBe('2023-10-02T18:00:00');
        expect(attendanceResult.rest_minutes).toBe(0);
        expect(attendanceResult.work_minutes).toBe(300);
        expect(attendanceResult.overtime_minutes).toBe(0);
    });

    test('08:30から23:58までの通常勤務時間と残業時間を正しく計算できる', async () => {
        const attendance: Attendance = {
            attendance_id: 3,
            user_id: 1,
            stamp_start_time: '2023-10-02T08:30:00', // 月曜日
            stamp_end_time: '2023-10-02T23:58:00',
            adjusted_start_time: null,
            adjusted_end_time: null,
            work_minutes: null,
            overtime_minutes: null,
            rest_minutes: null,
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const attendanceResult = await generateAttendanceWorkMinutes(attendance);

        expect(attendanceResult.adjusted_start_time).toBe('2023-10-02T08:30:00');
        expect(attendanceResult.adjusted_end_time).toBe('2023-10-03T00:00:00');
        expect(attendanceResult.rest_minutes).toBe(60);
        expect(attendanceResult.work_minutes).toBe(480);
        expect(attendanceResult.overtime_minutes).toBe(390);
    });

    test('祝日勤務の場合、全時間が残業時間として計算される', async () => {
        const attendance: Attendance = {
            attendance_id: 4,
            user_id: 1,
            stamp_start_time: '2023-10-09T08:25:00', // 2023-10-09は祝日
            stamp_end_time: '2023-10-09T18:00:00',
            adjusted_start_time: null,
            adjusted_end_time: null,
            work_minutes: null,
            overtime_minutes: null,
            rest_minutes: null,
        };

        const holiday: Holiday = {
            title: 'スポーツの日',
            date: '2023-10-09',
        };
        mockedFetchHolidays.mockResolvedValue([holiday]);

        const attendanceResult = await generateAttendanceWorkMinutes(attendance);

        expect(attendanceResult.adjusted_start_time).toBe('2023-10-09T08:30:00');
        expect(attendanceResult.adjusted_end_time).toBe('2023-10-09T18:00:00');
        expect(attendanceResult.rest_minutes).toBe(60);
        expect(attendanceResult.work_minutes).toBe(0);
        expect(attendanceResult.overtime_minutes).toBe(510);
    });

    test('日曜日勤務の場合、全時間が残業時間として計算される', async () => {
        const attendance: Attendance = {
            attendance_id: 7,
            user_id: 1,
            stamp_start_time: '2023-10-01T08:25:00', // 日曜日
            stamp_end_time: '2023-10-01T18:00:00',
            adjusted_start_time: null,
            adjusted_end_time: null,
            work_minutes: null,
            overtime_minutes: null,
            rest_minutes: null,
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const attendanceResult = await generateAttendanceWorkMinutes(attendance);

        expect(attendanceResult.adjusted_start_time).toBe('2023-10-01T08:30:00');
        expect(attendanceResult.adjusted_end_time).toBe('2023-10-01T18:00:00');
        expect(attendanceResult.rest_minutes).toBe(60);
        expect(attendanceResult.work_minutes).toBe(0);
        expect(attendanceResult.overtime_minutes).toBe(510);
    });

    test('必須項目が欠けている場合は空のオブジェクトを返す', async () => {
        const incompleteAttendance: Attendance = {
            attendance_id: undefined as any, // 型エラー回避のため `undefined` に変更
            user_id: 1,
            stamp_start_time: '2023-10-02T08:25:00',
            stamp_end_time: '2023-10-02T18:00:00',
            adjusted_start_time: null,
            adjusted_end_time: null,
            work_minutes: null,
            overtime_minutes: null,
            rest_minutes: null,
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const attendanceResult = await generateAttendanceWorkMinutes(incompleteAttendance);

        expect(attendanceResult).toEqual({});
    });

    test('開始時間が存在しない場合は空のオブジェクトを返す', async () => {
        const incompleteAttendance: Attendance = {
            attendance_id: 5,
            user_id: 1,
            stamp_start_time: undefined as any, // 型エラー回避のため `undefined` に変更
            stamp_end_time: '2023-10-02T18:00:00',
            adjusted_start_time: null,
            adjusted_end_time: null,
            work_minutes: null,
            overtime_minutes: null,
            rest_minutes: null,
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const attendanceResult = await generateAttendanceWorkMinutes(incompleteAttendance);

        expect(attendanceResult).toEqual({});
    });

    test('終了時間が存在しない場合は空のオブジェクトを返す', async () => {
        const incompleteAttendance: Attendance = {
            attendance_id: 6,
            user_id: 1,
            stamp_start_time: '2023-10-02T08:25:00',
            stamp_end_time: null,
            adjusted_start_time: null,
            adjusted_end_time: null,
            work_minutes: null,
            overtime_minutes: null,
            rest_minutes: null,
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const attendanceResult = await generateAttendanceWorkMinutes(incompleteAttendance);

        expect(attendanceResult).toEqual({});
    });

    test('開始時間と終了時間が同じ場合、労働時間は0として計算される', async () => {
        const attendance: Attendance = {
            attendance_id: 8,
            user_id: 1,
            stamp_start_time: '2023-10-02T08:30:00',
            stamp_end_time: '2023-10-02T08:30:00',
            adjusted_start_time: null,
            adjusted_end_time: null,
            work_minutes: null,
            overtime_minutes: null,
            rest_minutes: null,
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const attendanceResult = await generateAttendanceWorkMinutes(attendance);

        expect(attendanceResult.work_minutes).toBe(0);
        expect(attendanceResult.overtime_minutes).toBe(0);
        expect(attendanceResult.rest_minutes).toBe(0);
    });

    test('勤務時間が深夜0時を跨ぐ場合の計算が正しく行われる', async () => {
        const attendance: Attendance = {
            attendance_id: 9,
            user_id: 1,
            stamp_start_time: '2023-10-02T22:30:00', // 月曜日
            stamp_end_time: '2023-10-03T06:00:00',
            adjusted_start_time: null,
            adjusted_end_time: null,
            work_minutes: null,
            overtime_minutes: null,
            rest_minutes: null,
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const attendanceResult = await generateAttendanceWorkMinutes(attendance);

        expect(attendanceResult.adjusted_start_time).toBe('2023-10-02T22:30:00');
        expect(attendanceResult.adjusted_end_time).toBe('2023-10-03T06:00:00');
        expect(attendanceResult.rest_minutes).toBe(0);
        expect(attendanceResult.work_minutes).toBe(450);
        expect(attendanceResult.overtime_minutes).toBe(0);
    });
});
