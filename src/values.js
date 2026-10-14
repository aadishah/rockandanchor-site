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
    ground: ['Keeping groups to a size a trail and a village can take.', 'Carrying out everything we carry in.', 'Thinking about what happens to a place after we leave, not only while we are there.', 'Working with local people, so the value of an experience stays where it happens.', 'Saying no to a booking that would damage a place we cannot repair.'],
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
    text: 'A waterfall, a cave, a nesting site or a quiet corner of a village can change for good when it suddenly becomes easy to find. Fragile habitats, wildlife and small communities cannot always take a rush of new visitors. That is why we do not publish exact locations. The principle is not “never share”. It is: think about what happens when a fragile place becomes easy to find.',
  },
  {
    id: 'wildlife', name: 'Respect wildlife', line: 'Observe without interfering.', from: ['ecosystems'],
    list: ['Do not feed.', 'Do not chase.', 'Do not handle, unless there is a real safety or conservation reason.', 'Do not disturb nests or animals with young.', 'Give animals space.'],
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
  ['Communication', 'A fully charged phone, emergency numbers saved, and a whistle. Three blasts means help.'],
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
  <p class="vl-p rv">Three pieces of knowledge turn our values into things you can do. They are not values in themselves. They are how values become action.</p>
  <ol class="vl-map rv" aria-label="How values connect to what we teach">${LEARN.map((l) => `<li><span class="vl-map-v">${l.from.map((id) => esc(vName[id])).join(' + ')}${l.fromExtra ? ` + ${esc(l.fromExtra)}` : ''}</span><span class="vl-map-arrow" aria-hidden="true">→</span><a class="vl-map-k" href="#learn-${l.id}">${esc(l.name)}</a><span class="vl-map-u">${esc(l.understand)}</span></li>`).join('')}</ol>

  <div class="vl-learn-grid">
    <article class="vl-learn-card rv" id="learn-${lnt.id}"><p class="vl-learn-u">${esc(lnt.understand)}</p><h3>${esc(lnt.name)}</h3><p>${esc(lnt.intro)}</p>
      <ol class="vl-seven">${lnt.items.map(([h, t]) => `<li><b>${esc(h)}</b><span>${esc(t)}</span></li>`).join('')}</ol><p class="vl-credit">${esc(lnt.credit)}</p></article>
    <article class="vl-learn-card vl-geo rv" id="learn-${geo.id}"><p class="vl-learn-u">${esc(geo.understand)}</p><h3>${esc(geo.name)}</h3><p>${esc(geo.intro)}</p>
      <ul class="vl-qs">${geo.items.map(([h, t]) => `<li><b>${esc(h)}</b><span>${esc(t)}</span></li>`).join('')}</ul>
      <p class="vl-pin">Share the moment. Think twice about the pin.</p></article>
  </div>
</div></section>

<section class="vl-ten" id="learn-essentials"><div class="wrap">
  <div class="vl-ten-head"><div><p class="vl-kicker rv">Understanding how to prepare</p><h2 class="vl-h rv">The 10 Essentials.</h2></div>
  <div class="rv"><p class="vl-lead">Preparation is part of adventure.</p><p class="vl-p">This is the Appalachian Mountain Club’s list of 10 Essentials, a checklist outdoor people around the world pack by. It is about being ready, not about being afraid. Each experience also has its own packing list, which we share before you come.</p></div></div>
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
.vl-map{list-style:none;padding:0;margin:30px 0 40px;display:grid;gap:12px}
.vl-map li{display:grid;grid-template-columns:minmax(0,1.1fr) auto minmax(0,1fr) minmax(0,1.2fr);gap:16px;align-items:center;background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:16px 20px}
.vl-map-v{font-weight:700;color:var(--forest)}
.vl-map-arrow{font-size:26px;color:var(--clay);line-height:1}
.vl-map-k{font:800 clamp(22px,2.2vw,28px)/1.1 "Big Shoulders Display","Arial Narrow",sans-serif;text-decoration:none;color:var(--ink)!important}
.vl-map-k:hover{color:var(--clay)!important}
.vl-map-u{color:var(--muted);font-size:15.5px}
.vl-learn-grid{display:grid;grid-template-columns:1.3fr 1fr;gap:20px;align-items:start}
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
.vl-value,.vl-value:nth-child(even){grid-template-columns:1fr}.vl-value:nth-child(even) .vl-value-img{order:0}.vl-value-img{min-height:0;aspect-ratio:16/10}
.vl-map li{grid-template-columns:1fr;gap:4px}.vl-map-arrow{transform:rotate(90deg);width:fit-content;font-size:22px}}
@media(max-width:640px){.vl-check ol,.vl-plus ol,.vl-asks{grid-template-columns:1fr}.vl-tmi{grid-template-columns:1fr}.vl-jump{margin-bottom:28px}.vl-jump a{font-size:14px;padding:8px 13px}}
`;
