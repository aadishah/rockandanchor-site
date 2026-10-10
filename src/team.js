// ---------- Team: who makes this real ----------
// Four voices: About speaks as Rock & Anchor (what we believe). Impact speaks as evidence (what happened).
// Team speaks through people (who we are, present tense). Curate speaks to the customer.
// So this page avoids the About manifesto, the Educate > Employ > Empower model, impact numbers and project case studies.
// Profiles read from the Website Team table. Has Learned, Learned From and Building Towards are hidden until filled in. On the staging address, empty profiles show a hint.
function teamPage(data, opts = {}) {
  const drafts = !!opts.drafts;
  const photo = (slug, i) => { const x = bySlug(data, slug); const ph = x && x.photos && (x.photos[i] || x.photos[0]); return ph ? ph.url : cover(sorted(data)[0], true); };
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
<section class="tm-hero"><img src="${esc(photo('winter-trekking', 1))}" alt="A Rock &amp; Anchor leader pointing out the valley on a Sahyadri ridge" fetchpriority="high"><div class="wrap">
  <p class="tm-kicker">Team</p><h1>People make the experience.</h1>
  <p class="tm-sub">These are the people you will walk with, eat with, learn from and trust on the mountain. Some of them know these places better than any map.</p>
  <a class="tm-scroll" href="#people">Meet them ↓</a>
</div></section>

<section class="tm-people" id="people"><div class="wrap">
  <p class="tm-kicker rv">The people</p>
  <h2 class="tm-h rv">There is no single kind of person at Rock &amp; Anchor.</h2>
  ${tabs.length ? `<div class="tm-filter rv" role="tablist" aria-label="Show people"><button type="button" role="tab" class="on" data-filter="all">Everyone</button>${tabs.map(([k, t]) => `<button type="button" role="tab" data-filter="${k}">${t.replace('The people who ', '').replace(/^./, (c) => c.toUpperCase())}</button>`).join('')}</div>
  <div class="tm-kind-desc" aria-live="polite"><p data-kind="all">Local guides, experience leaders, outdoor educators and the people behind the scenes. Here is who you might meet.</p>${tabs.map(([k, t, d]) => { const fs = founders.filter((m) => m.ks.includes(k)); return `<p data-kind="${k}" hidden><b>${t}.</b> ${d}${fs.length ? ` <a href="#founders">${fs.map((m) => esc(first(m.name))).join(' and ')} ${fs.length > 1 ? 'are' : 'is'} here too, with the founders ↓</a>` : ''}</p>`; }).join('')}</div>` : ''}
  <div class="tm-cards">${people.map(profile).join('')}</div>
</div></section>

<section class="tm-know" id="knowledge"><div class="wrap">
  <div class="tm-know-head"><div><p class="tm-kicker rv">Why it matters who your guide is</p><h2 class="tm-h rv">Some knowledge cannot be Googled.</h2>
  <p class="tm-lead rv">Certification tells you someone knows how to manage risk. It does not tell you where the best trail starts after the rain.</p></div>
  <img class="rv" src="${esc(photo('hidden-kingdom', 2))}" alt="A shared meal on leaves after dark" loading="lazy"></div>
  <div class="tm-kinds2">
    <div class="rv"><h3>Learned knowledge</h3><p>What our team trains for.</p><ul>${['Mountaineering', 'First aid', 'Outdoor safety', 'Astronomy', 'Leadership'].map((x) => `<li>${x}</li>`).join('')}</ul></div>
    <div class="rv tm-lived"><h3>Lived knowledge</h3><p>What our team grew up with.</p><ul>${['These mountains', 'These villages', 'The weather', 'Farming', 'Local stories', 'Seasonal changes', 'Places that do not appear on Google Maps'].map((x) => `<li>${x}</li>`).join('')}</ul></div>
  </div>
</div></section>

${founders.length ? `<section class="tm-founders" id="founders"><div class="wrap">
  <p class="tm-kicker rv">The founders</p><h2 class="tm-h rv">Started it. Still learning how to build it.</h2>
  <div class="tm-cards tm-cards-2">${founders.map(profile).join('')}</div>
</div></section>` : ''}

<section class="tm-end" id="meet"><img src="${esc(photo('little-feet-sunset-safari', 1))}" alt="" loading="lazy"><div class="wrap">
  <h2>Who will you meet?</h2>
  <p>The next time you come to the mountains with us, you will probably meet someone who knows the place better than we ever could.</p>
  <p class="tm-say">Say hello. Ask questions. Learn something. And maybe teach them something too.</p>
  <div class="tm-end-cta"><a class="btn btn-clay" href="/experiences">Explore experiences</a><a class="btn btn-ghost" href="#people">Meet the people</a><a class="btn btn-ghost" href="${workWith}">${ICON.wa}Work with us</a></div>
</div></section>
</div>
<script>${TEAM_JS}</script>`;
  return layout({ title: 'Team', desc: 'The people behind Rock & Anchor experiences: local guides, experience leaders, outdoor educators and the people learning to lead.', path: '/team', body, image: photo('winter-trekking', 1), data });
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
.tm-card h3{margin:2px 0 0;font-size:34px;line-height:1}
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
.tm-end h2{font-size:clamp(46px,7.4vw,100px);margin:0 auto .3em;max-width:14ch;text-shadow:0 2px 20px rgba(0,0,0,.35)}
.tm-end p{font-size:clamp(18px,2vw,22px);max-width:48ch;margin:0 auto 14px;color:#f2ede6;text-shadow:0 1px 10px rgba(0,0,0,.5)}
.tm-say{font-weight:700;color:#f3c9a6!important;margin-bottom:32px!important}
.tm-end-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.tm-end .btn-ghost{color:#fff;border-color:rgba(255,255,255,.6)}
@media(max-width:900px){.tm-know-head,.tm-kinds2{grid-template-columns:1fr;gap:20px}}
@media(max-width:600px){.tm-cards{grid-template-columns:1fr}}
`;
