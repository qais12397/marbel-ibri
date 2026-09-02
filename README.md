# Global Shining Rocks — Website

Static site (no build step): `index.html` (public site), `admin.html` (product
management dashboard), `js/store.js` (data layer), `js/config.js` (Supabase
connection settings), `schema.sql` (database schema for Supabase).

## 1. Connect a real database (Supabase)

Right now the project ships with `js/config.js` empty, so it runs in **local
demo mode**: edits made in `admin.html` only apply to the browser/device that
made them. To make the admin dashboard actually update the live site for every
visitor, connect Supabase:

1. Create a free project at https://app.supabase.com
2. Open **SQL Editor** and run the contents of `schema.sql`
3. Go to **Authentication → Users → Add user** and create your real admin
   login (a real email + a strong password). This is what you'll log into
   `admin.html` with — the old `admin` / `oman2026` demo login only works
   while Supabase isn't connected.
4. Go to **Project Settings → API** and copy the **Project URL** and the
   **anon public** key.
5. Paste them into `js/config.js`:
   ```js
   window.GSR_CONFIG = {
     supabaseUrl: 'https://xxxxxxxxxxxx.supabase.co',
     supabaseAnonKey: 'eyJhbGciOi...'
   };
   ```
6. Commit and redeploy. The anon key is safe to ship in client-side code —
   access is controlled by the Row Level Security policies already defined in
   `schema.sql` (public read, writes require a logged-in Supabase user).

## 2. Deploy to GitHub Pages

From this folder:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source → Deploy from a branch**, pick
`main` and `/ (root)`, and save. The site will be live at
`https://<your-username>.github.io/<your-repo>/` within a minute or two.

If you're using a custom domain, add it under **Settings → Pages → Custom
domain** and update the `<link rel="canonical">` tag in `index.html` to match.

## 3. Before going live, update these placeholders

- WhatsApp number: currently `+968 9000 0000` in `index.html` (nav button,
  hero button, contact card, and the `handleQuoteSubmit` JS function).
- Sales email: `sales@globalshiningrocks.com` in `index.html`.
- Canonical URL: `https://www.globalshiningrocks.com/` in `index.html`'s
  `<head>` — set it to wherever the site actually ends up living.
- Product photos currently hotlink to Unsplash; consider hosting your own
  images (e.g. in a Supabase Storage bucket, see the note at the bottom of
  `schema.sql`) for reliability and branding.
