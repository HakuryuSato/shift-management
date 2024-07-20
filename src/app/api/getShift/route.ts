import { supabase } from '@api/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';
import type InterFaceShiftQuery from '@customTypes/InterFaceShiftQuery';

const getShifts = async (req: NextApiRequest, res: NextApiResponse) => {
    const { user_id = '*', year, month, start_time, end_time, is_approved } = req.query as InterFaceShiftQuery['query'];
    
    const now = new Date();
    const queryYear = year ?? now.getFullYear();
    const queryMonth = (month ? Number(month) : now.getMonth()) + 1;

    const defaultStartDate = new Date(queryYear, queryMonth - 1, 1);
    const defaultEndDate = new Date(queryYear, queryMonth, 0);

    const startDate = start_time ? new Date(start_time) : defaultStartDate;
    const endDate = end_time ? new Date(end_time) : defaultEndDate;

    const startDateISOString = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())).toISOString();
    const endDateISOString = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59)).toISOString();

    let query = supabase
        .from('shifts')
        .select('shift_id,user_id,user_name,start_time, end_time,is_approved')
        .gte('start_time', startDateISOString)
        .lte('end_time', endDateISOString);

    const conditions = {
        user_id: user_id !== '*' ? user_id : null,
        is_approved: is_approved !== undefined ? is_approved : null,
    };

    Object.entries(conditions).forEach(([key, value]) => {
        if (value !== null) {
            query = query.eq(key, value);
        }
    });

    const { data, error } = await query;

    if (error) {
        res.status(500).json({ error });
    } else {
        res.status(200).json({ data });
    }
};

export default getShifts;
