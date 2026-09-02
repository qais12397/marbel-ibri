/**
 * Global Shining Rocks - Cloud Connection Settings
 *
 * Fill these in after creating your Supabase project and running schema.sql:
 *   1. Create a project at https://app.supabase.com
 *   2. Open the SQL Editor and run the contents of schema.sql
 *   3. Go to Project Settings -> API and copy the Project URL and anon public key below
 *   4. Go to Authentication -> Users -> Add user, and create your real admin login
 *      (email + password) - that account is what you log into admin.html with.
 *
 * Until both values below are filled in, the site runs in local demo mode:
 * product edits made in admin.html only apply to that one browser/device.
 */
window.GSR_CONFIG = {
  supabaseUrl: '',     // e.g. 'https://xxxxxxxxxxxx.supabase.co'
  supabaseAnonKey: ''  // Project Settings -> API -> "anon public" key
};
