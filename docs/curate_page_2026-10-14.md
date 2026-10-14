# Curate your own experience (14 Oct 2026)

Branch: `about-redesign`. Status: **on staging** (version fe4ac114), not live.
https://staging-rockandanchor-site.adityashah-06.workers.dev/curate

## Files changed
- `src/curate.js` (new): the page, the activity list, the recommendation and example-flow logic, CSS and the browser script.
- `src/template.js`: `__CURATE__` include, `/curate` route, `/curate-your-own-experience` redirect, sitemap entry, "Curate" in the top nav (after Experiences), "Curate your own" in the footer, and slightly tighter nav spacing at 821 to 920px so eight links fit.
- `build.py`: includes `src/curate.js`.
- `scripts/test.mjs`: tests `/curate`.
- `dist/worker.js`: rebuilt.

About, Impact, Team, Values, Airtable schema and data loading are untouched.

## What it does
1. Hero: "Let’s create something that feels like yours." with "You bring the people. We bring the place, people and possibilities." and Start curating.
2. A short "how this works" card (you choose, we sketch it, we talk).
3. Eight steps, one at a time, with progress bar, numbered step dots (go back to any finished step), Back and Next:
   - Who (multi), how many (stepper), children's ages if family, children or school is picked.
   - What it should feel like (8 intentions, multi).
   - How you want to leave: Touched, Moved, Inspired (multi).
   - Time (few hours to weekend, flexible) and When (specific date, month or season, flexible).
   - What you want to do (activities, multi, with photos).
   - Local layer (7 options, multi).
   - Pace (Slow, Balanced, Active, Let Rock & Anchor decide).
   - Responsibility: the five principles and "Sounds good". Links to Values.
4. Summary: "Here’s what we’re imagining." with Who, Looking for, Leave feeling, Time, Doing, Local layer, Pace.
5. Example flow, labelled "An example of how we could shape your day" and "not a confirmed plan".
6. Up to three recommended experiences (real cards linking to the experience pages), or "We’ll build something around what you told us."
7. Cost: "Experiences like this usually start from ₹X per person. This is indicative only." only when a recommended experience has a per person price; always "We’ll work out the exact cost once we know the group and date."
8. Human handoff text and "Send this to Rock & Anchor".
9. Share: WhatsApp share to the group, Copy summary, Copy link. Change my answers, Start again.

Only Step 1 is required (who and how many). Every other step can be skipped ("Skip for now").

## Recommendation logic
Each live experience gets a score:
- +3 for each chosen activity it offers.
- Each intention maps to categories and activities (for example Look up: Stargazing, Evenings; stars, night walks, sunsets). +2 per matching category, +1 per matching activity.
- Family or children: +2 for Family & Kids. School: +2 for Schools & Camps or Family & Kids. Corporate or college: +2 for Corporate & Private Groups.
- Children's ages outside the experience's age range: −4.
- Time: short sessions favoured for a few hours or half day, day-long for a full day, overnight for one night or weekend. An overnight experience gets −8 for a few hours, half day or full day.
- Any local layer: +1 for village experiences. Local meal: +1 if it includes food.
- Monsoon experiences outside June to September: −4 (uses the chosen date or month, else today).
- Has upcoming Approved dates: +1.
The top three with a score of 4 or more are shown.

## How the enquiry reaches Rock & Anchor
The site's existing channel is WhatsApp (+91 89287 94380). "Send this to Rock & Anchor" opens WhatsApp with the full summary written out: who, size, children's ages, feelings, Touch/Move/Inspire, time, date, activities, local layer, pace, the example flow, the suggested experiences and a link that reopens the same summary. No new backend.

## Uses Airtable data
- Experiences (live, as on the rest of the site): titles, summaries, categories, photos, price lines, age, timing, upcoming Approved dates.
- Which activities appear in step 5: an activity only shows if at least one live experience mentions it in its title, summary, description or itinerary (FAQs are ignored because they mention safety and logistics).
- Guide Training is excluded.
- Photos: Website Page Photos slots `curate.hero` and `curate.act.<id>` (for example `curate.act.stars`) override the defaults.

## Static
- The question wording and options (who, ages, intentions, Touch/Move/Inspire, time, local layer, pace, responsibility principles).
- The activity names, short lines and keywords.
- The scoring weights and the example-flow templates.

## Not built in V1
Accounts, saved profiles, a database, collaborative editing or voting, drag and drop, AI, a pricing engine, and changes to Airtable.

## Limitations and assumptions
- Activity detection is keyword based. A mention in a description counts, even in passing.
- The example flow is a template filled with the choices, not a plan checked against real routes or timings.
- Choices are kept in the page link (the part after #). Very long links work but look long when pasted.
- The cost line uses the lowest per person price among the suggestions, not a quote.
- Local photos for each activity are the best guess from the experience photos; set `curate.act.<id>` slots to choose exact photos.

## Tested
Desktop (1366px) and phone (390px): every step, multi and single selection, Back and Next, jumping back by step dot, empty states (skip everything), group size 1, 8 and 250 (big group note), negative input, children's ages shown and cleared, all time options (few hours, half day, full day, one night, weekend), summary, recommendations, cost line, WhatsApp send and share links, copy summary and copy link, refresh on the summary, opening the copied link in a new tab, start again, no sideways scrolling. Nav checked at 821, 850, 880, 921, 1000, 1100 and 1366px. All other routes still return 200.
