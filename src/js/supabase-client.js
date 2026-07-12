// Supabase client initialization.
// Requires the Supabase JS SDK to be loaded via CDN before this script:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const SUPABASE_URL = 'YOUR_SUPABASE_URL';         // TODO: replace with your Supabase project URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // TODO: replace with your anon key

window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
