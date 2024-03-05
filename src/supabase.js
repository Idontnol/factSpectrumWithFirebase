import {createClient} from "@supabase/supabase-js";

const supabaseUrl='https://eseefcrjvyafehhqpvwo.supabase.co';
const supabasekey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZWVmY3JqdnlhZmVoaHFwdndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk2MjE3NDcsImV4cCI6MjAwNTE5Nzc0N30.Y0Ar3gXTyBEzp0hUItzvKpln2YsKxsMCAkpg3xmo_T0";
const supabase= createClient(supabaseUrl,
    supabasekey);



export default supabase;