const { createClient } = require('@supabase/supabase-js'); 
let supabaseAdmin = null; 
function getSupabaseAdmin() { 
    if (supabaseAdmin) return supabaseAdmin; 
    supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } }); 
    return supabaseAdmin; 
} 
module.exports = { getSupabaseAdmin }; 
