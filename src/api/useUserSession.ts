import { useEffect, useState } from 'react';
import { supabase } from '@utils/supabase/supabase';


interface User {
  user_id: string;
  user_name: string;
}

const useUserSession = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const currentUser: User = {
          user_id: session.user.id,
          user_name: session.user.user_metadata.full_name, // Replace with the correct field
        };
        setUser(currentUser);
      } else {
        setUser(null);
      }
    };
    
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const currentUser: User = {
          user_id: session.user.id,
          user_name: session.user.user_metadata.full_name, // Replace with the correct field
        };
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return user;
};

export default useUserSession;
