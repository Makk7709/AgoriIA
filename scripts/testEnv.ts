import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });
console.log("✅ Environnement chargé — SUPABASE_URL =", process.env.SUPABASE_URL); 