# Md. Ashikuzzaman — Portfolio Website

A responsive, English-language portfolio starter built with plain HTML, CSS and vanilla JavaScript. Supabase provides the database, authentication and media storage. Vercel hosts the static site.

## Files
- `index.html`, `style.css`, `script.js`: public website
- `config.js`: Supabase project URL and public anon/publishable key
- `admin/index.html`, `admin/admin.js`, `admin/admin.css`: admin panel
- `supabase_schema.sql`: database, RLS and storage policies
- `assets/`: local placeholder asset

## 1. Create a Supabase project
1. Open https://supabase.com and create an account.
2. Create a new project. Save the database password somewhere safe; it is not the portfolio admin password.
3. Wait until the project is ready.

## 2. Create the database and storage policies
1. In Supabase, open **SQL Editor** → **New query**.
2. Open `supabase_schema.sql`, copy all its contents, paste into the editor and click **Run**.
3. This creates the `portfolio` table, enables Row Level Security (RLS), and creates the public `portfolio-media` bucket with owner-folder upload/delete policies.

## 3. Create the single admin account
1. In Supabase, open **Authentication** → **Users** → **Add user**.
2. Create `ashikuzzaman1453@gmail.com` with a strong password that you choose privately.
3. Disable public sign-ups under **Authentication** → **Settings** (the exact menu label can vary). Keep user creation restricted to the dashboard.
4. Do not share the password or put it in any source file.

## 4. Configure the website
1. Open **Project Settings** → **API** (or **Data API / API Keys**, depending on dashboard version).
2. Copy the Project URL and the anon/public or publishable key.
3. Paste them into `config.js`:
   - `supabaseUrl`: your project URL
   - `supabaseAnonKey`: your anon/public/publishable key
4. It is safe for the browser to use the public anon/publishable key only because RLS is enabled and correctly configured.
5. NEVER put the `service_role` / secret key in `config.js`, HTML, JavaScript, GitHub or Vercel static files. It bypasses RLS and must remain server-side/private.

## 5. Publish the first portfolio record
1. Deploy the website (steps below), then open `/admin/`.
2. Sign in with the admin user you created.
3. The admin editor starts with starter content. Review it and click **Save & Publish**.
4. The public site reads the JSON content from the `portfolio` table.

## 6. Deploy with GitHub and Vercel
1. Create a GitHub repository, for example `ashikuzzaman-portfolio`.
2. Upload the contents of this ZIP (not the ZIP file itself) to the repository using GitHub's web interface or GitHub Desktop.
3. Visit https://vercel.com and sign in with GitHub.
4. Select **Add New** → **Project**, import your repository.
5. Framework Preset: **Other**. Build command: leave blank. Output directory: `.` or root (`./`) if Vercel asks.
6. Click **Deploy**.
7. When deployment finishes, open the Vercel URL and check both the homepage and `/admin/`.
8. Optional: add a custom domain under the Vercel project's **Settings** → **Domains**.

## 7. How updates work
- Text/content/media URL changes saved in Admin → **Save & Publish** update the Supabase record; no new Vercel deployment is required.
- Changes to HTML/CSS/JavaScript or `config.js` require a GitHub commit/push. Vercel automatically deploys the new commit.

## 8. Troubleshooting
- **Blank page:** open browser Developer Tools → Console; check file names, JavaScript errors, and that `config.js` loads before `script.js`.
- **Images do not appear:** check the uploaded file's public URL and bucket name. Use common image formats (JPG, PNG, WebP). A local profile placeholder is included.
- **Login fails:** confirm the Auth user exists, email is correct, password is correct, and the Supabase URL/key match the same project.
- **RLS error:** ensure `supabase_schema.sql` ran successfully. Confirm the logged-in user's UUID is the `owner_id` of the row and that the storage object path starts with that UUID.
- **No live content:** sign in to `/admin/`, save once to create the user's portfolio row, and check the browser console/network tab.

## Security notes
- The public anon/publishable key is intended for browser use with RLS.
- Never expose the Supabase `service_role` key or any secret key.
- The admin password is created in Supabase Auth and is never stored in this repository.
- The public media bucket makes uploaded media publicly viewable. Do not upload private documents or sensitive files.
- Only create the admin user in Supabase Dashboard; keep public sign-ups disabled.

## Launch checklist — check these 10 items
1. [ ] Replace Supabase URL and public anon/publishable key in `config.js`.
2. [ ] Confirm `service_role` or secret keys are nowhere in the repository.
3. [ ] Run `supabase_schema.sql` successfully.
4. [ ] Create the admin Auth user and disable public sign-ups.
5. [ ] Sign in at `/admin/` with the admin email.
6. [ ] Review name, bio, contact links and privacy choices.
7. [ ] Upload a profile photo and test project image uploads.
8. [ ] Verify every project status and education detail before publishing.
9. [ ] Test mobile layout, dark/light toggle, links and all sections.
10. [ ] Test public visitor access, admin-only editing, backup export/import and the live Vercel URL.

## Current content notes
- CGPA was not supplied and is not displayed.
- Completion status for the solar tracker, transformer and smart load management projects was not supplied; those entries are marked "Status not specified".
- Phased-array sonar: primary stage completed; advanced stage ongoing.
- Profile photo and CV have not yet been supplied. A placeholder profile graphic is included.
- LinkedIn was not supplied.
