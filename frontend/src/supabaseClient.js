import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://asiqpiwrynxemhqsmhgx.supabase.co';
// Ensure quotes are there around the key
const supabaseAnonKey = 'sb_publishable_YktV4zmND0AZCANPCuS1nw_e1yFsb65'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);