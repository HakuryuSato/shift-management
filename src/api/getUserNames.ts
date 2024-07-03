import { supabase } from '@/utils/supabase';

const getUserNames = async () => {
    let { data: user, error } = await supabase
        .from('users')
        .select('user_name');

    return {
        props: {
            user,
            error,
        },
    };
};

export default getUserNames