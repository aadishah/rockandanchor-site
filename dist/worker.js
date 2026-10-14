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
function priceInfo(e) {
  let min = null, group = false, free = '', minLabel = '';
  for (const raw of String(e.prices || '').split('\n')) {
    const i = raw.indexOf('|');
    if (i < 0) continue;
    const label = raw.slice(0, i).trim(), val = raw.slice(i + 1);
    if (/optional|add.?on|^transport|^travel/i.test(label)) continue;
    // A line such as "Villagers | Free" is shown as "Free for villagers".
    if (/^\s*free\b/i.test(val)) { if (!free) free = label; continue; }
    const m = val.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i);
    if (!m) continue;
    const n = Number(m[1].replace(/,/g, ''));
    if (n && (min === null || n < min)) { min = n; minLabel = label; group = /people|group/i.test(label) && !/per person/i.test(val); }
  }
  if (min === null && e.fromPrice && !/price on request/i.test(e.prices || '')) min = e.fromPrice;
  return { min, group, free, minLabel };
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
  const rows = [], notes = [];
  for (const raw of String(text || '').split('\n')) {
    const l = raw.trim();
    if (!l || /^includes?\b/i.test(l)) continue;
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
<aside class="side-card" id="book"><h3>${esc(e.title)}</h3><div class="from">${freeFor(e) ? `<b>Free</b> for ${esc(freeFor(e).toLowerCase())}${paidLine(e) ? `<br><small>${esc(paidLine(e))}</small>` : ''}` : priceOnRequest(e) ? 'Price on request' : `From <b>${rupees(lowest(e))}</b> ${priceInfo(e).group ? 'per group' : 'per person'}`}</div>
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
];

function curateData(data) {
  const exps = sorted(data).filter((e) => !(e.categories || []).some((c) => /guide training/i.test(c)));
  const acts = CURATE_ACTS.map(([id, label, line, re, kind]) => ({ id, label, line, kind, re }));
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
  const used = acts.filter((a) => out.some((e) => e.a.includes(a.id))).map((a) => {
    const sl = slot(data, 'curate.act.' + a.id, '');
    let img = sl.src;
    if (!img) {
      const cands = out.filter((e) => e.a.includes(a.id)).sort((x, y) => x.a.length - y.a.length);
      for (const e of cands) { const ex = bySlug(data, e.s); for (const ph of (ex && ex.photos) || []) { if (ph.video || taken.has(ph.thumb)) continue; img = ph.thumb; break; } if (img) break; }
    }
    if (img) taken.add(img);
    return { id: a.id, label: a.label, line: a.line, kind: a.kind, img: img || '' };
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

function opt(k,id,title,line,multi,img){var on=multi?has(k,id):S[k]===id;return '<button type="button" class="cu-opt'+(on?' on':'')+(img?' img':'')+'" data-k="'+k+'" data-v="'+h(id)+'"'+(multi?'':' data-one="1"')+' aria-pressed="'+on+'">'+(img?'<span class="cu-opt-ph" style="background-image:url(\''+h(img)+'\')"></span>':'')+'<span class="cu-opt-t">'+h(title)+'</span>'+(line?'<span class="cu-opt-l">'+h(line)+'</span>':'')+'<span class="cu-tick" aria-hidden="true"></span></button>'}
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
  if(id==='do'){x+='<p class="cu-hint">These all come from experiences we already run. Pick what sounds good.</p><div class="cu-grid cu-grid-img">'+D.acts.map(function(a){return opt('acts',a.id,a.label,a.line,1,a.img)}).join('')+'</div>'}
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
  S.acts.forEach(function(a){var x=ACT[a];if(!x)return;if(x.kind==='night')night.push(x.label);else if(x.kind==='evening')eve.push(x.label);else if(x.kind==='stay')stay=1;else if(x.kind==='day')day.push(x.label)});
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
function rows(){return [['Who',whoText()||'Not sure yet'],['Looking for',labs(FEEL,S.feel).join(' + ')||'Open to ideas'],['Leave feeling',labs(LEAVE,S.leave).join(' + ')||'We’ll see'],['Time',(function(){var a=S.time&&S.time!=='flex'?lab(TIME,S.time):'',w=whenText();return a?a+', '+(w==='Flexible'?'flexible on dates':w):(w==='Flexible'?'Flexible':'Flexible on length, '+w)})()],['Doing',S.acts.map(function(a){return ACT[a]?ACT[a].label:a}).join(', ')||'Your call'],['Local layer',labs(LOCAL,S.local).join(', ')||'Not this time'],['Pace',lab(PACE,S.pace)||'Balanced']]}
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
.cu-opt-ph{display:block;aspect-ratio:16/10;background:#d8d0c3 center/cover;margin-bottom:6px}
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
  terms: { title: 'Terms and Conditions', body: "These terms apply to every Rock & Anchor experience: treks, stargazing, village experiences, outdoor learning, school and corporate programmes, and custom experiences. Details that differ from one experience to another, such as timings, age limits, food, stay and what to bring, are on each experience page and in its FAQs. Please read both before you book.\n## Booking and payment\n- A booking is confirmed once our team confirms it to you and payment has been received as agreed.\n- Prices, inclusions and age limits are listed on each experience page or shared when you enquire.\n- Age related or student rates need valid ID proof at check in.\n- Group bookings with mixed age groups are charged on each person's category rate.\n- We offer tailored programmes for schools, colleges, universities and companies. Contact us for details.\n## Cancellations, rescheduling and refunds\nRescheduling, cancellation, medical and refund terms are set out in our Cancellation and Refunds policy.\n## Health and fitness\n- Please tell us before the experience about any medical condition, allergy or medication that could affect your participation.\n- Choose an experience that suits your fitness and comfort. If you are unsure, ask us before you book.\n- Health protocols will be followed as per government recommendations at the time of the experience.\n## Children\n- Age limits and guardian requirements are given on each experience page.\n- Children must be accompanied by a parent or guardian, or take part through a school or organisation that has their guardian's consent.\n## Safety on the experience\n- Outdoor activities carry natural risks, including uneven terrain, weather, water and wildlife.\n- Please follow the instructions of your experience leader at all times.\n- Your leader may change the route, timings or activities, or stop an activity, when weather or safety requires it.\n## Guest behaviour\n- We reserve the right to refuse entry, accommodation or participation to guests whose behaviour disrupts the comfort and safety of others.\n- Many experiences take place in villages and in people's homes. Please respect your hosts, their homes and their way of life.\n## Nature and waste\n- Leave every place as you found it. Carry back what you bring, do not litter, and do not disturb plants or wildlife.\n- Many of the places we visit have no waste collection. Please bring food and water in reusable containers.\n## Getting there\n- Unless transport is included in your booking, you are responsible for reaching the meeting point on time.\n- Mobile network can be limited in the places we visit. Please let your family know your plans before you leave.\n## Indemnity\n- Rock & Anchor shall not be responsible for any delays or alterations in the programme, or expenses incurred directly or indirectly, due to natural hazards, accidents, breakdown of equipment or transport, weather, sickness, landslides, political closures or any untoward incidents.\n- Rock & Anchor shall not be responsible for any loss, injury or damage to person or property in connection with any accommodation, transportation, activities or other services, resulting directly or indirectly from any act of God, fire, accident, breakdown of machinery, equipment or transport, civil disturbances, strikes, theft, wildlife, epidemics, regulations, or any other causes beyond our control.\n- Rock & Anchor does not hold insurance covering accident, sickness, theft or other loss. Guests are advised to arrange their own insurance. All baggage and personal property are at the guest's risk at all times.\n- By choosing to travel with Rock & Anchor, guests acknowledge that Rock & Anchor and its employees, subcontractors and suppliers do not accept liability for any damage or loss of property, or injury (fatal or otherwise), during the experience, its activities, accommodation or transport.\n## Questions\nFor any questions about these terms, call or WhatsApp us on +91 89287 94380 or write to hello@rockandanchor.in.\nBy confirming a booking with us you agree to these terms." },
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
