import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserHomeStore } from '@/stores/user/userHomeSlice';
import type { CustomNextAuthUser } from '@/customTypes/CustomNextAuthUser';

export function useUserSessionForUserHome() {
  const { setUserData } = useUserHomeStore();
  const { data: session } = useSession();


  useEffect(() => {
    if (session && session.user) {
      const user = session.user as CustomNextAuthUser;
      setUserData({
        userId: user.user_id,
        userName: user.user_name,
        employmentType: user.employment_type,
      });
    }

  }, [session, setUserData]);
}
