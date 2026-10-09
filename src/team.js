// ---------- Team: the people making it happen ----------
// About says what we believe. Impact shows what happened. Team introduces the people.
// Profiles read from the Website Team table. Every rich field (Knows, Leads, Has Learned, Creates,
// Building Towards, Ask Me About, Quote) is hidden until it is filled in. Quotes also need Quote Approved.
// On the staging address, unapproved quotes are shown with a "Draft" badge and empty profiles show a hint.
function teamPage(data, opts = {}) {
  const drafts = !!opts.drafts;
  const photo = (slug, i) => { const x = bySlug(data, slug); const ph = x && x.photos && (x.photos[i] || x.photos[0]); return ph ? ph.url : cover(sorted(data)[0], true); };
  const p = (t) => (t ? String(t).split(/\n+/).filter(Boolean).map((l) => `<p>${esc(l)}</p>`).join('') : '');
  const first = (n) => String(n).split(/\s+/)[0];
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const draft = '<span class="tm-draft">Draft, not public</span>';
  const KINDS = [
    ['Knows the place', 'The people who know the place', 'Local guides, hosts, cooks and villagers. The knowledge every experience stands on.'],
    ['Creates the experience', 'The people who create the experience', 'Experience leaders, outdoor educators and facilitators. They turn a place into a day you remember.'],
    ['Makes the system work', 'The people who make the system work', 'Operations, business development, administration and content. The work you never see, and always feel.'],
    ['Learning to lead', 'The people who are learning to lead', 'Interns, trainees and emerging local leaders. Tomorrow\'s experience leaders, learning on the ground.'],
  ];
  const kindOf = (m) => m.kind || (m.group === 'Founders' ? 'Founder' : m.group === 'Experience Leaders' ? 'Creates the experience' : 'Makes the system work');
  const gi = (g) => { const i = TEAM_GROUPS.indexOf(g); return i < 0 ? 99 : i; };
  const all = (data.team || []).map((m) => ({ ...m, k: kindOf(m) })).sort((a, b) => gi(a.group) - gi(b.group) || a.order - b.order);
  const byId = Object.fromEntries(all.filter((m) => m.id).map((m) => [m.id, m]));
  const founders = all.filter((m) => m.k === 'Founder');
  const people = all.filter((m) => m.k !== 'Founder');
  const teachers = (m) => (m.from || []).map((id) => byId[id]).filter(Boolean);
  const students = (m) => all.filter((x) => (x.from || []).includes(m.id));
  const asks = (m) => String(m.ask || '').split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  const quotes = all.filter((m) => m.quote && (m.quoteOk || drafts));
  const knowers = all.filter((m) => m.knows);
  const areas = {};
  all.filter((m) => m.area).forEach((m) => (areas[m.area] = areas[m.area] || []).push(m));
  const areaList = Object.keys(areas).sort();
  const chains = all.filter((m) => teachers(m).length);
  const workWith = waLink('Hi Rock & Anchor, I would like to work with you or join the team.');

  const avatar = (m, cls = 'tm-av') => (m.photo ? `<img class="${cls}" src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy">` : `<span class="${cls} tm-ini">${esc(initials(m.name))}</span>`);
  const profile = (m) => {
    const rows = [['Knows', m.knows], ['Leads', m.leads], ['Has learned', m.learned], ['Creates', m.creates], ['Is building towards', m.building]].filter(([, v]) => v);
    const t = teachers(m), s = students(m), a = asks(m);
    const more = rows.length || t.length || s.length;
    return `<article class="tm-card rv" data-kind="${esc(m.k)}">
    <div class="tm-card-top">${avatar(m)}<div><span class="tm-role">${esc(m.role)}</span><h3>${esc(m.name)}</h3>${m.joined ? `<small class="tm-since">With us since ${esc(m.joined)}</small>` : ''}</div></div>
    ${m.bio ? `<div class="tm-bio">${p(m.bio)}</div>` : ''}
    ${a.length ? `<div class="tm-ask"><b>Ask ${esc(first(m.name))} about</b><ul>${a.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
    ${more ? `<details class="tm-more"><summary>More about ${esc(first(m.name))}</summary><dl>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${p(v)}</dd></div>`).join('')}
      ${t.length ? `<div><dt>Learned from</dt><dd>${t.map((x) => esc(x.name)).join(', ')}</dd></div>` : ''}
      ${s.length ? `<div><dt>Now passing it on to</dt><dd>${s.map((x) => esc(x.name)).join(', ')}</dd></div>` : ''}</dl></details>`
      : drafts ? `<p class="tm-hint">Staging only: add Knows, Leads, Has Learned, Creates, Building Towards and Ask Me About in Airtable (Website Team) to fill this profile.</p>` : ''}
  </article>`;
  };

  const circle = [
    ['Local guide', 'Place knowledge', 'Training, income and opportunity'],
    ['Outdoor educator', 'Learning', 'Local knowledge and experience'],
    ['Founder', 'Direction', 'Ideas and leadership from the team'],
    ['Guest', 'Participation and revenue', 'Experience and connection'],
  ];
  const ladder = [
    ['Learn', 'Come along. Watch how a day outdoors is put together, from the first message to the walk back.'],
    ['Participate', 'Help on the ground. Carry the kit, walk at the back, look after a small group.'],
    ['Take responsibility', 'Own a part of the day: the safety brief, the route, the meal, the stories.'],
    ['Lead', 'Lead the group. Make the calls, keep everyone safe, make the day mean something.'],
    ['Create', 'Design something new: a trail, an experience, a way of seeing the place.'],
    ['Teach someone else', 'Pass it on. Someone learns from you, and the ladder starts again.'],
  ];
  const cx = 260, cy = 260, R = 170;
  const circleSvg = `<svg class="tm-ring" viewBox="0 0 520 520" role="img" aria-label="Four kinds of people around a circle, each bringing something and receiving something">
    <circle cx="${cx}" cy="${cy}" r="${R}" class="ring"/>
    <circle cx="${cx}" cy="${cy}" r="78" class="core"/><text x="${cx}" y="${cy - 6}" class="core-t">Rock &amp;</text><text x="${cx}" y="${cy + 22}" class="core-t">Anchor</text>
    ${circle.map(([who], i) => { const ang = -Math.PI / 2 + (i * Math.PI) / 2; const x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang); return `<g class="node${i ? '' : ' on'}" data-i="${i}" tabindex="0" role="button" aria-label="${who}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="54"/><text x="${x.toFixed(1)}" y="${(y + 6).toFixed(1)}">${who.split(' ').map((w, j, arr) => `<tspan x="${x.toFixed(1)}" dy="${j ? 19 : arr.length > 1 ? -9 : 0}">${w}</tspan>`).join('')}</text></g>`; }).join('')}
  </svg>`;

  const body = `<style>${TEAM_CSS}</style>
<div class="tm">
${drafts ? '<div class="tm-staging">Staging preview: profile hints and unapproved quotes are only visible here. The live site shows nothing until it is filled in and approved in Airtable.</div>' : ''}
<section class="tm-hero"><img src="${esc(photo('winter-trekking', 1))}" alt="A Rock &amp; Anchor leader pointing out the valley on a Sahyadri ridge" fetchpriority="high"><div class="wrap">
  <p class="tm-kicker">Team</p><h1>People make the experience.</h1>
  <p class="tm-sub">Rock &amp; Anchor is built by people who know these mountains, care about the places we work in, and believe that good experiences can create something beyond themselves.</p>
  <a class="tm-scroll" href="#kinds">Meet them ↓</a>
</div></section>

<section class="tm-kinds" id="kinds"><div class="wrap">
  <h2 class="tm-h rv">There is no single kind of person at Rock &amp; Anchor.</h2>
  <div class="tm-kind-grid">${KINDS.map(([k, t, d], i) => { const ms = people.filter((m) => m.k === k); return `<button type="button" class="tm-kind rv" data-filter="${k}"><span class="tm-num">0${i + 1}</span><h3>${t}</h3><p>${d}</p>${ms.length ? `<span class="tm-faces">${ms.slice(0, 5).map((m) => avatar(m, 'tm-face')).join('')}<em>${ms.length === 1 ? esc(first(ms[0].name)) : `${ms.length} people`}</em></span>` : ''}</button>`; }).join('')}</div>
</div></section>

<section class="tm-people" id="people"><div class="wrap">
  <p class="tm-kicker rv">A team is more than a job title</p>
  <h2 class="tm-h rv">What you do is only the beginning.</h2>
  <ol class="tm-prog rv">${['Started', 'Learned', 'Took responsibility', 'Led', 'Passed it on'].map((s, i) => `<li><span>${i + 1}</span>${s}</li>`).join('')}</ol>
  <p class="tm-lead rv">Leadership should multiply. Someone learned from someone. Now someone learns from them.</p>
  ${people.length ? `<div class="tm-filter rv" role="group" aria-label="Show people"><button type="button" class="on" data-filter="all">Everyone</button>${KINDS.filter(([k]) => people.some((m) => m.k === k)).map(([k, t]) => `<button type="button" data-filter="${k}">${t.replace('The people who ', '').replace(/^./, (c) => c.toUpperCase())}</button>`).join('')}</div>
  <div class="tm-cards">${people.map(profile).join('')}</div>` : ''}
</div></section>

${quotes.length ? `<section class="tm-voices" id="voices"><div class="wrap">
  <p class="tm-kicker rv">In their own words</p><h2 class="tm-h rv">Not what we say about them. What they say.</h2>
  <div class="tm-quotes">${quotes.map((m) => `<figure class="rv">${m.quoteOk ? '' : draft}<blockquote>${esc(m.quote)}</blockquote><figcaption>${avatar(m, 'tm-face')}<span><b>${esc(m.name)}</b>${esc(m.role)}</span></figcaption></figure>`).join('')}</div>
</div></section>` : drafts ? `<section class="tm-voices"><div class="wrap"><p class="tm-kicker">In their own words</p><p class="tm-hint">Staging only: this section appears when a team member has a Quote with Quote Approved ticked in Airtable. Use their real words, not ours.</p></div></section>` : ''}

<section class="tm-know" id="knowledge"><div class="wrap">
  <div class="tm-know-head"><div><p class="tm-kicker rv">What we know because we live here</p><h2 class="tm-h rv">Some knowledge cannot be Googled.</h2></div>
  <img class="rv" src="${esc(photo('hidden-kingdom', 2))}" alt="A shared meal on leaves after dark" loading="lazy"></div>
  <div class="tm-know-grid">
    ${knowers.map((m) => `<div class="tm-kcard rv"><b>${esc(first(m.name))} knows…</b><p>${esc(String(m.knows).split(/\n+/)[0])}</p></div>`).join('')}
    <div class="tm-kcard rv"><b>A village host knows…</b><p>How a particular meal is traditionally prepared.</p></div>
    <div class="tm-kcard rv"><b>An educator knows…</b><p>How to get a group of children to stop and actually look.</p></div>
  </div>
  <p class="tm-p rv">Rock &amp; Anchor is stronger because knowledge is shared between people who live here and people who have chosen to work here. People, places, animals, ecosystems and knowledge all have value in themselves. Nobody here is a resource.</p>
</div></section>

<section class="tm-circle" id="circle"><div class="wrap tm-circle-grid">
  <div><p class="tm-kicker rv">A circle, not a hierarchy</p><h2 class="tm-h rv">Everyone brings something. Everyone receives something.</h2>
  <div class="tm-give" aria-live="polite">${circle.map(([who, brings, gets], i) => `<div class="tm-give-card" data-i="${i}"${i ? ' hidden' : ''}><h3>${who}</h3><div><span>Brings</span><b>${brings}</b></div><div><span>Receives</span><b>${gets}</b></div></div>`).join('')}</div>
  <p class="tm-tip">Tap a circle to see what each person brings and receives.</p></div>
  <div class="rv">${circleSvg}</div>
</div></section>

<section class="tm-learn" id="learning"><div class="wrap">
  <p class="tm-kicker rv">What we learn from each other</p><h2 class="tm-h rv">Nobody arrives knowing everything.</h2>
  <div class="tm-two">
    <div class="rv"><h3>We teach</h3><ul>${['Safety', 'Outdoor leadership', 'First aid', 'Experience design', 'Communication', 'Facilitation'].map((x) => `<li>${x}</li>`).join('')}</ul></div>
    <span class="tm-swap" aria-hidden="true">⇄</span>
    <div class="rv"><h3>We learn</h3><ul>${['Local knowledge', 'Farming', 'Stories', 'Seasons', 'Culture', 'Ways of living with the landscape'].map((x) => `<li>${x}</li>`).join('')}</ul></div>
  </div>
  <p class="tm-quote rv">The best teams are not built around one person knowing everything. They are built around people being willing to learn from one another.</p>
</div></section>

<section class="tm-ladder" id="leadership"><div class="wrap tm-ladder-grid">
  <div><p class="tm-kicker rv">From participant to leader</p><h2 class="tm-h rv">What leadership looks like here.</h2>
  <p class="tm-p rv">Not everyone follows the same path, or at the same pace. But this is the direction we are always moving people in.</p>
  <div class="tm-step-text" aria-live="polite">${ladder.map(([s, d], i) => `<div data-i="${i}"${i ? ' hidden' : ''}><b>${s}</b><p>${d}</p></div>`).join('')}</div></div>
  <ol class="tm-rungs rv">${ladder.map(([s], i) => `<li><button type="button" data-i="${i}" class="${i ? '' : 'on'}" style="--i:${i}"><span>${String(i + 1).padStart(2, '0')}</span>${s}<small>${ladder[i][1]}</small></button></li>`).join('')}</ol>
</div></section>

<section class="tm-own" id="capable"><div class="wrap">
  <h2 class="tm-big rv">We do not want people to work for Rock &amp; Anchor forever.</h2>
  <p class="tm-lead rv">We want people to leave us more capable than when they arrived.</p>
  <ul class="tm-capable">${['leading', 'creating', 'expressing an idea', 'bringing others along', 'building something of their own'].map((x) => `<li class="rv">Capable of <b>${x}.</b></li>`).join('')}</ul>
</div></section>

<section class="tm-hand" id="handover"><div class="wrap">
  <p class="tm-kicker rv">Handover</p><h2 class="tm-h rv">The goal is not to be needed forever.</h2>
  <ol class="tm-chain">${['Aaditya teaches someone', 'That person leads', 'They teach someone else', 'That person leads', 'The capability stays in the community'].map((s, i, a) => `<li class="rv${i === a.length - 1 ? ' last' : ''}">${s}</li>`).join('')}</ol>
  <div class="tm-not rv"><p><s>“We created a great guide.”</s></p><p><b>“We created someone who can create another great guide.”</b></p></div>
  ${chains.length ? `<div class="tm-real rv"><h3>It is already happening</h3><ul>${chains.map((m) => `<li>${teachers(m).map((t) => `<b>${esc(t.name)}</b>`).join(' and ')} <i>→</i> <b>${esc(m.name)}</b>${students(m).length ? ` <i>→</i> ${students(m).map((s) => `<b>${esc(s.name)}</b>`).join(', ')}` : ''}</li>`).join('')}</ul></div>` : ''}
</div></section>

<section class="tm-places" id="places"><div class="wrap">
  <p class="tm-kicker rv">People behind the places</p><h2 class="tm-h rv">These are not abstract “local communities”. These are actual people.</h2>
  <p class="tm-p rv">Wherever we work, a day outdoors depends on a small circle of people. We do not name the villages we work in, to protect the people who live there and the places themselves. But we can tell you who you will meet.</p>
  <ul class="tm-roles rv">${['Guide', 'Host', 'Cook', 'School contact', 'Facilitator'].map((r) => `<li>${r}</li>`).join('')}</ul>
  ${areaList.length ? `<div class="tm-areas">${areaList.map((a) => `<div class="tm-area rv"><h3>${esc(a)}</h3><ul>${areas[a].map((m) => `<li>${avatar(m, 'tm-face')}<span><b>${esc(m.name)}</b>${esc(m.role)}</span></li>`).join('')}</ul></div>`).join('')}</div>` : drafts ? '<p class="tm-hint">Staging only: add a general Area (for example Karjat or Shahapur, never a village) to team members in Airtable to group them here.</p>' : ''}
</div></section>

${founders.length ? `<section class="tm-founders" id="founders"><div class="wrap">
  <p class="tm-kicker rv">The founders</p><h2 class="tm-h rv">Started it. Still learning how to build it.</h2>
  <div class="tm-cards tm-cards-2">${founders.map(profile).join('')}</div>
  <a class="tm-link rv" href="/about#origin">How it started →</a>
</div></section>` : ''}

<section class="tm-place" id="practice"><div class="wrap tm-place-grid">
  <div><p class="tm-kicker rv">How we work</p><h2 class="tm-h rv">A team that knows it is part of the place.</h2>
  <p class="tm-p rv">You cannot care for a place you treat as separate from yourself. There is no Earth 2.0, so the team is trained not just to deliver experiences, but to understand the consequences of delivering them.</p></div>
  <ul class="tm-practice">${['Leave No Trace', 'Group management', 'Safety', 'Local sourcing', 'Respect for village life', 'Responsible interaction with wildlife', 'Waste management', 'Resource use'].map((x) => `<li class="rv">${x}</li>`).join('')}</ul>
</div></section>

<section class="tm-end" id="meet"><img src="${esc(photo('little-feet-sunset-safari', 1))}" alt="" loading="lazy"><div class="wrap">
  <h2>Who will you meet?</h2>
  <p>The next time you come to the mountains with us, you will probably meet someone who knows the place better than we ever could.</p>
  <p class="tm-say">Say hello. Ask questions. Learn something. And maybe teach them something too.</p>
  <div class="tm-end-cta"><a class="btn btn-clay" href="/experiences">Explore experiences</a><a class="btn btn-ghost" href="#people">Meet the people</a><a class="btn btn-ghost" href="${workWith}">${ICON.wa}Work with us</a></div>
</div></section>
</div>
<script>${TEAM_JS}</script>`;
  return layout({ title: 'Team', desc: 'The people who make Rock & Anchor: local guides, experience leaders, outdoor educators and the people learning to lead.', path: '/team', body, image: photo('winter-trekking', 1), data });
}

const TEAM_JS = `(function(){
var d=document,w=window,rm=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
d.documentElement.classList.add('tmjs');
var io=('IntersectionObserver' in w)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'}):null;
d.querySelectorAll('.tm .rv').forEach(function(el){if(io&&!rm)io.observe(el);else el.classList.add('in')});
var fb=d.querySelectorAll('.tm-filter button'),cards=d.querySelectorAll('.tm-people .tm-card');
function filt(k){fb.forEach(function(b){b.classList.toggle('on',b.dataset.filter===k)});cards.forEach(function(c){c.hidden=!(k==='all'||c.dataset.kind===k);if(!c.hidden)c.classList.add('in')})}
fb.forEach(function(b){b.addEventListener('click',function(){filt(b.dataset.filter)})});
d.querySelectorAll('.tm-kind').forEach(function(b){b.addEventListener('click',function(){var k=b.dataset.filter,has=false;fb.forEach(function(x){if(x.dataset.filter===k)has=true});filt(has?k:'all');d.getElementById('people').scrollIntoView({behavior:rm?'auto':'smooth'})})});
var nodes=d.querySelectorAll('.tm-ring .node'),gc=d.querySelectorAll('.tm-give-card');
function pick(i){nodes.forEach(function(n){n.classList.toggle('on',n.dataset.i===i)});gc.forEach(function(c){c.hidden=c.dataset.i!==i})}
nodes.forEach(function(n){n.addEventListener('click',function(){pick(n.dataset.i)});n.addEventListener('mouseenter',function(){pick(n.dataset.i)});n.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(n.dataset.i)}})});
var rb=d.querySelectorAll('.tm-rungs button'),st=d.querySelectorAll('.tm-step-text>div');
function step(i){rb.forEach(function(b){var n=+b.dataset.i;b.classList.toggle('on',n===+i);b.classList.toggle('past',n<+i)});st.forEach(function(s){s.hidden=s.dataset.i!==String(i)})}
rb.forEach(function(b){b.addEventListener('click',function(){step(b.dataset.i)});b.addEventListener('mouseenter',function(){step(b.dataset.i)})});
})();`;

const TEAM_CSS = `
.tm{--sp:clamp(64px,9vw,120px)}
.tm section{padding:var(--sp) 0}
.tm-staging{background:#fff4d6;border-bottom:1px solid #ecd9a4;color:#6b5517;font-size:14px;padding:10px 20px;text-align:center}
.tm-draft{display:inline-block;background:#fff1c9;color:#7a5b00;border:1px solid #ecd9a4;font:700 11px/1 "DM Sans",sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:5px 8px;border-radius:999px;margin:0 0 10px}
.tm-hint{background:#fff8e6;border:1px dashed #e2c87a;color:#6b5517;border-radius:12px;padding:12px 14px;font-size:14px;margin:14px 0 0}
.tm-kicker{font:700 13px/1 "DM Sans",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--clay);margin:0 0 16px}
.tm-h{font-size:clamp(34px,5.2vw,66px);max-width:20ch;margin:0 0 .5em}
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
.tm-hero h1{font-size:clamp(46px,7.4vw,104px);max-width:12ch;margin:0 0 .3em;text-shadow:0 2px 20px rgba(0,0,0,.35)}
.tm-sub{font-size:clamp(17px,1.9vw,21px);max-width:54ch;margin:0 0 26px;color:#f2ede6;text-shadow:0 1px 10px rgba(0,0,0,.5)}
.tm-scroll{color:#fff;font-weight:700;text-decoration:none;border-bottom:2px solid #f3c9a6;padding-bottom:3px}
/* kinds */
.tm-kind-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:30px}
.tm-kind{text-align:left;font:inherit;color:var(--ink);background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:24px 22px;cursor:pointer;display:flex;flex-direction:column;gap:6px;transition:transform .2s,box-shadow .2s,border-color .2s}
.tm-kind:hover{transform:translateY(-4px);box-shadow:0 18px 32px -24px rgba(34,29,25,.55);border-color:#d6cbb9}
.tm-num{font:800 15px "Big Shoulders Display","Arial Narrow",sans-serif;color:var(--clay);letter-spacing:.1em}
.tm-kind h3{font-size:clamp(24px,2.2vw,30px);margin:0;line-height:1.05}
.tm-kind p{margin:4px 0 0;color:var(--ink2);font-size:15.5px}
.tm-faces{display:flex;align-items:center;margin-top:auto;padding-top:14px}
.tm-faces .tm-face{margin-right:-8px;border:2px solid var(--card)}
.tm-faces em{font-style:normal;font-weight:700;font-size:14px;color:var(--forest);margin-left:16px}
.tm-face{width:38px;height:38px;border-radius:50%;object-fit:cover;flex:0 0 38px}
.tm-ini{display:grid;place-items:center;background:var(--forest);color:#f3c9a6;font:800 15px/1 "Big Shoulders Display","Arial Narrow",sans-serif}
/* people */
.tm-people{background:#efe7da}
.tm-prog{list-style:none;padding:0;margin:10px 0 18px;display:flex;flex-wrap:wrap;gap:0;counter-reset:x}
.tm-prog li{display:flex;align-items:center;gap:10px;font-weight:700;font-size:clamp(15px,1.5vw,18px);color:var(--forest);padding:8px 0}
.tm-prog li:not(:last-child):after{content:"";width:clamp(18px,3vw,44px);height:2px;background:repeating-linear-gradient(90deg,var(--clay) 0 6px,transparent 6px 10px);margin:0 12px}
.tm-prog span{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--forest);color:#fff;font-size:13px}
.tm-prog li:last-child span{background:var(--clay)}
.tm-filter{display:flex;flex-wrap:wrap;gap:10px;margin:34px 0 22px}
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
.tm-card h3{margin:2px 0 0;font-size:34px;line-height:1}
.tm-since{color:var(--muted);font-size:13.5px}
.tm-bio p{margin:0 0 6px;color:var(--ink2)}
.tm-ask b{display:block;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--forest);margin-bottom:8px}
.tm-ask ul{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:6px}
.tm-ask li{background:var(--moss);color:var(--forest);font-weight:600;font-size:14px;padding:5px 11px;border-radius:999px}
.tm-more{border-top:1px solid var(--line);padding-top:10px;margin-top:auto}
.tm-more summary{cursor:pointer;font-weight:700;color:var(--clay);list-style:none;padding:4px 0}
.tm-more summary::-webkit-details-marker{display:none}
.tm-more summary:after{content:" +";}.tm-more[open] summary:after{content:" \\2212"}
.tm dl{margin:6px 0 0}.tm dl>div{padding:10px 0;border-top:1px solid var(--line)}
.tm dt{font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--clay);margin-bottom:4px}
.tm dd{margin:0;color:var(--ink2)}.tm dd p{margin:0 0 6px}
/* voices */
.tm-voices{background:var(--forest);color:#fff}
.tm-voices .tm-kicker{color:#f3c9a6}.tm-voices .tm-hint{background:rgba(255,255,255,.08);color:#f2ede6;border-color:rgba(255,255,255,.3)}
.tm-quotes{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px;margin-top:24px}
.tm-quotes figure{margin:0;border:1px solid rgba(255,255,255,.18);border-radius:18px;padding:26px}
.tm-quotes blockquote{margin:0 0 20px;font:800 clamp(24px,2.4vw,32px)/1.15 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase}
.tm-quotes blockquote:before{content:"\\201C";display:block;font-size:64px;line-height:.6;color:#f3c9a6;margin-bottom:8px}
.tm-quotes figcaption{display:flex;gap:12px;align-items:center}.tm-quotes figcaption span{display:flex;flex-direction:column;font-size:14px;color:#d8e2da}.tm-quotes figcaption b{color:#fff;font-size:16px}
/* knowledge */
.tm-know-head{display:grid;grid-template-columns:1.3fr 1fr;gap:40px;align-items:end}
.tm-know-head img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:18px}
.tm-know-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;margin:30px 0 26px}
.tm-kcard{background:var(--card);border:1px solid var(--line);border-left:5px solid var(--clay);border-radius:var(--r);padding:22px}
.tm-kcard b{font:800 26px/1 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;color:var(--forest)}
.tm-kcard p{margin:10px 0 0;font-size:18px;color:var(--ink)}
/* circle */
.tm-circle{background:var(--card);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.tm-circle-grid{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}
.tm-ring{width:100%;max-width:520px;display:block;margin:0 auto}
.tm-ring .ring{fill:none;stroke:var(--clay);stroke-width:2;stroke-dasharray:6 8}
.tm-ring .core{fill:var(--forest)}
.tm-ring .core-t{fill:#f3c9a6;font:800 26px "Big Shoulders Display","Arial Narrow",sans-serif;text-anchor:middle;text-transform:uppercase}
.tm-ring .node{cursor:pointer;outline:none}
.tm-ring .node circle{fill:var(--paper);stroke:var(--line);stroke-width:2;transition:fill .2s,stroke .2s}
.tm-ring .node text{font:700 16px "DM Sans",sans-serif;fill:var(--ink);text-anchor:middle}
.tm-ring .node.on circle,.tm-ring .node:focus circle{fill:var(--clay);stroke:var(--clay)}.tm-ring .node.on text{fill:#fff}
.tm-give-card{background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:24px;margin-top:10px}
.tm-give-card h3{font-size:34px;margin:0 0 10px}
.tm-give-card div{display:grid;grid-template-columns:100px 1fr;gap:10px;padding:10px 0;border-top:1px solid var(--line)}
.tm-give-card span{font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--clay);padding-top:3px}
.tm-give-card b{font-size:19px;font-weight:600}
.tm-tip{color:var(--muted);font-size:14px;margin-top:12px}
/* learn */
.tm-two{display:grid;grid-template-columns:1fr auto 1fr;gap:24px;align-items:center;margin-top:24px}
.tm-two>div{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:26px}
.tm-two h3{font-size:32px;margin:0 0 10px}
.tm-two ul{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:8px}
.tm-two li{background:var(--paper);border:1px solid var(--line);border-radius:999px;padding:7px 14px;font-weight:600}
.tm-two>div:last-child li{background:var(--moss);border-color:#cfdcc9;color:var(--forest)}
.tm-swap{font-size:40px;color:var(--clay)}
.tm-quote{font:800 clamp(26px,3.4vw,42px)/1.1 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;color:var(--forest);max-width:30ch;margin:44px 0 0}
/* ladder */
.tm-ladder{background:var(--night);color:#fff}
.tm-ladder .tm-kicker{color:#f3c9a6}.tm-ladder .tm-p{color:#cfd5dc}
.tm-ladder-grid{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}
.tm-step-text>div{border-left:3px solid var(--clay);padding:6px 0 6px 18px;margin-top:24px}
.tm-step-text b{font:800 34px/1 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;color:#f3c9a6}
.tm-step-text p{margin:8px 0 0;font-size:18px;color:#e6e9ee;max-width:42ch}
.tm-rungs{list-style:none;padding:0;margin:0;display:flex;flex-direction:column-reverse;gap:10px}
.tm-rungs button{width:calc(52% + var(--i) * 9.6%);display:flex;align-items:center;gap:14px;text-align:left;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.04);color:#fff;border-radius:12px;padding:14px 16px;font:700 17px "DM Sans",sans-serif;cursor:pointer;transition:background .2s,border-color .2s}
.tm-rungs button small{display:none}
.tm-rungs button span{font:800 15px "Big Shoulders Display","Arial Narrow",sans-serif;color:#f3c9a6}
.tm-rungs button.past{border-color:rgba(243,201,166,.45)}
.tm-rungs button.on{background:var(--clay);border-color:var(--clay)}.tm-rungs button.on span{color:#fff}
/* capable */
.tm-own{text-align:center}
.tm-big{font-size:clamp(40px,6.4vw,88px);max-width:16ch;margin:0 auto .35em}
.tm-own .tm-lead{margin:0 auto 30px}
.tm-capable{list-style:none;padding:0;margin:0 auto;max-width:640px}
.tm-capable li{padding:12px 0;border-top:1px solid var(--line);font-size:clamp(19px,2vw,24px);color:var(--ink2)}
.tm-capable b{color:var(--forest)}
/* handover */
.tm-hand{background:#efe7da}
.tm-chain{list-style:none;padding:0;margin:30px 0;display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
.tm-chain li{position:relative;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px 16px;font-weight:700;font-size:17px;min-height:96px;display:flex;align-items:center}
.tm-chain li:not(.last):after{content:"→";position:absolute;right:-13px;top:50%;transform:translateY(-50%);width:22px;height:22px;border-radius:50%;background:var(--clay);color:#fff;display:grid;place-items:center;font-size:13px;z-index:1}
.tm-chain li.last{background:var(--forest);color:#fff;border-color:var(--forest)}
.tm-not p{margin:6px 0;font-size:clamp(20px,2.4vw,28px)}.tm-not s{color:var(--muted)}.tm-not b{color:var(--forest)}
.tm-real{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:22px;margin-top:26px}
.tm-real h3{font-size:26px;margin:0 0 8px}.tm-real ul{list-style:none;padding:0;margin:0}.tm-real li{padding:8px 0;border-top:1px solid var(--line)}.tm-real i{font-style:normal;color:var(--clay);margin:0 6px}
/* places */
.tm-roles{list-style:none;padding:0;margin:24px 0 0;display:flex;flex-wrap:wrap;gap:12px}
.tm-roles li{font:800 clamp(22px,2.4vw,30px)/1 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;background:var(--card);border:1px solid var(--line);border-radius:999px;padding:14px 24px;color:var(--forest)}
.tm-areas{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;margin-top:28px}
.tm-area{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:22px}
.tm-area h3{font-size:32px;margin:0 0 10px}.tm-area ul{list-style:none;padding:0;margin:0}
.tm-area li{display:flex;gap:12px;align-items:center;padding:8px 0;border-top:1px solid var(--line)}.tm-area li span{display:flex;flex-direction:column;font-size:14px;color:var(--muted)}.tm-area li b{color:var(--ink);font-size:16px}
/* founders */
.tm-founders{background:var(--card);border-top:1px solid var(--line)}
.tm-link{display:inline-block;margin-top:22px;font-weight:700;color:var(--clay);text-decoration:none}
/* practice */
.tm-place-grid{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}
.tm-practice{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:10px}
.tm-practice li{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px 14px 42px;position:relative;font-weight:600}
.tm-practice li:before{content:"";position:absolute;left:16px;top:50%;width:12px;height:12px;margin-top:-6px;border-radius:50%;background:var(--forest2)}
/* end */
.tm-end{position:relative;color:#fff;text-align:center;overflow:hidden;background:var(--night)}
.tm-end img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.45}
.tm-end .wrap{position:relative}
.tm-end h2{font-size:clamp(46px,7.4vw,100px);margin:0 auto .3em;max-width:14ch;text-shadow:0 2px 20px rgba(0,0,0,.35)}
.tm-end p{font-size:clamp(18px,2vw,22px);max-width:48ch;margin:0 auto 14px;color:#f2ede6;text-shadow:0 1px 10px rgba(0,0,0,.5)}
.tm-say{font-weight:700;color:#f3c9a6!important;margin-bottom:32px!important}
.tm-end-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.tm-end .btn-ghost{color:#fff;border-color:rgba(255,255,255,.6)}
@media(max-width:980px){.tm-kind-grid{grid-template-columns:1fr 1fr}.tm-chain{grid-template-columns:1fr}.tm-chain li{min-height:0}.tm-chain li:not(.last):after{content:"↓";right:auto;left:24px;top:auto;bottom:-14px;transform:none}}
@media(max-width:900px){.tm-circle-grid,.tm-ladder-grid,.tm-place-grid,.tm-know-head{grid-template-columns:1fr;gap:28px}.tm-two{grid-template-columns:1fr}.tm-swap{text-align:center;transform:rotate(90deg)}}
@media(max-width:900px){.tm-step-text{display:none}.tm-rungs{flex-direction:column}.tm-rungs button{flex-wrap:wrap}.tm-rungs button.on small{display:block;flex-basis:100%;font:400 15px/1.45 "DM Sans",sans-serif;color:#fff}}
@media(max-width:600px){.tm-kind-grid{grid-template-columns:1fr}.tm-practice{grid-template-columns:1fr}.tm-rungs button{width:100%}.tm-cards{grid-template-columns:1fr}.tm-prog li:not(:last-child):after{width:14px;margin:0 6px}}
`;
