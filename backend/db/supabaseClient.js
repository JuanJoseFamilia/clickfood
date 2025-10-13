// backend/db/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

//Tener la url y el key en variables de entrono
const supabaseUrl = 'https://onosbhtrwowqkjfqzwza.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ub3NiaHRyd293cWtqZnF6d3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyOTE1MDUsImV4cCI6MjA3NTg2NzUwNX0.P-5vedhV238eEVL9ayYdfrKFvP3JrKMqT4KPtFePITs'
export const supabase = createClient(supabaseUrl, supabaseKey)