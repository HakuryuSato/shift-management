import { useEffect } from 'react';
import useSWR from 'swr';
import { useAdminHomeStore } from '@/stores/admin/adminHomeSlice';
import { fetchUsers } from '@/utils/client/apiClient';

export function useAdminHomeUsersData() {
  const { setAdminHomeUsersData } = useAdminHomeStore();
  const { data: usersData, error, mutate } = useSWR('users', fetchUsers);

  useEffect(() => {
    if (usersData) {
      setAdminHomeUsersData(usersData);
    }
  }, [usersData, setAdminHomeUsersData]);

  return { usersData, error, mutateUsers: mutate };
}
