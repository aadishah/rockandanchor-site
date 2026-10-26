# Rock & Anchor website

The public site for Rock & Anchor (rockandanchor.in). One Cloudflare Worker renders every page from Airtable, so content is edited in Airtable, not in code.

- Preview: https://rockandanchor-site.adityashah-06.workers.dev
- Hosting: Cloudflare Workers (free plan), Worker name `rockandanchor-site`
- Data: Airtable base `app0sjg0lmpX4ERo1` (Rock&Anchor), read-only token in the Worker secret `AIRTABLE_TOKEN`
- Cache: data refreshes at most every 5 minutes. If Airtable is unreachable the site shows the last good data, or the built-in snapshot.

## Where content lives (Airtable)

| Site area | Table | Key fields |
| --- | --- | --- |
| Experiences and experience pages | Experiences | Show on Website, Website Title, Website Slug, Website Order, Website Summary, Website Description, Website Photos, Website Itinerary, Website FAQs, Website Price Details, Website Age Group, Website Location, Website Timing, Website Category, Website Dates Ahead (days) |
| Upcoming dates | Events | Start, End, Experience, Status (Approved, Ready or Future), Hide on Website |
| Reviews | Reviews for Website | Show on Website, Experience |
| Impact Created | Website Impact | Metric, Value, Order, Show on Website |
| Team page | Website Team | Name, Role, Group, Bio, Photo, Order, Show on Website |

### How each experience field shows on the site

Only experiences with **Show on Website** ticked and a **Website Slug** appear. Everything below comes from Airtable; nothing about individual experiences is hard-coded.

| Field | Where it shows | If empty |
| --- | --- | --- |
| Website Title (falls back to Experience Name) | Card title, page title | Experience hidden if both are empty |
| Website Slug | Page address `/experiences/<slug>` | Experience hidden |
| Website Order | Order on the site (lowest first) | Goes to the end |
| Website Summary | Card text, "What is it?" lead line | First sentence of the description |
| Website Description | "What is it?" section. `## What's included` is pulled into its own section. Any `## What to bring` or packing heading is hidden from the site (packing lists go privately on WhatsApp) | Polite fallback line |
| Website Itinerary | "Itinerary" timeline | "Detailed plan shared when you book" |
| Website Price Details | "Price" table; card and page "From" price | "Price on request" |
| Website Age Group | Card "Age", page "Who is it for" | "Ask us" |
| Website Location | Card "Location", page "Where" | "Shared on booking" |
| Website Timing | Page "When" | "On request" |
| Website FAQs | "FAQs" | "Have a question? WhatsApp us" |
| Website Category | Card label and the filter on /experiences | No label |
| Website Photos | Card image and page gallery (first photo is the cover) | Logo placeholder |
| Website Dates Ahead (days) | Limits how far ahead dates are listed | All upcoming dates |

Text formats:
- Description: `## ` starts a heading, `- ` starts a bullet. Keep `## What's included` as a heading so it lands in its own section. Do not put packing lists here; they are hidden.
- Itinerary: one `time | activity` per line, `## Day 1` for multi-day plans.
- Price Details: `Label | ₹X` per line. Plain lines are notes (for example "Excludes travel"). The "From" price is the lowest ₹ value, ignoring rows whose label contains "optional", "add on" or starts with "Transport"/"Travel". A row like "Up to 20 people | ₹20,000" is shown "per group". If the text says "Price on request", no price is shown.
- Age: write "Ages 4 to 12, with a parent"; the site shows "Ages 4–12, with a parent".
- Location: write "Place · X hrs from Dadar".
- FAQs: question on one line, answer below, blank line between questions.
- Reviews: tick Show on Website; add a Photo (with the person's permission) to show their picture.

Check every experience after edits: `python3 build.py && node scripts/check.mjs` (uses the snapshot), or open the live pages.

## Code layout

- `src/template.js`: the Worker (routing, Airtable fetch, HTML and CSS). Placeholders are filled by the build.
- `src/policies.py`: Terms, Privacy, Cancellation and Refunds text.
- `src/snapshot.json`: fallback data used before the token exists or if Airtable fails.
- `assets/`: logo and favicon (inlined into the build).
- `build.py`: makes `dist/worker.js`.
- `scripts/`: snapshot maker and a local smoke test.

## Build and deploy

```
python3 build.py
npx wrangler deploy
```

Or paste `dist/worker.js` into the Cloudflare dashboard editor for the Worker and click Deploy.

Bookings are not taken online. Every page points to call or WhatsApp on +91 89287 94380.

## One-Year Check-In form (`/check-in`)

A short form for companies that did an experience with us a year ago (owner: 5 questions and a share permission, team members: 3 anonymous questions). Code: `src/checkin.js`.

- The client types an access code (table **Check-In Codes**, one row per company, untick Active to switch it off) and passes a Cloudflare Turnstile check. The Worker then gives a signed 60 minute pass and saves answers to **Check-In Responses** (linked to the code).
- Airtable tables: Check-In Codes `tblpkiQ9oTbIS7Y3g`, Check-In Responses `tbl8vGG97JWpxZeWa`.
- The Airtable token in `AIRTABLE_TOKEN` must be able to **write** (`data.records:write`), not only read.
- On rockandanchor.in it needs the variable `TURNSTILE_SITEKEY` and the secret `TURNSTILE_SECRET` (Turnstile widget "Rock and Anchor Check-In", hostname rockandanchor.in). On workers.dev addresses Cloudflare's public test keys are used, because Turnstile does not accept workers.dev hostnames.
- `CK_LIVE` in `src/checkin.js` is `false`: the form answers only on workers.dev addresses. To open it on the real domain set it to `true`, add the two settings above and deploy. After that it answers only on the real domain.
- Not in the menu or sitemap, kept out of search engines.
