import { supabase } from '@/utils/supabase';
import type InterFaceShiftQuery from '@/customTypes/InterFaceShiftQuery';

const sendApproval = async (shiftId: number) => {
    const { data: currentData, error: currentError } = await supabase
        .from('shifts')
        .select('is_approved')
        .eq('shift_id', shiftId)
        .single();

    if (currentError) {
        return {
            props: {
                data: null,
                error: currentError,
            },
        };
    }

    // null以外が入る、チェックしているため
    const newApprovalStatus = !currentData.is_approved;

    const { data, error } = await supabase
        .from('shifts')
        .update({ is_approved: newApprovalStatus })
        .eq('shift_id', shiftId);

        console.log(data)

    return {
        props: {
            data,
            error,
        },
    };
};


export default sendApproval;
