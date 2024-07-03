import { supabase } from '@/utils/supabase';

const deleteShift = async (shiftId: number) => {
    const { data, error } = await supabase
        .from('shifts')
        .delete()
        .eq('shift_id', shiftId);

    return {
        props: {
            data,
            error,
        },
    };
};

export default deleteShift;
