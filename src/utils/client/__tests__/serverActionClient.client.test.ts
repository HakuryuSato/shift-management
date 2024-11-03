jest.mock('@/app/actions/deleteUser', () => ({
  deleteUser: jest.fn(),
}));
jest.mock('@/app/actions/insertUser', () => ({
  insertUser: jest.fn(),
}));
jest.mock('@/app/actions/insertAttendance', () => ({
  insertAttendance: jest.fn(),
}));

import { deleteUser } from '@/app/actions/deleteUser';
import { insertUser } from '@/app/actions/insertUser';
import { insertAttendance } from '@/app/actions/insertAttendance';
import { deleteUserAction, insertUserAction, insertAttendanceAction } from '../serverActionClient';
import { User } from '@/customTypes/User';

describe('serverActionClient', () => {
  let consoleErrorMock: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  type TestCase<T> = {
    actionName: string;
    mockFunction: jest.Mock;
    actionFunction: (...args: any[]) => Promise<T | null>;
    args: any[];
    mockResolvedValue: T;
    mockRejectedError: string;
  };

  const testCases: TestCase<any>[] = [
    {
      actionName: 'deleteUserAction',
      mockFunction: deleteUser as jest.Mock,
      actionFunction: deleteUserAction,
      args: ['TestUser'],
      mockResolvedValue: { success: true },
      mockRejectedError: 'Deletion failed'
    },
    {
      actionName: 'insertUserAction',
      mockFunction: insertUser as jest.Mock,
      actionFunction: insertUserAction,
      args: [{ user_name: 'TestUser', employment_type: 'part_time' } as User],
      mockResolvedValue: { user_id: 1, user_name: 'TestUser', employment_type: 'part_time' },
      mockRejectedError: 'Insertion failed'
    },
    {
      actionName: 'insertAttendanceAction',
      mockFunction: insertAttendance as jest.Mock,
      actionFunction: insertAttendanceAction,
      args: [1],
      mockResolvedValue: { message: 'Attendance recorded' },
      mockRejectedError: 'Attendance failed'
    }
  ];

  testCases.forEach(({ actionName, mockFunction, actionFunction, args, mockResolvedValue, mockRejectedError }) => {
    describe(actionName, () => {
      it(`${actionName}が正常に動作した場合にデータを返すことを確認する`, async () => {
        mockFunction.mockResolvedValueOnce(mockResolvedValue);

        const result = await actionFunction(...args);

        expect(mockFunction).toHaveBeenCalledWith(...args);
        expect(result).toEqual(mockResolvedValue);
      });

      it(`${actionName}がエラーをスローした場合にnullを返すことを確認する`, async () => {
        mockFunction.mockRejectedValueOnce(new Error(mockRejectedError));

        const result = await actionFunction(...args);

        expect(mockFunction).toHaveBeenCalledWith(...args);
        expect(result).toBeNull();
      });
    });
  });
});
