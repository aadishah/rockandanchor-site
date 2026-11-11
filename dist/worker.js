// Rock & Anchor website. A single Cloudflare Worker that reads Airtable.
// Edit content in Airtable (base Rock&Anchor). Pages refresh within about 5 minutes.
// Secret needed: AIRTABLE_TOKEN (read only). Without it the site shows a built-in snapshot.

const BASE = 'app0sjg0lmpX4ERo1';
const T = { exp: 'tblG7E0qqHtLi6FWF', ev: 'tblnbaixvh6vsXuj2', rev: 'tblj3xNFQV7dKuine', imp: 'tblpfX3SNtM7qTNNf', team: 'tblBOYVbIlfeBRg4w' };
const EF = {
  name: 'fldlKTxLU6u6l2qFm', title: 'fldM3NSq47YsF9tR2',
  show: 'fldPkhXdD91l3gZ8Y', slug: 'fld4JwhapQZdKtBcA', order: 'fld0ZNPcdfO412lmd',
  summary: 'fldQm3jgyBV5X1nzK', description: 'fldylkcJyzF9uK0Xi', photos: 'fldiamuh0iIFn0Fjs', itinerary: 'fldePmvVNr0Plgo4D',
  faqs: 'fld89jnU68Zl9q6nM', contact: 'fld56hCJ24gyK8iV0', datesFrom: 'fldejM8Uf4j3VcXr2', prices: 'fldLEraHeNPgjjG8T', age: 'fldF1U1n4ks9FSFtP', location: 'fld2m8zyHAoKGlZEi',
  timing: 'fldWvIcsAEx3PJYKN', categories: 'fldIyJ28XTWNtfRm3', datesAhead: 'fld99ABUSbxPmP0v7',
};
const VF = { start: 'fldWr96uilLEjfI24', end: 'fldLWXxoeM3Xr7Qkd', exp: 'fldTwb0rZY39trwD4', status: 'fldEueCyQC6zJEEux', hide: 'fldYwt0HrpvixX8gg' };
const RF = { name: 'fldIgYRm1oIN51m2Z', text: 'fldoiPyv0cAhFNMtJ', exp: 'fldCKUcXdn2vivo5h', show: 'fldwAqYVwcDDwqxLf', photo: 'fldsq62JdBgiw4j8A' };
const TF = { name: 'fldOCEREnRFIAh8zc', role: 'fldgPjOaXv7pTdwmD', group: 'fldfnCycPmtEiabk9', bio: 'fldKNHwt0dVNiP8td', photo: 'fldx0IblfxhE0GYqL', order: 'fldH11Xe1zRMSZjm6', show: 'fldEH77VIUX1fdM6c',
  joined: 'fld4STp2AroKaSvaQ', learned: 'fld4BlKDhsKL2zAbt', building: 'fldR905xb7rpp0vyz', from: 'fldN74fuymMhezvYj', kinds: 'fldj9E9s2cXNzQ0zq' };
const TEAM_GROUPS = ['Founders', 'Experience Leaders', 'Business Development', 'Social Media'];
const IF = { metric: 'fldX1aQLHwAWY4A0C', value: 'fldcFhyLkZhdUiyF2', order: 'fldWCIzvRPTsj0hQW', show: 'fldMKHdAIyLWJJsKQ', category: 'fldoPU4x6KqBKNdrY', opens: 'fldkAcX2ofFwe8OgO' };
// Impact Created evidence. Rows only appear publicly when Show on Website is ticked.
const IT = { proj: 'tblO5fhefTEiwPCrL' };
// Website Page Photos: one row per photo spot on Home, About Us, Impact Created and Team.
const PP = { table: 'tblzv9vppnT0t3ASr', slot: 'fldHCkMOQq2cgWxNB', photo: 'fldmrI2y69VgI6nRz', alt: 'fld1FiXLRsfBUEWwQ', focus: 'fldepHEkij6OSKfOw' };
const FOCUS = { Center: 'center center', Top: 'center 0%', Upper: 'center 30%', Lower: 'center 70%', Bottom: 'center 100%', Left: '0% center', Right: '100% center' };
const PJ = { title: 'fldTSF31PRLJ2VDeM', show: 'fldHwPFRFC0ei7dsQ', order: 'fld5u5mysc1bnMX6K', category: 'fld5UnNMP9SNHFLJ3', year: 'fldGlQfsKw3M6ZuXI', area: 'fldA8qAyT2ixMo8Io', saw: 'fldx1ED4Oddqyvx9h', did: 'fldy7AxYXMBasLAan', who: 'fldmDFfJ8fYM51NgE', changed: 'fldZKJATOSDzZOjDN', next: 'fldc3WXuspgOcij8y', status: 'fldpKDvyuT7aO26YN', photo: 'fldW56CKYufKiFFhA' };
const LIVE_STATUSES = ['Approved'];
const CACHE_SECONDS = 300;

const SITE = {
  name: 'Rock & Anchor',
  url: 'https://rockandanchor.in',
  phone: '+91 89287 94380',
  tel: '+918928794380',
  wa: '918928794380',
  email: 'hello@rockandanchor.in',
  insta: '_rockandanchor',
  social: [
    ['YouTube', 'https://www.youtube.com/@thecyclewala', 'yt'],
    ['Instagram', 'https://instagram.com/_rockandanchor/', 'ig'],
    ['Facebook', 'https://www.facebook.com/rockandanchor/', 'fb'],
    ['LinkedIn', 'https://www.linkedin.com/company/rock-and-anchor/', 'li'],
  ],
  heroSlug: 'ridge-and-lake',
};

const SNAPSHOT = {"experiences":[{"id":"rec2ZtYTJkhhBie5P","title":"Rooftop Stargazing","slug":"rooftop-stargazing","order":5,"summary":"Stargazing right here in Mumbai. Look at the Moon, planets and stars through a telescope with a Rock & Anchor guide, from a city rooftop.","description":"## What you'll see\n- The Moon\n- Planets\n- Stars and constellations\n\n## Private experiences\nAlso available for birthdays, schools, corporates, events and residential societies.\n\n## What's included\n- Experienced astronomer and facilitators\n- Professional telescope\n- Guided tour of the Moon, planets and constellations\n- Clean washrooms at the venue","itinerary":"7:00 pm | Meet on the rooftop, welcome and introduction to the night sky\n7:20 pm | The Moon and planets through the telescope\n8:00 pm | Constellations and the stories behind them\n8:45 pm | Questions and wrap up\n9:00 pm | Depart","faqs":"What if it is cloudy?\nIf clouds hide the sky, we reschedule or turn the session into an astronomy storytelling evening. If we cancel, you get a full refund.\n\nCan we book a private session?\nYes, for birthdays, schools, companies, events and residential societies.","prices":"Price on request. Call or WhatsApp us.","age":"Ages 6+","location":"Mumbai · a rooftop in the city","timing":"7:00 pm to 9:00 pm","categories":["Stargazing","Family & Kids","Private & Groups"],"fromPrice":700,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-4.jpg"}]},{"id":"rec7yorjjv9g6gILU","title":"Project: Mini Splash","slug":"project-mini-splash","order":22,"summary":"A mindful monsoon escape for adults and teens: trek past streams to hidden waterfalls, sip tea at a village home and take a dip in a lake.","description":"A one-day outdoor experience for adults and teens in the Sahyadris. Trek past streams to hidden waterfalls, sip tea at a village home and take a dip in a lake, on a trail that is quiet, lush and made for nature lovers.\n\n## Highlights\n- Trek past streams with waterfall halts\n- Time at the main waterfall\n- Skipping stones, floating and a dupki in the lake\n- Tea at a village home\n- Optional traditional village lunch\n\n## What's included\n- Guided trek with Rock & Anchor leaders\n- Waterfall experience\n- Breakfast: poha and nimbu pani\n- First aid support\n- Village home access for changing\n- 4K photos and videos, shared online for a year\n- All permits and fees","itinerary":"7:30 am | Arrive at the base village, welcome circle, breakfast\n8:00 am | Start the trek, waterfall halts\n9:30 am | Main waterfall\n10:00 am | On to the lake: skipping stones, floating and dupki\n11:00 am | Tea at a village home\n11:15 am | Trail back to the base village\n1:00 pm | Village lunch (optional)\n1:30 pm | Leave for home","faqs":"How big is the group?\n15 to 20 people.\n\nWhat is the terrain like?\nForest paths, soft mud, rock, mild to medium slopes.\n\nWhat if it rains?\nWe only reschedule for thunderstorms.","prices":"Per person | ₹2,000\nFestive offer, child (8+) | ₹1,800\nFestive offer, adult | ₹1,600","age":"Ages 13+","location":"Sahyadris · 1.5 hrs from Dadar","timing":"7:30 am to 1:30 pm","categories":["Treks","Monsoon"],"fromPrice":2000,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/mini-splash-4.jpg"}]},{"id":"rec8Qu6E2UZeocjE7","title":"Be a Villager","slug":"be-a-villager","order":4,"summary":"A hands-on day in village life. Plant with farmers, help with village work, cook a local meal, eat what you helped make, and explore how a village really works.","description":"## Live, work, eat, explore\n- Meet a local family\n- Learn farming\n- Help with village activities\n- Cook and eat local\n- Explore the village\n\n## Private experiences\nAvailable for birthdays, schools, corporates and events.\n\n## What's included\n- Time with a local host family\n- Farming and village activities\n- Home-cooked local lunch\n- Guided village walk\n- Rock & Anchor facilitator and first aid support","itinerary":"9:00 am | Arrive and meet your host family\nMorning | Learn farming in the fields with the villagers\n1:00 pm | Cook and eat a local meal you helped make\nAfternoon | Help with village activities and explore how the village works\n5:00 pm | Goodbye circle and depart","faqs":"What if it rains?\nThe experience goes on in all weather.\n\nCan we book a private day?\nYes, for birthdays, schools, companies and events. Message us with your group size.","prices":"Price on request. Call or WhatsApp us.","age":"Ages 6+","location":"Karjat · 1.5 hrs from Dadar","timing":"9:00 am to 5:00 pm","categories":["Village Life","Family & Kids"],"fromPrice":3000,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/be-a-villager-4.jpg"}]},{"id":"recCERBptmvu3WC5B","title":"Winter Trekking","slug":"winter-trekking","order":9,"summary":"Moderate winter treks across the Sahyadris: Dadima's Peak, the Enchanted Forest, Ridge & Lake, 1500 m peaks and more.","description":"## Trails this winter\n- Dadima's Peak\n- Enchanted Forest\n- Ridge & Lake\n- 1500 m peaks and more\n\n## Why go?\n- Build confidence in the outdoors\n- Develop curiosity and appreciation for nature\n- Spend time with like-minded peers\n\n## What's included\n- Rock & Anchor certified trek leaders\n- Local guide\n- First aid support\n- All permits","itinerary":"7:00 am | Meet at the base village and briefing\nMorning | Trek to the top with rest stops along the way\nMidday | Time at the top: views, snacks and photos\nAfternoon | Trek back down\n4:00 pm | Depart","faqs":"How hard are these treks?\nModerate. You should be comfortable walking for 5 to 6 hours with some steep sections.\n\nWhich trek is on which date?\nMessage us and we will tell you the trail for each date.","prices":"Price on request. Call or WhatsApp us.","age":"Ages 10+","location":"Sahyadris · up to 3 hrs from Dadar","timing":"7:00 am to 4:00 pm","categories":["Treks"],"fromPrice":null,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/winter-trekking-4.jpg"}]},{"id":"recGe4O48b5CHf426","title":"Floating Picnic","slug":"floating-picnic","order":21,"summary":"A morning for families and friends: a short trek to a lakeside picnic, floating, a dupki and games, on a quiet, lush trail.","description":"A morning designed for families and friends to spend quality time together in nature. The trail is quiet, lush and easy going, with a picnic by the lake at the end of it.\n\n## Highlights\n- A short trek with learning halts and relaxed pacing\n- Picnic by the lake with snacks and team games\n- Skipping stones, floating and a dupki in the lake\n- Optional traditional village lunch, grown in the village\n\n## What's included\n- Guided trek with Rock & Anchor leaders\n- Breakfast: poha, chai, coffee and nimbu pani\n- Picnic snacks: fruits, berries, cheese and crackers\n- First aid support\n- Village home access for changing\n- 4K photos and videos, shared online for a year\n- All permits and fees","itinerary":"8:00 am | Arrive at the base village, welcome circle\n8:30 am | Start the trek, with learning halts\n9:00 am | Picnic area: snacks, team games, skipping stones, floating and dupki\n11:30 am | Walk back up\n12:15 pm | Freshen up, optional lunch\n1:00 pm | Leave for home","faqs":"How big is the group?\n15 to 20 people.\n\nWhat is the terrain like?\nForest paths, soft mud, rock, mild to medium slopes.\n\nWhat if it rains?\nDrizzles are fun! We only reschedule for thunderstorms.","prices":"Adult | ₹1,800\nChild (2 to 9) | ₹1,500\nVillage lunch (optional) | ₹300","age":"Ages 2+","location":"Sahyadris · 1.5 hrs from Dadar","timing":"8:00 am to 1:00 pm","categories":["Family & Kids","Monsoon"],"fromPrice":1800,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/floating-picnic-4.jpg"}]},{"id":"recSXQ2tQxqLEpN0C","title":"Little Feet: A Sensory Experience","slug":"little-feet-sensory","order":1,"summary":"A nature morning for toddlers and their parents in the Sahyadris. Let them discover nature at their own pace, using their hands, eyes, ears and curiosity.","description":"## What they'll do\n- Nature walk and sensory trail\n- Planting\n- Stone painting\n- Flower and vegetable printing\n- Colour hunts\n\n## Why it works for little ones\nChildren between 1 and 6 learn best through play. We balance safety, structure and freedom so every child feels both secure and adventurous.\n- Supervised freedom: kids explore with guides and parents nearby. Real adventure for them, peace of mind for you.\n- Directed play: songs, nature crafts and sensory trails introduce new skills.\n- Undirected play: time to wander, imagine and invent their own games.\n\n## For parents\nYou join the games and activities. Our guides handle structure and safety so you can focus on playful time together.\n\n## What's included\n- Breakfast\n- Local naturalist\n- Nature craft session\n- First aid support\n- All permissions and parking","itinerary":"8:00 am | Arrive at the base village, welcome circle, breakfast\n8:30 am | Nature walk and sensory trail\n9:15 am | Nature crafts with leaves, twigs and natural materials\n10:15 am | Snack and free play\n10:45 am | Nature printing\n11:45 am | Tiny Explorer Challenge\n12:15 pm | Goodbye circle and departure","faqs":"Where is it?\n20 minutes from Oleander Farms, Karjat. Exact location shared on booking.\n\nIs this a trek?\nNo. It is a gentle outdoor walk with activities. Think forest play, not mountain climbing.\n\nAre there toilets?\nYes, Indian and Western toilets at the Rock & Anchor base village.\n\nCan we book a private group?\nYes, for groups of 15 or more we customise the experience and pricing.\n\nWhat if the weather is bad?\nDrizzles are fun! We only reschedule for heavy rain or heat wave forecasts.","prices":"Per person | ₹1,800\nFestive offer, child | ₹1,700\nFestive offer, adult | ₹1,500\nFarm to table lunch (optional) | ₹300 adult, ₹150 child under 10","age":"Ages 1 to 6, with a parent","location":"Karjat · 1.5 hrs from Dadar","timing":"8:00 am to 12:15 pm","categories":["Family & Kids"],"fromPrice":1800,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sensory-4.jpg"}]},{"id":"recU4Q0ZgIELxs0uE","title":"Monsoon Village Experience (1 Day)","slug":"monsoon-village-1-day","order":24,"summary":"A full monsoon day in a mountain village: waterfalls, paddy farming, river floating and home-cooked Maharashtrian food, with an AC bus from Dadar if you want it.","description":"A full monsoon day in a mountain village, surrounded by waterfalls and green fields. Hop between waterfalls, plant paddy with the villagers and float down a lazy river, with home-cooked Maharashtrian food through the day.\n\n## Highlights\n- Guided waterfall trails\n- Paddy farming and the rice life cycle\n- River floating with tubes and floats\n- Traditional Maharashtrian breakfast and lunch\n- Optional AC bus from Dadar\n\n## What's included\n- Experience led by a Rock & Anchor certified guide\n- AC bus from Dadar (if you choose the travel option)\n- Breakfast, traditional lunch and evening snacks\n- Ring floats, lounger floats and an air boat with oars\n- Flora and fauna expert\n- First aid support\n- 4K photos and videos of your experience\n- All permits and fees","itinerary":"6:00 am | Meet at Dadar for the AC bus, or come in your own vehicle\n9:00 am | Arrival and Maharashtrian welcome\n9:30 am | Breakfast: poha, chai, coffee\n10:00 am | Waterfall morning\n1:00 pm | Traditional Maharashtrian lunch\n2:00 pm | Paddy farming\n4:00 pm | River floating with tubes\n5:30 pm | Snacks by the river\n7:00 pm | Leave the village\n10:00 pm | Back in Mumbai","faqs":"How big is the group?\n15 to 20 people.\n\nWhat are the timings?\nWith the bus: meet at Dadar station at 6:00 am. Without it: reach the village by 9:00 am. We leave the village at 7:00 pm and reach Mumbai around 10:00 pm.\n\nIs there a group discount?\nGroups of 15 or more get 10% off.\n\nCan we stay longer?\nYes, extra nights can be arranged on request.","prices":"With travel from Dadar | ₹2,500\nWithout travel | ₹2,000\nGroups of 15 or more get 10% off.","age":"Ages 6 to 65","location":"Asangaon · 2.5 hrs from Dadar","timing":"6:00 am to 10:00 pm","categories":["Village Life","Monsoon"],"fromPrice":null,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-4.jpg"}]},{"id":"recUBPYOfeFiGrBBV","title":"Monsoon Village Experience","slug":"monsoon-village-experience","order":23,"summary":"Life in a mountain village during the monsoon: waterfalls, a lazy river, rice cultivation, a campfire with chocolate fondue, and a night in a villager's home or a tent.","description":"## Stay options\n- Villager's home: for families or friends groups of 5 to 10. The whole home is yours, with bedding, pillows and blankets.\n- Tent stay: sleeping pads, sleeping bags and pillows provided.\n\n## Add on experiences (for groups of 10+)\n- Coffee making and tasting with a Blue Tokai expert\n- Herping night walk with a naturalist\n- Bird watching walk with a zoologist\n- Trek to Sita Ma's cave near Valmiki's ashram\n\n## What's included\n- Tent or village home stay\n- All meals: snacks, dinner, breakfast and lunch\n- Lake dip with floats and waterfall visit\n- Bird watching trek\n- Rice life cycle workshop\n- Chocolate fondue and s'mores\n- First aid support","itinerary":"## Day 1\n2:00 pm | Traditional Maharashtrian welcome\n2:30 pm | Lake dip with floats and waterfall visit\n6:00 pm | Snacks\n7:00 pm | Teach and play with village children\n8:00 pm | Traditional Maharashtrian dinner\n9:00 pm | Chocolate fondue and s'mores\n10:00 pm | Learn to set up tents\n## Day 2\n6:30 am | Bird watching trek to a waterfall\n9:15 am | Breakfast at the waterfall (weather permitting)\n10:30 am | Rice life cycle workshop\n12:00 pm | Traditional Maharashtrian lunch\n1:00 pm | Group photo and farewell","faqs":"How big is the group?\n10 to 12 people.\n\nWhat are the timings?\nArrive by 2 pm on Day 1, leave after lunch around 1 pm on Day 2.\n\nCan we stay longer?\nYes, extra nights can be arranged on request.\n\nHow do I get there?\nOptional transport: ₹500 per person between Asangaon station and the campsite, both ways.","prices":"Tent stay, adult | ₹2,300\nTent stay, child (2 to 9) | ₹1,800\nVillage home stay, adult | ₹3,000\nVillage home stay, child (2 to 9) | ₹2,500\nTransport from Asangaon (optional) | ₹500\nPrices exclude travel from Mumbai.","age":"Ages 6 to 65","location":"Asangaon · 2.5 hrs from Dadar","timing":"2 days / 1 night","categories":["Village Life","Monsoon"],"fromPrice":2500,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-4.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/monsoon-1-day-1.jpg"}]},{"id":"recW9JKhVGqNh0LLS","title":"Little Feet: Sunset Safari","slug":"little-feet-sunset-safari","order":2,"summary":"An evening on the farm for children and their parents: a nature safari, tree planting, games, sunset, and a first look at the night sky through a telescope.","description":"## Highlights\n- Nature exploration\n- Paint a pot and plant a sapling to take home\n- Games and free play\n- Sunset on the farm\n- Telescope viewing\n\n## Why go?\nGive children their first taste of exploring nature as an adventure, followed by their first look at the night sky.\n\n## What's included\n- Snacks\n- Local naturalist\n- Nature craft session\n- A clay pot and plant to take home\n- Telescope viewing\n- First aid support\n- All permissions and parking","itinerary":"4:00 pm | Arrive at the base village, welcome circle\n4:30 pm | Little nature safari: textures, butterflies and colours\n5:00 pm | Farm time and tree planting\n6:00 pm | Free play and snacks\n6:30 pm | Sunset on the farm\n7:00 pm | Stargazing\n7:45 pm | Local dinner (optional)\n8:15 pm | Goodbye circle and departure","faqs":"Where is it?\n20 minutes from Oleander Farms, Karjat. Exact location shared on booking.\n\nIs this a trek?\nNo. It is a gentle outdoor walk with activities.\n\nCan we book a private group?\nYes, for groups of 15 or more we customise the experience and pricing.","prices":"Per person | ₹1,800\nFestive offer, child | ₹1,700\nFestive offer, adult | ₹1,500","age":"Ages 4 to 12, with a parent","location":"Karjat · 1.5 hrs from Dadar","timing":"4:00 pm to 8:15 pm","categories":["Family & Kids","Stargazing"],"fromPrice":1500,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/little-feet-sunset-safari-4.jpg"}]},{"id":"recZX0tQG7JhPJHX2","title":"The Hidden Kingdom","slug":"hidden-kingdom","order":7,"summary":"Most people only experience half the forest. Search for nocturnal wildlife with expert herpers Nigel Anchan and Daimler Pereira, then turn your eyes from the forest floor to the stars.","description":"## Highlights\n- Guided herping night walk\n- Basics of wildlife photography\n- Stargazing with a telescope\n- Camping, midnight Maggi and chai\n- Hidden waterfall in the morning\n\n## Meet the guides\nNigel Anchan is a wildlife conservationist, macro photographer and herper who has documented reptiles and amphibians across India's biodiversity hotspots. Daimler Pereira is a naturalist, wildlife photographer and herping specialist known for his work in the Western Ghats. Every encounter is safe, ethical and respectful of the animals.\n\n## What's included\n- Guided herping night walk\n- Overnight tent camping\n- Traditional Maharashtrian dinner\n- Midnight Maggi and chai\n- Village breakfast\n- HD photos and videos\n- Waterfall experience\n- First aid certified leader\n- All permits and entry fees","itinerary":"## Day 1\n6:00 pm | Arrive at base camp, meet your guides, welcome drink\n7:00 pm | Traditional Maharashtrian dinner\nAfter dark | The Hidden Kingdom night walk: snakes, frogs, geckos, spiders and more\n1:00 am | Return to base camp\n1:30 am | Midnight Maggi and chai, sleep in tents\n## Day 2\n10:00 am | Village breakfast\n10:30 am | Hidden waterfall experience","faqs":"Is it safe?\nYes. Your guides are experienced herpers and First Aid certified. We keep a safe distance and never handle animals.\n\nWill we definitely see snakes?\nSightings are never guaranteed, but we regularly see frogs, geckos, spiders, insects, scorpions and reptiles.\n\nIs there a plastic rule?\nYes. Zero plastic and glass. A reusable bottle is compulsory and any plastic you bring goes back with you.\n\nNeed transport?\n₹500 per person from Asangaon station. Arrive by 5:00 pm.","prices":"Per person | ₹3,000\nTravel from Asangaon station (optional) | ₹500","age":"Ages 15+, under 18 with a guardian","location":"Shahapur · 2.5 hrs from Dadar","timing":"Overnight, 6 pm to 11 am","categories":["Wildlife","Stargazing"],"fromPrice":3000,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/hidden-kingdom-4.jpg"}]},{"id":"receVObty2OP5RqpK","title":"The Greatest Show On Earth","slug":"greatest-show-on-earth","order":6,"summary":"What if for one night you could disappear from the city? A lake dip, a traditional Maharashtrian dinner, a professional astronomer and telescope, chocolate fondue and a night under the stars.","description":"## Highlights\n- Lake dip with floats\n- Camping under the stars\n- Campfire and chocolate fondue\n- Bird watching trail\n- Professional telescope and astronomer\n\n## The hosts\nThe Deshmukh family have lived in this village for generations. Their warmth, hospitality and deep connection to the land make the stay comfortable, safe and authentic.\n\n## Facilities\n- Home: the family home, where you enjoy snacks, dinner and breakfast, with clean Western and Indian bathrooms.\n- Campsite: a scenic site 300 metres from the home, perfect for stargazing.\n\n## What's included\n- Rock & Anchor certified guides\n- Professional astronomer and telescope\n- Ring and lounger floats\n- Chocolate fondue\n- Small group size\n- First aid\n- HD photos and videos of your experience\n- Bird watching trek with a local naturalist\n- All permits and fees","itinerary":"## Day 1\n4:00 pm | Arrival and welcome\n4:30 pm | Lake dip with floats. Sunset around 6:30 pm\n7:00 pm | Introduction to the night sky, snacks\n8:00 pm | Traditional Maharashtrian dinner\n9:30 pm | Stargazing with the astronomer\n11:00 pm | Learn to set up a campsite\n12:00 am | Chocolate fondue and s'mores\n1:00 am onwards | Maggi or soup and chai, light photography, sleep under the stars\n## Day 2\n7:00 am | Bird watching short trek (optional)\n8:30 am | Breakfast\n9:00 am | Rice life cycle workshop\n10:30 am | Group photo and goodbyes","faqs":"How far is it from Mumbai?\nAbout 45 minutes from Shahapur and 2.5 hours from Dadar. Exact location shared on booking.\n\nWhat are the timings?\nArrive at 4:00 pm on Day 1 and leave by 11:00 am on Day 2.\n\nHow big is the group?\n20 to 25 adventurers. Private groups can be fully customised.\n\nAre there proper toilets?\nYes, Western and Indian style bathrooms at the village home.\n\nHow do I get there?\nMost guests drive; there is plenty of parking. Public transport runs from Asangaon station.\n\nIs the lake dip safe?\nYes. Swimming is optional, floats are provided for non-swimmers, and we stay in a designated safe area.\n\nWhat food is served?\nFresh, home-cooked Maharashtrian vegetarian meals. Jain and vegan on request.\n\nIs there a group discount?\n10+ adults 5% off, 20+ people 8% off, 30+ people 10% off. Discounts cannot be stacked.","prices":"Adult | ₹3,000\nChild (11 to 15) | ₹2,700\nChild (4 to 10) | ₹2,000\nExcludes travel from Mumbai to the campsite and back.","age":"Ages 3 to 65, under 10 with a guardian","location":"Shahapur · 2.5 hrs from Dadar","timing":"2 days / 1 night","categories":["Stargazing","Village Life","Family & Kids"],"fromPrice":3000,"datesAhead":60,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-3.jpg"}]},{"id":"recjOD7ru8rr5MUtF","title":"Ridge & Lake: Chasing Sunsets","slug":"ridge-and-lake","order":8,"summary":"An evening trek to watch the sun set over the Sahyadris, followed by a traditional, locally grown dinner and an introduction to stargazing.","description":"## The evening\n- Sunset trek along the ridge\n- Traditional, locally grown dinner\n- Introduction to stargazing\n\n## What's included\n- Rock & Anchor certified trek leaders\n- Traditional, locally grown dinner\n- Introduction to stargazing\n- First aid support\n- All permits","itinerary":"4:00 pm | Meet at the base village and briefing\nAfternoon | Trek up along the ridge\nSunset | Watch the sun set over the lake and the Sahyadris\nEvening | Walk down to the village\nDinner | Traditional, locally grown dinner\nAfter dinner | Introduction to stargazing\n9:00 pm | Depart","faqs":"How hard is the trek?\nIt is a beginner friendly evening trek for ages 10 and above.\n\nWhat if it rains?\nWe only reschedule for thunderstorms.","prices":"Price on request. Call or WhatsApp us.","age":"Ages 10+","location":"Karjat · 1.5 hrs from Dadar","timing":"4:00 pm to 9:00 pm","categories":["Treks","Stargazing"],"fromPrice":1800,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/ridge-and-lake-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/ridge-and-lake-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/ridge-and-lake-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/ridge-and-lake-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/ridge-and-lake-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/ridge-and-lake-4.jpg"}]},{"id":"recm8esl6OoEUzVBj","title":"Talking to the Planets","slug":"talking-to-the-planets","order":25,"summary":"A stargazing session brought to your venue: discussion, telescopes and the night sky. Ideal for residential societies, birthdays, corporate gatherings and events.","description":"## The session\n- Earth's place in the universe\n- Constellations and how the sky changes through the year\n- How telescopes work\n- Viewing the Moon, planets and bright stars\n- Why dark skies matter\n- The life of stars\n- Q&A\n\n## What's included\n- Astronomer led talk and discussion\n- Professional telescopes\n- Celestial observation\n- Q&A session\n\n## What we need at your venue\n- An open terrace or ground with a clear view of the sky\n- A spot away from bright lights\n- One power point near the telescope area\n- Seating for your group","itinerary":"Start | Welcome and Earth's place in the universe\nTalk | Constellations, the seasons and how telescopes work\nObservation | The Moon, planets and bright stars through the telescopes\nClose | The life of stars, light pollution and open Q&A","faqs":"What if it is cloudy?\nIf it is very cloudy or rainy we will reschedule.\n\nIs there an early bird offer?\n₹1,000 off when you confirm at least 2 weeks ahead.","prices":"Up to 20 people | ₹20,000\nUp to 30 people | ₹28,000\nUp to 40 people | ₹36,000\nUp to 50 people | ₹44,000\nEarly bird: ₹1,000 off if you confirm 2 weeks ahead.\nCancellation: 75% refund 14+ days before, 50% between 7 and 14 days, none within 7 days.","age":"All ages","location":"Your venue · Mumbai and nearby","timing":"Evening session, about 3 hours","categories":["Stargazing","Private & Groups"],"fromPrice":20000,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-4.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/talking-to-the-planets-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/talking-to-the-planets-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-1.jpg"}]},{"id":"recotNF3taNVJQHvz","title":"Young Explorers: Winter School","slug":"young-explorers-winter-school","order":3,"summary":"A 2 day, 1 night winter school in the Sahyadris. Children make decisions, solve problems, learn practical outdoor skills and discover what they are capable of.","description":"## What children explore\n- Nature and wildlife\n- Navigation\n- Astronomy\n- Village life and farming\n- Survival basics\n- Leave No Trace\n\nOnly three Winter Schools this season.\n\n## What's included\n- Rock & Anchor certified outdoor leaders\n- Tent stay with sleeping gear\n- All meals during the programme\n- Outdoor skills sessions: navigation, astronomy, survival basics, Leave No Trace\n- First aid support\n- All permits","itinerary":"## Day 1\n10:00 am | Arrive at base camp, welcome circle and team formation\nLate morning | Nature and wildlife walk\nAfternoon | Navigation: maps, compass and finding your way\nEvening | Village life and farming with our hosts\nAfter dark | Astronomy: the night sky through a telescope\n## Day 2\nEarly morning | Survival basics: shelter, water and fire safety\nMorning | Leave No Trace challenge\nAfternoon | Reflection circle and certificates\n4:00 pm | Depart","faqs":"Who is it for?\nChildren who are ready for a night away from home. Call us to check if it suits your child.\n\nWho looks after the children?\nCertified Rock & Anchor outdoor leaders stay with the group throughout, with first aid support.\n\nHow many Winter Schools are there?\nOnly three this season. Dates are listed on this page.","prices":"Price on request. Call or WhatsApp us.","age":"","location":"Sahyadris · location shared on booking","timing":"2 days / 1 night, 10:00 am to 4:00 pm next day","categories":["Family & Kids","Treks"],"fromPrice":1500,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-3.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-3.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-4.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/young-explorers-4.jpg"}]},{"id":"recs1bI9IlvrAb5Cu","title":"The Night Sky Experience","slug":"night-sky-experience","order":20,"summary":"Sunset. Dinner. Stories. The Universe. An evening where families slow down, watch the sunset, learn about the night sky and look at the Moon, planets and stars through a telescope.","description":"## We'll talk about\n- The Solar System: the Sun, planets, moons, asteroids and comets\n- The Moon: why it changes shape and what we can see on it\n- Stars: what they are and how far away they really are\n- Constellations: how people have joined the stars for thousands of years\n- Light pollution: why city lights hide the night sky\n\n## What's included\n- Certified guides\n- Professional astronomer and telescope\n- Snacks and welcome drink\n- HD photos and videos\n- Sunset trail\n- First aid\n- All permits","itinerary":"5:30 pm | Arrival, welcome and snacks\n6:00 pm | Sunset trail with a local naturalist\nAt sunset | Introduction to the night sky, laser sky tour, telescope observation\n8:30 pm | Dinner (optional), more than half organic and locally grown","faqs":"Where is it?\nAbout 20 minutes from Oleander Farms and 1.5 hours from Dadar. Exact location shared on booking.\n\nHow big is the group?\n15 to 20 people. Private groups can be fully customised.\n\nHow do I get there?\nPlenty of parking. Public transport from Karjat station.\n\nIs there a group discount?\n10+ adults 5% off, 20+ people 8% off, 30+ people 10% off. Not stackable.","prices":"Adult | ₹1,600\nChild (4 to 6) | ₹1,000\nOrganic Maharashtrian dinner (optional) | ₹300 adult, ₹200 child","age":"Ages 3 to 65, under 10 with a guardian","location":"Karjat · 1.5 hrs from Dadar","timing":"5:30 pm to 9:00 pm","categories":["Stargazing","Family & Kids"],"fromPrice":1600,"datesAhead":null,"photos":[{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-1.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-2.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/night-sky-2.jpg"},{"url":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-1.jpg","thumb":"https://www.rockandanchor.in/wp-content/uploads/2026/10/rooftop-stargazing-1.jpg"}]}],"events":[{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-10T03:30:00.000Z","end":"2026-10-10T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-10T10:30:00.000Z","end":"2026-10-10T14:45:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-11T03:30:00.000Z","end":"2026-10-11T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-11T10:30:00.000Z","end":"2026-10-11T14:45:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-15T13:30:00.000Z","end":"2026-10-15T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-10-16T11:30:00.000Z","end":"2026-10-17T05:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-16T13:30:00.000Z","end":"2026-10-16T15:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-17T03:30:00.000Z","end":"2026-10-17T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-17T10:30:00.000Z","end":"2026-10-17T14:45:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-10-17T11:30:00.000Z","end":"2026-10-18T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-18T03:30:00.000Z","end":"2026-10-18T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-18T10:30:00.000Z","end":"2026-10-18T14:45:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-19T13:30:00.000Z","end":"2026-10-19T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-21T13:30:00.000Z","end":"2026-10-21T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-22T13:30:00.000Z","end":"2026-10-22T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-10-23T11:30:00.000Z","end":"2026-10-24T05:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-23T13:30:00.000Z","end":"2026-10-23T15:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-24T03:30:00.000Z","end":"2026-10-24T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-24T10:30:00.000Z","end":"2026-10-24T14:45:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-10-24T11:30:00.000Z","end":"2026-10-25T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-25T03:30:00.000Z","end":"2026-10-25T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-25T10:30:00.000Z","end":"2026-10-25T14:45:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-26T13:30:00.000Z","end":"2026-10-26T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-27T13:30:00.000Z","end":"2026-10-27T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-28T13:30:00.000Z","end":"2026-10-28T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-29T13:30:00.000Z","end":"2026-10-29T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-10-30T11:30:00.000Z","end":"2026-10-31T05:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-10-30T13:30:00.000Z","end":"2026-10-30T15:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-10-31T03:30:00.000Z","end":"2026-10-31T07:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-10-31T10:30:00.000Z","end":"2026-10-31T14:45:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-10-31T11:30:00.000Z","end":"2026-11-01T05:30:00.000Z"},{"exp":"recZX0tQG7JhPJHX2","start":"2026-10-31T12:30:00.000Z","end":"2026-11-01T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-01T02:30:00.000Z","end":"2026-11-01T06:45:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-11-01T03:30:00.000Z","end":"2026-11-01T11:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-01T10:30:00.000Z","end":"2026-11-01T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-01T10:30:00.000Z","end":"2026-11-01T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-02T13:30:00.000Z","end":"2026-11-02T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-03T13:30:00.000Z","end":"2026-11-03T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-04T13:30:00.000Z","end":"2026-11-04T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-06T11:30:00.000Z","end":"2026-11-07T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-07T02:30:00.000Z","end":"2026-11-07T06:45:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-07T10:30:00.000Z","end":"2026-11-07T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-07T10:30:00.000Z","end":"2026-11-07T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-07T11:30:00.000Z","end":"2026-11-08T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-08T02:30:00.000Z","end":"2026-11-08T06:45:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-11-08T03:30:00.000Z","end":"2026-11-08T11:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-08T10:30:00.000Z","end":"2026-11-08T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-08T10:30:00.000Z","end":"2026-11-08T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-13T11:30:00.000Z","end":"2026-11-14T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-14T02:30:00.000Z","end":"2026-11-14T06:45:00.000Z"},{"exp":"recotNF3taNVJQHvz","start":"2026-11-14T04:30:00.000Z","end":"2026-11-15T10:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-14T10:30:00.000Z","end":"2026-11-14T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-14T10:30:00.000Z","end":"2026-11-14T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-14T11:30:00.000Z","end":"2026-11-15T05:30:00.000Z"},{"exp":"recCERBptmvu3WC5B","start":"2026-11-15T01:30:00.000Z","end":"2026-11-15T10:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-15T02:30:00.000Z","end":"2026-11-15T06:45:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-11-15T03:30:00.000Z","end":"2026-11-15T11:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-15T10:30:00.000Z","end":"2026-11-15T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-15T10:30:00.000Z","end":"2026-11-15T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-16T13:30:00.000Z","end":"2026-11-16T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-17T13:30:00.000Z","end":"2026-11-17T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-18T13:30:00.000Z","end":"2026-11-18T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-19T13:30:00.000Z","end":"2026-11-19T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-20T11:30:00.000Z","end":"2026-11-21T05:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-20T13:30:00.000Z","end":"2026-11-20T15:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-21T02:30:00.000Z","end":"2026-11-21T06:45:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-21T10:30:00.000Z","end":"2026-11-21T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-21T10:30:00.000Z","end":"2026-11-21T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-21T11:30:00.000Z","end":"2026-11-22T05:30:00.000Z"},{"exp":"recZX0tQG7JhPJHX2","start":"2026-11-21T12:30:00.000Z","end":"2026-11-22T05:30:00.000Z"},{"exp":"recCERBptmvu3WC5B","start":"2026-11-22T01:30:00.000Z","end":"2026-11-22T10:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-22T02:30:00.000Z","end":"2026-11-22T06:45:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-11-22T03:30:00.000Z","end":"2026-11-22T11:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-22T10:30:00.000Z","end":"2026-11-22T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-22T10:30:00.000Z","end":"2026-11-22T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-23T13:30:00.000Z","end":"2026-11-23T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-24T13:30:00.000Z","end":"2026-11-24T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-25T13:30:00.000Z","end":"2026-11-25T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-26T13:30:00.000Z","end":"2026-11-26T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-27T11:30:00.000Z","end":"2026-11-28T05:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-27T13:30:00.000Z","end":"2026-11-27T15:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-28T02:30:00.000Z","end":"2026-11-28T06:45:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-28T10:30:00.000Z","end":"2026-11-28T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-28T10:30:00.000Z","end":"2026-11-28T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-11-28T11:30:00.000Z","end":"2026-11-29T05:30:00.000Z"},{"exp":"recSXQ2tQxqLEpN0C","start":"2026-11-29T02:30:00.000Z","end":"2026-11-29T06:45:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-11-29T03:30:00.000Z","end":"2026-11-29T11:30:00.000Z"},{"exp":"recW9JKhVGqNh0LLS","start":"2026-11-29T10:30:00.000Z","end":"2026-11-29T14:45:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-11-29T10:30:00.000Z","end":"2026-11-29T15:30:00.000Z"},{"exp":"rec2ZtYTJkhhBie5P","start":"2026-11-30T13:30:00.000Z","end":"2026-11-30T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-04T11:30:00.000Z","end":"2026-12-05T05:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-05T10:30:00.000Z","end":"2026-12-05T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-05T11:30:00.000Z","end":"2026-12-06T05:30:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-12-06T03:30:00.000Z","end":"2026-12-06T11:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-06T10:30:00.000Z","end":"2026-12-06T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-11T11:30:00.000Z","end":"2026-12-12T05:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-12T10:30:00.000Z","end":"2026-12-12T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-12T11:30:00.000Z","end":"2026-12-13T05:30:00.000Z"},{"exp":"recZX0tQG7JhPJHX2","start":"2026-12-12T12:30:00.000Z","end":"2026-12-13T05:30:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-12-13T03:30:00.000Z","end":"2026-12-13T11:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-13T10:30:00.000Z","end":"2026-12-13T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-18T11:30:00.000Z","end":"2026-12-19T05:30:00.000Z"},{"exp":"recotNF3taNVJQHvz","start":"2026-12-19T04:30:00.000Z","end":"2026-12-20T10:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-19T10:30:00.000Z","end":"2026-12-19T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-19T11:30:00.000Z","end":"2026-12-20T05:30:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-12-20T03:30:00.000Z","end":"2026-12-20T11:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-20T10:30:00.000Z","end":"2026-12-20T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-25T11:30:00.000Z","end":"2026-12-26T05:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-26T10:30:00.000Z","end":"2026-12-26T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-26T11:30:00.000Z","end":"2026-12-27T05:30:00.000Z"},{"exp":"rec8Qu6E2UZeocjE7","start":"2026-12-27T03:30:00.000Z","end":"2026-12-27T11:30:00.000Z"},{"exp":"recjOD7ru8rr5MUtF","start":"2026-12-27T10:30:00.000Z","end":"2026-12-27T15:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2026-12-31T11:30:00.000Z","end":"2027-01-01T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-01T11:30:00.000Z","end":"2027-01-02T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-02T11:30:00.000Z","end":"2027-01-03T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-08T11:30:00.000Z","end":"2027-01-09T05:30:00.000Z"},{"exp":"recotNF3taNVJQHvz","start":"2027-01-09T04:30:00.000Z","end":"2027-01-10T10:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-09T11:30:00.000Z","end":"2027-01-10T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-15T11:30:00.000Z","end":"2027-01-16T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-16T11:30:00.000Z","end":"2027-01-17T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-22T11:30:00.000Z","end":"2027-01-23T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-23T11:30:00.000Z","end":"2027-01-24T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-29T11:30:00.000Z","end":"2027-01-30T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-01-30T11:30:00.000Z","end":"2027-01-31T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-05T11:30:00.000Z","end":"2027-02-06T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-06T11:30:00.000Z","end":"2027-02-07T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-12T11:30:00.000Z","end":"2027-02-13T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-13T11:30:00.000Z","end":"2027-02-14T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-19T11:30:00.000Z","end":"2027-02-20T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-20T11:30:00.000Z","end":"2027-02-21T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-26T11:30:00.000Z","end":"2027-02-27T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-02-27T11:30:00.000Z","end":"2027-02-28T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-05T11:30:00.000Z","end":"2027-03-06T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-06T11:30:00.000Z","end":"2027-03-07T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-12T11:30:00.000Z","end":"2027-03-13T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-13T11:30:00.000Z","end":"2027-03-14T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-19T11:30:00.000Z","end":"2027-03-20T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-20T11:30:00.000Z","end":"2027-03-21T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-26T11:30:00.000Z","end":"2027-03-27T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-03-27T11:30:00.000Z","end":"2027-03-28T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-02T11:30:00.000Z","end":"2027-04-03T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-03T11:30:00.000Z","end":"2027-04-04T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-09T11:30:00.000Z","end":"2027-04-10T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-10T11:30:00.000Z","end":"2027-04-11T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-16T11:30:00.000Z","end":"2027-04-17T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-17T11:30:00.000Z","end":"2027-04-18T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-23T11:30:00.000Z","end":"2027-04-24T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-24T11:30:00.000Z","end":"2027-04-25T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-04-30T11:30:00.000Z","end":"2027-05-01T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-05-01T11:30:00.000Z","end":"2027-05-02T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-05-07T11:30:00.000Z","end":"2027-05-08T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-05-08T11:30:00.000Z","end":"2027-05-09T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-05-14T11:30:00.000Z","end":"2027-05-15T05:30:00.000Z"},{"exp":"receVObty2OP5RqpK","start":"2027-05-15T11:30:00.000Z","end":"2027-05-16T05:30:00.000Z"}],"reviews":[{"name":"Divyam Sanghvi","text":"Superb experience, right from answering our queries, teaching valuable lessons on astronomy, safe hiking, to taking utmost care of each and every aspect at the location, everything was perfect. Thanks for an awesome weekend and helping us spot fireflies. Definitely recommend\n","exp":[],"photo":""},{"name":"Krishna Vijayvargiya","text":"Such an enthralling experience it was! Camping, trekking, bonfire, waterfalls, staying in a village, all part of their package. They customise as per your needs. And the best part is they take smaller groups only, so that you can spend time and bond and be yourself rather than always being in rush!! 🤍\n\nI'm planning another trip real soon with them 🤗\n","exp":[],"photo":""},{"name":"Shruti Vaghela","text":"Recently went for their **stargazing** trip for the Geminids meteor shower. What a wonderful little getaway with the most warm and welcoming people! Super comfortable set up with all the amenities you could need! Rock & Anchor has also taken the initiative to involve local villagers, providing well paying employment opportunities - an underrated perk of which you get to enjoy first hand, the DELICIOUS food they make for you, from locally grown ingredients! Would undoubtedly visit again and recommend to others. Worth the money for sure! :)\n","exp":[],"photo":""},{"name":"Jinesh Shah","text":"They are a class apart. Prepare to get excited about India’s outdoors in a unique way. They pick Great destinations, they choose the most sustainable options. The folks running Rock & Anchor are nature lovers, experienced at leading outdoors & rescue, & are wonderful humans. If you’re tired of going to restaurants, clubs & shopping malls, look no further. Give them a call.\n\n\n","exp":[],"photo":""},{"name":"Mradul Dubey","text":"If you're looking for something offbeat and exciting to do over a weekend near Mumbai, Rock and Anchor's **stargazing** experience is something that you shouldn't miss! From informative sessions to experiencing a glimpse of a sustainable and environmentally friendly way of living, there is so much to learn and know about. Would highly recommend this overall truly enriching experience.\n","exp":[],"photo":""},{"name":"Abhilasha Khaitan","text":"Incredible experience led by Aadi. We were two beginners and he made us feel safe and confident. That apart, his respect for nature and the support for the locals was remarkable. Sign up with Rock and Anchor if you want an authentic, exciting experience. I’ll definitely be a regular with them.\n","exp":[],"photo":""}],"impact":[{"metric":"Experiences run since 2021","value":"250+","order":1},{"metric":"People taken outdoors","value":"2,700+","order":2},{"metric":"Village families we work with","value":"8","order":3},{"metric":"Local guides and hosts employed","value":"16","order":4},{"metric":"Village schools supported","value":"4","order":5},{"metric":"Homes given solar panels","value":"96","order":6}],"source":"snapshot 8 Oct 2026","team":[{"name":"Aaditya Shah","role":"Co-founder, The Rock","group":"Founders","order":1,"photo":"","bio":"A former software engineer turned mountaineer and outdoor educator. Wilderness First Responder with thirteen years of leading experiences in the US and India."},{"name":"Mansi Nayyar","role":"Co-founder, The Anchor","group":"Founders","order":2,"photo":"","bio":"A creative supervisor and trekker who has spent ten years leading offbeat treks across the Sahyadris, and has curated 450+ travel experiences."},{"name":"Sujit","role":"Experience Leader","group":"Experience Leaders","order":1,"photo":"","bio":"Leads Rock & Anchor experiences on the trail, looking after the group's safety and pace and making sure everyone gets the most out of the day."},{"name":"Prasad","role":"Experience Leader","group":"Experience Leaders","order":2,"photo":"","bio":"Guides groups through our treks and village days, sharing the trails, stories and everyday life of the Sahyadris."},{"name":"Nilesh","role":"Experience Leader","group":"Experience Leaders","order":3,"photo":"","bio":"Leads our groups outdoors, from the first welcome circle to the walk back, so every guest feels safe, looked after and part of the experience."},{"name":"Mitrran","role":"Business Development","group":"Business Development","order":1,"photo":"","bio":"Works with schools, companies and communities to design private Rock & Anchor experiences around what each group needs."},{"name":"Aditya Raje","role":"Social Media","group":"Social Media","order":1,"photo":"","bio":"Tells the Rock & Anchor story online, sharing the photos, reels and moments from our experiences on Instagram."}]};
const LOGO = 'iVBORw0KGgoAAAANSUhEUgAAAPAAAADJCAMAAAAq/k/FAAAASFBMVEUoHhAAAAAqIBE9AAAnHQ8nHQ8nHQ8nHQ8nHQ8nHQ8qGhFVAAAnJAodHRAnIA84OAAnIBB/AAApIBAkJCQqIBFVVQAAAAAAAAAI2qs9AAAAGHRSTlP+AP4Ez4+vL09vEwMQCS0ERwLQB2YDAAD1/X6HAAAamUlEQVR42uVd55rkNq6lKIpJlGps733/V72iAgmAYKh2dXu8qx/+3FNJh8hRYvo3XfNrrr7mF62VEkKY+Mbq28S/AWa80l8vb4yZy3cEJ6SIV5hCHe/vCHid+fvdjHHLSUQpPPOyFtd1vEMtYZqM4wgtfi9K4n94bSHe+H+si0gPLFKeRFQ2vdHY4PfjdWcXAS4ZYUvLIBa/Bc41/xWMPel4Xgc2/zJayhvpjQaQTp3/Tt6QLjutvwnguaDmQSd70RHd/Mm7GsOQOnH/pDmc+TL/IIXXGZPyJOehgC6cN8MWt7+44+UqjvmmcO2S6vXTgEsFNB8oI8gbJY8z3zL36kHi+2utaF8H96/fDng92XXN5AyRkJFj3WMqLxxSfPU6cJyKeem/1Xwbhde5pGYwt3r9AEjC6lF9q/63yYWQWPwdbj2/Cstl5NfDRsTL3RpIfMclRTrIzuX/FoXXmejXE60Ph/NzGcusZb8LaoY89jZijL9I4dmf5vJPNwWnlWjZwn/4OhTc2gC8zoh2919R5xgf6Xip12xF9CJ+R5TwUnWWnvH/b7eCs5qaCfk2Y/2Tl+cBn2i9dc/Lm1NCO2uiYyf+1ZepUXh3+lTjPvKwiyr/Uj7/brjI8waAD4QXPjXdEdh/y3WQsAQ8T4tMSu2/CCwONTCFk1LTQvwvAA7iv/ZSbQr/bwCeJ/vbCe7nHDfPAda/F9aDLgtJU339CgXgrxFYvu/JD9JzseaiyrunNOB5iBPvlyQYxGfKqfEzksX5KKX0EVO6lHq7015vadJlGQbcTZRURCO4bNvVGJuegbIxiwKYrZ+h4pTq9nPnyb3DOLoK2CLAQS9flt+Uy9ChS1r9sOnj2aXXnkB7DdRuavkJlsYRsbCfi2KlrP7wcrFVzI7ECDSGnilBkzlO4QDWf4czLZYPwZWRYU3MfCB+zUxFsofzg0daDDD7vh/yDbAzLZz8DFxnMqKdhJRcySOpSkAABTnwY75BTuqegD9zjItP6bwzaWKB+JFwBSA+uYsCflg8BzQfdbXEiCqU+eJTV7asyC6S83TmF0wBekTh+VZSHon0JwDD8oOYX933K70s7riO/9ornY6FVJZ1yeNv1yHwAym9fpM00eNz8YxHFG7z9LL7UN7oDg0GlhHCsOQ47HFovglYqunj7j30PIQb8UPn51qfuh/gWLXx5AvFz/mz8Kk8MrQgj2qAGf6cCH8FcJ1++OswpS82UPQzyRFYqdB6JAFKfAvg8E7Kj6Gf0GXReUKeoSEnUGipAL8zHccHI3ToW3bMknQVjZNEDDpuNtZa8rdb/IZEYUf+YUMybaYvONJtELARoAe4rmJXRY/k9FJlJpgXLD6qloESVemvRm3/7ZoOcqaFfycDxkhxPr4XlQLiKiaiPVI9r4SlYxpCTU1H+vBgDyNJDeMbzjQFLBdsDVQPMMUHznPGwUDmUo87NAzs2HhOeK8QwF7H462SXwO8KfKiqwN+eV/opIwvKMHppMQkWbObupAnfuBFzYH2Jvc1wB3tr5K427MioQPRWoBjNa+TVCLgwzz2dLgfGmHA16crbgdQt4dLMJq3QIpIdPpgHgFLBM0ftljKgU4iLJxk1DxMP4cpLI/mAYCPD9i62/Ec5d2qN48mCAjg0U4nQ3mc/EMWUXJGWQuHdAOTy+eMARvUcdbIt0Yu+ELtQXQ8uKyEH6F6EcAFvqyTLDmz5Kw4zTXWRT5WoaqkH9bxRwSzvZUSUW+Ehxlw4K1O+ocsopQpSA6HpoGglCRi2CqzmcMiPdhHvc8NAraDLB2oyitOwPJSABwdVnxg9HBHXryfFYoYcjTL58fDQ+ClKEoPhfCkm6RSUKjteoRi7m/n32nAr/h3AirM0tuohrutTqaHkjgH9QBOHylcrcoNAil53svQ7j5II94FTLR0hy9U0kkaO4YrsbtJhikPAMPlZE9sbu7wdWa7AO9vBBgY8Kt3TIH4SdQMFWnVgikenVG9wZyofY7X1B2mnAgbTYpgs/TqHFNhZtVMAGsKWFMWNm3AWQ/6pfHG+20hHep4CAmVVu+YFA2A1TzxrlbiQ+BLCgzYdgD/9asRGz6cc6I0jQij6ZIOA05WR9GkR5FmVBMJEG27OsYE3arOmedpqLdqE/AHeoBl1ZVMt5XSvk9KIOvxDVGwCliz+duqcvPpCEfTQOpLFA7Eaia9TTLn4Dw9AVz5KTUIWN0NoE69mwby44Bpxib7aWUKQEse8NLp2FeNnCgn7CG8m6o344Czq/VS+LQo4JVa6ueOsliYgdLA8BvfyfO9A5jWusBIyQ3Y1jIaScp7OOwgT0v9FxxxGs9c5x8QvcQBBHyW0nQtsZ6LKzTTrqZ2Zq7IfleJB+7mnVoMiAhET9UlAVynRSit3TZVEuvZmS6SPP/3JuDGTfmvEBicUxewApM/G1t8eI5kLpzpMsmjBrowmpFf+d1vGmLRzBv88n6qzQgw0ZEVNM1lWcPV9zwa/GqQjf8wYN8a9PCK+g2GfC7dtmnTjUv3h7bCfa8UA36gCZidR011wnTzpU6iWZ+9VwIN06gptoyUq640q0HArl6895lYuSCq8EGthMJ1wAwrmV6DynkDizHBT7/Gux6aSqteWfILLO5sRERpTqDnTLNV2VU133iLixmauQQn2tHSpg6YY0hNuxzsmDPN/A57OHjqSpEsyJCD3Abc4GlT3u5cAjZEF9g3tCNHYkMUOUwKjPmWbS1d8PTKpf3LNB4F7HrNdWYaITEZFT1UxvPN6kOARX00cc4/UgImSZCsavw7omNqjPna0hvMYNgEATctuIMGY/lzmRkCFHlLaqjyAYQBwLDJh/aDXQTW+g6MFzGa+YCA2/ygUFOKXBgCZI7dKnpbTV3fMvFq0KDHGOlGlRTB8/5gRzucMOCxgPj6XlM670UxAiihO1x6sYBTswb0cEz6iT8mNPWQqhIxp4W03ICXCQD3VkPg2CdTM/N0mYjOvuUiuQO4hgCUfgbmoTWwqLjGOcQKq6+hyvieAfcYAscn2RJmiS2aAMpMND0A4czuQYPpgo7RsxIAAQME/WUe6ERF1w0HcCJC0JpqWR5oVUzzb+3PgL2n5k+TCnlpI0nD4lCZOPVHim7mAHy1xQo11GNUWmSlgEGxgfi6MXNGE9soY/x8h30vtWWA0rKjoZXB4hZEUVspAPsK4IWkBlH7IWhkguKmUMyZ222GMh8QsBkNrQxyIv5InqQu+nR2IoV1wBMBbEXRYIv9DtIvNdrMYwHgngzgblddpmGK6gTIEqoOS19fkit0FrVfYhIHppdkkKOTpX8L8MV+ocw7pXfsgs9bFl0Clb7/B3DmkJ2yZdlLYoz3Pdcj/aAYEIKAO9ht6sNKv1JtBHkGOSwtqToi9h7xSLkxC1IpqLOJ1VZGLIjsOvk3AJ8GgbamQQ7eeL1NA2Rq66gdg8nvzLHpW+KyFG0GEkIiTUimHxQDzTABfS3Isqyq1/ly46FWSAia2KyodSRwstaL3hJk6hyJN9aO3V+rCq2FqxOM7YbZ/GtPTxVwENT1ysRTMztqMFKFSD8oBnoWDfnaoprGtfogdwxwhY+Tt9p5QhtL8xwbl7A1BOo8hXvdXDdAVBBwR8U9WuoxeZaa3WIgVNKuB1QQhdn9m72Kkh0MUgCJPaTuHCc27wh9/yBgcDOG+xsb4mvpiaW8FvDky0xCu2IwAh6RqdUZvYtnu5yjY6N5y/cA72zBGyfSzS+XJ4WTW+Rq84dFk3hy1vKOOeRfujurE8dYmzseedUrpvFw6Y75OV8r9AYFlK+8DiuQ5yxY7vY6t+n5F/Eq4o5Ode23Eu9cZhwwsAYKue1ZiCEB15mpbPPjMXBe7w/KNe5aTfapeS0IuKPT1UQ8WzPR4ooKU4tj2Sr/erBsSppo789tekAcP7yA7Va9YiDeUAFLJJPm4WV0Rfom+kbr+izWm1KPGc5xfdf2rkdLiJEsZyAjzkCIQ07qlCs7U0X1Fj7kDppfixI/dz0kGQJsqp1ZUYXebGDKIkUg+VAZV5KE2MLvFvXDy/QeJSJGEvc0PoIMnI3asufJ29tKlktWJUrP/n0Y4JvunagjgP1gLAk7aue0d9ZklrU5V2CXH1hEpvQS1/YZv5nYrBYVn6tk2R9bM0LhIpaLSjUvuFxgZBLvwEWG/SRceZNPjlSkfLutQgykwU7X/yJnytsJlxaYM4r2k7Q9F4T4MG3+ca2AuSw3OM+1ZIB6C/Cjky089e/bO4t+HNIRM6xv7FJoA+6l7q23HDk/jvQMt9FWvnP+GoTBm+v2J9QcKQ/WSy1Duzy+E+al5w+jFVZkJj027zPMotf7E9QHAH8P756PKHCCLaNfBnGubLQR3RUwLcBO/gCvkv+LcMyZsnh6fTSZROZJiHZwrm9kuAwA/K0rAM8p9uhh7Ye5dHCY/b6/2dCoWpFOiWl6AXVsuA6UEPaOEGfA63cCPtzJHYVSJmtIXxvb1LKhlFKnOujDPgNJ7VtNbXdWW3x0Z0ZpheXiUUrnBWMkM7Gt50+MArI8dlm0LSseIc0sYgkw9XDps4D1cS1gnd+5rn+uRv2ps0OhCO6JQjWoK8SrnPfCJ5aVWKg7yOKtyeO2pcodL76tRzc6/oKnQ57sfe7SrTUwmkrvTKg7yAIlLt703LUz1oBSyDkfF2OlNKO2rWVPWzHTloIwPbHZ++ft5e64nTC5aRhiBLjpW0ouoJNLKFtoiu6kWvsxnggqU7M7xm+I0qZtyuUSFS1rDrLoj1rHR+PE7SiMRMwkT/4iJ+5hgsOEos/I8+sSHpb0qBpRrkOkTJ7/5vCoDLjlauX8KrLmwOj7Ihf0/GD+7OuMjh0/3lMC9rwWD5VUKJ3s5fGoeQRw+o7sHhD2hR/G3UnFaHjB8juxmwQh5dBikuBmqZX4ahXPwwPA9Wpjsm2kyAiM5C4KmXJkR4vm+9MM73lMuOCUPn4fwFr2WhjBaD3W1eptH856gGRz1TSVfRg7X1FKTBBqMq7JjBsCTFNpmaeIHWLGTXjArc4lU2tpDGW1q2gEp66CKQCujRk3KpIjgNeGXTq/vdt/62tRl5mK+gPTCb/yJTXqaTju72yncdU5p/+JUmAWOxXS2QOsqpmE3PFbX2jheECpUWB5DoRXOorft5CFCwBGSoMfmFgA4NBNZ9FjQTNNxX4HfjT8pMi5WIraNrpOYIdiU6xay2qSrCJTnQmRDNgPUBhLBg7Oi1FpxTqD6sqjFp0mDwI6dxvIvoUXbXqkg61bIyK+jlN0+hVVbQISxgXFMrEpLUtbC18S7HYrnMWEiHgelicoZSFZzACWWDqAEUvPU3WnsMfHM9PB4Sdmt0ZLNv9LVOSGARvq2DwcCwBHb98W6/fQtUHAslf9J7qPf4U0gjOzDpWNe4oNcB89EajrenMU0JJxUbDv9Ix7AFgPAEZai4w0VRrBA8MbrDHX3KBx0hMFA9lrhGCpTs5VfQrRviGaN8ycLxUz4FzM3PWmLOmB4KxWdsYVkWEraUsBXFxdc5Uh4Fr0gB53it6mmKmqYnaadtFW/LjHtaKuliaLeeGusni4r0rpwdTd5D7g2rCYIuVvLctFRN0dLSiLpbQ2V29L0Wqgy8VO9dHXmqN83o2Y3ptzVTUKo+XQIHxpUViCLaDW7mUqXdVyQAEY3WKCT7dC3R7gUC9ibITE8SXF2yk+863QNnGWSLUcEBilLT9aGzxDgO3g6LapE99wSQlfjdcIS66smiW+JYon693ETtadCtGgAPiFly9DRAr4rAgFNsTnOqMONT83Hm4OZyVmsOQVavVtarb3sa6W6Mj5s6NuKbxLylEXKDo7vTci8uYOCYV0pqFJrEXSI/cDa0+2/iPE0uZUXxuixQPM1Js39e9vrVSgsxIeO99Pb35qRI4sCloFtnpw3wac5SwZ5Hp1FiwPLhucuPhTvRrj2LjnbxNs6h5koKzMu8urPf6m91S8BCqkhZN5iDbbiFTTKkL49AWsr7cTlCuRj/KRAKpsSgWW2aVBA1sT0LkDODuzqjBMoFiZ8w40j9h6iEGLp9PoAA5uVCvHAtR2Fc5LNL3txDGeMzC5TpB0sUxzGBupFvDVHqh0jNNKkRJvJckDtw3AiDq0uzyOH0yAX821e/HryqU/eaUQgBWw+6+nRjimvIHLtuP4lcWGuOArU522UKJ8pASjkkR7RDMDzlZIlZ5/LhLR4oNqh0t0ZC3/vUEuYsbvCgdXy/4WXDUM2DBJYRj8Lon1LU5EJuewt7SUbvzwmIsCOaBAHNz19r06c0whA9aNZq6o9WiGEbo9ViZW0zRvF9qAydvBgJbiqk3pQF6KK2epnuthHsA1b2zPar4or4P1HSIv79ek7cC3fVdVqwHfCPeJn/FLHIlzLL4TIQLAS4PC17fRQhDMIqf/3xxx/23HlfOVFSc3Is9HxMW2gYuJeztwDokQ7aQIBGyLt/4FaB6oSzvjPFwN8N5ecUKyguVOUEtGy+emmnZvAGZOL2SbxjgRiq2IVlIqM0njzXiAprrMWuANaqqd1To+LppqDRoVpikI8dvGxjv5IFTTl6MV1ce3tLXqlKFJt4ATFrWFa6LZvIbKd6qoB8MnPJT5B5x47Cw8LCuqhihGyTag0tFl00zUdgHjah/dRoLy4rJYIUyqLdXOfFQiziwa6tUpVm2f91hMMhcsKwZ6ufLw/1xpyTBlBuQJ8DquVpGnwxXXoqZP1xgRNdXztdQ6BthzxVDylA+yzmzCk8NgVdH5YN7cXR8qWumec6Qs6kmRnDxEsPfEAS9a8QUudUhFc5fE0/dcvk+RkqeIvZihRFBUTOkT5JRg20boDvvQrrYAwFrWKWzI6VrS+LZx4S3xhm2nfub516sdt5VH4exlqw0LmO+KIIDpQ1iwhqClgI1P1Jo56wWpdhPabRqW73Sq7Tmi092FbymaTQLPp801bmJrGpg+sRHShHTXCdwzrP40WI0TuYG9WufkUB1wsaiKk+IG4FhhtmmwLi5ErVVCis47zleiz1cun3xCARM7HreVCO2Ypms+oOQjCJtlmLpasdW7kuleyRrldFobM2ph+PbC547/tFf9jHbrFQXE+B7PzpaznUPxiBjEALChcQWZF0LXznbeEctkEcvtfHviNtXUsCNNBDOuyBSz9ncErXwaHCxtrXSiUjSP39OohGysFiNSbLg+/yzDt512RKvS9sWdryAxoy1P+9p1V69g9qVUw6LaJdAshKStUURAy04XmqMokjqq1p6YXufOPS+Ij6O9V0b7yWSKJQ5ks3sgpBa1+bVm0vjxGxsLLamdKH1HQ3xLK7m0XuX51boo24K5XlmfPoeAsedRzmfExw2ulQ6HSZUbOW93JANUp1dZPGYPJybLZ7LRLoTYhg+dhsVYNzwIqkS1xqiaLB3YDBRRW2TNibfLYrcisRgqtYrMcpdUpln7jZa83xoErU8oor0NPuzWOa1RzM91rxoq6Oo1tScicYb/Anxiy4VKMGwfqkPvbwN2sloIudZTXK4IitcDJRcg0MMzuWSG9H7al21R/Qh8Abiha9jenatd/+bYYGNCMdPT1PLIprTi29Tyv8qfux5/Fs8ide/FnS2L1qXn94kh5oYjJol44VIA3hBrys4uEEXOjV65xEnGenMu31FfeIr0VwCbetLYMJ1VJxpL22VBRIEiOOQ8HHYTPGhF+zhwv+hI2+Yqjk9cqg04FGUDzNNgEbYqTgksFI9O+YykGCuMw1eIRP3+VTXI8fA1wEi8UcUFmF1d9H6AVUtSOdAVaZy2k8PoFqFMqvl+3zgz9KWZiUvFKXDY/1ludgPGGdWTDsjGeOPOJVmxszlsAdtBlT2lb6S0EdNUz2qpRp80fMxC3BkG3nJoshg9z7gHkG7h0bBXXDorf2AZEcxLM60vbPleQp6Wy8zUcpQ+qBjzkoMIzKblYsQPXLmYxrpaoEGD7Ed5Hpl7H0mwzqLNWZLq2hZ0tbGrdNXIZ9+9PAJcJHnYMol89M8WOTa67f3VWKr1CHvF13LTMq7lgyorty1xrtYFOAZJiMLqCAJ0xCmFGNsCJvXgohB4sC7dxMd0mAKth5whTrQsMyXvKhiph+j0wu7zE8J+TEVPGHBhiI33e1xF+IGf1IqNxpM/epe/fQaqTE2Ge4ctW939EHDRq6Wanx+ga+flRd/a7RFjPVllBw6v/cWa2y4olYFLD/qbAPBBDEnutTZA2eYBSMiyUukBHeXM3uI5ywJZNrAirlPRLNsy6mMFgB2UD0W8yZDjiJHAeUjmVIqtbMJV71TFvbimCCtz0URM3Wmf8oStr0yyqSXL+6FeTefOzy9bpDEHBHU4nxV1bIwalZUYa+bNfdc0l9aLBY/jHRh/KclojWIfem2vFcg1RcWpn3hXd9igqtZzfP2VCifgyGlqWdRSJJtFf4CNocqkFS/wyD1K+rY6uurugEG36HZET7zwIOP4bMw8Y5vDsvyKUOdwh98VwKMmPj5BxrQE3qAN1+6lK0r80acjBLx88wdmXKXiYux1Az8499qPGGCegUkeimlAa1HDRL2I2P5ELDzSV0y6zMadmz2Ld2G5CemmsMSVMc5Z45+Hpi3xiv9ylThTIPSaKxM+BHAl8tZEnUjZYzpsCXUl7iw3nWc2PYXQxRS7PgBZY6g0xrxf+QTQdepcYmAKVZrxh3Wz6kmWym2O1UxjsTm7dv6crHvOIZapTrCqGeCeV27WawBwbRpE9VPfyr7jf+53mtKllFbcMeufGsxym80LXLmd9O9cojpp927gVRmnrPR4zodERo/tUjiOz9V/xyXYMuibl3XS8dKgGedKXhNG4UqOLO6cAiJUXH8McO9hU+y/Hk4zzshduufKVWr8bAIVXZ/z8ZGHHgqVBoMfpHBr46NR0vFtyIe5V/D5fqeLqQ5Yh46Jkd+pjZzdM8S2sfxBwHEwpUZdzO9kB+mhXU8vPSqfE9VjK6fN096Y9YdBNik8VweOIWB5pSazQyzV5pbF/oJ0I+WVeZ1+g0swPUmed4HupbmnNOr9qtX6LXYaHGR1Ify4OH4I8JV31aXz8PgGMd7CPUwh1cim3/4SfHU+eqZ3aHtBPJWONSGw757n1/Qvuf4fO7bhvH19JxcAAAAASUVORK5CYII=';
const FAVICON = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAASFBMVEUAAAAoHhArIBEnHQ8nHQ8nHQ8nHQ8nHQ8nHQ8pGhA9AAAnJAodHRE5OQBVAAAnIA8qIBAAPwAsIBFVVQAAAAAAAAAAAAAAAAC0FRqkAAAAGHRSTlMA+v7OLlCvjm8TBA8KBAMrVgTZAwAAAADeOaORAAAE7ElEQVR42uVX25bcKAwEdAGMPZ3s/v+/bkkC231JcmZf45POYBuVhFQqcEp/3bWtwdd3rL627f/4wvXiZjD/YARxMFF79M+uXp2NziytKkxazrlI2olskDNf63pd0OjdrKqqzc0FV56Xcp3jQs++zJMZ3a0uu49XhDCkilTSy+j3VtdVmhVlS7ackv9k9QE2ABL/3sZ+WFKk8OV9NYD6/JDmP7NTQVq06Di0cJLyGYDenhOjBmqv/SJKSXM/6juA2nuddw1mvSNOCoIQnO61bZhgYeLB+xrJJ040CX8Vmem1Dgw4caEDxiM1mqkqvwbAekQ2rBQAGTYCSAwSU+5JahKfVvc5iGtcS7AV54KpNqD8cKQdFnCKpy01L0diSXqF0T3mMyHqUautXzBwpOKEm2ZFN2SkXQA7AGQR2wBgl+egZ53rs5vhQ4C3J4DxDFAxdSyAOQjC/WurcYsuNwBM266c7Kn9g+6whVkp4HIBIL9bLBVrAPKdy8diMnFaxDYAD78vqwRlmfN4u60A0McZwRQCz1nzlJ4AXu5tJgFILHcur15qBxTBiyIoodPXkKzDyUXHm4kxp3a+uHwBWLFo2K2VIgcV0UBarRnYlMx5gDnp1CSFlvUFYJVj/IKBSKkDWHGCy2ZGTo9+cRlpO65mGLmlQUjtsEwalwGwbRU3LXtwGcYEDaM7EW7dlKtVDpnJ5QFf8tVJhxlvRmwr6hTik809nYLgpUegzduq9uByNLzd0N6RfBJIDOmTrE40TP/SvEUCo7GxIog1sg+lPkv/LLx3AA0u27oFkuRSR6fCTzHwltS6EF1FVk3I9C8rrZwsWS1TVqGrzEaGhwfohHwCuNmF4fRfG3pryEygeL3HHrW0xF3NdQGRQlOVV2s0zPP6m0SS37RoTwdYch2xN0Tpr8k2O2tC2ZqTp6YRomEAFOX3QsmZQ4tlGJWq88XqB2OjkwJR02EE1fNtmcL+ODWRndDRi5QPlziTBnZxcqfWIqi3Na/lzvuMTx6NSCtfzdx8f3GH5FvDbA+FsITKbmkqjK0bVtYI+BPerZktyuGhA9F3OJMeiGmnxeWxKPET6XAA9khlphehsWeT/SFP6ZnF4wVgKoDh3C/ZSydl7T5eLPY+4dyw6/Ay47Md8bqjyAgYI/F9RdYUFmsnSVFPPKm6WkBOAOTMYqR0VPQdHNSZXuoRutdfA0BmFYJJAQX3vmqkCua+r/QVZVsAXg5PxDwv+JIdAFJHvq12jw+lJmNr8fTGjnsSyABk8gf0CkYgpiAfMhQ643WvEuWwrdepOOIAgNp0ihwfURCE0sTY8YhW8XOFlodLY+y4Jle1OxXdGccRwY4ELkezWL6/mnQ7ccTV0Lms0c+7VQrea6trQ+Ipr3YOtth2J3QrYNSP7p3kDlEhO3TRlJelahPACetNqtthPmLdrrmQqpqVLk17ukw2Y9ud22JQhEfzsyHOvVMpfnEQpbmhBsUK5IRavZ00PU69zpBvJz1Z5yxdOvvpTJtvOwFdfwFffd+NY4RXtZ3z9VRKXecwmmJrgbWHybvE18LtyKBLwsnm2wNocpmaqYqvgYajfZPWt9sHC7/GG2u3/4p0pWrle3z4bDrWoMX8ONRlQtFak4GfML5d3r6j3r+LEuMUQYQdS/oAe/aXL6mvb37luSt39N3vye1If+P1H1MeJU+/KY/kAAAAAElFTkSuQmCC';

// ---------- data ----------
let FALLBACKS = [];
// opts: { sortDesc: fieldId, keep: (record) => bool } reads newest first and stops at the first record keep() rejects.
// It uses field IDs only, so renaming a field in Airtable cannot break it.
async function atList(env, table, fields, opts = {}) {
  const out = [];
  let offset, done = false;
  do {
    const u = new URL(`https://api.airtable.com/v0/${BASE}/${table}`);
    u.searchParams.set('returnFieldsByFieldId', 'true');
    u.searchParams.set('pageSize', '100');
    fields.forEach((f) => u.searchParams.append('fields[]', f));
    if (opts.sortDesc) { u.searchParams.set('sort[0][field]', opts.sortDesc); u.searchParams.set('sort[0][direction]', 'desc'); }
    if (offset) u.searchParams.set('offset', offset);
    let r = await fetch(u, { headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}` } });
    if (r.status === 422 && fields.length) {
      // A field was deleted or renamed in Airtable. Fetch all fields instead so the site keeps working.
      FALLBACKS.push(table);
      u.searchParams.delete('fields[]');
      r = await fetch(u, { headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}` } });
    }
    if (!r.ok) throw new Error(`Airtable ${table} ${r.status}`);
    const j = await r.json();
    for (const rec of j.records) {
      if (opts.keep && !opts.keep(rec)) { done = true; break; }
      out.push(rec);
    }
    offset = j.offset;
  } while (offset && !done && out.length < 3000);
  return out;
}

const selName = (v) => (v && typeof v === 'object' ? v.name : v) || '';
const attUrl = (a, big) => { const p = (a || [])[0]; if (!p) return ''; const t = p.thumbnails || {}; return (big ? t.full && t.full.url : t.large && t.large.url) || p.url; };
// Loads the Impact Created evidence. Every row keeps its publish flags so drafts can be previewed on staging only.
async function loadEvidence(env) {
  const get = (t, f) => atList(env, t, Object.values(f)).catch(() => []);
  const pj = await get(IT.proj, PJ);
  const o = (v) => (typeof v === 'number' ? v : 999);
  const by = (a, b) => a.order - b.order;
  return {
    projects: pj.filter((r) => r.fields[PJ.title]).map((r) => { const f = r.fields; return { title: f[PJ.title], live: !!f[PJ.show], order: o(f[PJ.order]), category: selName(f[PJ.category]), year: f[PJ.year] || null, area: f[PJ.area] || '', saw: f[PJ.saw] || '', did: f[PJ.did] || '', who: f[PJ.who] || '', changed: f[PJ.changed] || '', next: f[PJ.next] || '', status: selName(f[PJ.status]), photo: attUrl(f[PJ.photo], false) }; }).sort(by),
  };
}

// Experience text comes from Airtable's "Description" (rich text). The site shows it as plain text.
const plainText = (t) => String(t || '').replace(/^\s*#+\s*/gm, '').replace(/^\s*[-*]\s+/gm, '').replace(/\*\*|__|(^|\s)_|_(\s|$)/g, '$1$2').replace(/\s*\n+\s*/g, ' ').trim();
const shortText = (t, n = 160) => (t.length <= n ? t : t.slice(0, t.lastIndexOf(' ', n)).replace(/[,.;:]$/, '') + '…');

async function loadLive(env) {
  const timing = {}; FALLBACKS = [];
  const tm = (name, p) => { const t = Date.now(); return p.finally(() => { timing[name] = Date.now() - t; }); };
  const [exps, evs, revs, imps, tms, pps, ev] = await Promise.all([
    tm('experiences', atList(env, T.exp, Object.values(EF))),
    tm('events', atList(env, T.ev, Object.values(VF), { sortDesc: VF.start, keep: (r) => Date.parse(r.fields[VF.start] || 0) > Date.now() - 2 * 86400000 })
      .catch((e) => { timing.eventsSortError = e.message; return atList(env, T.ev, Object.values(VF)); })),
    tm('reviews', atList(env, T.rev, Object.values(RF)).catch(() => null)),
    tm('impact', atList(env, T.imp, Object.values(IF)).catch(() => null)),
    tm('team', atList(env, T.team, Object.values(TF)).catch(() => [])),
    tm('pagePhotos', atList(env, PP.table, [PP.slot, PP.photo, PP.alt, PP.focus]).catch(() => null)),
    tm('projects', loadEvidence(env)),
  ]);
  const experiences = exps
    .filter((r) => r.fields[EF.show] && String(r.fields[EF.slug] || '').trim() && r.fields[EF.name])
    .map((r) => {
      const f = r.fields;
      return {
        id: r.id,
        title: String(f[EF.title] || f[EF.name]).trim(),
        slug: String(f[EF.slug]).trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
        order: typeof f[EF.order] === 'number' ? f[EF.order] : 999,
        summary: plainText(f[EF.summary]),
        description: f[EF.description] || '',
        itinerary: f[EF.itinerary] || '',
        faqs: f[EF.faqs] || '',
        prices: f[EF.prices] || '',
        age: f[EF.age] || '',
        location: f[EF.location] || '',
        timing: f[EF.timing] || '',
        categories: (f[EF.categories] || []).map((c) => (typeof c === 'string' ? c : c.name)),
        fromPrice: null,
        datesAhead: f[EF.datesAhead] ?? null,
        contact: String(f[EF.contact] || '').replace(/\D/g, '').slice(-10),
        // Website Dates From: show another experience's dates (e.g. Sunset Trek runs on Sunset to Stars dates).
        datesFrom: ((f[EF.datesFrom] || [])[0] || null),
        media: (f[EF.photos] || []).map((p) => ({
          video: /^video\//.test(p.type || ''),
          url: /^video\//.test(p.type || '') ? p.url : (p.thumbnails && p.thumbnails.full && p.thumbnails.full.url) || p.url,
          thumb: (p.thumbnails && p.thumbnails.large && p.thumbnails.large.url) || (/^video\//.test(p.type || '') ? '' : p.url),
        })),
      };
    });
  experiences.forEach((x) => { x.photos = x.media.filter((m) => !m.video); });
  const events = evs
    .filter((r) => {
      const f = r.fields;
      const st = typeof f[VF.status] === 'object' && f[VF.status] ? f[VF.status].name : f[VF.status];
      return f[VF.start] && f[VF.exp] && f[VF.exp].length && LIVE_STATUSES.includes(st) && !f[VF.hide];
    })
    .map((r) => ({ exp: r.fields[VF.exp][0], start: r.fields[VF.start], end: r.fields[VF.end] || null }));
  const att = (a) => (a && a[0] ? (a[0].thumbnails && a[0].thumbnails.large && a[0].thumbnails.large.url) || a[0].url : '');
  const reviews = revs === null ? (MEMO && MEMO.d.reviews) || SNAPSHOT.reviews : revs
    .filter((r) => r.fields[RF.show] && r.fields[RF.text])
    .map((r) => ({ name: r.fields[RF.name] || '', text: r.fields[RF.text], exp: r.fields[RF.exp] || [], photo: att(r.fields[RF.photo]) }));
  const impact = imps === null ? (MEMO && MEMO.d.impact) || SNAPSHOT.impact : imps
    .filter((r) => r.fields[IF.show] && r.fields[IF.metric])
    .map((r) => ({ metric: r.fields[IF.metric], value: r.fields[IF.value] || '', order: r.fields[IF.order] ?? 99, category: selName(r.fields[IF.category]), opens: selName(r.fields[IF.opens]) }))
    .sort((a, b) => a.order - b.order);
  const team = !tms.length && SNAPSHOT.team ? SNAPSHOT.team : tms
    .filter((r) => r.fields[TF.show] && r.fields[TF.name])
    .map((r) => {
      const f = r.fields, g = f[TF.group];
      const p = (f[TF.photo] || [])[0];
      return { id: r.id, name: f[TF.name], role: f[TF.role] || '', group: (g && g.name) || g || '', bio: f[TF.bio] || '', order: f[TF.order] ?? 99,
        photo: p ? (p.thumbnails && p.thumbnails.large && p.thumbnails.large.url) || p.url : '',
        joined: f[TF.joined] || null, learned: f[TF.learned] || '',
        building: f[TF.building] || '', from: f[TF.from] || [], kinds: (f[TF.kinds] || []).map(selName) };
    });
  const slots = pps === null ? (MEMO && MEMO.d.slots) || {} : Object.fromEntries(pps
    .filter((r) => r.fields[PP.slot] && (r.fields[PP.photo] || []).length)
    .map((r) => { const f = r.fields, a = f[PP.photo][0], t = a.thumbnails || {};
      return [String(f[PP.slot]).trim(), { url: (t.full && t.full.url) || a.url, thumb: (t.large && t.large.url) || a.url, alt: f[PP.alt] || '', pos: FOCUS[selName(f[PP.focus])] || '' }]; }));
  return { experiences, events, reviews, impact, team, evidence: ev, slots, timing: { ...timing, fieldFallbacks: FALLBACKS.slice() }, source: 'live' };
}

let MEMO = null;
let REFRESHING = null;
let LAST_ERR = '';
// Visitors never wait for Airtable once a copy exists. A copy younger than CACHE_SECONDS is served as is.
// An older copy (up to STALE_SECONDS) is served instantly while a fresh one loads in the background.
// Only a copy older than STALE_SECONDS (Airtable photo links expire) or no copy at all makes the visitor wait.
const STALE_SECONDS = 3600;
const DATA_KEY = 'https://data.cache/rock-anchor-v4';
function refreshData(env, ctx) {
  if (!REFRESHING) {
    REFRESHING = loadLive(env).then(async (d) => {
      const t = Date.now();
      MEMO = { t, d };
      await caches.default.put(new Request(DATA_KEY), new Response(JSON.stringify({ t, d }), { headers: { 'Cache-Control': `max-age=${STALE_SECONDS}`, 'Content-Type': 'application/json' } }));
      return d;
    }).catch((e) => { LAST_ERR = new Date().toISOString() + ' ' + e.message; throw e; }).finally(() => { REFRESHING = null; });
  }
  if (ctx) ctx.waitUntil(REFRESHING.catch((e) => console.log('refresh failed', e.message)));
  return REFRESHING;
}
async function getData(env, ctx) {
  if (!env.AIRTABLE_TOKEN) return SNAPSHOT;
  // Another worker instance may already hold a newer copy in the shared cache.
  if (!MEMO || Date.now() - MEMO.t >= CACHE_SECONDS * 1000) {
    const hit = await caches.default.match(new Request(DATA_KEY));
    if (hit) { try { const j = await hit.json(); if (j && j.d && (!MEMO || j.t > MEMO.t)) MEMO = { t: j.t, d: j.d }; } catch (e) {} }
  }
  const age = MEMO ? (Date.now() - MEMO.t) / 1000 : Infinity;
  if (age < CACHE_SECONDS) return MEMO.d;
  if (age < STALE_SECONDS) { refreshData(env, ctx); return MEMO.d; }
  try {
    return await refreshData(env, ctx);
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
    .filter((e) => e.exp === (exp.datesFrom || exp.id))
    .filter((e) => { const t = Date.parse(e.start); return t >= now && t <= limit; })
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}
const waLink = (msg) => `https://wa.me/${SITE.wa}?text=${encodeURIComponent(msg)}`;
// Offers. In the Prices field, a line "Label | new price | regular price" is an offer row, and a line
// "Offer until 2026-11-30: text" is the banner and the last day. After that day the site quietly shows the regular price.
function offerState(text) {
  const m = String(text || '').match(/^\s*offer(?:\s+until\s+(\d{4}-\d{2}-\d{2}))?\s*:\s*(.+)$/im);
  const today = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
  return { banner: m ? m[2].trim() : '', until: m && m[1] ? m[1] : '', active: !!m && (!m[1] || today <= m[1]) };
}
function priceInfo(e) {
  let min = null, group = false, free = '', minLabel = '', minOld = null;
  const off = offerState(e.prices);
  for (const raw of String(e.prices || '').split('\n')) {
    const i = raw.indexOf('|');
    if (i < 0) continue;
    const label = raw.slice(0, i).trim(); let val = raw.slice(i + 1);
    const parts = val.split('|');
    let old = null;
    if (parts.length > 1) { const o = (parts[1].match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i) || [])[1]; if (o) old = Number(o.replace(/,/g, '')); val = off.active ? parts[0] : parts[1]; if (!off.active) old = null; }
    if (/optional|add.?on|^transport|^travel/i.test(label)) continue;
    // A line such as "Villagers | Free" is shown as "Free for villagers".
    if (/^\s*free\b/i.test(val)) { if (!free) free = label; continue; }
    const m = val.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i);
    if (!m) continue;
    const n = Number(m[1].replace(/,/g, ''));
    if (n && (min === null || n < min)) { min = n; minOld = old; minLabel = label; group = /people|group/i.test(label) && !/per person/i.test(val); }
  }
  if (min === null && e.fromPrice && !/price on request/i.test(e.prices || '')) min = e.fromPrice;
  return { min, group, free, minLabel, minOld };
}
const priceOnRequest = (e) => priceInfo(e).min === null && !priceInfo(e).free;
const freeFor = (e) => priceInfo(e).free;
const paidLine = (e) => { const p = priceInfo(e); return p.min === null ? '' : `${p.minLabel ? p.minLabel + ' ' : 'Others '}${rupees(p.min)} ${p.group ? 'per group' : 'per person'}`; };
const lowest = (e) => priceInfo(e).min;
const rupees = (n) => '₹' + Number(n).toLocaleString('en-IN');
// Consistent display values. Airtable stays free text; the site normalises the wording.
const fmtAge = (a) => String(a || '').trim().replace(/(\d+)\s*(?:to|-|–)\s*(\d+)/g, '$1–$2').replace(/\s*\(([^)]*)\)/, ', $1') || 'Ask us';
const fmtPlace = (l) => String(l || '').trim().replace(/\s*,\s*within\s+/i, ' · ').replace(/\s*,\s*/, ' · ') || 'Shared on booking';
const fmtPrice = (e) => (freeFor(e) ? `Free for ${freeFor(e).toLowerCase()}` : priceOnRequest(e) ? 'On request' : `From ${rupees(lowest(e))}`);
const INCLUDED_RE = /^what'?s included|^included|^inclusions/i;
// Packing lists are private (sent on WhatsApp after booking), so these sections are never shown.
const PRIVATE_RE = /^what to (bring|carry|pack)|^packing/i;
function sections(e) {
  // Splits Website Description into intro text, ordinary sections and the two special sections.
  const out = { intro: [], other: [], included: null };
  let cur = null;
  for (const raw of String(e.description || '').split('\n')) {
    const l = raw.trim();
    if (l.startsWith('## ')) {
      const h = l.slice(3).trim();
      cur = { h, lines: [] };
      if (INCLUDED_RE.test(h)) out.included = cur; else if (!PRIVATE_RE.test(h)) out.other.push(cur);
      continue;
    }
    (cur ? cur.lines : out.intro).push(raw);
  }
  if (!out.included) {
    const inc = String(e.prices || '').split('\n').find((l) => /^includes?\b/i.test(l.trim()));
    if (inc) out.included = { h: "What's included", lines: inc.trim().replace(/^includes?:?\s*/i, '').replace(/\.$/, '').split(/,\s*/).map((x) => '- ' + x.charAt(0).toUpperCase() + x.slice(1)) };
  }
  return out;
}
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
  const rows = [], notes = [], off = offerState(text);
  let offerRows = 0;
  for (const raw of String(text || '').split('\n')) {
    const l = raw.trim();
    if (!l || /^includes?\b/i.test(l) || /^offer(\s+until\s+[\d-]+)?\s*:/i.test(l)) continue;
    const i = l.indexOf('|');
    if (i > 0) {
      const label = esc(l.slice(0, i).trim()), parts = l.slice(i + 1).split('|').map((x) => x.trim());
      if (parts.length > 1 && off.active) {
        offerRows++;
        const n = Number((parts[0].match(/[\d,]+/) || ['0'])[0].replace(/,/g, '')), o = Number((parts[1].match(/[\d,]+/) || ['0'])[0].replace(/,/g, ''));
        rows.push(`<tr class="offer"><th>${label}</th><td class="was"><s>${esc(parts[1])}</s></td><td class="now">${esc(parts[0])}${o > n && n ? `<small>Save ${rupees(o - n)}</small>` : ''}</td></tr>`);
      } else rows.push(`<tr><th>${label}</th><td${off.active && offerRows ? ' colspan="2"' : ''}>${esc(parts.length > 1 ? parts[1] : parts[0])}</td></tr>`);
    } else notes.push(`<p class="note">${esc(l)}</p>`);
  }
  const head = offerRows ? '<thead><tr><th></th><th>Regular</th><th>Offer</th></tr></thead>' : '';
  const banner = off.active && offerRows && off.banner ? `<div class="offer-banner">${esc(off.banner)}</div>` : '';
  return banner + (rows.length ? `<table class="prices${offerRows ? ' has-offer' : ''}">${head}${rows.join('')}</table>` : '') + notes.join('');
}
function faqsHtml(text) {
  return String(text || '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).map((b) => {
    const [q, ...a] = b.split('\n');
    return `<details class="faq"><summary>${esc(q)}</summary><p>${esc(a.join(' '))}</p></details>`;
  }).join('');
}

// ---------- layout ----------
const SOCIAL_ICON = {
  yt: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>',
  fb: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M13.6 8h-1.2c-1 0-1.6.7-1.6 1.7V18M9.3 12.2h4.6"/></svg>',
  li: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.8 10.5V17M7.8 7.3v.1M11.5 17v-6.5M11.5 13.2c0-1.6 1-2.7 2.4-2.7s2.3 1 2.3 2.6V17"/></svg>',
};
const socialRow = () => `<div class="social"><h4>Follow us</h4><div class="icons">${SITE.social.map(([n, u, k]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="Rock & Anchor on ${n}" title="${n}">${SOCIAL_ICON[k]}</a>`).join('')}</div></div>`;
const ICON = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2Zm8 7 8-5H4l8 5Zm0 2L4 8v10h16V8l-8 5Z"/></svg>',
  insta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm5.2-3.2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 3v5.4l3.6 2.1-1 1.7L11 13.5V7h2Z"/></svg>',
  people: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm8 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6ZM2 20c0-3.3 3.1-6 7-6s7 2.7 7 6v1H2v-1Zm16 1v-1c0-1.6-.5-3-1.4-4.2 3 .4 5.4 2.4 5.4 4.9V21h-4Z"/></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm-1.2 13.6-3.4-3.4 1.4-1.4 2 2 4.6-4.6 1.4 1.4-6 6Z"/></svg>',
  tag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 3h8l10 10-8 8L3 11V3Zm4.5 2.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></svg>',
};

const CSS = `
:root{--ink:#221d19;--ink2:#4a423b;--muted:#776c62;--paper:#f6f1e8;--card:#fffdf9;--line:#e4dccf;--forest:#2c4535;--forest2:#3d5c48;--moss:#e7eee3;--clay:#b8612f;--clay2:#9c4f24;--night:#141a24;--r:14px;--max:1160px}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--paper);color:var(--ink);font:400 17px/1.6 "DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}a{color:inherit}
h1,h2,h3,.display{font-family:"Big Shoulders Display","Arial Narrow",sans-serif;font-weight:800;line-height:1.02;letter-spacing:.01em;margin:0 0 .4em;text-transform:uppercase}
h1{font-size:clamp(44px,8vw,92px)}
h1,h2,h3,.ab-bigline,.im-quote{text-wrap:balance}h2{font-size:clamp(34px,5vw,56px)}h3{font-size:26px;margin-top:1.4em}
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
@media (max-width:1060px){nav.main{gap:18px}nav.main a{font-size:15px}}
@media (max-width:920px){nav.main{gap:12px}nav.main a{font-size:14px}nav.main .btn{padding:9px 12px}}
.menu{display:none}
@media (max-width:820px){nav.main{display:none}.menu{display:block}
.menu summary{list-style:none;cursor:pointer;padding:10px;margin-right:-10px}.menu summary::-webkit-details-marker{display:none}
.menu summary span{display:block;width:24px;height:2px;background:var(--ink);margin:5px 0}
.menu[open] .panel{position:absolute;left:0;right:0;top:68px;background:var(--paper);border-bottom:1px solid var(--line);padding:8px 20px 20px;display:flex;flex-direction:column}
.menu .panel a{padding:14px 0;border-bottom:1px solid var(--line);text-decoration:none;font-size:20px;font-weight:500}
.menu .panel .btn{margin-top:16px;justify-content:center;border:0;color:#fff}}
.hero{position:relative;min-height:clamp(440px,64vh,600px);display:flex;align-items:center;color:#fff;overflow:hidden;background:var(--night)}
.hero img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,16,22,.5) 0%,rgba(12,16,22,.22) 45%,rgba(12,16,22,0) 70%)}
@media (max-width:820px){.hero:after{background:linear-gradient(180deg,rgba(12,16,22,.25) 0%,rgba(12,16,22,.5) 100%)}}
.hero .wrap{position:relative;z-index:2;padding-top:48px;padding-bottom:48px;width:100%}
.hero h1{font-size:clamp(46px,7vw,84px);margin-bottom:.25em;text-shadow:0 2px 18px rgba(0,0,0,.55),0 1px 3px rgba(0,0,0,.35)}
.hero .eyebrow{color:#f7d2b2;max-width:none;text-shadow:0 1px 6px rgba(0,0,0,.6)}.hero p{color:#fff;max-width:46ch;margin:0}
.hero .hero-what{font-size:clamp(20px,2.4vw,26px);font-weight:700;line-height:1.3;margin-bottom:8px;text-shadow:0 1px 12px rgba(0,0,0,.4)}
.hero .hero-sub{font-size:clamp(17px,2vw,20px);line-height:1.5;color:#fff;max-width:48ch;margin-bottom:24px;text-shadow:0 1px 10px rgba(0,0,0,.7),0 1px 2px rgba(0,0,0,.5)}
.sec-sub{margin:8px 0 0;max-width:56ch}
.pillars{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;margin:30px 0 8px}.pillars>div{border-left:3px solid #f3c9a6;padding:4px 0 4px 18px}.pillars h3{margin:0 0 6px;color:#fff;text-transform:uppercase;letter-spacing:.06em}.pillars p{margin:0;color:#dfe8e0}
.believe{text-align:center}.believe h2{max-width:26ch;margin:0 auto 18px}.believe p{font-size:clamp(17px,2vw,20px);line-height:1.6;color:var(--ink2);margin:0 auto 14px}.believe .more{font-weight:700;color:var(--clay);text-decoration:none}
@media(max-width:640px){.pillars{grid-template-columns:1fr}}
.trust{background:var(--card);border-bottom:1px solid var(--line)}
.trust .wrap{display:flex;align-items:center;gap:10px 18px;flex-wrap:wrap;padding-top:14px;padding-bottom:14px}
.trust-label{font:700 12px/1.2 "DM Sans",system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.certs{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.certs li{display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border:1px solid var(--line);border-radius:999px;background:var(--paper);font-size:13.5px;font-weight:500;color:var(--ink2)}
.certs svg{width:15px;height:15px;color:var(--forest2);flex:0 0 15px}
@media (max-width:820px){.trust .wrap{flex-wrap:nowrap;flex-direction:column;align-items:flex-start;gap:8px}.trust .certs{flex-wrap:nowrap;overflow-x:auto;max-width:100%;padding-bottom:4px;scrollbar-width:none}.trust .certs li{white-space:nowrap}
.facts{grid-template-columns:1fr 1fr}}
.hero .btn-ghost{color:#fff}
section{padding:64px 0}section.tight{padding:48px 0}section.first{padding-top:44px}
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
.card p{color:var(--ink2);font-size:15.5px;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:3.2em}
.meta3{margin:auto 0 0;padding-top:14px;border-top:1px solid var(--line);display:grid;grid-template-columns:auto 1fr;gap:6px 14px;font-size:14.5px}
.meta3 div{display:contents}.meta3 dt{color:var(--muted);font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding-top:2px}
.meta3 dd{margin:0;color:var(--ink);font-weight:500}.meta3 dd.price{font-weight:700}
.noimg{width:100%;height:100%;display:grid;place-items:center;background:linear-gradient(135deg,#e7dfd2,#d8cebe)}.noimg img{width:72px!important;height:auto!important;opacity:.35}
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
.why>div{background:var(--card);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;display:flex;flex-direction:column}
.why .why-img{width:100%;aspect-ratio:3/2;object-fit:cover;display:block;height:auto}
.why .why-body{padding:18px 20px 22px}
.why h3{font-size:24px;margin:0 0 8px}.why p{margin:0;color:var(--ink2);font-size:15.5px}
.reviews{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px}
.review{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:26px;margin:0}
.review blockquote{margin:0 0 16px;font-size:16px;color:var(--ink2);display:-webkit-box;-webkit-line-clamp:7;-webkit-box-orient:vertical;overflow:hidden}
.review blockquote:before{content:"\\201C";display:block;font:800 54px/0.6 "Big Shoulders Display","Arial Narrow",sans-serif;color:var(--clay);margin-bottom:6px}
.review figcaption{display:flex;align-items:center;gap:12px}
.review figcaption img,.review .avatar{width:44px;height:44px;border-radius:50%;object-fit:cover;flex:0 0 44px}
.review .avatar{display:grid;place-items:center;background:var(--moss);color:var(--forest);font-weight:700;font-size:15px}
.cta{background:var(--night);color:#fff;border-radius:22px;padding:clamp(28px,5vw,52px);display:grid;gap:28px 48px;grid-template-columns:minmax(0,1fr) auto;align-items:center}
.cta .eyebrow{color:#f3c9a6;margin:0 0 10px}.cta h2{margin:0 0 12px}.cta p{color:#c9ced8;margin:0;max-width:52ch}
.cta-actions{display:flex;flex-direction:column;gap:12px;min-width:250px}.cta-actions .btn{justify-content:center}.cta .btn-ghost{color:#fff}
@media (max-width:820px){.cta{grid-template-columns:1fr}.cta-actions{min-width:0}}
.page-head{padding:64px 0 34px}
.page-head .lead{margin-top:10px}
.page-head .prose h1{font-size:clamp(40px,6vw,64px)}
.exp-hero{display:grid;grid-template-columns:1.25fr 1fr;gap:12px;margin-top:6px;height:min(520px,46vw)}
.exp-hero.one{grid-template-columns:1fr}
.exp-hero .tile{position:relative;display:block;border-radius:var(--r);overflow:hidden;background:#d8d0c3;min-height:0;cursor:zoom-in}.exp-hero .tile img,.exp-hero .tile video{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s}.exp-hero .vtile{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:linear-gradient(140deg,#2b3a31,#121a16) center/cover;color:#fff;font-size:13px;letter-spacing:.06em}.exp-hero .vplay{width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.16);border:1.5px solid rgba(255,255,255,.7);position:relative;transition:transform .25s}.exp-hero .vplay::after{content:"";position:absolute;left:22px;top:17px;border-style:solid;border-width:11px 0 11px 17px;border-color:transparent transparent transparent #fff}.exp-hero .tile:hover .vplay{transform:scale(1.08)}.exp-hero .tile:has(.more) .vplay,.exp-hero .tile:has(.more) .vlab{display:none}.exp-hero .tile:hover img{transform:scale(1.03)}.exp-hero .more{position:absolute;inset:0;display:grid;place-items:center;background:rgba(12,16,22,.5);color:#fff;font:800 clamp(30px,3.4vw,44px)/1 "Big Shoulders Display","Arial Narrow",sans-serif;letter-spacing:.02em}
.lb{position:fixed;inset:0;z-index:100;background:rgba(10,12,16,.97);display:flex;align-items:center;justify-content:center}.lb[hidden]{display:none}.lb figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:12px;max-width:min(92vw,1400px)}.lb img,.lb video{max-width:100%;max-height:82vh;object-fit:contain;border-radius:8px}.lb img[hidden],.lb video[hidden]{display:none}.lb figcaption{color:#cfc8bd;font-size:14px;letter-spacing:.08em}.lb button{background:rgba(255,255,255,.12);color:#fff;border:0;border-radius:999px;cursor:pointer;display:grid;place-items:center}.lb button:hover{background:rgba(255,255,255,.25)}.lb-nav{position:absolute;top:50%;transform:translateY(-50%);width:52px;height:52px;font-size:34px;line-height:1}.lb-prev{left:18px}.lb-next{right:18px}.lb-x{position:absolute;top:16px;right:16px;width:44px;height:44px;font-size:28px}.lb button[hidden]{display:none}
.exp-hero .side{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:12px;min-height:0}
.exp-hero .side .tile:only-child{grid-column:span 2;grid-row:span 2}
.exp-hero .side .tile:first-child:nth-last-child(2),.exp-hero .side .tile:first-child:nth-last-child(2)~.tile{grid-column:span 2}
.exp-hero .side .tile:first-child:nth-last-child(3){grid-column:span 2}
@media (max-width:820px){.exp-hero{height:auto;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:10px;margin:0 -20px;padding:0 20px}
.exp-hero .main,.exp-hero .side .tile{flex:0 0 86%;scroll-snap-align:center;aspect-ratio:4/3;height:auto}.lb-nav{width:42px;height:42px;font-size:28px}.lb-prev{left:8px}.lb-next{right:8px}.exp-hero.one .main{flex-basis:100%}.exp-hero .side{display:contents}}
.exp-layout{display:grid;grid-template-columns:minmax(0,1fr) 370px;gap:56px;align-items:start;margin-top:40px}
@media (max-width:960px){.exp-layout{grid-template-columns:1fr;gap:28px}}
.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
.facts div{display:flex;gap:12px;align-items:flex-start}.facts svg{width:22px;height:22px;flex:0 0 22px;color:var(--clay);margin-top:2px}
.facts small{display:block;color:var(--muted);font-size:13px;text-transform:uppercase;letter-spacing:.08em}
.facts b{font-weight:600}
.content h3{font-size:24px;margin-top:1.2em}
.xhead{padding-top:48px}.xhead .lead{margin:0 0 26px}
.facts{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:20px 22px;margin:22px 0 0}
.facts em{display:block;font-style:normal;color:var(--muted);font-size:13.5px;margin-top:2px}
.toc{display:flex;gap:6px 18px;flex-wrap:wrap;margin:18px 0 0;font-size:14.5px;font-weight:500}.toc a{text-decoration:none;color:var(--ink2);border-bottom:1.5px solid var(--line)}.toc a:hover{color:var(--clay);border-color:var(--clay)}
.xsec{padding:0 0 34px;margin:0 0 34px;border-bottom:1px solid var(--line);scroll-margin-top:90px}.xsec:last-child{border-bottom:0}
.xh{font-size:clamp(28px,3.4vw,36px);margin:0 0 14px}
.steps{margin:0 0 18px;padding-left:22px}.steps li{margin:8px 0;padding-left:6px}
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
.prices thead th{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted,#6b6b6b);font-weight:600;text-align:right;padding:10px 16px}.prices thead th:first-child{text-align:left}
.prices .was{color:var(--muted,#6b6b6b);font-weight:500;text-align:right}.prices .was s{text-decoration-thickness:2px;text-decoration-color:#b3402e}
.prices .now{color:#2d4a3e;font-size:1.08em;text-align:right}.prices .now small{display:block;font-size:12px;font-weight:600;color:#2d4a3e;opacity:.8}
.offer-banner{background:#2d4a3e;color:#fff;border-radius:var(--r);padding:11px 16px;font-weight:600;margin:6px 0 10px}
.side-card .from s{color:#6b6b6b;font-weight:500;margin-right:4px}
.note{color:var(--ink2);font-size:15px}
.clamp3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
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
footer.site .social{margin-top:22px}footer.site .social .icons{display:flex;gap:12px}footer.site .social a{display:grid;place-items:center;width:44px;height:44px;padding:0;border:1px solid #4a423b;border-radius:12px;color:#f3e9dc;transition:background .15s,color .15s,border-color .15s}footer.site .social a:hover{background:#f3c9a6;border-color:#f3c9a6;color:var(--ink)}footer.site .social svg{width:22px;height:22px}
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

function layout({ title, desc, path, body, image, data, contact }) {
  const full = title ? `${title} | Rock & Anchor` : 'Rock & Anchor | Authentic outdoor experiences in the Sahyadris';
  const nav = [['/experiences', 'Experiences'], ['/curate', 'Curate'], ['/impact', 'Impact Created'], ['/about', 'About Us'], ['/team', 'Team'], ['/values', 'Values'], ['/contact', 'Contact']];
  const navHtml = nav.map(([h, l]) => `<a href="${h}"${path.startsWith(h) ? ' class="on"' : ''}>${l}</a>`).join('');
  const wa = waLink('Hi Rock & Anchor, I would like to know more about your experiences.');
  // On an experience with its own contact number, the header, menu and floating WhatsApp buttons use that number.
  const pwa = contact ? `https://wa.me/${contact.wa}?text=${encodeURIComponent(`Hi Rock & Anchor, I would like to know more about ${title}.`)}` : wa;
  const pphone = contact ? contact.phone : SITE.phone;
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(full)}</title><meta name="description" content="${esc(desc || '')}">
<link rel="canonical" href="${SITE.url}${path}"><link rel="icon" type="image/png" href="/favicon.png">
<meta property="og:type" content="website"><meta property="og:site_name" content="Rock & Anchor"><meta property="og:title" content="${esc(full)}"><meta property="og:description" content="${esc(desc || '')}">${image ? `<meta property="og:image" content="${esc(image)}">` : ''}
<meta name="theme-color" content="#f6f1e8">${FONTS}<style>${CSS}</style></head><body>
<header class="site"><div class="wrap"><a class="brand" href="/" aria-label="Rock & Anchor home"><img src="/logo.png" alt="Rock & Anchor" width="56" height="46"></a>
<nav class="main">${navHtml}<a class="btn btn-wa" href="${pwa}">${ICON.wa}WhatsApp us</a></nav>
<details class="menu"><summary aria-label="Menu"><span></span><span></span><span></span></summary><div class="panel"><a href="/">Home</a>${navHtml}<a class="btn btn-wa" href="${pwa}">${ICON.wa}WhatsApp ${pphone}</a></div></details></div></header>
<main>${body}</main>
<footer class="site"><div class="wrap"><div class="cols">
<div><img class="logo" src="/logo.png" alt="Rock & Anchor"><p>Curated outdoor experiences in the Sahyadris, led by certified outdoor educators and the villagers who call these mountains home.</p>${socialRow()}</div>
<div><h4>Explore</h4><a href="/experiences">Experiences</a><a href="/curate">Curate your own</a><a href="/impact">Impact Created</a><a href="/about">About Us</a><a href="/team">Team</a><a href="/values">Values</a><a href="/contact">Contact</a></div>
<div><h4>Talk to us</h4><a href="tel:${SITE.tel}">${SITE.phone}</a><a href="${wa}">WhatsApp</a><a href="mailto:${SITE.email}">${SITE.email}</a><a href="https://instagram.com/${SITE.insta}">Instagram @${SITE.insta}</a></div>
</div><div class="fine">© ${new Date().getFullYear()} Rock & Anchor · <a style="display:inline" href="/terms">Terms</a> · <a style="display:inline" href="/privacy">Privacy</a> · <a style="display:inline" href="/cancellation-and-refunds">Cancellation and refunds</a><br>Bookings are confirmed over call or WhatsApp on ${SITE.phone}.</div></div></footer>
<a class="float-wa" href="${pwa}" aria-label="WhatsApp Rock & Anchor">${ICON.wa}</a>
</body></html>`;
}

// ---------- components ----------
function badgeFor(data, e) {
  const up = upcoming(data, e);
  if (up.length) return `<span class="badge next">Next: ${esc(shortDay(up[0].start))}</span>`;
  if (e.categories.includes('Monsoon')) return '<span class="badge soon">Back next monsoon</span>';
  return '<span class="badge">Dates on request</span>';
}
function cardMeta(e) {
  return `<dl class="meta3"><div><dt>Age</dt><dd>${esc(fmtAge(e.age))}</dd></div><div><dt>Location</dt><dd>${esc(fmtPlace(e.location))}</dd></div><div><dt>Price</dt><dd class="price">${esc(fmtPrice(e))}</dd></div></dl>`;
}
function photoBox(src, alt, cls, pos) {
  return src ? `<img ${cls ? `class="${cls}" ` : ''}src="${esc(src)}"${pos ? ` style="object-position:${pos}"` : ''} alt="${esc(alt)}" loading="lazy">` : `<div class="noimg${cls ? ' ' + cls : ''}"><img src="/logo.png" alt=""></div>`;
}
function card(data, e) {
  return `<a class="card" href="/experiences/${esc(e.slug)}" data-cats="${esc(e.categories.join('|'))}">
<div class="ph">${photoBox(cover(e), e.title)}${badgeFor(data, e)}</div>
<div class="body"><span class="cat">${esc(e.categories.slice(0, 2).join(' · ') || 'Experience')}</span><h3>${esc(e.title)}</h3><p class="clamp3">${esc(e.summary || firstLine(e))}</p>
${cardMeta(e)}</div></a>`;
}
const firstLine = (e) => (String(e.description || '').split('\n').find((l) => l.trim() && !/^(##|-)/.test(l.trim())) || '').trim();
function reviewsBlock(list) {
  if (!list.length) return '';
  const initials = (n) => String(n || '?').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return `<div class="reviews">${list.map((r) => `<figure class="review"><blockquote>${esc(clean(r.text).trim())}</blockquote><figcaption>${r.photo ? `<img src="${esc(r.photo)}" alt="" loading="lazy">` : `<span class="avatar">${esc(initials(r.name))}</span>`}<b>${esc(r.name)}</b></figcaption></figure>`).join('')}</div>`;
}
function ctaBlock(msg) {
  return `<section class="tight"><div class="wrap"><div class="cta"><div class="cta-text"><p class="eyebrow">Plan your day outdoors</p><h2>Ready when you are</h2><p>Bookings happen over call and WhatsApp, so a real person answers your questions, checks dates and suggests the right experience for your group.</p></div>
<div class="cta-actions"><a class="btn btn-clay" href="${waLink(msg || 'Hi Rock & Anchor, I would like to plan an experience.')}">${ICON.wa}WhatsApp us</a><a class="btn btn-ghost" href="tel:${SITE.tel}">${ICON.phone}Call ${SITE.phone}</a></div></div></div></section>`;
}
const CERTS = ['Wilderness First Responder', 'Wilderness First Aid', 'Advanced First Aid, CPR & AED', 'Basic Mountaineering (NIM)', 'Diploma in Mountaineering', 'Sahyadri Search & Rescue'];
const certBadges = (list) => `<ul class="certs">${list.map((c) => `<li>${ICON.shield}${esc(c)}</li>`).join('')}</ul>`;
const sorted = (data) => [...data.experiences].sort((a, b) => a.order - b.order);
const bySlug = (data, s) => data.experiences.find((e) => e.slug === s);

// ---------- photo gallery ----------
// Shows up to 5 photos; the 5th tile carries "+N" when there are more. Any tile opens a slideshow of all photos.
function galleryHtml(e, ph) {
  if (!ph.length) return '';
  const SHOW = 5;
  const extra = ph.length - SHOW;
  const tile = (p, i, cls, big) => `<a class="tile${cls}${p.video ? ' vid' : ''}" href="${esc(p.url)}" data-i="${i}" aria-label="Open ${p.video ? 'video' : 'photo'} ${i + 1} of ${ph.length}">${p.video ? `<span class="vtile"${p.thumb ? ` style="background-image:url('${esc(p.thumb)}')"` : ''}><span class="vplay"></span><span class="vlab">Play video</span></span>` : `<img src="${esc(big ? p.url : p.thumb)}" alt="${esc(e.title)}"${i ? ' loading="lazy"' : ' fetchpriority="high"'}>`}${i === SHOW - 1 && extra > 0 ? `<span class="more">+${extra}</span>` : ''}</a>`;
  const side = ph.slice(1, SHOW).map((p, k) => tile(p, k + 1, '', false)).join('');
  const urls = JSON.stringify(ph.map((p) => (p.video ? { v: p.url } : p.url))).replace(/</g, '\\u003c');
  return `<div class="exp-hero${ph.length === 1 ? ' one' : ''}" id="gallery">${tile(ph[0], 0, ' main', true)}${ph.length > 1 ? `<div class="side">${side}</div>` : ''}</div>
<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Photos"><button class="lb-x" type="button" aria-label="Close">&times;</button><button class="lb-nav lb-prev" type="button" aria-label="Previous photo">&#8249;</button><figure><img alt="${esc(e.title)}"><video controls playsinline hidden></video><figcaption></figcaption></figure><button class="lb-nav lb-next" type="button" aria-label="Next photo">&#8250;</button></div>
<script>(function(){var U=${urls},lb=document.getElementById('lb'),im=lb.querySelector('img'),vd=lb.querySelector('video'),cap=lb.querySelector('figcaption'),i=0,x0=null;
function show(n){i=(n+U.length)%U.length;var u=U[i];vd.pause();if(u&&u.v){im.hidden=true;vd.hidden=false;vd.src=u.v;vd.play().catch(function(){})}else{vd.hidden=true;vd.removeAttribute('src');im.hidden=false;im.src=u}cap.textContent=(i+1)+' / '+U.length;[i+1,i-1].forEach(function(k){var q=U[(k+U.length)%U.length];if(typeof q==='string'){var p=new Image();p.src=q}})}
function open(n){show(n);lb.hidden=false;document.body.style.overflow='hidden';lb.querySelector('.lb-next').focus()}
function close(){lb.hidden=true;vd.pause();document.body.style.overflow=''}
document.querySelectorAll('#gallery .tile').forEach(function(a){a.addEventListener('click',function(ev){ev.preventDefault();open(+a.dataset.i)})});
lb.querySelector('.lb-prev').onclick=function(){show(i-1)};lb.querySelector('.lb-next').onclick=function(){show(i+1)};lb.querySelector('.lb-x').onclick=close;
lb.addEventListener('click',function(ev){if(ev.target===lb||ev.target.tagName==='FIGURE')close()});
document.addEventListener('keydown',function(ev){if(lb.hidden)return;if(ev.key==='Escape')close();if(ev.key==='ArrowRight')show(i+1);if(ev.key==='ArrowLeft')show(i-1)});
lb.addEventListener('touchstart',function(ev){x0=ev.touches[0].clientX},{passive:true});lb.addEventListener('touchend',function(ev){if(x0===null)return;var d=ev.changedTouches[0].clientX-x0;if(Math.abs(d)>40)show(d<0?i+1:i-1);x0=null});
if(U.length<2)lb.querySelectorAll('.lb-nav').forEach(function(b){b.hidden=true})})();</script>`;
}

// A photo spot chosen in the Website Page Photos table, or the fallback when the row is empty.
function slot(data, key, fallback = '') {
  const x = data && data.slots && data.slots[key];
  const big = /\.(hero|earth|end)$/.test(key);
  return x ? { src: big ? x.url : x.thumb, alt: x.alt, pos: x.pos } : { src: fallback, alt: '', pos: '' };
}
const posStyle = (s) => (s && s.pos ? ` style="object-position:${s.pos}"` : '');

// ---------- pages ----------
function home(data) {
  const exps = sorted(data);
  const hero = bySlug(data, SITE.heroSlug) || exps[0];
  const nexts = exps.map((e) => ({ e, n: upcoming(data, e)[0] })).filter((x) => x.n).sort((a, b) => Date.parse(a.n.start) - Date.parse(b.n.start)).slice(0, 6);
  const featured = nexts.length >= 3 ? nexts.map((x) => x.e) : exps.slice(0, 6);
  const pick = (slug, i) => { const x = bySlug(data, slug); const p = x && x.photos && (x.photos[i] || x.photos[0]); return p ? p.thumb : ''; };
  const anyPhoto = (n) => { const all = exps.flatMap((x) => x.photos || []); return all.length ? all[n % all.length].thumb : ''; };
  const why = [
    ['Safety first', 'Experienced leaders, thoughtful planning and the skills to handle the outdoors responsibly.', slot(data, 'home.why.safety', pick('winter-trekking', 1) || anyPhoto(1), false)],
    ['Hidden places', 'Crowd-free trails, quiet villages, forests, lakes and night skies across the Sahyadris.', slot(data, 'home.why.hidden', pick('ridge-and-lake', 0) || anyPhoto(5), false)],
    ['Local knowledge', 'Experiences shaped and hosted with people who know these places as home.', slot(data, 'home.why.local', pick('be-a-villager', 3) || anyPhoto(9), false)],
    ['Meant to be experienced', "Small groups, thoughtful activities and experiences designed around the people you're with.", slot(data, 'home.why.experienced', pick('young-explorers-winter-school', 0) || anyPhoto(13), false)],
  ];
  const heroP = slot(data, 'home.hero', cover(hero, true));
  const body = `
<section class="hero"><img class="bg" src="${esc(heroP.src)}"${posStyle(heroP)} alt="" fetchpriority="high"><div class="wrap">
<p class="eyebrow">Outdoor experiences in the Sahyadris</p><h1>Come outside.<br>Find something real.</h1>
<p class="hero-sub">Treks, stargazing, village experiences and outdoor learning that reconnect you with nature and the communities that call the Sahyadris home.</p>
<div class="row"><a class="btn btn-clay" href="/experiences">Explore experiences</a><a class="btn btn-ghost" href="${waLink('Hi Rock & Anchor, I would like to know more about your experiences.')}">${ICON.wa}WhatsApp us</a></div></div></section>

<section class="first"><div class="wrap"><div class="sec-head"><div><h2>Find your way outside</h2><p class="lead sec-sub">From a few hours in the forest to a night under the stars, there's an experience for every kind of explorer.</p></div><a href="/experiences">All experiences →</a></div>
<div class="grid">${featured.map((e) => card(data, e)).join('')}</div></div></section>

<section><div class="wrap"><h2>Outdoors, with purpose</h2>
<div class="why">${why.map(([h, t, img]) => `<div>${photoBox(img.src, img.alt || h, 'why-img', img.pos)}<div class="why-body"><h3>${h}</h3><p>${t}</p></div></div>`).join('')}</div></div></section>

<section class="band"><div class="wrap"><h2>The outdoors should give back</h2>
<p class="lead">We use outdoor experiences to create opportunities for people, support village schools and build a deeper connection with the places we visit.</p>
<div class="pillars"><div><h3>Educate</h3><p>We help people understand nature, sustainability, survival and local culture.</p></div><div><h3>Employ</h3><p>We create meaningful work for people who call these mountains home.</p></div></div>
${data.impact.length ? `<div class="stats">${data.impact.map((i) => `<div class="stat"><b>${esc(i.value)}</b><span>${esc(i.metric)}</span></div>`).join('')}</div>` : ''}
<p style="margin-top:34px"><a class="btn btn-ghost" style="color:#fff" href="/impact">See our impact</a></p></div></section>

<section class="believe"><div class="wrap"><h2>We believe the best adventures leave something behind.</h2>
<p>A little more curiosity.<br>A little more confidence.<br>A little more respect for the places and people we encounter.</p>
<p><a class="more" href="/about">About Rock & Anchor →</a></p></div></section>

${data.reviews.length ? `<section style="padding-top:0"><div class="wrap"><div class="sec-head"><div><p class="eyebrow">In their words</p><h2>What people say</h2></div></div>${reviewsBlock(data.reviews.slice(0, 6))}</div></section>` : ''}
<section class="tight"><div class="wrap"><div class="cta"><div class="cta-text"><h2>Your next adventure is out there.</h2><p>Come explore the Sahyadris with us.</p></div>
<div class="cta-actions"><a class="btn btn-clay" href="/experiences">Explore experiences</a><a class="btn btn-ghost" href="${waLink('Hi Rock & Anchor, I would like to plan an experience.')}">${ICON.wa}Talk to us on WhatsApp</a></div></div></div></section>`;
  return layout({ title: '', desc: 'Authentic outdoor experiences in the Sahyadris near Mumbai: treks, stargazing, village stays and nature days for families, schools and teams.', path: '/', body, image: heroP.src, data });
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
  const ph = e.media || e.photos || [];
  // An experience can have its own contact number (Website Contact Number in Airtable); otherwise the business number.
  const c = /^\d{10}$/.test(e.contact || '') ? { wa: '91' + e.contact, tel: '+91' + e.contact, phone: `+91 ${e.contact.slice(0, 5)} ${e.contact.slice(5)}` } : SITE;
  const ask = (when) => `https://wa.me/${c.wa}?text=${encodeURIComponent(`Hi Rock & Anchor, I would like to book ${e.title}${when ? ' on ' + when : ''}.`)}`;
  const dateLi = (ev) => { const l = eventLabel(ev); return `<li><span>${esc(l)}</span><a href="${ask(l)}">Ask →</a></li>`; };
  const datesHtml = up.length
    ? `<p class="muted" style="font-size:14px;margin:0 0 8px">Upcoming dates</p><ul class="dates">${up.slice(0, 6).map(dateLi).join('')}</ul>${up.length > 6 ? `<details class="dates"><summary>${up.length - 6} more dates</summary><ul class="dates" style="margin-top:8px">${up.slice(6).map(dateLi).join('')}</ul></details>` : ''}`
    : `<div class="nodates">${e.categories.includes('Monsoon') ? 'This one runs in the monsoon (June to September). Message us to hear when dates open.' : 'Dates on request. Tell us your group size and preferred day and we will plan it with you.'}</div>`;
  const revs = data.reviews.filter((r) => (r.exp || []).includes(e.id));
  const sec = sections(e);
  const block = (id, title, inner) => `<section class="xsec" id="${id}"><h2 class="xh">${title}</h2>${inner}</section>`;
  const fallback = (t) => `<p class="muted">${t}</p>`;
  const nextLbl = up.length ? `Next: ${esc(eventLabel(up[0]))}` : (e.categories.includes('Monsoon') ? 'Runs in the monsoon' : 'Dates on request');
  const fact = (icon, label, val, extra) => `<div>${icon}<span><small>${label}</small><b>${esc(val)}</b>${extra ? `<em>${extra}</em>` : ''}</span></div>`;
  const aboutHtml = md(sec.intro.join('\n')) + sec.other.map((o) => `<h3>${esc(o.h)}</h3>${md(o.lines.join('\n'))}`).join('');
  const steps = ['Message us on WhatsApp or call with the date and your group size.', 'We confirm availability and share the payment and registration details.', 'Pay to reserve your spot. Register to receive pre experience details. You get a confirmation with the meeting point, packing list and any other important details.'];
  const body = `<section class="page-head xhead"><div class="wrap">
<p class="eyebrow"><a href="/experiences" style="text-decoration:none">Experiences</a> · ${esc(e.categories.join(' · '))}</p><h1>${esc(e.title)}</h1>
<p class="lead">${esc(e.summary || firstLine(e))}</p>
${galleryHtml(e, ph)}
<div class="facts">${fact(ICON.people, 'Who is it for', fmtAge(e.age))}${fact(ICON.pin, 'Where', fmtPlace(e.location))}${fact(ICON.clock, 'When', e.timing || 'On request', nextLbl)}${fact(ICON.tag, 'Price', fmtPrice(e), freeFor(e) ? paidLine(e) : priceOnRequest(e) ? '' : (priceInfo(e).group ? 'per group' : 'per person'))}</div>
<nav class="toc"><a href="#about">About</a><a href="#included">Included</a><a href="#plan">Itinerary</a><a href="#pricing">Price</a><a href="#faqs">FAQs</a><a href="#how">How to book</a></nav>
<div class="exp-layout"><div class="content">
${block('about', 'What is it?', aboutHtml || fallback('Message us and we will tell you all about it.'))}
${block('included', "What's included", sec.included ? md(sec.included.lines.join('\n')) : fallback('We share the full list of inclusions when you enquire.'))}
${block('plan', 'Itinerary', e.itinerary ? itineraryHtml(e.itinerary) : fallback('The detailed plan is shared when you book.'))}
${block('pricing', 'Price', priceOnRequest(e) ? fallback('Price depends on your group size and date. Message us for a quote.') + pricesHtml(String(e.prices || '').split('\n').filter((l) => !/price on request/i.test(l)).join('\n')) : pricesHtml(e.prices))}
${block('faqs', 'FAQs', e.faqs ? faqsHtml(e.faqs) : fallback('Have a question? WhatsApp us and a real person will answer.'))}
${block('how', 'How to book', `<ol class="steps">${steps.map((t) => `<li>${t}</li>`).join('')}</ol><div class="row"><a class="btn btn-wa" href="${ask('')}">${ICON.wa}Book on WhatsApp</a><a class="btn btn-ghost" href="tel:${c.tel}">${ICON.phone}Call ${c.phone}</a></div>`)}
</div>
<aside class="side-card" id="book"><h3>${esc(e.title)}</h3><div class="from">${freeFor(e) ? `<b>Free</b> for ${esc(freeFor(e).toLowerCase())}${paidLine(e) ? `<br><small>${esc(paidLine(e))}</small>` : ''}` : priceOnRequest(e) ? 'Price on request' : `From ${priceInfo(e).minOld ? `<s>${rupees(priceInfo(e).minOld)}</s> ` : ''}<b>${rupees(lowest(e))}</b> ${priceInfo(e).group ? 'per group' : 'per person'}${offerState(e.prices).active && offerState(e.prices).banner && priceInfo(e).minOld ? `<br><small>${esc(offerState(e.prices).banner)}</small>` : ''}`}</div>
${datesHtml}
<a class="btn btn-wa" href="${ask('')}">${ICON.wa}Book on WhatsApp</a><a class="btn btn-ghost" href="tel:${c.tel}">${ICON.phone}Call ${c.phone}</a>
<p class="small">No online payment. We confirm your spot over call or WhatsApp.</p></aside></div></div></section>
${revs.length ? `<section><div class="wrap"><h2>What people say</h2>${reviewsBlock(revs)}</div></section>` : ''}
<div class="bookbar"><a href="#book" style="text-decoration:none"><small>${up.length ? 'Next date' : 'Dates'}</small><b>${up.length ? esc(dayStr(up[0].start)) : 'On request'}</b> <span style="color:var(--clay);font-size:13px;font-weight:700">${up.length > 1 ? 'All dates ↓' : ''}</span></a><a class="btn btn-wa" href="${ask('')}">${ICON.wa}Book</a></div>
<script>document.body.classList.add('has-bookbar')</script>`;
  return layout({ title: e.title, desc: shortText(e.summary || firstLine(e)), path: `/experiences/${e.slug}`, body, image: cover(e, true), data, contact: c === SITE ? null : c });
}

// ---------- About page: an interactive manifesto ----------
// Story order: why we exist > problem > intersection > experiences > model > shared value >
// this is why > people > origin > future > see the evidence > beliefs > invitation.
// About speaks as Rock & Anchor: it makes the argument. Evidence (numbers, projects, money) lives on Impact Created.
const ABOUT_BELIEFS = [
  'Nature is not a backdrop.',
  'Villages are not destinations.',
  'Local people should benefit from tourism.',
];

function aboutPage(data) {
  const ph = (slug, i, big) => {
    const x = bySlug(data, slug);
    const p = x && x.photos && (x.photos[i] || x.photos[0]);
    if (p) return big ? p.url : p.thumb;
    const all = sorted(data).flatMap((e) => e.photos || []);
    return all.length ? (big ? all[(i * 7) % all.length].url : all[(i * 7) % all.length].thumb) : '';
  };
  // S(key, fallback) reads a spot from the Website Page Photos table; the alt text there replaces the default.
  const S = (key, fb) => slot(data, key, fb);
  const heroP = S('about.hero', ph('ridge-and-lake', 0, true)), earthP = S('about.earth', ph('winter-trekking', 1, true)), endP = S('about.end', ph('ridge-and-lake', 2, true));
  const img = (src, alt, cls = '') => { const o = typeof src === 'object' && src ? src : { src, alt: '', pos: '' }; return o.src ? `<img class="${cls}" src="${esc(o.src)}"${posStyle(o)} alt="${esc(o.alt || alt)}" loading="lazy">` : `<div class="${cls} ab-noimg"></div>`; };

  const problems = [
    ['01', 'We are losing our connection with nature', 'Modern life has made it easier to be connected to everything except the natural world around us.', S('about.problem.1', ph('night-sky-experience', 1, true)), 'A guest looking out of a tent at sunrise over the Sahyadris', '<span>City</span><span>Phone</span><span>Screen</span><i></i><span>Forest</span><span>Mountains</span><span>Night sky</span>'],
    ['02', 'Rural communities are losing opportunity', 'In many rural communities, young people leave because meaningful work is limited. When people leave, villages do not just lose workers. They can lose knowledge, traditions, relationships and the people who hold communities together.', S('about.problem.2', ph('be-a-villager', 0, true)), 'Village life in the Sahyadris', ''],
    ['03', 'The places we depend on need us to care', 'Tourism can either extract value from a place or help create value within it.', S('about.problem.3', ph('winter-trekking', 2, true)), 'A gorge in the Sahyadris', ''],
  ];
  const circles = [
    ['people', 'People', 'connection', 'Reconnect with nature, themselves and others.'],
    ['communities', 'Communities', 'opportunity', 'Create meaningful work, skills and opportunities close to home.'],
    ['places', 'Places', 'care', 'Protect ecosystems, culture and local knowledge.'],
  ];
  const tmi = [
    ['Touch', 'You encounter a place, a person, a story.', S('about.tmi.touch', ph('hidden-kingdom', 1, true)), 'Snail shells held in a guest’s palm'],
    ['Move', 'You participate rather than simply observe.', S('about.tmi.move', ph('monsoon-village-1-day', 2, true)), 'Children floating in a monsoon stream'],
    ['Inspire', 'You leave with a possibility you did not have before.', S('about.tmi.inspire', ph('rooftop-stargazing', 0, true)), 'A girl looking through a telescope'],
  ];
  const model = [
    ['Educate', 'We use the outdoors as a classroom.', S('about.model.educate', ph('young-explorers-winter-school', 2, true)), 'A child learning with a facilitator',
      `<p>Participants learn about:</p><ul class="ab-list"><li>Nature</li><li>Local ecosystems</li><li>Survival and life skills</li><li>Sustainability</li><li>Local culture</li></ul><p>And we support learning in the communities around us. The village decides what it needs. Your experience helps make it happen.</p>`],
    ['Employ', 'We create meaningful opportunities for people from the villages where we operate.', S('about.model.employ', ph('hidden-kingdom', 2, true)), 'A shared meal served on leaves',
      `<p>Not simply as labour. As:</p><ul class="ab-list"><li>Guides</li><li>Facilitators</li><li>Hosts</li><li>Cooks</li><li>Leaders</li><li>Specialists</li></ul>`],
    ['Empower', 'Skills become confidence. Confidence becomes leadership. Leadership creates possibilities for others.', S('about.model.empower', ph('be-a-villager', 1, true)), 'A facilitator sitting in a circle with village children',
      `<ul class="ab-steps"><li><b>Create</b> their own projects and experiences</li><li><b>Bring others along</b> and build a team</li><li><b>Find their voice</b> and speak with confidence</li><li><b>Set goals</b> and work towards them</li><li><b>Lead</b> groups and make decisions</li><li><b>Hand over</b> to the next person they have trained</li></ul>`],
  ];
  const ring = ['Guest', 'Experience', 'Local people', 'Local economy', 'Community', 'Place', 'Better care'];
  const gains = [
    ['Guest', 'A meaningful experience.'],
    ['Local community', 'Income, skills, relationships and opportunity.'],
    ['Village', 'Economic value and investment staying closer to home.'],
    ['Nature', 'People who understand and care for it.'],
    ['Rock & Anchor', 'A sustainable business capable of doing more.'],
  ];
  // "This is why": About makes the argument. The evidence lives on Impact Created.
  const ground = [
    ['This is why we work with villages.', 'Villages hold knowledge, food, stories and ways of living that are quietly disappearing. When a village hosts an experience, the value stays in the village.', S('about.ground.villages', ph('little-feet-sunset-safari', 2, true)), 'Guests with their village hosts'],
    ['This is why we care about nature.', 'You cannot care for a place you have never felt. We bring people close to the natural world, and leave it as we found it.', S('about.ground.nature', ph('monsoon-village-1-day', 0, true)), 'A monsoon waterfall in the Sahyadris'],
    ['This is why we employ locally.', 'The people who live here know these mountains better than anyone. Meaningful work close to home means young people do not have to leave to find it.', S('about.ground.employ', ph('young-explorers-winter-school', 1, true)), 'A local guide leading a group'],
    ['This is why we support village schools.', 'A community that learns can build its own future. The village decides what it needs. Your experience helps make it happen.', S('about.ground.schools', ph('be-a-villager', 3, true)), 'Village school children'],
    ['This is why experiences matter.', 'People learn by touching, building, getting wet and asking questions. A day outside teaches what a classroom or a screen cannot.', S('about.ground.experiences', ph('little-feet-sensory', 2, true)), 'Children playing in a stream'],
  ];
  const roles = [
    ['Local guides', 'People who know every trail, river and season, trained to lead groups safely.'],
    ['Village hosts', 'Families who share their food, stories, farming and culture with our guests.'],
    ['Outdoor educators', 'The people responsible for learning, safety and how every experience is designed.'],
    ['Rock & Anchor team', 'The people who coordinate the whole system, from the first message to the walk back.'],
  ];
  const gi = (g) => { const i = TEAM_GROUPS.indexOf(g); return i < 0 ? 99 : i; };
  const team = (data.team || []).slice().sort((a, b) => gi(a.group) - gi(b.group) || a.order - b.order);
  const workWith = waLink('Hi Rock & Anchor, I would like to work with you (school, company or partnership).');

  // Circular "everyone gains" diagram.
  const R = 170, cx = 220, cy = 220;
  const ringNodes = ring.map((r, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / ring.length; return { r, x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }; });
  const ringSvg = `<svg class="ab-ring" viewBox="0 0 440 440" role="img" aria-labelledby="ringT"><title id="ringT">A cycle: guest, experience, local people, local economy, community, place, better care, and back to the guest.</title>
<circle class="track" cx="${cx}" cy="${cy}" r="${R}"/><path id="ringPath" class="track-path" d="M${cx} ${cy - R} a${R} ${R} 0 1 1 -0.01 0"/>
<circle class="dot" r="7"><animateMotion dur="14s" repeatCount="indefinite"><mpath href="#ringPath"/></animateMotion></circle>
${ringNodes.map((n) => `<g class="rn"><circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="44"/><text x="${n.x.toFixed(1)}" y="${(n.y + 5).toFixed(1)}">${esc(n.r)}</text></g>`).join('')}
<text class="mid" x="${cx}" y="${cy - 6}">Everyone</text><text class="mid" x="${cx}" y="${cy + 26}">gains</text></svg>`;

  const body = `<style>${ABOUT_CSS}</style>
<div class="ab">
<section class="ab-hero" id="why"><div class="ab-stick">
  <img class="ab-bg" data-par src="${esc(heroP.src)}"${posStyle(heroP)} alt="" fetchpriority="high">
  <div class="wrap ab-hero-text"><p class="ab-kicker">Why we exist</p><h1>We believe getting outside can change more than you.</h1>
  <p class="ab-sub">Rock &amp; Anchor exists to reconnect people with nature, create meaningful livelihoods in rural communities, and help protect the places that make those connections possible.</p></div>
  <a class="ab-scroll" href="#problem" aria-label="Scroll to read more"><span></span></a>
</div></section>

<section class="ab-problem" id="problem"><div class="wrap">
  <p class="ab-kicker rv">The problem we noticed</p><h2 class="ab-h rv">Something is being lost.</h2>
  <div class="ab-probs">${problems.map(([n, h, t, src, alt, strip]) => `<article class="ab-prob rv">${img(src, alt, 'ab-prob-img')}<div class="ab-prob-body"><span class="ab-num">${n}</span><h3>${h}</h3><p>${t}</p>${strip ? `<div class="ab-strip" aria-hidden="true">${strip}</div>` : ''}</div></article>`).join('')}</div>
</div></section>

<section class="ab-earth" id="earth"><div class="ab-earth-stick">
  <img class="ab-earth-img" src="${esc(earthP.src)}"${posStyle(earthP)} alt="${esc(earthP.alt || 'The Sahyadri mountains')}" loading="lazy">
  <p class="ab-earth-text">We do not have an <span>Earth&nbsp;2.0.</span></p>
</div></section>

<section class="ab-inter" id="together"><div class="wrap ab-inter-grid">
  <div><p class="ab-kicker rv">The intersection</p><h2 class="ab-h rv">Three things that should not be separated.</h2>
  <div class="ab-tabs" role="tablist" aria-label="People, communities and places">${circles.map(([k, l, s], i) => `<button type="button" role="tab" class="ab-tab${i ? '' : ' on'}" data-k="${k}" aria-selected="${i ? 'false' : 'true'}"><b>${l}</b><span>${s}</span></button>`).join('')}</div>
  <div class="ab-tabtext" aria-live="polite">${circles.map(([k, l, s, t], i) => `<p data-k="${k}"${i ? ' hidden' : ''}><b>${l}.</b> ${t}</p>`).join('')}</div>
  <p class="ab-centerline rv"><b>Rock &amp; Anchor</b> uses experiences to bring these three together.</p></div>
  <svg class="ab-venn" viewBox="0 0 420 400" role="img" aria-labelledby="vennT"><title id="vennT">Three overlapping circles: people, communities and places, with Rock and Anchor at the centre.</title>
    <circle class="vc" data-k="people" cx="210" cy="140" r="115"/><circle class="vc" data-k="communities" cx="290" cy="265" r="115"/><circle class="vc" data-k="places" cx="130" cy="265" r="115"/>
    <text class="vl" x="210" y="82">PEOPLE</text><text class="vs" x="210" y="104">connection</text>
    <text class="vl" x="330" y="318">COMMUNITIES</text><text class="vs" x="330" y="340">opportunity</text>
    <text class="vl" x="92" y="318">PLACES</text><text class="vs" x="92" y="340">care</text>
    <circle class="vcore" cx="210" cy="222" r="46"/><text class="vcore-t" x="210" y="218">ROCK &amp;</text><text class="vcore-t" x="210" y="238">ANCHOR</text>
  </svg>
</div></section>

<section class="ab-exp" id="experience"><div class="wrap">
  <p class="ab-kicker rv">What we believe about experiences</p><h2 class="ab-h rv">An experience can do more than give you a good day.</h2>
  <ol class="ab-journey" data-journey>${['Come curious', 'Participate', 'Connect', 'Understand', 'Care', 'Act'].map((w) => `<li>${w}</li>`).join('')}</ol>
  <div class="ab-tmi">
    <div class="ab-tmi-steps">${tmi.map(([w, t], i) => `<div class="ab-tmi-step" data-i="${i}"><h3>${w}</h3><p>${t}</p></div>`).join('')}</div>
    <div class="ab-tmi-media" aria-hidden="true">${tmi.map(([w, , src, alt], i) => img(src, alt, 'ab-tmi-img' + (i ? '' : ' on'))).join('')}</div>
  </div>
  <p class="ab-bigline rv">The best experiences do not end when you leave.</p>
</div></section>

<section class="ab-model" id="model"><div class="wrap">
  <p class="ab-kicker rv">Our model</p><h2 class="ab-h rv">Our work does not stop at the experience.</h2>
  <div class="ab-cards">${model.map(([h, lead, src, alt, more], i) => `<article class="ab-card rv"${i ? '' : ' data-open'}>${img(src, alt, 'ab-card-img')}<div class="ab-card-body"><span class="ab-num">0${i + 1}</span><h3>${h}</h3><p class="ab-card-lead">${lead}</p>
    <button type="button" class="ab-more" aria-expanded="${i ? 'false' : 'true'}" aria-controls="m${i}">What this means</button><div class="ab-card-more" id="m${i}"${i ? ' hidden' : ''}>${more}</div></div></article>`).join('<span class="ab-arrow" aria-hidden="true">→</span>')}</div>
  <p class="ab-bigline rv">A community that can build its own future.</p>
</div></section>

<section class="ab-gain" id="gain"><div class="wrap ab-gain-grid">
  <div>${ringSvg}</div>
  <div><p class="ab-kicker rv">The experience is shared</p><h2 class="ab-h rv">Everyone should gain.</h2>
  <p class="ab-p rv">When you come on an experience, the value does not stop with you. It moves through the people who host it, the village economy and the place itself, and comes back as places that are cared for and worth returning to.</p>
  <dl class="ab-gains">${gains.map(([w, t]) => `<div class="rv"><dt>${esc(w)} gets</dt><dd>${t}</dd></div>`).join('')}</dl></div>
</div></section>

<section class="ab-ground" id="ground"><div class="wrap">
  <p class="ab-kicker rv">Why we work the way we do</p><h2 class="ab-h rv">Every choice comes back to what we believe.</h2></div>
  <div class="ab-rail" tabindex="0" aria-label="Why we work the way we do">${ground.map(([h, t, src, alt]) => `<div class="ab-tile">${img(src, alt, 'ab-tile-img')}<span class="ab-tile-body"><b>${h}</b><span>${t}</span></span></div>`).join('')}</div>
  <div class="wrap"><a class="ab-link ab-bridge rv" href="/impact">See what that looks like: Impact Created →</a></div>
</section>

<section class="ab-people" id="people"><div class="wrap">
  <p class="ab-kicker rv">The people behind the experience</p><h2 class="ab-h rv">People make the place.</h2>
  <div class="ab-roles">${roles.map(([h, t], i) => `<div class="ab-role rv"><span class="ab-num">0${i + 1}</span><h3>${h}</h3><p>${t}</p></div>`).join('')}</div>
  ${team.length ? `<div class="ab-team rv"><p>Some of the people you will meet</p><ul>${team.map((m) => `<li>${m.photo ? `<img src="${esc(m.photo)}" alt="" loading="lazy">` : `<span class="ab-av">${esc(m.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join(''))}</span>`}<b>${esc(m.name)}</b><small>${esc(m.role)}</small></li>`).join('')}</ul><a class="ab-link" href="/team">Meet the team →</a></div>` : ''}
</div></section>

<section class="ab-origin" id="origin"><div class="wrap ab-origin-grid">
  ${img(S('about.origin', ph('winter-trekking', 0, true)), 'A Rock & Anchor group in the Sahyadris', 'ab-origin-img rv')}
  <div class="ab-origin-text"><p class="ab-kicker rv">The origin</p><h2 class="ab-h rv">It started with Aaditya and Mansi.</h2>
  <p class="rv">Aaditya and Mansi met on a trek in the Sahyadris, brought together by a shared love for the outdoors and the experiences that happen there.</p>
  <p class="rv">Over time, they began to see that these experiences could mean more than a day in the mountains. They could connect people with nature, create meaningful work in rural communities, and help people see the places they visit differently.</p>
  <p class="rv"><b>That idea became Rock &amp; Anchor.</b></p>
  <p class="rv">What began with a few outdoor experiences has grown into a community built around nature, learning, livelihoods and meaningful adventure.</p>
  <p class="ab-italic rv">And we are still exploring what it can become.</p></div>
</div></section>

<section class="ab-future" id="future"><div class="wrap">
  <p class="ab-kicker rv">What we are building</p><h2 class="ab-h rv">We are not trying to build another adventure company.</h2>
  <p class="ab-p ab-wide rv">We want to build a model where exploring rural India creates value for the people who live there, encourages people to care for the places they visit, and gives more people a reason to step outside.</p>
  <div class="ab-ambitions">${[['More local leaders', 'People who can create and lead experiences themselves.'], ['More opportunities', 'More meaningful livelihoods close to home.'], ['More people connected to nature', 'Especially children and young people.']].map(([h, t]) => `<div class="rv"><h3>${h}</h3><p>${t}</p></div>`).join('')}</div>
</div></section>

<section class="ab-proof" id="proof"><div class="wrap">
  <p class="ab-kicker rv">The evidence</p><h2 class="ab-h rv">See what that looks like.</h2>
  <p class="ab-p rv">This page is what we believe. What actually happens because of it, the projects, the money, the people and the places, is on its own page.</p>
  <div class="ab-see"><a href="/impact">Impact Created →</a><a href="/team">The people who make it happen →</a></div>
</div></section>

<section class="ab-believe" id="believe"><div class="wrap">
  <p class="ab-kicker">A few things we believe.</p>
  <ul>${ABOUT_BELIEFS.map((b) => `<li class="rv">${b}</li>`).join('')}</ul>
</div></section>

<section class="ab-end" id="come"><img class="ab-end-img" src="${esc(endP.src)}"${posStyle(endP)} alt="" loading="lazy"><div class="wrap">
  <h2 class="ab-end-h rv">Get outside. Come back changed.</h2>
  <div class="ab-end-cta rv"><a class="btn btn-clay" href="/experiences">Explore experiences</a><a class="btn btn-ghost" href="${workWith}">${ICON.wa}Work with us</a></div>
</div></section>
</div>
<script>${ABOUT_JS}</script>`;
  return layout({ title: 'About Us', desc: 'Why Rock & Anchor exists: reconnecting people with nature, creating meaningful livelihoods in rural communities and caring for the places we visit.', path: '/about', body, image: heroP.src, data });
}

const ABOUT_JS = `(function(){
var d=document,w=window,rm=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
d.documentElement.classList.add('abjs');
var io=('IntersectionObserver' in w)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px'}):null;
d.querySelectorAll('.ab .rv').forEach(function(el){if(io&&!rm)io.observe(el);else el.classList.add('in')});
/* hero parallax and Earth 2.0 reveal */
var bg=d.querySelector('.ab-bg'),hero=d.querySelector('.ab-hero'),earth=d.querySelector('.ab-earth'),eimg=d.querySelector('.ab-earth-img'),etext=d.querySelector('.ab-earth-text'),tick=false;
function prog(el){var r=el.getBoundingClientRect(),h=el.offsetHeight-w.innerHeight;return Math.min(1,Math.max(0,-r.top/(h>0?h:1)))}
function frame(){tick=false;if(rm)return;if(hero&&bg){var p=prog(hero);bg.style.transform='scale('+(1.12-p*.1)+') translateY('+(p*-6)+'%)'}
if(earth){var q=prog(earth);eimg.style.opacity=Math.min(1,q*1.6);eimg.style.transform='scale('+(1.1-q*.1)+')';etext.style.color=q>.35?'#fff':''}}
w.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});frame();
if(rm&&eimg){eimg.style.opacity=1;etext.style.color='#fff'}
/* intersection tabs */
var tabs=d.querySelectorAll('.ab-tab'),texts=d.querySelectorAll('.ab-tabtext p'),vc=d.querySelectorAll('.ab-venn .vc');
function pick(k){tabs.forEach(function(t){var on=t.dataset.k===k;t.classList.toggle('on',on);t.setAttribute('aria-selected',on)});texts.forEach(function(p){p.hidden=p.dataset.k!==k});vc.forEach(function(c){c.classList.toggle('on',c.dataset.k===k)})}
tabs.forEach(function(t){t.addEventListener('click',function(){pick(t.dataset.k)})});vc.forEach(function(c){c.addEventListener('click',function(){pick(c.dataset.k)})});pick('people');
/* journey words light up */
var jw=d.querySelectorAll('[data-journey] li');
if(io&&!rm){var jo=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){jw.forEach(function(li,i){setTimeout(function(){li.classList.add('on')},i*260)});jo.disconnect()}})},{threshold:.6});var jl=d.querySelector('[data-journey]');if(jl)jo.observe(jl)}else jw.forEach(function(li){li.classList.add('on')});
/* touch move inspire */
var steps=d.querySelectorAll('.ab-tmi-step'),imgs=d.querySelectorAll('.ab-tmi-img');
function act(i){steps.forEach(function(s,k){s.classList.toggle('on',k===i)});imgs.forEach(function(m,k){m.classList.toggle('on',k===i)})}
if('IntersectionObserver' in w){var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)act(+e.target.dataset.i)})},{rootMargin:'-45% 0px -45% 0px'});steps.forEach(function(s){so.observe(s)})}act(0);
steps.forEach(function(s){s.addEventListener('click',function(){act(+s.dataset.i)})});
/* model cards */
d.querySelectorAll('.ab-more').forEach(function(b){b.addEventListener('click',function(){var m=d.getElementById(b.getAttribute('aria-controls')),o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!o);m.hidden=o;b.closest('.ab-card').toggleAttribute('data-open',!o)})});
/* on the ground modal */
var md=d.getElementById('abModal'),last=null;if(md){
function openG(i){d.querySelectorAll('.ab-g').forEach(function(g){g.hidden=g.dataset.g!==String(i)});md.hidden=false;d.body.style.overflow='hidden';md.querySelector('.ab-x').focus()}
function closeG(){md.hidden=true;d.body.style.overflow='';if(last)last.focus()}
d.querySelectorAll('.ab-tile').forEach(function(t){t.addEventListener('click',function(){last=t;openG(t.dataset.g)})});
md.querySelector('.ab-x').addEventListener('click',closeG);md.addEventListener('click',function(e){if(e.target===md)closeG()});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!md.hidden)closeG()});}
/* numbers count up */
if(!rm&&io){var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);var el=e.target,raw=el.dataset.count,m=raw.match(/^([\\d,]+)(.*)$/);if(!m)return;var end=+m[1].replace(/,/g,''),suf=m[2],t0=null;function st(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/1200),v=Math.round(end*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString('en-IN')+suf;if(p<1)requestAnimationFrame(st)}requestAnimationFrame(st)})},{threshold:.6});d.querySelectorAll('[data-count]').forEach(function(el){co.observe(el)})}
})();`;

const ABOUT_CSS = `
.ab{--sp:clamp(72px,10vw,140px)}
.ab section{padding:var(--sp) 0}
.ab-kicker{font:700 13px/1 "DM Sans",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--clay);margin:0 0 16px}
.ab-h{font-size:clamp(36px,5.6vw,72px);max-width:30ch;margin:0 0 .5em}
.ab-p{font-size:clamp(17px,1.6vw,19px);color:var(--ink2);max-width:58ch}
.ab-wide{max-width:70ch;font-size:clamp(19px,2vw,24px);line-height:1.5}
.ab-num{display:block;font:800 15px/1 "Big Shoulders Display","Arial Narrow",sans-serif;letter-spacing:.12em;color:var(--clay);margin-bottom:10px}
.ab-noimg{background:linear-gradient(135deg,#d8d0c3,#c9bfae)}
.abjs .ab .rv{opacity:0;transform:translateY(22px);transition:opacity .8s ease,transform .8s ease}
.abjs .ab .rv.in{opacity:1;transform:none}
/* 1 hero */
.ab-hero{height:165vh;padding:0!important;position:relative;background:var(--night)}
.ab-stick{position:sticky;top:0;height:100vh;overflow:hidden;display:flex;align-items:flex-end}
.ab-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scale(1.12);will-change:transform}
.ab-stick:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,16,22,.05) 30%,rgba(12,16,22,.62) 100%)}
.ab-hero-text{position:relative;z-index:2;padding-bottom:clamp(64px,12vh,120px);color:#fff}
.ab-hero-text .ab-kicker{color:#f7d2b2}
.ab-hero h1{font-size:clamp(44px,7.6vw,104px);max-width:14ch;margin:0 0 .3em;text-shadow:0 2px 24px rgba(0,0,0,.35)}
.ab-sub{font-size:clamp(17px,1.9vw,21px);max-width:52ch;margin:0;color:#f2ede6;text-shadow:0 1px 10px rgba(0,0,0,.55)}
.ab-scroll{position:absolute;z-index:2;left:50%;bottom:22px;width:26px;height:42px;border:2px solid rgba(255,255,255,.7);border-radius:20px;transform:translateX(-50%)}
.ab-scroll span{position:absolute;left:50%;top:8px;width:4px;height:8px;margin-left:-2px;border-radius:2px;background:#fff;animation:abs 1.8s infinite}
@keyframes abs{0%{opacity:0;transform:translateY(0)}40%{opacity:1}100%{opacity:0;transform:translateY(14px)}}
/* 2 problem */
.ab-probs{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:40px}
.ab-prob{background:var(--card);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;display:flex;flex-direction:column}
.ab-prob-img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block}
.ab-prob-body{padding:24px 24px 28px}
.ab-prob h3{font-size:clamp(24px,2.3vw,30px);margin:0 0 .45em}
.ab-prob p{margin:0;color:var(--ink2)}
.ab-strip{display:flex;flex-wrap:wrap;gap:6px;margin-top:18px;font-size:13px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.ab-strip span{padding:5px 10px;border-radius:999px;background:#ece5d9;color:var(--muted)}
.ab-strip span:nth-child(n+5){background:var(--moss);color:var(--forest)}
.ab-strip i{width:100%;height:0}
/* earth */
.ab-earth{height:190vh;padding:0!important;background:var(--paper)}
.ab-earth-stick{position:sticky;top:0;height:100vh;overflow:hidden;display:grid;place-items:center}
.ab-earth-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transform:scale(1.1)}
.ab-earth-stick:after{content:"";position:absolute;inset:0;background:rgba(12,16,22,.28);pointer-events:none}
.ab-earth-text{position:relative;z-index:2;margin:0;padding:0 20px;text-align:center;font:800 clamp(52px,11vw,170px)/.92 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;color:var(--ink);transition:color .6s;max-width:12ch;text-shadow:0 2px 30px rgba(0,0,0,.18)}
.ab-earth-text span{display:block;color:#f3c9a6}
/* 3 intersection */
.ab-inter-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.ab-tabs{display:flex;gap:10px;flex-wrap:wrap;margin:8px 0 18px}
.ab-tab{border:1.5px solid var(--line);background:var(--card);border-radius:999px;padding:10px 18px;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;font:inherit;color:var(--ink);transition:all .2s}
.ab-tab b{font-size:16px}.ab-tab span{font-size:13px;color:var(--muted)}
.ab-tab.on{background:var(--forest);border-color:var(--forest);color:#fff}.ab-tab.on span{color:#cfe0d2}
.ab-tabtext p{font-size:clamp(18px,1.8vw,22px);line-height:1.5;max-width:40ch;min-height:3em;margin:0}
.ab-centerline{margin-top:26px;padding-top:22px;border-top:1px solid var(--line);font-size:18px;color:var(--ink2);max-width:44ch}
.ab-venn{width:100%;max-width:520px;justify-self:center}
.ab-venn .vc{fill:rgba(44,69,53,.07);stroke:var(--forest);stroke-width:1.5;cursor:pointer;transition:fill .3s}
.ab-venn .vc.on{fill:rgba(184,97,47,.16);stroke:var(--clay)}
.ab-venn text{text-anchor:middle;pointer-events:none}
.ab-venn .vl{font:800 19px "Big Shoulders Display","Arial Narrow",sans-serif;letter-spacing:.08em;fill:var(--ink)}
.ab-venn .vs{font:italic 14px "DM Sans",sans-serif;fill:var(--muted)}
.ab-venn .vcore{fill:var(--clay)}
.ab-venn .vcore-t{font:800 14px "Big Shoulders Display","Arial Narrow",sans-serif;letter-spacing:.08em;fill:#fff}
/* 4 experiences */
.ab-exp{background:var(--card);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.ab-journey{list-style:none;padding:0;margin:26px 0 54px;display:flex;flex-wrap:wrap;gap:8px 0;counter-reset:j}
.ab-journey li{font:800 clamp(18px,2vw,24px)/1 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;letter-spacing:.04em;color:#cfc6b8;transition:color .5s}
.ab-journey li:not(:last-child):after{content:"→";margin:0 14px;color:#d8d0c3}
.ab-journey li.on{color:var(--ink)}.ab-journey li.on:last-child{color:var(--clay)}
.ab-tmi{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}
.ab-tmi-step{padding:34px 0 34px 26px;border-left:3px solid var(--line);cursor:pointer;min-height:42vh;display:flex;flex-direction:column;justify-content:center;transition:border-color .4s,opacity .4s;opacity:.38}
.ab-tmi-step.on{border-color:var(--clay);opacity:1}
.ab-tmi-step h3{font-size:clamp(46px,6vw,84px);margin:0 0 .15em}
.ab-tmi-step p{font-size:clamp(18px,1.9vw,23px);margin:0;max-width:30ch;color:var(--ink2)}
.ab-tmi-media{position:sticky;top:110px;aspect-ratio:4/5;border-radius:var(--r);overflow:hidden;background:#d8d0c3}
.ab-tmi-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .7s}
.ab-tmi-img.on{opacity:1}
.ab-bigline{font:800 clamp(30px,4.4vw,56px)/1.05 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;margin:64px 0 0;max-width:20ch;color:var(--forest)}
/* 5 model */
.ab-cards{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:16px;align-items:start;margin-top:34px}
.ab-arrow{align-self:center;font-size:32px;color:var(--clay);padding-top:60px}
.ab-card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);overflow:hidden;transition:box-shadow .3s}
.ab-card[data-open]{box-shadow:0 18px 40px -24px rgba(34,29,25,.45);border-color:#d6cbb9}
.ab-card-img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block}
.ab-card-body{padding:22px 22px 24px}
.ab-card h3{font-size:clamp(32px,3.2vw,44px);margin:0 0 .25em}
.ab-card-lead{margin:0 0 14px;color:var(--ink2)}
.ab-more{background:none;border:0;padding:0;font:700 15px "DM Sans",sans-serif;color:var(--clay);cursor:pointer}
.ab-more:after{content:" +"}.ab-more[aria-expanded="true"]:after{content:" −"}
.ab-card-more{margin-top:12px;color:var(--ink2);font-size:15.5px}
.ab-card-more p{margin:0 0 8px}
.ab-list{display:flex;flex-wrap:wrap;gap:6px;list-style:none;padding:0;margin:4px 0 12px}
.ab-list li{background:var(--moss);color:var(--forest);font-weight:700;font-size:13.5px;padding:5px 11px;border-radius:999px}
.ab-steps{list-style:none;padding:0;margin:0;counter-reset:s}
.ab-steps li{counter-increment:s;padding:7px 0 7px 32px;position:relative;border-top:1px dashed var(--line)}
.ab-steps li:before{content:counter(s);position:absolute;left:0;top:7px;width:22px;height:22px;border-radius:50%;background:var(--forest);color:#fff;font-size:12px;font-weight:700;display:grid;place-items:center}
/* 6 gain */
.ab-gain{background:var(--forest);color:#fff}
.ab-gain .ab-kicker{color:#f3c9a6}.ab-gain .ab-p{color:#dfe8e0}
.ab-gain-grid{display:grid;grid-template-columns:1fr 1.1fr;gap:56px;align-items:center}
.ab-ring{width:100%;max-width:480px}
.ab-ring .track{fill:none;stroke:rgba(255,255,255,.22);stroke-width:2;stroke-dasharray:4 8}
.ab-ring .track-path{fill:none;stroke:none}
.ab-ring .dot{fill:#f3c9a6}
.ab-ring .rn circle{fill:var(--forest2);stroke:rgba(255,255,255,.35);stroke-width:1.5}
.ab-ring .rn text{fill:#fff;font:700 12.5px "DM Sans",sans-serif;text-anchor:middle}
.ab-ring .mid{fill:#fff;font:800 34px "Big Shoulders Display","Arial Narrow",sans-serif;text-anchor:middle;text-transform:uppercase}
.ab-gains{display:grid;grid-template-columns:1fr 1fr;gap:18px 28px;margin:26px 0 0}
.ab-gains div{border-top:1px solid rgba(255,255,255,.22);padding-top:12px}
.ab-gains dt{font:800 19px "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;letter-spacing:.05em;color:#f3c9a6}
.ab-gains dd{margin:4px 0 0;color:#e6ede7}
/* 7 ground */
.ab-rail{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-left:max(20px,calc((100vw - var(--max))/2 + 20px));padding:18px max(20px,calc((100vw - var(--max))/2 + 20px)) 22px;scrollbar-width:thin}
.ab-tile{flex:0 0 clamp(250px,28vw,330px);scroll-snap-align:start;border:0;padding:0;background:var(--card);border-radius:var(--r);overflow:hidden;text-align:left;font:inherit;color:var(--ink);box-shadow:0 1px 0 var(--line)}
.ab-bridge{display:inline-block;margin-top:28px;font-size:19px}
.ab-tile-img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block}
.ab-tile-body{display:block;padding:16px 18px 20px}
.ab-tile-body b{display:block;font:800 26px "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase}
.ab-tile-body span{display:block;color:var(--ink2);font-size:15px;margin:2px 0 10px}
.ab-tile-body em{font-style:normal;font-weight:700;color:var(--clay);font-size:14px}
.ab-modal{position:fixed;inset:0;z-index:1000;background:rgba(12,16,22,.7);display:grid;place-items:center;padding:20px}
.ab-modal[hidden]{display:none}
.ab-modal-card{position:relative;background:var(--card);border-radius:18px;max-width:880px;width:100%;max-height:90vh;overflow:auto}
.ab-g{display:grid;grid-template-columns:1fr 1fr}
.ab-g[hidden]{display:none}
.ab-g-img{width:100%;height:100%;min-height:320px;object-fit:cover;display:block}
.ab-g-body{padding:34px 30px}
.ab-g-body h3{font-size:38px;margin:0 0 .4em}
.ab-g-body p{color:var(--ink2)}
.ab-outcome{background:var(--moss);border-radius:12px;padding:14px 16px;color:var(--forest)!important;font-weight:600}
.ab-outcome span{display:block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--clay);margin-bottom:4px}
.ab-x{position:absolute;top:12px;right:12px;z-index:2;width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.92);font-size:26px;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.15)}
/* 8 people */
.ab-roles{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:30px}
.ab-role{border-top:3px solid var(--forest);padding-top:16px}
.ab-role h3{font-size:28px;margin:0 0 .3em}.ab-role p{margin:0;color:var(--ink2)}
.ab-team{margin-top:48px;background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:24px}
.ab-team>p{margin:0 0 14px;font-weight:700;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;font-size:13px}
.ab-team ul{list-style:none;padding:0;margin:0 0 14px;display:flex;flex-wrap:wrap;gap:14px 26px}
.ab-team li{display:grid;grid-template-columns:44px auto;grid-template-rows:auto auto;column-gap:10px;align-items:center}
.ab-team img,.ab-av{grid-row:span 2;width:44px;height:44px;border-radius:50%;object-fit:cover}
.ab-av{display:grid;place-items:center;background:var(--moss);color:var(--forest);font-weight:700;font-size:14px}
.ab-team small{color:var(--muted)}
.ab-link{font-weight:700;color:var(--clay);text-decoration:none}
/* 9 origin */
.ab-origin{background:var(--card);border-top:1px solid var(--line)}
.ab-origin-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.ab-origin-img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:var(--r)}
.ab-origin-text p:not(.ab-kicker){font-size:clamp(17px,1.6vw,20px);color:var(--ink2);max-width:46ch}
.ab-italic{font-style:italic;color:var(--clay)!important}
/* 10 future */
.ab-ambitions{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:40px}
.ab-ambitions div{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:26px}
.ab-ambitions h3{font-size:30px;margin:0 0 .3em}.ab-ambitions p{margin:0;color:var(--ink2)}
/* 12 proof */
.ab-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:34px 28px;margin-top:30px}
.ab-facts b{display:block;font:800 clamp(56px,7vw,96px)/1 "Big Shoulders Display","Arial Narrow",sans-serif;color:var(--forest)}
.ab-facts span{display:block;margin-top:6px;color:var(--ink2);max-width:24ch}
.ab-see{display:flex;flex-wrap:wrap;gap:12px 26px;align-items:center;margin-top:48px;padding-top:24px;border-top:1px solid var(--line)}
.ab-see span{font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:13px;color:var(--muted)}
.ab-see a{font-weight:700;color:var(--clay);text-decoration:none;font-size:17px}
/* 13 believe */
.ab-believe{background:var(--night);color:#fff}
.ab-believe .ab-kicker{color:#f3c9a6}
.ab-believe ul{list-style:none;padding:0;margin:20px 0 0}
.ab-believe li{font:800 clamp(34px,5.6vw,76px)/1.04 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;padding:.35em 0;border-bottom:1px solid rgba(255,255,255,.1)}
.ab-believe li:last-child{color:#f3c9a6;border:0}
.abjs .ab-believe li.rv{transition-duration:1.1s}
/* 14 end */
.ab-end{position:relative;color:#fff;overflow:hidden;background:var(--night)}
.ab-end-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.42}
.ab-end .wrap{position:relative;z-index:2}
.ab-end-h{font-size:clamp(46px,8vw,112px);color:#f3c9a6;margin:0 0 .4em;max-width:12ch}
.ab-end-cta{display:flex;gap:14px;flex-wrap:wrap}
.ab-end .btn-ghost{color:#fff}
@media(max-width:900px){
.ab-probs,.ab-roles,.ab-ambitions{grid-template-columns:1fr 1fr}
.ab-inter-grid,.ab-gain-grid,.ab-origin-grid{grid-template-columns:1fr;gap:34px}
.ab-cards{grid-template-columns:1fr}.ab-arrow{padding:0;justify-self:center;transform:rotate(90deg)}
.ab-tmi{grid-template-columns:1fr;gap:0}.ab-tmi-media{position:sticky;top:64px;aspect-ratio:16/10;order:-1;z-index:2;margin-bottom:10px}
.ab-tmi-step{min-height:auto;padding:26px 0 26px 18px}
.ab-g{grid-template-columns:1fr}.ab-g-img{min-height:220px;max-height:280px}
.ab-facts{grid-template-columns:1fr 1fr}
}
@media(max-width:600px){
.ab-hero{height:130vh}.ab-earth{height:150vh}
.ab-probs,.ab-roles,.ab-ambitions,.ab-gains{grid-template-columns:1fr}
.ab-journey li:not(:last-child):after{margin:0 8px}
.ab-g-body{padding:24px 20px}
}
@media(prefers-reduced-motion:reduce){.ab-scroll span{animation:none}.ab-bg{transform:none}.ab-ring .dot{display:none}}
`;


// ---------- Impact Created: the open impact books ----------
// Impact speaks as evidence: what happened, what changed, where the money went. No philosophy, no team directory,
// no selling, no people profiles (those live on Team).
// About Us explains the system. Impact Created opens it up: numbers, money flow, projects,
// what we measure and a year-by-year archive.
// Evidence sections read from the Website Impact tables in Airtable and stay hidden until rows are published.
// On the staging address, unpublished rows are shown with a "Draft" badge so they can be reviewed.
function impactPage(data, opts = {}) {
  const drafts = !!opts.drafts;
  const ev = data.evidence || { projects: [] };
  const vis = (list) => (list || []).filter((x) => x.live || drafts);
  const projects = vis(ev.projects);
  const draft = (x) => (x.live ? '' : '<span class="im-draft">Draft, not public</span>');
  const p = (t) => (t ? String(t).split(/\n+/).filter(Boolean).map((l) => `<p>${esc(l)}</p>`).join('') : '');
  const photo = (slug, i, big = true) => { const x = bySlug(data, slug); const ph = x && x.photos && (x.photos[i] || x.photos[0]); return ph ? (big ? ph.url : ph.thumb) : cover(sorted(data)[0], big); };
  const heroP = slot(data, 'impact.hero', photo('be-a-villager', 3));
  const workWith = waLink('Hi Rock & Anchor, I would like to work with you (school, company or partnership).');

  // 2. Numbers: from the Website Impact table. "Click Opens" decides what each number reveals.
  const has = { Projects: projects.length, Money: 1 };
  const nums = (data.impact || []).map((m, i) => ({ ...m, i, link: has[m.opens] ? m.opens : '' }));
  const numCard = (m) => `<${m.link ? 'button type="button"' : 'div'} class="im-num${m.link ? ' im-click' : ''}"${m.link ? ` data-open="${m.link}"` : ''}><b>${esc(m.value)}</b><span>${esc(m.metric)}</span>${m.link ? `<em>See the evidence →</em>` : ''}</${m.link ? 'button' : 'div'}>`;
  const schoolsCard = `<button type="button" class="im-num im-click im-accent" data-open="${projects.some((x) => x.category === 'Education') ? 'Education' : 'Money'}"><b class="im-words">The village decides</b><span>what it needs. Your experience helps make it happen.</span><em>See what it funded →</em></button>`;

  // 3. Follow the money.
  const steps = [
    ['You book an experience', ''],
    ['Experience delivery', ''],
    ['Local people are paid', 'Local people are paid'],
    ['Village businesses participate', 'Village businesses participate'],
    ['The village decides what it needs', 'Village schools'],
    ['Skills, infrastructure and opportunity', 'Skills, infrastructure and opportunity'],
  ];

  // 4. Projects.
  const projCard = (x) => `<article class="im-proj rv" data-cat="${esc(x.category)}">${x.photo ? `<img src="${esc(x.photo)}" alt="" loading="lazy">` : ''}<div class="im-proj-body">${draft(x)}
    <div class="im-tags">${[x.category, x.area, x.year, x.status].filter(Boolean).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
    <h3>${esc(x.title)}</h3>
    <dl>${[['What we saw', x.saw], ['What we did', x.did], ['Who was involved', x.who], ['What changed', x.changed], ['What happens next', x.next]].filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${p(v)}</dd></div>`).join('')}</dl>
  </div></article>`;

  // 11. Archive by year.
  const years = {};
  const addY = (y, kind, label, live) => { if (!y) return; (years[y] = years[y] || []).push({ kind, label, live }); };
  projects.forEach((x) => addY(x.year, 'Project', x.title, x.live));
  const yearList = Object.keys(years).sort();

  // Modal content for clickable numbers.
  const modal = (key, title, inner) => `<div class="im-m" data-m="${key}" hidden><h3>${title}</h3>${inner}</div>`;
  const modals = [
    projects.length ? modal('Projects', 'The work behind the number', `<ul class="im-mlist">${projects.map((x) => `<li><b>${esc(x.title)}</b>${x.did ? `<p>${esc(x.did)}</p>` : ''}${draft(x)}</li>`).join('')}</ul><a class="im-link" href="#projects" data-close>See all projects →</a>`) : '',
    projects.some((x) => x.category === 'Education') ? modal('Education', 'What your experiences have funded', `<ul class="im-mlist">${projects.filter((x) => x.category === 'Education').map((x) => `<li><b>${esc(x.title)}</b>${x.did ? `<p>${esc(x.did)}</p>` : ''}${draft(x)}</li>`).join('')}</ul><a class="im-link" href="#projects" data-close>See all projects →</a>`) : '',
    modal('Money', 'Where the money goes', `<p>The village decides what it needs. Your experience helps make it happen.</p><a class="im-link" href="#money" data-close>Follow the money →</a>`),
  ].join('');

  const body = `<style>${IMPACT_CSS}</style>
<div class="im">
${drafts ? '<div class="im-staging">Staging preview: rows marked <b>Draft, not public</b> are hidden on the live site until you tick Show on Website in Airtable.</div>' : ''}
<section class="im-hero"><img src="${esc(heroP.src)}"${posStyle(heroP)} alt="" fetchpriority="high"><div class="wrap">
  <p class="im-kicker">Impact created</p><h1>What happens because you choose to come with us?</h1>
  <p class="im-sub">Every Rock &amp; Anchor experience is part of something larger. This page shows where that value goes, who it reaches, and what it has helped change.</p>
</div></section>

<section class="im-numbers" id="numbers"><div class="wrap">
  <p class="im-kicker rv">Since 2021</p><h2 class="im-h rv">What we have actually done.</h2>
  <div class="im-nums rv">${nums.map(numCard).join('')}${schoolsCard}</div>
</div></section>

<section class="im-money" id="money"><div class="wrap im-money-grid">
  <div><p class="im-kicker rv">Follow the money</p><h2 class="im-h rv">Where does your money go?</h2>
  <p class="im-p rv">Not a promise that your booking creates impact. The actual path it takes.</p>
</div>
  <ol class="im-flow">${steps.map(([label, key], i) => `<li class="rv"><span class="im-step">${String(i + 1).padStart(2, '0')}</span><div><h3>${label}</h3></div></li>`).join('')}</ol>
</div></section>

${projects.length ? `<section class="im-projects" id="projects"><div class="wrap">
  <p class="im-kicker rv">The work behind the number</p><h2 class="im-h rv">Where the impact has happened.</h2>
  <div class="im-projs">${projects.map(projCard).join('')}</div>
</div></section>` : ''}

<section class="im-measure" id="measuring"><div class="wrap">
  <p class="im-kicker rv">What we are measuring</p><h2 class="im-h rv">How do we know?</h2>
  <p class="im-p rv">We are learning to measure what matters, without pretending every meaningful thing can be reduced to a number.</p>
  <div class="im-measure-grid">
    <div class="rv"><h3>We currently measure</h3><ul>${['People employed', 'People trained', 'Schools supported', 'Projects completed', 'Customers reached', 'Local families involved', 'Money invested locally'].map((x) => `<li>${x}</li>`).join('')}</ul></div>
    <div class="rv"><h3>We are working towards measuring</h3><ul class="towards">${['People progressing into leadership', 'Repeat income generated locally', 'Skills retained in villages', 'Children reached through outdoor education', 'Long-term outcomes of school investments', 'Environmental impact of experiences'].map((x) => `<li>${x}</li>`).join('')}</ul></div>
  </div>
  <p class="im-quote rv">We are not claiming we have solved anything. We are paying attention.</p>
</div></section>



${yearList.length ? `<section class="im-archive" id="archive"><div class="wrap">
  <p class="im-kicker rv">The archive</p><h2 class="im-h rv">Our work, year by year.</h2>
  <ol class="im-years">${yearList.map((y) => `<li class="rv"><b>${y}</b><ul>${years[y].map((it) => `<li><span>${it.kind}</span> ${esc(it.label)}${it.live ? '' : ' <em class="im-draft">Draft</em>'}</li>`).join('')}</ul></li>`).join('')}<li class="im-next rv"><b>${Number(yearList[yearList.length - 1]) + 1} →</b><ul><li>Still being written.</li></ul></li></ol>
</div></section>` : ''}

<section class="im-end" id="you"><div class="wrap">
  <h2>You helped make this happen.</h2>
  <p>Every time you choose to experience a place with us, you become part of the work happening there.</p>
  <div class="im-end-cta"><a class="btn btn-clay" href="#${projects.length ? 'projects' : 'numbers'}">See the work</a><a class="btn btn-ghost" href="/team">Meet the people who make it happen</a><a class="btn btn-ghost" href="${workWith}">${ICON.wa}Work with us</a></div>
</div></section>

<div class="im-modal" id="imModal" hidden role="dialog" aria-modal="true"><div class="im-modal-card"><button type="button" class="im-x" aria-label="Close">×</button>${modals}</div></div>
</div>
<script>${IMPACT_JS}</script>`;
  return layout({ title: 'Impact Created', desc: 'What happens because you travel with Rock & Anchor: the numbers, where the money goes and the projects.', path: '/impact', body, image: heroP.src, data });
}

const IMPACT_JS = `(function(){
var d=document,w=window,rm=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
d.documentElement.classList.add('imjs');
var io=('IntersectionObserver' in w)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'}):null;
d.querySelectorAll('.im .rv').forEach(function(el){if(io&&!rm)io.observe(el);else el.classList.add('in')});
var md=d.getElementById('imModal'),last=null;
function open(k){var ok=false;md.querySelectorAll('.im-m').forEach(function(m){var on=m.dataset.m===k;m.hidden=!on;if(on)ok=true});if(!ok)return;md.hidden=false;d.body.style.overflow='hidden';md.querySelector('.im-x').focus()}
function close(){md.hidden=true;d.body.style.overflow='';if(last)last.focus()}
d.querySelectorAll('[data-open]').forEach(function(b){b.addEventListener('click',function(){last=b;open(b.dataset.open)})});
md.querySelector('.im-x').addEventListener('click',close);md.addEventListener('click',function(e){if(e.target===md)close()});
md.querySelectorAll('[data-close]').forEach(function(a){a.addEventListener('click',function(){md.hidden=true;d.body.style.overflow=''})});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&!md.hidden)close()});
})();`;

const IMPACT_CSS = `
.im{--sp:clamp(64px,9vw,120px)}
.im section{padding:var(--sp) 0}
.im-staging{background:#fff4d6;border-bottom:1px solid #ecd9a4;color:#6b5517;font-size:14px;padding:10px 20px;text-align:center}
.im-kicker{font:700 13px/1 "DM Sans",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--clay);margin:0 0 16px}
.im-h{font-size:clamp(34px,5.2vw,66px);max-width:30ch;margin:0 0 .5em}
.im-p{font-size:clamp(17px,1.6vw,19px);color:var(--ink2);max-width:58ch}
.im-note{background:var(--moss);color:var(--forest);border-radius:12px;padding:14px 16px;max-width:46ch;font-weight:600}
.im-muted{color:var(--muted);font-size:14px;font-style:italic}
.im-draft{display:inline-block;background:#fff1c9;color:#7a5b00;border:1px solid #ecd9a4;font:700 11px/1 "DM Sans",sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:5px 8px;border-radius:999px;margin:0 0 8px}
.imjs .im .rv{opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease}
.imjs .im .rv.in{opacity:1;transform:none}
/* hero */
.im-hero{position:relative;min-height:clamp(460px,72vh,680px);display:flex;align-items:flex-end;color:#fff;background:var(--night);padding:0!important;overflow:hidden}
.im-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.im-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,16,22,.1) 20%,rgba(12,16,22,.72) 100%)}
.im-hero .wrap{position:relative;z-index:2;padding-bottom:clamp(48px,9vh,96px)}
.im-hero .im-kicker{color:#f7d2b2}
.im-hero h1{font-size:clamp(40px,6.4vw,88px);max-width:17ch;margin:0 0 .3em;text-shadow:0 2px 20px rgba(0,0,0,.35)}
.im-sub{font-size:clamp(17px,1.9vw,21px);max-width:54ch;margin:0;color:#f2ede6;text-shadow:0 1px 10px rgba(0,0,0,.5)}
/* numbers */
.im-nums{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-top:28px}
.im-num{text-align:left;font:inherit;color:var(--ink);background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:22px 20px;display:flex;flex-direction:column;gap:4px}
.im-num b{font:800 clamp(46px,5vw,68px)/1 "Big Shoulders Display","Arial Narrow",sans-serif;color:var(--forest)}
.im-num span{color:var(--ink2)}
.im-num em{font-style:normal;font-weight:700;font-size:14px;color:var(--clay);margin-top:8px}
.im-click{cursor:pointer;transition:transform .2s,box-shadow .2s,border-color .2s}
.im-click:hover{transform:translateY(-3px);box-shadow:0 16px 30px -22px rgba(34,29,25,.5);border-color:#d6cbb9}
.im-accent{background:var(--forest);border-color:var(--forest)}.im-accent b{color:#f3c9a6}.im-num b.im-words{font-size:clamp(34px,3.4vw,44px)}.im-accent span{color:#e6ede7}.im-accent em{color:#f3c9a6}
/* money */
.im-money{background:var(--card);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.im-money-grid{display:grid;grid-template-columns:1fr 1.15fr;gap:56px;align-items:start}
.im-flow{list-style:none;padding:0;margin:0;position:relative}
.im-flow:before{content:"";position:absolute;left:21px;top:22px;bottom:22px;width:2px;background:repeating-linear-gradient(var(--clay) 0 6px,transparent 6px 12px)}
.im-flow>li{display:grid;grid-template-columns:44px 1fr;gap:16px;padding:10px 0;position:relative}
.im-step{width:44px;height:44px;border-radius:50%;background:var(--paper);border:2px solid var(--clay);display:grid;place-items:center;font:800 15px "Big Shoulders Display","Arial Narrow",sans-serif;color:var(--clay);position:relative;z-index:1}
.im-flow>li:last-child .im-step{background:var(--forest);border-color:var(--forest);color:#fff}
.im-flow h3{font-size:clamp(22px,2.4vw,30px);margin:8px 0 4px}
.im-figs{list-style:none;padding:0;margin:6px 0 0}
.im-figs li,.im-mlist li{padding:8px 0;border-top:1px dashed var(--line)}
.im-figs b{font-size:20px;color:var(--forest)}.im-figs small{color:var(--muted)}.im-figs p{margin:4px 0 0;color:var(--ink2);font-size:15px}
/* projects */
.im-projs{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;margin-top:28px}
.im-proj{background:var(--card);border:1px solid var(--line);border-radius:var(--r);overflow:hidden}
.im-proj img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block}
.im-proj-body{padding:22px}
.im-tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
.im-tags span{background:var(--moss);color:var(--forest);font-weight:700;font-size:12.5px;padding:4px 10px;border-radius:999px}
.im-proj h3{font-size:clamp(24px,2.4vw,30px);margin:0 0 12px}
.im dl{margin:0}.im dl>div{padding:10px 0;border-top:1px solid var(--line)}
.im dt{font-weight:700;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--clay);margin-bottom:4px}
.im dd{margin:0;color:var(--ink2)}.im dd p{margin:0 0 6px}
/* measuring */
.im-measure-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px}
.im-measure-grid>div{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:24px}
.im-measure-grid h3{font-size:28px;margin:0 0 10px}
.im-measure-grid ul{list-style:none;padding:0;margin:0}
.im-measure-grid li{padding:9px 0 9px 30px;border-top:1px solid var(--line);position:relative}
.im-measure-grid li:before{content:"✓";position:absolute;left:4px;color:var(--forest);font-weight:800}
.im-measure-grid .towards li:before{content:"○";color:var(--clay)}
.im-quote{font:800 clamp(26px,3.4vw,42px)/1.1 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;color:var(--forest);max-width:26ch;margin:40px 0 0}
/* archive */
.im-years{list-style:none;padding:0;margin:24px 0 0;border-left:2px solid var(--line)}
.im-years>li{padding:0 0 28px 28px;position:relative}
.im-years>li:before{content:"";position:absolute;left:-8px;top:8px;width:14px;height:14px;border-radius:50%;background:var(--clay)}
.im-years b{font:800 34px/1 "Big Shoulders Display","Arial Narrow",sans-serif}
.im-years ul{list-style:none;padding:0;margin:10px 0 0}.im-years ul li{padding:5px 0;color:var(--ink2)}
.im-years ul span{display:inline-block;min-width:78px;font-weight:700;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--clay)}
.im-next b{color:var(--muted)}.im-next:before{background:var(--line)!important}
/* end */
.im-end{background:var(--forest);color:#fff;text-align:center}
.im-end h2{font-size:clamp(42px,7vw,96px);margin:0 auto .3em;max-width:20ch}
.im-end p{font-size:clamp(18px,2vw,22px);max-width:48ch;margin:0 auto 32px;color:#e6ede7}
.im-end-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.im-end .btn-ghost{color:#fff}
/* modal */
.im-modal{position:fixed;inset:0;z-index:1000;background:rgba(12,16,22,.7);display:grid;place-items:center;padding:20px}
.im-modal[hidden]{display:none}
.im-modal-card{position:relative;background:var(--card);border-radius:18px;max-width:620px;width:100%;max-height:86vh;overflow:auto;padding:34px 30px}
.im-m h3{font-size:36px;margin:0 0 12px}
.im-mlist{list-style:none;padding:0;margin:0 0 16px}.im-mlist span{color:var(--muted)}.im-mlist p{margin:4px 0 0;color:var(--ink2)}
.im-link{font-weight:700;color:var(--clay);text-decoration:none}
.im-x{position:absolute;top:12px;right:12px;width:40px;height:40px;border-radius:50%;border:0;background:#efe7da;font-size:26px;cursor:pointer}
@media(max-width:900px){
.im-money-grid,.im-measure-grid{grid-template-columns:1fr;gap:28px}
}
@media(max-width:600px){.im-nums{grid-template-columns:1fr 1fr}.im-num{padding:16px}}
`;


// ---------- Team: who makes this real ----------
// Four voices: About speaks as Rock & Anchor (what we believe). Impact speaks as evidence (what happened).
// Team speaks through people (who we are, present tense). Curate speaks to the customer.
// So this page avoids the About manifesto, the Educate > Employ > Empower model, impact numbers and project case studies.
// Profiles read from the Website Team table. Has Learned, Learned From and Building Towards are hidden until filled in. On the staging address, empty profiles show a hint.
function teamPage(data, opts = {}) {
  const drafts = !!opts.drafts;
  const photo = (slug, i) => { const x = bySlug(data, slug); const ph = x && x.photos && (x.photos[i] || x.photos[0]); return ph ? ph.url : cover(sorted(data)[0], true); };
  const heroP = slot(data, 'team.hero', photo('winter-trekking', 1)), knowP = slot(data, 'team.know', photo('hidden-kingdom', 2)), endP = slot(data, 'team.end', photo('little-feet-sunset-safari', 1));
  const p = (t) => (t ? String(t).split(/\n+/).filter(Boolean).map((l) => `<p>${esc(l)}</p>`).join('') : '');
  const first = (n) => String(n).split(/\s+/)[0];
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const KINDS = [
    ['Knows the place', 'The people who know the place', 'Local guides, hosts, cooks and villagers.'],
    ['Creates the experience', 'The people who create the experience', 'Experience leaders, outdoor educators and facilitators.'],
    ['Makes the system work', 'The people who make the system work', 'Operations, business development, administration and content.'],
    ['Learning to lead', 'The people who are learning to lead', 'Interns, trainees and emerging local leaders.'],
  ];
  const kindOf = (m) => (m.group === 'Founders' ? 'Founder' : m.group === 'Experience Leaders' ? 'Creates the experience' : 'Makes the system work');
  const gi = (g) => { const i = TEAM_GROUPS.indexOf(g); return i < 0 ? 99 : i; };
  // Kinds on Website (multiple) decides the kind cards; a person can sit on more than one.
  const kindsOf = (m) => (m.kinds && m.kinds.length ? m.kinds : [kindOf(m)].filter((k) => k !== 'Founder'));
  const all = (data.team || []).map((m) => ({ ...m, k: kindOf(m), ks: kindsOf(m) })).sort((a, b) => gi(a.group) - gi(b.group) || a.order - b.order);
  const byId = Object.fromEntries(all.filter((m) => m.id).map((m) => [m.id, m]));
  const founders = all.filter((m) => m.k === 'Founder');
  const people = all.filter((m) => m.k !== 'Founder');
  const teachers = (m) => (m.from || []).map((id) => byId[id]).filter(Boolean);
  const students = (m) => all.filter((x) => (x.from || []).includes(m.id));
  const workWith = waLink('Hi Rock & Anchor, I would like to work with you or join the team.');

  const avatar = (m, cls = 'tm-av') => (m.photo ? `<img class="${cls}" src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy">` : `<span class="${cls} tm-ini">${esc(initials(m.name))}</span>`);
  // One card per person: who they are, what they have learned, and (if known) who taught them, who they teach, what is next.
  // This is where "from participant to leader" lives now: in the person's own card, not a separate section.
  const profile = (m) => {
    const t = teachers(m), st = students(m);
    const rows = [
      ['Has learned', m.learned ? p(m.learned) : ''],
      ['Learned from', t.map((x) => esc(x.name)).join(', ')],
      ['Now teaching', st.map((x) => esc(x.name)).join(', ')],
      ['Next', m.building ? p(m.building) : ''],
    ].filter(([, v]) => v);
    return `<article class="tm-card rv" data-kind="${esc(m.ks.join('|'))}">
    <div class="tm-card-top">${avatar(m)}<div><span class="tm-role">${esc(m.role)}</span><h3>${esc(m.name)}</h3>${m.joined ? `<small class="tm-since">With us since ${esc(m.joined)}</small>` : ''}</div></div>
    ${m.bio ? `<div class="tm-bio">${p(m.bio)}</div>` : ''}
    ${rows.length ? `<dl>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
    ${!m.learned && drafts ? `<p class="tm-hint">Staging only: add Has Learned in Airtable (Website Team) to fill this profile.</p>` : ''}
  </article>`;
  };
  const tabs = KINDS.filter(([k]) => all.some((m) => m.ks.includes(k)));

  const body = `<style>${TEAM_CSS}</style>
<div class="tm">
${drafts ? '<div class="tm-staging">Staging preview: the yellow hints are only visible here. The live site shows nothing until it is filled in Airtable.</div>' : ''}
<section class="tm-hero"><img src="${esc(heroP.src)}"${posStyle(heroP)} alt="${esc(heroP.alt || 'A Rock & Anchor leader on a Sahyadri ridge')}" fetchpriority="high"><div class="wrap">
  <h1>People make the experience.</h1>
  <p class="tm-sub">These are the people you will walk with, eat with, learn from and trust on the mountain. Some of them know these places better than any map.</p>
  <a class="tm-scroll" href="#people">Meet them ↓</a>
</div></section>

<section class="tm-people" id="people"><div class="wrap">
  <p class="tm-kicker rv">The people</p>
  <h2 class="tm-h rv">The people behind your experience.</h2>
  ${tabs.length ? `<div class="tm-filter rv" role="tablist" aria-label="Show people"><button type="button" role="tab" class="on" data-filter="all">Everyone</button>${tabs.map(([k, t]) => `<button type="button" role="tab" data-filter="${k}">${t.replace('The people who ', '').replace(/^./, (c) => c.toUpperCase())}</button>`).join('')}</div>
  <div class="tm-kind-desc" aria-live="polite"><p data-kind="all">Local guides, experience leaders, outdoor educators and the people behind the scenes. Here is who you might meet.</p>${tabs.map(([k, t, d]) => { const fs = founders.filter((m) => m.ks.includes(k)); return `<p data-kind="${k}" hidden><b>${t}.</b> ${d}${fs.length ? ` <a href="#founders">${fs.map((m) => esc(first(m.name))).join(' and ')} ${fs.length > 1 ? 'are' : 'is'} here too, with the founders ↓</a>` : ''}</p>`; }).join('')}</div>` : ''}
  <div class="tm-cards">${people.map(profile).join('')}</div>
</div></section>

<section class="tm-know" id="knowledge"><div class="wrap">
  <div class="tm-know-head"><div><p class="tm-kicker rv">Why it matters who your guide is</p><h2 class="tm-h rv">Some knowledge cannot be Googled.</h2>
  <p class="tm-lead rv">Certification tells you someone knows how to manage risk. It does not tell you where the best trail starts after the rain.</p></div>
  <img class="rv" src="${esc(knowP.src)}"${posStyle(knowP)} alt="${esc(knowP.alt)}" loading="lazy"></div>
  <div class="tm-kinds2">
    <div class="rv"><h3>Learned knowledge</h3><p>What our team trains for.</p><ul>${['Mountaineering', 'First aid', 'Outdoor safety', 'Astronomy', 'Leadership'].map((x) => `<li>${x}</li>`).join('')}</ul></div>
    <div class="rv tm-lived"><h3>Lived knowledge</h3><p>What our team grew up with.</p><ul>${['These mountains', 'These villages', 'The weather', 'Farming', 'Local stories', 'Seasonal changes', 'Places that do not appear on Google Maps'].map((x) => `<li>${x}</li>`).join('')}</ul></div>
  </div>
</div></section>

${founders.length ? `<section class="tm-founders" id="founders"><div class="wrap">
  <p class="tm-kicker rv">The founders</p><h2 class="tm-h rv">Started it. Still learning how to build it.</h2>
  <div class="tm-cards tm-cards-2">${founders.map(profile).join('')}</div>
</div></section>` : ''}

<section class="tm-end" id="meet"><img src="${esc(endP.src)}"${posStyle(endP)} alt="" loading="lazy"><div class="wrap">
  <h2>Who will you meet?</h2>
  <p>The next time you come to the mountains with us, you will probably meet someone who knows the place better than we ever could.</p>
  <p class="tm-say">Say hello. Ask questions. Learn something. And maybe teach them something too.</p>
  <div class="tm-end-cta"><a class="btn btn-clay" href="/experiences">Explore experiences</a><a class="btn btn-ghost" href="#people">Meet the people</a><a class="btn btn-ghost" href="${workWith}">${ICON.wa}Work with us</a></div>
</div></section>
</div>
<script>${TEAM_JS}</script>`;
  return layout({ title: 'Team', desc: 'The people behind Rock & Anchor experiences: local guides, experience leaders, outdoor educators and the people learning to lead.', path: '/team', body, image: heroP.src, data });
}

const TEAM_JS = `(function(){
var d=document,w=window,rm=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
d.documentElement.classList.add('tmjs');
var io=('IntersectionObserver' in w)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'}):null;
d.querySelectorAll('.tm .rv').forEach(function(el){if(io&&!rm)io.observe(el);else el.classList.add('in')});
var fb=d.querySelectorAll('.tm-filter button'),cards=d.querySelectorAll('.tm-people .tm-card'),desc=d.querySelectorAll('.tm-kind-desc p');
function filt(k){var n=0;fb.forEach(function(b){var on=b.dataset.filter===k;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});desc.forEach(function(p){p.hidden=p.dataset.kind!==k});cards.forEach(function(c){c.hidden=!(k==='all'||c.dataset.kind.split('|').indexOf(k)>-1);if(!c.hidden){n++;c.classList.add('in')}})}
fb.forEach(function(b){b.addEventListener('click',function(){filt(b.dataset.filter)})});
})();`;

const TEAM_CSS = `
.tm{--sp:clamp(64px,9vw,120px)}
.tm section{padding:var(--sp) 0}
.tm-staging{background:#fff4d6;border-bottom:1px solid #ecd9a4;color:#6b5517;font-size:14px;padding:10px 20px;text-align:center}
.tm-draft{display:inline-block;background:#fff1c9;color:#7a5b00;border:1px solid #ecd9a4;font:700 11px/1 "DM Sans",sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:5px 8px;border-radius:999px;margin:0 0 10px}
.tm-hint{background:#fff8e6;border:1px dashed #e2c87a;color:#6b5517;border-radius:12px;padding:12px 14px;font-size:14px;margin:14px 0 0}
.tm-kicker{font:700 13px/1 "DM Sans",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--clay);margin:0 0 16px}
.tm-h{font-size:clamp(34px,5.2vw,66px);max-width:30ch;margin:0 0 .5em}
.tm-p{font-size:clamp(17px,1.6vw,19px);color:var(--ink2);max-width:60ch}
.tm-lead{font-size:clamp(19px,2.1vw,25px);color:var(--ink);max-width:44ch;font-weight:500}
.tmjs .tm .rv{opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease}
.tmjs .tm .rv.in{opacity:1;transform:none}
/* hero */
.tm-hero{position:relative;min-height:clamp(480px,78vh,720px);display:flex;align-items:flex-end;color:#fff;background:var(--night);padding:0!important;overflow:hidden}
.tm-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 35%}
.tm-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,16,22,.05) 25%,rgba(12,16,22,.7) 100%)}
.tm-hero .wrap{position:relative;z-index:2;padding-bottom:clamp(48px,9vh,96px)}
.tm-hero .tm-kicker{color:#f7d2b2}
.tm-hero h1{font-size:clamp(46px,7.4vw,104px);max-width:16ch;margin:0 0 .3em;text-shadow:0 2px 20px rgba(0,0,0,.35)}
.tm-sub{font-size:clamp(17px,1.9vw,21px);max-width:54ch;margin:0 0 26px;color:#f2ede6;text-shadow:0 1px 10px rgba(0,0,0,.5)}
.tm-scroll{color:#fff;font-weight:700;text-decoration:none;border-bottom:2px solid #f3c9a6;padding-bottom:3px}
/* people */
.tm-face{width:38px;height:38px;border-radius:50%;object-fit:cover;flex:0 0 38px}
.tm-ini{display:grid;place-items:center;background:var(--forest);color:#f3c9a6;font:800 15px/1 "DM Sans",sans-serif}
.tm-kind-desc p{margin:0 0 22px;color:var(--ink2);font-size:17px;max-width:62ch}.tm-kind-desc b{color:var(--ink)}.tm-kind-desc a{color:var(--clay);font-weight:700;text-decoration:none}
.tm-people{background:#efe7da}
.tm-filter{display:flex;flex-wrap:wrap;gap:10px;margin:24px 0 16px}
.tm-filter button{border:1.5px solid var(--line);background:var(--paper);border-radius:999px;padding:10px 18px;font:700 15px "DM Sans",sans-serif;color:var(--ink);cursor:pointer}
.tm-filter button.on{background:var(--forest);border-color:var(--forest);color:#fff}
.tm-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;align-items:start}
.tm-cards-2{grid-template-columns:repeat(auto-fit,minmax(320px,1fr));margin-top:26px}
.tm-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:24px;display:flex;flex-direction:column;gap:14px}
.tm-card[hidden]{display:none}
.tm-card-top{display:flex;gap:16px;align-items:center}
.tm-av{width:84px;height:84px;flex:0 0 84px;border-radius:50%;object-fit:cover}
.tm-av.tm-ini{font-size:30px}
.tm-role{color:var(--clay);font-weight:700;font-size:12.5px;letter-spacing:.1em;text-transform:uppercase}
.tm-card h3{margin:2px 0 0;font-size:30px;line-height:1}
.tm-since{color:var(--muted);font-size:13.5px}
.tm-bio p{margin:0 0 6px;color:var(--ink2)}
.tm dl{margin:0}.tm dl>div{padding:10px 0;border-top:1px solid var(--line)}
.tm dt{font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--clay);margin-bottom:4px}
.tm dd{margin:0;color:var(--ink2)}.tm dd p{margin:0 0 6px}
/* knowledge */
.tm-know-head{display:grid;grid-template-columns:1.3fr 1fr;gap:40px;align-items:end}
.tm-know-head img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:18px}
.tm-kinds2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:34px}
.tm-kinds2>div{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px}
.tm-kinds2 h3{font-size:32px;margin:0}.tm-kinds2>div>p{margin:4px 0 14px;color:var(--muted)}
.tm-kinds2 ul{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:8px}
.tm-kinds2 li{background:var(--paper);border:1px solid var(--line);border-radius:999px;padding:7px 14px;font-weight:600}
.tm-lived{background:var(--forest)!important;border-color:var(--forest)!important;color:#fff}.tm-lived>p{color:#cfe0d3!important}
.tm-lived li{background:rgba(255,255,255,.1)!important;border-color:rgba(255,255,255,.2)!important;color:#fff}
/* founders */
.tm-founders{background:var(--card);border-top:1px solid var(--line)}
/* end */
.tm-end{position:relative;color:#fff;text-align:center;overflow:hidden;background:var(--night)}
.tm-end img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.45}
.tm-end .wrap{position:relative}
.tm-end h2{font-size:clamp(46px,7.4vw,100px);margin:0 auto .3em;max-width:20ch;text-shadow:0 2px 20px rgba(0,0,0,.35)}
.tm-end p{font-size:clamp(18px,2vw,22px);max-width:48ch;margin:0 auto 14px;color:#f2ede6;text-shadow:0 1px 10px rgba(0,0,0,.5)}
.tm-say{font-weight:700;color:#f3c9a6!important;margin-bottom:32px!important}
.tm-end-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.tm-end .btn-ghost{color:#fff;border-color:rgba(255,255,255,.6)}
@media(max-width:900px){.tm-know-head,.tm-kinds2{grid-template-columns:1fr;gap:20px}}
@media(max-width:600px){.tm-cards{grid-template-columns:1fr}}
`;


// ---------- Our Values: what we believe, and what that looks like outdoors ----------
// Voices: About says why we exist. Impact shows what changed. Team shows who. Values says what we believe and how we behave.
// The five values come from the Rock & Anchor guide handbook (Sustainability, Simplicity, Cultural authenticity,
// Experiential learning, Respect for ecosystems). Leave No Trace, Say No to Geotagging and the 10 Essentials are
// practices and knowledge that come from those values, not extra values.
// LEARN is kept as plain data so a future Learning page can reuse it without rewriting this page.
const VALUES = [
  {
    id: 'sustainability', name: 'Sustainability', line: 'We do not have an Earth 2.0.', photo: ['values.sustainability', 'winter-trekking', 2],
    text: 'Sustainability is not a list of good habits. It starts from a plain fact: there is no second planet to move to, and no second Sahyadri. So we try to run experiences that the mountains and villages we work in can sustain for years, not just for one season.',
    ground: ['Keeping groups to a size that the trail, and the village, can take.', 'Carrying out everything we carry in.', 'Thinking about what happens to a place after we leave, not only while we are there.', 'Working with local people, so the value of an experience stays where it happens.', 'Saying no to a booking that would damage a place we cannot repair.'],
    not: 'Treating a fragile place as disposable, as if there will always be somewhere else next year.',
    leads: ['lnt'],
  },
  {
    id: 'simplicity', name: 'Simplicity', line: 'Let the place be the experience.', photo: ['values.simplicity', 'night-sky-experience', 1],
    text: 'An outdoor experience does not need to be packed to mean something. Often it means more with less: fewer things to carry, fewer things to do, and more time to notice where you are.',
    ground: ['A clear briefing, not a performance.', 'Slower days, with room to stop and look.', 'Carrying what you need, not everything you own.', 'Letting a quiet moment on a ridge do the work, instead of talking over it.', 'Not turning every moment into content.'],
    not: 'Turning every stop into a photo op or a scripted moment.',
    leads: ['lnt'],
  },
  {
    id: 'culture', name: 'Cultural authenticity', line: 'Villages are not attractions.', photo: ['values.culture', 'be-a-villager', 0],
    text: 'The villages we visit are homes. The people who live there are hosts, guides, cooks and colleagues, not props in an “authentic experience”. Cultural exchange only works with respect, consent and participation, and the community should benefit from hosting us.',
    ask: 'How do we enter someone’s home, village or landscape with respect?',
    ground: ['Our guides, hosts and cooks come from the villages we work in.', 'Food, farming, stories and traditions are shared by the people they belong to, on their terms.', 'Unscripted moments are given space. We do not stage a “typical day”.', 'Local work and local income come with every experience.'],
    not: 'Asking villagers to perform, or presenting a paid arrangement as a chance encounter.',
    leads: ['geotag'],
  },
  {
    id: 'learning', name: 'Experiential learning', line: 'People remember what they do.', photo: ['values.learning', 'hidden-kingdom', 0],
    text: 'Learning is not only information. It is touching the soil, walking through a forest, cooking with someone, finding the trail, watching the sky, understanding where food comes from, solving a problem outdoors and taking responsibility for something. What you learn this way, you can carry somewhere else.',
    tmi: [['Touch', 'You meet a place, a person, a story.'], ['Move', 'You take part instead of watching.'], ['Inspire', 'You leave with a possibility you did not have before.']],
    ground: ['A silent listening stop in a monsoon forest.', 'Grinding rice on a stone chakki yourself, not watching someone else do it.', 'The same idea runs through our team: people from the villages learn, then lead, then teach the next person.'],
    not: 'Lecturing at people instead of creating a moment they experience for themselves.',
    leads: ['essentials'],
  },
  {
    id: 'ecosystems', name: 'Respect for ecosystems', line: 'Nature is not a backdrop.', photo: ['values.ecosystems', 'monsoon-village-1-day', 1],
    text: 'Wildlife, plants, water and soil are not props for a day out. Nature is alive, and we are part of it, not spectators standing outside it. Respect means knowing a place well enough to move through it carefully, and sometimes knowing when not to go at all.',
    ground: ['Giving wildlife space, and never feeding it.', 'Staying on the trail, even when the group is tired.', 'Keeping soap and waste away from streams and water sources.', 'No picking flowers, carving trees or moving rocks.', 'Knowing when a place has had enough visitors, and when not to enter.', 'Sometimes choosing not to share where a place is.'],
    not: 'Letting someone feed a monkey for a photo, or cutting a corner because the group is tired.',
    leads: ['lnt', 'geotag'],
  },
];

// Values in practice. "from" lists value ids, shown as tags so the link back to the five values is visible.
const PRACTICES = [
  {
    id: 'lnt', name: 'Leave No Trace', line: 'We leave places as we found them, or better.', from: ['sustainability', 'ecosystems', 'simplicity'],
    text: 'Everything we carry in, we carry out, fruit peels included. We stay on the trail, leave what we find, and keep fire, noise and soap out of places that cannot absorb them. Our leaders do this first. Then they share it.',
  },
  {
    id: 'geotag', name: 'Say No to Geotagging', line: 'Not every beautiful place needs to become a pin on a map.', from: ['ecosystems', 'culture'],
    text: 'A waterfall, a cave, a nesting site or a quiet corner of a village can change for good when it suddenly becomes easy to find. Our mountains do not yet have proper regulation, so places that go viral get overrun, polluted and damaged. That is why we never publish exact locations, on this site or on social media, and why we ask you not to either. The principle is not “never share”. It is: think about what happens when a fragile place becomes easy to find.',
  },
  {
    id: 'wildlife', name: 'Respect wildlife', line: 'Observe without interfering.', from: ['ecosystems'],
    list: ['Do not feed.', 'Do not chase.', 'Do not handle, unless there is a real safety, conservation or learning reason.', 'Do not disturb nests or animals with young.', 'Give animals space.'],
  },
  {
    id: 'communities', name: 'Respect communities', line: 'We are visitors.', from: ['culture'],
    list: ['Ask before photographing people.', 'Do not enter a home or private space without an invitation.', 'Village life is not a performance.', 'Buy local where it makes sense.', 'Respect local customs.', 'Remember that people live here after we leave.'],
  },
  {
    id: 'learn-first', name: 'Learn before you interfere', line: 'Not every problem needs our intervention.', from: ['learning', 'ecosystems'],
    list: ['Understand first.', 'Observe.', 'Ask.', 'Then act.'],
    text: 'The people who live here know this land better than any training can teach. Outdoor knowledge is something we earn by paying attention, before we assume we know what is best.',
  },
];

// The learning layer. Each entry: which values it comes from, what it helps you understand, and its content.
const LEARN = [
  {
    id: 'lnt', name: 'Leave No Trace', understand: 'Understanding our impact', from: ['sustainability'],
    intro: 'Seven principles, used by outdoor people around the world. This is how they apply in the Sahyadris.',
    items: [
      ['Plan ahead and prepare', 'Know the route, the weather and which spots are fragile before you arrive.'],
      ['Stay on durable ground', 'Stay on the trail and walk single file. Never cut a corner down a slope.'],
      ['Carry out your waste', 'Everything goes back in your bag, including fruit peels and food scraps.'],
      ['Leave what you find', 'Photograph flowers, orchids and mossy rock. Do not take them, and do not carve on trees or fort walls.'],
      ['Keep fire small and safe', 'Fire only where it is right for the experience, and always fully out before you leave.'],
      ['Respect wildlife', 'Watch from a distance. Never feed monkeys or any other animal.'],
      ['Be considerate of others', 'Keep noise down. Quiet is part of why people come here, and wildlife needs it too.'],
    ],
    credit: 'Based on the seven principles of the Leave No Trace Center for Outdoor Ethics.',
  },
  {
    id: 'geotag', name: 'Say No to Geotagging', understand: 'Understanding the impact of information', from: ['ecosystems'],
    intro: 'Before you post a location, ask yourself:',
    items: [
      ['Is it fragile?', 'A waterfall, a cave, a stream bed or a patch of rare plants.'],
      ['Does wildlife live or breed here?', 'Nests, roosts and breeding grounds are easily disturbed.'],
      ['Is it someone’s home?', 'A field, a courtyard or a small village space.'],
      ['Could it take many more visitors?', 'If the answer is no, share the moment, not the pin.'],
    ],
    ask: 'Leave location names out of your posts, stories and reviews. Call it “paradise” instead, or tag or collaborate with Rock & Anchor to share your experience without revealing where it is.',
    thanks: 'Thank you for supporting responsible travel.',
  },
  {
    id: 'essentials', name: 'The 10 Essentials', understand: 'Understanding how to prepare', from: ['learning'], fromExtra: 'Responsibility',
  },
];

// The 10 Essentials as published by the Appalachian Mountain Club (AMC), in AMC's order:
// outdoors.org, "The 10 Essentials: What to Pack For a Backcountry Hike". Wording adapted for Sahyadri day treks.
// The two extra items come from the Rock & Anchor Leaders Guide (Module 20, The Sahyadri Essentials).
const ESSENTIALS = [
  ['Hydration', 'Enough water for the day in a reusable bottle, and a way to purify more. Drink before you feel thirsty.'],
  ['Nutrition', 'More food than you think you need: dates, nuts, jaggery, fruit, plus a little extra.'],
  ['Navigation', 'A map of the route and a phone with offline maps. Know how to use them, and do not rely on the phone alone.'],
  ['Emergency shelter', 'Something to keep off rain and wind if you have to stop: an emergency blanket or a poncho.'],
  ['Layers', 'A warm layer and a rain jacket. Avoid cotton, especially in the monsoon.'],
  ['Illumination', 'A headlamp with spare batteries, in case the day runs past sunset. A phone torch is not enough.'],
  ['Firestarter', 'A way to make heat and light in an emergency. Your leader carries this.'],
  ['First aid kit', 'Your own medicines, and a kit you know how to use. Your leader carries the full group kit.'],
  ['Repair kit', 'Duct tape, safety pins and spare cord. Small fixes save long walks.'],
  ['Sun protection', 'Sunscreen, sunglasses and a cap or hat.'],
];
const ESSENTIALS_PLUS = [
  ['Communication', 'A fully charged phone, emergency numbers saved, and a whistle. Three blasts means help. Our leaders also carry walkie-talkies to stay in touch across the group.'],
  ['Attitude and judgment', 'The destination is not the goal. Getting everyone home is. Turning back is a skill.'],
];

const ASK = ['Come curious.', 'Ask questions.', 'Respect the place.', 'Respect the people.', 'Give wildlife space.', 'Carry what you need.', 'Take your waste back.', 'Think before you share a location.', 'Be willing to learn.', 'Leave something good behind.'];

function valuesPage(data) {
  const ph = (slug, i, big = true) => { const x = bySlug(data, slug); const p = x && x.photos && (x.photos[i] || x.photos[0]); return p ? (big ? p.url : p.thumb) : cover(sorted(data)[0], big); };
  const heroP = slot(data, 'values.hero', ph('ridge-and-lake', 0)), endP = slot(data, 'values.end', ph('winter-trekking', 0));
  const vName = Object.fromEntries(VALUES.map((v) => [v.id, v.name]));
  const pName = Object.fromEntries(PRACTICES.map((p) => [p.id, p.name]));
  // A value leads to a practice (#do-id) or, if there is no practice card, to the learning item (#learn-id).
  const lead = (id) => (pName[id] ? `<a href="#do-${id}">${esc(pName[id])}</a>` : `<a href="#learn-${id}">${esc((LEARN.find((l) => l.id === id) || {}).name || id)}</a>`);
  const tags = (ids, extra) => `<span class="vl-from"><span class="vl-from-k">Comes from</span>${ids.map((id) => `<a href="#${id}">${esc(vName[id])}</a>`).join('')}${extra ? `<b>${esc(extra)}</b>` : ''}</span>`;
  const plan = waLink('Hi Rock & Anchor, I would like to plan an experience for my group.');

  const valueCard = (v, i) => {
    const p = slot(data, v.photo[0], ph(v.photo[1], v.photo[2]));
    return `<article class="vl-value rv" id="${v.id}">
    <figure class="vl-value-img">${p.src ? `<img src="${esc(p.src)}"${posStyle(p)} alt="${esc(p.alt || v.name)}" loading="lazy">` : ''}</figure>
    <div class="vl-value-body">
      <span class="vl-num">0${i + 1}</span><h3>${esc(v.name)}</h3>
      <p class="vl-line">${esc(v.line)}</p>
      <p>${esc(v.text)}</p>
      ${v.ask ? `<p class="vl-ask">${esc(v.ask)}</p>` : ''}
      ${v.tmi ? `<ol class="vl-tmi">${v.tmi.map(([w, t]) => `<li><b>${w}</b><span>${esc(t)}</span></li>`).join('')}</ol>` : ''}
      <h4>On the ground</h4><ul class="vl-ground">${v.ground.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
      <p class="vl-not"><b>What it is not:</b> ${esc(v.not)}</p>
      <p class="vl-leads">Becomes ${v.leads.map(lead).join(' and ')}</p>
    </div>
  </article>`;
  };

  const practiceCard = (p) => `<article class="vl-prac rv" id="do-${p.id}">
    <h3>${esc(p.name)}</h3><p class="vl-prac-line">${esc(p.line)}</p>
    ${p.list ? `<ul>${p.list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    ${p.text ? `<p>${esc(p.text)}</p>` : ''}
    ${tags(p.from)}
  </article>`;

  const lnt = LEARN[0], geo = LEARN[1];
  const body = `<style>${VALUES_CSS}</style>
<div class="vl">
<section class="vl-hero"><img src="${esc(heroP.src)}"${posStyle(heroP)} alt="${esc(heroP.alt || 'A Rock & Anchor group on a Sahyadri trail')}" fetchpriority="high"><div class="wrap">
  <p class="vl-kicker">Our values</p>
  <h1>Our values are things we are willing to act on.</h1>
  <p class="vl-sub">We believe the way we move through the outdoors matters as much as where we go.</p>
  <a class="vl-scroll" href="#intro">Read on ↓</a>
</div></section>

<section class="vl-intro" id="intro"><div class="wrap vl-intro-grid">
  <div><p class="vl-kicker rv">Why values</p><h2 class="vl-h rv">Saying we care is easy.</h2>
  <p class="vl-lead rv">We can say we care about nature. The more useful question is: what do we do because we care?</p></div>
  <div class="rv"><p class="vl-p">Our values shape:</p>
  <ul class="vl-shapes"><li>The experiences we create</li><li>How we work with villages</li><li>How we train our people</li><li>The places we choose to visit</li><li>What we ask of everyone who comes with us</li></ul>
  <p class="vl-p vl-wall">They are not words we put on a wall. They are what we do when nobody is checking.</p></div>
</div></section>

<section class="vl-five" id="values"><div class="wrap">
  <p class="vl-kicker rv">The five values</p><h2 class="vl-h rv">What we believe, and what it looks like outside.</h2>
  <nav class="vl-jump rv" aria-label="The five values">${VALUES.map((v, i) => `<a href="#${v.id}"><span>0${i + 1}</span>${esc(v.name)}</a>`).join('')}</nav>
  <div class="vl-values">${VALUES.map(valueCard).join('')}</div>
</div></section>

<section class="vl-practice" id="practice"><div class="wrap">
  <p class="vl-kicker rv">Values in practice</p><h2 class="vl-h rv">Values become real when they change what we do.</h2>
  <p class="vl-p rv">These are not extra values. They are habits that come from the five, the things you will see us do on every experience.</p>
  <div class="vl-pracs">${PRACTICES.map(practiceCard).join('')}</div>
</div></section>

<section class="vl-learn" id="learn"><div class="wrap">
  <p class="vl-kicker rv">Learn before you go</p><h2 class="vl-h rv">Being responsible outdoors starts before you arrive.</h2>

  <div class="vl-learn-grid">
    <article class="vl-learn-card rv" id="learn-${lnt.id}"><p class="vl-learn-u">${esc(lnt.understand)}</p><h3>${esc(lnt.name)}</h3><p>${esc(lnt.intro)}</p>
      <ol class="vl-seven">${lnt.items.map(([h, t]) => `<li><b>${esc(h)}</b><span>${esc(t)}</span></li>`).join('')}</ol><p class="vl-credit">${esc(lnt.credit)}</p></article>
    <article class="vl-learn-card vl-geo rv" id="learn-${geo.id}"><p class="vl-learn-u">${esc(geo.understand)}</p><h3>${esc(geo.name)}</h3><p>${esc(geo.intro)}</p>
      <ul class="vl-qs">${geo.items.map(([h, t]) => `<li><b>${esc(h)}</b><span>${esc(t)}</span></li>`).join('')}</ul>
      <div class="vl-geo-ask"><p class="vl-learn-u">What we ask</p><p>${esc(geo.ask)}</p><a class="vl-insta" href="https://www.instagram.com/${SITE.insta}/">Tag @${esc(SITE.insta)}</a></div>
      <p class="vl-pin">${esc(geo.thanks)}</p></article>
  </div>
</div></section>

<section class="vl-ten" id="learn-essentials"><div class="wrap">
  <div class="vl-ten-head"><div><p class="vl-kicker rv">Understanding how to prepare</p><h2 class="vl-h rv">The 10 Essentials.</h2></div>
  <div class="rv"><p class="vl-lead">Preparation is part of adventure.</p><p class="vl-p">This is the Appalachian Mountain Club’s list of 10 Essentials, a checklist outdoor people around the world pack by. It is about being ready, not about being afraid. Each experience also has its own packing list, which we share with you after you book.</p></div></div>
  <div class="vl-check" data-check>
    <p class="vl-count" aria-live="polite"><span data-n>0</span> of ${ESSENTIALS.length} ready</p>
    <ol>${ESSENTIALS.map(([h, t], i) => `<li><label><input type="checkbox"><span class="vl-box" aria-hidden="true"></span><span class="vl-n">${i + 1}</span><span class="vl-ct"><b>${esc(h)}</b><span>${esc(t)}</span></span></label></li>`).join('')}</ol>
  </div>
  <div class="vl-plus rv"><p class="vl-plus-h">In the Sahyadris, our leaders carry two more.</p>
    <ol start="11">${ESSENTIALS_PLUS.map(([h, t]) => `<li><b>${esc(h)}</b><span>${esc(t)}</span></li>`).join('')}</ol>
    <p class="vl-credit">The first ten follow the Appalachian Mountain Club’s 10 Essentials. The last two are Rock &amp; Anchor’s own, from how we train our leaders. They are not values. They are how we prepare to act on them.</p></div>
</div></section>

<section class="vl-ask-sec" id="ask"><div class="wrap">
  <p class="vl-kicker rv">What we ask of you</p>
  <h2 class="vl-h rv">We are not asking you to be an expert. We are asking you to pay attention.</h2>
  <ol class="vl-asks">${ASK.map((a, i) => `<li class="rv"><span>${String(i + 1).padStart(2, '0')}</span>${esc(a)}</li>`).join('')}</ol>
</div></section>

<section class="vl-end"><img src="${esc(endP.src)}"${posStyle(endP)} alt="" loading="lazy"><div class="wrap">
  <h2>We are still learning.</h2>
  <p>Values are a practice, not something we have finished. We are learning how to do this better, one experience at a time, and we invite you to learn with us.</p>
  <div class="vl-end-cta"><a class="btn btn-clay" href="/experiences">Explore our experiences</a><a class="btn btn-ghost" href="${plan}">${ICON.wa}Plan one for your group</a></div>
</div></section>
</div>
<script>${VALUES_JS}</script>`;
  return layout({ title: 'Our Values', desc: 'What Rock & Anchor believes, and what that looks like outdoors: our five values, Leave No Trace, Say No to Geotagging and the 10 Essentials.', path: '/values', body, image: heroP.src, data });
}

const VALUES_JS = `(function(){
var d=document,w=window,rm=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
d.documentElement.classList.add('vljs');
var io=('IntersectionObserver' in w)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'}):null;
d.querySelectorAll('.vl .rv').forEach(function(el){if(io&&!rm)io.observe(el);else el.classList.add('in')});
var c=d.querySelector('[data-check]');if(c){var n=c.querySelector('[data-n]'),bs=c.querySelectorAll('input');function u(){var k=0;bs.forEach(function(b){if(b.checked)k++});n.textContent=k;c.classList.toggle('all',k===bs.length)}bs.forEach(function(b){b.addEventListener('change',u)});u()}
})();`;

const VALUES_CSS = `
.vl{--sp:clamp(64px,9vw,120px)}
.vl section{padding:var(--sp) 0}
.vl-kicker{font:700 13px/1 "DM Sans",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--clay);margin:0 0 16px}
.vl-h{font-size:clamp(34px,5.2vw,66px);max-width:24ch;margin:0 0 .5em}
.vl-p{font-size:clamp(17px,1.6vw,19px);color:var(--ink2);max-width:60ch}
.vl-lead{font-size:clamp(19px,2.1vw,25px);color:var(--ink);max-width:40ch;font-weight:500}
.vljs .vl .rv{opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease}
.vljs .vl .rv.in{opacity:1;transform:none}
.vl a{color:inherit}
/* hero */
.vl-hero{position:relative;min-height:clamp(480px,78vh,720px);display:flex;align-items:flex-end;color:#fff;background:var(--night);padding:0!important;overflow:hidden}
.vl-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 40%}
.vl-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,16,22,.35) 0%,rgba(12,16,22,.1) 35%,rgba(12,16,22,.72) 100%)}
.vl-hero .wrap{position:relative;z-index:2;padding-bottom:clamp(48px,9vh,96px);width:100%}
.vl-hero .vl-kicker{color:#f7d2b2;text-shadow:0 1px 8px rgba(0,0,0,.6)}
.vl-hero h1{font-size:clamp(44px,7vw,96px);max-width:16ch;margin:0 0 .3em;text-shadow:0 2px 20px rgba(0,0,0,.35)}
.vl-sub{font-size:clamp(17px,1.9vw,21px);max-width:50ch;margin:0 0 26px;color:#f2ede6;text-shadow:0 1px 10px rgba(0,0,0,.5)}
.vl-scroll{color:#fff!important;font-weight:700;text-decoration:none;border-bottom:2px solid #f3c9a6;padding-bottom:3px}
/* intro */
.vl-intro-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(28px,5vw,72px);align-items:start}
.vl-shapes{list-style:none;padding:0;margin:6px 0 22px;display:flex;flex-direction:column}
.vl-shapes li{font:700 clamp(22px,2.4vw,30px)/1.15 "Big Shoulders Display","Arial Narrow",sans-serif;padding:12px 0;border-bottom:1px solid var(--line);color:var(--forest)}
.vl-shapes li:first-child{border-top:1px solid var(--line)}
.vl-wall{font-weight:700;color:var(--ink)}
/* five values */
.vl-five{background:#efe7da}
.vl-jump{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0 40px}
.vl-jump a{display:inline-flex;gap:8px;align-items:center;border:1.5px solid var(--line);background:var(--paper);border-radius:999px;padding:10px 16px;font-weight:700;font-size:15px;text-decoration:none}
.vl-jump a span{color:var(--clay);font-size:12px;letter-spacing:.08em}
.vl-jump a:hover{border-color:var(--forest)}
.vl-values{display:flex;flex-direction:column;gap:28px}
.vl-value{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);background:var(--card);border:1px solid var(--line);border-radius:20px;overflow:hidden;scroll-margin-top:90px}
.vl-value:nth-child(even){grid-template-columns:minmax(0,7fr) minmax(0,5fr)}
.vl-value:nth-child(even) .vl-value-img{order:2}
.vl-value-img{margin:0;min-height:280px;background:var(--moss)}
.vl-value-img img{width:100%;height:100%;object-fit:cover;display:block}
.vl-value-body{padding:clamp(24px,3.4vw,44px)}
.vl-num{color:var(--clay);font:800 14px/1 "DM Sans",sans-serif;letter-spacing:.12em}
.vl-value h3{font-size:clamp(32px,3.6vw,46px);margin:8px 0 4px}
.vl-line{font:700 clamp(20px,2.2vw,26px)/1.25 "DM Sans",sans-serif;color:var(--forest);margin:0 0 14px}
.vl-value-body>p{color:var(--ink2);max-width:62ch}
.vl-ask{border-left:3px solid var(--clay);padding:4px 0 4px 16px;font-style:italic;color:var(--ink)!important;font-size:18px}
.vl-value h4{font:700 12px/1 "DM Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--clay);margin:22px 0 10px}
.vl-ground{list-style:none;padding:0;margin:0}
.vl-ground li{position:relative;padding:7px 0 7px 26px;color:var(--ink2)}
.vl-ground li:before{content:"";position:absolute;left:2px;top:15px;width:12px;height:2px;background:var(--forest)}
.vl-tmi{list-style:none;padding:0;margin:18px 0 4px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.vl-tmi li{background:var(--moss);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:4px;position:relative}
.vl-tmi b{font:800 22px/1 "Big Shoulders Display","Arial Narrow",sans-serif;color:var(--forest);text-transform:uppercase;letter-spacing:.02em}
.vl-tmi span{font-size:14.5px;color:var(--ink2);line-height:1.4}
.vl-not{margin-top:18px!important;font-size:15.5px;color:var(--muted)!important}.vl-not b{color:var(--ink)}
.vl-leads{margin:14px 0 0!important;font-weight:700;font-size:15px;color:var(--ink)!important}
.vl-leads a{color:var(--clay);text-decoration:none;border-bottom:1.5px solid currentColor}
/* practice */
.vl-pracs{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;margin-top:30px}
.vl-prac{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px;display:flex;flex-direction:column;gap:10px;scroll-margin-top:90px}
.vl-prac:first-child,.vl-prac:nth-child(2){background:var(--forest);border-color:var(--forest);color:#fff}
.vl-prac:first-child p,.vl-prac:nth-child(2) p{color:#e1e9e2}
.vl-prac:first-child .vl-prac-line,.vl-prac:nth-child(2) .vl-prac-line{color:#f3c9a6}
.vl-prac h3{font-size:clamp(28px,2.8vw,36px);margin:0}
.vl-prac-line{font-weight:700;font-size:18px;color:var(--clay);margin:0}
.vl-prac p{margin:0;color:var(--ink2)}
.vl-prac ul{list-style:none;padding:0;margin:0}
.vl-prac li{padding:6px 0;border-bottom:1px dashed var(--line);color:var(--ink2)}
.vl-prac li:last-child{border-bottom:0}
.vl-from{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:auto;padding-top:10px}
.vl-from-k{font:700 11px/1 "DM Sans",sans-serif;letter-spacing:.12em;text-transform:uppercase;opacity:.7;margin-right:4px}
.vl-from a,.vl-from b{font-size:13px;font-weight:700;text-decoration:none;border-radius:999px;padding:6px 11px;background:var(--moss);color:var(--forest)}
.vl-prac:first-child .vl-from a,.vl-prac:nth-child(2) .vl-from a{background:rgba(255,255,255,.14);color:#fff}
/* learn */
.vl-learn{background:var(--card);border-top:1px solid var(--line)}
.vl-learn-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:20px;align-items:start;margin-top:30px}
.vl-learn-card{background:var(--paper);border:1px solid var(--line);border-radius:20px;padding:clamp(22px,3vw,36px);scroll-margin-top:90px}
.vl-learn-u{font:700 12px/1.4 "DM Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--clay);margin:0 0 10px}
.vl-learn-card h3{font-size:clamp(30px,3.2vw,42px);margin:0 0 8px}
.vl-learn-card>p{color:var(--ink2)}.vl-learn-card>p.vl-learn-u{color:var(--clay)}
.vl-seven{list-style:none;counter-reset:s;padding:0;margin:16px 0 0}
.vl-seven li{counter-increment:s;display:grid;grid-template-columns:40px 1fr;column-gap:12px;padding:12px 0;border-top:1px solid var(--line)}
.vl-seven li:before{content:counter(s);grid-row:span 2;width:32px;height:32px;border-radius:50%;background:var(--forest);color:#fff;display:grid;place-items:center;font-weight:800;font-size:15px}
.vl-seven b,.vl-qs b{display:block}.vl-seven span,.vl-qs span{color:var(--ink2);font-size:15.5px}
.vl-credit{font-size:13.5px;color:var(--muted)!important;margin:16px 0 0}
.vl-geo{background:var(--night);border-color:var(--night);color:#fff}
.vl-geo>p{color:#d7d2ca!important}.vl-geo .vl-learn-u{color:#f3c9a6}
.vl-qs{list-style:none;padding:0;margin:16px 0 0}
.vl-qs li{padding:12px 0 12px 34px;border-top:1px solid rgba(255,255,255,.15);position:relative}
.vl-qs li:before{content:"?";position:absolute;left:0;top:13px;width:22px;height:22px;border-radius:50%;border:1.5px solid #f3c9a6;color:#f3c9a6;display:grid;place-items:center;font-weight:800;font-size:13px}
.vl-qs span{color:#cfc8bd}
.vl-geo-ask{margin-top:18px;padding:16px 18px;border-radius:14px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15)}.vl-geo-ask .vl-learn-u{color:#f3c9a6;margin-bottom:6px}.vl-geo-ask p{margin:0 0 12px;color:#e7e2da}
.vl-insta{display:inline-block;color:#fff!important;font-weight:700;text-decoration:none;border-bottom:2px solid #f3c9a6;padding-bottom:2px}
.vl-pin{margin:18px 0 0;font:800 clamp(22px,2.4vw,28px)/1.15 "Big Shoulders Display","Arial Narrow",sans-serif;color:#f3c9a6!important}
/* ten essentials */
.vl-ten{background:#efe7da;scroll-margin-top:70px}
.vl-ten-head{display:grid;grid-template-columns:1fr 1.2fr;gap:clamp(24px,5vw,64px);align-items:end;margin-bottom:30px}
.vl-ten-head .vl-lead{margin:0 0 10px}
.vl-check{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:clamp(18px,3vw,32px)}
.vl-count{margin:0 0 14px;font-weight:700;color:var(--forest)}.vl-check.all .vl-count{color:var(--clay)}
.vl-check ol{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;column-gap:28px}
.vl-check li{border-top:1px solid var(--line)}
.vl-check label{display:grid;grid-template-columns:26px 30px 1fr;gap:12px;align-items:start;padding:14px 0;cursor:pointer}
.vl-check input{position:absolute;opacity:0;width:1px;height:1px}
.vl-box{width:24px;height:24px;border:2px solid var(--forest);border-radius:7px;margin-top:2px;display:grid;place-items:center;transition:background .15s}
.vl-check input:checked+.vl-box{background:var(--forest)}
.vl-check input:checked+.vl-box:after{content:"";width:6px;height:11px;border:solid #fff;border-width:0 2.5px 2.5px 0;transform:rotate(45deg) translate(-1px,-1px)}
.vl-check input:focus-visible+.vl-box{outline:3px solid var(--clay);outline-offset:2px}
.vl-n{font:800 22px/1 "Big Shoulders Display","Arial Narrow",sans-serif;color:var(--clay);margin-top:2px}
.vl-ct b{display:block;font-size:17px}.vl-ct span{color:var(--ink2);font-size:15.5px}
.vl-check input:checked~.vl-ct b{text-decoration:line-through;text-decoration-color:var(--clay)}
.vl-plus{margin-top:20px;background:var(--forest);color:#fff;border-radius:20px;padding:clamp(20px,3vw,32px)}
.vl-plus-h{font:800 clamp(24px,2.6vw,32px)/1.1 "Big Shoulders Display","Arial Narrow",sans-serif;margin:0 0 10px}
.vl-plus ol{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:14px 28px;counter-reset:p 10}
.vl-plus li{counter-increment:p;display:grid;grid-template-columns:30px 1fr;column-gap:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.18)}
.vl-plus li:before{content:counter(p);grid-row:span 2;font:800 22px/1 "Big Shoulders Display","Arial Narrow",sans-serif;color:#f3c9a6}
.vl-plus b{display:block;font-size:17px}.vl-plus span{color:#d7e2d9;font-size:15.5px}
.vl-plus .vl-credit{color:#b9cbbd!important}
/* what we ask */
.vl-ask-sec{background:var(--night);color:#fff}
.vl-ask-sec .vl-kicker{color:#f3c9a6}
.vl-ask-sec .vl-h{max-width:22ch}
.vl-asks{list-style:none;padding:0;margin:34px 0 0;display:grid;grid-template-columns:1fr 1fr;column-gap:clamp(24px,5vw,72px)}
.vl-asks li{display:flex;gap:18px;align-items:baseline;padding:18px 0;border-top:1px solid rgba(255,255,255,.14);font:800 clamp(26px,3.2vw,40px)/1.1 "Big Shoulders Display","Arial Narrow",sans-serif}
.vl-asks li span{font:700 13px/1 "DM Sans",sans-serif;letter-spacing:.1em;color:#f3c9a6;flex:0 0 26px}
/* end */
.vl-end{position:relative;color:#fff;text-align:center;overflow:hidden;background:var(--night)}
.vl-end img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.35}
.vl-end .wrap{position:relative}
.vl-end h2{font-size:clamp(46px,7.4vw,100px);margin:0 auto .3em;max-width:16ch;text-shadow:0 2px 20px rgba(0,0,0,.35)}
.vl-end p{font-size:clamp(18px,2vw,22px);max-width:48ch;margin:0 auto 30px;color:#f2ede6;text-shadow:0 1px 10px rgba(0,0,0,.5)}
.vl-end-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.vl-end .btn-ghost{color:#fff;border-color:rgba(255,255,255,.6)}
@media(max-width:900px){.vl-intro-grid,.vl-learn-grid,.vl-ten-head{grid-template-columns:1fr;gap:20px}
.vl-value,.vl-value:nth-child(even){grid-template-columns:1fr}.vl-value:nth-child(even) .vl-value-img{order:0}.vl-value-img{min-height:0;aspect-ratio:16/10}}
@media(max-width:640px){.vl-check ol,.vl-plus ol,.vl-asks{grid-template-columns:1fr}.vl-tmi{grid-template-columns:1fr}.vl-jump{margin-bottom:28px}.vl-jump a{font-size:14px;padding:8px 13px}}
`;


// ---------- Curate your own experience ----------
// A guided builder: choices > recommendation logic > example flow > human handoff over WhatsApp.
// Server side: reads the live experiences (Airtable) and sends a small JSON of them to the page.
// Client side: one question at a time, state kept in the URL hash (refresh and shared links keep the choices).
// No new backend: "Send this to Rock & Anchor" opens WhatsApp with the full summary, the same channel the site already uses.

// Activities shown in step 5. A fixed list, but an activity only appears if at least one live
// experience mentions it, so the page never offers something Rock & Anchor does not run.
const CURATE_ACTS = [
  ['trek', 'Trekking', 'A ridge, a forest trail or a hill.', /\btrek|\bhik(e|ing)\b/, 'day'],
  ['waterfall', 'Waterfalls', 'Stand under one, or just listen to it.', /waterfall/, 'day'],
  ['water', 'Streams and lakes', 'Get your feet wet.', /\bstream|\briver|\blake\b|\bfloat|\bsplash|\bswim/, 'day'],
  ['nature', 'Nature exploration', 'Insects, birds, frogs and forests up close.', /wildlife|insect|\bfrog|\bbird|forest|biodiversity|nature walk|\bfungi|\bsnail/, 'day'],
  ['village', 'Village life', 'Spend time where people live and work.', /village/, 'day'],
  ['farming', 'Farming', 'See where food comes from.', /\bfarm|paddy|\brice\b|harvest|sowing|plough/, 'day'],
  ['food', 'Local food', 'Eat what is cooked here.', /\blunch\b|\bdinner\b|\bmeal|maharashtrian|cook/, 'meal'],
  ['games', 'Outdoor games', 'Play, run, laugh.', /\bgames?\b/, 'day'],
  ['skills', 'Outdoor skills', 'Navigation, how to camp, looking after the place.', /navigation|survival|\bknots?\b|leave no trace|how to camp|outdoor skills|camp ?craft/, 'day'],
  ['climbing', 'Rock climbing', 'Hands on rock.', /rock climb|rappel/, 'day'],
  ['cave', 'Caves', 'Step into the cool and dark.', /\bcaves?\b/, 'day'],
  ['trees', 'Tree planting', 'Leave something growing.', /tree planting|plant(ing)? (a )?trees?|sapling/, 'day'],
  ['painting', 'Rock painting', 'Make something with your hands.', /rock painting/, 'day'],
  ['sustain', 'Sustainability activities', 'Waste, compost and what happens next.', /sustainab|compost|vermi/, 'day'],
  ['sunset', 'Sunsets', 'Be somewhere high when the light goes.', /sunset/, 'evening'],
  ['stars', 'Stargazing', 'Telescopes, planets and a dark sky.', /stargaz|telescope|planet|constellation|night sky/, 'night'],
  ['nightwalk', 'Night walks', 'The forest after dark.', /night (walk|trail)|after dark/, 'night'],
  ['camping', 'Camping', 'Sleep in a tent.', /\btents?\b|camping/, 'stay'],
  ['campfire', 'Campfire', 'Stories around a fire.', /campfire|bonfire/, 'night'],
  // Added on request (14 Oct 2026): offered even where no experience text mentions them yet. 'always' shows them regardless.
  ['swim', 'Swimming', 'A proper swim in a lake or river.', /\bswim/, 'day', 'always'],
  ['fondue', 'Chocolate fondue', 'Something sweet by the fire.', /fondue/, 'night', 'always'],
  ['teach', 'Teaching village children', 'An hour with children in the village. Share something you know.', /teach(ing)? (the )?(village )?(children|kids)/, 'day', 'always', '1 hour'],
];

function curateData(data) {
  const exps = sorted(data).filter((e) => !(e.categories || []).some((c) => /guide training/i.test(c)));
  const acts = CURATE_ACTS.map(([id, label, line, re, kind, always, dur]) => ({ id, label, line, kind, re, always: !!always, dur: dur || '' }));
  // These only use a photo set in Airtable (curate.act.<id>); no matching experience photo exists yet.
  const OWN_PHOTO_ONLY = ['trees', 'swim', 'fondue'];
  const out = exps.map((e) => {
    const text = [e.title, e.summary, e.description, e.itinerary].join(' ').toLowerCase(); // FAQs left out: they mention safety (first aid) and logistics, not activities
    const p = priceInfo(e);
    const ages = String(e.age || '').match(/(\d+)\s*(?:to|-|–)\s*(\d+)|(\d+)\s*\+/);
    const t = String(e.timing || '').toLowerCase();
    const hrs = (() => { const m = t.match(/(\d{1,2})(?::(\d\d))?\s*(am|pm)\s*to\s*(\d{1,2})(?::(\d\d))?\s*(am|pm)/); if (!m) return null; const h = (H, M, ap) => ((+H % 12) + (ap === 'pm' ? 12 : 0)) + (+M || 0) / 60; return { start: h(m[1], m[2], m[3]), end: h(m[4], m[5], m[6]) }; })();
    const len = /night|2 days|overnight/.test(t) ? 'night' : hrs ? (hrs.end - hrs.start <= 5.5 ? 'short' : 'day') : /evening|hours/.test(t) ? 'short' : '';
    return {
      s: e.slug, t: e.title, d: shortText(plainText(e.summary || firstLine(e)), 140), c: e.categories || [],
      a: acts.filter((a) => a.re.test(text)).map((a) => a.id),
      img: cover(e), min: p.min, grp: p.group, lab: p.minLabel,
      lo: ages ? +(ages[1] || ages[3]) : 0, hi: ages && ages[2] ? +ages[2] : 99,
      len, eve: !!(hrs && hrs.start >= 15), up: upcoming(data, e).length,
    };
  });
  // Photo per activity: an Airtable slot (curate.act.<id>) if set, otherwise the cover of the most specific
  // experience that offers it (fewest other activities), never repeating a photo.
  const taken = new Set();
  const used = acts.filter((a) => a.always || out.some((e) => e.a.includes(a.id))).map((a) => {
    const sl = slot(data, 'curate.act.' + a.id, '');
    let img = sl.src || (a.id === 'teach' ? slot(data, 'about.ground.schools', '').src : ''); // village school photo already chosen for About
    if (!img && !OWN_PHOTO_ONLY.includes(a.id)) {
      const cands = out.filter((e) => e.a.includes(a.id)).sort((x, y) => x.a.length - y.a.length);
      for (const e of cands) { const ex = bySlug(data, e.s); for (const ph of (ex && ex.photos) || []) { if (ph.video || taken.has(ph.thumb)) continue; img = ph.thumb; break; } if (img) break; }
    }
    if (img) taken.add(img);
    return { id: a.id, label: a.label, line: a.line, kind: a.kind, dur: a.dur, img: img || '' };
  });
  return { exps: out, acts: used };
}

function curatePage(data) {
  const cd = curateData(data);
  const ph = (slug, i) => { const x = bySlug(data, slug); const p = x && x.photos && (x.photos[i] || x.photos[0]); return p ? p.url : cover(sorted(data)[0], true); };
  const heroP = slot(data, 'curate.hero', ph('little-feet-sunset-safari', 2));
  const json = JSON.stringify({ ...cd, wa: SITE.wa, phone: SITE.phone }).replace(/</g, '\\u003c');
  const body = `<style>${CURATE_CSS}</style>
<div class="cu">
<section class="cu-hero"><img src="${esc(heroP.src)}"${posStyle(heroP)} alt="${esc(heroP.alt || 'A group outdoors with Rock & Anchor')}" fetchpriority="high"><div class="wrap">
  <p class="cu-kicker">Curate your own experience</p>
  <h1>Let’s create something that feels like yours.</h1>
  <p class="cu-sub">Tell us who you are bringing, what you want to experience and how much time you have. We’ll help turn it into a Rock &amp; Anchor experience.</p>
  <p class="cu-bring"><b>You bring the people.</b> We bring the place, people and possibilities.</p>
  <a class="btn btn-clay cu-start" href="#curate" data-start>Start curating</a>
</div></section>

<section class="cu-app" id="curate" aria-live="polite"><div class="wrap">
  <noscript><div class="cu-card"><h2>This builder needs JavaScript.</h2><p>Tell us who you are bringing, what you want to do and when, and we will shape it with you.</p><a class="btn btn-clay" href="${waLink('Hi Rock & Anchor, I would like to curate a private experience for my group.')}">${ICON.wa}WhatsApp us</a></div></noscript>
  <div id="cu-root"></div>
</div></section>
</div>
<script type="application/json" id="cu-data">${json}</script>
<script>${CURATE_JS}</script>`;
  return layout({ title: 'Curate your own experience', desc: 'Build an idea for a private Rock & Anchor experience: who is coming, what you want to feel, how much time you have. We shape the rest with you.', path: '/curate', body, image: heroP.src, data });
}

// Client script. Plain ES5 style, no template literals, so it can live inside this file safely.
const CURATE_JS = String.raw`(function(){
var D=JSON.parse(document.getElementById('cu-data').textContent),root=document.getElementById('cu-root');
if(!root)return;
function h(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var WHO=[['family','Family'],['children','Children'],['friends','Friends'],['college','College group'],['corporate','Corporate or team'],['celebration','Celebration'],['school','School'],['other','Something else']];
var AGES=[['u5','Under 5'],['5-8','5 to 8'],['9-12','9 to 12'],['13-17','13 to 17']];
var AGEN={'u5':[0,4],'5-8':[5,8],'9-12':[9,12],'13-17':[13,17]};
var FEEL=[['explore','Explore','See something new.'],['challenge','Challenge','Push yourself a little.'],['slow','Slow down','Get away from the noise.'],['learn','Learn','Come back knowing something you did not know before.'],['together','Spend time together','Do something that brings everyone into the same moment.'],['village','Village life','Spend time with the people and places that make the Sahyadris what they are.'],['lookup','Look up','Watch the sky. Stay out after dark.'],['kids','Let the kids loose','Give them space to run, discover and get dirty.']];
var LEAVE=[['touched','Touched','Something moved you.'],['moved','Moved','You did something you did not think you would.'],['inspired','Inspired','You saw something differently.']];
var TIME=[['hours','A few hours'],['half','Half day'],['full','Full day'],['night','One night'],['weekend','Weekend'],['flex','I’m flexible']];
var LOCAL=[['meal','Eat a local meal'],['hosts','Meet local hosts'],['farming','Learn about farming'],['tradition','Try something traditionally done here'],['stories','Hear stories about the place'],['stay','Stay in or near the village'],['suggest','Let Rock & Anchor suggest something']];
var PACE=[['slow','Slow','More pauses. Less rushing.'],['balanced','Balanced','A little bit of everything.'],['active','Active','Keep us moving.'],['decide','Let Rock & Anchor decide','You know the place. Surprise us.']];
var STEPS=[['who','Who are you bringing with you?'],['feel','What do you want this experience to feel like?'],['leave','When you head home, what do you want to take with you?'],['time','How much time do you want to give this?'],['do','What do you want to do?'],['local','Would you like to bring the village into your experience?'],['pace','How do you want the day to move?'],['care','Before we put it together']];
var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
var S={step:-1,who:[],n:0,ages:[],feel:[],leave:[],time:'',when:'',date:'',month:'',acts:[],local:[],pace:'',ok:0};
var ACT={};D.acts.forEach(function(a){ACT[a.id]=a});
function lab(list,id){for(var i=0;i<list.length;i++)if(list[i][0]===id)return list[i][1];return id}
function labs(list,ids){return ids.map(function(i){return lab(list,i)})}
function has(k,v){return S[k].indexOf(v)>-1}
function tog(k,v){var i=S[k].indexOf(v);if(i>-1)S[k].splice(i,1);else S[k].push(v)}
// state in the URL hash, so refresh, back button and shared links keep the choices
function enc(o){try{return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}catch(e){return''}}
function dec(s){try{s=s.replace(/-/g,'+').replace(/_/g,'/');return JSON.parse(decodeURIComponent(escape(atob(s))))}catch(e){return null}}
function save(){if(S.step<0){if(location.hash)try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}return}var o={};for(var k in S)o[k]=S[k];var u=location.pathname+'#c='+enc(o);try{history.replaceState(null,'',u)}catch(e){}}
function load(){var m=location.hash.match(/c=([\w-]+)/);if(!m)return;var o=dec(m[1]);if(!o)return;for(var k in S)if(k in o&&typeof o[k]===typeof S[k])S[k]=o[k];if(S.step>STEPS.length)S.step=STEPS.length}
function link(){return location.origin+location.pathname+'#c='+enc(S)}

function opt(k,id,title,line,multi,img){var on=multi?has(k,id):S[k]===id;return '<button type="button" class="cu-opt'+(on?' on':'')+(img?' img':'')+'" data-k="'+k+'" data-v="'+h(id)+'"'+(multi?'':' data-one="1"')+' aria-pressed="'+on+'">'+(img?(img==='none'?'<span class="cu-opt-ph cu-ph-empty" aria-hidden="true"></span>':'<span class="cu-opt-ph" style="background-image:url(\''+h(img)+'\')"></span>'):'')+'<span class="cu-opt-t">'+h(title)+'</span>'+(line?'<span class="cu-opt-l">'+h(line)+'</span>':'')+'<span class="cu-tick" aria-hidden="true"></span></button>'}
function grid(k,list,multi,cls){return '<div class="cu-grid '+(cls||'')+'">'+list.map(function(o){return opt(k,o[0],o[1],o[2],multi)}).join('')+'</div>'}

function stepHtml(){
  var id=STEPS[S.step][0],q=STEPS[S.step][1],x='';
  if(id==='who'){
    x+='<p class="cu-hint">Pick all that fit.</p>'+grid('who',WHO,1,'cu-grid-s');
    x+='<div class="cu-sub2"><h3>How many people?</h3><div class="cu-num"><button type="button" class="cu-nb" data-n="-1" aria-label="One less">−</button><input id="cu-n" type="number" inputmode="numeric" min="1" max="999" value="'+(S.n||'')+'" placeholder="0" aria-label="Number of people"><button type="button" class="cu-nb" data-n="1" aria-label="One more">+</button></div>'+(S.n>40?'<p class="cu-note">A big group. We will plan this one with you directly, and may split it into smaller groups on the trail.</p>':'')+'</div>';
    if(has('who','children')||has('who','school')||has('who','family'))x+='<div class="cu-sub2"><h3>What ages are the children?</h3><p class="cu-hint">Pick all that apply. Skip if no children are coming.</p>'+grid('ages',AGES,1,'cu-grid-s')+'</div>';
  }
  if(id==='feel')x+='<p class="cu-hint">Pick as many as you like.</p>'+grid('feel',FEEL,1);
  if(id==='leave')x+='<p class="cu-hint">Pick one, two or all three.</p>'+grid('leave',LEAVE,1,'cu-grid-3');
  if(id==='time'){
    x+=grid('time',TIME.map(function(t){return [t[0],t[1]]}),0,'cu-grid-s');
    x+='<div class="cu-sub2"><h3>When?</h3><p class="cu-hint">You don’t need an exact date yet.</p>'+grid('when',[['date','A specific date'],['month','A month or season'],['flex','Flexible']],0,'cu-grid-s');
    if(S.when==='date'){var t=new Date(),iso=t.toISOString().slice(0,10);x+='<input class="cu-date" id="cu-date" type="date" min="'+iso+'" value="'+h(S.date)+'" aria-label="Preferred date">'}
    if(S.when==='month'){var mm=[],d=new Date();for(var i=0;i<12;i++){var dd=new Date(d.getFullYear(),d.getMonth()+i,1);mm.push([MONTHS[dd.getMonth()]+' '+dd.getFullYear(),MONTHS[dd.getMonth()].slice(0,3)+' '+String(dd.getFullYear()).slice(2)])}mm.push(['Monsoon (June to September)','Monsoon'],['Winter (November to February)','Winter']);x+='<div class="cu-grid cu-grid-m">'+mm.map(function(m){return opt('month',m[0],m[1],'',0)}).join('')+'</div>'}
    x+='</div>';
  }
  if(id==='do'){x+='<p class="cu-hint">These all come from experiences we already run. Pick what sounds good.</p><div class="cu-grid cu-grid-img">'+D.acts.map(function(a){return opt('acts',a.id,a.label,a.line,1,a.img||'none')}).join('')+'</div>'}
  if(id==='local')x+='<p class="cu-hint">These are real people who live here, not an attraction. Pick any that interest you.</p>'+grid('local',LOCAL,1,'cu-grid-s');
  if(id==='pace')x+='<p class="cu-hint">The same day can feel very different depending on pace.</p>'+grid('pace',PACE,0,'cu-grid-2');
  if(id==='care'){x+='<p class="cu-lead">Every experience we create happens somewhere that already belongs to someone and something.</p><ul class="cu-care">'+['Leave No Trace.','Respect wildlife.','Respect communities.','Do not disturb fragile places.','Think before sharing sensitive locations.'].map(function(p){return '<li>'+p+'</li>'}).join('')+'</ul><p class="cu-hint">More on this on our <a href="/values">Values</a> page.</p>'}
  return '<p class="cu-q-k">Step '+(S.step+1)+' of '+STEPS.length+'</p><h2 class="cu-q">'+h(q)+'</h2>'+x;
}
function canNext(){var id=STEPS[S.step][0];if(id==='who')return S.who.length>0&&S.n>0;return true}
function nextLabel(){var id=STEPS[S.step][0],k={feel:'feel',leave:'leave',time:'time',do:'acts',local:'local',pace:'pace'}[id];if(id==='care')return 'Sounds good';if(k&&(S[k]==='' ||S[k].length===0))return 'Skip for now';return 'Next'}
function progress(){return '<div class="cu-prog" role="progressbar" aria-valuemin="1" aria-valuemax="'+STEPS.length+'" aria-valuenow="'+(S.step+1)+'"><div class="cu-prog-bar" style="width:'+Math.round((S.step+1)/STEPS.length*100)+'%"></div></div><ol class="cu-dots">'+STEPS.map(function(s,i){return '<li class="'+(i<S.step?'done':i===S.step?'now':'')+'"><button type="button" data-go="'+i+'"'+(i>S.step?' disabled':'')+'>'+(i+1)+'</button></li>'}).join('')+'</ol>'}

// recommendation logic: score each live experience against the choices
var FEELW={explore:{c:['Treks','Wildlife & Nature'],a:['trek','nature','waterfall','cave']},challenge:{c:['Treks'],a:['trek','climbing','skills']},slow:{c:['Village Life','Camping & Overnight'],a:['village','campfire','sunset','water']},learn:{c:['Schools & Camps','Wildlife & Nature'],a:['nature','stars','farming','skills','sustain']},together:{c:['Corporate & Private Groups','Family & Kids'],a:['games','food','campfire']},village:{c:['Village Life'],a:['village','farming','food']},lookup:{c:['Stargazing','Evenings'],a:['stars','nightwalk','sunset']},kids:{c:['Family & Kids'],a:['water','games','nature']}};
function month(){var m=-1;if(S.when==='date'&&S.date)m=new Date(S.date).getMonth();else if(S.when==='month'&&S.month){if(/^Monsoon/.test(S.month))m=7;else if(/^Winter/.test(S.month))m=0;else m=MONTHS.indexOf(S.month.split(' ')[0])}return m<0?new Date().getMonth():m}
function score(e){
  var s=0,i,c=e.c;function hc(x){return c.indexOf(x)>-1}
  S.acts.forEach(function(a){if(e.a.indexOf(a)>-1)s+=3});
  S.feel.forEach(function(f){var w=FEELW[f];if(!w)return;w.c.forEach(function(x){if(hc(x))s+=2});w.a.forEach(function(x){if(e.a.indexOf(x)>-1)s+=1})});
  if((has('who','children')||has('who','family'))&&hc('Family & Kids'))s+=2;
  if(has('who','school')&&(hc('Schools & Camps')||hc('Family & Kids')))s+=2;
  if((has('who','corporate')||has('who','college'))&&hc('Corporate & Private Groups'))s+=2;
  if(!(has('who','children')||has('who','family')||has('who','school'))&&e.hi<=17)s-=8;
  for(i=0;i<S.ages.length;i++){var r=AGEN[S.ages[i]];if(r&&(r[1]<e.lo||r[0]>e.hi)){s-=4;break}}
  var t=S.time,L=e.len;
  if(t==='hours'){s+=L==='short'?2:L==='night'?-8:-1}
  if(t==='half'){s+=L==='short'?2:L==='night'?-8:0}
  if(t==='full'){s+=L==='day'?2:L==='short'?1:-8}
  if(t==='night'||t==='weekend'){s+=L==='night'?3:0}
  if(S.local.length&&(hc('Village Life')||e.a.indexOf('village')>-1))s+=1;
  if(has('local','meal')&&e.a.indexOf('food')>-1)s+=1;
  if(hc('Monsoon')||/^monsoon/i.test(e.t)){var m=month();if(m<5||m>8)s-=4}
  if(e.up)s+=1;
  return s;
}
function recs(){return D.exps.map(function(e){return{e:e,s:score(e)}}).filter(function(x){return x.s>=4}).sort(function(a,b){return b.s-a.s}).slice(0,3).map(function(x){return x.e})}

// example flow, built from the chosen time, pace, activities and local layer
function flow(){
  var pace=S.pace==='decide'||!S.pace?'balanced':S.pace,per={slow:2,balanced:3,active:4}[pace];
  var day=[],eve=[],night=[],stay=0;
  S.acts.forEach(function(a){var x=ACT[a];if(!x)return;if(x.kind==='night')night.push(x.label);else if(x.kind==='evening')eve.push(x.label);else if(x.kind==='stay')stay=1;else if(x.kind==='day')day.push(x.label+(x.dur?' ('+x.dur+')':''))});
  if(has('feel','lookup')&&!night.length&&ACT.stars)night.push(ACT.stars.label);
  var loc=[];if(has('local','hosts'))loc.push('Time with local hosts');if(has('local','farming')&&S.acts.indexOf('farming')<0)loc.push('Learning about farming');if(has('local','tradition'))loc.push('Something traditionally done here');if(has('local','stories'))loc.push('Stories about the place');if(has('local','suggest'))loc.push('A local moment we pick for you');
  day=day.concat(loc);
  if(!day.length)day=['Nature exploration','Something we choose for you'];
  var meal=has('local','meal')||S.acts.indexOf('food')>-1?'Lunch, cooked locally':'Lunch';
  var dinner=has('local','meal')||S.acts.indexOf('food')>-1?'Dinner, cooked locally':'Dinner';
  var q=day.slice(0,per+1),take=function(f){return q.length?q.shift():f};
  var dark=night.length>0,F=[],t=S.time||'flex';
  function add(time,what,d){F.push([time,what,d||''])}
  if(t==='hours'){
    if(dark||eve.length){add('16:00','Arrive');add('16:30',take('A short walk'));add('18:00',eve[0]||'Sunset');add('18:45',night[0]||take('Something we choose for you'));if(has('local','meal'))add('19:45','Dinner, cooked locally');add('20:30','Head home')}
    else{add('07:00','Arrive');add('07:30',take('A short walk'));if(pace!=='slow')add('09:00',take('Something we choose for you'));add('10:30','Head home')}
  }else if(t==='half'){
    if(dark){add('15:00','Arrive');add('15:30',take('A short walk'));if(pace!=='slow')add('16:45',take('Something we choose for you'));add('18:00',eve[0]||'Sunset');add('19:00',night[0]);if(has('local','meal'))add('20:15','Dinner, cooked locally');add('21:00','Head home')}
    else{add('08:00','Arrive');add('08:30',take('Nature exploration'));add('10:30',take('Something we choose for you'));if(pace==='active')add('11:45',take('One more thing'));add('13:00',has('local','meal')?'Lunch, cooked locally, then head home':'Head home')}
  }else if(t==='night'||t==='weekend'){
    var D1=t==='weekend'?'Day 1':'',D2='Day 2';
    if(t==='weekend'){add('09:00','Arrive',D1);add('09:30',take('Nature exploration'),D1);add('13:00',meal,D1);add('14:30',pace==='slow'?'Free time and rest':take('Something we choose for you'),D1)}
    else{add('15:00','Arrive',D1||'Day 1');add('15:30',take('Nature exploration'),'Day 1')}
    var d1=t==='weekend'?'Day 1':'Day 1';
    add('17:30',eve[0]||'Sunset',d1);add('19:30',dinner,d1);add('20:30',night.length?night.join(' and '):'Campfire and stories',d1);add('22:00',stay||has('local','stay')?(has('local','stay')?'Sleep in or near the village':'Sleep in tents'):'Sleep',d1);
    add('06:30','Sunrise and a slow morning',D2);add('08:30','Breakfast',D2);add('09:30',take(pace==='slow'?'Free time by the water':'One more thing'),D2);if(t==='weekend'&&pace!=='slow')add('11:30',take('Something we choose for you'),D2);add(t==='weekend'?'13:00':'11:30',t==='weekend'?meal+', then head home':'Head home',D2);
  }else{
    add('09:00','Arrive');add('09:30',take('Nature exploration'));add('11:30',take('Something we choose for you'));add('13:00',meal);
    add('14:30',pace==='slow'?'Free time, rest by the water':take('Free time and rest'));
    if(pace==='active')add('16:00',take('One more thing'));else if(pace==='balanced'&&q.length)add('16:00',take(''));
    add('18:00',eve[0]||'Sunset');if(dark){add('19:00',night.join(' and '));add('21:00','Head home')}else add('19:00','Head home');
  }
  return F;
}

function whoText(){var w=labs(WHO,S.who).join(' and ');return (S.n?S.n+(S.n===1?' person':' people'):'')+(w?(S.n?', ':'')+w.toLowerCase():'')+(S.ages.length?' (children '+labs(AGES,S.ages).join(', ').toLowerCase()+')':'')}
function whenText(){if(S.when==='date'&&S.date){var d=new Date(S.date);return d.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}if(S.when==='month'&&S.month)return S.month;return 'Flexible'}
function rows(){return [['Who',whoText()||'Not sure yet'],['Looking for',labs(FEEL,S.feel).join(' + ')||'Open to ideas'],['Leave feeling',labs(LEAVE,S.leave).join(' + ')||'We’ll see'],['Time',(function(){var a=S.time&&S.time!=='flex'?lab(TIME,S.time):'',w=whenText();return a?a+', '+(w==='Flexible'?'flexible on dates':w):(w==='Flexible'?'Flexible':'Flexible on length, '+w)})()],['Doing',S.acts.map(function(a){return ACT[a]?ACT[a].label+(ACT[a].dur?' ('+ACT[a].dur+')':''):a}).join(', ')||'Your call'],['Local layer',labs(LOCAL,S.local).join(', ')||'Not this time'],['Pace',lab(PACE,S.pace)||'Balanced']]}
function rupees(n){return '₹'+Number(n).toLocaleString('en-IN')}
function summaryText(R,F){
  var t='Hi Rock & Anchor, I used Curate on your website. Here’s what we’re imagining:\n\n'+rows().map(function(r){return r[0]+': '+r[1]}).join('\n');
  t+='\n\nAn example of how the day could go:\n'+F.map(function(f){return (f[2]?f[2]+', ':'')+f[0]+'  '+f[1]}).join('\n');
  if(R.length)t+='\n\nExperiences the page suggested: '+R.map(function(e){return e.t}).join(', ');
  return t+'\n\nMy choices: '+link();
}
function summaryHtml(){
  var R=recs(),F=flow(),txt=summaryText(R,F);
  var x='<p class="cu-q-k">Your idea</p><h2 class="cu-q">Here’s what we’re imagining.</h2>';
  x+='<dl class="cu-sum">'+rows().map(function(r){return '<div><dt>'+h(r[0])+'</dt><dd>'+h(r[1])+'</dd></div>'}).join('')+'</dl>';
  var days={};F.forEach(function(f){var k=f[2]||'';(days[k]=days[k]||[]).push(f)});
  x+='<div class="cu-flow"><h3>An example of how we could shape your day</h3><p class="cu-hint">This is a sketch from your choices, not a confirmed plan. We shape the real one with you.</p>'+Object.keys(days).map(function(k){return (k?'<p class="cu-day">'+h(k)+'</p>':'')+'<ol class="cu-tl">'+days[k].map(function(f){return '<li><time>'+h(f[0])+'</time><span>'+h(f[1])+'</span></li>'}).join('')+'</ol>'}).join('')+'</div>';
  x+='<div class="cu-recs"><h3>Based on what you told us, you might enjoy…</h3>';
  if(R.length){x+='<div class="grid cu-rgrid">'+R.map(function(e){return '<a class="card" href="/experiences/'+h(e.s)+'"><div class="ph">'+(e.img?'<img src="'+h(e.img)+'" alt="'+h(e.t)+'" loading="lazy">':'')+'</div><div class="body"><span class="cat">'+h(e.c.slice(0,2).join(' · '))+'</span><h3>'+h(e.t)+'</h3><p>'+h(e.d)+'</p><span class="cu-price">'+(e.min?'From '+rupees(e.min)+(e.grp?' per group':' per person'):'Price on request')+'</span></div></a>'}).join('')+'</div><p class="cu-hint">We can run any of these privately for your group, or combine parts of them.</p>'}
  else x+='<p class="cu-none">We’ll build something around what you told us.</p>';
  x+='</div>';
  var pp=R.filter(function(e){return e.min&&!e.grp}).map(function(e){return e.min});
  x+='<div class="cu-cost"><h3>What it might cost</h3>'+(pp.length?'<p>Experiences like this usually start from <b>'+rupees(Math.min.apply(null,pp))+' per person</b>. This is indicative only.</p>':'')+'<p>We’ll work out the exact cost once we know the group and date.</p></div>';
  x+='<div class="cu-hand"><p class="cu-ing">You have given us the ingredients.<br>We’ll help you turn them into an experience.</p><p>Someone from Rock &amp; Anchor will look at what you have chosen and get back to you.</p>';
  x+='<a class="btn btn-clay cu-send" href="https://wa.me/'+D.wa+'?text='+encodeURIComponent(txt)+'" target="_blank" rel="noopener">Send this to Rock &amp; Anchor</a>';
  x+='<p class="cu-hint">Opens WhatsApp with your idea already written. Or call us on '+h(D.phone)+'.</p></div>';
  x+='<div class="cu-share"><h3>Share this idea with your group</h3><div class="cu-share-b"><a class="btn btn-ghost" href="https://wa.me/?text='+encodeURIComponent('Here’s an idea for our trip with Rock & Anchor:\n\n'+rows().map(function(r){return r[0]+': '+r[1]}).join('\n')+'\n\nSee it here: '+link())+'" target="_blank" rel="noopener">Share on WhatsApp</a><button type="button" class="btn btn-ghost" data-copy="text">Copy summary</button><button type="button" class="btn btn-ghost" data-copy="link">Copy link</button></div><p class="cu-copied" aria-live="polite"></p></div>';
  x+='<div class="cu-edit"><button type="button" class="cu-link" data-go="0">Change my answers</button><button type="button" class="cu-link" data-reset>Start again</button></div>';
  root._txt=txt;return x;
}

function render(focus){
  save();
  if(S.step<0){root.innerHTML='<div class="cu-intro"><p class="cu-q-k">How this works</p><h2 class="cu-q">Eight quick questions. Then we put it together.</h2><ol class="cu-how"><li><b>You choose.</b> Who, what, how long, how fast.</li><li><b>We sketch it.</b> An example day and experiences that fit.</li><li><b>We talk.</b> Someone from our team shapes it with you.</li></ol><button type="button" class="btn btn-clay" data-next>Start curating</button></div>';return}
  if(S.step>=STEPS.length){root.innerHTML='<div class="cu-done">'+summaryHtml()+'</div>';if(focus)root.querySelector('.cu-q').focus();return}
  root.innerHTML=progress()+'<div class="cu-step">'+stepHtml()+'</div><div class="cu-bar"><button type="button" class="btn btn-ghost cu-back" data-back>'+(S.step?'Back':'Back to start')+'</button><button type="button" class="btn btn-clay cu-next" data-next'+(canNext()?'':' disabled')+'>'+nextLabel()+'</button></div>'+(STEPS[S.step][0]==='who'&&!canNext()?'<p class="cu-need">Pick who is coming and how many people to continue.</p>':'');
  if(focus){var q=root.querySelector('.cu-q');if(q){q.setAttribute('tabindex','-1');q.focus({preventScroll:true})}var top=document.getElementById('curate').getBoundingClientRect().top+window.scrollY-70;if(Math.abs(window.scrollY-top)>40)window.scrollTo({top:top,behavior:'smooth'})}
}
function bigNote(){var w=root.querySelector('.cu-num'),n=root.querySelector('.cu-note');if(!w)return;if(S.n>40&&!n){n=document.createElement('p');n.className='cu-note';n.textContent='A big group. We will plan this one with you directly, and may split it into smaller groups on the trail.';w.insertAdjacentElement('afterend',n)}else if(S.n<=40&&n)n.remove()}
function refreshBar(){var b=root.querySelector('.cu-next');if(b){b.disabled=!canNext();b.textContent=nextLabel()}var n=root.querySelector('.cu-need');if(n&&canNext())n.remove()}
root.addEventListener('click',function(ev){
  var b=ev.target.closest('button,a');if(!b||!root.contains(b))return;
  if(b.dataset.k){var k=b.dataset.k,v=b.dataset.v;if(b.dataset.one){S[k]=S[k]===v?'':v}else tog(k,v);
    if(k==='who'&&!(has('who','children')||has('who','school')||has('who','family')))S.ages=[];
    if(k==='when'||k==='who'||k==='time'){render();return}
    b.classList.toggle('on');b.setAttribute('aria-pressed',b.classList.contains('on'));if(b.dataset.one){root.querySelectorAll('[data-k="'+k+'"]').forEach(function(o){if(o!==b){o.classList.remove('on');o.setAttribute('aria-pressed','false')}})}save();refreshBar();return}
  if(b.dataset.n){S.n=Math.max(0,Math.min(999,(+S.n||0)+(+b.dataset.n)));var i=root.querySelector('#cu-n');if(i)i.value=S.n||'';save();refreshBar();bigNote();return}
  if(b.hasAttribute('data-next')){if(S.step>=0&&!canNext())return;S.step++;render(1);return}
  if(b.hasAttribute('data-back')){S.step--;render(1);return}
  if(b.dataset.go){S.step=+b.dataset.go;render(1);return}
  if(b.hasAttribute('data-reset')){S={step:0,who:[],n:0,ages:[],feel:[],leave:[],time:'',when:'',date:'',month:'',acts:[],local:[],pace:'',ok:0};render(1);return}
  if(b.dataset.copy){var t=b.dataset.copy==='link'?link():root._txt,msg=root.querySelector('.cu-copied');var done=function(){if(msg)msg.textContent=b.dataset.copy==='link'?'Link copied.':'Summary copied.'};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(done,function(){fallback(t);done()});else{fallback(t);done()}}
});
function fallback(t){var a=document.createElement('textarea');a.value=t;a.setAttribute('readonly','');a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove()}
root.addEventListener('input',function(ev){if(ev.target.id==='cu-n'){var v=parseInt(ev.target.value,10);S.n=isNaN(v)?0:Math.max(0,Math.min(999,v));save();refreshBar();bigNote()}if(ev.target.id==='cu-date'){S.date=ev.target.value;save()}});
document.querySelectorAll('[data-start]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();if(S.step<0)S.step=0;render(1)})});
load();render();
})();`;

const CURATE_CSS = `
.cu-hero{position:relative;min-height:clamp(460px,72vh,660px);display:flex;align-items:flex-end;color:#fff;background:var(--night);overflow:hidden}
.cu-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cu-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(12,16,22,.72) 0%,rgba(12,16,22,.45) 45%,rgba(12,16,22,.05) 75%),linear-gradient(180deg,rgba(12,16,22,.25) 0%,rgba(12,16,22,0) 40%,rgba(12,16,22,.55) 100%)}
@media(max-width:720px){.cu-hero:after{background:linear-gradient(180deg,rgba(12,16,22,.35) 0%,rgba(12,16,22,.55) 45%,rgba(12,16,22,.85) 100%)}}
.cu-hero .wrap{position:relative;z-index:2;padding-bottom:clamp(44px,8vh,88px);width:100%}
.cu-kicker,.cu-q-k{font:700 13px/1.4 "DM Sans",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--clay);margin:0 0 14px}
.cu-hero .cu-kicker{color:#f7d2b2;text-shadow:0 1px 8px rgba(0,0,0,.6)}
.cu-hero h1{font-size:clamp(42px,6.6vw,88px);max-width:15ch;margin:0 0 .3em;text-shadow:0 2px 20px rgba(0,0,0,.35)}
.cu-sub{font-size:clamp(17px,1.9vw,21px);max-width:52ch;margin:0 0 14px;color:#f2ede6;text-shadow:0 1px 10px rgba(0,0,0,.5)}
.cu-bring{margin:0 0 26px;color:#f3c9a6;font-size:clamp(16px,1.7vw,19px);text-shadow:0 1px 8px rgba(0,0,0,.6)}.cu-bring b{color:#fff}
.cu-app{background:#efe7da;padding:clamp(44px,7vw,90px) 0;min-height:70vh;scroll-margin-top:60px}
.cu-app .wrap{max-width:980px}
#cu-root{background:var(--card);border:1px solid var(--line);border-radius:24px;padding:clamp(20px,4vw,48px);box-shadow:0 30px 60px -40px rgba(34,29,25,.35)}
.cu-q{font-size:clamp(30px,4.4vw,52px);margin:0 0 10px;max-width:22ch;outline:none}
.cu-hint{color:var(--muted);font-size:15.5px;margin:0 0 18px}.cu-hint a{color:var(--clay);font-weight:700}
.cu-lead{font-size:clamp(19px,2.2vw,24px);font-weight:500;max-width:40ch;margin:6px 0 18px}
.cu-prog{height:6px;border-radius:999px;background:var(--line);overflow:hidden;margin:0 0 12px}
.cu-prog-bar{height:100%;background:var(--forest);border-radius:999px;transition:width .35s ease}
.cu-dots{list-style:none;display:flex;gap:8px;padding:0;margin:0 0 28px;flex-wrap:wrap}
.cu-dots button{width:32px;height:32px;border-radius:50%;border:1.5px solid var(--line);background:var(--paper);font:700 13px "DM Sans",sans-serif;color:var(--muted);cursor:pointer}
.cu-dots .done button{background:var(--moss);border-color:var(--moss);color:var(--forest)}
.cu-dots .now button{background:var(--forest);border-color:var(--forest);color:#fff}
.cu-dots button:disabled{cursor:default;opacity:.6}
.cu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px;margin:0 0 8px}
.cu-grid-s{grid-template-columns:repeat(auto-fill,minmax(160px,1fr))}
.cu-grid-2{grid-template-columns:repeat(2,minmax(0,1fr))}
.cu-grid-3{grid-template-columns:repeat(3,minmax(0,1fr))}
.cu-grid-m{grid-template-columns:repeat(auto-fill,minmax(110px,1fr));margin-top:12px}
.cu-grid-img{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}
.cu-opt{position:relative;text-align:left;display:flex;flex-direction:column;gap:6px;min-height:64px;padding:16px 46px 16px 18px;border-radius:16px;border:2px solid var(--line);background:var(--paper);color:var(--ink);cursor:pointer;font:inherit;transition:border-color .15s,background .15s,transform .1s;-webkit-tap-highlight-color:transparent}
.cu-opt:hover{border-color:#cdbfa9}.cu-opt:active{transform:scale(.98)}
.cu-opt:focus-visible{outline:3px solid var(--clay);outline-offset:2px}
.cu-opt-t{font-weight:700;font-size:18px;line-height:1.2}
.cu-grid-2 .cu-opt-t,.cu-grid-3 .cu-opt-t,.cu-grid:not(.cu-grid-s):not(.cu-grid-m):not(.cu-grid-img) .cu-opt-t{font:800 24px/1.05 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;letter-spacing:.02em}
.cu-opt-l{color:var(--ink2);font-size:15px;line-height:1.4}
.cu-tick{position:absolute;top:14px;right:14px;width:24px;height:24px;border-radius:50%;border:2px solid var(--line);background:#fff}
.cu-opt.on{border-color:var(--forest);background:var(--moss)}
.cu-opt.on .cu-tick{background:var(--forest);border-color:var(--forest)}
.cu-opt.on .cu-tick:after{content:"";position:absolute;left:7px;top:3px;width:6px;height:11px;border:solid #fff;border-width:0 2.5px 2.5px 0;transform:rotate(45deg)}
.cu-grid-m .cu-opt{min-height:48px;padding:12px 14px;align-items:center;text-align:center}.cu-grid-m .cu-tick{display:none}.cu-grid-m .cu-opt-t{font-size:15px}
.cu-opt.img{padding:0 0 14px;overflow:hidden}.cu-opt.img .cu-opt-t,.cu-opt.img .cu-opt-l{padding:0 46px 0 16px}
.cu-opt-ph{display:block;aspect-ratio:16/10;background:#d8d0c3 center/cover;margin-bottom:6px}.cu-ph-empty{background:linear-gradient(135deg,var(--moss),#d9e4d4)}
.cu-opt.img .cu-tick{top:auto;bottom:14px}
.cu-opt.img.on .cu-opt-ph{box-shadow:inset 0 0 0 4px var(--forest)}
.cu-sub2{margin-top:30px;padding-top:24px;border-top:1px solid var(--line)}
.cu-sub2 h3{font-size:clamp(24px,2.8vw,32px);margin:0 0 8px}
.cu-num{display:inline-flex;align-items:center;border:2px solid var(--line);border-radius:999px;background:var(--paper);overflow:hidden}
.cu-nb{width:56px;height:56px;border:0;background:transparent;font-size:28px;cursor:pointer;color:var(--forest)}
.cu-num input{width:90px;height:56px;border:0;background:transparent;text-align:center;font:800 28px "DM Sans",sans-serif;color:var(--ink);-moz-appearance:textfield}
.cu-num input::-webkit-outer-spin-button,.cu-num input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.cu-note{margin:12px 0 0;color:var(--clay2);font-size:15px}
.cu-date{margin-top:14px;font:600 18px "DM Sans",sans-serif;padding:12px 16px;border-radius:14px;border:2px solid var(--line);background:var(--paper);color:var(--ink);min-height:52px}
.cu-care{list-style:none;padding:0;margin:0 0 14px;display:grid;gap:10px}
.cu-care li{font:800 clamp(24px,3vw,34px)/1.1 "Big Shoulders Display","Arial Narrow",sans-serif;padding:12px 0;border-bottom:1px solid var(--line);color:var(--forest)}
.cu-bar{display:flex;justify-content:space-between;gap:12px;margin-top:30px;padding-top:20px;border-top:1px solid var(--line)}
.cu-bar .btn{min-height:52px;justify-content:center}
.cu-next:disabled{opacity:.45;cursor:not-allowed}
.cu-need{margin:10px 0 0;text-align:right;color:var(--muted);font-size:14.5px}
.cu-intro{text-align:left}.cu-how{list-style:none;padding:0;margin:10px 0 28px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;counter-reset:h}
.cu-how li{counter-increment:h;background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:18px;color:var(--ink2)}
.cu-how li:before{content:counter(h);display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--forest);color:#fff;font-weight:800;margin-bottom:10px}
.cu-how b{display:block;color:var(--ink);font-size:18px}
.cu-sum{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:0 28px;margin:16px 0 30px}
.cu-sum div{padding:14px 0;border-top:1px solid var(--line)}
.cu-sum dt{font:700 12px/1 "DM Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--clay);margin-bottom:6px}
.cu-sum dd{margin:0;font-weight:600;font-size:17px}
.cu-flow,.cu-recs,.cu-cost,.cu-share{margin-top:34px}
.cu-flow{background:var(--paper);border:1px solid var(--line);border-radius:20px;padding:clamp(18px,3vw,30px)}
.cu-flow h3,.cu-recs h3,.cu-cost h3,.cu-share h3{font-size:clamp(24px,2.8vw,32px);margin:0 0 6px}
.cu-day{font:700 12px/1 "DM Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--clay);margin:18px 0 6px}
.cu-tl{list-style:none;padding:0;margin:0;position:relative}
.cu-tl li{display:grid;grid-template-columns:70px 1fr;gap:14px;padding:10px 0;border-bottom:1px dashed var(--line)}
.cu-tl li:last-child{border-bottom:0}
.cu-tl time{font:800 20px/1.2 "Big Shoulders Display","Arial Narrow",sans-serif;color:var(--forest)}
.cu-tl span{font-weight:600}
.cu-rgrid{grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin:16px 0 10px}
.cu-rgrid .card h3{font-size:24px}.cu-price{font-weight:700;color:var(--clay);font-size:15px;margin-top:auto}
.cu-none{font-weight:700;font-size:19px;color:var(--forest)}
.cu-cost p{margin:0 0 6px;color:var(--ink2)}
.cu-hand{margin-top:34px;background:var(--forest);color:#fff;border-radius:22px;padding:clamp(22px,4vw,40px)}
.cu-ing{font:800 clamp(28px,3.6vw,42px)/1.1 "Big Shoulders Display","Arial Narrow",sans-serif;margin:0 0 12px}
.cu-hand p{color:#dfe8e1}.cu-hand .cu-hint{color:#b9cbbd;margin:12px 0 0}
.cu-send{margin-top:8px;min-height:56px;font-size:17px}
.cu-share-b{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}.cu-share-b .btn{min-height:48px;color:var(--ink)}
.cu-copied{min-height:1.4em;color:var(--forest);font-weight:700;margin:10px 0 0}
.cu-edit{display:flex;gap:18px;margin-top:26px;padding-top:18px;border-top:1px solid var(--line)}
.cu-link{background:none;border:0;padding:0;font:700 15px "DM Sans",sans-serif;color:var(--clay);cursor:pointer;text-decoration:underline}
@media(max-width:720px){
body:has(.cu) .float-wa{bottom:96px}
#cu-root{border-radius:18px;padding:20px 16px 0}
.cu-grid,.cu-grid-s,.cu-grid-img{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.cu-grid:not(.cu-grid-s):not(.cu-grid-m):not(.cu-grid-img),.cu-grid-2,.cu-grid-3{grid-template-columns:1fr}
.cu-grid-m{grid-template-columns:repeat(3,minmax(0,1fr))}
.cu-opt{padding:14px 40px 14px 14px}.cu-opt-t{font-size:16px}.cu-opt.img .cu-opt-t,.cu-opt.img .cu-opt-l{padding:0 36px 0 12px}.cu-opt.img .cu-opt-l{font-size:13.5px}
.cu-tick{top:12px;right:12px;width:22px;height:22px}.cu-opt.on .cu-tick:after{left:6px;top:2px}
.cu-bar{position:sticky;bottom:0;background:var(--card);margin:24px -16px 0;padding:12px 16px calc(12px + env(safe-area-inset-bottom));box-shadow:0 -10px 20px -16px rgba(0,0,0,.4);z-index:5}
.cu-bar .btn{flex:1;padding:14px 12px}
.cu-need{text-align:center;padding-bottom:12px}
.cu-how{grid-template-columns:1fr}
.cu-done{padding-bottom:20px}.cu-intro{padding-bottom:20px}
.cu-tl li{grid-template-columns:58px 1fr}
.cu-share-b .btn{flex:1 1 45%;justify-content:center}
}
`;


// ---------- Post-training quiz (staging only) ----------
// Source: "12 Post-Training Quizzes DRAFT" (Foundation Training 15 to 17 Oct 2026). English is the draft text.
// Hindi and Marathi were translated for this page and need review by a native speaker before wide use.
// Rules: one attempt per phone number per quiz, timed, answers locked once chosen, the right answer and
// the "why" are only sent after an answer is saved. Attempts are stored in the Airtable table Quiz Attempts.

const QUIZ_MINUTES = 20;
const QUIZ_TRAINER_WA = '919167954430';
// Last moment a new quiz can be started (end of 23 Oct 2026, IST). Attempts already running may finish their time.
const QUIZ_CLOSES = Date.parse('2026-10-24T00:00:00+05:30');
const QA = { table: 'tblcpS9xrANciDtX3', title: 'flddA6DbDLq4uFUbN', name: 'flddhZkbDazlbfXj0', phone: 'fldUgyatJUUzzXZZh', quiz: 'fld7eGC76O3J27Rna',
  lang: 'fldsNoVDncBxfJSb7', status: 'fldezGeH8ZpR8db81', started: 'fldNytmuEeH4531ue', finished: 'fldMbMed8Qd9a3oiX', score: 'fldId9N8406tucnEu',
  outOf: 'fldSep8K62wOugR8k', starMissed: 'fld4n9uPmFFppmROQ', needsCall: 'fldXUhDgDEAS4mSJQ', answers: 'fldfZkAbJVV9z6uLR', data: 'fldADZQqxH1XVpoQF', key: 'fldmnvl2YAp3hJDeg' };
const QUIZ_LANGS = { en: 'English', hi: 'Hindi', mr: 'Marathi' };

// Each question: star (safety critical), ans (0 to 3, index into the English option order), src, and text per language.
const QUIZZES = {
  1: {
    name: 'Quiz 1: Keeping People Safe',
    title: { en: 'Quiz 1: Keeping People Safe', hi: 'क्विज़ 1: लोगों को सुरक्षित रखना', mr: 'क्विझ 1: लोकांना सुरक्षित ठेवणे' },
    read: { en: 'Read Modules 5, 6, 7 and 16 first.', hi: 'पहले मॉड्यूल 5, 6, 7 और 16 पढ़ें।', mr: 'आधी मॉड्यूल 5, 6, 7 आणि 16 वाचा.' },
    task: {
      en: 'Send your trainer a 1-minute voice note: "The Rock & Anchor emergency number is ____. The ambulance number is ____. On my next trek, before we start, I will ____."',
      hi: 'अपने ट्रेनर को 1 मिनट का वॉइस नोट भेजें: "Rock & Anchor का इमरजेंसी नंबर ____ है। एम्बुलेंस का नंबर ____ है। अगले ट्रेक पर, शुरू करने से पहले, मैं ____ करूँगा/करूँगी।"',
      mr: 'तुमच्या ट्रेनरला 1 मिनिटाची व्हॉइस नोट पाठवा: "Rock & Anchor चा इमर्जन्सी नंबर ____ आहे. ॲम्ब्युलन्सचा नंबर ____ आहे. पुढच्या ट्रेकवर, सुरुवात करण्यापूर्वी, मी ____ करेन."',
    },
    qs: [
      { star: 1, ans: 1, src: '5.3',
        en: { q: 'You see lightning and count 20 seconds before you hear thunder. What does this mean?', o: ['The storm is 20 km away. There is time to reach the summit.', 'The storm is about 4 km away. Act immediately.', 'The storm is about 10 km away. Keep watching.', 'Thunder does not tell you anything about distance.'], why: 'Divide the seconds by 5 to get the distance in km. 20 ÷ 5 = 4 km. Under 6 km (under 30 seconds) means act immediately.' },
        hi: { q: 'आपको बिजली दिखती है और गड़गड़ाहट सुनाई देने तक आप 20 सेकंड गिनते हैं। इसका क्या मतलब है?', o: ['तूफ़ान 20 किमी दूर है। चोटी तक पहुँचने का समय है।', 'तूफ़ान लगभग 4 किमी दूर है। तुरंत कदम उठाएँ।', 'तूफ़ान लगभग 10 किमी दूर है। नज़र रखते रहें।', 'गड़गड़ाहट से दूरी के बारे में कुछ पता नहीं चलता।'], why: 'सेकंड को 5 से भाग दें, तो दूरी किमी में मिलती है। 20 ÷ 5 = 4 किमी। 6 किमी से कम (30 सेकंड से कम) का मतलब है तुरंत कदम उठाएँ।' },
        mr: { q: 'तुम्हाला वीज दिसते आणि गडगडाट ऐकू येईपर्यंत तुम्ही 20 सेकंद मोजता. याचा अर्थ काय?', o: ['वादळ 20 किमी दूर आहे. शिखरावर पोहोचायला वेळ आहे.', 'वादळ सुमारे 4 किमी दूर आहे. लगेच कृती करा.', 'वादळ सुमारे 10 किमी दूर आहे. लक्ष ठेवत राहा.', 'गडगडाटावरून अंतराबद्दल काहीच कळत नाही.'], why: 'सेकंदांना 5 ने भागा, म्हणजे अंतर किमीमध्ये मिळते. 20 ÷ 5 = 4 किमी. 6 किमीपेक्षा कमी (30 सेकंदांपेक्षा कमी) म्हणजे लगेच कृती करा.' } },
      { star: 1, ans: 2, src: '5.3',
        en: { q: 'The group is caught on open ground in a lightning storm. What body position does the manual teach?', o: ['Lie flat on the ground.', 'Stand still under the nearest tall tree.', 'Crouch low, feet together, weight on the balls of the feet, hands on knees, head down.', 'Sit down and lean against a rock overhang.'], why: 'Lying flat increases contact with the ground. Lone trees and overhangs carry ground current.' },
        hi: { q: 'खुले मैदान में ग्रुप बिजली वाले तूफ़ान में फँस गया है। मैनुअल शरीर की कौन-सी स्थिति सिखाता है?', o: ['ज़मीन पर सीधे लेट जाएँ।', 'सबसे पास के ऊँचे पेड़ के नीचे स्थिर खड़े रहें।', 'नीचे झुककर बैठें, पैर आपस में मिलाकर, वज़न पंजों पर, हाथ घुटनों पर, सिर नीचे।', 'बैठ जाएँ और चट्टान के छज्जे के नीचे टिक जाएँ।'], why: 'लेटने से ज़मीन से संपर्क बढ़ता है। अकेले पेड़ और चट्टान के छज्जे ज़मीन का करंट ले आते हैं।' },
        mr: { q: 'मोकळ्या जागेवर ग्रुप विजेच्या वादळात अडकला आहे. मॅन्युअल शरीराची कोणती स्थिती शिकवते?', o: ['जमिनीवर सरळ झोपा.', 'जवळच्या उंच झाडाखाली स्थिर उभे राहा.', 'खाली वाकून बसा, पाय एकमेकांना जुळवून, वजन पायाच्या चवड्यांवर, हात गुडघ्यांवर, डोके खाली.', 'खाली बसा आणि खडकाच्या छज्ज्याखाली टेकून बसा.'], why: 'झोपल्याने जमिनीशी संपर्क वाढतो. एकटे झाड आणि खडकाचे छज्जे जमिनीतील करंट वाहून आणतात.' } },
      { star: 0, ans: 1, src: '5.3',
        en: { q: 'When the group moves off a ridge during lightning, how far apart should people spread out, and why?', o: ['2 metres, so nobody gets lost.', 'At least 10 metres, so one strike cannot injure several people.', 'Stay close together, so the leader can count everyone.', 'Distance does not matter.'], why: 'Spreading out prevents multiple casualties from one strike.' },
        hi: { q: 'बिजली के समय जब ग्रुप पहाड़ की धार से नीचे उतरता है, तो लोगों को एक-दूसरे से कितनी दूरी पर फैलना चाहिए, और क्यों?', o: ['2 मीटर, ताकि कोई खो न जाए।', 'कम से कम 10 मीटर, ताकि एक बार बिजली गिरने से कई लोग घायल न हों।', 'पास-पास रहें, ताकि लीडर सबको गिन सके।', 'दूरी से कोई फ़र्क नहीं पड़ता।'], why: 'फैलकर चलने से एक ही बिजली से कई लोग घायल नहीं होते।' },
        mr: { q: 'विजा चमकत असताना ग्रुप धारेवरून खाली उतरतो, तेव्हा लोकांनी एकमेकांपासून किती अंतर ठेवावे, आणि का?', o: ['2 मीटर, म्हणजे कोणी हरवणार नाही.', 'किमान 10 मीटर, म्हणजे एकदा वीज पडल्याने अनेक लोक जखमी होणार नाहीत.', 'जवळजवळ राहा, म्हणजे लीडर सगळ्यांना मोजू शकेल.', 'अंतराने काही फरक पडत नाही.'], why: 'पसरून चालल्याने एकाच विजेमुळे अनेक जण जखमी होत नाहीत.' } },
      { star: 0, ans: 2, src: '5.3',
        en: { q: 'After the last thunder, how long do you wait before moving on exposed ground again?', o: ['5 minutes', '10 minutes', '30 full minutes', 'Until the rain stops'], why: '' },
        hi: { q: 'आख़िरी गड़गड़ाहट के बाद, खुली जगह पर फिर से चलने से पहले कितनी देर रुकते हैं?', o: ['5 मिनट', '10 मिनट', 'पूरे 30 मिनट', 'बारिश रुकने तक'], why: '' },
        mr: { q: 'शेवटच्या गडगडाटानंतर, मोकळ्या जागेवर पुन्हा चालायला सुरुवात करण्यापूर्वी किती वेळ थांबता?', o: ['5 मिनिटे', '10 मिनिटे', 'पूर्ण 30 मिनिटे', 'पाऊस थांबेपर्यंत'], why: '' } },
      { star: 0, ans: 1, src: '5.2',
        en: { q: 'What is the number one cause of injuries on Sahyadri treks?', o: ['Snake bites', 'Slippery basalt rock', 'Heat', 'Getting lost'], why: 'Stop the group before the section, point out the hazard, show foot placement, and walk beside unsteady participants.' },
        hi: { q: 'सह्याद्री ट्रेक पर चोट लगने का सबसे बड़ा कारण क्या है?', o: ['साँप का काटना', 'फिसलन वाली बेसाल्ट चट्टान', 'गर्मी', 'रास्ता भटक जाना'], why: 'उस हिस्से से पहले ग्रुप को रोकें, ख़तरा दिखाएँ, पैर कहाँ रखना है यह दिखाएँ, और जो लड़खड़ा रहे हैं उनके साथ-साथ चलें।' },
        mr: { q: 'सह्याद्रीतील ट्रेकवर दुखापत होण्याचे सगळ्यात मोठे कारण कोणते?', o: ['साप चावणे', 'निसरडा बेसाल्ट खडक', 'उष्णता', 'रस्ता चुकणे'], why: 'त्या भागाच्या आधी ग्रुप थांबवा, धोका दाखवा, पाय कुठे ठेवायचा ते दाखवा, आणि जे डगमगत आहेत त्यांच्या बाजूने चाला.' } },
      { star: 1, ans: 1, src: '5.4, 5.5, Scenario 9; Participant Handbook section 4',
        en: { q: 'You are at the back of the group as sweep. Dark clouds are building and you hear thunder. The Leader at the front has not noticed. What do you do?', o: ['Turn the group around yourself.', "Get the Leader's attention at once, tell them clearly what you heard and saw, then support the Leader's decision.", 'Wait and see if it gets worse.', 'Ask the group whether they want to continue.'], why: 'As a Co-Leader you notice early, speak up and support the decision. The turn-back decision is never a group vote.' },
        hi: { q: 'आप ग्रुप के सबसे पीछे स्वीप हैं। काले बादल घिर रहे हैं और आपको गड़गड़ाहट सुनाई देती है। आगे चल रहे लीडर ने ध्यान नहीं दिया है। आप क्या करेंगे?', o: ['खुद ही ग्रुप को वापस मोड़ दें।', 'तुरंत लीडर का ध्यान खींचें, साफ़-साफ़ बताएँ कि आपने क्या सुना और देखा, फिर लीडर के फ़ैसले का साथ दें।', 'रुककर देखें कि हालात और बिगड़ते हैं या नहीं।', 'ग्रुप से पूछें कि वे आगे जाना चाहते हैं या नहीं।'], why: 'को-लीडर के रूप में आप जल्दी नोटिस करते हैं, बोलते हैं और फ़ैसले का साथ देते हैं। वापस लौटने का फ़ैसला कभी भी ग्रुप की वोटिंग से नहीं होता।' },
        mr: { q: 'तुम्ही ग्रुपच्या सगळ्यात मागे स्वीप आहात. काळे ढग जमत आहेत आणि तुम्हाला गडगडाट ऐकू येतो. पुढे असलेल्या लीडरच्या लक्षात आलेले नाही. तुम्ही काय कराल?', o: ['स्वतःच ग्रुपला मागे वळवा.', 'लगेच लीडरचे लक्ष वेधा, तुम्ही काय ऐकले आणि पाहिले ते स्पष्ट सांगा, मग लीडरच्या निर्णयाला साथ द्या.', 'थांबून बघा, परिस्थिती आणखी बिघडते का.', 'ग्रुपला विचारा की त्यांना पुढे जायचे आहे का.'], why: 'को-लीडर म्हणून तुम्ही लवकर लक्षात घेता, बोलता आणि निर्णयाला साथ देता. मागे फिरण्याचा निर्णय कधीही ग्रुपच्या मतदानाने होत नाही.' } },
      { star: 1, ans: 2, src: '6.3, 2.3',
        en: { q: 'At a waterfall, what do two whistle blasts mean?', o: ['Someone is lost.', 'Lunch is ready.', 'Everyone out of the water immediately.', 'Swim to the rope.'], why: 'Do not confuse this with three blasts, the international distress signal: emergency, I need help.' },
        hi: { q: 'झरने पर, सीटी की दो आवाज़ों का क्या मतलब है?', o: ['कोई खो गया है।', 'खाना तैयार है।', 'सब लोग तुरंत पानी से बाहर निकलें।', 'रस्सी की ओर तैरें।'], why: 'इसे तीन सीटी से न मिलाएँ। तीन सीटी दुनिया भर में इमरजेंसी का संकेत है: मुझे मदद चाहिए।' },
        mr: { q: 'धबधब्यावर शिट्टीच्या दोन आवाजांचा अर्थ काय?', o: ['कोणी हरवले आहे.', 'जेवण तयार आहे.', 'सगळ्यांनी लगेच पाण्याबाहेर या.', 'दोरीकडे पोहत जा.'], why: 'हे तीन शिट्ट्यांशी गोंधळू नका. तीन शिट्ट्या हा जगभर वापरला जाणारा इमर्जन्सीचा संकेत आहे: मला मदत हवी आहे.' } },
      { star: 1, ans: 1, src: '6.3',
        en: { q: 'During swimming, what does raising one arm mean?', o: ['"I want to take a photo."', '"The current is pulling me."', '"I am getting out."', '"I am cold."'], why: '' },
        hi: { q: 'तैरते समय एक हाथ ऊपर उठाने का क्या मतलब है?', o: ['"मुझे फ़ोटो लेनी है।"', '"पानी का बहाव मुझे खींच रहा है।"', '"मैं बाहर निकल रहा हूँ।"', '"मुझे ठंड लग रही है।"'], why: '' },
        mr: { q: 'पोहताना एक हात वर करण्याचा अर्थ काय?', o: ['"मला फोटो काढायचा आहे."', '"पाण्याचा प्रवाह मला ओढत आहे."', '"मी बाहेर येत आहे."', '"मला थंडी वाजत आहे."'], why: '' } },
      { star: 1, ans: 2, src: '6.1, 6.2',
        en: { q: 'During the site check, you cannot clearly see the bottom of the pool. What is the rule?', o: ['Diving is fine if people are careful.', 'Only strong swimmers may jump.', 'No diving and no jumping. Period.', 'Jump only from low rocks.'], why: 'Underwater rocks are invisible from the surface.' },
        hi: { q: 'जगह की जाँच के दौरान आपको पानी के कुंड का तल साफ़ नहीं दिखता। नियम क्या है?', o: ['सावधानी रखें तो डाइव करना ठीक है।', 'सिर्फ़ अच्छे तैराक कूद सकते हैं।', 'न डाइविंग, न कूदना। बस।', 'सिर्फ़ नीची चट्टानों से कूदें।'], why: 'पानी के अंदर की चट्टानें ऊपर से दिखाई नहीं देतीं।' },
        mr: { q: 'जागेची तपासणी करताना तुम्हाला डोहाचा तळ स्पष्ट दिसत नाही. नियम काय आहे?', o: ['काळजी घेतली तर डाइव्ह करणे ठीक आहे.', 'फक्त चांगले पोहणारे उडी मारू शकतात.', 'डाइव्ह नाही आणि उडी नाही. बस्स.', 'फक्त कमी उंचीच्या खडकांवरून उडी मारा.'], why: 'पाण्याखालचे खडक वरून दिसत नाहीत.' } },
      { star: 0, ans: 1, src: '6.1',
        en: { q: 'In monsoon, how fast can the water level at a waterfall change?', o: ['Over a few days', 'In 10 to 15 minutes', 'Only overnight', 'It does not change during the day'], why: '' },
        hi: { q: 'मानसून में, झरने पर पानी का स्तर कितनी जल्दी बदल सकता है?', o: ['कुछ दिनों में', '10 से 15 मिनट में', 'सिर्फ़ रात भर में', 'दिन में नहीं बदलता'], why: '' },
        mr: { q: 'पावसाळ्यात धबधब्यावरील पाण्याची पातळी किती लवकर बदलू शकते?', o: ['काही दिवसांत', '10 ते 15 मिनिटांत', 'फक्त रात्रभरात', 'दिवसा बदलत नाही'], why: '' } },
      { star: 0, ans: 1, src: '6.1, 6.3, review question 34',
        en: { q: 'A participant says, "The water looks fine, I am a strong swimmer." What is the best response?', o: ['"Okay, you can go past the rope."', '"The surface looks calm, but near the waterfall the current is not. The safe area is the same for everyone today."', 'Say nothing and let them decide.', '"Ask the other participants."'], why: 'Swimmers overestimate their ability in moving water. A calm surface can hide a dangerous pull. If they keep pushing, bring in the Leader.' },
        hi: { q: 'एक प्रतिभागी कहता है, "पानी ठीक लग रहा है, मैं अच्छा तैराक हूँ।" सबसे अच्छा जवाब क्या है?', o: ['"ठीक है, आप रस्सी के आगे जा सकते हैं।"', '"ऊपर से पानी शांत दिखता है, लेकिन झरने के पास बहाव तेज़ है। आज सुरक्षित जगह सबके लिए एक ही है।"', 'कुछ न कहें और उन्हें खुद फ़ैसला करने दें।', '"बाकी प्रतिभागियों से पूछ लीजिए।"'], why: 'तैराक बहते पानी में अपनी क्षमता को ज़्यादा आँकते हैं। शांत सतह के नीचे ख़तरनाक खिंचाव छिपा हो सकता है। अगर वे ज़िद करें, तो लीडर को बुलाएँ।' },
        mr: { q: 'एक सहभागी म्हणतो, "पाणी ठीक दिसतंय, मी चांगला पोहणारा आहे." सगळ्यात चांगले उत्तर कोणते?', o: ['"ठीक आहे, तुम्ही दोरीच्या पुढे जाऊ शकता."', '"वरून पाणी शांत दिसतं, पण धबधब्याजवळ प्रवाह जोरात आहे. आज सुरक्षित जागा सगळ्यांसाठी एकच आहे."', 'काहीही बोलू नका, त्यांना ठरवू द्या.', '"इतर सहभागींना विचारा."'], why: 'पोहणारे वाहत्या पाण्यात स्वतःची क्षमता जास्त समजतात. शांत पृष्ठभागाखाली धोकादायक ओढ लपलेली असू शकते. ते हट्ट करत राहिले तर लीडरला बोलवा.' } },
      { star: 1, ans: 2, src: '7.4',
        en: { q: 'A participant has a deep cut. The cloth you are pressing on it is soaking through with blood. What do you do?', o: ['Lift the cloth to look at the wound.', 'Remove the cloth and put on a fresh one.', 'Keep firm pressure, add more cloth on top without lifting, and raise the limb.', 'Wash it with stream water and wait.'], why: 'Firm direct pressure for 10 to 15 minutes. Lifting the cloth restarts the bleeding. If it will not stop, it needs evacuation.' },
        hi: { q: 'एक प्रतिभागी को गहरा कट लगा है। जिस कपड़े से आप दबा रहे हैं, वह ख़ून से भीग रहा है। आप क्या करेंगे?', o: ['घाव देखने के लिए कपड़ा उठाएँ।', 'कपड़ा हटाकर नया कपड़ा लगाएँ।', 'मज़बूती से दबाए रखें, कपड़ा उठाए बिना ऊपर और कपड़ा रखें, और हाथ या पैर को ऊपर उठाएँ।', 'नाले के पानी से धोएँ और इंतज़ार करें।'], why: '10 से 15 मिनट तक सीधा, मज़बूत दबाव। कपड़ा उठाने से ख़ून फिर से बहने लगता है। अगर ख़ून न रुके, तो मरीज़ को बाहर ले जाना (इवैक्युएशन) ज़रूरी है।' },
        mr: { q: 'एका सहभागीला खोल जखम झाली आहे. तुम्ही ज्या कापडाने दाबत आहात ते रक्ताने भिजत आहे. तुम्ही काय कराल?', o: ['जखम पाहण्यासाठी कापड उचला.', 'कापड काढून नवीन कापड लावा.', 'घट्ट दाब कायम ठेवा, कापड न उचलता वर आणखी कापड ठेवा, आणि हात किंवा पाय वर उचला.', 'ओढ्याच्या पाण्याने धुवा आणि वाट पाहा.'], why: '10 ते 15 मिनिटे थेट, घट्ट दाब. कापड उचलल्याने रक्त पुन्हा वाहू लागते. रक्त थांबत नसेल तर रुग्णाला बाहेर नेणे (इव्हॅक्युएशन) आवश्यक आहे.' } },
      { star: 1, ans: 2, src: '7.7, 5.2',
        en: { q: 'Which of these needs IMMEDIATE evacuation?', o: ['High fever', 'Persistent vomiting', 'Snake bite', 'Cannot walk because of an ankle injury'], why: 'The other three are "evacuate soon". Snake bite is immediate: keep the person still, note the time, evacuate.' },
        hi: { q: 'इनमें से किसमें तुरंत इवैक्युएशन (मरीज़ को बाहर ले जाना) ज़रूरी है?', o: ['तेज़ बुख़ार', 'लगातार उल्टी', 'साँप का काटना', 'टखने की चोट के कारण चल नहीं पा रहा'], why: 'बाकी तीन में "जल्द बाहर ले जाएँ"। साँप के काटने पर तुरंत: व्यक्ति को स्थिर रखें, समय नोट करें, बाहर ले जाएँ।' },
        mr: { q: 'यापैकी कशासाठी लगेच इव्हॅक्युएशन (रुग्णाला बाहेर नेणे) आवश्यक आहे?', o: ['जास्त ताप', 'सतत उलट्या', 'साप चावणे', 'घोट्याच्या दुखापतीमुळे चालता येत नाही'], why: 'बाकीच्या तिन्हींसाठी "लवकर बाहेर न्या". साप चावल्यास लगेच: व्यक्तीला स्थिर ठेवा, वेळ नोंदवा, बाहेर न्या.' } },
      { star: 1, ans: 1, src: 'Module 16, 7.7',
        en: { q: 'Someone is seriously injured and there is no phone signal. What do you do?', o: ['Send the fastest person alone to find signal.', 'Send two people together toward signal, with a written note of the location, the condition and what has been done.', 'Everyone walks out together and leaves the patient to rest.', 'Wait for signal to come back.'], why: 'Never send one person alone. Never leave the patient alone.' },
        hi: { q: 'कोई गंभीर रूप से घायल है और फ़ोन में नेटवर्क नहीं है। आप क्या करेंगे?', o: ['सबसे तेज़ व्यक्ति को अकेले नेटवर्क ढूँढने भेजें।', 'दो लोगों को साथ में नेटवर्क की ओर भेजें, जगह, हालत और अब तक क्या किया गया, यह लिखकर दें।', 'सब लोग साथ में बाहर चले जाएँ और मरीज़ को आराम करने दें।', 'नेटवर्क वापस आने का इंतज़ार करें।'], why: 'कभी किसी एक व्यक्ति को अकेले न भेजें। कभी मरीज़ को अकेला न छोड़ें।' },
        mr: { q: 'कोणीतरी गंभीर जखमी आहे आणि फोनला नेटवर्क नाही. तुम्ही काय कराल?', o: ['सगळ्यात वेगवान व्यक्तीला एकट्याला नेटवर्क शोधायला पाठवा.', 'दोन लोकांना एकत्र नेटवर्कच्या दिशेने पाठवा, जागा, स्थिती आणि आतापर्यंत काय केले ते लिहून द्या.', 'सगळे एकत्र बाहेर निघा आणि रुग्णाला आराम करू द्या.', 'नेटवर्क परत येण्याची वाट पाहा.'], why: 'कधीही एका व्यक्तीला एकटे पाठवू नका. कधीही रुग्णाला एकटे सोडू नका.' } },
      { star: 1, ans: 1, src: 'Module 16, Emergency Response Sequence step 1',
        en: { q: 'You reach an injured person. What is the very first step?', o: ['Call 108.', 'Make sure the scene is safe before you approach.', 'Give them water.', 'Take a photo for the report.'], why: 'If the scene is not safe, there can soon be two patients.' },
        hi: { q: 'आप एक घायल व्यक्ति तक पहुँचते हैं। सबसे पहला कदम क्या है?', o: ['108 पर कॉल करें।', 'पास जाने से पहले पक्का करें कि जगह सुरक्षित है।', 'उन्हें पानी दें।', 'रिपोर्ट के लिए फ़ोटो लें।'], why: 'अगर जगह सुरक्षित नहीं है, तो जल्द ही दो मरीज़ हो सकते हैं।' },
        mr: { q: 'तुम्ही एका जखमी व्यक्तीपर्यंत पोहोचता. सगळ्यात पहिले पाऊल कोणते?', o: ['108 वर कॉल करा.', 'जवळ जाण्यापूर्वी जागा सुरक्षित आहे याची खात्री करा.', 'त्यांना पाणी द्या.', 'रिपोर्टसाठी फोटो काढा.'], why: 'जागा सुरक्षित नसेल तर लवकरच दोन रुग्ण होऊ शकतात.' } },
    ],
  },
  2: {
    name: 'Quiz 2: Leading the Experience',
    title: { en: 'Quiz 2: Leading the Experience', hi: 'क्विज़ 2: अनुभव का नेतृत्व करना', mr: 'क्विझ 2: अनुभवाचे नेतृत्व करणे' },
    read: { en: 'Read Modules 2, 4, 8 and 12 first.', hi: 'पहले मॉड्यूल 2, 4, 8 और 12 पढ़ें।', mr: 'आधी मॉड्यूल 2, 4, 8 आणि 12 वाचा.' },
    task: {
      en: 'Teach one Leave No Trace principle to someone at home or in your village: a child, a parent, a friend. Then send your trainer a voice note or photo: who you taught, which principle, and what they said back.',
      hi: 'घर या गाँव में किसी को एक Leave No Trace नियम सिखाएँ: कोई बच्चा, माता-पिता, दोस्त। फिर अपने ट्रेनर को वॉइस नोट या फ़ोटो भेजें: आपने किसे सिखाया, कौन-सा नियम, और उन्होंने क्या जवाब दिया।',
      mr: 'घरी किंवा गावात कोणालातरी एक Leave No Trace नियम शिकवा: एखादे मूल, आई-वडील, मित्र. मग तुमच्या ट्रेनरला व्हॉइस नोट किंवा फोटो पाठवा: तुम्ही कोणाला शिकवले, कोणता नियम, आणि त्यांनी काय उत्तर दिले.',
    },
    qs: [
      { star: 0, ans: 2, src: '2.8',
        en: { q: 'Which of these is NOT one of the Rock & Anchor 10 Essentials?', o: ['Navigation', 'Emergency shelter', 'Trekking poles', 'Extra water'], why: '' },
        hi: { q: 'इनमें से कौन-सा Rock & Anchor की 10 ज़रूरी चीज़ों (10 Essentials) में नहीं है?', o: ['नेविगेशन (रास्ता पहचानना)', 'इमरजेंसी शेल्टर', 'ट्रेकिंग पोल (छड़ी)', 'अतिरिक्त पानी'], why: '' },
        mr: { q: 'यापैकी कोणती गोष्ट Rock & Anchor च्या 10 आवश्यक गोष्टींमध्ये (10 Essentials) नाही?', o: ['नेव्हिगेशन (रस्ता ओळखणे)', 'इमर्जन्सी शेल्टर', 'ट्रेकिंग पोल (काठी)', 'जादा पाणी'], why: '' } },
      { star: 0, ans: 2, src: '2.8 (Headlamp)',
        en: { q: 'The trek is in the daytime. Do you still need a headlamp?', o: ['No, it is daytime.', 'No, the phone flashlight is enough.', 'Yes. A delay or injury can turn a day trek into a night situation. The phone light is only a backup.', 'Only in monsoon.'], why: '' },
        hi: { q: 'ट्रेक दिन में है। क्या फिर भी हेडलैंप चाहिए?', o: ['नहीं, दिन है।', 'नहीं, फ़ोन की टॉर्च काफ़ी है।', 'हाँ। देरी या चोट से दिन का ट्रेक रात की स्थिति बन सकता है। फ़ोन की लाइट सिर्फ़ बैकअप है।', 'सिर्फ़ मानसून में।'], why: '' },
        mr: { q: 'ट्रेक दिवसा आहे. तरीही हेडलॅम्प लागतो का?', o: ['नाही, दिवस आहे.', 'नाही, फोनची टॉर्च पुरेशी आहे.', 'हो. उशीर किंवा दुखापत झाल्यास दिवसाचा ट्रेक रात्रीपर्यंत जाऊ शकतो. फोनचा लाइट फक्त बॅकअप आहे.', 'फक्त पावसाळ्यात.'], why: '' } },
      { star: 0, ans: 1, src: '2.2',
        en: { q: 'How early should the leader team arrive at the meeting point?', o: ['On time, with the participants', '15 minutes before participants', '2 hours before', 'It does not matter'], why: 'Use the time to review the day: key moments, risks and teaching opportunities.' },
        hi: { q: 'लीडर टीम को मिलने की जगह पर कितनी जल्दी पहुँचना चाहिए?', o: ['समय पर, प्रतिभागियों के साथ', 'प्रतिभागियों से 15 मिनट पहले', '2 घंटे पहले', 'कोई फ़र्क नहीं पड़ता'], why: 'इस समय में दिन की तैयारी दोहराएँ: ख़ास पल, ख़तरे और सिखाने के मौके।' },
        mr: { q: 'लीडर टीमने भेटण्याच्या ठिकाणी किती लवकर पोहोचावे?', o: ['वेळेवर, सहभागींसोबत', 'सहभागींच्या 15 मिनिटे आधी', '2 तास आधी', 'काही फरक पडत नाही'], why: 'या वेळेत दिवसाची उजळणी करा: महत्त्वाचे क्षण, धोके आणि शिकवण्याच्या संधी.' } },
      { star: 1, ans: 1, src: '2.4',
        en: { q: 'How often do you count the group on the trail?', o: ['Only at the start and the end', 'Every 20 to 30 minutes, quietly, while walking or at natural stops', 'Once every 2 hours', 'Only if someone seems missing'], why: '' },
        hi: { q: 'रास्ते में ग्रुप की गिनती कितनी बार करते हैं?', o: ['सिर्फ़ शुरुआत और आख़िर में', 'हर 20 से 30 मिनट में, चुपचाप, चलते हुए या जहाँ अपने-आप रुकते हैं वहाँ', 'हर 2 घंटे में एक बार', 'सिर्फ़ तब जब कोई गायब लगे'], why: '' },
        mr: { q: 'वाटेत ग्रुपची मोजणी किती वेळा करता?', o: ['फक्त सुरुवातीला आणि शेवटी', 'दर 20 ते 30 मिनिटांनी, शांतपणे, चालताना किंवा नैसर्गिक थांब्यांवर', 'दर 2 तासांनी एकदा', 'फक्त कोणी गायब वाटल्यास'], why: '' } },
      { star: 0, ans: 3, src: '2.4',
        en: { q: 'Whose speed sets the pace of the group?', o: ["The leader's", "The average person's", "The fastest person's", "The slowest person's. Always."], why: '' },
        hi: { q: 'ग्रुप की रफ़्तार किसकी चाल से तय होती है?', o: ['लीडर की', 'औसत व्यक्ति की', 'सबसे तेज़ व्यक्ति की', 'सबसे धीमे व्यक्ति की। हमेशा।'], why: '' },
        mr: { q: 'ग्रुपचा वेग कोणाच्या चालीवरून ठरतो?', o: ['लीडरच्या', 'सरासरी व्यक्तीच्या', 'सगळ्यात वेगवान व्यक्तीच्या', 'सगळ्यात हळू व्यक्तीच्या. नेहमी.'], why: '' } },
      { star: 1, ans: 2, src: '2.6',
        en: { q: 'When do most accidents happen?', o: ['At the start, when people are nervous', 'At the summit', 'On the way back, when people are tired and the trail feels familiar', 'At the meeting point'], why: 'Shorter steps, bent knees, slow controlled pace, extra attention to children and older participants.' },
        hi: { q: 'ज़्यादातर हादसे कब होते हैं?', o: ['शुरुआत में, जब लोग घबराए होते हैं', 'चोटी पर', 'वापसी में, जब लोग थके होते हैं और रास्ता जाना-पहचाना लगता है', 'मिलने की जगह पर'], why: 'छोटे कदम, घुटने थोड़े मुड़े हुए, धीमी और संभली हुई चाल, बच्चों और बुज़ुर्गों पर ज़्यादा ध्यान।' },
        mr: { q: 'बहुतेक अपघात कधी होतात?', o: ['सुरुवातीला, जेव्हा लोक घाबरलेले असतात', 'शिखरावर', 'परत येताना, जेव्हा लोक थकलेले असतात आणि रस्ता ओळखीचा वाटतो', 'भेटण्याच्या ठिकाणी'], why: 'लहान पावले, गुडघे थोडे वाकवलेले, हळू आणि नियंत्रित चाल, मुलांकडे आणि वयस्कांकडे जास्त लक्ष.' } },
      { star: 1, ans: 1, src: '2.5',
        en: { q: 'The group reaches the destination. What do you do first?', o: ['Take the group photo.', 'Count everyone.', 'Share the story of the place.', 'Let everyone explore.'], why: '' },
        hi: { q: 'ग्रुप मंज़िल पर पहुँचता है। आप सबसे पहले क्या करेंगे?', o: ['ग्रुप फ़ोटो लें।', 'सबकी गिनती करें।', 'जगह की कहानी सुनाएँ।', 'सबको घूमने दें।'], why: '' },
        mr: { q: 'ग्रुप ठिकाणी पोहोचतो. तुम्ही सगळ्यात आधी काय कराल?', o: ['ग्रुप फोटो काढा.', 'सगळ्यांची मोजणी करा.', 'त्या जागेची गोष्ट सांगा.', 'सगळ्यांना फिरू द्या.'], why: '' } },
      { star: 0, ans: 1, src: 'Module 4',
        en: { q: 'Which instruction follows AIRC best?', o: ['"Everyone, stop here and look at me. Stop before the stream. One person crosses at a time. Wait for my signal. Be careful, okay? Let\'s go."', '"Everyone, stop here and look at me. Stop before the stream. One person crosses at a time. Wait for my signal. The rocks under the water are loose. Rahul, tell me: what do we do at the stream?"', '"Stop before the stream. One person crosses at a time, because the rocks under the water are loose. Wait for my signal. Does everyone understand?"', '"Everyone, look at me. The rocks under the water are loose and people slip here every monsoon, so be very careful at the stream. Rahul, are you ready?"'], why: 'The right one has it all: attention first, an exact instruction, the information they need (the rocks are loose), and one named person saying it back. The others each miss something: one never says why and never checks; one starts without getting attention and asks the whole group "does everyone understand?"; one explains the danger but never says exactly what to do. A full AIRC briefing has six steps: Attention, Instruction, Information, Reason, Review, Confirmation.' },
        hi: { q: 'कौन-सा निर्देश AIRC का सबसे अच्छा पालन करता है?', o: ['"सब लोग, यहाँ रुकिए और मेरी तरफ़ देखिए। नाले से पहले रुकना है। एक बार में एक ही व्यक्ति पार करेगा। मेरे इशारे का इंतज़ार करें। ध्यान रखना, ठीक है? चलो।"', '"सब लोग, यहाँ रुकिए और मेरी तरफ़ देखिए। नाले से पहले रुकना है। एक बार में एक ही व्यक्ति पार करेगा। मेरे इशारे का इंतज़ार करें। पानी के नीचे के पत्थर हिलते हैं। राहुल, बताओ: नाले पर हमें क्या करना है?"', '"नाले से पहले रुकना है। एक बार में एक ही व्यक्ति पार करेगा, क्योंकि पानी के नीचे के पत्थर हिलते हैं। मेरे इशारे का इंतज़ार करें। सबको समझ आया?"', '"सब लोग, मेरी तरफ़ देखिए। पानी के नीचे के पत्थर हिलते हैं और हर मानसून में यहाँ लोग फिसलते हैं, इसलिए नाले पर बहुत ध्यान रखना। राहुल, तैयार हो?"'], why: 'सही वाले में सब कुछ है: पहले ध्यान, साफ़ निर्देश, ज़रूरी जानकारी (पत्थर हिलते हैं), और नाम लेकर एक व्यक्ति से दोहरवाना। बाकी हर एक में कुछ छूटा है: एक में न कारण है, न पुष्टि; एक ध्यान लिए बिना शुरू होता है और पूरे ग्रुप से "सबको समझ आया?" पूछता है; एक ख़तरा तो बताता है पर यह नहीं बताता कि ठीक-ठीक क्या करना है। पूरी AIRC ब्रीफ़िंग में छह कदम होते हैं: Attention, Instruction, Information, Reason, Review, Confirmation।' },
        mr: { q: 'कोणती सूचना AIRC चे सगळ्यात चांगले पालन करते?', o: ['"सगळे, इथे थांबा आणि माझ्याकडे पाहा. ओढ्याच्या आधी थांबायचे. एका वेळी एकच व्यक्ती ओलांडेल. माझ्या इशाऱ्याची वाट पाहा. काळजी घ्या, ठीक आहे? चला."', '"सगळे, इथे थांबा आणि माझ्याकडे पाहा. ओढ्याच्या आधी थांबायचे. एका वेळी एकच व्यक्ती ओलांडेल. माझ्या इशाऱ्याची वाट पाहा. पाण्याखालचे दगड हलतात. राहुल, सांग: ओढ्यावर आपण काय करायचे?"', '"ओढ्याच्या आधी थांबायचे. एका वेळी एकच व्यक्ती ओलांडेल, कारण पाण्याखालचे दगड हलतात. माझ्या इशाऱ्याची वाट पाहा. सगळ्यांना समजले का?"', '"सगळे, माझ्याकडे पाहा. पाण्याखालचे दगड हलतात आणि दर पावसाळ्यात इथे लोक घसरतात, म्हणून ओढ्यावर खूप काळजी घ्या. राहुल, तयार आहेस?"'], why: 'बरोबर उत्तरात सगळे आहे: आधी लक्ष, नेमकी सूचना, आवश्यक माहिती (दगड हलतात), आणि नाव घेऊन एका व्यक्तीकडून पुन्हा सांगून घेणे. बाकी प्रत्येकात काहीतरी सुटले आहे: एकात कारणही नाही आणि खात्रीही नाही; एक लक्ष न वेधता सुरू होते आणि पूर्ण ग्रुपला "सगळ्यांना समजले का?" विचारते; एक धोका सांगते पण नेमके काय करायचे ते सांगत नाही. पूर्ण AIRC ब्रीफिंगमध्ये सहा पायऱ्या असतात: Attention, Instruction, Information, Reason, Review, Confirmation.' } },
      { star: 0, ans: 1, src: 'Module 4 (Confirmation)',
        en: { q: 'What is the strongest way to confirm people understood?', o: ['"Is everyone OK?"', 'Ask one named person to tell you what to do next.', 'Repeat the instruction louder.', 'Assume that silence means yes.'], why: '' },
        hi: { q: 'लोगों को समझ आया या नहीं, यह पक्का करने का सबसे अच्छा तरीका क्या है?', o: ['"सब ठीक हैं?"', 'किसी एक व्यक्ति का नाम लेकर उससे पूछें कि आगे क्या करना है।', 'निर्देश ज़ोर से दोहराएँ।', 'मान लें कि चुप रहने का मतलब हाँ है।'], why: '' },
        mr: { q: 'लोकांना समजले की नाही याची खात्री करण्याचा सगळ्यात चांगला मार्ग कोणता?', o: ['"सगळे ठीक आहेत ना?"', 'एका व्यक्तीचे नाव घेऊन त्याला पुढे काय करायचे ते विचारा.', 'सूचना मोठ्याने पुन्हा सांगा.', 'गप्प राहणे म्हणजे हो, असे समजा.'], why: '' } },
      { star: 0, ans: 1, src: '8.2 Principle 3, 8.4, 8.5',
        en: { q: 'A participant drops an orange peel and says, "It is biodegradable." What is the best response?', o: ['Quietly pick it up yourself so the participant does not feel embarrassed.', 'Ask them to pick it up, and tell them why: here an orange peel takes about 2 years to break down, and animals eat it and get sick.', 'Remind the whole group of the rule: nothing is left on the trail, everything goes in the bag.', 'Let it go for now, and talk about Leave No Trace with everyone at the next rest stop.'], why: 'Give the "why" with the rule, and let them fix it themselves. That is how the habit sticks. Picking it up for them teaches nothing, a rule without a reason feels like a lecture, and if you wait, the moment is gone.' },
        hi: { q: 'एक प्रतिभागी संतरे का छिलका गिराता है और कहता है, "यह तो अपने-आप सड़ जाएगा।" सबसे अच्छा जवाब क्या है?', o: ['चुपचाप ख़ुद उठा लें ताकि प्रतिभागी को शर्मिंदगी न हो।', 'उनसे उठाने को कहें, और कारण बताएँ: यहाँ संतरे का छिलका सड़ने में लगभग 2 साल लगते हैं, और जानवर उसे खाकर बीमार पड़ते हैं।', 'पूरे ग्रुप को नियम याद दिलाएँ: रास्ते पर कुछ नहीं छोड़ना, सब कुछ थैली में जाता है।', 'अभी जाने दें, और अगले रुकने की जगह पर सबसे Leave No Trace के बारे में बात करें।'], why: 'नियम के साथ "क्यों" बताएँ, और उन्हें ख़ुद ठीक करने दें। आदत ऐसे ही बनती है। उनके लिए ख़ुद उठा लेने से वे कुछ नहीं सीखते, बिना कारण का नियम भाषण जैसा लगता है, और इंतज़ार करने से वह पल निकल जाता है।' },
        mr: { q: 'एक सहभागी संत्र्याची साल टाकतो आणि म्हणतो, "ती आपोआप कुजून जाईल." सगळ्यात चांगले उत्तर कोणते?', o: ['शांतपणे स्वतः उचला म्हणजे सहभागीला लाज वाटणार नाही.', 'त्यांना उचलायला सांगा, आणि कारण सांगा: इथे संत्र्याची साल कुजायला सुमारे 2 वर्षे लागतात, आणि प्राणी ती खाऊन आजारी पडतात.', 'पूर्ण ग्रुपला नियमाची आठवण करून द्या: वाटेवर काही सोडायचे नाही, सगळे पिशवीत जाते.', 'आत्ता जाऊ द्या, आणि पुढच्या थांब्यावर सगळ्यांशी Leave No Trace बद्दल बोला.'], why: 'नियमासोबत "का" सांगा, आणि त्यांना स्वतः चूक सुधारू द्या. सवय अशीच लागते. त्यांच्यासाठी स्वतः उचलल्याने ते काही शिकत नाहीत, कारणाशिवायचा नियम भाषणासारखा वाटतो, आणि थांबल्यास तो क्षण निघून जातो.' } },
      { star: 0, ans: 1, src: '8.3',
        en: { q: 'At a waterfall trek, which LNT practice is correct?', o: ['Soap is fine if it is herbal.', 'No soap or shampoo in the water. Human waste at least 60 metres from water. Carry out food waste.', 'Food scraps can go in the stream.', 'Toilet paper can be buried near the pool.'], why: '' },
        hi: { q: 'झरने वाले ट्रेक पर, कौन-सा LNT (Leave No Trace) तरीका सही है?', o: ['हर्बल हो तो साबुन ठीक है।', 'पानी में साबुन या शैंपू नहीं। शौच पानी से कम से कम 60 मीटर दूर। खाने का कचरा वापस ले जाएँ।', 'खाने का बचा हुआ नाले में डाल सकते हैं।', 'टॉयलेट पेपर कुंड के पास गाड़ सकते हैं।'], why: '' },
        mr: { q: 'धबधब्याच्या ट्रेकवर कोणती LNT (Leave No Trace) पद्धत बरोबर आहे?', o: ['हर्बल असेल तर साबण चालतो.', 'पाण्यात साबण किंवा शाम्पू नाही. शौच पाण्यापासून किमान 60 मीटर दूर. अन्नाचा कचरा परत घेऊन जा.', 'उरलेले अन्न ओढ्यात टाकू शकतो.', 'टॉयलेट पेपर डोहाजवळ पुरू शकतो.'], why: '' } },
      { star: 0, ans: 1, src: '8.2 Principle 6',
        en: { q: 'Why must participants never feed the monkeys?', o: ['The food is expensive.', 'Feeding makes them take food aggressively and become dangerous.', 'Monkeys do not eat human food.', 'It is fine if the food is fruit.'], why: '' },
        hi: { q: 'प्रतिभागियों को बंदरों को कभी खाना क्यों नहीं खिलाना चाहिए?', o: ['खाना महँगा है।', 'खिलाने से वे झपटकर खाना छीनने लगते हैं और ख़तरनाक हो जाते हैं।', 'बंदर इंसानों का खाना नहीं खाते।', 'फल हो तो ठीक है।'], why: '' },
        mr: { q: 'सहभागींनी माकडांना कधीही खायला का देऊ नये?', o: ['खाणे महाग आहे.', 'खायला दिल्याने ते आक्रमकपणे अन्न हिसकावू लागतात आणि धोकादायक होतात.', 'माकडे माणसांचे अन्न खात नाहीत.', 'फळ असेल तर चालते.'], why: '' } },
      { star: 1, ans: 1, src: 'Scenario 1',
        en: { q: 'The group is 40 minutes from the summit and it is 2:30 PM. The group usually spends about 30 minutes at the top, and the way down takes about 2 hours. Three people keep stopping, and it is dark at 6 PM. The fit participants tell you, "Come on, let us push for the top." As a Co-Leader, what do you do?', o: ['Agree with them and lead them up.', "Tell the fit participants it is the Leader's call, give the Leader your honest read of the timings and the tired participants, then back the Leader's decision fully.", 'Ask the whole group to vote.', 'Say "we are almost there" to keep everyone moving.'], why: '40 minutes up + 30 minutes at the top + 2 hours down = 5:40 PM at the earliest, and the three tired people will be slower than that. That means coming down in the dark. The weakest member decides, and the strongest participants never decide for the group.' },
        hi: { q: 'ग्रुप चोटी से 40 मिनट दूर है और दोपहर के 2:30 बजे हैं। ग्रुप आमतौर पर चोटी पर लगभग 30 मिनट रुकता है, और नीचे उतरने में लगभग 2 घंटे लगते हैं। तीन लोग बार-बार रुक रहे हैं, और शाम 6 बजे अँधेरा हो जाता है। फ़िट प्रतिभागी आपसे कहते हैं, "चलो, ऊपर तक चलते हैं।" को-लीडर के रूप में आप क्या करेंगे?', o: ['उनसे सहमत होकर उन्हें ऊपर ले जाएँ।', 'फ़िट प्रतिभागियों को बताएँ कि फ़ैसला लीडर का है, लीडर को समय और थके हुए लोगों के बारे में अपनी सच्ची राय दें, फिर लीडर के फ़ैसले का पूरा साथ दें।', 'पूरे ग्रुप से वोट करवाएँ।', 'सबको चलाते रहने के लिए कहें "बस पहुँच ही गए"।'], why: '40 मिनट ऊपर + 30 मिनट चोटी पर + 2 घंटे नीचे = कम से कम शाम 5:40, और थके हुए तीन लोग इससे भी धीमे चलेंगे। यानी अँधेरे में नीचे उतरना। सबसे कमज़ोर सदस्य से फ़ैसला तय होता है, और सबसे तेज़ लोग कभी ग्रुप के लिए फ़ैसला नहीं करते।' },
        mr: { q: 'ग्रुप शिखरापासून 40 मिनिटे दूर आहे आणि दुपारचे 2:30 वाजले आहेत. ग्रुप साधारणपणे शिखरावर सुमारे 30 मिनिटे थांबतो, आणि खाली उतरायला सुमारे 2 तास लागतात. तीन लोक सतत थांबत आहेत, आणि संध्याकाळी 6 वाजता अंधार होतो. फिट सहभागी तुम्हाला म्हणतात, "चला, वरपर्यंत जाऊया." को-लीडर म्हणून तुम्ही काय कराल?', o: ['त्यांच्याशी सहमत होऊन त्यांना वर घेऊन जा.', 'फिट सहभागींना सांगा की निर्णय लीडरचा आहे, लीडरला वेळ आणि थकलेल्या लोकांबद्दल तुमचे प्रामाणिक मत सांगा, मग लीडरच्या निर्णयाला पूर्ण साथ द्या.', 'संपूर्ण ग्रुपचे मतदान घ्या.', 'सगळ्यांना चालत ठेवण्यासाठी म्हणा "आलोच आता".'], why: '40 मिनिटे वर + 30 मिनिटे शिखरावर + 2 तास खाली = किमान संध्याकाळी 5:40, आणि थकलेले तीन लोक याहूनही हळू चालतील. म्हणजे अंधारात खाली उतरणे. सगळ्यात कमकुवत सदस्यावरून निर्णय ठरतो, आणि सगळ्यात तगडे लोक कधीही ग्रुपसाठी निर्णय घेत नाहीत.' } },
      { star: 0, ans: 2, src: 'Scenario 2',
        en: { q: 'A 9-year-old sits on the trail crying and says he wants to go home. What do you do first?', o: ['Tell him the waterfall is only 25 minutes away, so he can do it if he keeps walking.', 'Ask his parents to calm him down while the group waits nearby.', 'Crouch to his eye level, ask calmly what is wrong, and give him water and a snack.', 'Let one parent take him back to the start while the group goes on.'], why: 'First find the real cause. Hunger, thirst, a blister or fear are the usual ones, and water and a snack fix many of them. A goal like "only 25 minutes more" helps after that. Handing it to the parents or sending him back is a last step, not the first.' },
        hi: { q: '9 साल का एक बच्चा रास्ते में बैठकर रो रहा है और कहता है कि उसे घर जाना है। आप सबसे पहले क्या करेंगे?', o: ['उसे बताएँ कि झरना बस 25 मिनट दूर है, चलते रहेगा तो पहुँच जाएगा।', 'ग्रुप पास में रुका रहे, और उसके माता-पिता से कहें कि उसे शांत करें।', 'उसकी आँखों के बराबर नीचे बैठें, शांति से पूछें कि क्या हुआ, और पानी व कुछ खाने को दें।', 'एक माता-पिता को उसे शुरुआत की जगह वापस ले जाने दें, और ग्रुप आगे बढ़े।'], why: 'पहले असली कारण पता करें। भूख, प्यास, छाला या डर अक्सर कारण होते हैं, और पानी व कुछ खाने से इनमें से कई ठीक हो जाते हैं। "बस 25 मिनट और" जैसा लक्ष्य उसके बाद काम आता है। माता-पिता पर छोड़ देना या उसे वापस भेजना आख़िरी कदम है, पहला नहीं।' },
        mr: { q: '9 वर्षांचा एक मुलगा वाटेत बसून रडत आहे आणि म्हणतो की त्याला घरी जायचे आहे. तुम्ही सगळ्यात आधी काय कराल?', o: ['त्याला सांगा की धबधबा फक्त 25 मिनिटांवर आहे, चालत राहिला तर पोहोचेल.', 'ग्रुप जवळच थांबू द्या, आणि त्याच्या आई-वडिलांना त्याला शांत करायला सांगा.', 'त्याच्या डोळ्यांच्या पातळीवर खाली बसा, शांतपणे विचारा काय झाले, आणि पाणी व खाऊ द्या.', 'एका पालकाला त्याला सुरुवातीच्या जागी परत नेऊ द्या, आणि ग्रुप पुढे जाऊ दे.'], why: 'आधी खरे कारण शोधा. भूक, तहान, फोड किंवा भीती ही नेहमीची कारणे असतात, आणि पाणी व खाऊ दिल्याने यातली बरीच दूर होतात. "फक्त 25 मिनिटे अजून" असे ध्येय त्यानंतर उपयोगी पडते. आई-वडिलांवर सोडणे किंवा त्याला परत पाठवणे ही शेवटची पायरी आहे, पहिली नाही.' } },
      { star: 0, ans: 2, src: 'Scenario 7',
        en: { q: 'Village women arrive at the lake to wash clothes while your group is swimming. Which of these is a mistake?', o: ['Greeting them respectfully: "Namaskar tai. Aap aaramse kaam karein."', 'Letting participants watch quietly without filling the silence.', 'Photographing the women without asking.', 'Asking afterwards, "What did that change for you?"'], why: 'Without consent, a real moment becomes a tourist performance.' },
        hi: { q: 'आपका ग्रुप तैर रहा है, तभी गाँव की महिलाएँ कपड़े धोने तालाब पर आती हैं। इनमें से कौन-सी बात ग़लती है?', o: ['उनका सम्मान से अभिवादन करना: "नमस्कार ताई। आप आराम से काम करें।"', 'प्रतिभागियों को चुपचाप देखने देना, ख़ामोशी को बातों से न भरना।', 'बिना पूछे महिलाओं की फ़ोटो लेना।', 'बाद में पूछना, "इससे आपके लिए क्या बदला?"'], why: 'बिना अनुमति के, एक असली पल पर्यटकों का तमाशा बन जाता है।' },
        mr: { q: 'तुमचा ग्रुप पोहत असताना गावातील महिला कपडे धुण्यासाठी तलावावर येतात. यापैकी कोणती गोष्ट चूक आहे?', o: ['त्यांना आदराने नमस्कार करणे: "नमस्कार ताई. तुम्ही निवांत काम करा."', 'सहभागींना शांतपणे पाहू देणे, शांतता बोलण्याने न भरणे.', 'न विचारता महिलांचे फोटो काढणे.', 'नंतर विचारणे, "यामुळे तुमच्यासाठी काय बदलले?"'], why: 'परवानगी नसेल तर खरा क्षण पर्यटकांसाठीचा तमाशा बनतो.' } },
    ],
  },
  3: {
    name: 'Quiz 3: Skills in the Field',
    title: { en: 'Quiz 3: Skills in the Field', hi: 'क्विज़ 3: मैदान के हुनर', mr: 'क्विझ 3: मैदानातील कौशल्ये' },
    read: { en: 'Think back to the hazard walk, the maps, the camp night and the skits.', hi: 'हैज़र्ड वॉक, नक्शे, कैंप की रात और नाटकों को याद करें।', mr: 'हॅझर्ड वॉक, नकाशे, कॅम्पची रात्र आणि नाटुकल्या आठवा.' },
    task: {
      en: 'Draw a simple map of your village or a trail you know. Show north, the path, water, one hazard, and a legend with at least 4 symbols. Send a photo of it to your trainer.',
      hi: 'अपने गाँव या किसी जाने-पहचाने रास्ते का एक सादा नक्शा बनाएँ। उसमें उत्तर दिशा, रास्ता, पानी, एक ख़तरा, और कम से कम 4 चिन्हों वाली लेजेंड (चिन्ह-सूची) दिखाएँ। उसकी फ़ोटो अपने ट्रेनर को भेजें।',
      mr: 'तुमच्या गावाचा किंवा ओळखीच्या वाटेचा एक साधा नकाशा काढा. त्यात उत्तर दिशा, वाट, पाणी, एक धोका, आणि किमान 4 चिन्हांची लेजेंड (चिन्ह-सूची) दाखवा. त्याचा फोटो तुमच्या ट्रेनरला पाठवा.',
    },
    qs: [
      { star: 0, ans: 2, src: 'Training: hazard walk; Module 5',
        en: { q: 'Which of these is a human hazard?', o: ['Loose rocks below a cliff after heavy rain', 'Lightning on a ridge', 'Broken glass left near the trail by visitors', 'A stream rising fast after rain'], why: 'Natural hazards come from the land and the weather: rockfall, lightning, fast water. Human hazards are made or left by people: broken glass, litter, a fire left burning, vehicles on the road.' },
        hi: { q: 'इनमें से कौन-सा इंसानों से बना ख़तरा है?', o: ['भारी बारिश के बाद चट्टान के नीचे ढीले पत्थर', 'पहाड़ की धार पर बिजली', 'रास्ते के पास लोगों का छोड़ा हुआ टूटा काँच', 'बारिश के बाद तेज़ी से बढ़ता नाला'], why: 'प्राकृतिक ख़तरे ज़मीन और मौसम से आते हैं: गिरते पत्थर, बिजली, तेज़ पानी। इंसानी ख़तरे लोग बनाते या छोड़ जाते हैं: टूटा काँच, कचरा, जलती छोड़ी आग, सड़क पर गाड़ियाँ।' },
        mr: { q: 'यापैकी कोणता धोका माणसांमुळे निर्माण झालेला आहे?', o: ['मुसळधार पावसानंतर कड्याखाली सैल दगड', 'धारेवर वीज', 'वाटेजवळ लोकांनी टाकलेली फुटकी काच', 'पावसानंतर झपाट्याने वाढणारा ओढा'], why: 'नैसर्गिक धोके जमीन आणि हवामानातून येतात: पडणारे दगड, वीज, वेगवान पाणी. माणसांमुळे होणारे धोके लोक तयार करतात किंवा मागे सोडतात: फुटकी काच, कचरा, पेटती सोडलेली आग, रस्त्यावरची वाहने.' } },
      { star: 1, ans: 1, src: 'Training: hazard walk; Module 5.1; Module 16',
        en: { q: 'You spot a hazard ahead. Which report to the Leader is the most useful?', o: ['"There is something dangerous up there."', '"Loose rocks on the left of the path, about 50 metres after the big tree. Someone could slip and fall. I have stopped the group here."', 'Say nothing now and mention it at the end of the day.', 'Take a photo and post it in the group chat.'], why: 'A report the Leader can act on says what it is, exactly where, how serious it is, and what you have already done.' },
        hi: { q: 'आपको आगे एक ख़तरा दिखता है। लीडर को कौन-सी रिपोर्ट सबसे काम की है?', o: ['"ऊपर कुछ ख़तरनाक है।"', '"रास्ते के बाईं ओर ढीले पत्थर हैं, बड़े पेड़ के लगभग 50 मीटर बाद। कोई फिसलकर गिर सकता है। मैंने ग्रुप को यहीं रोक दिया है।"', 'अभी कुछ न कहें, दिन के आख़िर में बताएँ।', 'फ़ोटो लेकर ग्रुप चैट में डाल दें।'], why: 'जिस रिपोर्ट पर लीडर तुरंत कदम उठा सके, उसमें होता है: ख़तरा क्या है, ठीक कहाँ है, कितना गंभीर है, और आपने अब तक क्या किया।' },
        mr: { q: 'तुम्हाला पुढे एक धोका दिसतो. लीडरला कोणता रिपोर्ट सगळ्यात उपयोगी आहे?', o: ['"वर काहीतरी धोकादायक आहे."', '"वाटेच्या डाव्या बाजूला सैल दगड आहेत, मोठ्या झाडानंतर साधारण 50 मीटरवर. कोणी घसरून पडू शकतं. मी ग्रुपला इथेच थांबवलं आहे."', 'आत्ता काही बोलू नका, दिवसाच्या शेवटी सांगा.', 'फोटो काढून ग्रुप चॅटमध्ये टाका.'], why: 'ज्या रिपोर्टवर लीडर लगेच कृती करू शकतो, त्यात असते: धोका काय आहे, नेमका कुठे आहे, किती गंभीर आहे, आणि तुम्ही आतापर्यंत काय केले.' } },
      { star: 0, ans: 1, src: 'Training: map making',
        en: { q: 'What is the legend on a map?', o: ['The name of the map at the top', 'The box that explains what each symbol and colour means', 'The arrow that shows north', 'The line that shows distance'], why: 'Without a legend, nobody else can read your symbols. A map you draw for others always needs one.' },
        hi: { q: 'नक्शे पर लेजेंड क्या होती है?', o: ['ऊपर लिखा नक्शे का नाम', 'वह डिब्बा जो बताता है कि हर चिन्ह और रंग का मतलब क्या है', 'उत्तर दिशा दिखाने वाला तीर', 'दूरी दिखाने वाली रेखा'], why: 'लेजेंड के बिना कोई और आपके चिन्ह नहीं पढ़ सकता। दूसरों के लिए बनाए नक्शे में लेजेंड हमेशा चाहिए।' },
        mr: { q: 'नकाशावरची लेजेंड म्हणजे काय?', o: ['वर लिहिलेले नकाशाचे नाव', 'प्रत्येक चिन्ह आणि रंगाचा अर्थ सांगणारी चौकट', 'उत्तर दिशा दाखवणारा बाण', 'अंतर दाखवणारी रेषा'], why: 'लेजेंडशिवाय दुसरे कोणी तुमची चिन्हे वाचू शकत नाही. इतरांसाठी काढलेल्या नकाशाला लेजेंड नेहमी हवी.' } },
      { star: 0, ans: 0, src: 'Training: maps', img: 'contour',
        en: { q: 'This picture shows contour lines of a hill. Which side of the hill is steeper?', o: ['The left side, where the lines are close together', 'The right side, where the lines are far apart', 'Both sides are the same', 'Contour lines do not show steepness'], why: 'Each contour line joins points at the same height. Lines close together mean the height changes quickly over a short distance: steep. Lines far apart mean gentle ground.' },
        hi: { q: 'इस चित्र में एक पहाड़ी की कंटूर रेखाएँ हैं। पहाड़ी की कौन-सी तरफ़ ज़्यादा खड़ी (तीखी चढ़ाई वाली) है?', o: ['बाईं तरफ़, जहाँ रेखाएँ पास-पास हैं', 'दाईं तरफ़, जहाँ रेखाएँ दूर-दूर हैं', 'दोनों तरफ़ एक जैसी हैं', 'कंटूर रेखाओं से ढलान का पता नहीं चलता'], why: 'हर कंटूर रेखा एक जैसी ऊँचाई वाली जगहों को जोड़ती है। पास-पास रेखाएँ मतलब कम दूरी में ऊँचाई तेज़ी से बदलती है: खड़ी चढ़ाई। दूर-दूर रेखाएँ मतलब हल्की ढलान।' },
        mr: { q: 'या चित्रात एका टेकडीच्या कंटूर रेषा आहेत. टेकडीची कोणती बाजू जास्त उभी (तीव्र चढाची) आहे?', o: ['डावी बाजू, जिथे रेषा जवळजवळ आहेत', 'उजवी बाजू, जिथे रेषा दूरदूर आहेत', 'दोन्ही बाजू सारख्याच आहेत', 'कंटूर रेषांवरून उतार कळत नाही'], why: 'प्रत्येक कंटूर रेषा सारख्या उंचीवरच्या जागा जोडते. जवळजवळ रेषा म्हणजे कमी अंतरात उंची वेगाने बदलते: उभा चढ. दूरदूर रेषा म्हणजे सौम्य उतार.' } },
      { star: 0, ans: 1, src: 'Training: maps', img: 'contour',
        en: { q: 'In the same picture, what does the smallest ring in the middle show?', o: ['A lake', 'The top of the hill', 'A village', 'The start of the trail'], why: 'Rings that get smaller and smaller show the ground rising. The smallest ring is the highest part: the top.' },
        hi: { q: 'उसी चित्र में, बीच का सबसे छोटा घेरा क्या दिखाता है?', o: ['एक तालाब', 'पहाड़ी की चोटी', 'एक गाँव', 'रास्ते की शुरुआत'], why: 'छोटे होते जाते घेरे दिखाते हैं कि ज़मीन ऊपर उठ रही है। सबसे छोटा घेरा सबसे ऊँची जगह है: चोटी।' },
        mr: { q: 'त्याच चित्रात, मधले सगळ्यात लहान वर्तुळ काय दाखवते?', o: ['एक तलाव', 'टेकडीचे शिखर', 'एक गाव', 'वाटेची सुरुवात'], why: 'लहान लहान होत जाणारी वर्तुळे दाखवतात की जमीन वर चढत आहे. सगळ्यात लहान वर्तुळ म्हणजे सगळ्यात उंच जागा: शिखर.' } },
      { star: 1, ans: 1, src: 'Module 6.1; Module 20 (Insulation, Emergency Heat)',
        en: { q: 'After a long swim and then rain, a participant is shivering hard, speaking slowly and stumbling. What is most likely happening?', o: ['Heat exhaustion', 'Hypothermia: the body is losing heat', 'Just tiredness', 'Too much food'], why: 'Shivering, clumsiness, slow or slurred speech and confusion mean the body is losing heat. Get them out of the wind and wet, change into dry layers, wrap them in the emergency blanket, give a warm sweet drink if they are fully awake. If they become confused, evacuate.' },
        hi: { q: 'लंबे समय तैरने और फिर बारिश के बाद, एक प्रतिभागी ज़ोर से काँप रहा है, धीरे बोल रहा है और लड़खड़ा रहा है। सबसे ज़्यादा संभावना क्या है?', o: ['गर्मी से थकावट (हीट एग्ज़ॉशन)', 'हाइपोथर्मिया: शरीर की गर्मी कम हो रही है', 'बस थकान', 'ज़्यादा खाना'], why: 'काँपना, लड़खड़ाना, धीमा या अटकता बोलना और उलझन का मतलब है शरीर की गर्मी कम हो रही है। हवा और गीलेपन से हटाएँ, सूखे कपड़े पहनाएँ, इमरजेंसी ब्लैंकेट में लपेटें, पूरी तरह होश में हो तो गर्म मीठा पेय दें। अगर उलझन बढ़े, तो बाहर ले जाएँ (इवैक्युएशन)।' },
        mr: { q: 'खूप वेळ पोहल्यानंतर आणि मग पावसानंतर, एक सहभागी जोरात थरथरत आहे, हळू बोलत आहे आणि अडखळत आहे. सगळ्यात जास्त शक्यता काय आहे?', o: ['उष्णतेमुळे थकवा (हीट एक्झॉशन)', 'हायपोथर्मिया: शरीरातील उष्णता कमी होत आहे', 'फक्त थकवा', 'जास्त जेवण'], why: 'थरथरणे, अडखळणे, हळू किंवा अडखळत बोलणे आणि गोंधळ म्हणजे शरीरातील उष्णता कमी होत आहे. वारा आणि ओलाव्यापासून दूर न्या, कोरडे कपडे घाला, इमर्जन्सी ब्लँकेटमध्ये गुंडाळा, पूर्ण शुद्धीवर असेल तर गरम गोड पेय द्या. गोंधळ वाढला तर बाहेर न्या (इव्हॅक्युएशन).' } },
      { star: 1, ans: 1, src: 'Module 5.2; Module 7.5',
        en: { q: 'Summer, a midday climb. A participant has a headache, feels dizzy and sick, and is sweating a lot. What do you do first?', o: ['Push on quickly so you reach the top before it gets hotter', 'Stop, move them into shade, cool them with water, give water with ORS, and rest', 'Give them hot tea', 'Wrap them in the emergency blanket'], why: 'These are signs of heat exhaustion. Cool and rest first. If they become confused, stop sweating or get worse, it is serious: evacuate.' },
        hi: { q: 'गर्मी का मौसम, दोपहर की चढ़ाई। एक प्रतिभागी को सिरदर्द है, चक्कर और मितली आ रही है, और बहुत पसीना आ रहा है। आप सबसे पहले क्या करेंगे?', o: ['जल्दी आगे बढ़ें ताकि और गर्मी होने से पहले ऊपर पहुँच जाएँ', 'रुकें, उन्हें छाँव में ले जाएँ, पानी से ठंडा करें, ORS वाला पानी दें, और आराम कराएँ', 'उन्हें गर्म चाय दें', 'उन्हें इमरजेंसी ब्लैंकेट में लपेटें'], why: 'ये गर्मी से थकावट (हीट एग्ज़ॉशन) के लक्षण हैं। पहले ठंडा करें और आराम कराएँ। अगर उलझन हो, पसीना बंद हो जाए या हालत बिगड़े, तो यह गंभीर है: बाहर ले जाएँ।' },
        mr: { q: 'उन्हाळा, दुपारचा चढ. एका सहभागीचे डोके दुखत आहे, चक्कर आणि मळमळ होत आहे, आणि खूप घाम येत आहे. तुम्ही सगळ्यात आधी काय कराल?', o: ['अजून ऊन वाढण्याआधी वर पोहोचण्यासाठी पटकन पुढे चला', 'थांबा, त्यांना सावलीत न्या, पाण्याने थंड करा, ORS घातलेले पाणी द्या, आणि आराम करू द्या', 'त्यांना गरम चहा द्या', 'त्यांना इमर्जन्सी ब्लँकेटमध्ये गुंडाळा'], why: 'ही उष्णतेमुळे थकव्याची (हीट एक्झॉशन) लक्षणे आहेत. आधी थंड करा आणि आराम करू द्या. गोंधळ झाला, घाम येणे थांबले किंवा प्रकृती बिघडली तर हे गंभीर आहे: बाहेर न्या.' } },
      { star: 1, ans: 2, src: 'Module 10.2',
        en: { q: 'Where is the best place to set up camp for the night?', o: ['In a dry stream bed, because it is flat', 'Under a big dead tree, for shade', 'On flat ground, away from drainage channels, with no dead trees or loose rocks above', 'Right at the edge of the water'], why: 'Rain at night can fill a dry stream bed in minutes. Dead branches and loose rocks fall. Flat, raised, clear ground is safe ground.' },
        hi: { q: 'रात के कैंप के लिए सबसे अच्छी जगह कौन-सी है?', o: ['सूखे नाले के तल में, क्योंकि वह समतल है', 'किसी बड़े सूखे पेड़ के नीचे, छाँव के लिए', 'समतल ज़मीन पर, पानी बहने के रास्तों से दूर, जहाँ ऊपर कोई सूखा पेड़ या ढीले पत्थर न हों', 'ठीक पानी के किनारे'], why: 'रात की बारिश सूखे नाले को मिनटों में भर सकती है। सूखी डालियाँ और ढीले पत्थर गिरते हैं। समतल, थोड़ी ऊँची, साफ़ ज़मीन ही सुरक्षित है।' },
        mr: { q: 'रात्रीच्या कॅम्पसाठी सगळ्यात चांगली जागा कोणती?', o: ['कोरड्या ओढ्याच्या पात्रात, कारण ते सपाट आहे', 'मोठ्या वाळलेल्या झाडाखाली, सावलीसाठी', 'सपाट जमिनीवर, पाणी वाहण्याच्या मार्गांपासून दूर, जिथे वर वाळलेले झाड किंवा सैल दगड नाहीत', 'अगदी पाण्याच्या काठावर'], why: 'रात्रीचा पाऊस कोरडे ओढ्याचे पात्र काही मिनिटांत भरू शकतो. वाळलेल्या फांद्या आणि सैल दगड पडतात. सपाट, थोडी उंच, मोकळी जमीनच सुरक्षित आहे.' } },
      { star: 1, ans: 0, src: 'Module 8.2, Principle 5',
        en: { q: 'Before lighting a campfire, what must you do?', o: ['Use an existing fire ring or clear a 1-metre circle of leaves and dry material, and keep water ready to put it out completely', 'Light it next to the tents so everyone stays warm', 'Use plastic to get it started', 'Plan to leave the embers burning overnight'], why: 'The forest floor is dry for much of the year and a single spark can travel. Burn everything to ash and douse it completely before you sleep or leave.' },
        hi: { q: 'कैंपफ़ायर जलाने से पहले आपको क्या करना ज़रूरी है?', o: ['पहले से बनी आग की जगह इस्तेमाल करें या 1 मीटर के घेरे से पत्ते और सूखा सामान हटाएँ, और आग पूरी तरह बुझाने के लिए पानी तैयार रखें', 'तंबुओं के पास जलाएँ ताकि सबको गर्मी मिले', 'आग शुरू करने के लिए प्लास्टिक इस्तेमाल करें', 'अंगारे रात भर जलते छोड़ने की सोचें'], why: 'साल के ज़्यादातर समय जंगल की ज़मीन सूखी रहती है और एक चिंगारी दूर तक जा सकती है। सब कुछ राख होने तक जलाएँ और सोने या जाने से पहले पूरी तरह बुझाएँ।' },
        mr: { q: 'कॅम्पफायर पेटवण्याआधी तुम्ही काय करणे आवश्यक आहे?', o: ['आधीपासून असलेली शेकोटीची जागा वापरा किंवा 1 मीटरच्या वर्तुळातील पाने आणि सुका पालापाचोळा काढा, आणि आग पूर्ण विझवण्यासाठी पाणी तयार ठेवा', 'तंबूंच्या जवळ पेटवा म्हणजे सगळ्यांना ऊब मिळेल', 'आग सुरू करण्यासाठी प्लास्टिक वापरा', 'निखारे रात्रभर पेटते ठेवायचे ठरवा'], why: 'वर्षातील बराच काळ जंगलाची जमीन कोरडी असते आणि एक ठिणगी दूरवर जाऊ शकते. सगळे राख होईपर्यंत जाळा आणि झोपण्याआधी किंवा निघण्याआधी पूर्ण विझवा.' } },
      { star: 0, ans: 1, src: 'Training: camp night; Module 11.1',
        en: { q: 'On the camp night your group had to choose the site, plan the food and decide who leads. What is the best way to work as a team?', o: ['The strongest person does everything', 'Agree on one leader, who gives each person a clear job and checks back with them', 'Everyone does whatever they want', 'Wait for the trainer to decide everything'], why: 'Delegation means one person holds the whole picture and each person knows their exact job. Nothing gets missed and nobody does everything alone.' },
        hi: { q: 'कैंप की रात आपके ग्रुप को जगह चुननी थी, खाने की योजना बनानी थी और तय करना था कि कौन लीड करेगा। टीम के रूप में काम करने का सबसे अच्छा तरीका क्या है?', o: ['सबसे ताक़तवर व्यक्ति सब कुछ करे', 'एक लीडर पर सहमत हों, जो हर व्यक्ति को साफ़ काम दे और बीच-बीच में उनसे पूछता रहे', 'हर कोई जो चाहे वो करे', 'सब कुछ तय करने के लिए ट्रेनर का इंतज़ार करें'], why: 'काम बाँटने (डेलिगेशन) का मतलब है एक व्यक्ति पूरी तस्वीर देखता है और हर व्यक्ति को अपना ठीक-ठीक काम पता होता है। कुछ छूटता नहीं और कोई अकेला सब नहीं करता।' },
        mr: { q: 'कॅम्पच्या रात्री तुमच्या ग्रुपला जागा निवडायची होती, जेवणाचे नियोजन करायचे होते आणि कोण लीड करणार ते ठरवायचे होते. टीम म्हणून काम करण्याचा सगळ्यात चांगला मार्ग कोणता?', o: ['सगळ्यात ताकदवान व्यक्तीने सगळे करावे', 'एका लीडरवर एकमत करा, जो प्रत्येकाला स्पष्ट काम देतो आणि मधूनमधून त्यांच्याकडे चौकशी करतो', 'प्रत्येकाने हवे ते करावे', 'सगळे ठरवण्यासाठी ट्रेनरची वाट पाहा'], why: 'काम वाटणे (डेलिगेशन) म्हणजे एक व्यक्ती संपूर्ण चित्र पाहते आणि प्रत्येकाला आपले नेमके काम माहीत असते. काही सुटत नाही आणि कोणी एकटा सगळे करत नाही.' } },
      { star: 0, ans: 1, src: 'Training: team sections; Module 2.7',
        en: { q: 'Which team keeps the record of the trip: photos, notes, attendance and the trip report?', o: ['Pantry team', 'Documentation team', 'Load ferry team', 'Technical team'], why: 'The documentation team records the trip. The pantry team handles food and cooking. The load ferry team moves the group\'s loads. The technical team handles ropes, safety equipment and gear.' },
        hi: { q: 'कौन-सी टीम ट्रिप का रिकॉर्ड रखती है: फ़ोटो, नोट्स, हाज़िरी और ट्रिप रिपोर्ट?', o: ['पैंट्री टीम', 'डॉक्यूमेंटेशन टीम', 'लोड फ़ेरी टीम', 'टेक्निकल टीम'], why: 'डॉक्यूमेंटेशन टीम ट्रिप का रिकॉर्ड रखती है। पैंट्री टीम खाना और खाना बनाने का काम सँभालती है। लोड फ़ेरी टीम ग्रुप का सामान ढोती है। टेक्निकल टीम रस्सी, सुरक्षा का सामान और गियर सँभालती है।' },
        mr: { q: 'कोणती टीम ट्रिपची नोंद ठेवते: फोटो, नोट्स, हजेरी आणि ट्रिप रिपोर्ट?', o: ['पॅन्ट्री टीम', 'डॉक्युमेंटेशन टीम', 'लोड फेरी टीम', 'टेक्निकल टीम'], why: 'डॉक्युमेंटेशन टीम ट्रिपची नोंद ठेवते. पॅन्ट्री टीम जेवण आणि स्वयंपाक सांभाळते. लोड फेरी टीम ग्रुपचे सामान वाहून नेते. टेक्निकल टीम दोर, सुरक्षेचे साहित्य आणि गियर सांभाळते.' } },
      { star: 0, ans: 2, src: 'Training: partner sharing game',
        en: { q: 'You meet a participant for the first time. Which question helps you get to know them best?', o: ['"Are you okay?"', '"Did you bring water?"', '"What made you want to come to the mountains today?"', '"Is this your first trek?"'], why: 'Open questions (what, why, how) invite people to share. Yes or no questions end the conversation. Asking well is a skill, and it is how relationships start. Share something about yourself too.' },
        hi: { q: 'आप किसी प्रतिभागी से पहली बार मिलते हैं। कौन-सा सवाल उन्हें सबसे अच्छी तरह जानने में मदद करता है?', o: ['"आप ठीक हैं?"', '"पानी लाए हैं?"', '"आज पहाड़ों पर आने का मन क्यों हुआ?"', '"क्या यह आपका पहला ट्रेक है?"'], why: 'खुले सवाल (क्या, क्यों, कैसे) लोगों को अपनी बात कहने का मौका देते हैं। हाँ या ना वाले सवालों से बातचीत रुक जाती है। अच्छे से पूछना एक हुनर है, और रिश्ते ऐसे ही शुरू होते हैं। अपने बारे में भी कुछ बताएँ।' },
        mr: { q: 'तुम्ही एका सहभागीला पहिल्यांदा भेटता. कोणता प्रश्न त्यांना सगळ्यात चांगले ओळखायला मदत करतो?', o: ['"तुम्ही ठीक आहात ना?"', '"पाणी आणलंय का?"', '"आज डोंगरात यावंसं का वाटलं?"', '"हा तुमचा पहिला ट्रेक आहे का?"'], why: 'मोकळे प्रश्न (काय, का, कसे) लोकांना आपली गोष्ट सांगायची संधी देतात. हो किंवा नाही च्या प्रश्नांनी गप्पा थांबतात. चांगले विचारणे हे एक कौशल्य आहे, आणि नाती अशीच सुरू होतात. स्वतःबद्दलही काहीतरी सांगा.' } },
      { star: 1, ans: 2, src: 'Module 11.1',
        en: { q: 'Lightning starts while the group is on a ridge. Which leadership style do you use?', o: ['Stepping back: let the group decide', 'Facilitating: give the group a task and watch', 'Directive: short, clear commands, no discussion', 'Guiding: share your idea and ask what they think'], why: 'In safety and emergencies the leader takes control: "Everyone stop. Now. Come back here. We go down this way."' },
        hi: { q: 'ग्रुप पहाड़ की धार पर है और बिजली शुरू हो जाती है। आप कौन-सी लीडरशिप शैली अपनाएँगे?', o: ['पीछे हटना (स्टेपिंग बैक): ग्रुप को तय करने दें', 'सहायक (फ़ैसिलिटेटिंग): ग्रुप को काम दें और देखें', 'निर्देशात्मक (डायरेक्टिव): छोटे, साफ़ आदेश, कोई बहस नहीं', 'मार्गदर्शक (गाइडिंग): अपना विचार बताएँ और उनकी राय पूछें'], why: 'सुरक्षा और इमरजेंसी में लीडर पूरी कमान लेता है: "सब रुको। अभी। यहाँ वापस आओ। हम इस तरफ़ से नीचे जाएँगे।"' },
        mr: { q: 'ग्रुप धारेवर असताना वीज सुरू होते. तुम्ही कोणती लीडरशिप शैली वापराल?', o: ['मागे राहणे (स्टेपिंग बॅक): ग्रुपला ठरवू द्या', 'सहायक (फॅसिलिटेटिंग): ग्रुपला काम द्या आणि पाहा', 'आदेशात्मक (डायरेक्टिव): छोट्या, स्पष्ट सूचना, चर्चा नाही', 'मार्गदर्शक (गाइडिंग): तुमचा विचार सांगा आणि त्यांचे मत विचारा'], why: 'सुरक्षा आणि इमर्जन्सीमध्ये लीडर पूर्ण ताबा घेतो: "सगळे थांबा. आत्ता. इकडे परत या. आपण या बाजूने खाली जाऊ."' } },
      { star: 0, ans: 2, src: 'Training: camp night; Module 11.1',
        en: { q: 'On the camp night the trainer gave your group the whole job and stood back, stepping in only for safety. Which leadership style was that?', o: ['Directive', 'Guiding', 'Stepping back', 'No leadership at all'], why: 'Stepping back is for developing leaders: give them the job, stand back, only step in for safety. It is how you learn to lead, because nobody does it for you.' },
        hi: { q: 'कैंप की रात ट्रेनर ने पूरा काम आपके ग्रुप को दिया और ख़ुद पीछे रहे, सिर्फ़ सुरक्षा के लिए बीच में आए। वह कौन-सी लीडरशिप शैली थी?', o: ['निर्देशात्मक (डायरेक्टिव)', 'मार्गदर्शक (गाइडिंग)', 'पीछे हटना (स्टेपिंग बैक)', 'कोई लीडरशिप नहीं'], why: 'पीछे हटना (स्टेपिंग बैक) नए लीडर तैयार करने के लिए है: काम उन्हें दें, ख़ुद पीछे रहें, सिर्फ़ सुरक्षा के लिए बीच में आएँ। ऐसे ही लीड करना सीखते हैं, क्योंकि कोई और आपके लिए नहीं करता।' },
        mr: { q: 'कॅम्पच्या रात्री ट्रेनरने संपूर्ण काम तुमच्या ग्रुपला दिले आणि स्वतः मागे राहिले, फक्त सुरक्षेसाठी मध्ये आले. ती कोणती लीडरशिप शैली होती?', o: ['आदेशात्मक (डायरेक्टिव)', 'मार्गदर्शक (गाइडिंग)', 'मागे राहणे (स्टेपिंग बॅक)', 'लीडरशिपच नाही'], why: 'मागे राहणे (स्टेपिंग बॅक) नवे लीडर घडवण्यासाठी आहे: काम त्यांना द्या, स्वतः मागे राहा, फक्त सुरक्षेसाठी मध्ये या. असेच लीड करायला शिकतात, कारण तुमच्यासाठी दुसरे कोणी करत नाही.' } },
      { star: 0, ans: 0, src: 'Training: AIRC skits',
        en: { q: 'An AIRC briefing has six steps. Which order is right?', o: ['Attention, Instruction, Information, Reason, Review, Confirmation', 'Instruction, Attention, Reason, Information, Confirmation, Review', 'Reason, Attention, Information, Instruction, Review, Confirmation', 'Attention, Reason, Review, Instruction, Information, Confirmation'], why: 'First get everyone\'s attention. Then say what to do, what they need to know, and why. Then go over the key points again, and confirm by asking one person by name.' },
        hi: { q: 'AIRC ब्रीफ़िंग में छह कदम होते हैं। सही क्रम कौन-सा है?', o: ['Attention, Instruction, Information, Reason, Review, Confirmation', 'Instruction, Attention, Reason, Information, Confirmation, Review', 'Reason, Attention, Information, Instruction, Review, Confirmation', 'Attention, Reason, Review, Instruction, Information, Confirmation'], why: 'पहले सबका ध्यान लें। फिर बताएँ क्या करना है, क्या जानना ज़रूरी है, और क्यों। फिर ख़ास बातें दोबारा दोहराएँ, और किसी एक का नाम लेकर पूछकर पुष्टि करें।' },
        mr: { q: 'AIRC ब्रीफिंगमध्ये सहा पायऱ्या असतात. योग्य क्रम कोणता?', o: ['Attention, Instruction, Information, Reason, Review, Confirmation', 'Instruction, Attention, Reason, Information, Confirmation, Review', 'Reason, Attention, Information, Instruction, Review, Confirmation', 'Attention, Reason, Review, Instruction, Information, Confirmation'], why: 'आधी सगळ्यांचे लक्ष वेधा. मग सांगा काय करायचे, काय माहीत असणे गरजेचे आहे, आणि का. मग महत्त्वाचे मुद्दे पुन्हा सांगा, आणि एका व्यक्तीचे नाव घेऊन विचारून खात्री करा.' } },
    ],
  },
};

// Pictures used by questions (no words inside, so they work in every language).
const QUIZ_IMG = { contour: (() => {
  let rings = '';
  for (let i = 0; i < 6; i++) { const l = 40 + 8 * i, r = 270 - 25 * i, cx = (l + r) / 2, rx = (r - l) / 2, ry = 70 - 11 * i; rings += `<ellipse cx="${cx}" cy="95" rx="${rx}" ry="${ry}" fill="${i === 5 ? '#e9d9bf' : 'none'}" stroke="#9c4f24" stroke-width="2"/>`; }
  return `<svg viewBox="0 0 310 190" role="img" aria-label="Contour lines of a hill: close together on the left, far apart on the right" xmlns="http://www.w3.org/2000/svg"><rect width="310" height="190" rx="12" fill="#fbf6ec"/>${rings}<path d="M290 22 l-7 16 h14 z" fill="#2c4535"/><text x="290" y="54" font-size="13" font-family="sans-serif" text-anchor="middle" fill="#2c4535">N</text></svg>`;
})() };

const QUIZ_UI = {
  en: { lang: 'English', title: 'Post-Training Quiz', sub: 'Foundation Training, 15 to 17 October 2026', chooseLang: 'Choose your language', name: 'Your name', phone: 'Your mobile number', phoneHint: '10 digits. This makes sure each person takes each quiz once.', chooseQuiz: 'Choose the quiz', rulesTitle: 'How this works',
    rules: ['There are 3 quizzes. Do all three, in any order, by 11:59 PM on 23 October. You can do them on different days.', 'Each quiz has {min} minutes. The timer starts only when you press Start, and it does not stop.', 'Use the same mobile number every time.', 'Sit where the network is good and your phone is charged. If the page closes, open the same link and enter the same number. Your quiz continues if time is left.', 'You can take each quiz only once. Once you choose an answer it is locked and you cannot go back. You will then see why the right answer is right.', '★ marks a safety question. If you miss one, your trainer will call you and talk it through.', 'There is no pass or fail. Your trainer sees your answers. Every answer is in your manual or was practised in training.'], closed: 'The quizzes closed at 11:59 PM on 23 October. Please message your trainer.',
    start: 'Start the quiz', next: 'Next question', finish: 'See my result', timeLeft: 'Time left', qOf: 'Question {i} of {n}', right: 'Correct.', wrong: 'The right answer is {L}.', why: 'Why', source: 'Manual section', star: 'Safety question',
    doneTitle: 'Well done for finishing.', timedOut: 'Time is up.', score: 'You got {s} out of {n}.', starAll: 'You got every ★ safety question right.', starMissed: '★ safety questions to go over with your trainer: {list}. Your trainer will call you within 2 days.', learning: 'The score is for learning, not for ranking.',
    taskTitle: 'One more thing (not scored, required)', taskBtn: 'Send on WhatsApp', other: 'Go to {quiz}', already: 'You have already taken this quiz. Here is your result.', resume: 'Welcome back. Your quiz is still running.', errName: 'Please enter your name.', errPhone: 'Please enter a 10-digit mobile number.', errQuiz: 'Please choose a quiz.', errNet: 'Could not connect. Check your internet and try again.', errSrv: 'The quiz could not be saved just now. Please tell your trainer, then try again.', retry: 'Try again', notAnswered: 'Not answered', thanks: 'Thank you. The people in the mountains with you are counting on you knowing this.', saving: 'Saving…', back: 'Back' },
  hi: { lang: 'हिंदी', title: 'ट्रेनिंग के बाद की क्विज़', sub: 'फ़ाउंडेशन ट्रेनिंग, 15 से 17 अक्टूबर 2026', chooseLang: 'अपनी भाषा चुनें', name: 'आपका नाम', phone: 'आपका मोबाइल नंबर', phoneHint: '10 अंक। इससे हर व्यक्ति हर क्विज़ एक ही बार देता है।', chooseQuiz: 'क्विज़ चुनें', rulesTitle: 'यह कैसे काम करता है',
    rules: ['कुल 3 क्विज़ हैं। तीनों क्विज़, किसी भी क्रम में, 23 अक्टूबर रात 11:59 बजे तक पूरी करें। आप इन्हें अलग-अलग दिन कर सकते हैं।', 'हर क्विज़ {min} मिनट की है। टाइमर तभी शुरू होता है जब आप स्टार्ट दबाते हैं, और फिर रुकता नहीं।', 'हर बार एक ही मोबाइल नंबर डालें।', 'ऐसी जगह बैठें जहाँ नेटवर्क अच्छा हो और फ़ोन चार्ज हो। अगर पेज बंद हो जाए, तो वही लिंक खोलें और वही नंबर डालें। समय बचा हो तो आपकी क्विज़ वहीं से आगे चलेगी।', 'हर क्विज़ सिर्फ़ एक बार दे सकते हैं। जवाब चुनते ही वह लॉक हो जाता है और आप पीछे नहीं जा सकते। फिर आपको दिखेगा कि सही जवाब सही क्यों है।', '★ का मतलब सुरक्षा वाला सवाल है। अगर कोई ग़लत हुआ, तो आपके ट्रेनर आपको कॉल करके उस पर बात करेंगे।', 'इसमें पास या फ़ेल नहीं है। आपके जवाब आपके ट्रेनर देखते हैं। हर जवाब आपके मैनुअल में है या ट्रेनिंग में कराया गया था।'], closed: 'क्विज़ 23 अक्टूबर रात 11:59 बजे बंद हो गई। कृपया अपने ट्रेनर को मैसेज करें।',
    start: 'क्विज़ शुरू करें', next: 'अगला सवाल', finish: 'मेरा नतीजा देखें', timeLeft: 'बचा समय', qOf: 'सवाल {i} / {n}', right: 'सही।', wrong: 'सही जवाब {L} है।', why: 'क्यों', source: 'मैनुअल सेक्शन', star: 'सुरक्षा सवाल',
    doneTitle: 'क्विज़ पूरी करने के लिए शाबाश।', timedOut: 'समय पूरा हुआ।', score: 'आपके {n} में से {s} जवाब सही हैं।', starAll: 'आपने हर ★ सुरक्षा सवाल सही किया।', starMissed: '★ सुरक्षा सवाल जिन पर ट्रेनर से बात करनी है: {list}। आपके ट्रेनर 2 दिन के अंदर आपको कॉल करेंगे।', learning: 'यह स्कोर सीखने के लिए है, तुलना के लिए नहीं।',
    taskTitle: 'एक और काम (नंबर नहीं मिलेंगे, पर ज़रूरी है)', taskBtn: 'WhatsApp पर भेजें', other: 'आगे बढ़ें: {quiz}', already: 'आप यह क्विज़ पहले ही दे चुके हैं। यह रहा आपका नतीजा।', resume: 'फिर से स्वागत है। आपकी क्विज़ अभी चल रही है।', errName: 'कृपया अपना नाम लिखें।', errPhone: 'कृपया 10 अंकों का मोबाइल नंबर लिखें।', errQuiz: 'कृपया क्विज़ चुनें।', errNet: 'कनेक्ट नहीं हो पाया। इंटरनेट चेक करके फिर से कोशिश करें।', errSrv: 'अभी क्विज़ सेव नहीं हो पाई। कृपया अपने ट्रेनर को बताएँ, फिर से कोशिश करें।', retry: 'फिर से कोशिश करें', notAnswered: 'जवाब नहीं दिया', thanks: 'धन्यवाद। पहाड़ों में आपके साथ चलने वाले लोग इस भरोसे पर हैं कि आपको यह पता है।', saving: 'सेव हो रहा है…', back: 'वापस' },
  mr: { lang: 'मराठी', title: 'प्रशिक्षणानंतरची क्विझ', sub: 'फाउंडेशन ट्रेनिंग, 15 ते 17 ऑक्टोबर 2026', chooseLang: 'तुमची भाषा निवडा', name: 'तुमचे नाव', phone: 'तुमचा मोबाईल नंबर', phoneHint: '10 अंक. यामुळे प्रत्येक व्यक्ती प्रत्येक क्विझ एकदाच देते.', chooseQuiz: 'क्विझ निवडा', rulesTitle: 'हे कसे चालते',
    rules: ['एकूण 3 क्विझ आहेत. तिन्ही क्विझ, कोणत्याही क्रमाने, 23 ऑक्टोबर रात्री 11:59 पर्यंत पूर्ण करा. तुम्ही त्या वेगवेगळ्या दिवशी करू शकता.', 'प्रत्येक क्विझ {min} मिनिटांची आहे. टायमर फक्त स्टार्ट दाबल्यावर सुरू होतो, आणि मग थांबत नाही.', 'प्रत्येक वेळी तोच मोबाईल नंबर टाका.', 'जिथे नेटवर्क चांगले आहे आणि फोन चार्ज आहे अशा ठिकाणी बसा. पेज बंद झाले तर तीच लिंक उघडा आणि तोच नंबर टाका. वेळ उरला असेल तर तुमची क्विझ तिथूनच पुढे चालू राहील.', 'प्रत्येक क्विझ फक्त एकदाच देता येते. उत्तर निवडताच ते लॉक होते आणि तुम्ही मागे जाऊ शकत नाही. मग तुम्हाला दिसेल की बरोबर उत्तर बरोबर का आहे.', '★ म्हणजे सुरक्षेचा प्रश्न. तो चुकला तर तुमचे ट्रेनर तुम्हाला कॉल करून त्यावर बोलतील.', 'यात पास किंवा नापास नाही. तुमची उत्तरे तुमचे ट्रेनर पाहतात. प्रत्येक उत्तर तुमच्या मॅन्युअलमध्ये आहे किंवा ट्रेनिंगमध्ये करून घेतले होते.'], closed: 'क्विझ 23 ऑक्टोबर रात्री 11:59 ला बंद झाली. कृपया तुमच्या ट्रेनरला मेसेज करा.',
    start: 'क्विझ सुरू करा', next: 'पुढचा प्रश्न', finish: 'माझा निकाल पाहा', timeLeft: 'उरलेला वेळ', qOf: 'प्रश्न {i} / {n}', right: 'बरोबर.', wrong: 'बरोबर उत्तर {L} आहे.', why: 'का', source: 'मॅन्युअल विभाग', star: 'सुरक्षेचा प्रश्न',
    doneTitle: 'क्विझ पूर्ण केल्याबद्दल शाब्बास.', timedOut: 'वेळ संपली.', score: 'तुमची {n} पैकी {s} उत्तरे बरोबर आहेत.', starAll: 'तुम्ही प्रत्येक ★ सुरक्षेचा प्रश्न बरोबर सोडवला.', starMissed: '★ सुरक्षेचे प्रश्न ज्यांवर ट्रेनरशी बोलायचे आहे: {list}. तुमचे ट्रेनर 2 दिवसांत तुम्हाला कॉल करतील.', learning: 'हा स्कोअर शिकण्यासाठी आहे, तुलना करण्यासाठी नाही.',
    taskTitle: 'अजून एक काम (गुण नाहीत, पण आवश्यक)', taskBtn: 'WhatsApp वर पाठवा', other: 'पुढे चला: {quiz}', already: 'तुम्ही ही क्विझ आधीच दिली आहे. हा तुमचा निकाल.', resume: 'पुन्हा स्वागत. तुमची क्विझ अजून चालू आहे.', errName: 'कृपया तुमचे नाव लिहा.', errPhone: 'कृपया 10 अंकी मोबाईल नंबर लिहा.', errQuiz: 'कृपया क्विझ निवडा.', errNet: 'कनेक्ट होऊ शकले नाही. इंटरनेट तपासून पुन्हा प्रयत्न करा.', errSrv: 'आत्ता क्विझ सेव्ह होऊ शकली नाही. कृपया तुमच्या ट्रेनरला सांगा, मग पुन्हा प्रयत्न करा.', retry: 'पुन्हा प्रयत्न करा', notAnswered: 'उत्तर दिले नाही', thanks: 'धन्यवाद. डोंगरात तुमच्यासोबत असणारे लोक तुम्हाला हे माहीत असण्यावर अवलंबून आहेत.', saving: 'सेव्ह होत आहे…', back: 'मागे' },
};

// ---------- server ----------
const qjson = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
async function qat(env, method, path, body) {
  const r = await fetch(`https://api.airtable.com/v0/${BASE}/${QA.table}${path}`, { method, headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}`, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Airtable ${r.status} ${JSON.stringify(j.error || j).slice(0, 200)}`);
  return j;
}
const qrand = () => [...crypto.getRandomValues(new Uint8Array(12))].map((b) => b.toString(16).padStart(2, '0')).join('');
function qstate(rec) {
  const f = rec.fields || {};
  let a = {}; try { a = JSON.parse(f[QA.data] || '{}'); } catch (e) { a = {}; }
  return { id: rec.id, key: f[QA.key], quiz: +(Object.keys(QUIZZES).find((k) => QUIZZES[k].name === f[QA.quiz]) || 1), started: Date.parse(f[QA.started]), status: f[QA.status] || 'In progress', a, name: f[QA.name] || '' };
}
function qreveal(quiz, n, lang) {
  const q = QUIZZES[quiz].qs[n]; const t = q[lang] || q.en;
  return { correct: q.ans, why: t.why || '', src: q.src };
}
function qresult(st) {
  const qs = QUIZZES[st.quiz].qs;
  let score = 0; const starMissed = [];
  qs.forEach((q, i) => { const x = st.a[i]; const ok = x && x.c === q.ans; if (ok) score++; else if (q.star) starMissed.push(i + 1); });
  return { score, outOf: qs.length, starMissed };
}
async function qfinish(env, st, status) {
  const res = qresult(st);
  const L = 'ABCD';
  const lines = QUIZZES[st.quiz].qs.map((q, i) => { const x = st.a[i]; return `${i + 1}${q.star ? ' ★' : ''}: ${x ? L[x.c] + (x.c === q.ans ? ' (right)' : ` (wrong, answer ${L[q.ans]})`) : `not answered (answer ${L[q.ans]})`}`; }).join('\n');
  await qat(env, 'PATCH', `/${st.id}`, { typecast: true, fields: { [QA.status]: status, [QA.finished]: new Date().toISOString(), [QA.score]: res.score, [QA.outOf]: res.outOf, [QA.starMissed]: res.starMissed.join(', '), [QA.needsCall]: res.starMissed.length > 0, [QA.answers]: lines } });
  st.status = status;
  return res;
}
function qpublic(st, lang) {
  const deadline = st.started + QUIZ_MINUTES * 60000;
  const answered = {};
  Object.keys(st.a).forEach((k) => { answered[k] = { c: st.a[k].c, ...qreveal(st.quiz, +k, lang) }; });
  return { id: st.id, key: st.key, quiz: st.quiz, status: st.status, now: Date.now(), deadline, answered, result: st.status === 'In progress' ? null : qresult(st) };
}
async function quizApi(request, env, path) {
  if (request.method !== 'POST') return qjson({ error: 'method' }, 405);
  let b; try { b = await request.json(); } catch (e) { return qjson({ error: 'bad json' }, 400); }
  const lang = QUIZ_LANGS[b.lang] ? b.lang : 'en';
  try {
    if (path === '/quiz/api/start') {
      const quiz = QUIZZES[b.quiz] ? +b.quiz : 0;
      const phone = String(b.phone || '').replace(/\D/g, '').slice(-10);
      const name = String(b.name || '').trim().slice(0, 80);
      if (!quiz || phone.length !== 10 || !name) return qjson({ error: 'input' }, 400);
      const formula = `AND({Phone}='${phone}',{Quiz}='${QUIZZES[quiz].name}')`;
      const found = await qat(env, 'GET', `?returnFieldsByFieldId=true&maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`);
      let st, fresh = false;
      if (found.records && found.records.length) {
        st = qstate(found.records[0]);
        if (st.status === 'In progress' && Date.now() > st.started + QUIZ_MINUTES * 60000 + 15000) await qfinish(env, st, 'Timed out');
      } else {
        if (Date.now() >= QUIZ_CLOSES) return qjson({ error: 'closed' }, 403);
        const now = new Date().toISOString();
        const rec = await qat(env, 'POST', '', { typecast: true, returnFieldsByFieldId: true, fields: { [QA.title]: `${name} · Quiz ${quiz}`, [QA.name]: name, [QA.phone]: phone, [QA.quiz]: QUIZZES[quiz].name, [QA.lang]: QUIZ_LANGS[lang], [QA.status]: 'In progress', [QA.started]: now, [QA.outOf]: QUIZZES[quiz].qs.length, [QA.data]: '{}', [QA.key]: qrand() } });
        st = qstate(rec); fresh = true;
      }
      return qjson({ ...qpublic(st, lang), fresh });
    }
    if (path === '/quiz/api/answer' || path === '/quiz/api/finish') {
      if (!/^rec[A-Za-z0-9]{14}$/.test(String(b.id || ''))) return qjson({ error: 'id' }, 400);
      // The single-record endpoint returns fields by name, so look the record up through the list endpoint instead.
      const got = await qat(env, 'GET', `?returnFieldsByFieldId=true&maxRecords=1&filterByFormula=${encodeURIComponent(`RECORD_ID()='${b.id}'`)}`);
      const rec = got.records && got.records[0];
      if (!rec) return qjson({ error: 'id' }, 404);
      const st = qstate(rec);
      if (!st.key || st.key !== b.key) return qjson({ error: 'key' }, 403);
      const late = Date.now() > st.started + QUIZ_MINUTES * 60000 + 15000;
      if (st.status === 'In progress' && late) { await qfinish(env, st, 'Timed out'); return qjson(qpublic(st, lang)); }
      if (path === '/quiz/api/finish') {
        if (st.status === 'In progress') await qfinish(env, st, Object.keys(st.a).length >= QUIZZES[st.quiz].qs.length ? 'Finished' : 'Timed out');
        return qjson(qpublic(st, lang));
      }
      const n = Number(b.q), c = Number(b.choice);
      const total = QUIZZES[st.quiz].qs.length;
      if (!(n >= 0 && n < total) || !(c >= 0 && c < 4)) return qjson({ error: 'input' }, 400);
      if (st.status !== 'In progress') return qjson(qpublic(st, lang));
      if (!st.a[n]) {
        st.a[n] = { c, t: Date.now() };
        await qat(env, 'PATCH', `/${st.id}`, { typecast: true, fields: { [QA.data]: JSON.stringify(st.a), [QA.lang]: QUIZ_LANGS[lang] } });
        if (Object.keys(st.a).length >= total) await qfinish(env, st, 'Finished');
      }
      return qjson(qpublic(st, lang));
    }
    return qjson({ error: 'not found' }, 404);
  } catch (e) {
    return qjson({ error: 'server', detail: String(e.message || e).slice(0, 300) }, 502);
  }
}

function quizPage() {
  // Questions go to the page without answers, "why" lines or sources. Those come from the server after each answer.
  const pub = {};
  for (const k of Object.keys(QUIZZES)) {
    const Q = QUIZZES[k];
    pub[k] = { title: Q.title, read: Q.read, task: Q.task, qs: Q.qs.map((q) => ({ star: q.star, img: q.img ? QUIZ_IMG[q.img] : '', en: { q: q.en.q, o: q.en.o }, hi: { q: q.hi.q, o: q.hi.o }, mr: { q: q.mr.q, o: q.mr.o }, hg: q.hg ? { q: q.hg.q, o: q.hg.o } : undefined })) };
  }
  const json = JSON.stringify({ quizzes: pub, ui: QUIZ_UI, minutes: QUIZ_MINUTES, wa: QUIZ_TRAINER_WA }).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>Post-Training Quiz | Rock &amp; Anchor</title><link rel="icon" type="image/png" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
<meta name="theme-color" content="#f6f1e8"><style>${QUIZ_CSS}</style></head><body>
<header class="qz-top"><a href="/" aria-label="Rock &amp; Anchor home"><img src="/logo.png" alt="Rock &amp; Anchor" width="56" height="46"></a><div class="qz-lang" id="qz-lang" role="group" aria-label="Language"></div></header>
<main id="qz" aria-live="polite"><noscript><p class="qz-card">Please open this page in Chrome with JavaScript turned on.</p></noscript></main>
<script type="application/json" id="qz-data">${json}</script><script>${QUIZ_JS}</script></body></html>`;
}

const QUIZ_JS = String.raw`(function(){
var D=JSON.parse(document.getElementById('qz-data').textContent),root=document.getElementById('qz'),langBar=document.getElementById('qz-lang');
var L='ABCD',lang=ls('qz-lang')||'',S=null,cur=0,timer=null,skew=0,busy=false,pick={name:'',phone:'',quiz:0},msg='',showLast=null;
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
function h(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function t(k,r){var s=(D.ui[lang||'en']||D.ui.en)[k];if(r)for(var x in r)s=s.split('{'+x+'}').join(r[x]);return s}
var LANGS=['en','hi','mr','hg'];
function htmlLang(k){return k==='en'?'en-IN':k==='hg'?'hi-Latn':k}
function Q(){return D.quizzes[S.quiz]}
function nextQ(){var n=Object.keys(D.quizzes).length;return S.quiz%n+1}
function txt(q){return q[lang]||q.en}
// same shuffled answer order every time for this attempt (seeded by the attempt key)
function order(n){var seed=0,k=S.key+'|'+n;for(var i=0;i<k.length;i++)seed=(seed*31+k.charCodeAt(i))>>>0;var a=[0,1,2,3];for(var j=3;j>0;j--){seed=(seed*1103515245+12345)>>>0;var r=seed%(j+1);var tmp=a[j];a[j]=a[r];a[r]=tmp}return a}
function api(p,body){body.lang=lang||'en';return fetch('/quiz/api/'+p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json().then(function(j){if(!r.ok){j=j||{};j.srv=1;throw j}return j})})}
function drawLang(){langBar.innerHTML=LANGS.map(function(k){return '<button type="button" data-lang="'+k+'" class="'+(lang===k?'on':'')+'" lang="'+k+'">'+D.ui[k].lang+'</button>'}).join('');langBar.hidden=!lang}
function setLang(k){lang=k;ls('qz-lang',k);document.documentElement.lang=htmlLang(k);drawLang();render()}
function mmss(ms){ms=Math.max(0,ms);var s=Math.ceil(ms/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function left(){return S.deadline-(Date.now()+skew)}
function tick(){var el=document.getElementById('qz-time');if(!S||S.status!=='In progress'){clearInterval(timer);timer=null;return}var ms=left();if(el){el.textContent=mmss(ms);el.parentNode.classList.toggle('low',ms<120000)}if(ms<=0){clearInterval(timer);timer=null;finish()}}
function startTimer(){if(!timer)timer=setInterval(tick,500);tick()}
function firstOpen(){var n=Q().qs.length;for(var i=0;i<n;i++)if(!S.answered[i])return i;return n}
function load(j){S=j;skew=j.now-Date.now();if(S.status==='In progress'){ls('qz-att',JSON.stringify({id:S.id,key:S.key,quiz:S.quiz,phone:pick.phone,name:pick.name}));cur=Math.min(firstOpen(),Q().qs.length-1);if(firstOpen()<Q().qs.length&&S.answered[cur])cur=firstOpen();startTimer()}else{ls('qz-att',null)}render()}
function render(){
  if(!lang){root.innerHTML='<section class="qz-card qz-pick"><p class="qz-k">Rock &amp; Anchor</p><h1>Choose your language<br><span lang="hi">अपनी भाषा चुनें</span><br><span lang="mr">तुमची भाषा निवडा</span><br><span lang="hi-Latn">Apni bhasha chunein</span></h1><div class="qz-langs">'+LANGS.map(function(k){return '<button type="button" class="qz-big" data-lang="'+k+'" lang="'+k+'">'+D.ui[k].lang+'</button>'}).join('')+'</div></section>';return}
  if(!S){
    root.innerHTML='<section class="qz-card"><p class="qz-k">'+h(t('sub'))+'</p><h1>'+h(t('title'))+'</h1>'+(msg?'<p class="qz-err" role="alert">'+h(msg)+'</p>':'')+
    '<label class="qz-f"><span>'+h(t('name'))+'</span><input id="qz-name" autocomplete="name" value="'+h(pick.name)+'"></label>'+
    '<label class="qz-f"><span>'+h(t('phone'))+'</span><input id="qz-phone" type="tel" inputmode="numeric" maxlength="14" autocomplete="tel" value="'+h(pick.phone)+'"><small>'+h(t('phoneHint'))+'</small></label>'+
    '<p class="qz-f"><span>'+h(t('chooseQuiz'))+'</span></p><div class="qz-quizzes">'+Object.keys(D.quizzes).map(function(k){k=+k;var z=D.quizzes[k];return '<button type="button" class="qz-quiz'+(pick.quiz===k?' on':'')+'" data-quiz="'+k+'"><b>'+h(z.title[lang])+'</b><span>'+h(z.read[lang])+'</span></button>'}).join('')+'</div>'+
    '<div class="qz-rules"><h2>'+h(t('rulesTitle'))+'</h2><ul>'+t('rules').map(function(r){return '<li>'+h(r.split('{min}').join(D.minutes))+'</li>'}).join('')+'</ul></div>'+
    '<button type="button" class="qz-btn" data-start'+(busy?' disabled':'')+'>'+h(busy?t('saving'):t('start'))+'</button></section>';return}
  if(S.status!=='In progress'&&showLast===null){renderResult();return}
  var qs=Q().qs,n=qs.length,q=qs[cur],tx=txt(q),ord=order(cur),ans=S.answered[cur];
  var head='<div class="qz-bar"><div class="qz-timer"><span>'+h(t('timeLeft'))+'</span><b id="qz-time">'+mmss(left())+'</b></div><div class="qz-prog"><span>'+h(t('qOf',{i:cur+1,n:n}))+'</span><div class="qz-track"><i style="width:'+Math.round(Object.keys(S.answered).length/n*100)+'%"></i></div></div></div>';
  var body='<section class="qz-card qz-q">'+(q.star?'<p class="qz-star">★ '+h(t('star'))+'</p>':'')+'<h2>'+h(tx.q)+'</h2>'+(q.img?'<div class="qz-img">'+q.img+'</div>':'')+'<div class="qz-opts">'+ord.map(function(o,i){var cls='';if(ans){if(o===ans.correct)cls=' ok';else if(o===ans.c)cls=' bad';else cls=' dim'}return '<button type="button" class="qz-opt'+cls+'" data-o="'+o+'"'+(ans||busy?' disabled':'')+'><span class="qz-l">'+L[i]+'</span><span>'+h(tx.o[o])+'</span></button>'}).join('')+'</div>';
  if(ans){var dl=L[ord.indexOf(ans.correct)];body+='<div class="qz-why '+(ans.c===ans.correct?'ok':'bad')+'"><p class="qz-verdict">'+h(ans.c===ans.correct?t('right'):t('wrong',{L:dl}))+'</p>'+(ans.why?'<p><b>'+h(t('why'))+':</b> '+h(ans.why)+'</p>':'')+'<p class="qz-src">'+h(t('source'))+': '+h(ans.src)+'</p></div>';
    var more=firstOpen()<n;body+='<button type="button" class="qz-btn" '+(more?'data-next':'data-finish')+'>'+h(more?t('next'):t('finish'))+'</button>'}
  else if(busy)body+='<p class="qz-saving">'+h(t('saving'))+'</p>';
  if(msg)body+='<p class="qz-err" role="alert">'+h(msg)+' <button type="button" class="qz-link" data-retry>'+h(t('retry'))+'</button></p>';
  root.innerHTML=head+body+'</section>';
}
function renderResult(){
  var r=S.result||{score:0,outOf:Q().qs.length,starMissed:[]},qs=Q().qs;
  var x='<section class="qz-card qz-res"><p class="qz-k">'+h(Q().title[lang])+'</p>'+(S.already?'<p class="qz-note">'+h(t('already'))+'</p>':'')+'<h1>'+h(S.status==='Timed out'?t('timedOut'):t('doneTitle'))+'</h1><p class="qz-score">'+h(t('score',{s:r.score,n:r.outOf}))+'</p>';
  x+=r.starMissed.length?'<p class="qz-starmiss">'+h(t('starMissed',{list:r.starMissed.join(', ')}))+'</p>':'<p class="qz-starok">'+h(t('starAll'))+'</p>';
  x+='<p class="qz-small">'+h(t('learning'))+'</p><ol class="qz-review">'+qs.map(function(q,i){var a=S.answered[i],ok=a&&a.c===a.correct,tx=txt(q);return '<li class="'+(ok?'ok':'bad')+'"><span class="qz-mark">'+(ok?'✓':'✗')+'</span><div><b>'+(q.star?'★ ':'')+h(tx.q)+'</b>'+(a?'':'<em>'+h(t('notAnswered'))+'</em>')+(a&&!ok?'<em>'+h(tx.o[a.correct])+'</em>':'')+'</div></li>'}).join('')+'</ol>';
  var task=Q().task[lang];x+='<div class="qz-task"><h2>'+h(t('taskTitle'))+'</h2><p>'+h(task)+'</p><a class="qz-btn" href="https://wa.me/'+D.wa+'?text='+encodeURIComponent((pick.name?pick.name+': ':'')+Q().title[lang])+'" target="_blank" rel="noopener">'+h(t('taskBtn'))+'</a></div><p class="qz-thanks">'+h(t('thanks'))+'</p>'+'<button type="button" class="qz-btn qz-other" data-other>'+h(t('other',{quiz:D.quizzes[nextQ()].title[lang]}))+'</button></section>';
  root.innerHTML=x;
}
function finish(){if(!S||busy)return;busy=true;api('finish',{id:S.id,key:S.key}).then(function(j){busy=false;load(j)}).catch(function(e){busy=false;msg=t(e&&e.srv?'errSrv':'errNet');render()})}
function start(){
  var nm=(document.getElementById('qz-name')||{}).value||'',ph=((document.getElementById('qz-phone')||{}).value||'').replace(/\D/g,'').slice(-10);pick.name=nm.trim();pick.phone=ph;
  if(!pick.name){msg=t('errName');render();return}if(ph.length!==10){msg=t('errPhone');render();return}if(!pick.quiz){msg=t('errQuiz');render();return}
  msg='';busy=true;render();
  api('start',{name:pick.name,phone:ph,quiz:pick.quiz}).then(function(j){busy=false;if(!j.fresh&&j.status!=='In progress')j.already=1;load(j)}).catch(function(e){busy=false;msg=t(e&&e.error==='closed'?'closed':e&&e.srv?'errSrv':'errNet');render()});
}
function answer(o){if(busy||!S)return;var n=cur;busy=true;msg='';render();api('answer',{id:S.id,key:S.key,q:n,choice:o}).then(function(j){busy=false;var keep=n;if(j.status==='Finished'&&j.answered[keep])showLast=keep;load(j);if(S.status==='In progress'||showLast!==null){cur=keep;render()}}).catch(function(e){busy=false;msg=t(e&&e.srv?'errSrv':'errNet');render()})}
root.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
  if(b.dataset.lang){setLang(b.dataset.lang);return}
  if(b.dataset.quiz){pick.quiz=+b.dataset.quiz;msg='';pick.name=(document.getElementById('qz-name')||{}).value||pick.name;pick.phone=(document.getElementById('qz-phone')||{}).value||pick.phone;render();return}
  if(b.hasAttribute('data-start')){start();return}
  if(b.dataset.o!==undefined){answer(+b.dataset.o);return}
  if(b.hasAttribute('data-next')){cur=firstOpen();render();window.scrollTo(0,0);return}
  if(b.hasAttribute('data-other')){var o=nextQ();S=null;showLast=null;cur=0;msg='';ls('qz-att',null);pick.quiz=o;render();window.scrollTo(0,0);return}
  if(b.hasAttribute('data-finish')){if(S&&S.status!=='In progress'){showLast=null;render();window.scrollTo(0,0)}else finish();return}
  if(b.hasAttribute('data-retry')){msg='';if(S&&S.status==='In progress'&&left()<=0){finish();return}render();return}
});
langBar.addEventListener('click',function(e){var b=e.target.closest('button');if(b&&b.dataset.lang)setLang(b.dataset.lang)});
// resume an attempt on this device after a refresh
var saved=null;try{saved=JSON.parse(ls('qz-att')||'null')}catch(e){}
if(lang&&!D.ui[lang])lang='';if(lang){document.documentElement.lang=htmlLang(lang)}
drawLang();
if(saved&&saved.phone&&saved.name){pick={name:saved.name,phone:saved.phone,quiz:saved.quiz};busy=true;render();api('start',{name:saved.name,phone:saved.phone,quiz:saved.quiz}).then(function(j){busy=false;load(j)}).catch(function(){busy=false;render()})}else render();
})();`;

const QUIZ_CSS = `
:root{--ink:#221d19;--ink2:#4a423b;--muted:#776c62;--paper:#f6f1e8;--card:#fffdf9;--line:#e4dccf;--forest:#2c4535;--moss:#e7eee3;--clay:#b8612f;--clay2:#9c4f24;--ok:#2f6b3f;--bad:#a63d2a}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font:400 17px/1.5 "DM Sans","Noto Sans Devanagari",system-ui,sans-serif}
[lang=hi],[lang=mr],html[lang=hi] body,html[lang=mr] body{font-family:"Noto Sans Devanagari","DM Sans",system-ui,sans-serif}
.qz-top{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:12px;height:68px;padding:0 16px;background:rgba(246,241,232,.92);-webkit-backdrop-filter:saturate(1.4) blur(10px);backdrop-filter:saturate(1.4) blur(10px);border-bottom:1px solid var(--line)}
.qz-top img{height:46px;width:auto;display:block}
.qz-lang{display:flex;gap:6px}.qz-lang[hidden]{display:none}
.qz-lang button{border:1.5px solid var(--line);background:var(--card);color:var(--ink);border-radius:999px;padding:6px 12px;font:inherit;font-size:14px;cursor:pointer}
@media(max-width:420px){.qz-lang{gap:4px}.qz-lang button{padding:5px 8px;font-size:13px}}
.qz-lang button.on{background:var(--forest);color:#fff;border-color:var(--forest);font-weight:700}
main{max-width:640px;margin:0 auto;padding:16px 16px 48px}
.qz-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:22px 18px;margin-top:12px}
.qz-k{font:700 12px/1.4 "DM Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--clay);margin:0 0 8px}
h1{font:800 34px/1.05 "Big Shoulders Display","Noto Sans Devanagari",sans-serif;text-transform:uppercase;margin:0 0 16px}
html[lang=hi] h1,html[lang=mr] h1,.qz-pick h1 span{font-family:"Noto Sans Devanagari",sans-serif;text-transform:none;font-weight:700;font-size:28px;line-height:1.3}
h2{font-size:21px;line-height:1.35;margin:0 0 14px}
.qz-langs{display:grid;gap:12px;margin-top:8px}
.qz-big{min-height:64px;border-radius:16px;border:2px solid var(--line);background:var(--paper);font:700 24px "Noto Sans Devanagari","DM Sans",sans-serif;color:var(--ink);cursor:pointer}
.qz-big:active,.qz-big:hover{border-color:var(--forest);background:var(--moss)}
.qz-f{display:block;margin:0 0 14px}.qz-f span{display:block;font-weight:700;margin-bottom:6px}.qz-f small{display:block;color:var(--muted);font-size:14px;margin-top:6px}
.qz-f input{width:100%;min-height:52px;border:2px solid var(--line);border-radius:12px;padding:10px 14px;font:inherit;font-size:19px;background:#fff;color:var(--ink)}
.qz-f input:focus{outline:none;border-color:var(--forest)}
.qz-quizzes{display:grid;gap:10px;margin-bottom:18px}
.qz-quiz{text-align:left;border:2px solid var(--line);border-radius:14px;background:var(--paper);padding:14px 16px;font:inherit;color:var(--ink);cursor:pointer;display:flex;flex-direction:column;gap:4px}
.qz-quiz b{font-size:18px}.qz-quiz span{color:var(--ink2);font-size:15px}
.qz-quiz.on{border-color:var(--forest);background:var(--moss)}
.qz-rules{background:var(--paper);border-radius:14px;padding:14px 16px;margin:4px 0 18px}.qz-rules h2{font-size:17px;margin:0 0 8px}
.qz-rules ul{margin:0;padding-left:20px}.qz-rules li{margin:6px 0;color:var(--ink2);font-size:15.5px}
.qz-btn{display:flex;align-items:center;justify-content:center;width:100%;min-height:56px;border:0;border-radius:999px;background:var(--clay);color:#fff;font:700 18px "DM Sans","Noto Sans Devanagari",sans-serif;cursor:pointer;text-decoration:none;margin-top:16px}
.qz-btn:disabled{opacity:.6}
.qz-err{color:var(--bad);font-weight:700;background:#fbeae5;border-radius:10px;padding:10px 12px}
.qz-link{background:none;border:0;color:var(--clay);font:inherit;font-weight:700;text-decoration:underline;cursor:pointer}
.qz-bar{position:sticky;top:68px;z-index:4;background:var(--paper);padding:8px 0;display:flex;gap:14px;align-items:center}
.qz-timer{background:var(--forest);color:#fff;border-radius:12px;padding:6px 12px;text-align:center;min-width:92px}
.qz-timer span{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.8}.qz-timer b{font-size:22px;font-variant-numeric:tabular-nums}
.qz-timer.low{background:var(--bad)}
.qz-prog{flex:1}.qz-prog span{font-weight:700;font-size:14px}.qz-track{height:8px;background:var(--line);border-radius:999px;overflow:hidden;margin-top:6px}.qz-track i{display:block;height:100%;background:var(--forest)}
.qz-star{display:inline-block;background:#fff1e6;color:var(--clay2);font-weight:700;border-radius:999px;padding:4px 12px;font-size:14px;margin:0 0 10px}
.qz-opts{display:grid;gap:10px}
.qz-opt{display:flex;gap:12px;align-items:flex-start;text-align:left;border:2px solid var(--line);border-radius:14px;background:var(--paper);padding:14px;font:inherit;color:var(--ink);cursor:pointer;min-height:56px}
.qz-opt:not(:disabled):active{border-color:var(--forest);background:var(--moss)}
.qz-l{flex:0 0 30px;height:30px;border-radius:50%;background:#fff;border:2px solid var(--line);display:grid;place-items:center;font-weight:700;font-size:15px}
.qz-opt.ok{border-color:var(--ok);background:#e6f2e8}.qz-opt.ok .qz-l{background:var(--ok);border-color:var(--ok);color:#fff}
.qz-opt.bad{border-color:var(--bad);background:#fbeae5}.qz-opt.bad .qz-l{background:var(--bad);border-color:var(--bad);color:#fff}
.qz-opt.dim{opacity:.55}.qz-opt:disabled{cursor:default}
.qz-why{margin-top:14px;border-radius:14px;padding:14px 16px;border-left:5px solid}
.qz-why.ok{background:#e6f2e8;border-color:var(--ok)}.qz-why.bad{background:#fbeae5;border-color:var(--bad)}
.qz-why p{margin:0 0 8px}.qz-verdict{font-weight:700;font-size:19px}.qz-src{color:var(--muted);font-size:14px;margin:0!important}
.qz-saving{color:var(--muted);text-align:center;margin-top:14px}
.qz-score{font-size:24px;font-weight:700;margin:0 0 10px}
.qz-starok{background:#e6f2e8;color:var(--ok);font-weight:700;border-radius:12px;padding:12px 14px}
.qz-starmiss{background:#fff1e6;color:var(--clay2);font-weight:700;border-radius:12px;padding:12px 14px}
.qz-note{background:var(--moss);border-radius:12px;padding:10px 12px;font-weight:700}
.qz-small{color:var(--muted);font-size:15px}
.qz-review{list-style:none;padding:0;margin:16px 0}.qz-review li{display:flex;gap:10px;padding:10px 0;border-top:1px solid var(--line);font-size:15.5px}
.qz-review b{font-weight:500}.qz-review em{display:block;font-style:normal;color:var(--ok);font-weight:700;margin-top:4px}
.qz-mark{flex:0 0 24px;font-weight:700}.qz-review .ok .qz-mark{color:var(--ok)}.qz-review .bad .qz-mark{color:var(--bad)}
.qz-task{background:var(--forest);color:#fff;border-radius:16px;padding:16px;margin-top:10px}.qz-task h2{font-size:18px}.qz-task p{color:#e2ebe4;margin:0}
.qz-task .qz-btn{background:#25d366}
.qz-img{margin:0 0 14px}.qz-img svg{display:block;width:100%;height:auto;max-width:420px;margin:0 auto}
.qz-other{background:var(--forest)}
.qz-thanks{color:var(--ink2);text-align:center;margin-top:18px}
`;

// One-Year Check-In form (rockandanchor.in/check-in). Added 26 Oct 2026.
// A client types an access code (one per company, in the Airtable table "Check-In Codes") and passes a Cloudflare Turnstile check.
// The server then gives a signed 60 minute pass, and the answers are saved to "Check-In Responses".
// On rockandanchor.in it needs two Worker settings (Cloudflare dashboard): TURNSTILE_SITEKEY (variable) and TURNSTILE_SECRET (secret).
// On workers.dev addresses (staging and preview) Turnstile does not accept those hostnames, so Cloudflare's published always-pass test keys are used there.
// The Airtable token needs write access to both tables.
// Until CK_LIVE is true the form answers only on workers.dev addresses. Once CK_LIVE is true it answers only on the real domain.
const CK_LIVE = true;
const CK = {
  codes: 'tblpkiQ9oTbIS7Y3g', resp: 'tbl8vGG97JWpxZeWa',
  c: { code: 'fldzReSkvnIWGkFZt', company: 'fldJFYrOw3p2VGHxz', month: 'fld4RwKfhSL7CrFpZ' },
  r: { title: 'fldTynzTaw6zu9mND', link: 'fld2aVWA6l0dz44vM', company: 'fldiQtxTEQ70XXwgG', role: 'fld3kdY5uwuMEC6y2', at: 'fldtZeBkbltlG133R', before: 'fldGdba2VipN6Egts', changed: 'fldA10uJN3NG3K9Ls', example: 'fld7l3v8nGhaCwpDj', notChanged: 'fld8dOhbjRF7FfVOJ', rating: 'fldorke7oGzXHTPzc', remember: 'fldB8KpEgMrmjeusr', again: 'fldI3t5H8ehgkhSl3', perm: 'fldfK66iGk1z2l1dl' },
};
const CK_PERMS = ['Share with our company name', 'Share without our name', 'Short quotes only', 'Private feedback only'];
const CK_PASS_MINUTES = 60;
const CK_TEST_SITE = '1x00000000000000000000AA', CK_TEST_SECRET = '1x0000000000000000000000000000000AA'; // public test values from Cloudflare docs
const ckTest = (request) => new URL(request.url).hostname.endsWith('.workers.dev');
const ckCfg = (env, request) => (ckTest(request) ? { site: CK_TEST_SITE, secret: CK_TEST_SECRET } : { site: env.TURNSTILE_SITEKEY || '', secret: env.TURNSTILE_SECRET || '' });
const ckAllowed = (request) => (CK_LIVE ? !ckTest(request) : ckTest(request));

const ckjson = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
async function ckat(env, table, method, path, body) {
  const r = await fetch(`https://api.airtable.com/v0/${BASE}/${table}${path}`, { method, headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}`, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Airtable ${r.status} ${JSON.stringify(j.error || j).slice(0, 200)}`);
  return j;
}
const ckb64 = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const ckunb64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
async function ckKey(env) {
  return crypto.subtle.importKey('raw', new TextEncoder().encode('checkin|' + env.AIRTABLE_TOKEN), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}
async function ckSign(env, payload) {
  const body = ckb64(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign('HMAC', await ckKey(env), new TextEncoder().encode(body));
  return body + '.' + ckb64(new Uint8Array(sig));
}
async function ckVerify(env, pass) {
  try {
    const [body, sig] = String(pass || '').split('.');
    if (!body || !sig) return null;
    const good = ckb64(new Uint8Array(await crypto.subtle.sign('HMAC', await ckKey(env), new TextEncoder().encode(body))));
    if (good !== sig) return null;
    const p = JSON.parse(new TextDecoder().decode(ckunb64(body)));
    return p.e > Date.now() ? p : null;
  } catch (e) { return null; }
}
async function ckTurnstile(env, request, token) {
  if (!token) return false;
  const form = new URLSearchParams({ secret: ckCfg(env, request).secret, response: String(token).slice(0, 2048) });
  const ip = request.headers.get('CF-Connecting-IP'); if (ip) form.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const j = await r.json().catch(() => ({}));
  return !!j.success;
}
const cktext = (v) => String(v == null ? '' : v).replace(/\r/g, '').trim().slice(0, 2000);

async function checkinApi(request, env, path) {
  if (request.method !== 'POST') return ckjson({ error: 'method' }, 405);
  const cfg0 = ckCfg(env, request);
  if (!cfg0.secret || !cfg0.site) return ckjson({ error: 'off' }, 503);
  let b; try { b = await request.json(); } catch (e) { return ckjson({ error: 'bad' }, 400); }
  try {
    if (path === '/check-in/api/code') {
      const code = String(b.code || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 40);
      if (!code) return ckjson({ error: 'nocode' }, 400);
      if (!(await ckTurnstile(env, request, b.token))) return ckjson({ error: 'captcha' }, 400);
      const formula = `AND({Active},UPPER({Code})='${code}')`;
      const got = await ckat(env, CK.codes, 'GET', `?returnFieldsByFieldId=true&maxRecords=1&filterByFormula=${encodeURIComponent(formula)}`);
      const rec = got.records && got.records[0];
      if (!rec) return ckjson({ error: 'badcode' }, 404);
      const company = rec.fields[CK.c.company] || '', month = rec.fields[CK.c.month] || '';
      const pass = await ckSign(env, { r: rec.id, co: company, e: Date.now() + CK_PASS_MINUTES * 60000 });
      return ckjson({ ok: true, company, month, pass });
    }
    if (path === '/check-in/api/submit') {
      if (cktext(b.website)) return ckjson({ ok: true }); // hidden field, only bots fill it
      const p = await ckVerify(env, b.pass);
      if (!p) return ckjson({ error: 'expired' }, 401);
      const owner = b.role === 'owner';
      const f = { [CK.r.link]: [p.r], [CK.r.company]: p.co, [CK.r.role]: owner ? 'Owner or booker' : 'Team member', [CK.r.at]: new Date().toISOString() };
      const a = b.a || {};
      let any = false;
      const put = (id, v) => { v = cktext(v); if (v) { f[id] = v; any = true; } };
      if (owner) {
        put(CK.r.before, a.before); put(CK.r.changed, a.changed); put(CK.r.example, a.example); put(CK.r.notChanged, a.notChanged);
        const n = parseInt(a.rating, 10); if (n >= 1 && n <= 5) { f[CK.r.rating] = n; any = true; }
        f[CK.r.perm] = CK_PERMS.includes(a.perm) ? a.perm : 'Private feedback only';
      } else {
        put(CK.r.remember, a.remember); put(CK.r.changed, a.changed);
        if (['Yes', 'Maybe', 'No'].includes(a.again)) { f[CK.r.again] = a.again; any = true; }
      }
      if (!any) return ckjson({ error: 'empty' }, 400);
      const day = new Date(Date.now() + 5.5 * 3600000).toISOString().slice(0, 10);
      f[CK.r.title] = `${p.co} · ${owner ? 'Owner' : 'Team member'} · ${day}`;
      await ckat(env, CK.resp, 'POST', '', { typecast: true, fields: f });
      return ckjson({ ok: true });
    }
  } catch (e) { console.error('check-in', e && e.message); return ckjson(ckTest(request) ? { error: 'srv', detail: String(e && e.message).slice(0, 300) } : { error: 'srv' }, 500); }
  return ckjson({ error: 'path' }, 404);
}

function checkinPage(env, request) {
  const k = ckCfg(env, request);
  const on = !!(k.secret && k.site);
  const cfg = JSON.stringify({ on, site: k.site, perms: CK_PERMS, wa: '918928794380' }).replace(/</g, '\\u003c');
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>A year later | Rock &amp; Anchor</title><link rel="icon" type="image/png" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet">
<meta name="theme-color" content="#f6f1e8"><style>${QUIZ_CSS}${CHECKIN_CSS}</style></head><body>
<header class="qz-top"><a href="/" aria-label="Rock &amp; Anchor home"><img src="/logo.png" alt="Rock &amp; Anchor" width="56" height="46"></a></header>
<main id="ck" aria-live="polite"><noscript><p class="qz-card">Please open this page with JavaScript turned on.</p></noscript></main>
<script type="application/json" id="ck-data">${cfg}</script>${on ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>' : ''}<script>${CHECKIN_JS}</script></body></html>`;
}

const CHECKIN_CSS = `
.qz-card h1{font:800 34px/1.05 "Big Shoulders Display",sans-serif;text-transform:uppercase;color:var(--forest);margin:0 0 10px}
.ck-k{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--clay);font-weight:700;margin:0 0 6px}
.ck-lead{color:var(--ink2);margin:0 0 16px}
.ck-card label:not(.ck-opt),.ck-q{display:block;font-weight:700;margin:18px 0 6px}
.ck-card .ck-hint{font-weight:400;color:var(--muted);font-size:15px;display:block}
.ck-card input[type=text],.ck-card textarea{width:100%;border:1.5px solid var(--line);border-radius:12px;padding:12px;font:inherit;background:#fff;color:var(--ink)}
.ck-card textarea{min-height:96px;resize:vertical}
.ck-card input[type=text]:focus,.ck-card textarea:focus{outline:2px solid var(--forest);outline-offset:1px}
.ck-opt{display:flex;gap:10px;align-items:flex-start;border:1.5px solid var(--line);border-radius:12px;padding:12px;margin:8px 0;background:#fff;cursor:pointer;font-weight:400}
.ck-opt input{margin-top:5px;accent-color:var(--forest)}.ck-opt b{font-weight:700}
.ck-rate{display:flex;gap:8px;flex-wrap:wrap}.ck-rate .ck-opt{margin:0;min-width:52px;justify-content:center}
.ck-btn{display:block;width:100%;margin-top:22px;background:var(--forest);color:#fff;border:0;border-radius:999px;padding:15px 20px;font:700 17px "DM Sans",sans-serif;cursor:pointer}
.ck-btn[disabled]{opacity:.55;cursor:default}
.ck-err{color:var(--bad);margin:12px 0 0;font-weight:500}
.ck-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.ck-ts{margin-top:16px;min-height:65px}
.ck-wa{display:inline-block;margin-top:14px;color:var(--forest);font-weight:700}
`;

const CHECKIN_JS = String.raw`(function(){
var D=JSON.parse(document.getElementById('ck-data').textContent),root=document.getElementById('ck'),pass='',co='',mo='',role='',tsid=null,tok='';
function h(t){return String(t==null?'':t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function post(p,b){return fetch('/check-in/api/'+p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}).then(function(r){return r.json().then(function(j){j.status=r.status;return j},function(){return{error:'srv',status:r.status}})})}
function say(m){var e=document.getElementById('ck-err');if(e)e.textContent=m||''}
function step1(){
  if(!D.on){root.innerHTML='<section class="qz-card"><p class="ck-k">Rock &amp; Anchor</p><h1>Not open yet</h1><p class="ck-lead">This page is not switched on yet. Please message us on WhatsApp and we will help.</p></section>';return}
  root.innerHTML='<section class="qz-card ck-card"><p class="ck-k">Rock &amp; Anchor</p><h1>A year later</h1><p class="ck-lead">Thank you for spending time with us. We would like to know, in your own words, if the experience changed anything for your team. Good or not so good, both help. There are no right answers, and &ldquo;nothing changed&rdquo; is a welcome answer.</p><label for="ck-code">Access code<span class="ck-hint">The person who shared this link will have given you a code.</span></label><input type="text" id="ck-code" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="40"><div class="ck-ts" id="ck-ts"></div><p class="ck-err" id="ck-err" role="alert"></p><button class="ck-btn" id="ck-go" type="button">Continue</button></section>';
  document.getElementById('ck-go').onclick=go;
  document.getElementById('ck-code').onkeydown=function(e){if(e.key==='Enter')go()};
  var tries=0;(function draw(){if(window.turnstile){tsid=turnstile.render('#ck-ts',{sitekey:D.site,callback:function(t){tok=t}});return}if(tries++<60)setTimeout(draw,250)})();
}
function go(){
  var code=document.getElementById('ck-code').value.trim();
  if(!code){say('Please type your access code.');return}
  if(!tok){say('Please wait for the check mark above, then press Continue.');return}
  var b=document.getElementById('ck-go');b.disabled=true;say('');
  post('code',{code:code,token:tok}).then(function(j){
    b.disabled=false;
    if(j.ok){pass=j.pass;co=j.company;mo=j.month;step2();return}
    tok='';if(window.turnstile&&tsid!==null)turnstile.reset(tsid);
    if(j.error==='badcode')say('We could not find that code. Please check it with the person who shared this link.');
    else if(j.error==='captcha')say('The check did not pass. Please try again.');
    else say('Something went wrong on our side. Please try again in a minute.');
  },function(){b.disabled=false;say('Could not connect. Please check your internet and try again.')});
}
function ta(id,label,hint){return '<label for="'+id+'">'+label+(hint?'<span class="ck-hint">'+hint+'</span>':'')+'</label><textarea id="'+id+'"></textarea>'}
function step2(){
  root.innerHTML='<section class="qz-card ck-card"><p class="ck-k">'+h(co)+(mo?' &middot; '+h(mo):'')+'</p><h1>Tell us how it went</h1><p class="ck-lead">Please think back to the experience with us. Who is answering?</p>'
  +'<label class="ck-opt"><input type="radio" name="role" value="owner"><span><b>I booked it, or lead the team</b><br>About 5 minutes</span></label>'
  +'<label class="ck-opt"><input type="radio" name="role" value="team"><span><b>I am part of the team</b><br>About 2 minutes. No name or number is asked.</span></label>'
  +'<div id="ck-form"></div></section>';
  var rs=root.querySelectorAll('input[name=role]');for(var i=0;i<rs.length;i++)rs[i].onchange=function(){role=this.value;form()};
}
function form(){
  var f=document.getElementById('ck-form'),x='';
  if(role==='owner'){
    x=ta('a-before','1. Before the experience, how did your team work together?')
     +ta('a-changed','2. Since then, what is different in how people talk or work with each other?','If nothing, please say so.')
     +ta('a-example','3. Please tell us one real thing that happened afterwards.','Who was there, what happened, and roughly when.')
     +ta('a-not','4. Was there something you hoped would change that did not?')
     +'<div class="ck-q">5. My team feels more connected than before.<span class="ck-hint">1 means not at all, 5 means very much</span></div><div class="ck-rate">'+[1,2,3,4,5].map(function(n){return '<label class="ck-opt"><input type="radio" name="rating" value="'+n+'">'+n+'</label>'}).join('')+'</div>'
     +'<div class="ck-q">May we share your story?</div>'+D.perms.map(function(p,i){return '<label class="ck-opt"><input type="radio" name="perm" value="'+h(p)+'"'+(i===3?' checked':'')+'><span>'+h(p)+'</span></label>'}).join('')
     +'<p class="ck-hint" style="color:var(--muted);font-size:15px">Nothing is shared without your say. We will send you any draft first.</p>';
  }else{
    x='<p class="ck-lead" style="margin-top:14px">Your answers are anonymous. We do not ask your name or number.</p>'
     +ta('a-remember','1. What do you remember most from that night?')
     +ta('a-changed','2. After that, did anything change in how you talk or work with the people around you?')
     +'<div class="ck-q">3. Would you like to do something like this again?</div>'+['Yes','Maybe','No'].map(function(p){return '<label class="ck-opt"><input type="radio" name="again" value="'+p+'"><span>'+p+'</span></label>'}).join('');
  }
  f.innerHTML=x+'<div class="ck-hp" aria-hidden="true"><label>Website<input type="text" id="a-web" tabindex="-1" autocomplete="off"></label></div><p class="ck-err" id="ck-err" role="alert"></p><button class="ck-btn" id="ck-send" type="button">Send</button>';
  document.getElementById('ck-send').onclick=send;
}
function val(id){var e=document.getElementById(id);return e?e.value:''}
function radio(n){var e=document.querySelector('input[name='+n+']:checked');return e?e.value:''}
function send(){
  var a=role==='owner'?{before:val('a-before'),changed:val('a-changed'),example:val('a-example'),notChanged:val('a-not'),rating:radio('rating'),perm:radio('perm')}:{remember:val('a-remember'),changed:val('a-changed'),again:radio('again')};
  var any=false;for(var k in a){if(k!=='perm'&&a[k])any=true}
  if(!any){say('Please answer at least one question.');return}
  var b=document.getElementById('ck-send');b.disabled=true;say('');
  post('submit',{pass:pass,role:role,a:a,website:val('a-web')}).then(function(j){
    if(j.ok){done();return}
    b.disabled=false;
    if(j.error==='expired'){say('This page has been open for a while. Please start again with your code.');setTimeout(step1,2500)}
    else say('Your answers could not be saved just now. Please try again in a minute, or send them to us on WhatsApp.');
  },function(){b.disabled=false;say('Could not connect. Please check your internet and try again.')});
}
function done(){
  root.innerHTML='<section class="qz-card ck-card"><p class="ck-k">Rock &amp; Anchor</p><h1>Thank you</h1><p class="ck-lead">Your answers reached us. What you shared helps us do this better, for you and for the next team.</p><p class="ck-lead">If you would like to add anything, you can also message us.</p><a class="ck-wa" href="https://wa.me/'+D.wa+'">Message us on WhatsApp</a></section>';
}
step1();
})();`;


// ---------- Hinglish (Hindi in English letters) for the post-training quiz ----------
// Fourth language option, added 21 Oct 2026 at Aaditya's request. Same order of questions and options as English.
// Merged into QUIZZES and QUIZ_UI below, so every place that reads q[lang] or ui[lang] gets 'hg' too.

const QUIZ_HG_UI = { lang: 'Hinglish', title: 'Training ke baad ka Quiz', sub: 'Foundation Training, 15 se 17 October 2026', chooseLang: 'Apni bhasha chunein', name: 'Aapka naam', phone: 'Aapka mobile number', phoneHint: '10 digit. Isse har vyakti har quiz ek hi baar deta hai.', chooseQuiz: 'Quiz chunein', rulesTitle: 'Yeh kaise kaam karta hai',
  rules: ['Kul 3 quiz hain. Teeno quiz, kisi bhi order mein, 23 October raat 11:59 baje tak poori karein. Aap inhe alag-alag din kar sakte hain.', 'Har quiz {min} minute ki hai. Timer tabhi shuru hota hai jab aap Start dabate hain, aur phir rukta nahi.', 'Har baar wahi mobile number daalein.', 'Aisi jagah baithein jahan network achha ho aur phone charge ho. Agar page band ho jaaye, to wahi link kholein aur wahi number daalein. Time bacha ho to aapki quiz wahin se aage chalegi.', 'Har quiz sirf ek baar de sakte hain. Jawab chunte hi woh lock ho jaata hai aur aap peeche nahi ja sakte. Phir aapko dikhega ki sahi jawab sahi kyun hai.', '★ ka matlab safety wala sawaal hai. Agar koi galat hua, to aapke trainer aapko call karke us par baat karenge.', 'Ismein pass ya fail nahi hai. Aapke jawab aapke trainer dekhte hain. Har jawab aapke manual mein hai ya training mein karwaya gaya tha.'],
  closed: 'Quiz 23 October raat 11:59 baje band ho gayi. Kripya apne trainer ko message karein.',
  start: 'Quiz shuru karein', next: 'Agla sawaal', finish: 'Mera result dekhein', timeLeft: 'Bacha time', qOf: 'Sawaal {i} / {n}', right: 'Sahi.', wrong: 'Sahi jawab {L} hai.', why: 'Kyun', source: 'Manual section', star: 'Safety sawaal',
  doneTitle: 'Quiz poori karne ke liye shabaash.', timedOut: 'Time khatam ho gaya.', score: 'Aapke {n} mein se {s} jawab sahi hain.', starAll: 'Aapne har ★ safety sawaal sahi kiya.', starMissed: '★ safety sawaal jin par trainer se baat karni hai: {list}. Aapke trainer 2 din ke andar aapko call karenge.', learning: 'Yeh score seekhne ke liye hai, comparison ke liye nahi.',
  taskTitle: 'Ek aur kaam (marks nahi, par zaroori hai)', taskBtn: 'WhatsApp par bhejein', other: 'Aage badhein: {quiz}', already: 'Aap yeh quiz pehle hi de chuke hain. Yeh raha aapka result.', resume: 'Phir se swagat hai. Aapki quiz abhi chal rahi hai.', errName: 'Kripya apna naam likhein.', errPhone: 'Kripya 10 digit ka mobile number likhein.', errQuiz: 'Kripya quiz chunein.', errNet: 'Connect nahi ho paaya. Internet check karke phir try karein.', errSrv: 'Abhi quiz save nahi ho paayi. Kripya apne trainer ko batayein, phir try karein.', retry: 'Phir try karein', notAnswered: 'Jawab nahi diya', thanks: 'Dhanyavaad. Pahadon mein aapke saath chalne wale log is bharose par hain ki aapko yeh pata hai.', saving: 'Save ho raha hai…', back: 'Peeche' };

const QUIZ_HG = {
  1: {
    title: 'Quiz 1: Logon ko safe rakhna',
    read: 'Pehle Module 5, 6, 7 aur 16 padhein.',
    task: 'Apne trainer ko 1 minute ka voice note bhejein: "Rock & Anchor ka emergency number ____ hai. Ambulance ka number ____ hai. Agle trek par, shuru karne se pehle, main ____ karunga/karungi."',
    qs: [
      { q: 'Aapko bijli dikhti hai aur garaj sunaayi dene tak aap 20 second ginte hain. Iska kya matlab hai?', o: ['Toofan 20 km door hai. Choti tak pahunchne ka time hai.', 'Toofan lagbhag 4 km door hai. Turant kadam uthayein.', 'Toofan lagbhag 10 km door hai. Nazar rakhte rahein.', 'Garaj se doori ka kuch pata nahi chalta.'], why: 'Second ko 5 se divide karein, to doori km mein milti hai. 20 ÷ 5 = 4 km. 6 km se kam (30 second se kam) ka matlab hai turant kadam uthayein.' },
      { q: 'Khule maidan mein group bijli wale toofan mein phans gaya hai. Manual body ki kaun-si position sikhata hai?', o: ['Zameen par seedhe let jaayein.', 'Sabse paas ke oonche ped ke neeche sthir khade rahein.', 'Neeche jhuk kar baithein, pair aapas mein milaakar, wazan panjon par, haath ghutnon par, sir neeche.', 'Baith jaayein aur chattan ke chhajje ke neeche tik jaayein.'], why: 'Letne se zameen se contact badhta hai. Akele ped aur chattan ke chhajje zameen ka current le aate hain.' },
      { q: 'Bijli ke time jab group pahad ki dhaar se neeche utarta hai, to logon ko ek-doosre se kitni doori par failna chahiye, aur kyun?', o: ['2 meter, taaki koi kho na jaaye.', 'Kam se kam 10 meter, taaki ek baar bijli girne se kai log ghayal na hon.', 'Paas-paas rahein, taaki leader sabko gin sake.', 'Doori se koi fark nahi padta.'], why: 'Fail kar chalne se ek hi bijli se kai log ghayal nahi hote.' },
      { q: 'Aakhri garaj ke baad, khuli jagah par phir se chalne se pehle kitni der rukte hain?', o: ['5 minute', '10 minute', 'Poore 30 minute', 'Baarish rukne tak'], why: '' },
      { q: 'Sahyadri trek par chot lagne ka sabse bada kaaran kya hai?', o: ['Saanp ka kaatna', 'Phisalne wali basalt chattan', 'Garmi', 'Raasta bhatak jaana'], why: 'Us hisse se pehle group ko rokein, khatra dikhayein, pair kahan rakhna hai yeh dikhayein, aur jo ladkhada rahe hain unke saath-saath chalein.' },
      { q: 'Aap group ke sabse peeche sweep hain. Kaale baadal ghir rahe hain aur aapko garaj sunaayi deti hai. Aage chal rahe Leader ne dhyan nahi diya hai. Aap kya karenge?', o: ['Khud hi group ko wapas mod dein.', 'Turant Leader ka dhyan kheenchein, saaf-saaf batayein ki aapne kya suna aur dekha, phir Leader ke faisle ka saath dein.', 'Ruk kar dekhein ki haalat aur bigadti hai ya nahi.', 'Group se poochhein ki woh aage jaana chahte hain ya nahi.'], why: 'Co-Leader ke roop mein aap jaldi notice karte hain, bolte hain aur faisle ka saath dete hain. Wapas lautne ka faisla kabhi bhi group ki voting se nahi hota.' },
      { q: 'Jharne par, seeti ki do awaazon ka kya matlab hai?', o: ['Koi kho gaya hai.', 'Khana taiyaar hai.', 'Sab log turant paani se bahar niklein.', 'Rassi ki taraf tairein.'], why: 'Ise teen seeti se na milayein. Teen seeti duniya bhar mein emergency ka signal hai: mujhe madad chahiye.' },
      { q: 'Tairte waqt ek haath upar uthane ka kya matlab hai?', o: ['"Mujhe photo leni hai."', '"Paani ka bahaav mujhe kheench raha hai."', '"Main bahar nikal raha hoon."', '"Mujhe thand lag rahi hai."'], why: '' },
      { q: 'Jagah ki jaanch ke time aapko paani ke kund ka tal saaf nahi dikhta. Rule kya hai?', o: ['Dhyan rakhein to dive karna theek hai.', 'Sirf achhe tairak kood sakte hain.', 'Na diving, na koodna. Bas.', 'Sirf neechi chattanon se koodein.'], why: 'Paani ke andar ki chattanein upar se dikhaayi nahi detin.' },
      { q: 'Monsoon mein, jharne par paani ka level kitni jaldi badal sakta hai?', o: ['Kuch dinon mein', '10 se 15 minute mein', 'Sirf raat bhar mein', 'Din mein nahi badalta'], why: '' },
      { q: 'Ek participant kehta hai, "Paani theek lag raha hai, main achha tairak hoon." Sabse achha jawab kya hai?', o: ['"Theek hai, aap rassi ke aage ja sakte hain."', '"Upar se paani shaant dikhta hai, lekin jharne ke paas bahaav tez hai. Aaj safe jagah sabke liye ek hi hai."', 'Kuch na kahein aur unhe khud faisla karne dein.', '"Baaki participants se poochh lijiye."'], why: 'Tairak behte paani mein apni capacity ko zyada aankte hain. Shaant surface ke neeche khatarnaak kheechaav chhupa ho sakta hai. Agar woh zid karein, to Leader ko bulayein.' },
      { q: 'Ek participant ko gehra cut laga hai. Jis kapde se aap daba rahe hain, woh khoon se bheeg raha hai. Aap kya karenge?', o: ['Ghaav dekhne ke liye kapda uthayein.', 'Kapda hata kar naya kapda lagayein.', 'Mazbooti se dabaaye rakhein, kapda uthaaye bina upar aur kapda rakhein, aur haath ya pair ko upar uthayein.', 'Naale ke paani se dhoyein aur intezaar karein.'], why: '10 se 15 minute tak seedha, mazboot dabaav. Kapda uthane se khoon phir se behne lagta hai. Agar khoon na ruke, to evacuation (marij ko bahar le jaana) zaroori hai.' },
      { q: 'Inmein se kismein TURANT evacuation zaroori hai?', o: ['Tez bukhaar', 'Lagaataar ulti', 'Saanp ka kaatna', 'Takhne ki chot ki wajah se chal nahi pa raha'], why: 'Baaki teen mein "jaldi bahar le jaayein". Saanp ke kaatne par turant: vyakti ko sthir rakhein, time note karein, bahar le jaayein.' },
      { q: 'Koi gambhir roop se ghayal hai aur phone mein network nahi hai. Aap kya karenge?', o: ['Sabse tez vyakti ko akele network dhoondhne bhejein.', 'Do logon ko saath mein network ki taraf bhejein, jagah, haalat aur ab tak kya kiya gaya, yeh likh kar dein.', 'Sab log saath mein bahar chale jaayein aur marij ko aaraam karne dein.', 'Network wapas aane ka intezaar karein.'], why: 'Kabhi kisi ek vyakti ko akele na bhejein. Kabhi marij ko akela na chhodein.' },
      { q: 'Aap ek ghayal vyakti tak pahunchte hain. Sabse pehla kadam kya hai?', o: ['108 par call karein.', 'Paas jaane se pehle pakka karein ki jagah safe hai.', 'Unhe paani dein.', 'Report ke liye photo lein.'], why: 'Agar jagah safe nahi hai, to jaldi hi do marij ho sakte hain.' },
    ],
  },
  2: {
    title: 'Quiz 2: Experience ko lead karna',
    read: 'Pehle Module 2, 4, 8 aur 12 padhein.',
    task: 'Ghar ya gaon mein kisi ko ek Leave No Trace rule sikhayein: koi bachcha, maa-baap, dost. Phir apne trainer ko voice note ya photo bhejein: aapne kise sikhaya, kaun-sa rule, aur unhone kya jawab diya.',
    qs: [
      { q: 'Inmein se kaun-sa Rock & Anchor ke 10 Essentials mein nahi hai?', o: ['Navigation (raasta pehchanna)', 'Emergency shelter', 'Trekking pole (chhadi)', 'Extra paani'], why: '' },
      { q: 'Trek din mein hai. Kya phir bhi headlamp chahiye?', o: ['Nahi, din hai.', 'Nahi, phone ki torch kaafi hai.', 'Haan. Der ya chot se din ka trek raat ki situation ban sakta hai. Phone ki light sirf backup hai.', 'Sirf monsoon mein.'], why: '' },
      { q: 'Leader team ko milne ki jagah par kitni jaldi pahunchna chahiye?', o: ['Time par, participants ke saath', 'Participants se 15 minute pehle', '2 ghante pehle', 'Koi fark nahi padta'], why: 'Is time mein din ki taiyaari dohrayein: khaas pal, khatre aur sikhane ke mauke.' },
      { q: 'Raaste mein group ki ginti kitni baar karte hain?', o: ['Sirf shuruaat aur aakhir mein', 'Har 20 se 30 minute mein, chupchaap, chalte hue ya jahan apne aap rukte hain wahan', 'Har 2 ghante mein ek baar', 'Sirf tab jab koi gaayab lage'], why: '' },
      { q: 'Group ki speed kiski chaal se tay hoti hai?', o: ['Leader ki', 'Average vyakti ki', 'Sabse tez vyakti ki', 'Sabse dheeme vyakti ki. Hamesha.'], why: '' },
      { q: 'Zyaadatar haadse kab hote hain?', o: ['Shuruaat mein, jab log ghabraaye hote hain', 'Choti par', 'Wapasi mein, jab log thake hote hain aur raasta jaana-pehchana lagta hai', 'Milne ki jagah par'], why: 'Chhote kadam, ghutne thode mude hue, dheemi aur sambhli hui chaal, bachchon aur buzurgon par zyada dhyan.' },
      { q: 'Group destination par pahunchta hai. Aap sabse pehle kya karenge?', o: ['Group photo lein.', 'Sabki ginti karein.', 'Jagah ki kahani sunayein.', 'Sabko ghoomne dein.'], why: '' },
      { q: 'Kaun-sa instruction AIRC ko sabse achhe se follow karta hai?', o: ['"Sab log, yahan rukiye aur meri taraf dekhiye. Naale se pehle rukna hai. Ek baar mein ek hi vyakti paar karega. Mere ishaare ka intezaar karein. Dhyan rakhna, theek hai? Chalo."', '"Sab log, yahan rukiye aur meri taraf dekhiye. Naale se pehle rukna hai. Ek baar mein ek hi vyakti paar karega. Mere ishaare ka intezaar karein. Paani ke neeche ke patthar hilte hain. Rahul, batao: naale par humein kya karna hai?"', '"Naale se pehle rukna hai. Ek baar mein ek hi vyakti paar karega, kyunki paani ke neeche ke patthar hilte hain. Mere ishaare ka intezaar karein. Sabko samajh aaya?"', '"Sab log, meri taraf dekhiye. Paani ke neeche ke patthar hilte hain aur har monsoon mein yahan log phisalte hain, isliye naale par bahut dhyan rakhna. Rahul, ready ho?"'], why: 'Sahi wale mein sab kuch hai: pehle dhyan, saaf instruction, zaroori information (patthar hilte hain), aur naam lekar ek vyakti se dohrawana. Baaki har ek mein kuch chhoota hai: ek mein na reason hai, na confirmation; ek dhyan liye bina shuru hota hai aur poore group se "Sabko samajh aaya?" poochhta hai; ek khatra to batata hai par yeh nahi batata ki theek-theek kya karna hai. Poori AIRC briefing mein chhah step hote hain: Attention, Instruction, Information, Reason, Review, Confirmation.' },
      { q: 'Logon ko samajh aaya ya nahi, yeh pakka karne ka sabse achha tareeka kya hai?', o: ['"Sab theek hain?"', 'Kisi ek vyakti ka naam lekar usse poochhein ki aage kya karna hai.', 'Instruction zor se dohrayein.', 'Maan lein ki chup rehne ka matlab haan hai.'], why: '' },
      { q: 'Ek participant santre ka chhilka girata hai aur kehta hai, "Yeh to apne aap sad jaayega." Sabse achha jawab kya hai?', o: ['Chupchaap khud utha lein taaki participant ko sharmindagi na ho.', 'Unse uthane ko kahein, aur reason batayein: yahan santre ka chhilka sadne mein lagbhag 2 saal lagte hain, aur jaanwar use kha kar beemaar padte hain.', 'Poore group ko rule yaad dilayein: raaste par kuch nahi chhodna, sab kuch bag mein jaata hai.', 'Abhi jaane dein, aur agle rest stop par sabse Leave No Trace ke baare mein baat karein.'], why: 'Rule ke saath "kyun" batayein, aur unhe khud theek karne dein. Aadat aise hi banti hai. Unke liye khud utha lene se woh kuch nahi seekhte, bina reason ka rule lecture jaisa lagta hai, aur intezaar karne se woh pal nikal jaata hai.' },
      { q: 'Jharne wale trek par kaun-sa LNT (Leave No Trace) tareeka sahi hai?', o: ['Herbal ho to saabun theek hai.', 'Paani mein saabun ya shampoo nahi. Shauch paani se kam se kam 60 meter door. Khaane ka kachra wapas le jaayein.', 'Bacha hua khana naale mein daal sakte hain.', 'Toilet paper kund ke paas gaad sakte hain.'], why: '' },
      { q: 'Participants ko bandaron ko kabhi khana kyun nahi khilana chahiye?', o: ['Khana mehenga hai.', 'Khilane se woh jhapat kar khana chheenne lagte hain aur khatarnaak ho jaate hain.', 'Bandar insaanon ka khana nahi khaate.', 'Phal ho to theek hai.'], why: '' },
      { q: 'Group choti se 40 minute door hai aur dopahar ke 2:30 baje hain. Group aam taur par choti par lagbhag 30 minute rukta hai, aur neeche utarne mein lagbhag 2 ghante lagte hain. Teen log baar-baar ruk rahe hain, aur shaam 6 baje andhera ho jaata hai. Fit participants aapse kehte hain, "Chalo, upar tak chalte hain." Co-Leader ke roop mein aap kya karenge?', o: ['Unse sehmat hokar unhe upar le jaayein.', 'Fit participants ko batayein ki faisla Leader ka hai, Leader ko time aur thake hue logon ke baare mein apni sachchi raay dein, phir Leader ke faisle ka poora saath dein.', 'Poore group se vote karwayein.', 'Sabko chalaate rehne ke liye kahein "bas pahunch hi gaye".'], why: '40 minute upar + 30 minute choti par + 2 ghante neeche = kam se kam shaam 5:40, aur thake hue teen log isse bhi dheeme chalenge. Yaani andhere mein neeche utarna. Sabse kamzor member se faisla tay hota hai, aur sabse tez log kabhi group ke liye faisla nahi karte.' },
      { q: '9 saal ka ek bachcha raaste mein baith kar ro raha hai aur kehta hai ki use ghar jaana hai. Aap sabse pehle kya karenge?', o: ['Use batayein ki jharna bas 25 minute door hai, chalta rahega to pahunch jaayega.', 'Group paas mein ruka rahe, aur uske maa-baap se kahein ki use shaant karein.', 'Uski aankhon ke barabar neeche baithein, shaanti se poochhein ki kya hua, aur paani aur kuch khaane ko dein.', 'Ek maa-baap ko use shuruaat ki jagah wapas le jaane dein, aur group aage badhe.'], why: 'Pehle asli kaaran pata karein. Bhookh, pyaas, chhaala ya darr aksar kaaran hote hain, aur paani aur kuch khaane se inmein se kai theek ho jaate hain. "Bas 25 minute aur" jaisa goal uske baad kaam aata hai. Maa-baap par chhod dena ya use wapas bhejna aakhri kadam hai, pehla nahi.' },
      { q: 'Aapka group tair raha hai, tabhi gaon ki mahilayein kapde dhone talaab par aati hain. Inmein se kaun-si baat galti hai?', o: ['Unka izzat se abhivaadan karna: "Namaskar tai. Aap aaram se kaam karein."', 'Participants ko chupchaap dekhne dena, khamoshi ko baaton se na bharna.', 'Bina poochhe mahilaon ki photo lena.', 'Baad mein poochhna, "Isse aapke liye kya badla?"'], why: 'Bina ijaazat ke, ek asli pal tourists ka tamasha ban jaata hai.' },
    ],
  },
  3: {
    title: 'Quiz 3: Maidan ke hunar',
    read: 'Hazard walk, maps, camp ki raat aur skits ko yaad karein.',
    task: 'Apne gaon ya kisi jaane-pehchane raaste ka ek simple map banayein. Usmein north disha, raasta, paani, ek khatra, aur kam se kam 4 chinhon wali legend dikhayein. Uski photo apne trainer ko bhejein.',
    qs: [
      { q: 'Inmein se kaun-sa insaanon se bana khatra (human hazard) hai?', o: ['Bhaari baarish ke baad chattan ke neeche dheele patthar', 'Pahad ki dhaar par bijli', 'Raaste ke paas logon ka chhoda hua toota kaanch', 'Baarish ke baad tezi se badhta naala'], why: 'Natural khatre zameen aur mausam se aate hain: girte patthar, bijli, tez paani. Human khatre log banate ya chhod jaate hain: toota kaanch, kachra, jalti chhodi aag, sadak par gaadiyan.' },
      { q: 'Aapko aage ek khatra dikhta hai. Leader ko kaun-si report sabse kaam ki hai?', o: ['"Upar kuch khatarnaak hai."', '"Raaste ke left side dheele patthar hain, bade ped ke lagbhag 50 meter baad. Koi phisal kar gir sakta hai. Maine group ko yahin rok diya hai."', 'Abhi kuch na kahein, din ke aakhir mein batayein.', 'Photo le kar group chat mein daal dein.'], why: 'Jis report par Leader turant kadam utha sake, usmein hota hai: khatra kya hai, theek kahan hai, kitna gambhir hai, aur aapne ab tak kya kiya.' },
      { q: 'Map par legend kya hoti hai?', o: ['Upar likha map ka naam', 'Woh box jo batata hai ki har chinh aur rang ka matlab kya hai', 'North disha dikhane wala teer', 'Doori dikhane wali line'], why: 'Legend ke bina koi aur aapke chinh nahi padh sakta. Doosron ke liye banaye map mein legend hamesha chahiye.' },
      { q: 'Is tasveer mein ek pahadi ki contour lines hain. Pahadi ki kaun-si side zyada khadi (steep) hai?', o: ['Left side, jahan lines paas-paas hain', 'Right side, jahan lines door-door hain', 'Dono side ek jaisi hain', 'Contour lines se dhalaan ka pata nahi chalta'], why: 'Har contour line ek jaisi oonchai wali jagahon ko jodti hai. Paas-paas lines matlab kam doori mein oonchai tezi se badalti hai: khadi chadhai. Door-door lines matlab halki dhalaan.' },
      { q: 'Usi tasveer mein, beech ka sabse chhota gol ghera kya dikhata hai?', o: ['Ek talaab', 'Pahadi ki choti', 'Ek gaon', 'Raaste ki shuruaat'], why: 'Chhote hote jaate ghere dikhate hain ki zameen upar uth rahi hai. Sabse chhota ghera sabse oonchi jagah hai: choti.' },
      { q: 'Lambe time tak tairne aur phir baarish ke baad, ek participant zor se kaanp raha hai, dheere bol raha hai aur ladkhada raha hai. Sabse zyada sambhavna kya hai?', o: ['Garmi se thakaavat (heat exhaustion)', 'Hypothermia: body ki garmi kam ho rahi hai', 'Bas thakaan', 'Zyada khana'], why: 'Kaanpna, ladkhadana, dheema ya atakta bolna aur uljhan ka matlab hai body ki garmi kam ho rahi hai. Hawa aur geelepan se hatayein, sookhe kapde pehnayein, emergency blanket mein lapetein, poori tarah hosh mein ho to garam meetha drink dein. Agar uljhan badhe, to bahar le jaayein (evacuation).' },
      { q: 'Garmi ka mausam, dopahar ki chadhai. Ek participant ko sirdard hai, chakkar aur ulti jaisa lag raha hai, aur bahut paseena aa raha hai. Aap sabse pehle kya karenge?', o: ['Jaldi aage badhein taaki aur garmi hone se pehle upar pahunch jaayein', 'Rukein, unhe chhaon mein le jaayein, paani se thanda karein, ORS wala paani dein, aur aaraam karayein', 'Unhe garam chai dein', 'Unhe emergency blanket mein lapetein'], why: 'Yeh garmi se thakaavat (heat exhaustion) ke lakshan hain. Pehle thanda karein aur aaraam karayein. Agar uljhan ho, paseena band ho jaaye ya haalat bigde, to yeh gambhir hai: bahar le jaayein.' },
      { q: 'Raat ke camp ke liye sabse achhi jagah kaun-si hai?', o: ['Sookhe naale ke tal mein, kyunki woh samtal hai', 'Kisi bade sookhe ped ke neeche, chhaon ke liye', 'Samtal zameen par, paani behne ke raaston se door, jahan upar koi sookha ped ya dheele patthar na hon', 'Theek paani ke kinare'], why: 'Raat ki baarish sookhe naale ko minuton mein bhar sakti hai. Sookhi daaliyan aur dheele patthar girte hain. Samtal, thodi oonchi, saaf zameen hi safe hai.' },
      { q: 'Campfire jalaane se pehle aapko kya karna zaroori hai?', o: ['Pehle se bani aag ki jagah use karein ya 1 meter ke ghere se patte aur sookha saamaan hatayein, aur aag poori tarah bujhane ke liye paani taiyaar rakhein', 'Tents ke paas jalayein taaki sabko garmi mile', 'Aag shuru karne ke liye plastic use karein', 'Angaare raat bhar jalte chhodne ki sochein'], why: 'Saal ke zyaadatar time jungle ki zameen sookhi rehti hai aur ek chingaari door tak ja sakti hai. Sab kuch raakh hone tak jalayein aur sone ya jaane se pehle poori tarah bujhayein.' },
      { q: 'Camp ki raat aapke group ko jagah chunni thi, khaane ka plan banana tha aur tay karna tha ki kaun lead karega. Team ki tarah kaam karne ka sabse achha tareeka kya hai?', o: ['Sabse taaqatwar vyakti sab kuch kare', 'Ek leader par sehmat hon, jo har vyakti ko saaf kaam de aur beech-beech mein unse poochhta rahe', 'Har koi jo chahe woh kare', 'Sab kuch tay karne ke liye trainer ka intezaar karein'], why: 'Kaam baantne (delegation) ka matlab hai ek vyakti poori tasveer dekhta hai aur har vyakti ko apna theek-theek kaam pata hota hai. Kuch chhoot-ta nahi aur koi akela sab nahi karta.' },
      { q: 'Kaun-si team trip ka record rakhti hai: photos, notes, haaziri aur trip report?', o: ['Pantry team', 'Documentation team', 'Load ferry team', 'Technical team'], why: 'Documentation team trip ka record rakhti hai. Pantry team khana aur khana banane ka kaam sambhalti hai. Load ferry team group ka saamaan dhoti hai. Technical team rassi, safety ka saamaan aur gear sambhalti hai.' },
      { q: 'Aap kisi participant se pehli baar milte hain. Kaun-sa sawaal unhe sabse achhi tarah jaanne mein madad karta hai?', o: ['"Aap theek hain?"', '"Paani laaye hain?"', '"Aaj pahadon par aane ka mann kyun hua?"', '"Kya yeh aapka pehla trek hai?"'], why: 'Khule sawaal (kya, kyun, kaise) logon ko apni baat kehne ka mauka dete hain. Haan ya na wale sawaalon se baatcheet ruk jaati hai. Achhe se poochhna ek hunar hai, aur rishte aise hi shuru hote hain. Apne baare mein bhi kuch batayein.' },
      { q: 'Group pahad ki dhaar par hai aur bijli shuru ho jaati hai. Aap kaun-si leadership style apnayenge?', o: ['Stepping back: group ko tay karne dein', 'Facilitating: group ko kaam dein aur dekhein', 'Directive: chhote, saaf order, koi behas nahi', 'Guiding: apna idea batayein aur unki raay poochhein'], why: 'Safety aur emergency mein leader poori command leta hai: "Sab ruko. Abhi. Yahan wapas aao. Hum is taraf se neeche jaayenge."' },
      { q: 'Camp ki raat trainer ne poora kaam aapke group ko diya aur khud peeche rahe, sirf safety ke liye beech mein aaye. Woh kaun-si leadership style thi?', o: ['Directive', 'Guiding', 'Stepping back', 'Koi leadership nahi'], why: 'Stepping back naye leaders taiyaar karne ke liye hai: kaam unhe dein, khud peeche rahein, sirf safety ke liye beech mein aayein. Aise hi lead karna seekhte hain, kyunki koi aur aapke liye nahi karta.' },
      { q: 'AIRC briefing mein chhah step hote hain. Sahi order kaun-sa hai?', o: ['Attention, Instruction, Information, Reason, Review, Confirmation', 'Instruction, Attention, Reason, Information, Confirmation, Review', 'Reason, Attention, Information, Instruction, Review, Confirmation', 'Attention, Reason, Review, Instruction, Information, Confirmation'], why: 'Pehle sabka dhyan lein. Phir batayein kya karna hai, kya jaanna zaroori hai, aur kyun. Phir khaas baatein dobara dohrayein, aur kisi ek ka naam lekar poochh kar confirm karein.' },
    ],
  },
};

// Merge Hinglish into the main data, checking counts so a mismatch fails loudly at start-up.
QUIZ_UI.hg = QUIZ_HG_UI;
QUIZ_LANGS.hg = 'Hinglish';
for (const k of Object.keys(QUIZ_HG)) {
  const Q = QUIZZES[k], H = QUIZ_HG[k];
  if (!Q || Q.qs.length !== H.qs.length) throw new Error(`Hinglish quiz ${k} does not match`);
  Q.title.hg = H.title; Q.read.hg = H.read; Q.task.hg = H.task;
  H.qs.forEach((h, i) => { if (h.o.length !== Q.qs[i].en.o.length) throw new Error(`Hinglish ${k}.${i + 1} options`); Q.qs[i].hg = h; });
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
  terms: { title: 'Terms and Conditions', body: "Version 2026-11-11. Last updated 11 November 2026.\nThese terms apply to every Rock & Anchor experience: treks, stargazing, village experiences, outdoor learning, school and corporate programmes, and custom experiences. Details that differ from one experience to another, such as timings, age limits, food, stay and what to bring, are on each experience page and in its FAQs. Please read both before you book.\n## Booking and payment\n- A booking is confirmed once our team confirms it to you and payment has been received as agreed.\n- Prices, inclusions and age limits are listed on each experience page or shared when you enquire.\n- Age related or student rates need valid ID proof at check in.\n- Group bookings with mixed age groups are charged on each person's category rate.\n- We offer tailored programmes for schools, colleges, universities and companies. Contact us for details.\n## Booking for other people\n- You can book places for other people on the same booking, such as your children or friends. The person who books and pays is responsible for the payment and for giving us correct details for everyone on the booking.\n- Only enter another adult's details with their permission. Adults you book for may be asked to confirm their own place before the experience.\n- To book for a child under 18, you must be their parent or legal guardian. You confirm this, and accept these terms and our Privacy Policy, when you add the child to your account and when you book for them.\n- Before each experience, the parent or guardian is asked to confirm the child's emergency contact and any medical information, so the experience leader has them.\n- If you travel on the same booking as your children, you cannot cancel your own place and leave them booked without you, unless the experience is one that children attend on their own.\n## Cancellations, rescheduling and refunds\nRescheduling, cancellation, medical and refund terms are set out in our Cancellation and Refunds policy.\n## Health and fitness\n- Please tell us before the experience about any medical condition, allergy or medication that could affect your participation.\n- Choose an experience that suits your fitness and comfort. If you are unsure, ask us before you book.\n- Health protocols will be followed as per government recommendations at the time of the experience.\n## Children\n- Age limits and guardian requirements are given on each experience page.\n- Children must be accompanied by a parent or guardian, unless the experience page says the experience is run for children on their own, such as a summer camp. For those experiences, a parent or guardian books the child's place and stays reachable on the emergency contact they give us.\n- Children may also take part through a school or organisation that has their guardian's consent.\n## Safety on the experience\n- Outdoor activities carry natural risks, including uneven terrain, weather, water and wildlife.\n- Please follow the instructions of your experience leader at all times.\n- Your leader may change the route, timings or activities, or stop an activity, when weather or safety requires it.\n## Guest behaviour\n- We reserve the right to refuse entry, accommodation or participation to guests whose behaviour disrupts the comfort and safety of others.\n- Many experiences take place in villages and in people's homes. Please respect your hosts, their homes and their way of life.\n## Nature and waste\n- Leave every place as you found it. Carry back what you bring, do not litter, and do not disturb plants or wildlife.\n- Many of the places we visit have no waste collection. Please bring food and water in reusable containers.\n## Getting there\n- Unless transport is included in your booking, you are responsible for reaching the meeting point on time.\n- Mobile network can be limited in the places we visit. Please let your family know your plans before you leave.\n## Indemnity\n- Rock & Anchor shall not be responsible for any delays or alterations in the programme, or expenses incurred directly or indirectly, due to natural hazards, accidents, breakdown of equipment or transport, weather, sickness, landslides, political closures or any untoward incidents.\n- Rock & Anchor shall not be responsible for any loss, injury or damage to person or property in connection with any accommodation, transportation, activities or other services, resulting directly or indirectly from any act of God, fire, accident, breakdown of machinery, equipment or transport, civil disturbances, strikes, theft, wildlife, epidemics, regulations, or any other causes beyond our control.\n- Rock & Anchor does not hold insurance covering accident, sickness, theft or other loss. Guests are advised to arrange their own insurance. All baggage and personal property are at the guest's risk at all times.\n- By choosing to travel with Rock & Anchor, guests acknowledge that Rock & Anchor and its employees, subcontractors and suppliers do not accept liability for any damage or loss of property, or injury (fatal or otherwise), during the experience, its activities, accommodation or transport.\n## Questions\nFor any questions about these terms, call or WhatsApp us on +91 89287 94380 or write to hello@rockandanchor.in.\nBy confirming a booking with us you agree to these terms." },
  privacy: { title: 'Privacy Policy', body: "Version 2026-11-11. Last updated 11 November 2026.\n## What we collect\nWhen you enquire or book with us, we collect the personal information you give us so we can plan and run your experience safely. This includes your name, phone number, email address and date of birth. For anyone on a trip, it can also include an emergency contact and any medical information, allergies or medication you choose to tell us about.\nWe use date of birth to apply age limits and age-based prices, and to know who is under 18.\nWhen you browse this website, our hosting provider may automatically receive technical information such as your IP address and browser type. We use this only to keep the site working and secure.\n## Consent\nWhen you share personal information to make a booking, you consent to us using it for that purpose only. If we ask for your information for another reason, such as marketing, we will ask you directly or give you a chance to say no.\nYou can withdraw your consent at any time by writing to hello@rockandanchor.in.\n## Children and people you book for\nWhen a parent or guardian adds a child under 18 to their account, they give us the child's name, date of birth, emergency contact and any medical information, and they consent on the child's behalf. Only that parent or guardian, our team and the leaders of the child's experiences can see these details. Children do not have their own account, and we do not send a child's medical details by email.\nWhen you book for another adult, give us only the details we ask for, and only with their permission.\nA parent or guardian can ask us to correct a child's details, or to remove a child from their account, by writing to hello@rockandanchor.in. A child who has an upcoming booking stays on the account until that booking is cancelled or has taken place.\n## Disclosure\nWe may disclose your personal information if we are required by law to do so or if you violate our Terms and Conditions.\n## Payments\nPayments are arranged directly with our team. Where a payment gateway is used, it handles your payment details under its own security standards and privacy policy; we do not store card data.\n## Third party services\nThird party providers we use only collect, use and disclose your information to the extent needed to provide their services to us. Links on this site, such as WhatsApp or Instagram, take you to services governed by their own privacy policies.\n## Security\nWe take reasonable precautions and follow industry best practices so that your personal information is not lost, misused, accessed, disclosed, altered or destroyed.\n## Age of consent\nBy using this site you confirm that you are an adult. Children under 18 do not use this site themselves; a parent or guardian books for them, as described above.\n## Changes to this policy\nWe may update this policy from time to time. Changes take effect when they are posted on this page.\n## Questions\nTo access, correct or delete personal information we hold about you, or to raise a concern, write to hello@rockandanchor.in." },
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
  '/about-us': '/about', '/our-values': '/values', '/curate-your-own-experience': '/curate', '/contact-us': '/contact', '/join-an-experience': '/experiences', '/shop': '/experiences',
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
    const res = await handle(request, env, ctx);
    // Preview and staging copies on workers.dev should never show up in search results.
    if (!new URL(request.url).hostname.endsWith('.workers.dev')) return res;
    const out = new Response(res.body, res);
    out.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return out;
  },
};

async function handle(request, env, ctx) {
  {
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

    // Post-training quiz (live from 21 Oct 2026). Not in the menu or sitemap, kept out of search engines, no site data needed.
    if (path === '/quiz' || path.startsWith('/quiz/')) {
      if (path.startsWith('/quiz/api/')) return quizApi(request, env, path);
      if (path === '/quiz') return new Response(quizPage(), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
    }
    // One-Year Check-In form. Answers only on workers.dev addresses until CK_LIVE is switched on in src/checkin.js, then only on the real domain.
    if (path === '/check-in' || path.startsWith('/check-in/api/')) {
      if (ckAllowed(request)) {
        if (path.startsWith('/check-in/api/')) return checkinApi(request, env, path);
        return new Response(checkinPage(env, request), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
      }
    }
    const data = await getData(env, ctx);
    if (path === '/sitemap.xml') {
      const urls = ['/', '/experiences', '/impact', '/about', '/team', '/values', '/curate', '/contact', ...data.experiences.map((e) => `/experiences/${e.slug}`)];
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
    if (path === '/__timing' && url.hostname.startsWith('staging-')) return new Response(JSON.stringify({ ageSeconds: MEMO ? Math.round((Date.now() - MEMO.t) / 1000) : null, refreshing: !!REFRESHING, lastError: LAST_ERR, timing: data.timing, events: (data.events || []).length }), { headers: { 'content-type': 'application/json' } });
    if (path === '/team') return html(teamPage(data, { drafts: url.hostname.startsWith('staging-') }), 200, data.source);
    if (path === '/impact') return html(impactPage(data, { drafts: url.hostname.startsWith('staging-') }), 200, data.source);
    if (path === '/values') return html(valuesPage(data), 200, data.source);
    if (path === '/curate') return html(curatePage(data), 200, data.source);
    if (path === '/contact') return html(contactPage(data));
    if (POLICIES[path.slice(1)]) return html(policyPage(path.slice(1), data));
    return html(notFound(data), 404);
  }
}
