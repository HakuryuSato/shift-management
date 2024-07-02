import { supabase } from '@/utils/supabase';


const deleteUser = async (userId: string) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

    return {
        props: {
            data,
            error,
        },
    };
};

export default deleteUser;
