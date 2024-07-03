import { supabase } from '@/utils/supabase';


const sendUser = async (userName: string) => {
    const { data, error } = await supabase
        .from('users')
        .insert({ user_name: userName });



    return {
        props: {
            data,
            error,
        },
    };
};

export default sendUser;
