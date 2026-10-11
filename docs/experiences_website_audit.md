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
