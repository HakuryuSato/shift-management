// src/utils/server/__tests__/generateAttendanceResult.server.test.ts

import { generateAttendanceResult } from '../generateAttendanceResult';
import { AttendanceStamp } from '@/types/Attendance';
import { Holiday } from '@/types/Holiday';
import { fetchHolidays } from '@/utils/client/apiClient';
import { toJapanISOString } from '@/utils/common/dateUtils';

jest.mock('@/utils/client/apiClient', () => ({
    fetchHolidays: jest.fn(),
}));

const mockedFetchHolidays = fetchHolidays as jest.MockedFunction<typeof fetchHolidays>;

describe('generateAttendanceResult', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('8:25から18:00までの通常勤務時間と残業時間を正しく計算できる', async () => {
        // Arrange
        const attendanceStamp: AttendanceStamp = {
            attendance_id: 1,
            user_id: 1,
            start_time: '2023-10-01T08:25:00',
            end_time: '2023-10-01T18:00:00',
        };

        mockedFetchHolidays.mockResolvedValue([]);

        // Act
        const result = await generateAttendanceResult(attendanceStamp);

        // Assert
        expect(result).toHaveLength(1);
        const attendanceResult = result[0];

        expect(attendanceResult.work_start_time).toBe('2023-10-01T08:30:00');
        expect(attendanceResult.work_end_time).toBe('2023-10-01T18:00:00');
        expect(attendanceResult.rest_minutes).toBe(60);
        expect(attendanceResult.work_minutes).toBe(480);
        expect(attendanceResult.overtime_minutes).toBe(30);
    });

    test('12:58から18:01までの通常勤務時間と休憩時間を正しく計算できる', async () => {
        const attendanceStamp: AttendanceStamp = {
            attendance_id: 2,
            user_id: 1,
            start_time: '2023-10-01T12:58:00',
            end_time: '2023-10-01T18:01:00',
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const result = await generateAttendanceResult(attendanceStamp);

        expect(result).toHaveLength(1);
        const attendanceResult = result[0];

        expect(attendanceResult.work_start_time).toBe('2023-10-01T13:00:00');
        expect(attendanceResult.work_end_time).toBe('2023-10-01T18:00:00');
        expect(attendanceResult.rest_minutes).toBe(0);
        expect(attendanceResult.work_minutes).toBe(300);
        expect(attendanceResult.overtime_minutes).toBe(0);
    });

    test('08:30から23:58までの通常勤務時間と残業時間を正しく計算できる', async () => {
        const attendanceStamp: AttendanceStamp = {
            attendance_id: 3,
            user_id: 1,
            start_time: '2023-10-01T08:30:00',
            end_time: '2023-10-01T23:58:00',
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const result = await generateAttendanceResult(attendanceStamp);

        expect(result).toHaveLength(1);
        const attendanceResult = result[0];

        expect(attendanceResult.work_start_time).toBe('2023-10-01T08:30:00');
        expect(attendanceResult.work_end_time).toBe('2023-10-02T00:00:00');
        expect(attendanceResult.rest_minutes).toBe(60);
        expect(attendanceResult.work_minutes).toBe(480);
        expect(attendanceResult.overtime_minutes).toBe(390);
    });

    test('祝日勤務の場合、全時間が残業時間として計算される', async () => {
        const attendanceStamp: AttendanceStamp = {
            attendance_id: 4,
            user_id: 1,
            start_time: '2023-10-01T08:25:00',
            end_time: '2023-10-01T18:00:00',
        };

        const holiday: Holiday = {
            title: 'Some Holiday',
            date: '2023-10-01',
        };
        mockedFetchHolidays.mockResolvedValue([holiday]);

        const result = await generateAttendanceResult(attendanceStamp);

        expect(result).toHaveLength(1);
        const attendanceResult = result[0];

        expect(attendanceResult.work_start_time).toBe('2023-10-01T08:30:00');
        expect(attendanceResult.work_end_time).toBe('2023-10-01T18:00:00');
        expect(attendanceResult.rest_minutes).toBe(60);
        expect(attendanceResult.work_minutes).toBe(0);
        expect(attendanceResult.overtime_minutes).toBe(510);
    });

    test('必須項目が欠けている場合は空の配列を返す', async () => {
        const incompleteAttendanceStamp: AttendanceStamp = {
            attendance_id: undefined as any, // 型エラー回避のため `undefined` に変更
            user_id: 1,
            start_time: '2023-10-01T08:25:00',
            end_time: '2023-10-01T18:00:00',
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const result = await generateAttendanceResult(incompleteAttendanceStamp);

        expect(result).toEqual([]);
    });

    test('開始時間が存在しない場合は空の配列を返す', async () => {
        const incompleteAttendanceStamp: AttendanceStamp = {
            attendance_id: 5,
            user_id: 1,
            start_time: undefined as any, // 型エラー回避のため `undefined` に変更
            end_time: '2023-10-01T18:00:00',
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const result = await generateAttendanceResult(incompleteAttendanceStamp);

        expect(result).toEqual([]);
    });

    test('終了時間が存在しない場合は空の配列を返す', async () => {
        const incompleteAttendanceStamp: AttendanceStamp = {
            attendance_id: 6,
            user_id: 1,
            start_time: '2023-10-01T08:25:00',
            end_time: null,
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const result = await generateAttendanceResult(incompleteAttendanceStamp);

        expect(result).toEqual([]);
    });

    test('開始時間と終了時間が同じ場合、労働時間は0として計算される', async () => {
        const attendanceStamp: AttendanceStamp = {
            attendance_id: 8,
            user_id: 1,
            start_time: '2023-10-01T08:30:00',
            end_time: '2023-10-01T08:30:00',
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const result = await generateAttendanceResult(attendanceStamp);

        expect(result).toHaveLength(1);
        const attendanceResult = result[0];

        expect(attendanceResult.work_minutes).toBe(0);
        expect(attendanceResult.overtime_minutes).toBe(0);
        expect(attendanceResult.rest_minutes).toBe(0);
    });

    test('勤務時間が深夜0時を跨ぐ場合の計算が正しく行われる', async () => {
        const attendanceStamp: AttendanceStamp = {
            attendance_id: 9,
            user_id: 1,
            start_time: '2023-10-01T22:30:00',
            end_time: '2023-10-02T06:00:00',
        };

        mockedFetchHolidays.mockResolvedValue([]);

        const result = await generateAttendanceResult(attendanceStamp);

        expect(result).toHaveLength(1);
        const attendanceResult = result[0];

        expect(attendanceResult.work_start_time).toBe('2023-10-01T22:30:00');
        expect(attendanceResult.work_end_time).toBe('2023-10-02T06:00:00');
        expect(attendanceResult.rest_minutes).toBe(0);
        expect(attendanceResult.work_minutes).toBe(450);
        expect(attendanceResult.overtime_minutes).toBe(0);
    });
});
