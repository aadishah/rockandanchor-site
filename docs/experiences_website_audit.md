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
