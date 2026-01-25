import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ohlxtnthkgawqwefbevm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9obHh0bnRoa2dhd3F3ZWZiZXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3OTA5MDUsImV4cCI6MjA4MDM2NjkwNX0.d_SVhnZCouU6p7cYxsIjQv196bQhaWWvhfxuCsoiUEM'

export const supabase = createClient(supabaseUrl, supabaseKey)