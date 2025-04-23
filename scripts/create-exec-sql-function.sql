-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS exec_sql(sql_query text);

-- Création de la fonction exec_sql
CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 