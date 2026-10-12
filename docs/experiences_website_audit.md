# Experiences table audit for the website (12 Oct 2026)

## Urgent: live site is frozen
Three fields the website code reads were deleted from Airtable: Description (rich text), the timing field and the starting price field. Airtable rejects any request that names a deleted field, so both live and staging stopped reading Airtable and fell back to the last saved copy. Airtable edits do not reach rockandanchor.in until the code is updated.

- Staging fixed (version ee29b2c7, commit 5be804d): title = Website Title (falls back to Name), summary = Website Summary, "When" = Experience Duration, starting price worked out from Website Price Details. If a field is deleted again, the site now fetches all fields instead of breaking.
- Live (fc565657) still frozen. Needs a push to live, with approval.

## Currently ticked Show on Website (14)
| Order | Website Title | Active Now | Upcoming dates linked | Photos | Notes |
|---|---|---|---|---|---|
| 1 | Little Feet: A Sensory Experience | No | 0 | 10 | 14 upcoming dates are linked to the hidden "Little Feet, Big Trails" record |
| 2 | Little Feet: Sunset Safari | No | 14 | 4 | Active Now unticked although dates exist; no photos link |
| 3 | Young Explorers: Winter School | No | 0 | 4 | 3 dates linked to hidden "Project Young Explorers"; Time Active is Jun to Nov but it is a winter school |
| 4 | Be a Villager | Yes | 9 | 10 | Website Location says Karjat but the record's location is Shahapur |
| 5 | Talking to the Planets (record: Rooftop Stargazing) | Yes | 25 | 10 | Slug changed from rooftop-stargazing, so old links break |
| 6 | The Greatest Show On Earth | Yes | 65 | 10 | 2 dates still Submitted |
| 7 | The Hidden Kingdom | Yes | 3 | 10 | Photos are mostly night video stills |
| 8 | Ridge & Lake: Chasing Sunsets | Yes | 0 | 10 | 17 dates linked to hidden "Project Ridge & Lake"; Time Active Jun to Nov but category Winter |
| 9 | Winter Trekking | No | 7 (2 Future, 5 Submitted) | 4 | Time Active empty |
| 20 | The Night Sky Experience | Yes | 0 | 10 | On request only |
| 21 | Floating Picnic | Yes | 0 | 10 | Category includes Monsoon but Time Active is Oct to Mar |
| 22 | Project: Mini Splash | Yes | 0 | 10 | Monsoon experience, season ending |
| 23 | Monsoon Village Experience | Yes | 0 | 9 | Monsoon over; Time Active ends Oct |
| 24 | Monsoon Village Experience (1 Day) | No | 0 | 9 | Inactive and out of season |

## Content flags
- FAQs for the Karjat experiences say "20 minutes from Oleander Farms". That points to an exact spot, which goes against the no exact locations rule.
- No experience has reviews linked (Reviews for Website is empty everywhere).
- "Experience Name" is now a formula that adds the nearby landmark (Karjat, Shahapur, Asangaon). The website does not use it.

## Active but hidden (not on the website)
Project Splash, Intro to Rock Climbing, Summer Infinity Pool, Custom Birthday Experiences, Dadima's Peak, Watchtower Trek, Custom Stargazing at Customer Site, Astrophotography Workshops, Greatest Show On Earth (Summer), Windy Plateau Trek, Enchanted Forest, Mountain Village Trek, Sunset Via Monkey, Corporate Team Building. None of them has a slug, Website Summary, photos, itinerary, FAQs or prices, so they cannot be shown yet.


## Changes made on 12 Oct 2026 (after user review)
User notes: Oleander Farms reference is fine (it is a resort, 20 mins away). Be a Villager one day is in Karjat, overnight is in Shahapur. Rooftop link change is fine. Reviews are fine for now.

### Website (the 11 to show)
- Moved 34 upcoming dates from old hidden records to the shown ones: Little Feet Big Trails to Little Feet: Sensory Expedition (14), Project Ridge & Lake to Ridge & Lake: Chasing Sunsets (17), Project Young Explorers to Young Explorers Winter School (3). Past dates left on the old records.
- Ticked Active Now: Little Feet Sensory, Little Feet Sunset Safari, Young Explorers, Winter Trekking.
- Time Active: Young Explorers set to Nov, Dec, Jan (its dates); Winter Trekking set to Nov, Dec, Jan, Feb.
- Floating Picnic: removed the Monsoon category.
- Unticked Show on Website: Monsoon Village Camping, Monsoon Village (1 Day), Project Mini Splash.
- Still open: Winter Trekking has 5 dates in Submitted status (not shown until approved). Sunset Safari has 4 photos and no album.

### Hidden experiences filled from their Pricing, Itinerary and Inclusions PDF
Filled Website Title, Slug, Order (30 to 36), Summary, Website Description, Itinerary, FAQs, Price Details, Location, and Age where the source gave one. Show on Website left unticked. No photos added yet.
- Project Splash (Google Doc), Dadima's Peak (Google Doc), Enchanted Forest (Google Doc), Watchtower Trek (Canva), Windy Plateau Trek (Canva), Mountain Village Trek (Canva), The Greatest Show On Earth: Summer (Canva).
- No PDF link, so not filled: Intro to Rock Climbing, Summer Infinity Pool, Custom Birthday Experiences, Custom Stargazing at Customer Site, Astrophotography Workshops, Sunset Via Monkey, Corporate Team Building.

### Previous Website Description text (replaced), kept here in case you want it back
### Project Splash
Project Splash steps up the excitement for those ready to dive deeper into water-based adventure. Participants navigate river stretches and water trails through a series of progressively engaging activities set against stunning natural backdrops. Trained guides lead the group safely while sharing knowledge about riparian ecosystems and local geography. A thrilling yet informative experience that balances action, awareness, and a genuine love for the outdoors.

### Dadima's Peak
A scenic trek through forest trails leading to a hidden natural spot. Expect water crossings, greenery, and a raw, non-touristy experience.

### Watchtower trek
The Watchtower Trek is a purposeful hike to a historic vantage point offering commanding views of the surrounding region. The ascent follows well-guided trails through diverse terrain, with stops highlighting points of ecological and historical interest. Upon reaching the watchtower, participants gain a perspective on the landscape that few get to experience. A journey that blends physical effort with cultural discovery, suitable for all ages with a moderate level of fitness.

### The Greatest Show On Earth (Summer)
A slow, guided night under the stars. Learn to spot constellations, understand basic astronomy, and just sit back and experience the sky away from city lights. Includes storytelling, sky navigation, and quiet reflection time.

### Windy Plateau Trek
Discover stunning hidden waterfalls, offering a tranquil escape and perfect photo spots. Feel the mist and cool spray as you marvel at nature’s wonders.

### Enchanted Forest Experience
The Old Way Through the Sahyadris Step away from the crowded forts and popular trekking routes and walk through one of the quieter corners of the Sahyadris. The enchanted forest is an old mountain route connecting the Konkan to the highlands. The trail takes you through village fields, forest, streams and a beautiful ghat climb before opening up onto the plateau, with wide views across the surrounding mountains. This is a day to walk slowly, notice more and understand the landscape you’re walking through

### Mountain Village Trek
Imagine a serene monsoon trail through a historic mountain village.
This easy, gradual trek is perfect for all ages and families. Along
the way, you'll encounter lush green landscapes, cascading
waterfalls, and panoramic valley views. Experience the cultural and
ecological treasures of the region.

## Photos rematched to the text (12 Oct 2026)
Source: past event albums in the Events table (Photo Album (Post Trip)).
- The Greatest Show On Earth: kept Milky Way, telescope and stargazing shots; added lake dip with floats (2), sunset over the hills, dinner at the host home, campfire, campsite tents and the bird watching trail. Albums: Nov 2025 and Dec 2025 stargazing events.
- Ridge & Lake: Chasing Sunsets: 10 new from the Dec 2025 ridge treks (sunset over the lake, ridge walk, trail, group). No dinner or stargazing photos exist in those albums.
- Little Feet: Sensory: removed 2 video stills, an older-kids group shot and a slip on rock; added toddler and parent trail shots and flower close ups from the Little Feet events. No craft or printing photos exist yet.
- The Hidden Kingdom: now 2 photos and 8 real videos (night herping walk, torchlight finds, morning waterfall) instead of video stills.
- Be a Villager: 5 video stills replaced with the real videos (farmer, cattle, grinding, pounding, the group).
- Young Explorers: added 2 photos and 3 videos from the Aug 2026 school group trek.
- The Night Sky Experience: removed a camping photo, a handpump photo and a city rooftop photo (not part of this experience). Now 7.
- Unchanged, already matched: Talking to the Planets, Floating Picnic, Winter Trekking, Little Feet: Sunset Safari (no past albums).

## Video support (staging only, commit 12d56d4, version 2c19ec23)
Website Photos can now hold videos. The gallery plays them muted in the tiles (small play mark) and with controls in the slideshow. Cards and the home page still use photos only. To add a video from Google Photos, use the album item's base URL with =dv.

## Page photos: Home, About Us, Impact Created, Team (12 Oct 2026)
Problem: these pages picked "photo number N" from an experience's Website Photos. When an experience's photos changed, was hidden or renamed, the spot showed an unrelated or random photo. Wide boxes also cropped tall photos through people's heads.

Fix (staging version 831091af, live untouched):
- New Airtable table **Website Page Photos**, one row per photo spot (27 rows). Fields: Slot (code key, do not rename), Page, Text beside the photo, Photo, Alt text, Focus, Order.
- To change a photo, drop a new image in the Photo field of that row. The site updates within about 5 minutes.
- Focus decides which part of the photo stays visible when it is cropped: Center, Top, Upper, Lower, Bottom, Left, Right. Use Top or Upper when heads are cut, Lower or Bottom when feet or faces at the bottom are cut.
- If a row's Photo is empty, the page falls back to the old experience photo.
- Every spot was matched to its text and checked on staging. Focus adjusted on: Hidden places (Upper), problem 01 (Top), problem 02 (Upper), Educate (Top), Empower (Upper), Origin (Lower), Impact hero (Lower), Inspire, Earth, Team hero (Upper).

## Pushed to live (12 Oct 2026, 02:15 IST)
With approval, production now runs version 831091af (previously fc565657). This brings to rockandanchor.in: the deleted-fields fix (the site reads Airtable again instead of the frozen copy), video playback in experience galleries, and the Website Page Photos spots. Checked on rockandanchor.in: Home, About Us, Impact Created, Team and an experience page all load (200), photo spots and videos present, no staging banners. To roll back, deploy fc565657 at 100% from the Cloudflare dashboard.

## Speed fixes (12 Oct 2026, built, not yet uploaded)
Measured on 12 Oct: a cold page load waited 8.6 s for Airtable every time the 5 minute saved copy expired; Hidden Kingdom gallery tiles autoplayed full videos (82 MB, 40 MB, 7 MB); About Us loaded 13.5 MB of full-size photos.
Changes in code (commit below, file worker-staging21.js in website-2026):
- Data: the saved copy is served instantly; when older than 5 minutes it refreshes in the background. Visitors only wait if the copy is over 1 hour old. All Airtable tables now load at the same time instead of in three rounds (tested: cold load 1 round, stale load 3 ms).
- Gallery videos: no autoplay. Tiles show the first frame; the video downloads only when opened.
- Page photos: cards and tiles use Airtable's 512 px version; only banners (hero, earth, end) use the full size. Earth image now loads lazily.
Status: on staging as version 3a684ac8 (staging26). Live still 831091af until approved.

### Found while testing
- The real cause of the 8 second wait was the Events table: the date filter named a field "Start" that no longer exists under that name, so Airtable rejected it and the site downloaded every event ever, with all fields (8.1 s). The site now asks for events newest first by field ID and stops at 2 days ago: 2.4 s, same 150 dates, and renaming a field can no longer break it.
- Impact Created project cards loaded original photos (9.8 MB and 10.9 MB). Now 512 px versions: page went from 21.8 MB to 2.5 MB.
- Gallery video tiles: browsers could not show a first frame from these large iPhone videos, so tiles are now a dark card with a play button. Nothing downloads until someone taps.
- Most gallery videos are iPhone .mov files of 5 to 82 MB (Hidden Kingdom: 82, 53, 40, 30 MB). Even when tapped they take a long time to start on mobile data. Recommended: re-export as compressed MP4 (720p, under about 10 MB) before adding to Website Photos.
- Staging only: /__timing shows how long each Airtable table took on the last refresh.

### Measured on staging after the fixes
| Page | Before | After |
|---|---|---|
| Wait for data (cold) | 8.6 s every 5 min | never for visitors; background refresh 2.4 s |
| About Us photos | 13.5 MB | 4.9 MB |
| Impact Created photos | 21.8 MB | 2.5 MB |
| Hidden Kingdom gallery | 129 MB of autoplay video | 0 MB until tapped |

## Heading line breaks (12 Oct 2026, staging29 e30d04db)
Problem: short headings broke onto two lines although there was room (Terms and / Conditions), or left one word alone on the last line (Who will you / meet?, Started it. Still learning how to build / it.).
Fix, checked by eye on Home, About Us, Impact Created, Team, Terms and Cancellation at desktop width:
- All headings use balanced wrapping: when a heading needs two lines, the lines come out even, never one word alone.
- Section heading width caps raised (About, Impact, Team section headings 30ch; Team banner 16ch; Team and Impact closing headings 20ch), so short headings sit on one line.
- Policy page titles 64 px max so Terms and Conditions and Cancellation and Refunds fit on one line.
- Team card names 30 px so Prasad Sambare fits on one line.
Kept as they were because they read well: the Home banner (Come outside. / Find something real.), the About banner, the Earth 2.0 line, Get outside. Come back changed., and the heading beside the three circles diagram.

## Pushed to live (12 Oct 2026, 17:50 IST)
With approval, production now runs version 88b61b20 (staging32), previously 831091af. Live now has: speed fixes (background data refresh, events read by field ID, video play tiles, smaller photos), general Terms and Conditions, balanced headings, "Free for villagers" price lines and the per experience contact number (Guide Training uses 9167954430). Checked on rockandanchor.in: 9 main pages return 200 in about 0.2 s, new terms showing, no autoplaying videos, Guide Training shows the personal number and Free for villagers, no staging banners, /__timing returns 404 on live. Rollback: deploy 831091af at 100% in Cloudflare.

## 25% figure removed (12 Oct 2026, staging34)
The share of profit supports more than schools, so the site no longer gives a number. Changes:
- About Us, Educate card: "A share of every booking goes back into the mountain villages we work in, including their schools."
- About Us, "This is why we support village schools": same idea.
- Impact Created stat card: "Every booking / Gives back to the villages we work in: their schools and community projects".
- Impact Created, Follow the money step 05: "A share goes back to the villages".
- Impact modals: "What your bookings have funded" and "A share of every booking goes back into the mountain villages we work in: their schools, community projects and local livelihoods."
Not changed: the 25% rescheduling fee and cancellation retention figures in the Cancellation and Refunds policy (those are fees, not the profit share).

### Final wording chosen by Aaditya (staging35, ffe25379)
"Every experience funds the next school or solar panel." Local guides are left out on purpose: paying the team is a given, not a give-back.
- About Us, Educate card and village schools tile: "Every experience funds the next school or solar panel in the (mountain) villages we work in."
- Impact stat card: "Every experience / Funds the next school or solar panel in the villages we work in".
- Follow the money step 05: "Funding the next school or solar panel".
- Impact pop-ups: "What your experiences have funded" and "Every experience funds the next school or solar panel in the mountain villages we work in."
