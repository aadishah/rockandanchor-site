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

const SNAPSHOT = __SNAPSHOT__;
const LOGO = '__LOGO__';
const FAVICON = '__FAVICON__';

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
  'cancellation-and-refunds': { title: 'Cancellation and Refunds', body: __POLICY_REFUNDS__ },
  terms: { title: 'Terms and Conditions', body: __POLICY_TERMS__ },
  privacy: { title: 'Privacy Policy', body: __POLICY_PRIVACY__ },
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
