import { supabase } from '@/utils/supabase';

export const getServerSideProps = async () => {
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