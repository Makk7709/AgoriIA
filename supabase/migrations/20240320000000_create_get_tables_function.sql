-- Create a function to get all tables in the public schema
create or replace function get_tables()
returns table (table_name text)
language sql
security definer
as $$
  select table_name::text
  from information_schema.tables
  where table_schema = 'public'
  and table_type = 'BASE TABLE';
$$; 