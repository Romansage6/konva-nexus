import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://deadptpaxghdvknfsqmi.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlYWRwdHBheGdoZHZrbmZzcW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjY5ODQsImV4cCI6MjA3MDA0Mjk4NH0.j5yka3D900FTK-0zX4MnJVVex1-mVipOyeT5mcVzlMI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})