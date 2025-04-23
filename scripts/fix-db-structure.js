require('dotenv').config({ path: '.env.test' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables. Please check .env.test file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function fixDatabaseStructure() {
    try {
        console.log('Reading SQL script...');
        const sqlScript = fs.readFileSync(
            path.join(__dirname, 'fix-db-structure.sql'),
            'utf8'
        );

        console.log('Executing SQL script...');
        const { error } = await supabase.rpc('exec_sql', {
            sql: sqlScript
        });

        if (error) {
            throw error;
        }

        console.log('Database structure fixed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing database structure:', error);
        process.exit(1);
    }
}

fixDatabaseStructure(); 