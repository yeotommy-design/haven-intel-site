# HavenIntel Cloudflare Soft Launch

This project is ready for a **public soft launch** on `haven-intel.com`.

## Recommended launch mode

Launch the **public site only**:

- homepage
- live board
- past matches
- insights
- public view
- policy pages

Keep these pages unadvertised and out of search:

- account
- access
- dashboard
- admin
- admin login
- history
- article studio
- email preview pages

## Cloudflare Pages setup

1. Create a new Cloudflare Pages project.
2. Use **Direct Upload** or connect the folder through Git later.
3. Set the project root to this folder:

   `/Users/tommyyeo/Desktop/VerseIntel.nosync/ProjectHaven`

4. Build settings:

   - Framework preset: `None`
   - Build command: leave empty
   - Build output directory: `.`

Because HavenIntel is a static HTML site, no build step is required.

## Custom domain

Attach:

- `haven-intel.com`
- optionally `www.haven-intel.com`

Then set the primary domain to whichever public address you prefer.

## Files already prepared

- `robots.txt`
- `sitemap.xml`
- `_headers`

These support indexing of public pages and discourage indexing of unfinished private/internal pages.

## After deployment

Run these checks on the live domain:

1. Homepage loads without console or fetch errors.
2. `index.html`, `past.html`, `insights.html`, and `public-view.html` all load correctly.
3. Live board fetches data from `/data/...` successfully.
4. Policy pages open from the footer.
5. Private/internal pages are not linked from the public footer.
6. Mobile nav wraps cleanly.
7. `robots.txt` and `sitemap.xml` return correctly on the live domain.

## Not part of this soft launch

Do not announce these as live product features yet:

- real account system
- real email verification
- real payment access
- real Stripe unlock flow
- real production admin operations

Those still need a proper backend before full paid launch.
