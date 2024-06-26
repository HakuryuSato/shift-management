import { supabase } from '@utils/supabase/supabase';

export const getServerSideProps = async () => {
    let { data: user, error } = await supabase
        .from('user')
        .select('user_name');

    return {
        props: {
            user,
            error,
        },
    };
};