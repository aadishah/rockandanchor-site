// Rock & Anchor website. A single Cloudflare Worker that reads Airtable.
// Edit content in Airtable (base Rock&Anchor). Pages refresh within about 5 minutes.
// Secret needed: AIRTABLE_TOKEN (read only). Without it the site shows a built-in snapshot.

const BASE = 'app0sjg0lmpX4ERo1';
const T = { exp: 'tblG7E0qqHtLi6FWF', ev: 'tblnbaixvh6vsXuj2', rev: 'tblj3xNFQV7dKuine', imp: 'tblpfX3SNtM7qTNNf', team: 'tblBOYVbIlfeBRg4w' };
const EF = {
  show: 'fldPkhXdD91l3gZ8Y', title: 'fldM3NSq47YsF9tR2', slug: 'fld4JwhapQZdKtBcA', order: 'fld0ZNPcdfO412lmd',
  summary: 'fldQm3jgyBV5X1nzK', description: 'fldylkcJyzF9uK0Xi', photos: 'fldiamuh0iIFn0Fjs', itinerary: 'fldePmvVNr0Plgo4D',
  faqs: 'fld89jnU68Zl9q6nM', prices: 'fldLEraHeNPgjjG8T', age: 'fldF1U1n4ks9FSFtP', location: 'fld2m8zyHAoKGlZEi',
  timing: 'fldlwqH0kyOcnhSm3', categories: 'fldIyJ28XTWNtfRm3', fromPrice: 'fldiOgiemRJAEgWdP', datesAhead: 'fld99ABUSbxPmP0v7',
};
const VF = { start: 'fldWr96uilLEjfI24', end: 'fldLWXxoeM3Xr7Qkd', exp: 'fldTwb0rZY39trwD4', status: 'fldEueCyQC6zJEEux', hide: 'fldYwt0HrpvixX8gg' };
const RF = { name: 'fldIgYRm1oIN51m2Z', text: 'fldoiPyv0cAhFNMtJ', exp: 'fldCKUcXdn2vivo5h', show: 'fldwAqYVwcDDwqxLf' };
const TF = { name: 'fldOCEREnRFIAh8zc', role: 'fldgPjOaXv7pTdwmD', group: 'fldfnCycPmtEiabk9', bio: 'fldKNHwt0dVNiP8td', photo: 'fldx0IblfxhE0GYqL', order: 'fldH11Xe1zRMSZjm6', show: 'fldEH77VIUX1fdM6c' };
const TEAM_GROUPS = ['Founders', 'Experience Leaders', 'Business Development', 'Social Media'];
const IF = { metric: 'fldX1aQLHwAWY4A0C', value: 'fldcFhyLkZhdUiyF2', order: 'fldWCIzvRPTsj0hQW', show: 'fldMKHdAIyLWJJsKQ' };
const LIVE_STATUSES = ['Approved', 'Ready', 'Future'];
const CACHE_SECONDS = 300;

const SITE = {
  name: 'Rock & Anchor',
  url: 'https://rockandanchor.in',
  phone: '+91 89287 94380',
  tel: '+918928794380',
  wa: '918928794380',
  email: 'hello@rockandanchor.in',
  insta: '_rockandanchor',
  heroSlug: 'ridge-and-lake',
};

const SNAPSHOT = {"experiences":[{"id":"rec2ZtYTJkhhBie5P","title":"Rooftop Stargazing","slug":"rooftop-stargazing","order":5,"summary":"Stargazing right here in Mumbai. Look at the Moon, planets and stars through a telescope with a Rock & Anchor guide, from a city rooftop.","description":"## What you'll see\n- The Moon\n- Planets\n- Stars and constellations\n\n## Private experiences\nAlso available for birthdays, schools, corporates, events and residential societies.","itinerary":null,"faqs":null,"prices":"Price on request. Call or WhatsApp us.","age":"Ages 6+","location":"Mumbai","timing":"Evening","categories":["Stargazing","Family & Kids","Private & Groups"],"fromPrice":700,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-4.jpg"}]},{"id":"rec7yorjjv9g6gILU","title":"Project: Mini Splash","slug":"project-mini-splash","order":22,"summary":"A mindful monsoon escape for adults and teens: trek past streams to hidden waterfalls, sip tea at a village home and take a dip in a lake.","description":null,"itinerary":"7:30 am | Arrive at the base village, welcome circle, breakfast\n8:00 am | Start the trek, waterfall halts\n9:30 am | Main waterfall\n10:00 am | On to the lake: skipping stones, floating and dupki\n11:00 am | Tea at a village home\n11:15 am | Trail back to the base village\n1:00 pm | Village lunch (optional)\n1:30 pm | Leave for home","faqs":"How big is the group?\n15 to 20 people.\n\nWhat is the terrain like?\nForest paths, soft mud, rock, mild to medium slopes.\n\nWhat if it rains?\nWe only reschedule for thunderstorms.","prices":"Per person | ₹2,000\nFestive offer, child (8+) | ₹1,800\nFestive offer, adult | ₹1,600\nIncludes guided trek, waterfall experience, breakfast, first aid, changing room, 4K photos and videos, all permits.","age":"Ages 13+","location":"1.5 hrs from Dadar","timing":"7:30 am to 1:30 pm","categories":["Treks","Monsoon"],"fromPrice":2000,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-4.jpg"}]},{"id":"rec8Qu6E2UZeocjE7","title":"Be a Villager","slug":"be-a-villager","order":4,"summary":"A hands-on day in village life. Plant with farmers, help with village work, cook a local meal, eat what you helped make, and explore how a village really works.","description":"## Live, work, eat, explore\n- Meet a local family\n- Learn farming\n- Help with village activities\n- Cook and eat local\n- Explore the village\n\n## Private experiences\nAvailable for birthdays, schools, corporates and events.","itinerary":null,"faqs":null,"prices":"Price on request. Call or WhatsApp us.","age":"Ages 6+","location":"Karjat, within 1.5 hrs of Dadar","timing":"Day experience","categories":["Village Life","Family & Kids"],"fromPrice":3000,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-4.jpg"}]},{"id":"recCERBptmvu3WC5B","title":"Winter Trekking","slug":"winter-trekking","order":9,"summary":"Moderate winter treks across the Sahyadris: Dadima's Peak, the Enchanted Forest, Ridge & Lake, 1500 m peaks and more.","description":"## Trails this winter\n- Dadima's Peak\n- Enchanted Forest\n- Ridge & Lake\n- 1500 m peaks and more\n\n## Why go?\n- Build confidence in the outdoors\n- Develop curiosity and appreciation for nature\n- Spend time with like-minded peers","itinerary":null,"faqs":null,"prices":"Price on request. Call or WhatsApp us.","age":"Ages 10+","location":"Sahyadris, up to 3 hrs from Dadar","timing":"Day treks","categories":["Treks"],"fromPrice":null,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-4.jpg"}]},{"id":"recGe4O48b5CHf426","title":"Floating Picnic","slug":"floating-picnic","order":21,"summary":"A morning for families and friends: a short trek to a lakeside picnic, floating, a dupki and games, on a quiet, lush trail.","description":null,"itinerary":"8:00 am | Arrive at the base village, welcome circle\n8:30 am | Start the trek, with learning halts\n9:00 am | Picnic area: snacks, team games, skipping stones, floating and dupki\n11:30 am | Walk back up\n12:15 pm | Freshen up, optional lunch\n1:00 pm | Leave for home","faqs":"How big is the group?\n15 to 20 people.\n\nWhat is the terrain like?\nForest paths, soft mud, rock, mild to medium slopes.\n\nWhat if it rains?\nDrizzles are fun! We only reschedule for thunderstorms.","prices":"Adult | ₹1,800\nChild (2 to 9) | ₹1,500\nVillage lunch (optional) | ₹300\nIncludes guided trek, breakfast and picnic snacks, first aid, changing room, 4K photos and videos, all permits.","age":"Ages 2+","location":"1.5 hrs from Dadar","timing":"8:00 am to 1:00 pm","categories":["Family & Kids","Monsoon"],"fromPrice":1800,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-4.jpg"}]},{"id":"recSXQ2tQxqLEpN0C","title":"Little Feet: A Sensory Experience","slug":"little-feet-sensory","order":1,"summary":"A nature morning for toddlers and their parents in the Sahyadris. Let them discover nature at their own pace, using their hands, eyes, ears and curiosity.","description":"## What they'll do\n- Nature walk and sensory trail\n- Planting\n- Stone painting\n- Flower and vegetable printing\n- Colour hunts\n\n## Why it works for little ones\nChildren between 1 and 6 learn best through play. We balance safety, structure and freedom so every child feels both secure and adventurous.\n- Supervised freedom: kids explore with guides and parents nearby. Real adventure for them, peace of mind for you.\n- Directed play: songs, nature crafts and sensory trails introduce new skills.\n- Undirected play: time to wander, imagine and invent their own games.\n\n## For parents\nYou join the games and activities. Our guides handle structure and safety so you can focus on playful time together.","itinerary":"8:00 am | Arrive at the base village, welcome circle, breakfast\n8:30 am | Nature walk and sensory trail\n9:15 am | Nature crafts with leaves, twigs and natural materials\n10:15 am | Snack and free play\n10:45 am | Nature printing\n11:45 am | Tiny Explorer Challenge\n12:15 pm | Goodbye circle and departure","faqs":"Where is it?\n20 minutes from Oleander Farms, Karjat. Exact location shared on booking.\n\nIs this a trek?\nNo. It is a gentle outdoor walk with activities. Think forest play, not mountain climbing.\n\nAre there toilets?\nYes, Indian and Western toilets at the Rock & Anchor base village.\n\nCan we book a private group?\nYes, for groups of 15 or more we customise the experience and pricing.\n\nWhat if the weather is bad?\nDrizzles are fun! We only reschedule for heavy rain or heat wave forecasts.","prices":"Per person | ₹1,800\nFestive offer, child | ₹1,700\nFestive offer, adult | ₹1,500\nFarm to table lunch (optional) | ₹300 adult, ₹150 child under 10\nIncludes breakfast, local naturalist, nature craft session, first aid support, all permissions and parking.","age":"Ages 1 to 6, with a parent","location":"Karjat, within 1.5 hrs of Dadar","timing":"8:00 am to 12:15 pm","categories":["Family & Kids"],"fromPrice":1800,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-4.jpg"}]},{"id":"recU4Q0ZgIELxs0uE","title":"Monsoon Village Experience (1 Day)","slug":"monsoon-village-1-day","order":24,"summary":"A full monsoon day in a mountain village: waterfalls, paddy farming, river floating and home-cooked Maharashtrian food, with an AC bus from Dadar if you want it.","description":null,"itinerary":"6:00 am | Meet at Dadar for the AC bus, or come in your own vehicle\n9:00 am | Arrival and Maharashtrian welcome\n9:30 am | Breakfast: poha, chai, coffee\n10:00 am | Waterfall morning\n1:00 pm | Traditional Maharashtrian lunch\n2:00 pm | Paddy farming\n4:00 pm | River floating with tubes\n5:30 pm | Snacks by the river\n7:00 pm | Leave the village\n10:00 pm | Back in Mumbai","faqs":null,"prices":"With travel from Dadar | ₹2,500\nWithout travel | ₹2,000\nGroups of 15 or more get 10% off.","age":"Ages 6 to 65","location":"2.5 hrs from Dadar","timing":"6:00 am to 10:00 pm","categories":["Village Life","Monsoon"],"fromPrice":null,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-4.jpg"}]},{"id":"recUBPYOfeFiGrBBV","title":"Monsoon Village Experience","slug":"monsoon-village-experience","order":23,"summary":"Life in a mountain village during the monsoon: waterfalls, a lazy river, rice cultivation, a campfire with chocolate fondue, and a night in a villager's home or a tent.","description":"## Stay options\n- Villager's home: for families or friends groups of 5 to 10. The whole home is yours, with bedding, pillows and blankets.\n- Tent stay: sleeping pads, sleeping bags and pillows provided.\n\n## Add on experiences (for groups of 10+)\n- Coffee making and tasting with a Blue Tokai expert\n- Herping night walk with a naturalist\n- Bird watching walk with a zoologist\n- Trek to Sita Ma's cave near Valmiki's ashram","itinerary":"## Day 1\n2:00 pm | Traditional Maharashtrian welcome\n2:30 pm | Lake dip with floats and waterfall visit\n6:00 pm | Snacks\n7:00 pm | Teach and play with village children\n8:00 pm | Traditional Maharashtrian dinner\n9:00 pm | Chocolate fondue and s'mores\n10:00 pm | Learn to set up tents\n## Day 2\n6:30 am | Bird watching trek to a waterfall\n9:15 am | Breakfast at the waterfall (weather permitting)\n10:30 am | Rice life cycle workshop\n12:00 pm | Traditional Maharashtrian lunch\n1:00 pm | Group photo and farewell","faqs":"How big is the group?\n10 to 12 people.\n\nWhat are the timings?\nArrive by 2 pm on Day 1, leave after lunch around 1 pm on Day 2.\n\nCan we stay longer?\nYes, extra nights can be arranged on request.\n\nHow do I get there?\nOptional transport: ₹500 per person between Asangaon station and the campsite, both ways.","prices":"Tent stay, adult | ₹2,300\nTent stay, child (2 to 9) | ₹1,800\nVillage home stay, adult | ₹3,000\nVillage home stay, child (2 to 9) | ₹2,500\nTransport from Asangaon (optional) | ₹500\nPrices exclude travel from Mumbai.","age":"Ages 6 to 65","location":"2.5 hrs from Dadar","timing":"2 days / 1 night","categories":["Village Life","Monsoon"],"fromPrice":2500,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-4.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-1.jpg"}]},{"id":"recW9JKhVGqNh0LLS","title":"Little Feet: Sunset Safari","slug":"little-feet-sunset-safari","order":2,"summary":"An evening on the farm for children and their parents: a nature safari, tree planting, games, sunset, and a first look at the night sky through a telescope.","description":"## Highlights\n- Nature exploration\n- Paint a pot and plant a sapling to take home\n- Games and free play\n- Sunset on the farm\n- Telescope viewing\n\n## Why go?\nGive children their first taste of exploring nature as an adventure, followed by their first look at the night sky.","itinerary":"4:00 pm | Arrive at the base village, welcome circle\n4:30 pm | Little nature safari: textures, butterflies and colours\n5:00 pm | Farm time and tree planting\n6:00 pm | Free play and snacks\n6:30 pm | Sunset on the farm\n7:00 pm | Stargazing\n7:45 pm | Local dinner (optional)\n8:15 pm | Goodbye circle and departure","faqs":"Where is it?\n20 minutes from Oleander Farms, Karjat. Exact location shared on booking.\n\nIs this a trek?\nNo. It is a gentle outdoor walk with activities.\n\nCan we book a private group?\nYes, for groups of 15 or more we customise the experience and pricing.","prices":"Per person | ₹1,800\nFestive offer, child | ₹1,700\nFestive offer, adult | ₹1,500\nIncludes snacks, local naturalist, nature craft session, a clay pot and plant to take home, first aid support, all permissions and parking.","age":"Ages 4 to 12, with a parent","location":"Karjat, within 1.5 hrs of Dadar","timing":"4:00 pm to 8:15 pm","categories":["Family & Kids","Stargazing"],"fromPrice":1500,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-4.jpg"}]},{"id":"recZX0tQG7JhPJHX2","title":"The Hidden Kingdom","slug":"hidden-kingdom","order":7,"summary":"Most people only experience half the forest. Search for nocturnal wildlife with expert herpers Nigel Anchan and Daimler Pereira, then turn your eyes from the forest floor to the stars.","description":"## Highlights\n- Guided herping night walk\n- Basics of wildlife photography\n- Stargazing with a telescope\n- Camping, midnight Maggi and chai\n- Hidden waterfall in the morning\n\n## Meet the guides\nNigel Anchan is a wildlife conservationist, macro photographer and herper who has documented reptiles and amphibians across India's biodiversity hotspots. Daimler Pereira is a naturalist, wildlife photographer and herping specialist known for his work in the Western Ghats. Every encounter is safe, ethical and respectful of the animals.","itinerary":"## Day 1\n6:00 pm | Arrive at base camp, meet your guides, welcome drink\n7:00 pm | Traditional Maharashtrian dinner\nAfter dark | The Hidden Kingdom night walk: snakes, frogs, geckos, spiders and more\n1:00 am | Return to base camp\n1:30 am | Midnight Maggi and chai, sleep in tents\n## Day 2\n10:00 am | Village breakfast\n10:30 am | Hidden waterfall experience","faqs":"Is it safe?\nYes. Your guides are experienced herpers and First Aid certified. We keep a safe distance and never handle animals.\n\nWill we definitely see snakes?\nSightings are never guaranteed, but we regularly see frogs, geckos, spiders, insects, scorpions and reptiles.\n\nWhat should I bring?\nFull-length pants, full sleeves, closed shoes, a headlamp or torch, a rain jacket, a water bottle and personal medication.\n\nIs there a plastic rule?\nYes. Zero plastic and glass. A reusable bottle is compulsory and any plastic you bring goes back with you.\n\nNeed transport?\n₹500 per person from Asangaon station. Arrive by 5:00 pm.","prices":"Per person | ₹3,000\nTravel from Asangaon station (optional) | ₹500\nIncludes guided herping, tent camping, dinner, midnight Maggi and chai, breakfast, HD photos and videos, waterfall visit, first aid certified leader, all permits.","age":"Ages 15+ (15 to 18 with a guardian)","location":"45 mins from Shahapur, 2.5 hrs from Dadar","timing":"Overnight, 6 pm to 11 am","categories":["Wildlife","Stargazing"],"fromPrice":3000,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-4.jpg"}]},{"id":"receVObty2OP5RqpK","title":"The Greatest Show On Earth","slug":"greatest-show-on-earth","order":6,"summary":"What if for one night you could disappear from the city? A lake dip, a traditional Maharashtrian dinner, a professional astronomer and telescope, chocolate fondue and a night under the stars.","description":"## Highlights\n- Lake dip with floats\n- Camping under the stars\n- Campfire and chocolate fondue\n- Bird watching trail\n- Professional telescope and astronomer\n\n## The hosts\nThe Deshmukh family have lived in this village for generations. Their warmth, hospitality and deep connection to the land make the stay comfortable, safe and authentic.\n\n## Facilities\n- Home: the family home, where you enjoy snacks, dinner and breakfast, with clean Western and Indian bathrooms.\n- Campsite: a scenic site 300 metres from the home, perfect for stargazing.","itinerary":"## Day 1\n4:00 pm | Arrival and welcome\n4:30 pm | Lake dip with floats. Sunset around 6:30 pm\n7:00 pm | Introduction to the night sky, snacks\n8:00 pm | Traditional Maharashtrian dinner\n9:30 pm | Stargazing with the astronomer\n11:00 pm | Learn to set up a campsite\n12:00 am | Chocolate fondue and s'mores\n1:00 am onwards | Maggi or soup and chai, light photography, sleep under the stars\n## Day 2\n7:00 am | Bird watching short trek (optional)\n8:30 am | Breakfast\n9:00 am | Rice life cycle workshop\n10:30 am | Group photo and goodbyes","faqs":"How far is it from Mumbai?\nAbout 45 minutes from Shahapur and 2.5 hours from Dadar. Exact location shared on booking.\n\nWhat are the timings?\nArrive at 4:00 pm on Day 1 and leave by 11:00 am on Day 2.\n\nHow big is the group?\n20 to 25 adventurers. Private groups can be fully customised.\n\nAre there proper toilets?\nYes, Western and Indian style bathrooms at the village home.\n\nHow do I get there?\nMost guests drive; there is plenty of parking. Public transport runs from Asangaon station.\n\nIs the lake dip safe?\nYes. Swimming is optional, floats are provided for non-swimmers, and we stay in a designated safe area.\n\nWhat food is served?\nFresh, home-cooked Maharashtrian vegetarian meals. Jain and vegan on request.\n\nIs there a group discount?\n10+ adults 5% off, 20+ people 8% off, 30+ people 10% off. Discounts cannot be stacked.","prices":"Adult | ₹3,000\nChild (11 to 15) | ₹2,700\nChild (4 to 10) | ₹2,000\nIncludes certified guides, professional astronomer and telescope, floats, chocolate fondue, small group, first aid, HD photos and videos, bird watching trek, all permits and fees.\nExcludes travel from Mumbai to the campsite and back.","age":"Ages 3 to 65 (3 to 10 with a guardian)","location":"45 mins from Shahapur, 2.5 hrs from Dadar","timing":"2 days / 1 night","categories":["Stargazing","Village Life","Family & Kids"],"fromPrice":3000,"datesAhead":60,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-3.jpg"}]},{"id":"recjOD7ru8rr5MUtF","title":"Ridge & Lake: Chasing Sunsets","slug":"ridge-and-lake","order":8,"summary":"An evening trek to watch the sun set over the Sahyadris, followed by a traditional, locally grown dinner and an introduction to stargazing.","description":"## The evening\n- Sunset trek along the ridge\n- Traditional, locally grown dinner\n- Introduction to stargazing","itinerary":null,"faqs":null,"prices":"Price on request. Call or WhatsApp us.","age":"Ages 10+","location":"Karjat","timing":"4:00 pm to 9:00 pm","categories":["Treks","Stargazing"],"fromPrice":1800,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/ridge-and-lake-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/ridge-and-lake-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/ridge-and-lake-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/ridge-and-lake-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/ridge-and-lake-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/ridge-and-lake-4.jpg"}]},{"id":"recm8esl6OoEUzVBj","title":"Talking to the Planets","slug":"talking-to-the-planets","order":25,"summary":"A stargazing session brought to your venue: discussion, telescopes and the night sky. Ideal for residential societies, birthdays, corporate gatherings and events.","description":"## The session\n- Earth's place in the universe\n- Constellations and how the sky changes through the year\n- How telescopes work\n- Viewing the Moon, planets and bright stars\n- Why dark skies matter\n- The life of stars\n- Q&A","itinerary":null,"faqs":null,"prices":"Up to 20 people | ₹20,000\nUp to 30 people | ₹28,000\nUp to 40 people | ₹36,000\nUp to 50 people | ₹44,000\nEarly bird: ₹1,000 off if you confirm 2 weeks ahead.\nCancellation: 75% refund 14+ days before, 50% between 7 and 14 days, none within 7 days.","age":null,"location":"At your venue","timing":"Evening session","categories":["Stargazing","Private & Groups"],"fromPrice":20000,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-4.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/talking-to-the-planets-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/talking-to-the-planets-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-1.jpg"}]},{"id":"recotNF3taNVJQHvz","title":"Young Explorers: Winter School","slug":"young-explorers-winter-school","order":3,"summary":"A 2 day, 1 night winter school in the Sahyadris. Children make decisions, solve problems, learn practical outdoor skills and discover what they are capable of.","description":"## What children explore\n- Nature and wildlife\n- Navigation\n- Astronomy\n- Village life and farming\n- Survival basics\n- Leave No Trace\n\nOnly three Winter Schools this season.","itinerary":null,"faqs":null,"prices":"Price on request. Call or WhatsApp us.","age":null,"location":"Sahyadris","timing":"2 days / 1 night","categories":["Family & Kids","Treks"],"fromPrice":1500,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-4.jpg"}]},{"id":"recs1bI9IlvrAb5Cu","title":"The Night Sky Experience","slug":"night-sky-experience","order":20,"summary":"Sunset. Dinner. Stories. The Universe. An evening where families slow down, watch the sunset, learn about the night sky and look at the Moon, planets and stars through a telescope.","description":"## We'll talk about\n- The Solar System: the Sun, planets, moons, asteroids and comets\n- The Moon: why it changes shape and what we can see on it\n- Stars: what they are and how far away they really are\n- Constellations: how people have joined the stars for thousands of years\n- Light pollution: why city lights hide the night sky","itinerary":"5:30 pm | Arrival, welcome and snacks\n6:00 pm | Sunset trail with a local naturalist\nAt sunset | Introduction to the night sky, laser sky tour, telescope observation\n8:30 pm | Dinner (optional), more than half organic and locally grown","faqs":"Where is it?\nAbout 20 minutes from Oleander Farms and 1.5 hours from Dadar. Exact location shared on booking.\n\nHow big is the group?\n15 to 20 people. Private groups can be fully customised.\n\nHow do I get there?\nPlenty of parking. Public transport from Karjat station.\n\nIs there a group discount?\n10+ adults 5% off, 20+ people 8% off, 30+ people 10% off. Not stackable.","prices":"Adult | ₹1,600\nChild (4 to 6) | ₹1,000\nOrganic Maharashtrian dinner (optional) | ₹300 adult, ₹200 child\nIncludes certified guides, professional astronomer and telescope, snacks and welcome drink, HD photos and videos, sunset trail, first aid, all permits.","age":"Ages 3 to 65 (3 to 10 with a guardian)","location":"Karjat, 1.5 hrs from Dadar","timing":"5:30 pm to 9:00 pm","categories":["Stargazing","Family & Kids"],"fromPrice":1600,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-1.jpg"}]}],"events":[{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-10T03:30:00.000Z","end":"2026-10-10T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-10T10:30:00.000Z","end":"2026-10-10T14:45:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-11T03:30:00.000Z","end":"2026-10-11T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-11T10:30:00.000Z","end":"2026-10-11T14:45:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-15T13:30:00.000Z","end":"2026-10-15T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-10-16T11:30:00.000Z","end":"2026-10-17T05:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-16T13:30:00.000Z","end":"2026-10-16T15:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-17T03:30:00.000Z","end":"2026-10-17T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-17T10:30:00.000Z","end":"2026-10-17T14:45:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-10-17T11:30:00.000Z","end":"2026-10-18T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-18T03:30:00.000Z","end":"2026-10-18T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-18T10:30:00.000Z","end":"2026-10-18T14:45:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-19T13:30:00.000Z","end":"2026-10-19T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-21T13:30:00.000Z","end":"2026-10-21T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-22T13:30:00.000Z","end":"2026-10-22T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-10-23T11:30:00.000Z","end":"2026-10-24T05:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-23T13:30:00.000Z","end":"2026-10-23T15:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-24T03:30:00.000Z","end":"2026-10-24T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-24T10:30:00.000Z","end":"2026-10-24T14:45:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-10-24T11:30:00.000Z","end":"2026-10-25T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-25T03:30:00.000Z","end":"2026-10-25T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-25T10:30:00.000Z","end":"2026-10-25T14:45:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-26T13:30:00.000Z","end":"2026-10-26T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-27T13:30:00.000Z","end":"2026-10-27T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-28T13:30:00.000Z","end":"2026-10-28T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-29T13:30:00.000Z","end":"2026-10-29T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-10-30T11:30:00.000Z","end":"2026-10-31T05:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-30T13:30:00.000Z","end":"2026-10-30T15:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-31T03:30:00.000Z","end":"2026-10-31T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-31T10:30:00.000Z","end":"2026-10-31T14:45:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-10-31T11:30:00.000Z","end":"2026-11-01T05:30:00.000Z"},{"exp":"recZX0tQG7JhPJHX2","start":"2026-10-31T12:30:00.000Z","end":"2026-11-01T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-01T02:30:00.000Z","end":"2026-11-01T06:45:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-11-01T03:30:00.000Z","end":"2026-11-01T11:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-01T10:30:00.000Z","end":"2026-11-01T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-01T10:30:00.000Z","end":"2026-11-01T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-02T13:30:00.000Z","end":"2026-11-02T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-03T13:30:00.000Z","end":"2026-11-03T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-04T13:30:00.000Z","end":"2026-11-04T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-06T11:30:00.000Z","end":"2026-11-07T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-07T02:30:00.000Z","end":"2026-11-07T06:45:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-07T10:30:00.000Z","end":"2026-11-07T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-07T10:30:00.000Z","end":"2026-11-07T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-07T11:30:00.000Z","end":"2026-11-08T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-08T02:30:00.000Z","end":"2026-11-08T06:45:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-11-08T03:30:00.000Z","end":"2026-11-08T11:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-08T10:30:00.000Z","end":"2026-11-08T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-08T10:30:00.000Z","end":"2026-11-08T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-13T11:30:00.000Z","end":"2026-11-14T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-14T02:30:00.000Z","end":"2026-11-14T06:45:00.000Z"},{"exp":"recotNF3taNVJQHvz","start":"2026-11-14T04:30:00.000Z","end":"2026-11-15T10:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-14T10:30:00.000Z","end":"2026-11-14T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-14T10:30:00.000Z","end":"2026-11-14T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-14T11:30:00.000Z","end":"2026-11-15T05:30:00.000Z"},{"exp":"recCERBptmvu3WC5B","start":"2026-11-15T01:30:00.000Z","end":"2026-11-15T10:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-15T02:30:00.000Z","end":"2026-11-15T06:45:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-11-15T03:30:00.000Z","end":"2026-11-15T11:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-15T10:30:00.000Z","end":"2026-11-15T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-15T10:30:00.000Z","end":"2026-11-15T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-16T13:30:00.000Z","end":"2026-11-16T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-17T13:30:00.000Z","end":"2026-11-17T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-18T13:30:00.000Z","end":"2026-11-18T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-19T13:30:00.000Z","end":"2026-11-19T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-20T11:30:00.000Z","end":"2026-11-21T05:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-20T13:30:00.000Z","end":"2026-11-20T15:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-21T02:30:00.000Z","end":"2026-11-21T06:45:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-21T10:30:00.000Z","end":"2026-11-21T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-21T10:30:00.000Z","end":"2026-11-21T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-21T11:30:00.000Z","end":"2026-11-22T05:30:00.000Z"},{"exp":"recZX0tQG7JhPJHX2","start":"2026-11-21T12:30:00.000Z","end":"2026-11-22T05:30:00.000Z"},{"exp":"recCERBptmvu3WC5B","start":"2026-11-22T01:30:00.000Z","end":"2026-11-22T10:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-22T02:30:00.000Z","end":"2026-11-22T06:45:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-11-22T03:30:00.000Z","end":"2026-11-22T11:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-22T10:30:00.000Z","end":"2026-11-22T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-22T10:30:00.000Z","end":"2026-11-22T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-23T13:30:00.000Z","end":"2026-11-23T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-24T13:30:00.000Z","end":"2026-11-24T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-25T13:30:00.000Z","end":"2026-11-25T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-26T13:30:00.000Z","end":"2026-11-26T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-27T11:30:00.000Z","end":"2026-11-28T05:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-27T13:30:00.000Z","end":"2026-11-27T15:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-28T02:30:00.000Z","end":"2026-11-28T06:45:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-28T10:30:00.000Z","end":"2026-11-28T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-28T10:30:00.000Z","end":"2026-11-28T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-28T11:30:00.000Z","end":"2026-11-29T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-29T02:30:00.000Z","end":"2026-11-29T06:45:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-11-29T03:30:00.000Z","end":"2026-11-29T11:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-29T10:30:00.000Z","end":"2026-11-29T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-29T10:30:00.000Z","end":"2026-11-29T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-30T13:30:00.000Z","end":"2026-11-30T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-04T11:30:00.000Z","end":"2026-12-05T05:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-05T10:30:00.000Z","end":"2026-12-05T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-05T11:30:00.000Z","end":"2026-12-06T05:30:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-12-06T03:30:00.000Z","end":"2026-12-06T11:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-06T10:30:00.000Z","end":"2026-12-06T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-11T11:30:00.000Z","end":"2026-12-12T05:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-12T10:30:00.000Z","end":"2026-12-12T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-12T11:30:00.000Z","end":"2026-12-13T05:30:00.000Z"},{"exp":"recZX0tQG7JhPJHX2","start":"2026-12-12T12:30:00.000Z","end":"2026-12-13T05:30:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-12-13T03:30:00.000Z","end":"2026-12-13T11:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-13T10:30:00.000Z","end":"2026-12-13T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-18T11:30:00.000Z","end":"2026-12-19T05:30:00.000Z"},{"exp":"recotNF3taNVJQHvz","start":"2026-12-19T04:30:00.000Z","end":"2026-12-20T10:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-19T10:30:00.000Z","end":"2026-12-19T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-19T11:30:00.000Z","end":"2026-12-20T05:30:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-12-20T03:30:00.000Z","end":"2026-12-20T11:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-20T10:30:00.000Z","end":"2026-12-20T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-25T11:30:00.000Z","end":"2026-12-26T05:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-26T10:30:00.000Z","end":"2026-12-26T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-26T11:30:00.000Z","end":"2026-12-27T05:30:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-12-27T03:30:00.000Z","end":"2026-12-27T11:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-27T10:30:00.000Z","end":"2026-12-27T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-31T11:30:00.000Z","end":"2027-01-01T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-01T11:30:00.000Z","end":"2027-01-02T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-02T11:30:00.000Z","end":"2027-01-03T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-08T11:30:00.000Z","end":"2027-01-09T05:30:00.000Z"},{"exp":"recotNF3taNVJQHvz","start":"2027-01-09T04:30:00.000Z","end":"2027-01-10T10:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-09T11:30:00.000Z","end":"2027-01-10T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-15T11:30:00.000Z","end":"2027-01-16T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-16T11:30:00.000Z","end":"2027-01-17T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-22T11:30:00.000Z","end":"2027-01-23T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-23T11:30:00.000Z","end":"2027-01-24T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-29T11:30:00.000Z","end":"2027-01-30T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-30T11:30:00.000Z","end":"2027-01-31T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-05T11:30:00.000Z","end":"2027-02-06T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-06T11:30:00.000Z","end":"2027-02-07T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-12T11:30:00.000Z","end":"2027-02-13T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-13T11:30:00.000Z","end":"2027-02-14T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-19T11:30:00.000Z","end":"2027-02-20T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-20T11:30:00.000Z","end":"2027-02-21T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-26T11:30:00.000Z","end":"2027-02-27T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-27T11:30:00.000Z","end":"2027-02-28T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-05T11:30:00.000Z","end":"2027-03-06T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-06T11:30:00.000Z","end":"2027-03-07T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-12T11:30:00.000Z","end":"2027-03-13T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-13T11:30:00.000Z","end":"2027-03-14T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-19T11:30:00.000Z","end":"2027-03-20T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-20T11:30:00.000Z","end":"2027-03-21T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-26T11:30:00.000Z","end":"2027-03-27T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-27T11:30:00.000Z","end":"2027-03-28T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-02T11:30:00.000Z","end":"2027-04-03T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-03T11:30:00.000Z","end":"2027-04-04T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-09T11:30:00.000Z","end":"2027-04-10T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-10T11:30:00.000Z","end":"2027-04-11T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-16T11:30:00.000Z","end":"2027-04-17T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-17T11:30:00.000Z","end":"2027-04-18T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-23T11:30:00.000Z","end":"2027-04-24T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-24T11:30:00.000Z","end":"2027-04-25T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-30T11:30:00.000Z","end":"2027-05-01T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-05-01T11:30:00.000Z","end":"2027-05-02T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-05-07T11:30:00.000Z","end":"2027-05-08T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-05-08T11:30:00.000Z","end":"2027-05-09T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-05-14T11:30:00.000Z","end":"2027-05-15T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-05-15T11:30:00.000Z","end":"2027-05-16T05:30:00.000Z"}],"reviews":[{"name":"Divyam Sanghvi","text":"Superb experience, right from answering our queries, teaching valuable lessons on astronomy, safe hiking, to taking utmost care of each and every aspect at the location, everything was perfect. Thanks for an awesome weekend and helping us spot fireflies. Definitely recommend\n","exp":[]},{"name":"Krishna Vijayvargiya","text":"Such an enthralling experience it was! Camping, trekking, bonfire, waterfalls, staying in a village, all part of their package. They customise as per your needs. And the best part is they take smaller groups only, so that you can spend time and bond and be yourself rather than always being in rush!! 🤍\n\nI'm planning another trip real soon with them 🤗\n","exp":[]},{"name":"Shruti Vaghela","text":"Recently went for their **stargazing** trip for the Geminids meteor shower. What a wonderful little getaway with the most warm and welcoming people! Super comfortable set up with all the amenities you could need! Rock & Anchor has also taken the initiative to involve local villagers, providing well paying employment opportunities - an underrated perk of which you get to enjoy first hand, the DELICIOUS food they make for you, from locally grown ingredients! Would undoubtedly visit again and recommend to others. Worth the money for sure! :)\n","exp":[]},{"name":"Jinesh Shah","text":"They are a class apart. Prepare to get excited about India’s outdoors in a unique way. They pick Great destinations, they choose the most sustainable options. The folks running Rock & Anchor are nature lovers, experienced at leading outdoors & rescue, & are wonderful humans. If you’re tired of going to restaurants, clubs & shopping malls, look no further. Give them a call.\n\n\n","exp":[]},{"name":"Mradul Dubey","text":"If you're looking for something offbeat and exciting to do over a weekend near Mumbai, Rock and Anchor's **stargazing** experience is something that you shouldn't miss! From informative sessions to experiencing a glimpse of a sustainable and environmentally friendly way of living, there is so much to learn and know about. Would highly recommend this overall truly enriching experience.\n","exp":[]},{"name":"Abhilasha Khaitan","text":"Incredible experience led by Aadi. We were two beginners and he made us feel safe and confident. That apart, his respect for nature and the support for the locals was remarkable. Sign up with Rock and Anchor if you want an authentic, exciting experience. I’ll definitely be a regular with them.\n","exp":[]}],"impact":[{"metric":"Experiences run since 2021","value":"250+","order":1},{"metric":"People taken outdoors","value":"2,700+","order":2},{"metric":"Village families we work with","value":"8","order":3},{"metric":"Local guides and hosts employed","value":"16","order":4},{"metric":"Village schools supported","value":"4","order":5},{"metric":"Homes given solar panels","value":"96","order":6}],"source":"snapshot 8 Oct 2026","team":[{"name":"Aaditya Shah","role":"Co-founder, The Rock","group":"Founders","order":1,"photo":"","bio":"A former software engineer turned mountaineer and outdoor educator. Wilderness First Responder with thirteen years of leading experiences in the US and India."},{"name":"Mansi Nayyar","role":"Co-founder, The Anchor","group":"Founders","order":2,"photo":"","bio":"A creative supervisor and trekker who has spent ten years leading offbeat treks across the Sahyadris, and has curated 450+ travel experiences."},{"name":"Sujit","role":"Experience Leader","group":"Experience Leaders","order":1,"photo":"","bio":"Leads Rock & Anchor experiences on the trail, looking after the group's safety and pace and making sure everyone gets the most out of the day."},{"name":"Prasad","role":"Experience Leader","group":"Experience Leaders","order":2,"photo":"","bio":"Guides groups through our treks and village days, sharing the trails, stories and everyday life of the Sahyadris."},{"name":"Nilesh","role":"Experience Leader","group":"Experience Leaders","order":3,"photo":"","bio":"Leads our groups outdoors, from the first welcome circle to the walk back, so every guest feels safe, looked after and part of the experience."},{"name":"Mitrran","role":"Business Development","group":"Business Development","order":1,"photo":"","bio":"Works with schools, companies and communities to design private Rock & Anchor experiences around what each group needs."},{"name":"Aditya Raje","role":"Social Media","group":"Social Media","order":1,"photo":"","bio":"Tells the Rock & Anchor story online, sharing the photos, reels and moments from our experiences on Instagram."}]};
const LOGO = 'iVBORw0KGgoAAAANSUhEUgAAAPAAAADJCAMAAAAq/k/FAAAASFBMVEUoHhAAAAAqIBE9AAAnHQ8nHQ8nHQ8nHQ8nHQ8nHQ8qGhFVAAAnJAodHRAnIA84OAAnIBB/AAApIBAkJCQqIBFVVQAAAAAAAAAI2qs9AAAAGHRSTlP+AP4Ez4+vL09vEwMQCS0ERwLQB2YDAAD1/X6HAAAamUlEQVR42uVd55rkNq6lKIpJlGps733/V72iAgmAYKh2dXu8qx/+3FNJh8hRYvo3XfNrrr7mF62VEkKY+Mbq28S/AWa80l8vb4yZy3cEJ6SIV5hCHe/vCHid+fvdjHHLSUQpPPOyFtd1vEMtYZqM4wgtfi9K4n94bSHe+H+si0gPLFKeRFQ2vdHY4PfjdWcXAS4ZYUvLIBa/Bc41/xWMPel4Xgc2/zJayhvpjQaQTp3/Tt6QLjutvwnguaDmQSd70RHd/Mm7GsOQOnH/pDmc+TL/IIXXGZPyJOehgC6cN8MWt7+44+UqjvmmcO2S6vXTgEsFNB8oI8gbJY8z3zL36kHi+2utaF8H96/fDng92XXN5AyRkJFj3WMqLxxSfPU6cJyKeem/1Xwbhde5pGYwt3r9AEjC6lF9q/63yYWQWPwdbj2/Cstl5NfDRsTL3RpIfMclRTrIzuX/FoXXmejXE60Ph/NzGcusZb8LaoY89jZijL9I4dmf5vJPNwWnlWjZwn/4OhTc2gC8zoh2919R5xgf6Xip12xF9CJ+R5TwUnWWnvH/b7eCs5qaCfk2Y/2Tl+cBn2i9dc/Lm1NCO2uiYyf+1ZepUXh3+lTjPvKwiyr/Uj7/brjI8waAD4QXPjXdEdh/y3WQsAQ8T4tMSu2/CCwONTCFk1LTQvwvAA7iv/ZSbQr/bwCeJ/vbCe7nHDfPAda/F9aDLgtJU339CgXgrxFYvu/JD9JzseaiyrunNOB5iBPvlyQYxGfKqfEzksX5KKX0EVO6lHq7015vadJlGQbcTZRURCO4bNvVGJuegbIxiwKYrZ+h4pTq9nPnyb3DOLoK2CLAQS9flt+Uy9ChS1r9sOnj2aXXnkB7DdRuavkJlsYRsbCfi2KlrP7wcrFVzI7ECDSGnilBkzlO4QDWf4czLZYPwZWRYU3MfCB+zUxFsofzg0daDDD7vh/yDbAzLZz8DFxnMqKdhJRcySOpSkAABTnwY75BTuqegD9zjItP6bwzaWKB+JFwBSA+uYsCflg8BzQfdbXEiCqU+eJTV7asyC6S83TmF0wBekTh+VZSHon0JwDD8oOYX933K70s7riO/9ornY6FVJZ1yeNv1yHwAym9fpM00eNz8YxHFG7z9LL7UN7oDg0GlhHCsOQ47HFovglYqunj7j30PIQb8UPn51qfuh/gWLXx5AvFz/mz8Kk8MrQgj2qAGf6cCH8FcJ1++OswpS82UPQzyRFYqdB6JAFKfAvg8E7Kj6Gf0GXReUKeoSEnUGipAL8zHccHI3ToW3bMknQVjZNEDDpuNtZa8rdb/IZEYUf+YUMybaYvONJtELARoAe4rmJXRY/k9FJlJpgXLD6qloESVemvRm3/7ZoOcqaFfycDxkhxPr4XlQLiKiaiPVI9r4SlYxpCTU1H+vBgDyNJDeMbzjQFLBdsDVQPMMUHznPGwUDmUo87NAzs2HhOeK8QwF7H462SXwO8KfKiqwN+eV/opIwvKMHppMQkWbObupAnfuBFzYH2Jvc1wB3tr5K427MioQPRWoBjNa+TVCLgwzz2dLgfGmHA16crbgdQt4dLMJq3QIpIdPpgHgFLBM0ftljKgU4iLJxk1DxMP4cpLI/mAYCPD9i62/Ec5d2qN48mCAjg0U4nQ3mc/EMWUXJGWQuHdAOTy+eMARvUcdbIt0Yu+ELtQXQ8uKyEH6F6EcAFvqyTLDmz5Kw4zTXWRT5WoaqkH9bxRwSzvZUSUW+Ehxlw4K1O+ocsopQpSA6HpoGglCRi2CqzmcMiPdhHvc8NAraDLB2oyitOwPJSABwdVnxg9HBHXryfFYoYcjTL58fDQ+ClKEoPhfCkm6RSUKjteoRi7m/n32nAr/h3AirM0tuohrutTqaHkjgH9QBOHylcrcoNAil53svQ7j5II94FTLR0hy9U0kkaO4YrsbtJhikPAMPlZE9sbu7wdWa7AO9vBBgY8Kt3TIH4SdQMFWnVgikenVG9wZyofY7X1B2mnAgbTYpgs/TqHFNhZtVMAGsKWFMWNm3AWQ/6pfHG+20hHep4CAmVVu+YFA2A1TzxrlbiQ+BLCgzYdgD/9asRGz6cc6I0jQij6ZIOA05WR9GkR5FmVBMJEG27OsYE3arOmedpqLdqE/AHeoBl1ZVMt5XSvk9KIOvxDVGwCliz+duqcvPpCEfTQOpLFA7Eaia9TTLn4Dw9AVz5KTUIWN0NoE69mwby44Bpxib7aWUKQEse8NLp2FeNnCgn7CG8m6o344Czq/VS+LQo4JVa6ueOsliYgdLA8BvfyfO9A5jWusBIyQ3Y1jIaScp7OOwgT0v9FxxxGs9c5x8QvcQBBHyW0nQtsZ6LKzTTrqZ2Zq7IfleJB+7mnVoMiAhET9UlAVynRSit3TZVEuvZmS6SPP/3JuDGTfmvEBicUxewApM/G1t8eI5kLpzpMsmjBrowmpFf+d1vGmLRzBv88n6qzQgw0ZEVNM1lWcPV9zwa/GqQjf8wYN8a9PCK+g2GfC7dtmnTjUv3h7bCfa8UA36gCZidR011wnTzpU6iWZ+9VwIN06gptoyUq640q0HArl6895lYuSCq8EGthMJ1wAwrmV6DynkDizHBT7/Gux6aSqteWfILLO5sRERpTqDnTLNV2VU133iLixmauQQn2tHSpg6YY0hNuxzsmDPN/A57OHjqSpEsyJCD3Abc4GlT3u5cAjZEF9g3tCNHYkMUOUwKjPmWbS1d8PTKpf3LNB4F7HrNdWYaITEZFT1UxvPN6kOARX00cc4/UgImSZCsavw7omNqjPna0hvMYNgEATctuIMGY/lzmRkCFHlLaqjyAYQBwLDJh/aDXQTW+g6MFzGa+YCA2/ygUFOKXBgCZI7dKnpbTV3fMvFq0KDHGOlGlRTB8/5gRzucMOCxgPj6XlM670UxAiihO1x6sYBTswb0cEz6iT8mNPWQqhIxp4W03ICXCQD3VkPg2CdTM/N0mYjOvuUiuQO4hgCUfgbmoTWwqLjGOcQKq6+hyvieAfcYAscn2RJmiS2aAMpMND0A4czuQYPpgo7RsxIAAQME/WUe6ERF1w0HcCJC0JpqWR5oVUzzb+3PgL2n5k+TCnlpI0nD4lCZOPVHim7mAHy1xQo11GNUWmSlgEGxgfi6MXNGE9soY/x8h30vtWWA0rKjoZXB4hZEUVspAPsK4IWkBlH7IWhkguKmUMyZ222GMh8QsBkNrQxyIv5InqQu+nR2IoV1wBMBbEXRYIv9DtIvNdrMYwHgngzgblddpmGK6gTIEqoOS19fkit0FrVfYhIHppdkkKOTpX8L8MV+ocw7pXfsgs9bFl0Clb7/B3DmkJ2yZdlLYoz3Pdcj/aAYEIKAO9ht6sNKv1JtBHkGOSwtqToi9h7xSLkxC1IpqLOJ1VZGLIjsOvk3AJ8GgbamQQ7eeL1NA2Rq66gdg8nvzLHpW+KyFG0GEkIiTUimHxQDzTABfS3Isqyq1/ly46FWSAia2KyodSRwstaL3hJk6hyJN9aO3V+rCq2FqxOM7YbZ/GtPTxVwENT1ysRTMztqMFKFSD8oBnoWDfnaoprGtfogdwxwhY+Tt9p5QhtL8xwbl7A1BOo8hXvdXDdAVBBwR8U9WuoxeZaa3WIgVNKuB1QQhdn9m72Kkh0MUgCJPaTuHCc27wh9/yBgcDOG+xsb4mvpiaW8FvDky0xCu2IwAh6RqdUZvYtnu5yjY6N5y/cA72zBGyfSzS+XJ4WTW+Rq84dFk3hy1vKOOeRfujurE8dYmzseedUrpvFw6Y75OV8r9AYFlK+8DiuQ5yxY7vY6t+n5F/Eq4o5Ode23Eu9cZhwwsAYKue1ZiCEB15mpbPPjMXBe7w/KNe5aTfapeS0IuKPT1UQ8WzPR4ooKU4tj2Sr/erBsSppo789tekAcP7yA7Va9YiDeUAFLJJPm4WV0Rfom+kbr+izWm1KPGc5xfdf2rkdLiJEsZyAjzkCIQ07qlCs7U0X1Fj7kDppfixI/dz0kGQJsqp1ZUYXebGDKIkUg+VAZV5KE2MLvFvXDy/QeJSJGEvc0PoIMnI3asufJ29tKlktWJUrP/n0Y4JvunagjgP1gLAk7aue0d9ZklrU5V2CXH1hEpvQS1/YZv5nYrBYVn6tk2R9bM0LhIpaLSjUvuFxgZBLvwEWG/SRceZNPjlSkfLutQgykwU7X/yJnytsJlxaYM4r2k7Q9F4T4MG3+ca2AuSw3OM+1ZIB6C/Cjky089e/bO4t+HNIRM6xv7FJoA+6l7q23HDk/jvQMt9FWvnP+GoTBm+v2J9QcKQ/WSy1Duzy+E+al5w+jFVZkJj027zPMotf7E9QHAH8P756PKHCCLaNfBnGubLQR3RUwLcBO/gCvkv+LcMyZsnh6fTSZROZJiHZwrm9kuAwA/K0rAM8p9uhh7Ye5dHCY/b6/2dCoWpFOiWl6AXVsuA6UEPaOEGfA63cCPtzJHYVSJmtIXxvb1LKhlFKnOujDPgNJ7VtNbXdWW3x0Z0ZpheXiUUrnBWMkM7Gt50+MArI8dlm0LSseIc0sYgkw9XDps4D1cS1gnd+5rn+uRv2ps0OhCO6JQjWoK8SrnPfCJ5aVWKg7yOKtyeO2pcodL76tRzc6/oKnQ57sfe7SrTUwmkrvTKg7yAIlLt703LUz1oBSyDkfF2OlNKO2rWVPWzHTloIwPbHZ++ft5e64nTC5aRhiBLjpW0ouoJNLKFtoiu6kWvsxnggqU7M7xm+I0qZtyuUSFS1rDrLoj1rHR+PE7SiMRMwkT/4iJ+5hgsOEos/I8+sSHpb0qBpRrkOkTJ7/5vCoDLjlauX8KrLmwOj7Ihf0/GD+7OuMjh0/3lMC9rwWD5VUKJ3s5fGoeQRw+o7sHhD2hR/G3UnFaHjB8juxmwQh5dBikuBmqZX4ahXPwwPA9Wpjsm2kyAiM5C4KmXJkR4vm+9MM73lMuOCUPn4fwFr2WhjBaD3W1eptH856gGRz1TSVfRg7X1FKTBBqMq7JjBsCTFNpmaeIHWLGTXjArc4lU2tpDGW1q2gEp66CKQCujRk3KpIjgNeGXTq/vdt/62tRl5mK+gPTCb/yJTXqaTju72yncdU5p/+JUmAWOxXS2QOsqpmE3PFbX2jheECpUWB5DoRXOorft5CFCwBGSoMfmFgA4NBNZ9FjQTNNxX4HfjT8pMi5WIraNrpOYIdiU6xay2qSrCJTnQmRDNgPUBhLBg7Oi1FpxTqD6sqjFp0mDwI6dxvIvoUXbXqkg61bIyK+jlN0+hVVbQISxgXFMrEpLUtbC18S7HYrnMWEiHgelicoZSFZzACWWDqAEUvPU3WnsMfHM9PB4Sdmt0ZLNv9LVOSGARvq2DwcCwBHb98W6/fQtUHAslf9J7qPf4U0gjOzDpWNe4oNcB89EajrenMU0JJxUbDv9Ix7AFgPAEZai4w0VRrBA8MbrDHX3KBx0hMFA9lrhGCpTs5VfQrRviGaN8ycLxUz4FzM3PWmLOmB4KxWdsYVkWEraUsBXFxdc5Uh4Fr0gB53it6mmKmqYnaadtFW/LjHtaKuliaLeeGusni4r0rpwdTd5D7g2rCYIuVvLctFRN0dLSiLpbQ2V29L0Wqgy8VO9dHXmqN83o2Y3ptzVTUKo+XQIHxpUViCLaDW7mUqXdVyQAEY3WKCT7dC3R7gUC9ibITE8SXF2yk+863QNnGWSLUcEBilLT9aGzxDgO3g6LapE99wSQlfjdcIS66smiW+JYon693ETtadCtGgAPiFly9DRAr4rAgFNsTnOqMONT83Hm4OZyVmsOQVavVtarb3sa6W6Mj5s6NuKbxLylEXKDo7vTci8uYOCYV0pqFJrEXSI/cDa0+2/iPE0uZUXxuixQPM1Js39e9vrVSgsxIeO99Pb35qRI4sCloFtnpw3wac5SwZ5Hp1FiwPLhucuPhTvRrj2LjnbxNs6h5koKzMu8urPf6m91S8BCqkhZN5iDbbiFTTKkL49AWsr7cTlCuRj/KRAKpsSgWW2aVBA1sT0LkDODuzqjBMoFiZ8w40j9h6iEGLp9PoAA5uVCvHAtR2Fc5LNL3txDGeMzC5TpB0sUxzGBupFvDVHqh0jNNKkRJvJckDtw3AiDq0uzyOH0yAX821e/HryqU/eaUQgBWw+6+nRjimvIHLtuP4lcWGuOArU522UKJ8pASjkkR7RDMDzlZIlZ5/LhLR4oNqh0t0ZC3/vUEuYsbvCgdXy/4WXDUM2DBJYRj8Lon1LU5EJuewt7SUbvzwmIsCOaBAHNz19r06c0whA9aNZq6o9WiGEbo9ViZW0zRvF9qAydvBgJbiqk3pQF6KK2epnuthHsA1b2zPar4or4P1HSIv79ek7cC3fVdVqwHfCPeJn/FLHIlzLL4TIQLAS4PC17fRQhDMIqf/3xxx/23HlfOVFSc3Is9HxMW2gYuJeztwDokQ7aQIBGyLt/4FaB6oSzvjPFwN8N5ecUKyguVOUEtGy+emmnZvAGZOL2SbxjgRiq2IVlIqM0njzXiAprrMWuANaqqd1To+LppqDRoVpikI8dvGxjv5IFTTl6MV1ce3tLXqlKFJt4ATFrWFa6LZvIbKd6qoB8MnPJT5B5x47Cw8LCuqhihGyTag0tFl00zUdgHjah/dRoLy4rJYIUyqLdXOfFQiziwa6tUpVm2f91hMMhcsKwZ6ufLw/1xpyTBlBuQJ8DquVpGnwxXXoqZP1xgRNdXztdQ6BthzxVDylA+yzmzCk8NgVdH5YN7cXR8qWumec6Qs6kmRnDxEsPfEAS9a8QUudUhFc5fE0/dcvk+RkqeIvZihRFBUTOkT5JRg20boDvvQrrYAwFrWKWzI6VrS+LZx4S3xhm2nfub516sdt5VH4exlqw0LmO+KIIDpQ1iwhqClgI1P1Jo56wWpdhPabRqW73Sq7Tmi092FbymaTQLPp801bmJrGpg+sRHShHTXCdwzrP40WI0TuYG9WufkUB1wsaiKk+IG4FhhtmmwLi5ErVVCis47zleiz1cun3xCARM7HreVCO2Ypms+oOQjCJtlmLpasdW7kuleyRrldFobM2ph+PbC547/tFf9jHbrFQXE+B7PzpaznUPxiBjEALChcQWZF0LXznbeEctkEcvtfHviNtXUsCNNBDOuyBSz9ncErXwaHCxtrXSiUjSP39OohGysFiNSbLg+/yzDt512RKvS9sWdryAxoy1P+9p1V69g9qVUw6LaJdAshKStUURAy04XmqMokjqq1p6YXufOPS+Ij6O9V0b7yWSKJQ5ks3sgpBa1+bVm0vjxGxsLLamdKH1HQ3xLK7m0XuX51boo24K5XlmfPoeAsedRzmfExw2ulQ6HSZUbOW93JANUp1dZPGYPJybLZ7LRLoTYhg+dhsVYNzwIqkS1xqiaLB3YDBRRW2TNibfLYrcisRgqtYrMcpdUpln7jZa83xoErU8oor0NPuzWOa1RzM91rxoq6Oo1tScicYb/Anxiy4VKMGwfqkPvbwN2sloIudZTXK4IitcDJRcg0MMzuWSG9H7al21R/Qh8Abiha9jenatd/+bYYGNCMdPT1PLIprTi29Tyv8qfux5/Fs8ide/FnS2L1qXn94kh5oYjJol44VIA3hBrys4uEEXOjV65xEnGenMu31FfeIr0VwCbetLYMJ1VJxpL22VBRIEiOOQ8HHYTPGhF+zhwv+hI2+Yqjk9cqg04FGUDzNNgEbYqTgksFI9O+YykGCuMw1eIRP3+VTXI8fA1wEi8UcUFmF1d9H6AVUtSOdAVaZy2k8PoFqFMqvl+3zgz9KWZiUvFKXDY/1ludgPGGdWTDsjGeOPOJVmxszlsAdtBlT2lb6S0EdNUz2qpRp80fMxC3BkG3nJoshg9z7gHkG7h0bBXXDorf2AZEcxLM60vbPleQp6Wy8zUcpQ+qBjzkoMIzKblYsQPXLmYxrpaoEGD7Ed5Hpl7H0mwzqLNWZLq2hZ0tbGrdNXIZ9+9PAJcJHnYMol89M8WOTa67f3VWKr1CHvF13LTMq7lgyorty1xrtYFOAZJiMLqCAJ0xCmFGNsCJvXgohB4sC7dxMd0mAKth5whTrQsMyXvKhiph+j0wu7zE8J+TEVPGHBhiI33e1xF+IGf1IqNxpM/epe/fQaqTE2Ge4ctW939EHDRq6Wanx+ga+flRd/a7RFjPVllBw6v/cWa2y4olYFLD/qbAPBBDEnutTZA2eYBSMiyUukBHeXM3uI5ywJZNrAirlPRLNsy6mMFgB2UD0W8yZDjiJHAeUjmVIqtbMJV71TFvbimCCtz0URM3Wmf8oStr0yyqSXL+6FeTefOzy9bpDEHBHU4nxV1bIwalZUYa+bNfdc0l9aLBY/jHRh/KclojWIfem2vFcg1RcWpn3hXd9igqtZzfP2VCifgyGlqWdRSJJtFf4CNocqkFS/wyD1K+rY6uurugEG36HZET7zwIOP4bMw8Y5vDsvyKUOdwh98VwKMmPj5BxrQE3qAN1+6lK0r80acjBLx88wdmXKXiYux1Az8499qPGGCegUkeimlAa1HDRL2I2P5ELDzSV0y6zMadmz2Ld2G5CemmsMSVMc5Z45+Hpi3xiv9ylThTIPSaKxM+BHAl8tZEnUjZYzpsCXUl7iw3nWc2PYXQxRS7PgBZY6g0xrxf+QTQdepcYmAKVZrxh3Wz6kmWym2O1UxjsTm7dv6crHvOIZapTrCqGeCeV27WawBwbRpE9VPfyr7jf+53mtKllFbcMeufGsxym80LXLmd9O9cojpp927gVRmnrPR4zodERo/tUjiOz9V/xyXYMuibl3XS8dKgGedKXhNG4UqOLO6cAiJUXH8McO9hU+y/Hk4zzshduufKVWr8bAIVXZ/z8ZGHHgqVBoMfpHBr46NR0vFtyIe5V/D5fqeLqQ5Yh46Jkd+pjZzdM8S2sfxBwHEwpUZdzO9kB+mhXU8vPSqfE9VjK6fN096Y9YdBNik8VweOIWB5pSazQyzV5pbF/oJ0I+WVeZ1+g0swPUmed4HupbmnNOr9qtX6LXYaHGR1Ify4OH4I8JV31aXz8PgGMd7CPUwh1cim3/4SfHU+eqZ3aHtBPJWONSGw757n1/Qvuf4fO7bhvH19JxcAAAAASUVORK5CYII=';
const FAVICON = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAASFBMVEUAAAAoHhArIBEnHQ8nHQ8nHQ8nHQ8nHQ8nHQ8pGhA9AAAnJAodHRE5OQBVAAAnIA8qIBAAPwAsIBFVVQAAAAAAAAAAAAAAAAC0FRqkAAAAGHRSTlMA+v7OLlCvjm8TBA8KBAMrVgTZAwAAAADeOaORAAAE7ElEQVR42uVX25bcKAwEdAGMPZ3s/v+/bkkC231JcmZf45POYBuVhFQqcEp/3bWtwdd3rL627f/4wvXiZjD/YARxMFF79M+uXp2NziytKkxazrlI2olskDNf63pd0OjdrKqqzc0FV56Xcp3jQs++zJMZ3a0uu49XhDCkilTSy+j3VtdVmhVlS7ackv9k9QE2ABL/3sZ+WFKk8OV9NYD6/JDmP7NTQVq06Di0cJLyGYDenhOjBmqv/SJKSXM/6juA2nuddw1mvSNOCoIQnO61bZhgYeLB+xrJJ040CX8Vmem1Dgw4caEDxiM1mqkqvwbAekQ2rBQAGTYCSAwSU+5JahKfVvc5iGtcS7AV54KpNqD8cKQdFnCKpy01L0diSXqF0T3mMyHqUautXzBwpOKEm2ZFN2SkXQA7AGQR2wBgl+egZ53rs5vhQ4C3J4DxDFAxdSyAOQjC/WurcYsuNwBM266c7Kn9g+6whVkp4HIBIL9bLBVrAPKdy8diMnFaxDYAD78vqwRlmfN4u60A0McZwRQCz1nzlJ4AXu5tJgFILHcur15qBxTBiyIoodPXkKzDyUXHm4kxp3a+uHwBWLFo2K2VIgcV0UBarRnYlMx5gDnp1CSFlvUFYJVj/IKBSKkDWHGCy2ZGTo9+cRlpO65mGLmlQUjtsEwalwGwbRU3LXtwGcYEDaM7EW7dlKtVDpnJ5QFf8tVJhxlvRmwr6hTik809nYLgpUegzduq9uByNLzd0N6RfBJIDOmTrE40TP/SvEUCo7GxIog1sg+lPkv/LLx3AA0u27oFkuRSR6fCTzHwltS6EF1FVk3I9C8rrZwsWS1TVqGrzEaGhwfohHwCuNmF4fRfG3pryEygeL3HHrW0xF3NdQGRQlOVV2s0zPP6m0SS37RoTwdYch2xN0Tpr8k2O2tC2ZqTp6YRomEAFOX3QsmZQ4tlGJWq88XqB2OjkwJR02EE1fNtmcL+ODWRndDRi5QPlziTBnZxcqfWIqi3Na/lzvuMTx6NSCtfzdx8f3GH5FvDbA+FsITKbmkqjK0bVtYI+BPerZktyuGhA9F3OJMeiGmnxeWxKPET6XAA9khlphehsWeT/SFP6ZnF4wVgKoDh3C/ZSydl7T5eLPY+4dyw6/Ay47Md8bqjyAgYI/F9RdYUFmsnSVFPPKm6WkBOAOTMYqR0VPQdHNSZXuoRutdfA0BmFYJJAQX3vmqkCua+r/QVZVsAXg5PxDwv+JIdAFJHvq12jw+lJmNr8fTGjnsSyABk8gf0CkYgpiAfMhQ643WvEuWwrdepOOIAgNp0ihwfURCE0sTY8YhW8XOFlodLY+y4Jle1OxXdGccRwY4ELkezWL6/mnQ7ccTV0Lms0c+7VQrea6trQ+Ipr3YOtth2J3QrYNSP7p3kDlEhO3TRlJelahPACetNqtthPmLdrrmQqpqVLk17ukw2Y9ud22JQhEfzsyHOvVMpfnEQpbmhBsUK5IRavZ00PU69zpBvJz1Z5yxdOvvpTJtvOwFdfwFffd+NY4RXtZ3z9VRKXecwmmJrgbWHybvE18LtyKBLwsnm2wNocpmaqYqvgYajfZPWt9sHC7/GG2u3/4p0pWrle3z4bDrWoMX8ONRlQtFak4GfML5d3r6j3r+LEuMUQYQdS/oAe/aXL6mvb37luSt39N3vye1If+P1H1MeJU+/KY/kAAAAAElFTkSuQmCC';

// ---------- data ----------
async function atList(env, table, fields, formula) {
  const out = [];
  let offset;
  do {
    const u = new URL(`https://api.airtable.com/v0/${BASE}/${table}`);
    u.searchParams.set('returnFieldsByFieldId', 'true');
    u.searchParams.set('pageSize', '100');
    fields.forEach((f) => u.searchParams.append('fields[]', f));
    if (formula) u.searchParams.set('filterByFormula', formula);
    if (offset) u.searchParams.set('offset', offset);
    const r = await fetch(u, { headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}` } });
    if (!r.ok) throw new Error(`Airtable ${table} ${r.status}`);
    const j = await r.json();
    out.push(...j.records);
    offset = j.offset;
  } while (offset && out.length < 3000);
  return out;
}

async function loadLive(env) {
  const [exps, evs, revs, imps, tms] = await Promise.all([
    atList(env, T.exp, Object.values(EF)),
    atList(env, T.ev, Object.values(VF), "IS_AFTER({Start}, DATEADD(NOW(), -2, 'days'))").catch(() => atList(env, T.ev, Object.values(VF))),
    atList(env, T.rev, Object.values(RF)),
    atList(env, T.imp, Object.values(IF)),
    atList(env, T.team, Object.values(TF)).catch(() => []),
  ]);
  const experiences = exps
    .filter((r) => r.fields[EF.show] && r.fields[EF.slug])
    .map((r) => {
      const f = r.fields;
      return {
        id: r.id,
        title: f[EF.title] || '',
        slug: String(f[EF.slug]).trim(),
        order: f[EF.order] ?? 999,
        summary: f[EF.summary] || '',
        description: f[EF.description] || '',
        itinerary: f[EF.itinerary] || '',
        faqs: f[EF.faqs] || '',
        prices: f[EF.prices] || '',
        age: f[EF.age] || '',
        location: f[EF.location] || '',
        timing: f[EF.timing] || '',
        categories: (f[EF.categories] || []).map((c) => (typeof c === 'string' ? c : c.name)),
        fromPrice: f[EF.fromPrice] ?? null,
        datesAhead: f[EF.datesAhead] ?? null,
        photos: (f[EF.photos] || []).map((p) => ({
          url: (p.thumbnails && p.thumbnails.full && p.thumbnails.full.url) || p.url,
          thumb: (p.thumbnails && p.thumbnails.large && p.thumbnails.large.url) || p.url,
        })),
      };
    });
  const events = evs
    .filter((r) => {
      const f = r.fields;
      const st = typeof f[VF.status] === 'object' && f[VF.status] ? f[VF.status].name : f[VF.status];
      return f[VF.start] && f[VF.exp] && f[VF.exp].length && LIVE_STATUSES.includes(st) && !f[VF.hide];
    })
    .map((r) => ({ exp: r.fields[VF.exp][0], start: r.fields[VF.start], end: r.fields[VF.end] || null }));
  const reviews = revs
    .filter((r) => r.fields[RF.show] && r.fields[RF.text])
    .map((r) => ({ name: r.fields[RF.name] || '', text: r.fields[RF.text], exp: r.fields[RF.exp] || [] }));
  const impact = imps
    .filter((r) => r.fields[IF.show] && r.fields[IF.metric])
    .map((r) => ({ metric: r.fields[IF.metric], value: r.fields[IF.value] || '', order: r.fields[IF.order] ?? 99 }))
    .sort((a, b) => a.order - b.order);
  const team = tms
    .filter((r) => r.fields[TF.show] && r.fields[TF.name])
    .map((r) => {
      const f = r.fields, g = f[TF.group];
      const p = (f[TF.photo] || [])[0];
      return { name: f[TF.name], role: f[TF.role] || '', group: (g && g.name) || g || '', bio: f[TF.bio] || '', order: f[TF.order] ?? 99,
        photo: p ? (p.thumbnails && p.thumbnails.large && p.thumbnails.large.url) || p.url : '' };
    });
  return { experiences, events, reviews, impact, team, source: 'live' };
}

let MEMO = null;
async function getData(env, ctx) {
  if (!env.AIRTABLE_TOKEN) return SNAPSHOT;
  const now = Date.now();
  if (MEMO && now - MEMO.t < CACHE_SECONDS * 1000) return MEMO.d;
  const cache = caches.default;
  const key = new Request('https://data.cache/rock-anchor-v1');
  const hit = await cache.match(key);
  if (hit) {
    const d = await hit.json();
    MEMO = { t: now, d };
    return d;
  }
  try {
    const d = await loadLive(env);
    MEMO = { t: now, d };
    ctx.waitUntil(cache.put(key, new Response(JSON.stringify(d), { headers: { 'Cache-Control': `max-age=${CACHE_SECONDS}`, 'Content-Type': 'application/json' } })));
    return d;
  } catch (e) {
    console.log('live load failed', e.message);
    return (MEMO && MEMO.d) || SNAPSHOT;
  }
}

// ---------- helpers ----------
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (s) => String(s || '').replace(/\*\*/g, '');
const IST = 'Asia/Kolkata';
const fmt = (d, o) => new Intl.DateTimeFormat('en-IN', { timeZone: IST, ...o }).format(new Date(d));
const dayKey = (d) => fmt(d, { year: 'numeric', month: '2-digit', day: '2-digit' });
const timeStr = (d) => fmt(d, { hour: 'numeric', minute: '2-digit', hour12: true }).replace(' ', ' ').toLowerCase();
const dayStr = (d) => fmt(d, { weekday: 'short', day: 'numeric', month: 'short' });
const shortDay = (d) => fmt(d, { day: 'numeric', month: 'short' });
function eventLabel(ev) {
  if (ev.end && dayKey(ev.end) !== dayKey(ev.start)) return `${dayStr(ev.start)} to ${dayStr(ev.end)}`;
  return `${dayStr(ev.start)} · ${timeStr(ev.start)}`;
}
function upcoming(data, exp) {
  const now = Date.now() - 6 * 3600 * 1000;
  const limit = exp.datesAhead ? Date.now() + exp.datesAhead * 86400000 : Infinity;
  return data.events
    .filter((e) => e.exp === exp.id)
    .filter((e) => { const t = Date.parse(e.start); return t >= now && t <= limit; })
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}
const waLink = (msg) => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(msg)}`;
function priceInfo(e) {
  let min = null, group = false;
  for (const raw of String(e.prices || '').split('\n')) {
    const i = raw.indexOf('|');
    if (i < 0) continue;
    const label = raw.slice(0, i).trim(), val = raw.slice(i + 1);
    if (/optional|add.?on|^transport|^travel/i.test(label)) continue;
    const m = val.match(/₹\s*([\d,]+)/);
    if (!m) continue;
    const n = Number(m[1].replace(/,/g, ''));
    if (n && (min === null || n < min)) { min = n; group = /people|group/i.test(label) && !/per person/i.test(val); }
  }
  if (min === null && e.fromPrice && !/price on request/i.test(e.prices || '')) min = e.fromPrice;
  return { min, group };
}
const priceOnRequest = (e) => priceInfo(e).min === null;
const lowest = (e) => priceInfo(e).min;
const rupees = (n) => '₹' + Number(n).toLocaleString('en-IN');
const cover = (e, big) => (e && e.photos && e.photos[0] ? (big ? e.photos[0].url : e.photos[0].thumb) : '');

function md(text) {
  const lines = String(text || '').split('\n');
  let html = '', list = false;
  for (const raw of lines) {
    const l = raw.trim();
    if (l.startsWith('- ')) {
      if (!list) { html += '<ul class="ticks">'; list = true; }
      html += `<li>${esc(clean(l.slice(2)))}</li>`;
      continue;
    }
    if (list) { html += '</ul>'; list = false; }
    if (!l) continue;
    if (l.startsWith('## ')) html += `<h3>${esc(l.slice(3))}</h3>`;
    else html += `<p>${esc(clean(l))}</p>`;
  }
  if (list) html += '</ul>';
  return html;
}
function itineraryHtml(text) {
  let html = '', open = false;
  for (const raw of String(text || '').split('\n')) {
    const l = raw.trim();
    if (!l) continue;
    if (l.startsWith('## ')) {
      if (open) html += '</ol>';
      html += `<h3 class="day">${esc(l.slice(3))}</h3><ol class="timeline">`;
      open = true;
      continue;
    }
    if (!open) { html += '<ol class="timeline">'; open = true; }
    const [t, ...rest] = l.split('|');
    html += rest.length ? `<li><span class="t">${esc(t.trim())}</span><span>${esc(rest.join('|').trim())}</span></li>` : `<li><span class="t"></span><span>${esc(l)}</span></li>`;
  }
  if (open) html += '</ol>';
  return html;
}
function pricesHtml(text) {
  const rows = [], notes = [];
  for (const raw of String(text || '').split('\n')) {
    const l = raw.trim();
    if (!l) continue;
    const i = l.indexOf('|');
    if (i > 0) rows.push(`<tr><th>${esc(l.slice(0, i).trim())}</th><td>${esc(l.slice(i + 1).trim())}</td></tr>`);
    else notes.push(`<p class="note">${esc(l)}</p>`);
  }
  return (rows.length ? `<table class="prices">${rows.join('')}</table>` : '') + notes.join('');
}
function faqsHtml(text) {
  return String(text || '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).map((b) => {
    const [q, ...a] = b.split('\n');
    return `<details class="faq"><summary>${esc(q)}</summary><p>${esc(a.join(' '))}</p></details>`;
  }).join('');
}

// ---------- layout ----------
const ICON = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2Zm8 7 8-5H4l8 5Zm0 2L4 8v10h16V8l-8 5Z"/></svg>',
  insta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm5.2-3.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 3v5.4l3.6 2.1-1 1.7L11 13.5V7h2Z"/></svg>',
  people: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm8 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM2 20c0-3.3 3.1-6 7-6s7 2.7 7 6v1H2v-1Zm16 1v-1c0-1.6-.5-3-1.4-4.2 3 .4 5.4 2.4 5.4 4.9V21h-4Z"/></svg>',
  tag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 3h8l10 10-8 8L3 11V3Zm4.5 2.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></svg>',
};

const CSS = `
:root{--ink:#221d19;--ink2:#4a423b;--muted:#776c62;--paper:#f6f1e8;--card:#fffdf9;--line:#e4dccf;--forest:#2c4535;--forest2:#3d5c48;--moss:#e7eee3;--clay:#b8612f;--clay2:#9c4f24;--night:#141a24;--r:14px;--max:1160px}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--paper);color:var(--ink);font:400 17px/1.6 "DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}a{color:inherit}
h1,h2,h3,.display{font-family:"Big Shoulders Display","Arial Narrow",sans-serif;font-weight:800;line-height:1.02;letter-spacing:.01em;margin:0 0 .4em;text-transform:uppercase}
h1{font-size:clamp(44px,8vw,92px)}h2{font-size:clamp(34px,5vw,56px)}h3{font-size:26px;margin-top:1.4em}
p{margin:0 0 1em}
.wrap{max-width:var(--max);margin:0 auto;padding:0 20px}
.eyebrow{font:700 13px/1 "DM Sans",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--clay);margin:0 0 14px}
.lead{font-size:clamp(18px,2.2vw,21px);color:var(--ink2);max-width:62ch}
.btn{display:inline-flex;align-items:center;gap:10px;padding:14px 22px;border-radius:999px;font-weight:700;text-decoration:none;border:2px solid transparent;transition:transform .15s,background .15s;font-size:16px;line-height:1}
.btn svg{width:20px;height:20px}.btn:hover{transform:translateY(-1px)}
.btn-wa{background:var(--forest);color:#fff}.btn-wa:hover{background:var(--forest2)}
.btn-ghost{border-color:currentColor;color:inherit;background:transparent}
.btn-clay{background:var(--clay);color:#fff}.btn-clay:hover{background:var(--clay2)}
.row{display:flex;gap:12px;flex-wrap:wrap}
header.site{position:sticky;top:0;z-index:20;background:rgba(246,241,232,.92);backdrop-filter:saturate(1.4) blur(10px);border-bottom:1px solid var(--line)}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;height:68px}
.brand img{height:46px;width:auto}
nav.main{display:flex;gap:28px;align-items:center}
nav.main a{text-decoration:none;font-weight:500;font-size:16px}nav.main a:hover,nav.main a.on{color:var(--clay)}
nav.main .btn{padding:10px 16px;color:#fff}
.menu{display:none}
@media (max-width:820px){nav.main{display:none}.menu{display:block}
.menu summary{list-style:none;cursor:pointer;padding:10px;margin-right:-10px}.menu summary::-webkit-details-marker{display:none}
.menu summary span{display:block;width:24px;height:2px;background:var(--ink);margin:5px 0}
.menu[open] .panel{position:absolute;left:0;right:0;top:68px;background:var(--paper);border-bottom:1px solid var(--line);padding:8px 20px 20px;display:flex;flex-direction:column}
.menu .panel a{padding:14px 0;border-bottom:1px solid var(--line);text-decoration:none;font-size:20px;font-weight:500}
.menu .panel .btn{margin-top:16px;justify-content:center;border:0;color:#fff}}
.hero{position:relative;min-height:min(86vh,760px);display:flex;align-items:flex-end;color:#fff;overflow:hidden;background:var(--night)}
.hero img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,26,36,.15) 0%,rgba(20,26,36,.25) 45%,rgba(20,26,36,.82) 100%)}
.hero .wrap{position:relative;z-index:2;padding-bottom:64px;padding-top:120px;width:100%}
.hero .eyebrow{color:#f3c9a6}.hero p{color:#f1ece4;max-width:56ch;font-size:clamp(18px,2.2vw,21px)}
.hero .btn-ghost{color:#fff}
section{padding:84px 0}section.tight{padding:56px 0}
.sec-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:34px;flex-wrap:wrap}
.sec-head h2{margin:0}.sec-head a{font-weight:700;color:var(--clay);text-decoration:none}
.grid{display:grid;gap:24px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
.card{background:var(--card);border-radius:var(--r);overflow:hidden;text-decoration:none;display:flex;flex-direction:column;border:1px solid var(--line);transition:transform .2s,box-shadow .2s}
.card:hover{transform:translateY(-3px);box-shadow:0 14px 34px -18px rgba(34,29,25,.45)}
.card .ph{aspect-ratio:4/3;background:#d8d0c3;position:relative;overflow:hidden}
.card .ph img{width:100%;height:100%;object-fit:cover}
.badge{position:absolute;left:12px;top:12px;background:var(--card);color:var(--ink);font:700 13px/1 "DM Sans",system-ui,sans-serif;padding:8px 11px;border-radius:999px}
.badge.next{background:var(--forest);color:#fff}.badge.soon{background:#fff3e8;color:var(--clay2)}
.card .body{padding:18px 20px 22px;display:flex;flex-direction:column;gap:8px;flex:1}
.card h3{font-size:28px;margin:0}
.card p{color:var(--ink2);font-size:15.5px;margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.meta{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:14px;color:var(--muted);margin-top:auto;padding-top:10px}
.meta span{display:inline-flex;align-items:center;gap:5px}.meta svg{width:15px;height:15px}
.price{font-weight:700;color:var(--ink)}
.chips{display:flex;gap:8px;flex-wrap:wrap}
.chip{border:1.5px solid var(--line);background:var(--card);border-radius:999px;padding:9px 15px;font:500 15px/1 "DM Sans",system-ui,sans-serif;cursor:pointer;color:var(--ink)}
.chip.on,.chip:hover{border-color:var(--ink);background:var(--ink);color:#fff}
.cat{font:700 12px/1 "DM Sans",system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--forest2)}
.band{background:var(--forest);color:#fff}.band .eyebrow{color:#f3c9a6}.band .lead{color:#dfe8e0}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:34px 32px;margin-top:38px}
.stat b{display:block;font:800 clamp(42px,4.4vw,60px)/1 "Big Shoulders Display","Arial Narrow",sans-serif;color:#f3c9a6}
.stat span{display:block;margin-top:8px;color:#dfe8e0;font-size:16px}
.why{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:22px;margin-top:30px}
.why div{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:24px}
.why h3{font-size:24px;margin:0 0 8px}.why p{margin:0;color:var(--ink2);font-size:15.5px}
.reviews{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px}
.review{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:26px;margin:0}
.review blockquote{margin:0 0 16px;font-size:16px;color:var(--ink2);display:-webkit-box;-webkit-line-clamp:7;-webkit-box-orient:vertical;overflow:hidden}
.review blockquote:before{content:"\\201C";display:block;font:800 54px/0.6 "Big Shoulders Display","Arial Narrow",sans-serif;color:var(--clay);margin-bottom:6px}
.review figcaption{font-weight:700}
.cta{background:var(--night);color:#fff;border-radius:22px;padding:clamp(32px,6vw,64px);display:grid;gap:22px;grid-template-columns:1.4fr 1fr;align-items:center}
.cta p{color:#c9ced8;margin:0}.cta .btn-ghost{color:#fff}
@media (max-width:820px){.cta{grid-template-columns:1fr}}
.page-head{padding:64px 0 34px}
.page-head .lead{margin-top:10px}
.exp-hero{display:grid;grid-template-columns:1.25fr 1fr;gap:12px;margin-top:6px;height:min(520px,46vw)}
.exp-hero.one{grid-template-columns:1fr}
.exp-hero img{width:100%;height:100%;object-fit:cover;border-radius:var(--r);background:#d8d0c3;min-height:0}
.exp-hero .side{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:12px;min-height:0}
.exp-hero .side img:only-child{grid-column:span 2;grid-row:span 2}
.exp-hero .side img:first-child:nth-last-child(2),.exp-hero .side img:first-child:nth-last-child(2)~img{grid-column:span 2}
.exp-hero .side img:first-child:nth-last-child(3){grid-column:span 2}
@media (max-width:820px){.exp-hero{height:auto;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:10px;margin:0 -20px;padding:0 20px}
.exp-hero .main,.exp-hero .side img{flex:0 0 86%;scroll-snap-align:center;aspect-ratio:4/3;height:auto}.exp-hero.one .main{flex-basis:100%}.exp-hero .side{display:contents}}
.exp-layout{display:grid;grid-template-columns:minmax(0,1fr) 370px;gap:56px;align-items:start;margin-top:44px}
@media (max-width:960px){.exp-layout{grid-template-columns:1fr;gap:28px}}
.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin:26px 0 34px}
.facts div{display:flex;gap:12px;align-items:flex-start}.facts svg{width:22px;height:22px;flex:0 0 22px;color:var(--clay);margin-top:2px}
.facts small{display:block;color:var(--muted);font-size:13px;text-transform:uppercase;letter-spacing:.08em}
.facts b{font-weight:600}
.content h3{font-size:30px}
.ticks{list-style:none;padding:0;margin:0 0 1em}.ticks li{padding-left:30px;position:relative;margin:8px 0}
.ticks li:before{content:"";position:absolute;left:4px;top:.55em;width:12px;height:7px;border-left:2.5px solid var(--forest2);border-bottom:2.5px solid var(--forest2);transform:rotate(-45deg)}
.day{font-size:24px;color:var(--clay)}
.timeline{list-style:none;margin:0 0 10px;padding:0;border-left:2px solid var(--line)}
.timeline li{display:grid;grid-template-columns:110px 1fr;gap:14px;padding:10px 0 10px 20px;position:relative}
.timeline li:before{content:"";position:absolute;left:-7px;top:17px;width:12px;height:12px;border-radius:50%;background:var(--paper);border:2.5px solid var(--forest2)}
.timeline .t{font-weight:700;color:var(--forest2);font-size:15px}
@media (max-width:520px){.timeline li{grid-template-columns:1fr;gap:2px}}
.prices{width:100%;border-collapse:collapse;margin:6px 0 14px;background:var(--card);border-radius:var(--r);overflow:hidden;border:1px solid var(--line)}
.prices th,.prices td{padding:13px 16px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}
.prices th{font-weight:500}.prices td{font-weight:700;white-space:nowrap;text-align:right}
.prices tr:last-child th,.prices tr:last-child td{border-bottom:0}
.note{color:var(--ink2);font-size:15px}
.faq{border-bottom:1px solid var(--line);padding:4px 0}
.faq summary{cursor:pointer;font-weight:700;padding:14px 30px 14px 0;list-style:none;position:relative}
.faq summary::-webkit-details-marker{display:none}
.faq summary:after{content:"+";position:absolute;right:4px;top:8px;font-size:26px;font-weight:400;color:var(--clay)}
.faq[open] summary:after{content:"\\2212"}.faq p{color:var(--ink2);margin:0 0 16px}
.side-card{position:sticky;top:92px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px;box-shadow:0 20px 40px -30px rgba(34,29,25,.5)}
.side-card h3{margin:0 0 4px;font-size:28px}
.from{font-size:15px;color:var(--muted);margin-bottom:18px}.from b{font:800 34px/1 "Big Shoulders Display","Arial Narrow",sans-serif;color:var(--ink);margin-left:4px}
.dates{list-style:none;margin:0 0 18px;padding:0;display:flex;flex-direction:column;gap:8px}
.dates li{display:flex;justify-content:space-between;gap:10px;align-items:center;padding:11px 14px;border:1px solid var(--line);border-radius:12px;font-size:15px;font-weight:500}
.dates li a{font-size:13px;font-weight:700;color:var(--forest2);text-decoration:none;white-space:nowrap}
.dates details summary{cursor:pointer;color:var(--clay);font-weight:700;font-size:15px;padding:6px 0}
.nodates{background:var(--moss);border-radius:12px;padding:14px;font-size:15px;margin-bottom:18px}
.side-card .btn{width:100%;justify-content:center;margin-top:8px}
.side-card .small{font-size:13.5px;color:var(--muted);margin:14px 0 0;text-align:center}
.prose{max-width:760px}.prose h2{font-size:clamp(30px,4vw,44px);margin-top:1.2em}.prose h3{font-size:24px}
.split{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.split img{border-radius:18px;aspect-ratio:4/5;object-fit:cover;width:100%}
@media (max-width:820px){.split{grid-template-columns:1fr;gap:28px}}
.people{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}
.person{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:28px}
.person .role{color:var(--clay);font-weight:700;font-size:14px;letter-spacing:.1em;text-transform:uppercase}
.person h3{margin:6px 0 10px;font-size:34px}
.team{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;margin-top:8px}
.member{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:22px;display:flex;gap:18px;align-items:flex-start}
.member img,.member .avatar{width:76px;height:76px;flex:0 0 76px;border-radius:50%;object-fit:cover}
.member .avatar{display:grid;place-items:center;background:var(--forest);color:#f3c9a6;font:800 28px/1 "Big Shoulders Display","Arial Narrow",sans-serif}
.member .role{color:var(--clay);font-weight:700;font-size:12.5px;letter-spacing:.1em;text-transform:uppercase}
.member h3{margin:4px 0 6px;font-size:28px}.member p{margin:0;color:var(--ink2);font-size:15.5px}
.contact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
.contact-grid a{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px;text-decoration:none;display:flex;flex-direction:column;gap:8px;transition:transform .15s}
.contact-grid a:hover{transform:translateY(-2px)}
.contact-grid svg{width:30px;height:30px;color:var(--clay)}.contact-grid b{font-size:20px}.contact-grid span{color:var(--muted)}
.contact-grid a.primary{background:var(--forest);color:#fff;border-color:var(--forest)}.contact-grid a.primary svg{color:#f3c9a6}.contact-grid a.primary span{color:#dfe8e0}
footer.site{background:var(--ink);color:#d9d2c8;padding:60px 0 100px;margin-top:40px;font-size:15px}
footer.site .cols{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:34px}
@media (max-width:820px){footer.site .cols{grid-template-columns:1fr}}
footer.site h4{font:700 13px/1 "DM Sans",system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#f3c9a6;margin:0 0 16px}
footer.site a{display:block;text-decoration:none;padding:4px 0;color:#d9d2c8}footer.site a:hover{color:#fff}
footer.site .logo{height:60px;width:auto;filter:invert(1) brightness(1.4);mix-blend-mode:screen;margin-bottom:14px}
footer.site .fine{border-top:1px solid #3a332d;margin-top:40px;padding-top:20px;color:#9b9188;font-size:13.5px}
.float-wa{position:fixed;right:16px;bottom:16px;z-index:30;width:58px;height:58px;border-radius:50%;background:#25d366;color:#fff;display:grid;place-items:center;box-shadow:0 10px 26px -8px rgba(0,0,0,.45)}
.float-wa svg{width:32px;height:32px}
.bookbar{display:none}
@media (max-width:960px){.bookbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:31;background:var(--card);border-top:1px solid var(--line);padding:10px 16px calc(10px + env(safe-area-inset-bottom));gap:12px;align-items:center;justify-content:space-between;box-shadow:0 -10px 30px -20px rgba(0,0,0,.4)}
.bookbar small{display:block;color:var(--muted);font-size:12.5px}.bookbar b{font-size:15px}.bookbar .btn{padding:12px 18px}
body.has-bookbar .float-wa{display:none}body.has-bookbar footer.site{padding-bottom:120px}}
.muted{color:var(--muted)}
.hidden{display:none!important}
`;

const FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet">';

function layout({ title, desc, path, body, image, data }) {
  const full = title ? `${title} | Rock & Anchor` : 'Rock & Anchor | Authentic outdoor experiences in the Sahyadris';
  const nav = [['/experiences', 'Experiences'], ['/impact', 'Impact Created'], ['/about', 'About Us'], ['/team', 'Team'], ['/contact', 'Contact']];
  const navHtml = nav.map(([h, l]) => `<a href="${h}"${path.startsWith(h) ? ' class="on"' : ''}>${l}</a>`).join('');
  const wa = waLink('Hi Rock & Anchor, I would like to know more about your experiences.');
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(full)}</title><meta name="description" content="${esc(desc || '')}">
<link rel="canonical" href="${SITE.url}${path}"><link rel="icon" type="image/png" href="/favicon.png">
<meta property="og:type" content="website"><meta property="og:site_name" content="Rock & Anchor"><meta property="og:title" content="${esc(full)}"><meta property="og:description" content="${esc(desc || '')}">${image ? `<meta property="og:image" content="${esc(image)}">` : ''}
<meta name="theme-color" content="#f6f1e8">${FONTS}<style>${CSS}</style></head><body>
<header class="site"><div class="wrap"><a class="brand" href="/" aria-label="Rock & Anchor home"><img src="/logo.png" alt="Rock & Anchor" width="56" height="46"></a>
<nav class="main">${navHtml}<a class="btn btn-wa" href="${wa}">${ICON.wa}WhatsApp us</a></nav>
<details class="menu"><summary aria-label="Menu"><span></span><span></span><span></span></summary><div class="panel"><a href="/">Home</a>${navHtml}<a class="btn btn-wa" href="${wa}">${ICON.wa}WhatsApp ${SITE.phone}</a></div></details></div></header>
<main>${body}</main>
<footer class="site"><div class="wrap"><div class="cols">
<div><img class="logo" src="/logo.png" alt="Rock & Anchor"><p>Curated outdoor experiences in the Sahyadris, led by certified outdoor educators and the villagers who call these mountains home.</p></div>
<div><h4>Explore</h4><a href="/experiences">Experiences</a><a href="/impact">Impact Created</a><a href="/about">About Us</a><a href="/team">Team</a><a href="/contact">Contact</a></div>
<div><h4>Talk to us</h4><a href="tel:${SITE.tel}">${SITE.phone}</a><a href="${wa}">WhatsApp</a><a href="mailto:${SITE.email}">${SITE.email}</a><a href="https://instagram.com/${SITE.insta}">Instagram @${SITE.insta}</a></div>
</div><div class="fine">© ${new Date().getFullYear()} Rock & Anchor · <a style="display:inline" href="/terms">Terms</a> · <a style="display:inline" href="/privacy">Privacy</a> · <a style="display:inline" href="/cancellation-and-refunds">Cancellation and refunds</a><br>Bookings are confirmed over call or WhatsApp on ${SITE.phone}.</div></div></footer>
<a class="float-wa" href="${wa}" aria-label="WhatsApp Rock & Anchor">${ICON.wa}</a>
</body></html>`;
}

// ---------- components ----------
function badgeFor(data, e) {
  const up = upcoming(data, e);
  if (up.length) return `<span class="badge next">Next: ${esc(shortDay(up[0].start))}</span>`;
  if (e.categories.includes('Monsoon')) return '<span class="badge soon">Back next monsoon</span>';
  return '<span class="badge">Dates on request</span>';
}
function priceLine(e) {
  return priceOnRequest(e) ? '<span class="price">Price on request</span>' : `<span>From <span class="price">${rupees(lowest(e))}</span></span>`;
}
function card(data, e) {
  const img = cover(e);
  return `<a class="card" href="/experiences/${esc(e.slug)}" data-cats="${esc(e.categories.join('|'))}">
<div class="ph">${img ? `<img src="${esc(img)}" alt="${esc(e.title)}" loading="lazy">` : ''}${badgeFor(data, e)}</div>
<div class="body"><span class="cat">${esc(e.categories.slice(0, 2).join(' · '))}</span><h3>${esc(e.title)}</h3><p>${esc(e.summary)}</p>
<div class="meta">${e.age ? `<span>${ICON.people}${esc(e.age)}</span>` : ''}${e.location ? `<span>${ICON.pin}${esc(e.location)}</span>` : ''}${priceLine(e)}</div></div></a>`;
}
function reviewsBlock(list) {
  if (!list.length) return '';
  return `<div class="reviews">${list.map((r) => `<figure class="review"><blockquote>${esc(clean(r.text).trim())}</blockquote><figcaption>${esc(r.name)}</figcaption></figure>`).join('')}</div>`;
}
function ctaBlock(msg) {
  return `<section class="tight"><div class="wrap"><div class="cta"><div><p class="eyebrow">Plan your day outdoors</p><h2>Ready when you are</h2><p>We take bookings over call and WhatsApp, so a real person answers your questions, checks dates and suggests the right experience for your group.</p></div>
<div class="row"><a class="btn btn-clay" href="${waLink(msg || 'Hi Rock & Anchor, I would like to plan an experience.')}">${ICON.wa}WhatsApp us</a><a class="btn btn-ghost" href="tel:${SITE.tel}">${ICON.phone}${SITE.phone}</a></div></div></div></section>`;
}
const sorted = (data) => [...data.experiences].sort((a, b) => a.order - b.order);
const bySlug = (data, s) => data.experiences.find((e) => e.slug === s);

// ---------- pages ----------
function home(data) {
  const exps = sorted(data);
  const hero = bySlug(data, SITE.heroSlug) || exps[0];
  const nexts = exps.map((e) => ({ e, n: upcoming(data, e)[0] })).filter((x) => x.n).sort((a, b) => Date.parse(a.n.start) - Date.parse(b.n.start)).slice(0, 6);
  const featured = nexts.length >= 3 ? nexts.map((x) => x.e) : exps.slice(0, 6);
  const village = bySlug(data, 'be-a-villager');
  const body = `
<section class="hero"><img class="bg" src="${esc(cover(hero, true))}" alt="" fetchpriority="high"><div class="wrap">
<p class="eyebrow">Sahyadris · Since 2021</p><h1>Get outside.<br>Come back changed.</h1>
<p>Treks, stargazing, village stays and nature days for families, schools and teams, a short drive from Mumbai. Small groups, certified leaders, and villagers who know every trail.</p>
<div class="row"><a class="btn btn-clay" href="/experiences">See experiences</a><a class="btn btn-ghost" href="${waLink('Hi Rock & Anchor, I would like to know more about your experiences.')}">${ICON.wa}WhatsApp us</a></div></div></section>

<section><div class="wrap"><div class="sec-head"><div><p class="eyebrow">This season</p><h2>Coming up</h2></div><a href="/experiences">All experiences →</a></div>
<div class="grid">${featured.map((e) => card(data, e)).join('')}</div></div></section>

${data.impact.length ? `<section class="band"><div class="wrap"><p class="eyebrow">Impact created</p><h2>Every experience gives back</h2>
<p class="lead">A share of every booking goes to schools in the mountain villages we work in, and our trips are run with local guides and hosts who earn a fair living close to home.</p>
<div class="stats">${data.impact.map((i) => `<div class="stat"><b>${esc(i.value)}</b><span>${esc(i.metric)}</span></div>`).join('')}</div>
<p style="margin-top:34px"><a class="btn btn-ghost" style="color:#fff" href="/impact">See our impact</a></p></div></section>` : ''}

<section><div class="wrap"><p class="eyebrow">Why Rock & Anchor</p><h2>Outdoors, done properly</h2>
<div class="why">
<div><h3>Safety first</h3><p>Led by certified outdoor educators trained in wilderness first response and search and rescue. First aid on every trip.</p></div>
<div><h3>Hidden places</h3><p>Crowd-free trails, waterfalls, lakes and dark skies that most people never find on their own.</p></div>
<div><h3>Village hosts</h3><p>Home-cooked Maharashtrian food and the warmth of families who have lived here for generations.</p></div>
<div><h3>Made for your group</h3><p>Small groups, all permits handled, and private days for birthdays, schools and companies.</p></div>
</div></div></section>

${data.reviews.length ? `<section style="padding-top:0"><div class="wrap"><div class="sec-head"><div><p class="eyebrow">In their words</p><h2>What people say</h2></div></div>${reviewsBlock(data.reviews.slice(0, 6))}</div></section>` : ''}
${ctaBlock()}`;
  return layout({ title: '', desc: 'Authentic outdoor experiences in the Sahyadris near Mumbai: treks, stargazing, village stays and nature days for families, schools and teams.', path: '/', body, image: cover(hero, true), data });
}

function experiencesPage(data) {
  const exps = sorted(data);
  const cats = [...new Set(exps.flatMap((e) => e.categories))];
  const body = `<section class="page-head" style="padding-bottom:10px"><div class="wrap"><p class="eyebrow">Experiences</p><h1>Find your day outdoors</h1>
<p class="lead">Every experience is small group and led by our own team. Pick one, then call or WhatsApp us to book a date.</p>
<div class="chips" id="filters" style="margin-top:26px"><button class="chip on" data-f="">All</button>${cats.map((c) => `<button class="chip" data-f="${esc(c)}">${esc(c)}</button>`).join('')}</div></div></section>
<section style="padding-top:30px"><div class="wrap"><div class="grid" id="list">${exps.map((e) => card(data, e)).join('')}</div></div></section>
${ctaBlock()}
<script>(function(){var b=document.querySelectorAll('#filters .chip'),c=document.querySelectorAll('#list .card');function go(f){b.forEach(function(x){x.classList.toggle('on',x.dataset.f===f)});c.forEach(function(k){k.classList.toggle('hidden',!!f&&k.dataset.cats.split('|').indexOf(f)<0)})}b.forEach(function(x){x.addEventListener('click',function(){go(x.dataset.f);history.replaceState(null,'',x.dataset.f?'#'+encodeURIComponent(x.dataset.f):location.pathname)})});var h=decodeURIComponent(location.hash.slice(1));if(h)go(h)})();</script>`;
  return layout({ title: 'Experiences', desc: 'Treks, stargazing, village life, wildlife walks and family nature days in the Sahyadris near Mumbai.', path: '/experiences', body, image: cover(exps[0], true), data });
}

function experiencePage(data, e) {
  const up = upcoming(data, e);
  const ph = e.photos || [];
  const ask = (when) => waLink(`Hi Rock & Anchor, I would like to book ${e.title}${when ? ' on ' + when : ''}.`);
  const dateLi = (ev) => { const l = eventLabel(ev); return `<li><span>${esc(l)}</span><a href="${ask(l)}">Ask →</a></li>`; };
  const datesHtml = up.length
    ? `<p class="muted" style="font-size:14px;margin:0 0 8px">Upcoming dates</p><ul class="dates">${up.slice(0, 6).map(dateLi).join('')}</ul>${up.length > 6 ? `<details class="dates"><summary>${up.length - 6} more dates</summary><ul class="dates" style="margin-top:8px">${up.slice(6).map(dateLi).join('')}</ul></details>` : ''}`
    : `<div class="nodates">${e.categories.includes('Monsoon') ? 'This one runs in the monsoon (June to September). Message us to hear when dates open.' : 'Dates on request. Tell us your group size and preferred day and we will plan it with you.'}</div>`;
  const revs = data.reviews.filter((r) => (r.exp || []).includes(e.id));
  const fact = (icon, label, val) => (val ? `<div>${icon}<span><small>${label}</small><b>${esc(val)}</b></span></div>` : '');
  const body = `<section class="page-head" style="padding-bottom:0"><div class="wrap">
<p class="eyebrow"><a href="/experiences" style="text-decoration:none">Experiences</a> · ${esc(e.categories.join(' · '))}</p><h1>${esc(e.title)}</h1>
${ph.length ? `<div class="exp-hero${ph.length === 1 ? ' one' : ''}"><img class="main" src="${esc(ph[0].url)}" alt="${esc(e.title)}" fetchpriority="high">${ph.length > 1 ? `<div class="side">${ph.slice(1, 5).map((p) => `<img src="${esc(p.thumb)}" alt="${esc(e.title)}" loading="lazy">`).join('')}</div>` : ''}</div>` : ''}
<div class="exp-layout"><div class="content">
<p class="lead">${esc(e.summary)}</p>
<div class="facts">${fact(ICON.people, 'Who', e.age)}${fact(ICON.pin, 'Where', e.location)}${fact(ICON.clock, 'When', e.timing)}${fact(ICON.tag, 'Price', priceOnRequest(e) ? 'On request' : 'From ' + rupees(lowest(e)))}</div>
${md(e.description)}
${e.itinerary ? `<h3>The plan</h3>${itineraryHtml(e.itinerary)}` : ''}
${e.prices && !/^price on request/i.test(e.prices.trim()) ? `<h3>Pricing</h3>${pricesHtml(e.prices)}` : ''}
${e.faqs ? `<h3>Good to know</h3>${faqsHtml(e.faqs)}` : ''}
</div>
<aside class="side-card" id="book"><h3>${esc(e.title)}</h3><div class="from">${priceOnRequest(e) ? 'Price on request' : `From <b>${rupees(lowest(e))}</b> ${priceInfo(e).group ? 'per group' : 'per person'}`}</div>
${datesHtml}
<a class="btn btn-wa" href="${ask('')}">${ICON.wa}Book on WhatsApp</a><a class="btn btn-ghost" href="tel:${SITE.tel}">${ICON.phone}Call ${SITE.phone}</a>
<p class="small">No online payment. We confirm your spot over call or WhatsApp.</p></aside></div></div></section>
${revs.length ? `<section><div class="wrap"><h2>What people say</h2>${reviewsBlock(revs)}</div></section>` : ''}
${ctaBlock(`Hi Rock & Anchor, I would like to book ${e.title}.`)}
<div class="bookbar"><a href="#book" style="text-decoration:none"><small>${up.length ? 'Next date' : 'Dates'}</small><b>${up.length ? esc(dayStr(up[0].start)) : 'On request'}</b> <span style="color:var(--clay);font-size:13px;font-weight:700">${up.length > 1 ? 'All dates ↓' : ''}</span></a><a class="btn btn-wa" href="${ask('')}">${ICON.wa}Book</a></div>
<script>document.body.classList.add('has-bookbar')</script>`;
  return layout({ title: e.title, desc: e.summary, path: `/experiences/${e.slug}`, body, image: cover(e, true), data });
}

function aboutPage(data) {
  const img = cover(bySlug(data, 'winter-trekking'), true) || cover(sorted(data)[0], true);
  const body = `<section class="page-head"><div class="wrap"><p class="eyebrow">About us</p><h1>The Rock and the Anchor</h1>
<p class="lead">Rock & Anchor began on a trek in September 2021, when Aaditya and Mansi met on the trail and decided to build the kind of outdoor experiences they wished existed: small, safe, deeply local, and good for the villages that host them.</p></div></section>
<section style="padding-top:20px"><div class="wrap split"><div>${img ? `<img src="${esc(img)}" alt="A Rock & Anchor group in the Sahyadris" loading="lazy">` : ''}</div>
<div class="prose"><h2 style="margin-top:0">What we do</h2><p>We design outdoor experiences in the Sahyadris for families, schools, companies and curious adults: waterfall treks, stargazing nights, village stays, wildlife walks and survival skills.</p>
<p>Outdoor learning builds confidence, curiosity and care for the natural world. Every experience is planned so that people come back with more than photos: a skill, a story and a new way of seeing the place they live in.</p>
<h3>Our two pillars</h3><ul class="ticks"><li><b>Educate.</b> Our programmes teach nature, survival and life skills, and we reinvest in village schools with infrastructure, books and stationery.</li><li><b>Employ.</b> We hire and train villagers to lead and host, so families can earn a dignified living without leaving home.</li></ul></div></div></section>
<section><div class="wrap"><p class="eyebrow">The founders</p><h2>Who you will be outside with</h2><div class="people">
<div class="person"><span class="role">The Rock · Co-founder &amp; Outdoor Educator</span><h3>Aaditya Shah</h3><p>A former software engineer turned mountaineer and outdoor education leader. Thirteen years of exploring and leading hundreds of experiences in the US and India for people of all ages.</p>
<ul class="ticks"><li>Wilderness First Responder (USA)</li><li>Glacier travel, crevasse rescue and AIARE avalanche rescue</li><li>Diploma in Mountaineering and Allied Sports (topped the course)</li><li>Sahyadri Search &amp; Rescue</li></ul></div>
<div class="person"><span class="role">The Anchor · Co-founder &amp; Outdoor Educator</span><h3>Mansi Nayyar</h3><p>A creative supervisor and trekker who has spent ten years leading offbeat treks across the Sahyadris, with treks led in Vietnam, Bhutan and Nepal and 450+ travel experiences curated.</p>
<ul class="ticks"><li>Wilderness First Aid</li><li>Basic Rock Climbing and Mountain Biking</li><li>Cannes Lions Silver and Bronze 2025</li></ul></div>
</div><p class="lead" style="margin-top:34px">Our team today includes villagers from the communities we work in, trained in leadership, first aid and our safety procedures.</p></div></section>
${ctaBlock()}`;
  return layout({ title: 'About Us', desc: 'Rock & Anchor was founded by Aaditya Shah and Mansi Nayyar to create safe, local, meaningful outdoor experiences in the Sahyadris.', path: '/about', body, image: img, data });
}

function impactPage(data) {
  const img = cover(bySlug(data, 'be-a-villager'), true);
  const img2 = cover(bySlug(data, 'little-feet-sunset-safari'), true);
  const body = `<section class="page-head"><div class="wrap"><p class="eyebrow">Impact created</p><h1>Good for people. Good for the villages.</h1>
<p class="lead">25% of every experience funds schools in the mountain villages we work in. And every trip is hosted and guided by people who live there.</p></div></section>
${data.impact.length ? `<section class="band tight"><div class="wrap"><div class="stats" style="margin-top:0">${data.impact.map((i) => `<div class="stat"><b>${esc(i.value)}</b><span>${esc(i.metric)}</span></div>`).join('')}</div></div></section>` : ''}
<section><div class="wrap split"><div class="prose"><p class="eyebrow">Educate</p><h2 style="margin-top:0">Schools in the hills</h2><p>Profits from our experiences go back into village schools. So far we have painted and equipped schools with water coolers, fans, textbooks and stationery, and installed lights, fans, solar panels and inverters in schools and anganwadis.</p><p>Guests often spend time teaching and playing with village children, and our programmes for city children build a love for nature, survival skills and an understanding of sustainability.</p></div>
<div>${img ? `<img src="${esc(img)}" alt="Children at a Rock & Anchor village experience" loading="lazy">` : ''}</div></div></section>
<section style="padding-top:0"><div class="wrap split"><div>${img2 ? `<img src="${esc(img2)}" alt="Families with village hosts" loading="lazy">` : ''}</div>
<div class="prose"><p class="eyebrow">Employ</p><h2 style="margin-top:0">Livelihoods close to home</h2><p>Villagers know these mountains better than anyone, which makes our experiences safer and more authentic. We train local hosts and guides to lead trips using our procedures, with skills in leadership, communication, first aid and outdoor management.</p><p>Jobs in the village mean families can stay together instead of migrating to the city for work.</p>
<h3>Search and rescue</h3><p>Our team volunteers with Sahyadri search and rescue, with 48 live rescues to date.</p></div></div></section>
${ctaBlock()}`;
  return layout({ title: 'Impact Created', desc: '25% of every Rock & Anchor experience funds village schools, and our trips employ local guides and hosts in the Sahyadris.', path: '/impact', body, image: img, data });
}

function teamPage(data) {
  const team = data.team || [];
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const groups = TEAM_GROUPS.concat([...new Set(team.map((t) => t.group))].filter((g) => g && !TEAM_GROUPS.includes(g)))
    .map((g) => ({ g, people: team.filter((t) => t.group === g).sort((a, b) => a.order - b.order) })).filter((x) => x.people.length)
    .reduce((acc, x) => { const last = acc[acc.length - 1]; if (x.people.length === 1 && x.g !== 'Founders' && last && last.solo) { last.people.push(...x.people); last.g = 'Behind the scenes'; } else acc.push({ ...x, solo: x.people.length === 1 && x.g !== 'Founders' }); return acc; }, []);
  const body = `<section class="page-head"><div class="wrap"><p class="eyebrow">Team</p><h1>The people behind your day outdoors</h1>
<p class="lead">A small team of outdoor educators, experience leaders and village hosts who plan every detail, lead every group and look after you from the first message to the walk back.</p></div></section>
${groups.map(({ g, people }) => `<section class="tight" style="padding-top:10px"><div class="wrap"><h2>${esc(g)}</h2><div class="team">${people.map((p) => `<div class="member">${p.photo ? `<img src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy">` : `<div class="avatar">${esc(initials(p.name))}</div>`}<div><span class="role">${esc(p.role)}</span><h3>${esc(p.name)}</h3><p>${esc(p.bio)}</p></div></div>`).join('')}</div></div></section>`).join('')}
${ctaBlock()}`;
  return layout({ title: 'Team', desc: 'Meet the Rock & Anchor team: founders, experience leaders, business development and social media.', path: '/team', body, data });
}

function contactPage(data) {
  const body = `<section class="page-head"><div class="wrap"><p class="eyebrow">Contact</p><h1>Let's plan your day outdoors</h1>
<p class="lead">Bookings happen over call or WhatsApp. Tell us the experience, your group size and preferred dates, and we will take it from there. WhatsApp is usually the fastest.</p></div></section>
<section style="padding-top:10px"><div class="wrap"><div class="contact-grid">
<a class="primary" href="${waLink('Hi Rock & Anchor, I would like to plan an experience.')}">${ICON.wa}<b>WhatsApp</b><span>${SITE.phone}</span></a>
<a href="tel:${SITE.tel}">${ICON.phone}<b>Call us</b><span>${SITE.phone}</span></a>
<a href="mailto:${SITE.email}">${ICON.mail}<b>Email</b><span>${SITE.email}</span></a>
<a href="https://instagram.com/${SITE.insta}">${ICON.insta}<b>Instagram</b><span>@${SITE.insta}</span></a>
</div>
<div class="prose" style="margin-top:56px"><h2>Private groups</h2><p>Birthdays, schools, colleges, companies and residential societies: most of our experiences can be run privately and shaped around your group. Message us with what you have in mind.</p></div></div></section>`;
  return layout({ title: 'Contact', desc: `Book Rock & Anchor experiences over call or WhatsApp on ${SITE.phone}.`, path: '/contact', body, data });
}

const POLICIES = {
  'cancellation-and-refunds': { title: 'Cancellation and Refunds', body: "## Rescheduling policy\nIf you need to reschedule your trip:\n- A rescheduling fee of 25% will be charged.\n- Rescheduled trips must be booked within 3 months from the original trip date.\n- Rescheduling requests made within 3 days of the trip start date will not be accommodated.\n## Cancellation policy\nCancellations will incur the following charges based on the time of cancellation:\n- 7 to 10 days before the trip start date: 30% of the total booking amount will be retained; the remaining 70% will be applied toward a future booking.\n- 4 to 6 days before the trip start date: 50% of the total booking amount will be retained; the remaining 50% will be applied toward a future booking.\n- Less than 3 days before the trip start date: 75% of the total booking amount will be retained; the remaining 25% will be applied toward a future booking.\n- No show: 100% of the payment will be retained. No refunds or credits will be provided.\n## Medical policy\nIn case of trip cancellation or interruption due to a medical emergency:\n- Guests must provide valid medical documentation to apply for a rescheduling or partial refund.\n- Rescheduling due to medical reasons will waive the rescheduling fee, but standard retention rates (as per the cancellation policy) will still apply.\n## Group medical emergencies\nIf a group of guests is unable to attend the trip due to a medical emergency affecting one or more members (for example, a child):\n- Valid medical documentation must be provided.\n- The entire group can reschedule without paying a rescheduling fee.\n- If the request is made within 3 days of the trip start date, 25% of the total booking amount will be retained to cover operational costs.\n- The rescheduled trip must take place within 3 months of the original date, subject to availability.\n## Refunds due to external factors\nA full 100% refund will be processed in the event of cancellations caused by:\n- Issues on our end, such as overbooking.\n- Cancellation due to bad weather, communicated before the trip starts.\nRefunds are processed to the original payment method. For any questions, call or WhatsApp us on +91 89287 94380." },
  terms: { title: 'Terms and Conditions', body: "Thank you for choosing Rock & Anchor. To ensure a seamless and enjoyable experience, please read the following terms before you book. Your understanding and cooperation help us maintain a unique and harmonious village environment for all guests.\n## Before you book\n- Village stay experience: this is a rural camping and village stay, not a luxury hotel. Guests will experience authentic village life, including its simplicity and charm.\n- Limited services: food delivery services like Swiggy or Zomato are not available. Essentials are sourced from the nearest town, about 10 km away.\n## Pricing categories\n- Adults: age 18 and above.\n- Teenagers: age 13 to 18.\n- Children: age 3 to 12.\n- Students: special rates are available with a valid student ID.\n- Children under 3 stay free, but no additional bedding will be provided.\n- Age related discounts or special rates require valid ID proof at check in.\n- Group bookings with mixed age groups are charged on individual category rates.\nWe offer tailored packages for student groups, colleges, universities and companies. Contact us for details.\n## After you book\nRescheduling, cancellation, medical and refund terms are set out in our Cancellation and Refunds policy.\n## Arrival\nHealth protocols will be followed as per government recommendations at the time of the trip.\n## Drivers, staff and nannies\n- Separate lodging, boarding and food is available for drivers, staff or nannies at ₹1,000 per person.\n- If a nanny stays with the child in a tent and uses guest facilities, they will be charged as a full paying guest.\n## Pets\nWe welcome friendly pets who can coexist peacefully with the resident animals at our village properties, including dogs, buffaloes, hens and roosters.\n## Guest behaviour\nWe reserve the right to refuse entry or accommodation to guests whose behaviour disrupts the comfort and safety of others.\n## At the campsite\n- We maintain a tranquil environment and generally do not allow very loud music. Please check with us for special arrangements.\n- The campsite has no electricity. Please charge your devices at the host home during meal times and carry a power bank.\n- Ola and Uber are not reliable. Please book your transport beforehand. We can share numbers for rickshaws and taxis.\n- There is limited mobile network in the village, so please let your family know once you have arrived.\n## Waste and sustainability\nThere is no municipal waste management in the village. All trash generated during your visit is either responsibly disposed of or carried back to Mumbai for processing. Please bring food in reusable containers to minimise waste.\n## Indemnity\n- Rock & Anchor shall not be responsible for any delays or alterations in the programme, or expenses incurred directly or indirectly, due to natural hazards, accidents, breakdown of equipment or transport, weather, sickness, landslides, political closures or any untoward incidents.\n- Rock & Anchor shall not be responsible for any loss, injury or damage to person or property in connection with any accommodation, transportation or other services, resulting directly or indirectly from any act of God, fire, accident, breakdown of machinery, equipment or transport, civil disturbances, strikes, theft, wildlife, epidemics, regulations, or any other causes beyond our control.\n- Rock & Anchor does not hold insurance covering accident, sickness, theft or other loss. Guests are advised to arrange their own insurance. All baggage and personal property are at the guest's risk at all times.\n- By choosing to travel with Rock & Anchor, guests acknowledge that Rock & Anchor and its employees, subcontractors and suppliers do not accept liability for any damage or loss of property, or injury (fatal or otherwise). This applies to the accommodation and to any activities in the surrounding land.\nBy confirming a booking with us you agree to these terms." },
  privacy: { title: 'Privacy Policy', body: "## What we collect\nWhen you enquire or book with us, we collect the personal information you give us, such as your name, phone number and email address, so we can plan and run your experience.\nWhen you browse this website, our hosting provider may automatically receive technical information such as your IP address and browser type. We use this only to keep the site working and secure.\n## Consent\nWhen you share personal information to make a booking, you consent to us using it for that purpose only. If we ask for your information for another reason, such as marketing, we will ask you directly or give you a chance to say no.\nYou can withdraw your consent at any time by writing to hello@rockandanchor.in.\n## Disclosure\nWe may disclose your personal information if we are required by law to do so or if you violate our Terms and Conditions.\n## Payments\nPayments are arranged directly with our team. Where a payment gateway is used, it handles your payment details under its own security standards and privacy policy; we do not store card data.\n## Third party services\nThird party providers we use only collect, use and disclose your information to the extent needed to provide their services to us. Links on this site, such as WhatsApp or Instagram, take you to services governed by their own privacy policies.\n## Security\nWe take reasonable precautions and follow industry best practices so that your personal information is not lost, misused, accessed, disclosed, altered or destroyed.\n## Age of consent\nBy using this site you confirm that you are an adult, or that you have the consent of a parent or guardian.\n## Changes to this policy\nWe may update this policy from time to time. Changes take effect when they are posted on this page.\n## Questions\nTo access, correct or delete personal information we hold about you, or to raise a concern, write to hello@rockandanchor.in." },
};
function policyPage(slug, data) {
  const p = POLICIES[slug];
  const body = `<section class="page-head"><div class="wrap prose"><p class="eyebrow">Policies</p><h1>${esc(p.title)}</h1></div></section><section style="padding-top:0"><div class="wrap prose content">${md(p.body)}</div></section>`;
  return layout({ title: p.title, desc: `Rock & Anchor ${p.title.toLowerCase()}.`, path: `/${slug}`, body, data });
}
function notFound(data) {
  const body = `<section class="page-head"><div class="wrap"><p class="eyebrow">404</p><h1>Off the trail</h1><p class="lead">We could not find that page. It may have moved when we rebuilt the site.</p><div class="row"><a class="btn btn-clay" href="/experiences">See experiences</a><a class="btn btn-ghost" href="/">Home</a></div></div></section>`;
  return layout({ title: 'Page not found', desc: '', path: '/404', body, data });
}

// ---------- routing ----------
const REDIRECTS = {
  '/about-us': '/about', '/contact-us': '/contact', '/join-an-experience': '/experiences', '/shop': '/experiences',
  '/privacy-policy': '/privacy', '/terms-conditions': '/terms', '/cancellation-policy': '/cancellation-and-refunds',
  '/refund-returns': '/cancellation-and-refunds', '/shipping-policy': '/terms', '/special-offer': '/experiences',
  '/trip-review': '/', '/media': '/', '/cart': '/experiences', '/checkout': '/experiences', '/my-account': '/',
};
const OLD_PRODUCTS = {
  'greatest-show': 'greatest-show-on-earth', 'little-feet-big-trails': 'little-feet-sensory', 'the-night-sky-experience': 'night-sky-experience',
  'ridge-and-lake-chasing-sunsets': 'ridge-and-lake', 'the-hidden-kingdom': 'hidden-kingdom', 'monsoon-village-experience-1-day': 'monsoon-village-1-day',
};
const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const html = (s, status = 200, src = '') => new Response(s.replace(/<a ([^>]*?)href="(https:\/\/(?:wa\.me|instagram\.com)[^"]*)"/g, '<a $1href="$2" target="_blank" rel="noopener"'), { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=60', 'X-Data-Source': src } });

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.hostname.startsWith('www.')) { url.hostname = url.hostname.slice(4); return Response.redirect(url.toString(), 301); }
    let path = url.pathname.replace(/\/+$/, '') || '/';
    if (path === '/logo.png') return new Response(b64(LOGO), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=604800' } });
    if (path === '/favicon.png' || path === '/favicon.ico') return new Response(b64(FAVICON), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=604800' } });
    if (path === '/robots.txt') return new Response(`User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
    if (REDIRECTS[path]) return Response.redirect(new URL(REDIRECTS[path], url).toString(), 301);
    let m = path.match(/^\/product\/([^/]+)/);
    if (m) return Response.redirect(new URL(`/experiences/${OLD_PRODUCTS[m[1]] || m[1]}`, url).toString(), 301);
    if (path.startsWith('/wp-') || path.startsWith('/product-category')) return Response.redirect(new URL('/', url).toString(), 301);

    const data = await getData(env, ctx);
    if (path === '/sitemap.xml') {
      const urls = ['/', '/experiences', '/impact', '/about', '/team', '/contact', ...data.experiences.map((e) => `/experiences/${e.slug}`)];
      return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${SITE.url}${u}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
    }
    if (path === '/') return html(home(data), 200, data.source);
    if (path === '/experiences') return html(experiencesPage(data));
    m = path.match(/^\/experiences\/([^/]+)$/);
    if (m) {
      const e = bySlug(data, decodeURIComponent(m[1]));
      if (e) return html(experiencePage(data, e));
      const alias = OLD_PRODUCTS[m[1]];
      if (alias) return Response.redirect(new URL(`/experiences/${alias}`, url).toString(), 301);
      return html(notFound(data), 404);
    }
    if (path === '/about') return html(aboutPage(data));
    if (path === '/team') return html(teamPage(data), 200, data.source);
    if (path === '/impact') return html(impactPage(data));
    if (path === '/contact') return html(contactPage(data));
    if (POLICIES[path.slice(1)]) return html(policyPage(path.slice(1), data));
    return html(notFound(data), 404);
  },
};
