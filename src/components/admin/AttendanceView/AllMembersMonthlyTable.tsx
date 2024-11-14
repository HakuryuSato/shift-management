import React from 'react';
import { useAdminHomeStore } from '@/stores/admin/adminHomeSlice';
import { useAdminHomeUsersData } from '@/hooks/admin/useAdminHomeUsersData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
} from '@mui/material';


export function AllMembersMonthlyTable() {
  // ユーザー情報を取得するカスタムフックを呼び出す
  useAdminHomeUsersData();

  const { adminHomeUsersData } = useAdminHomeStore();

  if (!adminHomeUsersData) {
    return <div>Loading...</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ユーザー名</TableCell>
            {/* 必要に応じて他のカラムを追加 */}
          </TableRow>
        </TableHead>
        <TableBody>
          {adminHomeUsersData.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>
                {user.user_name}({user.employment_type === 'full_time' ? '正社員' : 'バイト'})
              </TableCell>
              {/* 必要に応じて他のカラムを追加 */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
