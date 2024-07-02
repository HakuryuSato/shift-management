import { supabase } from '@/utils/supabase';
import type InterFaceShiftQuery from '@/customTypes/InterFaceShiftQuery';

const sendShift = async (context: InterFaceShiftQuery) => {
    const { user_id, start_time, end_time } = context.query;

    const { data, error } = await supabase
        .from('shifts')
        .insert([
            { start_time, end_time, user_id }
        ]);

    return {
        props: {
            data,
            error,
        },
    };
};

export default sendShift