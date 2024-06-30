import { createClient } from '@supabase/supabase-js'
// import { Database } from '@types/supabasetype' // 型定義必要？

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);