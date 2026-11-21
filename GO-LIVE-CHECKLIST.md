# 11za WordPress site: go-live checklist

For: whoever moves the new 11za WordPress site (theme `11za-theme`) from the local copy
(`http://localhost/11za-wp-new`) to the live domain.
Tick each box as you go. Replace `https://YOUR-LIVE-DOMAIN` with the real address everywhere.

> **No secrets in this file.** The WhatsApp API token and database password are never written
> down here. They go straight into the live `wp-config.php`.

---

## 0. Before you start

- [ ] Full backup of the **live** site (files + database), even if the live site is currently empty or old.
- [ ] Pick a quiet time. Plan for about 1 to 2 hours.
- [ ] Know where the old site's page addresses are used (ads, partner emails, WhatsApp templates), because the redirects in section 11 keep them working.
- [ ] Live server: PHP 7.4 or newer (8.x recommended), WordPress 6.x, HTTPS (SSL certificate) installed.

## 1. What to move

| Item | Where it is locally | Notes |
|---|---|---|
| Theme | `wp-content/themes/11za-theme/` | Copy the whole folder. |
| Uploads (media) | `wp-content/uploads/` | Needed for logos, team photos, case-study images. |
| Database | MySQL database `11za-wp-new` | **Do not import the whole dump over the live database. Read section 3 first.** |
| Plugins | `wp-content/plugins/` | Install fresh from the plugin directory (see section 2). |
| `wp-config.php` | site root | **Do not copy.** Build the live one (section 4). |
| `.htaccess` | site root | **Do not copy.** It contains `RewriteBase /11za-wp-new/` which is wrong on a live root (section 5). |
## 2. Install plugins on the live site

- [ ] **Advanced Custom Fields** (free). Holds the `youtube_video_id` field for Tutorials.
- [ ] **Contact Form 7**.
- [ ] **Contact Form CFDB7** (stores contact-form submissions in the admin).
- [ ] An **SMTP plugin** (for example WP Mail SMTP). Needed for email (section 8).
- [ ] Do **not** install: Akismet (unless you use it), WooCommerce, BetterDocs, Classic Editor. They are not part of the new site.
- [ ] After importing content, **deactivate and delete "WordPress Importer"** if you used it.

## 3. Move the database and fix the addresses (read this section carefully)

### 3a. The two sites use different table prefixes

| | Table prefix | Example tables |
|---|---|---|
| **Local** site | `wp_` | `wp_posts`, `wp_options`, `wp_signup_form` |
| **Live** site | `ooza_` | `ooza_posts`, `ooza_options`, `ooza_signup_form` |

- The signup code and the duplicate-email rule build their table names from the site's prefix. On live, that gives `ooza_signup_form`, `ooza_signup_demo_form` and `ooza_cf7_email_log`, the real tables with your real data. On local it gives the `wp_` versions.
- **A local dump (`wp_` tables) cannot replace live tables (`ooza_`).** If you import it as it is, it only adds a second, unused set of `wp_` tables, and the live site keeps showing the old content.
- Do **not** change the live prefix in the live `wp-config.php` to `wp_`: the live site would then look at empty tables and appear to lose everything.
- Choose one way to bring the new content over (3c).

### 3b. Protect the live data tables

These tables hold **real data on the live site**. Never overwrite them with local copies.

| Table on the live site (local name in brackets) | What is in it |
|---|---|
| `ooza_signup_form` (`wp_signup_form`) | your real signups |
| `ooza_signup_demo_form` (`wp_signup_demo_form`) | real demo signups |
| `ooza_db7_forms` (`wp_db7_forms`) | real contact-form leads |
| `ooza_cf7_email_log` (`wp_cf7_email_log`) | email addresses that already submitted (section 8) |
| `ooza_users`, `ooza_usermeta` (`wp_users`, `wp_usermeta`) | your real accounts. Importing replaces them with the single local `admin` account. |

- [ ] **Back up the live database first.**

### 3c. Way 1 (recommended when the new site replaces the old): convert the dump to the live prefix

- [ ] Export the local database **without** the protected tables and without the unused old-plugin tables. Command line:

```bash
mysqldump -u USER -p 11za-wp-new \
  --ignore-table=11za-wp-new.wp_signup_form \
  --ignore-table=11za-wp-new.wp_signup_demo_form \
  --ignore-table=11za-wp-new.wp_db7_forms \
  --ignore-table=11za-wp-new.wp_cf7_email_log \
  --ignore-table=11za-wp-new.wp_11za_abandonment \
  --ignore-table=11za-wp-new.wp_11za_setting \
  > local-for-live.sql
```

  In phpMyAdmin: Export, "Custom", and **untick** those tables.
- [ ] Change the table prefix in the file from `wp_` to `ooza_`:

```bash
sed -i 's/`wp_/`ooza_/g' local-for-live.sql
```

- [ ] Import `local-for-live.sql` into the live database.
- [ ] Two settings store the prefix as text. Run these once in phpMyAdmin (SQL tab):

```sql
UPDATE ooza_options SET option_name = 'ooza_user_roles' WHERE option_name = 'wp_user_roles';
UPDATE ooza_usermeta SET meta_key = CONCAT('ooza_', SUBSTRING(meta_key, 4)) WHERE meta_key LIKE 'wp\_%';
```

  (Without these you cannot log in, because WordPress no longer finds your account's role.)
- [ ] **Log in with the local admin account** (username `admin`), because the users were replaced. Change its password at once and recreate any other live users you still need. To keep the live accounts, also add `--ignore-table` for `wp_users` and `wp_usermeta` in the export above, and skip the second SQL line.
- [ ] Old tables of other plugins (WooCommerce, BetterDocs) stay in the live database untouched. The import deactivates those plugins. That is expected.

### 3d. Way 2 (safer, more manual): WordPress Export and Import

Use this if you would rather not touch the live database tables.

- [ ] Local: Tools → Export → **All content**. This includes pages, posts, menus, Tutorials, Team, Blue Ticks, Integrations and the Contact Form 7 form.
- [ ] Live: Tools → Import → WordPress, upload the file. Copy the local `wp-content/uploads` folder to live first, so the images are there.
- [ ] Then recreate by hand what an export does not carry: the menu locations (Appearance → Menus → Manage Locations), the homepage setting (Settings → Reading), the time zone, the admin email, and the ACF field `youtube_video_id`.

### 3e. Fix the addresses (both ways)

The database holds `http://localhost/11za-wp-new` in 25 menu links, 2 settings and the media records.

```bash
wp search-replace 'http://localhost/11za-wp-new' 'https://YOUR-LIVE-DOMAIN' --all-tables --skip-columns=guid --dry-run
# if the dry run looks right, run it again without --dry-run
wp search-replace 'http://localhost/11za-wp-new' 'https://YOUR-LIVE-DOMAIN' --all-tables --skip-columns=guid
wp cache flush
```

(No command line? Use the **Better Search Replace** plugin.)

- [ ] Settings → General: **WordPress Address** and **Site Address** both show `https://YOUR-LIVE-DOMAIN`.
- [ ] Check that no `localhost` remains: open the header menu links, the footer links and the mobile menu links.
- [ ] Open **Signup Form Listing** and the Contact Forms list: your real data is still there.

> Moving only the theme and **not** the database? Then you must recreate by hand: pages (with their templates), the menus and their locations, the contact form, the ACF field, the Tutorials, Team, Blue Tick and Integration posts. Way 1 or Way 2 above is much easier.
## 4. Build the live `wp-config.php`

Start from the live site's own `wp-config.php` (live database name, user, password, salts). Then make sure these exist:

```php
define( 'WP_DEBUG', false );
define( 'WP_DEBUG_LOG', false );
define( 'WP_DEBUG_DISPLAY', false );
define( 'DISALLOW_FILE_EDIT', true );
define( 'WP_ENVIRONMENT_TYPE', 'production' );

/** 11za API token for the WhatsApp lead message after the contact form.
    Copy the value from the LOCAL wp-config.php. Keep it secret. */
define( 'ZA_11ZA_API_TOKEN', 'PASTE-THE-TOKEN-HERE' );
```

- [ ] The `ZA_11ZA_API_TOKEN` line is on the live `wp-config.php`. **It is not in the theme or the database**, so without this line the WhatsApp lead message silently stops.
- [ ] Debug is off (`WP_DEBUG` and `WP_DEBUG_LOG` are `false`).
- [ ] If the site is HTTPS-only, also add `define( 'FORCE_SSL_ADMIN', true );`.

## 5. Permalinks and `.htaccess`

- [ ] Settings → Permalinks: choose **Post name** (`/%postname%/`) and click **Save**. This rewrites the live `.htaccess` correctly. Do not paste the local one.
- [ ] Open a few pages (not only the homepage) to confirm they load and do not 404.

## 6. Activate the theme and check the settings

- [ ] Appearance → Themes: activate **11za**.
- [ ] Appearance → Menus → **Manage Locations**: confirm these are assigned (needed if you did not move the database):

| Location | Menu |
|---|---|
| Header menu | Header Menu |
| Mobile menu | Mobile Menu |
| Footer menu (columns) | Footer Menu |
| Footer cities row | Footer Cities |
| Footer legal links | Footer Legal |

- [ ] Settings → General: **Administrator email** is a company address (it is a personal address locally). **Time zone** is Asia/Kolkata (it is empty locally, which makes log times wrong).
- [ ] Settings → Reading: "Discourage search engines" is **unchecked** (the local site allows indexing).
- [ ] Settings → Reading: homepage displays a **static page** and it is "Home".
- [ ] Settings → Permalinks has been saved (section 5).
- [ ] The Bing verification tag and the favicon appear in the page source (they are in the theme; check them in "view source").

## 7. Content check: open every page

| Page | Address | Check |
|---|---|---|
| Home | `/` | Hero, sliders, logos, case studies load. |
| About | `/about/` | Founder card and team cards show names, photos, text. |
| Contact | `/contact/` | Contact form shows and submits. |
| Pricing | `/pricing/` | Plans and table show. |
| Integrations | `/integrations/` | Logo grid and filter buttons work. |
| Privacy Policy / Terms | `/privacy-policy/` `/terms-conditions/` | Full text shows. |
| Webhook / Pabbly API | `/webhook/` `/pabbly-api-doc/` | Docs layout is correct. |
| Signup pages | `/signup/` `/signup-demo/` `/signup-adkrity/` `/signup-bulky-marketing/` `/signup-hisab-kitab/` `/signup-init-infologic/` `/signup-jiyan-infosoft/` `/vastra-signup/` `/signup-ledgo/` `/signup-respondly/` `/signup-rk-infotech/` `/signup-sunrise-software/` | Each loads (see section 9 for saving). |
| Tutorials | `/tutorials/` and `/tutorial-category/case-study/` | Case studies show with their video. |
| Team | `/team/` | Four members. |
| 404 | `/no-such-page/` | Shows "Page not found". |

- [ ] Header and footer menus: every link goes somewhere sensible. **Many links are still `#` placeholders** (see "Known unfinished items" at the end). Set the real addresses in Appearance → Menus.
- [ ] On a phone: open the mobile menu, tap Book a demo, Sign up and Contact.

## 8. Email (the contact form) and the WhatsApp lead message

- [ ] SMTP plugin configured and a test email sent from Settings of that plugin.
- [ ] **SPF and DKIM** records are set for the sending domain (11za.com). The form sends from `noreply@11za.com`; without these, emails land in spam.
- [ ] Contact → Contact Forms → open the form: recipient is `nirmit@11za.com` (or the correct inbox), the From address is a real, authenticated address.
- [ ] Submit the Contact page form with a **real test**. Confirm: the email arrives in the inbox, and the auto-reply reaches the sender.
- [ ] **Use a different email address for every test.** The site only sends mail for the **first** submission from each email address, ever (the old site's rule, kept as it was). A repeat from the same address still shows "Thank you, your message has been sent" but sends **no email**, so a second test with the same address looks like a mail problem when it is not. The list of used addresses is the table `{prefix}cf7_email_log` (`ooza_cf7_email_log` on the live site); delete your own test address from it to test again. Addresses that already submitted before launch stay blocked.
- [ ] The visitor receives the **WhatsApp lead message**. The WhatsApp message is only sent **after** the email is sent successfully, so a broken mail setup also stops it.
- [ ] Tools → **WhatsApp leads** shows the attempt with status `sent`. If it shows `failed`, read the reason there (the API reply is shown; the token is never shown).
- [ ] The submission appears in the **Contact Forms** menu added by Contact Form DB 7 (a separate top-level item in the admin sidebar, not the "Contact" menu of Contact Form 7).
- [ ] The Contact page and the WhatsApp trigger recognise the form by its code **`bf137af`**. If you recreated the form instead of importing it, the code changed. Update it in `template-contact.php` (the shortcode) and in `inc/contact-whatsapp.php` (`za_whatsapp_form_hashes`).
- [ ] Optional: turn on reCAPTCHA, Turnstile or Akismet in Contact → Integration. The form currently shows a "has config errors" warning about the visitor auto-reply having no spam protection. The form still works.

## 9. Signup forms (Facebook) and saving

The signup pages save the entry to this site, then open the Facebook sign-in. Facebook only works on domains registered in the Meta app. The save code is in the theme's `functions.php` (copied from the old theme: same function names, same routes, same tables).

- [ ] The code uses the tables `{prefix}signup_form` and `{prefix}signup_demo_form`. On the live site (prefix `ooza_`) these are the existing `ooza_signup_form` and `ooza_signup_demo_form` with your real signups. Check they are still there. If a table is missing, the theme creates an empty one the next time the admin or the signup save runs.
- [ ] In the Meta (Facebook) developer settings for app **280829531162725**, add the live domain to **App Domains** and to the allowed domains for the JavaScript SDK and Embedded Signup.
- [ ] Each partner page uses its own Meta configuration IDs from its script (`assets/js/signup/*.js`). Check these are valid for the live domain.
- [ ] Do **one real test signup** on `/signup/` (use a test business). It should: save an entry, open Facebook, and finish.
- [ ] Admin menu **Signup Form Listing**: the test entry appears. (This is the old screen: "Filter by Type", "Search Data", 10 per page.)
- [ ] Delete the test entries afterwards (phpMyAdmin, table `ooza_signup_form` on live).
- [ ] If the live signup tables are in a **different database** than WordPress, add these to the live `wp-config.php` so the admin list reads the right one: `ZA_SIGNUP_DB_USER`, `ZA_SIGNUP_DB_PASSWORD`, `ZA_SIGNUP_DB_NAME` (and `ZA_SIGNUP_DB_HOST`). Normally you do not need them.
- [ ] The signup pages are deliberately **noindex**. Leave this as it is.

Known behaviour inherited from the old code (not bugs in the move):
- After the Facebook step, the entry's **Type** becomes the partner ID (a long code) instead of the short name, so the "Filter by Type" dropdown does not find finished signups. They show under "All".
- Two saves of one entry at the same instant could create two rows. It is rare, because the Facebook window takes seconds.
## 10. Book a demo buttons

There is no separate "Book a demo" page (the old site had none either). Every "Book a demo" button is a **direct link** to `https://cal.id/11za/11za-personalized-product-demo` and opens in a new tab.

- [ ] Click "Book a demo" in the header (desktop and the mobile menu), on the homepage, and on the Pricing page: each opens the cal.id booking page in a new tab.
- [ ] Open `https://YOUR-LIVE-DOMAIN/demo/`: it shows the 404 page (the page was removed on purpose).
- [ ] The WhatsApp lead message (section 8) contains the same cal.id link as its button.
## 11. Old addresses redirect (keep rankings and shared links)

After launch, open each old address and confirm it lands on the new page (one redirect, then a normal page):

| Old address | Should go to |
|---|---|
| `/home/` | `/` |
| `/about-us/` | `/about/` |
| `/contact-us/` | `/contact/` |
| `/pabbly-api-documentation/` | `/pabbly-api-doc/` |
| `/signup-form/` | `/signup-adkrity/` |
| `/respondly-signup-form/` | `/signup-respondly/` |
| `/signup-old/` | `/signup/` |
| `/bulky-marketing-signup-form/` | `/signup-bulky-marketing/` |
| `/hisab-kitab-signup-form/` | `/signup-hisab-kitab/` |
| `/init-infologic-signup-form/` | `/signup-init-infologic/` |
| `/jiyan-infosoft-signup-form/` | `/signup-jiyan-infosoft/` |
| `/vastra-signup-form/` | `/vastra-signup/` |
| `/knowledge-center/` | `/tutorial-category/knowledge-center/` |
| `/case-study/` | `/tutorial-category/case-study/` |
| `/tutorial/…`, `/our_team/…`, `/green_tick/…`, `/our_integrations/` | `/tutorials/…`, `/team/…`, `/blue-tick/…`, `/integrations/` |

- [ ] The redirects are in `inc/redirects.php`. Add more with the two lists at the top of that file.
- [ ] `/shopify/` and `/docs/` have **no destination yet** and show a 404 (see "Known unfinished items").

## 12. Search engines and tracking

- [ ] Submit the new sitemap: `https://YOUR-LIVE-DOMAIN/wp-sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- [ ] Bing: the verification tag is already in every page.
- [ ] Neither the old nor the new theme includes Google Analytics or Tag Manager. If the live site used one (through a plugin or the hosting), add it again.
- [ ] After a week: Search Console, Coverage report. Watch for 404s on old addresses and add redirects.

## 13. Security

- [ ] `wp-content/debug.log` deleted, and `WP_DEBUG_LOG` is `false` (section 4). Open `https://YOUR-LIVE-DOMAIN/wp-content/debug.log` and confirm it returns 404.
- [ ] Delete `readme.html` and `license.txt` from the site root.
- [ ] Users: remove any test or unused administrator accounts. Strong passwords for all administrators. Consider two-factor login and a login-attempt limiter.
- [ ] HTTPS works on every page, with no "mixed content" warnings (check the browser lock icon on Home, Contact, Signup).
- [ ] Rotate the 11za API token and the database password **if** the old theme file, or a copy of it, was ever shared, emailed or committed anywhere. The old theme's `functions.php` contained both in plain text.
- [ ] The signup save routes are open to the public by design (they check and size-limit the data). If you see spam entries in Signup Form Listing, ask for rate limiting.
- [ ] Remove local-only files if they were copied: `*.bak`, `zz-*` test files.

## 14. Final smoke test (after everything above)

| Test | Pass? |
|---|---|
| Homepage loads fast, no console errors | [ ] |
| Every header and footer link works (or is intentionally `#`) | [ ] |
| Contact form: email arrives + WhatsApp message + entry in CFDB7 | [ ] |
| Book a demo buttons open the cal.id booking page in a new tab | [ ] |
| One real signup saved and visible in Signup Form Listing | [ ] |
| Old address redirects (section 11) | [ ] |
| Logo grid, tutorials, team and integrations pages | [ ] |
| Mobile menu, tablet and phone layout | [ ] |
| 404 page | [ ] |
| Favicon in the browser tab | [ ] |
| Page source: no `localhost` anywhere | [ ] |

## 15. If something goes wrong (rollback)

- [ ] Keep the pre-launch backup from section 0 for at least a week.
- [ ] To undo: restore the backup of files and database, then re-save Permalinks.
- [ ] Quick fix for a broken site: rename `wp-content/themes/11za-theme` to disable it. WordPress then falls back to another installed theme. Check `wp-content/debug.log` first if debug logging was on.

---

## Known unfinished items (decide before or after launch)

These are not bugs. They are things the old site had or the plan still needs.

- **Brochure strip** ("Get Brochure Now" and `11za_deck.pdf`) and the pricing PDFs (**Price Explainer**, country pricing) are not on the new site.
- **Footer:** social links (LinkedIn, X, Instagram, Facebook) and the App Store / Google Play badges are not in the new footer.
- **Team:** LinkedIn link and a separate designation field per team member (the old site had them).
- **Product and Solutions pages:** still static HTML in the frontend, not converted. The header and footer links to them are `#` placeholders. `/shopify/` has no page yet.
- **Knowledge Center and Case Study list pages:** the category pages use a plain default layout. The old site's **13 Knowledge Center videos** are not imported.
- **Documentation (`/docs/`)** from the old BetterDocs plugin is not migrated.
- **Branded 404 page**, a **blog** page, search results page, and SEO tags (titles and descriptions for tutorials and team posts, Open Graph).
- **Header menu links that are `#`:** Product items, Solutions items, Blog, most footer links. Set real addresses in Appearance → Menus.

---

## Quick reference

| Thing | Where |
|---|---|
| Menus | Appearance → Menus |
| Contact form | Contact → Contact Forms |
| Contact submissions | Contact Forms (Contact Form DB 7, its own menu) |
| Signup entries | Signup Form Listing (admin menu) |
| WhatsApp lead log | Tools → WhatsApp leads |
| Redirects list | `inc/redirects.php` |
| Signup save code, admin list, duplicate-email rule | `functions.php` (bottom, under "custom functions") |
| WhatsApp lead code | `inc/contact-whatsapp.php` |
| SVG uploads, favicon, Bing tag | `inc/site-extras.php` |
| API token | live `wp-config.php` only (`ZA_11ZA_API_TOKEN`) |