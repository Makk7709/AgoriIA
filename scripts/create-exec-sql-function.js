require('dotenv').config({ path: '.env.test' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables SUPABASE_URL or SUPABASE_SERVICE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createExecSqlFunction() {
    try {
        console.log('Reading SQL script...');
        const sqlScript = fs.readFileSync(
            path.join(__dirname, 'create-exec-sql-function.sql'),
            'utf8'
        );

        console.log('Creating exec_sql function in Supabase...');
        const { data, error } = await supabase.rpc('exec_sql', {
            sql_query: sqlScript
        });

        if (error) throw error;

        console.log('Successfully created exec_sql function!');
        return data;
    } catch (error) {
        console.error('Error creating exec_sql function:', error.message);
        throw error;
    }
}

createExecSqlFunction()
    .catch(error => {
        console.error('Script failed:', error);
        process.exit(1);
    }); 