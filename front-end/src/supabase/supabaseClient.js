import { createClient } from "@supabase/supabase-js"

const supabase_url = process.env.SUPABASE_URL || "https://fbctwwgyjjjgrtnpnaps.supabase.co"
const supabase_anon_key = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiY3R3d2d5ampqZ3J0bnBuYXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MjcyMDcsImV4cCI6MjA4MjUwMzIwN30.dr0z8jsGMnMeZEkRNSyZpKUh1B2b5t5Gk8K0xmiJcKg"

// Create supabase client
const supabase = createClient(supabase_url, supabase_anon_key);

export default supabase;