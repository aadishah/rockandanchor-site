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

Text formats: Description uses `## ` headings and `- ` bullets. Itinerary is one `time | activity` per line, with `## Day 1` headings. Price Details is `Label | ₹X` per line; plain lines are notes. The card "From" price is the lowest ₹ value, ignoring optional add-ons and transport. FAQs are a question line, the answer below, and a blank line between.

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
