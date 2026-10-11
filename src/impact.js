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
    projects.some((x) => x.category === 'Education') ? modal('Education', 'What 25% of Net Profit has funded', `<ul class="im-mlist">${projects.filter((x) => x.category === 'Education').map((x) => `<li><b>${esc(x.title)}</b>${x.did ? `<p>${esc(x.did)}</p>` : ''}${draft(x)}</li>`).join('')}</ul><a class="im-link" href="#projects" data-close>See all projects →</a>`) : '',
    modal('Money', 'Where the money goes', `<p>25% of Net Profit funds schools in the mountain villages we work in.</p><a class="im-link" href="#money" data-close>Follow the money →</a>`),
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
.im-money-grid,.im-measure-grid{grid-template-columns:1fr;gap:28px}
}
@media(max-width:600px){.im-nums{grid-template-columns:1fr 1fr}.im-num{padding:16px}}
`;
