import { supabase } from '@api/supabase';


const deleteUser = async (userName: string) => {
    // console.log('before_delete', userName);
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('user_name', userName);

    // console.log('after_delete', data, error);
    return {
        props: {
            data,
            error,
        },
    };
};

export default deleteUser;
