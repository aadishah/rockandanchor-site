// Renders every page from the built-in snapshot and checks each published experience page
// has all required sections and no broken values. Run: node scripts/check.mjs
import fs from 'fs';
globalThis.caches = { default: { match: async () => undefined, put: async () => {} } };
const mod = await import('../dist/worker.js?' + Date.now());
const get = async (p) => mod.default.fetch(new Request('https://rockandanchor.in' + p), {}, { waitUntil() {} });
const snap = JSON.parse(fs.readFileSync(new URL('../src/snapshot.json', import.meta.url)));
let bad = 0;
const BAD = /undefined|NaN|\[object Object\]|null<|>null/;
for (const p of ['/', '/experiences', '/about', '/team', '/impact', '/contact', '/terms', '/privacy', '/cancellation-and-refunds']) {
  const r = await get(p); const h = await r.text();
  if (r.status !== 200 || BAD.test(h)) { bad++; console.log('FAIL', p, r.status, (h.match(BAD) || [])[0]); }
}
const list = await (await get('/experiences')).text();
const cards = list.split('class="card"').length - 1;
const metas = list.split('class="meta3"').length - 1;
console.log('cards', cards, 'meta blocks', metas);
for (const e of snap.experiences) {
  const h = await (await get('/experiences/' + e.slug)).text();
  const need = ['id="about"', 'id="included"', 'id="plan"', 'id="pricing"', 'id="faqs"', 'id="how"'];
  const missing = need.filter((n) => !h.includes(n));
  const fallbacks = (h.match(/<p class="muted">[^<]*<\/p>/g) || []).filter((x) => !/Upcoming dates/.test(x));
  const from = (h.match(/<div class="from">(.*?)<\/div>/) || [])[1];
  const ok = !missing.length && !BAD.test(h);
  if (!ok) bad++;
  console.log(ok ? 'ok  ' : 'FAIL', e.slug.padEnd(30), String(from).replace(/<[^>]+>/g, '').padEnd(28), 'fallbacks:', fallbacks.length, missing.join(','));
}
fs.mkdirSync('out', { recursive: true });
for (const p of ['/', '/experiences', '/experiences/greatest-show-on-earth', '/experiences/young-explorers-winter-school', '/about']) fs.writeFileSync('out/' + (p.replace(/\//g, '_') || 'home') + '.html', await (await get(p)).text());
process.exit(bad ? 1 : 0);
