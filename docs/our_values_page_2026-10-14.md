# Our Values page (14 Oct 2026)

Branch: `about-redesign`, fast-forwarded to the current live line (`changes-after-3-page-audit`, acd9354) before building, so the page sits on the current site. The live line itself is untouched.
Status: **on staging** (version 604d17ad, 14 Oct 2026), not live. https://staging-rockandanchor-site.adityashah-06.workers.dev/values

## Files changed
- `src/values.js` (new): the whole page, its data (VALUES, PRACTICES, LEARN, ESSENTIALS, ASK), CSS and a small script.
- `src/template.js`: `__VALUES__` include, `/values` route, `/our-values` redirect, sitemap entry, "Our Values" in the top nav (after Team) and the footer, and a slightly tighter nav gap between 821 and 1060px so six links fit.
- `build.py`: includes `src/values.js`.
- `scripts/test.mjs`: tests `/values` and `/our-values`.
- `dist/worker.js`: rebuilt.

## What the page contains
1. Hero: "Our values are things we are willing to act on."
2. Intro: what we do because we care; what our values shape.
3. The five values: Sustainability, Simplicity, Cultural authenticity, Experiential learning, Respect for ecosystems. Each card has a core line, an explanation, "On the ground", "What it is not", and links to the practice it becomes.
4. Values in practice: Leave No Trace, Say No to Geotagging, Respect wildlife, Respect communities, Learn before you interfere. Each shows "Comes from" tags that link back to the values.
5. Learn before you go: a map of value → knowledge → what it helps you understand, then Leave No Trace (7 principles, Sahyadri wording) and Say No to Geotagging (four questions before you post).
6. The 10 Essentials: a tickable checklist (no storage), plus the two Rock & Anchor adds (Communication, Attitude and judgment).
7. What we ask of you: the ten asks.
8. We are still learning: closing, with Explore our experiences and a WhatsApp "Plan one for your group" button.

## Left untouched on purpose
About (`src/about.js`), Impact (`src/impact.js`), Team (`src/team.js`), Airtable schema, data loading, policies. No Learning page was built. The shared header and footer now show "Our Values" on every page, including About.

## Sources
- Five values and their field meaning: guide handbook, Part 3 (Our Values), Parts 14 and 15.
- Leave No Trace: Leaders Guide Module 8 (seven principles, Sahyadri application).
- 10 Essentials: the Appalachian Mountain Club's list, in AMC's order (Hydration, Nutrition, Navigation, Emergency shelter, Layers, Illumination, Firestarter, First aid kit, Repair kit, Sun protection), from outdoors.org "The 10 Essentials: What to Pack For a Backcountry Hike". Wording adapted for Sahyadri day treks. The two extras (Communication, Attitude and judgment) come from Leaders Guide Module 20.
- Touch, Move, Inspire: the About page.
- Say No to Geotagging, Respect wildlife, Respect communities, Learn before you interfere, What we ask of you: the brief, plus the handbook's community rules.

## Assumptions
- `/values` as the address (with `/our-values` redirecting).
- No Curate route exists yet, so the second closing button opens WhatsApp.
- The learning content sits in `LEARN` and `ESSENTIALS` as plain data, so a future Learning page can reuse it.

## Photos
Fallbacks come from experience photos. Each spot can be replaced from Airtable (Website Page Photos) using these slot keys:
`values.hero`, `values.sustainability`, `values.simplicity`, `values.culture`, `values.learning`, `values.ecosystems`, `values.end`.

## Check before publishing
- "We do not publish exact locations" (Say No to Geotagging). True for the website; confirm it also holds for Instagram and other channels.
- "Our guides, hosts and cooks come from the villages we work in." Confirm this is true for every role, or soften it to "many of".
- "Saying no to a booking that would damage a place we cannot repair." Taken from the handbook as a standard; confirm you are happy to say it publicly.
- "Each experience also has its own packing list, which we share before you come." Packing lists are hidden on most experience pages; confirm they are always shared after booking.
- The essentials text says the leader carries the first aid kit and the means to make heat. Confirm that this holds on every experience.
- Photo choices, especially the culture card (a village home with children) and the closing group photo.

## Update (14 Oct 2026, later)
Switched the 10 Essentials to the AMC list on request. The AMC Outdoor Leader Handbook in the project does not list the Ten Essentials, so the list was taken from AMC's own article on outdoors.org: https://www.outdoors.org/resources/amc-outdoors/outdoor-resources/the-10-essentials-what-to-pack-for-a-backcountry-hike/

## Confirmed by Aaditya (14 Oct 2026)
- No exact locations: true for all social media too. Copy now says "on this site or on social media".
- Guides, hosts and cooks come from the villages: true for every role.
- Saying no to a damaging booking: OK to say publicly.
- Packing lists are shared after booking. Copy now says "which we share with you after you book".
- Leader carries the first aid kit and the means to make heat: true on every experience.
Only photo choices remain open.

## Staging deploy
Version 604d17ad uploaded to the staging alias only. Live is still ce1d5fa8.
