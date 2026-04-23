const { createClient } = require('@supabase/supabase-js'); // ✅ Fixed package name
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
// 🛡️ Using SERVICE_ROLE_KEY for backend/worker bypass
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ ERROR: Supabase URL or SERVICE_ROLE_KEY missing in .env!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false // Best for microservices
    }
});

// 🚀 Success log with URL for easier debugging
console.log(`⚡ Supabase Client Initialized for: ${supabaseUrl}`);

module.exports = supabase;