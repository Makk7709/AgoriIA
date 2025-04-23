require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variables d\'environnement manquantes')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createExecSqlFunction() {
    try {
        console.log('Création de la fonction exec_sql...')
        
        const { error } = await supabase.rpc('exec_sql', {
            sql: `
                CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
                RETURNS VOID AS $$
                BEGIN
                    EXECUTE sql;
                END;
                $$ LANGUAGE plpgsql SECURITY DEFINER;
            `
        })

        if (error) {
            console.error('❌ Erreur lors de la création de la fonction:', error)
            process.exit(1)
        }

        console.log('✅ Fonction exec_sql créée avec succès')
    } catch (error) {
        console.error('❌ Erreur inattendue:', error)
        process.exit(1)
    }
}

createExecSqlFunction() 