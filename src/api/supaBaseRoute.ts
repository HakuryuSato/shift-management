import { supabase } from '@utils/supabase/supabase';

export const fetchData = async (table: string, column: string) => {
    let { data, error } = await supabase
        .from(table)
        .select(column);

    return {
        data,
        error,
    };
};