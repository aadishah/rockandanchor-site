// ---------- Impact Created: the open impact books ----------
// Impact speaks as evidence: what happened, what changed, where the money went. No philosophy, no team directory,
// no selling. A person appears here only as evidence of change (Stories), never simply because they are on the team.
// About Us explains the system. Impact Created opens it up: numbers, money flow, projects, people,
// places, outcomes, what we measure, what did not work and a year-by-year archive.
// Evidence sections read from the Website Impact tables in Airtable and stay hidden until rows are published.
// On the staging address, unpublished rows are shown with a "Draft" badge so they can be reviewed.
function impactPage(data, opts = {}) {
  const drafts = !!opts.drafts;
  const ev = data.evidence || { projects: [], stories: [], learnings: [], money: [], places: [] };
  const vis = (list) => (list || []).filter((x) => x.live || drafts);
  const projects = vis(ev.projects), stories = vis(ev.stories), learnings = vis(ev.learnings), money = vis(ev.money), places = vis(ev.places);
  const draft = (x) => (x.live ? '' : '<span class="im-draft">Draft, not public</span>');
  const p = (t) => (t ? String(t).split(/\n+/).filter(Boolean).map((l) => `<p>${esc(l)}</p>`).join('') : '');
  const photo = (slug, i, big = true) => { const x = bySlug(data, slug); const ph = x && x.photos && (x.photos[i] || x.photos[0]); return ph ? (big ? ph.url : ph.thumb) : cover(sorted(data)[0], big); };
  const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
  const workWith = waLink('Hi Rock & Anchor, I would like to work with you (school, company or partnership).');

  // 2. Numbers: from the Website Impact table. "Click Opens" decides what each number reveals.
  const has = { Stories: stories.length, Projects: projects.length, Money: money.length, Places: places.length };
  const nums = (data.impact || []).map((m, i) => ({ ...m, i, link: has[m.opens] ? m.opens : '' }));
  const numCard = (m) => `<${m.link ? 'button type="button"' : 'div'} class="im-num${m.link ? ' im-click' : ''}"${m.link ? ` data-open="${m.link}"` : ''}><b>${esc(m.value)}</b><span>${esc(m.metric)}</span>${m.link ? `<em>See the evidence →</em>` : ''}</${m.link ? 'button' : 'div'}>`;
  const schoolsCard = `<button type="button" class="im-num im-click im-accent" data-open="${projects.some((x) => x.category === 'Education') ? 'Education' : 'Money'}"><b>25%</b><span>Of Net Profit goes to village schools</span><em>See what it funded →</em></button>`;

  // 3. Follow the money.
  const steps = [
    ['You book an experience', ''],
    ['Experience delivery', ''],
    ['Local people are paid', 'Local people are paid'],
    ['Village businesses participate', 'Village businesses participate'],
    ['25% of Net Profit supports village schools', 'Village schools'],
    ['Skills, infrastructure and opportunity', 'Skills, infrastructure and opportunity'],
  ];
  const moneyFor = (k) => money.filter((m) => k && m.step === k);
  const fig = (m) => `<li>${draft(m)}<b>${m.amount != null ? inr(m.amount) : m.count != null ? Number(m.count).toLocaleString('en-IN') : ''}</b> <span>${esc(m.label)}</span>${m.period ? ` <small>${esc(m.period)}</small>` : ''}${m.note ? `<p>${esc(m.note)}</p>` : ''}</li>`;

  // 4. Projects.
  const projCard = (x) => `<article class="im-proj rv" data-cat="${esc(x.category)}">${x.photo ? `<img src="${esc(x.photo)}" alt="" loading="lazy">` : ''}<div class="im-proj-body">${draft(x)}
    <div class="im-tags">${[x.category, x.area, x.year, x.status].filter(Boolean).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
    <h3>${esc(x.title)}</h3>
    <dl>${[['What we saw', x.saw], ['What we did', x.did], ['Who was involved', x.who], ['What changed', x.changed], ['What happens next', x.next]].filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${p(v)}</dd></div>`).join('')}</dl>
  </div></article>`;

  // 5. Stories.
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const storyCard = (x) => `<article class="im-story rv">${x.photo ? `<img src="${esc(x.photo)}" alt="${esc(x.name)}" loading="lazy">` : `<span class="im-av">${esc(initials(x.name))}</span>`}<div>${draft(x)}<h3>${esc(x.name)}</h3>
    ${x.then || x.now ? `<p class="im-path">${x.then ? `<span>${esc(x.then)}</span>` : ''}${x.then && x.now ? '<i>→</i>' : ''}${x.now ? `<span class="now">${esc(x.now)}</span>` : ''}</p>` : ''}
    <dl>${[['Started', x.started], ['Learned', x.learned], ['Today', x.today], ['Next', x.next]].filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${p(v)}</dd></div>`).join('')}</dl>
    ${drafts && !x.started && !x.learned && !x.today ? '<p class="im-muted">Add their story in Airtable: Website Impact Stories.</p>' : ''}</div></article>`;

  // 6. Then and now, only where both sides are written down.
  const thenNow = [
    ...stories.filter((x) => x.then && x.now).map((x) => ['Person', x.name, x.then, x.now, x]),
    ...projects.filter((x) => x.saw && x.changed).map((x) => [x.category === 'Education' ? 'School' : x.category || 'Project', x.title, x.saw, x.changed, x]),
  ];

  // 7. Places map. General areas only, never villages or exact positions.
  const box = { n: 19.8, s: 18.6, w: 72.6, e: 73.8 }, W = 600, H = 600;
  const px = (lng) => ((lng - box.w) / (box.e - box.w)) * W, py = (lat) => ((box.n - lat) / (box.n - box.s)) * H;
  const expsIn = (pl) => sorted(data).filter((e) => { const loc = String(e.location || '').toLowerCase(); return pl.match.some((m) => loc.startsWith(m)); });
  const placeData = places.map((pl, i) => ({ ...pl, i, exps: expsIn(pl) }));
  const mapSvg = `<svg class="im-map" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="mapT"><title id="mapT">A schematic map of the areas around Mumbai where Rock &amp; Anchor works. Areas are approximate.</title>
    <path class="sea" d="M0 0H${px(72.95).toFixed(0)}C${px(72.9).toFixed(0)} 120 ${px(72.85).toFixed(0)} 260 ${px(72.95).toFixed(0)} 360S${px(73.0).toFixed(0)} 520 ${px(72.98).toFixed(0)} ${H}H0Z"/>
    <text class="sea-t" x="40" y="${H - 40}">Arabian Sea</text>
    <path class="ridge" d="M${px(73.55).toFixed(0)} 20C${px(73.62).toFixed(0)} 160 ${px(73.5).toFixed(0)} 300 ${px(73.62).toFixed(0)} 440S${px(73.55).toFixed(0)} 560 ${px(73.6).toFixed(0)} ${H}"/>
    <text class="ridge-t" x="${(px(73.62) + 12).toFixed(0)}" y="300" transform="rotate(90 ${(px(73.62) + 12).toFixed(0)} 300)">SAHYADRIS</text>
    ${placeData.filter((pl) => pl.lat != null && pl.lng != null).map((pl) => `<g class="pin${pl.live ? '' : ' is-draft'}" data-place="${pl.i}" tabindex="0" role="button" aria-label="${esc(pl.area)}"><circle class="halo" cx="${px(pl.lng).toFixed(1)}" cy="${py(pl.lat).toFixed(1)}" r="34"/><circle class="dot" cx="${px(pl.lng).toFixed(1)}" cy="${py(pl.lat).toFixed(1)}" r="11"/><text x="${(px(pl.lng) + 20).toFixed(1)}" y="${(py(pl.lat) + 6).toFixed(1)}">${esc(pl.area)}</text></g>`).join('')}
  </svg>`;
  const placePanel = (pl) => `<div class="im-place" data-place="${pl.i}"${pl.i ? ' hidden' : ''}>${draft(pl)}<h3>${esc(pl.area)}</h3>${p(pl.summary)}
    <dl>
      ${pl.exps.length ? `<div><dt>Experiences run here</dt><dd><ul>${pl.exps.map((e) => `<li><a href="/experiences/${esc(e.slug)}">${esc(e.title)}</a></li>`).join('')}</ul></dd></div>` : ''}
      ${pl.hosts != null ? `<div><dt>Local hosts</dt><dd>${esc(pl.hosts)}</dd></div>` : ''}
      ${[['School initiatives', pl.schools], ['Training', pl.training], ['Environmental work', pl.env], ['Stories', pl.stories]].filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${p(v)}</dd></div>`).join('')}
    </dl></div>`;

  // 11. Archive by year.
  const years = {};
  const addY = (y, kind, label, live) => { if (!y) return; (years[y] = years[y] || []).push({ kind, label, live }); };
  projects.forEach((x) => addY(x.year, 'Project', x.title, x.live));
  stories.forEach((x) => addY(x.year, 'Person', `${x.name}${x.now ? `, ${x.now}` : ''}`, x.live));
  learnings.forEach((x) => addY(x.year, 'Learning', x.title, x.live));
  const yearList = Object.keys(years).sort();

  // Modal content for clickable numbers.
  const modal = (key, title, inner) => `<div class="im-m" data-m="${key}" hidden><h3>${title}</h3>${inner}</div>`;
  const modals = [
    stories.length ? modal('Stories', 'The people behind the number', `<ul class="im-mlist">${stories.map((x) => `<li><b>${esc(x.name)}</b>${x.now ? ` <span>${esc(x.now)}</span>` : ''}${x.today ? `<p>${esc(x.today)}</p>` : ''}${draft(x)}</li>`).join('')}</ul><a class="im-link" href="#people" data-close>Read their stories →</a>`) : '',
    projects.length ? modal('Projects', 'The work behind the number', `<ul class="im-mlist">${projects.map((x) => `<li><b>${esc(x.title)}</b>${x.did ? `<p>${esc(x.did)}</p>` : ''}${draft(x)}</li>`).join('')}</ul><a class="im-link" href="#projects" data-close>See all projects →</a>`) : '',
    projects.some((x) => x.category === 'Education') ? modal('Education', 'What 25% of Net Profit has funded', `<ul class="im-mlist">${projects.filter((x) => x.category === 'Education').map((x) => `<li><b>${esc(x.title)}</b>${x.did ? `<p>${esc(x.did)}</p>` : ''}${draft(x)}</li>`).join('')}</ul><a class="im-link" href="#projects" data-close>See all projects →</a>`) : '',
    money.length ? modal('Money', 'Where the money went', `<ul class="im-mlist">${money.map(fig).join('')}</ul><a class="im-link" href="#money" data-close>Follow the money →</a>`) : modal('Money', 'Where the money goes', `<p>25% of Net Profit funds schools in the mountain villages we work in.</p><a class="im-link" href="#money" data-close>Follow the money →</a>`),
    places.length ? modal('Places', 'Where it happened', `<ul class="im-mlist">${placeData.map((pl) => `<li><b>${esc(pl.area)}</b>${pl.exps.length ? ` <span>${pl.exps.length} experience${pl.exps.length > 1 ? 's' : ''}</span>` : ''}${draft(pl)}</li>`).join('')}</ul><a class="im-link" href="#places" data-close>Open the map →</a>`) : '',
  ].join('');

  const body = `<style>${IMPACT_CSS}</style>
<div class="im">
${drafts ? '<div class="im-staging">Staging preview: rows marked <b>Draft, not public</b> are hidden on the live site until you tick Show on Website in Airtable.</div>' : ''}
<section class="im-hero"><img src="${esc(photo('be-a-villager', 3))}" alt="" fetchpriority="high"><div class="wrap">
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
  ${money.length ? '' : '<p class="im-note rv">We are adding the real figures for each step. Until then, we would rather show you the path than an estimate.</p>'}</div>
  <ol class="im-flow">${steps.map(([label, key], i) => `<li class="rv"><span class="im-step">${String(i + 1).padStart(2, '0')}</span><div><h3>${label}</h3>${moneyFor(key).length ? `<ul class="im-figs">${moneyFor(key).map(fig).join('')}</ul>` : ''}</div></li>`).join('')}</ol>
</div></section>

${projects.length ? `<section class="im-projects" id="projects"><div class="wrap">
  <p class="im-kicker rv">The work behind the number</p><h2 class="im-h rv">Where the impact has happened.</h2>
  <div class="im-projs">${projects.map(projCard).join('')}</div>
</div></section>` : ''}

${stories.length ? `<section class="im-people" id="people"><div class="wrap">
  <p class="im-kicker rv">People stories</p><h2 class="im-h rv">Impact has names.</h2>
  <div class="im-stories">${stories.map(storyCard).join('')}</div>
</div></section>` : ''}

${thenNow.length ? `<section class="im-tn" id="then-now"><div class="wrap">
  <p class="im-kicker rv">Then and now</p><h2 class="im-h rv">Someone started here. Something changed.</h2>
  <div class="im-tn-table rv" role="table"><div class="im-tn-row im-tn-head" role="row"><span role="columnheader"></span><span role="columnheader">Then</span><span role="columnheader">Now</span></div>
  ${thenNow.map(([k, name, a, b, x]) => `<div class="im-tn-row" role="row"><span role="cell"><small>${esc(k)}</small><b>${esc(name)}</b>${draft(x)}</span><span role="cell">${esc(a)}</span><span role="cell" class="now">${esc(b)}</span></div>`).join('')}</div>
</div></section>` : ''}

${places.length ? `<section class="im-places" id="places"><div class="wrap">
  <p class="im-kicker rv">The places</p><h2 class="im-h rv">Places we work are not anonymous backdrops.</h2>
  <p class="im-p rv">We do not share village names or exact locations. It protects the people who live there and the places themselves from overcrowding. The map shows the general areas we work in.</p>
  <div class="im-map-grid"><div class="im-map-wrap rv">${mapSvg}</div><div class="im-place-panel" aria-live="polite">${placeData.map(placePanel).join('')}</div></div>
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

${learnings.length ? `<section class="im-learn" id="learning"><div class="wrap">
  <p class="im-kicker rv">What did not work</p><h2 class="im-h rv">Impact is not always a success story.</h2>
  <div class="im-learns">${learnings.map((x) => `<article class="rv">${draft(x)}<h3>${esc(x.title)}${x.year ? ` <small>${x.year}</small>` : ''}</h3><dl>${[['What we tried', x.tried], ['What happened', x.happened], ['What we learned', x.learned], ['What we changed', x.changed]].filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${p(v)}</dd></div>`).join('')}</dl></article>`).join('')}</div>
</div></section>` : ''}

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
  return layout({ title: 'Impact Created', desc: 'What happens because you travel with Rock & Anchor: the numbers, where the money goes, the projects, the people and the places.', path: '/impact', body, image: photo('be-a-villager', 3), data });
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
var pins=d.querySelectorAll('.im-map .pin'),panels=d.querySelectorAll('.im-place');
function pick(i){pins.forEach(function(p){p.classList.toggle('on',p.dataset.place===i)});panels.forEach(function(p){p.hidden=p.dataset.place!==i})}
pins.forEach(function(p){p.addEventListener('click',function(){pick(p.dataset.place)});p.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(p.dataset.place)}})});
if(pins.length)pick(pins[0].dataset.place);
})();`;

const IMPACT_CSS = `
.im{--sp:clamp(64px,9vw,120px)}
.im section{padding:var(--sp) 0}
.im-staging{background:#fff4d6;border-bottom:1px solid #ecd9a4;color:#6b5517;font-size:14px;padding:10px 20px;text-align:center}
.im-kicker{font:700 13px/1 "DM Sans",sans-serif;letter-spacing:.16em;text-transform:uppercase;color:var(--clay);margin:0 0 16px}
.im-h{font-size:clamp(34px,5.2vw,66px);max-width:18ch;margin:0 0 .5em}
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
.im-accent{background:var(--forest);border-color:var(--forest)}.im-accent b{color:#f3c9a6}.im-accent span{color:#e6ede7}.im-accent em{color:#f3c9a6}
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
/* stories */
.im-people{background:#efe7da}
.im-stories{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;margin-top:28px}
.im-story{display:grid;grid-template-columns:72px 1fr;gap:16px;background:var(--card);border-radius:var(--r);padding:22px;border:1px solid var(--line)}
.im-story img,.im-av{width:72px;height:72px;border-radius:50%;object-fit:cover}
.im-av{display:grid;place-items:center;background:var(--forest);color:#fff;font:800 24px "Big Shoulders Display","Arial Narrow",sans-serif}
.im-story h3{font-size:30px;margin:0}
.im-path{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:6px 0 10px;font-weight:700;color:var(--muted)}
.im-path i{font-style:normal;color:var(--clay)}.im-path .now{color:var(--forest)}
/* then and now */
.im-tn-table{border:1px solid var(--line);border-radius:var(--r);overflow:hidden;background:var(--card);margin-top:24px}
.im-tn-row{display:grid;grid-template-columns:1.1fr 1fr 1fr;gap:18px;padding:16px 20px;border-top:1px solid var(--line)}
.im-tn-head{background:var(--forest);color:#fff;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:13px;border:0}
.im-tn-row small{display:block;color:var(--clay);font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-size:11.5px}
.im-tn-row .now{color:var(--forest);font-weight:600}
/* places */
.im-map-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:40px;align-items:start;margin-top:28px}
.im-map{width:100%;background:#efe7da;border-radius:var(--r)}
.im-map .sea{fill:#d9e6ea}.im-map .sea-t{fill:#7b97a1;font:italic 16px "DM Sans",sans-serif}
.im-map .ridge{fill:none;stroke:#c9b99c;stroke-width:26;stroke-linecap:round;opacity:.55}
.im-map .ridge-t{fill:#a8957a;font:800 15px "Big Shoulders Display","Arial Narrow",sans-serif;letter-spacing:.4em}
.im-map .pin{cursor:pointer;outline:none}
.im-map .pin .halo{fill:var(--clay);opacity:.14;transition:opacity .2s}
.im-map .pin .dot{fill:var(--clay);stroke:#fff;stroke-width:3}
.im-map .pin text{font:800 22px "Big Shoulders Display","Arial Narrow",sans-serif;fill:var(--ink);letter-spacing:.04em;text-transform:uppercase}
.im-map .pin.on .halo,.im-map .pin:focus .halo{opacity:.35}.im-map .pin.on .dot{fill:var(--forest)}
.im-map .pin.is-draft .dot{fill:#c9a227}
.im-place{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:24px}
.im-place h3{font-size:40px;margin:0 0 8px}
.im-place ul{margin:0;padding-left:18px}.im-place a{color:var(--clay);font-weight:700;text-decoration:none}
/* measuring */
.im-measure-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px}
.im-measure-grid>div{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:24px}
.im-measure-grid h3{font-size:28px;margin:0 0 10px}
.im-measure-grid ul{list-style:none;padding:0;margin:0}
.im-measure-grid li{padding:9px 0 9px 30px;border-top:1px solid var(--line);position:relative}
.im-measure-grid li:before{content:"✓";position:absolute;left:4px;color:var(--forest);font-weight:800}
.im-measure-grid .towards li:before{content:"○";color:var(--clay)}
.im-quote{font:800 clamp(26px,3.4vw,42px)/1.1 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;color:var(--forest);max-width:26ch;margin:40px 0 0}
/* learnings */
.im-learn{background:var(--night);color:#fff}
.im-learn .im-kicker{color:#f3c9a6}
.im-learns{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;margin-top:24px}
.im-learns article{border:1px solid rgba(255,255,255,.15);border-radius:var(--r);padding:22px}
.im-learns h3{font-size:28px;margin:0 0 10px}.im-learns small{color:#f3c9a6;font-size:.6em}
.im-learn dl>div{border-color:rgba(255,255,255,.12)}.im-learn dd{color:#d8d2c8}.im-learn dt{color:#f3c9a6}
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
.im-end h2{font-size:clamp(42px,7vw,96px);margin:0 auto .3em;max-width:14ch}
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
.im-money-grid,.im-map-grid,.im-measure-grid{grid-template-columns:1fr;gap:28px}
.im-tn-row{grid-template-columns:1fr 1fr}.im-tn-row>span:first-child{grid-column:1/-1}.im-tn-head>span:first-child{display:none}
}
@media(max-width:600px){.im-story{grid-template-columns:1fr}.im-nums{grid-template-columns:1fr 1fr}.im-num{padding:16px}}
`;
