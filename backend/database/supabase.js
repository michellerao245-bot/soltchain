const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// 1️⃣ Error Guard (Must have for Pro Devs)
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ CRITICAL: Supabase Environment Variables are missing!");
  process.exit(1); // Server ko stop kar do agar config galat hai
}

// 2️⃣ Initializing with Service Role Key for Backend Power
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🚀 SoltDex: Supabase engine is ignited with Service Role!');

module.exports = supabase;